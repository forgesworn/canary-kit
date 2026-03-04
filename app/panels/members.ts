// app/panels/members.ts — Members panel: list members and generate invites

import { getState } from '../state.js'
import { addGroupMember, removeGroupMember } from '../actions/groups.js'
import { createInvite } from '../invite.js'
import { generateQR } from '../components/qr.js'

// ── Helpers ────────────────────────────────────────────────────

const MEMBER_NAMES = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eli', 'Faye', 'Gus', 'Hana']

/**
 * Format a pubkey for display: "You" for local identity, friendly names for others.
 */
function formatPubkey(pubkey: string, members: string[]): string {
  const { identity } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  const otherIndex = members.filter(m => m !== identity?.pubkey).indexOf(pubkey)
  return MEMBER_NAMES[otherIndex] ?? `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}`
}

// ── Invite modal ───────────────────────────────────────────────

/**
 * Open the invite share sheet with QR, Copy Link, and Copy Invite Text all visible at once.
 * Uses a plain <dialog> element rather than the shared modal helper.
 */
export function showInviteModal(payload: string, confirmCode: string): void {
  const base = window.location.origin + window.location.pathname
  const joinUrl = `${base}#join/${encodeURIComponent(payload)}`
  const svgMarkup = generateQR(joinUrl)

  let dialog = document.getElementById('invite-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'invite-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
  }

  dialog.innerHTML = `
    <div class="modal__form invite-share">
      <h2 class="modal__title">Invite to Group</h2>

      <div class="qr-container">${svgMarkup}</div>

      <div class="confirm-code">
        <span class="confirm-code__label">Verification code</span>
        <span class="confirm-code__value">${confirmCode}</span>
      </div>
      <p class="invite-hint">Read this code aloud to verify the invite wasn't tampered with</p>

      <div class="invite-share__actions">
        <button class="btn btn--primary" id="invite-copy-link" type="button">Copy Link</button>
        <button class="btn" id="invite-copy-text" type="button">Copy Invite Text</button>
      </div>

      <p class="invite-hint">Share via WhatsApp, Signal, email, or any messaging app</p>

      <div class="modal__actions">
        <button class="btn" id="invite-close-btn" type="button">Done</button>
      </div>
    </div>
  `

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog!.close()
  })

  dialog.querySelector<HTMLButtonElement>('#invite-close-btn')?.addEventListener('click', () => {
    dialog!.close()
  })

  dialog.querySelector<HTMLButtonElement>('#invite-copy-link')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement
    try {
      await navigator.clipboard.writeText(joinUrl)
      btn.textContent = 'Copied!'
      setTimeout(() => { btn.textContent = 'Copy Link' }, 2000)
    } catch { /* clipboard may be blocked */ }
  })

  dialog.querySelector<HTMLButtonElement>('#invite-copy-text')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement
    try {
      await navigator.clipboard.writeText(payload)
      btn.textContent = 'Copied!'
      setTimeout(() => { btn.textContent = 'Copy Invite Text' }, 2000)
    } catch { /* clipboard may be blocked */ }
  })

  dialog.showModal()
}

// ── Render ─────────────────────────────────────────────────────

/**
 * Render the members panel into the given container.
 * Clears and returns early when no group is active.
 */
export function renderMembers(container: HTMLElement): void {
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

  const memberItems =
    group.members.length > 0
      ? group.members
          .map(
            (pubkey) => `
          <li class="member-item" data-pubkey="${pubkey}">
            <span class="member-item__pubkey">${formatPubkey(pubkey, group.members)}</span>
            <button
              class="btn btn--sm member-item__remove"
              data-pubkey="${pubkey}"
              type="button"
              aria-label="Remove member"
            >\u2715</button>
          </li>`,
          )
          .join('')
      : `<li class="member-item member-item--empty">No members yet.</li>`

  container.innerHTML = `
    <section class="panel members-panel">
      <h2 class="panel__title">Members</h2>
      <ul class="member-list">
        ${memberItems}
      </ul>
      <div class="members-actions">
        <button class="btn btn--sm" id="add-member-btn" type="button">+ Add Member</button>
        <button class="btn btn--sm" id="invite-btn" type="button">+ Invite</button>
      </div>
    </section>
  `

  // ── Remove member handlers ────────────────────────────────

  container.querySelector<HTMLElement>('.member-list')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.member-item__remove')
    if (!btn) return
    const pubkey = btn.dataset.pubkey
    if (!pubkey) return

    const { groups: g } = getState()
    const currentMembers = g[activeGroupId]?.members ?? []
    if (!confirm(`Remove ${formatPubkey(pubkey, currentMembers)} from the group?\n\nThe group secret will be rotated automatically.`)) {
      return
    }

    const { activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    removeGroupMember(currentGroupId, pubkey)
  })

  // ── Add simulated member ─────────────────────────────────

  container.querySelector<HTMLButtonElement>('#add-member-btn')?.addEventListener('click', () => {
    const { activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    const fakePubkey = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    addGroupMember(currentGroupId, fakePubkey)
  })

  // ── Invite button ─────────────────────────────────────────

  container.querySelector<HTMLButtonElement>('#invite-btn')?.addEventListener('click', () => {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    const { payload, confirmCode } = createInvite(currentGroup)
    showInviteModal(payload, confirmCode)
  })
}
