import { readEntries, type Entry } from './entries.js'
export type { Entry } from './entries.js'
import { emptyTrust, readTrust, type TrustState } from './trust.js'
import { readExchange, type Exchange } from './connect.js'
import { readDevices, type Devices } from './device-transfer.js'
import { readMeetings, pairFromMeeting, type Meeting } from './meet.js'
import { nativeAvailable, nativeOrigin, nativeCreateKey, nativeKey } from './native.js'
import { hmacSha256 } from '../src/crypto.js'

const ROUNDS = 600_000
export const MAX_VAULT_BYTES = 1_048_576
const MAX_BYTES = MAX_VAULT_BYTES
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
interface Box { iv: string; ciphertext: string }
export interface VaultRecord {
  v: 1
  id: string
  password?: { salt: string; rounds: number; box: Box }
  device?: { credential: string; input: string; origin: string; box: Box }
  data: Box
}
export interface Vault { record: VaultRecord; master: Uint8Array; entries: Entry[]; trust: TrustState; exchanges?: Exchange[]; devices?: Devices; meetings?: Meeting[] }

function checkMeetings(entries:Entry[],meetings:Meeting[]) {
  for(const entry of entries)if(entry.setup?.meeting){
    const meeting=meetings.find(m=>m.id===entry.setup!.meeting)
    if(!meeting?.peerReveal||meeting.id!==entry.id)throw new Error('The saved connection does not match its pending pair.')
    const pair=pairFromMeeting(meeting)
    if(pair.mnemonic!==entry.pair.mnemonic||pair.role!==entry.pair.role)throw new Error('The saved connection does not match its pending pair.')
  }
  for(const meeting of meetings)if(meeting.peerReveal&&!entries.some(e=>e.id===meeting.id&&e.setup?.meeting===meeting.id))throw new Error('An unfinished connection is missing its saved pair.')
}

function random(size: number): Uint8Array { return crypto.getRandomValues(new Uint8Array(size)) }
function bytes(input: Uint8Array): ArrayBuffer { return new Uint8Array(input).buffer }
function b64(input: Uint8Array): string {
  let value = ''
  for (let i = 0; i < input.length; i += 8192) value += String.fromCharCode(...input.subarray(i, i + 8192))
  return btoa(value)
}
function unb64(input: unknown, max = MAX_BYTES): Uint8Array {
  if (typeof input !== 'string' || input.length > max * 2 || !/^[A-Za-z0-9+/]*={0,2}$/.test(input)) throw new Error('Invalid encrypted vault.')
  try {
    const result = Uint8Array.from(atob(input), char => char.charCodeAt(0))
    if (result.length > max) throw new Error('Too large')
    return result
  } catch { throw new Error('Invalid encrypted vault.') }
}
function aad(id: string, purpose: string) { return encoder.encode(`canary:vault:1:${id}:${purpose}`) }
async function aes(raw: Uint8Array) {
  return crypto.subtle.importKey('raw', bytes(raw), 'AES-GCM', false, ['encrypt', 'decrypt'])
}
async function encrypt(key: CryptoKey, data: Uint8Array, id: string, purpose: string): Promise<Box> {
  const iv = random(12)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: bytes(iv), additionalData: aad(id, purpose) }, key, bytes(data))
  return { iv: b64(iv), ciphertext: b64(new Uint8Array(ciphertext)) }
}
async function decrypt(key: CryptoKey, box: Box, id: string, purpose: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(unb64(box.iv, 12)), additionalData: aad(id, purpose) }, key, bytes(unb64(box.ciphertext))))
}
async function passwordKey(password: string, salt: string) {
  if (typeof password !== 'string' || password.length > 200) throw new Error('Enter your vault passphrase.')
  const data = encoder.encode(password)
  try {
    const material = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveKey'])
    return await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(unb64(salt, 16)), iterations: ROUNDS, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  } finally { data.fill(0) }
}

function checkBox(raw: unknown): Box {
  const box = raw as Box
  if (!box || unb64(box.iv, 12).length !== 12 || unb64(box.ciphertext).length < 16) throw new Error('Invalid encrypted vault.')
  return { iv: box.iv, ciphertext: box.ciphertext }
}
export function parseVault(text: string): VaultRecord {
  if (typeof text !== 'string' || text.length > MAX_BYTES) throw new Error('This backup is too large or is not a Canary vault.')
  const data = JSON.parse(text) as VaultRecord
  if (!data || data.v !== 1 || typeof data.id !== 'string' || !/^[0-9a-f]{32}$/.test(data.id)
    || (!data.password && !data.device)) throw new Error('This is not a supported Canary vault.')
  const record: VaultRecord = {
    v: 1, id: data.id,
    data: checkBox(data.data),
  }
  if (data.password) {
    if (data.password.rounds !== ROUNDS || unb64(data.password.salt, 16).length !== 16) throw new Error('This is not a supported Canary vault.')
    record.password = { salt: data.password.salt, rounds: ROUNDS, box: checkBox(data.password.box) }
  }
  if (data.device) {
    if (unb64(data.device.credential, 1024).length === 0 || unb64(data.device.input, 32).length !== 32
      || typeof data.device.origin !== 'string' || data.device.origin.length > 300) throw new Error('Invalid device-unlock record.')
    record.device = { credential: data.device.credential, input: data.device.input, origin: data.device.origin, box: checkBox(data.device.box) }
  }
  return record
}

