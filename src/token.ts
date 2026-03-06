import { hmacSha256, hexToBytes, concatBytes, timingSafeStringEqual } from './crypto.js'
import { encodeToken, type TokenEncoding, DEFAULT_ENCODING } from './encoding.js'

/**
 * Maximum allowed tolerance/maxTolerance value.
 * Prevents pathological iteration: at MAX_TOLERANCE=10, the collision
 * avoidance window is ±20 counters (41 iterations) — well within reason.
 */
export const MAX_TOLERANCE = 10

const encoder = new TextEncoder()

function utf8(str: string): Uint8Array {
  return encoder.encode(str)
}

function counterBe32(counter: number): Uint8Array {
  if (!Number.isInteger(counter) || counter < 0 || counter > 0xFFFFFFFF) {
    throw new RangeError(`Counter must be an integer 0–${0xFFFFFFFF}, got ${counter}`)
  }
  const buf = new Uint8Array(4)
  const view = new DataView(buf.buffer)
  view.setUint32(0, counter, false)
  return buf
}

const MIN_SECRET_BYTES = 16

function normaliseSecret(secret: Uint8Array | string): Uint8Array {
  const key = typeof secret === 'string' ? hexToBytes(secret) : secret
  if (key.length < MIN_SECRET_BYTES) {
    throw new RangeError(`Secret must be at least ${MIN_SECRET_BYTES} bytes, got ${key.length}`)
  }
  return key
}

/**
 * CANARY-DERIVE: Derive raw token bytes from a shared secret, context, and counter.
 *
 * Algorithm: HMAC-SHA256(secret, utf8(context) || counter_be32)
 */
export function deriveTokenBytes(
  secret: Uint8Array | string,
  context: string,
  counter: number,
): Uint8Array {
  const key = normaliseSecret(secret)
  const data = concatBytes(utf8(context), counterBe32(counter))
  return hmacSha256(key, data)
}

/**
 * CANARY-DERIVE: Derive an encoded token string.
 */
export function deriveToken(
  secret: Uint8Array | string,
  context: string,
  counter: number,
  encoding: TokenEncoding = DEFAULT_ENCODING,
): string {
  const bytes = deriveTokenBytes(secret, context, counter)
  return encodeToken(bytes, encoding)
}

/**
 * CANARY-DURESS: Derive raw duress token bytes for a specific identity.
 *
 * Algorithm: HMAC-SHA256(secret, utf8(context + ":duress") || 0x00 || utf8(identity) || counter_be32)
 *
 * The null-byte separator between the context suffix and identity prevents concatenation
 * ambiguity (e.g. context="x:duress" + identity="" vs context="x" + identity=":duress").
 *
 * NOTE: Returns raw bytes without collision avoidance. Use deriveDuressToken()
 * for encoded output with guaranteed non-collision against the normal token.
 */
export function deriveDuressTokenBytes(
  secret: Uint8Array | string,
  context: string,
  identity: string,
  counter: number,
): Uint8Array {
  const key = normaliseSecret(secret)
  const data = concatBytes(utf8(context + ':duress'), new Uint8Array([0x00]), utf8(identity), counterBe32(counter))
  return hmacSha256(key, data)
}

/**
 * CANARY-DURESS: Derive an encoded duress token with collision avoidance.
 *
 * If the duress token collides with any normal verification token within
 * ±(2 × maxTolerance) counter values (at the encoding level), re-derives with
 * incrementing suffix bytes (0x01, 0x02, ..., 0xFF) until distinct.
 * The 2× factor accounts for worst-case counter drift: the deriver and verifier
 * may each be off by maxTolerance in opposite directions.
 * If all 255 suffixes collide (astronomically unlikely), throws an error
 * rather than failing open.
 *
 * **maxTolerance is required** — it must match the tolerance used by verifiers.
 * Using an insufficient value allows duress tokens to collide with normal tokens
 * at distant counters, causing silent alarm suppression.
 */
export function deriveDuressToken(
  secret: Uint8Array | string,
  context: string,
  identity: string,
  counter: number,
  encoding: TokenEncoding = DEFAULT_ENCODING,
  maxTolerance: number,
): string {
  if (!Number.isInteger(maxTolerance) || maxTolerance < 0) {
    throw new RangeError('maxTolerance must be a non-negative integer')
  }
  if (maxTolerance > MAX_TOLERANCE) {
    throw new RangeError(`maxTolerance must be <= ${MAX_TOLERANCE}, got ${maxTolerance}`)
  }
  // Collect normal tokens within ±(2 × maxTolerance) for cross-counter collision avoidance.
  // The 2× window accounts for worst-case counter drift between deriver and verifier.
  const forbidden = new Set<string>()
  const window = 2 * maxTolerance
  const lo = Math.max(0, counter - window)
  const hi = Math.min(0xFFFFFFFF, counter + window)
  for (let c = lo; c <= hi; c++) {
    forbidden.add(deriveToken(secret, context, c, encoding))
  }

  const key = normaliseSecret(secret)
  const baseData = concatBytes(utf8(context + ':duress'), new Uint8Array([0x00]), utf8(identity), counterBe32(counter))

  let bytes = hmacSha256(key, baseData)
  let token = encodeToken(bytes, encoding)

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (forbidden.has(token) && suffix <= 255) {
    bytes = hmacSha256(key, concatBytes(baseData, new Uint8Array([suffix])))
    token = encodeToken(bytes, encoding)
    suffix++
  }

  if (forbidden.has(token)) {
    throw new Error('Duress token collision unresolvable after 255 retries')
  }

  return token
}

