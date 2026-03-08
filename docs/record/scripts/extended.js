// docs/record/scripts/extended.js — Extended cut (~2min)
//
// Cold open → rewind → setup → invite/sync → reveal → verify →
// duress build-up → duress payoff (split-screen) → beacons →
// liveness → call verification → close.
//
// Both browsers use offline mode. After Alice creates a group, the group state
// is programmatically copied to Bob's localStorage so both share the same seed.

import { injectCursor, showCursor, hideCursor, clickElement, pressAndHold, typeInto } from '../cursor.js'
import { showOverlay, hideOverlay, showCodeOverlay } from '../overlay.js'
import { actLogin, actColdOpen, actRewind, actBeacons, actLiveness } from './acts.js'

export const splitScreen = true

export default async function extended({ alice, bob }, { narrate, pause, waitForIdle }) {
  // ── Act 0: Cold Open (~5s) ─────────────────────────────────

  await actColdOpen({ alice, bob }, { narrate, pause })

  // ── Act 1: Rewind (~3s) ────────────────────────────────────

  await actRewind({ alice, bob }, { pause })

  // ── Login both offline ─────────────────────────────────────

  await actLogin(alice, { pause, waitForIdle }, 'Alice')
  await actLogin(bob, { pause, waitForIdle }, 'Bob')

  // ── Act 2: Create Group (~10s) ─────────────────────────────

  await showOverlay(bob, {
    title: 'Setting up...',
    subtitle: 'Alice creates the group',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  await Promise.all([
    narrate('CANARY is a verification protocol. Create a group, name it, pick a preset, and go.'),
    (async () => {
      await clickElement(alice, '#welcome-create', { moveDuration: 300 })
      await alice.waitForTimeout(200)
    })(),
  ])

  await alice.waitForSelector('input[name="name"]', { timeout: 5000 })
  await typeInto(alice, 'input[name="name"]', 'Family', { moveDuration: 150, typeDelay: 30 })
  await alice.waitForTimeout(150)
  await clickElement(alice, 'button[type="submit"]', { moveDuration: 200 })
  await waitForIdle()
  await alice.waitForTimeout(200)

  // ── Act 3: Invite + sync (~10s) ────────────────────────────

  await Promise.all([
    narrate('Share the invite — QR code, message, Nostr relay. Both devices now share a cryptographic seed. No server involved.'),
    (async () => {
      await clickElement(alice, '#hero-invite-btn', { moveDuration: 200 })
      await alice.waitForTimeout(800)
    })(),
  ])

  // Close invite modal
  await alice.evaluate(() => {
    const dialog = document.querySelector('dialog[open]')
    if (dialog) dialog.close()
  })
  await alice.waitForTimeout(150)

  // Programmatically copy Alice's group state to Bob
  const aliceGroupData = await alice.evaluate(() => {
    const groups = JSON.parse(localStorage.getItem('canary:groups') || '{}')
    const activeGroup = localStorage.getItem('canary:active-group')
    const identity = JSON.parse(localStorage.getItem('canary:identity') || '{}')
    return { groups, activeGroup, alicePubkey: identity.pubkey }
  })

  const bobIdentity = await bob.evaluate(() => localStorage.getItem('canary:identity'))
  const bobPubkey = bobIdentity ? JSON.parse(bobIdentity).pubkey : ''

  if (aliceGroupData.groups && Object.keys(aliceGroupData.groups).length > 0) {
    const mergedGroups = JSON.parse(JSON.stringify(aliceGroupData.groups))
    for (const group of Object.values(mergedGroups)) {
      if (bobPubkey && !group.members.includes(bobPubkey)) {
        group.members.push(bobPubkey)
      }
      // Ensure both members have human-readable names for call verify UI
      if (bobPubkey) {
        group.memberNames = group.memberNames || {}
        group.memberNames[bobPubkey] = 'Bob'
      }
      if (aliceGroupData.alicePubkey) {
        group.memberNames = group.memberNames || {}
        group.memberNames[aliceGroupData.alicePubkey] = group.memberNames[aliceGroupData.alicePubkey] || 'Alice'
      }
    }
    const mergedGroupsJson = JSON.stringify(mergedGroups)

    const aliceContext = alice.context()
    const bobContext = bob.context()

    await aliceContext.addInitScript(({ groups, activeGroup }) => {
      localStorage.setItem('canary:groups', groups)
      if (activeGroup) localStorage.setItem('canary:active-group', activeGroup)
    }, { groups: mergedGroupsJson, activeGroup: aliceGroupData.activeGroup })

    await bobContext.addInitScript(({ groups, activeGroup, identity }) => {
      localStorage.setItem('canary:groups', groups)
      if (activeGroup) localStorage.setItem('canary:active-group', activeGroup)
      if (identity) localStorage.setItem('canary:identity', identity)
    }, { groups: mergedGroupsJson, activeGroup: aliceGroupData.activeGroup, identity: bobIdentity })

    const url = alice.url().split('#')[0]
    await Promise.all([alice.goto(url), bob.goto(url)])
    await Promise.all([
      alice.waitForLoadState('networkidle').catch(() => {}),
      bob.waitForLoadState('networkidle').catch(() => {}),
    ])
    await alice.waitForTimeout(300)

    await injectCursor(alice)
    await showCursor(alice)
    await injectCursor(bob)
    await showCursor(bob)
  }

  await hideOverlay(bob)

  // ── Act 4: Reveal word on both (~8s) ───────────────────────

  await Promise.all([
    narrate('That seed derives a spoken word. Same word, both devices. Hold to reveal — hidden by default, because shoulder-surfing is real.'),
    (async () => {
      await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 150, holdDuration: 1800, side: 'left' })
      await bob.waitForTimeout(100)
      const bobBtn = bob.locator('#hero-reveal-btn').first()
      if (await bobBtn.isVisible().catch(() => false)) {
        await pressAndHold(bob, '#hero-reveal-btn', { moveDuration: 150, holdDuration: 1800, side: 'left' })
      }
    })(),
  ])

  await pause(150)

  // ── Act 5: Verify (~10s) ───────────────────────────────────

  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 100, holdDuration: 250, side: 'left' })
  const aliceWord = await alice.evaluate(() =>
    document.querySelector('.hero__word')?.textContent?.trim() || ''
  )

  await Promise.all([
    narrate('Someone calls claiming to be family. They say the word. Type it in — verified. Cloning a voice doesn\'t help. You need the secret.'),
    (async () => {
      if (aliceWord && !aliceWord.includes('\u2022')) {
        await typeInto(alice, '#verify-input', aliceWord.toLowerCase(), { moveDuration: 150, typeDelay: 30 })
        await clickElement(alice, '#verify-btn', { moveDuration: 150 })
        await alice.waitForTimeout(400)
      }
    })(),
  ])

  // ── Act 6: Duress (~20s) ────────────────────────────────────
  // No duress panel shown — that would reveal the duress word, defeating the
  // purpose. Instead we narrate the concept, then silently read the duress word
  // via a quick right-side reveal and type it into verify.

  await narrate('Now here\'s what no other protocol does. Every member has a personal duress word — derived from the same secret, but different from the verification word. If someone forces you to verify, you speak the duress word instead.')
  await pause(200)

  // Briefly reveal duress word (right side) — too quick for viewer to read
  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 100, holdDuration: 250, side: 'right' })
  const duressWord = await alice.evaluate(() =>
    document.querySelector('.hero__word')?.textContent?.trim() || ''
  )

  await Promise.all([
    narrate('Alice speaks her duress word. Her screen shows failed — the attacker sees nothing unusual. But on Bob\'s device — a silent alert. The group knows. That\'s what you saw at the start.'),
    (async () => {
      if (duressWord && !duressWord.includes('\u2022')) {
        const verifyInput = alice.locator('#verify-input').first()
        if (await verifyInput.isVisible().catch(() => false)) {
          await verifyInput.fill('')
        }
        await typeInto(alice, '#verify-input', duressWord.toLowerCase(), { moveDuration: 150, typeDelay: 30 })
        await clickElement(alice, '#verify-btn', { moveDuration: 150 })
        await alice.waitForTimeout(400)
      }
    })(),
  ])

  // Inject duress alert on Bob's screen (reprise of cold open)
  await bob.evaluate(() => {
    const existing = document.querySelector('.duress-overlay')
    if (existing) existing.remove()

    const overlay = document.createElement('div')
    overlay.className = 'duress-overlay'
    overlay.setAttribute('role', 'alertdialog')

    const content = document.createElement('div')
    content.className = 'duress-overlay__content'

    const icon = document.createElement('div')
    icon.className = 'duress-overlay__icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = '!'

    const title = document.createElement('h1')
    title.className = 'duress-overlay__title'
    title.textContent = 'Alice'

    const subtitle = document.createElement('h2')
    subtitle.className = 'duress-overlay__subtitle'
    subtitle.textContent = 'NEEDS HELP'

    const time = document.createElement('p')
    time.className = 'duress-overlay__time'
    time.textContent = new Date().toLocaleTimeString()

    const dismissBtn = document.createElement('button')
    dismissBtn.className = 'btn btn--lg duress-overlay__dismiss'
    dismissBtn.id = 'duress-dismiss'
    dismissBtn.textContent = "I'm Responding"
    dismissBtn.addEventListener('click', () => {
      overlay.classList.remove('duress-overlay--visible')
      setTimeout(() => overlay.remove(), 300)
    })

    content.append(icon, title, subtitle, time, dismissBtn)
    overlay.appendChild(content)
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('duress-overlay--visible'))
  })
  await bob.waitForTimeout(400)

  await pause(600)
  await clickElement(bob, '#duress-dismiss', { moveDuration: 150 })
  await bob.waitForTimeout(200)

  // ── Act 8: Beacons (~12s) ──────────────────────────────────

  await actBeacons(alice, { narrate, pause })

  // ── Act 9: Liveness (~8s) ─────────────────────────────────

  await actLiveness(alice, { narrate, pause })

  // ── Act 10: Call verification (~15s) ───────────────────────

  await hideCursor(bob)
  await showOverlay(bob, {
    title: 'Call Verification',
    subtitle: 'Insurance, banking, rideshare',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  // Scroll Alice back to hero
  await alice.evaluate(() => {
    const el = document.querySelector('#hero-container')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  await alice.waitForTimeout(200)

  const callBtn = alice.locator('#hero-call-btn').first()
  const hasCallBtn = await callBtn.isVisible().catch(() => false)

  if (hasCallBtn) {
    await Promise.all([
      narrate('CANARY works for phone calls too. Insurance, banking, rideshare. Each side gets a different word — directional, so neither can parrot the other. Both verify. Both authenticated.'),
      (async () => {
        await clickElement(alice, '#hero-call-btn', { moveDuration: 200 })
        await alice.waitForTimeout(600)
      })(),
    ])

    await alice.waitForSelector('.call-verify--visible', { timeout: 5000 }).catch(() => {})

    await alice.waitForTimeout(1200)
    await clickElement(alice, '#cv-match', { moveDuration: 200 })
    await alice.waitForTimeout(600)
    await clickElement(alice, '#cv-dismiss-ok', { moveDuration: 150 })
    await alice.waitForTimeout(200)
  }

  await hideOverlay(bob)

  // ── Act 11: Close (~5s) ────────────────────────────────────

  await hideCursor(alice)
  await hideCursor(bob)

  await showCodeOverlay(alice, {
    title: 'Deepfake-proof. Duress-aware. Zero dependencies.',
    code: 'npm install canary-kit',
    duration: 1,
  })
  await showCodeOverlay(bob, {
    title: 'Open protocol. Offline-first.',
    code: 'github.com/TheCryptoDonkey/canary-kit',
    duration: 1,
  })

  await narrate('Zero dependencies. Open protocol. Offline-first. npm install canary-kit.')
  await pause(600)
}
