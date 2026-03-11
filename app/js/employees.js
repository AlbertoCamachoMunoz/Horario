/**
 * Gestión de Empleados (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const employeesModule = {
        init: function() {
            this.setupEventListeners();
            this.loadEmployees();
        },

        setupEventListeners: function() {
            const btnAdd = document.getElementById('btn-add-employee');
            const formContainer = document.getElementById('form-employee');
            const form = document.getElementById('employee-details-form');
            const btnCancel = document.getElementById('btn-cancel-employee');

            btnAdd.addEventListener('click', () => {
                this.resetForm();
                formContainer.classList.remove('hidden');
                btnAdd.classList.add('hidden');
            });

            btnCancel.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnAdd.classList.remove('hidden');
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveEmployee();
            });
        },

        resetForm: function() {
            const form = document.getElementById('employee-details-form');
            document.getElementById('employee-form-title').textContent = 'Nuevo Empleado';
            document.getElementById('emp-id').value = '';
            document.getElementById('emp-activo').checked = true; // Por defecto activo
            form.reset();
        },

        saveEmployee: async function() {
            const id = document.getElementById('emp-id').value;
            const data = {
                nombre: document.getElementById('emp-nombre').value,
                tlf: document.getElementById('emp-tlf').value,
                direccion: document.getElementById('emp-direccion').value,
                vehiculo: document.getElementById('emp-vehiculo').checked ? 1 : 0,
                activo: document.getElementById('emp-activo').checked ? 1 : 0
            };

            try {
                if (id) {
                    data.id = parseInt(id);
                    await window.HorariosApp.db.update('employees', data);
                    window.HorariosApp.ui.showToast('Empleado actualizado', 'success');
                } else {
                    await window.HorariosApp.db.add('employees', data);
                    window.HorariosApp.ui.showToast('Empleado añadido', 'success');
                }

                document.getElementById('form-employee').classList.add('hidden');
                document.getElementById('btn-add-employee').classList.remove('hidden');
                await this.loadEmployees();
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al guardar', 'error');
            }
        },

        loadEmployees: async function() {
            const listElement = document.getElementById('employees-list');
            try {
                const employees = await window.HorariosApp.db.getAll('employees');
                
                if (employees.length === 0) {
                    listElement.innerHTML = '<p class="empty-msg">No hay empleados registrados.</p>';
                    return;
                }

                listElement.innerHTML = '';
                employees.forEach(emp => {
                    const card = document.createElement('div');
                    card.className = 'employee-card card';
                    if (emp.activo === 0) card.style.opacity = '0.6'; // Visualmente inactivo
                    
                    card.innerHTML = `
                        <div class="emp-info">
                            <strong>${emp.nombre} ${emp.activo === 0 ? '(Inactivo)' : ''}</strong>
                            <span>${emp.tlf || 'Sin tlf'}</span>
                        </div>
                        <div class="emp-actions">
                            <button class="btn-edit" data-id="${emp.id}">Editar</button>
                        </div>
                    `;
                    
                    card.querySelector('.btn-edit').addEventListener('click', () => this.editEmployee(emp));
                    listElement.appendChild(card);
                });
            } catch (error) {
                listElement.innerHTML = '<p class="empty-msg">Error al cargar datos.</p>';
            }
        },

        editEmployee: function(emp) {
            document.getElementById('employee-form-title').textContent = 'Editar Empleado';
            document.getElementById('emp-id').value = emp.id;
            document.getElementById('emp-nombre').value = emp.nombre;
            document.getElementById('emp-tlf').value = emp.tlf || '';
            document.getElementById('emp-direccion').value = emp.direccion || '';
            document.getElementById('emp-vehiculo').checked = emp.vehiculo === 1;
            document.getElementById('emp-activo').checked = emp.activo === 1;

            document.getElementById('form-employee').classList.remove('hidden');
            document.getElementById('btn-add-employee').classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.HorariosApp.employees = employeesModule;
})();
