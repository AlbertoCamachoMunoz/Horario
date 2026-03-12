/**
 * Lógica de Configuración (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const settingsModule = {
        init: async function() {
            this.setupEventListeners();
            await this.loadSettings();
        },

        setupEventListeners: function() {
            const form = document.getElementById('settings-form');
            const btnReset = document.getElementById('btn-danger-reset');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveSettings();
            });

            btnReset.addEventListener('click', async () => {
                if (confirm('¿ESTÁS SEGURO? Se borrarán todos los empleados, horas y precios. Esta acción es irreversible.')) {
                    await this.resetApp();
                }
            });
        },

        loadSettings: async function() {
            try {
                const defaultHours = await window.HorariosApp.db.getById('settings', 'default_hours');
                if (defaultHours) {
                    document.getElementById('set-default-hours').value = defaultHours.value;
                }

                const unpaidLogic = await window.HorariosApp.db.getById('settings', 'only_unpaid_logic');
                if (unpaidLogic) {
                    document.getElementById('set-unpaid-logic').checked = (unpaidLogic.value === 'true' || unpaidLogic.value === true);
                }
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        },

        saveSettings: async function() {
            const defaultHours = document.getElementById('set-default-hours').value;
            const unpaidLogic = document.getElementById('set-unpaid-logic').checked;
            
            try {
                await window.HorariosApp.db.update('settings', { key: 'default_hours', value: defaultHours });
                await window.HorariosApp.db.update('settings', { key: 'only_unpaid_logic', value: unpaidLogic });
                window.HorariosApp.ui.showToast('Configuración guardada', 'success');
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al guardar', 'error');
            }
        },

        resetApp: async function() {
            try {
                // Borrar todo el contenido de las tiendas
                const stores = ['employees', 'work_hours', 'price_hour', 'settings'];
                for (const store of stores) {
                    const allItems = await window.HorariosApp.db.getAll(store);
                    for (const item of allItems) {
                        const id = item.id || item.key;
                        await window.HorariosApp.db.remove(store, id);
                    }
                }
                
                window.HorariosApp.ui.showToast('Aplicación reseteada. Recargando...', 'info');
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al resetear', 'error');
            }
        }
    };

    window.HorariosApp.settings = settingsModule;
})();
