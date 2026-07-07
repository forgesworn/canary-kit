import { describe, it, expect } from 'vitest'
import {
  estimateCanaryVerificationRisk,
  verifyWord,
  MAX_INPUT_CHARS,
} from './index.js'

describe('public barrel exports', () => {
  it('exports CANARY verification hardening APIs from the package entrypoint', () => {
    expect(typeof verifyWord).toBe('function')
    expect(typeof estimateCanaryVerificationRisk).toBe('function')
    expect(MAX_INPUT_CHARS).toBe(512)
    expect(estimateCanaryVerificationRisk({ identities: 2, tolerance: 1 }).candidates).toBe(15)
  })
})
