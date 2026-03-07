// app/storage.ts — localStorage persistence layer with optional PIN encryption

import type { AppState, AppGroup, AppIdentity, AppSettings } from './types.js'
import { getState, loadState, subscribe } from './state.js'
import { deriveKey, encrypt, decrypt, generateSalt, encodeSalt, decodeSalt } from './crypto/pin.js'

// ── Storage keys ───────────────────────────────────────────────

const KEY_GROUPS = 'canary:groups'
const KEY_IDENTITY = 'canary:identity'
const KEY_SETTINGS = 'canary:settings'
const KEY_PIN_SALT = 'canary:pin-salt'
const KEY_ACTIVE_GROUP = 'canary:active-group'

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
  defaultRelays: ['wss://relay.trotters.cc'],
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

// ── Seed encryption helpers ────────────────────────────────────

/**
 * Encrypt only the `seed` field in every group.
 * Metadata (name, members, etc.) stays cleartext so it is readable before unlock.
 * Returns a new groups record with encrypted seeds.
 */
async function encryptSeeds(
  groups: Record<string, AppGroup>,
  key: CryptoKey,
): Promise<Record<string, AppGroup & { _seedEncrypted?: boolean }>> {
  const out: Record<string, AppGroup & { _seedEncrypted?: boolean }> = {}
  for (const [id, group] of Object.entries(groups)) {
    out[id] = {
      ...group,
      seed: await encrypt(group.seed, key),
      _seedEncrypted: true,
    }
  }
  return out
}

/**
 * Decrypt the `seed` field in every group.
 * Throws if the key is wrong (AES-GCM authentication will fail).
 */
async function decryptSeeds(
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

/** Resolve persisted activeGroupId, falling back to the first group. */
function resolveActiveGroupId(validGroups: Record<string, unknown>): string | null {
  const saved = safeRead<string>(KEY_ACTIVE_GROUP)
  if (saved && saved in validGroups) return saved
  const ids = Object.keys(validGroups)
  return ids.length > 0 ? ids[0] : null
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Save current state slices to localStorage.
 * When a PIN key is loaded, group seeds are encrypted before writing.
 * This function is async; the subscribe() call handles the Promise quietly.
 */
export async function persistState(): Promise<void> {
  const state = getState()

  // Fail closed when PIN protection is enabled, the user has actually configured
  // a PIN (salt exists), but the unlock key hasn't been loaded yet.
  // Without the salt check, fresh installs with pinEnabled=true as default would
  // silently drop all writes because no key can exist before first PIN setup.
  const pinConfigured = !!getStoredPinSalt()
  if (state.settings.pinEnabled && pinConfigured && _pinKey === null) {
    console.error('[canary:storage] PIN enabled but key not loaded — state NOT persisted.')
    return
  }

  let groupsToWrite: Record<string, AppGroup> | Record<string, AppGroup & { _seedEncrypted?: boolean }> = state.groups

  if (_pinKey !== null && state.settings.pinEnabled) {
    try {
      groupsToWrite = await encryptSeeds(state.groups, _pinKey)
    } catch (err) {
      // Fail closed: do NOT persist unencrypted seeds when encryption is expected
      console.error('[canary:storage] Encryption failed — state NOT persisted:', err)
      return
    }
  }

  safeWrite(KEY_GROUPS, groupsToWrite)

  // Encrypt the private key when PIN is enabled
  if (_pinKey !== null && state.settings.pinEnabled && state.identity?.privkey) {
    try {
      const encryptedPrivkey = await encrypt(state.identity.privkey, _pinKey)
      safeWrite(KEY_IDENTITY, { ...state.identity, privkey: encryptedPrivkey, _privkeyEncrypted: true })
    } catch {
      // Fail closed: omit privkey rather than storing it in plaintext
      const { privkey: _, ...safeIdentity } = state.identity
      safeWrite(KEY_IDENTITY, safeIdentity)
    }
  } else {
    safeWrite(KEY_IDENTITY, state.identity)
  }
  safeWrite(KEY_SETTINGS, state.settings)
  if (state.activeGroupId) {
    safeWrite(KEY_ACTIVE_GROUP, state.activeGroupId)
  } else {
    localStorage.removeItem(KEY_ACTIVE_GROUP)
  }
}

/**
 * Returns true if the stored groups data has encrypted seeds.
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
  return { ...DEFAULT_SETTINGS, ...(rawSettings ?? {}) }
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

  const rawGroups = safeRead<Record<string, AppGroup & { _seedEncrypted?: boolean }>>(KEY_GROUPS) ?? {}
  const rawIdentity = safeRead<AppIdentity & { _privkeyEncrypted?: boolean }>(KEY_IDENTITY)
  const rawSettings = safeRead<Partial<AppSettings>>(KEY_SETTINGS)

  const settings: AppSettings = { ...DEFAULT_SETTINGS, ...(rawSettings ?? {}) }

  // This will throw if the key is wrong — AES-GCM authentication will fail.
  const groups = await decryptSeeds(rawGroups, key)

  // Decrypt the identity private key if it was encrypted under PIN
  let identity: AppIdentity | null = null
  if (rawIdentity && typeof rawIdentity.pubkey === 'string') {
    let privkey = rawIdentity.privkey
    if (rawIdentity._privkeyEncrypted && privkey) {
      // Fail closed: if the encrypted privkey can't be decrypted, the PIN is
      // wrong (or ciphertext is corrupt). Without this throw, an empty groups
      // object lets decryptSeeds() succeed trivially, bypassing the lock screen.
      privkey = await decrypt(privkey, key)
    }
    identity = {
      pubkey: rawIdentity.pubkey,
      privkey,
      nsec: rawIdentity.nsec,
      displayName: rawIdentity.displayName,
      signerType: rawIdentity.signerType ?? 'local',
    }
  }

  const validGroups: Record<string, AppGroup> = {}
  for (const [id, group] of Object.entries(groups)) {
    if (group && typeof group === 'object' && typeof group.name === 'string') {
      validGroups[id] = {
        ...group,
        id,
        usedInvites: Array.isArray(group.usedInvites) ? group.usedInvites : [],
        latestInviteIssuedAt: typeof group.latestInviteIssuedAt === 'number' ? group.latestInviteIssuedAt : 0,
        tolerance: group.tolerance ?? 1,
      }
    }
  }

  const restored: AppState = {
    view: 'groups',
    groups: validGroups,
    activeGroupId: resolveActiveGroupId(validGroups),
    identity,
    settings,
  }

  // Store the key in memory so future persistState() calls encrypt correctly.
  setPinKey(key)
  loadState(restored)
}

/**
 * Load persisted state without PIN (no encryption).
 * Missing or corrupt slices fall back to sensible defaults.
 */
export function restoreState(): void {
  const groups = safeRead<Record<string, AppGroup>>(KEY_GROUPS) ?? {}
  const identity = safeRead<AppIdentity>(KEY_IDENTITY)
  const rawSettings = safeRead<Partial<AppSettings>>(KEY_SETTINGS)

  const settings: AppSettings = {
    ...DEFAULT_SETTINGS,
    ...(rawSettings ?? {}),
  }

  const validGroups: Record<string, AppGroup> = {}
  for (const [id, group] of Object.entries(groups)) {
    if (group && typeof group === 'object' && typeof group.name === 'string') {
      validGroups[id] = {
        ...group,
        id,
        usedInvites: Array.isArray(group.usedInvites) ? group.usedInvites : [],
        latestInviteIssuedAt: typeof group.latestInviteIssuedAt === 'number' ? group.latestInviteIssuedAt : 0,
        tolerance: group.tolerance ?? 1,
      }
    }
  }

  const restored: AppState = {
    view: 'groups',
    groups: validGroups,
    activeGroupId: resolveActiveGroupId(validGroups),
    identity: identity && typeof identity.pubkey === 'string'
      ? {
          pubkey: identity.pubkey,
          privkey: identity.privkey,
          nsec: identity.nsec,
          displayName: identity.displayName,
          signerType: identity.signerType ?? 'local',
        }
      : null,
    settings,
  }

  loadState(restored)
}

/**
 * Initialise storage: restore previously saved state then subscribe so that
 * every subsequent state change is automatically persisted.
 *
 * When PIN is enabled, this function does NOT restore groups — main.ts handles
 * that after the user unlocks. It only restores settings so the UI has a base.
 */
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
  subscribe(() => {
    const version = ++_writeVersion
    clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      _pendingWrite = _pendingWrite.then(async () => {
        if (version !== _writeVersion) return  // stale — newer version queued
        await persistState()
      }).catch(err => {
        console.error('[canary:storage] Serialised write failed:', err)
      })
    }, DEBOUNCE_MS)
  })

  // Flush pending writes when the page is being unloaded (mobile tab switch,
  // refresh, navigate away). pagehide fires reliably on mobile browsers,
  // unlike beforeunload which is not guaranteed on iOS Safari.
  window.addEventListener('pagehide', () => flushPersist())
}

