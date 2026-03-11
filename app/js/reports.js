/**
 * Lógica de Informes Mensuales (Sin módulos)
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
        },

        setupEventListeners: function() {
            document.getElementById('report-month').addEventListener('change', () => this.generateReport());
            document.getElementById('report-year').addEventListener('change', () => this.generateReport());
        },

        generateReport: async function() {
            const month = document.getElementById('report-month').value;
            const year = document.getElementById('report-year').value;
            const content = document.getElementById('reports-content');
            
            content.innerHTML = '<p class="empty-msg">Calculando...</p>';

            try {
                const employees = await window.HorariosApp.db.getAll('employees');
                const workHours = await window.HorariosApp.db.getAll('work_hours');
                const prices = await window.HorariosApp.db.getAll('price_hour');
                
                // Filtrar horas de este mes
                const monthStr = `${year}-${String(month).padStart(2, '0')}`;
                const monthlyHours = workHours.filter(h => h.date.startsWith(monthStr));

                if (monthlyHours.length === 0) {
                    content.innerHTML = '<p class="empty-msg">No hay horas registradas en este periodo.</p>';
                    return;
                }

                let totalGlobal = 0;
                let html = '<div class="card">';

                for (let emp of employees) {
                    const empHours = monthlyHours.filter(h => h.employee_id === emp.id);
                    if (empHours.length === 0) continue;

                    let empTotalCost = 0;
                    let empTotalHours = 0;

                    for (let h of empHours) {
                        const price = this.getPriceForDate(prices, h.date);
                        empTotalCost += h.hours * price;
                        empTotalHours += h.hours;
                    }

                    totalGlobal += empTotalCost;

                    html += `
                        <div class="report-row">
                            <div>
                                <strong>${emp.nombre}</strong><br>
                                <small>${empTotalHours} horas</small>
                            </div>
                            <div style="font-weight:bold;">${empTotalCost.toFixed(2)} €</div>
                        </div>
                    `;
                }

                html += `
                    <div class="report-total">
                        Total Periodo: ${totalGlobal.toFixed(2)} €
                    </div>
                </div>`;

                content.innerHTML = html;

            } catch (error) {
                console.error(error);
                content.innerHTML = '<p class="empty-msg">Error al generar informe.</p>';
            }
        },

        getPriceForDate: function(prices, date) {
            // Ordenar precios por fecha desc
            const sortedPrices = [...prices].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            // Buscar el primero que sea menor o igual a la fecha de la hora
            const price = sortedPrices.find(p => p.start_date <= date);
            return price ? price.price_hour : 0;
        }
    };

    window.HorariosApp.reports = reportsModule;
})();
