// app/panels/members.ts — Members panel: list members and generate invites

import { getState, updateGroup } from '../state.js'
import { addGroupMember, removeGroupMember } from '../actions/groups.js'
import {
  verifyJoinToken,
  startInviteSession, rotateInviteSession, endInviteSession,
} from '../invite.js'
import { groupMode } from '../types.js'
import { generateQR } from '../components/qr.js'
import { escapeHtml } from '../utils/escape.js'
import { showModal } from '../components/modal.js'
import { showToast } from '../components/toast.js'
import { deriveToken } from 'canary-kit/token'
import { GROUP_CONTEXT, toTokenEncoding } from '../utils/encoding.js'
import { fetchProfiles, getCachedName } from '../nostr/profiles.js'

// ── Helpers ────────────────────────────────────────────────────

const MEMBER_HUES = [210, 140, 30, 280, 60, 330, 170, 0] // stable colour per member slot

function memberHue(pubkey: string, members: string[]): number {
  const idx = members.indexOf(pubkey)
  return MEMBER_HUES[(idx >= 0 ? idx : 0) % MEMBER_HUES.length]
}

function memberColourDot(pubkey: string, members: string[], livenessCheckins: Record<string, number>, livenessInterval: number): string {
  const hue = memberHue(pubkey, members)
  const lastCheckin = livenessCheckins[pubkey] ?? 0
  if (lastCheckin === 0) return `hsl(${hue}, 20%, 50%)` // desaturated — never checked in
  const elapsed = Math.floor(Date.now() / 1000) - lastCheckin
  if (elapsed <= livenessInterval) return `hsl(${hue}, 70%, 55%)` // vibrant
  if (elapsed <= livenessInterval * 1.25) return `hsl(${hue}, 40%, 50%)` // fading
  return '#94a3b8' // grey — missed
}

/**
 * Format a pubkey for display: "You" for local identity, memberNames, or truncated pubkey.
 */
function formatPubkey(pubkey: string, _members: string[], groupId?: string): string {
  const { identity, groups } = getState()
  if (identity?.pubkey === pubkey) return 'You'
  if (groupId) {
    const group = groups[groupId]
    const name = group?.memberNames?.[pubkey]
    if (name) return name
  }
  const profileName = getCachedName(pubkey)
  if (profileName) return profileName
  return `${pubkey.slice(0, 8)}\u2026${pubkey.slice(-4)}`
}

/** Convert an SVG string to a PNG Blob via canvas. */
async function svgToBlob(svgMarkup: string, size = 400): Promise<Blob> {
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const img = new Image()
  img.width = size
  img.height = size

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(img, 0, 0, size, size)
  URL.revokeObjectURL(url)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas toBlob failed'))
    }, 'image/png')
  })
}

// ── Invite modal ───────────────────────────────────────────────

/**
 * Open the invite share sheet with QR, Copy Link, and Copy Invite Text all visible at once.
 * Uses a plain <dialog> element rather than the shared modal helper.
 */
interface InviteModalOptions {
  title?: string
  scanHint?: string
  showConfirmMemberNote?: boolean
  /** Hash fragment prefix for the link, e.g. 'join' or 'sync'. Defaults to 'join'. */
  hashPrefix?: string
}

