// app/panels/hero.ts — Hero panel: verification word display with press-and-hold reveal

import { syncCounter, getCounter } from 'canary-kit'
import { deriveToken, deriveDuressToken } from 'canary-kit/token'
import { getState, updateGroup } from '../state.js'
import { burnWord } from '../actions/groups.js'
import type { AppGroup } from '../types.js'
import { groupMode } from '../types.js'
import { toTokenEncoding, GROUP_CONTEXT, formatForDisplay } from '../utils/encoding.js'
import { escapeHtml } from '../utils/escape.js'
import { showToast } from '../components/toast.js'

// ── Helpers ───────────────────────────────────────────────────

function resolveName(pubkey: string, group: AppGroup): string {
  const { identity } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  const name = group.memberNames?.[pubkey]
  if (name) return name
  return pubkey.slice(0, 8) + '\u2026'
}

// ── Tick interval management ───────────────────────────────────

let _tickInterval: ReturnType<typeof setInterval> | null = null

function clearTick(): void {
  if (_tickInterval !== null) {
    clearInterval(_tickInterval)
    _tickInterval = null
  }
}

// ── Helpers ────────────────────────────────────────────────────

/** Format a Date as a military-style UTC timestamp, e.g. "14:32:07 UTC". */
function militaryTime(date: Date = new Date()): string {
  return date.toISOString().slice(11, 19) + ' UTC'
}

/** Replace alphanumeric characters with bullet dots. */
function maskWord(word: string): string {
  return word.replace(/[a-zA-Z0-9]/g, '•')
}

const SCRAMBLE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789•·∘◦○●◈◆▪▫'

/**
 * Matrix-style scramble animation on a text element.
 * Each character position cycles through random characters before settling
 * to the final value, cascading left to right like a departure board.
 */
function scrambleText(el: HTMLElement, finalText: string, durationMs = 600): void {
  const len = finalText.length
  const frameMs = 30
  const totalFrames = Math.ceil(durationMs / frameMs)
  // Each position settles at a staggered time
  const settleFrame = (i: number) => Math.floor((i / len) * totalFrames * 0.7) + Math.floor(totalFrames * 0.3)
  let frame = 0

  const interval = setInterval(() => {
    frame++
    let display = ''
    for (let i = 0; i < len; i++) {
      if (frame >= settleFrame(i)) {
        display += finalText[i]
      } else {
        display += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
    }
    el.textContent = display
    if (frame >= totalFrames) {
      clearInterval(interval)
      el.textContent = finalText
    }
  }, frameMs)
}

/**
 * Format a duration in seconds as a human-readable countdown string.
 * Examples: "6d 2h", "2h 34m", "45s"
 */
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (days >= 1) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
  if (hours >= 1) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  if (minutes >= 1) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
  }
  return `${secs}s`
}

/**
 * Calculate seconds remaining until the next rotation.
 * nextRotation = (counter + 1) * rotationInterval
 */
