import { build } from 'vite'
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm, mkdir, copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
await build({ configFile: resolve(root, 'vite.local.config.ts') })
let html = await readFile(resolve(root, 'dist-local/index.html'), 'utf8')
const scriptHashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(([, attrs]) => !attrs.includes('application/json'))
  .map(([, , body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
const styleHashes = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
  .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
if (scriptHashes.length !== 2 || styleHashes.length !== 1 || !html.includes('<!-- LOCAL_CSP -->')) {
  throw new Error('Unexpected standalone output; cannot install the restrictive content security policy.')
}
const csp = `default-src 'none'; script-src ${scriptHashes.join(' ')}; style-src ${styleHashes.join(' ')}; connect-src 'self'; worker-src 'self'; manifest-src 'self'; img-src 'self'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`
html = html.replace('<!-- LOCAL_CSP -->', `<meta http-equiv="Content-Security-Policy" content="${csp}">`)
const thirdParty = [
  ['Canary Kit', 'LICENSE'],
  ['Signet mark and app icons (ForgeSworn)', 'local/pwa/SIGNET-LICENSE'],
  ['Spoken Token', 'node_modules/spoken-token/LICENSE'],
  ['Scure BIP39', 'node_modules/@scure/bip39/LICENSE'],
  ['Scure Base', 'node_modules/@scure/base/LICENSE'],
  ['Noble Hashes', 'node_modules/@noble/hashes/LICENSE'],
  ['Noble Curves', 'node_modules/@noble/curves/LICENSE'],
  ['Noble Ciphers', 'node_modules/@noble/ciphers/LICENSE'],
  ['Nostr Tools (offline signing and encryption only)', 'node_modules/nostr-tools/LICENSE'],
  ['Nostr Attestations (offline data format)', 'node_modules/nostr-attestations/LICENSE'],
  ['QR Code Generator', 'node_modules/qrcode-generator/dist/qrcode.js'],
  ['jsQR (Apache-2.0)', 'node_modules/jsqr/LICENSE'],
]
const notices = await Promise.all(thirdParty.map(async ([name, path]) => {
  let content = await readFile(resolve(root, path), 'utf8')
  if (name === 'QR Code Generator') {
    const mit = await readFile(resolve(root, 'LICENSE'), 'utf8')
    content = content.slice(0, content.indexOf('var qrcode')) + '\n' + mit.slice(mit.indexOf('Permission is hereby granted'))
  }
  return `${name}\n${content}`
}))
const noticeText = notices.join('\n\n')
if (noticeText.includes('-->')) throw new Error('A bundled notice cannot safely be included as an HTML comment.')
html = html.replace('</body>', `<!--\nBundled software notices\n${noticeText}\n-->\n</body>`)
const version = createHash('sha256').update(html).digest('hex').slice(0, 20)
html = html.replace('</head>', `<meta name="canary-build" content="${version}"></head>`)
// A downloaded file cannot install a service worker or fetch a manifest.
const standalone = html.replace(/^[ \t]*<link rel="(?:manifest|apple-touch-icon)"[^>]*>\n?/gm, '')
await writeFile(resolve(root, 'canary-local.html'), standalone)
await mkdir(resolve(root, 'local-site'), { recursive: true })
await writeFile(resolve(root, 'local-site/index.html'), html)
for (const name of ['manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) await copyFile(resolve(root, 'local/pwa', name), resolve(root, 'local-site', name))
const worker = await readFile(resolve(root, 'local/pwa/sw.js'), 'utf8')
await writeFile(resolve(root, 'local-site/sw.js'), worker.replace('__CANARY_VERSION__', version))
await writeFile(resolve(root, 'local-site/_headers'), `/*\n  Content-Security-Policy: ${csp}; frame-ancestors 'none'\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Strict-Transport-Security: max-age=31536000\n  Permissions-Policy: camera=(self), microphone=(), geolocation=()\n  Cache-Control: no-cache, no-transform, must-revalidate\n`)
await rm(resolve(root, 'dist-local'), { recursive: true })
console.log(`canary-local.html ready (${Buffer.byteLength(html).toLocaleString()} bytes). Open it directly; no server needed.`)
console.log('local-site/ contains the static HTTPS deployment candidate; no runtime server or secrets are bundled.')
