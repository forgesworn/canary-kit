// Invite session state manager tests

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock state (hoisted — no external references allowed) ───────

const ADMIN_PRIVKEY = '0000000000000000000000000000000000000000000000000000000000000001'
const ADMIN_PUBKEY = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'

vi.mock('./state.js', () => {
  const state = {
    identity: {
      pubkey: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
      privkey: '0000000000000000000000000000000000000000000000000000000000000001',
      signerType: 'local' as const,
    },
    groups: {},
    activeGroupId: null,
    settings: {
      theme: 'dark' as const,
      pinEnabled: false,
      autoLockMinutes: 0,
      defaultRelays: [],
    },
    view: 'groups' as const,
  }
  return {
    getState: () => state,
    update: (partial: Record<string, unknown>) => Object.assign(state, partial),
    updateGroup: vi.fn(),
    subscribe: vi.fn(),
  }
})

import type { AppGroup } from './types.js'
import {
  startInviteSession,
  rotateInviteSession,
  getInviteSession,
  endInviteSession,
} from './invite.js'

// ── Helpers ─────────────────────────────────────────────────────

function makeGroup(overrides: Partial<AppGroup> = {}): AppGroup {
  return {
    id: 'test-group-1',
    name: 'Test Group',
    seed: 'b'.repeat(64),
    members: [ADMIN_PUBKEY],
    admins: [ADMIN_PUBKEY],
    rotationInterval: 604800,
    wordCount: 1,
    wordlist: 'en-v1',
    counter: 100,
    usageOffset: 0,
    createdAt: 1700000000,
    tolerance: 1,
    beaconInterval: 300,
    beaconPrecision: 6,
    epoch: 0,
    consumedOps: [],
    nostrEnabled: false,
    relays: ['wss://relay.example.com'],
    encodingFormat: 'words',
    usedInvites: [],
    latestInviteIssuedAt: 0,
    livenessInterval: 86400,
    livenessCheckins: {},
    ...overrides,
  }
}

// ── Tests ───────────────────────────────────────────────────────

describe('Invite Session', () => {
  beforeEach(() => {
    endInviteSession()
  })

  it('getInviteSession returns null initially', () => {
    expect(getInviteSession()).toBeNull()
  })

  it('startInviteSession returns a session with all fields populated', () => {
    const group = makeGroup()
    const session = startInviteSession(group)

    expect(session.groupId).toBe('test-group-1')
    expect(session.payload).toBeTruthy()
    expect(typeof session.payload).toBe('string')
    expect(session.confirmCode).toBeTruthy()
    expect(typeof session.confirmCode).toBe('string')
    expect(session.nonce).toMatch(/^[0-9a-f]{32}$/)
    expect(session.joinCount).toBe(0)
  })

  it('startInviteSession sets the active session', () => {
    const group = makeGroup()
    const session = startInviteSession(group)
    expect(getInviteSession()).toBe(session)
  })

  it('rotateInviteSession generates a different nonce and payload', () => {
    const group = makeGroup()
    const first = startInviteSession(group)
    const firstNonce = first.nonce
    const firstPayload = first.payload

    const rotated = rotateInviteSession(group)
    expect(rotated).not.toBeNull()
    expect(rotated!.nonce).not.toBe(firstNonce)
    expect(rotated!.payload).not.toBe(firstPayload)
  })

  it('rotateInviteSession increments joinCount', () => {
    const group = makeGroup()
    startInviteSession(group)

    const r1 = rotateInviteSession(group)!
    expect(r1.joinCount).toBe(1)

    const r2 = rotateInviteSession(group)!
    expect(r2.joinCount).toBe(2)
  })

  it('rotateInviteSession returns null if no session is active', () => {
    const group = makeGroup()
    expect(rotateInviteSession(group)).toBeNull()
  })

  it('rotateInviteSession returns null for wrong groupId', () => {
    const group = makeGroup()
    startInviteSession(group)

    const otherGroup = makeGroup({ id: 'other-group' })
    expect(rotateInviteSession(otherGroup)).toBeNull()
  })

  it('endInviteSession clears the session', () => {
    const group = makeGroup()
    startInviteSession(group)
    expect(getInviteSession()).not.toBeNull()

    endInviteSession()
    expect(getInviteSession()).toBeNull()
  })
})
