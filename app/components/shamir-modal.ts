// app/components/shamir-modal.ts — Shamir secret sharing modal for master mnemonic backup

import { splitSecret, shareToWords } from '@forgesworn/shamir-words'
import { getState } from '../state.js'
import { escapeHtml } from '../utils/escape.js'
import { generateQR } from './qr.js'

// ── Constants ──────────────────────────────────────────────────

const CLIPBOARD_WIPE_MS = 30_000
const MODAL_ID = 'shamir-modal'
const MIN_SHARES = 2
const MAX_SHARES = 5
const DEFAULT_SHARES = 3
const DEFAULT_THRESHOLD = 2

// ── Public API ─────────────────────────────────────────────────

/**
 * Show a multi-step Shamir secret sharing modal that splits the user's
 * master mnemonic into word-encoded shares for distributed backup.
 */
export function showShamirModal(): void {
  // Remove any existing shamir modal
  document.getElementById(MODAL_ID)?.remove()

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

    const secretBytes = new TextEncoder().encode(mnemonic)
    const shares = splitSecret(secretBytes, threshold, total)
    const wordShares = shares.map((s) => shareToWords(s))

    renderSharesScreen(dialog, wordShares, 0)
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
      <h2 class="shamir-modal__title">${escapeHtml(shareLabel)}</h2>

      <ol class="shamir-modal__wordlist">${wordListHtml}</ol>

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
      // generateQR returns sanitised SVG from qrcode-generator — safe innerHTML
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
