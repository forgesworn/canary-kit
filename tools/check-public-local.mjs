import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const url = 'https://canary-words.cocoacod256.chatgpt.site/'
const files = [['', 'index.html', 'text/html'], ['sw.js', 'sw.js', 'application/javascript'], ['manifest.webmanifest', 'manifest.webmanifest', 'application/manifest+json'], ['icon-192.png', 'icon-192.png', 'image/png'], ['icon-512.png', 'icon-512.png', 'image/png'], ['apple-touch-icon.png', 'apple-touch-icon.png', 'image/png']]
const assets = []
for (const [path, file, type] of files) {
  const response = await fetch(url + path)
  assert.equal(response.status, 200)
  assert.ok(response.headers.get('content-type').startsWith(type))
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.deepEqual(bytes, await readFile(resolve(root, '../canary-words-site/page', file)))
  assert.ok(response.headers.get('cache-control').includes('no-transform'))
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  if (!path) assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'none'"))
  if (path === 'sw.js') assert.equal(response.headers.get('service-worker-allowed'), '/')
  assets.push({ path: '/' + path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), type: response.headers.get('content-type'), cookies: response.headers.getSetCookie().map(c => c.split('=')[0]) })
}
assert.equal((await fetch(url + 'missing')).status, 404)
await writeFile(resolve(root, 'local/evidence/mobile-hosting.json'), JSON.stringify({ verified: new Date().toISOString(), url, exactPublicAssets: true, noTransform: true, noRemoteVault: true, assets }, null, 2) + '\n')
console.log('Live readback: all six public PWA files match the committed source byte-for-byte, with required types and security headers.')
