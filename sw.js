const CACHE = 'ketotrack-v1';
const APP_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './foods.js',
  './icon.svg',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always fetch USDA API live — never cache it
  if (e.request.url.includes('api.nal.usda.gov')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for all app files
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
