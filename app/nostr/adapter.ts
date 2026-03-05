// app/nostr/adapter.ts — Nostr implementation of SyncTransport (group key encryption)

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { encodeSyncMessage, decodeSyncMessage, hashGroupTag, encryptEnvelope, decryptEnvelope, deriveGroupKey, canonicaliseSyncMessage, PROTOCOL_VERSION } from 'canary-kit/sync'
import { bytesToHex, hexToBytes, sha256 } from 'canary-kit/crypto'
import { schnorr } from '@noble/curves/secp256k1.js'
import { getPool, isConnected, connectRelays } from './connect.js'
import { verifyEvent } from 'nostr-tools/pure'

/** Single event kind for all CANARY-SYNC messages (type is inside encrypted payload). */
const SYNC_EVENT_KIND = 29_111
const HEX_64_RE = /^[0-9a-f]{64}$/
const HEX_128_RE = /^[0-9a-f]{128}$/
const ENCODER = new TextEncoder()

interface EventSignerLike {
  pubkey: string
  sign(event: unknown): Promise<unknown>
}

/** Bounded set that evicts oldest entries when capacity is reached. */
class BoundedSet<T> {
  private items: T[] = []
  constructor(private capacity: number) {}
  has(item: T): boolean { return this.items.includes(item) }
  add(item: T): void {
    if (this.has(item)) return
    if (this.items.length >= this.capacity) this.items.shift()
    this.items.push(item)
  }
}

export class NostrSyncTransport implements SyncTransport {
  private subs = new Map<string, { close(): void }>()
  private groupKeys = new Map<string, { key: Uint8Array; signer: EventSignerLike; tagHash: string; members: Set<string> }>()
  private seenEventIds = new BoundedSet<string>(1000)

  constructor(
    private relays: string[],
    private personalPubkey: string,
    private personalPrivkey: string,
  ) {}

  /** Register a group's seed so we can encrypt/decrypt and sign for it. */
  registerGroup(groupId: string, seedHex: string, signer: EventSignerLike, members: string[]): void {
    this.groupKeys.set(groupId, {
      key: deriveGroupKey(seedHex),
      signer,
      tagHash: hashGroupTag(groupId),
      members: new Set(members),
    })
  }

  /** Unregister a group (e.g. after removal or reseed). */
  unregisterGroup(groupId: string): void {
    this.groupKeys.delete(groupId)
  }

  async send(groupId: string, message: SyncMessage, _recipients?: string[]): Promise<void> {
    if (!isConnected()) connectRelays(this.relays)
    const pool = getPool()
    if (!pool) return

    const groupInfo = this.groupKeys.get(groupId)
    if (!groupInfo) {
      console.warn('[canary:sync] No group key registered for', groupId)
      return
    }

    // encodeSyncMessage injects PROTOCOL_VERSION and returns wire JSON
    const payload = encodeSyncMessage(message)
    // Canonicalise a versioned copy for signing (must match what decode+canonicalise produces on receive)
    const versioned = { ...message, protocolVersion: PROTOCOL_VERSION }
    const canonical = canonicaliseSyncMessage(versioned)
    const payloadHash = sha256(ENCODER.encode(canonical))
    const innerSig = bytesToHex(schnorr.sign(payloadHash, hexToBytes(this.personalPrivkey)))
    const envelope = JSON.stringify({ s: this.personalPubkey, sig: innerSig, p: payload })
    const encrypted = await encryptEnvelope(groupInfo.key, envelope)

    const unsigned = {
      kind: SYNC_EVENT_KIND,
      content: encrypted,
      tags: [['d', groupInfo.tagHash]],
      created_at: Math.floor(Date.now() / 1000),
    }

    try {
      const signed = await groupInfo.signer.sign(unsigned)
      await pool.publish(this.relays, signed as any)
    } catch (err) {
      console.error('[canary:sync] Publish failed:', err)
    }
  }

