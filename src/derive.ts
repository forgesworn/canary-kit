import { createHmac } from 'node:crypto'
import { counterToBytes } from './counter.js'
import { getWord, WORDLIST_SIZE } from './wordlist.js'

/**
 * Compute HMAC-SHA256(key, data) and return the raw 32-byte digest.
 */
function hmac(key: Uint8Array | Buffer, data: Uint8Array | Buffer): Buffer {
  return createHmac('sha256', key).update(data).digest()
}

/** Parse a hex-encoded seed string to a Buffer. */
function seedToBuffer(seedHex: string): Buffer {
  if (seedHex.length !== 64) {
    throw new Error(`Seed must be 64 hex characters (256 bits), got ${seedHex.length}`)
  }
  return Buffer.from(seedHex, 'hex')
}

/**
 * Derive the verification word for a given seed and counter.
 * All group members derive the same word.
 *
 * The HMAC-SHA256 digest is computed with the seed as key and the
 * 8-byte big-endian counter as data. The first two bytes of the digest
 * are read as a big-endian uint16 and reduced modulo WORDLIST_SIZE (2048)
 * to yield the wordlist index.
 */
export function deriveVerificationWord(seedHex: string, counter: number): string {
  const raw = hmac(seedToBuffer(seedHex), counterToBytes(counter))
  const index = raw.readUInt16BE(0) % WORDLIST_SIZE
  return getWord(index)
}

/**
 * Derive a multi-word verification phrase.
 *
 * Each word is derived from a consecutive 2-byte slice of the HMAC-SHA256
 * digest, giving up to 16 independent words from a single 32-byte hash.
 * The phrase at position i uses bytes [i*2, i*2+1].
 */
export function deriveVerificationPhrase(
  seedHex: string,
  counter: number,
  wordCount: 1 | 2 | 3,
): string[] {
  const raw = hmac(seedToBuffer(seedHex), counterToBytes(counter))
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const index = raw.readUInt16BE(i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }
  return words
}
