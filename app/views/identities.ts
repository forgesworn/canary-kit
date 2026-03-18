// app/views/identities.ts — Identity hub: master card, persona cards, tree, archive
//
// Numbers Station aesthetic — deep slate, amber accents, monospace body,
// Playfair Display headings. Matches the existing canary-kit design language.

import { getState, update } from '../state.js'
import { isPersonasInitialised, createPersona } from '../persona.js'
import { renderPersonaCard, wirePersonaCards } from '../components/persona-card.js'
import { renderIdentityTree, wireIdentityTree } from '../components/identity-tree.js'
import { walkTree, findById } from '../persona-tree.js'
import { escapeHtml } from '../utils/escape.js'
import type { AppPersona } from '../types.js'

// ── Module state ──────────────────────────────────────────────

let _archivedVisible = false
let _backupRevealed = false

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

  /* ── Persona cards ──────────────────────────────── */

  .persona-card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .persona-card--expanded {
    border-color: var(--border-amber);
  }

  .persona-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    cursor: pointer;
    transition: background 0.15s var(--ease-out);
  }

  .persona-card__header:hover {
    background: var(--bg-hover);
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

  .persona-card__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .persona-card__name {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--text-primary);
  }

  .persona-card__display-name {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .persona-card__meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .persona-card__chevron {
    font-size: 0.75rem;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: transform 0.2s var(--ease-out);
  }

  .persona-card--expanded .persona-card__chevron {
    transform: rotate(90deg);
  }

  .persona-card__body {
    padding: 0 1rem 1rem;
    border-top: 1px solid var(--border);
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

// ── Render: NIP-07 fallback ──────────────────────────────────

function renderNip07Fallback(): string {
  const { identity, groups } = getState()
  const pubkey = identity?.pubkey ?? ''
  const npubShort = pubkey ? `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}` : 'unknown'
  const groupCount = Object.keys(groups).length

  return `
    <div class="id-nip07">
      <div class="id-nip07__card">
        <div class="id-nip07__header">
          <div class="id-nip07__icon">\u{1F511}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.9375rem;">Your Identity</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(npubShort)} \u00B7 NIP-07 extension \u00B7 ${groupCount} group${groupCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div class="id-nip07__why">
        <h3>Why can\u2019t I manage personas?</h3>
        <p>Your NIP-07 browser extension keeps your private key secure by never exposing it to apps. This is good security \u2014 but it means canary-kit cannot derive sub-identities from your key.</p>
        <p>Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key for cryptographic derivation. Your extension only allows signing and encryption.</p>
        <p>To use persona features, create a new account with a recovery phrase or import an existing one.</p>
        <details>
          <summary>Technical detail</summary>
          <p style="margin: 0.5rem 0 0; line-height: 1.5;">nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>. NIP-07 extensions expose <code>signEvent()</code> and <code>nip44.encrypt()</code> but not the raw key bytes. A future NIP could add <code>deriveChild(purpose, index)</code> to bridge this gap.</p>
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

function renderMasterCard(): string {
  const { identity, personas, groups } = getState()
  if (!identity) return ''

  // Count active personas across the whole tree
  let personaCount = 0
  for (const { persona } of walkTree(personas)) {
    if (!persona.archived) personaCount++
  }
  const totalGroupCount = Object.keys(groups).length
  const hasMnemonic = !!identity.mnemonic

  return `
    <div class="id-master">
      <div class="id-master__row">
        <div class="id-master__stats">
          <span>${personaCount} persona${personaCount === 1 ? '' : 's'}</span>
          <span>\u00B7</span>
          <span>${totalGroupCount} group${totalGroupCount === 1 ? '' : 's'}</span>
          <span>\u00B7</span>
          <span>${hasMnemonic ? 'Backed up' : 'No backup'}</span>
        </div>
        <div class="id-master__actions">
          ${hasMnemonic ? '<button class="btn btn--sm" id="id-backup-btn">Backup</button>' : ''}
          <button class="btn btn--sm" id="id-shamir-btn">Shamir</button>
          <button class="btn btn--sm" id="id-verify-proof-btn">Verify proof</button>
        </div>
      </div>
      ${hasMnemonic ? `
        <div id="id-mnemonic" class="id-master__mnemonic${_backupRevealed ? ' id-master__mnemonic--revealed' : ''}">${escapeHtml(identity.mnemonic ?? '')}</div>
        <span class="id-master__mnemonic-hint">${_backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'}</span>
      ` : ''}
      ${renderGroupSummary()}
    </div>
  `
}

// ── Render: Active persona cards ─────────────────────────────

function renderActivePersonas(): string {
  const { personas, groups } = getState()
  const groupList = Object.values(groups)

  // Use walkTree to render in depth-first order
  const activeEntries = [...walkTree(personas)].filter(({ persona }) => !persona.archived)

  if (activeEntries.length === 0) {
    return `
      <div class="id-empty">
        <div class="id-empty__icon">\u{1F464}</div>
        <h3 class="id-empty__title">No personas yet</h3>
        <p class="id-empty__text">
          Create your first persona to get started. Each persona is an independent
          Nostr identity \u2014 use one for personal groups, another for bitcoin meetups,
          another as a burner. They\u2019re all derived from your master key and recoverable
          from your 12-word phrase.
        </p>
      </div>
    `
  }

  return activeEntries.map(({ persona }) => renderPersonaCard(persona, groupList)).join('')
}

// ── Render: New persona form ─────────────────────────────────

function renderNewPersonaForm(): string {
  return `
    <div class="id-create">
      <input class="input" type="text" id="id-new-name" placeholder="persona name" maxlength="32" autocomplete="off" style="flex: 1; min-width: 0;" />
      <button class="btn btn--primary btn--sm" id="id-create-btn">+ Create persona</button>
    </div>
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
    renderIdentityTree(),
    renderActivePersonas(),
    renderNewPersonaForm(),
    renderArchivedSection(),
  ].join('')
  container.appendChild(wrapper)

  // ── Wire components ──────────────────────────────────────────
  wirePersonaCards(container)
  wireIdentityTree(container)

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

  backupBtn?.addEventListener('click', toggleBackup)
  mnemonicEl?.addEventListener('click', toggleBackup)

  // ── Shamir + Verify events ───────────────────────────────────
  container.querySelector('#id-shamir-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:shamir-split', { bubbles: true }))
  })
  container.querySelector('#id-verify-proof-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:verify-proof', { bubbles: true }))
  })

  // ── New persona form ─────────────────────────────────────────
  const nameInput = container.querySelector<HTMLInputElement>('#id-new-name')
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
      const newPersona = createPersona(name)
      update({ personas: { ...personas, [newPersona.id]: newPersona } })
      nameInput.value = ''
      errorEl.textContent = ''
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : 'Failed to create persona.'
    }
  }

  createBtn?.addEventListener('click', handleCreate)
  nameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') handleCreate() })

  // ── Archived toggle + restore ────────────────────────────────
  const archivedToggle = container.querySelector<HTMLButtonElement>('#id-archived-toggle')
  const archivedList = container.querySelector<HTMLElement>('#id-archived-list')
  if (archivedToggle && archivedList) {
    archivedToggle.addEventListener('click', () => {
      _archivedVisible = !_archivedVisible
      archivedList.style.maxHeight = _archivedVisible ? archivedList.scrollHeight + 'px' : '0'
      const chevron = archivedToggle.querySelector('span')
      if (chevron) chevron.textContent = _archivedVisible ? '\u25BC' : '\u25B6'
    })
  }

  container.addEventListener('click', e => {
    const restoreBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-restore-persona]')
    if (!restoreBtn) return
    const personaId = restoreBtn.dataset.restorePersona!
    const { personas } = getState()
    // Find persona by id anywhere in the tree
    const found = findById(personas, personaId)
    if (!found) return
    // Immutably update the persona's archived flag in the tree
    const updatedPersonas = deepSetArchived(personas, personaId, false)
    update({ personas: updatedPersonas })
  })
}

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
