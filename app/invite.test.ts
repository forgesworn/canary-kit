// Invite authority contract tests — exercises pure crypto/validation logic
// without UI or app state dependencies.

import { describe, it, expect } from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import { sha256, bytesToHex, hexToBytes } from 'canary-kit/crypto'
import { jsonToBase64, base64ToJson } from './utils/base64.js'
import { indexOf } from 'canary-kit/wordlist'
import { deriveToken } from 'canary-kit/token'
import {
  assertInvitePayload,
  inviteCanonicalBytes,
  signInvite,
  verifyInviteSig,
  confirmCodeFromPayload,
  createJoinToken,
  verifyJoinToken,
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
    protocolVersion: 2,
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

  it('includes transport-agnostic fields in sorted order', () => {
    const payload = makeValidPayload()
    const canonical = new TextDecoder().decode(inviteCanonicalBytes(payload))
    const parsed = JSON.parse(canonical)
    const keys = Object.keys(parsed)
    expect(keys).toEqual([...keys].sort())
    // Excluded: inviterSig (being verified), relays & memberNames (stripped by binary format)
    expect(keys).not.toContain('inviterSig')
    expect(keys).not.toContain('relays')
    expect(keys).not.toContain('memberNames')
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

  it('rejects tolerance > 10 (MAX_TOLERANCE)', () => {
    const payload = makeValidPayload()
    ;(payload as unknown as Record<string, unknown>).tolerance = 11
    expect(() => assertInvitePayload(payload)).toThrow('tolerance must be <= 10')
  })
})

// ── Confirmation code ───────────────────────────────────────────

describe('confirmCodeFromPayload', () => {
  const validPayload = makeValidPayload()

  it('returns 3 space-separated words from wordlist', () => {
    const code = confirmCodeFromPayload(validPayload)
    const words = code.split(' ')
    expect(words).toHaveLength(3)
    words.forEach(w => {
      expect(indexOf(w)).toBeGreaterThanOrEqual(0)
    })
  })

  it('is deterministic', () => {
    expect(confirmCodeFromPayload(validPayload)).toBe(confirmCodeFromPayload(validPayload))
  })

  it('changes when payload is tampered', () => {
    const tampered = { ...validPayload, seed: 'b'.repeat(64) }
    expect(confirmCodeFromPayload(tampered)).not.toBe(confirmCodeFromPayload(validPayload))
  })

  it('changes when nonce differs', () => {
    const other = { ...validPayload, nonce: 'ff'.repeat(16) }
    expect(confirmCodeFromPayload(other)).not.toBe(confirmCodeFromPayload(validPayload))
  })
})

// ── Join token ──────────────────────────────────────────────────

describe('join token', () => {
  const groupSeed = 'a'.repeat(64)
  const groupId = 'test-group-1'
  const privkey = 'b'.repeat(64)
  // Derive pubkey from privkey for test
  const pubkey = bytesToHex(schnorr.getPublicKey(hexToBytes(privkey)))

  it('round-trips: create then verify', () => {
    const correctWord = deriveToken(groupSeed, 'canary:group', 0)
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Alice',
      currentWord: correctWord,
    })
    const result = verifyJoinToken(token, { groupId, groupSeed, counter: 0, context: 'canary:group' })
    expect(result.valid).toBe(true)
    expect(result.pubkey).toBe(pubkey)
    expect(result.displayName).toBe('Alice')
  })

  it('rejects token with invalid signature', () => {
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Alice',
      currentWord: 'sparrow',
    })
    // Tamper with the token
    const parsed = base64ToJson(token) as Record<string, unknown>
    parsed.n = 'Eve'
    const tampered = jsonToBase64(parsed)
    const result = verifyJoinToken(tampered, { groupId, groupSeed, counter: 0, context: 'canary:group' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/signature/i)
  })

  it('rejects token with wrong groupId', () => {
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Alice',
      currentWord: 'sparrow',
    })
    const result = verifyJoinToken(token, { groupId: 'wrong-group', groupSeed, counter: 0, context: 'canary:group' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/group/i)
  })

  it('rejects token with stale timestamp', () => {
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Alice',
      currentWord: 'sparrow',
      timestampOverride: Math.floor(Date.now() / 1000) - 86400 * 8, // 8 days ago
    })
    const result = verifyJoinToken(token, { groupId, groupSeed, counter: 0, context: 'canary:group' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/expired|stale/i)
  })

  it('rejects token with wrong word (attacker does not know seed)', () => {
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Eve',
      currentWord: 'wrong-word',
    })
    const result = verifyJoinToken(token, { groupId, groupSeed, counter: 0, context: 'canary:group' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/word|seed/i)
  })

  it('accepts token with word from adjacent counter (tolerance)', () => {
    const prevWord = deriveToken(groupSeed, 'canary:group', 0)
    const token = createJoinToken({
      groupId,
      privkey,
      pubkey,
      displayName: 'Alice',
      currentWord: prevWord,
    })
    // Verify with counter=1 — the word from counter=0 should still be accepted
    const result = verifyJoinToken(token, { groupId, groupSeed, counter: 1, context: 'canary:group' })
    expect(result.valid).toBe(true)
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
