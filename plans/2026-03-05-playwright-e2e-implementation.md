# Playwright E2E Test Suite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive Playwright E2E test suite that exercises every CANARY protocol feature through the demo app, serving as both regression tests and a living spec for feature parity.

**Architecture:** Three test projects (offline, online, protocol) sharing fixtures and helpers. A lightweight mock NIP-01 relay for online tests. Multi-browser-context tests for two-user scenarios. `test.fixme()` stubs for unimplemented features.

**Tech Stack:** Playwright Test, `ws` (WebSocket server for mock relay), Vite dev server as test target.

---

### Task 1: Install Playwright and scaffold directories

**Files:**
- Modify: `package.json`
- Create: `e2e/playwright.config.ts`
- Create: `e2e/offline/.gitkeep` (deleted after first spec)
- Create: `e2e/online/.gitkeep`
- Create: `e2e/protocol/.gitkeep`

**Step 1: Install dependencies**

Run:
```bash
npm install -D @playwright/test ws @types/ws
npx playwright install chromium
```
Expected: packages added to devDependencies

**Step 2: Add scripts to package.json**

Add these scripts (keep all existing scripts):
```json
"test:e2e": "playwright test",
"test:e2e:offline": "playwright test --project=offline",
"test:e2e:online": "playwright test --project=online",
"test:e2e:protocol": "playwright test --project=protocol",
"test:e2e:ui": "playwright test --ui"
```

**Step 3: Create playwright.config.ts**

```typescript
// e2e/playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: 0,
  workers: 1, // sequential — tests share app state via localStorage
  reporter: [['list'], ['html', { open: 'never' }]],

  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
    cwd: '..',
  },

  projects: [
    {
      name: 'offline',
      testDir: './offline',
    },
    {
      name: 'online',
      testDir: './online',
    },
    {
      name: 'protocol',
      testDir: './protocol',
    },
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
```

Note: We use `npm run dev` (Vite dev server on port 5173) instead of `npm run demo` (static build on 8787) for faster iteration — no rebuild needed between test runs.

**Step 4: Create directory structure**

```bash
mkdir -p e2e/offline e2e/online e2e/protocol
```

**Step 5: Add to .gitignore**

Append to `.gitignore`:
```
# Playwright
e2e/test-results/
e2e/playwright-report/
```

**Step 6: Commit**

```bash
git add e2e/ package.json package-lock.json .gitignore
git commit -m "chore: add Playwright E2E test infrastructure"
```

---

### Task 2: Build test helpers

**Files:**
- Create: `e2e/helpers.ts`

These are reusable functions every spec file will import. They encapsulate the exact DOM selectors and user interactions so specs stay clean.

**Step 1: Write helpers.ts**

```typescript
// e2e/helpers.ts — Reusable test actions for CANARY demo app
import { type Page, expect } from '@playwright/test'

// ── Login flows ──────────────────────────────────────────────

/** Login as offline user with the given display name. */
export async function loginOffline(page: Page, name: string): Promise<void> {
  await page.fill('#offline-name', name)
  await page.click('#offline-form button[type="submit"]')
  // Wait for the app shell to render
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

/** Login with an nsec key. */
export async function loginWithNsec(page: Page, nsec: string): Promise<void> {
  await page.fill('#login-nsec', nsec)
  await page.click('#nsec-login-form button[type="submit"]')
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

/** Login using a named demo account button. */
export async function loginWithDemo(page: Page, name: string): Promise<void> {
  await page.click(`.login-screen__demo[data-name="${name}"]`)
  await page.waitForSelector('#sidebar', { timeout: 5000 })
}

// ── Group lifecycle ──────────────────────────────────────────

/** Create a new group via the modal. Returns after group appears in sidebar. */
export async function createGroup(
  page: Page,
  name: string,
  options?: {
    preset?: 'family' | 'field-ops' | 'enterprise' | 'event'
    mode?: 'offline' | 'online'
    myName?: string
  },
): Promise<void> {
  await page.click('#create-group-btn')
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="name"]', name)

  if (options?.myName) {
    const myNameInput = page.locator('[name="myname"]')
    if (await myNameInput.isVisible()) {
      await myNameInput.fill(options.myName)
    }
  }

  if (options?.mode) {
    await page.click(`.segmented__btn[data-mode="${options.mode}"]`)
  }

  if (options?.preset) {
    await page.click(`.segmented__btn[data-preset="${options.preset}"]`)
  }

  await page.click('#modal-form button[type="submit"]')
  // Wait for modal to close and group to appear
  await page.waitForSelector(`text=${name}`, { timeout: 3000 })
}

/** Click a group in the sidebar to make it active. */
export async function switchGroup(page: Page, name: string): Promise<void> {
  await page.click(`.group-list__item:has-text("${name}")`)
  await page.waitForSelector(`.group-list__item--active:has-text("${name}")`)
}

/** Get all group names from the sidebar. */
export async function getGroupNames(page: Page): Promise<string[]> {
  return page.locator('.group-list__name').allTextContents()
}

// ── Invite flow ──────────────────────────────────────────────

/** Click the Invite button (from hero or members panel) and extract payload + confirm code. */
export async function createInvite(page: Page): Promise<{ payload: string; confirmCode: string }> {
  // Try hero invite button first, then members panel
  const heroInvite = page.locator('#hero-invite-btn')
  const membersInvite = page.locator('#invite-btn')

  if (await heroInvite.isVisible()) {
    await heroInvite.click()
  } else {
    await membersInvite.click()
  }

  await page.waitForSelector('#invite-modal[open]', { timeout: 3000 })

  const confirmCode = await page.locator('.confirm-code__value').textContent()
  if (!confirmCode) throw new Error('Could not read confirm code from invite modal')

  // Extract payload from the Copy Link URL (hash fragment contains it)
  const copyLinkBtn = page.locator('#invite-copy-link')

  // We need to read the invite URL to extract the payload.
  // The invite modal constructs: base#join/encodeURIComponent(payload)
  // Grab it from the clipboard after clicking Copy Link.
  // Grant clipboard permissions first.
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await copyLinkBtn.click()
  await page.waitForTimeout(200) // allow clipboard write

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
  const hashIndex = clipboardText.indexOf('#join/')
  if (hashIndex === -1) throw new Error('Invite link missing #join/ fragment')
  const payload = decodeURIComponent(clipboardText.slice(hashIndex + 6))

  // Close the invite modal
  await page.click('#invite-close-btn')

  return { payload, confirmCode }
}

/** Accept an invite via the join modal (not via URL). */
export async function acceptInviteViaModal(
  page: Page,
  payload: string,
  confirmCode: string,
): Promise<void> {
  // Dispatch the join-group event to open the modal
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
  })
  await page.waitForSelector('#app-modal[open]', { timeout: 3000 })

  await page.fill('[name="payload"]', payload)
  await page.fill('[name="code"]', confirmCode)

  await page.click('#modal-form button[type="submit"]')
  // Wait for modal to close
  await page.waitForSelector('#app-modal:not([open])', { timeout: 5000 })
}

/** Accept an invite by navigating to the invite URL hash. */
export async function acceptInviteViaLink(
  page: Page,
  payload: string,
  confirmCode: string,
  loginName?: string,
): Promise<void> {
  const encodedPayload = encodeURIComponent(payload)
  await page.goto(`/#join/${encodedPayload}`)

  // If not logged in, the login screen appears first
  const loginScreen = page.locator('.lock-screen')
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await loginOffline(page, loginName ?? 'Invitee')
  }

  // The join modal should appear with payload pre-filled
  await page.waitForSelector('#app-modal[open]', { timeout: 5000 })
  await page.fill('[name="code"]', confirmCode)

  // Fill name if the field exists
  const nameInput = page.locator('#app-modal [name="myname"]')
  if (await nameInput.isVisible().catch(() => false)) {
    await nameInput.fill(loginName ?? 'Invitee')
  }

  await page.click('#modal-form button[type="submit"]')
  await page.waitForSelector('#app-modal:not([open])', { timeout: 5000 })
}

