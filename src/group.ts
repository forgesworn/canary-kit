import { randomSeed } from './crypto.js'
import { getCounter, DEFAULT_ROTATION_INTERVAL, MAX_COUNTER_OFFSET } from './counter.js'
import { deriveToken, deriveDuressToken, MAX_TOLERANCE } from './token.js'
import { GROUP_CONTEXT } from './derive.js'
import { PRESETS, type PresetName } from './presets.js'

const HEX_64_RE = /^[0-9a-f]{64}$/

/** Maximum group members. Large groups degrade collision resistance in the 2048-word space. */
const MAX_MEMBERS = 100

/** Validate that a string is a 64-character lowercase hex pubkey. */
function validatePubkey(pubkey: string): void {
  if (!HEX_64_RE.test(pubkey)) {
    throw new Error(`Invalid member pubkey: expected 64 hex characters, got ${pubkey.length} chars`)
  }
}

/** Configuration provided when creating a new group. */
export interface GroupConfig {
  name: string
  members: string[]
  /** Named threat-profile preset. Explicit fields override preset values. */
  preset?: PresetName
  rotationInterval?: number
  wordCount?: 1 | 2 | 3
  wordlist?: string
  /** Counter tolerance for verification: accept tokens within ±tolerance counter values (default: 1). */
  tolerance?: number
  /** Beacon broadcast interval in seconds (default: 300 = 5 minutes). */
  beaconInterval?: number
  /** Geohash precision for normal beacons, 1–11 (default: 6 ≈ 1.2km). */
  beaconPrecision?: number
  /** Pubkey of the group creator. Only the creator is admin at bootstrap. Must be in `members`. */
  creator?: string
}

/** Persistent state for a canary group. All fields are serialisable. */
export interface GroupState {
  name: string
  seed: string
  members: string[]
  rotationInterval: number
  wordCount: 1 | 2 | 3
  wordlist: string
  /** Time-based counter at group creation. Advances with rotation interval. */
  counter: number
  /** Burn-after-use offset applied on top of the time-based counter. */
  usageOffset: number
  createdAt: number
  /** Counter tolerance for verification: accept tokens within ±tolerance counter values. */
  tolerance: number
  /** Beacon broadcast interval in seconds. */
  beaconInterval: number
  /** Geohash precision for normal beacons (1–11). */
  beaconPrecision: number
  /** Pubkeys with admin privileges (reseed, add/remove others). */
  admins: string[]
  /** Monotonic epoch — increments on reseed. Used for replay protection. */
  epoch: number
  /** Consumed operation IDs within the current epoch. Cleared on epoch bump. */
  consumedOps: string[]
  /** Timestamp floor: reject messages with timestamps at or below this value (replay protection after consumedOps eviction). */
  consumedOpsFloor?: number
}

/**
 * Combine the time-based counter with the usage offset to produce the
 * effective counter used for word derivation.
 */
function effectiveCounter(state: GroupState): number {
  return state.counter + state.usageOffset
}

/** Create a new group with a freshly generated seed and time-based counter. */
export function createGroup(config: GroupConfig): GroupState {
  if (config.preset !== undefined) {
    if (typeof config.preset !== 'string' || !Object.hasOwn(PRESETS, config.preset)) {
      throw new Error(`Unknown preset: "${config.preset}". Valid presets: ${Object.keys(PRESETS).join(', ')}`)
    }
  }
  const now = Math.floor(Date.now() / 1000)
  const base = config.preset !== undefined ? PRESETS[config.preset as keyof typeof PRESETS] : undefined
  const interval = config.rotationInterval ?? base?.rotationInterval ?? DEFAULT_ROTATION_INTERVAL
  const wordCount = config.wordCount ?? base?.wordCount ?? 1
  const tolerance = config.tolerance ?? 1

  // Validate resolved config values
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error(`rotationInterval must be a positive integer, got ${interval}`)
  }
  if (wordCount !== 1 && wordCount !== 2 && wordCount !== 3) {
    throw new Error(`wordCount must be 1, 2, or 3, got ${wordCount}`)
  }
  if (!Number.isInteger(tolerance) || tolerance < 0 || tolerance > MAX_TOLERANCE) {
    throw new RangeError(`tolerance must be an integer 0–${MAX_TOLERANCE}, got ${tolerance}`)
  }
  if (config.beaconInterval !== undefined) {
    if (!Number.isInteger(config.beaconInterval) || config.beaconInterval <= 0) {
      throw new Error(`beaconInterval must be a positive integer, got ${config.beaconInterval}`)
    }
  }
  if (config.beaconPrecision !== undefined) {
    if (!Number.isInteger(config.beaconPrecision) || config.beaconPrecision < 1 || config.beaconPrecision > 11) {
      throw new Error(`beaconPrecision must be an integer between 1 and 11, got ${config.beaconPrecision}`)
    }
  }

  for (const pubkey of config.members) {
    validatePubkey(pubkey)
  }

  if (config.creator !== undefined) {
    validatePubkey(config.creator)
    if (!config.members.includes(config.creator)) {
      throw new Error('creator must be in members')
    }
  }

  if (wordCount === 1 && config.members.length >= 10) {
    console.warn(
      `[canary-kit] Group "${config.name}" has ${config.members.length} members with 1-word encoding. ` +
      `CANARY spec recommends 2+ words for groups of 10+ members to avoid duress collision (~2.2% at 10 members).`
    )
  }

  return {
    name: config.name,
    seed: randomSeed(),
    members: [...config.members],
    rotationInterval: interval,
    wordCount,
    tolerance,
    wordlist: config.wordlist ?? 'en-v1',
    counter: getCounter(now, interval),
    usageOffset: 0,
    createdAt: now,
    beaconInterval: config.beaconInterval ?? 300,
    beaconPrecision: config.beaconPrecision ?? 6,
    admins: config.creator ? [config.creator] : [],
    epoch: 0,
    consumedOps: [],
  }
}

