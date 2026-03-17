import { hmacSha256, hexToBytes, concatBytes, timingSafeStringEqual } from './crypto.js'
import { encodeToken } from './encoding.js'
import {
  MAX_TOLERANCE,
  deriveDirectionalPair,
  type TokenVerifyResult,
  type DirectionalPair,
} from './token.js'
import type { TokenEncoding } from './encoding.js'

const encoder = new TextEncoder()

function counterBe32(counter: number): Uint8Array {
  const buf = new Uint8Array(4)
  new DataView(buf.buffer).setUint32(0, counter, false)
  return buf
}

/**
 * Generate a cryptographically secure 256-bit seed.
 * Uses the global `crypto.getRandomValues` (Web Crypto API).
 *
 * @returns A 32-byte Uint8Array containing cryptographically secure random bytes.
 */
export function generateSeed(): Uint8Array {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return bytes
}

/**
 * Derive a seed deterministically from a master key and string components.
 *
 * Algorithm: HMAC-SHA256(masterKey, utf8(components[0]) || 0x00 || utf8(components[1]) || ...)
 *
 * Null-byte separators prevent concatenation ambiguity.
 *
 * @param masterKey - Master key (hex string or Uint8Array, minimum 16 bytes).
 * @param components - One or more string components for domain separation.
 * @returns A deterministic 32-byte seed derived via HMAC-SHA256.
 * @throws {RangeError} If master key is shorter than 16 bytes.
 */
export function deriveSeed(
  masterKey: Uint8Array | string,
  ...components: string[]
): Uint8Array {
  const key = typeof masterKey === 'string' ? hexToBytes(masterKey) : masterKey
  if (key.length < 16) {
    throw new RangeError(`Master key must be at least 16 bytes, got ${key.length}`)
  }
  const parts: Uint8Array[] = []
  for (let i = 0; i < components.length; i++) {
    if (i > 0) parts.push(new Uint8Array([0x00]))
    parts.push(encoder.encode(components[i]))
  }
  return hmacSha256(key, concatBytes(...parts))
}

/** Named session preset identifier. */
export type SessionPresetName = 'call' | 'handoff'

/** A session preset — pre-configured settings for a specific use case. */
export interface SessionPreset {
  /** Words per token. */
  wordCount: number
  /** Rotation interval in seconds (0 = fixed counter, single-use). */
  rotationSeconds: number
  /** Counter tolerance window. */
  tolerance: number
  /** Whether this is a directional (two-party) preset. */
  directional: boolean
  /** Human-readable description. */
  description: string
}

/**
 * Built-in session presets for directional verification.
 *
 * | Preset    | Words | Rotation   | Tolerance | Use case                     |
 * |-----------|-------|------------|-----------|------------------------------|
 * | `call`    | 1     | 30 seconds | 1         | Phone verification           |
 * | `handoff` | 1     | single-use | 0         | Physical handoff (rideshare) |
 */
export const SESSION_PRESETS: Readonly<Record<SessionPresetName, Readonly<SessionPreset>>> = Object.freeze({
  call: Object.freeze({
    wordCount: 1,
    rotationSeconds: 30,
    tolerance: 1,
    directional: true,
    description:
      'Phone verification for insurance, banking, and call centres. ' +
      'Single word with 30-second rotation. Deepfake-proof — cloning a voice ' +
      'does not help derive the current word.',
  }),
  handoff: Object.freeze({
    wordCount: 1,
    rotationSeconds: 0,
    tolerance: 0,
    directional: true,
    description:
      'Physical handoff verification for rideshare, delivery, and task completion. ' +
      'Single-use token per event. No time dependency — counter is the task/event ID.',
  }),
})

