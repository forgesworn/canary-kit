// app/panels/verify.ts — Verify panel: spoken-word verification input

import { verifyWord, getCounter } from 'canary-kit'
import { getState } from '../state.js'
import type { VerifyStatus } from 'canary-kit'

// ── Status display config ──────────────────────────────────

const STATUS_ICONS: Record<VerifyStatus, string> = {
  verified: '✓',
  duress: '⚠',
  stale: '◷',
  failed: '✗',
}

function buildMessage(status: VerifyStatus, members?: string[]): string {
  switch (status) {
    case 'verified':
      return 'Verified — word is correct.'
    case 'duress': {
      const names = members?.length
        ? members.map((pk) => pk.slice(0, 8) + '…').join(', ')
        : 'unknown member'
      return `Duress — ${names} may be under coercion.`
    }
    case 'stale':
      return 'Stale — word is from a previous window.'
    case 'failed':
      return 'Failed — word does not match.'
  }
}

// ── Render ─────────────────────────────────────────────────

/**
 * Render the verify panel into the given container.
 * Clears container and returns early when no group is active.
 */
export function renderVerify(container: HTMLElement): void {
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

  container.innerHTML = `
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>

      <div class="verify-form">
        <input
          class="input"
          id="verify-input"
          type="text"
          placeholder="Enter the word you heard"
          autocomplete="off"
          spellcheck="false"
        />
        <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
      </div>

      <div id="verify-result" class="verify-result" hidden></div>
    </section>
  `

  const input = container.querySelector<HTMLInputElement>('#verify-input')
  const verifyBtn = container.querySelector<HTMLButtonElement>('#verify-btn')
  const resultEl = container.querySelector<HTMLElement>('#verify-result')

  if (!input || !verifyBtn || !resultEl) return

  // ── Verify click handler ───────────────────────────────

  function handleVerify(): void {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const spokenWord = input!.value.trim().toLowerCase()
    if (!spokenWord) return

    const nowSec = Math.floor(Date.now() / 1000)
    const counter = getCounter(nowSec, currentGroup.rotationInterval) + currentGroup.usageOffset

    const result = verifyWord(spokenWord, currentGroup.seed, currentGroup.members, counter, currentGroup.wordCount)

    // Remove all status classes before adding the new one
    resultEl!.className = 'verify-result'
    resultEl!.classList.add(`verify-result--${result.status}`)

    const icon = STATUS_ICONS[result.status]
    const message = buildMessage(result.status, result.members)

    resultEl!.innerHTML = `<span class="verify-icon">${icon}</span>${message}`
    resultEl!.hidden = false

    // Dispatch custom event for duress status
    if (result.status === 'duress') {
      document.dispatchEvent(
        new CustomEvent('canary:duress', {
          detail: { members: result.members ?? [] },
          bubbles: true,
        }),
      )
    }
  }

  verifyBtn.addEventListener('click', handleVerify)

  // Allow pressing Enter in the input field
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleVerify()
  })
}