async function opened(record: VaultRecord, master: Uint8Array): Promise<Vault> {
  try {
    if (master.length !== 32) throw new Error('Invalid vault key')
    const data = await decrypt(await aes(master), record.data, record.id, 'data')
    try {
      const parsed = JSON.parse(decoder.decode(data))
      if (Array.isArray(parsed)) return { record, master, entries: readEntries(parsed), trust: emptyTrust() }
      if (!parsed || ![2, 3, 4, 5, 6].includes(parsed.v)) throw new Error('Unsupported encrypted vault payload.')
      if (parsed.exchanges !== undefined && (!Array.isArray(parsed.exchanges) || parsed.exchanges.length > 16)) throw new Error('Invalid saved connections.')
      const exchanges = (parsed.exchanges ?? []).map(readExchange) as Exchange[]
      if (new Set(exchanges.map(e => e.id)).size !== exchanges.length) throw new Error('Duplicate saved connections.')
      const entries=readEntries(parsed.entries),meetings=readMeetings(parsed.meetings);checkMeetings(entries,meetings)
      return { record, master, entries, trust: readTrust(parsed.trust), exchanges, devices: readDevices(parsed.devices), meetings }
    }
    finally { data.fill(0) }
  } catch (e) { master.fill(0); throw e }
}

export async function createVault(password: string): Promise<Vault> {
  if (password.trim().length < 14 || password.length > 200) throw new Error('Use at least 14 characters. Several random words are easier to remember.')
  const id = [...random(16)].map(byte => byte.toString(16).padStart(2, '0')).join('')
  const salt = b64(random(16))
  const master = random(32)
  try {
    const box = await encrypt(await passwordKey(password, salt), master, id, 'password')
    const data = await encrypt(await aes(master), encoder.encode('[]'), id, 'data')
  return { record: { v: 1, id, password: { salt, rounds: ROUNDS, box }, data }, master, entries: [], trust: emptyTrust() }
  } catch (e) { master.fill(0); throw e }
}
export async function unlockVault(record: VaultRecord, password: string): Promise<Vault> {
  try {
    if (!record.password) throw new Error('No passphrase slot')
    const master = await decrypt(await passwordKey(password, record.password.salt), record.password.box, record.id, 'password')
    return await opened(record, master)
  } catch { throw new Error('Could not unlock. Check the passphrase and that this backup is intact.') }
}
export async function addRecoveryPassphrase(vault: Vault, password: string): Promise<VaultRecord> {
  if (password.trim().length < 14 || password.length > 200) throw new Error('Use at least 14 characters. Several random words are easier to remember.')
  const salt = b64(random(16))
  const box = await encrypt(await passwordKey(password, salt), vault.master, vault.record.id, 'password')
  return { ...vault.record, password: { salt, rounds: ROUNDS, box } }
}
export async function sealEntries(vault: Vault, entries: Entry[], trust = vault.trust): Promise<VaultRecord> {
  const checked = readEntries(entries)
  const exchanges = vault.exchanges ?? []
  if (exchanges.length > 16) throw new Error('Finish or remove an existing invitation first.')
  const checkedExchanges = exchanges.map(readExchange)
  if (new Set(checkedExchanges.map(e => e.id)).size !== checkedExchanges.length) throw new Error('Duplicate saved connections.')
  // Old app builds must refuse this payload rather than silently drop pending
  // exchange keys or unconfirmed setup state on their next save.
  const contents = { entries: checked, trust: readTrust(trust), exchanges: checkedExchanges }
  if (encoder.encode(JSON.stringify(contents)).length > 160_000) throw new Error('This local vault is full. Back up your data before removing old records.')
  const meetings=readMeetings(vault.meetings);checkMeetings(checked,meetings)
  const data = encoder.encode(JSON.stringify({ v: 6, ...contents, devices: readDevices(vault.devices),meetings }))
  if (data.length > 600_000) { data.fill(0); throw new Error('Finish or remove the previous device copy before saving another.') }
  try { return { ...vault.record, data: await encrypt(await aes(vault.master), data, vault.record.id, 'data') } }
  finally { data.fill(0) }
}
export function closeVault(vault: Vault): void { vault.master.fill(0); vault.entries = []; vault.trust = emptyTrust(); vault.exchanges = []; vault.devices = {};vault.meetings=[] }

