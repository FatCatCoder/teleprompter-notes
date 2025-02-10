self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('mysite-cache').then((cache) => {
        return cache.addAll([
          '/teleprompter-notes/',
          '/teleprompter-notes/index.html',
          '/teleprompter-notes/icon-192x192.png',
          '/teleprompter-notes/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  