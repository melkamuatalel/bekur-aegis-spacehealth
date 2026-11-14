// BEKUR-Aegis Offline Spaceflight Service Worker (v3 - Bulletproof Resilient)
// Enables 100% offline mission avionics operation during deep-space comms blackout

const CACHE_NAME = 'bekur-aegis-spaceflight-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bekur-logo.svg',
  '/favicon.ico',
  '/sample-astronaut-telemetry.json',
  '/sample-astronaut-telemetry.csv',
];

self.addEventListener('install', (event) => {
  // Use Promise.allSettled so a single missing asset NEVER causes install failure
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[BEKUR SW] Cache add error for ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[BEKUR SW] Purging obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (HTML document / page reloads)
  if (
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone.clone());
              cache.put('/', clone.clone());
              cache.put('/index.html', clone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // OFFLINE: Return cached root or index.html immediately
          const cached =
            (await caches.match(event.request)) ||
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><title>BEKUR-AEGIS Avionics Offline</title></head><body><h1>BEKUR-AEGIS Avionics Offline</h1><p>Cache standby active.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. All Static Assets (JS, CSS, SVGs, Images, JSON telemetry, Fonts)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached immediately; optionally revalidate in background if online
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache for offline avionics use
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache internal origin and assets
          if (
            url.origin === self.location.origin ||
            url.pathname.startsWith('/assets/') ||
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.svg') ||
            url.pathname.endsWith('.json') ||
            url.pathname.endsWith('.png') ||
            url.pathname.endsWith('.jpg')
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // If offline and request missing, fallback to generic match if exists
          return caches.match(event.request);
        });
    })
  );
});
