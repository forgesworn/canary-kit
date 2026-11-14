// app/components/shamir-modal.ts — Shamir secret sharing modal for master mnemonic backup

import { splitSecret, shareToWords } from '@forgesworn/shamir-words'
import { getState } from '../state.js'
import { escapeHtml } from '../utils/escape.js'
import { generateQR } from './qr.js'

// ── Constants ──────────────────────────────────────────────────

const CLIPBOARD_WIPE_MS = 30_000
const MODAL_ID = 'shamir-modal'
const STYLE_ID = 'shamir-modal-styles'
const MIN_SHARES = 2
const MAX_SHARES = 5
const DEFAULT_SHARES = 3
const DEFAULT_THRESHOLD = 2

const STYLES = `
  .shamir-modal::backdrop { background: rgba(0, 0, 0, 0.72); }
  .shamir-modal {
    width: min(42rem, calc(100vw - 2rem));
    max-width: 42rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-surface);
    color: var(--text-primary);
    padding: 0;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  }
  .shamir-modal__content { padding: 1rem; display: grid; gap: 0.875rem; }
  .shamir-modal__close {
    justify-self: end; background: none; border: none; color: var(--text-muted);
    font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0;
  }
  .shamir-modal__title { margin: 0; font-size: 1.1rem; color: var(--text-bright); }
  .shamir-modal__field { display: grid; gap: 0.35rem; }
  .shamir-modal__field label { font-size: 0.75rem; color: var(--text-muted); }
  .shamir-modal__field input {
    width: 100%; font: inherit; padding: 0.55rem 0.7rem; border-radius: 6px;
    border: 1px solid var(--border); background: var(--bg-deep); color: var(--text-primary);
  }
  .shamir-modal__explain, .shamir-modal__hint {
    margin: 0; font-size: 0.78rem; line-height: 1.55; color: var(--text-secondary);
  }
  .shamir-modal__actions, .shamir-modal__nav { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .shamir-modal__wordlist {
    margin: 0; padding: 0.875rem 1rem 0.875rem 2.25rem; border: 1px solid var(--border);
    border-radius: 8px; background: var(--bg-deep); max-height: 18rem; overflow: auto;
    font-family: var(--font-mono); font-size: 0.77rem; line-height: 1.6;
  }
  .shamir-modal__share-box {
    border: 1px solid var(--border); border-radius: 8px; background: var(--bg-deep);
    padding: 0.875rem; font-family: var(--font-mono); font-size: 0.75rem;
    line-height: 1.55; word-break: break-word; max-height: 8rem; overflow: auto;
  }
  .shamir-modal__qr { border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; background: #fff; justify-self: center; }
  .shamir-modal__confirm-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
`

// ── Public API ─────────────────────────────────────────────────

/**
 * Show a multi-step Shamir secret sharing modal that splits the user's
 * master mnemonic into word-encoded shares for distributed backup.
 */
export function showShamirModal(): void {
  // Remove any existing shamir modal
  document.getElementById(MODAL_ID)?.remove()
  ensureStyles()

  const mnemonic = getState().identity?.mnemonic
  if (!mnemonic) {
    alert('No recovery phrase available. Generate or import an identity first.')
    return
  }

  const dialog = document.createElement('dialog')
  dialog.id = MODAL_ID
  dialog.className = 'modal shamir-modal'
  document.body.appendChild(dialog)

  // ── Wire: close on backdrop / cancel ───────────────────────
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeShamirModal(dialog)
  })
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault()
    // Only allow close if on confirm screen with checkbox checked
  })

  // Start with configure screen
  renderConfigureScreen(dialog, mnemonic)
  dialog.showModal()
}

// ── Screen 1: Configure ────────────────────────────────────────