// ── Verification ─────────────────────────────────────────────

/**
 * Hold the reveal button and read the verification word.
 * Uses pointerdown/pointerup to simulate press-and-hold.
 */
export async function getDisplayedWord(page: Page): Promise<string> {
  const revealBtn = page.locator('#hero-reveal-btn')
  await revealBtn.dispatchEvent('pointerdown')
  // Wait a tick for the word to be revealed
  await page.waitForTimeout(100)

  const wordEl = page.locator('#hero-word')
  const word = await wordEl.textContent()

  await revealBtn.dispatchEvent('pointerup')

  return word?.trim() ?? ''
}

/** Type a word in the verify panel and click Verify. Returns the result status class. */
export async function verifyWord(
  page: Page,
  word: string,
): Promise<'valid' | 'duress' | 'invalid'> {
  await page.fill('#verify-input', word)
  await page.click('#verify-btn')

  const resultEl = page.locator('#verify-result')
  await expect(resultEl).not.toBeHidden({ timeout: 3000 })

  const classes = await resultEl.getAttribute('class') ?? ''
  if (classes.includes('verify-result--valid')) return 'valid'
  if (classes.includes('verify-result--duress')) return 'duress'
  return 'invalid'
}

// ── Settings ─────────────────────────────────────────────────

/** Open the settings drawer if it's closed. */
export async function openSettings(page: Page): Promise<void> {
  const body = page.locator('#settings-body')
  if (await body.isHidden()) {
    await page.click('#settings-toggle')
    await expect(body).toBeVisible()
  }
}

/** Change the encoding format in settings. */
export async function setEncodingFormat(
  page: Page,
  format: 'words' | 'pin' | 'hex',
): Promise<void> {
  await openSettings(page)
  await page.click(`[data-enc="${format}"]`)
}

// ── Sync ─────────────────────────────────────────────────────

/** Inject a relay URL into localStorage settings before the app loads. */
export async function seedRelayUrl(page: Page, relayUrl: string): Promise<void> {
  await page.addInitScript((url) => {
    const raw = localStorage.getItem('canary:settings')
    const settings = raw ? JSON.parse(raw) : {}
    settings.defaultRelays = [url]
    localStorage.setItem('canary:settings', JSON.stringify(settings))
  }, relayUrl)
}

/** Wait for the sync flash indicator to appear and disappear. */
export async function waitForSync(page: Page, timeoutMs = 5000): Promise<void> {
  // The header shows a brief flash when sync events arrive.
  // Wait for a state change to propagate.
  await page.waitForTimeout(2000) // give relay + decrypt time
}

// ── Assertions ───────────────────────────────────────────────

/**
 * Set up console error tracking on a page.
 * Call this early in the test, then call assertNoConsoleErrors at the end.
 */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}
```

**Step 2: Verify helpers compile**

Run:
```bash
npx tsc --noEmit --esModuleInterop --module nodenext --moduleResolution nodenext e2e/helpers.ts
```

This may warn about missing types — that's fine, Playwright's test runner handles it.

**Step 3: Commit**

```bash
git add e2e/helpers.ts
git commit -m "feat: add E2E test helpers for CANARY demo app"
```

---

### Task 3: Build mock NIP-01 relay

**Files:**
- Create: `e2e/mock-relay.ts`

This is a minimal WebSocket server that handles `EVENT`, `REQ`, `CLOSE` messages per NIP-01. Used by online tests to simulate a real Nostr relay.

**Step 1: Write mock-relay.ts**

```typescript
// e2e/mock-relay.ts — Lightweight NIP-01 WebSocket relay for testing
import { WebSocketServer, type WebSocket } from 'ws'

interface StoredEvent {
  id: string
  kind: number
  pubkey: string
  created_at: number
  tags: string[][]
  content: string
  sig: string
}

interface Subscription {
  ws: WebSocket
  filters: Record<string, unknown>
}

export class MockRelay {
  private wss: WebSocketServer | null = null
  private events: StoredEvent[] = []
  private subs = new Map<string, Subscription[]>()

  get port(): number {
    const addr = this.wss?.address()
    if (!addr || typeof addr === 'string') throw new Error('Relay not started')
    return addr.port
  }

