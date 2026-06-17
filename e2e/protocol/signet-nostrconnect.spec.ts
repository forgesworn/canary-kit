// e2e/protocol/signet-nostrconnect.spec.ts — Browser NostrConnect login regression
import { once } from 'node:events'
import WebSocket from 'ws'
import { NostrConnect } from 'nostr-tools/kinds'
import type { Event as NostrEvent, EventTemplate } from 'nostr-tools/core'
import { decrypt, encrypt, getConversationKey } from 'nostr-tools/nip44'
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'

import { test, expect } from '../fixtures.js'
import { MockRelay } from '../mock-relay.js'

type RelayMessage =
  | ['EVENT', string, NostrEvent]
  | ['EOSE', string]
  | ['OK', string, boolean, string]

interface Nip46Request {
  id: string
  method: string
  params: string[]
}

function hasFilterValue(filter: Record<string, unknown>, key: string, value: string | number): boolean {
  const values = filter[key]
  return Array.isArray(values) && values.includes(value)
}

class TestNip46Signer {
  readonly pubkey: string
  readonly requests: string[] = []
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
    ws.on('message', raw => {
      void this.handleMessage(raw.toString())
    })
    ws.send(JSON.stringify(['REQ', 'test-signer-requests', { kinds: [NostrConnect], '#p': [this.pubkey] }]))
  }

  async approveNostrConnect(uri: string): Promise<void> {
    const parsed = new URL(uri)
    const clientPubkey = parsed.hostname.toLowerCase()
    const secret = parsed.searchParams.get('secret')
    if (!secret) throw new Error('missing-nostrconnect-secret')
    await this.publish({
      kind: NostrConnect,
      tags: [['p', clientPubkey]],
      content: encrypt(JSON.stringify({ result: secret }), getConversationKey(this.secretKey, clientPubkey)),
      created_at: Math.floor(Date.now() / 1000),
    })
  }

  async close(): Promise<void> {
    const ws = this.ws
    if (!ws || ws.readyState === WebSocket.CLOSED) return
    const closed = once(ws, 'close').catch(() => {})
    ws.close()
    await closed
  }

  private async handleMessage(raw: string): Promise<void> {
    const message = JSON.parse(raw) as RelayMessage
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
    this.requests.push(request.method)
    const response = await this.handleRequest(request)
    await this.publish({
      kind: NostrConnect,
      tags: [['p', event.pubkey]],
      content: encrypt(JSON.stringify(response), conversationKey),
      created_at: Math.floor(Date.now() / 1000),
    })
  }

  private async handleRequest(request: Nip46Request): Promise<{ id: string; result?: string; error?: string }> {
    try {
      switch (request.method) {
        case 'connect':
          return { id: request.id, result: 'ack' }
        case 'get_public_key':
          return { id: request.id, result: this.pubkey }
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
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) throw new Error('signer-not-connected')
    const event = finalizeEvent(template, this.secretKey)
    const ack = new Promise<void>((resolve, reject) => {
      this.okWaiters.set(event.id, { resolve, reject })
      setTimeout(() => {
        if (!this.okWaiters.has(event.id)) return
        this.okWaiters.delete(event.id)
        reject(new Error('publish-timeout'))
      }, 1_000)
    })
    this.ws.send(JSON.stringify(['EVENT', event]))
    await ack
  }
}

test.describe('Signet NostrConnect browser flow', () => {
  test('clears the waiting screen after signer approval and persists a usable signer', async ({ page }) => {
    const relay = new MockRelay({ dropLimitZeroLiveEvents: true })
    await relay.start()

    const signer = new TestNip46Signer(relay.url, generateSecretKey())
    await signer.start()

    try {
      await page.addInitScript((relayUrl) => {
        if (!sessionStorage.getItem('canary-e2e-signet-nostrconnect-seeded')) {
          localStorage.clear()
          sessionStorage.setItem('canary-e2e-signet-nostrconnect-seeded', '1')
        }
        ;(window as Window & { __CANARY_SIGNET_TEST_RELAYS__?: string[] }).__CANARY_SIGNET_TEST_RELAYS__ = [relayUrl]
      }, relay.url)

      await page.goto('/')
      await page.locator('#login-signet').click()
      await expect(page.locator('#signet-login-dialog')).toBeVisible()

      await page.locator('#signet-login-dialog button[data-choice="nostrconnect"]').click()
      await expect(page.locator('#signet-login-nc-status')).toContainText('Waiting for signer to connect')

      const uri = await page.locator('#signet-login-nc-uri').inputValue()
      const clientPubkey = new URL(uri).hostname.toLowerCase()
      expect(uri).toContain(`relay=${encodeURIComponent(relay.url)}`)

      await relay.waitForSubscription(filter =>
        hasFilterValue(filter, 'kinds', NostrConnect) &&
        hasFilterValue(filter, '#p', clientPubkey) &&
        filter.limit !== 0,
      )

      await signer.approveNostrConnect(uri)

      await expect(page.locator('#signet-login-dialog')).toBeHidden({ timeout: 10_000 })
      await expect(page.locator('#sidebar')).toBeVisible({ timeout: 10_000 })
      await expect(page.locator('#signet-login-nc-status')).toBeHidden()
      expect(signer.requests).toContain('sign_event')

      await page.waitForFunction((expectedPubkey) => {
        const raw = localStorage.getItem('canary:identity')
        if (!raw) return false
        const identity = JSON.parse(raw) as { pubkey?: string } | null
        return identity?.pubkey === expectedPubkey
      }, signer.pubkey)

      const identity = await page.evaluate(() => JSON.parse(localStorage.getItem('canary:identity') ?? 'null') as {
        pubkey?: string
        signerMethod?: string
        signerType?: string
      } | null)
      expect(identity).toMatchObject({
        pubkey: signer.pubkey,
        signerMethod: 'bunker',
        signerType: 'nip07',
      })

      await page.reload()
      await page.waitForFunction(() => !!(window as Window & {
        Signet?: { restoreSession?: unknown }
      }).Signet?.restoreSession)

      const restoredRoundTrip = await page.evaluate(async () => {
        const signet = (window as Window & {
          Signet?: {
            restoreSession: () => Promise<{
              pubkey: string
              signer: {
                nip44?: {
                  encrypt: (peer: string, plaintext: string) => Promise<string>
                  decrypt: (peer: string, ciphertext: string) => Promise<string>
                }
              }
            } | null>
          }
        }).Signet
        const session = await signet?.restoreSession()
        if (!session?.signer.nip44) return null
        const ciphertext = await session.signer.nip44.encrypt(session.pubkey, 'browser-vault-secret')
        return session.signer.nip44.decrypt(session.pubkey, ciphertext)
      })
      expect(restoredRoundTrip).toBe('browser-vault-secret')
      expect(signer.requests).toEqual(expect.arrayContaining(['connect', 'nip44_encrypt', 'nip44_decrypt']))
    } finally {
      await signer.close()
      await relay.stop()
    }
  })
})
