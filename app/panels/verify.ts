// app/panels/verify.ts — Verify panel: select member, then tap what you heard

import { getCounter, deriveDuressKey, buildDuressAlert, encryptDuressAlert } from 'canary-kit'
import { deriveToken, deriveDuressToken, verifyToken } from 'canary-kit/token'
import { getWord, WORDLIST_SIZE } from 'canary-kit/wordlist'
import { getState } from '../state.js'
import { broadcastAction } from '../sync.js'
import { showDuressAlert } from '../components/duress-alert.js'
import { toTokenEncoding, GROUP_CONTEXT, formatForDisplay } from '../utils/encoding.js'
import { escapeHtml } from '../utils/escape.js'

// ── Helpers ──────────────────────────────────────────────────

/** CSPRNG-backed random integer in [0, max). */
function secureRandom(max: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
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

function randomDecoys(count: number, exclude: Set<string>): string[] {
  const decoys: string[] = []
  const used = new Set(exclude)
  while (decoys.length < count) {
    const idx = secureRandom(WORDLIST_SIZE)
    const word = getWord(idx).toLowerCase()
    if (!used.has(word)) {
      used.add(word)
      decoys.push(word)
    }
  }
  return decoys
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ── Duress handler ──────────────────────────────────────────

function handleDuressResult(identities: string[], groupId: string): void {
  for (const memberId of identities) {
    showDuressAlert(memberId, groupId, undefined, Math.floor(Date.now() / 1000), true)
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

  const duressKey = deriveDuressKey(group.seed)
  for (const memberId of identities) {
    const alert = buildDuressAlert(memberId, null)
    void encryptDuressAlert(duressKey, alert).then((encrypted) => {
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

  if (others.length === 0) {
    container.innerHTML = `
      <section class="panel verify-panel">
        <h2 class="panel__title">Verify Someone</h2>
        <p class="settings-hint">No other members to verify yet. Invite someone first.</p>
      </section>
    `
    return
  }

  // ── Step 1: show member buttons ──────────────────────────
  const memberButtons = others.map(pk =>
    `<button class="verify-member-btn btn btn--outline" data-pubkey="${escapeHtml(pk)}" type="button">${escapeHtml(resolveName(pk))}</button>`
  ).join('')

  container.innerHTML = `
    <section class="panel verify-panel">
      <h2 class="panel__title">Verify Someone</h2>
      <p class="settings-hint">Who are you verifying?</p>

      <div class="verify-member-list" id="verify-member-list">
        ${memberButtons}
      </div>

      <div id="verify-choices-area" hidden>
        <p class="settings-hint" id="verify-prompt"></p>
        <div class="verify-choices" id="verify-choices"></div>
      </div>

      <details class="verify-fallback" style="margin-top: 0.75rem;">
        <summary class="settings-hint" style="cursor: pointer;">Type manually</summary>
        <div class="verify-form" style="margin-top: 0.5rem;">
          <input class="input" id="verify-input" type="text" placeholder="${group.encodingFormat === 'pin' ? 'Enter PIN' : 'Enter word'}" autocomplete="off" spellcheck="false" />
          <button class="btn btn--primary" id="verify-btn" type="button">Verify</button>
        </div>
      </details>

      <div id="verify-result" class="verify-result" hidden></div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn--ghost" id="verify-back" type="button" hidden>Verify another</button>
      </div>
    </section>
  `

  const memberList = container.querySelector<HTMLElement>('#verify-member-list')!
  const choicesArea = container.querySelector<HTMLElement>('#verify-choices-area')!
  const choicesDiv = container.querySelector<HTMLElement>('#verify-choices')!
  const promptEl = container.querySelector<HTMLElement>('#verify-prompt')!
  const resultEl = container.querySelector<HTMLElement>('#verify-result')!
  const backBtn = container.querySelector<HTMLButtonElement>('#verify-back')!

  // ── Step 2: on member click, show word choices ──────────

  function showChoicesFor(pubkey: string): void {
    const { groups: g, activeGroupId: gid } = getState()
    if (!gid) return
    const currentGroup = g[gid]
    if (!currentGroup) return

    const nowSec = Math.floor(Date.now() / 1000)
    const counter = getCounter(nowSec, currentGroup.rotationInterval) + currentGroup.usageOffset
    const encoding = toTokenEncoding(currentGroup)

    const correctWord = deriveToken(currentGroup.seed, GROUP_CONTEXT, counter, encoding, pubkey).toLowerCase()
    const theirDuress = deriveDuressToken(currentGroup.seed, GROUP_CONTEXT, pubkey, counter, encoding, currentGroup.tolerance)?.toLowerCase()

    const exclude = new Set([correctWord])
    if (theirDuress) exclude.add(theirDuress)
    const decoyCount = theirDuress ? 2 : 3
    const decoys = randomDecoys(decoyCount, exclude)
    const choices = shuffle([correctWord, ...(theirDuress ? [theirDuress] : []), ...decoys])

    const memberName = resolveName(pubkey)
    promptEl.textContent = `Tap the word ${memberName} just said:`
    resultEl.hidden = true

    choicesDiv.innerHTML = choices.map(w =>
      `<button class="verify-choice" data-word="${escapeHtml(w)}" type="button">${escapeHtml(formatForDisplay(w, currentGroup.encodingFormat))}</button>`
    ).join('')

    memberList.hidden = true
    choicesArea.hidden = false

    // Wire tap handlers
    choicesDiv.querySelectorAll<HTMLButtonElement>('.verify-choice').forEach(btn => {
      btn.addEventListener('click', () => handleTap(btn.dataset.word ?? '', btn, pubkey))
    })
  }

  function handleTap(word: string, btn: HTMLButtonElement, memberPubkey: string): void {
    const { groups: g, activeGroupId: gid } = getState()
    if (!gid) return
    const currentGroup = g[gid]
    if (!currentGroup) return

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
    const memberName = resolveName(memberPubkey)

    choicesDiv.querySelectorAll('.verify-choice').forEach(b => b.classList.remove('verify-choice--correct', 'verify-choice--wrong'))
    btn.classList.add(isValid ? 'verify-choice--correct' : 'verify-choice--wrong')

    resultEl.hidden = false
    resultEl.className = `verify-result verify-result--${isValid ? 'valid' : 'invalid'}`
    resultEl.textContent = isValid
      ? `${memberName} is verified.`
      : `${memberName} gave the wrong word.`
    backBtn.hidden = false

    if (result.status === 'duress') {
      handleDuressResult(result.identities ?? [], gid)
    }
  }

  // Wire member buttons
  container.querySelectorAll<HTMLButtonElement>('.verify-member-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pk = btn.dataset.pubkey
      if (pk) showChoicesFor(pk)
    })
  })

  // Back button
  backBtn.addEventListener('click', () => {
    memberList.hidden = false
    choicesArea.hidden = true
    resultEl.hidden = true
    backBtn.hidden = true
  })

  // ── Text fallback ─────────────────────────────────────────

  const input = container.querySelector<HTMLInputElement>('#verify-input')
  const verifyBtn = container.querySelector<HTMLButtonElement>('#verify-btn')

  function handleTextVerify(): void {
    const spokenWord = input?.value.trim().toLowerCase().replace(/-/g, '') ?? ''
    if (!spokenWord) return

    const { groups: g, activeGroupId: gid } = getState()
    if (!gid) return
    const currentGroup = g[gid]
    if (!currentGroup) return

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

    resultEl.hidden = false
    resultEl.className = `verify-result verify-result--${isValid ? 'valid' : 'invalid'}`
    resultEl.textContent = isValid ? 'Verified.' : 'Wrong word.'
    backBtn.hidden = false

    if (result.status === 'duress') {
      handleDuressResult(result.identities ?? [], gid)
    }
  }

  verifyBtn?.addEventListener('click', handleTextVerify)
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleTextVerify()
  })
}