/**
 * Cancel the debounce timer and persist state immediately (synchronous best-effort).
 * Called on page unload and after critical state changes like invite acceptance.
 */
export function flushPersist(): void {
  clearTimeout(_debounceTimer)
  _writeVersion++
  // persistState is async (PIN encryption) but on unload we can only do sync work.
  // For the common non-PIN case, safeWrite is synchronous (localStorage.setItem).
  // For PIN-enabled sessions, the debounced write will have already fired for most
  // state changes; this is a last-resort catch for the final unload race.
  persistState().catch(() => {})
}

/**
 * Enable PIN: generate a fresh salt, derive a key, re-encrypt all seeds,
 * and persist the encrypted groups immediately.
 */
export async function enablePin(pin: string): Promise<void> {
  const saltEncoded = storeNewPinSalt()
  const salt = decodeSalt(saltEncoded)
  const key = await deriveKey(pin, salt)
  setPinKey(key)

  // Re-encrypt all seeds and write them now.
  const state = getState()
  const encrypted = await encryptSeeds(state.groups, key)
  safeWrite(KEY_GROUPS, encrypted)
  safeWrite(KEY_SETTINGS, { ...state.settings, pinEnabled: true })
}

/**
 * Disable PIN: decrypt all seeds in storage, remove the salt, and persist
 * the plaintext groups.
 */
export async function disablePin(): Promise<void> {
  if (!_pinKey) return

  const rawGroups = safeRead<Record<string, AppGroup & { _seedEncrypted?: boolean }>>(KEY_GROUPS) ?? {}
  const decrypted = await decryptSeeds(rawGroups, _pinKey)

  clearPinKey()
  clearPinSalt()

  safeWrite(KEY_GROUPS, decrypted)
  const state = getState()
  safeWrite(KEY_SETTINGS, { ...state.settings, pinEnabled: false })
}
