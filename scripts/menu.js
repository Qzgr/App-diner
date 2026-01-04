document.addEventListener('DOMContentLoaded', () => {
	const hamb = document.getElementById('hamburger-toggle');
	const panel = document.getElementById('menu-panel');

	if (!hamb || !panel) return;

	// almacenar scroll para restaurar al cerrar
	let savedScrollY = 0;

	function openPanel() {
		panel.classList.add('open');
		panel.setAttribute('aria-hidden', 'false');
		// bloquear scroll de fondo: fijar body y conservar posición
		savedScrollY = window.scrollY || window.pageYOffset || 0;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${savedScrollY}px`;
		document.body.classList.add('menu-open');
	}
	function closePanel() {
		panel.classList.remove('open');
		panel.setAttribute('aria-hidden', 'true');
		// desmarcar checkbox si existe
		try { hamb.checked = false; } catch (e) { /* ignore */ }
		// restaurar scroll de fondo y posición previa
		document.body.classList.remove('menu-open');
		document.body.style.position = '';
		// quitar top antes de hacer scroll para evitar salto visual en algunos navegadores
		const top = document.body.style.top;
		document.body.style.top = '';
		if (top) {
			const y = parseInt(top || '0', 10) * -1 || 0;
			window.scrollTo(0, y);
		}
	}

	hamb.addEventListener('change', (e) => {
		if (e.target.checked) openPanel();
		else closePanel();
	});

	// cerrar al hacer click fuera del panel
	document.addEventListener('click', (ev) => {
		if (!panel.classList.contains('open')) return;
		const inside = panel.contains(ev.target) || ev.target === hamb || ev.target.closest('.hamburger');
		if (!inside) closePanel();
	});

	// cerrar con ESC
	document.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape' && panel.classList.contains('open')) closePanel();
	});
});
