(() => {
	const conversationList = document.querySelector('[data-conversation-list]');
	const emptyState = document.querySelector('[data-conversation-empty]');
	const conversationCount = document.querySelector('[data-conversation-count]');
	const conversationSummary = document.querySelector('[data-conversation-summary]');
	const conversationMessage = document.querySelector('[data-conversation-message]');
	const analysisStorage = window.agroAnalysisStorage;

	if (!conversationList || !emptyState || !conversationCount || !conversationSummary || !conversationMessage) return;

	const getCurrentLocale = () => window.agroscamI18n?.language || 'pt-BR';

	const renderConversations = () => {
		const conversations = analysisStorage.getConversations();
		conversationCount.textContent = String(conversations.length);
		conversationSummary.textContent = conversations.length === 1
			? '1 conversa salva neste dispositivo'
			: `${conversations.length} conversas salvas neste dispositivo`;
		emptyState.hidden = conversations.length > 0;
		conversationList.replaceChildren();

		conversations.forEach((conversation) => {
			const item = document.createElement('article');
			item.className = 'conversation-item';

			const details = document.createElement('div');
			const question = document.createElement('p');
			question.className = 'conversation-item__question';
			question.textContent = conversation.question;
			details.append(question);

			const date = new Date(conversation.createdAt);
			if (Number.isFinite(date.getTime())) {
				const timestamp = document.createElement('time');
				timestamp.className = 'conversation-item__date';
				timestamp.dateTime = date.toISOString();
				timestamp.textContent = date.toLocaleString(getCurrentLocale());
				details.append(timestamp);
			}

			const deleteButton = document.createElement('button');
			deleteButton.className = 'conversation-delete';
			deleteButton.type = 'button';
			deleteButton.dataset.deleteConversation = conversation.id;
			deleteButton.setAttribute('aria-label', `Excluir conversa: ${conversation.question}`);
			deleteButton.textContent = 'Excluir';

			item.append(details, deleteButton);
			conversationList.append(item);
		});
	};

	conversationList.addEventListener('click', (event) => {
		const deleteButton = event.target.closest('[data-delete-conversation]');
		if (!deleteButton) return;

		const remainingConversations = analysisStorage.getConversations().filter(
			(conversation) => conversation.id !== deleteButton.dataset.deleteConversation
		);
		if (!analysisStorage.saveConversations(remainingConversations)) {
			conversationMessage.textContent = 'Não foi possível excluir a conversa neste dispositivo.';
			conversationMessage.hidden = false;
			return;
		}

		conversationMessage.textContent = 'Conversa excluída.';
		conversationMessage.hidden = false;
		renderConversations();
	});

	renderConversations();
	document.addEventListener('agroscam-language-change', renderConversations);
})();
