// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import WebSocket, { WebSocketServer } from 'ws'
import { NostrConnect } from 'nostr-tools/kinds'
import type { Event as NostrEvent, EventTemplate } from 'nostr-tools/core'
import type { Filter } from 'nostr-tools/filter'
import { decrypt, encrypt, getConversationKey } from 'nostr-tools/nip44'
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import {
  buildNostrConnectUri,
  createBunkerSignerFromNostrConnect,
  createSessionFromSigner,
} from 'signet-login'
import type { SignetSession } from 'signet-login'

import {
  clearActiveSignetSession,
  decryptWithSignet,
  encryptWithSignet,
  identityFromSignetSession,
  logoutSignetSession,
  signEventWithSignet,
} from './signet.js'

type RelayClientMessage =
  | ['REQ', string, ...Filter[]]
  | ['EVENT', NostrEvent]
  | ['CLOSE', string]

type RelayServerMessage =
  | ['EVENT', string, NostrEvent]
  | ['EOSE', string]
  | ['OK', string, boolean, string]

const STORAGE_KEYS = {
  pubkey: 'signet:login.pubkey',
  method: 'signet:login.method',
  authEvent: 'signet:login.authEvent',
  bunkerUri: 'signet:login.bunkerUri',
  bunkerClientSk: 'signet:login.bunkerClientSk',
  clientSk: 'signet:login.clientSk',
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

function installMemoryLocalStorage(): void {
  const data = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, String(value)),
      removeItem: (key: string) => data.delete(key),
      clear: () => data.clear(),
    },
  })
}

function persistSignetSession(session: SignetSession, bunkerUri: string, clientSecretKey: Uint8Array): void {
  localStorage.setItem(STORAGE_KEYS.pubkey, session.pubkey)
  localStorage.setItem(STORAGE_KEYS.method, session.method)
  localStorage.setItem(STORAGE_KEYS.authEvent, JSON.stringify(session.authEvent))
  localStorage.setItem(STORAGE_KEYS.bunkerUri, bunkerUri)
  localStorage.setItem(STORAGE_KEYS.bunkerClientSk, bytesToHex(clientSecretKey))
  localStorage.setItem(STORAGE_KEYS.clientSk, bytesToHex(clientSecretKey))
}

function sendJson(ws: WebSocket, message: RelayServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message))
}

function matchesFilter(filter: Filter, event: NostrEvent): boolean {
  if (filter.ids && !filter.ids.includes(event.id)) return false
  if (filter.kinds && !filter.kinds.includes(event.kind)) return false
  if (filter.authors && !filter.authors.includes(event.pubkey)) return false
  if (filter.since !== undefined && event.created_at < filter.since) return false
  if (filter.until !== undefined && event.created_at > filter.until) return false
  for (const [key, value] of Object.entries(filter)) {
    if (!key.startsWith('#') || !Array.isArray(value)) continue
    const tagName = key.slice(1)
    if (!event.tags.some(([name, tagValue]) => name === tagName && value.includes(tagValue))) {
      return false
    }
  }
  return true
}

class LocalRelay {
  private readonly clients = new Map<WebSocket, Map<string, Filter[]>>()
  private readonly waiters: Array<{
    predicate: (filters: Filter[]) => boolean
    resolve: () => void
    reject: (err: Error) => void
    timer: ReturnType<typeof setTimeout>
  }> = []

  private constructor(
    private readonly server: WebSocketServer,
    readonly url: string,
  ) {}

  static async start(): Promise<LocalRelay> {
    const server = new WebSocketServer({ host: '127.0.0.1', port: 0 })
    await once(server, 'listening')
    const address = server.address() as AddressInfo
    const relay = new LocalRelay(server, `ws://127.0.0.1:${address.port}`)
    server.on('connection', ws => relay.attach(ws))
    return relay
  }

