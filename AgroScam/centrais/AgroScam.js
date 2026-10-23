const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const navigationLinks = document.querySelectorAll('.navigation__link');
const tabFrame = document.querySelector('[data-tab-frame]');
const TAB_PAGES = {
	'#inicio': '../abas/configuração_html/visao_geral.html',
	'#analises': '../abas/configuração_html/analises.html',
	'#relatorios': '../abas/configuração_html/relatorios.html',
	'#configuracoes': '../abas/configuração_html/configuracoes.html',
};
const THEME_KEY = 'agroscam-theme';
const AVAILABLE_THEMES = new Set(['campo', 'oceano', 'terra', 'ceu', 'noturno']);
const registration = document.querySelector('.registration');
const registrationForms = document.querySelectorAll('[data-auth-form]');
const authViewButtons = document.querySelectorAll('[data-auth-view]');
const googleSignInButtons = document.querySelectorAll('[data-google-signin]');
const logoutButton = document.querySelector('[data-logout]');
const passwordToggleButtons = document.querySelectorAll('[data-password-toggle]');
const app = document.querySelector('.app-shell');
const SESSION_KEY = 'agroscam-session-expiration';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const DEMO_STEP_INTERVAL_MS = 1800;
const DEMO_COOLDOWN_MS = 3000;
const DEMO_IDLE_RESUME_MS = 10_000;
let sessionTimer;
const AUTH_GUIDES = {
	register: [
		{ label: 'Informe seu primeiro nome', copy: 'Digite o nome pelo qual você prefere ser chamado.', target: '[name="name"]', demoValue: 'Luiz' },
		{ label: 'Adicione seu e-mail', copy: 'Use um endereço de e-mail que você consiga acessar.', target: '[name="email"]', demoValue: 'luiz@exemplo.com' },
		{ label: 'Crie uma senha', copy: 'Escolha uma senha com pelo menos oito caracteres.', target: '[name="password"]', demoValue: 'Agro@2026' },
		{ label: 'Crie sua conta', copy: 'Confira os campos e selecione Criar conta para continuar.', target: '[type="submit"]' },
	],
	login: [
		{ label: 'Informe seu e-mail', copy: 'Digite o mesmo endereço usado no cadastro.', target: '[name="login-email"]', demoValue: 'luiz@exemplo.com' },
		{ label: 'Digite sua senha', copy: 'Use a senha que você definiu ao criar sua conta.', target: '[name="login-password"]', demoValue: 'Agro@2026' },
		{ label: 'Acesse sua conta', copy: 'Confira os dados e selecione Entrar para continuar.', target: '[type="submit"]' },
	],
};

let activeDemoView = 'register';
let activeDemoStep = 0;
let demoTimer = null;
let demoIdleResumeTimer = null;
const demoTypingTimers = new Set();

const cancelDemoIdleResume = () => {
	if (demoIdleResumeTimer === null) return;

	window.clearTimeout(demoIdleResumeTimer);
	demoIdleResumeTimer = null;
};

const stopAuthDemo = () => {
	cancelDemoIdleResume();
	if (demoTimer !== null) {
		window.clearTimeout(demoTimer);
		demoTimer = null;
	}
	demoTypingTimers.forEach((timer) => window.clearInterval(timer));
	demoTypingTimers.clear();
};

const scheduleDemoIdleResume = (view, stepIndex, target) => {
	cancelDemoIdleResume();
	if (!target.matches('input') || target.value) return;

	demoIdleResumeTimer = window.setTimeout(() => {
		demoIdleResumeTimer = null;
		const form = document.querySelector(`[data-auth-form="${view}"]`);
		const hasUserValues = [...form.querySelectorAll('input')]
			.some((input) => input.value && !input.dataset.demoPreview);
		if (document.activeElement !== target || target.value || hasUserValues) return;

		startAuthDemo(view, stepIndex);
	}, DEMO_IDLE_RESUME_MS);
};

const clearDemoValues = (formToClear) => {
	let clearedValues = false;
	const formsToClear = formToClear ? [formToClear] : registrationForms;
	formsToClear.forEach((form) => {
		form.querySelectorAll('[data-demo-preview]').forEach((input) => {
			input.value = '';
			delete input.dataset.demoPreview;
			clearedValues = true;
		});
	});
	return clearedValues;
};

const typeDemoValue = (view, stepIndex) => {
	const step = AUTH_GUIDES[view][stepIndex];
	if (!step.demoValue) return;

	const input = document.querySelector(`[data-auth-form="${view}"] ${step.target}`);
	if (!input || input.value) return;
	input.value = '';
	input.dataset.demoPreview = 'true';
	const characters = [...step.demoValue];
	let characterIndex = 0;
	const typingTimer = window.setInterval(() => {
		if (!input.dataset.demoPreview) {
			window.clearInterval(typingTimer);
			demoTypingTimers.delete(typingTimer);
			return;
		}

		characterIndex += 1;
		input.value = characters.slice(0, characterIndex).join('');
		if (characterIndex >= characters.length) {
			window.clearInterval(typingTimer);
			demoTypingTimers.delete(typingTimer);
		}
	}, 65);
	demoTypingTimers.add(typingTimer);
};

