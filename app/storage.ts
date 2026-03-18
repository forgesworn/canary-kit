// app/storage.ts — localStorage persistence layer with optional PIN encryption

import type { AppState, AppGroup, AppIdentity, AppSettings } from './types.js'
import { WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY } from './types.js'
import { getState, loadState, subscribe } from './state.js'
import { deriveKey, encrypt, decrypt, generateSalt, encodeSalt, decodeSalt } from './crypto/pin.js'
import { mnemonicToKeypair, validateMnemonic } from './mnemonic.js'
import { initDuressQueueCrypto } from './duress-queue.js'

// ── Storage keys ───────────────────────────────────────────────

const KEY_GROUPS = 'canary:groups'
const KEY_IDENTITY = 'canary:identity'
const KEY_SETTINGS = 'canary:settings'
const KEY_PIN_SALT = 'canary:pin-salt'
const KEY_ACTIVE_GROUP = 'canary:active-group'
const KEY_LEGACY_MNEMONIC = 'canary:mnemonic'

interface EncryptedPayload {
  _encrypted: true
  ciphertext: string
}

// ── Module-level PIN state ─────────────────────────────────────
// The active CryptoKey is held in memory only — never written to storage.
// Cleared on lock.

let _pinKey: CryptoKey | null = null

/** Set the active PIN key after a successful unlock. */
export function setPinKey(key: CryptoKey): void {
  _pinKey = key
}

/** Clear the PIN key from memory (lock the app). */
export function clearPinKey(): void {
  _pinKey = null
}

/** Returns true when a PIN key is currently loaded (app is unlocked). */
export function isPinKeyLoaded(): boolean {
  return _pinKey !== null
}

// ── Default values (used when data is absent or corrupt) ───────

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  pinEnabled: true,
  autoLockMinutes: 5,
  defaultRelays: [DEFAULT_WRITE_RELAY],
  defaultReadRelays: [...WELL_KNOWN_READ_RELAYS, DEFAULT_WRITE_RELAY],
  defaultWriteRelays: [DEFAULT_WRITE_RELAY],
}

// ── Helpers ────────────────────────────────────────────────────

function safeRead<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage unavailable — fail silently.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEncryptedPayload(value: unknown): value is EncryptedPayload {
  return isRecord(value) && value._encrypted === true && typeof value.ciphertext === 'string'
}

async function encryptPayload<T>(value: T, key: CryptoKey): Promise<EncryptedPayload> {
  return {
    _encrypted: true,
    ciphertext: await encrypt(JSON.stringify(value), key),
  }
}

async function decryptPayload<T>(value: EncryptedPayload, key: CryptoKey): Promise<T> {
  return JSON.parse(await decrypt(value.ciphertext, key)) as T
}

function hasLegacySeedEncryption(groups: unknown): groups is Record<string, AppGroup & { _seedEncrypted?: boolean }> {
  if (!isRecord(groups)) return false
  return Object.values(groups).some(group => isRecord(group) && group._seedEncrypted === true)
}

function hasLegacyPrivkeyEncryption(identity: unknown): identity is AppIdentity & { _privkeyEncrypted?: boolean } {
  return isRecord(identity) && identity._privkeyEncrypted === true
}

// ── PIN salt management ────────────────────────────────────────

/** Returns the stored PIN salt, or null if PIN has never been set. */
export function getStoredPinSalt(): string | null {
  return localStorage.getItem(KEY_PIN_SALT)
}

/** Persist a new salt (base64-encoded). Called when PIN is first configured. */
export function storeNewPinSalt(): string {
  const salt = generateSalt()
  const encoded = encodeSalt(salt)
  localStorage.setItem(KEY_PIN_SALT, encoded)
  return encoded
}

/** Remove the PIN salt from storage (when PIN is disabled). */
export function clearPinSalt(): void {
  localStorage.removeItem(KEY_PIN_SALT)
}

// ── Legacy migration helpers ───────────────────────────────────

async function decryptLegacyGroups(
  groups: Record<string, AppGroup & { _seedEncrypted?: boolean }>,
  key: CryptoKey,
): Promise<Record<string, AppGroup>> {
  const out: Record<string, AppGroup> = {}
  for (const [id, group] of Object.entries(groups)) {
    const { _seedEncrypted, ...rest } = group
    out[id] = {
      ...rest,
      seed: _seedEncrypted ? await decrypt(group.seed, key) : group.seed,
    }
  }
  return out
}

