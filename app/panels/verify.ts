// app/panels/verify.ts — Verify panel: tap-to-verify with multiple choice

import { getCounter, deriveBeaconKey, buildDuressAlert, encryptDuressAlert } from 'canary-kit'
import { deriveToken, deriveDuressToken, verifyToken } from 'canary-kit/token'
import { getWord, WORDLIST_SIZE } from 'canary-kit/wordlist'
import { getState } from '../state.js'
import { broadcastAction } from '../sync.js'
import { showDuressAlert } from '../components/duress-alert.js'
import { toTokenEncoding, GROUP_CONTEXT, formatForDisplay } from '../utils/encoding.js'
import { escapeHtml } from '../utils/escape.js'

// ── Helpers ──────────────────────────────────────────────────

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

/** Generate n unique random decoy words that don't collide with excluded words. */
function randomDecoys(count: number, exclude: Set<string>): string[] {
  const decoys: string[] = []
  const used = new Set(exclude)
  while (decoys.length < count) {
    const idx = Math.floor(Math.random() * WORDLIST_SIZE)
    const word = getWord(idx).toLowerCase()
    if (!used.has(word)) {
      used.add(word)
      decoys.push(word)
    }
  }
  return decoys
}

/** Shuffle an array in place (Fisher-Yates). */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ── Duress handler (shared between tap and text paths) ──────

function handleDuressResult(identities: string[], groupId: string): void {
  for (const memberId of identities) {
    showDuressAlert(memberId, groupId, undefined, Math.floor(Date.now() / 1000))
  }

  document.dispatchEvent(
    new CustomEvent('canary:duress', {
      detail: { members: identities },
      bubbles: true,
    }),
  )

  const { groups } = getState()
  const group = groups[groupId]
  if (!group) return

  const beaconKey = deriveBeaconKey(group.seed)
  for (const memberId of identities) {
    const alert = buildDuressAlert(memberId, null)
    void encryptDuressAlert(beaconKey, alert).then((encrypted) => {
      console.info('[canary] Duress alert encrypted:', encrypted.slice(0, 32) + '…')
    })

    broadcastAction(groupId, {
      type: 'duress-alert',
      lat: 0,
      lon: 0,
      timestamp: Math.floor(Date.now() / 1000),
      opId: crypto.randomUUID(),
      subject: memberId,
    })
  }
}

