import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import * as nip44 from 'nostr-tools/nip44'
import { bytesToHex, hexToBytes, sha256, hmacSha256, timingSafeStringEqual } from '../src/crypto.js'
import { readEntries, type Entry } from './entries.js'
import { isVouchLinkAddress } from './address.js'

const PURPOSE = 'canary:device-copy:1'
const LIFE = 900, CHUNK = 8000, MAX_PARTS = 24, MAX_PEOPLE = 180_000
export const DEVICE_FILE_LIMIT = 400_000
const encoder = new TextEncoder()
const hex = (v: unknown, length: number): v is string => typeof v === 'string' && new RegExp(`^[0-9a-f]{${length}}$`).test(v)
const time = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) >= 0 && (v as number) < 4_102_444_800
export interface DeviceRequest { v: 1; kind: 'device-request'; id: string; publicKey: string; created: number; expires: number }
export interface DeviceReceive { request: DeviceRequest; secret: string }
export interface Devices { receive?: DeviceReceive; send?: { file: string; count: number } }
interface Packet { v: 1; kind: 'device-copy'; id: string; to: string; from: string; created: number; expires: number; digest: string; parts: string[] }
const now = () => Math.floor(Date.now() / 1000)
function hash(text: string) { return bytesToHex(sha256(encoder.encode(text))) }
function manifest(key: Uint8Array, id: string, payload: string) { return bytesToHex(hmacSha256(key,encoder.encode(PURPOSE+':manifest:'+id+':'+payload))) }
export function readDeviceRequest(raw: unknown): DeviceRequest {
  const p = raw as DeviceRequest
  if (!p || p.v !== 1 || p.kind !== 'device-request' || !hex(p.id,32) || !hex(p.publicKey,64) || !time(p.created) || !time(p.expires) || p.expires - p.created !== LIFE) throw new Error('This is not a Canary device request.')
  return { v: 1, kind: 'device-request', id: p.id, publicKey: p.publicKey, created: p.created, expires: p.expires }
}
function active(request: DeviceRequest, at: number) {
  if (!time(at) || at < request.created - 30 || at > request.expires) throw new Error('This device request has expired or the clocks differ. Show a new QR on the receiving device.')
}
export function newDeviceRequest(at = now()): DeviceReceive {
  const secret = generateSecretKey()
  try { return { request: readDeviceRequest({ v: 1, kind: 'device-request', id: bytesToHex(crypto.getRandomValues(new Uint8Array(16))), publicKey: getPublicKey(secret), created: at, expires: at + LIFE }), secret: bytesToHex(secret) } }
  finally { secret.fill(0) }
}
function packet(input: string): Packet {
  if (typeof input !== 'string' || input.length > DEVICE_FILE_LIMIT) throw new Error('This is too large to be a Canary device copy.')
  const p = JSON.parse(input)
  if (!p || p.v !== 1 || p.kind !== 'device-copy' || !hex(p.id,32) || !hex(p.to,64) || !hex(p.from,64) || !hex(p.digest,64) || !time(p.created) || !time(p.expires) || p.expires - p.created !== LIFE || !Array.isArray(p.parts) || !p.parts.length || p.parts.length > MAX_PARTS || p.parts.some((s: unknown) => typeof s !== 'string' || s.length < 100 || s.length > 50_000)) throw new Error('This is not a supported Canary device copy.')
  return { v: 1, kind: 'device-copy', id: p.id, to: p.to, from: p.from, created: p.created, expires: p.expires, digest: p.digest, parts: p.parts }
}
export function deviceCode(file: string): string {
  const p = packet(file)
  return hash(JSON.stringify([PURPOSE,p.id,p.to,p.from,p.created,p.expires,p.digest,p.parts])).slice(0,12).match(/.{4}/g)!.join(' ')
}
/** Canonical recipient-encrypted packet; never a vault or plaintext pair. */
export function publicDeviceCopy(file: string): string { return JSON.stringify(packet(file)) }
function people(raw: unknown): Entry[] {
  const entries = readEntries(raw)
  if (!entries.length || entries.some(e => e.setup)) throw new Error('Choose saved people whose setup is complete.')
  if (new Set(entries.map(e => e.pair.mnemonic)).size !== entries.length) throw new Error('This copy contains duplicate pairs.')
  return entries
}
export function makeDeviceCopy(raw: DeviceRequest, selected: Entry[], at = now()): { file: string; code: string; count: number } {
  const request = readDeviceRequest(raw); active(request,at)
  const entries = people(selected), payload = JSON.stringify({v:1,entries})
  if (encoder.encode(payload).length > MAX_PEOPLE) throw new Error('Choose fewer people for this copy.')
  const secret = generateSecretKey()
  let key: Uint8Array | undefined
  try {
    const from = getPublicKey(secret)
    key = nip44.v2.utils.getConversationKey(secret,request.publicKey)
    const digest = manifest(key,request.id,payload)
    const total = Math.ceil(payload.length / CHUNK), parts: string[] = []
    if (total > MAX_PARTS) throw new Error('Choose fewer people for this copy.')
    for (let i = 0; i < total; i++) parts.push(nip44.v2.encrypt(JSON.stringify({purpose:PURPOSE,id:request.id,to:request.publicKey,from,created:request.created,expires:request.expires,digest,index:i,total,data:payload.slice(i*CHUNK,(i+1)*CHUNK)}),key))
    const file = JSON.stringify(packet(JSON.stringify({v:1,kind:'device-copy',id:request.id,to:request.publicKey,from,created:request.created,expires:request.expires,digest,parts})))
    return { file, code: deviceCode(file), count: entries.length }
  } finally { secret.fill(0); key?.fill(0) }
}
export function openDeviceCopy(receive: DeviceReceive, file: string, at = now()): Entry[] {
  const checked = readDevices({receive}).receive!, request = checked.request, p = packet(file)
  active(request,at)
  if (p.id !== request.id || p.to !== request.publicKey || p.created !== request.created || p.expires !== request.expires) throw new Error('This copy belongs to a different device request. Use the device that showed the QR.')
  const secret = hexToBytes(checked.secret)
  let key: Uint8Array | undefined
  try {
    key = nip44.v2.utils.getConversationKey(secret,p.from)
    const chunks = p.parts.map((ciphertext,index) => {
      const part = JSON.parse(nip44.v2.decrypt(ciphertext,key!))
      if (!part || part.purpose !== PURPOSE || part.id !== p.id || part.to !== p.to || part.from !== p.from || part.created !== p.created || part.expires !== p.expires || part.digest !== p.digest || part.index !== index || part.total !== p.parts.length || typeof part.data !== 'string' || part.data.length > CHUNK) throw new Error('This copy is incomplete or was changed. Send it again from the original device.')
      return part.data as string
    })
    const payload = chunks.join('')
    if (encoder.encode(payload).length > MAX_PEOPLE || !timingSafeStringEqual(manifest(key,p.id,payload),p.digest)) throw new Error('This copy did not pass its integrity check.')
    const data = JSON.parse(payload)
    if (!data || data.v !== 1) throw new Error('Unsupported people copy.')
    return people(data.entries)
  } finally { secret.fill(0); key?.fill(0) }
}
export function readDevices(raw: unknown): Devices {
  if (raw === undefined) return {}
  const p = raw as Devices
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Invalid saved device exchange.')
  const result: Devices = {}
  if (p.receive !== undefined) {
    const request = readDeviceRequest(p.receive.request)
    if (!hex(p.receive.secret,64)) throw new Error('Invalid saved device key.')
    const key = hexToBytes(p.receive.secret)
    try { if (getPublicKey(key) !== request.publicKey) throw new Error('Invalid saved device key.') }
    finally { key.fill(0) }
    result.receive = {request,secret:p.receive.secret}
  }
  if (p.send !== undefined) {
    const data = packet(p.send.file)
    if (!Number.isSafeInteger(p.send.count) || p.send.count < 1 || p.send.count > 200) throw new Error('Invalid saved device copy.')
    result.send = {file:JSON.stringify(data),count:p.send.count}
  }
  return result
}
export function mergePeople(existing: Entry[], imported: Entry[]): { entries: Entry[]; added: number; skipped: number } {
  const entries = readEntries(existing), incoming = people(imported)
  const seeds = new Set(entries.map(e=>e.pair.mnemonic)), ids = new Set(entries.map(e=>e.id))
  let added = 0, skipped = 0
  for (const item of incoming) {
    if (seeds.has(item.pair.mnemonic)) { skipped++; continue }
    const entry = {...item,id:ids.has(item.id)?crypto.randomUUID():item.id}
    entries.push(entry);ids.add(entry.id);seeds.add(entry.pair.mnemonic);added++
  }
  if (entries.length > 200) throw new Error(`This device has room for ${Math.max(0,200-existing.length)} more people. Choose fewer to import.`)
  return {entries,added,skipped}
}
export function deviceLink(request: DeviceRequest, address: string): string {
  const url = new URL(address)
  if (url.protocol !== 'https:' || url.search || url.username || url.password) throw new Error('Open the trusted HTTPS Canary address to share a device request.')
  url.hash = 'device=' + deviceToken(request)
  return url.href
}
export function deviceToken(raw: DeviceRequest): string {
  const r=readDeviceRequest(raw)
  return `CANARY-DEVICE:1:${r.id}:${r.publicKey}:${r.created}`
}
function requestToken(input: string): DeviceRequest {
  if(input.startsWith('{')) return readDeviceRequest(JSON.parse(input))
  const match=/^CANARY-DEVICE:1:([0-9a-f]{32}):([0-9a-f]{64}):(\d{1,10})$/.exec(input)
  if(!match)throw new Error('This is not a Canary device request.')
  const created=Number(match[3])
  return readDeviceRequest({v:1,kind:'device-request',id:match[1],publicKey:match[2],created,expires:created+LIFE})
}
export function deviceInput(input: string, address: string): DeviceRequest {
  if (typeof input !== 'string' || input.length > 3000) throw new Error('Invalid device request.')
  if (input.startsWith('{') || input.startsWith('CANARY-DEVICE:')) return requestToken(input)
  const url = new URL(input,address), expected = new URL(address)
  if (!isVouchLinkAddress(url, expected) || !url.hash.startsWith('#device=')) throw new Error('This device request belongs to a different website.')
  return requestToken(decodeURIComponent(url.hash.slice(8)))
}