function migrateGroupRelays(group: Partial<AppGroup>): Pick<AppGroup, 'readRelays' | 'writeRelays'> {
  if (group.readRelays?.length || group.writeRelays?.length) {
    return {
      readRelays: group.readRelays ?? [],
      writeRelays: group.writeRelays ?? [],
    }
  }

  const legacyRelays = group.relays ?? []
  const writeRelays = legacyRelays.length > 0 ? legacyRelays : [DEFAULT_WRITE_RELAY]
  const readSet = new Set<string>([...WELL_KNOWN_READ_RELAYS, ...writeRelays])
  return {
    readRelays: Array.from(readSet),
    writeRelays,
  }
}

function mergeSettings(raw: Partial<AppSettings> | null): AppSettings {
  const merged: AppSettings = { ...DEFAULT_SETTINGS, ...(raw ?? {}) }
  if (!merged.defaultRelays?.length) {
    merged.defaultRelays = [...DEFAULT_SETTINGS.defaultRelays]
  }
  if (!merged.defaultReadRelays?.length) {
    merged.defaultReadRelays = [...DEFAULT_SETTINGS.defaultReadRelays]
  }
  if (!merged.defaultWriteRelays?.length) {
    merged.defaultWriteRelays = [...DEFAULT_SETTINGS.defaultWriteRelays]
  }
  return merged
}

function normaliseGroups(raw: unknown): Record<string, AppGroup> {
  if (!isRecord(raw)) return {}

  const validGroups: Record<string, AppGroup> = {}
  for (const [id, group] of Object.entries(raw)) {
    if (!isRecord(group) || typeof group.name !== 'string') continue

    const relayConfig = migrateGroupRelays(group as Partial<AppGroup>)
    validGroups[id] = {
      ...(group as AppGroup),
      id,
      usedInvites: Array.isArray(group.usedInvites) ? group.usedInvites.filter((nonce): nonce is string => typeof nonce === 'string') : [],
      latestInviteIssuedAt: typeof group.latestInviteIssuedAt === 'number' ? group.latestInviteIssuedAt : 0,
      tolerance: typeof group.tolerance === 'number' ? group.tolerance : 1,
      livenessInterval: typeof group.livenessInterval === 'number'
        ? group.livenessInterval
        : typeof group.rotationInterval === 'number'
          ? group.rotationInterval
          : 604800,
      livenessCheckins: isRecord(group.livenessCheckins)
        ? Object.fromEntries(
            Object.entries(group.livenessCheckins)
              .filter(([, value]) => typeof value === 'number')
              .map(([pubkey, value]) => [pubkey, value]),
          )
        : {},
      memberNames: isRecord(group.memberNames)
        ? Object.fromEntries(
            Object.entries(group.memberNames)
              .filter(([, value]) => typeof value === 'string')
              .map(([pubkey, value]) => [pubkey, value]),
          )
        : undefined,
      lastPositions: isRecord(group.lastPositions)
        ? Object.fromEntries(
            Object.entries(group.lastPositions)
              .filter(([, value]) => isRecord(value))
              .map(([pubkey, value]) => [pubkey, value]),
          ) as AppGroup['lastPositions']
        : undefined,
      beaconPrecision: typeof group.beaconPrecision === 'number' ? group.beaconPrecision : 5,
      duressPrecision: typeof (group as any).duressPrecision === 'number' ? (group as any).duressPrecision : 9,
      nostrEnabled: typeof group.nostrEnabled === 'boolean'
        ? group.nostrEnabled
        : relayConfig.writeRelays.length > 0 || relayConfig.readRelays.length > 0,
      ...relayConfig,
    }
  }

  return validGroups
}

