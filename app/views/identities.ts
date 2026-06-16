// app/views/identities.ts — Identity hub: master card, tree nav, detail panel, archive
//
// Numbers Station aesthetic — deep slate, amber accents, monospace body,
// Playfair Display headings. Matches the existing canary-kit design language.

import { getState, update, updateGroup } from '../state.js'
import { isPersonasInitialised, createPersona, derivePathIdentity } from '../persona.js'
import { renderIdentityTree, wireIdentityTree } from '../components/identity-tree.js'
import { walkTree, findById } from '../persona-tree.js'
import { personaColour } from '../components/persona-picker.js'
import { generateQR } from '../components/qr.js'
import { showToast } from '../components/toast.js'
import { escapeHtml } from '../utils/escape.js'
import { identityNodeLabel, identityNodeType } from '../types.js'
import type { AppPersona, AppGroup, IdentityNodeType } from '../types.js'
import type { DerivationPathSegment } from '../persona.js'
import { identitySignerLabel } from '../nostr/signet.js'

// ── Module state ──────────────────────────────────────────────

let _archivedVisible = false
let _backupRevealed = false
let _selectedPersonaId: string | null = null
let _menuOpen = false
let _qrVisible = false
let _customRelayEditing = false
let _wireAbort: AbortController | null = null
let _devDerivationInputs: DerivationPathSegment[] = [
  { name: '', index: 0 },
  { name: '', index: 0 },
  { name: '', index: 0 },
]
let _devDerivationReveal = false

// ── Helpers ───────────────────────────────────────────────────

function truncateNpub(npub: string): string {
  if (npub.length <= 16) return npub
  return `${npub.slice(0, 8)}\u2026${npub.slice(-4)}`
}

function isValidPersonaName(name: string): boolean {
  if (name.length === 0 || name.length > 32) return false
  if (name !== name.toLowerCase()) return false
  if (/\s/.test(name)) return false
  return true
}

function describeIdentityNode(node: AppPersona): string {
  return identityNodeType(node) === 'account'
    ? 'A standalone child key you can export as an nsec account.'
    : 'A reusable branch for related identities, profiles, and group keys.'
}

function actionVerb(node: AppPersona): string {
  return identityNodeType(node) === 'account' ? 'account' : 'persona'
}

function identityCapabilityStatus(): { label: string; detail: string; recoveryBacked: boolean } {
  const identity = getState().identity
  if (!identity) {
    return { label: 'No identity', detail: 'Create or restore a mnemonic-backed root to use the identity tree and recovery features.', recoveryBacked: false }
  }
  if (identity.signerType === 'nip07') {
    return { label: 'Signet managed', detail: 'Your external signer keeps the root secret private, so canary-kit cannot derive or back up the tree here.', recoveryBacked: false }
  }
  if (identity.mnemonic) {
    return { label: 'Mnemonic-backed root', detail: 'This root supports the full nsec-tree workflow: derived personas, derived accounts, proofs, and phrase/Shamir recovery.', recoveryBacked: true }
  }
  return { label: 'nsec-backed root', detail: 'This imported nsec can still derive the identity tree, but it has no recovery phrase. Create a new mnemonic-backed root only if you want phrase/Shamir recovery.', recoveryBacked: false }
}

function hasProfileChanges(persona: AppPersona, panel: HTMLElement): boolean {
  const displayNameInput = panel.querySelector<HTMLInputElement>('[data-field="displayName"]')
  const aboutInput = panel.querySelector<HTMLInputElement>('[data-field="about"]')
  const pictureInput = panel.querySelector<HTMLInputElement>('[data-field="picture"]')
  if (!displayNameInput && !aboutInput && !pictureInput) return false

  return (
    (displayNameInput?.value ?? '') !== (persona.displayName ?? '') ||
    (aboutInput?.value ?? '') !== (persona.about ?? '') ||
    (pictureInput?.value ?? '') !== (persona.picture ?? '')
  )
}

function getSelectedDerivationPath(): DerivationPathSegment[] | null {
  if (!_selectedPersonaId) return null
  const found = findById(getState().personas, _selectedPersonaId)
  if (!found) return null
  return [
    ...found.ancestors.map((ancestor) => ({ name: ancestor.name, index: ancestor.index })),
    { name: found.persona.name, index: found.persona.index },
  ]
}

function setDevDerivationInputs(path: readonly DerivationPathSegment[]): void {
  _devDerivationInputs = [
    { name: path[0]?.name ?? '', index: path[0]?.index ?? 0 },
    { name: path[1]?.name ?? '', index: path[1]?.index ?? 0 },
    { name: path[2]?.name ?? '', index: path[2]?.index ?? 0 },
  ]
  _devDerivationReveal = false
}

function formatDerivationChain(path: readonly DerivationPathSegment[]): string {
  return path.map((segment, index) => (
    index === 0
      ? `derivePersona(${segment.name}, ${segment.index ?? 0})`
      : `persona:${segment.name}@${segment.index ?? 0}`
  )).join(' → ')
}

function readDevDerivation():
  | { path: DerivationPathSegment[]; npub: string; nsec: string }
  | { error: string }
  | null {
  const path = _devDerivationInputs
    .map((segment) => ({ name: segment.name.trim(), index: segment.index ?? 0 }))
    .filter((segment) => segment.name.length > 0)
  if (path.length === 0) return null
  try {
    const identity = derivePathIdentity(path)
    return { path, npub: identity.npub, nsec: identity.nsec }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to derive identity' }
  }
}

function renderDerivationFeedback(): string {
  const derivation = readDevDerivation()
  if (derivation === null) {
    return `<div class="id-derive__hint">Add at least the first level to derive an identity.</div>`
  }
  if ('error' in derivation) {
    return `<div class="id-derive__error">${escapeHtml(derivation.error)}</div>`
  }
  return `
    <div class="id-derive__result">
      <div class="id-derive__chain">Path: ${escapeHtml(formatDerivationChain(derivation.path))}</div>
      <div class="id-derive__row">
        <span class="id-derive__key">npub</span>
        <code class="id-derive__value">${escapeHtml(derivation.npub)}</code>
      </div>
      <div class="id-derive__row">
        <span class="id-derive__key">nsec</span>
        <code class="id-derive__value id-derive__value--secret${_devDerivationReveal ? ' id-derive__value--revealed' : ''}">${escapeHtml(derivation.nsec)}</code>
      </div>
      <div class="id-derive__copy">
        <button class="btn btn--sm" id="id-derive-copy-npub">Copy npub</button>
        <button class="btn btn--sm" id="id-derive-copy-nsec">${_devDerivationReveal ? 'Copy nsec' : 'Reveal + copy nsec'}</button>
      </div>
    </div>
  `
}

