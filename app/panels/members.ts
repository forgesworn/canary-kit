// app/panels/members.ts — Members panel: list members and generate invites

import { getState, updateGroup } from '../state.js'
import { addGroupMember, removeGroupMember } from '../actions/groups.js'
import { createInvite, verifyJoinToken } from '../invite.js'
import { generateQR } from '../components/qr.js'
import { escapeHtml } from '../utils/escape.js'
import { showModal } from '../components/modal.js'
import { showToast } from '../components/toast.js'
import { deriveVerificationWord } from 'canary-kit'

// ── Helpers ────────────────────────────────────────────────────

const MEMBER_NAMES = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eli', 'Faye', 'Gus', 'Hana']

/**
 * Format a pubkey for display: "You" for local identity, memberNames, friendly names for others.
 */
function formatPubkey(pubkey: string, members: string[], groupId?: string): string {
  const { identity, groups } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  // Check memberNames first
  if (groupId) {
    const group = groups[groupId]
    const name = group?.memberNames?.[pubkey]
    if (name) return name
  }
  const otherIndex = members.filter(m => m !== identity?.pubkey).indexOf(pubkey)
  return MEMBER_NAMES[otherIndex] ?? `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}`
}

// ── Invite modal ───────────────────────────────────────────────

/**
 * Open the invite share sheet with QR, Copy Link, and Copy Invite Text all visible at once.
 * Uses a plain <dialog> element rather than the shared modal helper.
 */
