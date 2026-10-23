(() => {
	const KEYS = {
		conversations: 'agroscam-conversations',
		farms: 'agroscam-farm-analyses',
		cultures: 'agroscam-culture-catalog',
	};

	const readList = (key, isValid) => {
		try {
			const records = JSON.parse(localStorage.getItem(key) || '[]');
			return Array.isArray(records) ? records.filter(isValid) : [];
		} catch {
			return [];
		}
	};

	const writeList = (key, records) => {
		try {
			localStorage.setItem(key, JSON.stringify(records));
			return true;
		} catch {
			return false;
		}
	};

	window.agroAnalysisStorage = {
		getConversations: () => readList(
			KEYS.conversations,
			(item) => item && typeof item.id === 'string' && typeof item.question === 'string',
		),
		getFarms: () => readList(
			KEYS.farms,
			(farm) => farm && typeof farm.id === 'string' && typeof farm.name === 'string' && typeof farm.analysis === 'string',
		),
		getCultures: () => readList(
			KEYS.cultures,
			(culture) => culture && typeof culture.id === 'string' && typeof culture.name === 'string',
		),
		saveConversations: (records) => writeList(KEYS.conversations, records),
		saveFarms: (records) => writeList(KEYS.farms, records),
		saveCultures: (records) => writeList(KEYS.cultures, records),
	};
})();
