// app/views/identities.ts — Identity hub: master card, persona cards, tree, archive

import { getState, update } from '../state.js'
import { isPersonasInitialised, createPersona } from '../persona.js'
import { renderPersonaCard, wirePersonaCards } from '../components/persona-card.js'
import { renderIdentityTree, wireIdentityTree } from '../components/identity-tree.js'
import { personaColour } from '../components/persona-picker.js'
import { escapeHtml } from '../utils/escape.js'

// ── Module state ──────────────────────────────────────────────

let _treeVisible = false
let _archivedVisible = false
let _backupRevealed = false

// ── Helpers ───────────────────────────────────────────────────

function truncateNpub(npub: string): string {
  if (npub.length <= 16) return npub
  return `${npub.slice(0, 8)}\u2026${npub.slice(-4)}`
}

/** Validate a persona name: lowercase, no spaces, max 32 chars. */
function isValidPersonaName(name: string): boolean {
  if (name.length === 0 || name.length > 32) return false
  if (name !== name.toLowerCase()) return false
  if (/\s/.test(name)) return false
  return true
}

// ── Render: NIP-07 fallback ──────────────────────────────────

function renderNip07Fallback(): string {
  const { identity, groups } = getState()
  const pubkey = identity?.pubkey ?? ''
  const npubShort = pubkey ? `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}` : 'unknown'
  const groupCount = Object.keys(groups).length

  return `
    <div style="padding: 1rem; max-width: 640px; margin: 0 auto;">
      <div style="
        background: var(--surface-1, #1a1a2e);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        border: 1px solid var(--border, #333);
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="
            width: 44px; height: 44px; border-radius: 50%;
            background: hsl(210, 60%, 45%);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 18px;
          ">&#x1F511;</div>
          <div>
            <div style="font-weight: 600; font-size: 15px;">Your Identity</div>
            <div style="font-size: 12px; opacity: 0.5;">${escapeHtml(npubShort)} &middot; NIP-07 extension &middot; ${groupCount} group${groupCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div style="
        background: var(--surface-1, #1a1a2e);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--border, #333);
      ">
        <h3 style="margin: 0 0 12px 0; font-size: 14px;">Persona features unavailable</h3>
        <p style="font-size: 13px; opacity: 0.7; line-height: 1.5; margin: 0 0 12px 0;">
          Your NIP-07 browser extension (Alby, nos2x, etc.) keeps your private key secure by never exposing it to apps.
          This is good security &mdash; but it means canary-kit cannot derive sub-identities from your key.
        </p>
        <p style="font-size: 13px; opacity: 0.7; line-height: 1.5; margin: 0 0 16px 0;">
          Personas, Shamir backup, nsec export, and linkage proofs all require the raw private key to perform
          cryptographic derivation (HMAC-SHA256). Your extension only allows signing and encryption &mdash; not key derivation.
        </p>
        <p style="font-size: 13px; opacity: 0.7; line-height: 1.5; margin: 0 0 16px 0;">
          To use persona features, switch to a local key by creating a new account or importing a recovery phrase.
          Your extension identity will remain separate.
        </p>
        <details style="font-size: 12px; opacity: 0.5;">
          <summary style="cursor: pointer;">Technical detail</summary>
          <p style="margin: 8px 0 0 0; line-height: 1.5;">
            nsec-tree derives child keys via <code>HMAC-SHA256(master_key, purpose)</code>.
            NIP-07 extensions expose <code>signEvent()</code> and <code>nip44.encrypt()</code>
            but not the raw key bytes needed for HMAC input. A future NIP could add a
            <code>deriveChild(purpose, index)</code> API to bridge this gap.
          </p>
        </details>
      </div>
    </div>
  `
}

// ── Render: Master card ──────────────────────────────────────

