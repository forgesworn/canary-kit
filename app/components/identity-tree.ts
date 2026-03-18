// app/components/identity-tree.ts — Vertical indented identity tree visualisation

import { getState, update } from '../state.js'
import { walkTree, findById } from '../persona-tree.js'
import { createChildPersona } from '../persona.js'
import { personaColour } from './persona-picker.js'
import { escapeHtml } from '../utils/escape.js'
import type { AppPersona, AppGroup } from '../types.js'

// ── Styles ─────────────────────────────────────────────────────

const TREE_STYLES = `
  .id-tree {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }

  .id-tree__root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  .id-tree__root-icon {
    font-size: 1rem;
  }

  .id-tree__node {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 3px;
  }

  .id-tree__node:hover {
    background: var(--bg-hover, rgba(255,255,255,0.04));
  }

  .id-tree__connector {
    color: var(--text-muted);
    white-space: pre;
    user-select: none;
    flex-shrink: 0;
  }

  .id-tree__badge {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .id-tree__name {
    color: var(--text-primary);
    font-weight: 500;
  }

  .id-tree__display-name {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .id-tree__groups {
    margin-left: auto;
    font-size: 0.6875rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .id-tree__groups:hover {
    color: var(--amber-400);
  }

  .id-tree__add-btn {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }

  .id-tree__node:hover .id-tree__add-btn {
    opacity: 1;
  }

  .id-tree__add-btn:hover {
    color: var(--amber-400);
  }

  .id-tree__inline-input {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    background: var(--bg-deep);
    border: 1px solid var(--amber-500);
    border-radius: 3px;
    color: var(--text-primary);
    padding: 0.125rem 0.375rem;
    outline: none;
    width: 10rem;
  }

  .id-tree__inline-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
`

// ── Helpers ──────────────────────────────────────────────────

function countGroupsForPersona(
  personaId: string,
  groups: Record<string, AppGroup>,
): number {
  let count = 0
  for (const g of Object.values(groups)) {
    if (g.personaId === personaId) count++
  }
  return count
}

function firstGroupIdForPersona(
  personaId: string,
  groups: Record<string, AppGroup>,
): string | null {
  for (const [id, g] of Object.entries(groups)) {
    if (g.personaId === personaId) return id
  }
  return null
}

// ── Recursive node renderer ─────────────────────────────────

function renderNode(
  persona: AppPersona,
  groups: Record<string, AppGroup>,
  depth: number,
  isLast: boolean,
  parentPrefixes: string,
): string {
  if (persona.archived) return ''

  const connector = depth === 0 ? '' : (isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ')
  const colour = personaColour(persona.name)
  const letter = escapeHtml(persona.name.slice(0, 1).toUpperCase())
  const groupCount = countGroupsForPersona(persona.id, groups)
  const groupLabel = groupCount > 0
    ? `${groupCount} group${groupCount === 1 ? '' : 's'}`
    : ''

  const displayNameHtml = persona.displayName && persona.displayName !== persona.name
    ? ` <span class="id-tree__display-name">(${escapeHtml(persona.displayName)})</span>`
    : ''

  const paddingLeft = depth * 1.5

  const row = `
    <div class="id-tree__node" data-tree-persona-id="${escapeHtml(persona.id)}" style="padding-left: ${paddingLeft}rem;">
      <span class="id-tree__connector">${parentPrefixes}${connector}</span>
      <span class="id-tree__badge" style="background: ${colour};">${letter}</span>
      <span class="id-tree__name">${escapeHtml(persona.name)}</span>${displayNameHtml}
      <button class="id-tree__add-btn" data-tree-add-child="${escapeHtml(persona.id)}" title="Add child persona">+</button>
      ${groupLabel ? `<span class="id-tree__groups" data-tree-groups-persona="${escapeHtml(persona.id)}">${groupLabel}</span>` : ''}
    </div>
  `

  // Recurse into children
  const childEntries = Object.values(persona.children).filter(c => !c.archived)
  const childPrefix = depth === 0 ? '' : (parentPrefixes + (isLast ? '    ' : '\u2502   '))

  const childRows = childEntries.map((child, i) => {
    const childIsLast = i === childEntries.length - 1
    return renderNode(child, groups, depth + 1, childIsLast, childPrefix)
  }).join('')

  return row + childRows
}

// ── Public API ──────────────────────────────────────────────

/** Render the identity tree HTML. */
export function renderIdentityTree(): string {
  const { identity, personas, groups } = getState()

  if (!identity) {
    return '<div class="id-tree"></div>'
  }

  // Inject styles
  const styleBlock = `<style id="identity-tree-styles">${TREE_STYLES}</style>`

  const masterLabel = identity.displayName && identity.displayName !== 'You'
    ? escapeHtml(identity.displayName)
    : 'Master Identity'

  const rootPersonas = Object.values(personas).filter(p => !p.archived)

  const nodeRows = rootPersonas.map((p, i) => {
    const isLast = i === rootPersonas.length - 1
    return renderNode(p, groups, 0, isLast, '')
  }).join('')

  return `
    ${styleBlock}
    <div class="id-tree">
      <div class="id-tree__root">
        <span class="id-tree__root-icon">&#128273;</span>
        <span>${masterLabel}</span>
      </div>
      ${nodeRows}
    </div>
  `
}

/** Wire tree node click handlers. */
export function wireIdentityTree(container: HTMLElement): void {
  const tree = container.querySelector<HTMLElement>('.id-tree')
  if (!tree) return

  tree.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    // ── Add child button ──────────────────────────────────
    const addBtn = target.closest<HTMLElement>('[data-tree-add-child]')
    if (addBtn) {
      e.stopPropagation()
      const parentId = addBtn.dataset.treeAddChild!
      showInlineInput(tree, addBtn, parentId)
      return
    }

    // ── Group count click → navigate to groups view ───────
    const groupsEl = target.closest<HTMLElement>('[data-tree-groups-persona]')
    if (groupsEl) {
      e.stopPropagation()
      const personaId = groupsEl.dataset.treeGroupsPersona!
      const { groups } = getState()
      const firstId = firstGroupIdForPersona(personaId, groups)
      if (firstId) {
        update({ view: 'groups', activeGroupId: firstId })
      } else {
        update({ view: 'groups' })
      }
      return
    }

    // ── Persona node click → scroll to persona card ───────
    const nodeEl = target.closest<HTMLElement>('[data-tree-persona-id]')
    if (nodeEl) {
      const id = nodeEl.dataset.treePersonaId
      if (id) {
        document.getElementById('persona-card-' + id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })

  // ── Keyboard support ──────────────────────────────────────
  tree.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement
    if (e.key === 'Enter' || e.key === ' ') {
      if (target.matches('[data-tree-persona-id]')) {
        e.preventDefault()
        target.click()
      }
    }
  })
}