export function deviceUnlockPossible(): boolean {
  if(nativeAvailable())return true
  return typeof window !== 'undefined' && window.isSecureContext && location.protocol !== 'file:'
    && typeof PublicKeyCredential !== 'undefined' && !!navigator.credentials
}
export function deviceUnlockOrigin():string {return nativeAvailable()?nativeOrigin():location.origin}
function nativePrf(secret:Uint8Array,input:Uint8Array){
  const prefix=encoder.encode('canary:native-prf:v1\0'),data=new Uint8Array(prefix.length+input.length);data.set(prefix);data.set(input,prefix.length)
  try{return hmacSha256(secret,data)}finally{secret.fill(0);data.fill(0)}
}
function prfResult(credential: PublicKeyCredential | null): Uint8Array {
  const output = credential?.getClientExtensionResults().prf?.results?.first
  if (!output || output.byteLength !== 32) throw new Error('Encrypted device unlock is not supported by this browser or passkey provider. Use a passphrase to save instead.')
  return ArrayBuffer.isView(output)
    ? new Uint8Array(output.buffer, output.byteOffset, output.byteLength).slice()
    : new Uint8Array(output).slice()
}
async function deviceKey(output: Uint8Array, id: string): Promise<CryptoKey> {
  try {
    const key = await crypto.subtle.importKey('raw', bytes(output), 'HKDF', false, ['deriveKey'])
    return await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: encoder.encode(id), info: encoder.encode('canary:vault:1:device') }, key, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  } finally { output.fill(0) }
}
export async function enableDeviceUnlock(vault: Vault, origin: string, credentials: CredentialsContainer = navigator.credentials): Promise<VaultRecord> {
  const input = random(32)
  if(nativeAvailable()){
    if(origin!==nativeOrigin())throw new Error('Open the installed Vouch app to use this device key.')
    const created=await nativeCreateKey(),key=await deviceKey(nativePrf(created.secret,input),vault.record.id)
    const box=await encrypt(key,vault.master,vault.record.id,'device')
    return{...vault.record,device:{credential:created.credential,input:b64(input),origin,box}}
  }
  const credential = await credentials.create({ publicKey: {
    challenge: bytes(random(32)), rp: { name: 'Canary private vault' },
    user: { id: bytes(random(32)), name: 'Canary private vault', displayName: 'Canary private vault' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { userVerification: 'required', residentKey: 'preferred' },
    attestation: 'none', timeout: 60_000,
    extensions: { prf: { eval: { first: bytes(input) } } },
  } }) as PublicKeyCredential | null
  if (!credential) throw new Error('Device setup was cancelled. You can use a passphrase to save instead.')
  let result = credential
  if (!credential.getClientExtensionResults().prf?.results?.first) {
    if (!credential.getClientExtensionResults().prf?.enabled) throw new Error('Encrypted device unlock is not supported by this passkey provider. Use a passphrase to save instead.')
    result = await credentials.get({ publicKey: {
      challenge: bytes(random(32)), allowCredentials: [{ type: 'public-key', id: credential.rawId }],
      userVerification: 'required', timeout: 60_000, extensions: { prf: { eval: { first: bytes(input) } } },
    } }) as PublicKeyCredential
  }
  const key = await deviceKey(prfResult(result), vault.record.id)
  const box = await encrypt(key, vault.master, vault.record.id, 'device')
  return { ...vault.record, device: { credential: b64(new Uint8Array(credential.rawId)), input: b64(input), origin, box } }
}
export async function createDeviceVault(origin: string, credentials: CredentialsContainer = navigator.credentials): Promise<Vault> {
  const id = [...random(16)].map(byte => byte.toString(16).padStart(2, '0')).join('')
  const master = random(32)
  try {
    const data = await encrypt(await aes(master), encoder.encode('[]'), id, 'data')
    const vault: Vault = { record: { v: 1, id, data }, master, entries: [], trust: emptyTrust() }
    vault.record = await enableDeviceUnlock(vault, origin, credentials)
    return vault
  } catch (e) { master.fill(0); throw e }
}
export async function unlockWithDevice(record: VaultRecord, origin: string, credentials: CredentialsContainer = navigator.credentials): Promise<Vault> {
  const device = record.device
  if (!device || device.origin !== origin) throw new Error('Open the original website with your device credential, or restore a passphrase-protected backup.')
  if(device.origin.startsWith('vouch-native:')){
    if(!nativeAvailable()||origin!==nativeOrigin())throw new Error('Open the original installed Vouch app, or restore an encrypted recovery backup.')
    const key=await deviceKey(nativePrf(await nativeKey(device.credential),unb64(device.input,32)),record.id)
    return opened(record,await decrypt(key,device.box,record.id,'device'))
  }
  const credential = await credentials.get({ publicKey: {
    challenge: bytes(random(32)), allowCredentials: [{ type: 'public-key', id: bytes(unb64(device.credential, 1024)) }],
    userVerification: 'required', timeout: 60_000,
    extensions: { prf: { eval: { first: bytes(unb64(device.input, 32)) } } },
  } }) as PublicKeyCredential | null
  const key = await deviceKey(prfResult(credential), record.id)
  return opened(record, await decrypt(key, device.box, record.id, 'device'))
}

export function exportVault(record: VaultRecord): string {
  if (!record.password) throw new Error('Add a recovery passphrase before making a portable backup.')
  return JSON.stringify({ v: record.v, id: record.id, password: record.password, data: record.data })
}
