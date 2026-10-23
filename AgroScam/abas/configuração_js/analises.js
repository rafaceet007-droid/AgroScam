const farmForm = document.querySelector('[data-farm-form]');
const farmToggle = document.querySelector('[data-farm-toggle]');
const farmCancel = document.querySelector('[data-farm-cancel]');
const farmList = document.querySelector('[data-farm-list]');
const farmEmpty = document.querySelector('[data-farm-empty]');
const farmMessage = document.querySelector('[data-farm-message]');
const farmSubmit = document.querySelector('[data-farm-submit]');
const fieldCount = document.querySelector('[data-field-count]');
const areaTotal = document.querySelector('[data-area-total]');
const healthAverage = document.querySelector('[data-health-average]');
const farmSummary = document.querySelector('[data-farm-summary]');

const analysisStorage = window.agroAnalysisStorage;
const getSavedCultures = () => analysisStorage.getCultures();
const getSavedFarms = () => {
	const cultures = getSavedCultures();
	return analysisStorage.getFarms().map((farm) => {
		if (farm.cropId) return farm;
		const linkedCulture = cultures.find(
			(culture) => normalizeCropName(culture.name) === normalizeCropName(farm.crop)
		);
		return linkedCulture ? { ...farm, cropId: linkedCulture.id } : farm;
	});
};

const getCurrentLocale = () => window.agroscamI18n?.language || 'pt-BR';
const formatArea = (value) => `${Number(value || 0).toLocaleString(getCurrentLocale(), { maximumFractionDigits: 1 })} ha`;
const normalizeCropName = (name) => String(name || '').trim().normalize('NFC').toLocaleLowerCase('pt-BR');

const updateFarmSummary = (farms) => {
	if (!farmSummary) return;
	farmSummary.innerHTML = '';

	if (!farms.length) {
		const emptyItem = document.createElement('li');
		emptyItem.textContent = 'Nenhuma lavoura cadastrada ainda.';
		farmSummary.append(emptyItem);
		return;
	}

	const best = farms.reduce((winner, current) => current.health > winner.health ? current : winner, farms[0]);
	const biggest = farms.reduce((winner, current) => Number(current.area) > Number(winner.area) ? current : winner, farms[0]);

	const bestItem = document.createElement('li');
	const bestName = document.createElement('strong');
	bestName.textContent = best.name;
	bestItem.append(bestName, ` está com melhor saúde: ${best.health}%.`);

	const biggestItem = document.createElement('li');
	const biggestName = document.createElement('strong');
	biggestName.textContent = biggest.name;
	biggestItem.append('A maior área registrada é ', biggestName, `, com ${formatArea(biggest.area)}.`);

	const countItem = document.createElement('li');
	const count = document.createElement('strong');
	count.textContent = String(farms.length);
	countItem.append('Há ', count, ' lavoura(s) monitoradas.');

	farmSummary.append(bestItem, biggestItem, countItem);
};

const renderFarmMetrics = (farms) => {
	if (fieldCount) fieldCount.textContent = String(farms.length);
	if (areaTotal) {
		const totalArea = farms.reduce((sum, farm) => sum + Number(farm.area || 0), 0);
		areaTotal.textContent = formatArea(totalArea);
	}
	if (healthAverage) {
		const averageHealth = farms.length
			? Math.round(farms.reduce((sum, farm) => sum + Number(farm.health || 0), 0) / farms.length)
			: 0;
		healthAverage.textContent = `${averageHealth}%`;
	}
	updateFarmSummary(farms);
};

