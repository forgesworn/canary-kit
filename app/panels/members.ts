// app/panels/members.ts — Members panel: list members and generate invites

import { getState, updateGroup } from '../state.js'
import { addGroupMember, removeGroupMember } from '../actions/groups.js'
import {
  verifyJoinToken,
  startRemoteInviteSession, createRemoteWelcomeEnvelope, endRemoteInviteSession,
  endInviteSession,
} from '../invite.js'
import { groupMode } from '../types.js'
import { generateQR } from '../components/qr.js'
import { escapeHtml } from '../utils/escape.js'
import { showModal } from '../components/modal.js'
import { showToast } from '../components/toast.js'
import { listenForJoinRequests, sendWelcomeOverRelay } from '../nostr/invite-relay.js'
import { ensureTransport } from '../sync.js'
import { deriveToken } from 'canary-kit/token'
import { GROUP_CONTEXT, toTokenEncoding } from '../utils/encoding.js'
import { fetchProfiles, getCachedName, getCachedProfile } from '../nostr/profiles.js'
import { DEMO_ACCOUNTS } from '../demo-accounts.js'

/** Quick lookup: pubkey → demo account name (compile-time, no relay needed). */
const _demoNameByPubkey = new Map(DEMO_ACCOUNTS.map(a => [a.pubkey, a.name]))

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
 * Format a pubkey for display: profile name (you) for self, memberNames, or truncated pubkey.
 */
function formatPubkey(pubkey: string, _members: string[], groupId?: string): string {
  const { identity, groups } = getState()
  const isSelf = identity?.pubkey === pubkey

  // Try all name sources in priority order
  let name: string | undefined
  if (groupId) {
    const group = groups[groupId]
    const mn = group?.memberNames?.[pubkey]
    if (mn && mn !== 'You') name = mn
  }
  if (!name) name = _demoNameByPubkey.get(pubkey)
  if (!name) name = getCachedName(pubkey)

  if (isSelf) return name ? `${name} (you)` : 'You'
  if (name) return name
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
}

