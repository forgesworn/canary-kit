// app/panels/verify.ts — Verify panel: spoken-token verification input

import { getCounter, deriveBeaconKey, buildDuressAlert, encryptDuressAlert } from 'canary-kit'
import { verifyToken } from 'canary-kit/token'
import { getState } from '../state.js'
import { broadcastAction } from '../sync.js'
import { toTokenEncoding, GROUP_CONTEXT } from '../utils/encoding.js'

// ── Status display config ──────────────────────────────────

type VerifyDisplayStatus = 'valid' | 'invalid'

const STATUS_ICONS: Record<VerifyDisplayStatus, string> = {
  valid: '✓',
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

  const { identity } = getState()
  const others = group.members.filter(m => m !== identity?.pubkey)
  const memberOptions = others.map(pk =>
    `<option value="${pk}">${resolveName(pk).replace(/</g, '&lt;')}</option>`
  ).join('')
  const showMemberPicker = others.length > 0

  container.innerHTML = `
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Someone told you a word? ${showMemberPicker ? 'Pick who you\'re talking to and type' : 'Type'} it here.</p>

      <div class="verify-form">
        ${showMemberPicker ? `<select class="input" id="verify-member" style="margin-bottom: 0.5rem;">
          ${others.length > 1 ? '<option value="">Who are you verifying?</option>' : ''}
          ${memberOptions}
        </select>` : ''}
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
  const memberSelect = container.querySelector<HTMLSelectElement>('#verify-member')
  const verifyBtn = container.querySelector<HTMLButtonElement>('#verify-btn')
  const resultEl = container.querySelector<HTMLElement>('#verify-result')

  if (!input || !verifyBtn || !resultEl) return

  // ── Verify click handler ───────────────────────────────

  function handleVerify(): void {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const selectedMember = memberSelect?.value
    if (memberSelect && !selectedMember) {
      resultEl!.className = 'verify-result verify-result--invalid'
      resultEl!.innerHTML = `<span class="verify-icon">${STATUS_ICONS.invalid}</span><span class="verify-message">Pick who you're verifying first.</span>`
      resultEl!.hidden = false
      return
    }

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

    // CANARY-DURESS UX: duress result MUST appear identical to 'invalid' on the
    // verifier's screen.  An attacker observing the screen must not see any
    // difference between "wrong word" and "duress word".  The real duress
    // response is delivered via background channels (sync broadcast, overlay
    // on *other* group members' devices).
    const displayStatus: VerifyDisplayStatus = result.status === 'duress' ? 'invalid' : result.status === 'valid' ? 'valid' : 'invalid'

    resultEl!.className = 'verify-result'
    resultEl!.classList.add(`verify-result--${displayStatus}`)

    const memberName = selectedMember ? resolveName(selectedMember) : 'Speaker'
    const icon = STATUS_ICONS[displayStatus]
    let message: string
    if (displayStatus === 'valid') {
      message = `${memberName} is verified — word is correct.`
    } else {
      message = `${memberName} gave the wrong word — they may not have the current group key.`
    }

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

      // Duress alert is broadcast silently — no local overlay shown to the
      // verifier.  Other group members' devices will show the full-screen
      // alert when they receive the sync message.
      const duressMembers = result.identities ?? []

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
          subject: memberId,
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