const renderFarmCards = () => {
	if (!farmList || !farmEmpty) return;
	const farms = getSavedFarms();
	farmList.replaceChildren();
	farmEmpty.hidden = farms.length > 0;
	renderFarmMetrics(farms);

	farms.forEach((farm) => {
		const card = document.createElement('article');
		card.className = 'farm-card';

		const header = document.createElement('div');
		header.className = 'farm-card__header';

		const info = document.createElement('div');
		const title = document.createElement('h3');
		title.className = 'farm-card__title';
		title.textContent = farm.name;
		const meta = document.createElement('div');
		meta.className = 'farm-card__meta';
		const cropName = farm.cropId
			? getSavedCultures().find((culture) => culture.id === farm.cropId)?.name
			: null;
		const crop = document.createElement('span');
		crop.textContent = cropName || farm.crop || (window.agroscamI18n?.translate('Cultura removida') || 'Cultura removida');
		const separator = document.createElement('span');
		separator.textContent = '•';
		const area = document.createElement('span');
		area.textContent = formatArea(farm.area);
		meta.append(crop, separator, area);
		info.append(title, meta);

		const score = document.createElement('span');
		score.className = 'farm-card__score';
		score.textContent = `${farm.health}%`;
		header.append(info, score);

		const analysis = document.createElement('p');
		analysis.className = 'farm-card__analysis';
		analysis.textContent = farm.analysis;

		const footer = document.createElement('div');
		footer.className = 'farm-card__footer';
		const date = document.createElement('time');
		date.className = 'farm-card__date';
		const createdAt = new Date(farm.createdAt);
		date.textContent = Number.isFinite(createdAt.getTime())
			? createdAt.toLocaleString(getCurrentLocale())
			: 'Data indisponível';
		date.dateTime = farm.createdAt;

		const deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.className = 'farm-card__delete';
		deleteButton.dataset.deleteFarm = farm.id;
		deleteButton.setAttribute('aria-label', `Excluir lavoura: ${farm.name}`);
		deleteButton.textContent = 'Excluir';

		const editButton = document.createElement('button');
		editButton.type = 'button';
		editButton.className = 'farm-card__edit';
		editButton.dataset.editFarm = farm.id;
		editButton.textContent = 'Editar';

		footer.append(date, editButton, deleteButton);
		card.append(header, analysis, footer);
		farmList.append(card);
	});
};

const saveFarms = (farms) => analysisStorage.saveFarms(farms);
const saveCultures = (cultures) => analysisStorage.saveCultures(cultures);

const syncFarmCultureOptions = () => {
	const cropField = document.querySelector('select[name="crop"]');
	if (!cropField) return;

	const cultures = getSavedCultures();
	const previousValue = cropField.value;
	cropField.replaceChildren();

	if (!cultures.length) {
		const emptyOption = document.createElement('option');
		emptyOption.value = '';
		emptyOption.textContent = 'Cadastre uma cultura primeiro';
		emptyOption.disabled = true;
		emptyOption.selected = true;
		cropField.append(emptyOption);
		cropField.disabled = true;
		return;
	}

	const defaultOption = document.createElement('option');
	defaultOption.value = '';
	defaultOption.textContent = 'Selecione uma cultura';
	cropField.append(defaultOption);

	cultures.forEach((culture) => {
		const option = document.createElement('option');
		option.value = culture.id;
		option.textContent = culture.name;
		cropField.append(option);
	});

	cropField.disabled = false;
	if (cultures.some((culture) => culture.id === previousValue)) {
		cropField.value = previousValue;
	} else {
		cropField.value = '';
	}
};