/** Configuration for creating a directional verification session. */
export interface SessionConfig {
  /** Shared secret (hex string or Uint8Array). */
  secret: Uint8Array | string
  /** Namespace prefix for context strings (e.g. 'aviva', 'dispatch'). */
  namespace: string
  /** The two roles in the session (e.g. ['caller', 'agent']). */
  roles: [string, string]
  /** Which role I am. */
  myRole: string
  /** Rotation interval in seconds (default: 30). */
  rotationSeconds?: number
  /** Token encoding (default: words, count from preset or 1). */
  encoding?: TokenEncoding
  /** Counter tolerance window (default: from preset or 0). */
  tolerance?: number
  /**
   * Their identity string for duress detection (e.g. customer ID).
   *
   * **WARNING:** When omitted, duress detection is completely disabled —
   * a duress token from the other party will return `'invalid'` instead of
   * `'duress'`. If duress detection is safety-critical for your use case,
   * always provide this field.
   */
  theirIdentity?: string
  /** Session preset (overrides rotationSeconds, tolerance, encoding). */
  preset?: SessionPresetName
  /** Fixed counter for single-use / handoff mode (ignores time-based rotation). */
  counter?: number
}

/** A role-aware, time-managed session for two-party verification. */
export interface Session {
  /** Get the current counter (time-based or fixed). */
  counter(nowSec?: number): number
  /** Get the token I speak to prove my identity. */
  myToken(nowSec?: number): string
  /** Get the token I expect to hear from the other party. */
  theirToken(nowSec?: number): string
  /** Verify a word spoken to me against the other party's context. */
  verify(spoken: string, nowSec?: number): TokenVerifyResult
  /** Get both tokens at once, keyed by role name. */
  pair(nowSec?: number): DirectionalPair
}

/**
 * Create a directional verification session.
 *
 * Wraps the low-level token API with role awareness, time management,
 * and optional duress detection.
 *
 * @param config - Session configuration including secret, namespace, roles, and optional preset.
 * @returns A {@link Session} object with `myToken()`, `theirToken()`, `verify()`, `counter()`, and `pair()` methods.
 * @throws {Error} If namespace is empty or contains null bytes, roles are invalid, or myRole is not in roles.
 *
 * @example
 * ```ts
 * const session = createSession({
 *   secret: sharedSeed,
 *   namespace: 'aviva',
 *   roles: ['caller', 'agent'],
 *   myRole: 'agent',
 *   preset: 'call',
 * })
 * session.myToken()     // word I speak
 * session.theirToken()  // word I expect to hear
 * ```
 */