function renderConfigureScreen(dialog: HTMLDialogElement, mnemonic: string): void {
  // All interpolated values are numeric constants or escaped — safe innerHTML usage
  // consistent with the rest of the codebase (export-modal.ts, header.ts, modal.ts)
  dialog.innerHTML = `
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">Split your recovery phrase into shares</h2>

      <div class="shamir-modal__field">
        <label for="shamir-total">Total shares</label>
        <input type="number" id="shamir-total" min="${MIN_SHARES}" max="${MAX_SHARES}" value="${DEFAULT_SHARES}" />
      </div>

      <div class="shamir-modal__field">
        <label for="shamir-threshold">Threshold</label>
        <input type="number" id="shamir-threshold" min="${MIN_SHARES}" max="${DEFAULT_SHARES}" value="${DEFAULT_THRESHOLD}" />
      </div>

      <p class="shamir-modal__explain" id="shamir-explain">
        You'll need any <strong>${DEFAULT_THRESHOLD}</strong> of <strong>${DEFAULT_SHARES}</strong> shares to recover.
        Distribute them to trusted people or locations.
      </p>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-split-btn" type="button">Split</button>
      </div>
    </div>
  `

  const closeBtn = dialog.querySelector<HTMLButtonElement>('.shamir-modal__close')
  closeBtn?.addEventListener('click', () => closeShamirModal(dialog))

  const totalInput = dialog.querySelector<HTMLInputElement>('#shamir-total')!
  const thresholdInput = dialog.querySelector<HTMLInputElement>('#shamir-threshold')!
  const explain = dialog.querySelector<HTMLElement>('#shamir-explain')!

  const updateExplain = (): void => {
    const total = clampInt(totalInput.value, MIN_SHARES, MAX_SHARES)
    const threshold = clampInt(thresholdInput.value, MIN_SHARES, total)
    // Only numeric values interpolated — no user-controlled content
    explain.innerHTML = `
      You'll need any <strong>${threshold}</strong> of <strong>${total}</strong> shares to recover.
      Distribute them to trusted people or locations.
    `
  }

  totalInput.addEventListener('input', () => {
    const total = clampInt(totalInput.value, MIN_SHARES, MAX_SHARES)
    // Adjust threshold max
    thresholdInput.max = String(total)
    if (parseInt(thresholdInput.value, 10) > total) {
      thresholdInput.value = String(total)
    }
    updateExplain()
  })

  thresholdInput.addEventListener('input', updateExplain)

  // ── Split ──────────────────────────────────────────────────
  const splitBtn = dialog.querySelector<HTMLButtonElement>('#shamir-split-btn')!
  splitBtn.addEventListener('click', () => {
    const total = clampInt(totalInput.value, MIN_SHARES, MAX_SHARES)
    const threshold = clampInt(thresholdInput.value, MIN_SHARES, total)
    try {
      const secretBytes = new TextEncoder().encode(mnemonic)
      const shares = splitSecret(secretBytes, threshold, total)
      const wordShares = shares.map((s) => shareToWords(s))
      renderSharesScreen(dialog, wordShares, 0)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to split recovery phrase.')
    }
  })
}

// ── Screen 2: Display shares ───────────────────────────────────

