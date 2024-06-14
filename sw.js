const version = 1;
const cacheName = `shah0150-${version}`;
const staticFiles = [
  // Add your static files here
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  // Add other files that you want to cache initially
];

self.addEventListener('install', (ev) => {
    ev.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(staticFiles);
        })
    );
});

self.addEventListener('activate', (ev) => {
    ev.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (ev) => {
    ev.respondWith(cacheFirstAndSave(ev));
});

function cacheFirst(ev) {
    // Try cache then fetch
    return caches.match(ev.request).then((cacheResponse) => {
        return cacheResponse || fetch(ev.request);
    });
}

function cacheFirstAndSave(ev) {
    return caches.match(ev.request).then((cacheResponse) => {
        if (cacheResponse) {
            return cacheResponse;
        }
        return fetch(ev.request).then((networkResponse) => {
            return caches.open(cacheName).then((cache) => {
                cache.put(ev.request, networkResponse.clone());
                return networkResponse;
            });
        });
    }).catch(() => {
        return response404();
    });
}

function response404() {
    // Any generic 404 error that we want to generate
    return new Response(null, { status: 404 });
}
