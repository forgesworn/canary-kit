import { hmacSha256, hexToBytes, concatBytes } from './crypto.js'
import {
  MAX_TOLERANCE,
  deriveToken,
  verifyToken,
  deriveDirectionalPair,
  type TokenVerifyResult,
  type DirectionalPair,
} from './token.js'
import { type TokenEncoding, DEFAULT_ENCODING } from './encoding.js'

const encoder = new TextEncoder()

/**
 * Generate a cryptographically secure 256-bit seed.
 * Uses the global `crypto.getRandomValues` (Web Crypto API).
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
 */
export function deriveSeed(
  masterKey: Uint8Array | string,
  ...components: string[]
): Uint8Array {
  const key = typeof masterKey === 'string' ? hexToBytes(masterKey) : masterKey
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
  /** Their identity string for duress detection (e.g. customer ID). */
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
 */
export function createSession(config: SessionConfig): Session {
  const preset = config.preset ? SESSION_PRESETS[config.preset] : undefined
  const rotationSeconds = config.rotationSeconds ?? preset?.rotationSeconds ?? 30
  const tolerance = config.tolerance ?? preset?.tolerance ?? 0
  const wordCount = preset?.wordCount ?? 1
  const encoding: TokenEncoding = config.encoding ?? { format: 'words', count: wordCount }

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
  const myContext = `${config.namespace}:${config.myRole}`
  const theirContext = `${config.namespace}:${theirRole}`

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
      return deriveToken(secret, myContext, getCounter(nowSec), encoding)
    },

    theirToken(nowSec?: number): string {
      return deriveToken(secret, theirContext, getCounter(nowSec), encoding)
    },

    verify(spoken: string, nowSec?: number): TokenVerifyResult {
      const identities: string[] = []
      if (config.theirIdentity) identities.push(config.theirIdentity)
      return verifyToken(secret, theirContext, getCounter(nowSec), spoken, identities, {
        encoding,
        tolerance,
      })
    },

    pair(nowSec?: number): DirectionalPair {
      return deriveDirectionalPair(secret, config.namespace, config.roles, getCounter(nowSec), encoding)
    },
  }
}
