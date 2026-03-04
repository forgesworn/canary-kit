import { randomSeed, hmacSha256, hexToBytes, bytesToHex } from './crypto.js'
import { getCounter, DEFAULT_ROTATION_INTERVAL } from './counter.js'
import {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  deriveDuressPhrase,
} from './derive.js'
import { PRESETS, type PresetName } from './presets.js'

const HEX_64_RE = /^[0-9a-f]{64}$/

/** Validate that a string is a 64-character lowercase hex pubkey. */
function validatePubkey(pubkey: string): void {
  if (!HEX_64_RE.test(pubkey)) {
    throw new Error(`Invalid member pubkey: expected 64 hex characters, got "${pubkey}"`)
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
  /** Beacon broadcast interval in seconds (default: 300 = 5 minutes). */
  beaconInterval?: number
  /** Geohash precision for normal beacons, 1–11 (default: 6 ≈ 1.2km). */
  beaconPrecision?: number
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
  /** Beacon broadcast interval in seconds. */
  beaconInterval: number
  /** Geohash precision for normal beacons (1–11). */
  beaconPrecision: number
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

  // Validate resolved config values
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error(`rotationInterval must be a positive integer, got ${interval}`)
  }
  if (wordCount !== 1 && wordCount !== 2 && wordCount !== 3) {
    throw new Error(`wordCount must be 1, 2, or 3, got ${wordCount}`)
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

  return {
    name: config.name,
    seed: randomSeed(),
    members: [...config.members],
    rotationInterval: interval,
    wordCount,
    wordlist: config.wordlist ?? 'en-v1',
    counter: getCounter(now, interval),
    usageOffset: 0,
    createdAt: now,
    beaconInterval: config.beaconInterval ?? 300,
    beaconPrecision: config.beaconPrecision ?? 6,
  }
}

/**
 * Return the current verification word (or space-joined phrase) that all
 * group members should use to authenticate with one another.
 */
export function getCurrentWord(state: GroupState): string {
  const counter = effectiveCounter(state)
  if (state.wordCount === 1) {
    return deriveVerificationWord(state.seed, counter)
  }
  return deriveVerificationPhrase(state.seed, counter, state.wordCount).join(' ')
}

/**
 * Return the duress word (or phrase) for a specific member at the current
 * counter. Duress words are member-specific and distinct from the verification
 * word, allowing silent distress signalling.
 */
export function getCurrentDuressWord(state: GroupState, memberPubkey: string): string {
  const counter = effectiveCounter(state)
  if (state.wordCount === 1) {
    return deriveDuressWord(state.seed, memberPubkey, counter)
  }
  return deriveDuressPhrase(state.seed, memberPubkey, counter, state.wordCount).join(' ')
}

/**
 * Advance the usage offset by one, rotating the current word (burn-after-use).
 * Returns new state — does not mutate the input.
 */
export function advanceCounter(state: GroupState): GroupState {
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
 * Derive a new seed deterministically from the current seed and a context string.
 *
 * **SECURITY WARNING:** Do NOT use this for member removal. A removed member
 * knows the old seed and can compute the result, defeating forward secrecy.
 * For member removal, use `removeMember()` (which only filters the member list)
 * followed by creating a new group with a fresh random seed.
 *
 * newSeed = HMAC-SHA256(currentSeed, "canary:reseed:" + context)
 *
 * @deprecated Prefer `reseed()` (random) for security-critical key rotation.
 */
export function deterministicReseed(state: GroupState, context: string): GroupState {
  const key = hexToBytes(state.seed)
  const data = new TextEncoder().encode('canary:reseed:' + context)
  const newSeed = bytesToHex(hmacSha256(key, data))
  return { ...state, seed: newSeed, usageOffset: 0 }
}

/**
 * Add a member to the group. If the pubkey is already present, returns the
 * existing state unchanged (idempotent).
 * Returns new state — does not mutate the input.
 */
export function addMember(state: GroupState, pubkey: string): GroupState {
  validatePubkey(pubkey)
  if (state.members.includes(pubkey)) return state
  return { ...state, members: [...state.members, pubkey] }
}

/**
 * Remove a member from the group's member list.
 *
 * **Important:** This does NOT reseed. In a symmetric-key group, the removed
 * member still possesses the old seed and can derive valid words. Callers
 * should create a replacement group with a fresh seed if forward secrecy is
 * required. See `reseed()` for manual key rotation.
 *
 * Returns new state — does not mutate the input.
 */
export function removeMember(state: GroupState, pubkey: string): GroupState {
  return { ...state, members: state.members.filter((m) => m !== pubkey) }
}

/** Refresh the counter to the current time window. Call after loading persisted state. */
export function syncCounter(
  state: GroupState,
  nowSec: number = Math.floor(Date.now() / 1000),
): GroupState {
  const counter = getCounter(nowSec, state.rotationInterval)
  if (counter === state.counter) return state
  return { ...state, counter, usageOffset: 0 }
}
