// app/panels/liveness.ts — Liveness panel: dead man's switch check-in status

import { getState, updateGroup } from '../state.js'
import { deriveLivenessToken } from 'canary-kit/token'
import { getCounter } from 'canary-kit'
import { broadcastAction } from '../sync.js'
import { showToast } from '../components/toast.js'
import { sendLocationPing } from './beacons.js'
import { escapeHtml } from '../utils/escape.js'

// ── Helpers ────────────────────────────────────────────────────

/** Format a unix timestamp (seconds) as a military-style UTC time, e.g. "14:32:07 UTC". */
function militaryTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().slice(11, 19) + ' UTC'
}

function getStatus(elapsed: number, interval: number): 'green' | 'amber' | 'red' {
  if (elapsed <= interval) return 'green'
  if (elapsed <= interval * 1.25) return 'amber'
  return 'red'
}

function formatElapsed(seconds: number, lastCheckin: number): string {
  if (seconds < 60) return militaryTime(lastCheckin)
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ── Render ─────────────────────────────────────────────────────

/**
 * Render the liveness panel into the given container.
 * Shows each member's check-in status with traffic-light indicators.
 * Provides an "I'm Alive" button for the local identity.
 */
const LIVENESS_INTERVALS: { label: string; value: number }[] = [
  { label: '1h', value: 3600 },
  { label: '4h', value: 14400 },
  { label: '24h', value: 86400 },
  { label: '7d', value: 604800 },
]

export function renderLiveness(container: HTMLElement): void {
  const { groups, activeGroupId, identity } = getState()

  if (!activeGroupId || !groups[activeGroupId]) {
    container.innerHTML = ''
    return
  }

  const group = groups[activeGroupId]
  const now = Math.floor(Date.now() / 1000)
  const interval = group.livenessInterval

  const memberItems = group.members.map(m => {
    const lastCheckin = group.livenessCheckins[m] ?? 0
    const hasCheckedIn = lastCheckin > 0
    const elapsed = hasCheckedIn ? now - lastCheckin : Infinity
    const status: 'green' | 'amber' | 'red' | 'grey' = hasCheckedIn ? getStatus(elapsed, interval) : 'grey'
    const healthPct = hasCheckedIn
      ? Math.max(0, Math.min(100, (1 - elapsed / interval) * 100))
      : 0
    const isMe = identity?.pubkey === m
    const memberName = group.memberNames?.[m]
    const name = isMe ? 'You' : (memberName ?? `${m.slice(0, 8)}\u2026`)

    return `
      <li class="liveness-item liveness-item--${status}">
        <span class="liveness-dot liveness-dot--${status}"></span>
        <span class="liveness-name">${escapeHtml(name)}</span>
        <span class="liveness-time">${hasCheckedIn ? formatElapsed(elapsed, lastCheckin) : 'awaiting first check-in'}</span>
        <div class="liveness-bar">
          <div class="liveness-bar__fill liveness-bar__fill--${status}" style="width: ${healthPct}%"></div>
        </div>
      </li>
    `
  }).join('')

  const showCheckinBtn = identity?.pubkey != null && group.members.includes(identity.pubkey)

  const intervalButtons = LIVENESS_INTERVALS.map(i =>
    `<button class="segmented__btn ${interval === i.value ? 'segmented__btn--active' : ''}" data-liveness-interval="${i.value}">${i.label}</button>`
  ).join('')

  container.innerHTML = `
    <section class="panel liveness-panel">
      <h3 class="panel__title">Liveness</h3>

      <div class="settings-section">
        <span class="input-label">Check-in interval</span>
        <div class="segmented" id="liveness-interval-picker">
          ${intervalButtons}
        </div>
        <p class="settings-hint">How often members must check in</p>
      </div>

      <ul class="liveness-list" id="liveness-list">
        ${memberItems}
      </ul>
      ${showCheckinBtn ? `
        <button class="btn btn--primary" id="checkin-btn" type="button" title="Check in with your group and share your approximate location">I'm Alive</button>
      ` : ''}
    </section>
  `

  // ── Liveness interval picker ─────────────────────────────
  container.querySelectorAll('[data-liveness-interval]').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = Number((btn as HTMLElement).dataset.livenessInterval)
      updateGroup(activeGroupId!, { livenessInterval: value })
    })
  })

  document.getElementById('checkin-btn')?.addEventListener('click', () => {
    try {
      const { identity: id, activeGroupId: gid, groups: gs } = getState()
      if (!id?.pubkey || !gid) {
        console.warn('[canary:liveness] No identity or activeGroupId', { pubkey: id?.pubkey, gid })
        return
      }
      const g = gs[gid]
      if (!g) {
        console.warn('[canary:liveness] Group not found', gid)
        return
      }

      const freshNow = Math.floor(Date.now() / 1000)
      const counter = getCounter(freshNow, g.rotationInterval)
      deriveLivenessToken(g.seed, 'canary:liveness', id.pubkey, counter)

      const checkins = { ...g.livenessCheckins, [id.pubkey]: freshNow }
      updateGroup(gid, { livenessCheckins: checkins })

      broadcastAction(gid, {
        type: 'liveness-checkin',
        pubkey: id.pubkey,
        timestamp: freshNow,
        opId: crypto.randomUUID(),
      })

      // Send a location beacon and scroll the map into view
      sendLocationPing()

      // Scroll the beacon map into view so the user sees their location update
      setTimeout(() => {
        document.getElementById('beacon-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)

      showToast('Check-in sent — location updated', 'success', 2000)
    } catch (err) {
      console.error('[canary:liveness] Check-in failed:', err)
      showToast('Check-in failed', 'error', 3000)
    }
  })
}
