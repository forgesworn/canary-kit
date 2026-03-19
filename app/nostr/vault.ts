// app/nostr/vault.ts — Vault sync: encrypt group state with NIP-44 self-encryption,
// publish as a Nostr replaceable event (kind 30078), and restore on login.

import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'
import { getPool, getReadRelayUrls, getWriteRelayUrls } from './connect.js'
import type { AppGroup, AppPersona } from '../types.js'
import { generatePersonaId } from '../persona-tree.js'

// ── Constants ───────────────────────────────────────────────────

/** Nostr kind for application-specific data (NIP-78). */
export const VAULT_KIND = 30078

/** The `d` tag value identifying a CANARY vault event. */
export const VAULT_D_TAG = 'canary:vault'

/** Vault expiration: 90 days in seconds. */
const VAULT_EXPIRY_SECONDS = 90 * 24 * 60 * 60

// ── Helpers ─────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

// ── Serialisation ───────────────────────────────────────────────

interface VaultPayloadV2 {
  version: 2
  groups: Record<string, AppGroup>
  personas: AppPersona[]
}

interface VaultPayloadV3 {
  version: 3
  groups: Record<string, AppGroup>
  personas: Record<string, AppPersona>
  deletedGroupIds?: string[]
}

/** Result of deserialising a vault — groups, personas, and tombstones. */
export interface VaultData {
  groups: Record<string, AppGroup>
  personas: Record<string, AppPersona>
  deletedGroupIds: string[]
}

/**
 * Serialise groups and personas to a JSON string suitable for vault storage.
 * Strips ephemeral fields (`lastPositions`) and resets `livenessCheckins`.
 * Produces a version 3 vault payload with persona tree keyed by id.
 */
export function serialiseVault(
  groups: Record<string, AppGroup>,
  personas: Record<string, AppPersona> = {},
  deletedGroupIds: string[] = [],
): string {
  const cleaned: Record<string, AppGroup> = {}
  for (const [key, group] of Object.entries(groups)) {
    const { lastPositions: _, ...rest } = group
    cleaned[key] = { ...rest, livenessCheckins: {} } as AppGroup
  }
  const payload: VaultPayloadV3 = { version: 3, groups: cleaned, personas, deletedGroupIds }
  return JSON.stringify(payload)
}

/**
 * Deserialise a vault JSON string back into groups and personas.
 * Only version 3 vaults are supported. Older versions return an error result
 * so the caller can inform the user to update all devices.
 * Returns empty groups and personas on any parse failure.
 */
export function deserialiseVault(json: string): VaultData {
  try {
    const parsed = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.groups !== 'object' || parsed.groups === null) {
      return { groups: {}, personas: {}, deletedGroupIds: [] }
    }

    // v3 — persona tree keyed by id, groups use personaId
    if (parsed.version === 3) {
      return {
        groups: parsed.groups as Record<string, AppGroup>,
        personas: (parsed.personas && typeof parsed.personas === 'object' && !Array.isArray(parsed.personas))
          ? parsed.personas as Record<string, AppPersona>
          : {},
        deletedGroupIds: Array.isArray(parsed.deletedGroupIds) ? parsed.deletedGroupIds : [],
      }
    }

    // v1/v2 or unversioned — migrate to v3 format
    console.info('[canary:vault] Migrating vault from version', parsed.version ?? 1, 'to v3')

    const groups = parsed.groups as Record<string, any>

    // Default personaName to 'personal' for v1 groups missing it
    for (const group of Object.values(groups)) {
      if (!group.personaName && !group.personaId) {
        group.personaName = 'personal'
      }
    }

    // Migrate personas from array to tree keyed by id
    const personaArray: any[] = Array.isArray(parsed.personas) ? parsed.personas : []
    const personaTree: Record<string, AppPersona> = {}
    const nameToId: Record<string, string> = {}

    for (const p of personaArray) {
      const id = generatePersonaId()
      nameToId[p.name] = id
      personaTree[id] = {
        ...p,
        id,
        children: {},
      }
    }

    // Migrate groups: personaName → personaId
    for (const group of Object.values(groups) as any[]) {
      if (group.personaName && !group.personaId) {
        group.personaId = nameToId[group.personaName] ?? ''
        delete group.personaName
      }
    }

    return {
      groups: groups as Record<string, AppGroup>,
      personas: personaTree,
      deletedGroupIds: Array.isArray(parsed.deletedGroupIds) ? parsed.deletedGroupIds : [],
    }
  } catch {
    return { groups: {}, personas: {}, deletedGroupIds: [] }
  }
}

// ── NIP-44 Self-Encryption ──────────────────────────────────────