  subscribe(groupId: string, onMessage: (msg: SyncMessage, sender: string) => void): () => void {
    const pool = getPool()
    if (!pool) return () => {}

    const groupInfo = this.groupKeys.get(groupId)
    if (!groupInfo) {
      console.warn('[canary:sync] No group key registered for', groupId)
      return () => {}
    }

    const filter = {
      kinds: [SYNC_EVENT_KIND],
      '#d': [groupInfo.tagHash],
      // 7-day window covers the default rotation interval and typical offline periods.
      // Privileged ops use epoch+opId for ordering, so receiving stale messages is safe
      // (they're idempotent or rejected by epoch/opId checks).
      since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60,
    }

    const sub = pool.subscribeMany(
      this.relays,
      filter,
      {
        onevent: async (event: any) => {
          try {
            if (!event || typeof event !== 'object') return
            if (typeof event.pubkey !== 'string' || typeof event.content !== 'string') return

            // Skip our own events
            if (event.pubkey === groupInfo.signer.pubkey) return

            // Verify relay event signature before trusting event.pubkey.
            if (!verifyEvent(event)) {
              console.warn('[canary:sync] Rejected event with invalid signature')
              return
            }

            // Dedup: skip events we've already processed (e.g. on reconnect within the since window).
            // IMPORTANT: this check is placed AFTER signature verification to prevent a
            // malicious relay from poisoning the cache with forged event IDs.
            // The add() is deferred until after successful processing so that
            // transient failures (e.g. key-rotation timing) don't permanently
            // suppress the event on relay replay.
            if (typeof event.id === 'string' && this.seenEventIds.has(event.id)) return

            // Decrypt and verify authenticated inner envelope.
            // Format: { s: personalPubkey, sig: schnorr(sig over payload), p: syncPayload }
            const decrypted = await decryptEnvelope(groupInfo.key, event.content)
            const parsed = JSON.parse(decrypted) as unknown
            if (!parsed || typeof parsed !== 'object') {
              console.warn('[canary:sync] Rejected malformed envelope')
              return
            }

            const sender = (parsed as Record<string, unknown>).s
            const sig = (parsed as Record<string, unknown>).sig
            const payload = (parsed as Record<string, unknown>).p
            if (typeof sender !== 'string' || typeof sig !== 'string' || typeof payload !== 'string') {
              console.warn('[canary:sync] Rejected envelope with missing sender proof fields')
              return
            }
            if (!HEX_64_RE.test(sender) || !HEX_128_RE.test(sig)) {
              console.warn('[canary:sync] Rejected envelope with invalid sender proof encoding')
              return
            }

            const msg = decodeSyncMessage(payload)
            const canonical = canonicaliseSyncMessage(msg)
            const payloadHash = sha256(ENCODER.encode(canonical))
            const isValidInnerSig = schnorr.verify(hexToBytes(sig), payloadHash, hexToBytes(sender))
            if (!isValidInnerSig) {
              console.warn('[canary:sync] Rejected envelope with invalid sender proof')
              return
            }

            // Enforce sender membership using personal identity key (inside envelope).
            // member-join is exempt: new members who can decrypt the group envelope
            // (proving they received a valid invite with the group key) are allowed
            // to announce themselves before existing members know about them.
            if (msg.type !== 'member-join' && !groupInfo.members.has(sender)) {
              console.warn('[canary:sync] Rejected message from non-member pubkey')
              return
            }

            // Liveness check-ins must be self-authored.
            if (msg.type === 'liveness-checkin' && msg.pubkey !== sender) {
              console.warn('[canary:sync] Rejected liveness-checkin with mismatched sender')
              return
            }

            onMessage(msg, sender)

            // Mark event as seen only after successful processing to avoid
            // permanently suppressing events that hit transient failures.
            if (typeof event.id === 'string') this.seenEventIds.add(event.id)
          } catch (err) {
            console.warn('[canary:sync] Failed to process event:', err)
          }
        },
      },
    )

    this.subs.set(groupId, sub)
    return () => { sub.close(); this.subs.delete(groupId) }
  }

  disconnect(): void {
    for (const [, sub] of this.subs) sub.close()
    this.subs.clear()
  }
}
