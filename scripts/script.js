document.addEventListener('DOMContentLoaded', () => {
	// helpers para obtener elementos dinámicamente (evita valores stale)
	const el = id => document.getElementById(id);
	const q = sel => document.querySelector(sel);

	const okBtn = el('ok-btn');
	const totalAhorradoEl = el('total-ahorrado');
	const totalGastadoEl = el('total-gastado');
	const balanceEl = el('balance');
	const transListEl = el('transacciones-list');
	const lastTransEl = el('trance');

	const selectorsToEnable = [
		'.cont-entrada',
		'.cont-gastos',
		'.cont-resumen',
		'.cont-list'
	];

	function setDisabledState(enable) {
		selectorsToEnable.forEach(sel => {
			const container = q(sel);
			if (!container) return;
			if (enable) {
				container.classList.remove('disabled');
				container.querySelectorAll('input, button').forEach(i => i.disabled = false);
			} else {
				container.classList.add('disabled');
				container.querySelectorAll('input, button').forEach(i => i.disabled = true);
			}
		});
	}

	let appData = {
		target: null,
		totalAhorrado: 0,
		totalGastado: 0,
		transactions: [] // {type:'ahorro'|'gasto', amount: Number, time: ISO}
	};

	function saveData() {
		try { localStorage.setItem('appData', JSON.stringify(appData)); } catch (e) { /* ignore */ }
	}
	function loadData() {
		try {
			const raw = localStorage.getItem('appData');
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === 'object') Object.assign(appData, parsed);
		} catch (e) { /* ignore */ }
	}

	function updateSummaryUI() {
		if (totalAhorradoEl) totalAhorradoEl.textContent = appData.totalAhorrado.toFixed(2);
		if (totalGastadoEl) totalGastadoEl.textContent = appData.totalGastado.toFixed(2);
		if (balanceEl) balanceEl.textContent = (appData.totalAhorrado - appData.totalGastado).toFixed(2);
		const last = appData.transactions.length ? appData.transactions[appData.transactions.length - 1] : null;
		if (lastTransEl) {
			if (last) {
				lastTransEl.textContent = last.type === 'ahorro' ? `+ $${last.amount.toFixed(2)}` : `- $${last.amount.toFixed(2)}`;
				lastTransEl.style.color = last.type === 'ahorro' ? 'green' : 'red';
			} else {
				lastTransEl.textContent = '0';
				lastTransEl.style.color = '';
			}
		}
	}

	function renderTransactions() {
		if (!transListEl) return;
		transListEl.innerHTML = '';
		// mostrar más reciente arriba
		const list = appData.transactions.slice().reverse();
		list.forEach(t => {
			const li = document.createElement('li');
			li.textContent = t.type === 'ahorro' ? `Ahorro: $${t.amount.toFixed(2)}` : `Gasto: -$${t.amount.toFixed(2)}`;
			li.className = t.type === 'ahorro' ? 'trans-positivo' : 'trans-negativo';
			transListEl.appendChild(li);
		});
	}

	// Restaurar estado
	loadData();
	if (appData.target !== null) {
		// reemplazar input por h2 si existe
		const input = el('ahorros-input');
		if (input) {
			const h2 = document.createElement('h2');
			h2.id = 'ahorros-total';
			h2.textContent = `$${appData.target}`;
			input.replaceWith(h2);
		} else {
			const existingH2 = el('ahorros-total');
			if (existingH2) existingH2.textContent = `$${appData.target}`;
		}
		if (okBtn) okBtn.style.display = 'none';
		setDisabledState(true);
	} else {
		// mantener secciones deshabilitadas
		setDisabledState(false);
	}

	updateSummaryUI();
	renderTransactions();

	// listeners seguros
	if (okBtn) {
		okBtn.addEventListener('click', () => {
			const ahorrosInput = el('ahorros-input');
			if (!ahorrosInput) return;
			const value = Number(ahorrosInput.value);
			if (isNaN(value) || value <= 0) return;
			appData.target = value;
			saveData();
			// reemplazar input por h2
			const h2 = document.createElement('h2');
			h2.id = 'ahorros-total';
			h2.textContent = `$${value}`;
			ahorrosInput.replaceWith(h2);
			okBtn.style.display = 'none';
			setDisabledState(true);
		});
	}

	const addAhorroBtn = el('add-ahorro-btn');
	const addGastoBtn = el('add-gasto-btn');
	const removeAhorroBtn = el('remove-ahorro-btn');
	const removeGastoBtn = el('remove-gasto-btn');

	if (addAhorroBtn) {
		addAhorroBtn.addEventListener('click', () => {
			const montoAhorroInput = el('monto-ahorro-input');
			if (!montoAhorroInput) return;
			const val = Number(montoAhorroInput.value);
			if (isNaN(val) || val <= 0) return;
			appData.totalAhorrado += val;
			appData.transactions.push({ type: 'ahorro', amount: val, time: new Date().toISOString() });
			saveData();
			updateSummaryUI();
			renderTransactions();
			montoAhorroInput.value = '';
		});
	}

	if (addGastoBtn) {
		addGastoBtn.addEventListener('click', () => {
			const montoGastoInput = el('monto-gasto-input');
			if (!montoGastoInput) return;
			const val = Number(montoGastoInput.value);
			if (isNaN(val) || val <= 0) return;
			appData.totalGastado += val;
			appData.transactions.push({ type: 'gasto', amount: val, time: new Date().toISOString() });
			saveData();
			updateSummaryUI();
			renderTransactions();
			montoGastoInput.value = '';
		});
	}

	// botones "r" para limpiar los inputs correspondientes
	if (removeAhorroBtn) {
		removeAhorroBtn.addEventListener('click', () => {
			const montoAhorroInput = el('monto-ahorro-input');
			if (montoAhorroInput) montoAhorroInput.value = '';
		});
	}

	if (removeGastoBtn) {
		removeGastoBtn.addEventListener('click', () => {
			const montoGastoInput = el('monto-gasto-input');
			if (montoGastoInput) montoGastoInput.value = '';
		});
	}

	// Obtener el toggle y manejar tema
	const toggle = document.getElementById('theme-toggle');
	const body = document.body;

	function applyTheme(isDark){
		if(isDark) body.classList.add('dark-theme');
		else body.classList.remove('dark-theme');
		localStorage.setItem('theme-dark', isDark ? '1' : '0');
	}

	// Inicializar desde localStorage
	const saved = localStorage.getItem('theme-dark');
	if(saved !== null){
		applyTheme(saved === '1');
		// actualizar estado del checkbox para que coincida con el tema
		if(toggle) toggle.checked = (saved === '1');
	}

	// Escuchar cambios del switch
	if(toggle){
		toggle.addEventListener('change', e => {
			// cuando esté en luna -> tema oscuro; en sol -> tema claro
			applyTheme(e.target.checked);
		});
	}
});