/**
 * Return the current verification word (or space-joined phrase) that all
 * group members should use to authenticate with one another.
 */
export function getCurrentWord(state: GroupState): string {
  const counter = effectiveCounter(state)
  const encoding = state.wordCount === 1 ? undefined : { format: 'words' as const, count: state.wordCount }
  return deriveToken(state.seed, GROUP_CONTEXT, counter, encoding)
}

/**
 * Return the duress word (or phrase) for a specific member at the current
 * counter. Duress words are member-specific and distinct from the verification
 * word, allowing silent distress signalling.
 */
export function getCurrentDuressWord(state: GroupState, memberPubkey: string): string {
  const counter = effectiveCounter(state)
  const encoding = state.wordCount === 1 ? undefined : { format: 'words' as const, count: state.wordCount }
  return deriveDuressToken(state.seed, GROUP_CONTEXT, memberPubkey, counter, encoding, state.tolerance)
}

/**
 * Advance the usage offset by one, rotating the current word (burn-after-use).
 * Throws a RangeError if the effective counter would exceed the current
 * time-based counter plus MAX_COUNTER_OFFSET, per CANARY spec §Counter Acceptance.
 * Returns new state — does not mutate the input.
 */
export function advanceCounter(state: GroupState): GroupState {
  const timeBased = getCounter(Math.floor(Date.now() / 1000), state.rotationInterval)
  const newEffective = state.counter + state.usageOffset + 1
  if (newEffective > timeBased + MAX_COUNTER_OFFSET) {
    throw new RangeError(
      `Cannot advance counter: effective counter ${newEffective} would exceed ` +
      `time-based counter ${timeBased} + MAX_COUNTER_OFFSET (${MAX_COUNTER_OFFSET})`,
    )
  }
  return { ...state, usageOffset: state.usageOffset + 1 }
}

/**
 * Generate a fresh seed and reset the usage offset to zero.
 * Call this after a security event (e.g. suspected compromise).
 * Returns new state — does not mutate the input.
 */
export function reseed(state: GroupState): GroupState {
  return { ...state, seed: randomSeed(), usageOffset: 0 }
}

/**
 * Add a member to the group. If the pubkey is already present, returns the
 * existing state unchanged (idempotent).
 * Returns new state — does not mutate the input.
 */
export function addMember(state: GroupState, pubkey: string): GroupState {
  validatePubkey(pubkey)
  if (state.members.includes(pubkey)) return state
  if (state.members.length >= MAX_MEMBERS) {
    throw new Error(`Cannot add member: group has reached the maximum of ${MAX_MEMBERS} members`)
  }
  return { ...state, members: [...state.members, pubkey] }
}

/**
 * Remove a member from the group's member list.
 *
 * **Important:** This does NOT reseed. In a symmetric-key group, the removed
 * member still possesses the old seed and can derive valid words. Use
 * `removeMemberAndReseed()` instead unless you have a specific reason not to.
 *
 * Returns new state — does not mutate the input.
 */
export function removeMember(state: GroupState, pubkey: string): GroupState {
  return { ...state, members: state.members.filter((m) => m !== pubkey) }
}

/**
 * Remove a member and immediately reseed, atomically invalidating the old seed.
 * This is the recommended way to remove members — ensures forward secrecy by
 * preventing the removed member from deriving future tokens or decrypting
 * future beacons.
 *
 * Returns new state — does not mutate the input.
 */
export function removeMemberAndReseed(state: GroupState, pubkey: string): GroupState {
  const removed = removeMember(state, pubkey)
  return reseed(removed)
}

/**
 * Dissolve a group, zeroing the seed and clearing all members.
 * Per CANARY spec §Seed Storage: seed MUST be wiped on group dissolution.
 * Preserves name and timestamps for audit trail.
 *
 * Note: zeroing the seed string prevents further token derivation. Full
 * memory erasure of prior string values is not possible in JS — platform-level
 * secure storage should handle that concern. Callers MUST also delete the
 * persisted record (IndexedDB, localStorage, backend) after calling this.
 *
 * Returns new state — does not mutate the input.
 */
export function dissolveGroup(state: GroupState): GroupState {
  return {
    ...state,
    seed: '0'.repeat(64),
    members: [],
    admins: [],
    usageOffset: 0,
    consumedOps: [],
  }
}

/** Refresh the counter to the current time window. Call after loading persisted state.
 * Enforces monotonicity: the counter never regresses, preventing clock rollback attacks. */
export function syncCounter(
  state: GroupState,
  nowSec: number = Math.floor(Date.now() / 1000),
): GroupState {
  const counter = getCounter(nowSec, state.rotationInterval)
  if (counter <= state.counter) return state
  return { ...state, counter, usageOffset: 0 }
}
