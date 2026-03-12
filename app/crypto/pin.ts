// app/crypto/pin.ts — PBKDF2 key derivation and AES-256-GCM encryption for PIN protection

const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const IV_BYTES = 12

// ── Key derivation ─────────────────────────────────────────────

/**
 * Derive an AES-256-GCM key from a PIN string and salt using PBKDF2.
 * The key is non-extractable and only usable for encrypt/decrypt.
 */
export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

// ── Encryption ─────────────────────────────────────────────────

/**
 * Encrypt a UTF-8 string with AES-256-GCM.
 * Returns a base64-encoded string with the IV prepended (12 bytes + ciphertext).
 */
export async function encrypt(data: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(data),
  )
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)
  // Use a loop instead of String.fromCharCode(...combined) to avoid
  // stack overflow when the payload exceeds V8's argument limit (~65K bytes).
  let binary = ''
  for (let i = 0; i < combined.length; i++) binary += String.fromCharCode(combined[i])
  return btoa(binary)
}

// ── Decryption ─────────────────────────────────────────────────

/**
 * Decrypt a base64-encoded AES-256-GCM ciphertext (IV + ciphertext).
 * Throws if the key is wrong or the data is corrupt.
 */
export async function decrypt(encoded: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
  const iv = combined.slice(0, IV_BYTES)
  const ciphertext = combined.slice(IV_BYTES)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  )
  return new TextDecoder().decode(plaintext)
}

// ── Salt ───────────────────────────────────────────────────────

/** Generate a fresh random 16-byte salt. */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_BYTES))
}

/** Encode a salt as a base64 string for localStorage. */
export function encodeSalt(salt: Uint8Array): string {
  return btoa(String.fromCharCode(...salt))
}

/** Decode a base64-encoded salt back to Uint8Array. */
export function decodeSalt(encoded: string): Uint8Array {
  return Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
}