  get url(): string {
    return `ws://localhost:${this.port}`
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WebSocketServer({ port: 0 }, () => resolve())
      this.wss.on('connection', (ws) => this.handleConnection(ws))
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.wss) return resolve()
      // Close all connections first
      for (const client of this.wss.clients) {
        client.close()
      }
      this.wss.close(() => {
        this.wss = null
        this.events = []
        this.subs.clear()
        resolve()
      })
    })
  }

  /** Clear all stored events (useful between tests). */
  reset(): void {
    this.events = []
  }

  private handleConnection(ws: WebSocket): void {
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as unknown[]
        if (!Array.isArray(msg) || msg.length < 2) return

        const type = msg[0] as string
        if (type === 'EVENT') {
          this.handleEvent(ws, msg[1] as StoredEvent)
        } else if (type === 'REQ') {
          this.handleReq(ws, msg[1] as string, msg.slice(2) as Record<string, unknown>[])
        } else if (type === 'CLOSE') {
          this.handleClose(ws, msg[1] as string)
        }
      } catch {
        // Ignore malformed messages
      }
    })

    ws.on('close', () => {
      // Remove all subscriptions for this socket
      for (const [subId, subs] of this.subs) {
        const filtered = subs.filter((s) => s.ws !== ws)
        if (filtered.length === 0) {
          this.subs.delete(subId)
        } else {
          this.subs.set(subId, filtered)
        }
      }
    })
  }

  private handleEvent(sender: WebSocket, event: StoredEvent): void {
    this.events.push(event)

    // Send OK to the sender
    sender.send(JSON.stringify(['OK', event.id, true, '']))

    // Broadcast to matching subscriptions (excluding sender)
    for (const [subId, subs] of this.subs) {
      for (const sub of subs) {
        if (sub.ws === sender) continue
        if (sub.ws.readyState !== 1) continue // WebSocket.OPEN
        if (this.matchesFilter(event, sub.filters)) {
          sub.ws.send(JSON.stringify(['EVENT', subId, event]))
        }
      }
    }
  }

  private handleReq(ws: WebSocket, subId: string, filters: Record<string, unknown>[]): void {
    const filter = filters[0] ?? {}

    // Store subscription
    const existing = this.subs.get(subId) ?? []
    existing.push({ ws, filters: filter })
    this.subs.set(subId, existing)

    // Send matching stored events
    for (const event of this.events) {
      if (this.matchesFilter(event, filter)) {
        ws.send(JSON.stringify(['EVENT', subId, event]))
      }
    }

    // Send EOSE
    ws.send(JSON.stringify(['EOSE', subId]))
  }

  private handleClose(ws: WebSocket, subId: string): void {
    const subs = this.subs.get(subId)
    if (!subs) return
    const filtered = subs.filter((s) => s.ws !== ws)
    if (filtered.length === 0) {
      this.subs.delete(subId)
    } else {
      this.subs.set(subId, filtered)
    }
  }

  private matchesFilter(event: StoredEvent, filter: Record<string, unknown>): boolean {
    // Filter by kinds
    if (Array.isArray(filter.kinds)) {
      if (!filter.kinds.includes(event.kind)) return false
    }

    // Filter by since
    if (typeof filter.since === 'number') {
      if (event.created_at < filter.since) return false
    }

    // Filter by until
    if (typeof filter.until === 'number') {
      if (event.created_at > filter.until) return false
    }

    // Filter by tag values (e.g. #d, #p)
    for (const [key, value] of Object.entries(filter)) {
      if (key.startsWith('#') && Array.isArray(value)) {
        const tagName = key.slice(1)
        const eventTagValues = event.tags
          .filter((t) => t[0] === tagName)
          .map((t) => t[1])
        if (!value.some((v) => eventTagValues.includes(v as string))) {
          return false
        }
      }
    }

    return true
  }
}
```

**Step 2: Commit**

```bash
git add e2e/mock-relay.ts
git commit -m "feat: add mock NIP-01 WebSocket relay for E2E tests"
```

---

### Task 4: Build test fixtures

**Files:**
- Create: `e2e/fixtures.ts`

Fixtures provide pre-configured pages and the mock relay to all test files.

**Step 1: Write fixtures.ts**

```typescript
// e2e/fixtures.ts — Shared Playwright fixtures for CANARY E2E tests
import { test as base, type Page, type BrowserContext } from '@playwright/test'
import { MockRelay } from './mock-relay.js'
import { trackConsoleErrors } from './helpers.js'

// ── Fixture types ────────────────────────────────────────────

type CanaryFixtures = {
  /** A clean page with no prior state — navigated to / and ready for login. */
  cleanPage: Page

  /** Two isolated browser contexts, each navigated to /. For multi-user tests. */
  twoUsers: { pageA: Page; pageB: Page; contextA: BrowserContext; contextB: BrowserContext }

  /** Mock NIP-01 relay instance (started before test, stopped after). */
  mockRelay: MockRelay

  /** Console errors tracked for the default page. */
  consoleErrors: string[]
}

// ── Fixtures ─────────────────────────────────────────────────

export const test = base.extend<CanaryFixtures>({
  cleanPage: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('/')
    await use(page)
    await context.close()
  },

  twoUsers: async ({ browser }, use) => {
    const contextA = await browser.newContext()
    const contextB = await browser.newContext()
    const pageA = await contextA.newPage()
    const pageB = await contextB.newPage()
    await pageA.goto('/')
    await pageB.goto('/')
    await use({ pageA, pageB, contextA, contextB })
    await contextA.close()
    await contextB.close()
  },

  mockRelay: async ({}, use) => {
    const relay = new MockRelay()
    await relay.start()
    await use(relay)
    await relay.stop()
  },

  consoleErrors: async ({ page }, use) => {
    const errors = trackConsoleErrors(page)
    await use(errors)
  },
})

export { expect } from '@playwright/test'
```

**Step 2: Commit**

```bash
git add e2e/fixtures.ts
git commit -m "feat: add Playwright fixtures (cleanPage, twoUsers, mockRelay)"
```

---

### Task 5: Write offline/login.spec.ts

**Files:**
- Create: `e2e/offline/login.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/login.spec.ts — Login screen tests
import { test, expect } from '../fixtures.js'
import { loginOffline, loginWithNsec, loginWithDemo } from '../helpers.js'

// Demo account nsec for testing (Alice)
const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'

test.describe('Login screen', () => {
  test('shows login screen with no prior state', async ({ cleanPage: page }) => {
    await expect(page.locator('.lock-screen')).toBeVisible()
    await expect(page.locator('text=CANARY')).toBeVisible()
    await expect(page.locator('#offline-form')).toBeVisible()
  })

  test('offline start creates identity and shows main app', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await expect(page.locator('#sidebar')).toBeVisible()
    await expect(page.locator('#create-group-btn')).toBeVisible()
  })

  test('offline start sets display name', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    // Identity badge should show the name
    await expect(page.locator('.identity-badge__name')).toHaveText('Alice')
  })

  test('nsec login with valid key creates identity', async ({ cleanPage: page }) => {
    await loginWithNsec(page, ALICE_NSEC)
    await expect(page.locator('#sidebar')).toBeVisible()
  })

  test('nsec login with invalid key shows error', async ({ cleanPage: page }) => {
    // Listen for the alert dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Invalid nsec')
      await dialog.accept()
    })
    await page.fill('#login-nsec', 'not-a-real-nsec')
    await page.click('#nsec-login-form button[type="submit"]')
  })

  test('demo account button loads correct identity', async ({ cleanPage: page }) => {
    await loginWithDemo(page, 'Alice')
    await expect(page.locator('.identity-badge__name')).toHaveText('Alice')
  })

  test('preserves #join/ hash through offline login flow', async ({ cleanPage: page }) => {
    // Navigate to a URL with an invite hash
    await page.goto('/#join/dGVzdA==')
    // Should show login screen (no identity yet)
    await expect(page.locator('.lock-screen')).toBeVisible()
    // Login
    await loginOffline(page, 'Invitee')
    // After login, the join modal should appear (hash was preserved)
    await expect(page.locator('#app-modal[open]')).toBeVisible({ timeout: 5000 })
  })
})
```

**Step 2: Run test to see what passes/fails**

Run:
```bash
npx playwright test --project=offline e2e/offline/login.spec.ts
```

Expected: Some tests may pass, others may reveal real bugs. Record results.

**Step 3: Commit**

```bash
git add e2e/offline/login.spec.ts
git commit -m "test: add login screen E2E tests"
```

---

### Task 6: Write offline/group-lifecycle.spec.ts

**Files:**
- Create: `e2e/offline/group-lifecycle.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/group-lifecycle.spec.ts — Group create, rename, delete
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, switchGroup, getGroupNames, openSettings } from '../helpers.js'

