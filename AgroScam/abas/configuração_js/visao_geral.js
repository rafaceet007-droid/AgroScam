const questionForm = document.querySelector('[data-question-form]');
const questionInput = document.querySelector('#question-input');
const questionMessage = document.querySelector('[data-question-message]');
const speechToggle = document.querySelector('[data-speech-toggle]');
const imageWorkspace = document.querySelector('#image-workspace');
const imageToggle = document.querySelector('[data-image-toggle]');
const imageInput = document.querySelector('[data-image-input]');
const uploadZone = document.querySelector('[data-upload-zone]');
const imagePreviews = document.querySelector('[data-image-previews]');
const analysisResult = document.querySelector('[data-analysis-result]');
const analysisAnswer = document.querySelector('[data-analysis-answer]');
const submitButton = questionForm.querySelector('button[type="submit"]');
const CONVERSATIONS_KEY = 'agroscam-conversations';
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
let selectedImages = [];
let imageId = 0;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
	speechToggle.addEventListener('click', () => {
		questionMessage.textContent = 'O ditado por voz não está disponível neste navegador. Tente usar o Chrome ou o Edge.';
		questionMessage.hidden = false;
	});
} else {
	const speechRecognition = new SpeechRecognition();
	speechRecognition.lang = window.agroscamI18n?.language || 'pt-BR';
	document.addEventListener('agroscam-language-change', (event) => {
		speechRecognition.lang = event.detail.language;
	});
	speechRecognition.interimResults = true;
	speechRecognition.continuous = true;
	const SILENCE_TIMEOUT_MS = 10_000;
	let isListening = false;
	let silenceTimer;
	let stopReason = null;

	const resetSilenceTimer = () => {
		clearTimeout(silenceTimer);
		silenceTimer = window.setTimeout(() => {
			if (!isListening) return;

			stopReason = 'silence';
			speechRecognition.stop();
		}, SILENCE_TIMEOUT_MS);
	};

	speechRecognition.onstart = () => {
		isListening = true;
		stopReason = null;
		resetSilenceTimer();
		speechToggle.classList.add('is-listening');
		speechToggle.setAttribute('aria-pressed', 'true');
		speechToggle.setAttribute('aria-label', 'Parar ditado');
		questionMessage.textContent = 'Ouvindo... Fale sua pergunta.';
		questionMessage.hidden = false;
	};

	speechRecognition.onresult = (event) => {
		let transcript = '';
		let detectedSpeech = false;
		for (let index = event.resultIndex; index < event.results.length; index += 1) {
			const result = event.results[index];
			const resultTranscript = result[0].transcript.trim();
			if (!resultTranscript) continue;

			detectedSpeech = true;
			if (result.isFinal) transcript += `${transcript ? ' ' : ''}${resultTranscript}`;
		}

		if (detectedSpeech) resetSilenceTimer();
		if (!transcript) return;

		const separator = questionInput.value && !/\s$/.test(questionInput.value) ? ' ' : '';
		questionInput.value += `${separator}${transcript}`;
		questionMessage.textContent = 'Fala convertida. Continuando a ouvir...';
		questionInput.focus();
	};

	speechRecognition.onerror = (event) => {
		questionMessage.textContent = event.error === 'not-allowed' || event.error === 'service-not-allowed'
			? 'Permita o acesso ao microfone nas configurações do navegador para usar o ditado.'
			: event.error === 'no-speech'
				? 'Nenhuma fala foi detectada. Tente novamente.'
				: 'Não foi possível reconhecer a fala. Verifique o microfone e tente novamente.';
		questionMessage.hidden = false;
	};

	speechRecognition.onend = () => {
		clearTimeout(silenceTimer);
		isListening = false;
		speechToggle.classList.remove('is-listening');
		speechToggle.setAttribute('aria-pressed', 'false');
		speechToggle.setAttribute('aria-label', 'Iniciar ditado');
		if (stopReason === 'silence') {
			questionMessage.textContent = 'Ditado encerrado após 10 segundos sem fala.';
		} else if (stopReason === 'user' || questionMessage.textContent === 'Ouvindo... Fale sua pergunta.') {
			questionMessage.textContent = 'Ditado encerrado.';
		}
		stopReason = null;
	};

	speechToggle.addEventListener('click', () => {
		if (isListening) {
			stopReason = 'user';
			speechRecognition.stop();
			return;
		}

		try {
			speechRecognition.start();
		} catch {
			questionMessage.textContent = 'Não foi possível iniciar o ditado. Tente novamente.';
			questionMessage.hidden = false;
		}
	});
}

// Lê o histórico salvo e usa uma lista vazia se os dados estiverem inválidos.
const getSavedConversations = () => {
	try {
		const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
		return Array.isArray(conversations) ? conversations : [];
	} catch {
		return [];
	}
};

// Salva a pergunta e a resposta no histórico local sem armazenar os arquivos.
const saveConversation = (question, answer, imageNames) => {
	const conversations = getSavedConversations();
	conversations.unshift({
		id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
		question,
		answer,
		imageNames,
		createdAt: Date.now(),
	});

	try {
		localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
		return true;
	} catch {
		return false;
	}
};

// Abre ou fecha o seletor e mantém o estado acessível do botão sincronizado.
const setImageWorkspaceOpen = (isOpening) => {
	imageWorkspace.hidden = !isOpening;
	imageToggle.setAttribute('aria-expanded', String(isOpening));
	imageToggle.setAttribute('aria-label', `${isOpening ? 'Fechar' : 'Abrir'} área de imagens`);
	imageToggle.title = `${isOpening ? 'Fechar' : 'Abrir'} área de imagens`;
	imageToggle.textContent = isOpening ? '−' : '+';
};

