// docs/record/scripts/extended.js — Extended cut (~2.5min)
//
// Peppy walkthrough covering ALL major features:
// Hook → login → create group → invite/sync → reveal on both →
// verify → settings (format switch) → duress panel (ring animation) →
// duress alert (split-screen) → burn → call verification →
// call demo scenarios → close.
//
// Both browsers use offline mode. After Alice creates a group, the group state
// is programmatically copied to Bob's localStorage so both share the same seed.

import { injectCursor, showCursor, hideCursor, clickElement, pressAndHold, typeInto } from '../cursor.js'
import { showOverlay, hideOverlay, showCodeOverlay } from '../overlay.js'
import { actLogin } from './acts.js'

export const splitScreen = true

export default async function extended({ alice, bob }, { narrate, pause, waitForIdle }) {
  // ── Act 1: Hook (punchy, ~10s) ───────────────────────────────

  await showOverlay(alice, {
    title: 'AI can clone your voice from 3 seconds.',
    subtitle: 'Your bank, your family — they can\'t tell.',
    duration: 1,
  })
  await showOverlay(bob, {
    title: 'CANARY',
    subtitle: 'Bidirectional. Deepfake-proof. Duress-aware.',
    duration: 1,
  })

  await narrate('AI can clone your voice from three seconds of audio. CANARY is the first protocol that combines bidirectional verification, coercion resistance, and spoken-word output. Let me show you how it works.')
  await pause(200)

  await hideOverlay(alice)
  await hideOverlay(bob)

  // ── Login both offline ───────────────────────────────────────

  await actLogin(alice, { pause, waitForIdle }, 'Alice')
  await actLogin(bob, { pause, waitForIdle }, 'Bob')

  // ── Act 2: Create Group ──────────────────────────────────────

  await showOverlay(bob, {
    title: 'Setting up...',
    subtitle: 'Alice creates the group',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  await Promise.all([
    narrate('Creating a group takes two taps. Name it, pick a threat profile, done.'),
    (async () => {
      await clickElement(alice, '#welcome-create', { moveDuration: 400 })
      await alice.waitForTimeout(300)
    })(),
  ])

  await waitForIdle()
  await typeInto(alice, 'input[name="name"]', 'Family', { moveDuration: 200, typeDelay: 40 })
  await alice.waitForTimeout(200)
  await clickElement(alice, 'button[type="submit"]', { moveDuration: 300 })
  await waitForIdle()
  await alice.waitForTimeout(300)

  // ── Act 3: Invite + sync state to Bob ────────────────────────

  await Promise.all([
    narrate('Invite Bob — share the code in person, by message, or via Nostr relay. The seed syncs automatically.'),
    (async () => {
      await clickElement(alice, '#hero-invite-btn', { moveDuration: 300 })
      await alice.waitForTimeout(1200)
    })(),
  ])

  // Close invite modal
  await alice.evaluate(() => {
    const dialog = document.querySelector('dialog[open]')
    if (dialog) dialog.close()
  })
  await alice.waitForTimeout(200)

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
    await alice.waitForTimeout(500)

    await injectCursor(alice)
    await showCursor(alice)
    await injectCursor(bob)
    await showCursor(bob)
  }

  await hideOverlay(bob)

  // ── Act 4: Reveal word on both ───────────────────────────────

  await Promise.all([
    narrate('Both devices derive the same word from a shared secret. No server involved. Hold to reveal.'),
    (async () => {
      await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 200, holdDuration: 2000, side: 'left' })
      await bob.waitForTimeout(100)
      const bobBtn = bob.locator('#hero-reveal-btn').first()
      if (await bobBtn.isVisible().catch(() => false)) {
        await pressAndHold(bob, '#hero-reveal-btn', { moveDuration: 200, holdDuration: 2000, side: 'left' })
      }
    })(),
  ])

  await pause(200)

  // ── Act 5: Verify ────────────────────────────────────────────

  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 150, holdDuration: 300, side: 'left' })
  const aliceWord = await alice.evaluate(() =>
    document.querySelector('.hero__word')?.textContent?.trim() || ''
  )

  await Promise.all([
    narrate('Someone calls claiming to be family. They say the word. Type it in — verified.'),
    (async () => {
      if (aliceWord && !aliceWord.includes('\u2022')) {
        await typeInto(alice, '#verify-input', aliceWord.toLowerCase(), { moveDuration: 200, typeDelay: 40 })
        await clickElement(alice, '#verify-btn', { moveDuration: 200 })
        await alice.waitForTimeout(600)
      }
    })(),
  ])

  // ── Act 6: Settings — format switch ──────────────────────────

  // Open settings drawer on Alice
  await Promise.all([
    narrate('Settings let you tune the protocol. Switch from words to PINs for digital input, or hex for machine-to-machine. Change rotation intervals, tolerance windows, duress response modes.'),
    (async () => {
      await clickElement(alice, '#settings-toggle', { moveDuration: 300 })
      await alice.waitForTimeout(400)
      // Switch to PIN format
      await clickElement(alice, '[data-enc="pin"]', { moveDuration: 300 })
      await alice.waitForTimeout(600)
      // Switch to 30s rotation
      await clickElement(alice, '[data-interval="30"]', { moveDuration: 300 })
      await alice.waitForTimeout(400)
      // Switch back to words
      await clickElement(alice, '[data-enc="words"]', { moveDuration: 300 })
      await alice.waitForTimeout(400)
      // Collapse settings
      await clickElement(alice, '#settings-toggle', { moveDuration: 200 })
      await alice.waitForTimeout(200)
    })(),
  ])

  // ── Act 7: Duress panel — hold with ring animation ───────────

  await Promise.all([
    narrate('The duress panel gives you a personal coercion word. Hold the button — watch the ring fill. After three seconds, a silent alert broadcasts to your group.'),
    (async () => {
      // Scroll Alice's view to show the duress panel
      await alice.evaluate(() => {
        const el = document.querySelector('#duress-container')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      await alice.waitForTimeout(300)
      // Press and hold the duress button — show the ring filling
      const duressBtn = alice.locator('#duress-hold-btn').first()
      if (await duressBtn.isVisible().catch(() => false)) {
        await pressAndHold(alice, '#duress-hold-btn', { moveDuration: 300, holdDuration: 3500 })
        await alice.waitForTimeout(300)
      }
    })(),
  ])

  // ── Act 8: Duress detection (split-screen) ───────────────────

  // Read Alice's duress word via the hero button (right side)
  // Scroll back up first
  await alice.evaluate(() => {
    const el = document.querySelector('#hero-container')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  await alice.waitForTimeout(300)

  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 150, holdDuration: 300, side: 'right' })
  const duressWord = await alice.evaluate(() =>
    document.querySelector('.hero__word')?.textContent?.trim() || ''
  )

  await Promise.all([
    narrate('Now watch — Alice speaks her duress word instead. Her screen shows failed. Normal. But on Bob\'s device...'),
    (async () => {
      if (duressWord && !duressWord.includes('\u2022')) {
        const verifyInput = alice.locator('#verify-input').first()
        if (await verifyInput.isVisible().catch(() => false)) {
          await verifyInput.fill('')
        }
        await typeInto(alice, '#verify-input', duressWord.toLowerCase(), { moveDuration: 200, typeDelay: 40 })
        await clickElement(alice, '#verify-btn', { moveDuration: 200 })
        await alice.waitForTimeout(600)
      }
    })(),
  ])

  // Inject duress alert on Bob's screen
  await bob.evaluate(() => {
    const existing = document.querySelector('.duress-overlay')
    if (existing) existing.remove()

    const overlay = document.createElement('div')
    overlay.className = 'duress-overlay'
    overlay.setAttribute('role', 'alertdialog')
    overlay.innerHTML = `
      <div class="duress-overlay__content">
        <div class="duress-overlay__icon" aria-hidden="true">!</div>
        <h1 class="duress-overlay__title">Alice</h1>
        <h2 class="duress-overlay__subtitle">NEEDS HELP</h2>
        <p class="duress-overlay__time">${new Date().toLocaleTimeString()}</p>
        <button class="btn btn--lg duress-overlay__dismiss" id="duress-dismiss">I'm Responding</button>
      </div>
    `
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('duress-overlay--visible'))
    document.getElementById('duress-dismiss').addEventListener('click', () => {
      overlay.classList.remove('duress-overlay--visible')
      setTimeout(() => overlay.remove(), 300)
    })
  })
  await bob.waitForTimeout(500)

  await narrate('A full-screen duress alert. The attacker sees nothing unusual. The group knows someone needs help.')
  await pause(800)

  await clickElement(bob, '#duress-dismiss', { moveDuration: 200 })
  await bob.waitForTimeout(300)

  // ── Act 9: Burn after use ────────────────────────────────────

  await Promise.all([
    narrate('Used the word? Burn it. Counter advances, everyone gets a new word instantly.'),
    (async () => {
      await clickElement(alice, '#burn-btn', { moveDuration: 300 })
      await alice.waitForTimeout(500)
      await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 200, holdDuration: 1200, side: 'left' })
    })(),
  ])

  // ── Act 10: Call verification ────────────────────────────────

  await hideCursor(bob)
  await showOverlay(bob, {
    title: 'Call Verification',
    subtitle: 'Insurance, banking, rideshare',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  const callBtn = alice.locator('#hero-call-btn').first()
  const hasCallBtn = await callBtn.isVisible().catch(() => false)

  if (hasCallBtn) {
    await Promise.all([
      narrate('CANARY also works for phone calls. Each party gets a different word — directional, so neither can parrot the other.'),
      (async () => {
        await clickElement(alice, '#hero-call-btn', { moveDuration: 300 })
        await alice.waitForTimeout(800)
      })(),
    ])

    await alice.waitForSelector('.call-verify--visible', { timeout: 5000 }).catch(() => {})

    await Promise.all([
      narrate('Alice sees her word and what Bob should say. Words match — call verified.'),
      (async () => {
        await alice.waitForTimeout(1500)
        await clickElement(alice, '#cv-match', { moveDuration: 300 })
        await alice.waitForTimeout(800)
        await clickElement(alice, '#cv-dismiss-ok', { moveDuration: 200 })
        await alice.waitForTimeout(300)
      })(),
    ])
  }

  await hideOverlay(bob)

  // ── Act 11: Close ─────────────────────────────────────────

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

  await narrate('Deepfake proof. Duress aware. Zero dependencies. Open protocol. canary-kit — npm install and go.')
  await pause(800)
}
