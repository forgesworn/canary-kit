// App-layer fire-and-forget guard tests — freshness, future-skew, and opId dedup.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FIRE_AND_FORGET_FRESHNESS_SEC } from 'canary-kit/sync'
import type { SyncMessage } from 'canary-kit/sync'

// Mock recordCheckin before importing sync module
const mockRecordCheckin = vi.fn()
vi.mock('./components/liveness.js', () => ({
  recordCheckin: (...args: unknown[]) => mockRecordCheckin(...args),
  startLivenessHeartbeat: vi.fn(),
  stopLivenessHeartbeat: vi.fn(),
}))

// Stub remaining app imports that sync.ts pulls in
vi.mock('./state.js', () => ({
  getState: () => ({ groups: {}, identity: null }),
  updateGroup: vi.fn(),
}))
vi.mock('./nostr/connect.js', () => ({
  connectRelays: vi.fn(),
  isConnected: () => false,
  getRelayCount: () => 0,
}))
vi.mock('./nostr/signer.js', () => ({ GroupSigner: vi.fn() }))
vi.mock('./nostr/adapter.js', () => ({ NostrSyncTransport: vi.fn() }))
vi.mock('./components/header.js', () => ({
  updateRelayStatus: vi.fn(),
  flashSyncing: vi.fn(),
}))
vi.mock('./components/toast.js', () => ({ showToast: vi.fn() }))

import { handleFireAndForget, _resetSeenOpIds } from './sync.js'

const GROUP = 'test-group'
const SENDER = 'a'.repeat(64)

beforeEach(() => {
  mockRecordCheckin.mockClear()
  _resetSeenOpIds()
})

// ── Liveness check-in guards ────────────────────────────────────

describe('liveness-checkin freshness guards', () => {
  it('stale liveness-checkin does not call recordCheckin', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: SENDER,
      timestamp: nowSec - FIRE_AND_FORGET_FRESHNESS_SEC - 1,
      opId: 'stale-liveness',
    }
    handleFireAndForget(GROUP, msg, SENDER, nowSec)
    expect(mockRecordCheckin).not.toHaveBeenCalled()
  })

  it('future-skewed liveness-checkin does not call recordCheckin', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: SENDER,
      timestamp: nowSec + 61,
      opId: 'future-liveness',
    }
    handleFireAndForget(GROUP, msg, SENDER, nowSec)
    expect(mockRecordCheckin).not.toHaveBeenCalled()
  })

  it('fresh liveness-checkin calls recordCheckin', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: SENDER,
      timestamp: nowSec - 60,
      opId: 'fresh-liveness',
    }
    handleFireAndForget(GROUP, msg, SENDER, nowSec)
    expect(mockRecordCheckin).toHaveBeenCalledWith(GROUP, SENDER, msg.timestamp)
  })

  it('liveness-checkin with missing sender does not call recordCheckin', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'liveness-checkin',
      pubkey: SENDER,
      timestamp: nowSec - 10,
      opId: 'no-sender-liveness',
    }
    handleFireAndForget(GROUP, msg, undefined, nowSec)
    expect(mockRecordCheckin).not.toHaveBeenCalled()
  })
})

// ── Beacon/duress opId dedup guards ─────────────────────────────

describe('beacon/duress opId dedup guards', () => {
  const mockDispatch = vi.fn()

  beforeEach(() => {
    mockDispatch.mockClear()
  })

  it('duplicate beacon opId does not dispatch canary:sync-message', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'beacon',
      lat: 51.5,
      lon: -0.1,
      accuracy: 100,
      timestamp: nowSec - 10,
      opId: 'beacon-dedup',
    }

    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).toHaveBeenCalledTimes(1)

    // Replay same opId — should be suppressed
    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })

  it('fresh unseen duress-alert dispatches once, second replay is suppressed', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'duress-alert',
      lat: 51.5,
      lon: -0.1,
      timestamp: nowSec - 5,
      opId: 'duress-dedup',
    }

    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(GROUP, msg, SENDER)

    // Replay — suppressed
    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })

  it('stale beacon does not dispatch', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'beacon',
      lat: 51.5,
      lon: -0.1,
      accuracy: 100,
      timestamp: nowSec - FIRE_AND_FORGET_FRESHNESS_SEC - 1,
      opId: 'stale-beacon',
    }
    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('future-skewed duress-alert does not dispatch', () => {
    const nowSec = 1700000000
    const msg: SyncMessage = {
      type: 'duress-alert',
      lat: 51.5,
      lon: -0.1,
      timestamp: nowSec + 61,
      opId: 'future-duress',
    }
    handleFireAndForget(GROUP, msg, SENDER, nowSec, mockDispatch)
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
