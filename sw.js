/* =========================================
   Cleveland Trip — Service Worker
   Strategy:
   - Pre-cache the app shell on install
   - Same-origin requests: cache-first, network fallback, runtime caching
   - Firebase / cross-origin: network-only (always live, no caching)
   ========================================= */

// IMPORTANT: bump this version any time you change app.js, styles.css,
// activities.js, or index.html — that's how clients know to fetch the
// new files instead of serving stale ones from cache.
const CACHE_VERSION = 'cle-trip-v7';
const CACHE_NAME = `${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './activities.js',
  './image-map.js',
  './firebase-config.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Install: pre-cache the shell. Use addAll with individual catches so a
// missing icon (before user generates them) doesn't fail the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      APP_SHELL.map(url =>
        cache.add(url).catch(err => console.warn('SW: skip caching', url, err))
      )
    );
    // Activate this SW immediately on first install
    await self.skipWaiting();
  })());
});

// Activate: clean up old caches, take control of open pages
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Fetch: route based on origin
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept Firebase / Google CDNs / map tiles / image hosts.
  const liveOrigins = [
    'firebaseio.com',
    'firebaseapp.com',
    'googleapis.com',
    'gstatic.com',
    'unpkg.com',                  // Leaflet
    'tile.openstreetmap.org',     // Map tiles
    'upload.wikimedia.org',       // Wikipedia images
    'images.pexels.com',          // Pexels images
    'images.unsplash.com'         // Unsplash images (in case used manually)
  ];
  if (liveOrigins.some(o => url.hostname.endsWith(o))) {
    return; // browser handles it normally
  }

  // Same-origin: cache-first, then network, with runtime caching
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        // Cache successful basic GETs in the background
        if (fresh && fresh.ok && fresh.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (err) {
        // Offline + nothing cached — last-resort fallback to root
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
        throw err;
      }
    })());
  }
});

// Listen for "skip waiting" message from the page (used when we deploy an update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
