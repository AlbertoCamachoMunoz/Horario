/**
 * Funciones de UI comunes (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const uiModule = {
        toggleMenu: function() {
            const menu = document.getElementById('side-menu');
            menu.classList.toggle('active');
        },

        showToast: function(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            toast.style.padding = '10px 20px';
            toast.style.margin = '10px';
            toast.style.borderRadius = '5px';
            toast.style.color = 'white';
            toast.style.backgroundColor = type === 'error' ? '#f44336' : (type === 'success' ? '#4CAF50' : '#2196F3');
            toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            
            if (!container.style.position) {
                container.style.position = 'fixed';
                container.style.bottom = '20px';
                container.style.width = '100%';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.zIndex = '10001';
            }

            container.appendChild(toast);
            setTimeout(() => toast.style.opacity = '1', 10);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        switchView: function(viewId) {
            const menu = document.getElementById('side-menu');
            menu.classList.remove('active');

            const views = document.querySelectorAll('.view');
            views.forEach(view => view.classList.remove('active'));

            const targetView = document.getElementById(`view-${viewId}`);
            if (targetView) {
                targetView.classList.add('active');
                console.log(`Cambiado a vista: ${viewId}`);
            }
        }
    };

    window.HorariosApp.ui = uiModule;
})();
