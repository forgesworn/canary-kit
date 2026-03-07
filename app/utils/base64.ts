// app/utils/base64.ts — Unicode-safe JSON ↔ base64 encoding
//
// btoa()/atob() only handle Latin-1 (code points 0–255). Group names,
// member names and other user-supplied strings can contain any Unicode.
// These helpers go through UTF-8 byte encoding to avoid the limitation.

/** Encode a JSON-serialisable value to a base64 string (Unicode-safe). */
export function jsonToBase64(value: unknown): string {
  const json = JSON.stringify(value)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/** Decode a base64 string back to a parsed JSON value (Unicode-safe). */
export function base64ToJson(b64: string): unknown {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return JSON.parse(new TextDecoder().decode(bytes))
}
