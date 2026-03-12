/**
 * Lógica de Entrada de Horas por Día (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let currentSelectedDate = '';
    let selectedNoteType = 'info';

    const hoursModule = {
        init: function() {
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            const btnApplyAll = document.getElementById('btn-apply-all');
            const btnSave = document.getElementById('btn-save-hours');
            const btnAddNote = document.getElementById('btn-add-note');
            const noteTypeBtns = document.querySelectorAll('.btn-note-type');

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

            btnAddNote.addEventListener('click', async () => {
                await this.addNote();
            });

            noteTypeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    noteTypeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedNoteType = btn.dataset.type;
                });
            });

            // Seleccionar info por defecto
            document.querySelector('.type-info').classList.add('active');
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
            document.getElementById('note-content').value = '';
            
            // Colapsar sección de notas por defecto
            document.getElementById('notes-section').classList.add('collapsed');
            
            window.HorariosApp.ui.switchView('day-hours');
            await this.loadDayEmployees();
            await this.loadDayNotes();
        },

        toggleNotes: function() {
            const section = document.getElementById('notes-section');
            section.classList.toggle('collapsed');
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
                const existing = await window.HorariosApp.db.getByIndex('work_hours', 'date', currentSelectedDate);
                const existingMap = {};
                existing.forEach(h => existingMap[h.employee_id] = h);

                let modificationToPaid = false;
                inputs.forEach(input => {
                    const empId = parseInt(input.dataset.empId);
                    const newHours = parseInt(input.value);
                    const currentRecord = existingMap[empId];

                    if (currentRecord && currentRecord.paid) {
                        if (isNaN(newHours) || newHours === 0 || newHours !== currentRecord.hours) {
                            modificationToPaid = true;
                        }
                    }
                });

                if (modificationToPaid) {
                    if (!confirm('Vas a modificar horas que ya han sido marcadas como PAGADAS. Si continúas, esas horas específicas se resetearán a "Pendiente de Pago". ¿Deseas continuar?')) {
                        return;
                    }
                }

                for (const input of inputs) {
                    const empId = parseInt(input.dataset.empId);
                    const newHours = parseInt(input.value);
                    const currentRecord = existingMap[empId];

                    if (!isNaN(newHours) && newHours > 0) {
                        if (!currentRecord || currentRecord.hours !== newHours) {
                            const data = {
                                employee_id: empId,
                                date: currentSelectedDate,
                                hours: newHours,
                                paid: false
                            };
                            if (currentRecord) {
                                data.id = currentRecord.id;
                                promises.push(window.HorariosApp.db.update('work_hours', data));
                            } else {
                                promises.push(window.HorariosApp.db.add('work_hours', data));
                            }
                        }
                    } else if (currentRecord) {
                        promises.push(window.HorariosApp.db.remove('work_hours', currentRecord.id));
                    }
                }

                await Promise.all(promises);
                window.HorariosApp.ui.showToast('Horas guardadas con éxito', 'success');
                window.HorariosApp.ui.switchView('calendar');
                if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();

            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al guardar horas', 'error');
            }
        },

        loadDayNotes: async function() {
            const notesList = document.getElementById('day-notes-list');
            notesList.innerHTML = '<p style="color:#888; font-size:0.8rem;">Cargando notas...</p>';

            try {
                const notes = await window.HorariosApp.db.getByIndex('day_notes', 'date', currentSelectedDate);
                
                if (notes.length === 0) {
                    notesList.innerHTML = '<p style="color:#888; font-size:0.8rem;">No hay notas para este día.</p>';
                    return;
                }

                notesList.innerHTML = '';
                notes.forEach(note => {
                    const div = document.createElement('div');
                    div.className = `note-item note-${note.type}`;
                    div.innerHTML = `
                        <div style="font-size:0.9rem;">${note.content}</div>
                        <button class="note-delete-btn" onclick="HorariosApp.hours.deleteNote(${note.id})">&times;</button>
                    `;
                    notesList.appendChild(div);
                });
            } catch (error) {
                console.error(error);
                notesList.innerHTML = '<p style="color:var(--error-color); font-size:0.8rem;">Error al cargar notas.</p>';
            }
        },

        addNote: async function() {
            const content = document.getElementById('note-content').value.trim();
            if (!content) return;

            const note = {
                date: currentSelectedDate,
                content: content,
                type: selectedNoteType
            };

            try {
                await window.HorariosApp.db.add('day_notes', note);
                document.getElementById('note-content').value = '';
                await this.loadDayNotes();
                // Refrescar calendario para actualizar visualización de notas
                if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al añadir nota', 'error');
            }
        },

        deleteNote: async function(id) {
            if (confirm('¿Eliminar esta nota?')) {
                try {
                    await window.HorariosApp.db.remove('day_notes', id);
                    await this.loadDayNotes();
                    if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();
                } catch (error) {
                    console.error(error);
                    window.HorariosApp.ui.showToast('Error al eliminar nota', 'error');
                }
            }
        }
    };

    window.HorariosApp.hours = hoursModule;
})();
