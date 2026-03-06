/**
 * Canary Nostr event kinds (NIP-CANARY).
 *
 * - group + memberUpdate: parameterised replaceable (30000–39999)
 * - seedDistribution, reseed, wordUsed: ephemeral (20000–29999)
 * - beacon: ephemeral (20000–29999)
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

const HEX_64_RE = /^[0-9a-f]{64}$/

function validatePubkey(pubkey: string, label: string): void {
  if (!HEX_64_RE.test(pubkey)) {
    throw new Error(`Invalid ${label}: expected 64 lowercase hex characters, got "${pubkey.length > 80 ? pubkey.slice(0, 20) + '…' : pubkey}"`)
  }
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
  for (const m of params.members) validatePubkey(m, 'member pubkey')
  const tags: string[][] = [
    ['d', params.groupId],
    ['name', params.name],
    ...params.members.map((m) => ['p', m]),
    ['rotation', String(params.rotationInterval)],
    ['words', String(params.wordCount)],
    ['wordlist', params.wordlist],
  ]
  if (params.expiration !== undefined) {
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
  validatePubkey(params.recipientPubkey, 'recipientPubkey')
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
  validatePubkey(params.memberPubkey, 'memberPubkey')
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

// ---------------------------------------------------------------------------
// Encrypted payload types (plaintext structures before NIP-44 encryption)
// ---------------------------------------------------------------------------

/** Plaintext payload for kind 28800 (seed distribution). */
export interface SeedDistributionPayload {
  seed: string
  groupId: string
}

/** Plaintext payload for kind 28801 (reseed notification). */
export interface ReseedPayload {
  seed: string
  reason: 'member_removed' | 'compromise' | 'scheduled' | 'duress'
}

/** Plaintext payload for kind 28802 (word used / burn-after-use). */
export interface WordUsedPayload {
  new_counter: number
  used_by: string
  duress: boolean
}

export function buildBeaconEvent(params: BeaconEventParams): UnsignedEvent {
  const tags: string[][] = [['h', params.groupId]]
  if (params.expiration !== undefined) {
    tags.push(['expiration', String(params.expiration)])
  }
  return { kind: KINDS.beacon, content: params.encryptedContent, tags, created_at: now() }
}
