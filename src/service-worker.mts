/// <reference lib="webworker" />
export type { };
declare const self: ServiceWorkerGlobalScope;

// Cache name with UUID placeholder (replaced at build time)
const CACHE_NAME = "kjv-logo-CACHE_UUID";
const URLS_TO_CACHE = [
    "index.html",
    "dist/kjv-logo.mjs",
    "data/kjv-logo.svg",
    "icon-192.png",
];

// Install event: Cache assets
self.addEventListener("install", (event: ExtendableEvent): void => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache: Cache) => cache.addAll(URLS_TO_CACHE))
    );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event: ExtendableEvent): void => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith("kjv-logo-") && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// Fetch event: Network-first with cache fallback
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
                return await caches.match(event.request) ?? 
                    new Response('Offline content unavailable', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain' }
                    });
            }
        })()
    );
});

// Handle skipWaiting message
self.addEventListener("message", (event: ExtendableMessageEvent) => {
    if (event.data && event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});