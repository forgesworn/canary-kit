// app/components/persona-card.ts — Persona card with expand/collapse, profile editing, actions

import { getState, update, updateGroup } from '../state.js'
import { escapeHtml } from '../utils/escape.js'
import { personaColour } from './persona-picker.js'
import { generateQR } from './qr.js'
import { showToast } from './toast.js'
import type { AppPersona, AppGroup } from '../types.js'

// ── Module state ──────────────────────────────────────────────

/** Track which persona cards are expanded — survives re-renders. */
const expandedCards = new Set<string>()

/** Track which persona cards have the "more" menu open. */
const openMenus = new Set<string>()

/** Track which persona cards show the QR code. */
const visibleQRs = new Set<string>()

/** Track which persona cards have custom relay editing enabled. */
const customRelayEditing = new Set<string>()

// ── Helpers ───────────────────────────────────────────────────

function truncateNpub(npub: string): string {
  if (npub.length <= 16) return npub
  return `${npub.slice(0, 8)}\u2026${npub.slice(-4)}`
}

function countGroupsForPersona(personaId: string, groups: AppGroup[]): number {
  return groups.filter((g) => g.personaId === personaId).length
}

function hasProfileChanges(persona: AppPersona, card: HTMLElement): boolean {
  const displayNameInput = card.querySelector<HTMLInputElement>('[data-field="displayName"]')
  const aboutInput = card.querySelector<HTMLInputElement>('[data-field="about"]')
  const pictureInput = card.querySelector<HTMLInputElement>('[data-field="picture"]')
  if (!displayNameInput && !aboutInput && !pictureInput) return false

  return (
    (displayNameInput?.value ?? '') !== (persona.displayName ?? '') ||
    (aboutInput?.value ?? '') !== (persona.about ?? '') ||
    (pictureInput?.value ?? '') !== (persona.picture ?? '')
  )
}

// ── Render ────────────────────────────────────────────────────