// Alterna a área de envio de imagens ao clicar no botão de anexo.
imageToggle.addEventListener('click', () => {
	setImageWorkspaceOpen(imageWorkspace.hidden);
});

const setQuestionMessage = (message) => {
	questionMessage.textContent = message;
	questionMessage.hidden = false;
};

const clearSelectedImages = () => {
	selectedImages.forEach(({ url }) => URL.revokeObjectURL(url));
	selectedImages = [];
	imagePreviews.replaceChildren();
};

// Envia pergunta e imagens ao serviço local, e apresenta a resposta retornada.
questionForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const question = questionInput.value.trim();
	if (!question && selectedImages.length === 0) {
		setQuestionMessage('Digite uma pergunta ou anexe pelo menos uma imagem.');
		questionInput.focus();
		return;
	}

	submitButton.disabled = true;
	setQuestionMessage('Analisando com a IA... Isso pode levar alguns instantes.');
	analysisResult.hidden = true;
	try {
		const formData = new FormData();
		formData.append('question', question);
		selectedImages.forEach(({ file }) => formData.append('images', file, file.name));
		const response = await fetch('/api/analyze', {
			method: 'POST',
			body: formData,
		});
		const responseText = await response.text();
		if (!response.ok) throw new Error(responseText || 'Não foi possível analisar o envio.');

		analysisAnswer.textContent = responseText;
		analysisResult.hidden = false;
		const imageNames = selectedImages.map(({ file }) => file.name);
		const savedQuestion = question || `Análise de imagem: ${imageNames.join(', ')}`;
		const wasSaved = saveConversation(savedQuestion, result.answer, imageNames);
		questionInput.value = '';
		clearSelectedImages();
		setQuestionMessage(wasSaved
			? 'Análise concluída e salva no histórico local.'
			: 'Análise concluída, mas não foi possível salvá-la no histórico local.');
	} catch (error) {
		setQuestionMessage(error instanceof TypeError
			? 'Não foi possível conectar ao servidor da IA. Inicie IA.py e abra o site pelo endereço local exibido no terminal.'
			: error.message);
	} finally {
		submitButton.disabled = false;
	}
});

// Filtra imagens, cria suas miniaturas removíveis e fecha a área de envio.
const addImages = (files) => {
	const imageFiles = [...files];
	const invalidFile = imageFiles.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
	if (invalidFile) {
		setQuestionMessage('Use arquivos de imagem JPEG, PNG ou WEBP.');
		return;
	}
	const oversizedFile = imageFiles.find((file) => file.size > MAX_IMAGE_BYTES);
	if (oversizedFile) {
		setQuestionMessage('Cada imagem pode ter no máximo 5 MB.');
		return;
	}
	const totalBytes = selectedImages.reduce((total, item) => total + item.file.size, 0)
		+ imageFiles.reduce((total, file) => total + file.size, 0);
	if (selectedImages.length + imageFiles.length > MAX_IMAGES) {
		setQuestionMessage(`Anexe no máximo ${MAX_IMAGES} imagens.`);
		return;
	}
	if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
		setQuestionMessage('O tamanho total das imagens não pode passar de 20 MB.');
		return;
	}

	// Cria uma URL temporária e um cartão de pré-visualização para cada imagem.
	imageFiles.forEach((file) => {
		const imageUrl = URL.createObjectURL(file);
		const id = String(++imageId);
		const preview = document.createElement('figure');
		preview.className = 'image-preview';
		preview.dataset.imageUrl = imageUrl;
		preview.dataset.imageId = id;

		const image = document.createElement('img');
		image.src = imageUrl;
		image.alt = file.name;

		const caption = document.createElement('figcaption');
		caption.textContent = file.name;

		const removeButton = document.createElement('button');
		removeButton.className = 'image-preview__remove';
		removeButton.type = 'button';
		removeButton.setAttribute('aria-label', `Remover ${file.name}`);
		removeButton.title = `Remover ${file.name}`;
		removeButton.textContent = '×';

		preview.append(image, caption, removeButton);
		imagePreviews.append(preview);
		selectedImages.push({ id, file, url: imageUrl });
	});

	if (imageFiles.length) setImageWorkspaceOpen(false);
};

// Processa os arquivos escolhidos e limpa o campo para aceitar a mesma seleção novamente.
imageInput.addEventListener('change', () => {
	addImages(imageInput.files);
	imageInput.value = '';
});

// Remove a miniatura acionada e libera a URL temporária da imagem.
imagePreviews.addEventListener('click', (event) => {
	const removeButton = event.target.closest('.image-preview__remove');
	if (!removeButton) return;

	const preview = removeButton.closest('.image-preview');
	URL.revokeObjectURL(preview.dataset.imageUrl);
	selectedImages = selectedImages.filter((image) => image.id !== preview.dataset.imageId);
	preview.remove();
});

// Permite soltar arquivos e sinaliza visualmente que a área está recebendo um arraste.
uploadZone.addEventListener('dragover', (event) => {
	event.preventDefault();
	uploadZone.classList.add('is-dragging');
});

// Remove o destaque visual quando o arquivo sai da área de envio.
uploadZone.addEventListener('dragleave', () => {
	uploadZone.classList.remove('is-dragging');
});

// Encaminha os arquivos soltos para o mesmo processamento da seleção pelo botão.
uploadZone.addEventListener('drop', (event) => {
	event.preventDefault();
	uploadZone.classList.remove('is-dragging');
	addImages(event.dataTransfer.files);
});
