(() => {
	const LANGUAGE_KEY = 'agroscam-language';
	const LANGUAGES = new Set(['pt-BR', 'es', 'en']);
	const translations = {
		en: {
			'Português': 'Portuguese', 'Espanhol': 'Spanish', 'Inglês': 'English',
			'Acesso à plataforma': 'Platform access', 'Crie sua conta': 'Create your account',
			'Cadastre-se para acompanhar dados e análises do agronegócio.': 'Sign up to follow agribusiness data and analyses.',
			'Primeiro nome': 'First name', 'E-mail': 'Email', 'Senha': 'Password',
			'Mínimo de 8 caracteres': 'At least 8 characters', 'Criar conta': 'Create account',
			'ou': 'or', 'Continuar com Google': 'Continue with Google',
			'Já tem uma conta?': 'Already have an account?', 'Entrar': 'Sign in',
			'Entre na sua conta': 'Sign in to your account',
			'Acesse suas análises e relatórios do agronegócio.': 'Access your agribusiness analyses and reports.',
			'Ainda não tem uma conta?': "Don't have an account yet?",
			'Mostrar senha': 'Show password', 'Ocultar senha': 'Hide password',
			'Navegação principal': 'Main navigation', 'Visão geral': 'Overview',
			'Análises': 'Analyses', 'Relatórios': 'Reports', 'Configurações': 'Settings',
			'Configurações | AgroScam': 'Settings | AgroScam', 'Sair': 'Sign out',
			'Sair da conta': 'Sign out', 'Esconder barra lateral': 'Hide sidebar',
			'Mostrar barra lateral': 'Show sidebar', 'AgroScam - início': 'AgroScam - home',
			'Logo AgroScam': 'AgroScam logo',
			'Personalize a interface': 'Customize the interface', 'Aparência': 'Appearance',
			'Temas': 'Themes', 'Paleta de cores do site': 'Site color palette',
			'Campo': 'Field', 'Céu': 'Sky', 'Oceano': 'Ocean', 'Terra': 'Earth',
			'Noturno': 'Night', 'Preferências': 'Preferences', 'Idioma': 'Language',
			'A interface será exibida neste idioma.': 'The interface will be displayed in this language.',
			'Idioma preferido': 'Preferred language',
			'Monitoramento': 'Monitoring', 'Análises por lavoura': 'Field analyses',
			'Cadastre as lavouras e acompanhe a análise de cada uma em um só painel.':
				'Register fields and track each analysis in one dashboard.',
			'Indicadores de análise': 'Analysis indicators', 'Lavouras': 'Fields',
			'em monitoramento': 'being monitored', 'Área total': 'Total area',
			'somada': 'combined', 'Saúde média': 'Average health', 'padrão geral': 'overall average',
			'Lista de lavouras': 'Field list', 'Análises cadastradas': 'Saved analyses',
			'Nova': 'New', 'Nova lavoura': 'New field', 'Fechar': 'Close',
			'Nome da lavoura': 'Field name', 'Cultura': 'Crop', 'Tipo': 'Type',
			'Área (ha)': 'Area (ha)', 'Saúde (%)': 'Health (%)', 'Análise': 'Analysis',
			'Selecione uma cultura': 'Select a crop', 'Cadastre uma cultura primeiro':
				'Register a crop first',
			'Exemplo: 1000 plantas, 240 com perdas: (1000 − 240) ÷ 1000 × 100 = 76% de saúde.':
				'Example: 1,000 plants, 240 lost: (1,000 − 240) ÷ 1,000 × 100 = 76% health.',
			'campo para a IA colocar a análise.': 'The AI analysis will appear here.',
			'Salvar lavoura': 'Save field', 'Cancelar': 'Cancel',
			'Não há lavouras registradas. Cadastre a primeira análise para começar.':
				'No fields registered. Add the first analysis to get started.',
			'Catálogo': 'Catalog', 'Cadastro de culturas': 'Crop catalog',
			'Nova cultura': 'New crop', 'Nome da cultura': 'Crop name', 'Ciclo (dias)': 'Cycle (days)',
			'Época plantio': 'Planting season', 'Observações': 'Notes',
			'Informações sobre manejo, clima ideal ou riscos específicos.':
				'Information about management, ideal climate, or specific risks.',
			'Salvar cultura': 'Save crop',
			'Editar': 'Edit', 'Atualizar lavoura': 'Update field', 'Atualizar cultura': 'Update crop',
			'Já existe uma cultura com esse nome.': 'A crop with this name already exists.',
			'Cultura atualizada com sucesso.': 'Crop updated successfully.',
			'Lavoura atualizada com sucesso.': 'Field updated successfully.',
			'Preencha os campos obrigatórios com valores válidos.':
				'Fill in the required fields with valid values.',
			'Não foi possível salvar as alterações neste dispositivo.':
				'Could not save the changes on this device.',
			'Nenhuma cultura cadastrada para editar.': 'No registered crop to edit.',
			'Não é possível excluir uma cultura associada a lavouras.':
				'Cannot delete a crop linked to fields.',
			'Não há culturas cadastradas. Adicione a primeira cultura ao catálogo.':
				'No crops registered. Add the first crop to the catalog.',
			'Sem observações adicionais.': 'No additional notes.',
			'Cultura removida': 'Crop removed',
			'Data indisponível': 'Date unavailable', 'Excluir': 'Delete',
			'Visão geral | AgroScam': 'Overview | AgroScam',
			'Relatórios | AgroScam': 'Reports | AgroScam',
			'Análises | AgroScam': 'Analyses | AgroScam',
			'Área para imagens': 'Image area', 'Escolher imagens': 'Choose images',
			'ou arraste e solte aqui · PNG, JPG ou WEBP': 'or drag and drop here · PNG, JPG, or WEBP',
			'Abrir área de imagens': 'Open image area', 'Fechar área de imagens': 'Close image area',
			'Sua pergunta': 'Your question', 'O que você gostaria de analisar?': 'What would you like to analyze?',
			'Iniciar ditado': 'Start dictation', 'Parar ditado': 'Stop dictation',
			'Ditado por voz': 'Voice dictation', 'Perguntar': 'Ask',
			'O ditado por voz não está disponível neste navegador. Tente usar o Chrome ou o Edge.':
				'Voice dictation is not available in this browser. Try Chrome or Edge.',
			'Ouvindo... Fale sua pergunta.': 'Listening... Speak your question.',
			'Fala convertida. Continuando a ouvir...': 'Speech converted. Continuing to listen...',
			'Permita o acesso ao microfone nas configurações do navegador para usar o ditado.':
				'Allow microphone access in your browser settings to use dictation.',
			'Nenhuma fala foi detectada. Tente novamente.': 'No speech was detected. Try again.',
			'Não foi possível reconhecer a fala. Verifique o microfone e tente novamente.':
				'Speech could not be recognized. Check the microphone and try again.',
			'Ditado encerrado após 10 segundos sem fala.': 'Dictation stopped after 10 seconds of silence.',
			'Ditado encerrado.': 'Dictation stopped.',
			'Não foi possível iniciar o ditado. Tente novamente.': 'Could not start dictation. Try again.',
			'O acesso com Google precisa de configuração OAuth e de um serviço de autenticação.':
				'Google sign-in requires OAuth configuration and an authentication service.',
			'Digite uma pergunta antes de salvar.': 'Enter a question before saving.',
			'Não foi possível salvar a conversa neste dispositivo.':
				'Could not save the conversation on this device.',
			'Pergunta salva em Análises. As respostas automáticas ainda não estão conectadas.':
				'Question saved in Analyses. Automatic answers are not connected yet.',
			'Remover': 'Remove', 'Nenhuma lavoura cadastrada ainda.': 'No fields registered yet.',
			'Não foi possível salvar a lavoura neste dispositivo.':
				'Could not save the field on this device.',
			'Preencha nome, tipo, ciclo e época ideal válidos.':
				'Enter a valid name, type, cycle, and planting season.',
			'Cultura adicionada com sucesso.': 'Crop added successfully.',
			'Cultura removida.': 'Crop removed.',
			'Preencha nome, cultura, área e saúde válidos.':
				'Enter a valid name, crop, area, and health value.',
			'Lavoura adicionada com sucesso.': 'Field added successfully.',
			'Lavoura removida.': 'Field removed.',
			'Conversa excluída.': 'Conversation deleted.',
			'Não foi possível excluir a conversa neste dispositivo.':
				'Could not delete the conversation on this device.',
			'Não foi possível salvar a cultura neste dispositivo.':
				'Could not save the crop on this device.',
			'Conversa salva neste dispositivo': 'Conversation saved on this device',
			'conversas salvas neste dispositivo': 'conversations saved on this device',
			'1 conversa salva neste dispositivo': '1 conversation saved on this device',
			'Nenhuma conversa salva ainda.': 'No conversations saved yet.',
			'Excluir lavoura: ': 'Delete field: ', 'Excluir cultura: ': 'Delete crop: ',
			'Excluir conversa: ': 'Delete conversation: ',
			' está com melhor saúde: ': ' has the best health: ',
			'A maior área registrada é ': 'The largest registered area is ',
			', com ': ', with ', 'Há ': 'There are ', ' lavoura(s) monitoradas.': ' field(s) monitored.',
			' dias': ' days', ' ha': ' ha',
			'Tema ': 'Theme ', ' aplicado.': ' applied.',
			'Tema aplicado apenas até esta página ser fechada.':
				'Theme applied until this page is closed.',
			'Preferência de idioma salva: ': 'Language preference saved: ',
			'Não foi possível salvar a preferência neste dispositivo.':
				'Could not save the preference on this device.',
			'Grão': 'Grain', 'Safra 2026/2027': '2026/2027 season',
			'Verão': 'Summer',
			'A lavoura apresenta boa cobertura vegetal, porém há sinais de estresse em trechos com maior compactação do solo.':
				'The field has good vegetation cover, but shows signs of stress in areas with greater soil compaction.',
			'Cultura adequada para clima tropical com atenção à irrigação e ao controle de pragas.':
				'A crop suited to tropical climates, with attention to irrigation and pest control.',
		},
		'es': {
			'Português': 'Portugués', 'Espanhol': 'Español', 'Inglês': 'Inglés',
			'Acesso à plataforma': 'Acceso a la plataforma', 'Crie sua conta': 'Crea tu cuenta',
			'Cadastre-se para acompanhar dados e análises do agronegócio.':
				'Regístrate para seguir datos y análisis del sector agropecuario.',
			'Primeiro nome': 'Nombre', 'E-mail': 'Correo electrónico', 'Senha': 'Contraseña',
			'Mínimo de 8 caracteres': 'Mínimo de 8 caracteres', 'Criar conta': 'Crear cuenta',
			'ou': 'o', 'Continuar com Google': 'Continuar con Google',
			'Já tem uma conta?': '¿Ya tienes una cuenta?', 'Entrar': 'Iniciar sesión',
			'Entre na sua conta': 'Inicia sesión en tu cuenta',
			'Acesse suas análises e relatórios do agronegócio.':
				'Accede a tus análisis e informes agropecuarios.',
			'Ainda não tem uma conta?': '¿Aún no tienes una cuenta?',
			'Mostrar senha': 'Mostrar contraseña', 'Ocultar senha': 'Ocultar contraseña',
			'Navegação principal': 'Navegación principal', 'Visão geral': 'Resumen',
			'Análises': 'Análisis', 'Relatórios': 'Informes', 'Configurações': 'Configuración',
			'Configurações | AgroScam': 'Configuración | AgroScam', 'Sair': 'Salir',
			'Sair da conta': 'Cerrar sesión', 'Esconder barra lateral': 'Ocultar barra lateral',
			'Mostrar barra lateral': 'Mostrar barra lateral', 'AgroScam - início': 'AgroScam - inicio',
			'Logo AgroScam': 'Logotipo de AgroScam',
			'Personalize a interface': 'Personaliza la interfaz', 'Aparência': 'Apariencia',
			'Temas': 'Temas', 'Paleta de cores do site': 'Paleta de colores del sitio',
			'Campo': 'Campo', 'Céu': 'Cielo', 'Oceano': 'Océano', 'Terra': 'Tierra',
			'Noturno': 'Nocturno', 'Preferências': 'Preferencias', 'Idioma': 'Idioma',
			'A interface será exibida neste idioma.': 'La interfaz se mostrará en este idioma.',
			'Idioma preferido': 'Idioma preferido',
			'Monitoramento': 'Monitoreo', 'Análises por lavoura': 'Análisis por parcela',
			'Cadastre as lavouras e acompanhe a análise de cada uma em um só painel.':
				'Registra las parcelas y consulta sus análisis en un solo panel.',
			'Indicadores de análise': 'Indicadores de análisis', 'Lavouras': 'Parcelas',
			'em monitoramento': 'en seguimiento', 'Área total': 'Área total',
			'somada': 'acumulada', 'Saúde média': 'Salud promedio', 'padrão geral': 'promedio general',
			'Lista de lavouras': 'Lista de parcelas', 'Análises cadastradas': 'Análisis registrados',
			'Nova': 'Nuevo', 'Nova lavoura': 'Nueva parcela', 'Fechar': 'Cerrar',
			'Nome da lavoura': 'Nombre de la parcela', 'Cultura': 'Cultivo', 'Tipo': 'Tipo',
			'Área (ha)': 'Área (ha)', 'Saúde (%)': 'Salud (%)', 'Análise': 'Análisis',
			'Selecione uma cultura': 'Selecciona un cultivo', 'Cadastre uma cultura primeiro':
				'Registra primero un cultivo',
			'Exemplo: 1000 plantas, 240 com perdas: (1000 − 240) ÷ 1000 × 100 = 76% de saúde.':
				'Ejemplo: 1000 plantas, 240 perdidas: (1000 − 240) ÷ 1000 × 100 = 76% de salud.',
			'campo para a IA colocar a análise.': 'El análisis de IA aparecerá aquí.',
			'Salvar lavoura': 'Guardar parcela', 'Cancelar': 'Cancelar',
			'Não há lavouras registradas. Cadastre a primeira análise para começar.':
				'No hay parcelas registradas. Añade el primer análisis para comenzar.',
			'Catálogo': 'Catálogo', 'Cadastro de culturas': 'Registro de cultivos',
			'Nova cultura': 'Nuevo cultivo', 'Nome da cultura': 'Nombre del cultivo', 'Ciclo (dias)': 'Ciclo (días)',
			'Época plantio': 'Época de siembra', 'Observações': 'Observaciones',
			'Informações sobre manejo, clima ideal ou riscos específicos.':
				'Información sobre manejo, clima ideal o riesgos específicos.',
			'Salvar cultura': 'Guardar cultivo',
			'Editar': 'Editar', 'Atualizar lavoura': 'Actualizar parcela', 'Atualizar cultura': 'Actualizar cultivo',
			'Já existe uma cultura com esse nome.': 'Ya existe un cultivo con ese nombre.',
			'Cultura atualizada com sucesso.': 'Cultivo actualizado correctamente.',
			'Lavoura atualizada com sucesso.': 'Parcela actualizada correctamente.',
			'Preencha os campos obrigatórios com valores válidos.':
				'Completa los campos obligatorios con valores válidos.',
			'Não foi possível salvar as alterações neste dispositivo.':
				'No se pudieron guardar los cambios en este dispositivo.',
			'Nenhuma cultura cadastrada para editar.': 'No hay cultivos registrados para editar.',
			'Não é possível excluir uma cultura associada a lavouras.':
				'No se puede eliminar un cultivo asociado a parcelas.',
			'Não há culturas cadastradas. Adicione a primeira cultura ao catálogo.':
				'No hay cultivos registrados. Añade el primero al catálogo.',
			'Sem observações adicionais.': 'Sin observaciones adicionales.',
			'Cultura removida': 'Cultivo eliminado',
			'Data indisponível': 'Fecha no disponible', 'Excluir': 'Eliminar',
			'Visão geral | AgroScam': 'Resumen | AgroScam',
			'Relatórios | AgroScam': 'Informes | AgroScam',
			'Análises | AgroScam': 'Análisis | AgroScam',
			'Área para imagens': 'Área de imágenes', 'Escolher imagens': 'Elegir imágenes',
			'ou arraste e solte aqui · PNG, JPG ou WEBP': 'o arrastra y suelta aquí · PNG, JPG o WEBP',
			'Abrir área de imagens': 'Abrir área de imágenes', 'Fechar área de imagens': 'Cerrar área de imágenes',
			'Sua pergunta': 'Tu pregunta', 'O que você gostaria de analisar?': '¿Qué te gustaría analizar?',
			'Iniciar ditado': 'Iniciar dictado', 'Parar ditado': 'Detener dictado',
			'Ditado por voz': 'Dictado por voz', 'Perguntar': 'Preguntar',
			'O ditado por voz não está disponível neste navegador. Tente usar o Chrome ou o Edge.':
				'El dictado por voz no está disponible en este navegador. Prueba Chrome o Edge.',
			'Ouvindo... Fale sua pergunta.': 'Escuchando... Di tu pregunta.',
			'Fala convertida. Continuando a ouvir...': 'Voz convertida. Continúa escuchando...',
			'Permita o acesso ao microfone nas configurações do navegador para usar o ditado.':
				'Permite el acceso al micrófono en la configuración del navegador para usar el dictado.',
			'Nenhuma fala foi detectada. Tente novamente.': 'No se detectó voz. Inténtalo de nuevo.',
			'Não foi possível reconhecer a fala. Verifique o microfone e tente novamente.':
				'No se pudo reconocer la voz. Comprueba el micrófono e inténtalo de nuevo.',
			'Ditado encerrado após 10 segundos sem fala.': 'Dictado detenido tras 10 segundos sin voz.',
			'Ditado encerrado.': 'Dictado detenido.',
			'Não foi possível iniciar o ditado. Tente novamente.': 'No se pudo iniciar el dictado. Inténtalo de nuevo.',
			'O acesso com Google precisa de configuração OAuth e de um serviço de autenticação.':
				'El acceso con Google requiere configurar OAuth y un servicio de autenticación.',
			'Digite uma pergunta antes de salvar.': 'Escribe una pregunta antes de guardarla.',
			'Não foi possível salvar a conversa neste dispositivo.':
				'No se pudo guardar la conversación en este dispositivo.',
			'Pergunta salva em Análises. As respostas automáticas ainda não estão conectadas.':
				'Pregunta guardada en Análisis. Las respuestas automáticas aún no están conectadas.',
			'Remover': 'Quitar', 'Nenhuma lavoura cadastrada ainda.': 'Aún no hay parcelas registradas.',
			'Não foi possível salvar a lavoura neste dispositivo.':
				'No se pudo guardar la parcela en este dispositivo.',
			'Preencha nome, tipo, ciclo e época ideal válidos.':
				'Introduce un nombre, tipo, ciclo y época de siembra válidos.',
			'Cultura adicionada com sucesso.': 'Cultivo añadido correctamente.',
			'Cultura removida.': 'Cultivo eliminado.',
			'Preencha nome, cultura, área e saúde válidos.':
				'Introduce un nombre, cultivo, área y valor de salud válidos.',
			'Lavoura adicionada com sucesso.': 'Parcela añadida correctamente.',
			'Lavoura removida.': 'Parcela eliminada.',
			'Conversa excluída.': 'Conversación eliminada.',
			'Não foi possível excluir a conversa neste dispositivo.':
				'No se pudo eliminar la conversación en este dispositivo.',
			'Não foi possível salvar a cultura neste dispositivo.':
				'No se pudo guardar el cultivo en este dispositivo.',
			'Conversa salva neste dispositivo': 'Conversación guardada en este dispositivo',
			'conversas salvas neste dispositivo': 'conversaciones guardadas en este dispositivo',
			'1 conversa salva neste dispositivo': '1 conversación guardada en este dispositivo',
			'Nenhuma conversa salva ainda.': 'Aún no hay conversaciones guardadas.',
			'Excluir lavoura: ': 'Eliminar parcela: ', 'Excluir cultura: ': 'Eliminar cultivo: ',
			'Excluir conversa: ': 'Eliminar conversación: ',
			' está com melhor saúde: ': ' tiene la mejor salud: ',
			'A maior área registrada é ': 'La mayor superficie registrada es ',
			', com ': ', con ', 'Há ': 'Hay ', ' lavoura(s) monitoradas.': ' parcela(s) en seguimiento.',
			' dias': ' días', ' ha': ' ha',
			'Tema ': 'Tema ', ' aplicado.': ' aplicado.',
			'Tema aplicado apenas até esta página ser fechada.':
				'El tema solo se aplica hasta que se cierre esta página.',
			'Preferência de idioma salva: ': 'Preferencia de idioma guardada: ',
			'Não foi possível salvar a preferência neste dispositivo.':
				'No se pudo guardar la preferencia en este dispositivo.',
			'Grão': 'Grano', 'Safra 2026/2027': 'Campaña 2026/2027',
			'Verão': 'Verano',
			'A lavoura apresenta boa cobertura vegetal, porém há sinais de estresse em trechos com maior compactação do solo.':
				'La parcela presenta buena cobertura vegetal, pero muestra señales de estrés en zonas con mayor compactación del suelo.',
			'Cultura adequada para clima tropical com atenção à irrigação e ao controle de pragas.':
				'Cultivo adecuado para climas tropicales, con atención al riego y al control de plagas.',
		},
	};

	const getLanguage = () => {
		try {
			const language = localStorage.getItem(LANGUAGE_KEY);
			return LANGUAGES.has(language) ? language : 'pt-BR';
		} catch {
			return 'pt-BR';
		}
	};

	const setLanguage = (language) => {
		const selectedLanguage = LANGUAGES.has(language) ? language : 'pt-BR';
		try {
			localStorage.setItem(LANGUAGE_KEY, selectedLanguage);
		} catch {
			return false;
		}
		applyLanguage(selectedLanguage);
		if (window.parent !== window) {
			window.parent.postMessage({ type: 'agroscam-language', language: selectedLanguage }, '*');
		}
		return true;
	};

	const sourceText = (value) => {
		for (const source of Object.keys(translations.en)) {
			if (value === source
				|| value === translations.en[source]
				|| value === translations.es[source]) return source;
		}
		const dynamicSources = [
			[/^Theme (.+) applied\.$/, (_, theme) => {
				const sourceTheme = Object.entries(translations.en).find(([, translation]) => translation === theme)?.[0] || theme;
				return `Tema ${sourceTheme} aplicado.`;
			}],
			[/^Remove (.+)$/, (_, name) => `Remover ${name}`],
			[/^Eliminar (.+)$/, (_, name) => `Remover ${name}`],
			[/^Delete field: (.+)$/, (_, name) => `Excluir lavoura: ${name}`],
			[/^Eliminar parcela: (.+)$/, (_, name) => `Excluir lavoura: ${name}`],
			[/^Delete crop: (.+)$/, (_, name) => `Excluir cultura: ${name}`],
			[/^Eliminar cultivo: (.+)$/, (_, name) => `Excluir cultura: ${name}`],
			[/^Delete conversation: (.+)$/, (_, question) => `Excluir conversa: ${question}`],
			[/^Eliminar conversación: (.+)$/, (_, question) => `Excluir conversa: ${question}`],
			[/^Remover (.+)$/, { en: 'Remove $1', es: 'Eliminar $1' }],
			[/^Language preference saved: (.+)\.$/, (_, language) => `Preferência de idioma salva: ${language}.`],
			[/^Preferencia de idioma guardada: (.+)\.$/, (_, language) => `Preferência de idioma salva: ${language}.`],
			[/^(\d+) conversation\(s\) saved on this device$/, (_, count) => `${count} conversas salvas neste dispositivo`],
			[/^(\d+) conversación\(es\) guardada\(s\) en este dispositivo$/, (_, count) => `${count} conversas salvas neste dispositivo`],
			[/^has the best health: (.+)\.$/, (_, score) => `está com melhor saúde: ${score}.`],
			[/^tiene la mejor salud: (.+)\.$/, (_, score) => `está com melhor saúde: ${score}.`],
			[/^The largest registered area is$/, () => 'A maior área registrada é'],
			[/^La mayor superficie registrada es$/, () => 'A maior área registrada é'],
			[/^There are$/, () => 'Há'],
			[/^Hay$/, () => 'Há'],
			[/^field\(s\) monitored\.$/, () => 'lavoura(s) monitoradas.'],
			[/^parcela\(s\) en seguimiento\.$/, () => 'lavoura(s) monitoradas.'],
			[/^(.+) has the best health: (.+)\.$/, (_, name, score) => `${name} está com melhor saúde: ${score}.`],
			[/^(.+) tiene la mejor salud: (.+)\.$/, (_, name, score) => `${name} está com melhor saúde: ${score}.`],
			[/^The largest registered area is (.+)$/, (_, name) => `A maior área registrada é ${name}`],
			[/^La mayor superficie registrada es (.+)$/, (_, name) => `A maior área registrada é ${name}`],
			[/^, with (.+)\.$/, (_, area) => `, com ${area}.`],
			[/^, con (.+)\.$/, (_, area) => `, com ${area}.`],
			[/^(\d+) days$/, (_, days) => `${days} dias`],
			[/^(\d+) días$/, (_, days) => `${days} dias`],
		];
		for (const [pattern, toSource] of dynamicSources) {
			const match = value.match(pattern);
			if (match) return toSource(...match);
		}
		return value;
	};

	const translate = (value, language = getLanguage()) => {
		const source = sourceText(String(value));
		if (language === 'pt-BR') return source;
		const translated = translations[language]?.[source];
		if (translated) return translated;

		const savedConversationCount = source.match(/^(\d+) conversas? salvas neste dispositivo$/);
		if (savedConversationCount) {
			const count = Number(savedConversationCount[1]);
			if (language === 'en') {
				return `${count} ${count === 1 ? 'conversation' : 'conversations'} saved on this device`;
			}
			return `${count} ${count === 1 ? 'conversación guardada' : 'conversaciones guardadas'} en este dispositivo`;
		}

		const dynamicPatterns = [
			[/^Excluir lavoura: (.+)$/, { en: 'Delete field: $1', es: 'Eliminar parcela: $1' }],
			[/^Excluir cultura: (.+)$/, { en: 'Delete crop: $1', es: 'Eliminar cultivo: $1' }],
			[/^Excluir conversa: (.+)$/, { en: 'Delete conversation: $1', es: 'Eliminar conversación: $1' }],
			[/^(?:Tema|Theme) (.+) aplicado\.$/, { en: 'Theme $1 applied.', es: 'Tema $1 aplicado.' }],
			[/^Preferência de idioma salva: (.+)\.$/, {
				en: 'Language preference saved: $1.',
				es: 'Preferencia de idioma guardada: $1.',
			}],
			[/^está com melhor saúde: (.+)\.$/, {
				en: 'has the best health: $1.',
				es: 'tiene la mejor salud: $1.',
			}],
			[/^A maior área registrada é$/, {
				en: 'The largest registered area is',
				es: 'La mayor superficie registrada es',
			}],
			[/^, com (.+)\.$/, { en: ', with $1.', es: ', con $1.' }],
			[/^Há$/, { en: 'There are', es: 'Hay' }],
			[/^lavoura\(s\) monitoradas\.$/, {
				en: 'field(s) monitored.',
				es: 'parcela(s) en seguimiento.',
			}],
			[/^(\d+) dias$/, { en: '$1 days', es: '$1 días' }],
		];
		for (const [pattern, replacements] of dynamicPatterns) {
			const match = source.match(pattern);
			if (match) return replacements[language].replace('$1', match[1]);
		}
		return source;
	};

	const translateElement = (element, language) => {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		let node;
		while ((node = walker.nextNode())) {
			const current = node.nodeValue;
			const trimmed = current.trim();
			if (!trimmed) continue;
			const translated = translate(trimmed, language);
			if (translated !== trimmed) {
				node.nodeValue = current.replace(trimmed, translated);
			}
		}

		const translatableAttributes = [
			'title', 'aria-label', 'aria-description', 'placeholder', 'alt',
			'data-page-title',
		];
		[element, ...element.querySelectorAll('*')].forEach((item) => {
			translatableAttributes.forEach((attribute) => {
				if (!item.hasAttribute(attribute)) return;
				const current = item.getAttribute(attribute);
				const translated = translate(current, language);
				if (translated !== current) item.setAttribute(attribute, translated);
			});
		});
	};

	const applyLanguage = (language = getLanguage()) => {
		const selectedLanguage = LANGUAGES.has(language) ? language : 'pt-BR';
		document.documentElement.lang = selectedLanguage.toLowerCase();
		translateElement(document.documentElement, selectedLanguage);
		if (document.title) document.title = translate(document.title, selectedLanguage);
		document.dispatchEvent(new CustomEvent('agroscam-language-change', {
			detail: { language: selectedLanguage },
		}));
	};

	window.agroscamI18n = {
		get language() { return getLanguage(); },
		translate,
		apply: applyLanguage,
		setLanguage,
	};

	applyLanguage();
	new MutationObserver((records) => {
		const language = getLanguage();
		records.forEach((record) => {
		if (record.type === 'attributes') {
			const current = record.target.getAttribute(record.attributeName);
			const translated = translate(current, language);
			if (translated !== current) record.target.setAttribute(record.attributeName, translated);
			return;
		}
		if (record.type === 'characterData') {
				const translated = translate(record.target.nodeValue, language);
				if (translated !== record.target.nodeValue) record.target.nodeValue = translated;
				return;
			}
			record.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					translateElement(node, language);
				} else if (node.nodeType === Node.TEXT_NODE) {
					const translated = translate(node.nodeValue, language);
					if (translated !== node.nodeValue) node.nodeValue = translated;
				}
			});
		});
	}).observe(document.documentElement, {
		childList: true,
		characterData: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['title', 'aria-label', 'aria-description', 'placeholder', 'alt', 'data-page-title'],
	});

	window.addEventListener('storage', (event) => {
		if (event.key === LANGUAGE_KEY) applyLanguage(event.newValue);
	});
	window.addEventListener('message', (event) => {
		if (event.source !== document.querySelector('[data-tab-frame]')?.contentWindow
			|| event.data?.type !== 'agroscam-language'
			|| !LANGUAGES.has(event.data.language)) return;
		applyLanguage(event.data.language);
	});
})();