test.describe('Group lifecycle', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
  })

  test('create group with family preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Family Chat', { preset: 'family' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Family Chat')
  })

  test('create group with field-ops preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Field Team', { preset: 'field-ops' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Field Team')
  })

  test('create group with enterprise preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Security Ops', { preset: 'enterprise' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Security Ops')
  })

  test('group appears in sidebar after creation', async ({ cleanPage: page }) => {
    await createGroup(page, 'Test Group')
    await expect(page.locator('.group-list__item')).toBeVisible()
    await expect(page.locator('.group-list__name')).toHaveText('Test Group')
  })

  test('rename group via settings', async ({ cleanPage: page }) => {
    await createGroup(page, 'Old Name')
    await openSettings(page)
    await page.fill('#settings-name', 'New Name')
    await page.locator('#settings-name').dispatchEvent('change')
    await expect(page.locator('.group-list__name')).toHaveText('New Name')
  })

  test('delete group removes from sidebar', async ({ cleanPage: page }) => {
    await createGroup(page, 'Doomed Group')
    await openSettings(page)

    // Click delete — there should be a confirm dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })
    await page.click('text=Delete Group')

    await expect(page.locator('.group-list__item')).not.toBeVisible()
  })

  test('multiple groups: switching updates display', async ({ cleanPage: page }) => {
    await createGroup(page, 'Group Alpha')
    await createGroup(page, 'Group Beta')

    await switchGroup(page, 'Group Alpha')
    await expect(page.locator('.group-list__item--active')).toContainText('Group Alpha')

    await switchGroup(page, 'Group Beta')
    await expect(page.locator('.group-list__item--active')).toContainText('Group Beta')
  })
})
```

**Step 2: Run tests**

Run: `npx playwright test --project=offline e2e/offline/group-lifecycle.spec.ts`

**Step 3: Commit**

```bash
git add e2e/offline/group-lifecycle.spec.ts
git commit -m "test: add group lifecycle E2E tests"
```

---

### Task 7: Write offline/invite-flow.spec.ts

**Files:**
- Create: `e2e/offline/invite-flow.spec.ts`

This is the most critical test — two browser contexts simulating two users.

**Step 1: Write the spec**

```typescript
// e2e/offline/invite-flow.spec.ts — Invite creation and acceptance (two users)
import { test, expect } from '../fixtures.js'
import {
  loginOffline, createGroup, createInvite, acceptInviteViaLink,
  acceptInviteViaModal, getDisplayedWord, getGroupNames,
} from '../helpers.js'

test.describe('Invite flow (offline)', () => {
  test('create invite shows QR, confirm code, and copy buttons', async ({ twoUsers: { pageA } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Test Group')

    await pageA.click('#hero-invite-btn')
    await expect(pageA.locator('#invite-modal[open]')).toBeVisible()
    await expect(pageA.locator('.qr-container')).toBeVisible()
    await expect(pageA.locator('.confirm-code__value')).toBeVisible()
    await expect(pageA.locator('#invite-copy-link')).toBeVisible()
    await expect(pageA.locator('#invite-copy-text')).toBeVisible()

    await pageA.click('#invite-close-btn')
  })

  test('User B opens invite link, logs in, joins successfully', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Family')

    const { payload, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')

    // Both should see a group called "Family"
    const groupsB = await getGroupNames(pageB)
    expect(groupsB).toContain('Family')
  })

  test('both users see same verification word after join', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Shared')

    const { payload, confirmCode } = await createInvite(pageA)
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')

    const wordA = await getDisplayedWord(pageA)
    const wordB = await getDisplayedWord(pageB)
    expect(wordA).toBeTruthy()
    expect(wordA).toBe(wordB)
  })

  test('wrong confirm code shows error', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'Guarded')

    const { payload } = await createInvite(pageA)

    await loginOffline(pageB, 'Bob')

    // Accept with wrong code — should show alert
    pageB.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Confirmation code does not match')
      await dialog.accept()
    })
    await acceptInviteViaModal(pageB, payload, 'XXXX-XXXX-XXXX')
  })

  test('replayed invite nonce is rejected', async ({ twoUsers: { pageA, pageB } }) => {
    await loginOffline(pageA, 'Alice')
    await createGroup(pageA, 'OneShot')

    const { payload, confirmCode } = await createInvite(pageA)

    // First accept works
    await acceptInviteViaLink(pageB, payload, confirmCode, 'Bob')

    // Second accept with same nonce should be rejected
    pageB.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('already been used')
      await dialog.accept()
    })
    await acceptInviteViaModal(pageB, payload, confirmCode)
  })
})
```

**Step 2: Run tests**

Run: `npx playwright test --project=offline e2e/offline/invite-flow.spec.ts`

**Step 3: Commit**

```bash
git add e2e/offline/invite-flow.spec.ts
git commit -m "test: add invite flow E2E tests (two-user offline)"
```

---

### Task 8: Write offline/verification.spec.ts and offline/verify-input.spec.ts

**Files:**
- Create: `e2e/offline/verification.spec.ts`
- Create: `e2e/offline/verify-input.spec.ts`

**Step 1: Write verification.spec.ts (hero panel display)**

```typescript
// e2e/offline/verification.spec.ts — Hero panel: word display, reveal, countdown, burn
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord } from '../helpers.js'