  waitForSubscription(predicate: (filters: Filter[]) => boolean, timeoutMs = 1000): Promise<void> {
    for (const subscriptions of this.clients.values()) {
      for (const filters of subscriptions.values()) {
        if (predicate(filters)) return Promise.resolve()
      }
    }

    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve: () => {
          clearTimeout(waiter.timer)
          this.removeWaiter(waiter)
          resolve()
        },
        reject: (err: Error) => {
          this.removeWaiter(waiter)
          reject(err)
        },
        timer: setTimeout(() => waiter.reject(new Error('subscription-timeout')), timeoutMs),
      }
      this.waiters.push(waiter)
    })
  }

  async close(): Promise<void> {
    for (const waiter of [...this.waiters]) {
      clearTimeout(waiter.timer)
      waiter.reject(new Error('relay-closed'))
    }
    for (const ws of this.clients.keys()) ws.close()
    await new Promise<void>(resolve => this.server.close(() => resolve()))
  }

  private attach(ws: WebSocket): void {
    this.clients.set(ws, new Map())
    ws.on('message', raw => this.handle(ws, raw.toString()))
    ws.on('close', () => this.clients.delete(ws))
  }

  private handle(ws: WebSocket, raw: string): void {
    let message: RelayClientMessage
    try {
      message = JSON.parse(raw) as RelayClientMessage
    } catch {
      return
    }

    if (message[0] === 'REQ') {
      const [, subscriptionId, ...filters] = message
      this.clients.get(ws)?.set(subscriptionId, filters)
      sendJson(ws, ['EOSE', subscriptionId])
      this.notifyWaiters(filters)
      return
    }

    if (message[0] === 'CLOSE') {
      this.clients.get(ws)?.delete(message[1])
      return
    }

    if (message[0] === 'EVENT') {
      const event = message[1]
      sendJson(ws, ['OK', event.id, true, ''])
      for (const [client, subscriptions] of this.clients.entries()) {
        for (const [subscriptionId, filters] of subscriptions.entries()) {
          if (filters.some(filter => matchesFilter(filter, event))) {
            sendJson(client, ['EVENT', subscriptionId, event])
          }
        }
      }
    }
  }

  private notifyWaiters(filters: Filter[]): void {
    for (const waiter of [...this.waiters]) {
      if (waiter.predicate(filters)) waiter.resolve()
    }
  }

  private removeWaiter(waiter: LocalRelay['waiters'][number]): void {
    const index = this.waiters.indexOf(waiter)
    if (index >= 0) this.waiters.splice(index, 1)
  }
}

interface Nip46Request {
  id: string
  method: string
  params: string[]
}

class TestBunker {
  readonly pubkey: string
  connectRequests = 0
  private readonly approvedClients = new Map<string, string>()
  private readonly okWaiters = new Map<string, { resolve: () => void; reject: (err: Error) => void }>()
  private ws?: WebSocket

  constructor(
    private readonly relayUrl: string,
    private readonly secretKey: Uint8Array,
  ) {
    this.pubkey = getPublicKey(secretKey)
  }

  async start(): Promise<void> {
    const ws = new WebSocket(this.relayUrl)
    this.ws = ws
    await once(ws, 'open')
    ws.on('message', raw => this.handleMessage(raw.toString()))
    ws.send(JSON.stringify(['REQ', 'bunker-requests', { kinds: [NostrConnect], '#p': [this.pubkey] }]))
  }

  async approveNostrConnect(uri: string): Promise<void> {
    const parsed = new URL(uri)
    const clientPubkey = parsed.hostname.toLowerCase()
    const secret = parsed.searchParams.get('secret')
    if (!secret) throw new Error('missing-secret')
    this.approvedClients.set(clientPubkey, secret)
    await this.publish({
      kind: NostrConnect,
      tags: [['p', clientPubkey]],
      content: encrypt(JSON.stringify({ result: secret }), getConversationKey(this.secretKey, clientPubkey)),
      created_at: Math.floor(Date.now() / 1000),
    })
  }

