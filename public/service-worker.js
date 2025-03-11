const CACHE_NAME = "kjv-logo";
const URLS_TO_CACHE = [
    "index.html",
    "dist/kjv-logo.mjs",
    "data/kjv-logo.svg",
    "icon-192.png",
];
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
});
self.addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        try {
            const response = await fetch(event.request);
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
            });
            return response;
        }
        catch (e) {
            // If network fails, try to return a cached response
            return await caches.match(event.request)
                ?? new Response('Offline content unavailable', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain' }
                });
        }
    })());
});
