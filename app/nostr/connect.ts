// app/nostr/connect.ts — Manages relay pool using nostr-tools

import { SimplePool } from 'nostr-tools/pool'

let _pool: SimplePool | null = null
let _connected = false
let _relayCount = 0
let _relayUrls: string[] = []

// ── Pool management ────────────────────────────────────────────

/**
 * Connect to the given relay URLs using a SimplePool.
 * Idempotent: if already connected, closes the old pool first.
 */
export function connectRelays(relayUrls: string[]): void {
  if (_pool) {
    _pool.close(_relayUrls)
    _pool = null
    _connected = false
    _relayCount = 0
    _relayUrls = []
  }

  if (relayUrls.length === 0) return

  _pool = new SimplePool()
  _connected = true
  _relayCount = relayUrls.length
  _relayUrls = [...relayUrls]
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
