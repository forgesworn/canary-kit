// app/invite.ts — Invite creation and acceptance for CANARY groups

import { getState, updateGroup } from './state.js'
import type { AppGroup } from './types.js'

// ── Types ──────────────────────────────────────────────────────

/** Serialisable invite payload passed between devices. */
export interface InvitePayload {
  /** Shared group identifier — both inviter and receiver use this so relay sync works. */
  groupId: string
  seed: string
  groupName: string
  rotationInterval: number
  wordCount: 1 | 2 | 3
  wordlist: string
  counter: number
  usageOffset: number
  /** Random 16-byte hex nonce — prevents replay attacks. */
  nonce: string
  beaconInterval: number
  beaconPrecision: number
  members: string[]
  /** Relay URLs so the receiver can sync immediately. */
  relays: string[]
  /** Encoding format preference. */
  encodingFormat: 'words' | 'pin' | 'hex'
  /** Tolerance window. */
  tolerance: number
}

// ── Helpers ────────────────────────────────────────────────────

/**
 * Generate a 16-byte cryptographically random nonce as a hex string.
 */
function randomNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Derive the 6-character confirmation code from a nonce.
 * Uses the last 6 hex characters, uppercased.
 */
function confirmCodeFromNonce(nonce: string): string {
  return nonce.slice(-6).toUpperCase()
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Create an invite for the given group.
 *
 * Produces a base64-encoded JSON payload containing all the group
 * parameters needed for a new member to join, plus a random nonce
 * to prevent replay attacks.
 *
 * @returns `payload` — base64 invite string to share with the new member.
 * @returns `confirmCode` — 6-char code to read aloud for out-of-band confirmation.
 */
export function createInvite(group: AppGroup): { payload: string; confirmCode: string } {
  const nonce = randomNonce()

  const invitePayload: InvitePayload = {
    groupId: group.id,
    seed: group.seed,
    groupName: group.name,
    rotationInterval: group.rotationInterval,
    wordCount: group.wordCount,
    wordlist: group.wordlist,
    counter: group.counter,
    usageOffset: group.usageOffset,
    nonce,
    beaconInterval: group.beaconInterval,
    beaconPrecision: group.beaconPrecision,
    members: [...group.members],
    relays: [...(group.relays ?? [])],
    encodingFormat: group.encodingFormat ?? 'words',
    tolerance: group.tolerance ?? 1,
  }

  const payload = btoa(JSON.stringify(invitePayload))
  const confirmCode = confirmCodeFromNonce(nonce)

  return { payload, confirmCode }
}

/**
 * Accept and decode an invite payload.
 *
 * @param payload     Base64-encoded JSON invite string.
 * @param confirmCode Optional 6-char confirmation code for verification.
 * @throws            If the payload is invalid or the confirmation code does not match.
 */
export function acceptInvite(payload: string, confirmCode?: string): InvitePayload {
  let data: InvitePayload
  try {
    data = JSON.parse(atob(payload)) as InvitePayload
  } catch {
    throw new Error('Invalid invite payload — could not decode.')
  }

  if (
    typeof data.seed !== 'string' ||
    typeof data.groupName !== 'string' ||
    typeof data.nonce !== 'string'
  ) {
    throw new Error('Invalid invite payload — missing required fields.')
  }

  if (confirmCode !== undefined) {
    const expected = confirmCodeFromNonce(data.nonce)
    if (confirmCode.toUpperCase() !== expected) {
      throw new Error('Confirmation code does not match — invite may be tampered.')
    }
  }

  return data
}

/**
 * Check whether an invite nonce has already been consumed for the given group.
 */
export function isInviteConsumed(groupId: string, nonce: string): boolean {
  const { groups } = getState()
  const group = groups[groupId]
  if (!group) return false
  return group.usedInvites.includes(nonce)
}

/**
 * Mark an invite nonce as consumed for the given group.
 * Subsequent calls to `isInviteConsumed` with the same nonce will return true.
 */
export function consumeInvite(groupId: string, nonce: string): void {
  const { groups } = getState()
  const group = groups[groupId]
  if (!group) {
    console.warn(`[canary:invite] consumeInvite: unknown group id "${groupId}"`)
    return
  }

  updateGroup(groupId, {
    usedInvites: [...group.usedInvites, nonce],
  })
}
