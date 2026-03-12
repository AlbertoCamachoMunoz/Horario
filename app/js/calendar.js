/**
 * Lógica del Calendario (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let currentDate = new Date();

    const calendarModule = {
        init: function() {
            this.setupEventListeners();
            this.render();
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

            document.getElementById('month-year-picker').addEventListener('click', () => {
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();
                // Aquí se podría abrir un selector rápido si se desea
            });
        },

        render: async function() {
            const grid = document.getElementById('calendar-grid');
            const monthLabel = document.getElementById('current-month-label');
            const yearLabel = document.getElementById('current-year-label');

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            monthLabel.textContent = monthNames[month];
            yearLabel.textContent = year;

            grid.innerHTML = '';

            // Cabecera de días
            const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
            days.forEach(d => {
                const div = document.createElement('div');
                div.className = 'calendar-day-head';
                div.textContent = d;
                grid.appendChild(div);
            });

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            // Ajuste para que empiece en lunes (0: dom, 1: lun...)
            let startDay = firstDay.getDay();
            startDay = (startDay === 0) ? 6 : startDay - 1;

            // Huecos antes del día 1
            for (let i = 0; i < startDay; i++) {
                grid.appendChild(document.createElement('div'));
            }

            try {
                // Obtener horas y notas del mes
                const allHours = await window.HorariosApp.db.getAll('work_hours');
                const allNotes = await window.HorariosApp.db.getAll('day_notes');

                for (let d = 1; d <= lastDay.getDate(); d++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const hasHours = allHours.some(h => h.date === dateStr);
                    const dayNotes = allNotes.filter(n => n.date === dateStr);

                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day';
                    
                    const isToday = this.isToday(year, month, d);
                    if (isToday) dayDiv.classList.add('today');
                    
                    const isFuture = this.isFuture(year, month, d);
                    if (isFuture) dayDiv.classList.add('future');
                    
                    // Lógica visual de notas (Stripes o Prioridad)
                    if (dayNotes.length > 0) {
                        dayDiv.classList.add('has-notes');
                        this.applyNotesBackground(dayDiv, dayNotes);
                    }

                    dayDiv.innerHTML = `<span class="day-num">${d}</span>`;
                    if (hasHours) {
                        const dot = document.createElement('div');
                        dot.className = 'has-hours';
                        dayDiv.appendChild(dot);
                    }

                    dayDiv.addEventListener('click', () => {
                        window.HorariosApp.hours.openDay(dateStr);
                    });

                    grid.appendChild(dayDiv);
                }
            } catch (error) {
                console.error(error);
            }
        },

        applyNotesBackground: function(element, notes) {
            const types = [...new Set(notes.map(n => n.type))]; // Colores únicos presentes
            const colors = {
                important: '#f44336', // Rojo
                alert: '#ffc107',     // Amarillo
                info: '#2196F3'       // Azul
            };

            // Orden de gravedad/prioridad
            const priority = ['important', 'alert', 'info'];
            
            // Ordenar tipos por prioridad
            types.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));

            if (notes.length > 3 || types.length > 3) {
                // Caso > 3 notas: Color de mayor gravedad sólido (al 20% opacidad para que no tape el número)
                const topType = types[0];
                element.style.backgroundColor = colors[topType] + '33'; // 33 es ~20% opacidad en HEX
                element.style.border = `1px solid ${colors[topType]}`;
            } else {
                // Caso 1-3 notas: Franjas verticales
                const stripeColors = types.map(t => colors[t]);
                
                if (stripeColors.length === 1) {
                    element.style.backgroundColor = stripeColors[0] + '33';
                    element.style.borderLeft = `4px solid ${stripeColors[0]}`;
                } else {
                    let gradient = 'linear-gradient(to right, ';
                    const step = 100 / stripeColors.length;
                    
                    stripeColors.forEach((color, i) => {
                        const start = i * step;
                        const end = (i + 1) * step;
                        // Usamos opacidad en el gradiente también para que se lea el número
                        const colorWithAlpha = color + '4D'; // 4D es ~30% opacidad
                        gradient += `${colorWithAlpha} ${start}%, ${colorWithAlpha} ${end}%${i < stripeColors.length - 1 ? ', ' : ''}`;
                    });
                    
                    gradient += ')';
                    element.style.background = gradient;
                }
            }
        },

        isToday: function(y, m, d) {
            const today = new Date();
            return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
        },

        isFuture: function(y, m, d) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const date = new Date(y, m, d);
            return date > today;
        }
    };

    window.HorariosApp.calendar = calendarModule;
})();
