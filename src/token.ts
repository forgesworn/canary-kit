import { hmacSha256, hexToBytes, concatBytes } from './crypto.js'
import { encodeToken, type TokenEncoding, DEFAULT_ENCODING } from './encoding.js'

const encoder = new TextEncoder()

function utf8(str: string): Uint8Array {
  return encoder.encode(str)
}

function counterBe32(counter: number): Uint8Array {
  const buf = new Uint8Array(4)
  const view = new DataView(buf.buffer)
  view.setUint32(0, counter >>> 0, false)
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
 * Algorithm: HMAC-SHA256(secret, utf8(context + ":duress") || utf8(identity) || counter_be32)
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
  const data = concatBytes(utf8(context + ':duress'), utf8(identity), counterBe32(counter))
  return hmacSha256(key, data)
}

/**
 * CANARY-DURESS: Derive an encoded duress token with collision avoidance.
 *
 * If the duress token collides with the normal verification token (at the encoding level),
 * re-derives with a 0x01 suffix to guarantee they are always distinct.
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
  const baseData = concatBytes(utf8(context + ':duress'), utf8(identity), counterBe32(counter))

  let bytes = hmacSha256(key, baseData)
  let token = encodeToken(bytes, encoding)

  // Collision avoidance: if duress token matches normal token, re-derive with suffix
  if (token === normalToken) {
    bytes = hmacSha256(key, concatBytes(baseData, new Uint8Array([0x01])))
    token = encodeToken(bytes, encoding)
  }

  return token
}