const renderCultureCards = () => {
	const cultureList = document.querySelector('[data-culture-list]');
	const cultureEmpty = document.querySelector('[data-culture-empty]');
	const cultureMessage = document.querySelector('[data-culture-message]');
	if (!cultureList || !cultureEmpty) return;

	const cultures = getSavedCultures();
	cultureList.replaceChildren();
	cultureEmpty.hidden = cultures.length > 0;

	cultures.forEach((culture) => {
		const card = document.createElement('article');
		card.className = 'culture-card';

		const header = document.createElement('div');
		header.className = 'culture-card__header';

		const info = document.createElement('div');
		const title = document.createElement('h3');
		title.className = 'culture-card__title';
		title.textContent = culture.name;
		const meta = document.createElement('div');
		meta.className = 'culture-card__meta';
		const type = document.createElement('span');
		type.textContent = culture.type;
		const firstSeparator = document.createElement('span');
		firstSeparator.textContent = '•';
		const cycle = document.createElement('span');
		cycle.textContent = `${culture.cycle} dias`;
		const secondSeparator = document.createElement('span');
		secondSeparator.textContent = '•';
		const season = document.createElement('span');
		season.textContent = culture.season;
		meta.append(type, firstSeparator, cycle, secondSeparator, season);
		info.append(title, meta);

		const badge = document.createElement('span');
		badge.className = 'culture-card__badge';
		badge.textContent = culture.type;
		header.append(info, badge);

		const notes = document.createElement('p');
		notes.className = 'culture-card__notes';
		notes.textContent = culture.notes || 'Sem observações adicionais.';

		const footer = document.createElement('div');
		footer.className = 'culture-card__footer';
		const date = document.createElement('time');
		date.className = 'culture-card__date';
		const createdAt = new Date(culture.createdAt);
		date.textContent = Number.isFinite(createdAt.getTime())
			? createdAt.toLocaleString('pt-BR')
			: 'Data indisponível';
		date.dateTime = culture.createdAt;

		const deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.className = 'culture-card__delete';
		deleteButton.dataset.deleteCulture = culture.id;
		deleteButton.setAttribute('aria-label', `Excluir cultura: ${culture.name}`);
		deleteButton.textContent = 'Excluir';

		const editButton = document.createElement('button');
		editButton.type = 'button';
		editButton.className = 'culture-card__edit';
		editButton.dataset.editCulture = culture.id;
		editButton.textContent = 'Editar';

		footer.append(date, editButton, deleteButton);
		card.append(header, notes, footer);
		cultureList.append(card);
	});

	syncFarmCultureOptions();
};

const cultureForm = document.querySelector('[data-culture-form]');
const cultureToggle = document.querySelector('[data-culture-toggle]');
const cultureCancel = document.querySelector('[data-culture-cancel]');
const cultureList = document.querySelector('[data-culture-list]');
const cultureEmpty = document.querySelector('[data-culture-empty]');
const cultureMessage = document.querySelector('[data-culture-message]');
const cultureSubmit = document.querySelector('[data-culture-submit]');

