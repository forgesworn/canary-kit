export const VOUCH_ADDRESS = 'https://vouch.mysignet.app/'
export const ORIGINAL_VOUCH_ADDRESS = 'https://canary-words.cocoacod256.chatgpt.site/'
const ownedOrigins = new Set([new URL(VOUCH_ADDRESS).origin, new URL(ORIGINAL_VOUCH_ADDRESS).origin])

/** Public transfer links only. Vaults and device credentials stay origin-bound. */
export function isVouchLinkAddress(received: URL, expected: URL): boolean {
  for (const url of [received, expected]) {
    if (url.protocol !== 'https:' || url.username || url.password || url.href.split('#', 1)[0].includes('?')) return false
  }
  if (received.origin === expected.origin && received.pathname === expected.pathname) return true
  return received.pathname === '/' && expected.pathname === '/'
    && ownedOrigins.has(received.origin) && ownedOrigins.has(expected.origin)
}