/**
 * Encrypt plaintext using NIP-44 with a conversation key derived
 * from the user's own privkey + pubkey (self-encryption).
 */
export function encryptVault(plaintext: string, privkey: string, pubkey: string): string {
  const sk = hexToBytes(privkey)
  const ck = getConversationKey(sk, pubkey)
  return nip44encrypt(plaintext, ck)
}

/**
 * Decrypt ciphertext using NIP-44 self-encryption.
 * Returns null on any decryption failure.
 */
export function decryptVault(ciphertext: string, privkey: string, pubkey: string): string | null {
  try {
    const sk = hexToBytes(privkey)
    const ck = getConversationKey(sk, pubkey)
    return nip44decrypt(ciphertext, ck)
  } catch {
    return null
  }
}

// ── Event Building ──────────────────────────────────────────────

/**
 * Build and sign a Nostr replaceable event (kind 30078) containing
 * the encrypted vault content. Includes a `d` tag for replacement
 * and an `expiration` tag set to 90 days from now.
 */
export function buildVaultEvent(encryptedContent: string, privkey: string): ReturnType<typeof finalizeEvent> {
  const sk = hexToBytes(privkey)
  const now = Math.floor(Date.now() / 1000)

  const template = {
    kind: VAULT_KIND,
    created_at: now,
    tags: [
      ['d', VAULT_D_TAG],
      ['expiration', String(now + VAULT_EXPIRY_SECONDS)],
    ],
    content: encryptedContent,
  }

  return finalizeEvent(template, sk)
}

// ── Relay Interaction ───────────────────────────────────────────

/**
 * Serialise, encrypt, build, and publish the vault event to write relays.
 * Throws if no relay pool is available.
 */
export async function publishVault(
  groups: Record<string, AppGroup>,
  privkey: string,
  pubkey: string,
  personas: Record<string, AppPersona> = {},
  deletedGroupIds: string[] = [],
): Promise<void> {
  const pool = getPool()
  if (!pool) throw new Error('No relay pool — connect first')

  const writeRelays = getWriteRelayUrls()
  if (writeRelays.length === 0) throw new Error('No write relays configured')

  const json = serialiseVault(groups, personas, deletedGroupIds)
  const ciphertext = encryptVault(json, privkey, pubkey)
  const event = buildVaultEvent(ciphertext, privkey)

  console.info(`[canary:vault] Publishing vault (${Object.keys(groups).length} groups) to`, writeRelays)
  document.dispatchEvent(new CustomEvent('canary:vault-syncing'))
  const results = await Promise.allSettled(pool.publish(writeRelays, event))
  const ok = results.filter(r => r.status === 'fulfilled').length
  const fail = results.filter(r => r.status === 'rejected').length
  console.info(`[canary:vault] Publish results: ${ok} OK, ${fail} failed`)
  if (fail > 0) {
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.warn(`[canary:vault] Relay ${writeRelays[i]} rejected:`, r.reason)
    })
  }
  document.dispatchEvent(new CustomEvent('canary:vault-synced', {
    detail: { timestamp: Math.floor(Date.now() / 1000) },
  }))
}

/**
 * Fetch the vault event from read relays, decrypt, and deserialise.
 * Returns the groups or null if no vault is found / decryption fails.
 * Times out after 10 seconds.
 */
export async function fetchVault(
  privkey: string,
  pubkey: string,
): Promise<VaultData | null> {
  const pool = getPool()
  if (!pool) {
    console.warn('[canary:vault] fetchVault: no pool')
    return null
  }

  const readRelays = getReadRelayUrls()
  if (readRelays.length === 0) {
    console.warn('[canary:vault] fetchVault: no read relays')
    return null
  }

  console.info(`[canary:vault] Fetching vault from`, readRelays, 'for', pubkey.slice(0, 8))

  return new Promise<VaultData | null>((resolve) => {
    let resolved = false
    let bestEvent: { created_at: number; content: string } | null = null

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        sub.close()
        console.warn('[canary:vault] fetchVault timed out after 10s')
        if (bestEvent) {
          const plaintext = decryptVault(bestEvent.content, privkey, pubkey)
          if (plaintext) {
            const data = deserialiseVault(plaintext)
            if (Object.keys(data.groups).length > 0) {
              resolve(data)
              return
            }
          }
        }
        resolve(null)
      }
    }, 10_000)

    const sub = pool.subscribeMany(
      readRelays,
      { kinds: [VAULT_KIND], authors: [pubkey], '#d': [VAULT_D_TAG], limit: 1 } as any,
      {
        onevent(event) {
          if (!verifyEvent(event)) return
          if (typeof event.content === 'string' && event.content.length > 262144) return  // 256KB vault limit
          console.info(`[canary:vault] Received vault event created_at=${event.created_at}`)
          if (!bestEvent || event.created_at > bestEvent.created_at) {
            bestEvent = event
          }
        },
        oneose() {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            sub.close()
            if (bestEvent) {
              console.info('[canary:vault] EOSE — decrypting vault event')
              const plaintext = decryptVault(bestEvent.content, privkey, pubkey)
              if (plaintext) {
                const data = deserialiseVault(plaintext)
                if (Object.keys(data.groups).length > 0) {
                  resolve(data)
                  return
                }
              }
              console.warn('[canary:vault] Vault decryption failed')
            } else {
              console.info('[canary:vault] EOSE — no vault event found')
            }
            resolve(null)
          }
        },
      },
    )
  })
}