function renderSharesScreen(
  dialog: HTMLDialogElement,
  wordShares: string[][],
  currentIndex: number,
): void {
  const total = wordShares.length
  const words = wordShares[currentIndex]
  const shareLabel = `Share ${currentIndex + 1} of ${total}`
  const wordListHtml = words
    .map((w, i) => `<li>${i + 1}. ${escapeHtml(w)}</li>`)
    .join('')
  const shareText = words.join(' ')

  // All interpolated values are escaped via escapeHtml() — safe innerHTML usage
  dialog.innerHTML = `
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">${escapeHtml(shareLabel)}</h2>
      <p class="shamir-modal__hint">Keep each share separate. Any threshold-sized subset can restore your recovery phrase.</p>

      <ol class="shamir-modal__wordlist">${wordListHtml}</ol>
      <div class="shamir-modal__share-box">${escapeHtml(shareText)}</div>

      <div class="shamir-modal__actions">
        <button class="btn btn--sm" id="shamir-copy" type="button">Copy</button>
        <button class="btn btn--sm" id="shamir-qr-toggle" type="button">Show QR</button>
      </div>

      <div class="shamir-modal__qr" id="shamir-qr-area" hidden></div>

      <div class="shamir-modal__nav">
        <button class="btn btn--sm" id="shamir-prev" type="button" ${currentIndex === 0 ? 'disabled' : ''}>Previous</button>
        ${currentIndex < total - 1
          ? '<button class="btn btn--sm btn--primary" id="shamir-next" type="button">Next</button>'
          : '<button class="btn btn--sm btn--primary" id="shamir-done" type="button">Done</button>'}
      </div>
    </div>
  `

  dialog.querySelector<HTMLButtonElement>('.shamir-modal__close')?.addEventListener('click', () => closeShamirModal(dialog))

  // ── Wire: copy ─────────────────────────────────────────────
  const copyBtn = dialog.querySelector<HTMLButtonElement>('#shamir-copy')!
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      copyBtn.textContent = '\u2713 Copied!'
      setTimeout(() => { copyBtn.textContent = 'Copy' }, 2000)
      setTimeout(() => { navigator.clipboard.writeText('').catch(() => {}) }, CLIPBOARD_WIPE_MS)
    } catch { /* clipboard may be blocked */ }
  })

  // ── Wire: QR toggle ────────────────────────────────────────
  const qrBtn = dialog.querySelector<HTMLButtonElement>('#shamir-qr-toggle')!
  const qrArea = dialog.querySelector<HTMLElement>('#shamir-qr-area')!
  let qrVisible = false

  qrBtn.addEventListener('click', () => {
    qrVisible = !qrVisible
    if (qrVisible) {
      // generateQR returns SVG built from the module grid alone, no input text — safe innerHTML
      qrArea.innerHTML = generateQR(shareText)
      qrArea.hidden = false
      qrBtn.textContent = 'Hide QR'
    } else {
      qrArea.hidden = true
      qrArea.textContent = ''
      qrBtn.textContent = 'Show QR'
    }
  })

  // ── Wire: navigation ───────────────────────────────────────
  const prevBtn = dialog.querySelector<HTMLButtonElement>('#shamir-prev')
  const nextBtn = dialog.querySelector<HTMLButtonElement>('#shamir-next')
  const doneBtn = dialog.querySelector<HTMLButtonElement>('#shamir-done')

  prevBtn?.addEventListener('click', () => {
    if (currentIndex > 0) renderSharesScreen(dialog, wordShares, currentIndex - 1)
  })
  nextBtn?.addEventListener('click', () => {
    if (currentIndex < total - 1) renderSharesScreen(dialog, wordShares, currentIndex + 1)
  })
  doneBtn?.addEventListener('click', () => {
    renderConfirmScreen(dialog)
  })
}

// ── Screen 3: Confirm ──────────────────────────────────────────

function renderConfirmScreen(dialog: HTMLDialogElement): void {
  // Static content only — no user-controlled values interpolated
  dialog.innerHTML = `
    <div class="shamir-modal__content">
      <button class="shamir-modal__close" type="button" aria-label="Close">&times;</button>
      <h2 class="shamir-modal__title">Confirm backup</h2>

      <label class="shamir-modal__confirm-label">
        <input type="checkbox" id="shamir-confirm-check" />
        I've saved all shares
      </label>

      <div class="shamir-modal__actions">
        <button class="btn btn--primary" id="shamir-close-btn" type="button" disabled>Close</button>
      </div>
    </div>
  `

  dialog.querySelector<HTMLButtonElement>('.shamir-modal__close')?.addEventListener('click', () => closeShamirModal(dialog))

  const checkbox = dialog.querySelector<HTMLInputElement>('#shamir-confirm-check')!
  const closeBtn = dialog.querySelector<HTMLButtonElement>('#shamir-close-btn')!

  checkbox.addEventListener('change', () => {
    closeBtn.disabled = !checkbox.checked
  })

  closeBtn.addEventListener('click', () => closeShamirModal(dialog))
}

// ── Internal helpers ───────────────────────────────────────────

function closeShamirModal(dialog: HTMLDialogElement): void {
  dialog.close()
  dialog.remove()
}

function clampInt(value: string, min: number, max: number): number {
  const n = parseInt(value, 10)
  if (isNaN(n)) return min
  return Math.max(min, Math.min(max, n))
}

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}
