const THEME_KEY = 'agroscam-theme';
const AVAILABLE_THEMES = new Set(['campo', 'oceano', 'terra', 'ceu', 'noturno']);

// Aplica em cada página interna o tema que foi salvo em Configurações.
try {
	const savedTheme = localStorage.getItem(THEME_KEY);
	document.documentElement.dataset.theme = AVAILABLE_THEMES.has(savedTheme) ? savedTheme : 'campo';
} catch {
	document.documentElement.dataset.theme = 'campo';
}

// Usa o título declarado na página e acrescenta a marca do aplicativo.
const pageRoot = document.querySelector('[data-page-title]');
if (pageRoot) {
	const title = `${pageRoot.dataset.pageTitle} | AgroScam`;
	document.title = window.agroscamI18n?.translate(title) || title;
}
