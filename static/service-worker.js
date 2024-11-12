const CACHE_NAME = 'v2';
const ASSETS_TO_CACHE = ['/', '/favicon.ico'];

// Installation event to cache the required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// Activation event to clear old caches if there's a version change
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serves files from cache if available, otherwise fetches from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Serve from cache if available, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(() => caches.match('/index.html')) 
  );
});
