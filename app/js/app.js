/**
 * Punto de entrada principal (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Aplicación iniciando (Modo Local)...');

    try {
        // Inicializar DB (IndexedDB funciona en file:// en la mayoría de navegadores)
        if (window.HorariosApp.db) {
            await window.HorariosApp.db.initDb();
            console.log('DB inicializada');
        }

        // Configurar navegación
        setupNavigation();

        // Inicializar Calendario
        if (window.HorariosApp.calendar) {
            window.HorariosApp.calendar.init();
        }

        // Inicializar Empleados
        if (window.HorariosApp.employees) {
            window.HorariosApp.employees.init();
        }

        // Inicializar Horas
        if (window.HorariosApp.hours) {
            window.HorariosApp.hours.init();
        }

        // Mostrar vista inicial
        if (window.HorariosApp.ui) {
            window.HorariosApp.ui.switchView('calendar');
        }

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
});

function setupNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle && window.HorariosApp.ui) {
        menuToggle.addEventListener('click', window.HorariosApp.ui.toggleMenu);
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('side-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (menu && menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            window.HorariosApp.ui.toggleMenu();
        }
    });
}
