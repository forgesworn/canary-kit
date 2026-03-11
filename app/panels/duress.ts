// app/panels/duress.ts — Duress panel: hold to reveal duress word

import { deriveDuressToken } from 'canary-kit/token'
import { getState } from '../state.js'
import type { AppGroup } from '../types.js'
import { toTokenEncoding, GROUP_CONTEXT, formatForDisplay } from '../utils/encoding.js'
import { broadcastAction } from '../sync.js'

/**
 * Derive the duress display token using the universal CANARY token API.
 * Uses deriveDuressToken with collision avoidance (maxTolerance must match
 * the verifier's tolerance to prevent silent alarm suppression).
 */
function getDuressDisplayToken(group: AppGroup, memberPubkey: string): string {
  const effectiveCounter = group.counter + group.usageOffset
  return deriveDuressToken(
    group.seed,
    GROUP_CONTEXT,
    memberPubkey,
    effectiveCounter,
    toTokenEncoding(group),
    group.tolerance,
  )
}

// ── Render ─────────────────────────────────────────────────

/**
 * Render the duress signal panel into the given container.
 * Clears container and returns early when no group is active or user is not a member.
 */
export function renderDuress(container: HTMLElement): void {
  const { groups, activeGroupId, identity } = getState()

  if (!activeGroupId) {
    container.innerHTML = ''
    return
  }

  const group = groups[activeGroupId]
  if (!group) {
    container.innerHTML = ''
    return
  }

  const isMember = !!(identity?.pubkey && group.members.includes(identity.pubkey))

  container.innerHTML = `
    <section class="panel duress-section">
      <h3 class="panel__title">Emergency Signal</h3>
      <p class="duress-section__hint">Your personal emergency word. It appears valid to others. Hold for 3 seconds to silently alert your group.</p>

      <button
        class="btn duress-btn"
        id="duress-hold-btn"
        type="button"
        ${!isMember ? 'disabled' : ''}
        aria-label="Hold to reveal emergency word"
      >
        <span class="duress-btn__ring" id="duress-ring"></span>
        <span id="duress-label">Hold to Reveal</span>
      </button>

      <div class="duress-word duress-word--masked" id="duress-word">••••••••</div>
    </section>
  `

  const holdBtn = container.querySelector<HTMLButtonElement>('#duress-hold-btn')!
  const ring = container.querySelector<HTMLElement>('#duress-ring')!
  const wordEl = container.querySelector<HTMLElement>('#duress-word')!
  const labelEl = container.querySelector<HTMLElement>('#duress-label')!

  if (!holdBtn || !ring || !wordEl || !labelEl) return
  if (!isMember) return

  function showWord(): void {
    if (!identity?.pubkey) return
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const duressWord = getDuressDisplayToken(currentGroup, identity.pubkey)
    wordEl.textContent = formatForDisplay(duressWord, currentGroup.encodingFormat)
    wordEl.classList.remove('duress-word--masked')
    wordEl.classList.add('duress-word--revealed')
    ring.classList.add('duress-btn__ring--filling')
    labelEl.textContent = 'Release to hide'
  }

  function hideWord(): void {
    wordEl.textContent = '••••••••'
    wordEl.classList.remove('duress-word--revealed')
    wordEl.classList.add('duress-word--masked')
    ring.classList.remove('duress-btn__ring--filling')
    labelEl.textContent = 'Hold to Reveal'
  }

  // ── Hold gesture with silent dispatch ───────────────────────
  // Short hold (< 3s): reveal word only.
  // Long hold (≥ 3s): reveal word AND silently dispatch duress alert.

  let holdTimer: ReturnType<typeof setTimeout> | null = null

  function startHold(): void {
    showWord()

    holdTimer = setTimeout(() => {
      // Silent dispatch — no visible UI change
      const { groups: g, activeGroupId: gid, identity: id } = getState()
      if (!gid || !id?.pubkey) return
      const currentGroup = g[gid]
      if (!currentGroup) return

      const mode = currentGroup.duressMode ?? 'immediate'
      const opId = crypto.randomUUID()
      // In the demo, all modes broadcast via the sync transport.
      // In production, 'dead-drop' would skip push notifications
      // and only persist on the relay for later retrieval.
      // Under duress, share HIGH-PRECISION location so the group can help.
      // This is the one case where exact GPS is appropriate.
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            broadcastAction(gid, {
              type: 'duress-alert',
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
              timestamp: Math.floor(Date.now() / 1000),
              opId,
              subject: id.pubkey,
            })
          },
          () => {
            // Geolocation unavailable — send without location
            broadcastAction(gid, {
              type: 'duress-alert',
              lat: 0,
              lon: 0,
              timestamp: Math.floor(Date.now() / 1000),
              opId,
              subject: id.pubkey,
            })
          },
          { enableHighAccuracy: true, timeout: 5000 },
        )
      } else {
        broadcastAction(gid, {
          type: 'duress-alert',
          lat: 0,
          lon: 0,
          timestamp: Math.floor(Date.now() / 1000),
          opId,
          subject: id.pubkey,
        })
      }

      console.info('[canary] Silent duress dispatched (mode: %s)', mode)
    }, 3000)
  }

  function endHold(): void {
    if (holdTimer) {
      clearTimeout(holdTimer)
      holdTimer = null
    }
    hideWord()
  }

  holdBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    startHold()
  })
  holdBtn.addEventListener('pointerup', endHold)
  holdBtn.addEventListener('pointerleave', endHold)
  holdBtn.addEventListener('pointercancel', endHold)
}
