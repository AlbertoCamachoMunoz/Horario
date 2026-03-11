/**
 * Lógica de Informes Detallados Multiempleado (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const reportsModule = {
        init: function() {
            this.setupSelectors();
            this.setupEventListeners();
        },

        setupSelectors: function() {
            const monthSelect = document.getElementById('report-month');
            const yearSelect = document.getElementById('report-year');
            
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            
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

            this.updateWeeksSelector();
        },

        setupEventListeners: function() {
            document.getElementById('report-month').addEventListener('change', () => {
                this.updateWeeksSelector();
                this.generateReport();
            });
            document.getElementById('report-year').addEventListener('change', () => {
                this.updateWeeksSelector();
                this.generateReport();
            });
            document.getElementById('btn-generate-report').addEventListener('click', () => this.generateReport());
        },

        updateWeeksSelector: function() {
            const year = parseInt(document.getElementById('report-year').value);
            const month = parseInt(document.getElementById('report-month').value);
            const weekSelect = document.getElementById('report-week');
            
            weekSelect.innerHTML = '<option value="all">Todo el mes (por semanas)</option>';
            
            const weeks = this.getWeeksInMonth(year, month);
            weeks.forEach((w, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `Semana ${i + 1} (${w.start.getDate()} - ${w.end.getDate()} ${this.getMonthNameShort(w.end.getMonth())})`;
                weekSelect.appendChild(opt);
            });
        },

        getWeeksInMonth: function(year, month) {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const weeks = [];
            
            let currentDay = new Date(firstDay);
            const startDayOfWeek = currentDay.getDay(); 
            const diffToMonday = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1);
            currentDay.setDate(currentDay.getDate() - diffToMonday);

            while (currentDay <= lastDay) {
                const weekStart = new Date(currentDay);
                const weekEnd = new Date(currentDay);
                weekEnd.setDate(weekEnd.getDate() + 6);

                if (weekEnd >= firstDay) {
                    weeks.push({ start: weekStart, end: weekEnd });
                }
                currentDay.setDate(currentDay.getDate() + 7);
            }
            return weeks;
        },

        generateReport: async function() {
            const month = parseInt(document.getElementById('report-month').value);
            const year = parseInt(document.getElementById('report-year').value);
            const weekIdx = document.getElementById('report-week').value;
            const content = document.getElementById('reports-content');
            
            content.innerHTML = '<p class="empty-msg">Generando desglose...</p>';

            try {
                const employees = await window.HorariosApp.db.getAll('employees');
                const workHours = await window.HorariosApp.db.getAll('work_hours');
                const prices = await window.HorariosApp.db.getAll('price_hour');
                
                const monthStr = `${year}-${String(month).padStart(2, '0')}`;
                const allWeeks = this.getWeeksInMonth(year, month);
                
                let filteredWeeks = (weekIdx === 'all') ? allWeeks : [allWeeks[weekIdx]];
                let totalGlobal = 0;
                let html = '';

                for (let emp of employees) {
                    const empHours = workHours.filter(h => h.employee_id === emp.id && h.date.startsWith(monthStr));
                    if (empHours.length === 0) continue;

                    let empHtml = `<div class="card" style="border-left: 5px solid var(--primary-color);">
                        <h3 style="margin-bottom:10px; color: var(--primary-color);">${emp.nombre}</h3>`;
                    
                    let empTotalCost = 0;
                    let empTotalHours = 0;

                    filteredWeeks.forEach((week, i) => {
                        const weekHours = empHours.filter(h => {
                            const d = new Date(h.date);
                            return d >= week.start && d <= week.end;
                        }).sort((a,b) => a.date.localeCompare(b.date));

                        if (weekHours.length > 0) {
                            let weekH = 0;
                            let weekC = 0;
                            
                            empHtml += `<div class="week-block" style="margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom:5px;">
                                <div style="font-weight:bold; font-size:0.9rem; background:#f9f9f9; padding:5px;">Semana ${weekIdx === 'all' ? i+1 : parseInt(weekIdx)+1}</div>`;
                            
                            weekHours.forEach(h => {
                                const price = this.getPriceForDate(prices, h.date);
                                const cost = h.hours * price;
                                weekH += h.hours;
                                weekC += cost;
                                const dayNum = h.date.split('-')[2];
                                empHtml += `<div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:2px 10px;">
                                    <span>Día ${dayNum}</span>
                                    <span>${h.hours}h x ${price}€ = ${cost.toFixed(2)}€</span>
                                </div>`;
                            });

                            empHtml += `<div style="text-align:right; font-weight:bold; font-size:0.85rem; padding:5px 10px;">Subtotal Semana: ${weekC.toFixed(2)}€</div></div>`;
                            empTotalCost += weekC;
                            empTotalHours += weekH;
                        }
                    });

                    empHtml += `
                        <div style="text-align:right; margin-top:10px; padding-top:10px; border-top: 1px solid #ddd; font-weight:bold;">
                            TOTAL ${emp.nombre}: ${empTotalHours}h | ${empTotalCost.toFixed(2)}€
                        </div>
                    </div>`;
                    
                    if (empTotalHours > 0) {
                        html += empHtml;
                        totalGlobal += empTotalCost;
                    }
                }

                html += `
                    <div class="card" style="background: var(--primary-dark); color: white; text-align: center;">
                        <h2 style="margin:0;">TOTAL GENERAL: ${totalGlobal.toFixed(2)}€</h2>
                        <small>${weekIdx === 'all' ? 'Mes completo' : 'Semana seleccionada'}</small>
                    </div>`;

                content.innerHTML = html || '<p class="empty-msg">No hay datos para este filtro.</p>';

            } catch (error) {
                console.error(error);
                content.innerHTML = '<p class="empty-msg">Error al generar informe.</p>';
            }
        },

        getPriceForDate: function(prices, date) {
            const sortedPrices = [...prices].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            const price = sortedPrices.find(p => p.start_date <= date);
            return price ? price.price_hour : 0;
        },

        getMonthNameShort: function(m) {
            return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m];
        }
    };

    window.HorariosApp.reports = reportsModule;
})();