/** Result of verifying a token. */
export interface TokenVerifyResult {
  /** 'valid' = matches normal token, 'duress' = matches a duress token, 'invalid' = no match. */
  status: 'valid' | 'duress' | 'invalid'
  /** Identities of duress signallers (only when status = 'duress'). */
  identities?: string[]
}

/** Options for token verification. */
export interface VerifyOptions {
  /** Output encoding to use for comparison (default: single word). */
  encoding?: TokenEncoding
  /** Counter tolerance window: accept tokens within ±tolerance counter values (default: 0). */
  tolerance?: number
}

/**
 * CANARY-DURESS: Verify a spoken/entered token against a group.
 *
 * Checks in priority order (exact-counter-first):
 * 1. Normal verification token at exact counter → 'valid'
 * 2. ALL identities' duress tokens (within tolerance window) → 'duress' with all matches
 * 3. Normal verification token at remaining tolerance window → 'valid'
 * 4. No match → 'invalid'
 *
 * Exact-counter normal is checked first because same-counter collision avoidance
 * guarantees no ambiguity. Duress across the full window is checked next so that
 * duress at the exact counter is never masked by normal at an adjacent counter.
 *
 * Per CANARY-DURESS: the verifier MUST check all identities and collect all matches.
 * The verifier MUST NOT short-circuit after the first duress match.
 */
export function verifyToken(
  secret: Uint8Array | string,
  context: string,
  counter: number,
  input: string,
  identities: string[],
  options?: VerifyOptions,
): TokenVerifyResult {
  const encoding = options?.encoding ?? DEFAULT_ENCODING
  const tolerance = options?.tolerance ?? 0
  if (!Number.isInteger(tolerance) || tolerance < 0) {
    throw new RangeError('Tolerance must be a non-negative integer')
  }
  if (tolerance > MAX_TOLERANCE) {
    throw new RangeError(`Tolerance must be <= ${MAX_TOLERANCE}, got ${tolerance}`)
  }
  const normalised = input.toLowerCase().trim().replace(/\s+/g, ' ')

  // Compute all branches to prevent timing side-channels from revealing
  // which branch matched (valid vs duress vs invalid).

  // 1. Check normal token at exact counter
  const exactMatch = timingSafeStringEqual(normalised, deriveToken(secret, context, counter, encoding))

  // 2. Check duress tokens for ALL identities across entire tolerance window
  const lo = Math.max(0, counter - tolerance)
  const hi = Math.min(0xFFFFFFFF, counter + tolerance)
  const matches: string[] = []
  for (const identity of identities) {
    for (let c = lo; c <= hi; c++) {
      if (timingSafeStringEqual(normalised, deriveDuressToken(secret, context, identity, c, encoding, tolerance))) {
        matches.push(identity)
        break // found match for this identity, move to next
      }
    }
  }

  // 3. Check normal token at remaining tolerance window (non-exact counters)
  let toleranceMatch = false
  for (let c = lo; c <= hi; c++) {
    if (c === counter) continue // already checked in step 1
    if (timingSafeStringEqual(normalised, deriveToken(secret, context, c, encoding))) {
      toleranceMatch = true
    }
  }

  // Return in priority order (collision avoidance guarantees no ambiguity at exact counter)
  if (exactMatch) return { status: 'valid' }
  if (matches.length > 0) return { status: 'duress', identities: matches }
  if (toleranceMatch) return { status: 'valid' }
  return { status: 'invalid' }
}

/**
 * CANARY-DURESS: Derive a liveness heartbeat token for dead man's switch.
 *
 * Algorithm: HMAC-SHA256(secret, utf8(context + ":alive") || 0x00 || utf8(identity) || counter_be32)
 *
 * The null-byte separator between the context suffix and identity prevents concatenation
 * ambiguity.
 *
 * The liveness token proves both identity and knowledge of the secret.
 * If heartbeats stop arriving, the implementation triggers its DMS response.
 */
export function deriveLivenessToken(
  secret: Uint8Array | string,
  context: string,
  identity: string,
  counter: number,
): Uint8Array {
  const key = normaliseSecret(secret)
  const data = concatBytes(utf8(context + ':alive'), new Uint8Array([0x00]), utf8(identity), counterBe32(counter))
  return hmacSha256(key, data)
}

/** A pair of directional tokens keyed by role name. */
export interface DirectionalPair {
  [role: string]: string
}

/**
 * Derive a directional pair: two distinct tokens from the same secret,
 * one per role. Each token uses context = `${namespace}:${role}`.
 *
 * Neither token can be derived from the other without the shared secret.
 * This prevents the "echo problem" where the second speaker could parrot
 * the first.
 */
export function deriveDirectionalPair(
  secret: Uint8Array | string,
  namespace: string,
  roles: [string, string],
  counter: number,
  encoding: TokenEncoding = DEFAULT_ENCODING,
): DirectionalPair {
  return {
    [roles[0]]: deriveToken(secret, `${namespace}:${roles[0]}`, counter, encoding),
    [roles[1]]: deriveToken(secret, `${namespace}:${roles[1]}`, counter, encoding),
  }
}
