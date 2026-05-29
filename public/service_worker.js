const CACHE_NAME = 'occam-spm';
const urlsToCache = [];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (
    url.includes('/@vite/') ||
    url.includes('@react-refresh') ||
    url.includes('/node_modules/') ||
    url.includes('/api/')
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return new Response('Offline');
        })
      );
    }),
  );
});
