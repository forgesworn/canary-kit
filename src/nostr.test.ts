import { describe, it, expect } from 'vitest'
import {
  buildGroupEvent,
  buildSeedDistributionEvent,
  buildMemberUpdateEvent,
  buildReseedEvent,
  buildWordUsedEvent,
  buildBeaconEvent,
  buildDuressAlertEvent,
  KINDS,
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
    expect(KINDS.group).toBeDefined()
    expect(KINDS.seedDistribution).toBeDefined()
    expect(KINDS.memberUpdate).toBeDefined()
    expect(KINDS.reseed).toBeDefined()
    expect(KINDS.wordUsed).toBeDefined()
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
    expect(event.tags).toContainEqual(['g', GROUP_D])
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

describe('buildDuressAlertEvent', () => {
  it('builds event with correct kind, g tag, p tag, and t tag', () => {
    const event = buildDuressAlertEvent({
      groupId: GROUP_D,
      memberPubkey: ALICE,
      encryptedContent: '<encrypted-alert>',
    })
    expect(event.kind).toBe(KINDS.wordUsed)
    expect(event.content).toBe('<encrypted-alert>')
    expect(event.tags).toContainEqual(['g', GROUP_D])
    expect(event.tags).toContainEqual(['p', ALICE])
    expect(event.tags).toContainEqual(['t', 'duress'])
  })
})
