import { describe, it, expect } from 'vitest'
import { timingSafeEqual, hexToBytes, bytesToHex, readUint16BE, sha256, hmacSha256 } from './crypto.js'

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
})

describe('hmacSha256', () => {
  it('produces correct HMAC for known input', () => {
    const key = new Uint8Array(20).fill(0x0b)
    const data = new TextEncoder().encode('Hi There')
    const mac = bytesToHex(hmacSha256(key, data))
    expect(mac).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7')
  })
})
