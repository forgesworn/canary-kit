/**
 * NIP-XX Nostr transport builders for Simple Shared Secret (SSG) groups.
 *
 * Three event kinds are used:
 *
 * - **kind 30078** (parameterised replaceable) — group state and stored signals.
 *   The d-tag uses the `ssg/` namespace prefix.
 * - **kind 20078** (ephemeral) — real-time signals between group members.
 * - **kind 14** (rumour / unsigned inner event) — NIP-17 gift-wrapped DMs carrying
 *   seed distribution, reseed, and other private payloads.
 *
 * Builders return unsigned events (`UnsignedEvent`). The consumer is responsible for
 * signing (NIP-01), encrypting content (NIP-44), and wrapping (NIP-59) as needed.
 */

import { sha256, bytesToHex } from './crypto.js'

// ── Constants ────────────────────────────────────────────────────────────────

/** NIP-XX event kinds used by SSG groups. */
export const KINDS = {
  groupState: 30_078,
  signal: 20_078,
  giftWrap: 1_059,
} as const

// ── Core types ───────────────────────────────────────────────────────────────

/** Unsigned Nostr event (consumer signs with their own library). */
export interface UnsignedEvent {
  kind: number
  content: string
  tags: string[][]
  created_at: number
}

// ── Param types ──────────────────────────────────────────────────────────────

export interface GroupStateEventParams {
  groupId: string
  members: string[]
  encryptedContent: string
  rotationInterval?: number
  tolerance?: number
  expiration?: number
}

export interface StoredSignalEventParams {
  groupId: string
  signalType: string
  encryptedContent: string
}

export interface SignalEventParams {
  groupId: string
  signalType: string
  encryptedContent: string
}

export interface RumourEventParams {
  recipientPubkey: string
  subject: string
  encryptedContent: string
  groupEventId?: string
}

// ── Payload types (plaintext structures before NIP-44 encryption) ────────────

/** Plaintext payload for group configuration (kind 30078 encrypted content). */
export interface GroupConfigPayload {
  description: string
  policies: {
    invite_by: 'admin' | 'any_member'
    reseed_by: 'admin' | 'any_admin'
  }
}

/** Plaintext payload for seed distribution (kind 14 rumour). */
export interface SeedDistributionPayload {
  seed: string
  /** Allows re-seeding mid-window without waiting for the next natural time rotation. */
  counter_offset: number
  /** The group's d-tag value (group identifier). */
  group_d: string
}

/** Plaintext payload for reseed notification (kind 14 rumour). */
export interface ReseedPayload {
  seed: string
  reason: 'member_removed' | 'compromise' | 'scheduled' | 'duress'
}

/** Plaintext payload for member update (kind 14 rumour). */
export interface MemberUpdatePayload {
  action: 'add' | 'remove'
  member: string
  reseed: boolean
}

/** Plaintext payload for counter advance (kind 20078 signal). */
export interface CounterAdvancePayload {
  new_counter: number
}

/** Plaintext payload for word-used / burn-after-use (kind 20078 signal). */
export interface WordUsedPayload {
  new_counter: number
  used_by: string
  duress: boolean
}

// ── Validation helpers ───────────────────────────────────────────────────────

const HEX_64_RE = /^[0-9a-f]{64}$/
const MAX_TAG_LENGTH = 256
/** Maximum encrypted content length (64 KB — aligns with typical Nostr relay limits). */
const MAX_CONTENT_LENGTH = 65_536

export function validatePubkey(pubkey: string, label: string): void {
  if (!HEX_64_RE.test(pubkey)) {
    throw new Error(`Invalid ${label}: expected 64 lowercase hex characters, got ${pubkey.length} chars`)
  }
}