if (cultureForm && cultureList) {
	cultureForm.hidden = true;
	if (cultureToggle) {
		cultureToggle.setAttribute('aria-expanded', 'false');
		cultureToggle.textContent = 'Nova cultura';
	}

	const cultureDemoValues = [
		['[name="name"]', 'Soja'],
		['[name="type"]', 'Grão'],
		['[name="cycle"]', '120'],
		['[name="season"]', 'Verão'],
		['[name="notes"]', 'Cultura adequada para clima tropical com atenção à irrigação e ao controle de pragas.'],
	];
	let cultureDemoTimeout = null;
	let cultureDemoStep = 0;
	const CULTURE_DEMO_STEP_INTERVAL_MS = 1800;
	const CULTURE_DEMO_COOLDOWN_MS = 3000;

	const clearCultureDemoValues = () => {
		cultureForm.querySelectorAll('[data-demo-preview]').forEach((field) => {
			field.value = '';
			delete field.dataset.demoPreview;
		});
	};

	const hasUserCultureValues = () => [...cultureForm.elements].some(
		(field) => field.value && !field.dataset.demoPreview
	);

	const stopCultureDemo = (clearPreview = false) => {
		if (cultureDemoTimeout !== null) {
			window.clearTimeout(cultureDemoTimeout);
			cultureDemoTimeout = null;
		}
		cultureDemoStep = 0;
		if (clearPreview) clearCultureDemoValues();
	};

	const typeCultureDemoValue = (stepIndex, onComplete) => {
		const [selector, demoValue] = cultureDemoValues[stepIndex];
		const field = cultureForm.querySelector(selector);
		if (!field) return;
		const localizedDemoValue = window.agroscamI18n?.translate(demoValue) || demoValue;

		field.dataset.demoPreview = 'true';
		let characterIndex = 0;
		const typeNextCharacter = () => {
			if (!field.dataset.demoPreview) {
				return;
			}

			characterIndex += 1;
			field.value = localizedDemoValue.slice(0, characterIndex);
			if (characterIndex >= localizedDemoValue.length) {
				onComplete();
				return;
			}
			cultureDemoTimeout = window.setTimeout(typeNextCharacter, 65);
		};
		typeNextCharacter();
	};

	const scheduleNextCultureDemoStep = () => {
		if (cultureForm.hidden || hasUserCultureValues()) return;
		if (cultureDemoStep >= cultureDemoValues.length - 1) {
			cultureDemoTimeout = window.setTimeout(() => {
				cultureDemoTimeout = null;
				if (cultureForm.hidden || hasUserCultureValues()) return;
				clearCultureDemoValues();
				cultureDemoStep = 0;
				typeCultureDemoValue(cultureDemoStep, scheduleNextCultureDemoStep);
			}, CULTURE_DEMO_COOLDOWN_MS);
			return;
		}

		cultureDemoTimeout = window.setTimeout(() => {
			cultureDemoTimeout = null;
			if (cultureForm.hidden || hasUserCultureValues()) return;
			cultureDemoStep += 1;
			typeCultureDemoValue(cultureDemoStep, scheduleNextCultureDemoStep);
		}, CULTURE_DEMO_STEP_INTERVAL_MS);
	};

	const startCultureDemo = () => {
		stopCultureDemo(true);
		if (hasUserCultureValues()) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			cultureDemoValues.forEach(([selector, value]) => {
				const field = cultureForm.querySelector(selector);
				if (!field) return;
				field.value = window.agroscamI18n?.translate(value) || value;
				field.dataset.demoPreview = 'true';
			});
			return;
		}

		typeCultureDemoValue(cultureDemoStep, scheduleNextCultureDemoStep);
	};

	const toggleCultureForm = () => {
		if (!cultureToggle || !cultureForm) return;
		const isHidden = cultureForm.hidden;
		cultureForm.hidden = !isHidden;
		cultureToggle.setAttribute('aria-expanded', String(isHidden));
		cultureToggle.textContent = isHidden ? 'Fechar' : 'Nova cultura';
		if (isHidden) {
			delete cultureForm.dataset.editId;
			cultureForm.reset();
			cultureSubmit.textContent = 'Salvar cultura';
			startCultureDemo();
		} else {
			stopCultureDemo(true);
		}
	};

	if (cultureToggle) {
		cultureToggle.addEventListener('click', toggleCultureForm);
	}

	cultureForm.addEventListener('focusin', (event) => {
		if (event.target.matches('input, textarea')) stopCultureDemo(true);
	});

	if (cultureCancel) {
		cultureCancel.addEventListener('click', () => {
			stopCultureDemo(true);
			cultureForm.hidden = true;
			cultureToggle.setAttribute('aria-expanded', 'false');
			cultureToggle.textContent = 'Nova cultura';
			delete cultureForm.dataset.editId;
			cultureSubmit.textContent = 'Salvar cultura';
			cultureForm.reset();
		});
	}

	cultureForm.addEventListener('submit', (event) => {
		event.preventDefault();
		stopCultureDemo(true);
		const formData = new FormData(cultureForm);
		const name = String(formData.get('name') || '').trim();
		const type = String(formData.get('type') || '').trim();
		const cycle = Number(formData.get('cycle'));
		const season = String(formData.get('season') || '').trim();
		const notes = String(formData.get('notes') || '').trim();

		if (!name || name.length > 80 || !type || type.length > 60 || !season || season.length > 80
			|| !Number.isInteger(cycle) || cycle < 1 || cycle > 3650 || notes.length > 1000) {
			if (cultureMessage) {
				cultureMessage.textContent = 'Preencha os campos obrigatórios com valores válidos.';
				cultureMessage.hidden = false;
			}
			return;
		}

		const cultures = getSavedCultures();
		const editingId = cultureForm.dataset.editId;
		const duplicate = cultures.some((culture) => culture.id !== editingId
			&& normalizeCropName(culture.name) === normalizeCropName(name));
		if (duplicate) {
			cultureMessage.textContent = 'Já existe uma cultura com esse nome.';
			cultureMessage.hidden = false;
			return;
		}

		const existingCulture = cultures.find((culture) => culture.id === editingId);
		const updatedCulture = {
			...(existingCulture || {}),
			id: existingCulture?.id || (crypto.randomUUID ? crypto.randomUUID() : `culture-${Date.now()}`),
			name,
			type,
			cycle,
			season,
			notes,
			createdAt: existingCulture?.createdAt || new Date().toISOString(),
			updatedAt: existingCulture ? new Date().toISOString() : undefined,
		};
		const updatedCultures = existingCulture
			? cultures.map((culture) => culture.id === editingId ? updatedCulture : culture)
			: [updatedCulture, ...cultures];
		if (!saveCultures(updatedCultures)) {
			cultureMessage.textContent = 'Não foi possível salvar as alterações neste dispositivo.';
			cultureMessage.hidden = false;
			return;
		}

		delete cultureForm.dataset.editId;
		cultureForm.reset();
		cultureForm.hidden = true;
		if (cultureToggle) {
			cultureToggle.setAttribute('aria-expanded', 'false');
			cultureToggle.textContent = 'Nova cultura';
		}
		if (cultureMessage) {
			cultureMessage.textContent = existingCulture ? 'Cultura atualizada com sucesso.' : 'Cultura adicionada com sucesso.';
			cultureMessage.hidden = false;
		}
		cultureSubmit.textContent = 'Salvar cultura';
		syncFarmCultureOptions();
		renderCultureCards();
	});

	cultureList.addEventListener('click', (event) => {
		const editButton = event.target.closest('[data-edit-culture]');
		if (editButton) {
			const culture = getSavedCultures().find((item) => item.id === editButton.dataset.editCulture);
			if (!culture) return;
			stopCultureDemo(true);
			cultureForm.dataset.editId = culture.id;
			cultureForm.querySelector('[name="name"]').value = culture.name;
			cultureForm.querySelector('[name="type"]').value = culture.type;
			cultureForm.querySelector('[name="cycle"]').value = culture.cycle;
			cultureForm.querySelector('[name="season"]').value = culture.season;
			cultureForm.querySelector('[name="notes"]').value = culture.notes || '';
			cultureForm.hidden = false;
			cultureToggle.setAttribute('aria-expanded', 'true');
			cultureToggle.textContent = 'Fechar';
			cultureSubmit.textContent = 'Atualizar cultura';
			cultureForm.querySelector('[name="name"]').focus();
			return;
		}

		const deleteButton = event.target.closest('[data-delete-culture]');
		if (!deleteButton) return;

		const cultureToDelete = getSavedCultures().find((culture) => culture.id === deleteButton.dataset.deleteCulture);
		const isInUse = cultureToDelete && getSavedFarms().some((farm) => farm.cropId === cultureToDelete.id
			|| (!farm.cropId && normalizeCropName(farm.crop) === normalizeCropName(cultureToDelete.name)));
		if (isInUse) {
			cultureMessage.textContent = 'Não é possível excluir uma cultura associada a lavouras.';
			cultureMessage.hidden = false;
			return;
		}

		const remainingCultures = getSavedCultures().filter((culture) => culture.id !== deleteButton.dataset.deleteCulture);
		if (!saveCultures(remainingCultures)) {
			cultureMessage.textContent = 'Não foi possível salvar as alterações neste dispositivo.';
			cultureMessage.hidden = false;
			return;
		}
		if (cultureMessage) {
			cultureMessage.textContent = 'Cultura removida.';
			cultureMessage.hidden = false;
		}
		syncFarmCultureOptions();
		renderCultureCards();
		document.addEventListener('agroscam-language-change', renderCultureCards);
	});

	syncFarmCultureOptions();
	renderCultureCards();
}

