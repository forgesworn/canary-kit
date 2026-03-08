import { describe, it, expect } from 'vitest'
import { packInvite, unpackInvite } from './binary-invite.js'
import type { InvitePayload } from '../invite.js'

const ADMIN_PUBKEY = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'

function makePayload(overrides: Partial<InvitePayload> = {}): InvitePayload {
  return {
    groupId: 'f4f9c20f-8e58-4d63-a66b-6355a23c63ba',
    seed: 'a'.repeat(64),
    groupName: 'Family',
    rotationInterval: 604800,
    wordCount: 2,
    wordlist: 'en-v1',
    counter: 42,
    usageOffset: 0,
    nonce: 'ab'.repeat(16),
    beaconInterval: 300,
    beaconPrecision: 6,
    members: [ADMIN_PUBKEY],
    relays: ['wss://relay.trotters.cc/'],
    encodingFormat: 'words',
    tolerance: 1,
    issuedAt: 1741111339,
    expiresAt: 1741197739,
    epoch: 2,
    admins: [ADMIN_PUBKEY],
    protocolVersion: 2,
    inviterPubkey: ADMIN_PUBKEY,
    inviterSig: 'cd'.repeat(64),
    ...overrides,
  }
}

describe('packInvite / unpackInvite', () => {
  it('round-trips a single-member invite', () => {
    const payload = makePayload()
    const packed = packInvite(payload)
    expect(packed).toBeInstanceOf(Uint8Array)
    expect(packed.byteLength).toBeLessThan(300)
    const unpacked = unpackInvite(packed)
    // Check ALL fields match
    expect(unpacked.seed).toBe(payload.seed)
    expect(unpacked.groupId).toBe(payload.groupId)
    expect(unpacked.groupName).toBe(payload.groupName)
    expect(unpacked.counter).toBe(payload.counter)
    expect(unpacked.usageOffset).toBe(payload.usageOffset)
    expect(unpacked.epoch).toBe(payload.epoch)
    expect(unpacked.rotationInterval).toBe(payload.rotationInterval)
    expect(unpacked.beaconInterval).toBe(payload.beaconInterval)
    expect(unpacked.beaconPrecision).toBe(payload.beaconPrecision)
    expect(unpacked.wordCount).toBe(payload.wordCount)
    expect(unpacked.tolerance).toBe(payload.tolerance)
    expect(unpacked.encodingFormat).toBe(payload.encodingFormat)
    expect(unpacked.wordlist).toBe(payload.wordlist)
    expect(unpacked.issuedAt).toBe(payload.issuedAt)
    expect(unpacked.expiresAt).toBe(payload.expiresAt)
    expect(unpacked.protocolVersion).toBe(payload.protocolVersion)
    expect(unpacked.inviterPubkey).toBe(payload.inviterPubkey)
    expect(unpacked.inviterSig).toBe(payload.inviterSig)
    expect(unpacked.nonce).toBe(payload.nonce)
    expect(unpacked.members).toEqual(payload.members)
    expect(unpacked.admins).toEqual(payload.admins)
  })

  it('round-trips a multi-member invite', () => {
    const member2 = 'bb'.repeat(32)
    const member3 = 'cc'.repeat(32)
    const payload = makePayload({
      members: [ADMIN_PUBKEY, member2, member3],
      admins: [ADMIN_PUBKEY, member2],
    })
    const unpacked = unpackInvite(packInvite(payload))
    expect(unpacked.members).toEqual([ADMIN_PUBKEY, member2, member3])
    expect(unpacked.admins).toEqual([ADMIN_PUBKEY, member2])
  })

  it('round-trips Unicode group names', () => {
    const payload = makePayload({ groupName: 'Famille \u{1F60A}' })
    const unpacked = unpackInvite(packInvite(payload))
    expect(unpacked.groupName).toBe('Famille \u{1F60A}')
  })

  it('rejects unknown version byte', () => {
    const packed = packInvite(makePayload())
    packed[0] = 99
    expect(() => unpackInvite(packed)).toThrow(/version/)
  })

  it('sets relays to empty array', () => {
    const unpacked = unpackInvite(packInvite(makePayload()))
    expect(unpacked.relays).toEqual([])
  })
})
