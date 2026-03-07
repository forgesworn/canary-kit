// app/storage.test.ts — Regression tests for PIN-aware persistence logic

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ── Mock localStorage before importing storage module ─────────
const store = new Map<string, string>()

const localStorageMock = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { store.set(key, value) }),
  removeItem: vi.fn((key: string) => { store.delete(key) }),
  clear: vi.fn(() => { store.clear() }),
  get length() { return store.size },
  key: vi.fn((_i: number) => null),
}

vi.stubGlobal('localStorage', localStorageMock)

// ── Import after mock ────────────────────────────────────────
import { persistState, clearPinKey, getStoredPinSalt } from './storage.js'
import { loadState, getState } from './state.js'
import type { AppState } from './types.js'

// ── Helpers ──────────────────────────────────────────────────

function freshState(overrides: Partial<AppState> = {}): AppState {
  return {
    view: 'groups',
    groups: {
      'test-group': {
        seed: 'a'.repeat(64),
        counter: 1,
        usageOffset: 0,
        epoch: 1,
        wordCount: 2,
        rotationInterval: 604800,
        name: 'Test Group',
        groupId: 'test-group',
        createdAt: Date.now(),
        wordlist: 'en-v1',
        beaconInterval: 300,
        beaconPrecision: 6,
        encodingFormat: 'words',
        tolerance: 1,
        members: [],
        admins: [],
        relays: [],
        readRelays: [],
        writeRelays: [],
      },
    },
    activeGroupId: 'test-group',
    identity: null,
    settings: {
      theme: 'dark',
      pinEnabled: true,
      autoLockMinutes: 5,
      defaultRelays: [],
      defaultReadRelays: [],
      defaultWriteRelays: [],
    },
    ...overrides,
  }
}

// ── Tests ────────────────────────────────────────────────────

describe('persistState — clean-install PIN regression', () => {
  beforeEach(() => {
    store.clear()
    clearPinKey()
  })

  it('persists state on fresh install when pinEnabled=true but no salt exists', async () => {
    // Simulate a fresh install: pinEnabled=true (default), but no PIN has ever
    // been configured so no salt exists in localStorage.
    const state = freshState()
    loadState(state)

    // Confirm no salt exists (fresh install)
    expect(getStoredPinSalt()).toBeNull()

    await persistState()

    // State should have been written despite pinEnabled=true
    expect(localStorageMock.setItem).toHaveBeenCalled()
    const writtenGroups = store.get('canary:groups')
    expect(writtenGroups).toBeDefined()
    expect(JSON.parse(writtenGroups!)).toHaveProperty('test-group')
  })

  it('blocks persistence when PIN is configured (salt exists) but key not loaded', async () => {
    // Simulate: user has configured a PIN before, salt exists, but app is locked
    store.set('canary:pin-salt', 'some-base64-salt')
    const state = freshState()
    loadState(state)

    // Clear any calls from loadState
    localStorageMock.setItem.mockClear()

    await persistState()

    // State should NOT have been written — fail closed
    const groupsWritten = localStorageMock.setItem.mock.calls.some(
      ([key]) => key === 'canary:groups',
    )
    expect(groupsWritten).toBe(false)
  })

  it('persists state when pinEnabled=false regardless of salt', async () => {
    const state = freshState({
      settings: {
        theme: 'dark',
        pinEnabled: false,
        autoLockMinutes: 5,
        defaultRelays: [],
        defaultReadRelays: [],
        defaultWriteRelays: [],
      },
    })
    loadState(state)

    await persistState()

    const writtenGroups = store.get('canary:groups')
    expect(writtenGroups).toBeDefined()
    expect(JSON.parse(writtenGroups!)).toHaveProperty('test-group')
  })
})
