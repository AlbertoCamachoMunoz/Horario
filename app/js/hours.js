/**
 * Lógica de Entrada de Horas por Día (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let currentSelectedDate = '';

    const hoursModule = {
        init: function() {
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            const btnApplyAll = document.getElementById('btn-apply-all');
            const btnSave = document.getElementById('btn-save-hours');

            btnApplyAll.addEventListener('click', () => {
                const hours = document.getElementById('all-employees-hours').value;
                if (!hours) return;
                document.querySelectorAll('.emp-hours-input').forEach(input => {
                    input.value = hours;
                });
            });

            btnSave.addEventListener('click', async () => {
                await this.saveDayHours();
            });
        },

        openDay: async function(date) {
            currentSelectedDate = date;
            document.getElementById('selected-day-title').textContent = this.formatDateDisplay(date);
            
            // Cargar horas por defecto desde configuración
            let defaultHours = '';
            try {
                const setting = await window.HorariosApp.db.getById('settings', 'default_hours');
                if (setting) defaultHours = setting.value;
            } catch(e) {}
            
            document.getElementById('all-employees-hours').value = defaultHours;
            
            window.HorariosApp.ui.switchView('day-hours');
            await this.loadDayEmployees();
        },

        formatDateDisplay: function(dateStr) {
            const [y, m, d] = dateStr.split('-');
            const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            return `${parseInt(d)} de ${months[parseInt(m)-1]} ${y}`;
        },

        loadDayEmployees: async function() {
            const listElement = document.getElementById('day-employees-list');
            listElement.innerHTML = '<p class="empty-msg">Cargando...</p>';

            try {
                const employees = await window.HorariosApp.db.getByIndex('employees', 'activo', 1);
                // También necesitamos las horas ya guardadas para este día si existen
                const existingHours = await window.HorariosApp.db.getByIndex('work_hours', 'date', currentSelectedDate);
                const hoursMap = {};
                existingHours.forEach(h => hoursMap[h.employee_id] = h.hours);

                if (employees.length === 0) {
                    listElement.innerHTML = '<p class="empty-msg">No hay empleados activos. Ve a Gestión de Empleados.</p>';
                    return;
                }

                listElement.innerHTML = '';
                employees.forEach(emp => {
                    const savedHours = hoursMap[emp.id] || '';
                    const div = document.createElement('div');
                    div.className = 'card employee-hours-row';
                    div.style.display = 'flex';
                    div.style.justifyContent = 'space-between';
                    div.style.alignItems = 'center';
                    div.innerHTML = `
                        <div style="font-weight:bold;">${emp.nombre}</div>
                        <input type="number" class="emp-hours-input" data-emp-id="${emp.id}" value="${savedHours}" placeholder="Horas" style="width:80px; padding:8px;">
                    `;
                    listElement.appendChild(div);
                });
            } catch (error) {
                console.error(error);
                listElement.innerHTML = '<p class="empty-msg">Error al cargar empleados.</p>';
            }
        },

        saveDayHours: async function() {
            const inputs = document.querySelectorAll('.emp-hours-input');
            const promises = [];

            try {
                // Primero borramos las horas existentes para este día para sobrescribir
                const existing = await window.HorariosApp.db.getByIndex('work_hours', 'date', currentSelectedDate);
                for (let h of existing) {
                    await window.HorariosApp.db.remove('work_hours', h.id);
                }

                // Guardamos las nuevas
                inputs.forEach(input => {
                    const hours = parseInt(input.value);
                    if (!isNaN(hours) && hours > 0) {
                        promises.push(window.HorariosApp.db.add('work_hours', {
                            employee_id: parseInt(input.dataset.empId),
                            date: currentSelectedDate,
                            hours: hours
                        }));
                    }
                });

                await Promise.all(promises);
                window.HorariosApp.ui.showToast('Horas guardadas con éxito', 'success');
                window.HorariosApp.ui.switchView('calendar');
                // Refrescar calendario para mostrar puntos de horas
                if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();

            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al guardar horas', 'error');
            }
        }
    };

    window.HorariosApp.hours = hoursModule;
})();