if (farmForm && farmList) {
	farmForm.hidden = true;
	if (farmToggle) {
		farmToggle.setAttribute('aria-expanded', 'false');
		farmToggle.textContent = 'Nova lavoura';
	}

	const farmDemoValues = [
		['[name="name"]', 'Fazenda Santa Maria'],
		['[name="crop"]', 'Soja'],
		['[name="area"]', '120'],
		['[name="health"]', '76'],
		['[name="analysis"]', 'A lavoura apresenta boa cobertura vegetal, porém há sinais de estresse em trechos com maior compactação do solo.'],
	];
	let farmDemoTimeout = null;
	let farmDemoStep = 0;
	let lastDemoCropName = null;
	let farmDemoActive = false;
	const FARM_DEMO_CHARACTER_INTERVAL_MS = 45;
	const FARM_DEMO_STEP_INTERVAL_MS = 600;
	const FARM_DEMO_COOLDOWN_MS = 3000;

	const clearFarmDemoValues = () => {
		farmForm.querySelectorAll('[data-demo-preview]').forEach((field) => {
			field.value = '';
			delete field.dataset.demoPreview;
		});
		syncFarmCultureOptions();
	};

	const hasUserFarmValues = () => [...farmForm.elements].some(
		(field) => field.value && !field.dataset.demoPreview
	);

	const stopFarmDemo = (clearPreview = false) => {
		if (farmDemoTimeout !== null) {
			window.clearTimeout(farmDemoTimeout);
			farmDemoTimeout = null;
		}
		farmDemoStep = 0;
		const wasActive = farmDemoActive;
		farmDemoActive = false;
		if (clearPreview && wasActive) clearFarmDemoValues();
	};

	const typeFarmDemoValue = (stepIndex, onComplete) => {
		const [selector, demoValue] = farmDemoValues[stepIndex];
		const field = farmForm.querySelector(selector);
		if (!field) return;
		const localizedDemoValue = window.agroscamI18n?.translate(demoValue) || demoValue;

		if (field.tagName === 'SELECT') {
			const cultures = getSavedCultures();
			let displayedName = localizedDemoValue.trim();
			let selectedCultureId = '';
			if (cultures.length) {
				syncFarmCultureOptions();
				const alternatives = cultures.filter((culture) => culture.name !== lastDemoCropName);
				const availableCultures = alternatives.length ? alternatives : cultures;
				const selectedCulture = availableCultures[Math.floor(Math.random() * availableCultures.length)];
				lastDemoCropName = selectedCulture.name;
				displayedName = selectedCulture.name;
				selectedCultureId = selectedCulture.id;
			}

			const demoOption = document.createElement('option');
			demoOption.value = `demo-crop-${Date.now()}`;
			demoOption.textContent = '';
			demoOption.dataset.demoOption = 'true';
			demoOption.dataset.cropName = displayedName;
			field.append(demoOption);
			field.disabled = false;
			field.value = demoOption.value;
			field.dataset.demoPreview = 'true';

			let characterIndex = 0;
			const typeNextCharacter = () => {
				if (!field.dataset.demoPreview) return;

				characterIndex += 1;
				demoOption.textContent = displayedName.slice(0, characterIndex);
				if (characterIndex >= displayedName.length) {
					demoOption.remove();
					if (cultures.length) {
						field.value = selectedCultureId;
					} else {
						const fallbackOption = document.createElement('option');
						fallbackOption.value = displayedName;
						fallbackOption.textContent = displayedName;
						fallbackOption.dataset.demoOption = 'true';
						field.append(fallbackOption);
						field.value = displayedName;
					}
					onComplete();
					return;
				}
				farmDemoTimeout = window.setTimeout(typeNextCharacter, FARM_DEMO_CHARACTER_INTERVAL_MS);
			};
			typeNextCharacter();
			return;
		}

		field.dataset.demoPreview = 'true';
		let characterIndex = 0;
		const typeNextCharacter = () => {
			if (!field.dataset.demoPreview) {
				return;
			}

			characterIndex += 1;
			field.value = localizedDemoValue.slice(0, characterIndex);
			if (characterIndex >= localizedDemoValue.length) {
				onComplete();
				return;
			}
			farmDemoTimeout = window.setTimeout(typeNextCharacter, FARM_DEMO_CHARACTER_INTERVAL_MS);
		};
		typeNextCharacter();
	};

	const scheduleNextFarmDemoStep = () => {
		if (farmForm.hidden || hasUserFarmValues()) return;

		if (farmDemoStep >= farmDemoValues.length - 1) {
			farmDemoTimeout = window.setTimeout(() => {
				farmDemoTimeout = null;
				if (farmForm.hidden || hasUserFarmValues()) return;

				clearFarmDemoValues();
				farmDemoStep = 0;
				typeFarmDemoValue(farmDemoStep, scheduleNextFarmDemoStep);
			}, FARM_DEMO_COOLDOWN_MS);
			return;
		}

		farmDemoTimeout = window.setTimeout(() => {
			farmDemoTimeout = null;
			if (farmForm.hidden || hasUserFarmValues()) return;

			farmDemoStep += 1;
			typeFarmDemoValue(farmDemoStep, scheduleNextFarmDemoStep);
		}, FARM_DEMO_STEP_INTERVAL_MS);
	};

	const startFarmDemo = () => {
		stopFarmDemo(true);
		if (hasUserFarmValues()) return;
		farmDemoActive = true;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			farmDemoValues.forEach(([selector, value], index) => {
				const field = farmForm.querySelector(selector);
				if (!field) return;
				if (field.tagName === 'SELECT') {
					typeFarmDemoValue(index, () => {});
					return;
				}
				field.value = window.agroscamI18n?.translate(value) || value;
				field.dataset.demoPreview = 'true';
			});
			return;
		}

		typeFarmDemoValue(farmDemoStep, scheduleNextFarmDemoStep);
	};

	const toggleFarmForm = () => {
		if (!farmToggle || !farmForm) return;
		const isHidden = farmForm.hidden;
		farmForm.hidden = !isHidden;
		farmToggle.setAttribute('aria-expanded', String(isHidden));
		farmToggle.textContent = isHidden ? 'Fechar' : 'Nova lavoura';
		if (isHidden) {
			delete farmForm.dataset.editId;
			farmForm.reset();
			farmSubmit.textContent = 'Salvar lavoura';
			syncFarmCultureOptions();
			startFarmDemo();
		} else {
			stopFarmDemo(true);
		}
	};

	if (farmToggle) {
		farmToggle.addEventListener('click', toggleFarmForm);
	}

	farmForm.addEventListener('focusin', (event) => {
		if (event.target.matches('input, textarea, select')) stopFarmDemo(true);
	});

	if (farmCancel) {
		farmCancel.addEventListener('click', () => {
			stopFarmDemo(true);
			farmForm.hidden = true;
			farmToggle.setAttribute('aria-expanded', 'false');
			farmToggle.textContent = 'Nova lavoura';
			delete farmForm.dataset.editId;
			farmSubmit.textContent = 'Salvar lavoura';
			farmForm.reset();
			syncFarmCultureOptions();
		});
	}

	farmForm.addEventListener('submit', (event) => {
		event.preventDefault();
		stopFarmDemo(true);
		const formData = new FormData(farmForm);
		const name = String(formData.get('name') || '').trim();
		const cropId = String(formData.get('crop') || '').trim();
		const cropCulture = getSavedCultures().find((culture) => culture.id === cropId);
		const area = Number(formData.get('area'));
		const health = Number(formData.get('health'));
		const analysis = String(formData.get('analysis') || '').trim();

		if (!name || name.length > 80 || !cropCulture || !Number.isFinite(area) || area < 0.1
			|| area > 1000000 || !Number.isFinite(health) || health < 0 || health > 100
			|| analysis.length > 2000) {
			if (farmMessage) {
				farmMessage.textContent = 'Preencha os campos obrigatórios com valores válidos.';
				farmMessage.hidden = false;
			}
			return;
		}

		const farms = getSavedFarms();
		const editingId = farmForm.dataset.editId;
		const existingFarm = farms.find((farm) => farm.id === editingId);
		const updatedFarm = {
			...(existingFarm || {}),
			id: existingFarm?.id || (crypto.randomUUID ? crypto.randomUUID() : `farm-${Date.now()}`),
			name,
			cropId: cropCulture.id,
			crop: cropCulture.name,
			area,
			health,
			analysis,
			createdAt: existingFarm?.createdAt || new Date().toISOString(),
			updatedAt: existingFarm ? new Date().toISOString() : undefined,
		};
		const updatedFarms = existingFarm
			? farms.map((farm) => farm.id === editingId ? updatedFarm : farm)
			: [updatedFarm, ...farms];
		if (!saveFarms(updatedFarms)) {
			farmMessage.textContent = 'Não foi possível salvar as alterações neste dispositivo.';
			farmMessage.hidden = false;
			return;
		}

		delete farmForm.dataset.editId;
		farmForm.reset();
		farmForm.hidden = true;
		farmToggle.setAttribute('aria-expanded', 'false');
		farmToggle.textContent = 'Nova lavoura';
		farmSubmit.textContent = 'Salvar lavoura';
		if (farmMessage) {
			farmMessage.textContent = existingFarm ? 'Lavoura atualizada com sucesso.' : 'Lavoura adicionada com sucesso.';
			farmMessage.hidden = false;
		}
		syncFarmCultureOptions();
		const storedFarms = analysisStorage.getFarms();
		const migratedFarms = getSavedFarms();
		const requiresCropLinkMigration = storedFarms.some((farm) => !farm.cropId)
			&& migratedFarms.some((farm, index) => farm.cropId && farm.cropId !== storedFarms[index]?.cropId);
		if (requiresCropLinkMigration && !saveFarms(migratedFarms)) {
			farmMessage.textContent = 'Não foi possível salvar as alterações neste dispositivo.';
			farmMessage.hidden = false;
		}
		renderFarmCards();
	});

	farmList.addEventListener('click', (event) => {
		const editButton = event.target.closest('[data-edit-farm]');
		if (editButton) {
			const farm = getSavedFarms().find((item) => item.id === editButton.dataset.editFarm);
			if (!farm) return;
			stopFarmDemo(true);
			farmForm.dataset.editId = farm.id;
			farmForm.querySelector('[name="name"]').value = farm.name;
			farmForm.querySelector('[name="area"]').value = farm.area;
			farmForm.querySelector('[name="health"]').value = farm.health;
			farmForm.querySelector('[name="analysis"]').value = farm.analysis;
			syncFarmCultureOptions();
			const culture = getSavedCultures().find((item) => item.id === farm.cropId)
				|| getSavedCultures().find((item) => normalizeCropName(item.name) === normalizeCropName(farm.crop));
			farmForm.querySelector('[name="crop"]').value = culture?.id || '';
			farmForm.hidden = false;
			farmToggle.setAttribute('aria-expanded', 'true');
			farmToggle.textContent = 'Fechar';
			farmSubmit.textContent = 'Atualizar lavoura';
			farmForm.querySelector('[name="name"]').focus();
			return;
		}

		const deleteButton = event.target.closest('[data-delete-farm]');
		if (!deleteButton) return;

		const remainingFarms = getSavedFarms().filter((farm) => farm.id !== deleteButton.dataset.deleteFarm);
		if (!saveFarms(remainingFarms)) {
			farmMessage.textContent = 'Não foi possível salvar as alterações neste dispositivo.';
			farmMessage.hidden = false;
			return;
		}
		if (farmMessage) {
			farmMessage.textContent = 'Lavoura removida.';
			farmMessage.hidden = false;
		}
		renderFarmCards();
	});

	renderFarmCards();
	document.addEventListener('agroscam-language-change', renderFarmCards);
}
