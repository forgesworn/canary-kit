// app/nostr/adapter.ts — Nostr implementation of SyncTransport (group key encryption)

import type { SyncTransport, SyncMessage } from 'canary-kit/sync'
import { encodeSyncMessage, decodeSyncMessage, hashGroupTag, encryptEnvelope, decryptEnvelope, deriveGroupKey, canonicaliseSyncMessage, PROTOCOL_VERSION, STORED_MESSAGE_TYPES } from 'canary-kit/sync'
import { bytesToHex, hexToBytes, sha256 } from 'canary-kit/crypto'
import { schnorr } from '@noble/curves/secp256k1.js'
import { getPool, isConnected, connectRelays, getReadRelayUrls, getWriteRelayUrls } from './connect.js'
import { dedupeRelays } from '../types.js'
import { verifyEvent, finalizeEvent } from 'nostr-tools/pure'
import { encrypt as nip44Encrypt, decrypt as nip44Decrypt, getConversationKey } from 'nostr-tools/nip44'

/** Ephemeral kind for fire-and-forget messages (beacons, liveness). Not stored by relays. */
const SYNC_EPHEMERAL_KIND = 29_111
/** Stored kind for state mutations and safety-critical messages. Relays keep these for offline catch-up. */
const SYNC_STORED_KIND = 9_111
/** Event kind for recovery requests (NIP-44 personal-key encrypted). */
const RECOVERY_REQUEST_KIND = 29_112
/** Event kind for recovery responses (NIP-44 personal-key encrypted). */
const RECOVERY_RESPONSE_KIND = 29_113

const HEX_64_RE = /^[0-9a-f]{64}$/
const HEX_128_RE = /^[0-9a-f]{128}$/
const ENCODER = new TextEncoder()

/** Consecutive decrypt failures before auto-requesting recovery. */
const DECRYPT_FAIL_THRESHOLD = 3

/** How long a pending recovery request blocks retries (ms). */
const RECOVERY_PENDING_TIMEOUT_MS = 60_000

interface EventSignerLike {
  pubkey: string
  sign(event: unknown): Promise<unknown>
}

/** Options for group registration including recovery callbacks. */
export interface GroupRegistrationOptions {
  /** Admin pubkeys (personal identity keys) for sending recovery requests. */
  admins?: string[]
  /** Called (admin side) when a member requests state recovery. Return a snapshot or null to decline. */
  onRecoveryRequest?: (requesterPubkey: string, localEpoch: number, localCounter: number) => SyncMessage | null
  /** Called (requester side) when a recovery response arrives. */
  onRecoveryResponse?: (snapshot: SyncMessage, adminPubkey: string) => void
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

interface GroupInfo {
  key: Uint8Array
  signer: EventSignerLike
  tagHash: string
  members: Set<string>
  admins: Set<string>
  onRecoveryRequest?: (requesterPubkey: string, localEpoch: number, localCounter: number) => SyncMessage | null
  onRecoveryResponse?: (snapshot: SyncMessage, adminPubkey: string) => void
}

export class NostrSyncTransport implements SyncTransport {
  private subs = new Map<string, { close(): void }>()
  private groupKeys = new Map<string, GroupInfo>()
  private tagHashToGroupId = new Map<string, string>()
  private seenEventIds = new BoundedSet<string>(1000)
  private decryptFailures = new Map<string, number>()
  private recoveryPending = new Map<string, number>()
  private recoverySub: { close(): void } | null = null

  /** Read relays for subscriptions. */
  private readRelays: string[]
  /** Write relays for publishing. */
  private writeRelays: string[]

  constructor(
    readRelays: string[],
    writeRelays: string[],
    private personalPubkey: string,
    private personalPrivkey: string,
  ) {
    this.readRelays = dedupeRelays(readRelays)
    this.writeRelays = dedupeRelays(writeRelays)
  }

