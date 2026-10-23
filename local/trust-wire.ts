import * as nip44 from 'nostr-tools/nip44'
import { hexToBytes } from '../src/crypto.js'
import { publicKey, readTransfer, signed, type Group, type Transfer, type Signed, type Proof } from './trust.js'

type SealedContent = { kind: 'vouch'; event: Signed } | { kind: 'withdrawal'; event: Signed } | { kind: 'challenge'; event: Signed } | Proof
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
function b64(bytes: Uint8Array): string { let str = ''; for (const n of bytes) str += String.fromCharCode(n); return btoa(str).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '') }
function unb64(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('This transfer is damaged.')
  return Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0))
}
async function transform(bytes: Uint8Array, stream: CompressionStream | DecompressionStream, max: number) {
  const reader = new Blob([new Uint8Array(bytes).buffer]).stream().pipeThrough(stream).getReader()
  const chunks: Uint8Array[] = []; let size = 0
  try {
    while (true) { const next = await reader.read(); if (next.done) break; size += next.value.length; if (size > max) throw new Error('This transfer is too large.'); chunks.push(next.value) }
  } finally { await reader.cancel().catch(() => {}) }
  const result = new Uint8Array(size); let offset = 0
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length }
  return result
}
export async function packTransfer(transfer: Transfer): Promise<string> {
  const data = encoder.encode(JSON.stringify(readTransfer(transfer)))
  if (data.length > 16000) throw new Error('This transfer is too large.')
  return 'CANARY-TRUST:1:' + b64(await transform(data, new CompressionStream('deflate'), 10000))
}
export async function unpackTransfer(token: string): Promise<Transfer> {
  if (typeof token !== 'string' || token.length > 14000 || !token.startsWith('CANARY-TRUST:1:')) throw new Error('This is not a private Canary transfer.')
  const bytes = await transform(unb64(token.slice(15)), new DecompressionStream('deflate'), 16000)
  return readTransfer(JSON.parse(decoder.decode(bytes)))
}
export function transferLink(token: string, address: string): string {
  const url = new URL(address)
  if (url.protocol !== 'https:' || url.username || url.password || url.search) throw new Error('Use the clean HTTPS Canary address for a phone-camera link.')
  url.hash = 'trust=' + token
  return url.href
}
export function transferToken(input: string, address: string): string {
  if (input.startsWith('CANARY-TRUST:')) return input
  const expected = new URL(address), received = new URL(input)
  if (received.protocol !== 'https:' || received.origin !== expected.origin || received.pathname !== expected.pathname || received.search || received.username || received.password || !received.hash.startsWith('#trust=')) throw new Error('This private transfer belongs to another address.')
  return received.hash.slice(7)
}
export async function sealTransfer(group: Group, recipient: string, content: SealedContent): Promise<Transfer & { kind: 'sealed' }> {
  const json = encoder.encode(JSON.stringify(content))
  if (json.length > 12000) throw new Error('This private transfer is too large.')
  const plain = 'C1:' + b64(await transform(json, new CompressionStream('deflate'), 9000))
  const secret = hexToBytes(group.secret)
  let key: Uint8Array | undefined
  try {
    key = nip44.v2.utils.getConversationKey(secret, recipient)
    return { kind: 'sealed', from: publicKey(group), to: recipient, content: nip44.v2.encrypt(plain, key) }
  } finally { secret.fill(0); key?.fill(0) }
}
export async function openTransfer(group: Group, raw: Transfer): Promise<SealedContent> {
  const transfer = readTransfer(raw)
  if (transfer.kind !== 'sealed' || transfer.to !== publicKey(group)) throw new Error('This transfer is for another verification key. Use the phone or recovery backup that owns it.')
  const secret = hexToBytes(group.secret); let key: Uint8Array | undefined
  try {
    key = nip44.v2.utils.getConversationKey(secret, transfer.from)
    const plain = nip44.v2.decrypt(transfer.content, key)
    if (plain.length > 12000 || !plain.startsWith('C1:')) throw new Error('This transfer is too large or uses an unsupported format.')
    const json = await transform(unb64(plain.slice(3)), new DecompressionStream('deflate'), 12000)
    const data = JSON.parse(decoder.decode(json)) as SealedContent
    if (!['vouch', 'withdrawal', 'challenge', 'proof'].includes(data.kind)) throw new Error('Unsupported private-transfer purpose.')
    const event = signed(data.event)
    if (event.pubkey !== transfer.from) throw new Error('The sender does not match the signed proof.')
    return { kind: data.kind, event, ...('credential' in data && data.credential ? { credential: signed(data.credential) } : {}) } as SealedContent
  } finally { secret.fill(0); key?.fill(0) }
}