function refreshDerivationPanel(container: HTMLElement): void {
  const feedback = container.querySelector<HTMLElement>('#id-derive-feedback')
  if (feedback) feedback.innerHTML = renderDerivationFeedback()
}

// ── Styles ────────────────────────────────────────────────────

const STYLES = `
  .id-hub { max-width: 600px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

  .id-hub__heading {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--text-bright);
    margin: 0 0 0.25rem;
    letter-spacing: 0.01em;
  }

  .id-hub__sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  /* ── Master card ────────────────────────────────── */

  .id-master {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-master__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .id-master__stats {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .id-master__actions {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .id-master__mnemonic {
    margin-top: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.625rem 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
    filter: blur(5px);
    transition: filter 0.2s var(--ease-out);
    line-height: 1.6;
    word-spacing: 0.25em;
  }

  .id-master__mnemonic--revealed {
    filter: none;
    user-select: text;
  }

  .id-master__mnemonic-hint {
    font-size: 0.6875rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    display: block;
  }

  .id-choice {
    margin-top: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-deep);
    padding: 0.875rem;
    display: grid;
    gap: 0.75rem;
  }

  .id-choice__title {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-bright);
  }

  .id-choice__sub {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .id-choice__grid {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  .id-choice__card {
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-surface);
    padding: 0.75rem;
    display: grid;
    gap: 0.5rem;
  }

  .id-choice__card-title {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-primary);
  }

  .id-choice__list {
    margin: 0;
    padding-left: 1rem;
    font-size: 0.75rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .id-derive {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: grid;
    gap: 0.75rem;
  }

  .id-derive__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .id-derive__title {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-bright);
  }

  .id-derive__sub {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .id-derive__actions {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .id-derive__grid {
    display: grid;
    gap: 0.625rem;
    grid-template-columns: 1fr;
  }

  .id-derive__field {
    display: grid;
    gap: 0.25rem;
  }

  .id-derive__label {
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .id-derive__hint,
  .id-derive__error {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  .id-derive__hint { color: var(--text-muted); }
  .id-derive__error { color: var(--failed); }

  .id-derive__result {
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem;
    display: grid;
    gap: 0.625rem;
  }

  .id-derive__chain {
    font-size: 0.6875rem;
    color: var(--text-muted);
    word-break: break-word;
  }

  .id-derive__row {
    display: grid;
    gap: 0.25rem;
  }

  .id-derive__key {
    font-size: 0.6875rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .id-derive__value {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    word-break: break-all;
  }

  .id-derive__value--secret {
    filter: blur(5px);
    user-select: none;
  }

  .id-derive__value--revealed {
    filter: none;
    user-select: text;
  }

  .id-derive__copy {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  /* ── Empty state ────────────────────────────────── */

  .id-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    border: 1px dashed var(--border);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .id-empty__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }

  .id-empty__title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }

  .id-empty__text {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 380px;
    margin: 0 auto 1.25rem;
  }

  /* ── Create form ────────────────────────────────── */

  .id-create {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .id-create__error {
    font-size: 0.75rem;
    color: var(--failed);
    min-height: 1.125rem;
  }

  /* ── Section divider ────────────────────────────── */

  .id-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5rem 0;
  }

  /* ── Archived ───────────────────────────────────── */

  .id-archived__toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: left;
  }

  .id-archived__toggle:hover { color: var(--text-secondary); }

  .id-archived__list {
    overflow: hidden;
    transition: max-height 0.3s var(--ease-out);
  }

  .id-archived__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
  }

  .id-archived__badge {
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    color: #fff;
    opacity: 0.5;
  }

  .id-archived__name { color: var(--text-muted); }
  .id-archived__npub { color: var(--text-muted); opacity: 0.5; font-size: 0.6875rem; flex: 1; }

  /* ── NIP-07 fallback ────────────────────────────── */

  .id-nip07 { padding: 2rem 1.5rem; }

  .id-nip07__card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .id-nip07__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .id-nip07__icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--bg-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .id-nip07__why {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 1.25rem;
  }

  .id-nip07__why h3 {
    font-family: var(--font-display);
    font-size: 0.9375rem;
    margin: 0 0 0.75rem;
    color: var(--text-primary);
  }

  .id-nip07__why p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0 0 0.625rem;
  }

  .id-nip07__why details {
    font-size: 0.75rem;
    color: var(--text-muted);
    opacity: 0.7;
    margin-top: 0.75rem;
  }

  .id-nip07__why summary { cursor: pointer; }
  .id-nip07__why code { font-family: var(--font-mono); font-size: 0.6875rem; }

  /* ── Detail panel ────────────────────────────────── */

  .id-detail {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-500);
    border-radius: 6px;
    padding: 1rem 1.25rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .id-detail__hint {
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-align: center;
    padding: 1.5rem 0;
  }

  .id-detail__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__badge {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .persona-card__breadcrumb {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding-top: 0.625rem;
    line-height: 1.4;
  }

  .persona-card__breadcrumb-sep {
    opacity: 0.4;
    margin: 0 0.125rem;
  }

  .persona-card__breadcrumb-current {
    color: var(--text-secondary);
  }

  .persona-card__npub {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--text-muted);
    padding: 0.625rem 0;
    word-break: break-all;
  }

  .persona-card__section {
    padding: 0.5rem 0;
  }

  .persona-card__section-title {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  .persona-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .persona-card__field-label {
    font-size: 0.6875rem;
    color: var(--text-muted);
  }

  .persona-card__input {
    font-size: 0.8125rem;
  }

  .persona-card__publish-btn {
    margin-top: 0.375rem;
  }

  .persona-card__relay-default {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .persona-card__customise-link {
    font-size: 0.75rem;
    color: var(--amber-400);
    margin-left: 0.5rem;
    text-decoration: none;
  }

  .persona-card__customise-link:hover {
    text-decoration: underline;
  }

  .persona-card__group-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .persona-card__group-chip {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-deep);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: border-color 0.15s var(--ease-out);
  }

  .persona-card__group-chip:hover {
    border-color: var(--amber-400);
    color: var(--text-primary);
  }

  .persona-card__group-chip-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0;
  }

  .persona-card__group-remove {
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.25rem 0.25rem;
    background: none;
    border: 1px solid var(--border);
    border-left: none;
    border-radius: 0 3px 3px 0;
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }

  .persona-card__group-chip-wrap:hover .persona-card__group-remove {
    opacity: 1;
  }

  .persona-card__group-remove:hover {
    color: var(--failed);
  }

  .persona-card__group-chip-wrap .persona-card__group-chip {
    border-radius: 3px 0 0 3px;
  }

  .persona-card__assign-select {
    margin-top: 0.375rem;
  }

  .persona-card__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding-top: 0.75rem;
    flex-wrap: wrap;
  }

  .persona-card__more {
    position: relative;
    margin-left: auto;
  }

  .persona-card__more-btn {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }

  .persona-card__menu {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 10;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    min-width: 160px;
    padding: 0.25rem 0;
  }

  .persona-card__menu-item {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.1s;
  }

  .persona-card__menu-item:hover {
    background: var(--bg-hover);
  }

  .persona-card__menu-item--danger {
    color: var(--failed);
  }

  .persona-card__qr {
    text-align: center;
    padding: 0.75rem 0;
  }

  .persona-card__qr-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--text-muted);
    margin-top: 0.375rem;
  }

  .persona-card__meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* ── Mobile ─────────────────────────────────────── */

  @media (max-width: 480px) {
    .id-hub { padding: 1rem 0.75rem 2rem; }

    .id-master__row {
      flex-direction: column;
      align-items: flex-start;
    }

    .id-master__actions {
      width: 100%;
    }

    .id-master__actions .btn {
      flex: 1;
      min-width: 0;
      text-align: center;
    }

    .id-create {
      flex-direction: column;
    }

    .id-create .input {
      width: 100%;
    }

    .persona-card__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .persona-card__more {
      margin-left: 0;
    }

    .persona-card__menu {
      position: fixed;
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      top: auto;
      border-radius: 8px;
    }

    .persona-card__menu-item {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
  }
`