  /** Update the relay URLs used for publishing and subscribing. */
  updateRelays(readRelays: string[], writeRelays?: string[]): void {
    this.readRelays = dedupeRelays(readRelays)
    this.writeRelays = writeRelays ? dedupeRelays(writeRelays) : [...this.readRelays]
  }

  /** All unique relay URLs (read + write) for subscriptions that need full coverage. */
  private get allRelays(): string[] {
    return dedupeRelays([...this.readRelays, ...this.writeRelays])
  }

  /** Register a group's seed so we can encrypt/decrypt and sign for it. */
  registerGroup(groupId: string, seedHex: string, signer: EventSignerLike, members: string[], options?: GroupRegistrationOptions): void {
    const tagHash = hashGroupTag(groupId)
    console.info('[canary:sync] registerGroup', groupId.slice(0, 8), '→ tagHash', tagHash.slice(0, 12), 'members:', members.length)
    this.groupKeys.set(groupId, {
      key: deriveGroupKey(seedHex),
      signer,
      tagHash,
      members: new Set(members),
      admins: new Set(options?.admins ?? []),
      onRecoveryRequest: options?.onRecoveryRequest,
      onRecoveryResponse: options?.onRecoveryResponse,
    })
    this.tagHashToGroupId.set(tagHash, groupId)
  }

  /** Unregister a group (e.g. after removal or reseed). */
  unregisterGroup(groupId: string): void {
    const info = this.groupKeys.get(groupId)
    if (info) this.tagHashToGroupId.delete(info.tagHash)
    this.groupKeys.delete(groupId)
    this.decryptFailures.delete(groupId)
    this.recoveryPending.delete(groupId) // clear pending on unregister
  }