export function showInviteModal(payload: string, confirmCode: string): void {
  const base = window.location.href.split('#')[0]
  const joinUrl = `${base}#join/${encodeURIComponent(payload)}`
  const svgMarkup = generateQR(joinUrl)

  let dialog = document.getElementById('invite-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'invite-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
  }

  dialog.dataset.payload = payload
  dialog.innerHTML = `
    <div class="modal__form invite-share">
      <h2 class="modal__title">Invite to Group</h2>

      <div class="qr-container">${svgMarkup}</div>
      <p class="invite-hint">Scan with your phone camera to join</p>

      <div class="confirm-code">
        <span class="confirm-code__label">Confirmation words</span>
        <span class="confirm-code__value">${confirmCode}</span>
      </div>
      <p class="invite-hint">Read these words to the recipient — they'll need them to join</p>

      <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Share via a private channel — WhatsApp, Signal, or in person. The confirmation code verifies it wasn't tampered with.</p>

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
      btn.textContent = 'Link Copied!'
      btn.classList.add('btn--copied')
      setTimeout(() => { btn.textContent = 'Copy Link'; btn.classList.remove('btn--copied') }, 2000)
    } catch { /* clipboard may be blocked */ }
  })

  dialog.querySelector<HTMLButtonElement>('#invite-copy-text')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement
    try {
      await navigator.clipboard.writeText(payload)
      btn.textContent = 'Text Copied!'
      btn.classList.add('btn--copied')
      setTimeout(() => { btn.textContent = 'Copy Invite Text'; btn.classList.remove('btn--copied') }, 2000)
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

  const { identity } = getState()
  const isAdmin = !!identity?.pubkey && group.admins.includes(identity.pubkey)

  const memberItems =
    group.members.length > 0
      ? group.members
          .map(
            (pubkey) => `
          <li class="member-item" data-pubkey="${escapeHtml(pubkey)}">
            <span class="member-item__pubkey">${escapeHtml(formatPubkey(pubkey, group.members, activeGroupId))}</span>
            ${isAdmin ? `<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${escapeHtml(pubkey)}"
              type="button"
              aria-label="Remove member"
            >\u2715</button>` : ''}
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
      ${isAdmin ? `<div class="members-actions">
        <button class="btn btn--sm" id="add-member-btn" type="button">+ Add Member</button>
        <button class="btn btn--sm" id="invite-btn" type="button">+ Invite</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button">Confirm Member</button>
      </div>` : ''}
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
    if (!confirm(`Remove ${formatPubkey(pubkey, currentMembers, activeGroupId)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`)) {
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

  // ── Confirm member button ──────────────────────────────────────

  container.querySelector<HTMLButtonElement>('#confirm-member-btn')?.addEventListener('click', () => {
    showConfirmMemberModal()
  })
}

// ── Confirm member helpers ──────────────────────────────────────

function addConfirmedMember(groupId: string, pubkey: string, displayName: string): void {
  const { groups } = getState()
  const group = groups[groupId]
  if (!group) return
  if (group.members.includes(pubkey)) return

  const members = [...group.members, pubkey]
  const memberNames = { ...group.memberNames, [pubkey]: displayName }
  updateGroup(groupId, { members, memberNames })
}

export function showConfirmMemberModal(prefillToken?: string): void {
  const { groups, activeGroupId } = getState()
  if (!activeGroupId) return
  const group = groups[activeGroupId]
  if (!group) return

  showModal(`
    <h2 class="modal__title">Confirm Member</h2>

    <label class="input-label">Acknowledgement link or token
      <textarea name="ackToken" class="input" rows="2" placeholder="Paste #ack/... link or token">${escapeHtml(prefillToken ?? '')}</textarea>
    </label>

    <div class="confirm-member__divider">
      <span>— or verify by word —</span>
    </div>

    <label class="input-label">Verification word
      <input name="word" class="input" placeholder="e.g. sparrow">
    </label>
    <label class="input-label">Member name
      <input name="memberName" class="input" placeholder="e.g. Alice">
    </label>

    <div class="modal__actions">
      <button type="button" class="btn" id="modal-cancel-btn">Cancel</button>
      <button type="submit" class="btn btn--primary">Confirm</button>
    </div>
  `, (form) => {
    try {
      const ackToken = (form.get('ackToken') as string)?.trim()
      const wordInput = (form.get('word') as string)?.trim().toLowerCase()
      const nameInput = (form.get('memberName') as string)?.trim()

      const { activeGroupId: currentGroupId } = getState()
      if (!currentGroupId) throw new Error('No active group.')
      const { groups: currentGroups } = getState()
      const currentGroup = currentGroups[currentGroupId]
      if (!currentGroup) throw new Error('Group not found.')

      if (ackToken) {
        // Extract token from #ack/ URL or raw base64
        const tokenStr = ackToken.includes('#ack/')
          ? decodeURIComponent(ackToken.split('#ack/')[1])
          : ackToken

        const result = verifyJoinToken(tokenStr, {
          groupId: currentGroupId,
          groupSeed: currentGroup.seed,
        })
        if (!result.valid) {
          throw new Error(result.error ?? 'Invalid join token.')
        }

        addConfirmedMember(currentGroupId, result.pubkey!, result.displayName || nameInput || '')
        showToast(`${result.displayName || 'Member'} has joined the group`, 'success')
      } else if (wordInput) {
        if (!nameInput) throw new Error('Please enter the member name.')

        // Verify word against current group derivation
        const currentWord = deriveVerificationWord(currentGroup.seed, currentGroup.counter).toLowerCase()
        if (wordInput !== currentWord) {
          throw new Error('Word does not match — the member may not have the current group key.')
        }

        // For word-only verification, we don't have the real pubkey.
        // Generate a placeholder that will be reconciled on online sync.
        const bytes = new Uint8Array(32)
        crypto.getRandomValues(bytes)
        const placeholderPubkey = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
        addConfirmedMember(currentGroupId, placeholderPubkey, nameInput)
        showToast(`${nameInput} has joined the group`, 'success')
      } else {
        throw new Error('Provide either an ack token or a verification word.')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Confirmation failed.')
      throw err  // prevent closeModal — keep modal open so user can correct input
    }
  })

  requestAnimationFrame(() => {
    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
      const dialog = document.getElementById('app-modal') as HTMLDialogElement | null
      dialog?.close()
    })
  })
}