function renderCollapsedCard(persona: AppPersona, groupCount: number): string {
  const colour = personaColour(persona.name)
  const letter = escapeHtml(persona.name.slice(0, 1).toUpperCase())
  const isExpanded = expandedCards.has(persona.name)
  const chevron = isExpanded ? '\u25BC' : '\u25B6'
  const profileStatus = persona.displayName ? 'Profile published' : 'No profile'

  return `
    <div class="persona-card__header" data-persona-toggle="${escapeHtml(persona.name)}">
      <span class="persona-card__badge" style="background-color:${colour}">${letter}</span>
      <div class="persona-card__info">
        <span class="persona-card__name">${escapeHtml(persona.name)}</span>
        ${persona.displayName ? `<span class="persona-card__display-name">${escapeHtml(persona.displayName)}</span>` : ''}
        <span class="persona-card__meta">${groupCount} group${groupCount === 1 ? '' : 's'} \u00B7 ${profileStatus}</span>
      </div>
      <span class="persona-card__chevron">${chevron}</span>
    </div>
  `
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
      <button class="btn btn--sm btn--primary persona-card__publish-btn" data-persona-publish="${escapeHtml(persona.name)}" hidden>
        Publish
      </button>
    </div>
  `
}

function renderRelaySection(persona: AppPersona): string {
  const { settings } = getState()
  const hasCustom = (persona.readRelays && persona.readRelays.length > 0) ||
    (persona.writeRelays && persona.writeRelays.length > 0)
  const isEditing = customRelayEditing.has(persona.name)

  if (!hasCustom && !isEditing) {
    return `
      <div class="persona-card__section">
        <h4 class="persona-card__section-title">Relays</h4>
        <span class="persona-card__relay-default">Using default relays</span>
        <a href="#" class="persona-card__customise-link" data-persona-customise-relays="${escapeHtml(persona.name)}">Customise</a>
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
          data-persona-relay="${escapeHtml(persona.name)}"
          value="${escapeHtml(readRelays.join(', '))}" placeholder="wss://relay.example.com" />
      </label>
      <label class="persona-card__field">
        <span class="persona-card__field-label">Write relays</span>
        <input class="input persona-card__input" type="text" data-relay-field="write"
          data-persona-relay="${escapeHtml(persona.name)}"
          value="${escapeHtml(writeRelays.join(', '))}" placeholder="wss://relay.example.com" />
      </label>
      <button class="btn btn--sm btn--primary" data-persona-save-relays="${escapeHtml(persona.name)}">Save relays</button>
    </div>
  `
}

function renderGroupsSection(persona: AppPersona, groups: AppGroup[], allPersonas: Record<string, AppPersona>): string {
  const personaGroups = groups.filter((g) => g.personaId === persona.id)
  const otherGroups = groups.filter((g) => g.personaId !== persona.id)

  const chips = personaGroups.map((g) => `
    <span class="persona-card__group-chip-wrap">
      <button class="persona-card__group-chip" data-navigate-group="${escapeHtml(g.id)}">${escapeHtml(g.name)}</button>
      <button class="persona-card__group-remove" data-unassign-group="${escapeHtml(g.id)}"
        title="Unassign from this persona" aria-label="Unassign ${escapeHtml(g.name)}">\u00D7</button>
    </span>
  `).join('')

  // Resolve persona name for the "from" label on assign options
  function personaNameForGroup(g: AppGroup): string {
    if (!g.personaId) return ''
    const p = Object.values(allPersonas).find(p => p.id === g.personaId)
    return p ? p.name : ''
  }

  const assignOptions = otherGroups.length > 0
    ? `<select class="input persona-card__assign-select" data-assign-persona="${escapeHtml(persona.id)}" style="font-size:0.75rem;padding:0.25rem 0.375rem;">
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
  const menuOpen = openMenus.has(persona.name)
  const qrVisible = visibleQRs.has(persona.name)

  return `
    <div class="persona-card__actions">
      <button class="btn btn--sm" data-persona-export="${escapeHtml(persona.name)}">Export nsec</button>
      <div class="persona-card__more">
        <button class="btn btn--sm persona-card__more-btn" data-persona-menu="${escapeHtml(persona.name)}"
          aria-label="More actions" title="More actions">\u22EF</button>
        ${menuOpen ? `
          <div class="persona-card__menu" data-persona-menu-panel="${escapeHtml(persona.name)}">
            <button class="persona-card__menu-item" data-persona-copy-npub="${escapeHtml(persona.name)}">Copy npub</button>
            <button class="persona-card__menu-item" data-persona-show-qr="${escapeHtml(persona.name)}">
              ${qrVisible ? 'Hide QR' : 'Show QR'}
            </button>
            <button class="persona-card__menu-item" data-persona-rotate="${escapeHtml(persona.name)}">Rotate</button>
            <button class="persona-card__menu-item" data-persona-prove="${escapeHtml(persona.name)}">Prove ownership</button>
            <button class="persona-card__menu-item persona-card__menu-item--danger" data-persona-archive="${escapeHtml(persona.name)}">Archive</button>
          </div>
        ` : ''}
      </div>
    </div>
    ${qrVisible ? `
      <div class="persona-card__qr" data-persona-qr="${escapeHtml(persona.name)}">
        ${generateQR(persona.npub, 3)}
        <span class="persona-card__qr-label">${escapeHtml(truncateNpub(persona.npub))}</span>
      </div>
    ` : ''}
  `
}

// ── Public API ────────────────────────────────────────────────

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

/**
 * Render a single persona card. Returns HTML string.
 */
