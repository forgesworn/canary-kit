/** Default rotation interval: 7 days in seconds. */
export const DEFAULT_ROTATION_INTERVAL = 604_800

/**
 * Derive the current counter from a unix timestamp and rotation interval.
 * Counter = floor(timestamp / interval).
 */
export function getCounter(
  timestampSec: number,
  rotationIntervalSec: number = DEFAULT_ROTATION_INTERVAL,
): number {
  if (!Number.isFinite(timestampSec) || timestampSec < 0) {
    throw new RangeError(`timestampSec must be a non-negative finite number, got ${timestampSec}`)
  }
  if (!Number.isFinite(rotationIntervalSec) || rotationIntervalSec <= 0) {
    throw new RangeError(`rotationIntervalSec must be a positive finite number, got ${rotationIntervalSec}`)
  }
  return Math.floor(timestampSec / rotationIntervalSec)
}

/**
 * Serialise a counter to an 8-byte big-endian Uint8Array.
 * Same encoding as TOTP (RFC 6238).
 */
export function counterToBytes(counter: number): Uint8Array {
  if (!Number.isInteger(counter) || counter < 0 || counter > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`Counter must be a non-negative safe integer, got ${counter}`)
  }
  const buf = new Uint8Array(8)
  const view = new DataView(buf.buffer)
  view.setBigUint64(0, BigInt(counter), false) // false = big-endian
  return buf
}