test.describe('Verification display (hero panel)', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test', { preset: 'family' })
  })

  test('hero panel shows masked word by default', async ({ cleanPage: page }) => {
    const wordEl = page.locator('#hero-word')
    await expect(wordEl).toBeVisible()
    // Should contain bullet dots (masked)
    const text = await wordEl.textContent()
    expect(text).toMatch(/^[•]+$/)
  })

  test('hold-to-reveal shows actual word', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    expect(word).toBeTruthy()
    expect(word).not.toMatch(/^[•]+$/) // not masked
  })

  test('release hides word again', async ({ cleanPage: page }) => {
    const revealBtn = page.locator('#hero-reveal-btn')
    await revealBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(100)

    // Word is revealed
    const wordEl = page.locator('#hero-word')
    await expect(wordEl).not.toHaveClass(/hero__word--masked/)

    // Release
    await revealBtn.dispatchEvent('pointerup')
    await page.waitForTimeout(100)

    // Word is masked again
    await expect(wordEl).toHaveClass(/hero__word--masked/)
  })

  test('countdown label is visible', async ({ cleanPage: page }) => {
    await expect(page.locator('#hero-countdown-label')).toBeVisible()
    const text = await page.locator('#hero-countdown-label').textContent()
    expect(text).toMatch(/rotates/)
  })

  test('"I used this word" advances counter and shows new word', async ({ cleanPage: page }) => {
    const wordBefore = await getDisplayedWord(page)

    await page.click('#burn-btn')
    await page.waitForTimeout(200)

    const wordAfter = await getDisplayedWord(page)
    expect(wordAfter).toBeTruthy()
    // After burn, the word should change (different counter)
    expect(wordAfter).not.toBe(wordBefore)
  })

  test('progress bar is visible', async ({ cleanPage: page }) => {
    await expect(page.locator('#hero-progress-bar')).toBeVisible()
  })
})
```

**Step 2: Write verify-input.spec.ts (verify panel)**

```typescript
// e2e/offline/verify-input.spec.ts — Verify panel: word input and result
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord, verifyWord } from '../helpers.js'

test.describe('Verify input panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test', { preset: 'family' })
  })

  test('correct current word shows Verified', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    const result = await verifyWord(page, word)
    expect(result).toBe('valid')
  })

  test('incorrect word shows Failed', async ({ cleanPage: page }) => {
    const result = await verifyWord(page, 'definitelynotaword')
    expect(result).toBe('invalid')
  })

  test('case-insensitive matching', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    const result = await verifyWord(page, word.toUpperCase())
    expect(result).toBe('valid')
  })

  test('Enter key triggers verification', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    await page.fill('#verify-input', word)
    await page.press('#verify-input', 'Enter')

    const resultEl = page.locator('#verify-result')
    await expect(resultEl).not.toBeHidden({ timeout: 3000 })
    await expect(resultEl).toHaveClass(/verify-result--valid/)
  })
})
```

**Step 3: Run tests**

Run: `npx playwright test --project=offline e2e/offline/verification.spec.ts e2e/offline/verify-input.spec.ts`

**Step 4: Commit**

```bash
git add e2e/offline/verification.spec.ts e2e/offline/verify-input.spec.ts
git commit -m "test: add verification display and verify input E2E tests"
```

---

### Task 9: Write offline/duress.spec.ts

**Files:**
- Create: `e2e/offline/duress.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/duress.spec.ts — Duress panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord, verifyWord } from '../helpers.js'

test.describe('Duress panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    // Need at least 2 members for duress to be meaningful
    await createGroup(page, 'Test', { preset: 'family' })
    // Add a simulated member so duress words can be derived
    await page.click('#add-member-btn')
  })

  test('duress panel shows masked word', async ({ cleanPage: page }) => {
    const duressWord = page.locator('#duress-word')
    await expect(duressWord).toBeVisible()
    const text = await duressWord.textContent()
    expect(text).toMatch(/^[•]+$/)
  })

  test('hold-to-reveal shows duress word', async ({ cleanPage: page }) => {
    const holdBtn = page.locator('#duress-hold-btn')
    await holdBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(600) // duress reveal has a delay

    const duressWord = page.locator('#duress-word')
    await expect(duressWord).not.toHaveClass(/duress-word--masked/)
    const text = await duressWord.textContent()
    expect(text).toBeTruthy()
    expect(text).not.toMatch(/^[•]+$/)

    await holdBtn.dispatchEvent('pointerup')
  })

  test('duress word differs from verification word', async ({ cleanPage: page }) => {
    const verificationWord = await getDisplayedWord(page)

    // Reveal duress word
    const holdBtn = page.locator('#duress-hold-btn')
    await holdBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(600)
    const duressWord = await page.locator('#duress-word').textContent()
    await holdBtn.dispatchEvent('pointerup')

    expect(duressWord).toBeTruthy()
    expect(duressWord!.trim()).not.toBe(verificationWord)
  })
})
```

**Step 2: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/duress.spec.ts
git add e2e/offline/duress.spec.ts
git commit -m "test: add duress panel E2E tests"
```

---

### Task 10: Write offline/members.spec.ts

**Files:**
- Create: `e2e/offline/members.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/members.spec.ts — Members panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Members panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Team')
  })

  test('shows "You" for local identity', async ({ cleanPage: page }) => {
    await expect(page.locator('.member-item__pubkey:text("You")')).toBeVisible()
  })

  test('admin sees remove buttons', async ({ cleanPage: page }) => {
    await expect(page.locator('.member-item__remove')).toBeVisible()
  })

  test('add member increases member count', async ({ cleanPage: page }) => {
    const countBefore = await page.locator('.member-item').count()
    await page.click('#add-member-btn')
    const countAfter = await page.locator('.member-item').count()
    expect(countAfter).toBe(countBefore + 1)
  })

  test('remove member triggers confirm and removes', async ({ cleanPage: page }) => {
    // Add a member first
    await page.click('#add-member-btn')
    const countBefore = await page.locator('.member-item').count()

    // Click remove on the second member (not "You")
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })
    const removeButtons = page.locator('.member-item__remove')
    // Click the last remove button (the added member, not self)
    await removeButtons.last().click()

    await page.waitForTimeout(300) // state update + re-render
    const countAfter = await page.locator('.member-item').count()
    expect(countAfter).toBe(countBefore - 1)
  })

  test('invite button opens invite modal', async ({ cleanPage: page }) => {
    await page.click('#invite-btn')
    await expect(page.locator('#invite-modal[open]')).toBeVisible()
  })
})
```

**Step 2: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/members.spec.ts
git add e2e/offline/members.spec.ts
git commit -m "test: add members panel E2E tests"
```

---

### Task 11: Write offline/settings.spec.ts

**Files:**
- Create: `e2e/offline/settings.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/settings.spec.ts — Settings panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, openSettings, setEncodingFormat, getDisplayedWord } from '../helpers.js'

test.describe('Settings panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test', { preset: 'family' })
  })

  test('theme toggle switches dark to light', async ({ cleanPage: page }) => {
    // App starts in dark mode (no data-theme attribute)
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light')

    // Find and click theme toggle (in header)
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('theme persists across reload', async ({ cleanPage: page }) => {
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('encoding format change: words to PIN', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'pin')
    // The hero word should now be a numeric PIN
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^\d+$/) // all digits
  })

  test('encoding format change: words to hex', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'hex')
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^[0-9a-f]+$/i) // hex string
  })

  test('encoding format change updates hero display immediately', async ({ cleanPage: page }) => {
    const wordBefore = await getDisplayedWord(page)
    await setEncodingFormat(page, 'pin')
    const wordAfter = await getDisplayedWord(page)
    // Same counter but different encoding — should be different strings
    expect(wordAfter).not.toBe(wordBefore)
  })

  test('word count change (1 to 2)', async ({ cleanPage: page }) => {
    await openSettings(page)
    // Word count buttons only visible when encoding is 'words'
    const word1 = await getDisplayedWord(page)
    expect(word1.split(' ').length).toBe(1)

    await page.click('[data-words="2"]')
    await page.waitForTimeout(200)
    const word2 = await getDisplayedWord(page)
    expect(word2.split(' ').length).toBe(2)
  })
})
```

**Step 2: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/settings.spec.ts
git add e2e/offline/settings.spec.ts
git commit -m "test: add settings panel E2E tests"
```

