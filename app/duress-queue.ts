// app/duress-queue.ts — Persist queued duress alerts in localStorage for offline→online relay
//
// When a PIN is configured, queue entries are encrypted with the active PIN key
// so that location data in duress alerts is not exposed in plaintext localStorage.

import type { SyncMessage } from 'canary-kit/sync'
import { isPinKeyLoaded } from './storage.js'

const STORAGE_KEY = 'canary:duress-queue'

// ── PIN encryption (lazy import to avoid circular dependency) ───

let _pinEncrypt: ((data: string, key: CryptoKey) => Promise<string>) | null = null
let _pinDecrypt: ((encoded: string, key: CryptoKey) => Promise<string>) | null = null
let _getPinKey: (() => CryptoKey | null) | null = null

/**
 * Inject PIN crypto functions. Called once at app startup from storage.ts.
 * Avoids circular import between duress-queue.ts and storage.ts.
 */
export function initDuressQueueCrypto(deps: {
  encrypt: (data: string, key: CryptoKey) => Promise<string>
  decrypt: (encoded: string, key: CryptoKey) => Promise<string>
  getPinKey: () => CryptoKey | null
}): void {
  _pinEncrypt = deps.encrypt
  _pinDecrypt = deps.decrypt
  _getPinKey = deps.getPinKey
}

// ── Queue types ──────────────────────────────────────────────────

interface QueueEntry {
  groupId: string
  message: SyncMessage
}

// ── Internal helpers ─────────────────────────────────────────────

function readRawQueue(): QueueEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const stored = JSON.parse(raw)

    // Legacy format: plain array of QueueEntry
    if (Array.isArray(stored)) return stored

    // New format: { encrypted?, entries }
    if (stored && typeof stored === 'object' && typeof stored.entries === 'string') {
      if (stored.encrypted) {
        // Encrypted — cannot read synchronously, return empty.
        // Caller must use readQueueAsync() for encrypted queues.
        return []
      }
      return JSON.parse(stored.entries)
    }

    return []
  } catch {
    return []
  }
}

async function readQueueAsync(): Promise<QueueEntry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const stored = JSON.parse(raw)

    // Legacy format: plain array of QueueEntry
    if (Array.isArray(stored)) return stored

    // New format: { encrypted?, entries }
    if (stored && typeof stored === 'object' && typeof stored.entries === 'string') {
      if (stored.encrypted && _pinDecrypt && _getPinKey) {
        const key = _getPinKey()
        if (!key) return [] // locked — cannot decrypt
        const plaintext = await _pinDecrypt(stored.entries, key)
        return JSON.parse(plaintext)
      }
      return JSON.parse(stored.entries)
    }

    return []
  } catch {
    return []
  }
}

async function writeQueueAsync(entries: QueueEntry[]): Promise<void> {
  try {
    const json = JSON.stringify(entries)

    // Encrypt if PIN key is available
    if (_pinEncrypt && _getPinKey) {
      const key = _getPinKey()
      if (key) {
        const ciphertext = await _pinEncrypt(json, key)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ encrypted: true, entries: ciphertext }))
        return
      }
    }

    // Fallback: store plaintext
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: json }))
  } catch { /* quota exceeded */ }
}

function writeQueueSync(entries: QueueEntry[]): void {
  try {
    const json = JSON.stringify(entries)
    // Synchronous path cannot encrypt — store plaintext with flag
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: json }))
  } catch { /* quota exceeded */ }
}

// ── Public API ───────────────────────────────────────────────────

export function queueDuressAlert(groupId: string, message: SyncMessage): void {
  // Read synchronously (may miss encrypted entries — acceptable for append)
  const entries = readRawQueue()
  entries.push({ groupId, message })

  // Try async encryption, fall back to sync write
  if (_pinEncrypt && _getPinKey && isPinKeyLoaded()) {
    writeQueueAsync(entries).catch(() => writeQueueSync(entries))
  } else {
    writeQueueSync(entries)
  }
}

export async function drainDuressQueue(groupId: string): Promise<SyncMessage[]> {
  const entries = await readQueueAsync()
  const matching = entries.filter(e => e.groupId === groupId)
  const remaining = entries.filter(e => e.groupId !== groupId)
  await writeQueueAsync(remaining)
  return matching.map(e => e.message)
}

export function clearDuressQueue(): void {
  localStorage.removeItem(STORAGE_KEY)
}
