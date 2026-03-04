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
  /** Personal pubkey bound inside every encrypted envelope for sender identity. */
  private personalPubkey: string

  constructor(
    private relays: string[],
    personalPubkey: string,
  ) {
    this.personalPubkey = personalPubkey
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

    // Bind sender identity inside the encrypted envelope: { s: personalPubkey, p: syncPayload }
    const envelope = JSON.stringify({ s: this.personalPubkey, p: encodeSyncMessage(message) })
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
            // Envelope format: AES-256-GCM({ s: personalPubkey, p: syncPayload })
            const decrypted = await decryptEnvelope(groupInfo.key, event.content)
            const parsed = JSON.parse(decrypted)
            if (typeof parsed?.s !== 'string' || typeof parsed?.p !== 'string') {
              console.warn('[canary:sync] Rejected envelope without sender binding')
              return
            }

            const msg = decodeSyncMessage(parsed.p)
            onMessage(msg, parsed.s)
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
