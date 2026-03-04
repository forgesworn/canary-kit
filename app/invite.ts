// app/invite.ts — Invite creation and acceptance for CANARY groups

import { hmacSha256, bytesToHex, hexToBytes } from 'canary-kit/crypto'
import { PROTOCOL_VERSION } from 'canary-kit/sync'
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
  /** Invite creation time (unix seconds). */
  issuedAt: number
  /** Invite expiry time (unix seconds). */
  expiresAt: number
  /** Monotonic epoch at invite creation. */
  epoch: number
  /** Admin pubkeys at invite creation. */
  admins: string[]
  /** Protocol version at invite creation. */
  protocolVersion: number
  /** Pubkey of the admin who created this invite. */
  inviterPubkey: string
  /** HMAC-SHA256(seed, canonicalPayload) — proves the inviter knew the group seed. */
  inviterSig: string
}

// ── Helpers ────────────────────────────────────────────────────

const HEX_64_RE = /^[0-9a-f]{64}$/
const HEX_32_RE = /^[0-9a-f]{32}$/
const INVITE_MAX_AGE_SEC = 7 * 24 * 60 * 60
const MAX_CLOCK_SKEW_SEC = 300

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

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

function assertInvitePayload(raw: unknown): asserts raw is InvitePayload {
  const data = raw as Record<string, unknown>
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid invite payload — expected an object.')
  }

  if (typeof data.groupId !== 'string' || data.groupId.length === 0) {
    throw new Error('Invalid invite payload — groupId is required.')
  }
  if (typeof data.seed !== 'string' || !HEX_64_RE.test(data.seed)) {
    throw new Error('Invalid invite payload — seed must be 64-char hex.')
  }
  if (typeof data.groupName !== 'string' || data.groupName.trim().length === 0) {
    throw new Error('Invalid invite payload — groupName is required.')
  }
  if (!Number.isInteger(data.rotationInterval) || (data.rotationInterval as number) <= 0) {
    throw new Error('Invalid invite payload — rotationInterval must be > 0.')
  }
  if (data.wordCount !== 1 && data.wordCount !== 2 && data.wordCount !== 3) {
    throw new Error('Invalid invite payload — wordCount must be 1, 2, or 3.')
  }
  if (typeof data.wordlist !== 'string' || data.wordlist.length === 0) {
    throw new Error('Invalid invite payload — wordlist is required.')
  }
  if (!isNonNegativeInt(data.counter) || !isNonNegativeInt(data.usageOffset)) {
    throw new Error('Invalid invite payload — counter and usageOffset must be non-negative integers.')
  }
  if (typeof data.nonce !== 'string' || !HEX_32_RE.test(data.nonce)) {
    throw new Error('Invalid invite payload — nonce must be 32-char hex.')
  }
  if (!Number.isInteger(data.beaconInterval) || (data.beaconInterval as number) <= 0) {
    throw new Error('Invalid invite payload — beaconInterval must be > 0.')
  }
  if (!Number.isInteger(data.beaconPrecision) || (data.beaconPrecision as number) < 1 || (data.beaconPrecision as number) > 11) {
    throw new Error('Invalid invite payload — beaconPrecision must be 1..11.')
  }
  if (!Array.isArray(data.members) || !data.members.every((m) => typeof m === 'string' && HEX_64_RE.test(m))) {
    throw new Error('Invalid invite payload — members must be 64-char hex pubkeys.')
  }
  if (!Array.isArray(data.relays) || !data.relays.every((r) => typeof r === 'string' && r.startsWith('wss://'))) {
    throw new Error('Invalid invite payload — relays must be wss:// URLs.')
  }
  if (data.encodingFormat !== 'words' && data.encodingFormat !== 'pin' && data.encodingFormat !== 'hex') {
    throw new Error('Invalid invite payload — encodingFormat must be words|pin|hex.')
  }
  if (!isNonNegativeInt(data.tolerance)) {
    throw new Error('Invalid invite payload — tolerance must be a non-negative integer.')
  }
  if (!isNonNegativeInt(data.issuedAt) || !isNonNegativeInt(data.expiresAt)) {
    throw new Error('Invalid invite payload — issuedAt/expiresAt must be unix seconds.')
  }
  if ((data.expiresAt as number) <= (data.issuedAt as number)) {
    throw new Error('Invalid invite payload — expiresAt must be after issuedAt.')
  }
  if (!isNonNegativeInt(data.epoch)) {
    throw new Error('Invalid invite payload — epoch must be a non-negative integer.')
  }
  if (!Array.isArray(data.admins) || !data.admins.every((a) => typeof a === 'string' && HEX_64_RE.test(a))) {
    throw new Error('Invalid invite payload — admins must be 64-char hex pubkeys.')
  }
  // Enforce admins ⊆ members
  const memberSet = new Set(data.members as string[])
  if (!(data.admins as string[]).every((a) => memberSet.has(a))) {
    throw new Error('Invalid invite payload — all admins must be in members.')
  }
  if (data.protocolVersion === undefined || data.protocolVersion === null) {
    throw new Error('Invalid invite payload — protocolVersion is required.')
  }
  if (data.protocolVersion !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported invite protocol version: ${data.protocolVersion} (expected: ${PROTOCOL_VERSION})`)
  }
  if (typeof data.inviterPubkey !== 'string' || !HEX_64_RE.test(data.inviterPubkey)) {
    throw new Error('Invalid invite payload — inviterPubkey must be a 64-char hex pubkey.')
  }
  // Inviter must be in the admins list
  if (!(data.admins as string[]).includes(data.inviterPubkey as string)) {
    throw new Error('Invalid invite payload — inviterPubkey must be in admins.')
  }
  if (typeof data.inviterSig !== 'string' || !HEX_64_RE.test(data.inviterSig)) {
    throw new Error('Invalid invite payload — inviterSig must be a 64-char hex string.')
  }
}

/**
 * Compute the canonical bytes for invite signing/verification.
 * Excludes inviterSig (the field being computed) but includes all other fields.
 * Keys are sorted for deterministic output.
 */
function inviteCanonicalBytes(payload: InvitePayload): Uint8Array {
  const { inviterSig: _sig, ...rest } = payload
  const sorted = Object.keys(rest).sort().reduce((acc, key) => {
    acc[key] = (rest as Record<string, unknown>)[key]
    return acc
  }, {} as Record<string, unknown>)
  return new TextEncoder().encode(JSON.stringify(sorted))
}

/**
 * Compute the inviter signature: HMAC-SHA256(seed, canonicalPayload).
 * Proves the signer knew the group seed. Returns first 32 hex chars (128 bits).
 */
function computeInviterSig(payload: InvitePayload): string {
  const canonical = inviteCanonicalBytes(payload)
  const mac = hmacSha256(hexToBytes(payload.seed), canonical)
  return bytesToHex(mac).slice(0, 64)
}

/**
 * Derive a 12-character confirmation code that authenticates the full invite payload.
 *
 * Computes HMAC-SHA256 over the canonical payload content (all fields except nonce),
 * keyed by the nonce. This means any modification to the payload fields invalidates
 * the code, even if the nonce is unchanged.
 *
 * Returns 48 bits of MAC (12 hex chars) formatted as three groups of four: XXXX-XXXX-XXXX.
 */
function confirmCodeFromPayload(payload: InvitePayload): string {
  const { nonce, ...rest } = payload
  const data = JSON.stringify(rest)
  const encoder = new TextEncoder()
  const mac = hmacSha256(hexToBytes(nonce), encoder.encode(data))
  const hex = bytesToHex(mac).slice(0, 12).toUpperCase()
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`
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
 * @returns `confirmCode` — 12-char code (XXXX-XXXX-XXXX) to read aloud for out-of-band confirmation.
 */
export function createInvite(group: AppGroup): { payload: string; confirmCode: string } {
  // Only admins can create invites
  const { identity } = getState()
  if (!identity?.pubkey) {
    throw new Error('No local identity — cannot create invite.')
  }
  if (!group.admins.includes(identity.pubkey)) {
    throw new Error(`Not authorised — you are not an admin of "${group.name}".`)
  }

  const nonce = randomNonce()
  const issuedAt = Math.floor(Date.now() / 1000)

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
    issuedAt,
    expiresAt: issuedAt + INVITE_MAX_AGE_SEC,
    epoch: group.epoch ?? 0,
    admins: [...(group.admins ?? [])],
    protocolVersion: 1,
    inviterPubkey: identity.pubkey,
    inviterSig: '', // placeholder — computed below
  }

  invitePayload.inviterSig = computeInviterSig(invitePayload)

  const payload = btoa(JSON.stringify(invitePayload))
  const confirmCode = confirmCodeFromPayload(invitePayload)

  return { payload, confirmCode }
}

