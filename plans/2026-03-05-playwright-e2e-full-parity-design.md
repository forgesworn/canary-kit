# Design: Playwright E2E Test Suite — Full Protocol Parity

**Date:** 2026-03-05
**Status:** Approved
**Scope:** Test-first approach — write comprehensive E2E tests for all protocol features, then fix failures

## Goal

Create a Playwright test suite that exercises every feature described in the CANARY protocol spec (CANARY.md + NIP-CANARY.md) through the demo app UI. Tests serve as the living specification for "fully working". Features not yet in the UI get `test.fixme()` stubs that become the implementation backlog.

## Approach

- **Test-first, fix after** — write all tests first, let failures reveal what's broken
- **Multi-context** — use Playwright's multiple browser contexts to simulate two users in the same test
- **Mock relay** — lightweight in-process NIP-01 WebSocket server for online mode tests
- **localStorage injection** — pre-seed settings (relay URLs, theme) before app loads, no app code changes needed

## Test Infrastructure

### Directory Structure

```
e2e/
├── playwright.config.ts          # Config: baseURL, webServer, projects
├── mock-relay.ts                 # Lightweight NIP-01 WebSocket relay (~60 lines)
├── fixtures.ts                   # Shared fixtures: app page, two-user setup, relay
├── helpers.ts                    # Reusable actions: createGroup, login, acceptInvite
│
├── offline/                      # Offline mode tests (no relay needed)
│   ├── login.spec.ts             # Login screen: offline start, nsec, demo accounts, NIP-07
│   ├── group-lifecycle.spec.ts   # Create, rename, delete groups
│   ├── invite-flow.spec.ts       # Create invite → share link → join (two contexts)
│   ├── verification.spec.ts      # Hero panel: word display, reveal, rotation, burn
│   ├── verify-input.spec.ts      # Verify panel: valid/invalid/duress word check
│   ├── duress.spec.ts            # Duress panel: hold-to-reveal, alert dispatch
│   ├── members.spec.ts           # Member list, add, remove, admin checks
│   ├── settings.spec.ts          # Theme, encoding format, rotation interval, PIN
│   ├── call-simulation.spec.ts   # Call verify overlay, directional pairs
│   ├── beacons.spec.ts           # Beacon panel, map rendering, geolocation mock
│   ├── liveness.spec.ts          # Liveness panel, check-in display
│   └── storage.spec.ts           # PIN lock, auto-lock, state persistence across reload
│
├── online/                       # Online mode tests (mock relay)
│   ├── relay-connect.spec.ts     # Connect to relay, status indicator updates
│   ├── sync-join.spec.ts         # User A creates → User B joins via relay sync
│   ├── sync-reseed.spec.ts       # Reseed propagates to other members
│   ├── sync-member-add.spec.ts   # Member addition syncs across devices
│   ├── sync-member-remove.spec.ts# Member removal + forced reseed
│   ├── sync-counter.spec.ts      # Counter advance/burn syncs
│   ├── sync-liveness.spec.ts     # Liveness check-ins propagate
│   ├── sync-duress-alert.spec.ts # Duress alerts propagate with opId
│   ├── sync-beacon.spec.ts       # Beacon broadcasts propagate
│   └── sync-replay.spec.ts       # Replay protection: opId dedup, freshness gate
│
└── protocol/                     # Full protocol feature parity (test.fixme for unbuilt)
    ├── encoding-formats.spec.ts  # Words, PIN, hex — all encodings work E2E
    ├── multi-word.spec.ts        # 2-word and 3-word phrase verification
    ├── tolerance-window.spec.ts  # ±1 tolerance matches, ±2 fails
    ├── directional-pairs.spec.ts # Both parties see different words in call
    ├── duress-collision.spec.ts  # Duress word never collides with verification word
    ├── dms.spec.ts               # Dead man's switch: heartbeat, grace, trigger
    ├── session-presets.spec.ts   # Call and handoff presets work correctly
    ├── member-picker.spec.ts     # 3+ member group: picker shown for verify call
    ├── epoch-tracking.spec.ts    # Epoch increments on reseed, validated on invite
    ├── invite-security.spec.ts   # Schnorr sig, expiry, replay, stale nonce rejection
    └── nostr-events.spec.ts      # NIP-CANARY event kinds published correctly
```

