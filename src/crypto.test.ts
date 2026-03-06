import { describe, it, expect } from 'vitest'
import { timingSafeEqual, timingSafeStringEqual, hexToBytes, bytesToHex, readUint16BE, sha256, hmacSha256, randomSeed } from './crypto.js'

describe('timingSafeEqual', () => {
  it('returns true for equal arrays', () => {
    const a = new Uint8Array([1, 2, 3])
    expect(timingSafeEqual(a, new Uint8Array([1, 2, 3]))).toBe(true)
  })

  it('returns false for different arrays', () => {
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false)
  })

  it('returns false for different lengths', () => {
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false)
  })

  it('returns true for empty arrays', () => {
    expect(timingSafeEqual(new Uint8Array([]), new Uint8Array([]))).toBe(true)
  })
})

describe('timingSafeStringEqual', () => {
  it('returns true for equal strings', () => {
    expect(timingSafeStringEqual('falcon', 'falcon')).toBe(true)
  })

  it('returns false for different strings', () => {
    expect(timingSafeStringEqual('falcon', 'eagle')).toBe(false)
  })

  it('returns false for different lengths', () => {
    expect(timingSafeStringEqual('falcon', 'falcons')).toBe(false)
  })

  it('returns true for empty strings', () => {
    expect(timingSafeStringEqual('', '')).toBe(true)
  })

  it('handles unicode correctly', () => {
    expect(timingSafeStringEqual('café', 'café')).toBe(true)
    expect(timingSafeStringEqual('café', 'cafe')).toBe(false)
  })
})

describe('hexToBytes', () => {
  it('converts valid hex', () => {
    expect(hexToBytes('0102ff')).toEqual(new Uint8Array([1, 2, 255]))
  })

  it('throws on odd-length hex', () => {
    expect(() => hexToBytes('abc')).toThrow()
  })

  it('throws on invalid hex characters', () => {
    expect(() => hexToBytes('zz')).toThrow(TypeError)
    expect(() => hexToBytes('0g')).toThrow(TypeError)
    expect(() => hexToBytes('xx')).toThrow(TypeError)
  })
})

describe('readUint16BE', () => {
  it('reads correctly', () => {
    expect(readUint16BE(new Uint8Array([0x01, 0x00]), 0)).toBe(256)
  })

  it('throws on out-of-bounds offset', () => {
    expect(() => readUint16BE(new Uint8Array([0x01]), 0)).toThrow(RangeError)
    expect(() => readUint16BE(new Uint8Array([0x01, 0x02]), 1)).toThrow(RangeError)
  })
})

describe('sha256', () => {
  it('hashes empty input correctly', () => {
    const hash = bytesToHex(sha256(new Uint8Array([])))
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('hashes "abc" correctly', () => {
    const input = new TextEncoder().encode('abc')
    const hash = bytesToHex(sha256(input))
    expect(hash).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('handles 55-byte input (one-block padding boundary)', () => {
    const input = new Uint8Array(55).fill(0x61) // 55 × 'a'
    const hash = bytesToHex(sha256(input))
    expect(hash).toBe('9f4390f8d30c2dd92ec9f095b65e2b9ae9b0a925a5258e241c9f1e910f734318')
  })

  it('handles 56-byte input (two-block padding boundary)', () => {
    const input = new Uint8Array(56).fill(0x61) // 56 × 'a'
    const hash = bytesToHex(sha256(input))
    expect(hash).toBe('b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a')
  })

  it('handles 64-byte input (exact block boundary)', () => {
    const input = new Uint8Array(64).fill(0x61) // 64 × 'a'
    const hash = bytesToHex(sha256(input))
    expect(hash).toBe('ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb')
  })
})

describe('randomSeed', () => {
  it('returns a 64-char hex string', () => {
    const seed = randomSeed()
    expect(seed).toHaveLength(64)
    expect(seed).toMatch(/^[0-9a-f]{64}$/)
  })

  it('produces unique values', () => {
    const seeds = new Set(Array.from({ length: 10 }, () => randomSeed()))
    expect(seeds.size).toBe(10)
  })
})

describe('hmacSha256', () => {
  it('produces correct HMAC for known input', () => {
    const key = new Uint8Array(20).fill(0x0b)
    const data = new TextEncoder().encode('Hi There')
    const mac = bytesToHex(hmacSha256(key, data))
    expect(mac).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7')
  })
})
