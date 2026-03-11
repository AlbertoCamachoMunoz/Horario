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

        // Inicializar Precios
        if (window.HorariosApp.prices) {
            window.HorariosApp.prices.init();
        }

        // Inicializar Configuración
        if (window.HorariosApp.settings) {
            await window.HorariosApp.settings.init();
        }

        // Inicializar Horas
        if (window.HorariosApp.hours) {
            window.HorariosApp.hours.init();
        }

        // Inicializar Informes
        if (window.HorariosApp.reports) {
            window.HorariosApp.reports.init();
        }

        // Inicializar Detalle Empleado
        if (window.HorariosApp.employeeDetail) {
            window.HorariosApp.employeeDetail.init();
        }

        // Inicializar Limpieza
        if (window.HorariosApp.cleanup) {
            window.HorariosApp.cleanup.init();
            await window.HorariosApp.cleanup.checkOldData();
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