// ── Render: external signer fallback ─────────────────────────

function renderNip07Fallback(): string {
  const { identity, groups } = getState()
  const pubkey = identity?.pubkey ?? ''
  const npubShort = pubkey ? `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}` : 'unknown'
  const groupCount = Object.keys(groups).length
  const signerLabel = identitySignerLabel(identity)

  return `
    <div class="id-nip07">
      <div class="id-nip07__card">
        <div class="id-nip07__header">
          <div class="id-nip07__icon">\u{1F511}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.9375rem;">Your Identity</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(npubShort)} \u00B7 ${escapeHtml(signerLabel)} \u00B7 ${groupCount} group${groupCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div class="id-nip07__why">
        <h3>Why can\u2019t I manage personas?</h3>
        <p>Your external signer keeps your private key secure by never exposing it to apps. This is good security \u2014 but it means canary-kit cannot derive sub-identities from your key.</p>
        <p>Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key for cryptographic derivation. Your signer only allows signing and encryption.</p>
        <p>To use persona features, create a new account with a recovery phrase or import an existing one.</p>
        <details>
          <summary>Technical detail</summary>
          <p style="margin: 0.5rem 0 0; line-height: 1.5;">nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>. Signet signers expose <code>signEvent()</code> and <code>nip44.encrypt()</code> but not the raw key bytes. A future NIP could add <code>deriveChild(purpose, index)</code> to bridge this gap.</p>
        </details>
      </div>
    </div>
  `
}

// ── Render: Master card ──────────────────────────────────────

function renderGroupSummary(): string {
  const { groups, personas } = getState()
  const groupList = Object.values(groups)
  if (groupList.length === 0) return ''

  // Group by persona id
  const byPersona = new Map<string, typeof groupList>()
  for (const g of groupList) {
    const key = g.personaId || '(unassigned)'
    const list = byPersona.get(key) ?? []
    list.push(g)
    byPersona.set(key, list)
  }

  const rows: string[] = []
  for (const [personaId, pGroups] of byPersona) {
    const isUnassigned = personaId === '(unassigned)'
    const found = !isUnassigned ? findById(personas, personaId) : null
    const personaEntry = found?.persona
    const isArchived = personaEntry?.archived
    const personaName = personaEntry?.name ?? personaId
    const label = isUnassigned
      ? `<span style="color:var(--text-muted);font-style:italic;">unassigned</span>`
      : `<span${isArchived ? ' style="opacity:0.5;"' : ''}>${escapeHtml(personaName)}</span>`
    const chips = pGroups.map(g =>
      `<button class="persona-card__group-chip" data-navigate-group="${escapeHtml(g.id)}">${escapeHtml(g.name)}</button>`
    ).join(' ')
    rows.push(`<div style="display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.375rem;flex-wrap:wrap;">
      <span style="font-size:0.75rem;min-width:5rem;">${label}</span>${chips}
    </div>`)
  }

  return `
    <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);">
      <h4 class="persona-card__section-title" style="margin-bottom:0.5rem;">Groups</h4>
      ${rows.join('')}
    </div>
  `
}

