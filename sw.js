// ─── SERVICE WORKER — Protocol Health ────────────────────────────────────────
// A service worker is a background script that runs separately from the main app.
// Its job here is to intercept network requests and serve cached files instead,
// so the app works fully offline after the first load.
//
// LIFECYCLE:
//   1. INSTALL  — browser downloads this file and runs the install event.
//                 We cache all the core files here.
//   2. ACTIVATE — old service workers (from previous versions) are cleaned up.
//                 We delete stale caches here.
//   3. FETCH    — every network request the app makes passes through here.
//                 We intercept and return cached responses where available.
//
// CACHE STRATEGY: cache-first.
//   - Check cache first. If found, return immediately (fast, works offline).
//   - If not cached, fetch from network, cache the response, return it.
//   - This means the first load needs internet. Every load after is offline-capable.
//
// VERSION: bump CACHE_NAME (e.g. 'protocol-health-v6') when you deploy a major update.
// This forces old caches to be deleted and new files to be fetched fresh.

const CACHE_NAME = 'protocol-health-v6';

// ─── INSTALL ─────────────────────────────────────────────────────────────────
// Runs once when the service worker is first registered (or when CACHE_NAME changes).
// We open a cache and store the app's core files.
//
// Split into two groups:
//   - Critical (index.html, manifest.json): must succeed or install fails
//   - Best-effort (icons, fonts): cached if available, silently skipped if not
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {

      // Critical files — these must be cached for the app to work offline
      return cache.addAll(['./index.html', './manifest.json'])
        .then(() => {
          // Best-effort files — icons and Google Fonts
          // Promise.allSettled means one failure won't block the others
          return Promise.allSettled([
            './icon-192.png',
            './icon-512.png',
            'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap'
          ].map(url => cache.add(url).catch(() => {
            // Silently skip if a non-critical file can't be cached (e.g. no internet at install time)
          })));
        });

    }).then(() => {
      // skipWaiting: activate this new service worker immediately instead of waiting
      // for all existing tabs to close first
      return self.skipWaiting();
    })
  );
});

// ─── ACTIVATE ────────────────────────────────────────────────────────────────
// Runs after install. We delete any old caches (different CACHE_NAME values)
// so stale files from previous versions don't linger on the device.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      // Delete every cache that isn't the current version
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => {
      // clients.claim: take control of all open tabs immediately
      // (without this, the new SW only controls tabs opened after activation)
      return self.clients.claim();
    })
  );
});

// ─── FETCH ───────────────────────────────────────────────────────────────────
// Intercepts every outgoing network request from the app.
// Strategy: cache-first for local assets, with network fallback.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Special case: always try cache first for the main HTML file.
  // If not cached yet (first load), fall through to network.
  if(url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Default: cache-first for everything else (icons, fonts, manifest)
  event.respondWith(
    caches.match(event.request).then(cached => {

      // Cache hit — return immediately, no network needed
      if(cached) return cached;

      // Cache miss — fetch from network
      return fetch(event.request).then(response => {
        // Cache the response for next time (only cache valid 200 responses)
        if(response && response.status === 200) {
          const responseClone = response.clone(); // response body can only be read once — clone it
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;

      }).catch(() => {
        // Network failed AND not in cache — return a minimal offline response.
        // The app itself handles missing data gracefully, so this rarely surfaces.
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });

    })
  );
});
