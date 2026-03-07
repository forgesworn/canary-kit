// app/nostr/connect.ts — Manages relay pool using nostr-tools

import { SimplePool } from 'nostr-tools/pool'

let _pool: SimplePool | null = null
let _connected = false
let _relayCount = 0
let _relayUrls: string[] = []

// ── Pool management ────────────────────────────────────────────

/** Promise that resolves once the current connection attempt completes. */
let _connectPromise: Promise<void> = Promise.resolve()

/**
 * Connect to the given relay URLs using a SimplePool.
 * Idempotent: if already connected to the same relay set, returns immediately.
 * Closes the old pool when relay URLs change.
 */
export function connectRelays(relayUrls: string[]): void {
  // Skip if already connected to the exact same relay set
  if (_pool && _relayUrls.length === relayUrls.length && relayUrls.every(u => _relayUrls.includes(u))) {
    return
  }

  if (_pool) {
    _pool.close(_relayUrls)
    _pool = null
    _connected = false
    _relayCount = 0
    _relayUrls = []
  }

  if (relayUrls.length === 0) return

  _pool = new SimplePool()
  _relayUrls = [...relayUrls]
  _relayCount = relayUrls.length
  // _connected stays false until verifyConnection() confirms a WebSocket opened
  _connected = false

  // Eagerly open connections so the pool is ready for publish/subscribe.
  // SimplePool.ensureRelay returns a connected Relay instance or throws.
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
  if (!_pool || _relayUrls.length === 0) return
  const pool = _pool
  const urls = _relayUrls

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
    _pool.close(_relayUrls)
  }
  _pool = null
  _connected = false
  _relayCount = 0
  _relayUrls = []
}

// ── Accessors ──────────────────────────────────────────────────

export function getPool(): SimplePool | null { return _pool }
export function isConnected(): boolean { return _connected }
export function getRelayCount(): number { return _relayCount }
export function getRelayUrls(): string[] { return [..._relayUrls] }