---

### Task 12: Write offline/call-simulation.spec.ts

**Files:**
- Create: `e2e/offline/call-simulation.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/call-simulation.spec.ts — Call verification demo tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Call simulation', () => {
  test('verify call button shown for 2+ member groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Pair')
    // Add a second member
    await page.click('#add-member-btn')
    await expect(page.locator('#hero-call-btn')).toBeVisible()
  })

  test('verify call button NOT shown for single member group', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Solo')
    await expect(page.locator('#hero-call-btn')).not.toBeVisible()
  })

  test('call demo view: scenario tabs visible', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    // Navigate to call demo via header tab or hash
    await page.goto('/#call')
    await page.waitForTimeout(500)
    // The call demo should show scenario buttons
    await expect(page.locator('text=Insurance')).toBeVisible()
    await expect(page.locator('text=Pickup')).toBeVisible()
    await expect(page.locator('text=Rideshare')).toBeVisible()
  })

  test('call demo shows directional words (caller ≠ receiver)', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await page.goto('/#call')
    await page.waitForTimeout(500)

    // Both caller and agent sections should be visible
    const callerWord = page.locator('.call-card').first().locator('.call-word')
    const agentWord = page.locator('.call-card').last().locator('.call-word')

    await expect(callerWord).toBeVisible()
    await expect(agentWord).toBeVisible()

    const callerText = await callerWord.textContent()
    const agentText = await agentWord.textContent()
    expect(callerText).toBeTruthy()
    expect(agentText).toBeTruthy()
    // Directional: caller and receiver should see DIFFERENT words
    expect(callerText).not.toBe(agentText)
  })
})
```

**Step 2: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/call-simulation.spec.ts
git add e2e/offline/call-simulation.spec.ts
git commit -m "test: add call simulation E2E tests"
```

---

### Task 13: Write offline/storage.spec.ts

**Files:**
- Create: `e2e/offline/storage.spec.ts`

**Step 1: Write the spec**

```typescript
// e2e/offline/storage.spec.ts — State persistence and PIN lock
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getGroupNames } from '../helpers.js'

test.describe('Storage and persistence', () => {
  test('state persists across page reload', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Persistent Group')

    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })

    const groups = await getGroupNames(page)
    expect(groups).toContain('Persistent Group')
  })

  test('identity persists across reload', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Memorised')

    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })

    await expect(page.locator('.identity-badge__name')).toHaveText('Memorised')
  })
})
```

**Step 2: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/storage.spec.ts
git add e2e/offline/storage.spec.ts
git commit -m "test: add storage persistence E2E tests"
```

---

### Task 14: Write offline/beacons.spec.ts and offline/liveness.spec.ts

**Files:**
- Create: `e2e/offline/beacons.spec.ts`
- Create: `e2e/offline/liveness.spec.ts`

**Step 1: Write beacons.spec.ts**

Beacons are only visible in online mode, so these tests create an online group.

```typescript
// e2e/offline/beacons.spec.ts — Beacon panel tests (online mode group, no actual relay)
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Beacons panel', () => {
  test('beacon panel hidden for offline groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Offline Group', { mode: 'offline' })
    await expect(page.locator('#beacon-container')).toBeHidden()
  })

  test('beacon panel visible for online groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Online Group', { mode: 'online' })
    await expect(page.locator('#beacon-container')).not.toBeHidden()
  })
})
```

**Step 2: Write liveness.spec.ts**

```typescript
// e2e/offline/liveness.spec.ts — Liveness panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Liveness panel', () => {
  test('liveness panel hidden for offline groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Offline Group', { mode: 'offline' })
    await expect(page.locator('#liveness-container')).toBeHidden()
  })

  test('liveness panel visible for online groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Online Group', { mode: 'online' })
    await expect(page.locator('#liveness-container')).not.toBeHidden()
  })
})
```

**Step 3: Run and commit**

```bash
npx playwright test --project=offline e2e/offline/beacons.spec.ts e2e/offline/liveness.spec.ts
git add e2e/offline/beacons.spec.ts e2e/offline/liveness.spec.ts
git commit -m "test: add beacon and liveness panel E2E tests"
```

---

### Task 15: Write online/sync-join.spec.ts (first online test with mock relay)

**Files:**
- Create: `e2e/online/sync-join.spec.ts`

This is the first test that uses the mock relay. It verifies two users can connect, create a group, and sync via relay.

**Step 1: Write the spec**

```typescript
// e2e/online/sync-join.spec.ts — Two-user sync via mock relay
import { test, expect } from '../fixtures.js'
import { loginOffline, loginWithNsec, createGroup, createInvite, seedRelayUrl } from '../helpers.js'

// Use demo account nsecs for deterministic keys
const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'
const BOB_NSEC = 'nsec1hszs2j8elt78kq6ewresrxfallpc6qvf0p33usgy9ujdkgu0mcesd4qryw'

test.describe('Online sync: join', () => {
  test('User A creates online group, User B joins via invite and relay', async ({
    browser,
    mockRelay,
  }) => {
    const relayUrl = mockRelay.url

    // User A: create context, seed relay, login, create online group
    const ctxA = await browser.newContext()
    const pageA = await ctxA.newPage()
    await seedRelayUrl(pageA, relayUrl)
    await pageA.goto('/')
    await loginWithNsec(pageA, ALICE_NSEC)
    await createGroup(pageA, 'Synced Team', { mode: 'online' })

    // Give sync a moment to connect
    await pageA.waitForTimeout(1000)

    // User A creates invite
    const { payload, confirmCode } = await createInvite(pageA)

    // User B: create context, seed relay, login, accept invite
    const ctxB = await browser.newContext()
    const pageB = await ctxB.newPage()
    await seedRelayUrl(pageB, relayUrl)
    await pageB.goto('/')
    await loginWithNsec(pageB, BOB_NSEC)

    // Accept invite via modal
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]')
    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForSelector('#app-modal:not([open])', { timeout: 5000 })

    // Both should see the group
    await expect(pageB.locator('.group-list__name')).toHaveText('Synced Team')

    // Wait for sync event to propagate
    await pageB.waitForTimeout(2000)

    // User A should eventually see "New member joined" toast
    // (This depends on relay propagation — might need adjustment)

    await ctxA.close()
    await ctxB.close()
  })
})
```