  async close(): Promise<void> {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) return
    this.ws.close()
    await once(this.ws, 'close').catch(() => {})
  }

  private async handleMessage(raw: string): Promise<void> {
    const message = JSON.parse(raw) as RelayServerMessage
    if (message[0] === 'OK') {
      const waiter = this.okWaiters.get(message[1])
      if (!waiter) return
      this.okWaiters.delete(message[1])
      if (message[2]) waiter.resolve()
      else waiter.reject(new Error(message[3]))
      return
    }
    if (message[0] !== 'EVENT') return

    const event = message[2]
    const conversationKey = getConversationKey(this.secretKey, event.pubkey)
    const request = JSON.parse(decrypt(event.content, conversationKey)) as Nip46Request
    const response = await this.handleRequest(event.pubkey, request)
    await this.publish({
      kind: NostrConnect,
      tags: [['p', event.pubkey]],
      content: encrypt(JSON.stringify(response), conversationKey),
      created_at: Math.floor(Date.now() / 1000),
    })
  }

  private async handleRequest(clientPubkey: string, request: Nip46Request): Promise<{ id: string; result?: string; error?: string }> {
    try {
      switch (request.method) {
        case 'connect': {
          this.connectRequests++
          const expectedSecret = this.approvedClients.get(clientPubkey)
          if (expectedSecret && request.params[1] !== expectedSecret) return { id: request.id, error: 'secret-mismatch' }
          return { id: request.id, result: 'ack' }
        }
        case 'get_public_key':
          return { id: request.id, result: this.pubkey }
        case 'switch_relays':
          return { id: request.id, result: JSON.stringify([this.relayUrl]) }
        case 'sign_event': {
          const template = JSON.parse(request.params[0]) as EventTemplate
          return { id: request.id, result: JSON.stringify(finalizeEvent(template, this.secretKey)) }
        }
        case 'nip44_encrypt': {
          const [peerPubkey, plaintext] = request.params
          return { id: request.id, result: encrypt(plaintext, getConversationKey(this.secretKey, peerPubkey)) }
        }
        case 'nip44_decrypt': {
          const [peerPubkey, ciphertext] = request.params
          return { id: request.id, result: decrypt(ciphertext, getConversationKey(this.secretKey, peerPubkey)) }
        }
        default:
          return { id: request.id, error: `unsupported-method:${request.method}` }
      }
    } catch (err) {
      return { id: request.id, error: err instanceof Error ? err.message : String(err) }
    }
  }

  private async publish(template: EventTemplate): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) throw new Error('bunker-not-connected')
    const event = finalizeEvent(template, this.secretKey)
    const ack = new Promise<void>((resolve, reject) => {
      this.okWaiters.set(event.id, { resolve, reject })
      setTimeout(() => {
        if (!this.okWaiters.has(event.id)) return
        this.okWaiters.delete(event.id)
        reject(new Error('publish-timeout'))
      }, 1000)
    })
    this.ws.send(JSON.stringify(['EVENT', event]))
    await ack
  }
}

describe('Canary Signet NIP-46 restore path', () => {
  let relay: LocalRelay | undefined
  let bunker: TestBunker | undefined

  afterEach(async () => {
    await logoutSignetSession()
    await bunker?.close()
    await relay?.close()
    delete (globalThis as { localStorage?: Storage }).localStorage
    bunker = undefined
    relay = undefined
  })

  it('restores a NostrConnect-paired signer and performs signing plus NIP-44 round-trip', async () => {
    installMemoryLocalStorage()
    relay = await LocalRelay.start()
    bunker = new TestBunker(relay.url, generateSecretKey())
    await bunker.start()

    const clientSecretKey = generateSecretKey()
    const clientPubkey = getPublicKey(clientSecretKey)
    localStorage.setItem(STORAGE_KEYS.clientSk, bytesToHex(clientSecretKey))
    const uri = buildNostrConnectUri({
      clientPubkeyHex: clientPubkey,
      relayUrl: relay.url,
      secret: 'canary-restore-secret',
      perms: ['sign_event', 'nip44_encrypt', 'nip44_decrypt'],
      appName: 'CANARY',
      appUrl: 'https://canary.trotters.cc',
    })

    const pairing = createBunkerSignerFromNostrConnect({ uri, clientSecretKey })
    await relay.waitForSubscription(filters =>
      filters.some(filter => filter.kinds?.includes(NostrConnect) && filter['#p']?.includes(clientPubkey)),
    )
    await bunker.approveNostrConnect(uri)

    const pairedSigner = await pairing
    const session = await createSessionFromSigner(pairedSigner, {
      appName: 'CANARY',
      challenge: 'ab'.repeat(32),
      origin: 'https://canary.trotters.cc',
    })
    const identity = identityFromSignetSession(session)
    persistSignetSession(session, pairedSigner.bunkerUri, clientSecretKey)
    await pairedSigner.close()
    clearActiveSignetSession()

    const signed = await signEventWithSignet(identity, {
      kind: 1,
      content: 'canary strict restore path',
      tags: [],
      created_at: 1_700_000_000,
    })
    expect(signed.pubkey).toBe(bunker.pubkey)
    expect(signed.kind).toBe(1)
    expect(bunker.connectRequests).toBe(1)

    const ciphertext = await encryptWithSignet(identity, identity.pubkey, 'canary-vault-secret')
    expect(ciphertext).not.toBe('canary-vault-secret')
    await expect(decryptWithSignet(identity, identity.pubkey, ciphertext)).resolves.toBe('canary-vault-secret')
  })
})
