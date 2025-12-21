# Add Diner — Gestor simple de gastos (EN DESARROLLO)

Pequeña aplicación web para agregar, listar y eliminar gastos personales. Los datos se guardan en `localStorage` del navegador; cuenta con un menú lateral cargado dinámicamente.

**Características**
- **Agregar gasto:** formulario con nombre y monto.
- **Listado persistente:** los gastos se guardan en `localStorage` y se muestran en la interfaz.
- **Eliminar gasto:** botón para eliminar cada entrada.
- **Menú lateral (lazy-load):** el panel del menú se carga bajo demanda desde un parcial HTML.

**Archivos principales**
- **HTML:** [add-diner/index.html](add-diner/index.html)
- **Scripts:** [add-diner/scripts/expenses.js](add-diner/scripts/expenses.js), [add-diner/scripts/menu.js](add-diner/scripts/menu.js)
- **Estilos:** [add-diner/styles/style.css](add-diner/styles/style.css), [add-diner/styles/menu.css](add-diner/styles/menu.css)
- **Parcial menú:** [add-diner/HTML/menu.html](add-diner/HTML/menu.html)

**Uso**
- Abrir [add-diner/index.html](add-diner/index.html) en un navegador moderno.
- Añadir gastos desde el formulario; la lista se actualiza automáticamente.

**Notas & mejoras sugeridas**
- El formulario `sueldo-form` existe en la interfaz pero no tiene lógica implementada (podría usarse para calcular saldo/restante).
- Mejoras posibles: resumen de totales, validaciones más claras, edición de gastos y exportación/importación JSON.

**Licencia**
- Libre para uso educativo y de demostración.

