import { test, expect, type Page, type WebSocketRoute } from '@playwright/test'
import { NostrConnect } from 'nostr-tools/kinds'

const SIGNET_BASE_URL = process.env.SIGNET_BASE_URL ?? 'https://mysignet.app'
const RELAY_URL = 'wss://relay.example.com'
const DEFAULT_PIN = '123456'

interface StoredEvent {
  id: string
  kind: number
  pubkey: string
  created_at: number
  tags: string[][]
  content: string
  sig: string
}

function hasFilterValue(filter: Record<string, unknown>, key: string, value: string | number): boolean {
  const values = filter[key]
  return Array.isArray(values) && values.includes(value)
}

class RoutedRelay {
  readonly storedEvents: StoredEvent[] = []
  private readonly sockets = new Set<WebSocketRoute>()
  private readonly subscriptions = new Map<WebSocketRoute, Map<string, Record<string, unknown>[]>>()
  private readonly waiters: Array<{
    predicate: (filter: Record<string, unknown>) => boolean
    resolve: () => void
    reject: (err: Error) => void
    timer: ReturnType<typeof setTimeout>
  }> = []

  async route(page: Page): Promise<void> {
    await page.routeWebSocket(RELAY_URL, ws => this.connect(ws))
  }

  waitForSubscription(
    predicate: (filter: Record<string, unknown>) => boolean,
    timeoutMs = 5_000,
  ): Promise<void> {
    for (const filtersBySub of this.subscriptions.values()) {
      for (const filters of filtersBySub.values()) {
        if (filters.some(predicate)) return Promise.resolve()
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

  close(): void {
    for (const waiter of [...this.waiters]) {
      clearTimeout(waiter.timer)
      waiter.reject(new Error('relay-closed'))
    }
    this.waiters.length = 0
    this.sockets.clear()
    this.subscriptions.clear()
  }

  private connect(ws: WebSocketRoute): void {
    this.sockets.add(ws)
    this.subscriptions.set(ws, new Map())
    ws.onMessage(raw => this.handleMessage(ws, String(raw)))
    ws.onClose(() => {
      this.sockets.delete(ws)
      this.subscriptions.delete(ws)
    })
  }

  private handleMessage(sender: WebSocketRoute, raw: string): void {
    let msg: unknown
    try {
      msg = JSON.parse(raw)
    } catch {
      return
    }
    if (!Array.isArray(msg) || typeof msg[0] !== 'string') return

    if (msg[0] === 'EVENT') {
      this.handleEvent(sender, msg[1] as StoredEvent)
    } else if (msg[0] === 'REQ') {
      this.handleReq(sender, String(msg[1]), msg.slice(2) as Record<string, unknown>[])
    } else if (msg[0] === 'CLOSE') {
      this.subscriptions.get(sender)?.delete(String(msg[1]))
    }
  }

  private handleEvent(sender: WebSocketRoute, event: StoredEvent): void {
    this.storedEvents.push(event)
    sender.send(JSON.stringify(['OK', event.id, true, '']))

    for (const ws of this.sockets) {
      if (ws === sender) continue
      const filtersBySub = this.subscriptions.get(ws)
      if (!filtersBySub) continue
      for (const [subId, filters] of filtersBySub) {
        if (filters.some(filter => filter.limit !== 0 && this.matchesFilter(event, filter))) {
          ws.send(JSON.stringify(['EVENT', subId, event]))
        }
      }
    }
  }

  private handleReq(ws: WebSocketRoute, subId: string, filters: Record<string, unknown>[]): void {
    const normalized = filters.length > 0 ? filters : [{}]
    this.subscriptions.get(ws)?.set(subId, normalized)
    for (const filter of normalized) this.notifyWaiters(filter)

    if (normalized.every(filter => filter.limit === 0)) {
      ws.send(JSON.stringify(['EOSE', subId]))
      return
    }

    for (const event of this.storedEvents) {
      if (normalized.some(filter => filter.limit !== 0 && this.matchesFilter(event, filter))) {
        ws.send(JSON.stringify(['EVENT', subId, event]))
      }
    }
    ws.send(JSON.stringify(['EOSE', subId]))
  }

  private matchesFilter(event: StoredEvent, filter: Record<string, unknown>): boolean {
    if (Array.isArray(filter.ids) && !filter.ids.includes(event.id)) return false
    if (Array.isArray(filter.kinds) && !filter.kinds.includes(event.kind)) return false
    if (Array.isArray(filter.authors) && !filter.authors.includes(event.pubkey)) return false
    if (typeof filter.since === 'number' && event.created_at < filter.since) return false
    if (typeof filter.until === 'number' && event.created_at > filter.until) return false

    for (const [key, value] of Object.entries(filter)) {
      if (!key.startsWith('#') || !Array.isArray(value)) continue
      const tagName = key.slice(1)
      const eventTagValues = event.tags.filter(tag => tag[0] === tagName).map(tag => tag[1])
      if (!value.some(v => eventTagValues.includes(String(v)))) return false
    }
    return true
  }

  private notifyWaiters(filter: Record<string, unknown>): void {
    for (const waiter of [...this.waiters]) {
      if (waiter.predicate(filter)) waiter.resolve()
    }
  }

  private removeWaiter(waiter: RoutedRelay['waiters'][number]): void {
    const index = this.waiters.indexOf(waiter)
    if (index >= 0) this.waiters.splice(index, 1)
  }
}

async function enterPin(page: Page, pin = DEFAULT_PIN): Promise<void> {
  for (const digit of pin) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }
}

async function createSignetIdentity(page: Page): Promise<void> {
  await page.goto(SIGNET_BASE_URL)
  await page.getByRole('button', { name: 'I already have a Signet' }).click()
  await page.getByRole('button', { name: /12 backup words/ }).click()
  await page
    .getByPlaceholder('word1 word2 word3 ...')
    .fill('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Use my real name' }).click()
  await page.getByPlaceholder('Your name or nickname').fill('Canary Live Signer')
  await page.getByRole('button', { name: 'Restore My Signet' }).click()
  await page.getByRole('button', { name: 'Set up now' }).click()
  await page.getByRole('button', { name: /6-digit PIN/ }).click()
  await enterPin(page)
  await enterPin(page)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByText('Canary Live Signer').waitFor({ state: 'visible', timeout: 60_000 })
}

async function unlockWithPin(page: Page): Promise<void> {
  const pinSwitch = page.getByRole('button', { name: 'Use PIN instead' })
  const keypadOne = page.getByRole('button', { name: '1', exact: true })
  await Promise.race([
    pinSwitch.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined),
    keypadOne.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined),
  ])
  if (await pinSwitch.isVisible().catch(() => false)) {
    await pinSwitch.click()
  }
  await keypadOne.waitFor({ state: 'visible', timeout: 10_000 })
  await enterPin(page)
}