export function createSession(config: SessionConfig): Session {
  const preset = config.preset ? SESSION_PRESETS[config.preset] : undefined
  const rotationSeconds = config.rotationSeconds ?? preset?.rotationSeconds ?? 30
  const tolerance = config.tolerance ?? preset?.tolerance ?? 0
  const wordCount = preset?.wordCount ?? 1
  const encoding: TokenEncoding = config.encoding ?? { format: 'words', count: wordCount }

  if (!config.namespace) {
    throw new Error('namespace must be a non-empty string')
  }
  if (config.namespace.includes('\0')) {
    throw new Error('namespace must not contain null bytes')
  }
  if (!config.roles[0] || !config.roles[1]) {
    throw new Error('Both roles must be non-empty strings')
  }
  if (config.roles[0].includes('\0') || config.roles[1].includes('\0')) {
    throw new Error('Roles must not contain null bytes')
  }
  if (config.roles[0] === config.roles[1]) {
    throw new Error(`Roles must be distinct, got ["${config.roles[0]}", "${config.roles[1]}"]`)
  }
  if (config.myRole !== config.roles[0] && config.myRole !== config.roles[1]) {
    throw new Error(`myRole "${config.myRole}" is not one of the configured roles ["${config.roles[0]}", "${config.roles[1]}"]`)
  }
  if (!Number.isInteger(rotationSeconds) || rotationSeconds < 0) {
    throw new RangeError(`rotationSeconds must be a non-negative integer, got ${rotationSeconds}`)
  }
  if (!Number.isInteger(tolerance) || tolerance < 0) {
    throw new RangeError(`tolerance must be a non-negative integer, got ${tolerance}`)
  }
  if (tolerance > MAX_TOLERANCE) {
    throw new RangeError(`tolerance must be <= ${MAX_TOLERANCE}, got ${tolerance}`)
  }
  if (rotationSeconds === 0 && config.counter === undefined) {
    throw new Error('Fixed counter mode (rotationSeconds=0) requires config.counter')
  }
  if (rotationSeconds === 0 && config.counter !== undefined) {
    if (!Number.isInteger(config.counter) || config.counter < 0 || config.counter > 0xFFFFFFFF) {
      throw new RangeError(`counter must be an integer 0–${0xFFFFFFFF}, got ${config.counter}`)
    }
  }
  if (rotationSeconds > 0 && config.counter !== undefined) {
    throw new Error('counter must not be set when rotationSeconds > 0 (counter is derived from time)')
  }

  const secret = typeof config.secret === 'string' ? hexToBytes(config.secret) : config.secret
  const theirRole = config.roles[0] === config.myRole ? config.roles[1] : config.roles[0]
  // Duress context uses a colon-separated format (no null bytes) to avoid
  // the null-byte restriction in spoken-token v2's public API.
  const theirDuressContext = `pair:${config.namespace}:${theirRole}`

  const isFixedCounter = rotationSeconds === 0

  function getCounter(nowSec?: number): number {
    if (isFixedCounter) {
      if (config.counter === undefined) {
        throw new Error('Fixed counter mode (rotationSeconds=0) requires config.counter')
      }
      return config.counter
    }
    const t = nowSec ?? Math.floor(Date.now() / 1000)
    return Math.floor(t / rotationSeconds)
  }

  return {
    counter: getCounter,

    myToken(nowSec?: number): string {
      return deriveDirectionalPair(secret, config.namespace, config.roles, getCounter(nowSec), encoding)[config.myRole]
    },

    theirToken(nowSec?: number): string {
      return deriveDirectionalPair(secret, config.namespace, config.roles, getCounter(nowSec), encoding)[theirRole]
    },

    verify(spoken: string, nowSec?: number): TokenVerifyResult {
      const normalised = spoken.toLowerCase().trim().replace(/\s+/g, ' ')
      const c = getCounter(nowSec)
      const lo = Math.max(0, c - tolerance)
      const hi = Math.min(0xFFFFFFFF, c + tolerance)

      // 1. Check normal directional pair tokens across tolerance window
      let normalMatch = false
      for (let t = lo; t <= hi; t++) {
        const pair = deriveDirectionalPair(secret, config.namespace, config.roles, t, encoding)
        if (timingSafeStringEqual(normalised, pair[theirRole])) {
          normalMatch = true
        }
      }

      // 2. Check duress tokens (only when theirIdentity is provided)
      const duressMatches: string[] = []
      if (config.theirIdentity) {
        // Build forbidden set from directional pair tokens for collision avoidance
        const forbidden = new Set<string>()
        const duressWindow = 2 * tolerance
        const dlo = Math.max(0, c - duressWindow)
        const dhi = Math.min(0xFFFFFFFF, c + duressWindow)
        for (let t = dlo; t <= dhi; t++) {
          const pair = deriveDirectionalPair(secret, config.namespace, config.roles, t, encoding)
          forbidden.add(pair[theirRole])
        }

        // Check if spoken word matches duress token at any counter in window
        for (let t = lo; t <= hi; t++) {
          const duressData = concatBytes(
            encoder.encode(theirDuressContext + ':duress'),
            new Uint8Array([0x00]),
            encoder.encode(config.theirIdentity),
            counterBe32(t),
          )

          let bytes = hmacSha256(secret, duressData)
          let token = encodeToken(bytes, encoding)

          // Collision avoidance: match deriveDuressToken's suffix retry
          let suffix = 1
          while (forbidden.has(token) && suffix <= 255) {
            bytes = hmacSha256(secret, concatBytes(duressData, new Uint8Array([suffix])))
            token = encodeToken(bytes, encoding)
            suffix++
          }

          if (timingSafeStringEqual(normalised, token)) {
            duressMatches.push(config.theirIdentity)
          }
        }
      }

      // Priority: duress wins over normal (safety-first)
      if (duressMatches.length > 0) return { status: 'duress', identities: duressMatches }
      if (normalMatch) return { status: 'valid' }
      return { status: 'invalid' }
    },

    pair(nowSec?: number): DirectionalPair {
      return deriveDirectionalPair(secret, config.namespace, config.roles, getCounter(nowSec), encoding)
    },
  }
}
