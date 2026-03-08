// docs/record/scripts/acts.js — Shared acts for short and extended demo cuts
//
// Each act is an async function receiving (page, { narrate, pause, waitForIdle }).
// Acts are imported by short.js and extended.js to keep the two scripts DRY.

import { injectCursor, showCursor, hideCursor, clickElement, pressAndHold, typeInto } from '../cursor.js'
import { showOverlay, hideOverlay, showCodeOverlay } from '../overlay.js'

// ── Act 1: Hook ──────────────────────────────────────────────

export async function actHook(page, { narrate, pause }) {
  await showOverlay(page, {
    title: 'AI can clone your voice from 3 seconds of audio.',
    subtitle: 'Your bank, your family — they can\'t tell the difference.',
    duration: 1, // we control timing via narrate
  })

  await narrate('AI can clone your voice from three seconds of audio. Your bank, your family — they can\'t tell the difference.')
  await pause(500)
  await hideOverlay(page)
  await pause(300)
}

// ── Act 1.5: Login (offline mode) ────────────────────────────
// After clearing localStorage the app shows a login screen.
// We log in as "Alice" offline, which takes us to the welcome screen.

export async function actLogin(page, { pause, waitForIdle }, name = 'Alice') {
  await injectCursor(page)
  await showCursor(page)

  // Suppress backup modals so they don't appear during recording
  await page.addStyleTag({ content: '#nsec-backup-modal, #recovery-phrase-modal { display: none !important; }' })

  // Type name into the offline name field
  await typeInto(page, '#offline-name', name, { moveDuration: 300, typeDelay: 50 })
  await pause(200)

  // Submit the offline form
  await clickElement(page, '#offline-form button[type="submit"]', { moveDuration: 300 })
  await waitForIdle()
  await pause(500)

  // Close any backup dialog that may have opened
  await page.evaluate(() => {
    const dialog = document.querySelector('#nsec-backup-modal') || document.querySelector('#recovery-phrase-modal')
    if (dialog && dialog.open) dialog.close()
  })
}

// ── Act 1.5b: Login (demo account) ───────────────────────────
// Clicks a demo account button by name. Used for Nostr-enabled flows.

export async function actLoginDemo(page, { pause, waitForIdle }, name = 'Alice') {
  await injectCursor(page)
  await showCursor(page)

  // Click the demo account button matching the name
  await clickElement(page, `.login-screen__demo[data-name="${name}"]`, { moveDuration: 400 })
  await waitForIdle()
  await pause(500)
}

// ── Act 2: Create Group ──────────────────────────────────────

export async function actCreateGroup(page, { narrate, pause, waitForIdle }) {
  await Promise.all([
    narrate('Creating a group takes two taps. Pick a name, choose a threat profile — done.'),
    (async () => {
      await clickElement(page, '#welcome-create', { moveDuration: 500 })
      await pause(400)
    })(),
  ])

  await waitForIdle()

  // Fill in group name — the modal has a "name" input
  await typeInto(page, 'input[name="name"]', 'Family', { moveDuration: 300, typeDelay: 60 })
  await pause(300)

  // Click create (submit) button
  await clickElement(page, 'button[type="submit"]', { moveDuration: 400 })
  await waitForIdle()
  await pause(500)
}

// ── Act 3: Reveal Word ───────────────────────────────────────

export async function actRevealWord(page, { narrate, pause }) {
  await Promise.all([
    narrate('Everyone in the group derives the same word from a shared secret. Hold to reveal it — masked by default.'),
    (async () => {
      await pause(800)
      // Press and hold the reveal button (left side = normal word)
      await pressAndHold(page, '#hero-reveal-btn', {
        moveDuration: 500,
        holdDuration: 2000,
        side: 'left',
      })
      await pause(300)
    })(),
  ])
}

// ── Act 4: Verify Someone (valid) ────────────────────────────

export async function actVerifyValid(page, { narrate, pause, waitForIdle }) {
  // First, we need to read the current word to type it
  const word = await page.evaluate(() => {
    const heroWord = document.querySelector('.hero__word')
    // If it's masked, we need to temporarily reveal it
    return heroWord?.textContent?.replace(/•/g, '') || ''
  })

  // Get the actual word by pressing and reading
  await pressAndHold(page, '#hero-reveal-btn', {
    moveDuration: 300,
    holdDuration: 500,
    side: 'left',
  })
  const actualWord = await page.evaluate(() => {
    return document.querySelector('.hero__word')?.textContent?.trim() || ''
  })
  // Release happens automatically via pressAndHold

  await Promise.all([
    narrate('Now someone calls you claiming to be family. They say a word. Type it in, hit verify.'),
    (async () => {
      await pause(400)
      await typeInto(page, '#verify-input', actualWord.toLowerCase(), { moveDuration: 400, typeDelay: 50 })
      await pause(200)
      await clickElement(page, '#verify-btn', { moveDuration: 300 })
      await waitForIdle()
      await pause(800)
    })(),
  ])
}