### Playwright Config

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run demo',
    port: 8787,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'offline', testDir: './e2e/offline' },
    { name: 'online', testDir: './e2e/online' },
    { name: 'protocol', testDir: './e2e/protocol' },
  ],
  use: {
    baseURL: 'http://localhost:8787',
  },
})
```

### Mock Relay (mock-relay.ts)

Lightweight NIP-01 compliant WebSocket server:
- Handles `EVENT` — stores event, broadcasts to matching subscriptions
- Handles `REQ` — filters stored events, sends matches, sends EOSE
- Handles `CLOSE` — removes subscription
- Started in `globalSetup` for online test project
- ~60 lines of code using `ws` package
- Listens on random port, URL passed via env var

### Fixtures (fixtures.ts)

```typescript
// Key fixtures provided to all tests:

type Fixtures = {
  /** Pre-configured page with offline identity */
  offlinePage: Page

  /** Two isolated browser contexts for multi-user tests */
  twoUsers: { pageA: Page; pageB: Page }

  /** Mock relay URL (online tests only) */
  relayUrl: string
}
```

### Helpers (helpers.ts)

Reusable test actions:

| Helper | Description |
|--------|-------------|
| `loginOffline(page, name)` | Fill name, click Start |
| `loginWithNsec(page, nsec)` | Paste nsec, submit |
| `loginWithDemo(page, name)` | Click demo account button |
| `createGroup(page, name, preset?)` | Sidebar → new group modal → create |
| `createInvite(page)` | Click Invite, extract payload + confirm code from modal |
| `acceptInviteViaLink(page, payload, code)` | Navigate to `/#join/...`, fill code, submit |
| `acceptInviteViaModal(page, payload, code)` | Open join modal, paste payload, fill code, submit |
| `getDisplayedWord(page)` | Hold reveal button, read hero word |
| `verifyWord(page, word)` | Type in verify panel, click Verify, return status |
| `switchGroup(page, name)` | Click group in sidebar |
| `getGroupNames(page)` | Read all group names from sidebar |
| `waitForSync(page)` | Wait for sync flash indicator |
| `seedRelayUrl(page, url)` | Inject relay URL into localStorage settings before load |
| `assertNoConsoleErrors(page)` | Fail if any `console.error` was logged |

## Test Scenarios

### Offline Tests

#### login.spec.ts
- [ ] Shows login screen with no prior state
- [ ] Offline start: creates identity, shows main app
- [ ] Offline start: sets display name
- [ ] nsec login: valid nsec creates identity
- [ ] nsec login: invalid nsec shows error
- [ ] Demo accounts: clicking loads correct identity
- [ ] NIP-07: button shown when extension detected (mock window.nostr)
- [ ] Preserves `#join/...` hash through login flow

#### group-lifecycle.spec.ts
- [ ] Create group with family preset
- [ ] Create group with field-ops preset
- [ ] Create group with enterprise preset
- [ ] Group appears in sidebar after creation
- [ ] Rename group via settings
- [ ] Delete group removes from sidebar
- [ ] Deleting active group clears main panel
- [ ] Multiple groups: switching updates hero word

#### invite-flow.spec.ts (two contexts)
- [ ] Create invite shows QR + confirm code + copy buttons
- [ ] Copy Link copies correct URL to clipboard
- [ ] User B opens invite link → sees login → after login, join modal appears with pre-filled payload
- [ ] User B enters correct confirm code → joins successfully
- [ ] User B enters wrong confirm code → error shown
- [ ] User B uses expired invite → error shown
- [ ] Replay: same invite nonce rejected on second use
- [ ] Stale invite (older issuedAt than latest) rejected
- [ ] Both users see same verification word after join
- [ ] Invite from non-admin rejected

#### verification.spec.ts
- [ ] Hero panel shows masked word by default
- [ ] Hold-to-reveal shows actual word
- [ ] Release hides word again
- [ ] Countdown timer counts down
- [ ] Word changes when counter rotates
- [ ] "I used this word" advances counter, shows new word
- [ ] Progress bar reflects time elapsed