function normaliseIdentity(raw: unknown): AppIdentity | null {
  if (!isRecord(raw) || typeof raw.pubkey !== 'string') return null

  return {
    pubkey: raw.pubkey,
    privkey: typeof raw.privkey === 'string' ? raw.privkey : undefined,
    nsec: typeof raw.nsec === 'string' ? raw.nsec : undefined,
    mnemonic: typeof raw.mnemonic === 'string' ? raw.mnemonic : undefined,
    displayName: typeof raw.displayName === 'string' ? raw.displayName : undefined,
    picture: typeof raw.picture === 'string' ? raw.picture : undefined,
    signerType: raw.signerType === 'nip07' ? 'nip07' : 'local',
  }
}

function attachLegacyMnemonic(identity: AppIdentity | null): { identity: AppIdentity | null; migrated: boolean } {
  const rawMnemonic = localStorage.getItem(KEY_LEGACY_MNEMONIC)
  if (!rawMnemonic) return { identity, migrated: false }

  let nextIdentity = identity
  const mnemonic = rawMnemonic.trim().replace(/\s+/g, ' ')

  try {
    if (nextIdentity && validateMnemonic(mnemonic)) {
      const { pubkey } = mnemonicToKeypair(mnemonic)
      if (pubkey === nextIdentity.pubkey) {
        nextIdentity = { ...nextIdentity, mnemonic }
      }
    }
  } catch {
    // Ignore invalid legacy recovery phrases — they are removed below.
  }

  localStorage.removeItem(KEY_LEGACY_MNEMONIC)
  return { identity: nextIdentity, migrated: true }
}

function resolveActiveGroupId(saved: unknown, validGroups: Record<string, unknown>): string | null {
  if (typeof saved === 'string' && saved in validGroups) return saved
  const ids = Object.keys(validGroups)
  return ids.length > 0 ? ids[0] : null
}

async function readStoredGroups(key?: CryptoKey): Promise<{ groups: Record<string, AppGroup>; migrated: boolean }> {
  const rawGroups = safeRead<unknown>(KEY_GROUPS)
  if (rawGroups === null) return { groups: {}, migrated: false }

  if (isEncryptedPayload(rawGroups)) {
    if (!key) throw new Error('Encrypted groups require PIN unlock')
    const decrypted = await decryptPayload<Record<string, AppGroup>>(rawGroups, key)
    return { groups: normaliseGroups(decrypted), migrated: false }
  }

  if (hasLegacySeedEncryption(rawGroups)) {
    if (!key) throw new Error('Encrypted groups require PIN unlock')
    const decrypted = await decryptLegacyGroups(rawGroups, key)
    return { groups: normaliseGroups(decrypted), migrated: true }
  }

  return {
    groups: normaliseGroups(rawGroups),
    migrated: key !== undefined,
  }
}

function readStoredGroupsSync(): { groups: Record<string, AppGroup>; migrated: boolean } {
  const rawGroups = safeRead<unknown>(KEY_GROUPS)
  if (rawGroups === null || isEncryptedPayload(rawGroups) || hasLegacySeedEncryption(rawGroups)) {
    return { groups: {}, migrated: false }
  }

  return {
    groups: normaliseGroups(rawGroups),
    migrated: false,
  }
}

async function readStoredIdentity(key?: CryptoKey): Promise<{ identity: AppIdentity | null; migrated: boolean }> {
  const rawIdentity = safeRead<unknown>(KEY_IDENTITY)
  if (rawIdentity === null) {
    return attachLegacyMnemonic(null)
  }

  if (isEncryptedPayload(rawIdentity)) {
    if (!key) throw new Error('Encrypted identity requires PIN unlock')
    const decrypted = await decryptPayload<AppIdentity | null>(rawIdentity, key)
    return attachLegacyMnemonic(normaliseIdentity(decrypted))
  }

  let identityRaw: unknown = rawIdentity
  let migrated = key !== undefined

  if (hasLegacyPrivkeyEncryption(rawIdentity)) {
    if (!key) throw new Error('Encrypted identity requires PIN unlock')
    const privkey = rawIdentity.privkey ? await decrypt(rawIdentity.privkey, key) : undefined
    const { _privkeyEncrypted, ...rest } = rawIdentity
    identityRaw = { ...rest, privkey }
    migrated = true
  }

  const attached = attachLegacyMnemonic(normaliseIdentity(identityRaw))
  return {
    identity: attached.identity,
    migrated: migrated || attached.migrated,
  }
}

