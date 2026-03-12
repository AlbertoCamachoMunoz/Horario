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
                
                // Obtener configuración de lógica de pagos
                let onlyUnpaid = false;
                try {
                    const setting = await window.HorariosApp.db.getById('settings', 'only_unpaid_logic');
                    onlyUnpaid = setting && (setting.value === 'true' || setting.value === true);
                } catch(e) {}

                // 2. Desglose semanal
                weeksList.innerHTML = '';
                // Pasamos todas las horas del empleado, la función se encarga de filtrar por rango de semanas del mes
                const weeks = this.groupHoursByWeek(year, month, allHours);

                let totalH = 0;
                let totalC = 0;

                weeks.forEach(week => {
                    let weekH = 0;
                    let weekC = 0;
                    let weekUnpaidH = 0;
                    let weekUnpaidC = 0;

                    week.days.forEach(d => {
                        const price = this.getPriceForDate(prices, d.date);
                        const cost = d.hours * price;

                        if (!onlyUnpaid || !d.paid) {
                            weekH += d.hours;
                            weekC += cost;
                            totalH += d.hours;
                            totalC += cost;
                        }

                        // Calcular siempre lo pendiente para el subtotal inferior
                        if (!d.paid) {
                            weekUnpaidH += d.hours;
                            weekUnpaidC += cost;
                        }
                    });

                    const block = document.createElement('div');
                    block.className = 'week-block';
                    
                    const isWeekEmpty = week.days.length === 0;

                    if (isWeekEmpty) {
                        block.classList.add('empty', 'collapsed');
                    } else if (weekUnpaidH === 0) {
                        // Colapsar por defecto si todo está pagado (pero tiene registros)
                        block.classList.add('collapsed');
                    }

                    let daysHtml = week.days.map(d => {
                        const dateParts = d.date.split('-');
                        const dayLabel = `${dateParts[2]}/${dateParts[1]}`;
                        const isPaid = d.paid === true;
                        const rowClass = isPaid ? 'row-paid' : 'row-unpaid';
                        const checkChecked = isPaid ? 'checked' : '';

                        return `
                            <div class="day-row ${rowClass}">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <input type="checkbox" class="pay-checkbox" ${checkChecked} onchange="HorariosApp.employeeDetail.toggleDayPay(${d.id}, this.checked)">
                                    <span>Día ${dayLabel}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span class="status-badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${isPaid ? 'Pagado' : 'Pendiente'}</span>
                                    <span style="font-weight:bold; width:30px; text-align:right;">${d.hours}h</span>
                                </div>
                            </div>
                        `;
                    }).join('');

                    const weekDates = week.days.map(d => d.date).join(',');
                    const rangeText = `${week.start.getDate()} ${this.getMonthNameShort(week.start.getMonth())} - ${week.end.getDate()} ${this.getMonthNameShort(week.end.getMonth())}`;

                    // Añadir subtotal pendiente si hay horas sin pagar
                    const unpaidFooter = weekUnpaidH > 0 
                        ? `<div class="week-unpaid-subtotal" style="padding: 12px 15px; text-align: right; border-top: 1px dashed #ccc; background: #fff9f9; margin-top: 5px; border-radius: 0 0 8px 8px;">
                             <span style="color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Pendiente esta semana:</span> 
                             <div style="color: var(--error-color); font-weight: bold; font-size: 1.1rem;">${weekUnpaidH}h = ${weekUnpaidC.toFixed(2)}€</div>
                           </div>`
                        : '';

                    const isFullyPaid = !isWeekEmpty && weekUnpaidH === 0;
                    const actionButton = isFullyPaid 
                        ? `<span class="badge-all-paid">TODO PAGADO</span>`
                        : `<button class="btn-pay-week" onclick="event.stopPropagation(); HorariosApp.employeeDetail.payPeriod('${weekDates}', 'week')">PAGAR SEMANA</button>`;

                    block.innerHTML = `
                        <div class="week-header" onclick="${isWeekEmpty ? '' : 'HorariosApp.employeeDetail.toggleWeek(this.parentElement)'}">
                            <div style="pointer-events: none;">
                                <strong>Semana ${week.weekNum}</strong>
                                <div style="font-size:0.7rem; opacity:0.8;">${rangeText}</div>
                                <div style="font-size:0.7rem; font-weight:bold; color:var(--primary-dark);">${weekH}h | ${weekC.toFixed(2)}€</div>
                            </div>
                            ${actionButton}
                        </div>
                        <div class="week-content" style="padding-bottom: 0;">
                            ${daysHtml || '<p style="padding:10px;color:#888;font-size:0.8rem;">Sin registros</p>'}
                            ${unpaidFooter}
                        </div>
                    `;
                    weeksList.appendChild(block);
                });

                // 3. Resumen final (Movido al final)
                const summaryTitle = onlyUnpaid ? 'Pendiente de Pago' : 'Total del Mes';
                summaryElement.innerHTML = `
                    <div style="text-align:center; margin-bottom:10px; font-weight:bold; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">${summaryTitle}</div>
                    <div class="stats-grid">
                        <div class="stat-box">
                            <span class="stat-value">${totalH}h</span>
                            <span class="stat-label">Horas</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-value">${totalC.toFixed(2)}€</span>
                            <span class="stat-label">Coste</span>
                        </div>
                    </div>
                `;
                
                const finalSummaryCard = document.createElement('div');
                finalSummaryCard.className = 'card';
                finalSummaryCard.style.background = 'var(--primary-color)';
                finalSummaryCard.style.color = 'white';
                finalSummaryCard.style.marginTop = '20px';
                finalSummaryCard.innerHTML = summaryElement.innerHTML;
                
                weeksList.appendChild(finalSummaryCard);
                summaryElement.innerHTML = ''; // Limpiar el de arriba
                summaryElement.style.display = 'none';

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

                // Filtrar horas que caen en esta semana
                const weekDays = hours.filter(h => {
                    const hDate = new Date(h.date);
                    // IMPORTANTE: Quitamos el filtro de "mismo mes" para incluir días de meses adyacentes si están en la semana
                    return hDate >= weekStart && hDate <= weekEnd;
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
            if (!prices || prices.length === 0) return 0;
            const sortedPrices = [...prices].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            const price = sortedPrices.find(p => p.start_date <= date);
            
            if (price) return price.price_hour;
            
            // Fallback: usar el precio más antiguo si no hay match para la fecha
            return sortedPrices[sortedPrices.length - 1].price_hour;
        },

        getMonthNameShort: function(m) {
            return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m];
        },

        toggleWeek: function(element) {
            element.classList.toggle('collapsed');
        },

        toggleDayPay: async function(id, isPaid) {
            try {
                const record = await window.HorariosApp.db.getById('work_hours', id);
                if (record) {
                    record.paid = isPaid;
                    await window.HorariosApp.db.update('work_hours', record);
                    this.renderDashboard(); // Refrescar vista
                }
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al actualizar pago', 'error');
            }
        },

        payPeriod: async function(value, type) {
            const confirmMsg = type === 'month' 
                ? '¿Marcar TODAS las horas de este mes como PAGADAS?' 
                : '¿Marcar las horas de esta semana como PAGADAS?';
            
            if (!confirm(confirmMsg)) return;

            try {
                const allHours = await window.HorariosApp.db.getByIndex('work_hours', 'employee_id', selectedEmployee.id);
                let toUpdate = [];

                if (type === 'month') {
                    // value es el mes en formato YYYY-MM
                    toUpdate = allHours.filter(h => h.date.startsWith(value) && !h.paid);
                } else if (type === 'week') {
                    // value es una cadena separada por comas de fechas
                    const dates = value.split(',');
                    toUpdate = allHours.filter(h => dates.includes(h.date) && !h.paid);
                }

                for (let h of toUpdate) {
                    h.paid = true;
                    await window.HorariosApp.db.update('work_hours', h);
                }

                window.HorariosApp.ui.showToast('Pago registrado con éxito', 'success');
                this.renderDashboard();
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al procesar pagos', 'error');
            }
        }
    };

    window.HorariosApp.employeeDetail = detailModule;
})();