function secondsUntilRotation(group: AppGroup): number {
  const nowSec = Math.floor(Date.now() / 1000)
  const timeBased = getCounter(nowSec, group.rotationInterval)
  const nextRotation = (timeBased + 1) * group.rotationInterval
  return Math.max(0, nextRotation - nowSec)
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Format the rotation label.
 * For intervals >= 24h: "rotates Wed 5 Mar at 14:00 UTC (6d 2h)"
 * For shorter intervals: "rotates in 45s"
 */
function formatRotationLabel(secsLeft: number, interval: number): string {
  if (interval >= 86400) {
    const target = new Date(Date.now() + secsLeft * 1000)
    const day = DAY_NAMES[target.getUTCDay()]
    const date = target.getUTCDate()
    const month = MONTH_NAMES[target.getUTCMonth()]
    const hours = String(target.getUTCHours()).padStart(2, '0')
    const mins = String(target.getUTCMinutes()).padStart(2, '0')
    return `rotates ${day} ${date} ${month} at ${hours}:${mins} UTC (${formatCountdown(secsLeft)})`
  }
  return `rotates in ${formatCountdown(secsLeft)} · ${militaryTime()}`
}

// ── Display token derivation ────────────────────────────────────

/**
 * Derive the current display token using the universal CANARY token API.
 * All encoding formats use the same derivation path.
 */
function getDisplayToken(group: AppGroup): string {
  const effectiveCounter = group.counter + group.usageOffset
  return deriveToken(group.seed, GROUP_CONTEXT, effectiveCounter, toTokenEncoding(group))
}

/**
 * Derive this user's duress token — the word to speak when under coercion.
 * Returns null if no identity is available.
 */
function getDuressToken(group: AppGroup): string | null {
  const { identity } = getState()
  if (!identity?.pubkey) return null
  const effectiveCounter = group.counter + group.usageOffset
  return deriveDuressToken(
    group.seed,
    GROUP_CONTEXT,
    identity.pubkey,
    effectiveCounter,
    toTokenEncoding(group),
    group.tolerance,
  )
}

// ── Render ─────────────────────────────────────────────────────

/**
 * Render the hero verification word panel into the given container.
 * Clears container and returns early when no group is active.
 */
export function renderHero(container: HTMLElement): void {
  // Always clear any existing tick to avoid leaking intervals.
  clearTick()

  const { groups, activeGroupId } = getState()

  if (!activeGroupId) {
    container.innerHTML = ''
    return
  }

  const group = groups[activeGroupId]
  if (!group) {
    container.innerHTML = ''
    return
  }

  // Sync counter to current time window; persist if it changed.
  const synced = syncCounter(group)
  if (synced !== group) {
    updateGroup(activeGroupId, synced)
    // Re-render will be triggered by the state update — bail here.
    return
  }

  const rawWord = getDisplayToken(group)
  const word = formatForDisplay(rawWord, group.encodingFormat)
  const rawDuress = getDuressToken(group)
  const duressWord = rawDuress ? formatForDisplay(rawDuress, group.encodingFormat) : null
  const masked = maskWord(word)
  const secsLeft = secondsUntilRotation(group)
  const progressPct = Math.min(
    100,
    Math.max(0, ((group.rotationInterval - secsLeft) / group.rotationInterval) * 100),
  )

  container.innerHTML = `
    <section class="hero">

      <div class="hero__word-container">
        <div class="hero__word hero__word--masked" id="hero-word">${masked}</div>
        <button
          class="hero__reveal-btn btn"
          id="hero-reveal-btn"
          type="button"
          aria-label="Hold to reveal verification word"
        >Hold to Reveal</button>
      </div>

      <div class="hero__countdown">
        <div class="hero__progress">
          <div class="hero__progress-bar" id="hero-progress-bar" style="width: ${progressPct}%"></div>
        </div>
        <span class="hero__countdown-label" id="hero-countdown-label">${formatRotationLabel(secsLeft, group.rotationInterval)}</span>
      </div>

      <p class="hero__hint">Press and hold to reveal. Tap the right side for your alternate word.</p>

      <button class="btn btn--ghost" id="burn-btn" type="button" title="Rotate to a new word now. All group members will get a new word too.">I used this word</button>
      <button class="btn btn--outline" id="hero-invite-btn" type="button" title="Share group access with someone new">Invite Someone</button>
      ${group.members.length >= 2 ? `<button class="btn btn--outline" id="hero-call-btn" type="button" title="Start a phone call verification">Verify Call</button>` : ''}

    </section>
  `

  // ── Press-and-hold reveal ──────────────────────────────────
  //
  // WHERE you press determines WHICH word you see:
  //   Left half  → normal "all clear" word
  //   Right half → your personal duress word
  //
  // Both look identical to an observer — same button, same animation,
  // same styling. The attacker cannot tell which word was revealed.

  const wordEl = container.querySelector<HTMLElement>('#hero-word')
  const revealBtn = container.querySelector<HTMLButtonElement>('#hero-reveal-btn')

  function showWord(isDuress: boolean): void {
    if (!wordEl) return
    wordEl.textContent = (isDuress && duressWord) ? duressWord : word
    wordEl.classList.remove('hero__word--masked')
    wordEl.classList.add('hero__word--revealed')
  }

  function hideWord(): void {
    if (!wordEl) return
    wordEl.textContent = masked
    wordEl.classList.remove('hero__word--revealed')
    wordEl.classList.add('hero__word--masked')
  }

  if (revealBtn) {
    revealBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault() // prevent text selection on long press
      const rect = revealBtn!.getBoundingClientRect()
      const pressX = (e as PointerEvent).clientX - rect.left
      const isDuress = pressX > rect.width / 2
      showWord(isDuress)
    })
    revealBtn.addEventListener('pointerup', hideWord)
    revealBtn.addEventListener('pointerleave', hideWord)
    revealBtn.addEventListener('pointercancel', hideWord)
  }

  // ── Burn button ────────────────────────────────────────────

  const burnBtn = container.querySelector<HTMLButtonElement>('#burn-btn')
  burnBtn?.addEventListener('click', () => {
    try {
      burnWord(activeGroupId)
      const isOnline = groupMode(getState().groups[activeGroupId] ?? group) === 'online'
      showToast(isOnline ? 'Word rotated — syncing to group' : 'Word rotated', 'success', 2000)
      document.dispatchEvent(new CustomEvent('canary:vault-publish-now'))
      // Scramble animation — run after the re-render replaces the DOM
      requestAnimationFrame(() => {
        const freshWord = document.getElementById('hero-word')
        if (freshWord) {
          const finalText = freshWord.textContent ?? '••••••••'
          scrambleText(freshWord, finalText)
        }
      })
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to rotate word', 'error')
    }
  })

  const inviteBtn = container.querySelector<HTMLButtonElement>('#hero-invite-btn')
  inviteBtn?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:show-invite', { detail: { groupId: activeGroupId } }))
  })

  const callBtn = container.querySelector<HTMLButtonElement>('#hero-call-btn')
  callBtn?.addEventListener('click', () => {
    const { identity } = getState()
    const others = group.members.filter(m => m !== identity?.pubkey)
    if (others.length === 0) return

    if (others.length === 1) {
      document.dispatchEvent(new CustomEvent('canary:verify-call', {
        detail: { groupId: activeGroupId, pubkey: others[0] },
      }))
      return
    }

    // Multiple members — show a picker
    const pickerItems = others.map(pk => `
      <button class="btn btn--outline member-pick-btn" data-pubkey="${escapeHtml(pk)}" type="button" style="width:100%;text-align:left;margin-bottom:0.5rem;">
        ${escapeHtml(resolveName(pk, group))}
      </button>
    `).join('')

    let picker = document.getElementById('member-picker') as HTMLDialogElement | null
    if (!picker) {
      picker = document.createElement('dialog')
      picker.id = 'member-picker'
      picker.className = 'modal'
      document.body.appendChild(picker)
    }
    picker.innerHTML = `
      <div class="modal__form" style="min-width:240px;">
        <h2 class="modal__title">Who are you calling?</h2>
        ${pickerItems}
        <div class="modal__actions">
          <button class="btn" id="picker-cancel" type="button">Cancel</button>
        </div>
      </div>
    `
    picker.querySelector('#picker-cancel')?.addEventListener('click', () => picker!.close())
    picker.addEventListener('click', (e) => { if (e.target === picker) picker!.close() })
    picker.querySelectorAll('.member-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pk = (btn as HTMLElement).dataset.pubkey
        picker!.close()
        if (pk) {
          document.dispatchEvent(new CustomEvent('canary:verify-call', {
            detail: { groupId: activeGroupId, pubkey: pk },
          }))
        }
      })
    })
    picker.showModal()
  })

  // ── Countdown tick ─────────────────────────────────────────

  const progressBar = container.querySelector<HTMLElement>('#hero-progress-bar')
  const countdownLabel = container.querySelector<HTMLElement>('#hero-countdown-label')

  _tickInterval = setInterval(() => {
    const { groups: currentGroups } = getState()
    const currentGroup = currentGroups[activeGroupId]
    if (!currentGroup) {
      clearTick()
      return
    }

    const remaining = secondsUntilRotation(currentGroup)
    const pct = Math.min(
      100,
      Math.max(0, ((currentGroup.rotationInterval - remaining) / currentGroup.rotationInterval) * 100),
    )

    if (progressBar) progressBar.style.width = `${pct}%`
    if (countdownLabel) countdownLabel.textContent = formatRotationLabel(remaining, currentGroup.rotationInterval)

    // When the rotation window expires, re-render to pick up the new word.
    if (remaining === 0) {
      clearTick()
      renderHero(container)
    }
  }, 1000)
}
