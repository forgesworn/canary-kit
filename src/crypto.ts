/**
 * Universal synchronous crypto primitives — Node.js and browser compatible.
 *
 * SHA-256: FIPS 180-4
 * HMAC:    RFC 2104
 *
 * Uses only Uint8Array and the global `crypto` object (Web Crypto API).
 * No async, no Web Crypto subtle API, no Buffer.
 */

// ---------------------------------------------------------------------------
// SHA-256 — FIPS 180-4
// ---------------------------------------------------------------------------

/** Initial hash values H0–H7 (first 32 bits of fractional parts of sqrt of first 8 primes). */
const H0: readonly number[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]

/** Round constants K[0..63] (first 32 bits of fractional parts of cbrt of first 64 primes). */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

/** Rotate-right a 32-bit integer by n bits. */
function rotr32(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0
}

/**
 * Compute SHA-256 of `data`.
 * Implements FIPS 180-4 sections 5 (padding), 6.2 (hash computation).
 */
export function sha256(data: Uint8Array): Uint8Array {
  // --- Pre-processing: padding (FIPS 180-4 §5.1.1) ---
  const bitLen = data.length * 8
  // Append 0x80, then zero bytes, then 8-byte big-endian bit-length.
  // Total padded length must be a multiple of 64 bytes (512 bits).
  // After the message and 0x80 byte we need at least 8 bytes for the length,
  // so we pad to the next multiple of 64 that satisfies this.
  const padded = new Uint8Array(Math.ceil((data.length + 9) / 64) * 64)
  padded.set(data)
  padded[data.length] = 0x80
  // Write 64-bit big-endian bit length at the end.
  // bitLen fits in a 53-bit JS number so we can split safely.
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000), false)
  view.setUint32(padded.length - 4, bitLen >>> 0, false)

  // --- Processing blocks (FIPS 180-4 §6.2.2) ---
  // Working variables
  let [h0, h1, h2, h3, h4, h5, h6, h7] = H0

  const W = new Uint32Array(64)

  for (let offset = 0; offset < padded.length; offset += 64) {
    // Prepare message schedule W[0..63]
    for (let t = 0; t < 16; t++) {
      W[t] = view.getUint32(offset + t * 4, false)
    }
    for (let t = 16; t < 64; t++) {
      const w15 = W[t - 15]
      const w2  = W[t - 2]
      const s0 = rotr32(w15, 7) ^ rotr32(w15, 18) ^ (w15 >>> 3)
      const s1 = rotr32(w2,  17) ^ rotr32(w2,  19) ^ (w2  >>> 10)
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0
    }

    // Initialise working variables
    let a = h0, b = h1, c = h2, d = h3
    let e = h4, f = h5, g = h6, hh = h7

    // 64 rounds
    for (let t = 0; t < 64; t++) {
      const S1  = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)
      const ch  = (e & f) ^ (~e & g)
      const tmp1 = (hh + S1 + ch + K[t] + W[t]) >>> 0
      const S0  = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const tmp2 = (S0 + maj) >>> 0

      hh = g
      g  = f
      f  = e
      e  = (d + tmp1) >>> 0
      d  = c
      c  = b
      b  = a
      a  = (tmp1 + tmp2) >>> 0
    }

    // Add the compressed chunk to the current hash value
    h0 = (h0 + a) >>> 0
    h1 = (h1 + b) >>> 0
    h2 = (h2 + c) >>> 0
    h3 = (h3 + d) >>> 0
    h4 = (h4 + e) >>> 0
    h5 = (h5 + f) >>> 0
    h6 = (h6 + g) >>> 0
    h7 = (h7 + hh) >>> 0
  }

  // Produce the final hash value (big-endian)
  const digest = new Uint8Array(32)
  const dv = new DataView(digest.buffer)
  dv.setUint32(0,  h0, false)
  dv.setUint32(4,  h1, false)
  dv.setUint32(8,  h2, false)
  dv.setUint32(12, h3, false)
  dv.setUint32(16, h4, false)
  dv.setUint32(20, h5, false)
  dv.setUint32(24, h6, false)
  dv.setUint32(28, h7, false)
  return digest
}