export function showInviteModal(group: import('../types.js').AppGroup, options?: InviteModalOptions): void {
  const title = options?.title ?? 'Invite to Group'
  const scanHint = options?.scanHint ?? 'Scan with your phone camera to join'
  const showConfirmMemberNote = options?.showConfirmMemberNote ?? true

  const isOnline = groupMode(group) === 'online'
  let session = startInviteSession(group)

  function currentScanUrl(): string {
    const base = window.location.href.split('#')[0]
    return `${base}#scan/${encodeURIComponent(session.payload)}`
  }
  function currentLinkUrl(): string {
    const base = window.location.href.split('#')[0]
    const prefix = options?.hashPrefix ?? 'join'
    return `${base}#${prefix}/${encodeURIComponent(session.payload)}`
  }

  let dialog = document.getElementById('invite-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'invite-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
    // Attach backdrop-close once — never leaks handlers on innerHTML replacement
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) { endInviteSession(); dialog!.close() }
    })
  }

  dialog.dataset.payload = session.payload

  // ── Inner renderers ──────────────────────────────────────
  const d = dialog // stable reference for closures

  function renderChooser(): void {
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">${escapeHtml(title)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Share Link &mdash; send it to them</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `
    d.querySelector<HTMLButtonElement>('#invite-qr-path')?.addEventListener('click', renderQRPath)
    d.querySelector<HTMLButtonElement>('#invite-link-path')?.addEventListener('click', renderLinkPath)
    d.querySelector<HTMLButtonElement>('#invite-close-btn')?.addEventListener('click', () => { endInviteSession(); d.close() })
  }

  function renderQRPath(): void {
    const svgMarkup = generateQR(currentScanUrl())
    const joinCountHtml = session.joinCount > 0
      ? `<p class="invite-hint" style="color: var(--success);">${session.joinCount} joined so far</p>`
      : ''
    const actionHtml = isOnline
      ? '<p class="invite-hint" id="invite-waiting-status">Waiting for scan...</p>'
      : '<button class="btn" id="invite-next-btn" type="button">Next</button>'

    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">${escapeHtml(title)}</h2>

        <div class="qr-container">${svgMarkup}</div>
        <p class="invite-hint">${escapeHtml(scanHint)}</p>
        ${joinCountHtml}
        ${actionHtml}

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-close-btn" type="button">Done</button>
        </div>
      </div>
    `

    // Offline: "Next" rotates to a fresh invite for the next person
    d.querySelector<HTMLButtonElement>('#invite-next-btn')?.addEventListener('click', () => {
      const currentGroup = getState().groups[group.id]
      if (currentGroup) {
        const rotated = rotateInviteSession(currentGroup)
        if (rotated) {
          session = rotated
          d.dataset.payload = session.payload
          renderQRPath()
        }
      }
    })

    // Online: listen for member-joined events to auto-rotate
    const joinHandler = (evt: Event) => {
      const detail = (evt as CustomEvent).detail
      if (detail.groupId !== group.id) return
      // Toast is handled by sync.ts — just rotate the QR
      const currentGroup = getState().groups[group.id]
      if (currentGroup) {
        const rotated = rotateInviteSession(currentGroup)
        if (rotated) {
          session = rotated
          d.dataset.payload = session.payload
          renderQRPath()
        }
      }
    }
    if (isOnline) {
      document.addEventListener('canary:member-joined', joinHandler)
    }
    const removeJoinHandler = () => document.removeEventListener('canary:member-joined', joinHandler)

    d.querySelector<HTMLButtonElement>('#invite-back-btn')?.addEventListener('click', () => { removeJoinHandler(); renderChooser() })
    d.querySelector<HTMLButtonElement>('#invite-close-btn')?.addEventListener('click', () => { removeJoinHandler(); endInviteSession(); d.close() })
  }

  function renderLinkPath(): void {
    const linkUrl = currentLinkUrl()
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">${escapeHtml(title)}</h2>

        <div class="confirm-code">
          <span class="confirm-code__label">Confirmation words</span>
          <span class="confirm-code__value">${session.confirmCode}</span>
        </div>
        <p class="invite-hint">Read these words to the recipient on a phone call — they'll need them to join</p>

        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Share via a private channel — WhatsApp, Signal, or in person. The confirmation code verifies it wasn't tampered with.</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn btn--primary" id="invite-copy-link" type="button">Copy Link</button>
            <button class="btn" id="invite-copy-text" type="button">Copy Invite Text</button>
          </div>
          <button class="btn" id="invite-save-qr" type="button">Save QR Image</button>
        </div>

        <p class="invite-hint">Share via WhatsApp, Signal, email, or any messaging app</p>

        ${showConfirmMemberNote ? `<p class="invite-hint" style="margin-top: 1rem; font-style: italic;">After they join, click <strong>Confirm Member</strong> to verify them — they'll give you a word or token.</p>` : ''}

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn" id="invite-close-btn" type="button">Done</button>
        </div>
      </div>
    `
    d.querySelector<HTMLButtonElement>('#invite-back-btn')?.addEventListener('click', renderChooser)
    d.querySelector<HTMLButtonElement>('#invite-close-btn')?.addEventListener('click', () => { endInviteSession(); d.close() })

    d.querySelector<HTMLButtonElement>('#invite-copy-link')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        await navigator.clipboard.writeText(linkUrl)
        btn.textContent = 'Link Copied!'
        btn.classList.add('btn--copied')
        setTimeout(() => { btn.textContent = 'Copy Link'; btn.classList.remove('btn--copied') }, 2000)
      } catch { /* clipboard may be blocked */ }
    })

    d.querySelector<HTMLButtonElement>('#invite-copy-text')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        await navigator.clipboard.writeText(session.payload)
        btn.textContent = 'Text Copied!'
        btn.classList.add('btn--copied')
        setTimeout(() => { btn.textContent = 'Copy Invite Text'; btn.classList.remove('btn--copied') }, 2000)
      } catch { /* clipboard may be blocked */ }
    })

    d.querySelector<HTMLButtonElement>('#invite-save-qr')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        const linkQrSvg = generateQR(currentLinkUrl())
        const blob = await svgToBlob(linkQrSvg)
        if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          btn.textContent = 'QR Copied!'
          btn.classList.add('btn--copied')
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'canary-invite.png'
          a.click()
          URL.revokeObjectURL(url)
          btn.textContent = 'QR Downloaded!'
          btn.classList.add('btn--copied')
        }
        setTimeout(() => { btn.textContent = 'Save QR Image'; btn.classList.remove('btn--copied') }, 2000)
      } catch {
        btn.textContent = 'Failed'
        setTimeout(() => { btn.textContent = 'Save QR Image' }, 2000)
      }
    })
  }

  // Start with the path chooser
  renderChooser()
  dialog.showModal()
}

/**
 * Open the share-state modal — a thin wrapper around showInviteModal
 * with copy tailored for syncing existing members after rekey/membership changes.
 */
export function showShareStateModal(group: import('../types.js').AppGroup): void {
  showInviteModal(group, {
    title: 'Share Group State',
    scanHint: 'Share with existing members to sync the latest group state.',
    showConfirmMemberNote: false,
    hashPrefix: 'sync',
  })
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

  // Fetch kind 0 profiles for members we don't have names for yet
  fetchProfiles(group.members, activeGroupId)

  const memberItems =
    group.members.length > 0
      ? group.members
          .map(
            (pubkey) => {
              const dotColour = memberColourDot(pubkey, group.members, group.livenessCheckins ?? {}, group.livenessInterval)
              return `
          <li class="member-item" data-pubkey="${escapeHtml(pubkey)}">
            <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${dotColour};flex-shrink:0;box-shadow:0 0 6px ${dotColour}80;"></span>
            <span class="member-item__pubkey">${escapeHtml(formatPubkey(pubkey, group.members, activeGroupId))}</span>
            ${isAdmin ? `<button
              class="btn btn--sm member-item__remove"
              data-pubkey="${escapeHtml(pubkey)}"
              type="button"
              aria-label="Remove member"
            >\u2715</button>` : ''}
          </li>`
            },
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
        <button class="btn btn--sm" id="invite-btn" type="button">+ Invite</button>
        <button class="btn btn--sm" id="share-state-btn" type="button">Share State</button>
        <button class="btn btn--sm" id="confirm-member-btn" type="button">Confirm Member</button>
      </div>` : ''}
      <div class="members-sync">
        <button class="btn btn--sm" id="sync-state-btn" type="button">${isAdmin ? 'Sync State' : 'Update Group'}</button>
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
    if (!confirm(`Remove ${formatPubkey(pubkey, currentMembers, activeGroupId)} from the group?\n\nThis rotates the group secret immediately. Remaining members must re-join using a fresh invite.`)) {
      return
    }

    const { activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    removeGroupMember(currentGroupId, pubkey)

    // Auto-open share state modal so admin can sync remaining members
    const { groups: updatedGroups } = getState()
    const updatedGroup = updatedGroups[currentGroupId]
    if (updatedGroup && updatedGroup.members.length > 0) {
      showShareStateModal(updatedGroup)
    }
  })

  // ── Invite button ─────────────────────────────────────────

  container.querySelector<HTMLButtonElement>('#invite-btn')?.addEventListener('click', () => {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    showInviteModal(currentGroup)
  })

  // ── Share state button ──────────────────────────────────────

  container.querySelector<HTMLButtonElement>('#share-state-btn')?.addEventListener('click', () => {
    const { groups: currentGroups, activeGroupId: currentGroupId } = getState()
    if (!currentGroupId) return
    const currentGroup = currentGroups[currentGroupId]
    if (!currentGroup) return

    showShareStateModal(currentGroup)
  })

  // ── Confirm member button ──────────────────────────────────────

  container.querySelector<HTMLButtonElement>('#confirm-member-btn')?.addEventListener('click', () => {
    showConfirmMemberModal()
  })

  // ── Sync state button (all members) ──────────────────────────

  container.querySelector<HTMLButtonElement>('#sync-state-btn')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('canary:sync-state'))
  })
}