// ── Act 4b: Call Simulation (Standalone) ─────────────────────
// For single-browser demos where there's only 1 group member.
// Navigates to the call-demo view via the header tab (has its own seed).

export async function actCallSimulationStandalone(page, { narrate, pause, waitForIdle }) {
  await Promise.all([
    narrate('CANARY also works for phone calls. Insurance, banking, rideshare. Both sides get different words from the same secret.'),
    (async () => {
      await clickElement(page, 'button[data-view="call-demo"]', { moveDuration: 400 })
      await waitForIdle()
      await pause(600)
    })(),
  ])

  // Reveal the caller's word
  await pressAndHold(page, '#caller-reveal', {
    moveDuration: 300,
    holdDuration: 1200,
    side: 'left',
  })
  const callerWord = await page.evaluate(() => {
    return document.querySelector('#caller-reveal')?.textContent?.trim() || ''
  })

  // Reveal the agent's word
  await pressAndHold(page, '#agent-reveal', {
    moveDuration: 300,
    holdDuration: 1200,
    side: 'left',
  })
  const agentWord = await page.evaluate(() => {
    return document.querySelector('#agent-reveal')?.textContent?.trim() || ''
  })

  await Promise.all([
    narrate('The caller speaks their word. The agent types it in — verified. Then the agent speaks theirs back. Neither can parrot the other.'),
    (async () => {
      if (callerWord && !callerWord.includes('•')) {
        await typeInto(page, '#agent-verify-input', callerWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
        await clickElement(page, '#agent-verify-btn', { moveDuration: 300 })
        await pause(600)
      }
      if (agentWord && !agentWord.includes('•')) {
        await typeInto(page, '#caller-verify-input', agentWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
        await clickElement(page, '#caller-verify-btn', { moveDuration: 300 })
        await pause(800)
      }
    })(),
  ])

  await narrate('Both parties authenticated. An eavesdropper hearing one word cannot derive the other.')
  await pause(600)
}

// ── Act 5: Call Simulation ───────────────────────────────────

export async function actCallSimulation(page, { narrate, pause, waitForIdle }) {
  // Navigate to call simulation — look for the Verify Call button or sidebar link
  await Promise.all([
    narrate('CANARY also works for phone calls. Insurance, banking, rideshare. Both sides get different words from the same secret. Neither can parrot the other.'),
    (async () => {
      // Click the Verify Call button in the hero
      await clickElement(page, '#hero-call-btn, [data-view="call"]', { moveDuration: 400 })
      await waitForIdle()
      await pause(600)
    })(),
  ])

  // Read the caller's word
  await pressAndHold(page, '#caller-reveal', {
    moveDuration: 300,
    holdDuration: 1200,
    side: 'left',
  })
  const callerWord = await page.evaluate(() => {
    return document.querySelector('#caller-reveal')?.textContent?.trim() || ''
  })

  // Read the agent's word
  await pressAndHold(page, '#agent-reveal', {
    moveDuration: 300,
    holdDuration: 1200,
    side: 'left',
  })
  const agentWord = await page.evaluate(() => {
    return document.querySelector('#agent-reveal')?.textContent?.trim() || ''
  })

  await Promise.all([
    narrate('The caller reveals their word and speaks it. The agent types it in — verified. Then the agent speaks theirs back.'),
    (async () => {
      // Type caller's word into agent's verify input
      await typeInto(page, '#agent-verify-input', callerWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
      await clickElement(page, '#agent-verify-btn', { moveDuration: 300 })
      await pause(600)

      // Type agent's word into caller's verify input
      await typeInto(page, '#caller-verify-input', agentWord.toLowerCase(), { moveDuration: 300, typeDelay: 50 })
      await clickElement(page, '#caller-verify-btn', { moveDuration: 300 })
      await pause(800)
    })(),
  ])

  await narrate('Both parties authenticated. An eavesdropper hearing one word can\'t derive the other.')
  await pause(600)
}

// ── Act: Close ───────────────────────────────────────────────

export async function actClose(page, { narrate, pause }) {
  await hideCursor(page)

  await showCodeOverlay(page, {
    title: 'Deepfake-proof. Duress-aware. Zero dependencies.',
    code: 'npm install canary-kit',
    duration: 1,
  })

  await narrate('Deepfake proof. Duress aware. Zero dependencies. canary-kit. npm install and go.')
  await pause(1000)
}