**Step 2: Run test**

Run: `npx playwright test --project=online e2e/online/sync-join.spec.ts`

**Step 3: Commit**

```bash
git add e2e/online/sync-join.spec.ts
git commit -m "test: add online sync join E2E test with mock relay"
```

---

### Task 16: Write remaining online sync tests

**Files:**
- Create: `e2e/online/relay-connect.spec.ts`
- Create: `e2e/online/sync-reseed.spec.ts`
- Create: `e2e/online/sync-replay.spec.ts`

**Step 1: Write relay-connect.spec.ts**

```typescript
// e2e/online/relay-connect.spec.ts — Relay connection status
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, seedRelayUrl } from '../helpers.js'

test.describe('Relay connection', () => {
  test('status indicator shows connected after creating online group', async ({
    cleanPage: page,
    mockRelay,
  }) => {
    await seedRelayUrl(page, mockRelay.url)
    await page.goto('/')
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Online', { mode: 'online' })
    await page.waitForTimeout(1000)

    // The header should show a relay status indicator
    await expect(page.locator('#relay-status')).toBeVisible()
  })
})
```

**Step 2: Write sync-reseed.spec.ts**

```typescript
// e2e/online/sync-reseed.spec.ts — Reseed propagation
import { test, expect } from '../fixtures.js'
import { loginWithNsec, createGroup, createInvite, openSettings, seedRelayUrl, getDisplayedWord } from '../helpers.js'

const ALICE_NSEC = 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5'
const BOB_NSEC = 'nsec1hszs2j8elt78kq6ewresrxfallpc6qvf0p33usgy9ujdkgu0mcesd4qryw'

test.describe('Online sync: reseed', () => {
  test('reseed propagates to other members', async ({ browser, mockRelay }) => {
    const relayUrl = mockRelay.url

    // Setup: Alice creates group, Bob joins
    const ctxA = await browser.newContext()
    const pageA = await ctxA.newPage()
    await seedRelayUrl(pageA, relayUrl)
    await pageA.goto('/')
    await loginWithNsec(pageA, ALICE_NSEC)
    await createGroup(pageA, 'Rekey Test', { mode: 'online' })
    await pageA.waitForTimeout(1000)

    const { payload, confirmCode } = await createInvite(pageA)

    const ctxB = await browser.newContext()
    const pageB = await ctxB.newPage()
    await seedRelayUrl(pageB, relayUrl)
    await pageB.goto('/')
    await loginWithNsec(pageB, BOB_NSEC)
    await pageB.evaluate(() => {
      document.dispatchEvent(new CustomEvent('canary:join-group', { detail: {} }))
    })
    await pageB.waitForSelector('#app-modal[open]')
    await pageB.fill('[name="payload"]', payload)
    await pageB.fill('[name="code"]', confirmCode)
    await pageB.click('#modal-form button[type="submit"]')
    await pageB.waitForSelector('#app-modal:not([open])', { timeout: 5000 })

    // Both should now see the same word
    await pageA.waitForTimeout(2000)
    const wordBefore = await getDisplayedWord(pageA)

    // Alice reseeds
    await openSettings(pageA)
    page.once('dialog', async (d) => await d.accept())
    await pageA.click('text=Rotate Seed')
    await pageA.waitForTimeout(1000)

    const wordAfterA = await getDisplayedWord(pageA)
    expect(wordAfterA).not.toBe(wordBefore)

    // Wait for propagation
    await pageB.waitForTimeout(3000)

    // Bob should now show the new word (same as Alice)
    const wordAfterB = await getDisplayedWord(pageB)
    expect(wordAfterB).toBe(wordAfterA)

    await ctxA.close()
    await ctxB.close()
  })
})
```

**Step 3: Write sync-replay.spec.ts**

```typescript
// e2e/online/sync-replay.spec.ts — Replay protection tests
import { test, expect } from '../fixtures.js'

test.describe('Replay protection', () => {
  test.fixme('replayed event with same Nostr event ID is ignored', async () => {
    // Requires injecting a duplicate event into the mock relay
  })

  test.fixme('replayed opId in different event is ignored', async () => {
    // Requires crafting two events with the same opId
  })

  test.fixme('future timestamp (>60s ahead) is rejected', async () => {
    // Requires crafting an event with manipulated timestamp
  })

  test.fixme('stale timestamp (>300s old) is rejected', async () => {
    // Requires crafting an event with old timestamp
  })
})
```

**Step 4: Commit**

```bash
git add e2e/online/
git commit -m "test: add online relay, reseed sync, and replay protection E2E tests"
```

---

### Task 17: Write protocol feature parity tests

**Files:**
- Create: `e2e/protocol/encoding-formats.spec.ts`
- Create: `e2e/protocol/multi-word.spec.ts`
- Create: `e2e/protocol/tolerance-window.spec.ts`
- Create: `e2e/protocol/duress-collision.spec.ts`
- Create: `e2e/protocol/dms.spec.ts`
- Create: `e2e/protocol/member-picker.spec.ts`
- Create: `e2e/protocol/epoch-tracking.spec.ts`
- Create: `e2e/protocol/invite-security.spec.ts`
- Create: `e2e/protocol/nostr-events.spec.ts`

**Step 1: Write encoding-formats.spec.ts**

```typescript
// e2e/protocol/encoding-formats.spec.ts — All encoding formats work E2E
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, setEncodingFormat, getDisplayedWord, verifyWord } from '../helpers.js'

test.describe('Encoding formats', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Encoding Test', { preset: 'family' })
  })

  test('words encoding shows readable word', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    expect(word).toBeTruthy()
    expect(word).toMatch(/^[a-z]+$/i) // alphabetic
  })

  test('PIN encoding shows digits', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'pin')
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^\d+$/)
  })

  test('hex encoding shows hex string', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'hex')
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^[0-9a-f]+$/i)
  })

  test('switching encoding updates display immediately', async ({ cleanPage: page }) => {
    const wordAsWords = await getDisplayedWord(page)
    await setEncodingFormat(page, 'pin')
    const wordAsPin = await getDisplayedWord(page)
    expect(wordAsPin).not.toBe(wordAsWords)
  })

  test('verification works with current encoding', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'pin')
    const pin = await getDisplayedWord(page)
    const result = await verifyWord(page, pin)
    expect(result).toBe('valid')
  })
})
```

**Step 2: Write multi-word.spec.ts**

