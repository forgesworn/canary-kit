// app/components/identity-tree.ts — Animated vertical identity tree visualisation

import { getState, update } from '../state.js'
import { personaColour } from './persona-picker.js'
import { escapeHtml } from '../utils/escape.js'

// ── Helpers ────────────────────────────────────────────────────

/** Truncate an npub to a short readable form: first 8 + "…" + last 4 chars. */
function truncateNpub(npub: string): string {
  if (npub.length <= 16) return npub
  return `${npub.slice(0, 8)}\u2026${npub.slice(-4)}`
}

/** Inline styles for the tree container (handles expand/collapse animation). */
const TREE_STYLES = [
  'overflow: hidden',
  'transition: max-height 0.3s ease-out',
  'max-height: 0',
].join('; ')

/** Inline styles for the master node at the top. */
const MASTER_NODE_STYLES = [
  'display: flex',
  'align-items: center',
  'justify-content: center',
  'gap: 0.5rem',
  'padding: 0.625rem 1rem',
  'background: var(--surface, #1e1e2e)',
  'border: 2px solid var(--accent, #7c3aed)',
  'border-radius: 8px',
  'font-weight: 600',
  'font-size: 0.875rem',
  'color: var(--text, #e0e0e0)',
  'width: fit-content',
  'margin: 0 auto',
].join('; ')

/** Vertical trunk line from master to the horizontal branch. */
const TRUNK_STYLES = [
  'width: 2px',
  'height: 1.25rem',
  'background: var(--border, #444)',
  'margin: 0 auto',
].join('; ')

/** Horizontal branch container that holds persona columns. */
const BRANCH_ROW_STYLES = [
  'display: flex',
  'justify-content: center',
  'gap: 0',
  'position: relative',
].join('; ')

// ── Render functions ─────────────────────────────────────────

/** Render a single group leaf node. */
function renderGroupLeaf(groupId: string, groupName: string): string {
  return `
    <div
      class="identity-tree__group"
      data-tree-group="${escapeHtml(groupId)}"
      style="
        padding: 0.25rem 0.5rem;
        font-size: 0.6875rem;
        color: var(--text-muted, #999);
        background: var(--surface, #1e1e2e);
        border: 1px solid var(--border, #444);
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        text-align: center;
      "
      role="button"
      tabindex="0"
    >${escapeHtml(groupName)}</div>
  `
}

/** Render a persona column (node + its group leaves). */
function renderPersonaColumn(
  name: string,
  npub: string,
  archived: boolean,
  groupEntries: Array<{ id: string; name: string }>,
): string {
  const colour = personaColour(name)
  const opacity = archived ? 'opacity: 0.4;' : ''
  const borderStyle = archived ? 'border-style: dashed;' : ''
  const lineStyle = archived
    ? 'background: repeating-linear-gradient(to bottom, var(--border, #444) 0 4px, transparent 4px 8px);'
    : 'background: var(--border, #444);'

  const groupLeaves = groupEntries.length > 0
    ? groupEntries.map((g) => {
        const leafLine = `<div style="width: 2px; height: 0.75rem; margin: 0 auto; ${lineStyle}"></div>`
        return leafLine + renderGroupLeaf(g.id, g.name)
      }).join('')
    : ''

  return `
    <div class="identity-tree__persona-col" style="display: flex; flex-direction: column; align-items: center; ${opacity}">
      <div style="width: 2px; height: 1.25rem; margin: 0 auto; ${lineStyle}"></div>
      <div
        class="identity-tree__persona"
        data-tree-persona="${escapeHtml(name)}"
        style="
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: var(--surface, #1e1e2e);
          border: 2px solid ${colour};
          ${borderStyle}
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        "
        role="button"
        tabindex="0"
      >
        <span style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: ${colour};
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
        ">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>
        <span style="font-size: 0.8125rem; color: var(--text, #e0e0e0);">${escapeHtml(name)}</span>
        <span style="font-size: 0.6875rem; color: var(--text-muted, #999);">${escapeHtml(truncateNpub(npub))}</span>
      </div>
      ${groupLeaves}
    </div>
  `
}

