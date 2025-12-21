document.addEventListener("DOMContentLoaded", function () {
    const KEY = "gastos";
    const form = document.getElementById("gasto-form");
    const listEl = document.getElementById("gasto-list");

    function getGastos() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error leyendo localStorage", e);
            return [];
        }
    }

    function saveGastos(gastos) {
        localStorage.setItem(KEY, JSON.stringify(gastos));
    }

    function renderGastos() {
        const gastos = getGastos();
        listEl.innerHTML = "";
        if (!gastos.length) {
            listEl.innerHTML = '<p style="color:#666">Agrega un gasto.</p>';
            return;
        }

        gastos.forEach((g) => {
            const item = document.createElement("div");
            item.className = "gasto-item";
            item.setAttribute("data-id", g.id);

            const text = document.createElement("div");
            text.className = "gasto-text";
            text.textContent = `${g.name} — $${Number(g.amount).toFixed(2)}`;

            const btn = document.createElement("button");
            btn.className = "delete-btn";
            btn.type = "button";
            btn.setAttribute("aria-label", `Eliminar gasto ${g.name}`);
            btn.textContent = "✕";
            btn.addEventListener("click", () => {
                deleteGasto(g.id);
            });

            item.appendChild(text);
            item.appendChild(btn);
            listEl.appendChild(item);
        });
    }

    function addGasto(name, amount) {
        const gastos = getGastos();
        const gasto = {
            id: Date.now().toString(),
            name: name || "Sin nombre",
            amount: Number(amount) || 0,
        };
        gastos.push(gasto);
        saveGastos(gastos);
        renderGastos();
    }

    function deleteGasto(id) {
        const gastos = getGastos().filter((g) => g.id !== id);
        saveGastos(gastos);
        renderGastos();
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const amountEl = document.getElementById("gasto-amount");
        const nameEl = document.getElementById("gasto-name");
        const amount = amountEl.value.trim();
        const name = nameEl.value.trim();

        if (!amount || isNaN(Number(amount))) {
            amountEl.focus();
            return;
        }

        addGasto(name, amount);
        amountEl.value = "";
        nameEl.value = "";
        amountEl.focus();
    });

    // Inicializar render
    renderGastos();
});