// ── Confirm member helpers ──────────────────────────────────────

function addConfirmedMember(groupId: string, pubkey: string, displayName: string): boolean {
  const { groups, identity } = getState()
  const group = groups[groupId]
  if (!group) return false
  if (!identity?.pubkey || !group.admins.includes(identity.pubkey)) return false

  if (!group.members.includes(pubkey)) {
    // addGroupMember broadcasts member-join to the network and re-registers
    // the relay subscription so the new member's messages are accepted.
    addGroupMember(groupId, pubkey, displayName)
  }

  // Always update the display name (self-join via relay may have arrived
  // before the creator confirms, so the member may already be present
  // but without a friendly name).
  const updated = getState().groups[groupId]
  if (updated && displayName) {
    updateGroup(groupId, { memberNames: { ...updated.memberNames, [pubkey]: displayName } })
  }
  return true
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
          counter: currentGroup.counter + (currentGroup.usageOffset ?? 0),
          context: 'canary:group',
          encoding: toTokenEncoding(currentGroup),
          tolerance: currentGroup.tolerance ?? 1,
        })
        if (!result.valid) {
          throw new Error(result.error ?? 'Invalid join token.')
        }

        if (!addConfirmedMember(currentGroupId, result.pubkey!, result.displayName || nameInput || '')) {
          throw new Error('Member could not be added — they may already be in the group or you are not an admin.')
        }
        showToast(`${result.displayName || 'Member'} has joined the group`, 'success')
      } else if (wordInput) {
        if (!nameInput) throw new Error('Please enter the member name.')

        // Verify word against current group derivation (must match group encoding)
        const effectiveCounter = currentGroup.counter + (currentGroup.usageOffset ?? 0)
        const currentWord = deriveToken(currentGroup.seed, GROUP_CONTEXT, effectiveCounter, toTokenEncoding(currentGroup)).toLowerCase()
        if (wordInput !== currentWord) {
          throw new Error('Word does not match — the member may not have the current group key.')
        }

        // For word-only verification, we don't have the real pubkey.
        // Generate a placeholder that will be reconciled on online sync.
        const bytes = new Uint8Array(32)
        crypto.getRandomValues(bytes)
        const placeholderPubkey = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
        if (!addConfirmedMember(currentGroupId, placeholderPubkey, nameInput)) {
          throw new Error('Member could not be added — you may not be an admin of this group.')
        }
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