function renderMasterCard(): string {
  const { identity, personas, groups } = getState()
  if (!identity) return ''

  const personaCount = Object.values(personas).filter((p) => !p.archived).length
  const totalGroupCount = Object.keys(groups).length
  const hasMnemonic = !!identity.mnemonic
  const backupStatus = hasMnemonic ? 'Mnemonic available' : 'No backup phrase'

  const mnemonicSection = hasMnemonic
    ? `
      <div class="identities__backup" style="margin-top: 0.75rem;">
        <div class="identities__mnemonic${_backupRevealed ? '' : ' identities__mnemonic--blurred'}"
             id="identities-mnemonic"
             style="
               font-family: monospace;
               font-size: 0.8125rem;
               padding: 0.5rem 0.75rem;
               background: var(--surface, #1e1e2e);
               border: 1px solid var(--border, #444);
               border-radius: 6px;
               cursor: pointer;
               user-select: ${_backupRevealed ? 'text' : 'none'};
               filter: ${_backupRevealed ? 'none' : 'blur(5px)'};
               transition: filter 0.2s ease;
               color: var(--text, #e0e0e0);
             ">${escapeHtml(identity.mnemonic ?? '')}</div>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #999); margin-top: 0.25rem; display: block;">
          ${_backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'}
        </span>
      </div>
    `
    : ''

  return `
    <div class="identities__master-card" style="
      background: linear-gradient(135deg, hsl(260, 50%, 20%) 0%, hsl(220, 40%, 15%) 100%);
      border: 2px solid var(--accent, #7c3aed);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    ">
      <h2 style="
        margin: 0 0 0.75rem;
        font-size: 1.25rem;
        color: var(--text, #e0e0e0);
      ">Your Identity Tree</h2>

      <div style="
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.8125rem;
        color: var(--text-muted, #999);
        margin-bottom: 1rem;
      ">
        <span>${personaCount} persona${personaCount === 1 ? '' : 's'}</span>
        <span>\u00B7</span>
        <span>${totalGroupCount} group${totalGroupCount === 1 ? '' : 's'}</span>
        <span>\u00B7</span>
        <span>${backupStatus}</span>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn--sm" id="identities-toggle-tree">
          ${_treeVisible ? 'Hide Tree' : 'Show Tree'}
        </button>
        ${hasMnemonic ? '<button class="btn btn--sm" id="identities-backup-btn">Backup</button>' : ''}
        <button class="btn btn--sm" id="identities-shamir-btn">Shamir Split</button>
        <button class="btn btn--sm" id="identities-verify-proof-btn">Verify Proof</button>
      </div>

      ${mnemonicSection}
    </div>
  `
}

// ── Render: Tree section ─────────────────────────────────────

function renderTreeSection(): string {
  const treeHtml = renderIdentityTree()
  // Replace the default collapsed style with expanded if visible
  if (_treeVisible) {
    return treeHtml.replace('max-height: 0', 'max-height: 2000px')
      .replace('class="identity-tree"', 'class="identity-tree expanded"')
  }
  return treeHtml
}

// ── Render: Active persona cards ─────────────────────────────

function renderActivePersonas(): string {
  const { personas, groups } = getState()
  const groupList = Object.values(groups)
  const active = Object.values(personas).filter((p) => !p.archived)

  if (active.length === 0) {
    return `
      <div style="
        padding: 1rem;
        text-align: center;
        color: var(--text-muted, #999);
        font-size: 0.875rem;
      ">No personas yet. Create one below.</div>
    `
  }

  return active.map((p) => renderPersonaCard(p, groupList)).join('')
}

// ── Render: New persona form ─────────────────────────────────

function renderNewPersonaForm(): string {
  return `
    <div class="identities__create" style="
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    ">
      <input
        class="input"
        type="text"
        id="identities-new-name"
        placeholder="New persona name"
        maxlength="32"
        autocomplete="off"
        style="flex: 1; min-width: 0;"
      />
      <button class="btn btn--primary btn--sm" id="identities-create-btn">Create</button>
    </div>
    <div id="identities-create-error" style="
      color: var(--danger, #ef4444);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      min-height: 1rem;
    "></div>
  `
}

// ── Render: Archived section ─────────────────────────────────

function renderArchivedSection(): string {
  const { personas } = getState()
  const archived = Object.values(personas).filter((p) => p.archived)

  if (archived.length === 0) return ''

  const rows = archived.map((p) => {
    const colour = personaColour(p.name)
    const letter = escapeHtml(p.name.slice(0, 1).toUpperCase())
    return `
      <div class="identities__archived-row" style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid var(--border, #333);
      ">
        <span style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: ${colour};
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
          opacity: 0.6;
        ">${letter}</span>
        <span style="font-size: 0.8125rem; color: var(--text-muted, #999);">${escapeHtml(p.name)}</span>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #666); flex: 1;">${escapeHtml(truncateNpub(p.npub))}</span>
        <button class="btn btn--sm" data-restore-persona="${escapeHtml(p.name)}">Restore</button>
      </div>
    `
  }).join('')

  return `
    <div class="identities__archived" style="margin-top: 1.5rem;">
      <button class="identities__archived-header" id="identities-archived-toggle" style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-muted, #999);
        text-align: left;
      ">
        <span>${_archivedVisible ? '\u25BC' : '\u25B6'}</span>
        <span>Archived (${archived.length})</span>
      </button>
      <div id="identities-archived-list" style="
        overflow: hidden;
        max-height: ${_archivedVisible ? '1000px' : '0'};
        transition: max-height 0.3s ease-out;
      ">${rows}</div>
    </div>
  `
}

// ── Public API ────────────────────────────────────────────────

