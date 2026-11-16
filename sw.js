/* Service worker: caches the site so it opens offline once visited.
   The CACHE name is stamped by tools/stamp-assets.js on every build, so a new build replaces the old cache. */
const CACHE = 'mabdullah-vd1fcec9c';
const SHELL = [
    './', 'index.html', 'ar.html', 'offline.html', 'favicon.svg', 'manifest.webmanifest',
    'css/index.css?v=a5a6ad2822CSS__', 'img/icons.svg?v=38459a3ec4ICONS__', 'img/blueprint.svg',
    'img/portrait.webp', 'img/portrait.jpg', 'img/profile.jpg', 'img/cfps.png', 'img/pmp.png', 'img/sce.png',
    'fonts/barlow-latin-400-normal.woff2', 'fonts/barlow-latin-500-normal.woff2', 'fonts/barlow-latin-600-normal.woff2',
    'fonts/barlow-condensed-latin-600-normal.woff2', 'fonts/barlow-condensed-latin-700-normal.woff2', 'fonts/barlow-condensed-latin-800-normal.woff2',
    'fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', 'fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2',
    'fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', 'fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2',
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

    // Pages: network first so updates show, cached copy when offline
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('offline.html')))
        );
        return;
    }

    // Everything else: cache first, then network, remembering what we fetch
    event.respondWith(
        caches.match(request).then((cached) => cached || fetch(request).then((response) => {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
        }))
    );
});
