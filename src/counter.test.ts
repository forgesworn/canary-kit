import { describe, it, expect } from 'vitest'
import { getCounter, counterToBytes, DEFAULT_ROTATION_INTERVAL } from './counter.js'

describe('getCounter', () => {
  it('returns floor(timestamp / interval)', () => {
    expect(getCounter(1_209_600, 604800)).toBe(2)
  })

  it('returns 0 for timestamp 0', () => {
    expect(getCounter(0, 604800)).toBe(0)
  })

  it('same counter for timestamps within same window', () => {
    const interval = 86400
    const t1 = 86400 * 5 + 100
    const t2 = 86400 * 5 + 50000
    expect(getCounter(t1, interval)).toBe(getCounter(t2, interval))
  })

  it('different counter for timestamps in different windows', () => {
    const interval = 86400
    const t1 = 86400 * 5 + 100
    const t2 = 86400 * 6 + 100
    expect(getCounter(t1, interval)).not.toBe(getCounter(t2, interval))
  })

  it('uses default interval when not specified', () => {
    expect(getCounter(604800)).toBe(1)
    expect(DEFAULT_ROTATION_INTERVAL).toBe(604800)
  })
})

describe('counterToBytes', () => {
  it('returns 8-byte big-endian buffer', () => {
    const bytes = counterToBytes(0)
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBe(8)
    expect(Array.from(bytes)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('encodes counter 1 correctly', () => {
    const bytes = counterToBytes(1)
    expect(Array.from(bytes)).toEqual([0, 0, 0, 0, 0, 0, 0, 1])
  })

  it('encodes large counter correctly', () => {
    const bytes = counterToBytes(256)
    expect(Array.from(bytes)).toEqual([0, 0, 0, 0, 0, 0, 1, 0])
  })

  it('throws on non-integer counter', () => {
    expect(() => counterToBytes(1.5)).toThrow()
  })

  it('throws on negative counter', () => {
    expect(() => counterToBytes(-1)).toThrow(RangeError)
  })

  it('throws on NaN', () => {
    expect(() => counterToBytes(NaN)).toThrow(RangeError)
  })

  it('throws on Infinity', () => {
    expect(() => counterToBytes(Infinity)).toThrow(RangeError)
  })

  it('throws on value beyond MAX_SAFE_INTEGER', () => {
    expect(() => counterToBytes(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError)
  })

  it('accepts MAX_SAFE_INTEGER', () => {
    expect(() => counterToBytes(Number.MAX_SAFE_INTEGER)).not.toThrow()
  })
})

describe('getCounter input validation', () => {
  it('throws RangeError on negative timestamp', () => {
    expect(() => getCounter(-1, 604_800)).toThrow(RangeError)
  })

  it('throws RangeError on NaN timestamp', () => {
    expect(() => getCounter(NaN, 604_800)).toThrow(RangeError)
  })

  it('throws RangeError on Infinity timestamp', () => {
    expect(() => getCounter(Infinity, 604_800)).toThrow(RangeError)
  })

  it('throws RangeError on negative Infinity timestamp', () => {
    expect(() => getCounter(-Infinity, 604_800)).toThrow(RangeError)
  })

  it('throws RangeError on zero interval', () => {
    expect(() => getCounter(1000, 0)).toThrow(RangeError)
  })

  it('throws RangeError on negative interval', () => {
    expect(() => getCounter(1000, -100)).toThrow(RangeError)
  })

  it('throws RangeError on NaN interval', () => {
    expect(() => getCounter(1000, NaN)).toThrow(RangeError)
  })

  it('throws RangeError on Infinity interval', () => {
    expect(() => getCounter(1000, Infinity)).toThrow(RangeError)
  })

  it('accepts zero timestamp', () => {
    expect(getCounter(0, 604_800)).toBe(0)
  })

  it('accepts valid positive inputs', () => {
    expect(getCounter(1_209_600, 604_800)).toBe(2)
  })
})
