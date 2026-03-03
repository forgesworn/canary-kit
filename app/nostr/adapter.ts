// app/nostr/adapter.ts — Nostr implementation of SyncTransport

import type { SyncTransport, SyncMessage, EventSigner } from 'canary-kit/sync'
import { encodeSyncMessage, decodeSyncMessage } from 'canary-kit/sync'
import { KINDS } from 'canary-kit/nostr'
import { getPool, isConnected, connectRelays } from './connect.js'

/** Map sync message types to Nostr event kinds. */
function messageToKind(type: SyncMessage['type']): number {
  switch (type) {
    case 'member-join':
    case 'member-leave':
      return KINDS.memberUpdate
    case 'counter-advance':
      return KINDS.wordUsed
    case 'reseed':
      return KINDS.reseed
    case 'beacon':
    case 'duress-alert':
      return KINDS.beacon
  }
}

/** All kinds we subscribe to for group sync. */
const SUBSCRIBE_KINDS = [
  KINDS.memberUpdate,
  KINDS.wordUsed,
  KINDS.reseed,
  KINDS.beacon,
]

export class NostrSyncTransport implements SyncTransport {
  private subs = new Map<string, { close(): void }>()

  constructor(
    private relays: string[],
    private signer: EventSigner,
  ) {}

  async send(groupId: string, message: SyncMessage, recipients: string[]): Promise<void> {
    if (!isConnected()) await connectRelays(this.relays)
    const pool = getPool()
    if (!pool) return

    const payload = encodeSyncMessage(message)
    const kind = messageToKind(message.type)
    const created_at = Math.floor(Date.now() / 1000)

    // Encrypt for each recipient and publish individual events
    for (const recipientPubkey of recipients) {
      if (recipientPubkey === this.signer.pubkey) continue // don't send to self

      const encrypted = await this.signer.encrypt(payload, recipientPubkey)

      const tags: string[][] = [
        ['p', recipientPubkey],
        ['e', groupId],
      ]

      const unsigned = { kind, content: encrypted, tags, created_at }
      const signed = await this.signer.sign(unsigned)
      await pool.publish(this.relays, signed)
    }
  }

  subscribe(groupId: string, onMessage: (msg: SyncMessage, sender: string) => void): () => void {
    const pool = getPool()
    if (!pool) return () => {}

    const sub = pool.subscribeMany(
      this.relays,
      [
        {
          kinds: SUBSCRIBE_KINDS,
          '#e': [groupId],
          since: Math.floor(Date.now() / 1000) - 3600, // last hour on connect
        },
      ],
      {
        onevent: async (event: any) => {
          try {
            const sender = event.pubkey
            if (sender === this.signer.pubkey) return // ignore own events

            const decrypted = await this.signer.decrypt(event.content, sender)
            const msg = decodeSyncMessage(decrypted)
            onMessage(msg, sender)
          } catch (err) {
            console.warn('[canary:sync] Failed to process event:', err)
          }
        },
      },
    )

    this.subs.set(groupId, sub)
    return () => {
      sub.close()
      this.subs.delete(groupId)
    }
  }

  disconnect(): void {
    for (const [, sub] of this.subs) {
      sub.close()
    }
    this.subs.clear()
  }
}
