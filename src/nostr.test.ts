import { describe, it, expect } from 'vitest'
import {
  buildGroupEvent,
  buildSeedDistributionEvent,
  buildMemberUpdateEvent,
  buildReseedEvent,
  buildWordUsedEvent,
  buildBeaconEvent,
  KINDS,
  SeedDistributionPayload,
  GroupEventPayload,
} from './nostr.js'

const CREATOR = 'c'.repeat(64)
const ALICE = '1'.repeat(64)
const BOB = '2'.repeat(64)
const SEED = 'a'.repeat(64)
const GROUP_D = 'family-2026'
const GROUP_EVENT_ID = 'e'.repeat(64)

describe('KINDS', () => {
  it('defines 6 event kinds', () => {
    expect(Object.keys(KINDS)).toHaveLength(6)
    expect(KINDS.group).toBe(38800)
    expect(KINDS.seedDistribution).toBe(28800)
    expect(KINDS.memberUpdate).toBe(38801)
    expect(KINDS.reseed).toBe(28801)
    expect(KINDS.wordUsed).toBe(28802)
    expect(KINDS.beacon).toBe(20800)
  })
})

describe('buildGroupEvent', () => {
  it('builds a valid event with correct kind', () => {
    const event = buildGroupEvent({
      groupId: GROUP_D,
      name: 'Family',
      members: [ALICE, BOB],
      rotationInterval: 604_800,
      wordCount: 1,
      wordlist: 'en-v1',
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(KINDS.group)
    expect(event.content).toBe('<encrypted>')
    expect(event.tags).toContainEqual(['d', GROUP_D])
    expect(event.tags).toContainEqual(['name', 'Family'])
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['p', BOB])
    expect(event.tags).toContainEqual(['rotation', '604800'])
    expect(event.tags).toContainEqual(['words', '1'])
    expect(event.tags).toContainEqual(['wordlist', 'en-v1'])
    expect(event.created_at).toBeGreaterThan(0)
  })

  it('includes expiration tag when provided', () => {
    const event = buildGroupEvent({
      groupId: GROUP_D,
      name: 'Temp',
      members: [ALICE],
      rotationInterval: 604_800,
      wordCount: 1,
      wordlist: 'en-v1',
      encryptedContent: '',
      expiration: 1_800_000_000,
    })
    expect(event.tags).toContainEqual(['expiration', '1800000000'])
  })

  it('encodes wordCount: 2 in the words tag', () => {
    const event = buildGroupEvent({
      groupId: GROUP_D,
      name: 'Two Words',
      members: [ALICE],
      rotationInterval: 604_800,
      wordCount: 2,
      wordlist: 'en-v1',
      encryptedContent: '',
    })
    expect(event.tags).toContainEqual(['words', '2'])
  })

  it('encodes wordCount: 3 in the words tag', () => {
    const event = buildGroupEvent({
      groupId: GROUP_D,
      name: 'Three Words',
      members: [ALICE],
      rotationInterval: 604_800,
      wordCount: 3,
      wordlist: 'en-v1',
      encryptedContent: '',
    })
    expect(event.tags).toContainEqual(['words', '3'])
  })
})

describe('buildSeedDistributionEvent', () => {
  it('builds an ephemeral event with p and e tags', () => {
    const event = buildSeedDistributionEvent({
      recipientPubkey: ALICE,
      groupEventId: GROUP_EVENT_ID,
      encryptedContent: '<encrypted-seed>',
    })
    expect(event.kind).toBe(KINDS.seedDistribution)
    expect(event.content).toBe('<encrypted-seed>')
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['e', GROUP_EVENT_ID])
  })
})

describe('buildMemberUpdateEvent', () => {
  it('builds event for adding a member', () => {
    const event = buildMemberUpdateEvent({
      groupId: GROUP_D,
      action: 'add',
      memberPubkey: ALICE,
      reseed: false,
      encryptedContent: '',
    })
    expect(event.kind).toBe(KINDS.memberUpdate)
    expect(event.tags).toContainEqual(['action', 'add'])
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['reseed', 'false'])
  })

  it('builds event for removing with reseed=true', () => {
    const event = buildMemberUpdateEvent({
      groupId: GROUP_D,
      action: 'remove',
      memberPubkey: ALICE,
      reseed: true,
      encryptedContent: '',
    })
    expect(event.tags).toContainEqual(['action', 'remove'])
    expect(event.tags).toContainEqual(['reseed', 'true'])
  })
})

describe('buildReseedEvent', () => {
  it('builds an event with reason tag', () => {
    const event = buildReseedEvent({
      groupEventId: GROUP_EVENT_ID,
      reason: 'duress',
      encryptedContent: '<encrypted>',
    })
    expect(event.kind).toBe(KINDS.reseed)
    expect(event.tags).toContainEqual(['e', GROUP_EVENT_ID])
    expect(event.tags).toContainEqual(['reason', 'duress'])
  })

  it('builds reseed event with reason: member_removed', () => {
    const event = buildReseedEvent({
      groupEventId: GROUP_EVENT_ID,
      reason: 'member_removed',
      encryptedContent: '<encrypted>',
    })
    expect(event.tags).toContainEqual(['reason', 'member_removed'])
  })

  it('builds reseed event with reason: compromise', () => {
    const event = buildReseedEvent({
      groupEventId: GROUP_EVENT_ID,
      reason: 'compromise',
      encryptedContent: '<encrypted>',
    })
    expect(event.tags).toContainEqual(['reason', 'compromise'])
  })

  it('builds reseed event with reason: scheduled', () => {
    const event = buildReseedEvent({
      groupEventId: GROUP_EVENT_ID,
      reason: 'scheduled',
      encryptedContent: '<encrypted>',
    })
    expect(event.tags).toContainEqual(['reason', 'scheduled'])
  })
})