// ---------------------------------------------------------------------------
// HMAC-SHA256 — RFC 2104
// ---------------------------------------------------------------------------

const BLOCK_SIZE = 64 // SHA-256 block size in bytes

/**
 * Compute HMAC-SHA256(key, data) and return the raw 32-byte digest.
 *
 * RFC 2104:
 *   H(K XOR opad, H(K XOR ipad, data))
 *   ipad = 0x36 repeated, opad = 0x5c repeated.
 *   Keys longer than the block size are hashed first.
 *   Keys shorter than the block size are zero-padded on the right.
 */
export function hmacSha256(key: Uint8Array, data: Uint8Array): Uint8Array {
  // If the key is longer than the block size, hash it first.
  const normalised = key.length > BLOCK_SIZE ? sha256(key) : key

  // Pad/extend to block size.
  const k = new Uint8Array(BLOCK_SIZE)
  k.set(normalised)

  // Build inner and outer padded keys.
  const ipad = new Uint8Array(BLOCK_SIZE)
  const opad = new Uint8Array(BLOCK_SIZE)
  for (let i = 0; i < BLOCK_SIZE; i++) {
    ipad[i] = k[i] ^ 0x36
    opad[i] = k[i] ^ 0x5c
  }

  // inner = sha256(ipad || data)
  const inner = sha256(concatBytes(ipad, data))

  // outer = sha256(opad || inner)
  const result = sha256(concatBytes(opad, inner))

  // Best-effort zeroing of key material
  k.fill(0)
  ipad.fill(0)
  opad.fill(0)

  return result
}

// ---------------------------------------------------------------------------
// Random seed
// ---------------------------------------------------------------------------

/**
 * Generate a cryptographically secure 32-byte seed as a 64-character hex string.
 * Uses the global `crypto.getRandomValues` (Web Crypto API).
 */
export function randomSeed(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return bytesToHex(bytes)
}

// ---------------------------------------------------------------------------
// Byte / hex utilities
// ---------------------------------------------------------------------------

/** Convert a hex string to a Uint8Array. Replaces `Buffer.from(hex, 'hex')`. */
export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error(`hexToBytes: odd-length hex string (${hex.length} chars)`)
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    const pair = hex.slice(i * 2, i * 2 + 2)
    if (!/^[0-9a-fA-F]{2}$/.test(pair)) throw new TypeError(`Invalid hex character at position ${i * 2}`)
    bytes[i] = parseInt(pair, 16)
  }
  return bytes
}

/** Convert a Uint8Array to a lowercase hex string. Replaces `buffer.toString('hex')`. */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

/**
 * Read an unsigned 16-bit big-endian integer from `bytes` at `offset`.
 * Replaces `buffer.readUInt16BE(offset)`.
 */
export function readUint16BE(bytes: Uint8Array, offset: number): number {
  if (offset + 1 >= bytes.length) throw new RangeError(`readUint16BE: offset ${offset} out of bounds for length ${bytes.length}`)
  return ((bytes[offset] << 8) | bytes[offset + 1]) >>> 0
}

/**
 * Concatenate multiple Uint8Arrays into one.
 * Replaces `Buffer.concat([...])`.
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const arr of arrays) {
    out.set(arr, offset)
    offset += arr.length
  }
  return out
}

/** Encode a Uint8Array as a base64 string. Available in Node 16+ and all browsers. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/** Decode a base64 string to a Uint8Array. */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * Constant-time comparison of two byte arrays.
 * Pads the shorter array to the longer length to avoid leaking length via timing.
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length // non-zero if lengths differ
  for (let i = 0; i < len; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0)
  }
  return diff === 0
}

const stringEncoder = new TextEncoder()

/** Constant-time comparison of two strings (UTF-8 encoded, then byte-compared). */
export function timingSafeStringEqual(a: string, b: string): boolean {
  return timingSafeEqual(stringEncoder.encode(a), stringEncoder.encode(b))
}
