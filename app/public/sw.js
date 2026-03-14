// sw.js — CANARY service worker: offline caching + push notifications

const CACHE_NAME = 'canary-v1'

// Cache app shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['./', './index.html', './manifest.json', './theme-init.js'])
    )
  )
  self.skipWaiting()
})

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first for navigation, cache-first for hashed assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    )
    return
  }
  // Cache-first for Vite's content-hashed assets (immutable)
  if (request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
      )
    )
    return
  }
  // Network-first for everything else
  event.respondWith(fetch(request).catch(() => caches.match(request)))
})

// Push notification handler — wakes the SW when push server sends a message
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'CANARY Alert'
  const options = {
    body: data.body || 'Something needs your attention.',
    icon: './icon-192.svg',
    badge: './icon-192.svg',
    tag: data.tag || 'canary-alert',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || './' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Open app when notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || './'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