function renderChoiceGuide(hasMnemonic: boolean): string {
  return `
    <div class="id-choice">
      <div>
        <h4 class="id-choice__title">Which path should I choose?</h4>
        <p class="id-choice__sub">Both imported <code>nsec</code> roots and mnemonic-backed roots can derive the full <code>nsec-tree</code> hierarchy. The difference is whether the root itself has phrase/Shamir recovery.</p>
      </div>
      <div class="id-choice__grid">
        <div class="id-choice__card">
          <h5 class="id-choice__card-title">Keep using this nsec-backed root</h5>
          <ul class="id-choice__list">
            <li>Best when this is already your live public identity</li>
            <li>Still derives personas, anonymous accounts, and proofs</li>
            <li>No phrase or Shamir recovery unless you already have the mnemonic elsewhere</li>
          </ul>
        </div>
        <div class="id-choice__card">
          <h5 class="id-choice__card-title">Create or restore a mnemonic-backed root</h5>
          <ul class="id-choice__list">
            <li>Best when you want long-term recovery and backup</li>
            <li>Adds 12-word phrase recovery and Shamir splitting</li>
            <li>${hasMnemonic ? 'You already have this capability on the current root.' : 'Creates a new root or restores an existing mnemonic-backed one; it does not convert the current nsec in place.'}</li>
          </ul>
        </div>
      </div>
    </div>
  `
}

