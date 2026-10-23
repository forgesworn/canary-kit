import { readPair, type Pair } from './model.js'
import { emptyTrust, readTrust, text, type TrustState } from './trust.js'

const ROUNDS = 600_000
const MAX_BYTES = 262_144
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
interface Box { iv: string; ciphertext: string }
export interface Entry {
  id: string; label: string; pair: Pair
  evidence?: { method: 'in-person' | 'trusted-call'; at: number }
  accounts?: { service: string; account: string; observedAt: number }[]
  lastCheck?: number
}
export interface VaultRecord {
  v: 1
  id: string
  password?: { salt: string; rounds: number; box: Box }
  device?: { credential: string; input: string; origin: string; box: Box }
  data: Box
}
export interface Vault { record: VaultRecord; master: Uint8Array; entries: Entry[]; trust: TrustState }

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

function entriesFrom(raw: unknown): Entry[] {
  if (!Array.isArray(raw) || raw.length > 200) throw new Error('Invalid vault contents.')
  const ids = new Set<string>()
  return raw.map(value => {
    if (!value || typeof value.id !== 'string' || !/^[a-zA-Z0-9-]{1,64}$/.test(value.id) || ids.has(value.id)
      || typeof value.label !== 'string' || !value.label.trim() || value.label.length > 60) throw new Error('Invalid saved pair.')
    ids.add(value.id)
    const result: Entry = { id: value.id, label: value.label, pair: readPair(value.pair) }
    const checkedTime = (time: unknown) => {
      if (!Number.isSafeInteger(time) || (time as number) < 0 || (time as number) > 4_102_444_800) throw new Error('Invalid contact evidence date.')
      return time as number
    }
    if (value.evidence) {
      if (!['in-person', 'trusted-call'].includes(value.evidence.method)) throw new Error('Invalid contact evidence method.')
      result.evidence = { method: value.evidence.method, at: checkedTime(value.evidence.at) }
    }
    if (value.accounts !== undefined) {
      if (!Array.isArray(value.accounts) || value.accounts.length > 8) throw new Error('Too many observed accounts.')
      result.accounts = value.accounts.map((account: Entry['accounts'] extends (infer T)[] | undefined ? T : never) => ({ service: text(account.service, 32), account: text(account.account, 100), observedAt: checkedTime(account.observedAt) }))
    }
    if (value.lastCheck !== undefined) result.lastCheck = checkedTime(value.lastCheck)
    return result
  })
}
async function opened(record: VaultRecord, master: Uint8Array): Promise<Vault> {
  try {
    if (master.length !== 32) throw new Error('Invalid vault key')
    const data = await decrypt(await aes(master), record.data, record.id, 'data')
    try {
      const parsed = JSON.parse(decoder.decode(data))
      if (Array.isArray(parsed)) return { record, master, entries: entriesFrom(parsed), trust: emptyTrust() }
      if (!parsed || parsed.v !== 2) throw new Error('Unsupported encrypted vault payload.')
      return { record, master, entries: entriesFrom(parsed.entries), trust: readTrust(parsed.trust) }
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
  const checked = entriesFrom(entries)
  const data = encoder.encode(JSON.stringify({ v: 2, entries: checked, trust: readTrust(trust) }))
  if (data.length > 160_000) { data.fill(0); throw new Error('This local vault is full. Back up your data before removing old records.') }
  try { return { ...vault.record, data: await encrypt(await aes(vault.master), data, vault.record.id, 'data') } }
  finally { data.fill(0) }
}
export function closeVault(vault: Vault): void { vault.master.fill(0); vault.entries = []; vault.trust = emptyTrust() }

export function deviceUnlockPossible(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext && location.protocol !== 'file:'
    && typeof PublicKeyCredential !== 'undefined' && !!navigator.credentials
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
