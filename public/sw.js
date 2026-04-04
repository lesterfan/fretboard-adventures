const CACHE_NAME = "fretboard-v3";
const BASE_PATH = "/fretboard-adventures/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(BASE_PATH)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navigation requests (HTML pages) — serve cached app shell, update in background
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(BASE_PATH).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(BASE_PATH, clone));
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Static assets — cache-first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Update cache in background
        fetch(event.request)
          .then((response) => {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, response),
            );
          })
          .catch(() => {});
        return cached;
      }
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) =>
          cache.put(event.request, clone),
        );
        return response;
      });
    }),
  );
});