/**
 * Build the horizontal connecting line that spans across persona columns.
 * Uses a border-top on a positioned element between the first and last column.
 */
function renderHorizontalBranch(personaCount: number): string {
  if (personaCount <= 1) return ''
  // The horizontal line sits behind the persona columns.
  // We use a pseudo-element-free approach: an absolutely positioned div.
  return `
    <div style="
      position: absolute;
      top: 0;
      left: calc(50% / ${personaCount});
      right: calc(50% / ${personaCount});
      height: 0;
      border-top: 2px solid var(--border, #444);
    "></div>
  `
}

// ── Public API ─────────────────────────────────────────────────

/** Render the identity tree HTML. */
export function renderIdentityTree(): string {
  const { identity, personas, groups } = getState()

  if (!identity) {
    return '<div class="identity-tree" style="' + TREE_STYLES + '"></div>'
  }

  const personaList = Object.values(personas)

  // Build a map: persona name → groups belonging to that persona
  const groupsByPersona: Record<string, Array<{ id: string; name: string }>> = {}
  for (const p of personaList) {
    groupsByPersona[p.name] = []
  }
  for (const [id, group] of Object.entries(groups)) {
    const pName = group.personaName
    if (pName && groupsByPersona[pName]) {
      groupsByPersona[pName].push({ id, name: group.name })
    }
  }

  const personaColumns = personaList
    .map((p) => renderPersonaColumn(
      p.name,
      p.npub,
      p.archived === true,
      groupsByPersona[p.name] ?? [],
    ))
    .join('')

  const masterLabel = identity.displayName && identity.displayName !== 'You'
    ? escapeHtml(identity.displayName)
    : 'Master Identity'

  const inner = `
    <div style="padding: 1rem 0.5rem;">
      <div style="${MASTER_NODE_STYLES}">
        <span style="font-size: 1rem;">&#128273;</span>
        <span>${masterLabel}</span>
      </div>
      ${personaList.length > 0 ? `
        <div style="${TRUNK_STYLES}"></div>
        <div style="${BRANCH_ROW_STYLES}; padding: 0 1rem; gap: 1.5rem;">
          ${renderHorizontalBranch(personaList.length)}
          ${personaColumns}
        </div>
      ` : ''}
    </div>
  `

  return `<div class="identity-tree" style="${TREE_STYLES}">${inner}</div>`
}

/** Wire tree node click handlers. */
export function wireIdentityTree(container: HTMLElement): void {
  const tree = container.querySelector<HTMLElement>('.identity-tree')
  if (!tree) return

  // ── Expand/collapse ────────────────────────────────────────
  // If the tree has the `expanded` class, expand; otherwise collapse.
  if (tree.classList.contains('expanded')) {
    tree.style.maxHeight = tree.scrollHeight + 'px'
  }

  // ── Persona node clicks → scroll to persona card ──────────
  tree.addEventListener('click', (e) => {
    const personaEl = (e.target as HTMLElement).closest<HTMLElement>('[data-tree-persona]')
    if (personaEl) {
      const name = personaEl.dataset.treePersona
      if (name) {
        document.getElementById(`persona-card-${name}`)?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    // ── Group leaf clicks → switch to groups view ────────────
    const groupEl = (e.target as HTMLElement).closest<HTMLElement>('[data-tree-group]')
    if (groupEl) {
      const groupId = groupEl.dataset.treeGroup
      if (groupId) {
        update({ view: 'groups', activeGroupId: groupId })
      }
    }
  })

  // ── Keyboard support (Enter/Space) ─────────────────────────
  tree.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' || e.key === ' ') {
      if (target.matches('[data-tree-persona], [data-tree-group]')) {
        e.preventDefault()
        target.click()
      }
    }
  })
}