// ── NIP-07 Vault (browser extension signing + encryption) ───────

/** Check if NIP-07 extension supports NIP-44. */
function hasNip07Nip44(): boolean {
  return !!(window as any).nostr?.nip44?.encrypt && !!(window as any).nostr?.nip44?.decrypt
}

/**
 * Publish vault using NIP-07 for signing and NIP-44 encryption.
 * Self-encrypts by passing the user's own pubkey as the recipient.
 */
export async function publishVaultNip07(
  groups: Record<string, AppGroup>,
  pubkey: string,
  personas: Record<string, AppPersona> = {},
  deletedGroupIds: string[] = [],
): Promise<void> {
  const pool = getPool()
  if (!pool) throw new Error('No relay pool — connect first')
  if (!hasNip07Nip44()) throw new Error('NIP-07 extension does not support NIP-44')

  const writeRelays = getWriteRelayUrls()
  if (writeRelays.length === 0) throw new Error('No write relays configured')

  const json = serialiseVault(groups, personas, deletedGroupIds)
  const ciphertext: string = await (window as any).nostr.nip44.encrypt(pubkey, json)

  const now = Math.floor(Date.now() / 1000)
  const template = {
    kind: VAULT_KIND,
    created_at: now,
    tags: [
      ['d', VAULT_D_TAG],
      ['expiration', String(now + VAULT_EXPIRY_SECONDS)],
    ],
    content: ciphertext,
  }

  const signed = await (window as any).nostr.signEvent(template)

  console.info(`[canary:vault] Publishing vault via NIP-07 (${Object.keys(groups).length} groups) to`, writeRelays)
  document.dispatchEvent(new CustomEvent('canary:vault-syncing'))
  const results = await Promise.allSettled(pool.publish(writeRelays, signed))
  const ok = results.filter(r => r.status === 'fulfilled').length
  const fail = results.filter(r => r.status === 'rejected').length
  console.info(`[canary:vault] NIP-07 publish results: ${ok} OK, ${fail} failed`)
  document.dispatchEvent(new CustomEvent('canary:vault-synced', {
    detail: { timestamp: now },
  }))
}

/**
 * Fetch and decrypt vault using NIP-07 for NIP-44 decryption.
 */
export async function fetchVaultNip07(
  pubkey: string,
): Promise<VaultData | null> {
  const pool = getPool()
  if (!pool) {
    console.warn('[canary:vault] fetchVaultNip07: no pool')
    return null
  }
  if (!hasNip07Nip44()) {
    console.warn('[canary:vault] fetchVaultNip07: extension lacks NIP-44')
    return null
  }

  const readRelays = getReadRelayUrls()
  if (readRelays.length === 0) {
    console.warn('[canary:vault] fetchVaultNip07: no read relays')
    return null
  }

  console.info(`[canary:vault] Fetching vault via NIP-07 from`, readRelays, 'for', pubkey.slice(0, 8))

  return new Promise<VaultData | null>((resolve) => {
    let resolved = false
    let bestEvent: { created_at: number; content: string } | null = null

    const timeout = setTimeout(async () => {
      if (!resolved) {
        resolved = true
        sub.close()
        console.warn('[canary:vault] fetchVaultNip07 timed out after 10s')
        if (bestEvent) {
          try {
            const plaintext: string = await (window as any).nostr.nip44.decrypt(pubkey, bestEvent.content)
            const data = deserialiseVault(plaintext)
            if (Object.keys(data.groups).length > 0) {
              resolve(data)
              return
            }
          } catch { /* fall through */ }
        }
        resolve(null)
      }
    }, 10_000)

    const sub = pool.subscribeMany(
      readRelays,
      { kinds: [VAULT_KIND], authors: [pubkey], '#d': [VAULT_D_TAG], limit: 1 } as any,
      {
        onevent(event) {
          if (!verifyEvent(event)) return
          if (typeof event.content === 'string' && event.content.length > 262144) return
          console.info(`[canary:vault] NIP-07 received vault event created_at=${event.created_at}`)
          if (!bestEvent || event.created_at > bestEvent.created_at) {
            bestEvent = event
          }
        },
        async oneose() {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            sub.close()
            if (bestEvent) {
              console.info('[canary:vault] NIP-07 EOSE — decrypting vault event')
              try {
                const plaintext: string = await (window as any).nostr.nip44.decrypt(pubkey, bestEvent.content)
                const data = deserialiseVault(plaintext)
                if (Object.keys(data.groups).length > 0) {
                  resolve(data)
                  return
                }
              } catch (err) {
                console.warn('[canary:vault] NIP-07 vault decryption failed:', err)
              }
            } else {
              console.info('[canary:vault] NIP-07 EOSE — no vault event found')
            }
            resolve(null)
          }
        },
      },
    )
  })
}

