// app/components/duress-alert.ts — Full-screen duress alert overlay

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
 * Show a full-screen duress alert overlay.
 * Persists until dismissed — not a fleeting notification.
 * High-contrast red for maximum visibility under stress.
 */
export function showDuressAlert(
  senderPubkey: string,
  groupId: string,
  location?: { lat: number; lon: number },
): void {
  // Don't stack multiple overlays for the same sender
  const existing = document.querySelector('.duress-overlay')
  if (existing) existing.remove()

  const name = memberName(senderPubkey, groupId)

  const overlay = document.createElement('div')
  overlay.className = 'duress-overlay'
  overlay.setAttribute('role', 'alertdialog')
  overlay.setAttribute('aria-label', `${name} needs help`)
  overlay.innerHTML = `
    <div class="duress-overlay__content">
      <div class="duress-overlay__icon" aria-hidden="true">!</div>
      <h1 class="duress-overlay__title">${name}</h1>
      <h2 class="duress-overlay__subtitle">NEEDS HELP</h2>
      ${location && (location.lat !== 0 || location.lon !== 0) ? `<p class="duress-overlay__location">Last known: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}</p>` : ''}
      <p class="duress-overlay__time">${new Date().toLocaleTimeString()}</p>
      <button class="btn btn--lg duress-overlay__dismiss" id="duress-dismiss">I'm Responding</button>
    </div>
  `

  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('duress-overlay--visible'))

  document.getElementById('duress-dismiss')!.addEventListener('click', () => {
    overlay.classList.remove('duress-overlay--visible')
    setTimeout(() => overlay.remove(), 300)
  })

  // Also dismiss on Escape key
  function onEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      overlay.classList.remove('duress-overlay--visible')
      setTimeout(() => overlay.remove(), 300)
      document.removeEventListener('keydown', onEscape)
    }
  }
  document.addEventListener('keydown', onEscape)
}