async function confirmRealNameIfPrompted(page: Page): Promise<void> {
  await page
    .getByRole('button', { name: /Yes, (use|connect with) my real-name identity/ })
    .click({ timeout: 8_000 })
    .catch(() => {})
}

test.describe('Canary and Signet production NostrConnect smoke', () => {
  test.setTimeout(120_000)

  test('pairs deployed Canary with deployed Signet and restores NIP-44 after reload', async ({ browser, page }) => {
    const relay = new RoutedRelay()
    await relay.route(page)
    await page.addInitScript((relayUrl) => {
      if (!sessionStorage.getItem('canary-live-cross-app-nostrconnect-seeded')) {
        localStorage.clear()
        sessionStorage.setItem('canary-live-cross-app-nostrconnect-seeded', '1')
      }
      ;(window as Window & { __CANARY_SIGNET_TEST_RELAYS__?: string[] }).__CANARY_SIGNET_TEST_RELAYS__ = [relayUrl]
    }, RELAY_URL)

    const signetContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const signetPage = await signetContext.newPage()
    await relay.route(signetPage)

    try {
      await createSignetIdentity(signetPage)

      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.locator('#login-signet').click()
      await expect(page.locator('#signet-login-dialog')).toBeVisible()

      await page.locator('#signet-login-dialog button[data-choice="nostrconnect"]').click()
      await expect(page.locator('#signet-login-nc-status')).toContainText(/NostrConnect URI ready|Connecting to NostrConnect relay|Connected to relay|Waiting for signer/)

      const uriInput = page.locator('#signet-login-nc-uri')
      await expect(uriInput).toBeVisible()
      const uri = await uriInput.inputValue()
      expect(uri).toContain(`relay=${encodeURIComponent(RELAY_URL)}`)
      const clientPubkey = new URL(uri).hostname.toLowerCase()

      await relay.waitForSubscription(filter =>
        hasFilterValue(filter, 'kinds', NostrConnect) &&
        hasFilterValue(filter, '#p', clientPubkey) &&
        filter.limit !== 0,
      )

      const connectUrl = new URL('/', SIGNET_BASE_URL)
      connectUrl.searchParams.set('nostrconnect', uri)
      await signetPage.goto(connectUrl.toString())
      await unlockWithPin(signetPage)
      await expect(signetPage.getByRole('heading', { name: 'Connection Request' })).toBeVisible({ timeout: 15_000 })
      await expect(signetPage.getByText('CANARY', { exact: false }).first()).toBeVisible()
      await expect(signetPage.getByText(RELAY_URL, { exact: false })).toBeVisible()

      await confirmRealNameIfPrompted(signetPage)
      await signetPage.getByRole('button', { name: 'Approve' }).click()
      await expect(signetPage.getByText('Connected!')).toBeVisible({ timeout: 20_000 })

      await expect(page.locator('#signet-login-dialog')).toBeHidden({ timeout: 20_000 })
      await expect(page.locator('#sidebar')).toBeVisible({ timeout: 20_000 })

      await page.waitForFunction(() => {
        const raw = localStorage.getItem('canary:identity')
        if (!raw) return false
        const identity = JSON.parse(raw) as { pubkey?: string } | null
        return /^[0-9a-f]{64}$/.test(identity?.pubkey ?? '')
      })
      const identity = await page.evaluate(() => JSON.parse(localStorage.getItem('canary:identity') ?? 'null') as {
        pubkey?: string
        signerMethod?: string
        signerType?: string
      } | null)
      expect(identity).toMatchObject({
        signerMethod: 'bunker',
        signerType: 'nip07',
      })
      expect(identity?.pubkey).toMatch(/^[0-9a-f]{64}$/)

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
        const ciphertext = await session.signer.nip44.encrypt(session.pubkey, 'production-cross-app-secret')
        return session.signer.nip44.decrypt(session.pubkey, ciphertext)
      })
      expect(restoredRoundTrip).toBe('production-cross-app-secret')
      expect(relay.storedEvents.some(event => event.kind === NostrConnect)).toBe(true)
    } finally {
      await signetContext.close()
      relay.close()
    }
  })
})
