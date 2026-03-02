import { hmacSha256, hexToBytes, concatBytes, readUint16BE } from './crypto.js'
import { counterToBytes } from './counter.js'
import { getWord, WORDLIST_SIZE } from './wordlist.js'

/**
 * Compute HMAC-SHA256(key, data) and return the raw 32-byte digest.
 */
function hmac(key: Uint8Array, data: Uint8Array): Uint8Array {
  return hmacSha256(key, data)
}

/** Parse a hex-encoded seed string to a Uint8Array. */
function seedToBytes(seedHex: string): Uint8Array {
  if (seedHex.length !== 64) {
    throw new Error(`Seed must be 64 hex characters (256 bits), got ${seedHex.length}`)
  }
  return hexToBytes(seedHex)
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
  const raw = hmac(seedToBytes(seedHex), counterToBytes(counter))
  const index = readUint16BE(raw, 0) % WORDLIST_SIZE
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
  const raw = hmac(seedToBytes(seedHex), counterToBytes(counter))
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const index = readUint16BE(raw, i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }
  return words
}

/**
 * Derive a member's duress word for a given seed, pubkey, and counter.
 * Unique per member, derivable by all group members who know the seed.
 * If it collides with the verification word, re-derives with a 0x01 suffix
 * to guarantee the duress word never accidentally matches the verification word.
 */
export function deriveDuressWord(
  seedHex: string,
  memberPubkeyHex: string,
  counter: number,
): string {
  const seedBuf = seedToBytes(seedHex)
  const pubkeyBuf = hexToBytes(memberPubkeyHex)
  const counterBuf = counterToBytes(counter)
  const verificationWord = deriveVerificationWord(seedHex, counter)

  let key = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmac(key, counterBuf)
  let index = readUint16BE(raw, 0) % WORDLIST_SIZE
  let word = getWord(index)

  // Collision avoidance: if duress word matches verification word, re-derive
  if (word === verificationWord) {
    key = concatBytes(seedBuf, pubkeyBuf, new Uint8Array([0x01]))
    raw = hmac(key, counterBuf)
    index = readUint16BE(raw, 0) % WORDLIST_SIZE
    word = getWord(index)
  }

  return word
}

/**
 * Derive a multi-word duress phrase for a given member.
 * Each word uses a consecutive 2-byte slice of the HMAC digest.
 * If the entire phrase coincidentally matches the verification phrase,
 * re-derives with a 0x01 suffix to ensure the phrases are always distinct.
 */
export function deriveDuressPhrase(
  seedHex: string,
  memberPubkeyHex: string,
  counter: number,
  wordCount: 1 | 2 | 3,
): string[] {
  const seedBuf = seedToBytes(seedHex)
  const pubkeyBuf = hexToBytes(memberPubkeyHex)
  const counterBuf = counterToBytes(counter)
  const verifyPhrase = deriveVerificationPhrase(seedHex, counter, wordCount)

  let key = concatBytes(seedBuf, pubkeyBuf)
  let raw = hmac(key, counterBuf)
  const words: string[] = []

  for (let i = 0; i < wordCount; i++) {
    const index = readUint16BE(raw, i * 2) % WORDLIST_SIZE
    words.push(getWord(index))
  }

  // If entire phrase matches verification phrase, re-derive with disambiguation suffix
  if (words.every((w, i) => w === verifyPhrase[i])) {
    key = concatBytes(seedBuf, pubkeyBuf, new Uint8Array([0x01]))
    raw = hmac(key, counterBuf)
    for (let i = 0; i < wordCount; i++) {
      words[i] = getWord(readUint16BE(raw, i * 2) % WORDLIST_SIZE)
    }
  }

  return words
}