export function showInviteModal(group: import('../types.js').AppGroup, options?: InviteModalOptions): void {
  const title = options?.title ?? 'Invite to Group'
  const scanHint = options?.scanHint ?? 'Scan with your phone camera to join'
  const showConfirmMemberNote = options?.showConfirmMemberNote ?? true

  const isOnline = groupMode(group) === 'online'

  let dialog = document.getElementById('invite-modal') as HTMLDialogElement | null
  if (!dialog) {
    dialog = document.createElement('dialog')
    dialog.id = 'invite-modal'
    dialog.className = 'modal'
    document.body.appendChild(dialog)
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) { endRemoteInviteSession(); dialog!.close() }
    })
  }

  // ── Inner renderers ──────────────────────────────────────
  const d = dialog // stable reference for closures

  function renderChooser(): void {
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">${escapeHtml(title)}</h2>
        <p class="invite-hint">How are you sharing this?</p>

        <div class="invite-share__actions" style="flex-direction: column; gap: 0.75rem;">
          <button class="btn btn--primary" id="invite-qr-path" type="button">Scan QR &mdash; they're with me</button>
          <button class="btn btn--primary" id="invite-link-path" type="button">Secure Channel &mdash; Signal, WhatsApp, etc.</button>
        </div>

        <div class="modal__actions">
          <button class="btn" id="invite-close-btn" type="button">Cancel</button>
        </div>
      </div>
    `
    d.querySelector<HTMLButtonElement>('#invite-qr-path')?.addEventListener('click', renderQRPath)
    d.querySelector<HTMLButtonElement>('#invite-link-path')?.addEventListener('click', renderRemotePath)
    d.querySelector<HTMLButtonElement>('#invite-close-btn')?.addEventListener('click', () => { endRemoteInviteSession(); d.close() })
  }

  // ── Shared key-exchange steps (used by both QR and Secure Channel paths) ──

  function renderStep2(backFn: () => void): void {
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">Step 2 of 3: Paste Join Code</h2>
        <p class="invite-hint">Ask them to open the invite and send you their join code.</p>
        <input class="input" id="remote-joincode-input" type="text" placeholder="Paste their join code here..." autocomplete="off" style="font-family: monospace; font-size: 0.85rem;">
        <p class="invite-hint" id="remote-joincode-error" style="color: var(--duress); display: none;"></p>
        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="remote-back-2" type="button">Back</button>
          <button class="btn btn--primary" id="remote-next-2" type="button">Generate Welcome</button>
        </div>
      </div>
    `
    d.querySelector<HTMLButtonElement>('#remote-back-2')?.addEventListener('click', backFn)
    d.querySelector<HTMLButtonElement>('#remote-next-2')?.addEventListener('click', () => {
      const input = d.querySelector<HTMLInputElement>('#remote-joincode-input')
      const errorEl = d.querySelector<HTMLElement>('#remote-joincode-error')
      const joinerPubkey = input?.value.trim() ?? ''

      if (!/^[0-9a-f]{64}$/.test(joinerPubkey)) {
        if (errorEl) {
          errorEl.textContent = 'Invalid join code — must be a 64-character hex public key.'
          errorEl.style.display = ''
        }
        return
      }

      try {
        const currentGroup = getState().groups[group.id]
        if (!currentGroup) throw new Error('Group not found.')
        const envelope = createRemoteWelcomeEnvelope(currentGroup, joinerPubkey)
        renderStep3(envelope, joinerPubkey)
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err instanceof Error ? err.message : 'Failed to create welcome envelope.'
          errorEl.style.display = ''
        }
      }
    })
  }

  function renderStep3(envelope: string, joinerPubkey: string): void {
    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">Step 3 of 3: Send Welcome</h2>
        <p class="invite-hint">Copy this encrypted message and send it back to them.</p>
        <p class="invite-hint" style="color: var(--success); font-weight: 500;">This is encrypted — only they can read it.</p>
        <div class="invite-share__actions" style="flex-direction: column; gap: 0.5rem;">
          <button class="btn btn--primary" id="remote-copy-welcome" type="button">Copy Welcome Message</button>
        </div>
        <label class="input-label" style="margin-top: 0.5rem;">Member name (optional)
          <input class="input" id="remote-joiner-name" type="text" placeholder="e.g. Alice" autocomplete="off">
        </label>
        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn btn--primary" id="remote-done" type="button">Done</button>
        </div>
      </div>
    `
    d.querySelector<HTMLButtonElement>('#remote-copy-welcome')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      try {
        await navigator.clipboard.writeText(envelope)
        btn.textContent = 'Copied!'
        btn.classList.add('btn--copied')
        setTimeout(() => { btn.textContent = 'Copy Welcome Message'; btn.classList.remove('btn--copied') }, 2000)
      } catch { /* clipboard may be blocked */ }
    })
    d.querySelector<HTMLButtonElement>('#remote-done')?.addEventListener('click', () => {
      // Add the joiner to the group now that the welcome has been generated
      try {
        const currentGroup = getState().groups[group.id]
        if (currentGroup && !currentGroup.members.includes(joinerPubkey)) {
          const displayName = d.querySelector<HTMLInputElement>('#remote-joiner-name')?.value.trim() ?? ''
          addGroupMember(group.id, joinerPubkey, displayName)
          showToast(displayName ? `${displayName} added to group` : 'Member added to group', 'success')
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to add member', 'error')
      }
      endRemoteInviteSession()
      endInviteSession()
      d.close()
    })
  }

  // ── QR path ──────────────────────────────────────────────────

  function renderQRPath(): void {
    const qrSession = startRemoteInviteSession(group)
    const base = window.location.href.split('#')[0]
    const qrUrl = `${base}#remote/${qrSession.tokenPayload}`
    const svgMarkup = generateQR(qrUrl)
    const relays = group.relays?.length ? group.relays : getState().settings.defaultRelays

    d.innerHTML = `
      <div class="modal__form invite-share">
        <h2 class="modal__title">${escapeHtml(title)}</h2>

        <div class="qr-container">${svgMarkup}</div>
        <p class="invite-hint">${escapeHtml(scanHint)}</p>
        <p class="invite-hint" style="color: var(--duress); font-weight: 500;">Seedless — group secret is sent encrypted after scan.</p>
        <p class="invite-hint" id="qr-relay-status" style="color: var(--text-muted);">${relays.length > 0 ? 'Waiting for them to scan...' : ''}</p>

        <div class="modal__actions" style="gap: 0.5rem;">
          <button class="btn" id="invite-back-btn" type="button">Back</button>
          <button class="btn btn--primary" id="invite-next-btn" type="button">Next (manual)</button>
        </div>
      </div>
    `

    // Auto-listen for join requests over the relay
    let cleanupListener = () => {}
    if (relays.length > 0) {
      // Ensure pool is connected before subscribing — don't assume bootSync pool still exists
      void ensureTransport(relays).then(() => {
        cleanupListener = listenForJoinRequests({
          inviteId: qrSession.inviteId,
          relays,
          onJoinRequest(joinerPubkey) {
            cleanupListener()
            try {
              const currentGroup = getState().groups[group.id]
              if (!currentGroup) return
              const envelope = createRemoteWelcomeEnvelope(currentGroup, joinerPubkey)

              // Send welcome back over relay
              sendWelcomeOverRelay({
                inviteId: qrSession.inviteId,
                joinerPubkey,
                envelope,
                relays,
              })

              // Add member to group
              if (!currentGroup.members.includes(joinerPubkey)) {
                addGroupMember(group.id, joinerPubkey)
              }

              endRemoteInviteSession()
              endInviteSession()
              d.close()
              showToast('Member joined via relay', 'success')
            } catch (err) {
              showToast(err instanceof Error ? err.message : 'Failed to send welcome', 'error')
            }
          },
          onError(msg) {
            const statusEl = d.querySelector('#qr-relay-status')
            if (statusEl) statusEl.textContent = msg || 'No relay response — use manual flow below.'
          },
        })
      })
    }

    d.querySelector<HTMLButtonElement>('#invite-back-btn')?.addEventListener('click', () => { cleanupListener(); endRemoteInviteSession(); renderChooser() })
    d.querySelector<HTMLButtonElement>('#invite-next-btn')?.addEventListener('click', () => { cleanupListener(); renderStep2(renderQRPath) })
  }

  // ── Secure Channel path ──────────────────────────────────────

  function renderRemotePath(): void {
    const remoteSession = startRemoteInviteSession(group)
    const base = window.location.href.split('#')[0]
    const remoteUrl = `${base}#remote/${remoteSession.tokenPayload}`

    function renderStep1(): void {
      d.innerHTML = `
        <div class="modal__form invite-share">
          <h2 class="modal__title">Step 1 of 3: Send Invite</h2>
          <p class="invite-hint">Copy this and send it via Signal, WhatsApp, or any secure channel.</p>
          <p class="invite-hint" style="color: var(--duress); font-weight: 500;">This invite does NOT contain the group secret — it's safe to send.</p>
          <div class="invite-share__actions" style="flex-direction: column; gap: 0.5rem;">
            <button class="btn btn--primary" id="remote-copy-token" type="button">Copy Invite</button>
          </div>
          <div class="modal__actions" style="gap: 0.5rem;">
            <button class="btn" id="remote-back-btn" type="button">Back</button>
            <button class="btn btn--primary" id="remote-next-1" type="button">Next</button>
          </div>
        </div>
      `
      d.querySelector<HTMLButtonElement>('#remote-copy-token')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement
        try {
          await navigator.clipboard.writeText(remoteUrl)
          btn.textContent = 'Copied!'
          btn.classList.add('btn--copied')
          setTimeout(() => { btn.textContent = 'Copy Invite'; btn.classList.remove('btn--copied') }, 2000)
        } catch { /* clipboard may be blocked */ }
      })
      d.querySelector<HTMLButtonElement>('#remote-back-btn')?.addEventListener('click', () => { endRemoteInviteSession(); renderChooser() })
      d.querySelector<HTMLButtonElement>('#remote-next-1')?.addEventListener('click', () => renderStep2(renderStep1))
    }

    renderStep1()
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
  })
}