const scheduleNextDemoStep = (view) => {
	const guide = AUTH_GUIDES[view];
	demoTimer = window.setTimeout(() => {
		if (activeDemoView !== view) return;

		if (activeDemoStep >= guide.length - 1) {
			demoTimer = window.setTimeout(() => {
				const form = document.querySelector(`[data-auth-form="${view}"]`);
				const hasUserValues = [...form.querySelectorAll('input')]
					.some((input) => input.value && !input.dataset.demoPreview);
				if (hasUserValues) {
					stopAuthDemo();
					return;
				}

				clearDemoValues(form);
				updateAuthDemoStep(view, 0);
				typeDemoValue(view, 0);
				scheduleNextDemoStep(view);
			}, DEMO_COOLDOWN_MS);
			return;
		}

		const nextStep = activeDemoStep + 1;
		updateAuthDemoStep(view, nextStep);
		typeDemoValue(view, nextStep);
		scheduleNextDemoStep(view);
	}, DEMO_STEP_INTERVAL_MS);
};

const updateAuthDemoStep = (view, stepIndex) => {
	const guide = AUTH_GUIDES[view];
	const activeStep = Math.max(0, Math.min(stepIndex, guide.length - 1));
	const step = guide[activeStep];
	const form = document.querySelector(`[data-auth-form="${view}"]`);
	activeDemoView = view;
	activeDemoStep = activeStep;
	registrationForms.forEach((activeForm) => {
		activeForm.querySelectorAll('.is-guide-active').forEach((control) => {
			control.classList.remove('is-guide-active');
		});
	});
	const target = form.querySelector(step.target);
	if (!target) return;
	const highlightedControl = target.matches('input')
		? target.closest('.registration__field')
		: target;
	highlightedControl.classList.add('is-guide-active');
};

const startAuthDemo = (view, startStep = 0) => {
	stopAuthDemo();
	clearDemoValues();
	const guide = AUTH_GUIDES[view];
	const form = document.querySelector(`[data-auth-form="${view}"]`);
	const hasUserValues = [...form.querySelectorAll('input')].some((input) => input.value);
	const initialStep = Math.max(0, Math.min(startStep, guide.length - 1));
	updateAuthDemoStep(view, initialStep);
	if (hasUserValues) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		guide.forEach((step) => {
			if (!step.demoValue) return;
			const input = document.querySelector(`[data-auth-form="${view}"] ${step.target}`);
			if (!input || input.value) return;
			input.value = step.demoValue;
			input.dataset.demoPreview = 'true';
		});
		return;
	}
	typeDemoValue(view, initialStep);
	scheduleNextDemoStep(view);
};

registrationForms.forEach((form) => {
	const view = form.dataset.authForm;
	const guide = AUTH_GUIDES[view];
	const syncDemoWithForm = (event) => {
		if (event.type === 'input') cancelDemoIdleResume();
		const focusedStep = guide.findIndex((step) => form.querySelector(step.target) === event.target);
		if (focusedStep < 0) return;
		const hasDemoValues = Boolean(form.querySelector('[data-demo-preview]'));

		if (demoTimer !== null || activeDemoView !== view || activeDemoStep !== focusedStep || hasDemoValues) {
			stopAuthDemo();
			clearDemoValues();
			updateAuthDemoStep(view, focusedStep);
		}
		if (event.type !== 'input') scheduleDemoIdleResume(view, focusedStep, event.target);
	};
	form.addEventListener('focusin', syncDemoWithForm);
	form.addEventListener('pointerdown', syncDemoWithForm);
	form.addEventListener('input', syncDemoWithForm);
});

// Restaura o tema salvo no shell principal e acompanha mudanças feitas nas abas.
const applyTheme = (theme) => {
	document.documentElement.dataset.theme = AVAILABLE_THEMES.has(theme) ? theme : 'campo';
};

try {
	applyTheme(localStorage.getItem(THEME_KEY));
} catch {
	applyTheme('campo');
}

window.addEventListener('storage', (event) => {
	if (event.key === THEME_KEY) applyTheme(event.newValue);
});

// Sorteia a velocidade do fundo e altera o ciclo novamente a cada minuto.
const randomizeOverviewAtmosphereSpeed = () => {
	const durationInSeconds = 22 + Math.random() * 26;
	app.style.setProperty('--overview-atmosphere-duration', `${durationInSeconds.toFixed(1)}s`);
};

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	randomizeOverviewAtmosphereSpeed();
	window.setInterval(randomizeOverviewAtmosphereSpeed, 60_000);
}