function readStoredIdentitySync(): { identity: AppIdentity | null; migrated: boolean } {
  const rawIdentity = safeRead<unknown>(KEY_IDENTITY)
  if (rawIdentity === null || isEncryptedPayload(rawIdentity) || hasLegacyPrivkeyEncryption(rawIdentity)) {
    return attachLegacyMnemonic(null)
  }

  return attachLegacyMnemonic(normaliseIdentity(rawIdentity))
}

async function readStoredActiveGroupId(key?: CryptoKey): Promise<{ activeGroupId: string | null; migrated: boolean }> {
  const rawActiveGroupId = safeRead<unknown>(KEY_ACTIVE_GROUP)
  if (rawActiveGroupId === null) {
    return { activeGroupId: null, migrated: false }
  }

  if (isEncryptedPayload(rawActiveGroupId)) {
    if (!key) throw new Error('Encrypted active group requires PIN unlock')
    const decrypted = await decryptPayload<string | null>(rawActiveGroupId, key)
    return { activeGroupId: typeof decrypted === 'string' ? decrypted : null, migrated: false }
  }

  return {
    activeGroupId: typeof rawActiveGroupId === 'string' ? rawActiveGroupId : null,
    migrated: key !== undefined,
  }
}

function readStoredActiveGroupIdSync(): { activeGroupId: string | null; migrated: boolean } {
  const rawActiveGroupId = safeRead<unknown>(KEY_ACTIVE_GROUP)
  if (rawActiveGroupId === null || isEncryptedPayload(rawActiveGroupId)) {
    return { activeGroupId: null, migrated: false }
  }

  return {
    activeGroupId: typeof rawActiveGroupId === 'string' ? rawActiveGroupId : null,
    migrated: false,
  }
}