```typescript
// e2e/protocol/multi-word.spec.ts — Multi-word phrase verification
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, openSettings, getDisplayedWord, verifyWord } from '../helpers.js'

test.describe('Multi-word phrases', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Multi Word', { preset: 'family' })
  })

  test('1-word: single word displayed', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    expect(word.split(/\s+/).length).toBe(1)
  })

  test('2-word phrase displayed correctly', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-words="2"]')
    await page.waitForTimeout(200)

    const phrase = await getDisplayedWord(page)
    expect(phrase.split(/\s+/).length).toBe(2)
  })

  test('3-word phrase displayed correctly', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-words="3"]')
    await page.waitForTimeout(200)

    const phrase = await getDisplayedWord(page)
    expect(phrase.split(/\s+/).length).toBe(3)
  })

  test('multi-word verification: full phrase must match', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-words="2"]')
    await page.waitForTimeout(200)

    const phrase = await getDisplayedWord(page)
    const result = await verifyWord(page, phrase)
    expect(result).toBe('valid')
  })

  test('multi-word: partial phrase fails', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-words="2"]')
    await page.waitForTimeout(200)

    const phrase = await getDisplayedWord(page)
    const firstWord = phrase.split(/\s+/)[0]
    const result = await verifyWord(page, firstWord)
    expect(result).toBe('invalid')
  })
})
```

**Step 3: Write remaining protocol specs (stubs)**

```typescript
// e2e/protocol/tolerance-window.spec.ts
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord, verifyWord } from '../helpers.js'

test.describe('Tolerance window', () => {
  test('current counter word is valid', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Tolerance')
    const word = await getDisplayedWord(page)
    const result = await verifyWord(page, word)
    expect(result).toBe('valid')
  })

  test.fixme('±1 counter word is valid with tolerance=1', async () => {
    // Need to derive the previous counter's word via SDK and verify it
  })

  test.fixme('±2 counter word is invalid with tolerance=1', async () => {
    // Need to derive counter-2 word and verify it fails
  })
})
```

```typescript
// e2e/protocol/duress-collision.spec.ts
import { test } from '../fixtures.js'

test.describe('Duress collision avoidance', () => {
  test.fixme('duress word never equals verification word', async () => {
    // Tested at unit level; E2E would need SDK access in browser
  })

  test.fixme('duress word never equals tolerance-window words', async () => {})

  test.fixme('collision avoidance retry produces non-colliding word', async () => {})
})
```

```typescript
// e2e/protocol/dms.spec.ts
import { test } from '../fixtures.js'

test.describe('Dead man\'s switch', () => {
  test.fixme('heartbeat interval is configurable', async () => {})
  test.fixme('missed heartbeat shows warning after grace period', async () => {})
  test.fixme('DMS trigger: absent member flagged', async () => {})
  test.fixme('DMS trigger: duress alert auto-sent', async () => {})
})
```

```typescript
// e2e/protocol/member-picker.spec.ts
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup } from '../helpers.js'

test.describe('Member picker', () => {
  test('2 members: verify call starts directly', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Pair')
    await page.click('#add-member-btn')
    // With 2 members and 1 other, call should start directly (no picker)
    await page.click('#hero-call-btn')
    await expect(page.locator('.call-verify')).toBeVisible({ timeout: 3000 })
  })

  test.fixme('3+ members: picker modal shown', async () => {})
  test.fixme('picker: selecting member starts call with that member', async () => {})
})
```

```typescript
// e2e/protocol/epoch-tracking.spec.ts
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, openSettings } from '../helpers.js'

test.describe('Epoch tracking', () => {
  test.fixme('new group starts at epoch 0', async () => {
    // Need to inspect state — could use page.evaluate
  })

  test.fixme('reseed increments epoch', async () => {})
  test.fixme('invite with old epoch rejected', async () => {})
  test.fixme('seed change requires strictly newer epoch', async () => {})
})
```

```typescript
// e2e/protocol/invite-security.spec.ts
import { test } from '../fixtures.js'

test.describe('Invite security', () => {
  test.fixme('tampered payload (modified seed) — signature invalid', async () => {})
  test.fixme('tampered payload (modified members) — signature invalid', async () => {})
  test.fixme('invite from non-admin pubkey rejected', async () => {})
  test.fixme('expired invite rejected', async () => {})
  test.fixme('future invite (>5min clock skew) rejected', async () => {})
  test.fixme('wrong protocol version rejected', async () => {})
  test.fixme('missing inviterPubkey rejected', async () => {})
  test.fixme('missing inviterSig rejected', async () => {})
})
```

```typescript
// e2e/protocol/nostr-events.spec.ts
import { test } from '../fixtures.js'

test.describe('NIP-CANARY Nostr events', () => {
  test.fixme('kind 38800: Group event published on create', async () => {})
  test.fixme('kind 28800: Seed distribution event', async () => {})
  test.fixme('kind 38801: Member update event', async () => {})
  test.fixme('kind 28801: Re-seed event', async () => {})
  test.fixme('kind 28802: Word used / duress alert event', async () => {})
  test.fixme('kind 20800: Encrypted location beacon event', async () => {})
})
```

**Step 4: Commit**

```bash
git add e2e/protocol/
git commit -m "test: add protocol feature parity E2E tests (many fixme stubs)"
```

---

### Task 18: Run full suite and record baseline

**Step 1: Run all tests**

Run:
```bash
npx playwright test 2>&1 | tee e2e-baseline.txt
```

This runs all three projects (offline, online, protocol). Record which tests pass, fail, and are skipped/fixme.

**Step 2: Fix any infrastructure issues**

If tests fail due to selector mismatches, timing issues, or fixture problems (NOT app bugs), fix the test infrastructure. App bugs are the goal — we want them to fail.

**Step 3: Commit baseline results**

```bash
git add -A
git commit -m "test: record E2E baseline — N passed, M failed, K fixme"
```

(Replace N, M, K with actual counts.)

---

### Task 19: Fix discovered app bugs

After running the full suite, bugs will be revealed. Fix each one individually:

**Step 1: Triage failures**

Sort failures into categories:
- **Invite flow bugs** — the 404 / hash handling issue
- **Verification display bugs** — wrong word shown, encoding mismatch
- **Sync bugs** — relay connection, message propagation
- **UX issues** — missing error messages, silent failures

**Step 2: Fix each bug with a focused commit**

For each bug:
1. Confirm the failing test reproduces it
2. Fix the app code
3. Re-run the specific test
4. Commit: `fix: <description of what was fixed>`

**Step 3: Re-run full suite to confirm no regressions**

Run: `npx playwright test`

---

### Task 20: Add CI integration

**Files:**
- Create: `.github/workflows/e2e.yml`

**Step 1: Write the workflow**

```yaml
name: E2E Tests
on:
  pull_request:
  push:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: e2e/playwright-report/
          retention-days: 7
```

**Step 2: Commit**

```bash
git add .github/workflows/e2e.yml
git commit -m "ci: add Playwright E2E test workflow"
```
