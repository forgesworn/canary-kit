/**
 * demo.js — Canary interactive demo page
 *
 * Handles all application logic: state management, localStorage persistence,
 * demo group creation, UI rendering, event handlers, and live countdown tick.
 *
 * NOTE: The esm.sh import below will resolve once canary-kit is published to npm.
 * For local dev, the import map in index.html redirects this URL to ../dist/index.js.
 */

import {
  getCounter,
  DEFAULT_ROTATION_INTERVAL,
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  verifyWord,
  createGroup,
  reseed,
  addMember,
  removeMember,
} from 'https://esm.sh/canary-kit@latest'

// ---------------------------------------------------------------------------
// Theme management — must run before first render to prevent flash
// ---------------------------------------------------------------------------

const THEME_STORAGE_KEY = 'canary:theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle')
  if (!btn) return
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    const next = current === 'light' ? 'dark' : 'light'
    applyTheme(next)
    try { localStorage.setItem(THEME_STORAGE_KEY, next) } catch {}
  })
}

// Apply theme immediately (before first render) to prevent flash
applyTheme(getInitialTheme())

// ---------------------------------------------------------------------------
// Nostr tools — loaded dynamically so offline mode still works
// ---------------------------------------------------------------------------

let nostrTools = null
let pool = null

async function loadNostrTools() {
  try {
    const mod = await import('https://esm.sh/nostr-tools@latest')
    nostrTools = mod
    // SimplePool is in the main export
    pool = new mod.SimplePool()
    updateRelayStatus('connected')
    return true
  } catch (err) {
    console.warn('nostr-tools not available — offline mode:', err.message)
    updateRelayStatus('disconnected')
    return false
  }
}

function updateRelayStatus(status) {
  const dot = document.getElementById('relay-dot')
  const label = document.getElementById('relay-label')
  dot.className = 'relay-dot'
  switch (status) {
    case 'connected':
      dot.classList.add('relay-dot--connected')
      label.textContent = `${state.settings.relays.length} relays`
      break
    case 'partial':
      dot.classList.add('relay-dot--connecting')
      label.textContent = 'connecting'
      break
    default:
      dot.classList.add('relay-dot--error')
      label.textContent = 'offline'
  }
}

// ---------------------------------------------------------------------------
// Nostr event publishing
// ---------------------------------------------------------------------------

