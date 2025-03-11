/// <reference lib="webworker" />
export type { };
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "kjv-logo";
const URLS_TO_CACHE = [
    "index.html",
    "dist/kjv-logo.mjs",
    "data/kjv-logo.svg",
    "icon-192.png",
];

self.addEventListener("install", (event: ExtendableEvent): void => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache: Cache) => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener("fetch", (event: FetchEvent): void => {
    event.respondWith(
        (async (): Promise<Response> => {
            try {
                const response = await fetch(event.request);
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache: Cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            } catch (e) {
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