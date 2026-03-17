import { describe, it, expect } from 'vitest'
import {
  buildGroupStateEvent,
  buildStoredSignalEvent,
  buildSignalEvent,
  buildRumourEvent,
  KINDS,
  hashGroupId,
  type GroupConfigPayload,
  type SeedDistributionPayload,
} from './nostr.js'

const ALICE = '1'.repeat(64)
const BOB = '2'.repeat(64)
const GROUP_ID = 'family-2026'
const GROUP_EVENT_ID = 'e'.repeat(64)

// ── KINDS ────────────────────────────────────────────────────────────────────

describe('KINDS', () => {
  it('defines 3 event kinds with correct values', () => {
    expect(Object.keys(KINDS)).toHaveLength(3)
    expect(KINDS.groupState).toBe(30078)
    expect(KINDS.signal).toBe(20078)
    expect(KINDS.giftWrap).toBe(1059)
  })
})

// ── buildGroupStateEvent ─────────────────────────────────────────────────────

describe('buildGroupStateEvent', () => {
  it('builds event with correct kind, d-tag, p-tags, and created_at', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE, BOB],
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(30078)
    expect(event.content).toBe('<encrypted>')
    expect(event.tags).toContainEqual(['d', `ssg/${GROUP_ID}`])
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['p', BOB])
    expect(event.created_at).toBeGreaterThan(0)
  })

  it('includes NIP-32 labels (L and l tags)', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE],
      encryptedContent: '',
    })
    expect(event.tags).toContainEqual(['L', 'ssg'])
    expect(event.tags).toContainEqual(['l', 'group', 'ssg'])
  })

  it('includes rotation tag when rotationInterval is provided', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE],
      encryptedContent: '',
      rotationInterval: 604_800,
    })
    expect(event.tags).toContainEqual(['rotation', '604800'])
  })

  it('includes tolerance tag when tolerance is provided', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE],
      encryptedContent: '',
      tolerance: 2,
    })
    expect(event.tags).toContainEqual(['tolerance', '2'])
  })

  it('includes expiration tag when provided', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE],
      encryptedContent: '',
      expiration: 1_800_000_000,
    })
    expect(event.tags).toContainEqual(['expiration', '1800000000'])
  })

  it('includes expiration tag for timestamp 0', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID,
      members: [ALICE],
      encryptedContent: '',
      expiration: 0,
    })
    expect(event.tags).toContainEqual(['expiration', '0'])
  })

  it('rejects negative expiration', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', expiration: -1,
    })).toThrow(/non-negative integer/)
  })

  it('rejects fractional expiration', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', expiration: 1.5,
    })).toThrow(/non-negative integer/)
  })

  it('rejects NaN expiration', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', expiration: NaN,
    })).toThrow(/non-negative integer/)
  })

  it('rejects non-positive rotationInterval', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', rotationInterval: 0,
    })).toThrow(/rotationInterval/)
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', rotationInterval: -5,
    })).toThrow(/rotationInterval/)
  })

  it('rejects negative tolerance', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', tolerance: -1,
    })).toThrow(/tolerance/)
  })

  it('accepts tolerance: 0 (exact counter match)', () => {
    const event = buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: '', tolerance: 0,
    })
    expect(event.tags.find(t => t[0] === 'tolerance')?.[1]).toBe('0')
  })

  it('rejects empty groupId', () => {
    expect(() => buildGroupStateEvent({
      groupId: '', members: [ALICE], encryptedContent: '',
    })).toThrow(/non-empty/)
  })

  it('rejects overly long groupId', () => {
    expect(() => buildGroupStateEvent({
      groupId: 'x'.repeat(257), members: [ALICE], encryptedContent: '',
    })).toThrow(/maximum length/)
  })

  it('rejects invalid hex pubkey', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: ['not-hex'], encryptedContent: '',
    })).toThrow(/Invalid member pubkey/)
  })

  it('rejects npub-encoded pubkey', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: ['npub1' + '0'.repeat(59)], encryptedContent: '',
    })).toThrow(/Invalid member pubkey/)
  })

  it('accepts valid 64-char hex pubkeys', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE, BOB], encryptedContent: '',
    })).not.toThrow()
  })

  it('rejects encryptedContent exceeding 64KB', () => {
    expect(() => buildGroupStateEvent({
      groupId: GROUP_ID, members: [ALICE], encryptedContent: 'x'.repeat(65537),
    })).toThrow(/encryptedContent/)
  })

  it('error message does not leak pubkey content', () => {
    const fakeSecret = 'a'.repeat(100)
    try {
      buildGroupStateEvent({
        groupId: GROUP_ID, members: [fakeSecret], encryptedContent: '',
      })
    } catch (e: unknown) {
      const msg = (e as Error).message
      expect(msg).toContain('100 chars')
      expect(msg).not.toContain(fakeSecret)
    }
  })
})

