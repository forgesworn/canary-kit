import { readUint16BE } from './crypto.js'
import { WORDLIST } from './wordlist.js'

/** Encoding options for token output. */
export type TokenEncoding =
  | { format: 'words'; count?: number; wordlist?: readonly string[] }
  | { format: 'pin'; digits?: number }
  | { format: 'hex'; length?: number }

/** Default encoding: single word from en-v1 wordlist. */
export const DEFAULT_ENCODING: TokenEncoding = { format: 'words', count: 1 }

/**
 * Encode raw bytes as words using 11-bit indices into a wordlist.
 * Each word uses a consecutive 2-byte slice: readUint16BE(bytes, i*2) % wordlistSize.
 */
export function encodeAsWords(
  bytes: Uint8Array,
  count: number = 1,
  wordlist: readonly string[] = WORDLIST,
): string[] {
  if (wordlist.length !== 2048) throw new RangeError('Wordlist must contain exactly 2048 entries')
  if (count < 1 || count > 16) throw new RangeError('Word count must be 1–16')
  if (bytes.length < count * 2) throw new RangeError('Not enough bytes for requested word count')
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    const index = readUint16BE(bytes, i * 2) % wordlist.length
    words.push(wordlist[index])
  }
  return words
}

/**
 * Encode raw bytes as a numeric PIN with leading zeros.
 * Uses the first ceil(digits * 0.415) bytes, interpreted as a big-endian
 * integer, reduced modulo 10^digits.
 */
export function encodeAsPin(bytes: Uint8Array, digits: number = 4): string {
  if (digits < 1 || digits > 10) throw new RangeError('PIN digits must be 1–10')
  const needed = Math.min(Math.ceil(digits * 0.415), bytes.length)
  const mod = Math.pow(10, digits)

  // Use BigInt accumulation for 9–10 digits to avoid 32-bit overflow in >>> 0
  if (digits >= 9) {
    let bigVal = 0n
    for (let i = 0; i < needed; i++) bigVal = bigVal * 256n + BigInt(bytes[i])
    return (Number(bigVal % BigInt(mod))).toString().padStart(digits, '0')
  }

  let value = 0
  for (let i = 0; i < needed; i++) {
    value = (value * 256 + bytes[i]) >>> 0
  }
  return (value % mod).toString().padStart(digits, '0')
}

/**
 * Encode raw bytes as a lowercase hex string.
 */
export function encodeAsHex(bytes: Uint8Array, length: number = 8): string {
  if (length < 1 || length > 64) throw new RangeError('Hex length must be 1–64')
  const needed = Math.ceil(length / 2)
  let hex = ''
  for (let i = 0; i < needed && i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex.slice(0, length)
}

/**
 * Encode raw bytes using the specified encoding format.
 * Returns a single string (words are space-joined).
 */
export function encodeToken(bytes: Uint8Array, encoding: TokenEncoding = DEFAULT_ENCODING): string {
  switch (encoding.format) {
    case 'words':
      return encodeAsWords(bytes, encoding.count ?? 1, encoding.wordlist).join(' ')
    case 'pin':
      return encodeAsPin(bytes, encoding.digits ?? 4)
    case 'hex':
      return encodeAsHex(bytes, encoding.length ?? 8)
  }
}
