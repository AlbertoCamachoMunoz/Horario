/**
 * Capa de base de datos utilizando IndexedDB (Sin módulos para soporte file://)
 */

window.HorariosApp = window.HorariosApp || {};

(function() {
    const DB_NAME = 'HorariosDB';
    const DB_VERSION = 1;
    let db;

    const dbModule = {
        initDb: function() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = (event) => {
                    console.error('Error al abrir la base de datos', event);
                    reject('Error al abrir la base de datos');
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    console.log('Base de datos abierta con éxito');
                    resolve(db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    if (!db.objectStoreNames.contains('employees')) {
                        const employeeStore = db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
                        employeeStore.createIndex('nombre', 'nombre', { unique: false });
                        employeeStore.createIndex('activo', 'activo', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('work_hours')) {
                        const workHoursStore = db.createObjectStore('work_hours', { keyPath: 'id', autoIncrement: true });
                        workHoursStore.createIndex('employee_id', 'employee_id', { unique: false });
                        workHoursStore.createIndex('date', 'date', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('price_hour')) {
                        const priceHourStore = db.createObjectStore('price_hour', { keyPath: 'id', autoIncrement: true });
                        priceHourStore.createIndex('start_date', 'start_date', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('settings')) {
                        db.createObjectStore('settings', { keyPath: 'key' });
                    }

                    console.log('Estructura de base de datos creada/actualizada');
                };
            });
        },

        getAll: function(storeName) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(`Error al obtener datos de ${storeName}`);
            });
        },

        getById: function(storeName, id) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(`Error al obtener id ${id} de ${storeName}`);
            });
        },

        add: function(storeName, data) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.add(data);
                request.onsuccess = (event) => resolve(event.target.result);
                request.onerror = () => reject(`Error al añadir datos a ${storeName}`);
            });
        },

        update: function(storeName, data) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(data);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(`Error al actualizar datos en ${storeName}`);
            });
        },

        remove: function(storeName, id) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(id);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(`Error al eliminar id ${id} de ${storeName}`);
            });
        },

        getByIndex: function(storeName, indexName, value) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const index = store.index(indexName);
                const request = index.getAll(value);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(`Error al buscar por índice ${indexName} en ${storeName}`);
            });
        }
    };

    window.HorariosApp.db = dbModule;
})();
