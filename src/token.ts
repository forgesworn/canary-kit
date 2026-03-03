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
