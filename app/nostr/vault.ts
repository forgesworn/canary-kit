// app/nostr/vault.ts — Vault sync: encrypt group state with NIP-44 self-encryption,
// publish as a Nostr replaceable event (kind 30078), and restore on login.

import { finalizeEvent } from 'nostr-tools/pure'
import { encrypt as nip44encrypt, decrypt as nip44decrypt, getConversationKey } from 'nostr-tools/nip44'
import { getPool, getReadRelayUrls, getWriteRelayUrls } from './connect.js'
import type { AppGroup } from '../types.js'

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

interface VaultPayload {
  version: 1
  groups: Record<string, AppGroup>
}

/**
 * Serialise groups to a JSON string suitable for vault storage.
 * Strips ephemeral fields (`lastPositions`) and resets `livenessCheckins`.
 */
export function serialiseVault(groups: Record<string, AppGroup>): string {
  const cleaned: Record<string, AppGroup> = {}
  for (const [key, group] of Object.entries(groups)) {
    const { lastPositions: _, ...rest } = group
    cleaned[key] = { ...rest, livenessCheckins: {} } as AppGroup
  }
  const payload: VaultPayload = { version: 1, groups: cleaned }
  return JSON.stringify(payload)
}

/**
 * Deserialise a vault JSON string back into groups.
 * Returns an empty object on any parse failure.
 */
export function deserialiseVault(json: string): Record<string, AppGroup> {
  try {
    const parsed = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.groups !== 'object' || parsed.groups === null) {
      return {}
    }
    return parsed.groups as Record<string, AppGroup>
  } catch {
    return {}
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
): Promise<void> {
  const pool = getPool()
  if (!pool) throw new Error('No relay pool — connect first')

  const writeRelays = getWriteRelayUrls()
  if (writeRelays.length === 0) throw new Error('No write relays configured')

  const json = serialiseVault(groups)
  const ciphertext = encryptVault(json, privkey, pubkey)
  const event = buildVaultEvent(ciphertext, privkey)

  await Promise.allSettled(pool.publish(writeRelays, event))
}

/**
 * Fetch the vault event from read relays, decrypt, and deserialise.
 * Returns the groups or null if no vault is found / decryption fails.
 * Times out after 10 seconds.
 */
export async function fetchVault(
  privkey: string,
  pubkey: string,
): Promise<Record<string, AppGroup> | null> {
  const pool = getPool()
  if (!pool) return null

  const readRelays = getReadRelayUrls()
  if (readRelays.length === 0) return null

  return new Promise<Record<string, AppGroup> | null>((resolve) => {
    let resolved = false
    let bestEvent: { created_at: number; content: string } | null = null

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        sub.close()
        if (bestEvent) {
          const plaintext = decryptVault(bestEvent.content, privkey, pubkey)
          if (plaintext) {
            resolve(deserialiseVault(plaintext))
            return
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
              const plaintext = decryptVault(bestEvent.content, privkey, pubkey)
              if (plaintext) {
                resolve(deserialiseVault(plaintext))
                return
              }
            }
            resolve(null)
          }
        },
      },
    )
  })
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
): Record<string, AppGroup> {
  const merged: Record<string, AppGroup> = { ...local }

  for (const [id, vaultGroup] of Object.entries(vault)) {
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