function renderMasterCard(): string {
  const { identity, personas, groups } = getState()
  if (!identity) return ''

  // Count active personas across the whole tree
  let personaCount = 0
  let accountCount = 0
  for (const { persona } of walkTree(personas)) {
    if (persona.archived) continue
    if (identityNodeType(persona) === 'account') accountCount++
    else personaCount++
  }
  const totalGroupCount = Object.keys(groups).length
  const hasMnemonic = !!identity.mnemonic
  const selectedPath = getSelectedDerivationPath()
  const capability = identityCapabilityStatus()

  const derivationHtml = !identity.privkey ? `
    <div class="id-derive">
      <div class="id-derive__header">
        <div>
          <h4 class="id-derive__title">Developer derivation example</h4>
          <p class="id-derive__sub">This needs a local key. Browser extensions keep the raw secret hidden, so canary-kit cannot recreate child identities here.</p>
        </div>
      </div>
    </div>
  ` : `
    <div class="id-derive">
      <div class="id-derive__header">
        <div>
          <h4 class="id-derive__title">Developer derivation example</h4>
          <p class="id-derive__sub">Enter up to three tree levels plus explicit indices and canary-kit recreates the deterministic child identity, including its <code>npub</code> and <code>nsec</code>.</p>
        </div>
        <div class="id-derive__actions">
          ${selectedPath && selectedPath.length <= 3 ? '<button class="btn btn--sm" id="id-derive-use-selected">Use selected persona</button>' : ''}
          <button class="btn btn--sm" id="id-derive-clear">Clear</button>
        </div>
      </div>
      <div class="id-derive__grid">
        ${[0, 1, 2].map((index) => `
          <div class="id-derive__field">
            <span class="id-derive__label">Level ${index + 1}</span>
            <div style="display:grid;grid-template-columns:minmax(0,1fr) 5.25rem;gap:0.5rem;align-items:end;">
              <input
                class="input"
                id="id-derive-level-${index + 1}"
                data-derive-slot-name="${index}"
                type="text"
                value="${escapeHtml(_devDerivationInputs[index]?.name ?? '')}"
                placeholder="${index === 0 ? 'personal' : index === 1 ? 'team' : 'ops'}"
                autocomplete="off"
                spellcheck="false"
              />
              <label style="display:grid;gap:0.25rem;">
                <span class="id-derive__label">Index</span>
                <input
                  class="input"
                  id="id-derive-index-${index + 1}"
                  data-derive-slot-index="${index}"
                  type="number"
                  min="0"
                  step="1"
                  value="${String(_devDerivationInputs[index]?.index ?? 0)}"
                  placeholder="0"
                  inputmode="numeric"
                />
              </label>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="id-derive__hint">
        ${selectedPath
          ? `Selected path: <code>${escapeHtml(selectedPath.map((segment) => `${segment.name}@${segment.index ?? 0}`).join(' / '))}</code>${selectedPath.length > 3 ? ' — this example only exposes the first three tree levels, so fill it manually if you need a deeper path.' : ''}`
          : 'Tip: select a persona in the tree, then load it here to show that the same derivation inputs recreate the same identity. Change indices to match rotated personas.'}
      </div>
      <div id="id-derive-feedback">${renderDerivationFeedback()}</div>
    </div>
  `

  return `
    <div class="id-master">
      <div class="id-master__row">
        <div class="id-master__stats">
          <span>${personaCount} persona${personaCount === 1 ? '' : 's'}</span>
          <span>\u00B7</span>
          <span>${accountCount} account${accountCount === 1 ? '' : 's'}</span>
          <span>\u00B7</span>
          <span>${totalGroupCount} group${totalGroupCount === 1 ? '' : 's'}</span>
          <span>\u00B7</span>
          <span>${hasMnemonic ? 'Backed up' : 'No backup'}</span>
        </div>
        <div class="id-master__actions">
          ${hasMnemonic ? '<button class="btn btn--sm" id="id-backup-btn">Backup</button>' : ''}
          <button class="btn btn--sm" id="id-shamir-btn"${hasMnemonic ? '' : ' disabled title="Shamir backup requires a mnemonic-backed root"'}>Shamir</button>
          <button class="btn btn--sm" id="id-verify-proof-btn">Verify proof</button>
        </div>
      </div>
      ${hasMnemonic ? `
        <div id="id-mnemonic" class="id-master__mnemonic${_backupRevealed ? ' id-master__mnemonic--revealed' : ''}">${escapeHtml(identity.mnemonic ?? '')}</div>
        <span class="id-master__mnemonic-hint">${_backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'}</span>
      ` : `
        <span class="id-master__mnemonic-hint">This root can derive personas and accounts, but it cannot be recovered with a phrase or split with Shamir because no mnemonic is stored.</span>
        <div class="id-master__actions" style="margin-top:0.75rem;">
          <button class="btn btn--sm btn--primary" id="id-create-recovery-root">Create or restore mnemonic-backed root</button>
        </div>
      `}
      <div class="id-derive__hint"><strong>${escapeHtml(capability.label)}.</strong> ${escapeHtml(capability.detail)}</div>
      <div class="id-derive__hint">One root can create many unlinkable personas and exportable nsec accounts. Use proofs only when you want to prove continuity between identities.</div>
      ${renderChoiceGuide(hasMnemonic)}
      ${renderGroupSummary()}
      ${derivationHtml}
    </div>
  `
}

// ── Render: Detail panel ──────────────────────────────────────

function renderBreadcrumb(ancestors: AppPersona[]): string {
  if (ancestors.length === 0) return ''
  const parts = ancestors.map((a, i) => {
    const isLast = i === ancestors.length - 1
    const nameHtml = escapeHtml(a.name)
    return isLast
      ? `<span class="persona-card__breadcrumb-current">${nameHtml}</span>`
      : `<span>${nameHtml}</span>`
  })
  const joined = parts.join(' <span class="persona-card__breadcrumb-sep">/</span> ')
  return `<div class="persona-card__breadcrumb">${joined}</div>`
}

function renderProfileSection(persona: AppPersona): string {
  return `
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Profile</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Display name</span>
        <input class="input persona-card__input" type="text" data-field="displayName"
          value="${escapeHtml(persona.displayName ?? '')}" placeholder="Display name" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">About</span>
        <input class="input persona-card__input" type="text" data-field="about"
          value="${escapeHtml(persona.about ?? '')}" placeholder="Short bio" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Picture URL</span>
        <input class="input persona-card__input" type="url" data-field="picture"
          value="${escapeHtml(persona.picture ?? '')}" placeholder="https://..." />
      </label>
      <button class="btn btn--sm btn--primary persona-card__publish-btn" id="id-detail-publish" hidden>
        Publish
      </button>
    </div>
  `
}

function renderRelaySection(persona: AppPersona): string {
  const { settings } = getState()
  const hasCustom = (persona.readRelays && persona.readRelays.length > 0) ||
    (persona.writeRelays && persona.writeRelays.length > 0)

  if (!hasCustom && !_customRelayEditing) {
    return `
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Relays</h4>
        <span class="persona-card__relay-default">Using default relays</span>
        <a href="#" class="persona-card__customise-link" id="id-detail-customise-relays">Customise</a>
      </div>
    `
  }

  const readRelays = persona.readRelays ?? settings.defaultReadRelays ?? []
  const writeRelays = persona.writeRelays ?? settings.defaultWriteRelays ?? []

  return `
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Relays</h4>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Read relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="read"
          value="${escapeHtml(readRelays.join(', '))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          value="${escapeHtml(writeRelays.join(', '))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" id="id-detail-save-relays">Save relays</button>
    </div>
  `
}

function renderGroupsSection(persona: AppPersona): string {
  const { groups, personas: allPersonas } = getState()
  const groupList = Object.values(groups)
  const personaGroups = groupList.filter((g) => g.personaId === persona.id)
  const otherGroups = groupList.filter((g) => g.personaId !== persona.id)

  const chips = personaGroups.map((g) => `
    <span class="persona-card__group-chip-wrap">
      <button class="persona-card__group-chip" data-navigate-group="${escapeHtml(g.id)}">${escapeHtml(g.name)}</button>
      <button class="persona-card__group-remove" data-unassign-group="${escapeHtml(g.id)}"
        title="Unassign from this persona" aria-label="Unassign ${escapeHtml(g.name)}">\u00D7</button>
    </span>
  `).join('')

  function personaNameForGroup(g: AppGroup): string {
    if (!g.personaId) return ''
    for (const { persona: p } of walkTree(allPersonas)) {
      if (p.id === g.personaId) return p.name
    }
    return ''
  }

  const assignOptions = otherGroups.length > 0
    ? `<select class="input persona-card__assign-select" id="id-detail-assign" style="font-size:0.75rem;padding:0.25rem 0.375rem;">
        <option value="">+ Assign group\u2026</option>
        ${otherGroups.map((g) => {
          const fromName = personaNameForGroup(g)
          const from = fromName ? ` (${escapeHtml(fromName)})` : ''
          return `<option value="${escapeHtml(g.id)}">${escapeHtml(g.name)}${from}</option>`
        }).join('')}
      </select>`
    : ''

  return `
    <div class="persona-card__section">
      <h4 class="persona-card__section-title">Groups</h4>
      ${personaGroups.length > 0
        ? `<div class="persona-card__group-chips">${chips}</div>`
        : `<span class="persona-card__meta">No groups assigned</span>`}
      ${assignOptions}
    </div>
  `
}

function renderActions(persona: AppPersona): string {
  const noun = actionVerb(persona)
  return `
    <div class="persona-card__actions">
      <button class="btn btn--sm" id="id-detail-export">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" id="id-detail-menu-btn"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${_menuOpen ? `
          <div class="persona-card__menu" id="id-detail-menu-panel">
            <button class="persona-card__menu-item" id="id-detail-copy-npub">Copy npub</button>
            <button class="persona-card__menu-item" id="id-detail-show-qr">
              ${_qrVisible ? 'Hide QR' : 'Show QR'}
            </button>
            <button class="persona-card__menu-item" id="id-detail-rotate">Rotate ${noun}</button>
            <button class="persona-card__menu-item" id="id-detail-prove">Prove continuity</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" id="id-detail-archive">Archive ${noun}</button>
          </div>
        ` : ''}
      </div>
    </div>
    ${_qrVisible ? `
      <div class="persona-card__qr">
        ${generateQR(persona.npub, 3)}
        <span class="persona-card__qr-label">${escapeHtml(truncateNpub(persona.npub))}</span>
      </div>
    ` : ''}
  `
}

function renderDetailPanel(): string {
  const { personas } = getState()
  const activeEntries = [...walkTree(personas)].filter(({ persona }) => !persona.archived)

  // Auto-select first persona if nothing selected or selection is stale
  if (activeEntries.length > 0) {
    const stillExists = _selectedPersonaId && activeEntries.some(({ persona }) => persona.id === _selectedPersonaId)
    if (!stillExists) {
      _selectedPersonaId = activeEntries[0].persona.id
    }
  } else {
    _selectedPersonaId = null
  }

  if (!_selectedPersonaId) {
    return `
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `
  }

  const found = findById(personas, _selectedPersonaId)
  if (!found) {
    return `
      <div class="id-detail" id="id-detail">
        <div class="id-detail__hint">Select a persona or account from the tree above</div>
      </div>
    `
  }

  const { persona, ancestors } = found
  const colour = personaColour(persona.name)
  const letter = escapeHtml(persona.name.slice(0, 1).toUpperCase())
  const typeLabel = identityNodeLabel(persona)
  const typeDescription = describeIdentityNode(persona)

  return `
    <div class="id-detail" id="id-detail" data-detail-persona-id="${escapeHtml(persona.id)}">
      <div class="id-detail__header">
        <span class="persona-card__badge" style="background-color:${colour}">${letter}</span>
        <div>
          <div style="font-weight:600;font-size:0.9375rem;color:var(--text-primary);">${escapeHtml(persona.name)}</div>
          ${persona.displayName ? `<div style="font-size:0.8125rem;color:var(--text-secondary);">${escapeHtml(persona.displayName)}</div>` : ''}
        </div>
      </div>
      <div class="id-derive__hint"><strong>${escapeHtml(typeLabel)}.</strong> ${escapeHtml(typeDescription)}</div>
      ${renderBreadcrumb([...ancestors, persona])}
      <div class="persona-card__npub">${escapeHtml(persona.npub)}</div>
      ${renderProfileSection(persona)}
      ${renderRelaySection(persona)}
      ${renderGroupsSection(persona)}
      ${renderActions(persona)}
    </div>
  `
}

// ── Render: New persona form ─────────────────────────────────

function renderNewPersonaForm(): string {
  return `
    <div class="id-create">
      <input class="input" type="text" id="id-new-name" placeholder="persona or account name" maxlength="32" autocomplete="off" style="flex: 1; min-width: 0;" />
      <select class="input" id="id-new-type" style="max-width: 10rem;">
        <option value="persona">Persona</option>
        <option value="account">Anonymous account</option>
      </select>
      <button class="btn btn--primary btn--sm" id="id-create-btn">+ Create</button>
    </div>
    <div class="id-derive__hint">Personas are reusable branches. Anonymous accounts are standalone exportable nsec identities, unlinkable by default.</div>
    <div class="id-create__error" id="id-create-error"></div>
  `
}

// ── Render: Archived section ─────────────────────────────────

function renderArchivedSection(): string {
  const { personas } = getState()

  // Collect archived personas from the entire tree
  const archived = [...walkTree(personas)]
    .filter(({ persona }) => persona.archived)
    .map(({ persona }) => persona)

  if (archived.length === 0) return ''

  const rows = archived.map(p => {
    const letter = escapeHtml(p.name.slice(0, 1).toUpperCase())
    return `
      <div class="id-archived__row">
        <span class="id-archived__badge" style="background: var(--text-muted);">${letter}</span>
        <span class="id-archived__name">${escapeHtml(p.name)}</span>
        <span class="id-archived__npub">${escapeHtml(truncateNpub(p.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${escapeHtml(p.id)}">Restore</button>
      </div>
    `
  }).join('')

  return `
    <hr class="id-divider" />
    <div>
      <button class="id-archived__toggle" id="id-archived-toggle">
        <span>${_archivedVisible ? '\u25BC' : '\u25B6'}</span>
        <span>Archived (${archived.length})</span>
      </button>
      <div class="id-archived__list" id="id-archived-list" style="max-height: ${_archivedVisible ? '1000px' : '0'};">
        ${rows}
      </div>
    </div>
  `
}

// ── Public API ────────────────────────────────────────────────

export function renderIdentities(container: HTMLElement): void {
  // Abort previous listeners to prevent accumulation
  _wireAbort?.abort()
  _wireAbort = new AbortController()
  const { signal } = _wireAbort

  container.textContent = ''

  // Inject scoped styles once
  if (!document.getElementById('id-hub-styles')) {
    const style = document.createElement('style')
    style.id = 'id-hub-styles'
    style.textContent = STYLES
    document.head.appendChild(style)
  }

  // NIP-07 fallback
  if (!isPersonasInitialised()) {
    const div = document.createElement('div')
    div.className = 'id-hub'
    div.innerHTML = renderNip07Fallback()
    container.appendChild(div)
    return
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'id-hub'
  wrapper.innerHTML = [
    '<h1 class="id-hub__heading">Identities</h1>',
    '<div class="id-hub__sub">Derived from your master key</div>',
    renderMasterCard(),
    renderIdentityTree(_selectedPersonaId),
    renderDetailPanel(),
    renderNewPersonaForm(),
    renderArchivedSection(),
  ].join('')
  container.appendChild(wrapper)

  // ── Wire identity tree ──────────────────────────────────────
  wireIdentityTree(container)

  // ── Listen for persona selection ────────────────────────────
  document.addEventListener('canary:select-persona', ((e: CustomEvent) => {
    const { personaId } = e.detail as { personaId: string }
    if (personaId === _selectedPersonaId) return
    _selectedPersonaId = personaId
    // Reset detail panel transient state
    _menuOpen = false
    _qrVisible = false
    _customRelayEditing = false
    renderIdentities(container)
  }) as EventListener, { signal })

  // ── Backup reveal ────────────────────────────────────────────
  const backupBtn = container.querySelector<HTMLButtonElement>('#id-backup-btn')
  const mnemonicEl = container.querySelector<HTMLElement>('#id-mnemonic')
  const mnemonicHint = mnemonicEl?.nextElementSibling as HTMLElement | null

  function toggleBackup(): void {
    if (!mnemonicEl) return
    _backupRevealed = !_backupRevealed
    mnemonicEl.classList.toggle('id-master__mnemonic--revealed', _backupRevealed)
    if (mnemonicHint) {
      mnemonicHint.textContent = _backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'
    }
  }

  backupBtn?.addEventListener('click', toggleBackup, { signal })
  mnemonicEl?.addEventListener('click', toggleBackup, { signal })

  // ── Shamir + Verify events ───────────────────────────────────
  container.querySelector('#id-shamir-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:shamir-split', { bubbles: true }))
  }, { signal })
  container.querySelector('#id-verify-proof-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:verify-proof', { bubbles: true }))
  }, { signal })
  container.querySelector('#id-create-recovery-root')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:open-recovery-root-modal', { bubbles: true }))
  }, { signal })

  // ── Developer derivation example ────────────────────────────
  container.querySelectorAll<HTMLInputElement>('[data-derive-slot-name]').forEach((input) => {
    input.addEventListener('input', () => {
      const slot = Number(input.dataset.deriveSlotName)
      _devDerivationInputs[slot] = { ..._devDerivationInputs[slot]!, name: input.value }
      _devDerivationReveal = false
      refreshDerivationPanel(container)
    }, { signal })
  })

  container.querySelectorAll<HTMLInputElement>('[data-derive-slot-index]').forEach((input) => {
    input.addEventListener('input', () => {
      const slot = Number(input.dataset.deriveSlotIndex)
      const value = input.value.trim()
      const index = value === '' ? 0 : Number(value)
      _devDerivationInputs[slot] = { ..._devDerivationInputs[slot]!, index }
      _devDerivationReveal = false
      refreshDerivationPanel(container)
    }, { signal })
  })

  container.querySelector('#id-derive-clear')?.addEventListener('click', () => {
    setDevDerivationInputs([])
    renderIdentities(container)
  }, { signal })

  container.querySelector('#id-derive-use-selected')?.addEventListener('click', () => {
    const path = getSelectedDerivationPath()
    if (!path) return
    setDevDerivationInputs(path)
    renderIdentities(container)
  }, { signal })

  container.querySelector('#id-derive-copy-npub')?.addEventListener('click', () => {
    const derivation = readDevDerivation()
    if (!derivation || 'error' in derivation) return
    navigator.clipboard.writeText(derivation.npub).then(() => {
      showToast('npub copied', 'success')
    }).catch(() => {})
  }, { signal })

  container.querySelector('#id-derive-copy-nsec')?.addEventListener('click', () => {
    const derivation = readDevDerivation()
    if (!derivation || 'error' in derivation) return
    _devDerivationReveal = true
    navigator.clipboard.writeText(derivation.nsec).then(() => {
      showToast('nsec copied', 'success')
      refreshDerivationPanel(container)
    }).catch(() => {
      refreshDerivationPanel(container)
    })
  }, { signal })

  // ── Detail panel actions ────────────────────────────────────
  const detailPanel = container.querySelector<HTMLElement>('#id-detail')

  if (detailPanel && _selectedPersonaId) {
    const currentId = _selectedPersonaId

    // Profile input change → show publish button
    detailPanel.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement
      if (!input.dataset.field) return
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      const publishBtn = detailPanel.querySelector<HTMLButtonElement>('#id-detail-publish')
      if (publishBtn) {
        publishBtn.hidden = !hasProfileChanges(found.persona, detailPanel)
      }
    }, { signal })

    // Profile publish
    detailPanel.querySelector('#id-detail-publish')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      const displayNameInput = detailPanel.querySelector<HTMLInputElement>('[data-field="displayName"]')
      const aboutInput = detailPanel.querySelector<HTMLInputElement>('[data-field="about"]')
      const pictureInput = detailPanel.querySelector<HTMLInputElement>('[data-field="picture"]')

      const updated: AppPersona = {
        ...found.persona,
        displayName: displayNameInput?.value || undefined,
        about: aboutInput?.value || undefined,
        picture: pictureInput?.value || undefined,
      }

      const updatedPersonas = deepUpdatePersona(personas, currentId, updated)
      update({ personas: updatedPersonas })
      showToast(`Profile saved for "${found.persona.name}"`, 'success')
    }, { signal })

    // Customise relays link
    detailPanel.querySelector('#id-detail-customise-relays')?.addEventListener('click', (e) => {
      e.preventDefault()
      _customRelayEditing = true
      renderIdentities(container)
    }, { signal })

    // Save relays
    detailPanel.querySelector('#id-detail-save-relays')?.addEventListener('click', () => {
      const readInput = detailPanel.querySelector<HTMLInputElement>('[data-relay-field="read"]')
      const writeInput = detailPanel.querySelector<HTMLInputElement>('[data-relay-field="write"]')
      const readRelays = (readInput?.value ?? '').split(',').map((s) => s.trim()).filter(Boolean)
      const writeRelays = (writeInput?.value ?? '').split(',').map((s) => s.trim()).filter(Boolean)

      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      const updated: AppPersona = { ...found.persona, readRelays, writeRelays }
      const updatedPersonas = deepUpdatePersona(personas, currentId, updated)
      update({ personas: updatedPersonas })
      _customRelayEditing = false
      showToast(`Relays saved for "${found.persona.name}"`, 'success')
    }, { signal })

    // Group chip navigation
    detailPanel.addEventListener('click', (e) => {
      const groupChip = (e.target as HTMLElement).closest<HTMLElement>('[data-navigate-group]')
      if (groupChip) {
        const groupId = groupChip.dataset.navigateGroup!
        update({ view: 'groups', activeGroupId: groupId })
        return
      }

      // Unassign group
      const unassignBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-unassign-group]')
      if (unassignBtn) {
        e.stopPropagation()
        const groupId = unassignBtn.dataset.unassignGroup!
        const { groups } = getState()
        const group = groups[groupId]
        if (!group) return
        updateGroup(groupId, { personaId: '' })
        showToast(`"${group.name}" unassigned`, 'info')
        return
      }

      // Close menu on outside click
      if (_menuOpen) {
        const inMenu = (e.target as HTMLElement).closest<HTMLElement>('#id-detail-menu-panel')
        const isMenuBtn = (e.target as HTMLElement).closest<HTMLElement>('#id-detail-menu-btn')
        if (!inMenu && !isMenuBtn) {
          _menuOpen = false
          renderIdentities(container)
        }
      }
    }, { signal })

    // Assign group dropdown
    detailPanel.querySelector('#id-detail-assign')?.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement
      const groupId = select.value
      if (!groupId) return
      const { groups, personas } = getState()
      const group = groups[groupId]
      if (!group) return
      updateGroup(groupId, { personaId: currentId })
      const found = findById(personas, currentId)
      showToast(`"${group.name}" assigned to ${found?.persona.name ?? currentId}`, 'success')
      select.value = ''
    }, { signal })

    // Export nsec
    detailPanel.querySelector('#id-detail-export')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      container.dispatchEvent(new CustomEvent('canary:export-persona', {
        bubbles: true,
        detail: { personaId: currentId },
      }))
    }, { signal })

    // More menu toggle
    detailPanel.querySelector('#id-detail-menu-btn')?.addEventListener('click', () => {
      _menuOpen = !_menuOpen
      renderIdentities(container)
    }, { signal })

    // Menu items
    detailPanel.querySelector('#id-detail-copy-npub')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      navigator.clipboard.writeText(found.persona.npub).then(() => {
        showToast('npub copied', 'success')
      }).catch(() => {})
      _menuOpen = false
      renderIdentities(container)
    }, { signal })

    detailPanel.querySelector('#id-detail-show-qr')?.addEventListener('click', () => {
      _qrVisible = !_qrVisible
      _menuOpen = false
      renderIdentities(container)
    }, { signal })

    detailPanel.querySelector('#id-detail-rotate')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      _menuOpen = false
      container.dispatchEvent(new CustomEvent('canary:rotate-persona', {
        bubbles: true,
        detail: { personaId: currentId },
      }))
    }, { signal })

    detailPanel.querySelector('#id-detail-prove')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      _menuOpen = false
      container.dispatchEvent(new CustomEvent('canary:prove-ownership', {
        bubbles: true,
        detail: { personaId: currentId },
      }))
    }, { signal })

    detailPanel.querySelector('#id-detail-archive')?.addEventListener('click', () => {
      const { personas } = getState()
      const found = findById(personas, currentId)
      if (!found) return
      _menuOpen = false
      container.dispatchEvent(new CustomEvent('canary:archive-persona', {
        bubbles: true,
        detail: { personaId: currentId },
      }))
    }, { signal })
  }

  // ── Master card group chip navigation ──────────────────────
  container.querySelector('.id-master')?.addEventListener('click', (e) => {
    const groupChip = (e.target as HTMLElement).closest<HTMLElement>('[data-navigate-group]')
    if (groupChip) {
      const groupId = groupChip.dataset.navigateGroup!
      update({ view: 'groups', activeGroupId: groupId })
    }
  }, { signal })

  // ── New persona form ─────────────────────────────────────────
  const nameInput = container.querySelector<HTMLInputElement>('#id-new-name')
  const typeInput = container.querySelector<HTMLSelectElement>('#id-new-type')
  const createBtn = container.querySelector<HTMLButtonElement>('#id-create-btn')
  const errorEl = container.querySelector<HTMLElement>('#id-create-error')

  function handleCreate(): void {
    if (!nameInput || !errorEl) return
    const name = nameInput.value.trim()

    if (!isValidPersonaName(name)) {
      errorEl.textContent = 'Lowercase, no spaces, max 32 characters.'
      return
    }

    const { personas } = getState()
    // Check if name already exists in root-level personas
    if (Object.values(personas).some(p => p.name === name)) {
      errorEl.textContent = 'That name is already taken.'
      return
    }

    try {
      const nodeType = (typeInput?.value === 'account' ? 'account' : 'persona') as IdentityNodeType
      const newPersona = createPersona(name, nodeType)
      update({ personas: { ...personas, [newPersona.id]: newPersona } })
      nameInput.value = ''
      if (typeInput) typeInput.value = 'persona'
      errorEl.textContent = ''
      // Auto-select the newly created persona
      _selectedPersonaId = newPersona.id
      _menuOpen = false
      _qrVisible = false
      _customRelayEditing = false
      showToast(`${identityNodeLabel(newPersona)} "${newPersona.name}" created`, 'success')
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : 'Failed to create item.'
    }
  }

  createBtn?.addEventListener('click', handleCreate, { signal })
  nameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') handleCreate() }, { signal })

  // ── Archived toggle + restore ────────────────────────────────
  const archivedToggle = container.querySelector<HTMLButtonElement>('#id-archived-toggle')
  const archivedList = container.querySelector<HTMLElement>('#id-archived-list')
  if (archivedToggle && archivedList) {
    archivedToggle.addEventListener('click', () => {
      _archivedVisible = !_archivedVisible
      archivedList.style.maxHeight = _archivedVisible ? archivedList.scrollHeight + 'px' : '0'
      const chevron = archivedToggle.querySelector('span')
      if (chevron) chevron.textContent = _archivedVisible ? '\u25BC' : '\u25B6'
    }, { signal })
  }

  container.addEventListener('click', e => {
    const restoreBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-restore-persona]')
    if (!restoreBtn) return
    const personaId = restoreBtn.dataset.restorePersona!
    const { personas } = getState()
    const found = findById(personas, personaId)
    if (!found) return
    const updatedPersonas = deepSetArchived(personas, personaId, false)
    update({ personas: updatedPersonas })
  }, { signal })
}

// ── Tree helpers ──────────────────────────────────────────────

/**
 * Immutably set archived flag for a persona anywhere in the tree.
 */
function deepSetArchived(
  personas: Record<string, AppPersona>,
  targetId: string,
  archived: boolean,
): Record<string, AppPersona> {
  const result: Record<string, AppPersona> = {}
  for (const [id, p] of Object.entries(personas)) {
    if (id === targetId) {
      result[id] = { ...p, archived }
    } else if (p.children && Object.keys(p.children).length > 0) {
      result[id] = { ...p, children: deepSetArchived(p.children, targetId, archived) }
    } else {
      result[id] = p
    }
  }
  return result
}

/**
 * Immutably replace a persona anywhere in the tree by id.
 */
function deepUpdatePersona(
  personas: Record<string, AppPersona>,
  targetId: string,
  updated: AppPersona,
): Record<string, AppPersona> {
  const result: Record<string, AppPersona> = {}
  for (const [id, p] of Object.entries(personas)) {
    if (id === targetId) {
      result[id] = updated
    } else if (p.children && Object.keys(p.children).length > 0) {
      result[id] = { ...p, children: deepUpdatePersona(p.children, targetId, updated) }
    } else {
      result[id] = p
    }
  }
  return result
}
