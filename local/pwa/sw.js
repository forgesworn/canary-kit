/* Only the public app shell is cached. Vault data stays in encrypted local storage. */
const VERSION = '__CANARY_VERSION__'
const CACHE = 'canary-shell-' + VERSION
const FILES = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    for (const file of FILES) {
      const response = await fetch(new Request(file, { cache: 'reload', credentials: 'omit', redirect: 'error' }))
      if (!response.ok) throw new Error('Canary offline installation incomplete')
      // A newer HTML page must never be cached under an older worker version.
      if (file === '/' && !await response.clone().text().then(text => text.includes('name="canary-build" content="' + VERSION + '"'))) throw new Error('Canary app and worker versions differ')
      await cache.put(file, response)
    }
  })())
})
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('canary-shell-') && key !== CACHE) await caches.delete(key)
    await self.clients.claim()
  })())
})
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.search || !FILES.includes(url.pathname)) return
  // Pin the complete public shell to this worker until all old windows close.
  // This avoids mixing a changed online page with an old offline app.
  event.respondWith((async () => {
    const cached = await (await caches.open(CACHE)).match(url.pathname)
    return cached || fetch(event.request)
  })())
})