#### verify-input.spec.ts
- [ ] Correct current word → "Verified" (green ✓)
- [ ] Incorrect word → "Failed" (red ✗)
- [ ] Duress word → "Duress" (amber ⚠) + alert dispatched
- [ ] Previous word (within tolerance) → "Verified"
- [ ] Word from 2+ rotations ago → "Failed"
- [ ] Case-insensitive matching
- [ ] Enter key triggers verification

#### duress.spec.ts
- [ ] Duress panel shows masked word
- [ ] Hold-to-reveal shows duress word
- [ ] Duress word differs from verification word
- [ ] Silent dispatch: duress alert broadcast without visual alarm to subject

#### members.spec.ts
- [ ] Shows "You" for local identity
- [ ] Shows member names for named members
- [ ] Admin sees remove buttons
- [ ] Non-admin doesn't see remove buttons
- [ ] Remove member triggers confirm dialog
- [ ] After removal: seed rotated, epoch incremented
- [ ] Add Member creates random pubkey (demo mode)
- [ ] Invite button opens invite modal

#### settings.spec.ts
- [ ] Theme toggle: dark ↔ light
- [ ] Theme persists across reload
- [ ] Encoding format change: words → pin → hex
- [ ] Encoding format change updates hero display
- [ ] Rotation interval change
- [ ] Word count change (1, 2, 3)
- [ ] Relay list: add relay
- [ ] Relay list: remove relay
- [ ] Group export/import JSON

#### call-simulation.spec.ts
- [ ] Verify Call button shown for 2+ member groups
- [ ] Call overlay shows directional words (caller ≠ receiver)
- [ ] Words rotate on 30s interval
- [ ] Duress tap gesture triggers silent alert

#### beacons.spec.ts
- [ ] Beacon panel renders map (MapLibre)
- [ ] Start broadcast button activates geolocation watch
- [ ] Mocked geolocation: marker appears on map
- [ ] Stop broadcast clears watch
- [ ] Precision selector changes geohash level

#### liveness.spec.ts
- [ ] Liveness panel shows check-in timeline
- [ ] Manual check-in button sends liveness-checkin
- [ ] Interval selector changes heartbeat frequency

#### storage.spec.ts
- [ ] State persists across page reload
- [ ] Enable PIN → lock screen shown on reload
- [ ] Correct PIN → unlocks state
- [ ] Wrong PIN → error, exponential backoff
- [ ] Auto-lock after configured timeout
- [ ] PIN disable removes lock

### Online Tests (Mock Relay)

#### relay-connect.spec.ts
- [ ] Status indicator shows connected after relay join
- [ ] Status shows disconnected when relay drops

#### sync-join.spec.ts
- [ ] User A creates online group with relay
- [ ] User B joins via invite, relay receives member-join
- [ ] User A sees toast: "New member joined"

#### sync-reseed.spec.ts
- [ ] User A reseeds → User B receives new seed
- [ ] Both users show same new verification word
- [ ] Epoch incremented on both sides

#### sync-member-add.spec.ts
- [ ] User A adds member → User B sees updated member list

#### sync-member-remove.spec.ts
- [ ] User A removes User C → fail-closed: no broadcast, local reseed

#### sync-counter.spec.ts
- [ ] User A burns word → User B counter advances

#### sync-liveness.spec.ts
- [ ] User A check-in → User B sees check-in in liveness panel
- [ ] Stale check-in (>5 min old) ignored
- [ ] Duplicate opId check-in ignored

#### sync-duress-alert.spec.ts
- [ ] Duress alert propagates to other members
- [ ] opId dedup prevents double-processing
- [ ] Freshness gate rejects stale alerts

#### sync-beacon.spec.ts
- [ ] Beacon broadcast received by other members

#### sync-replay.spec.ts
- [ ] Replayed event (same Nostr event ID) ignored
- [ ] Replayed opId (different event, same opId) ignored
- [ ] Future timestamp (>60s ahead) rejected
- [ ] Stale timestamp (>300s old) rejected

### Protocol Feature Parity Tests

These use `test.fixme()` for features not yet in the UI:

