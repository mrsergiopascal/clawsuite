// ClawSuite Service Worker
const CACHE_NAME = 'clawsuite-v3'
const API_CACHE = 'clawsuite-api-v3'

// Install event - skip app shell caching to avoid redirect loops with auth
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          }),
      )
    }),
  )
  // Take control immediately
  return self.clients.claim()
})

// Fetch event - network-first for API, cache-first for static assets only
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // NEVER intercept navigation requests (HTML pages) — let the server handle auth/redirects
  if (request.mode === 'navigate') return

  // Skip auth-related endpoints
  if (url.pathname.startsWith('/api/auth')) return

  // API calls - network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful, non-redirect responses
          if (response.ok && !response.redirected) {
            const responseClone = response.clone()
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache on network failure
          return caches.match(request)
        }),
    )
    return
  }

  // Static assets only - cache-first strategy (JS, CSS, images, fonts)
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse

        return fetch(request).then((response) => {
          if (response.ok && !response.redirected) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      }),
    )
    return
  }

  // Everything else — go to network, don't cache
})