describe('buildWordUsedEvent', () => {
  it('builds an ephemeral event', () => {
    const event = buildWordUsedEvent({
      groupEventId: GROUP_EVENT_ID,
      encryptedContent: '<encrypted-payload>',
    })
    expect(event.kind).toBe(KINDS.wordUsed)
    expect(event.tags).toContainEqual(['e', GROUP_EVENT_ID])
  })
})

describe('buildBeaconEvent', () => {
  it('builds an ephemeral event with correct kind and tags', () => {
    const event = buildBeaconEvent({
      groupId: GROUP_D,
      encryptedContent: '<encrypted-beacon>',
      expiration: 1_800_000_300,
    })
    expect(event.kind).toBe(KINDS.beacon)
    expect(event.content).toBe('<encrypted-beacon>')
    expect(event.tags).toContainEqual(['h', GROUP_D])
    expect(event.tags).toContainEqual(['expiration', '1800000300'])
  })

  it('omits expiration tag when not provided', () => {
    const event = buildBeaconEvent({
      groupId: GROUP_D,
      encryptedContent: '<encrypted>',
    })
    const expirationTags = event.tags.filter(t => t[0] === 'expiration')
    expect(expirationTags).toHaveLength(0)
  })
})

describe('pubkey validation', () => {
  it('buildGroupEvent rejects invalid member pubkeys', () => {
    expect(() => buildGroupEvent({
      groupId: GROUP_D, name: 'Test', members: ['not-hex'],
      rotationInterval: 604_800, wordCount: 1, wordlist: 'en-v1', encryptedContent: '',
    })).toThrow(/Invalid member pubkey/)
  })

  it('buildGroupEvent rejects npub-encoded pubkeys', () => {
    expect(() => buildGroupEvent({
      groupId: GROUP_D, name: 'Test', members: ['npub1' + '0'.repeat(59)],
      rotationInterval: 604_800, wordCount: 1, wordlist: 'en-v1', encryptedContent: '',
    })).toThrow(/Invalid member pubkey/)
  })

  it('buildSeedDistributionEvent rejects invalid recipientPubkey', () => {
    expect(() => buildSeedDistributionEvent({
      recipientPubkey: 'short', groupEventId: GROUP_EVENT_ID, encryptedContent: '',
    })).toThrow(/Invalid recipientPubkey/)
  })

  it('buildMemberUpdateEvent rejects invalid memberPubkey', () => {
    expect(() => buildMemberUpdateEvent({
      groupId: GROUP_D, action: 'add', memberPubkey: 'bad',
      reseed: false, encryptedContent: '',
    })).toThrow(/Invalid memberPubkey/)
  })

  it('buildGroupEvent accepts valid 64-char hex pubkeys', () => {
    expect(() => buildGroupEvent({
      groupId: GROUP_D, name: 'Test', members: [ALICE, BOB],
      rotationInterval: 604_800, wordCount: 1, wordlist: 'en-v1', encryptedContent: '',
    })).not.toThrow()
  })
})

describe('expiration edge cases', () => {
  it('buildGroupEvent includes expiration tag for timestamp 0', () => {
    const event = buildGroupEvent({
      groupId: GROUP_D,
      name: 'Test',
      members: [ALICE],
      rotationInterval: 604_800,
      wordCount: 1,
      wordlist: 'en-v1',
      encryptedContent: '',
      expiration: 0,
    })
    expect(event.tags).toContainEqual(['expiration', '0'])
  })

  it('buildBeaconEvent includes expiration tag for timestamp 0', () => {
    const event = buildBeaconEvent({
      groupId: GROUP_D,
      encryptedContent: '',
      expiration: 0,
    })
    expect(event.tags).toContainEqual(['expiration', '0'])
  })
})

describe('SeedDistributionPayload', () => {
  it('has counter_offset and group_d fields matching NIP-CANARY spec', () => {
    const payload: SeedDistributionPayload = {
      seed: 'a'.repeat(64),
      counter_offset: 0,
      group_d: 'test-group',
    }
    expect(payload.counter_offset).toBe(0)
    expect(payload.group_d).toBe('test-group')
  })
})

describe('GroupEventPayload', () => {
  it('matches NIP-CANARY encrypted content structure', () => {
    const payload: GroupEventPayload = {
      description: 'Family safety group',
      policies: {
        invite_by: 'creator',
        reseed_by: 'creator',
      },
    }
    expect(payload.description).toBe('Family safety group')
    expect(payload.policies.invite_by).toBe('creator')
  })
})
