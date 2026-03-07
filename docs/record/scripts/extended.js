// docs/record/scripts/extended.js — Extended cut (~2.5min)
//
// Deeper walkthrough: problem statement → create group → invite (show modal) →
// reveal on both → verify → duress (split-screen) → burn after use →
// call sim → close.
//
// Both browsers use offline mode. After Alice creates a group, the group state
// is programmatically copied to Bob's localStorage so both share the same seed.
// This simulates what Nostr relay sync does in production.

import { injectCursor, showCursor, hideCursor, clickElement, pressAndHold, typeInto } from '../cursor.js'
import { showOverlay, hideOverlay, showCodeOverlay } from '../overlay.js'
import { actLogin } from './acts.js'

// We export splitScreen=true so record.js knows to launch two browsers
export const splitScreen = true

export default async function extended({ alice, bob }, { narrate, pause, waitForIdle }) {
  // ── Act 1: Problem Statement (Extended Hook) ────────────────

  await showOverlay(alice, {
    title: 'Voice phishing surged 442% in 2025.',
    subtitle: 'AI can clone a voice from three seconds of audio.',
    duration: 1,
  })
  await showOverlay(bob, {
    title: 'Voice phishing surged 442% in 2025.',
    subtitle: 'AI can clone a voice from three seconds of audio.',
    duration: 1,
  })

  await narrate('Voice phishing surged four hundred and forty two percent last year. AI can clone a voice from three seconds of audio. The tools that are supposed to protect us? They\'re failing.')
  await pause(400)

  await hideOverlay(alice)
  await hideOverlay(bob)

  // Problem breakdown
  await showOverlay(alice, {
    title: 'Security questions are one-directional and guessable.',
    duration: 1,
  })
  await showOverlay(bob, {
    title: '91% of US banks are reconsidering voice biometrics.',
    duration: 1,
  })

  await narrate('Security questions are one-directional and socially engineerable. Ninety-one percent of US banks are reconsidering voice biometrics after deepfake attacks. TOTP codes prove you to a server, but never prove the server to you.')
  await pause(300)

  await hideOverlay(alice)
  await hideOverlay(bob)

  // The answer
  await showOverlay(alice, {
    title: 'CANARY',
    subtitle: 'Bidirectional. Deepfake-proof. Duress-aware.',
    duration: 1,
  })
  await showOverlay(bob, {
    title: 'CANARY',
    subtitle: 'Bidirectional. Deepfake-proof. Duress-aware.',
    duration: 1,
  })

  await narrate('CANARY is the first protocol that combines bidirectional verification, coercion resistance, and spoken-word output. Three properties that have never existed together in a standard. It works because cloning a voice doesn\'t help you derive the right word.')
  await pause(500)

  await hideOverlay(alice)
  await hideOverlay(bob)

  // ── Login both offline ───────────────────────────────────────

  await actLogin(alice, { pause, waitForIdle }, 'Alice')
  await actLogin(bob, { pause, waitForIdle }, 'Bob')

  // ── Act 2: Create Group (Alice's browser) ────────────────

  // Show a "watching" state on Bob's browser
  await showOverlay(bob, {
    title: 'Setting up...',
    subtitle: 'Alice creates the group',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  await Promise.all([
    narrate('Creating a group takes two taps. Pick a name, choose a threat profile — done.'),
    (async () => {
      await clickElement(alice, '#welcome-create', { moveDuration: 500 })
      await alice.waitForTimeout(400)
    })(),
  ])

  await alice.waitForLoadState('networkidle').catch(() => {})

  await typeInto(alice, 'input[placeholder*="name" i], input[type="text"]', 'Family', { moveDuration: 300, typeDelay: 60 })
  await alice.waitForTimeout(300)

  await clickElement(alice, '.modal button.btn--primary, button[type="submit"]', { moveDuration: 400 })
  await alice.waitForLoadState('networkidle').catch(() => {})
  await alice.waitForTimeout(500)

  // ── Act 3: Invite — show modal, then sync state to Bob ────

  await Promise.all([
    narrate('Now let\'s invite Bob. Click invite — share the code in person, by message, or via Nostr relay. Bob joins and the seed syncs automatically.'),
    (async () => {
      await clickElement(alice, '#hero-invite-btn', { moveDuration: 400 })
      await alice.waitForTimeout(1500)
    })(),
  ])

  // Close the invite modal
  await alice.evaluate(() => {
    const dialog = document.querySelector('dialog[open]')
    if (dialog) dialog.close()
  })
  await alice.waitForTimeout(300)

  // Programmatically copy Alice's group state to Bob's browser.
  // We read Alice's group data, add Bob as a member, then use addInitScript
  // to set localStorage BEFORE the app module loads on next navigation.

  const aliceGroupData = await alice.evaluate(() => {
    const groups = JSON.parse(localStorage.getItem('canary:groups') || '{}')
    const activeGroup = localStorage.getItem('canary:active-group')
    const identity = JSON.parse(localStorage.getItem('canary:identity') || '{}')
    return { groups, activeGroup, alicePubkey: identity.pubkey }
  })

  const bobIdentity = await bob.evaluate(() => {
    return localStorage.getItem('canary:identity')
  })
  const bobPubkey = bobIdentity ? JSON.parse(bobIdentity).pubkey : ''

  if (aliceGroupData.groups && Object.keys(aliceGroupData.groups).length > 0) {
    // Build the merged group data with both members
    const mergedGroups = JSON.parse(JSON.stringify(aliceGroupData.groups))
    for (const group of Object.values(mergedGroups)) {
      if (bobPubkey && !group.members.includes(bobPubkey)) {
        group.members.push(bobPubkey)
      }
    }
    const mergedGroupsJson = JSON.stringify(mergedGroups)

    // Use addInitScript so localStorage is set BEFORE app JS runs
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

    // Navigate both — initScript runs before app JS
    const url = alice.url().split('#')[0]
    await Promise.all([
      alice.goto(url),
      bob.goto(url),
    ])
    await Promise.all([
      alice.waitForLoadState('networkidle').catch(() => {}),
      bob.waitForLoadState('networkidle').catch(() => {}),
    ])
    await alice.waitForTimeout(800)

    // Re-inject cursors after navigation
    await injectCursor(alice)
    await showCursor(alice)
    await injectCursor(bob)
    await showCursor(bob)
  }

  await hideOverlay(bob)

  // ── Act 4: Show both have the same word ──────────────────

  await Promise.all([
    narrate('Both devices now show the same verification word. Derived locally from the shared seed — no server involved.'),
    (async () => {
      await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 300, holdDuration: 2500, side: 'left' })
      await bob.waitForTimeout(200)
      const bobRevealBtn = bob.locator('#hero-reveal-btn').first()
      if (await bobRevealBtn.isVisible().catch(() => false)) {
        await pressAndHold(bob, '#hero-reveal-btn', { moveDuration: 300, holdDuration: 2500, side: 'left' })
      }
    })(),
  ])

  await pause(500)

  // ── Act 5: Verify (valid) ──────────────────────────────────

  // Read Alice's current word
  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 200, holdDuration: 400, side: 'left' })
  const aliceWord = await alice.evaluate(() => {
    return document.querySelector('.hero__word')?.textContent?.trim() || ''
  })

  await Promise.all([
    narrate('Alice asks Bob for the word. He says it. She types it in — verified.'),
    (async () => {
      if (aliceWord && !aliceWord.includes('\u2022')) {
        await typeInto(alice, '#verify-input', aliceWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
        await clickElement(alice, '#verify-btn', { moveDuration: 300 })
        await alice.waitForTimeout(800)
      }
    })(),
  ])

  // ── Act 6: Duress Detection (split-screen) ─────────────────

  // Read Alice's duress word by pressing right side of reveal button
  await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 200, holdDuration: 400, side: 'right' })
  const duressWord = await alice.evaluate(() => {
    return document.querySelector('.hero__word')?.textContent?.trim() || ''
  })

  await Promise.all([
    narrate('But what if someone is under coercion? They speak their duress word instead. Watch — Alice\'s screen shows failed. Normal. But on Bob\'s device...'),
    (async () => {
      if (duressWord && !duressWord.includes('\u2022')) {
        // Clear previous verify result
        const verifyInput = alice.locator('#verify-input').first()
        if (await verifyInput.isVisible().catch(() => false)) {
          await verifyInput.fill('')
        }
        await typeInto(alice, '#verify-input', duressWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
        await clickElement(alice, '#verify-btn', { moveDuration: 300 })
        await alice.waitForTimeout(1000)
      }
    })(),
  ])

  // Wait for the duress alert to appear on Bob's screen
  await bob.waitForTimeout(2000)

  await narrate('A full-screen duress alert. The attacker sees nothing unusual. The rest of the group knows someone needs help.')
  await pause(1500)

  // Dismiss the duress alert on Bob
  const dismissBtn = bob.locator('#duress-dismiss').first()
  if (await dismissBtn.isVisible().catch(() => false)) {
    await clickElement(bob, '#duress-dismiss', { moveDuration: 300 })
    await bob.waitForTimeout(500)
  }

  // ── Act 7: Burn After Use ──────────────────────────────────

  await Promise.all([
    narrate('Used the word? Burn it. The counter advances and everyone gets a new word instantly. No waiting for the next rotation.'),
    (async () => {
      await clickElement(alice, '#burn-btn', { moveDuration: 400 })
      await alice.waitForTimeout(800)
      // Reveal new word
      await pressAndHold(alice, '#hero-reveal-btn', { moveDuration: 300, holdDuration: 1500, side: 'left' })
    })(),
  ])

  await pause(400)

  // ── Act 8: Call Simulation ─────────────────────────────────

  // Use Alice's browser for this — single panel view
  await hideCursor(bob)

  await showOverlay(bob, {
    title: 'Call Verification',
    subtitle: 'Insurance, banking, rideshare',
    background: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
  })

  // Check if call button exists (needs 2+ members)
  const callBtn = alice.locator('#hero-call-btn').first()
  const hasCallBtn = await callBtn.isVisible().catch(() => false)

  if (hasCallBtn) {
    await Promise.all([
      narrate('CANARY also handles phone calls. Each party gets a different word derived from the same secret. Speak yours, listen for theirs.'),
      (async () => {
        await clickElement(alice, '#hero-call-btn', { moveDuration: 400 })
        await alice.waitForTimeout(1000)
      })(),
    ])

    // The call-verify overlay shows: "Say this" (my word) and "They should say" (their word)
    await alice.waitForSelector('.call-verify--visible', { timeout: 5000 }).catch(() => {})

    await Promise.all([
      narrate('Alice sees her word and what Bob should say. If the words match — the call is verified. If not, it could be an impostor.'),
      (async () => {
        await alice.waitForTimeout(2000)
        await clickElement(alice, '#cv-match', { moveDuration: 400 })
        await alice.waitForTimeout(1000)
        await clickElement(alice, '#cv-dismiss-ok', { moveDuration: 300 })
        await alice.waitForTimeout(500)
      })(),
    ])

    await pause(500)
  } else {
    // Fallback: use call-demo view (standalone, has its own seed)
    await Promise.all([
      narrate('CANARY also handles phone calls — insurance, banking, rideshare. Both sides derive different directional words from the same secret. Neither can parrot the other.'),
      (async () => {
        await clickElement(alice, 'button[data-view="call-demo"]', { moveDuration: 400 })
        await alice.waitForTimeout(800)
      })(),
    ])
    await pause(400)
  }

  await hideOverlay(bob)

  // ── Act 9: Close ───────────────────────────────────────────

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
  await pause(1500)
}
