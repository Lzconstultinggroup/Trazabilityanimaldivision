const CACHE_NAME = 'trazabilidad-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch((err) => {
          console.warn('⚠️ Error al hacer fetch:', event.request.url, err);
          return new Response('', { status: 404 });
        });
      })
    );
  });
  