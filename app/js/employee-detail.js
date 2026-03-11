/**
 * Lógica de Detalle de Empleado (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let selectedEmployee = null;

    const detailModule = {
        init: function() {
            this.setupSelectors();
            this.setupEventListeners();
        },

        setupSelectors: function() {
            const monthSelect = document.getElementById('detail-month');
            const yearSelect = document.getElementById('detail-year');
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            
            monthNames.forEach((m, i) => {
                const opt = document.createElement('option');
                opt.value = i + 1;
                opt.textContent = m;
                monthSelect.appendChild(opt);
            });

            const currentYear = new Date().getFullYear();
            for (let y = currentYear; y >= currentYear - 5; y--) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                yearSelect.appendChild(opt);
            }

            monthSelect.value = new Date().getMonth() + 1;
            yearSelect.value = currentYear;
        },

        setupEventListeners: function() {
            document.getElementById('detail-month').addEventListener('change', () => this.renderDashboard());
            document.getElementById('detail-year').addEventListener('change', () => this.renderDashboard());
        },

        loadEmployeeList: async function() {
            const listElement = document.getElementById('employee-report-list');
            try {
                const employees = await window.HorariosApp.db.getAll('employees');
                if (employees.length === 0) {
                    listElement.innerHTML = '<p class="empty-msg">No hay empleados registrados.</p>';
                    return;
                }

                listElement.innerHTML = '';
                employees.forEach(emp => {
                    const card = document.createElement('div');
                    card.className = 'card clickable-card';
                    card.innerHTML = `<strong>${emp.nombre}</strong>`;
                    card.onclick = () => this.openDashboard(emp);
                    listElement.appendChild(card);
                });
            } catch (error) {
                listElement.innerHTML = '<p class="empty-msg">Error al cargar datos.</p>';
            }
        },

        openDashboard: function(emp) {
            selectedEmployee = emp;
            document.getElementById('detail-emp-name').textContent = emp.nombre;
            window.HorariosApp.ui.switchView('employee-detail');
            this.renderDashboard();
        },

        renderDashboard: async function() {
            if (!selectedEmployee) return;

            const month = parseInt(document.getElementById('detail-month').value);
            const year = parseInt(document.getElementById('detail-year').value);
            const summaryElement = document.getElementById('employee-stats-summary');
            const weeksList = document.getElementById('employee-weeks-list');

            try {
                const allHours = await window.HorariosApp.db.getByIndex('work_hours', 'employee_id', selectedEmployee.id);
                const prices = await window.HorariosApp.db.getAll('price_hour');
                
                const monthStr = `${year}-${String(month).padStart(2, '0')}`;
                const monthHours = allHours.filter(h => h.date.startsWith(monthStr));

                // 1. Resumen superior
                let totalH = 0;
                let totalC = 0;
                monthHours.forEach(h => {
                    totalH += h.hours;
                    totalC += h.hours * this.getPriceForDate(prices, h.date);
                });

                summaryElement.innerHTML = `
                    <div class="stats-grid">
                        <div class="stat-box">
                            <span class="stat-value">${totalH}h</span>
                            <span class="stat-label">Total Horas</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-value">${totalC.toFixed(2)}€</span>
                            <span class="stat-label">Coste Total</span>
                        </div>
                    </div>
                `;

                // 2. Desglose semanal
                weeksList.innerHTML = '';
                const weeks = this.groupHoursByWeek(year, month, monthHours);

                weeks.forEach(week => {
                    let weekH = 0;
                    let weekC = 0;
                    week.days.forEach(d => {
                        weekH += d.hours;
                        weekC += d.hours * this.getPriceForDate(prices, d.date);
                    });

                    const block = document.createElement('div');
                    block.className = 'week-block';
                    
                    let daysHtml = week.days.map(d => {
                        const dayNum = d.date.split('-')[2];
                        return `
                            <div class="day-row">
                                <span>Día ${dayNum}</span>
                                <span>${d.hours}h</span>
                            </div>
                        `;
                    }).join('');

                    block.innerHTML = `
                        <div class="week-header">
                            <strong>Semana ${week.weekNum}</strong>
                            <span>${weekH}h | ${weekC.toFixed(2)}€</span>
                        </div>
                        <div class="week-content">
                            ${daysHtml || '<p style="padding:10px;color:#888;font-size:0.8rem;">Sin registros</p>'}
                        </div>
                    `;
                    weeksList.appendChild(block);
                });

            } catch (error) {
                console.error(error);
                weeksList.innerHTML = '<p class="empty-msg">Error al cargar el dashboard.</p>';
            }
        },

        groupHoursByWeek: function(year, month, hours) {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const weeks = [];
            
            let currentDay = new Date(firstDay);
            // Retroceder al lunes de la primera semana
            const startDayOfWeek = currentDay.getDay(); 
            const diffToMonday = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1);
            currentDay.setDate(currentDay.getDate() - diffToMonday);

            let weekCounter = 1;
            while (currentDay <= lastDay) {
                const weekStart = new Date(currentDay);
                const weekEnd = new Date(currentDay);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Filtrar horas que caen en esta semana Y en este mes
                const weekDays = hours.filter(h => {
                    const hDate = new Date(h.date);
                    return hDate >= weekStart && hDate <= weekEnd && hDate.getMonth() === (month - 1);
                }).sort((a,b) => a.date.localeCompare(b.date));

                if (weekDays.length > 0 || (weekStart.getMonth() === (month - 1))) {
                    weeks.push({
                        weekNum: weekCounter++,
                        start: weekStart,
                        end: weekEnd,
                        days: weekDays
                    });
                }

                currentDay.setDate(currentDay.getDate() + 7);
            }
            return weeks;
        },

        getPriceForDate: function(prices, date) {
            const sortedPrices = [...prices].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            const price = sortedPrices.find(p => p.start_date <= date);
            return price ? price.price_hour : 0;
        }
    };

    window.HorariosApp.employeeDetail = detailModule;
})();
