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
// CACHE STRATEGY: cache-first with background revalidation for index.html.
//   - index.html: serve cached version immediately, then fetch fresh copy in
//     background. If the fresh copy differs, notify the page so user can reload.
//   - Everything else: cache-first with network fallback.
//   - This means the first load needs internet. Every load after is offline-capable.
//
// VERSION: bump CACHE_NAME (e.g. 'protocol-health-v8') when you deploy a major update.
// This forces old caches to be deleted and new files to be fetched fresh.

const CACHE_NAME = 'protocol-health-v14';

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

      // Critical files — these must be cached for the app to work offline.
      // Includes the migrations/ ES modules so the framework runs offline too.
      return cache.addAll([
        './app.html',
        './index.html',
        './manifest.json',
        './migrations/runner.js',
        './migrations/registry.js',
        './migrations/helpers.js'
      ])
        .then(() => {
          // Best-effort files — icons and Google Fonts
          // Promise.allSettled means one failure won't block the others
          return Promise.allSettled([
            './PH_LOGO_192.png',
            './PH_LOGO_512.png',
            './PH_ARROWS_LOGO.png',
            './favicon.ico',
            './favicon-32.png',
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
// After claiming clients, notify all open tabs that a new version is active.
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
    }).then(() => {
      // Notify all open pages that a new SW version just activated.
      // The page listens for this and shows a "tap to reload" banner.
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', cache: CACHE_NAME });
        });
      });
    })
  );
});

// ─── FETCH ───────────────────────────────────────────────────────────────────
// Intercepts every outgoing network request from the app.
// Strategy:
//   - index.html: stale-while-revalidate (serve cache, update in background)
//   - everything else: cache-first with network fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // index.html — stale-while-revalidate strategy
  // Serve cached version immediately for speed, then fetch fresh copy in background.
  // If the fresh copy is different, update the cache and notify the page.
  if(url.pathname.endsWith('app.html') || url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cached => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if(networkResponse && networkResponse.status === 200) {
              // Update the cache with the fresh version
              cache.put(event.request, networkResponse.clone());

              // If we had a cached version and served it, check if the new one differs
              // Stale-while-revalidate: cache is already updated above.
              // We do NOT notify the page here — header-based comparisons
              // (etag, content-length) produce false positives on CDN edge
              // servers (GitHub Pages). The reliable update signal is SW_UPDATED,
              // which fires only when CACHE_NAME changes in sw.js.
            }
            return networkResponse;
          }).catch(() => {
            // Network failed — if we have a cached version, it was already returned below
            // If no cache either, return offline response
            if(!cached) return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });

          // Return cached immediately if available, otherwise wait for network
          return cached || fetchPromise;
        });
      })
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
