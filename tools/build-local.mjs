import { build } from 'vite'
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
await build({ configFile: resolve(root, 'vite.local.config.ts') })
let html = await readFile(resolve(root, 'dist-local/index.html'), 'utf8')
const scriptHashes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(([, attrs]) => !attrs.includes('application/json'))
  .map(([, , body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
const styleHashes = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
  .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`)
if (scriptHashes.length !== 1 || styleHashes.length !== 1 || !html.includes('<!-- LOCAL_CSP -->')) {
  throw new Error('Unexpected standalone output; cannot install the restrictive content security policy.')
}
const csp = `default-src 'none'; script-src ${scriptHashes.join(' ')}; style-src ${styleHashes.join(' ')}; connect-src 'none'; img-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`
html = html.replace('<!-- LOCAL_CSP -->', `<meta http-equiv="Content-Security-Policy" content="${csp}">`)
const thirdParty = [
  ['Canary Kit', 'LICENSE'],
  ['Spoken Token', 'node_modules/spoken-token/LICENSE'],
  ['Scure BIP39', 'node_modules/@scure/bip39/LICENSE'],
  ['Scure Base', 'node_modules/@scure/base/LICENSE'],
  ['Noble Hashes', 'node_modules/@noble/hashes/LICENSE'],
]
const notices = await Promise.all(thirdParty.map(async ([name, path]) => `${name}\n${await readFile(resolve(root, path), 'utf8')}`))
html = html.replace('</body>', `<!--\nBundled software notices\n${notices.join('\n\n').replaceAll('--', '—')}\n-->\n</body>`)
await writeFile(resolve(root, 'canary-local.html'), html)
await rm(resolve(root, 'dist-local'), { recursive: true })
console.log(`canary-local.html ready (${Buffer.byteLength(html).toLocaleString()} bytes). Open it directly; no server needed.`)
