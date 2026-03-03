// app/panels/hero.ts — Hero panel: verification word display with press-and-hold reveal

import { advanceCounter, syncCounter, getCounter } from 'canary-kit'
import { deriveToken } from 'canary-kit/token'
import { getState, updateGroup } from '../state.js'
import type { AppGroup } from '../types.js'
import { toTokenEncoding, GROUP_CONTEXT } from '../utils/encoding.js'

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

// ── Encoding label map ─────────────────────────────────────────

const ENCODING_LABELS: Record<AppGroup['encodingFormat'], string> = {
  words: 'Word',
  pin: 'PIN',
  hex: 'Hex',
}

const ENCODING_VALUES: AppGroup['encodingFormat'][] = ['words', 'pin', 'hex']

// ── Display token derivation ────────────────────────────────────

/**
 * Derive the current display token using the universal CANARY token API.
 * All encoding formats use the same derivation path.
 */
function getDisplayToken(group: AppGroup): string {
  const effectiveCounter = group.counter + group.usageOffset
  return deriveToken(group.seed, GROUP_CONTEXT, effectiveCounter, toTokenEncoding(group))
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

  const word = getDisplayToken(group)
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
        <span class="hero__countdown-label" id="hero-countdown-label">rotates in ${formatCountdown(secsLeft)} · ${militaryTime()}</span>
      </div>

      <div class="hero__encoding" id="hero-encoding">
        ${ENCODING_VALUES.map(
          (enc) =>
            `<button
              class="encoding-btn${group.encodingFormat === enc ? ' encoding-btn--active' : ''}"
              data-encoding="${enc}"
              type="button"
            >${ENCODING_LABELS[enc]}</button>`,
        ).join('')}
      </div>

      <button class="btn btn--ghost" id="burn-btn" type="button">I used this word</button>

    </section>
  `

  // ── Press-and-hold reveal ──────────────────────────────────

  const wordEl = container.querySelector<HTMLElement>('#hero-word')
  const revealBtn = container.querySelector<HTMLButtonElement>('#hero-reveal-btn')

  function showWord(): void {
    if (!wordEl) return
    wordEl.textContent = word
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
      showWord()
    })
    revealBtn.addEventListener('pointerup', hideWord)
    revealBtn.addEventListener('pointerleave', hideWord)
    revealBtn.addEventListener('pointercancel', hideWord)
  }

  // ── Encoding picker ────────────────────────────────────────

  const encodingRow = container.querySelector<HTMLElement>('#hero-encoding')
  encodingRow?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-encoding]')
    if (!btn) return
    const enc = btn.dataset.encoding as AppGroup['encodingFormat']
    if (!enc || enc === group.encodingFormat) return
    updateGroup(activeGroupId, { encodingFormat: enc })
  })

  // ── Burn button ────────────────────────────────────────────

  const burnBtn = container.querySelector<HTMLButtonElement>('#burn-btn')
  burnBtn?.addEventListener('click', () => {
    const { groups: currentGroups } = getState()
    const currentGroup = currentGroups[activeGroupId]
    if (!currentGroup) return
    const advanced = advanceCounter(currentGroup)
    updateGroup(activeGroupId, advanced)
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
    if (countdownLabel) countdownLabel.textContent = `rotates in ${formatCountdown(remaining)} · ${militaryTime()}`

    // When the rotation window expires, re-render to pick up the new word.
    if (remaining === 0) {
      clearTick()
      renderHero(container)
    }
  }, 1000)
}