// ── buildStoredSignalEvent ───────────────────────────────────────────────────

describe('buildStoredSignalEvent', () => {
  it('builds kind 30078 with hashed type-scoped d-tag', () => {
    const event = buildStoredSignalEvent({
      groupId: GROUP_ID,
      signalType: 'counter-advance',
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(30078)
    const dTag = event.tags.find(t => t[0] === 'd')
    expect(dTag).toBeDefined()
    expect(dTag![1]).toMatch(/^ssg\/[0-9a-f]{64}:counter-advance$/)
  })

  it('hashes group ID for privacy (d-tag does not contain plaintext)', () => {
    const event = buildStoredSignalEvent({
      groupId: GROUP_ID,
      signalType: 'reseed',
      encryptedContent: '',
    })
    const dTag = event.tags.find(t => t[0] === 'd')!
    expect(dTag[1]).not.toContain(GROUP_ID)
  })

  it('produces consistent hashes for the same group ID', () => {
    const e1 = buildStoredSignalEvent({ groupId: GROUP_ID, signalType: 'x', encryptedContent: '' })
    const e2 = buildStoredSignalEvent({ groupId: GROUP_ID, signalType: 'x', encryptedContent: '' })
    const d1 = e1.tags.find(t => t[0] === 'd')!
    const d2 = e2.tags.find(t => t[0] === 'd')!
    expect(d1[1]).toBe(d2[1])
  })

  it('includes 7-day expiration tag', () => {
    const event = buildStoredSignalEvent({
      groupId: GROUP_ID,
      signalType: 'test',
      encryptedContent: '',
    })
    const expTag = event.tags.find(t => t[0] === 'expiration')
    expect(expTag).toBeDefined()
    const expiration = Number(expTag![1])
    const expectedExpiration = event.created_at + 7 * 24 * 60 * 60
    // Allow 30-second tolerance for test execution time
    expect(Math.abs(expiration - expectedExpiration)).toBeLessThan(30)
  })

  it('rejects empty groupId', () => {
    expect(() => buildStoredSignalEvent({
      groupId: '', signalType: 'test', encryptedContent: '',
    })).toThrow(/non-empty/)
  })

  it('rejects empty signalType', () => {
    expect(() => buildStoredSignalEvent({
      groupId: GROUP_ID, signalType: '', encryptedContent: '',
    })).toThrow(/non-empty/)
  })
})

// ── buildSignalEvent ─────────────────────────────────────────────────────────

describe('buildSignalEvent', () => {
  it('builds kind 20078 with hashed d-tag and t-tag', () => {
    const event = buildSignalEvent({
      groupId: GROUP_ID,
      signalType: 'word-used',
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(20078)
    const dTag = event.tags.find(t => t[0] === 'd')
    expect(dTag).toBeDefined()
    expect(dTag![1]).toMatch(/^ssg\/[0-9a-f]{64}$/)
    expect(event.tags).toContainEqual(['t', 'word-used'])
  })

  it('does not include expiration tag', () => {
    const event = buildSignalEvent({
      groupId: GROUP_ID,
      signalType: 'test',
      encryptedContent: '',
    })
    const expTags = event.tags.filter(t => t[0] === 'expiration')
    expect(expTags).toHaveLength(0)
  })

  it('uses the same hash as buildStoredSignalEvent for the same group ID', () => {
    const signalEvent = buildSignalEvent({
      groupId: GROUP_ID, signalType: 'x', encryptedContent: '',
    })
    const storedEvent = buildStoredSignalEvent({
      groupId: GROUP_ID, signalType: 'x', encryptedContent: '',
    })
    const signalDTag = signalEvent.tags.find(t => t[0] === 'd')!
    const storedDTag = storedEvent.tags.find(t => t[0] === 'd')!
    // The stored d-tag has `:signalType` suffix, the signal d-tag does not
    const signalHash = signalDTag[1].replace('ssg/', '')
    const storedHash = storedDTag[1].replace('ssg/', '').split(':')[0]
    expect(signalHash).toBe(storedHash)
  })

  it('rejects empty groupId', () => {
    expect(() => buildSignalEvent({
      groupId: '', signalType: 'test', encryptedContent: '',
    })).toThrow(/non-empty/)
  })

  it('rejects empty signalType', () => {
    expect(() => buildSignalEvent({
      groupId: GROUP_ID, signalType: '', encryptedContent: '',
    })).toThrow(/non-empty/)
  })
})

// ── buildRumourEvent ─────────────────────────────────────────────────────────

describe('buildRumourEvent', () => {
  it('builds kind 14 with subject and p-tag', () => {
    const event = buildRumourEvent({
      recipientPubkey: ALICE,
      subject: 'ssg:seed-distribution',
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(14)
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['subject', 'ssg:seed-distribution'])
  })

  it('includes e-tag when groupEventId is provided', () => {
    const event = buildRumourEvent({
      recipientPubkey: ALICE,
      subject: 'ssg:reseed',
      encryptedContent: '',
      groupEventId: GROUP_EVENT_ID,
    })
    expect(event.tags).toContainEqual(['e', GROUP_EVENT_ID])
  })

  it('omits e-tag when groupEventId is not provided', () => {
    const event = buildRumourEvent({
      recipientPubkey: ALICE,
      subject: 'ssg:seed-distribution',
      encryptedContent: '',
    })
    const eTags = event.tags.filter(t => t[0] === 'e')
    expect(eTags).toHaveLength(0)
  })

  it('accepts all NIP-XX subject types', () => {
    const subjects = [
      'ssg:seed-distribution',
      'ssg:reseed',
      'ssg:member-add',
      'ssg:member-remove',
      'ssg:counter-advance',
      'ssg:word-used',
    ]
    for (const subject of subjects) {
      expect(() => buildRumourEvent({
        recipientPubkey: ALICE, subject, encryptedContent: '',
      })).not.toThrow()
    }
  })

  it('rejects invalid recipientPubkey', () => {
    expect(() => buildRumourEvent({
      recipientPubkey: 'short', subject: 'ssg:test', encryptedContent: '',
    })).toThrow(/Invalid recipientPubkey/)
  })

  it('rejects invalid groupEventId', () => {
    expect(() => buildRumourEvent({
      recipientPubkey: ALICE, subject: 'ssg:test', encryptedContent: '',
      groupEventId: 'not-hex',
    })).toThrow(/Invalid groupEventId/)
  })

  it('rejects empty subject', () => {
    expect(() => buildRumourEvent({
      recipientPubkey: ALICE, subject: '', encryptedContent: '',
    })).toThrow(/non-empty/)
  })

  it('error message does not leak pubkey content', () => {
    const fakeSecret = 'a'.repeat(100)
    try {
      buildRumourEvent({
        recipientPubkey: fakeSecret, subject: 'ssg:test', encryptedContent: '',
      })
    } catch (e: unknown) {
      const msg = (e as Error).message
      expect(msg).toContain('100 chars')
      expect(msg).not.toContain(fakeSecret)
    }
  })
})

// ── Payload type compile-time checks ─────────────────────────────────────────

describe('GroupConfigPayload', () => {
  it('uses invite_by: admin (not creator)', () => {
    const payload: GroupConfigPayload = {
      description: 'Family safety group',
      policies: {
        invite_by: 'admin',
        reseed_by: 'admin',
      },
    }
    expect(payload.policies.invite_by).toBe('admin')
  })
})

describe('SeedDistributionPayload', () => {
  it('has counter_offset and group_d fields', () => {
    const payload: SeedDistributionPayload = {
      seed: 'a'.repeat(64),
      counter_offset: 0,
      group_d: 'test-group',
    }
    expect(payload.counter_offset).toBe(0)
    expect(payload.group_d).toBe('test-group')
  })
})

// ── hashGroupId ──────────────────────────────────────────────────────────────

describe('hashGroupId', () => {
  it('returns a 64-character hex string', () => {
    const hash = hashGroupId(GROUP_ID)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('produces consistent results', () => {
    expect(hashGroupId(GROUP_ID)).toBe(hashGroupId(GROUP_ID))
  })

  it('produces different hashes for different inputs', () => {
    expect(hashGroupId('group-a')).not.toBe(hashGroupId('group-b'))
  })
})