async function publishEvent(event) {
  if (!pool || !nostrTools) return null

  let signed
  if (window.nostr) {
    signed = await window.nostr.signEvent(event)
  } else if (state.identity?.privkey) {
    const skBytes = new Uint8Array(
      state.identity.privkey.match(/.{2}/g).map(b => parseInt(b, 16))
    )
    signed = nostrTools.finalizeEvent(event, skBytes)
  } else {
    return null
  }

  try {
    await Promise.allSettled(
      pool.publish(state.settings.relays, signed)
    )
    return signed
  } catch (err) {
    console.error('Publish failed:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Invitation subscription
// ---------------------------------------------------------------------------

function subscribeToInvitations() {
  if (!pool || !state.identity) return
  pool.subscribeMany(
    state.settings.relays,
    [{ kinds: [28800], '#p': [state.identity.pubkey] }],
    {
      onevent(event) {
        handleIncomingInvitation(event)
      },
    }
  )
}

async function handleIncomingInvitation(event) {
  if (!nostrTools || !state.identity) return
  try {
    let decrypted
    if (window.nostr?.nip44?.decrypt) {
      decrypted = await window.nostr.nip44.decrypt(event.pubkey, event.content)
    } else if (state.identity.privkey) {
      const skBytes = new Uint8Array(
        state.identity.privkey.match(/.{2}/g).map(b => parseInt(b, 16))
      )
      // nostr-tools nip44 is in a submodule
      const nip44 = await import('https://esm.sh/nostr-tools@latest/nip44')
      const conversationKey = nip44.v2.utils.getConversationKey(skBytes, event.pubkey)
      decrypted = nip44.v2.decrypt(event.content, conversationKey)
    }
    if (decrypted) {
      const payload = JSON.parse(decrypted)
      if (payload.seed && payload.name) {
        const id = payload.groupId || crypto.randomUUID?.() || Date.now().toString(36)
        if (!state.groups[id]) {
          const now = Math.floor(Date.now() / 1000)
          state.groups[id] = {
            name: payload.name,
            seed: payload.seed,
            members: payload.members || [event.pubkey, state.identity.pubkey],
            rotationInterval: payload.rotationInterval || DEFAULT_ROTATION_INTERVAL,
            wordCount: payload.wordCount || 1,
            wordlist: 'en-v1',
            counter: getCounter(now, payload.rotationInterval || DEFAULT_ROTATION_INTERVAL),
            usageOffset: 0,
            createdAt: now,
          }
          saveGroups()
          renderGroupList()
        }
      }
    }
  } catch (err) {
    console.error('Failed to process invitation:', err)
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEYS = {
  groups: 'canary:groups',
  settings: 'canary:settings',
  identity: 'canary:identity',
}

const DEFAULT_RELAYS = [
  'wss://relay.trotters.cc',
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
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (d === 0 && m > 0) parts.push(`${m}m`)
  if (d === 0 && h === 0) parts.push(`${s}s`)
  return `rotates in ${parts.join(' ')}`
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
  return pubkey.slice(0, 8) + '…' + pubkey.slice(-4)
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

function getAppState() {
  if (!state.identity && Object.keys(state.groups).length === 0) return 'welcome'
  if (state.activeGroupId === 'demo') return 'demo'
  return 'active'
}

// ---------------------------------------------------------------------------
// Master render
// ---------------------------------------------------------------------------

function render() {
  const appState = getAppState()
  const isWelcome = appState === 'welcome'

  // Sidebar — hidden in welcome state
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) sidebar.hidden = isWelcome

  // Layout class for welcome centering
  const layout = document.querySelector('.layout')
  if (layout) layout.classList.toggle('layout--welcome', isWelcome)

  // Relay status — hidden in welcome
  const relayStatus = document.querySelector('.relay-status')
  if (relayStatus) relayStatus.hidden = isWelcome

  // Welcome screen and main content sections
  const welcomeScreen = document.getElementById('welcome-screen')
  const hero = document.getElementById('hero')
  const panelsGrid = document.querySelector('.panels-grid')
  const settingsPanel = document.getElementById('settings-panel')

  if (isWelcome) {
    if (welcomeScreen) welcomeScreen.hidden = false
    if (hero) hero.hidden = true
    if (panelsGrid) panelsGrid.hidden = true
    if (settingsPanel) settingsPanel.hidden = true
    renderWelcome()
  } else {
    if (welcomeScreen) welcomeScreen.hidden = true
    if (hero) hero.hidden = false
    if (panelsGrid) panelsGrid.hidden = false
    if (settingsPanel) settingsPanel.hidden = false
    renderGroupList()
    renderHero()
    renderMembers()
    renderSettings()
    renderIdentityBadge()
  }

  renderAuthButton()
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function renderWelcome() {
  // Visibility is controlled by render(); this function handles
  // any welcome-state-specific dynamic content updates.
}

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
      render()
    })

    list.appendChild(item)
  }
}

function renderHero() {
  const group = state.groups[state.activeGroupId]
  if (!group) return

  const now = Math.floor(Date.now() / 1000)
  const counter = getCounter(now, group.rotationInterval) + group.usageOffset
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
    const nowMember = Math.floor(Date.now() / 1000)
    const counter = getCounter(nowMember, group.rotationInterval) + group.usageOffset
    const duressWord = deriveDuressWord(group.seed, pubkey, counter)
    const name = getMemberName(pubkey, isDemoGroup)

    const row = document.createElement('div')
    row.className = 'member-row'
    row.dataset.pubkey = pubkey

    const info = document.createElement('div')
    info.className = 'member-row__info'

    const dotEl = document.createElement('span')
    dotEl.className = 'member-row__dot'

    const nameEl = document.createElement('span')
    nameEl.className = 'member-row__name'
    nameEl.textContent = name

    const keyEl = document.createElement('span')
    keyEl.className = 'member-row__pubkey'
    keyEl.textContent = pubkey.slice(0, 8) + '…' + pubkey.slice(-4)

    info.appendChild(dotEl)
    info.appendChild(nameEl)
    info.appendChild(keyEl)

    const actions = document.createElement('div')
    actions.className = 'member-row__actions'

    // Duress toggle button
    const duressBtn = document.createElement('button')
    duressBtn.className = 'member-row__btn'
    duressBtn.textContent = 'Duress'
    duressBtn.title = 'Show duress word for this member'

    const duressDetail = document.createElement('div')
    duressDetail.className = 'member-row__duress'
    duressDetail.textContent = duressWord

    duressBtn.addEventListener('click', () => {
      const isVisible = duressDetail.classList.contains('member-row__duress--visible')
      duressDetail.classList.toggle('member-row__duress--visible', !isVisible)
    })

    actions.appendChild(duressBtn)

    // Remove button — hidden for demo group
    if (!isDemoGroup) {
      const removeBtn = document.createElement('button')
      removeBtn.className = 'member-row__btn member-row__btn--remove'
      removeBtn.textContent = 'Remove'
      removeBtn.addEventListener('click', () => handleRemoveMember(pubkey))
      actions.appendChild(removeBtn)
    }

    row.appendChild(info)
    row.appendChild(actions)
    row.appendChild(duressDetail)
    list.appendChild(row)
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
    const isActive = val === group.rotationInterval
    btn.classList.toggle('seg-btn--active', isActive)
    btn.setAttribute('aria-pressed', String(isActive))
    btn.disabled = isDemoGroup
  }

  // Word count — mark active seg-btn
  const wordCountBtns = document.querySelectorAll('#setting-wordcount .seg-btn')
  for (const btn of wordCountBtns) {
    const val = parseInt(btn.dataset.value, 10)
    const isActive = val === group.wordCount
    btn.classList.toggle('seg-btn--active', isActive)
    btn.setAttribute('aria-pressed', String(isActive))
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
    li.className = 'relay-tag'
    li.dataset.relay = relay

    const urlSpan = document.createElement('span')
    urlSpan.className = 'relay-url'
    urlSpan.textContent = relay

    const removeBtn = document.createElement('button')
    removeBtn.className = 'relay-tag__remove'
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

  const now = Math.floor(Date.now() / 1000)
  const counter = getCounter(now, group.rotationInterval) + group.usageOffset
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
    case 'duress': {
      resultEl.classList.add('verify-result--duress')
      iconEl.textContent = '⚠'
      const memberName = result.member
        ? getMemberName(result.member, state.activeGroupId === 'demo')
        : 'someone'
      textEl.textContent = `Duress — ${memberName} may be under coercion.`
      break
    }
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

    const now = Math.floor(Date.now() / 1000)
    const counter = getCounter(now, group.rotationInterval) + group.usageOffset
    let duressWord
    if (state.identity) {
      // Authenticated: show the user's own duress word
      duressWord = deriveDuressWord(group.seed, state.identity.pubkey, counter)
    } else {
      // Demo mode: show the first member's (Alice's) duress word
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

  render()
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
      render()
    },
  )
}

function setupInvite() {
  const inviteBtn = document.getElementById('invite-btn')
  const inviteInput = document.getElementById('invite-input')

  inviteBtn.addEventListener('click', async () => {
    const raw = inviteInput.value.trim()
    if (!raw) return

    let pubkey
    if (raw.startsWith('npub1')) {
      // Attempt npub bech32 decoding via nostr-tools
      let nip19 = nostrTools?.nip19
      if (!nip19) {
        try {
          nip19 = await import('https://esm.sh/nostr-tools@latest/nip19')
        } catch {
          // nip19 unavailable
        }
      }
      if (nip19) {
        try {
          const decoded = nip19.decode(raw)
          pubkey = decoded.data
        } catch {
          alert('Invalid npub.')
          return
        }
      } else {
        alert('Please paste a hex pubkey. npub decoding requires network connectivity.')
        return
      }
    } else {
      pubkey = raw.toLowerCase()
      if (!/^[0-9a-f]{64}$/.test(pubkey)) {
        alert('Please enter a valid 64-character hex pubkey.')
        return
      }
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
    render()
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
    render()
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
    render()
  })

  // Relay list — delegated remove
  const relayList = document.getElementById('setting-relays')
  relayList.addEventListener('click', (e) => {
    const btn = e.target.closest('.relay-tag__remove')
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
        render()
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
        render()
      },
    )
  })
}

