/**
 * Lógica del Calendario (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let currentDate = new Date();

    const calendarModule = {
        init: function() {
            this.render();
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            document.getElementById('prev-month').addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                this.render();
            });

            document.getElementById('next-month').addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                this.render();
            });
        },

        render: async function() {
            const monthLabel = document.getElementById('current-month-label');
            const yearLabel = document.getElementById('current-year-label');
            const gridElement = document.getElementById('calendar-grid');
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            
            monthLabel.textContent = monthNames[month];
            yearLabel.textContent = year;

            gridElement.innerHTML = '';

            const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
            dayNames.forEach(day => {
                const dayHead = document.createElement('div');
                dayHead.className = 'calendar-day-head';
                dayHead.textContent = day;
                gridElement.appendChild(dayHead);
            });

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Buscar días con horas en este mes
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const allHours = await window.HorariosApp.db.getAll('work_hours');
            const daysWithHours = new Set(allHours.filter(h => h.date.startsWith(monthStr)).map(h => h.date));

            for (let i = 0; i < adjustedFirstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                gridElement.appendChild(emptyDay);
            }

            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayElement.classList.add('today');
                }

                let html = `<span class="day-num">${day}</span>`;
                if (daysWithHours.has(dateStr)) {
                    html += `<div class="has-hours"></div>`;
                }
                dayElement.innerHTML = html;
                
                dayElement.addEventListener('click', () => {
                    if (window.HorariosApp.hours) {
                        window.HorariosApp.hours.openDay(dateStr);
                    }
                });

                gridElement.appendChild(dayElement);
            }
        }
    };

    window.HorariosApp.calendar = calendarModule;
})();
