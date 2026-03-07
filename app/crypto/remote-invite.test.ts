// Remote invite crypto module tests — exercises the 3-message handshake:
// seedless invite token, join code (pubkey), and NIP-44 encrypted welcome envelope.

import { describe, it, expect } from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import { bytesToHex, hexToBytes } from 'canary-kit/crypto'
import {
  createRemoteInviteToken,
  assertRemoteInviteToken,
  createWelcomeEnvelope,
  decryptWelcomeEnvelope,
  type WelcomePayload,
} from './remote-invite.js'

// ── Test keypairs ───────────────────────────────────────────────

const ADMIN_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000001'
const ADMIN_PUBKEY = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'
const JOINER_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000002'
const JOINER_PUBKEY = bytesToHex(schnorr.getPublicKey(hexToBytes(JOINER_PRIVKEY)))

// A third party — used to test decryption with the wrong key
const WRONG_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000003'

const TEST_INVITE_ID = 'ab'.repeat(16)

function makeWelcomePayload(overrides: Partial<WelcomePayload> = {}): WelcomePayload {
  return {
    inviteId: TEST_INVITE_ID,
    seed: 'a'.repeat(64),
    counter: 42,
    usageOffset: 0,
    epoch: 2,
    wordCount: 2,
    rotationInterval: 604800,
    groupId: 'test-group-remote',
    groupName: 'Remote Test Group',
    wordlist: 'en-v1',
    beaconInterval: 300,
    beaconPrecision: 6,
    encodingFormat: 'words',
    tolerance: 1,
    members: [ADMIN_PUBKEY, JOINER_PUBKEY],
    admins: [ADMIN_PUBKEY],
    relays: ['wss://relay.example.com'],
    ...overrides,
  }
}

// ── Invite token creation ───────────────────────────────────────

describe('createRemoteInviteToken', () => {
  it('creates a valid seedless invite token', () => {
    const token = createRemoteInviteToken({
      groupName: 'Test Group',
      groupId: 'test-group-1',
      adminPubkey: ADMIN_PUBKEY,
      adminPrivkey: ADMIN_PRIVKEY,
      relays: ['wss://relay.example.com'],
    })

    // All fields present
    expect(token.groupName).toBe('Test Group')
    expect(token.groupId).toBe('test-group-1')
    expect(token.adminPubkey).toBe(ADMIN_PUBKEY)
    expect(token.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000))
    expect(token.relays).toEqual(['wss://relay.example.com'])

    // inviteId is 32-char hex (16 bytes)
    expect(token.inviteId).toMatch(/^[0-9a-f]{32}$/)

    // No seed field
    expect((token as Record<string, unknown>).seed).toBeUndefined()

    // adminSig is 128-char hex (64 bytes)
    expect(token.adminSig).toMatch(/^[0-9a-f]{128}$/)

    // Should pass full validation
    expect(() => assertRemoteInviteToken(token)).not.toThrow()
  })
})

// ── Invite token validation ─────────────────────────────────────

describe('assertRemoteInviteToken', () => {
  it('rejects missing fields', () => {
    expect(() => assertRemoteInviteToken({})).toThrow()
  })

  it('rejects expired token', () => {
    const token = createRemoteInviteToken({
      groupName: 'Test Group',
      groupId: 'test-group-1',
      adminPubkey: ADMIN_PUBKEY,
      adminPrivkey: ADMIN_PRIVKEY,
      relays: ['wss://relay.example.com'],
      expiresInSec: -1,
    })
    expect(() => assertRemoteInviteToken(token)).toThrow(/expired/i)
  })

  it('rejects invalid signature', () => {
    const token = createRemoteInviteToken({
      groupName: 'Test Group',
      groupId: 'test-group-1',
      adminPubkey: ADMIN_PUBKEY,
      adminPrivkey: ADMIN_PRIVKEY,
      relays: ['wss://relay.example.com'],
    })
    // Tamper with the signature
    token.adminSig = 'f'.repeat(128)
    expect(() => assertRemoteInviteToken(token)).toThrow(/signature/i)
  })
})

// ── Welcome envelope round-trip ─────────────────────────────────

describe('welcome envelope', () => {
  it('round-trips: encrypt then decrypt recovers the welcome payload', () => {
    const welcome = makeWelcomePayload()

    const envelope = createWelcomeEnvelope({
      welcome,
      adminPrivkey: ADMIN_PRIVKEY,
      joinerPubkey: JOINER_PUBKEY,
    })

    expect(typeof envelope).toBe('string')
    expect(envelope.length).toBeGreaterThan(0)

    const decrypted = decryptWelcomeEnvelope({
      envelope,
      joinerPrivkey: JOINER_PRIVKEY,
      adminPubkey: ADMIN_PUBKEY,
      expectedInviteId: TEST_INVITE_ID,
    })

    expect(decrypted.inviteId).toBe(TEST_INVITE_ID)
    expect(decrypted.seed).toBe(welcome.seed)
    expect(decrypted.counter).toBe(welcome.counter)
    expect(decrypted.epoch).toBe(welcome.epoch)
    expect(decrypted.groupId).toBe(welcome.groupId)
    expect(decrypted.groupName).toBe(welcome.groupName)
    expect(decrypted.members).toEqual(welcome.members)
    expect(decrypted.admins).toEqual(welcome.admins)
  })

  it('decrypt with wrong key fails', () => {
    const welcome = makeWelcomePayload()

    const envelope = createWelcomeEnvelope({
      welcome,
      adminPrivkey: ADMIN_PRIVKEY,
      joinerPubkey: JOINER_PUBKEY,
    })

    // Decrypt with a different private key — should fail
    expect(() =>
      decryptWelcomeEnvelope({
        envelope,
        joinerPrivkey: WRONG_PRIVKEY,
        adminPubkey: ADMIN_PUBKEY,
        expectedInviteId: TEST_INVITE_ID,
      }),
    ).toThrow()
  })

  it('rejects welcome with mismatched inviteId', () => {
    const welcome = makeWelcomePayload({ inviteId: 'cd'.repeat(16) })

    const envelope = createWelcomeEnvelope({
      welcome,
      adminPrivkey: ADMIN_PRIVKEY,
      joinerPubkey: JOINER_PUBKEY,
    })

    expect(() =>
      decryptWelcomeEnvelope({
        envelope,
        joinerPrivkey: JOINER_PRIVKEY,
        adminPubkey: ADMIN_PUBKEY,
        expectedInviteId: TEST_INVITE_ID, // different from 'cd'.repeat(16)
      }),
    ).toThrow(/inviteId/)
  })

  it('rejects welcome without inviteId', () => {
    // Manually create an envelope without inviteId
    const welcome = makeWelcomePayload()
    const { inviteId: _, ...withoutId } = welcome

    const envelope = createWelcomeEnvelope({
      welcome: withoutId as WelcomePayload,
      adminPrivkey: ADMIN_PRIVKEY,
      joinerPubkey: JOINER_PUBKEY,
    })

    expect(() =>
      decryptWelcomeEnvelope({
        envelope,
        joinerPrivkey: JOINER_PRIVKEY,
        adminPubkey: ADMIN_PUBKEY,
        expectedInviteId: TEST_INVITE_ID,
      }),
    ).toThrow(/inviteId/)
  })
})
