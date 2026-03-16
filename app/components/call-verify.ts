// app/components/call-verify.ts — Directional call verification overlay

import { createSession, SESSION_PRESETS } from 'canary-kit/session'
import { getState } from '../state.js'
import { escapeHtml } from '../utils/escape.js'
import { getCachedProfile } from '../nostr/profiles.js'

/** Cleanup function for the current overlay (timer + keydown listener). */
let activeCleanup: (() => void) | null = null

function memberName(pubkey: string, groupId: string): string {
  const group = getState().groups[groupId]
  if (!group) return pubkey.slice(0, 8)
  const { identity } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  const name = group.memberNames?.[pubkey]
  if (name) return name
  return `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}`
}

/**
 * Show the directional call verification overlay.
 * Each party gets a different word — speak yours, listen for theirs.
 */
export function showCallVerify(groupId: string, theirPubkey: string): void {
  // Clean up any existing overlay (timer + listener) before creating a new one
  if (activeCleanup) {
    activeCleanup()
    activeCleanup = null
  }
  document.querySelector('.call-verify')?.remove()

  const { groups, identity } = getState()
  const group = groups[groupId]
  if (!group || !identity) return

  const myPubkey = identity.pubkey
  const theirName = memberName(theirPubkey, groupId)
  const theirProfile = getCachedProfile(theirPubkey)

  // Create directional session: roles sorted for determinism
  const roles: [string, string] = myPubkey < theirPubkey
    ? [myPubkey, theirPubkey]
    : [theirPubkey, myPubkey]

  const session = createSession({
    secret: group.seed,
    namespace: 'canary:call',
    roles,
    myRole: myPubkey,
    preset: 'call',
  })

  const rotationSeconds = SESSION_PRESETS.call.rotationSeconds
  const nowSec = Math.floor(Date.now() / 1000)
  const myWord = session.myToken(nowSec)
  const theirWord = session.theirToken(nowSec)

  const overlay = document.createElement('div')
  overlay.className = 'call-verify'

  overlay.innerHTML = `
    <div class="call-verify__content">
      ${theirProfile?.picture ? `<img class="call-verify__avatar" src="${escapeHtml(theirProfile.picture)}" alt="" />` : ''}
      <h2 class="call-verify__title">Call with ${escapeHtml(theirName)}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine" id="cv-word-mine">${escapeHtml(myWord)}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs" id="cv-word-theirs">${escapeHtml(theirWord)}</span>
      </div>

      <p class="call-verify__timer">Words change in <span id="cv-countdown">${rotationSeconds}</span>s</p>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be an emergency signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `

  // Live rotation: update words and countdown every second
  let timerId: ReturnType<typeof setInterval> | null = null

  function updateWords(): void {
    const t = Math.floor(Date.now() / 1000)
    const mineEl = overlay.querySelector('#cv-word-mine')
    const theirsEl = overlay.querySelector('#cv-word-theirs')
    const countdownEl = overlay.querySelector('#cv-countdown')
    if (mineEl) mineEl.textContent = session.myToken(t)
    if (theirsEl) theirsEl.textContent = session.theirToken(t)
    if (countdownEl) {
      const elapsed = t % rotationSeconds
      countdownEl.textContent = String(rotationSeconds - elapsed)
    }
  }

  timerId = setInterval(updateWords, 1000)

  function stopTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  function dismiss(): void {
    if (activeCleanup) {
      activeCleanup()
      activeCleanup = null
    }
    overlay.classList.remove('call-verify--visible')
    setTimeout(() => overlay.remove(), 300)
  }

  function onEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape') dismiss()
  }

  activeCleanup = () => {
    stopTimer()
    document.removeEventListener('keydown', onEscape)
  }

  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('call-verify--visible'))
  document.addEventListener('keydown', onEscape)

  overlay.querySelector('#cv-match')?.addEventListener('click', () => {
    stopTimer()
    overlay.innerHTML = `
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-success, #27ae60);">Call Verified</h2>
        <p class="call-verify__warning" style="color: var(--text-secondary);">${escapeHtml(theirName)} is who they say they are. The call is authenticated.</p>
        <div class="call-verify__actions">
          <button class="btn btn--primary call-verify__btn" id="cv-dismiss-ok">Done</button>
        </div>
      </div>
    `
    overlay.querySelector('#cv-dismiss-ok')?.addEventListener('click', dismiss)
  })
  overlay.querySelector('#cv-close')?.addEventListener('click', dismiss)
  overlay.querySelector('#cv-mismatch')?.addEventListener('click', () => {
    stopTimer()
    overlay.innerHTML = `
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `
    overlay.querySelector('#cv-dismiss-fail')?.addEventListener('click', dismiss)
  })

}
