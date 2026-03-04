// app/components/call-verify.ts — Directional call verification overlay

import { createSession } from 'canary-kit/session'
import { getState } from '../state.js'

const MEMBER_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']

function memberName(pubkey: string, groupId: string): string {
  const group = getState().groups[groupId]
  if (!group) return pubkey.slice(0, 8)
  const { identity } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  const name = group.memberNames?.[pubkey]
  if (name) return name
  const others = group.members.filter(m => m !== identity?.pubkey)
  const idx = others.indexOf(pubkey)
  return idx >= 0 && idx < MEMBER_NAMES.length ? MEMBER_NAMES[idx] : pubkey.slice(0, 8)
}

/**
 * Show the directional call verification overlay.
 * Each party gets a different word — speak yours, listen for theirs.
 */
export function showCallVerify(groupId: string, theirPubkey: string): void {
  // Remove any existing overlay
  document.querySelector('.call-verify')?.remove()

  const { groups, identity } = getState()
  const group = groups[groupId]
  if (!group || !identity) return

  const myPubkey = identity.pubkey
  const theirName = memberName(theirPubkey, groupId)

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

  // Snapshot words once for the call duration — no live rotation
  const nowSec = Math.floor(Date.now() / 1000)
  const myWord = session.myToken(nowSec)
  const theirWord = session.theirToken(nowSec)

  const overlay = document.createElement('div')
  overlay.className = 'call-verify'

  overlay.innerHTML = `
    <div class="call-verify__content">
      <h2 class="call-verify__title">Call with ${theirName}</h2>
      <p class="call-verify__instruction">Speak your word. Listen for theirs. If it matches, the call is verified.</p>

      <div class="call-verify__section call-verify__section--say">
        <span class="call-verify__label">Say this:</span>
        <span class="call-verify__word call-verify__word--mine">${myWord}</span>
      </div>

      <div class="call-verify__divider"></div>

      <div class="call-verify__section call-verify__section--hear">
        <span class="call-verify__label">They should say:</span>
        <span class="call-verify__word call-verify__word--theirs">${theirWord}</span>
      </div>

      <p class="call-verify__instruction" style="margin-top: 1.5rem; font-size: 0.75rem;">In a real call, if they say the wrong word, it could be a duress signal. A production app would automatically check and silently alert the group.</p>
      <div class="call-verify__actions">
        <button class="btn btn--primary call-verify__btn" id="cv-match">Match</button>
        <button class="btn call-verify__btn call-verify__btn--danger" id="cv-mismatch">Wrong Word</button>
        <button class="btn call-verify__btn" id="cv-close">Close</button>
      </div>
    </div>
  `

  function dismiss(): void {
    overlay.classList.remove('call-verify--visible')
    setTimeout(() => overlay.remove(), 300)
    document.removeEventListener('keydown', onEscape)
  }

  function onEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape') dismiss()
  }

  document.getElementById('cv-match')?.addEventListener('click', dismiss)
  document.getElementById('cv-close')?.addEventListener('click', dismiss)
  document.getElementById('cv-mismatch')?.addEventListener('click', () => {
    overlay.innerHTML = `
      <div class="call-verify__content">
        <h2 class="call-verify__title" style="color: var(--clr-danger, #e74c3c);">Verification Failed</h2>
        <p class="call-verify__warning">The word didn't match. This person may not be who they claim to be.</p>
        <div class="call-verify__actions">
          <button class="btn call-verify__btn" id="cv-dismiss-fail">Dismiss</button>
        </div>
      </div>
    `
    document.getElementById('cv-dismiss-fail')?.addEventListener('click', dismiss)
  })

  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('call-verify--visible'))
  document.addEventListener('keydown', onEscape)
}