// ── Inline input for adding child personas ──────────────────

function showInlineInput(tree: HTMLElement, addBtn: HTMLElement, parentId: string): void {
  // Don't show multiple inputs
  if (tree.querySelector('.id-tree__inline-row')) return

  const nodeRow = addBtn.closest<HTMLElement>('.id-tree__node')
  if (!nodeRow) return

  // Compute the child's indent prefix
  const currentPadding = parseFloat(nodeRow.style.paddingLeft || '0')
  const childPadding = currentPadding + 1.5

  const inputRow = document.createElement('div')
  inputRow.className = 'id-tree__inline-row'
  inputRow.style.paddingLeft = childPadding + 'rem'

  const input = document.createElement('input')
  input.className = 'id-tree__inline-input'
  input.type = 'text'
  input.placeholder = 'child name'
  input.maxLength = 32
  input.autocomplete = 'off'

  inputRow.appendChild(input)
  nodeRow.insertAdjacentElement('afterend', inputRow)
  input.focus()

  function cleanup(): void {
    inputRow.remove()
  }

  function submit(): void {
    const name = input.value.trim().toLowerCase()
    if (!name || name.length === 0 || name.length > 32 || name !== name.toLowerCase() || /\s/.test(name)) {
      cleanup()
      return
    }

    try {
      const newChild = createChildPersona(parentId, name)
      const { personas } = getState()

      // Insert child into parent's children
      const found = findById(personas, parentId)
      if (found) {
        const updatedPersonas = deepInsertChild(personas, parentId, newChild)
        update({ personas: updatedPersonas })
      }
    } catch {
      // Name conflict or other error — just close
    }
    cleanup()
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cleanup()
    }
  })

  input.addEventListener('blur', () => {
    // Small delay to allow click events to fire first
    setTimeout(cleanup, 150)
  })
}

/**
 * Immutably insert a child persona under the given parentId in the tree.
 */
function deepInsertChild(
  personas: Record<string, AppPersona>,
  parentId: string,
  child: AppPersona,
): Record<string, AppPersona> {
  const result: Record<string, AppPersona> = {}
  for (const [id, p] of Object.entries(personas)) {
    if (id === parentId) {
      result[id] = {
        ...p,
        children: { ...p.children, [child.id]: child },
      }
    } else if (p.children && Object.keys(p.children).length > 0) {
      result[id] = {
        ...p,
        children: deepInsertChild(p.children, parentId, child),
      }
    } else {
      result[id] = p
    }
  }
  return result
}
