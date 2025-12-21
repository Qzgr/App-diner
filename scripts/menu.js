document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.content-menu .menu');
    const panel = document.getElementById('menu-panel');

    if (!menuBtn || !panel) return;

    async function loadMenuOnce() {
        if (panel.dataset.loaded === 'true') return;
        try {
            const res = await fetch('HTML/menu.html', { cache: 'no-cache' });
            if (!res.ok) throw new Error('No se pudo cargar el menú');
            const html = await res.text();
            panel.innerHTML = html;
            panel.dataset.loaded = 'true';
        } catch (err) {
            panel.innerHTML = '<div style="padding:16px;color:#c62828">Error cargando el menú.</div>';
            console.error(err);
        }
    }

    function openPanel() {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Toggle on button click
    menuBtn.addEventListener('click', async function () {
        if (!panel.classList.contains('open')) {
            await loadMenuOnce();
            openPanel();
        } else {
            closePanel();
        }
    });

    // Delegate close button inside the panel
    panel.addEventListener('click', function (e) {
        if (e.target.closest('.menu-close')) {
            closePanel();
        }
    });

    // Close when pressing Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
            closePanel();
        }
    });

    // Optional: click outside the panel to close (on the document)
    document.addEventListener('click', function (e) {
        if (!panel.classList.contains('open')) return;
        const inside = e.target.closest('#menu-panel') || e.target.closest('.content-menu');
        if (!inside) closePanel();
    });
});
