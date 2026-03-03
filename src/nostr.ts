/**
 * Canary Nostr event kinds.
 *
 * Placeholder values — exact kind numbers will be allocated when the NIP
 * is submitted. Using 38800–38804 range as a proposal.
 *
 * - group + memberUpdate: replaceable (30000–39999)
 * - seedDistribution, reseed, wordUsed: ephemeral (20000–29999)
 */
export const KINDS = {
  group: 38_800,
  seedDistribution: 28_800,
  memberUpdate: 38_801,
  reseed: 28_801,
  wordUsed: 28_802,
  beacon: 20_800,
} as const

/** Unsigned Nostr event (consumer signs with their own library). */
export interface UnsignedEvent {
  kind: number
  content: string
  tags: string[][]
  created_at: number
}

function now(): number {
  return Math.floor(Date.now() / 1000)
}

export interface GroupEventParams {
  groupId: string
  name: string
  members: string[]
  rotationInterval: number
  wordCount: 1 | 2 | 3
  wordlist: string
  encryptedContent: string
  expiration?: number
}

export function buildGroupEvent(params: GroupEventParams): UnsignedEvent {
  const tags: string[][] = [
    ['d', params.groupId],
    ['name', params.name],
    ...params.members.map((m) => ['p', m]),
    ['rotation', String(params.rotationInterval)],
    ['words', String(params.wordCount)],
    ['wordlist', params.wordlist],
  ]
  if (params.expiration) {
    tags.push(['expiration', String(params.expiration)])
  }
  return { kind: KINDS.group, content: params.encryptedContent, tags, created_at: now() }
}

export interface SeedDistributionParams {
  recipientPubkey: string
  groupEventId: string
  encryptedContent: string
}

export function buildSeedDistributionEvent(params: SeedDistributionParams): UnsignedEvent {
  return {
    kind: KINDS.seedDistribution,
    content: params.encryptedContent,
    tags: [
      ['p', params.recipientPubkey],
      ['e', params.groupEventId],
    ],
    created_at: now(),
  }
}

export interface MemberUpdateParams {
  groupId: string
  action: 'add' | 'remove'
  memberPubkey: string
  reseed: boolean
  encryptedContent: string
}

export function buildMemberUpdateEvent(params: MemberUpdateParams): UnsignedEvent {
  return {
    kind: KINDS.memberUpdate,
    content: params.encryptedContent,
    tags: [
      ['d', params.groupId],
      ['action', params.action],
      ['p', params.memberPubkey],
      ['reseed', String(params.reseed)],
    ],
    created_at: now(),
  }
}

export interface ReseedParams {
  groupEventId: string
  reason: 'member_removed' | 'compromise' | 'scheduled' | 'duress'
  encryptedContent: string
}

export function buildReseedEvent(params: ReseedParams): UnsignedEvent {
  return {
    kind: KINDS.reseed,
    content: params.encryptedContent,
    tags: [
      ['e', params.groupEventId],
      ['reason', params.reason],
    ],
    created_at: now(),
  }
}

export interface WordUsedParams {
  groupEventId: string
  encryptedContent: string
}

export function buildWordUsedEvent(params: WordUsedParams): UnsignedEvent {
  return {
    kind: KINDS.wordUsed,
    content: params.encryptedContent,
    tags: [['e', params.groupEventId]],
    created_at: now(),
  }
}

export interface BeaconEventParams {
  groupId: string
  encryptedContent: string
  expiration?: number
}

export function buildBeaconEvent(params: BeaconEventParams): UnsignedEvent {
  const tags: string[][] = [['g', params.groupId]]
  if (params.expiration) {
    tags.push(['expiration', String(params.expiration)])
  }
  return { kind: KINDS.beacon, content: params.encryptedContent, tags, created_at: now() }
}

export interface DuressAlertEventParams {
  groupId: string
  memberPubkey: string
  encryptedContent: string
}

export function buildDuressAlertEvent(params: DuressAlertEventParams): UnsignedEvent {
  return {
    kind: KINDS.wordUsed,
    content: params.encryptedContent,
    tags: [
      ['g', params.groupId],
      ['p', params.memberPubkey],
      ['t', 'duress'],
    ],
    created_at: now(),
  }
}
