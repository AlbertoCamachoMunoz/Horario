/**
 * Gestión de Precios por Hora (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const pricesModule = {
        init: function() {
            this.setupEventListeners();
            this.loadPrices();
        },

        setupEventListeners: function() {
            const btnAdd = document.getElementById('btn-add-price');
            const formContainer = document.getElementById('form-price');
            const form = document.getElementById('price-form');
            const btnCancel = document.getElementById('btn-cancel-price');

            btnAdd.addEventListener('click', () => {
                form.reset();
                // Poner fecha de hoy por defecto
                document.getElementById('price-date').value = new Date().toISOString().split('T')[0];
                formContainer.classList.remove('hidden');
                btnAdd.classList.add('hidden');
            });

            btnCancel.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnAdd.classList.remove('hidden');
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.savePrice();
            });
        },

        savePrice: async function() {
            const data = {
                price_hour: parseFloat(document.getElementById('price-value').value),
                start_date: document.getElementById('price-date').value
            };

            try {
                await window.HorariosApp.db.add('price_hour', data);
                window.HorariosApp.ui.showToast('Precio guardado', 'success');
                
                document.getElementById('form-price').classList.add('hidden');
                document.getElementById('btn-add-price').classList.remove('hidden');
                await this.loadPrices();
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error al guardar precio', 'error');
            }
        },

        loadPrices: async function() {
            const listElement = document.getElementById('prices-list');
            try {
                const prices = await window.HorariosApp.db.getAll('price_hour');
                
                // Ordenar por fecha descendente (más reciente primero)
                prices.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

                if (prices.length === 0) {
                    listElement.innerHTML = '<p class="empty-msg">No hay precios definidos.</p>';
                    return;
                }

                listElement.innerHTML = '';
                prices.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'card price-card';
                    card.style.display = 'flex';
                    card.style.justifyContent = 'space-between';
                    card.style.alignItems = 'center';
                    
                    const dateParts = p.start_date.split('-');
                    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

                    card.innerHTML = `
                        <div>
                            <strong style="font-size: 1.2rem;">${p.price_hour} €/h</strong>
                            <div style="font-size: 0.8rem; color: #666;">Desde: ${formattedDate}</div>
                        </div>
                        <button class="btn-secondary" onclick="HorariosApp.prices.deletePrice(${p.id})">Eliminar</button>
                    `;
                    listElement.appendChild(card);
                });
            } catch (error) {
                listElement.innerHTML = '<p class="empty-msg">Error al cargar precios.</p>';
            }
        },

        deletePrice: async function(id) {
            if (confirm('¿Eliminar este precio?')) {
                await window.HorariosApp.db.remove('price_hour', id);
                await this.loadPrices();
            }
        }
    };

    window.HorariosApp.prices = pricesModule;
})();