// Marca o destino atual na navegação e atualiza a semântica para leitores de tela.
const setActiveLink = (activeLink) => {
	navigationLinks.forEach((link) => {
		const isActive = link === activeLink;

		link.classList.toggle('navigation__link--active', isActive);
		if (isActive) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
};

// Registra a atualização imediata do destaque ao clicar em uma aba.
navigationLinks.forEach((link) => {
	link.addEventListener('click', () => setActiveLink(link));
});

// Sincroniza o hash da URL, o título e o conteúdo exibido no iframe.
const updateActiveLinkFromHash = () => {
	const currentHash = window.location.hash || '#inicio';
	const currentLink = [...navigationLinks].find(
		(link) => link.getAttribute('href') === currentHash
	) || navigationLinks[0];
	const pageUrl = TAB_PAGES[currentLink.getAttribute('href')] || TAB_PAGES['#inicio'];
	app.classList.toggle('app-shell--overview', currentLink.getAttribute('href') === '#inicio');

	if (tabFrame.getAttribute('src') !== pageUrl) {
		tabFrame.src = pageUrl;
	}
	tabFrame.title = currentLink.title || currentLink.textContent.trim();

	setActiveLink(currentLink);
};

// Sincroniza a interface ao carregar e sempre que a rota da URL mudar.
updateActiveLinkFromHash();
window.addEventListener('hashchange', updateActiveLinkFromHash);

// Esconde a autenticação, mostra o aplicativo e abre sua página inicial.
const showApp = () => {
	stopAuthDemo();
	clearDemoValues();
	registration.hidden = true;
	app.hidden = false;
	history.replaceState(null, '', '#inicio');
	updateActiveLinkFromHash();
};

// Cancela a sessão, limpa os formulários e volta para o cadastro.
const endSession = () => {
	clearTimeout(sessionTimer);
	try {
		localStorage.removeItem(SESSION_KEY);
	} catch {}
	app.hidden = true;
	registration.hidden = false;
	registrationForms.forEach((form) => {
		form.reset();
		form.hidden = form.dataset.authForm !== 'register';
	});
	history.replaceState(null, '', '#cadastro');
	startAuthDemo('register');
};

// Restaura uma sessão válida ou mantém a tela de autenticação visível.
const restoreSession = () => {
	try {
		const expiresAt = Number(localStorage.getItem(SESSION_KEY));
		if (expiresAt > Date.now()) {
			showApp();
			sessionTimer = setTimeout(endSession, expiresAt - Date.now());
			return;
		}
		localStorage.removeItem(SESSION_KEY);
	} catch {}
	app.hidden = true;
	registration.hidden = false;
};

// Salva o vencimento da sessão, agenda o encerramento e abre o aplicativo.
const startSession = () => {
	try {
		localStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_DURATION_MS));
	} catch {}
	clearTimeout(sessionTimer);
	sessionTimer = setTimeout(endSession, SESSION_DURATION_MS);
	showApp();
};

// Escolhe a tela inicial de acordo com a sessão armazenada.
restoreSession();
if (!registration.hidden) startAuthDemo('register');

passwordToggleButtons.forEach((button) => {
	const passwordField = button.closest('.registration__password')?.querySelector('input');
	if (!passwordField) return;

	const syncPasswordToggle = () => {
		const isVisible = passwordField.type === 'text';
		button.dataset.visible = String(isVisible);
		button.setAttribute('aria-label', isVisible ? 'Ocultar senha' : 'Mostrar senha');
		button.setAttribute('aria-pressed', String(isVisible));
	};

	button.addEventListener('click', () => {
		passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
		syncPasswordToggle();
		passwordField.focus();
		const end = passwordField.value.length;
		passwordField.setSelectionRange(end, end);
	});

	syncPasswordToggle();
});

// Trata os formulários localmente, sem recarregar ou enviar dados ao navegador.
registrationForms.forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (clearDemoValues(form)) {
			stopAuthDemo();
			form.querySelector('input[required]')?.focus();
			return;
		}
		startSession();
	});
});

// Permite encerrar a sessão pelo botão da navegação lateral.
logoutButton.addEventListener('click', endSession);

// Alterna entre as telas de cadastro e entrada.
authViewButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const selectedView = button.dataset.authView;

		registrationForms.forEach((form) => {
			form.hidden = form.dataset.authForm !== selectedView;
		});
		startAuthDemo(selectedView);
	});
});

// Informa que o acesso Google ainda depende de configuração externa.
googleSignInButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const message = button.closest('form').querySelector('[data-google-message]');

		message.textContent = 'O acesso com Google precisa de configuração OAuth e de um serviço de autenticação.';
		message.hidden = false;
	});
});

// Recolhe ou expande a navegação e atualiza os atributos acessíveis do controle.
sidebarToggle.addEventListener('click', () => {
	const isCollapsed = sidebar.classList.toggle('is-collapsed');

	sidebarToggle.setAttribute('aria-expanded', String(!isCollapsed));
	sidebarToggle.setAttribute(
		'aria-label',
		isCollapsed ? 'Mostrar barra lateral' : 'Esconder barra lateral'
	);
});
