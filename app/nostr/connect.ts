// app/nostr/connect.ts — Manages relay pool using nostr-tools
// Supports direction-aware relay management: read relays for subscriptions,
// write relays for publishing. All relays share a single SimplePool.

import { SimplePool } from 'nostr-tools/pool'

let _pool: SimplePool | null = null
let _connected = false
let _relayCount = 0
let _readRelayUrls: string[] = []
let _writeRelayUrls: string[] = []

/** All unique relay URLs (read + write combined). */
function _allUrls(): string[] {
  const set = new Set<string>([..._readRelayUrls, ..._writeRelayUrls])
  return Array.from(set)
}

// ── Pool management ────────────────────────────────────────────

/** Promise that resolves once the current connection attempt completes. */
let _connectPromise: Promise<void> = Promise.resolve()

/**
 * Connect to relay URLs using a SimplePool with read/write awareness.
 * readRelays are used for subscriptions; writeRelays are used for publishing.
 * The pool connects to all unique URLs from both sets.
 * Idempotent: if already connected to the same relay sets, returns immediately.
 * Closes the old pool when relay URLs change.
 */
export function connectRelays(readRelays: string[], writeRelays?: string[]): void {
  const newRead = [...readRelays]
  const newWrite = writeRelays ? [...writeRelays] : [...readRelays]

  // Skip if already connected to the exact same relay sets
  if (
    _pool &&
    newRead.length === _readRelayUrls.length && newRead.every(u => _readRelayUrls.includes(u)) &&
    newWrite.length === _writeRelayUrls.length && newWrite.every(u => _writeRelayUrls.includes(u))
  ) {
    return
  }

  if (_pool) {
    _pool.close(_allUrls())
    _pool = null
    _connected = false
    _relayCount = 0
    _readRelayUrls = []
    _writeRelayUrls = []
  }

  _readRelayUrls = newRead
  _writeRelayUrls = newWrite

  const allUrls = _allUrls()
  if (allUrls.length === 0) return

  _pool = new SimplePool()
  // _connected stays false until verifyConnection() confirms a WebSocket opened
  _connected = false

  // Eagerly open connections so the pool is ready for publish/subscribe.
  _connectPromise = verifyConnection()
}

/** Wait for the current relay connection attempt to complete. */
export function waitForConnection(): Promise<void> {
  return _connectPromise
}

/**
 * Attempt to connect to each relay and update _connected status.
 * Runs in the background — callers don't need to await.
 */
async function verifyConnection(): Promise<void> {
  if (!_pool) return
  const pool = _pool
  const urls = _allUrls()
  if (urls.length === 0) return

  let connectedCount = 0
  for (const url of urls) {
    try {
      await pool.ensureRelay(url, { connectionTimeout: 5000 })
      connectedCount++
    } catch (err) {
      console.warn(`[canary:relay] Failed to connect to ${url}:`, err)
    }
  }

  // Only update if pool hasn't been replaced while we were connecting
  if (_pool === pool) {
    _connected = connectedCount > 0
    _relayCount = connectedCount
    if (!_connected) {
      console.error('[canary:relay] Could not connect to any relay:', urls)
    } else {
      console.info(`[canary:relay] Connected to ${connectedCount}/${urls.length} relay(s)`)
    }
  }
}

/** Disconnect and destroy the relay pool. */
export function disconnectRelays(): void {
  if (_pool) {
    _pool.close(_allUrls())
  }
  _pool = null
  _connected = false
  _relayCount = 0
  _readRelayUrls = []
  _writeRelayUrls = []
}

// ── Accessors ──────────────────────────────────────────────────

export function getPool(): SimplePool | null { return _pool }
export function isConnected(): boolean { return _connected }
export function getRelayCount(): number { return _relayCount }

/** @deprecated Use getReadRelayUrls() / getWriteRelayUrls() instead. */
export function getRelayUrls(): string[] { return _allUrls() }

/** Relay URLs used for subscriptions (reading). */
export function getReadRelayUrls(): string[] { return [..._readRelayUrls] }

/** Relay URLs used for publishing (writing). */
export function getWriteRelayUrls(): string[] { return [..._writeRelayUrls] }