async function writePersistedState(state: AppState, key?: CryptoKey): Promise<void> {
  if (key) {
    const [groups, identity, activeGroupId] = await Promise.all([
      encryptPayload(state.groups, key),
      encryptPayload(state.identity, key),
      encryptPayload(state.activeGroupId, key),
    ])
    safeWrite(KEY_GROUPS, groups)
    safeWrite(KEY_IDENTITY, identity)
    safeWrite(KEY_ACTIVE_GROUP, activeGroupId)
  } else {
    safeWrite(KEY_GROUPS, state.groups)
    safeWrite(KEY_IDENTITY, state.identity)
    if (state.activeGroupId === null) {
      localStorage.removeItem(KEY_ACTIVE_GROUP)
    } else {
      safeWrite(KEY_ACTIVE_GROUP, state.activeGroupId)
    }
  }

  safeWrite(KEY_SETTINGS, state.settings)
  localStorage.removeItem(KEY_LEGACY_MNEMONIC)
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Save current state slices to localStorage.
 * When a PIN key is loaded, all sensitive state is encrypted before writing.
 */
export async function persistState(): Promise<void> {
  const state = getState()
  const pinConfigured = !!getStoredPinSalt()

  if (state.settings.pinEnabled && pinConfigured && _pinKey === null) {
    console.error('[canary:storage] PIN enabled but key not loaded — state NOT persisted.')
    return
  }

  try {
    await writePersistedState(state, state.settings.pinEnabled && _pinKey !== null ? _pinKey : undefined)
  } catch (err) {
    console.error('[canary:storage] Persistence failed — state NOT persisted:', err)
  }
}

/**
 * Returns true if PIN has been configured.
 * Used by main.ts to decide whether to show the lock screen.
 */
export function hasPinSalt(): boolean {
  return localStorage.getItem(KEY_PIN_SALT) !== null
}

/**
 * Read settings from localStorage without loading any other state.
 * Used during early boot to apply the theme before the lock screen is shown.
 */
export function readSettingsOnly(): AppSettings {
  const rawSettings = safeRead<Partial<AppSettings>>(KEY_SETTINGS)
  return mergeSettings(rawSettings)
}

/**
 * Load and decrypt state after a successful PIN unlock.
 * Applies the decrypted state via loadState().
 * Throws if the PIN is wrong (AES-GCM authentication error).
 */
export async function unlockAndRestoreState(pin: string): Promise<void> {
  const saltEncoded = getStoredPinSalt()
  if (!saltEncoded) throw new Error('No PIN salt found')

  const salt = decodeSalt(saltEncoded)
  const key = await deriveKey(pin, salt)

  const rawSettings = safeRead<Partial<AppSettings>>(KEY_SETTINGS)
  const settings = mergeSettings(rawSettings)

  const [groupsResult, identityResult, activeGroupResult] = await Promise.all([
    readStoredGroups(key),
    readStoredIdentity(key),
    readStoredActiveGroupId(key),
  ])

  const restored: AppState = {
    view: 'groups',
    groups: groupsResult.groups,
    activeGroupId: resolveActiveGroupId(activeGroupResult.activeGroupId, groupsResult.groups),
    identity: identityResult.identity,
    settings,
    personas: {},
    activePersonaName: null,
  }

  setPinKey(key)
  loadState(restored)

  if (groupsResult.migrated || identityResult.migrated || activeGroupResult.migrated) {
    await writePersistedState(restored, key)
  }
}

/**
 * Load persisted state without PIN (no encryption).
 * Missing or corrupt slices fall back to sensible defaults.
 */
export function restoreState(): void {
  const rawSettings = safeRead<Partial<AppSettings>>(KEY_SETTINGS)
  const settings = mergeSettings(rawSettings)
  const groupsResult = readStoredGroupsSync()
  const identityResult = readStoredIdentitySync()
  const activeGroupResult = readStoredActiveGroupIdSync()

  const restored: AppState = {
    view: 'groups',
    groups: groupsResult.groups,
    activeGroupId: resolveActiveGroupId(activeGroupResult.activeGroupId, groupsResult.groups),
    identity: identityResult.identity,
    settings,
    personas: {},
    activePersonaName: null,
  }

  loadState(restored)

  if (groupsResult.migrated || identityResult.migrated || activeGroupResult.migrated) {
    void persistState()
  }
}

// ── Write serialisation (F3 hardening) ────────────────────────

let _writeVersion = 0
let _debounceTimer: ReturnType<typeof setTimeout> | undefined
let _pendingWrite: Promise<void> = Promise.resolve()

const DEBOUNCE_MS = 100

/**
 * Initialise storage: restore previously saved state then subscribe so that
 * every subsequent state change is automatically persisted.
 *
 * Writes are debounced (100ms) and serialised with a version guard:
 * - Rapid state changes batch into a single write.
 * - Only one write runs at a time (chained via _pendingWrite).
 * - A stale write (version superseded while queued) is skipped.
 */
export function initStorage(): void {
  // Wire up duress queue encryption so queued alerts use PIN protection
  initDuressQueueCrypto({
    encrypt,
    decrypt,
    getPinKey: () => _pinKey,
  })

  subscribe(() => {
    const version = ++_writeVersion
    clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      _pendingWrite = _pendingWrite.then(async () => {
        if (version !== _writeVersion) return
        await persistState()
      }).catch(err => {
        console.error('[canary:storage] Serialised write failed:', err)
      })
    }, DEBOUNCE_MS)
  })

  window.addEventListener('pagehide', () => flushPersist())
}

/**
 * Cancel the debounce timer and persist state immediately (synchronous best-effort).
 * Called on page unload and after critical state changes like invite acceptance.
 */
export function flushPersist(): void {
  clearTimeout(_debounceTimer)
  _writeVersion++
  persistState().catch(() => {})
}

/**
 * Enable PIN: generate a fresh salt, derive a key, and persist the encrypted state.
 */
export async function enablePin(pin: string): Promise<void> {
  const saltEncoded = storeNewPinSalt()
  const salt = decodeSalt(saltEncoded)
  const key = await deriveKey(pin, salt)
  setPinKey(key)

  try {
    const state = getState()
    await writePersistedState(
      {
        ...state,
        settings: { ...state.settings, pinEnabled: true },
      },
      key,
    )
  } catch (err) {
    clearPinKey()
    clearPinSalt()
    throw err
  }
}

/**
 * Disable PIN: remove the salt, clear the in-memory key, and persist plaintext state.
 */
export async function disablePin(): Promise<void> {
  const state = getState()
  await writePersistedState({
    ...state,
    settings: { ...state.settings, pinEnabled: false },
  })

  clearPinKey()
  clearPinSalt()
}