export function validateTagString(value: string, label: string): void {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid ${label}: must be a non-empty string`)
  }
  if (value.length > MAX_TAG_LENGTH) {
    throw new Error(`Invalid ${label}: exceeds maximum length of ${MAX_TAG_LENGTH} characters`)
  }
}

export function validateExpiration(expiration: number): void {
  if (!Number.isInteger(expiration) || expiration < 0) {
    throw new Error('expiration must be a non-negative integer')
  }
}

export function validateEventId(eventId: string, label: string): void {
  if (!HEX_64_RE.test(eventId)) {
    throw new Error(`Invalid ${label}: expected 64 lowercase hex characters, got ${eventId.length} chars`)
  }
}

function validateContent(content: string): void {
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error(`encryptedContent exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`)
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function now(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * SHA-256 hash a group ID for use in d-tags where privacy matters.
 *
 * Duplicates hashGroupTag from sync-crypto.ts — kept independent to avoid
 * coupling builders to sync layer.
 */
export function hashGroupId(groupId: string): string {
  return bytesToHex(sha256(new TextEncoder().encode(groupId)))
}

// ── Builder functions ────────────────────────────────────────────────────────

/**
 * Build an unsigned kind 30078 group state event.
 *
 * The d-tag uses plaintext `ssg/<groupId>` since content is NIP-44 encrypted.
 * Includes NIP-32 labels for SSG namespace and p-tags for each member.
 *
 * @param params - Group state parameters.
 * @returns An {@link UnsignedEvent} ready to be signed and published.
 * @throws {Error} If groupId is invalid, member pubkeys are malformed, or optional
 *   numeric fields are out of range.
 */
export function buildGroupStateEvent(params: GroupStateEventParams): UnsignedEvent {
  validateTagString(params.groupId, 'groupId')
  validateContent(params.encryptedContent)
  for (const m of params.members) validatePubkey(m, 'member pubkey')

  const tags: string[][] = [
    ['d', `ssg/${params.groupId}`],
    ...params.members.map((m) => ['p', m]),
    ['L', 'ssg'],
    ['l', 'group', 'ssg'],
  ]

  if (params.rotationInterval !== undefined) {
    if (!Number.isInteger(params.rotationInterval) || params.rotationInterval <= 0) {
      throw new Error(`Invalid rotationInterval: must be a positive integer, got ${params.rotationInterval}`)
    }
    tags.push(['rotation', String(params.rotationInterval)])
  }

  if (params.tolerance !== undefined) {
    if (!Number.isInteger(params.tolerance) || params.tolerance < 0) {
      throw new Error(`Invalid tolerance: must be a non-negative integer, got ${params.tolerance}`)
    }
    tags.push(['tolerance', String(params.tolerance)])
  }

  if (params.expiration !== undefined) {
    validateExpiration(params.expiration)
    tags.push(['expiration', String(params.expiration)])
  }

  return { kind: KINDS.groupState, content: params.encryptedContent, tags, created_at: now() }
}

/**
 * Build an unsigned kind 30078 stored signal event.
 *
 * The d-tag uses a SHA-256 hash of the group ID (for privacy) scoped by signal type:
 * `ssg/<SHA256(groupId)>:<signalType>`.
 *
 * Includes a 7-day NIP-40 expiration tag.
 *
 * @param params - Stored signal parameters.
 * @returns An {@link UnsignedEvent} ready to be signed and published.
 * @throws {Error} If groupId or signalType are empty.
 */
export function buildStoredSignalEvent(params: StoredSignalEventParams): UnsignedEvent {
  validateTagString(params.groupId, 'groupId')
  validateTagString(params.signalType, 'signalType')
  validateContent(params.encryptedContent)

  const hash = hashGroupId(params.groupId)
  const createdAt = now()
  const sevenDays = 7 * 24 * 60 * 60

  return {
    kind: KINDS.groupState,
    content: params.encryptedContent,
    tags: [
      ['d', `ssg/${hash}:${params.signalType}`],
      ['expiration', String(createdAt + sevenDays)],
    ],
    created_at: createdAt,
  }
}

/**
 * Build an unsigned kind 20078 ephemeral signal event.
 *
 * The d-tag uses a SHA-256 hash of the group ID (for privacy):
 * `ssg/<SHA256(groupId)>`. A t-tag carries the signal type.
 *
 * No expiration tag — ephemeral events are not stored by relays.
 *
 * @param params - Signal parameters.
 * @returns An {@link UnsignedEvent} ready to be signed and published.
 * @throws {Error} If groupId or signalType are empty.
 */
export function buildSignalEvent(params: SignalEventParams): UnsignedEvent {
  validateTagString(params.groupId, 'groupId')
  validateTagString(params.signalType, 'signalType')
  validateContent(params.encryptedContent)

  const hash = hashGroupId(params.groupId)

  return {
    kind: KINDS.signal,
    content: params.encryptedContent,
    tags: [
      ['d', `ssg/${hash}`],
      ['t', params.signalType],
    ],
    created_at: now(),
  }
}

/**
 * Build an unsigned kind 14 rumour event for NIP-17 gift wrapping.
 *
 * The consumer must set the `pubkey` field before computing the event ID.
 * The rumour is then sealed (NIP-44 encrypt + kind 13) and gift-wrapped
 * (kind 1059) by the caller.
 *
 * @param params - Rumour parameters including recipient and subject.
 * @returns An {@link UnsignedEvent} ready for NIP-59 wrapping.
 * @throws {Error} If recipientPubkey is invalid, subject is empty, or groupEventId is invalid.
 */
export function buildRumourEvent(params: RumourEventParams): UnsignedEvent {
  validatePubkey(params.recipientPubkey, 'recipientPubkey')
  validateTagString(params.subject, 'subject')
  validateContent(params.encryptedContent)

  if (params.groupEventId !== undefined) {
    validateEventId(params.groupEventId, 'groupEventId')
  }

  const tags: string[][] = [
    ['p', params.recipientPubkey],
    ['subject', params.subject],
  ]

  if (params.groupEventId !== undefined) {
    tags.push(['e', params.groupEventId])
  }

  return {
    kind: 14,
    content: params.encryptedContent,
    tags,
    created_at: now(),
  }
}