// ── Member detail modal ───────────────────────────────────────

function showMemberDetail(pubkey: string, groupId: string): void {
  const { identity, groups } = getState()
  const group = groups[groupId]
  const isYou = identity?.pubkey === pubkey
  const isAdminUser = group?.admins.includes(pubkey) ?? false
  const displayName = formatPubkey(pubkey, group?.members ?? [], groupId)
  const profile = getCachedProfile(pubkey)
  const demoName = _demoNameByPubkey.get(pubkey)
  const memberName = group?.memberNames?.[pubkey]

  const lastCheckin = group?.livenessCheckins?.[pubkey]
  let livenessLabel = 'Never checked in'
  if (lastCheckin) {
    const elapsed = Math.floor(Date.now() / 1000) - lastCheckin
    if (elapsed < 60) livenessLabel = 'Active now'
    else if (elapsed < 3600) livenessLabel = `${Math.floor(elapsed / 60)}m ago`
    else livenessLabel = `${Math.floor(elapsed / 3600)}h ago`
  }

  const badges = [
    isYou ? '<span class="member-detail__badge">You</span>' : '',
    isAdminUser ? '<span class="member-detail__badge member-detail__badge--admin">Admin</span>' : '',
  ].filter(Boolean).join(' ')

  const profileName = profile?.display_name || profile?.name

  // Build detail rows
  const row = (label: string, value: string) =>
    `<div class="member-detail__row"><span class="member-detail__label">${label}</span><span class="member-detail__value">${escapeHtml(value)}</span></div>`

  const rows: string[] = [
    row('Pubkey', `${pubkey.slice(0, 16)}…${pubkey.slice(-8)}`),
  ]

  if (profileName) rows.push(row('Nostr name', profileName))
  if (profile?.nip05) rows.push(row('NIP-05', profile.nip05))
  if (profile?.about) rows.push(row('About', profile.about.length > 80 ? profile.about.slice(0, 80) + '…' : profile.about))
  if (profile?.lud16) rows.push(row('Lightning', profile.lud16))
  if (profile?.website) rows.push(row('Website', profile.website))
  if (memberName && memberName !== 'You' && memberName !== profileName) rows.push(row('Display name', memberName))
  if (demoName) rows.push(row('Demo account', demoName))
  rows.push(row('Liveness', livenessLabel))

  if (!profile && !demoName) {
    rows.push(`<div class="member-detail__row"><span class="member-detail__label" style="color: var(--text-muted); font-style: italic;">No Nostr profile found on relay</span></div>`)
  }

  const avatarHtml = profile?.picture
    ? `<img class="member-detail__avatar" src="${escapeHtml(profile.picture)}" alt="" />`
    : ''

  showModal(`
    <div class="member-detail__header">
      ${avatarHtml}
      <div>
        <h2 class="modal__title" style="margin:0;">${escapeHtml(displayName)} ${badges}</h2>
      </div>
    </div>
    <div class="member-detail__rows">${rows.join('')}</div>
    <div class="modal__actions">
      <button class="btn btn--sm" id="member-detail-copy" type="button">Copy Pubkey</button>
      <button class="btn" id="modal-cancel-btn" type="button">Close</button>
    </div>
  `, () => { /* no-op submit */ })

  requestAnimationFrame(() => {
    document.getElementById('member-detail-copy')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pubkey)
        const btn = document.getElementById('member-detail-copy') as HTMLButtonElement
        btn.textContent = 'Copied!'
        setTimeout(() => { btn.textContent = 'Copy Pubkey' }, 1500)
      } catch { /* clipboard blocked */ }
    })
    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
      (document.getElementById('app-modal') as HTMLDialogElement)?.close()
    })
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
              const profile = getCachedProfile(pubkey)
              const avatarHtml = profile?.picture
                ? `<img src="${escapeHtml(profile.picture)}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${dotColour};box-shadow:0 0 6px ${dotColour}80;" />`
                : `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${dotColour};flex-shrink:0;box-shadow:0 0 6px ${dotColour}80;"></span>`
              return `
          <li class="member-item" data-pubkey="${escapeHtml(pubkey)}">
            ${avatarHtml}
            <button class="member-item__name-btn" data-pubkey="${escapeHtml(pubkey)}" type="button">${escapeHtml(formatPubkey(pubkey, group.members, activeGroupId))}</button>
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
    </section>
  `

  // ── Member detail popover ────────────────────────────────

  container.querySelectorAll<HTMLButtonElement>('.member-item__name-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pubkey = btn.dataset.pubkey
      if (!pubkey) return
      showMemberDetail(pubkey, activeGroupId)
    })
  })

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
