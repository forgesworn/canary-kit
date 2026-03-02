/**
 * demo.js — Wordchain interactive demo page
 *
 * Handles all application logic: state management, localStorage persistence,
 * demo group creation, UI rendering, event handlers, and live countdown tick.
 *
 * NOTE: The esm.sh import below will resolve once wordchain is published to npm.
 * For local dev, Task 4 provides a shim that intercepts this import.
 */

import {
  getCounter,
  DEFAULT_ROTATION_INTERVAL,
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  verifyWord,
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
  addMember,
  removeMember,
} from 'https://esm.sh/wordchain@latest'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEYS = {
  groups: 'wordchain:groups',
  settings: 'wordchain:settings',
  identity: 'wordchain:identity',
}

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
]

// Demo group seed and member pubkeys (test vectors — not real keys)
const DEMO_SEED = '0000000000000000000000000000000000000000000000000000000000000001'
const DEMO_PUBKEY_A = '0000000000000000000000000000000000000000000000000000000000000002'
const DEMO_PUBKEY_B = '0000000000000000000000000000000000000000000000000000000000000003'

// Display names for demo members
const DEMO_MEMBER_NAMES = {
  [DEMO_PUBKEY_A]: 'Alice',
  [DEMO_PUBKEY_B]: 'Bob',
}

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------

let state = {
  groups: {},         // { [id]: GroupState }
  activeGroupId: null,
  identity: null,     // { pubkey, privkey? }
  settings: { relays: [...DEFAULT_RELAYS] },
  isDemo: true,
}

// Track the last rendered hero word so we can re-trigger the animation
let lastRenderedWord = null

// Pending confirm callback
let confirmCallback = null

// ---------------------------------------------------------------------------
// Persistence layer
// ---------------------------------------------------------------------------

function loadState() {
  try {
    const rawGroups = localStorage.getItem(STORAGE_KEYS.groups)
    if (rawGroups) {
      state.groups = JSON.parse(rawGroups)
    }
  } catch {
    state.groups = {}
  }

  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.settings)
    if (rawSettings) {
      state.settings = { relays: [...DEFAULT_RELAYS], ...JSON.parse(rawSettings) }
    }
  } catch {
    state.settings = { relays: [...DEFAULT_RELAYS] }
  }

  try {
    const rawIdentity = localStorage.getItem(STORAGE_KEYS.identity)
    if (rawIdentity) {
      state.identity = JSON.parse(rawIdentity)
    }
  } catch {
    state.identity = null
  }

  // Set active group to the first stored group if none is selected
  if (!state.activeGroupId && Object.keys(state.groups).length > 0) {
    state.activeGroupId = Object.keys(state.groups)[0]
  }

  // Determine if we're in demo-only mode
  state.isDemo = !state.identity
}

function saveGroups() {
  try {
    localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(state.groups))
  } catch {
    // localStorage unavailable or full — silently ignore
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings))
  } catch {
    // ignore
  }
}

