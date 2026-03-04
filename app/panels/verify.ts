// app/panels/verify.ts — Verify panel: spoken-token verification input

import { getCounter, deriveBeaconKey, buildDuressAlert, encryptDuressAlert } from 'canary-kit'
import { verifyToken } from 'canary-kit/token'
import { getState } from '../state.js'
import { broadcastAction } from '../sync.js'
import { showDuressAlert } from '../components/duress-alert.js'
import { toTokenEncoding, GROUP_CONTEXT } from '../utils/encoding.js'

// ── Status display config ──────────────────────────────────

type VerifyDisplayStatus = 'valid' | 'duress' | 'invalid'

const STATUS_ICONS: Record<VerifyDisplayStatus, string> = {
  valid: '✓',
  duress: '⚠',
  invalid: '✗',
}

function resolveName(pubkey: string): string {
  const { groups, activeGroupId, identity } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  if (!activeGroupId) return pubkey.slice(0, 8) + '\u2026'
  const group = groups[activeGroupId]
  if (!group) return pubkey.slice(0, 8) + '\u2026'
  const name = group.memberNames?.[pubkey]
  if (name) return name
  return pubkey.slice(0, 8) + '\u2026'
}

function buildMessage(status: VerifyDisplayStatus, identities?: string[]): string {
  switch (status) {
    case 'valid':
      return 'Verified — token is correct.'
    case 'duress': {
      const names = identities?.length
        ? identities.map(resolveName).join(', ')
        : 'unknown member'
      return `Duress — ${names} may be under coercion.`
    }
    case 'invalid':
      return 'Failed — token does not match.'
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

  const placeholder = group.encodingFormat === 'pin' ? 'Enter PIN' : group.encodingFormat === 'hex' ? 'Enter hex' : 'Enter word'

  container.innerHTML = `
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Someone told you a word? Type it here to check if it's valid, expired, or a duress signal.</p>

      <div class="verify-form">
        <input
          class="input"
          id="verify-input"
          type="text"
          placeholder="${placeholder}"
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

    const spokenWord = input!.value.trim().toLowerCase().replace(/-/g, '')
    if (!spokenWord) return

    const nowSec = Math.floor(Date.now() / 1000)
    const counter = getCounter(nowSec, currentGroup.rotationInterval) + currentGroup.usageOffset
    const encoding = toTokenEncoding(currentGroup)

    const result = verifyToken(
      currentGroup.seed,
      GROUP_CONTEXT,
      counter,
      spokenWord,
      currentGroup.members,
      { encoding, tolerance: currentGroup.tolerance },
    )

    resultEl!.className = 'verify-result'
    resultEl!.classList.add(`verify-result--${result.status}`)

    const icon = STATUS_ICONS[result.status]
    const message = buildMessage(result.status, result.identities)

    resultEl!.innerHTML = `<span class="verify-icon">${icon}</span><span class="verify-message"></span>`
    const messageEl = resultEl!.querySelector<HTMLElement>('.verify-message')
    if (messageEl) messageEl.textContent = message
    resultEl!.hidden = false

    if (result.status === 'duress') {
      document.dispatchEvent(
        new CustomEvent('canary:duress', {
          detail: { members: result.identities ?? [] },
          bubbles: true,
        }),
      )

      // Show the full-screen duress alert for the first identified member
      const duressMembers = result.identities ?? []
      if (duressMembers.length > 0) {
        showDuressAlert(duressMembers[0], currentGroupId)
      }

      // Build and encrypt a duress alert for each identified member
      const beaconKey = deriveBeaconKey(currentGroup.seed)
      for (const memberId of duressMembers) {
        const alert = buildDuressAlert(memberId, null)
        void encryptDuressAlert(beaconKey, alert).then((encrypted) => {
          console.info('[canary] Duress alert encrypted:', encrypted.slice(0, 32) + '…')
        })

        // Broadcast duress alert to group members via sync transport
        broadcastAction(currentGroupId, {
          type: 'duress-alert',
          lat: 0,
          lon: 0,
          timestamp: Math.floor(Date.now() / 1000),
          opId: crypto.randomUUID(),
        })
      }
    }
  }

  verifyBtn.addEventListener('click', handleVerify)

  // Allow pressing Enter in the input field
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleVerify()
  })
}
