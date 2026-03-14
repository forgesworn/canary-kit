// app/components/duress-alert.ts — Full-screen duress alert overlay

import { getState } from '../state.js'
import { broadcastAction } from '../sync.js'
import { showToast } from './toast.js'

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
 * Show a full-screen duress alert overlay.
 * Persists until dismissed — not a fleeting notification.
 * High-contrast red for maximum visibility under stress.
 */
/** Format a unix timestamp as a relative time string ("just now", "2 min ago"). */
function formatRelativeTime(timestampSec: number): string {
  const nowSec = Math.floor(Date.now() / 1000)
  const ageSec = nowSec - timestampSec
  if (ageSec < 30) return 'just now'
  if (ageSec < 60) return `${ageSec}s ago`
  const mins = Math.floor(ageSec / 60)
  if (mins < 60) return `${mins} min ago`
  return new Date(timestampSec * 1000).toLocaleTimeString()
}

export function showDuressAlert(
  senderPubkey: string,
  groupId: string,
  location?: { lat: number; lon: number },
  timestampSec?: number,
): void {
  // Don't stack multiple overlays for the same sender
  const existing = document.querySelector('.duress-overlay')
  if (existing) existing.remove()

  const name = memberName(senderPubkey, groupId)
  const timeDisplay = timestampSec ? formatRelativeTime(timestampSec) : new Date().toLocaleTimeString()

  const overlay = document.createElement('div')
  overlay.className = 'duress-overlay'
  overlay.dataset.subject = senderPubkey
  overlay.dataset.groupId = groupId
  overlay.setAttribute('role', 'alertdialog')
  overlay.setAttribute('aria-label', `${name} needs help`)

  const contentDiv = document.createElement('div')
  contentDiv.className = 'duress-overlay__content'

  const iconDiv = document.createElement('div')
  iconDiv.className = 'duress-overlay__icon'
  iconDiv.setAttribute('aria-hidden', 'true')
  iconDiv.textContent = '!'
  contentDiv.appendChild(iconDiv)

  const titleEl = document.createElement('h1')
  titleEl.className = 'duress-overlay__title'
  titleEl.textContent = name
  contentDiv.appendChild(titleEl)

  const subtitleEl = document.createElement('h2')
  subtitleEl.className = 'duress-overlay__subtitle'
  subtitleEl.textContent = 'NEEDS HELP'
  contentDiv.appendChild(subtitleEl)

  if (location && (location.lat !== 0 || location.lon !== 0)) {
    const locEl = document.createElement('p')
    locEl.className = 'duress-overlay__location'
    locEl.textContent = `Last known: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
    contentDiv.appendChild(locEl)
  }

  const timeEl = document.createElement('p')
  timeEl.className = 'duress-overlay__time'
  timeEl.textContent = timeDisplay
  contentDiv.appendChild(timeEl)

  const respondBtn = document.createElement('button')
  respondBtn.className = 'btn btn--lg duress-overlay__dismiss'
  respondBtn.textContent = "I'm Responding"
  respondBtn.title = 'Dismiss this alert on your screen only — does not clear the duress for others'
  respondBtn.addEventListener('click', () => {
    overlay.classList.remove('duress-overlay--visible')
    setTimeout(() => overlay.remove(), 300)
  })
  contentDiv.appendChild(respondBtn)

  const standDownBtn = document.createElement('button')
  standDownBtn.className = 'btn btn--lg duress-overlay__stand-down'
  standDownBtn.textContent = 'Stand Down — Person is Safe'
  standDownBtn.title = 'Broadcast to all group members that this person has been confirmed safe'
  standDownBtn.addEventListener('click', () => {
    broadcastAction(groupId, {
      type: 'duress-clear',
      subject: senderPubkey,
      timestamp: Math.floor(Date.now() / 1000),
      opId: crypto.randomUUID(),
    })
    overlay.classList.remove('duress-overlay--visible')
    setTimeout(() => overlay.remove(), 300)
    const { identity } = getState()
    const clearedByName = identity?.pubkey === senderPubkey ? 'Self' : memberName(identity?.pubkey ?? '', groupId)
    showToast(`Duress stood down for ${name} by ${clearedByName}`, 'success')
  })
  contentDiv.appendChild(standDownBtn)

  overlay.appendChild(contentDiv)
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('duress-overlay--visible'))

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

// ── Listen for duress-clear events ─────────────────────────────

document.addEventListener('canary:duress-clear', ((e: CustomEvent) => {
  const { subject, clearedBy } = e.detail
  // Remove any active duress overlay for this subject
  const overlay = document.querySelector(`.duress-overlay[data-subject="${subject}"]`)
  if (overlay) {
    overlay.classList.remove('duress-overlay--visible')
    setTimeout(() => overlay.remove(), 300)
  }
  // Show who cleared it
  const groupId = e.detail.groupId
  const subjectName = memberName(subject, groupId)
  const clearerName = memberName(clearedBy, groupId)
  const isSelf = subject === clearedBy
  showToast(
    isSelf
      ? `${subjectName} self-cleared their duress`
      : `${clearerName} confirmed ${subjectName} is safe`,
    'success',
  )
}) as EventListener)