#### encoding-formats.spec.ts
- [ ] Words encoding: readable word shown
- [ ] PIN encoding: 6-digit code shown
- [ ] `test.fixme` Hex encoding: hex string shown
- [ ] Switching encoding updates display immediately
- [ ] Both users with same encoding see same value

#### multi-word.spec.ts
- [ ] 1-word: single word displayed
- [ ] `test.fixme` 2-word: space-separated phrase
- [ ] `test.fixme` 3-word: space-separated phrase
- [ ] `test.fixme` Multi-word verification: all words must match

#### tolerance-window.spec.ts
- [ ] Current counter word → valid
- [ ] ±1 counter word → valid (tolerance=1)
- [ ] ±2 counter word → invalid (tolerance=1)

#### directional-pairs.spec.ts
- [ ] Caller and receiver see different words
- [ ] Each side can verify the other's word
- [ ] Words rotate together on same interval

#### duress-collision.spec.ts
- [ ] Duress word never equals verification word
- [ ] Duress word never equals tolerance-window words
- [ ] Collision avoidance: suffix retry produces non-colliding word

#### dms.spec.ts (all test.fixme — not yet implemented)
- [ ] `test.fixme` Heartbeat interval configurable
- [ ] `test.fixme` Missed heartbeat shows warning after grace period
- [ ] `test.fixme` DMS trigger: absent member flagged
- [ ] `test.fixme` DMS trigger: duress alert auto-sent

#### session-presets.spec.ts
- [ ] Call preset: 30s rotation, ±1 tolerance
- [ ] `test.fixme` Handoff preset: single-use, 0 tolerance
- [ ] `test.fixme` Preset selector in UI

#### member-picker.spec.ts
- [ ] 2 members: verify call starts directly
- [ ] `test.fixme` 3+ members: picker modal shown
- [ ] `test.fixme` Picker: selecting member starts call with that member

#### epoch-tracking.spec.ts
- [ ] New group starts at epoch 0
- [ ] Reseed increments epoch
- [ ] Invite with old epoch rejected
- [ ] Seed change requires strictly newer epoch

#### invite-security.spec.ts
- [ ] Valid Schnorr signature accepted
- [ ] Tampered payload (modified seed) → signature invalid
- [ ] Tampered payload (modified members) → signature invalid
- [ ] Invite from non-admin pubkey → rejected
- [ ] Expired invite → rejected
- [ ] Future invite (>5min clock skew) → rejected
- [ ] Wrong protocol version → rejected
- [ ] Missing inviterPubkey → rejected
- [ ] Missing inviterSig → rejected

#### nostr-events.spec.ts (all test.fixme — not yet implemented)
- [ ] `test.fixme` Kind 38800: Group event published on create
- [ ] `test.fixme` Kind 28800: Seed distribution event
- [ ] `test.fixme` Kind 38801: Member update event
- [ ] `test.fixme` Kind 28801: Re-seed event
- [ ] `test.fixme` Kind 28802: Word used / duress alert event
- [ ] `test.fixme` Kind 20800: Encrypted location beacon event

## Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.52.0"
  }
}
```

Also need `ws` for the mock relay (already a transitive dep of nostr-tools, but add explicitly if needed).

## Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:offline": "playwright test --project=offline",
    "test:e2e:online": "playwright test --project=online",
    "test:e2e:protocol": "playwright test --project=protocol",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Console Error Detection

Every test automatically fails if `console.error` is logged, via a shared fixture:

```typescript
test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', err => errors.push(err.message))
  // Exposed as page._errors for afterEach assertion
})
```

## Relay URL Injection

For online tests, the mock relay URL is injected via localStorage before the app loads:

```typescript
await page.addInitScript((relayUrl) => {
  const settings = JSON.parse(localStorage.getItem('canary:settings') || '{}')
  settings.defaultRelays = [relayUrl]
  localStorage.setItem('canary:settings', JSON.stringify(settings))
}, mockRelayUrl)
```

## What This Enables

1. **Immediate visibility** into what's broken — run the suite, see red
2. **Implementation backlog** — every `test.fixme` is a feature to build
3. **Regression prevention** — security hardening changes can't silently break flows
4. **CI integration** — run on every PR via GitHub Actions
5. **Feature parity tracking** — count passing vs fixme tests = progress metric