// ── Render ─────────────────────────────────────────────────

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

  const { identity } = getState()
  const others = group.members.filter(m => m !== identity?.pubkey)
  const showMemberPicker = others.length > 1

  // ── Derive the correct word + duress words for all members ──
  const nowSec = Math.floor(Date.now() / 1000)
  const counter = getCounter(nowSec, group.rotationInterval) + group.usageOffset
  const encoding = toTokenEncoding(group)
  const correctWord = deriveToken(group.seed, GROUP_CONTEXT, counter, encoding).toLowerCase()

  // Collect all possible duress words (one per member)
  const duressWords = new Set<string>()
  for (const m of group.members) {
    const dw = deriveDuressToken(group.seed, GROUP_CONTEXT, m, counter, encoding, group.tolerance)
    if (dw) duressWords.add(dw.toLowerCase())
  }

  // Build 4 choices: correct + 1 duress + 2 random decoys
  // If no duress words available, use 3 decoys instead
  const exclude = new Set([correctWord, ...duressWords])
  const duressArr = Array.from(duressWords)
  const pickedDuress = duressArr.length > 0 ? duressArr[Math.floor(Math.random() * duressArr.length)] : null
  const decoyCount = pickedDuress ? 2 : 3
  const decoys = randomDecoys(decoyCount, exclude)
  const choices = shuffle([correctWord, ...(pickedDuress ? [pickedDuress] : []), ...decoys])

  // Format for display
  const formatted = choices.map(w => ({
    raw: w,
    display: formatForDisplay(w, group.encodingFormat),
  }))

  const memberOptions = others.map(pk =>
    `<option value="${pk}">${resolveName(pk).replace(/</g, '&lt;')}</option>`
  ).join('')

  const placeholder = group.encodingFormat === 'pin' ? 'Enter PIN' : group.encodingFormat === 'hex' ? 'Enter hex' : 'Enter word'

  container.innerHTML = `
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Someone told you a word? Tap what you heard.</p>

      ${showMemberPicker ? `<select class="input" id="verify-member" style="margin-bottom: 0.75rem;">
        <option value="">Who are you verifying?</option>
        ${memberOptions}
      </select>` : ''}

      <div class="verify-choices" id="verify-choices">
        ${formatted.map(({ raw, display }) =>
          `<button class="verify-choice" data-word="${escapeHtml(raw)}" type="button">${escapeHtml(display)}</button>`
        ).join('')}
      </div>

      <div id="verify-result" class="verify-result" hidden></div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${placeholder}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>
    </section>
  `

  const memberSelect = container.querySelector<HTMLSelectElement>('#verify-member')
  const resultEl = container.querySelector<HTMLElement>('#verify-result')
  if (!resultEl) return

  // ── Tap handler ─────────────────────────────────────────

  function handleTap(word: string, btn: HTMLButtonElement): void {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const selectedMember = memberSelect?.value
    if (memberSelect && !selectedMember) {
      resultEl!.hidden = false
      resultEl!.className = 'verify-result verify-result--invalid'
      resultEl!.textContent = 'Pick who you\u2019re verifying first.'
      return
    }

    const freshCounter = getCounter(Math.floor(Date.now() / 1000), currentGroup.rotationInterval) + currentGroup.usageOffset
    const result = verifyToken(
      currentGroup.seed,
      GROUP_CONTEXT,
      freshCounter,
      word,
      currentGroup.members,
      { encoding: toTokenEncoding(currentGroup), tolerance: currentGroup.tolerance },
    )

    const isValid = result.status === 'valid'
    const memberName = selectedMember ? resolveName(selectedMember) : 'Speaker'

    // Highlight the tapped button
    container.querySelectorAll('.verify-choice').forEach(b => b.classList.remove('verify-choice--correct', 'verify-choice--wrong'))
    btn.classList.add(isValid ? 'verify-choice--correct' : 'verify-choice--wrong')

    resultEl!.hidden = false
    resultEl!.className = `verify-result verify-result--${isValid ? 'valid' : 'invalid'}`
    resultEl!.textContent = isValid
      ? `${memberName} is verified.`
      : `${memberName} gave the wrong word.`

    if (result.status === 'duress') {
      handleDuressResult(result.identities ?? [], currentGroupId)
    }
  }

  container.querySelectorAll<HTMLButtonElement>('.verify-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const word = btn.dataset.word ?? ''
      handleTap(word, btn)
    })
  })

  // ── Text fallback handler ──────────────────────────────

  const input = container.querySelector<HTMLInputElement>('#verify-input')
  const verifyBtn = container.querySelector<HTMLButtonElement>('#verify-btn')

  function handleTextVerify(): void {
    const spokenWord = input?.value.trim().toLowerCase().replace(/-/g, '') ?? ''
    if (!spokenWord) return

    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const selectedMember = memberSelect?.value
    if (memberSelect && !selectedMember) {
      resultEl!.hidden = false
      resultEl!.className = 'verify-result verify-result--invalid'
      resultEl!.textContent = 'Pick who you\u2019re verifying first.'
      return
    }

    const freshCounter = getCounter(Math.floor(Date.now() / 1000), currentGroup.rotationInterval) + currentGroup.usageOffset
    const result = verifyToken(
      currentGroup.seed,
      GROUP_CONTEXT,
      freshCounter,
      spokenWord,
      currentGroup.members,
      { encoding: toTokenEncoding(currentGroup), tolerance: currentGroup.tolerance },
    )

    const isValid = result.status === 'valid'
    const memberName = selectedMember ? resolveName(selectedMember) : 'Speaker'

    resultEl!.hidden = false
    resultEl!.className = `verify-result verify-result--${isValid ? 'valid' : 'invalid'}`
    resultEl!.textContent = isValid
      ? `${memberName} is verified.`
      : `${memberName} gave the wrong word.`

    if (result.status === 'duress') {
      handleDuressResult(result.identities ?? [], currentGroupId)
    }
  }

  verifyBtn?.addEventListener('click', handleTextVerify)
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleTextVerify()
  })
}