// ── Live vault subscription ─────────────────────────────────────

let _vaultUnsub: (() => void) | null = null
let _lastVaultTimestamp = 0

/**
 * Subscribe to live vault updates from the relay. When another device
 * publishes a newer vault, automatically decrypt and merge.
 * Calls onMerge with the merged groups when new data arrives.
 */
export function subscribeToVault(
  pubkey: string,
  decrypt: (ciphertext: string) => Promise<string | null>,
  onMerge: (merged: Record<string, AppGroup>, newCount: number, personas: Record<string, AppPersona>) => void,
): void {
  unsubscribeFromVault()

  const pool = getPool()
  if (!pool) return

  const readRelays = getReadRelayUrls()
  if (readRelays.length === 0) return

  _lastVaultTimestamp = Math.floor(Date.now() / 1000)

  console.info('[canary:vault] Subscribing to live vault updates for', pubkey.slice(0, 8))

  const sub = pool.subscribeMany(
    readRelays,
    { kinds: [VAULT_KIND], authors: [pubkey], '#d': [VAULT_D_TAG], since: _lastVaultTimestamp } as any,
    {
      async onevent(event) {
        if (!verifyEvent(event)) return
        if (event.created_at <= _lastVaultTimestamp) return
        if (typeof event.content === 'string' && event.content.length > 262144) return

        console.info(`[canary:vault] Live vault update received created_at=${event.created_at}`)
        _lastVaultTimestamp = event.created_at

        try {
          const plaintext = await decrypt(event.content)
          if (!plaintext) return
          const { groups: vaultGroups, personas: vaultPersonas } = deserialiseVault(plaintext)
          if (Object.keys(vaultGroups).length === 0) return
          onMerge(vaultGroups, Object.keys(vaultGroups).length, vaultPersonas)
        } catch (err) {
          console.warn('[canary:vault] Live vault decrypt failed:', err)
        }
      },
      oneose() {
        console.info('[canary:vault] Live vault subscription EOSE — watching for updates')
      },
    },
  )

  _vaultUnsub = () => sub.close()
}

/** Stop watching for live vault updates. */
export function unsubscribeFromVault(): void {
  _vaultUnsub?.()
  _vaultUnsub = null
}

// ── Merge Logic ─────────────────────────────────────────────────

/**
 * Merge vault groups into local groups.
 *
 * - Groups only in vault: added.
 * - Groups only in local: kept.
 * - Both have same group: higher epoch wins; if same epoch, higher counter wins.
 *   Otherwise keep local.
 */
export function mergeVaultGroups(
  local: Record<string, AppGroup>,
  vault: Record<string, AppGroup>,
  deletedGroupIds: string[] = [],
): Record<string, AppGroup> {
  const merged: Record<string, AppGroup> = { ...local }
  const tombstones = new Set(deletedGroupIds)

  for (const [id, vaultGroup] of Object.entries(vault)) {
    // Skip groups the user intentionally deleted
    if (tombstones.has(id)) continue

    const localGroup = local[id]
    if (!localGroup) {
      // Only in vault — add it
      merged[id] = vaultGroup
      continue
    }

    // Both exist — compare epoch first, then counter
    const localEpoch = localGroup.epoch ?? 0
    const vaultEpoch = vaultGroup.epoch ?? 0

    if (vaultEpoch > localEpoch) {
      merged[id] = vaultGroup
    } else if (vaultEpoch === localEpoch) {
      const localCounter = localGroup.counter ?? 0
      const vaultCounter = vaultGroup.counter ?? 0
      if (vaultCounter > localCounter) {
        merged[id] = vaultGroup
      }
      // Otherwise keep local (already in merged)
    }
    // If localEpoch > vaultEpoch, keep local (already in merged)
  }

  return merged
}