/**
 * Accept and decode an invite payload.
 *
 * @param payload     Base64-encoded JSON invite string.
 * @param confirmCode 12-char confirmation code (with or without separators) for verification.
 * @throws            If the payload is invalid or the confirmation code does not match.
 */
export function acceptInvite(payload: string, confirmCode?: string): InvitePayload {
  let raw: unknown
  try {
    raw = JSON.parse(atob(payload))
  } catch {
    throw new Error('Invalid invite payload — could not decode.')
  }

  assertInvitePayload(raw)

  // Return an explicit whitelist copy so no unexpected fields are carried into state.
  const data: InvitePayload = {
    groupId: raw.groupId,
    seed: raw.seed,
    groupName: raw.groupName,
    rotationInterval: raw.rotationInterval,
    wordCount: raw.wordCount,
    wordlist: raw.wordlist,
    counter: raw.counter,
    usageOffset: raw.usageOffset,
    nonce: raw.nonce,
    beaconInterval: raw.beaconInterval,
    beaconPrecision: raw.beaconPrecision,
    members: [...raw.members],
    relays: [...raw.relays],
    encodingFormat: raw.encodingFormat,
    tolerance: raw.tolerance,
    issuedAt: raw.issuedAt,
    expiresAt: raw.expiresAt,
    epoch: raw.epoch,
    admins: [...raw.admins],
    protocolVersion: raw.protocolVersion,
    inviterPubkey: raw.inviterPubkey,
    inviterSig: raw.inviterSig,
  }

  // Verify the inviter signature — proves the inviter knew the group seed.
  const expectedSig = computeInviterSig(data)
  if (data.inviterSig !== expectedSig) {
    throw new Error('Invite signature is invalid — the inviter could not prove knowledge of the group seed.')
  }

  if (!confirmCode?.trim()) {
    throw new Error('Confirmation code is required — ask the sender to read it to you.')
  }

  const expected = confirmCodeFromPayload(data)
  const normalised = confirmCode.trim().replace(/[-\s]/g, '').toUpperCase()
  const expectedRaw = expected.replace(/-/g, '')
  if (normalised !== expectedRaw) {
    throw new Error('Confirmation code does not match — invite may have been tampered with.')
  }

  const now = Math.floor(Date.now() / 1000)
  if (data.expiresAt <= now) {
    throw new Error('Invite has expired. Ask for a new invite.')
  }
  if (data.issuedAt > now + MAX_CLOCK_SKEW_SEC) {
    throw new Error('Invite timestamp is too far in the future — check your device clock.')
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
  return Array.isArray(group.usedInvites) && group.usedInvites.includes(nonce)
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
    usedInvites: Array.from(new Set([...group.usedInvites, nonce])),
  })
}
