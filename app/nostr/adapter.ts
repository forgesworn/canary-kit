// app/nostr/adapter.ts — Nostr implementation of SyncTransport (group key encryption)

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { encodeSyncMessage, decodeSyncMessage, hashGroupTag, encryptEnvelope, decryptEnvelope, deriveGroupKey } from 'canary-kit/sync'
import { getPool, isConnected, connectRelays } from './connect.js'
import type { GroupSigner } from './signer.js'

/** Single event kind for all CANARY-SYNC messages (type is inside encrypted payload). */
const SYNC_EVENT_KIND = 29_111

export class NostrSyncTransport implements SyncTransport {
  private subs = new Map<string, { close(): void }>()
  private groupKeys = new Map<string, { key: Uint8Array; signer: GroupSigner; tagHash: string }>()
  /** Personal pubkey used for sender identity binding inside encrypted envelopes. */
  private personalPubkey: string | null = null

  constructor(
    private relays: string[],
  ) {}

  /** Set the personal identity pubkey used for sender binding. */
  setPersonalPubkey(pubkey: string): void {
    this.personalPubkey = pubkey
  }

  /** Register a group's seed so we can encrypt/decrypt and sign for it. */
  registerGroup(groupId: string, seedHex: string, signer: GroupSigner): void {
    this.groupKeys.set(groupId, {
      key: deriveGroupKey(seedHex),
      signer,
      tagHash: hashGroupTag(groupId),
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

    const innerPayload = encodeSyncMessage(message)
    // Bind sender identity inside the encrypted envelope so receivers know
    // which personal pubkey sent this message. The "s" field is the sender's
    // personal pubkey; "p" is the original sync payload.
    const envelope = this.personalPubkey
      ? JSON.stringify({ s: this.personalPubkey, p: innerPayload })
      : innerPayload
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
      since: Math.floor(Date.now() / 1000) - 3600,
    }

    const sub = pool.subscribeMany(
      this.relays,
      filter,
      {
        onevent: async (event: any) => {
          try {
            // Skip our own events
            if (event.pubkey === groupInfo.signer.pubkey) return

            // Decrypt and extract sender identity binding.
            // The envelope is AES-256-GCM under the group key — only seed holders
            // can encrypt or decrypt. Inside the envelope, the sender's personal
            // pubkey is bound via the "s" field, allowing membership verification.
            const decrypted = await decryptEnvelope(groupInfo.key, event.content)

            let senderPubkey = event.pubkey // fallback to Nostr event pubkey
            let innerPayload = decrypted

            // Parse sender-bound envelope: { s: personalPubkey, p: syncPayload }
            try {
              const parsed = JSON.parse(decrypted)
              if (parsed && typeof parsed.s === 'string' && typeof parsed.p === 'string') {
                senderPubkey = parsed.s
                innerPayload = parsed.p
              }
            } catch {
              // Legacy format (no sender binding) — use as-is
            }

            const msg = decodeSyncMessage(innerPayload)
            onMessage(msg, senderPubkey)
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