function saveIdentity() {
  try {
    if (state.identity) {
      localStorage.setItem(STORAGE_KEYS.identity, JSON.stringify(state.identity))
    } else {
      localStorage.removeItem(STORAGE_KEYS.identity)
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Demo group
// ---------------------------------------------------------------------------

function createDemoGroup() {
  const now = Math.floor(Date.now() / 1000)
  const interval = DEFAULT_ROTATION_INTERVAL
  return {
    name: 'Demo Group',
    seed: DEMO_SEED,
    members: [DEMO_PUBKEY_A, DEMO_PUBKEY_B],
    rotationInterval: interval,
    wordCount: 1,
    wordlist: 'en-v1',
    counter: getCounter(now, interval),
    usageOffset: 0,
    createdAt: now,
  }
}

function ensureDemoGroup() {
  if (Object.keys(state.groups).length === 0) {
    state.groups['demo'] = createDemoGroup()
    state.activeGroupId = 'demo'
    saveGroups()
  }
}

// ---------------------------------------------------------------------------
// Time utilities
// ---------------------------------------------------------------------------

/**
 * Format seconds remaining until rotation into a human-readable string.
 * Uses days+hours if >= 1 hour, otherwise minutes+seconds.
 */
function formatCountdown(seconds) {
  if (seconds <= 0) return 'rotating…'

  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (d > 0 || h > 0) {
    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    return `rotates in ${parts.join(' ')}`
  }
  return `rotates in ${m}m ${s}s`
}

/**
 * Calculate seconds until the next counter increment for the given group.
 */
function getSecondsUntilRotation(group) {
  const nowSec = Math.floor(Date.now() / 1000)
  const interval = group.rotationInterval
  const elapsed = nowSec % interval
  return interval - elapsed
}

/**
 * Return a 0–1 fraction representing elapsed time within the current rotation window.
 */
function getCountdownProgress(group) {
  const nowSec = Math.floor(Date.now() / 1000)
  const interval = group.rotationInterval
  const elapsed = nowSec % interval
  return elapsed / interval
}

// ---------------------------------------------------------------------------
// Member display helpers
// ---------------------------------------------------------------------------

function getMemberName(pubkey, isDemo) {
  if (isDemo && DEMO_MEMBER_NAMES[pubkey]) {
    return DEMO_MEMBER_NAMES[pubkey]
  }
  // Shorten pubkey to first 8 chars for display
  return pubkey.slice(0, 8) + '…'
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderGroupList() {
  const list = document.getElementById('group-list')
  list.innerHTML = ''

  const ids = Object.keys(state.groups)
  if (ids.length === 0) {
    list.innerHTML = '<p class="group-empty">No groups yet.</p>'
    return
  }

  for (const id of ids) {
    const group = state.groups[id]
    const isActive = id === state.activeGroupId
    const isDemo = id === 'demo'

    const item = document.createElement('button')
    item.className = 'group-item' + (isActive ? ' group-item--active' : '')
    item.dataset.groupId = id

    const nameSpan = document.createElement('span')
    nameSpan.className = 'group-item__name'
    nameSpan.textContent = group.name
    item.appendChild(nameSpan)

    if (isDemo) {
      const badge = document.createElement('span')
      badge.className = 'group-item__badge'
      badge.textContent = 'demo'
      item.appendChild(badge)
    }

    item.addEventListener('click', () => {
      state.activeGroupId = id
      renderGroupList()
      renderHero()
      renderMembers()
      renderSettings()
    })

    list.appendChild(item)
  }
}

function renderHero() {
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const counter = group.counter + group.usageOffset
  let word
  if (group.wordCount === 1) {
    word = deriveVerificationWord(group.seed, counter)
  } else {
    word = deriveVerificationPhrase(group.seed, counter, group.wordCount).join(' ')
  }

  const heroWordEl = document.getElementById('hero-word')
  if (word !== lastRenderedWord) {
    heroWordEl.classList.remove('word-appear')
    // Force reflow to restart the animation
    void heroWordEl.offsetWidth
    heroWordEl.classList.add('word-appear')
    lastRenderedWord = word
  }
  heroWordEl.textContent = word

  // Countdown bar
  const progress = getCountdownProgress(group)
  const fill = document.getElementById('countdown-fill')
  fill.style.width = (progress * 100) + '%'

  const secondsLeft = getSecondsUntilRotation(group)
  const label = document.getElementById('countdown-label')
  label.textContent = formatCountdown(secondsLeft)
}

function renderMembers() {
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const isDemoGroup = state.activeGroupId === 'demo'
  const list = document.getElementById('members-list')
  list.innerHTML = ''

  for (const pubkey of group.members) {
    const counter = group.counter + group.usageOffset
    const duressWord = deriveDuressWord(group.seed, pubkey, counter)
    const name = getMemberName(pubkey, isDemoGroup)

    const li = document.createElement('li')
    li.className = 'member-item'
    li.dataset.pubkey = pubkey

    const info = document.createElement('div')
    info.className = 'member-info'

    const nameEl = document.createElement('span')
    nameEl.className = 'member-name'
    nameEl.textContent = name

    const keyEl = document.createElement('span')
    keyEl.className = 'member-key'
    keyEl.textContent = pubkey.slice(0, 8) + '…' + pubkey.slice(-4)

    info.appendChild(nameEl)
    info.appendChild(keyEl)

    const actions = document.createElement('div')
    actions.className = 'member-actions'

    // Duress toggle button
    const duressBtn = document.createElement('button')
    duressBtn.className = 'member-duress-btn'
    duressBtn.textContent = 'Duress'
    duressBtn.title = 'Show duress word for this member'

    const duressDetail = document.createElement('div')
    duressDetail.className = 'member-duress-detail'
    duressDetail.hidden = true
    duressDetail.textContent = duressWord

    duressBtn.addEventListener('click', () => {
      const isHidden = duressDetail.hidden
      duressDetail.hidden = !isHidden
      duressBtn.classList.toggle('member-duress-btn--active', isHidden)
    })

    actions.appendChild(duressBtn)

    // Remove button — hidden for demo group
    if (!isDemoGroup) {
      const removeBtn = document.createElement('button')
      removeBtn.className = 'member-remove-btn'
      removeBtn.textContent = 'Remove'
      removeBtn.addEventListener('click', () => handleRemoveMember(pubkey))
      actions.appendChild(removeBtn)
    }

    li.appendChild(info)
    li.appendChild(actions)
    li.appendChild(duressDetail)
    list.appendChild(li)
  }

  // Invite controls — hidden for demo group
  const inviteSection = document.getElementById('members-invite')
  inviteSection.hidden = isDemoGroup
}

function renderSettings() {
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const isDemoGroup = state.activeGroupId === 'demo'

  // Group name
  const nameInput = document.getElementById('setting-name')
  nameInput.value = group.name
  nameInput.disabled = isDemoGroup

  // Rotation interval — mark active seg-btn
  const rotationBtns = document.querySelectorAll('#setting-rotation .seg-btn')
  for (const btn of rotationBtns) {
    const val = parseInt(btn.dataset.value, 10)
    btn.classList.toggle('seg-btn--active', val === group.rotationInterval)
    btn.disabled = isDemoGroup
  }

  // Word count — mark active seg-btn
  const wordCountBtns = document.querySelectorAll('#setting-wordcount .seg-btn')
  for (const btn of wordCountBtns) {
    const val = parseInt(btn.dataset.value, 10)
    btn.classList.toggle('seg-btn--active', val === group.wordCount)
    btn.disabled = isDemoGroup
  }

  // Relay list
  renderRelayList()

  // Danger buttons — hide for demo group
  const reseedBtn = document.getElementById('reseed-btn')
  const dissolveBtn = document.getElementById('dissolve-btn')
  reseedBtn.hidden = isDemoGroup
  dissolveBtn.hidden = isDemoGroup
}

function renderRelayList() {
  const list = document.getElementById('setting-relays')
  list.innerHTML = ''

  for (const relay of state.settings.relays) {
    const li = document.createElement('li')
    li.className = 'relay-item'
    li.dataset.relay = relay

    const urlSpan = document.createElement('span')
    urlSpan.className = 'relay-url'
    urlSpan.textContent = relay

    const removeBtn = document.createElement('button')
    removeBtn.className = 'relay-remove-btn'
    removeBtn.textContent = 'Remove'
    removeBtn.dataset.relay = relay

    li.appendChild(urlSpan)
    li.appendChild(removeBtn)
    list.appendChild(li)
  }
}

function renderIdentityBadge() {
  const badge = document.getElementById('identity-badge')
  if (!state.identity) {
    badge.innerHTML = ''
    badge.hidden = true
    return
  }
  badge.hidden = false
  const short = state.identity.pubkey.slice(0, 8) + '…' + state.identity.pubkey.slice(-4)
  badge.textContent = short
}

function renderAuthButton() {
  const btn = document.getElementById('auth-btn')
  if (state.identity) {
    btn.textContent = 'Sign Out'
  } else {
    btn.textContent = 'Sign In'
  }
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function handleVerify(e) {
  e.preventDefault()
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const input = document.getElementById('verify-input')
  const spokenWord = input.value.trim()
  if (!spokenWord) return

  const counter = group.counter + group.usageOffset
  const result = verifyWord(spokenWord, group.seed, group.members, counter)

  const resultEl = document.getElementById('verify-result')
  const iconEl = document.getElementById('verify-icon')
  const textEl = document.getElementById('verify-text')

  // Remove all status classes
  resultEl.className = 'verify-result'
  resultEl.hidden = false

  switch (result.status) {
    case 'verified':
      resultEl.classList.add('verify-result--verified')
      iconEl.textContent = '✓'
      textEl.textContent = 'Verified — word is correct.'
      break
    case 'duress':
      resultEl.classList.add('verify-result--duress')
      iconEl.textContent = '⚠'
      const memberName = result.member
        ? getMemberName(result.member, state.activeGroupId === 'demo')
        : 'someone'
      textEl.textContent = `Duress — ${memberName} may be under coercion.`
      break
    case 'stale':
      resultEl.classList.add('verify-result--stale')
      iconEl.textContent = '◷'
      textEl.textContent = 'Stale — word is from the previous rotation window.'
      break
    case 'failed':
    default:
      resultEl.classList.add('verify-result--failed')
      iconEl.textContent = '✗'
      textEl.textContent = 'Failed — word does not match.'
      break
  }

  input.value = ''
}

// ---------------------------------------------------------------------------
// Duress long-press
// ---------------------------------------------------------------------------

function setupDuressLongPress() {
  const trigger = document.getElementById('duress-trigger')
  const reveal = document.getElementById('duress-reveal')
  const duressWordEl = document.getElementById('duress-word')

  let pressTimer = null

  function startPress() {
    trigger.classList.add('duress-trigger--holding')
    pressTimer = setTimeout(() => {
      fireDuress()
    }, 800)
  }

  function cancelPress() {
    trigger.classList.remove('duress-trigger--holding')
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
  }

  function fireDuress() {
    const group = state.groups[state.activeGroupId]
    if (!group || group.members.length === 0) return

    let duressWord
    if (state.identity) {
      // Authenticated: show the user's own duress word
      const userPubkey = state.identity.pubkey
      const counter = group.counter + group.usageOffset
      duressWord = deriveDuressWord(group.seed, userPubkey, counter)
    } else {
      // Demo mode: show the first member's (Alice's) duress word
      const counter = group.counter + group.usageOffset
      duressWord = deriveDuressWord(group.seed, group.members[0], counter)
    }

    duressWordEl.textContent = duressWord
    reveal.hidden = false
    trigger.classList.remove('duress-trigger--holding')
  }

  trigger.addEventListener('mousedown', startPress)
  trigger.addEventListener('touchstart', startPress, { passive: true })
  trigger.addEventListener('mouseup', cancelPress)
  trigger.addEventListener('mouseleave', cancelPress)
  trigger.addEventListener('touchend', cancelPress)
  trigger.addEventListener('touchcancel', cancelPress)

  // Clicking (short press) hides the reveal if visible
  trigger.addEventListener('click', () => {
    if (!reveal.hidden) {
      reveal.hidden = true
      duressWordEl.textContent = ''
    }
  })
}

// ---------------------------------------------------------------------------
// Confirm modal
// ---------------------------------------------------------------------------

function showConfirm(title, message, onConfirm) {
  document.getElementById('confirm-title').textContent = title
  document.getElementById('confirm-message').textContent = message
  confirmCallback = onConfirm
  document.getElementById('confirm-modal').showModal()
}

function setupConfirmModal() {
  const modal = document.getElementById('confirm-modal')
  const okBtn = document.getElementById('confirm-ok')
  const cancelBtn = document.getElementById('confirm-cancel')

  okBtn.addEventListener('click', () => {
    modal.close()
    if (typeof confirmCallback === 'function') {
      confirmCallback()
      confirmCallback = null
    }
  })

  cancelBtn.addEventListener('click', () => {
    modal.close()
    confirmCallback = null
  })
}

// ---------------------------------------------------------------------------
// Create group modal
// ---------------------------------------------------------------------------

function handleCreateGroup(e) {
  e.preventDefault()

  const name = document.getElementById('new-group-name').value.trim()
  const rotationInterval = parseInt(
    document.getElementById('new-group-rotation').value,
    10,
  )

  if (!name) return

  const newGroup = createGroup({
    name,
    members: state.identity ? [state.identity.pubkey] : [],
    rotationInterval,
    wordCount: 1,
  })

  const id = crypto.randomUUID()
  state.groups[id] = newGroup
  state.activeGroupId = id
  saveGroups()

  // Reset form
  document.getElementById('new-group-name').value = ''
  document.getElementById('new-group-rotation').value = '604800'

  document.getElementById('create-modal').close()

  renderGroupList()
  renderHero()
  renderMembers()
  renderSettings()
}

function setupCreateModal() {
  const modal = document.getElementById('create-modal')
  const openBtn = document.getElementById('create-group-btn')
  const cancelBtn = document.getElementById('create-cancel')
  const form = document.getElementById('create-form')

  openBtn.addEventListener('click', () => {
    modal.showModal()
  })

  cancelBtn.addEventListener('click', () => {
    modal.close()
  })

  // The form uses method="dialog" so submit closes it automatically,
  // but we intercept to save the group first.
  form.addEventListener('submit', handleCreateGroup)
}

// ---------------------------------------------------------------------------
// Member management
// ---------------------------------------------------------------------------

function handleRemoveMember(pubkey) {
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const name = getMemberName(pubkey, state.activeGroupId === 'demo')
  showConfirm(
    'Remove Member',
    `Remove ${name} from "${group.name}"? The group will be reseeded immediately.`,
    () => {
      state.groups[state.activeGroupId] = removeMember(group, pubkey)
      saveGroups()
      renderHero()
      renderMembers()
      renderSettings()
    },
  )
}

function setupInvite() {
  const inviteBtn = document.getElementById('invite-btn')
  const inviteInput = document.getElementById('invite-input')

  inviteBtn.addEventListener('click', () => {
    const raw = inviteInput.value.trim()
    if (!raw) return

    // Accept only 64-character lowercase hex pubkeys for now
    const pubkey = raw.toLowerCase().replace(/^npub1/, '') // minimal npub strip
    if (!/^[0-9a-f]{64}$/.test(pubkey)) {
      alert('Please enter a valid 64-character hex pubkey.')
      return
    }

    const group = state.groups[state.activeGroupId]
    if (!group) return

    state.groups[state.activeGroupId] = addMember(group, pubkey)
    saveGroups()
    inviteInput.value = ''
    renderMembers()
  })
}

// ---------------------------------------------------------------------------
// Settings panel
// ---------------------------------------------------------------------------

function setupSettings() {
  // Group name change
  const nameInput = document.getElementById('setting-name')
  nameInput.addEventListener('change', () => {
    const group = state.groups[state.activeGroupId]
    if (!group || state.activeGroupId === 'demo') return
    state.groups[state.activeGroupId] = { ...group, name: nameInput.value.trim() }
    saveGroups()
    renderGroupList()
  })

  // Rotation interval buttons
  const rotationGroup = document.getElementById('setting-rotation')
  rotationGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.seg-btn')
    if (!btn) return
    const group = state.groups[state.activeGroupId]
    if (!group || state.activeGroupId === 'demo') return

    const interval = parseInt(btn.dataset.value, 10)
    const now = Math.floor(Date.now() / 1000)
    state.groups[state.activeGroupId] = {
      ...group,
      rotationInterval: interval,
      counter: getCounter(now, interval),
    }
    saveGroups()
    renderSettings()
    renderHero()
  })

  // Word count buttons
  const wordCountGroup = document.getElementById('setting-wordcount')
  wordCountGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.seg-btn')
    if (!btn) return
    const group = state.groups[state.activeGroupId]
    if (!group || state.activeGroupId === 'demo') return

    const wordCount = parseInt(btn.dataset.value, 10)
    state.groups[state.activeGroupId] = { ...group, wordCount }
    saveGroups()
    renderSettings()
    renderHero()
  })

  // Relay list — delegated remove
  const relayList = document.getElementById('setting-relays')
  relayList.addEventListener('click', (e) => {
    const btn = e.target.closest('.relay-remove-btn')
    if (!btn) return
    const relay = btn.dataset.relay
    state.settings.relays = state.settings.relays.filter((r) => r !== relay)
    saveSettings()
    renderRelayList()
  })

  // Add relay
  const addBtn = document.getElementById('relay-add-btn')
  const addInput = document.getElementById('relay-add-input')
  addBtn.addEventListener('click', () => {
    const url = addInput.value.trim()
    if (!url || !url.startsWith('wss://')) {
      alert('Please enter a valid wss:// relay URL.')
      return
    }
    if (!state.settings.relays.includes(url)) {
      state.settings.relays.push(url)
      saveSettings()
      renderRelayList()
    }
    addInput.value = ''
  })

  // Reseed
  const reseedBtn = document.getElementById('reseed-btn')
  reseedBtn.addEventListener('click', () => {
    const group = state.groups[state.activeGroupId]
    if (!group) return
    showConfirm(
      'Reseed Group',
      `Generate a new seed for "${group.name}"? All members will need to re-sync.`,
      () => {
        state.groups[state.activeGroupId] = reseed(group)
        saveGroups()
        renderHero()
        renderMembers()
      },
    )
  })

  // Dissolve
  const dissolveBtn = document.getElementById('dissolve-btn')
  dissolveBtn.addEventListener('click', () => {
    const group = state.groups[state.activeGroupId]
    if (!group) return
    showConfirm(
      'Dissolve Group',
      `Permanently dissolve "${group.name}"? This cannot be undone.`,
      () => {
        delete state.groups[state.activeGroupId]
        const remaining = Object.keys(state.groups)
        state.activeGroupId = remaining.length > 0 ? remaining[0] : null
        saveGroups()
        renderGroupList()
        renderHero()
        renderMembers()
        renderSettings()
      },
    )
  })
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function setupAuth() {
  const btn = document.getElementById('auth-btn')

  btn.addEventListener('click', async () => {
    if (state.identity) {
      // Sign out
      state.identity = null
      state.isDemo = true
      saveIdentity()
      renderIdentityBadge()
      renderAuthButton()
      return
    }

    // Try NIP-07 extension first
    if (window.nostr) {
      try {
        const pubkey = await window.nostr.getPublicKey()
        state.identity = { pubkey }
        state.isDemo = false
        saveIdentity()
        renderIdentityBadge()
        renderAuthButton()
        return
      } catch {
        // User rejected or extension failed — fall through to ephemeral
      }
    }

    // Fallback: generate an ephemeral keypair using Web Crypto
    try {
      const privkeyBytes = crypto.getRandomValues(new Uint8Array(32))
      const privkey = Array.from(privkeyBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      // Derive a simple "pubkey" by hashing the private key with SHA-256
      const hashBuf = await crypto.subtle.digest(
        'SHA-256',
        privkeyBytes,
      )
      const pubkey = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      state.identity = { pubkey, privkey }
      state.isDemo = false
      saveIdentity()
      renderIdentityBadge()
      renderAuthButton()
    } catch {
      alert('Could not generate an ephemeral identity. Your browser may not support Web Crypto.')
    }
  })
}

// ---------------------------------------------------------------------------
// Live tick
// ---------------------------------------------------------------------------

function startTick() {
  setInterval(() => {
    // Update the counter for each group if a rotation has occurred
    const now = Math.floor(Date.now() / 1000)
    let changed = false
    for (const id of Object.keys(state.groups)) {
      const group = state.groups[id]
      const currentCounter = getCounter(now, group.rotationInterval)
      if (currentCounter !== group.counter) {
        state.groups[id] = { ...group, counter: currentCounter }
        changed = true
      }
    }
    if (changed) {
      saveGroups()
      // Reset the last word so animation re-triggers
      lastRenderedWord = null
    }
    renderHero()
  }, 1000)
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

function init() {
  loadState()
  ensureDemoGroup()
  renderGroupList()
  renderHero()
  renderMembers()
  renderSettings()
  renderIdentityBadge()
  renderAuthButton()

  // Event bindings
  document.getElementById('verify-form').addEventListener('submit', handleVerify)
  setupDuressLongPress()
  setupCreateModal()
  setupConfirmModal()
  setupSettings()
  setupInvite()
  setupAuth()
  startTick()
}

init()