  async send(groupId: string, message: SyncMessage, _recipients?: string[]): Promise<void> {
    if (!isConnected()) connectRelays(this.readRelays, this.writeRelays)
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
    const versioned: SyncMessage = { ...message, protocolVersion: PROTOCOL_VERSION }
    const canonical = canonicaliseSyncMessage(versioned)
    const payloadHash = sha256(ENCODER.encode(canonical))
    const innerSig = bytesToHex(schnorr.sign(payloadHash, hexToBytes(this.personalPrivkey)))
    const envelope = JSON.stringify({ s: this.personalPubkey, sig: innerSig, p: payload })
    const encrypted = await encryptEnvelope(groupInfo.key, envelope)

    const kind = STORED_MESSAGE_TYPES.has(message.type) ? SYNC_STORED_KIND : SYNC_EPHEMERAL_KIND
    const tags: string[][] = [['d', groupInfo.tagHash]]
    // Stored events get NIP-40 expiration so relays clean them up after 7 days
    if (kind === SYNC_STORED_KIND) {
      tags.push(['expiration', String(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60)])
    }
    const unsigned = {
      kind,
      content: encrypted,
      tags,
      created_at: Math.floor(Date.now() / 1000),
    }

    try {
      const signed = await groupInfo.signer.sign(unsigned)
      console.info('[canary:sync] Publishing', message.type, 'to', groupId.slice(0, 8), '→ d-tag:', groupInfo.tagHash.slice(0, 12), '(write relays only)')
      await pool.publish(this.writeRelays, signed as any)
      console.info('[canary:sync] Published OK')
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

    // Start the personal-key recovery channel if not already active
    this._ensureRecoverySub()

    const filter = {
      kinds: [SYNC_STORED_KIND, SYNC_EPHEMERAL_KIND],
      '#d': [groupInfo.tagHash],
      // 7-day window covers the default rotation interval and typical offline periods.
      // Privileged ops use epoch+opId for ordering, so receiving stale messages is safe
      // (they're idempotent or rejected by epoch/opId checks).
      since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60,
    }

    console.info('[canary:sync] Subscribing to', groupId.slice(0, 8), '→ filter:', JSON.stringify(filter))

    const sub = pool.subscribeMany(
      this.allRelays,
      filter as any,
      {
        onevent: async (event: any) => {
          try {
            if (!event || typeof event !== 'object') return
            if (typeof event.pubkey !== 'string' || typeof event.content !== 'string') return
            console.info('[canary:sync] Received event', event.id?.slice(0, 12), 'kind:', event.kind, 'from pubkey:', event.pubkey?.slice(0, 12))

            // Re-fetch active group info on every event to avoid stale closure
            // references after reRegisterGroup() replaces the map entry.
            const active = this.groupKeys.get(groupId)
            if (!active) return // group was unregistered

            // Skip our own events
            if (event.pubkey === active.signer.pubkey) return

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

            // Decrypt with group key — track failures for auto-recovery
            let decrypted: string
            try {
              decrypted = await decryptEnvelope(active.key, event.content)
            } catch {
              this._trackDecryptFailure(groupId)
              return
            }

            // Decrypt succeeded — clear failure counter
            this.decryptFailures.delete(groupId)

            // Verify authenticated inner envelope.
            // Format: { s: personalPubkey, sig: schnorr(sig over payload), p: syncPayload }
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
            // Add protocolVersion back for canonical form — decodeSyncMessage validates
            // but strips it, while the send side includes it in the signed canonical.
            const versioned: SyncMessage = { ...msg, protocolVersion: PROTOCOL_VERSION }
            const canonical = canonicaliseSyncMessage(versioned)
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
            if (msg.type !== 'member-join' && !active.members.has(sender)) {
              console.warn('[canary:sync] Rejected message from non-member pubkey')
              return
            }

            // Liveness check-ins must be self-authored.
            if (msg.type === 'liveness-checkin' && msg.pubkey !== sender) {
              console.warn('[canary:sync] Rejected liveness-checkin with mismatched sender')
              return
            }

            console.info('[canary:sync] Dispatching', msg.type, 'from sender', sender.slice(0, 8))
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

  // ── Recovery protocol ─────────────────────────────────────────
  // Personal-key NIP-44 channel for state recovery after missed reseeds.
  // If a client can't decrypt group-key messages (missed a reseed), it
  // sends a recovery request to admins encrypted to their personal pubkey.
  // Admins respond with a signed state-snapshot encrypted to the requester.

  /**
   * Request state recovery from admins via personal-key NIP-44 encryption.
   * Sends a recovery request to each known admin for the group.
   */
  async requestRecovery(groupId: string, localEpoch: number, localCounter: number): Promise<void> {
    const pool = getPool()
    if (!pool) return

    const groupInfo = this.groupKeys.get(groupId)
    if (!groupInfo) return

    this.recoveryPending.set(groupId, Date.now())
    const privkeyBytes = hexToBytes(this.personalPrivkey)

    for (const adminPubkey of groupInfo.admins) {
      if (adminPubkey === this.personalPubkey) continue // don't request from self
      try {
        const requestPayload = JSON.stringify({
          groupTag: groupInfo.tagHash,
          epoch: localEpoch,
          counter: localCounter,
        })

        const ck = getConversationKey(privkeyBytes, adminPubkey)
        const encrypted = nip44Encrypt(requestPayload, ck)

        const unsigned = {
          kind: RECOVERY_REQUEST_KIND,
          content: encrypted,
          tags: [['p', adminPubkey]],
          created_at: Math.floor(Date.now() / 1000),
        }

        const signed = finalizeEvent(unsigned, privkeyBytes)
        await pool.publish(this.writeRelays, signed as any)
      } catch (err) {
        console.warn('[canary:sync] Recovery request to', adminPubkey.slice(0, 8), 'failed:', err)
      }
    }
  }

  /** Start the personal-key recovery subscription if not already active. */
  private _ensureRecoverySub(): void {
    if (this.recoverySub) return
    const pool = getPool()
    if (!pool) return

    const filter = {
      kinds: [RECOVERY_REQUEST_KIND, RECOVERY_RESPONSE_KIND],
      '#p': [this.personalPubkey],
      since: Math.floor(Date.now() / 1000) - 300,
    }

    this.recoverySub = pool.subscribeMany(
      this.allRelays,
      filter as any,
      {
        onevent: async (event: any) => {
          try {
            if (!event || typeof event !== 'object') return
            if (!verifyEvent(event)) return

            if (event.kind === RECOVERY_REQUEST_KIND) {
              await this._handleRecoveryRequest(event)
            } else if (event.kind === RECOVERY_RESPONSE_KIND) {
              await this._handleRecoveryResponse(event)
            }
          } catch (err) {
            console.warn('[canary:sync] Recovery event processing failed:', err)
          }
        },
      },
    )
  }

  /** Handle an incoming recovery request (admin side). */
  private async _handleRecoveryRequest(event: any): Promise<void> {
    const pool = getPool()
    if (!pool) return

    const requesterPubkey = event.pubkey as string
    if (!HEX_64_RE.test(requesterPubkey)) return

    // Decrypt with personal NIP-44 key
    const privkeyBytes = hexToBytes(this.personalPrivkey)
    const ck = getConversationKey(privkeyBytes, requesterPubkey)
    const decrypted = nip44Decrypt(event.content, ck)
    const parsed = JSON.parse(decrypted) as Record<string, unknown>

    const groupTag = parsed.groupTag
    const localEpoch = parsed.epoch
    const localCounter = parsed.counter
    if (typeof groupTag !== 'string' || typeof localEpoch !== 'number' || typeof localCounter !== 'number') return

    // Find group by tag hash
    const groupId = this.tagHashToGroupId.get(groupTag)
    if (!groupId) return

    const groupInfo = this.groupKeys.get(groupId)
    if (!groupInfo) return

    // Verify requester is a known member
    if (!groupInfo.members.has(requesterPubkey)) {
      console.warn('[canary:sync] Recovery request from non-member', requesterPubkey.slice(0, 8))
      return
    }

    // Ask app layer for the snapshot
    if (!groupInfo.onRecoveryRequest) return
    const snapshot = groupInfo.onRecoveryRequest(requesterPubkey, localEpoch, localCounter)
    if (!snapshot) return

    // Sign the snapshot (inner Schnorr signature over canonical bytes)
    const payload = encodeSyncMessage(snapshot)
    const versioned: SyncMessage = { ...snapshot, protocolVersion: PROTOCOL_VERSION }
    const canonical = canonicaliseSyncMessage(versioned)
    const payloadHash = sha256(ENCODER.encode(canonical))
    const innerSig = bytesToHex(schnorr.sign(payloadHash, privkeyBytes))

    // Build recovery response envelope
    const responseEnvelope = JSON.stringify({
      s: this.personalPubkey,
      sig: innerSig,
      groupTag,
      p: payload,
    })

    // Encrypt to requester's personal pubkey
    const responseCk = getConversationKey(privkeyBytes, requesterPubkey)
    const encrypted = nip44Encrypt(responseEnvelope, responseCk)

    const unsigned = {
      kind: RECOVERY_RESPONSE_KIND,
      content: encrypted,
      tags: [['p', requesterPubkey]],
      created_at: Math.floor(Date.now() / 1000),
    }

    const signed = finalizeEvent(unsigned, privkeyBytes)
    await pool.publish(this.writeRelays, signed as any)
    console.info('[canary:sync] Sent recovery response to', requesterPubkey.slice(0, 8))
  }

  /** Handle an incoming recovery response (requester side). */
  private async _handleRecoveryResponse(event: any): Promise<void> {
    const adminPubkey = event.pubkey as string
    if (!HEX_64_RE.test(adminPubkey)) return

    // Decrypt with personal NIP-44 key
    const privkeyBytes = hexToBytes(this.personalPrivkey)
    const ck = getConversationKey(privkeyBytes, adminPubkey)
    const decrypted = nip44Decrypt(event.content, ck)
    const parsed = JSON.parse(decrypted) as Record<string, unknown>

    const sender = parsed.s
    const sig = parsed.sig
    const groupTag = parsed.groupTag
    const payload = parsed.p
    if (typeof sender !== 'string' || typeof sig !== 'string' || typeof groupTag !== 'string' || typeof payload !== 'string') return
    if (!HEX_64_RE.test(sender) || !HEX_128_RE.test(sig)) return

    // Verify sender matches event author
    if (sender !== adminPubkey) return

    // Find group by tag hash
    const groupId = this.tagHashToGroupId.get(groupTag)
    if (!groupId) return

    const groupInfo = this.groupKeys.get(groupId)
    if (!groupInfo) return

    // Verify admin is trusted (in our known admins set)
    if (!groupInfo.admins.has(adminPubkey)) {
      console.warn('[canary:sync] Recovery response from non-admin', adminPubkey.slice(0, 8))
      return
    }

    // Verify inner Schnorr signature
    const msg = decodeSyncMessage(payload)
    const versioned: SyncMessage = { ...msg, protocolVersion: PROTOCOL_VERSION }
    const canonical = canonicaliseSyncMessage(versioned)
    const payloadHash = sha256(ENCODER.encode(canonical))
    const isValidSig = schnorr.verify(hexToBytes(sig), payloadHash, hexToBytes(adminPubkey))
    if (!isValidSig) {
      console.warn('[canary:sync] Recovery response with invalid signature')
      return
    }

    // Constrain recovery channel to state-snapshot only.
    // Other message types must go through the group-key sync channel.
    if (msg.type !== 'state-snapshot') {
      console.warn('[canary:sync] Recovery response contains non-snapshot type:', msg.type)
      return
    }

    // Self-consistency: sender must be in the snapshot's own admins list.
    // Higher-epoch recovery is disabled in applySyncMessage — only same-epoch
    // snapshots are accepted. This check remains as defence-in-depth.
    if (!msg.admins.includes(adminPubkey)) {
      console.warn('[canary:sync] Recovery response sender not in snapshot admins')
      return
    }

    // Clear recovery state
    this.decryptFailures.delete(groupId)
    this.recoveryPending.delete(groupId)

    // Deliver to app layer
    if (groupInfo.onRecoveryResponse) {
      groupInfo.onRecoveryResponse(msg, adminPubkey)
    }

    console.info('[canary:sync] Applied recovery response from', adminPubkey.slice(0, 8))
  }

  /** Track decrypt failures and auto-request recovery after threshold. */
  private _trackDecryptFailure(groupId: string): void {
    const count = (this.decryptFailures.get(groupId) ?? 0) + 1
    this.decryptFailures.set(groupId, count)

    if (count < DECRYPT_FAIL_THRESHOLD) return

    // Check if a pending request is still within its timeout window
    const pendingSince = this.recoveryPending.get(groupId)
    if (pendingSince !== undefined && Date.now() - pendingSince < RECOVERY_PENDING_TIMEOUT_MS) return

    // Timeout expired or no pending request — clear and retry
    this.recoveryPending.delete(groupId)

    const groupInfo = this.groupKeys.get(groupId)
    if (groupInfo && groupInfo.admins.size > 0 && groupInfo.onRecoveryResponse) {
      console.warn(`[canary:sync] ${count} decrypt failures for group — requesting recovery`)
      // Auto-request with epoch 0 / counter 0 (admin will send latest state regardless)
      this.requestRecovery(groupId, 0, 0).catch(err => {
        console.warn('[canary:sync] Auto-recovery request failed:', err)
      })
    }
  }

  disconnect(): void {
    for (const [, sub] of this.subs) sub.close()
    this.subs.clear()
    if (this.recoverySub) {
      this.recoverySub.close()
      this.recoverySub = null
    }
  }
}
