// Invite authority contract tests — exercises pure crypto/validation logic
// without UI or app state dependencies.

import { describe, it, expect } from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import { sha256, bytesToHex, hexToBytes } from 'canary-kit/crypto'
import {
  assertInvitePayload,
  inviteCanonicalBytes,
  signInvite,
  verifyInviteSig,
  confirmCodeFromPayload,
  type InvitePayload,
} from './invite.js'
import vectors from '../test-vectors/invite-authority.json'

// ── Test keypairs (from conformance vectors) ───────────────────

const ADMIN_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000001'
const ADMIN_PUBKEY = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'
const NON_ADMIN_PUBKEY = 'c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5'

function makeValidPayload(overrides: Partial<InvitePayload> = {}): InvitePayload {
  const base: InvitePayload = {
    admins: [ADMIN_PUBKEY],
    beaconInterval: 300,
    beaconPrecision: 6,
    counter: 100,
    encodingFormat: 'words',
    epoch: 0,
    expiresAt: 1700604800,
    groupId: 'test-group-1',
    groupName: 'Test Group',
    inviterPubkey: ADMIN_PUBKEY,
    inviterSig: '',
    issuedAt: 1700000000,
    members: [ADMIN_PUBKEY],
    nonce: 'b'.repeat(32),
    protocolVersion: 1,
    relays: ['wss://relay.example.com'],
    rotationInterval: 604800,
    seed: 'a'.repeat(64),
    tolerance: 1,
    usageOffset: 0,
    wordCount: 1,
    wordlist: 'en-v1',
    ...overrides,
  }
  // Sign with admin key unless inviterSig is explicitly provided
  if (!overrides.inviterSig) {
    base.inviterSig = signInvite(base, ADMIN_PRIVKEY)
  }
  return base
}

// ── Schnorr signature verification ─────────────────────────────

describe('invite signature verification', () => {
  it('accepts a valid admin-signed invite', () => {
    const payload = makeValidPayload()
    expect(verifyInviteSig(payload)).toBe(true)
  })

  it('rejects an invite signed with a different key', () => {
    const payload = makeValidPayload()
    // Replace signature with one from non-admin key
    const canonical = inviteCanonicalBytes(payload)
    const hash = sha256(canonical)
    const NON_ADMIN_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000002'
    payload.inviterSig = bytesToHex(schnorr.sign(hash, hexToBytes(NON_ADMIN_PRIVKEY)))
    expect(verifyInviteSig(payload)).toBe(false)
  })

  it('rejects a tampered payload (counter changed after signing)', () => {
    const payload = makeValidPayload()
    payload.counter = 999
    expect(verifyInviteSig(payload)).toBe(false)
  })

  it('rejects a tampered payload (seed changed after signing)', () => {
    const payload = makeValidPayload()
    payload.seed = 'f'.repeat(64)
    expect(verifyInviteSig(payload)).toBe(false)
  })

  it('rejects a tampered payload (member added after signing)', () => {
    const payload = makeValidPayload()
    payload.members = [...payload.members, NON_ADMIN_PUBKEY]
    expect(verifyInviteSig(payload)).toBe(false)
  })
})

// ── Canonical bytes determinism ─────────────────────────────────

describe('inviteCanonicalBytes', () => {
  it('produces deterministic output', () => {
    const payload = makeValidPayload()
    const a = inviteCanonicalBytes(payload)
    const b = inviteCanonicalBytes(payload)
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('excludes inviterSig from canonical form', () => {
    const payload = makeValidPayload()
    const canonical = new TextDecoder().decode(inviteCanonicalBytes(payload))
    expect(canonical).not.toContain('inviterSig')
  })

  it('includes all other fields in sorted order', () => {
    const payload = makeValidPayload()
    const canonical = new TextDecoder().decode(inviteCanonicalBytes(payload))
    const parsed = JSON.parse(canonical)
    const keys = Object.keys(parsed)
    expect(keys).toEqual([...keys].sort())
    expect(keys).not.toContain('inviterSig')
    expect(keys).toContain('inviterPubkey')
    expect(keys).toContain('seed')
  })
})

// ── Payload validation ──────────────────────────────────────────

describe('assertInvitePayload', () => {
  it('accepts a valid payload', () => {
    const payload = makeValidPayload()
    expect(() => assertInvitePayload(payload)).not.toThrow()
  })

  it('rejects inviterPubkey not in admins', () => {
    const payload = makeValidPayload({ inviterPubkey: NON_ADMIN_PUBKEY })
    // Need a valid sig format to pass earlier checks
    payload.inviterSig = 'a'.repeat(128)
    expect(() => assertInvitePayload(payload)).toThrow('inviterPubkey must be in admins')
  })

  it('rejects admins not subset of members', () => {
    expect(() => assertInvitePayload({
      ...makeValidPayload(),
      admins: [ADMIN_PUBKEY, NON_ADMIN_PUBKEY],
      members: [ADMIN_PUBKEY],
    })).toThrow('all admins must be in members')
  })

  it('rejects missing inviterSig', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).inviterSig = undefined
    expect(() => assertInvitePayload(payload)).toThrow('inviterSig')
  })

  it('rejects invalid seed format', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).seed = 'not-hex'
    expect(() => assertInvitePayload(payload)).toThrow('seed')
  })

  it('rejects ws:// relay (requires wss://)', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).relays = ['ws://insecure.relay.com']
    expect(() => assertInvitePayload(payload)).toThrow('wss://')
  })

  it('rejects expiresAt <= issuedAt', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).expiresAt = payload.issuedAt
    expect(() => assertInvitePayload(payload)).toThrow('expiresAt must be after issuedAt')
  })

  it('rejects wrong protocol version', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).protocolVersion = 99
    expect(() => assertInvitePayload(payload)).toThrow('Unsupported invite protocol version')
  })
})

// ── Confirmation code ───────────────────────────────────────────

describe('confirmCodeFromPayload', () => {
  it('returns formatted XXXX-XXXX-XXXX code', () => {
    const payload = makeValidPayload()
    const code = confirmCodeFromPayload(payload)
    expect(code).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/)
  })

  it('is deterministic', () => {
    const payload = makeValidPayload()
    expect(confirmCodeFromPayload(payload)).toBe(confirmCodeFromPayload(payload))
  })

  it('changes when payload is tampered', () => {
    const payload = makeValidPayload()
    const original = confirmCodeFromPayload(payload)
    const tampered = { ...payload, counter: 999 }
    expect(confirmCodeFromPayload(tampered)).not.toBe(original)
  })

  it('changes when nonce differs', () => {
    const payload1 = makeValidPayload({ nonce: 'a'.repeat(32) })
    const payload2 = makeValidPayload({ nonce: 'c'.repeat(32) })
    expect(confirmCodeFromPayload(payload1)).not.toBe(confirmCodeFromPayload(payload2))
  })
})

// ── Conformance vectors ─────────────────────────────────────────

describe('invite authority conformance vectors', () => {
  for (const vector of vectors.vectors) {
    it(vector.id, () => {
      const payload = vector.payload as unknown as InvitePayload

      if (vector.expected === 'validation-error') {
        expect(() => assertInvitePayload(payload)).toThrow(vector.expectedError)
        return
      }

      // Payload must pass structural validation first
      assertInvitePayload(payload)

      if (vector.expected === 'valid-signature') {
        expect(verifyInviteSig(payload)).toBe(true)
      } else if (vector.expected === 'invalid-signature') {
        expect(verifyInviteSig(payload)).toBe(false)
      }
    })
  }
})