/** Render the identity hub view. */
export function renderIdentities(container: HTMLElement): void {
  container.textContent = ''

  // NIP-07 fallback — no local key material
  if (!isPersonasInitialised()) {
    const div = document.createElement('div')
    div.innerHTML = renderNip07Fallback()
    container.appendChild(div)
    return
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'identities'
  wrapper.style.cssText = 'padding: 1rem; max-width: 640px; margin: 0 auto;'
  wrapper.innerHTML = [
    renderMasterCard(),
    renderTreeSection(),
    '<div class="identities__persona-list">',
    renderActivePersonas(),
    '</div>',
    renderNewPersonaForm(),
    renderArchivedSection(),
  ].join('')
  container.appendChild(wrapper)

  // ── Wire components ──────────────────────────────────────────
  wirePersonaCards(container)

  const tree = container.querySelector('.identity-tree')
  if (tree) {
    wireIdentityTree(container)
  }

  // ── Tree toggle ──────────────────────────────────────────────
  const toggleTreeBtn = container.querySelector<HTMLButtonElement>('#identities-toggle-tree')
  if (toggleTreeBtn) {
    toggleTreeBtn.addEventListener('click', () => {
      _treeVisible = !_treeVisible
      const treeEl = container.querySelector<HTMLElement>('.identity-tree')
      if (treeEl) {
        if (_treeVisible) {
          treeEl.classList.add('expanded')
          treeEl.style.maxHeight = treeEl.scrollHeight + 'px'
        } else {
          treeEl.classList.remove('expanded')
          treeEl.style.maxHeight = '0'
        }
      }
      toggleTreeBtn.textContent = _treeVisible ? 'Hide Tree' : 'Show Tree'
    })
  }

  // ── Backup reveal (blur toggle) ──────────────────────────────
  const backupBtn = container.querySelector<HTMLButtonElement>('#identities-backup-btn')
  const mnemonicEl = container.querySelector<HTMLElement>('#identities-mnemonic')
  if (backupBtn && mnemonicEl) {
    backupBtn.addEventListener('click', () => {
      _backupRevealed = !_backupRevealed
      mnemonicEl.style.filter = _backupRevealed ? 'none' : 'blur(5px)'
      mnemonicEl.style.userSelect = _backupRevealed ? 'text' : 'none'
      const hint = mnemonicEl.nextElementSibling as HTMLElement | null
      if (hint) {
        hint.textContent = _backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'
      }
    })
  }
  if (mnemonicEl) {
    mnemonicEl.addEventListener('click', () => {
      _backupRevealed = !_backupRevealed
      mnemonicEl.style.filter = _backupRevealed ? 'none' : 'blur(5px)'
      mnemonicEl.style.userSelect = _backupRevealed ? 'text' : 'none'
      const hint = mnemonicEl.nextElementSibling as HTMLElement | null
      if (hint) {
        hint.textContent = _backupRevealed ? 'Click to hide' : 'Click to reveal recovery phrase'
      }
    })
  }

  // ── Shamir Split custom event ────────────────────────────────
  const shamirBtn = container.querySelector<HTMLButtonElement>('#identities-shamir-btn')
  if (shamirBtn) {
    shamirBtn.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('canary:shamir-split', { bubbles: true }))
    })
  }

  // ── Verify Proof custom event ────────────────────────────────
  const verifyProofBtn = container.querySelector<HTMLButtonElement>('#identities-verify-proof-btn')
  if (verifyProofBtn) {
    verifyProofBtn.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('canary:verify-proof', { bubbles: true }))
    })
  }

  // ── New persona form ─────────────────────────────────────────
  const nameInput = container.querySelector<HTMLInputElement>('#identities-new-name')
  const createBtn = container.querySelector<HTMLButtonElement>('#identities-create-btn')
  const errorEl = container.querySelector<HTMLElement>('#identities-create-error')

  function handleCreate(): void {
    if (!nameInput || !errorEl) return
    const name = nameInput.value.trim()

    if (!isValidPersonaName(name)) {
      errorEl.textContent = 'Name must be lowercase, no spaces, max 32 characters.'
      return
    }

    const { personas } = getState()
    if (personas[name]) {
      errorEl.textContent = 'A persona with that name already exists.'
      return
    }

    try {
      const newPersona = createPersona(name)
      update({ personas: { ...personas, [name]: newPersona } })
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : 'Failed to create persona.'
    }
  }

  if (createBtn) {
    createBtn.addEventListener('click', handleCreate)
  }
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreate()
    })
  }

  // ── Archived section toggle ──────────────────────────────────
  const archivedToggle = container.querySelector<HTMLButtonElement>('#identities-archived-toggle')
  const archivedList = container.querySelector<HTMLElement>('#identities-archived-list')
  if (archivedToggle && archivedList) {
    archivedToggle.addEventListener('click', () => {
      _archivedVisible = !_archivedVisible
      archivedList.style.maxHeight = _archivedVisible ? archivedList.scrollHeight + 'px' : '0'
      const chevron = archivedToggle.querySelector('span')
      if (chevron) chevron.textContent = _archivedVisible ? '\u25BC' : '\u25B6'
    })
  }

  // ── Restore archived persona ─────────────────────────────────
  container.addEventListener('click', (e) => {
    const restoreBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-restore-persona]')
    if (!restoreBtn) return
    const name = restoreBtn.dataset.restorePersona!
    const { personas } = getState()
    const persona = personas[name]
    if (!persona) return
    const updated = { ...persona, archived: false }
    update({ personas: { ...personas, [name]: updated } })
  })
}
