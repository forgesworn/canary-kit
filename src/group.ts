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
  /**
   * Beacon broadcast interval in seconds (default: 300 = 5 minutes).
   *
   * **Privacy note:** Fixed-interval beacons are correlatable by timing.
   * A relay observer who knows the group's `h` tag can cluster sequential
   * events by publishing cadence to identify individual members or detect
   * when a member goes offline. Applications SHOULD add random jitter to
   * the publish schedule — e.g. ±20–30% of the interval — to reduce
   * timing correlation. The library does not add jitter because it
   * encrypts payloads but does not control publish scheduling.
   */
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

/**
 * Create a new group with a freshly generated seed and time-based counter.
 *
 * @param config - Group configuration including name, members, optional preset and overrides.
 * @returns A new {@link GroupState} with a cryptographically secure random seed.
 * @throws {Error} If name is empty, preset is unknown, members contain invalid pubkeys, or config values are out of range.
 *
 * @example
 * ```ts
 * const group = createGroup({
 *   name: 'Family',
 *   members: [alicePubkey, bobPubkey],
 *   preset: 'family',
 * })
 * getCurrentWord(group)  // "falcon"
 * ```
 */
export function createGroup(config: GroupConfig): GroupState {
  if (typeof config.name !== 'string' || config.name.length === 0) {
    throw new Error('name must be a non-empty string')
  }
  if (config.name.length > 256) {
    throw new Error('name must be at most 256 characters')
  }
  if (config.preset !== undefined) {
    if (typeof config.preset !== 'string' || !Object.hasOwn(PRESETS, config.preset)) {
      throw new Error(`Unknown preset: "${config.preset}". Valid presets: ${Object.keys(PRESETS).join(', ')}`)
    }
  }
  const now = Math.floor(Date.now() / 1000)
  const base = config.preset !== undefined ? PRESETS[config.preset] : undefined
  const interval = config.rotationInterval ?? base?.rotationInterval ?? DEFAULT_ROTATION_INTERVAL
  const wordCount = config.wordCount ?? base?.wordCount ?? 1
  const tolerance = config.tolerance ?? 1

  // Validate resolved config values
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error(`rotationInterval must be a positive integer, got ${interval}`)
  }
  if (wordCount !== 1 && wordCount !== 2 && wordCount !== 3) {
    throw new Error(`wordCount must be 1, 2, or 3, got ${wordCount as number}`)
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

  const uniqueMembers = new Set(config.members)
  if (uniqueMembers.size !== config.members.length) {
    throw new Error('Duplicate pubkeys in members array')
  }

  if (config.creator !== undefined) {
    validatePubkey(config.creator)
    if (!config.members.includes(config.creator)) {
      throw new Error('creator must be in members')
    }
  }

  if (wordCount === 1 && config.members.length >= 10) {
    console.warn(
      `[canary-kit] Group has ${config.members.length} members with 1-word encoding. ` +
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
 *
 * @param state - Current group state.
 * @returns The current verification word or space-joined phrase.
 *
 * @example
 * ```ts
 * const group = createGroup({ name: 'Family', members: [alice, bob] })
 * const word = getCurrentWord(group)  // e.g. "falcon"
 * ```
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
 *
 * @param state - Current group state.
 * @param memberPubkey - 64-character hex pubkey of the member requesting their duress word.
 * @returns The member's duress word or space-joined phrase, distinct from the verification word.
 */
export function getCurrentDuressWord(state: GroupState, memberPubkey: string): string {
  const counter = effectiveCounter(state)
  const encoding = state.wordCount === 1 ? undefined : { format: 'words' as const, count: state.wordCount }
  return deriveDuressToken(state.seed, GROUP_CONTEXT, memberPubkey, counter, encoding, state.tolerance, state.members)
}

/**
 * Advance the usage offset by one, rotating the current word (burn-after-use).
 * Throws a RangeError if the effective counter would exceed the current
 * time-based counter plus MAX_COUNTER_OFFSET, per CANARY spec §Counter Acceptance.
 * Returns new state — does not mutate the input.
 *
 * @param state - Current group state.
 * @returns New group state with usageOffset incremented by one.
 * @throws {RangeError} If advancing would exceed the time-based counter plus MAX_COUNTER_OFFSET.
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
 *
 * @param state - Current group state.
 * @returns New group state with a fresh cryptographically secure seed and usageOffset reset to zero.
 */
export function reseed(state: GroupState): GroupState {
  return { ...state, seed: randomSeed(), usageOffset: 0 }
}

/**
 * Add a member to the group. If the pubkey is already present, returns the
 * existing state unchanged (idempotent).
 * Returns new state — does not mutate the input.
 *
 * @param state - Current group state.
 * @param pubkey - 64-character lowercase hex pubkey of the member to add.
 * @returns New group state with the member added, or unchanged state if already present.
 * @throws {Error} If pubkey is not a valid 64-character hex string or group is at maximum capacity.
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
 *
 * @param state - Current group state.
 * @param pubkey - 64-character lowercase hex pubkey of the member to remove.
 * @returns New group state with the member removed (no-op if not found).
 * @throws {Error} If pubkey is not a valid 64-character hex string.
 */
export function removeMember(state: GroupState, pubkey: string): GroupState {
  validatePubkey(pubkey)
  return { ...state, members: state.members.filter((m) => m !== pubkey) }
}

/**
 * Remove a member and immediately reseed, atomically invalidating the old seed.
 * This is the recommended way to remove members — ensures forward secrecy by
 * preventing the removed member from deriving future tokens or decrypting
 * future beacons.
 *
 * Returns new state — does not mutate the input.
 *
 * @param state - Current group state.
 * @param pubkey - 64-character lowercase hex pubkey of the member to remove.
 * @returns New group state with the member removed and a fresh seed.
 * @throws {Error} If pubkey is not a valid 64-character hex string.
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
 *
 * @param state - Current group state.
 * @returns New group state with seed zeroed, members and admins cleared, and offsets reset.
 */
export function dissolveGroup(state: GroupState): GroupState {
  return {
    ...state,
    seed: '0'.repeat(64),
    members: [],
    admins: [],
    usageOffset: 0,
    consumedOps: [],
    consumedOpsFloor: undefined,
  }
}

/**
 * Refresh the counter to the current time window. Call after loading persisted state.
 * Enforces monotonicity: the counter never regresses, preventing clock rollback attacks.
 *
 * @param state - Current group state.
 * @param nowSec - Current unix timestamp in seconds (default: `Date.now() / 1000`).
 * @returns New group state with counter updated and usageOffset reset, or unchanged if counter has not advanced.
 */
export function syncCounter(
  state: GroupState,
  nowSec: number = Math.floor(Date.now() / 1000),
): GroupState {
  const counter = getCounter(nowSec, state.rotationInterval)
  if (counter <= state.counter) return state
  return { ...state, counter, usageOffset: 0 }
}
