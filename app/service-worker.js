const CACHE_NAME = 'horarios-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'styles.css',
  'manifest.json',
  'logo.svg',
  'icon-192.png',
  'icon-512.png',
  'js/db.js',
  'js/ui.js',
  'js/calendar.js',
  'js/employees.js',
  'js/prices.js',
  'js/settings.js',
  'js/hours.js',
  'js/reports.js',
  'js/employee-detail.js',
  'js/cleanup.js',
  'js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
