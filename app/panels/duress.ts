// app/panels/duress.ts — Duress panel: long-press to arm, press-and-hold to reveal duress word

import { deriveDuressToken } from 'canary-kit/token'
import { getState } from '../state.js'
import type { AppGroup } from '../types.js'
import { toTokenEncoding, GROUP_CONTEXT } from '../utils/encoding.js'

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
    <section class="duress-section">
      <p class="duress-section__hint">Your personal distress signal — long-press to arm</p>

      <button
        class="btn duress-btn"
        id="duress-arm-btn"
        type="button"
        ${!isMember ? 'disabled' : ''}
        aria-label="Long-press to arm duress signal"
      >
        <span class="duress-btn__ring" id="duress-ring"></span>
        Signal Duress
      </button>

      <div id="duress-reveal" hidden>
        <span class="duress-word duress-word--masked" id="duress-word">••••••••</span>
        <button
          class="btn"
          id="duress-word-reveal-btn"
          type="button"
          aria-label="Hold to reveal duress word"
        >Hold to Reveal</button>
      </div>
    </section>
  `

  const armBtn = container.querySelector<HTMLButtonElement>('#duress-arm-btn')!
  const ring = container.querySelector<HTMLElement>('#duress-ring')!
  const revealSection = container.querySelector<HTMLElement>('#duress-reveal')!
  const wordEl = container.querySelector<HTMLElement>('#duress-word')!
  const wordRevealBtn = container.querySelector<HTMLButtonElement>('#duress-word-reveal-btn')!

  if (!armBtn || !ring || !revealSection || !wordEl || !wordRevealBtn) return
  if (!isMember) return

  // ── Long-press to arm ──────────────────────────────────

  let armTimer: ReturnType<typeof setTimeout> | null = null
  let duressWord = ''

  function cancelArm(): void {
    if (armTimer !== null) {
      clearTimeout(armTimer)
      armTimer = null
    }
    ring.classList.remove('duress-btn__ring--filling')
  }

  armBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    if (!identity?.pubkey) return

    ring.classList.add('duress-btn__ring--filling')

    armTimer = setTimeout(() => {
      armTimer = null
      ring.classList.remove('duress-btn__ring--filling')

      // Derive duress word at arm time
      const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
      if (!currentGroupId) return
      const currentGroup = currentGroups[currentGroupId]
      if (!currentGroup || !identity?.pubkey) return

      duressWord = getDuressDisplayToken(currentGroup, identity.pubkey)

      // Show masked word initially
      wordEl.textContent = '••••••••'
      wordEl.classList.remove('duress-word--revealed')
      wordEl.classList.add('duress-word--masked')
      revealSection.hidden = false
    }, 1000)
  })

  armBtn.addEventListener('pointerup', cancelArm)
  armBtn.addEventListener('pointerleave', cancelArm)
  armBtn.addEventListener('pointercancel', cancelArm)

  // ── Press-and-hold to reveal duress word ────────────────

  function showDuressWord(): void {
    if (!duressWord) return
    wordEl.textContent = duressWord
    wordEl.classList.remove('duress-word--masked')
    wordEl.classList.add('duress-word--revealed')
  }

  function hideDuressWord(): void {
    wordEl.textContent = '••••••••'
    wordEl.classList.remove('duress-word--revealed')
    wordEl.classList.add('duress-word--masked')
  }

  wordRevealBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    showDuressWord()
  })
  wordRevealBtn.addEventListener('pointerup', hideDuressWord)
  wordRevealBtn.addEventListener('pointerleave', hideDuressWord)
  wordRevealBtn.addEventListener('pointercancel', hideDuressWord)
}
