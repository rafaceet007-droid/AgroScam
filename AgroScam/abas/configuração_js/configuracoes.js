const CONFIG_THEME_KEY = 'agroscam-theme';
const CONFIG_LANGUAGE_KEY = 'agroscam-language';
const CONFIG_AVAILABLE_THEMES = new Set(['campo', 'oceano', 'terra', 'ceu', 'noturno']);
const CONFIG_AVAILABLE_LANGUAGES = new Set(['pt-BR', 'es', 'en']);
const themeSelect = document.querySelector('[data-theme-select]');
const themeStatus = document.querySelector('[data-theme-status]');
const languageSelect = document.querySelector('[data-language-select]');
const languageStatus = document.querySelector('[data-language-status]');

// Lê a preferência salva e usa Campo quando não houver um valor válido.
const getSavedTheme = () => {
	try {
		const savedTheme = localStorage.getItem(CONFIG_THEME_KEY);
		return CONFIG_AVAILABLE_THEMES.has(savedTheme) ? savedTheme : 'campo';
	} catch {
		return 'campo';
	}
};

// Aplica o tema à página atual e, quando permitido, ao documento principal.
const applyTheme = (theme) => {
	document.documentElement.dataset.theme = theme;
	try {
		window.parent.document.documentElement.dataset.theme = theme;
	} catch {}
};

// Restaura no seletor e na tela a paleta escolhida anteriormente.
const savedTheme = getSavedTheme();
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Persiste a nova opção e anuncia se ela foi salva neste dispositivo.
themeSelect.addEventListener('change', () => {
	const selectedTheme = CONFIG_AVAILABLE_THEMES.has(themeSelect.value) ? themeSelect.value : 'campo';
	applyTheme(selectedTheme);

	try {
		localStorage.setItem(CONFIG_THEME_KEY, selectedTheme);
		themeStatus.textContent = `Tema ${themeSelect.selectedOptions[0].textContent} aplicado.`;
	} catch {
		themeStatus.textContent = 'Tema aplicado apenas até esta página ser fechada.';
	}
});

const getSavedLanguage = () => {
	try {
		const savedLanguage = localStorage.getItem(CONFIG_LANGUAGE_KEY);
		return CONFIG_AVAILABLE_LANGUAGES.has(savedLanguage) ? savedLanguage : 'pt-BR';
	} catch {
		return 'pt-BR';
	}
};

languageSelect.value = getSavedLanguage();

languageSelect.addEventListener('change', () => {
	const selectedLanguage = CONFIG_AVAILABLE_LANGUAGES.has(languageSelect.value)
		? languageSelect.value
		: 'pt-BR';

	try {
		const saved = window.agroscamI18n?.setLanguage(selectedLanguage);
		if (saved === false) throw new Error('Language preference could not be saved.');
		if (!window.agroscamI18n) localStorage.setItem(CONFIG_LANGUAGE_KEY, selectedLanguage);
		languageStatus.textContent = `Preferência de idioma salva: ${languageSelect.selectedOptions[0].textContent}.`;
	} catch {
		languageStatus.textContent = 'Não foi possível salvar a preferência neste dispositivo.';
	}
});