export function renderPersonaCard(persona: AppPersona, groups: AppGroup[], ancestors: AppPersona[] = []): string {
  const isExpanded = expandedCards.has(persona.name)
  const groupCount = countGroupsForPersona(persona.id, groups)
  const { personas: allPersonas } = getState()

  return `
    <div class="persona-card${isExpanded ? ' persona-card--expanded' : ''}"
         id="persona-card-${escapeHtml(persona.name)}"
         data-persona-name="${escapeHtml(persona.name)}"
         data-persona-id="${escapeHtml(persona.id)}">
      ${renderCollapsedCard(persona, groupCount)}
      ${isExpanded ? `
        <div class="persona-card__body">
          ${renderBreadcrumb(ancestors)}
          <div class="persona-card__npub">${escapeHtml(persona.npub)}</div>
          ${renderProfileSection(persona)}
          ${renderRelaySection(persona)}
          ${renderGroupsSection(persona, groups, allPersonas)}
          ${renderActions(persona)}
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Wire all persona card event handlers within a container.
 */
export function wirePersonaCards(container: HTMLElement): void {
  // ── Toggle expand/collapse ────────────────────────────────
  container.addEventListener('click', (e) => {
    const toggle = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-toggle]')
    if (toggle) {
      const name = toggle.dataset.personaToggle!
      if (expandedCards.has(name)) {
        expandedCards.delete(name)
      } else {
        expandedCards.add(name)
      }
      // Re-render by dispatching state update (view stays the same, triggers re-render)
      update({ view: getState().view })
      return
    }

    // ── Group chip navigation ─────────────────────────────────
    const groupChip = (e.target as HTMLElement).closest<HTMLElement>('[data-navigate-group]')
    if (groupChip) {
      const groupId = groupChip.dataset.navigateGroup!
      update({ view: 'groups', activeGroupId: groupId })
      return
    }

    // ── Export nsec ────────────────────────────────────────────
    const exportBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-export]')
    if (exportBtn) {
      const name = exportBtn.dataset.personaExport!
      container.dispatchEvent(new CustomEvent('canary:export-persona', {
        bubbles: true,
        detail: { personaName: name },
      }))
      return
    }

    // ── More menu toggle ──────────────────────────────────────
    const menuBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-menu]')
    if (menuBtn) {
      const name = menuBtn.dataset.personaMenu!
      if (openMenus.has(name)) {
        openMenus.delete(name)
      } else {
        openMenus.clear()
        openMenus.add(name)
      }
      update({ view: getState().view })
      return
    }

    // ── Copy npub ─────────────────────────────────────────────
    const copyBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-copy-npub]')
    if (copyBtn) {
      const name = copyBtn.dataset.personaCopyNpub!
      const { personas } = getState()
      const persona = personas[name]
      if (persona) {
        navigator.clipboard.writeText(persona.npub).then(() => {
          copyBtn.textContent = 'Copied!'
          setTimeout(() => { copyBtn.textContent = 'Copy npub' }, 2000)
        }).catch(() => {})
      }
      return
    }

    // ── Show/hide QR ──────────────────────────────────────────
    const qrBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-show-qr]')
    if (qrBtn) {
      const name = qrBtn.dataset.personaShowQr!
      if (visibleQRs.has(name)) {
        visibleQRs.delete(name)
      } else {
        visibleQRs.add(name)
      }
      openMenus.delete(name)
      update({ view: getState().view })
      return
    }

    // ── Rotate persona ────────────────────────────────────────
    const rotateBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-rotate]')
    if (rotateBtn) {
      const name = rotateBtn.dataset.personaRotate!
      openMenus.delete(name)
      container.dispatchEvent(new CustomEvent('canary:rotate-persona', {
        bubbles: true,
        detail: { personaName: name },
      }))
      return
    }

    // ── Archive persona ───────────────────────────────────────
    const archiveBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-archive]')
    if (archiveBtn) {
      const name = archiveBtn.dataset.personaArchive!
      openMenus.delete(name)
      container.dispatchEvent(new CustomEvent('canary:archive-persona', {
        bubbles: true,
        detail: { personaName: name },
      }))
      return
    }

    // ── Prove ownership ───────────────────────────────────────
    const proveBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-prove]')
    if (proveBtn) {
      const name = proveBtn.dataset.personaProve!
      openMenus.delete(name)
      container.dispatchEvent(new CustomEvent('canary:prove-ownership', {
        bubbles: true,
        detail: { personaName: name },
      }))
      return
    }

    // ── Customise relays link ─────────────────────────────────
    const customiseLink = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-customise-relays]')
    if (customiseLink) {
      e.preventDefault()
      const name = customiseLink.dataset.personaCustomiseRelays!
      customRelayEditing.add(name)
      update({ view: getState().view })
      return
    }

    // ── Save relays ───────────────────────────────────────────
    const saveRelaysBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-save-relays]')
    if (saveRelaysBtn) {
      const name = saveRelaysBtn.dataset.personaSaveRelays!
      const card = container.querySelector<HTMLElement>(`#persona-card-${CSS.escape(name)}`)
      if (!card) return

      const readInput = card.querySelector<HTMLInputElement>('[data-relay-field="read"]')
      const writeInput = card.querySelector<HTMLInputElement>('[data-relay-field="write"]')

      const readRelays = (readInput?.value ?? '').split(',').map((s) => s.trim()).filter(Boolean)
      const writeRelays = (writeInput?.value ?? '').split(',').map((s) => s.trim()).filter(Boolean)

      const { personas } = getState()
      const updated = { ...personas[name], readRelays, writeRelays }
      update({ personas: { ...personas, [name]: updated } })
      customRelayEditing.delete(name)
      showToast(`Relays saved for "${name}"`, 'success')
      return
    }

    // ── Unassign group from persona ───────────────────────────
    const unassignBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-unassign-group]')
    if (unassignBtn) {
      e.stopPropagation()
      const groupId = unassignBtn.dataset.unassignGroup!
      const { groups } = getState()
      const group = groups[groupId]
      if (!group) return
      // Unlink from persona — set personaId to empty string
      updateGroup(groupId, { personaId: '' })
      showToast(`"${group.name}" unassigned`, 'info')
      return
    }

    // ── Close menu on outside click ───────────────────────────
    if (openMenus.size > 0) {
      const inMenu = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-menu-panel]')
      if (!inMenu) {
        openMenus.clear()
        update({ view: getState().view })
      }
    }
  })

  // ── Assign group to persona ─────────────────────────────
  container.addEventListener('change', (e) => {
    const select = e.target as HTMLSelectElement
    if (!select.dataset.assignPersona) return
    const personaId = select.dataset.assignPersona
    const groupId = select.value
    if (!groupId) return

    const { groups, personas } = getState()
    const group = groups[groupId]
    if (!group) return

    updateGroup(groupId, { personaId })
    const personaEntry = Object.values(personas).find(p => p.id === personaId)
    showToast(`"${group.name}" assigned to ${personaEntry?.name ?? personaId}`, 'success')
    select.value = ''
  })

  // ── Profile publish button visibility ─────────────────────
  container.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    if (!input.classList.contains('persona-card__input')) return
    if (!input.dataset.field) return

    const card = input.closest<HTMLElement>('.persona-card')
    if (!card) return
    const name = card.dataset.personaName
    if (!name) return

    const { personas } = getState()
    const persona = personas[name]
    if (!persona) return

    const publishBtn = card.querySelector<HTMLButtonElement>('[data-persona-publish]')
    if (publishBtn) {
      publishBtn.hidden = !hasProfileChanges(persona, card)
    }
  })

  // ── Profile publish action ────────────────────────────────
  container.addEventListener('click', (e) => {
    const publishBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-persona-publish]')
    if (!publishBtn) return

    const name = (publishBtn as HTMLElement).dataset.personaPublish!
    const card = container.querySelector<HTMLElement>(`#persona-card-${CSS.escape(name)}`)
    if (!card) return

    const displayNameInput = card.querySelector<HTMLInputElement>('[data-field="displayName"]')
    const aboutInput = card.querySelector<HTMLInputElement>('[data-field="about"]')
    const pictureInput = card.querySelector<HTMLInputElement>('[data-field="picture"]')

    const { personas } = getState()
    const persona = personas[name]
    if (!persona) return

    const updated: AppPersona = {
      ...persona,
      displayName: displayNameInput?.value || undefined,
      about: aboutInput?.value || undefined,
      picture: pictureInput?.value || undefined,
    }

    update({ personas: { ...personas, [name]: updated } })
    showToast(`Profile saved for "${name}"`, 'success')

    // Hide publish button after saving
    const btn = card.querySelector<HTMLButtonElement>('[data-persona-publish]')
    if (btn) btn.hidden = true
  })
}
