/**
 * Lógica de Limpieza y Exportación de Datos (Sin módulos)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    let oldDataCache = [];

    const cleanupModule = {
        init: function() {
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            document.getElementById('btn-export-cleanup').addEventListener('click', () => this.handleExportAndClean());
            document.getElementById('btn-delete-cleanup').addEventListener('click', () => this.handleDeleteOnly());
        },

        checkOldData: async function() {
            try {
                const today = new Date();
                // Fecha de corte: hace 12 meses
                const cutoffDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
                const cutoffStr = cutoffDate.toISOString().split('T')[0];

                const allHours = await window.HorariosApp.db.getAll('work_hours');
                oldDataCache = allHours.filter(h => h.date < cutoffStr);

                if (oldDataCache.length > 0) {
                    const firstDate = oldDataCache.sort((a, b) => a.date.localeCompare(b.date))[0].date;
                    const [y, m] = firstDate.split('-');
                    document.getElementById('cleanup-msg').innerHTML = 
                        `Se han detectado <strong>${oldDataCache.length}</strong> registros antiguos (anteriores a ${cutoffStr}). <br><br>¿Quieres exportarlos en CSV antes de borrarlos para liberar espacio?`;
                    
                    document.getElementById('modal-cleanup').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error al revisar datos antiguos:', error);
            }
        },

        handleExportAndClean: async function() {
            const csvContent = await this.generateCSV();
            const fileName = `horarios_backup_${new Date().toISOString().split('T')[0]}.csv`;

            try {
                // Intentar usar Web Share API
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([""], "test.csv", { type: "text/csv" })] })) {
                    const file = new File([csvContent], fileName, { type: 'text/csv' });
                    await navigator.share({
                        files: [file],
                        title: 'Backup de Horarios',
                        text: 'Archivo de backup de horas archivadas.'
                    });
                } else {
                    // Fallback a descarga normal
                    this.downloadCSV(csvContent, fileName);
                }

                await this.deleteOldData();
                document.getElementById('modal-cleanup').classList.add('hidden');
                window.HorariosApp.ui.showToast('Datos exportados y limpiados', 'success');
                if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();
            } catch (error) {
                console.error(error);
                window.HorariosApp.ui.showToast('Error en la exportación', 'error');
            }
        },

        handleDeleteOnly: async function() {
            if (confirm('¿Seguro que quieres borrar estos datos SIN exportarlos? Esta acción no se puede deshacer.')) {
                await this.deleteOldData();
                document.getElementById('modal-cleanup').classList.add('hidden');
                window.HorariosApp.ui.showToast('Datos antiguos eliminados', 'success');
                if (window.HorariosApp.calendar) window.HorariosApp.calendar.render();
            }
        },

        generateCSV: async function() {
            const employees = await window.HorariosApp.db.getAll('employees');
            const empMap = {};
            employees.forEach(e => empMap[e.id] = e.nombre);

            let csv = 'Fecha,Empleado,Horas\n';
            oldDataCache.sort((a, b) => a.date.localeCompare(b.date)).forEach(h => {
                csv += `${h.date},${empMap[h.employee_id] || 'Desconocido'},${h.hours}\n`;
            });
            return csv;
        },

        downloadCSV: function(content, fileName) {
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        deleteOldData: async function() {
            for (let h of oldDataCache) {
                await window.HorariosApp.db.remove('work_hours', h.id);
            }
            oldDataCache = [];
        }
    };

    window.HorariosApp.cleanup = cleanupModule;
})();
