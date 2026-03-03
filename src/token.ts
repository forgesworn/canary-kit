import { hmacSha256, hexToBytes, concatBytes } from './crypto.js'
import { encodeToken, type TokenEncoding, DEFAULT_ENCODING } from './encoding.js'

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

function normaliseSecret(secret: Uint8Array | string): Uint8Array {
  if (typeof secret === 'string') return hexToBytes(secret)
  return secret
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
 * If the duress token collides with the normal verification token (at the encoding level),
 * re-derives with incrementing suffix bytes (0x01, 0x02, ..., 0xFF) until distinct.
 * If all 255 suffixes collide (astronomically unlikely), throws an error rather than
 * failing open (returning a token that would be classified as 'valid' instead of 'duress').
 */
export function deriveDuressToken(
  secret: Uint8Array | string,
  context: string,
  identity: string,
  counter: number,
  encoding: TokenEncoding = DEFAULT_ENCODING,
): string {
  const normalToken = deriveToken(secret, context, counter, encoding)
  const key = normaliseSecret(secret)
  const baseData = concatBytes(utf8(context + ':duress'), new Uint8Array([0x00]), utf8(identity), counterBe32(counter))

  let bytes = hmacSha256(key, baseData)
  let token = encodeToken(bytes, encoding)

  // Collision avoidance: deterministic multi-suffix retry
  let suffix = 1
  while (token === normalToken && suffix <= 255) {
    bytes = hmacSha256(key, concatBytes(baseData, new Uint8Array([suffix])))
    token = encodeToken(bytes, encoding)
    suffix++
  }

  if (token === normalToken) {
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
 * Checks in order:
 * 1. Normal verification token (within tolerance window) → 'valid'
 * 2. ALL identities' duress tokens (within tolerance window) → 'duress' with all matches
 * 3. No match → 'invalid'
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
  const normalised = input.toLowerCase().trim()

  // 1. Check normal token within tolerance window (clamped to valid counter range)
  const lo = Math.max(0, counter - tolerance)
  const hi = Math.min(0xFFFFFFFF, counter + tolerance)
  for (let c = lo; c <= hi; c++) {
    if (normalised === deriveToken(secret, context, c, encoding)) {
      return { status: 'valid' }
    }
  }

  // 2. Check duress tokens for ALL identities — collect all matches
  const matches: string[] = []
  for (const identity of identities) {
    for (let c = lo; c <= hi; c++) {
      if (normalised === deriveDuressToken(secret, context, identity, c, encoding)) {
        matches.push(identity)
        break // found match for this identity, move to next
      }
    }
  }
  if (matches.length > 0) {
    return { status: 'duress', identities: matches }
  }

  // 3. No match
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
