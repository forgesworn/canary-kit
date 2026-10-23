import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import * as nip44 from 'nostr-tools/nip44'
import { bytesToHex, hexToBytes } from '../src/crypto.js'
import { createPair, readPair, type Pair } from './model.js'
import { isVouchLinkAddress } from './address.js'

type Offer = { v: 1; type: 'offer'; id: string; pub: string; method?: 'in-person' }
type Reply = { v: 1; type: 'reply'; id: string; pub: string; box: string; method?: 'in-person' }
export interface Exchange { id: string; label: string; secret: string; invite: string }
const hex = (value: unknown, size: number): value is string => typeof value === 'string' && new RegExp(`^[0-9a-f]{${size}}$`).test(value)

export function readConnect(input: string): Offer | Reply {
  if (typeof input !== 'string' || input.length > 3000) throw new Error('This is not a Canary connection link.')
  const p = JSON.parse(input)
  if (!p || p.v !== 1 || !['offer', 'reply'].includes(p.type) || !hex(p.id, 32) || !hex(p.pub, 64)) throw new Error('Invalid Canary connection link.')
  if (p.method !== undefined && p.method !== 'in-person') throw new Error('Unsupported connection method.')
  const method = p.method ? { method: 'in-person' as const } : {}
  if (p.type === 'offer') return { v: 1, type: 'offer', id: p.id, pub: p.pub, ...method }
  if (typeof p.box !== 'string' || p.box.length < 100 || p.box.length > 2000) throw new Error('Invalid encrypted reply.')
  return { v: 1, type: 'reply', id: p.id, pub: p.pub, box: p.box, ...method }
}
export function readExchange(raw: unknown): Exchange {
  const p = raw as Exchange
  if (!p || !hex(p.id, 32) || !hex(p.secret, 64) || typeof p.label !== 'string' || !p.label.trim() || p.label.length > 60) throw new Error('Invalid saved connection.')
  const invite = readConnect(p.invite)
  const secret = hexToBytes(p.secret)
  try {
    if (invite.type !== 'offer' || invite.id !== p.id || invite.pub !== getPublicKey(secret)) throw new Error('Invalid saved connection key.')
    return { id: p.id, label: p.label, secret: p.secret, invite: JSON.stringify(invite) }
  } finally { secret.fill(0) }
}
export function beginConnect(label: string, method: 'in-person' | 'trusted-call' = 'trusted-call'): Exchange {
  if (!['in-person', 'trusted-call'].includes(method)) throw new Error('Choose how to exchange the invitation.')
  const secret = generateSecretKey()
  try {
    const id = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
    return readExchange({ id, label, secret: bytesToHex(secret), invite: JSON.stringify({ v: 1, type: 'offer', id, pub: getPublicKey(secret), ...(method === 'in-person' ? { method } : {}) }) })
  } finally { secret.fill(0) }
}
export function acceptConnect(input: string): { pair: Pair; reply: string } {
  const offer = readConnect(input)
  if (offer.type !== 'offer') throw new Error('Open an invitation to make a reply.')
  const secret = generateSecretKey(), pair = createPair()
  let key: Uint8Array | undefined
  try {
    const pub = getPublicKey(secret)
    key = nip44.v2.utils.getConversationKey(secret, offer.pub)
    const box = nip44.v2.encrypt(JSON.stringify({ v: 1, purpose: 'canary:connect:1', id: offer.id, to: offer.pub, from: pub, pair, ...(offer.method ? { method: offer.method } : {}) }), key)
    return { pair: { ...pair, role: 'second' }, reply: JSON.stringify({ v: 1, type: 'reply', id: offer.id, pub, box, ...(offer.method ? { method: offer.method } : {}) }) }
  } finally { secret.fill(0); key?.fill(0) }
}
export function finishConnect(raw: Exchange, input: string): Pair {
  const draft = readExchange(raw), reply = readConnect(input), offer = readConnect(draft.invite)
  if (reply.type !== 'reply' || reply.id !== draft.id) throw new Error('This reply belongs to another invitation. Open the matching saved invitation.')
  const secret = hexToBytes(draft.secret)
  let key: Uint8Array | undefined
  try {
    key = nip44.v2.utils.getConversationKey(secret, reply.pub)
    const p = JSON.parse(nip44.v2.decrypt(reply.box, key))
    if (p.v !== 1 || p.purpose !== 'canary:connect:1' || p.id !== draft.id || p.to !== offer.pub || p.from !== reply.pub || p.method !== offer.method || reply.method !== offer.method) throw new Error('Invalid encrypted connection reply.')
    const pair = readPair(p.pair)
    if (pair.role !== 'first') throw new Error('Invalid connection direction.')
    return pair
  } finally { secret.fill(0); key?.fill(0) }
}
export function connectLink(input: string, address: string): string {
  const url = new URL(address)
  if (url.protocol !== 'https:' || url.search || url.username || url.password) throw new Error('Sharing needs the trusted HTTPS website address.')
  url.hash = 'connect=' + encodeURIComponent(JSON.stringify(readConnect(input)))
  return url.href
}
export function connectInput(input: string, address: string): string {
  if (input.length > 6000) throw new Error('This connection link is too large.')
  if (input.startsWith('{')) return JSON.stringify(readConnect(input))
  const url = new URL(input, address), expected = new URL(address)
  if (!isVouchLinkAddress(url, expected) || !url.hash.startsWith('#connect=')) throw new Error('Open a connection link from the trusted Canary address.')
  return JSON.stringify(readConnect(decodeURIComponent(url.hash.slice(9))))
}