// ---------------------------------------------------------------------------
// Welcome screen
// ---------------------------------------------------------------------------

function setupWelcome() {
  document.getElementById('try-demo-btn').addEventListener('click', () => {
    ensureDemoGroup()
    render()
    // Show demo banner now that we've left the welcome screen
    if (!window.nostr && !state.identity) {
      document.getElementById('demo-banner').hidden = false
    }
  })

  document.getElementById('welcome-signin-btn').addEventListener('click', () => {
    document.getElementById('auth-btn').click()
  })
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function setupAuth() {
  const btn = document.getElementById('auth-btn')

  btn.addEventListener('click', async () => {
    if (state.identity) {
      // Sign out — complete wipe of identity and groups
      state.identity = null
      state.groups = {}
      state.activeGroupId = null
      state.isDemo = true
      lastRenderedWord = null
      localStorage.removeItem(STORAGE_KEYS.groups)
      localStorage.removeItem(STORAGE_KEYS.identity)
      localStorage.removeItem(STORAGE_KEYS.settings)
      // Clear sensitive DOM
      const heroWordEl = document.getElementById('hero-word')
      if (heroWordEl) heroWordEl.textContent = ''
      const duressWordEl = document.getElementById('duress-word')
      if (duressWordEl) duressWordEl.textContent = ''
      const duressReveal = document.getElementById('duress-reveal')
      if (duressReveal) duressReveal.hidden = true
      const membersList = document.getElementById('members-list')
      if (membersList) membersList.innerHTML = ''
      const verifyResult = document.getElementById('verify-result')
      if (verifyResult) verifyResult.hidden = true
      render()
      return
    }

    // Try NIP-07 extension first
    if (window.nostr) {
      try {
        const pubkey = await window.nostr.getPublicKey()
        state.identity = { pubkey }
        state.isDemo = false
        saveIdentity()
        subscribeToInvitations()
        document.getElementById('demo-banner').hidden = true
        render()
        return
      } catch {
        // User rejected or extension failed — fall through to ephemeral
      }
    }

    // Fallback: generate an ephemeral keypair
    try {
      if (nostrTools) {
        // Use nostr-tools for a proper secp256k1 keypair
        const sk = nostrTools.generateSecretKey()
        const pubkey = nostrTools.getPublicKey(sk)
        const privkey = Array.from(sk).map(b => b.toString(16).padStart(2, '0')).join('')
        state.identity = { pubkey, privkey }
      } else {
        // Offline fallback: generate an ephemeral keypair using Web Crypto
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
      }

      state.isDemo = false
      saveIdentity()
      subscribeToInvitations()
      document.getElementById('demo-banner').hidden = true
      render()
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
    if (getAppState() !== 'welcome') {
      renderHero()
    }
  }, 1000)
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

function init() {
  loadState()
  render()

  // Event bindings
  document.getElementById('verify-form').addEventListener('submit', handleVerify)
  setupDuressLongPress()
  setupCreateModal()
  setupConfirmModal()
  setupSettings()
  setupInvite()
  setupAuth()
  setupWelcome()
  setupThemeToggle()
  startTick()

  // Load Nostr tools (non-blocking — offline mode still works)
  loadNostrTools().then(() => {
    if (state.identity) subscribeToInvitations()
  })

  // Show demo banner if no NIP-07 extension and no saved identity, but only when not on welcome screen
  if (!window.nostr && !state.identity && getAppState() !== 'welcome') {
    document.getElementById('demo-banner').hidden = false
  }
}

init()
