import './style.css'
import { createPair, joinPair, joinInvite, makeInvite, pairReference, wordsAt, checkWords, INTERVAL, type Pair } from './model.js'
import { createVault, createDeviceVault, addRecoveryPassphrase, unlockVault, parseVault, sealEntries, closeVault, enableDeviceUnlock, unlockWithDevice, deviceUnlockPossible, exportVault, type Vault, type VaultRecord, type Entry } from './vault.js'
import { drawQr, QrScanner } from './qr.js'

const STORE = 'canary.encrypted-vault.v1'
const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
let vault: Vault | null = null
let record: VaultRecord | null = null
let diskVersion: string | null = null
let restoring: VaultRecord | null = null
let draft: Pair | null = null
let selected: Entry | null = null
let generation = 0
let busy = false
let lastActivity = Date.now()
let renderedCounter = -1
let resultCounter = -1
let pendingKeep = false
let recoveryMode = false

const scanner = new QrScanner(get<HTMLVideoElement>('scan-video'), data => {
  try { setupPair(joinInvite(data), false) }
  catch { get('scan-status').textContent = 'That is not a Canary pairing QR. Keep looking, or use the setup words.' }
}, message => { stopScan(); status(message) })

function error(message = '') { get('error').textContent = message; get('error').hidden = !message }
function status(message = '') { get('status').textContent = message }
function stopScan() {
  scanner.stop()
  get('scanner').hidden = true
  get('scan-start').hidden = false
}
function show(name: string) {
  stopScan()
  document.querySelectorAll<HTMLElement>('.view').forEach(element => { element.hidden = element.id !== name })
  get('lock').hidden = !vault && !selected && !draft
  get('your-people').hidden = !record
  get('local-note').hidden = !!vault
  error(); status()
  window.scrollTo(0, 0)
}
function updateUnlock() {
  get('unlock-device').hidden = !!restoring || !record?.device || !deviceUnlockPossible() || record.device.origin !== location.origin
  const candidate = restoring ?? record
  get('unlock-form').hidden = !candidate?.password
  get('device-only-note').hidden = !!candidate?.password
  get('unlock-message').textContent = restoring ? 'Unlock your encrypted backup. Your current saved vault is not changed yet.' : pendingKeep ? 'Unlock to keep this pair with your saved people.' : 'Unlock the vault saved on this phone.'
}
function wipeUi() {
  for (const id of ['say', 'hear', 'signal']) get(id).textContent = '—'
  for (const id of ['setup-words', 'setup-reference', 'reference', 'side', 'check-result', 'save-state']) get(id).textContent = ''
  for (const id of ['setup-input', 'person-name', 'heard-input', 'new-password', 'confirm-password', 'unlock-password']) {
    get<HTMLInputElement | HTMLTextAreaElement>(id).value = ''
  }
  get('people-list').replaceChildren()
  get('pair-title').textContent = 'Our words.'
  const qr = get<HTMLCanvasElement>('pair-qr')
  qr.width = qr.height = 1
  for (const id of ['setup-details', 'duress', 'check', 'manual-join', 'vault-settings', 'person-details']) get<HTMLDetailsElement>(id).open = false
  renderedCounter = resultCounter = -1
}
function lock(message = '') {
  generation++
  stopScan()
  if (vault) closeVault(vault)
  vault = null; draft = null; selected = null; restoring = null; pendingKeep = false; recoveryMode = false
  wipeUi()
  show('welcome')
  updateUnlock()
  status(message)
}
function persist(next: VaultRecord) {
  if (localStorage.getItem(STORE) !== diskVersion) throw new Error('The vault changed in another tab. Lock and unlock the latest copy before saving.')
  const text = JSON.stringify(next)
  localStorage.setItem(STORE, text)
  diskVersion = text
  record = next
}
async function action(task: (stamp: number) => Promise<void>) {
  if (busy) return
  busy = true
  const stamp = generation
  error(); status('Working on your device…')
  document.body.setAttribute('aria-busy', 'true')
  document.querySelectorAll<HTMLButtonElement>('main button').forEach(button => { button.disabled = true })
  try { await task(stamp) }
  catch (e) { if (stamp === generation) { status(); error(e instanceof Error ? e.message : 'That did not finish. Your saved vault has not been replaced.') } }
  finally {
    busy = false
    document.body.removeAttribute('aria-busy')
    document.querySelectorAll<HTMLButtonElement>('main button').forEach(button => { button.disabled = false })
  }
}
function people() {
  if (!vault) return
  selected = null; draft = null
  wipeUi()
  get('empty-people').hidden = vault.entries.length > 0
  for (const entry of vault.entries) {
    const button = document.createElement('button')
    button.className = 'person-card'
    const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.textContent = entry.label.slice(0, 1).toUpperCase()
    const text = document.createElement('span'); text.className = 'person-text'
    const label = document.createElement('strong'); label.textContent = entry.label
    const hint = document.createElement('small'); hint.textContent = 'Open your private words'
    const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true')
    text.append(label, hint); button.append(avatar, text, arrow)
    button.addEventListener('click', () => openPerson(entry))
    get('people-list').append(button)
  }
  get('enable-device').hidden = !deviceUnlockPossible()
  get('enable-device').textContent = vault.record.device ? 'Change device unlock' : 'Add device unlock'
  get('device-status').textContent = vault.record.password
    ? 'Your recovery passphrase unlocks this vault and its encrypted backups.'
    : 'Device unlock keeps this vault encrypted. Add recovery before relying on it long term.'
  get('add-recovery').hidden = !!vault.record.password
  get('backup').hidden = !vault.record.password
  show('people')
}
function setupPair(next: Pair, created: boolean) {
  stopScan()
  draft = next
  selected = null
  get('setup-reference').textContent = pairReference(next)
  get<HTMLDetailsElement>('setup-details').open = false
  get('setup-words').textContent = ''
  get<HTMLTextAreaElement>('setup-input').value = ''
  if (created) {
    drawQr(get<HTMLCanvasElement>('pair-qr'), makeInvite(next))
    show('pair-setup')
  } else finishExchange()
}
function finishExchange() {
  if (!draft) return
  const entry: Entry = { id: crypto.randomUUID(), label: '', pair: draft }
  draft = null
  get('setup-words').textContent = ''
  get<HTMLCanvasElement>('pair-qr').width = get<HTMLCanvasElement>('pair-qr').height = 1
  openPerson(entry)
}
function isSaved() { return !!selected && !!vault?.entries.some(entry => entry.id === selected!.id) }
function openPerson(entry: Entry) {
  selected = entry
  const saved = isSaved()
  get('pair-title').textContent = entry.label || 'Our words.'
  get<HTMLInputElement>('person-name').value = entry.label
  get('reference').textContent = pairReference(entry.pair)
  get('side').textContent = entry.pair.role === 'first' ? 'you showed the QR' : 'you scanned the QR'
  get('save-state').textContent = saved ? 'Saved encrypted on this phone.' : 'Here for now. Keep this pair before you leave.'
  get('keep-person').hidden = saved
  get('keep-hint').textContent = saved ? (vault!.record.password ? 'Ready for your next call.' : 'Add recovery in Your people to protect against losing device unlock.') : 'Each of you keeps your own copy for future calls.'
  get('remove-person').hidden = !saved
  get<HTMLDetailsElement>('duress').open = get<HTMLDetailsElement>('check').open = get<HTMLDetailsElement>('person-details').open = false
  get('check-result').textContent = ''
  get<HTMLInputElement>('heard-input').value = ''
  renderedCounter = resultCounter = -1
  lastActivity = Date.now()
  show('paired')
  tick()
}
function home() {
  if ((selected && !isSaved()) || draft) {
    if (!confirm('Leave this unsaved pair? You will need to exchange a new QR.')) return
  }
  generation++
  draft = selected = null; pendingKeep = false
  if (vault) people()
  else { wipeUi(); show('welcome') }
}
function createScreen(recovery = false) {
  recoveryMode = recovery
  show('vault-create')
  get('create-title').textContent = recovery ? 'A way back in.' : 'Keep your private words.'
  get('create-message').textContent = recovery ? 'Add a recovery passphrase so you can save a portable encrypted backup.' : 'Protect this pair with a passphrase. This is only for your phone; you don’t exchange it.'
  get('create-submit').textContent = recovery ? 'Add recovery passphrase' : 'Keep encrypted on this phone'
  get('new-password').focus()
}
async function keepWith(active: Vault, stamp: number) {
  const entry = selected
  const fresh = vault !== active
  let adopted = false
  try {
    if (!entry || stamp !== generation || document.hidden) return
    if (active.entries.some(item => item.id === entry.id)) return
    const kept = { ...entry, label: entry.label || `Person ${active.entries.length + 1}` }
    const entries = [...active.entries, kept]
    const next = await sealEntries(active, entries)
    if (stamp !== generation || selected !== entry || document.hidden) return
    persist(next)
    active.record = next; active.entries = entries; vault = active; adopted = true; pendingKeep = false
    openPerson(kept)
  } finally { if (fresh && !adopted) closeVault(active) }
}
function tick() {
  if ((vault || selected || draft) && Date.now() - lastActivity > 300_000) { lock('Locked after five minutes without interaction. Unsaved pairing was cleared.'); return }
  if (!selected || document.hidden || get('paired').hidden) return
  const now = Math.floor(Date.now() / 1000)
  const counter = Math.floor(now / INTERVAL)
  const remaining = INTERVAL - now % INTERVAL
  get('countdown').textContent = `${remaining}s`
  get<HTMLProgressElement>('progress').value = remaining
  get('timer-text').textContent = remaining <= 5 ? 'Changing soon — wait before reading' : 'Fresh words every 30 seconds'
  if (resultCounter !== -1 && counter !== resultCounter) { get('check-result').textContent = 'Words have changed. Check again if needed.'; resultCounter = -1 }
  if (counter === renderedCounter) return
  try {
    const words = wordsAt(selected.pair, now)
    get('say').textContent = words.say
    get('hear').textContent = words.hear
    get('signal').textContent = get<HTMLDetailsElement>('duress').open ? words.duress : '—'
    renderedCounter = counter
    error()
  } catch (e) {
    get('say').textContent = get('hear').textContent = get('signal').textContent = '—'
    error(e instanceof Error ? e.message : 'Could not make the words. Check this device’s date and time.')
  }
}

get('create-back').addEventListener('click', () => {
  get<HTMLInputElement>('new-password').value = get<HTMLInputElement>('confirm-password').value = ''
  if (recoveryMode) people(); else if (selected) openPerson(selected); else home()
})
get('unlock-back').addEventListener('click', () => { restoring = null; pendingKeep = false; if (selected) openPerson(selected); else show('welcome') })
get('lock').addEventListener('click', () => lock('Locked. Unsaved pairing was cleared.'))
get('your-people').addEventListener('click', () => { if (vault) people(); else { pendingKeep = false; show('locked'); updateUnlock() } })
get('vault-create-form').addEventListener('submit', event => {
  event.preventDefault()
  const password = get<HTMLInputElement>('new-password').value
  if (password !== get<HTMLInputElement>('confirm-password').value) { error('The two passphrases do not match.'); return }
  get<HTMLInputElement>('new-password').value = get<HTMLInputElement>('confirm-password').value = ''
  const recovering = recoveryMode, active = vault
  void action(async stamp => {
    if (recovering && active) {
      const next = await addRecoveryPassphrase(active, password)
      if (stamp !== generation || vault !== active || document.hidden) return
      persist(next); active.record = next; people()
      get<HTMLDetailsElement>('vault-settings').open = true
      status('Recovery added. Save your encrypted backup now.')
    } else await keepWith(await createVault(password), stamp)
  })
})
get('keep-person').addEventListener('click', () => {
  if (!selected) return
  pendingKeep = true
  if (vault) { const active = vault; void action(stamp => keepWith(active, stamp)); return }
  if (diskVersion) { show('locked'); updateUnlock(); return }
  if (!deviceUnlockPossible()) { createScreen(); return }
  void action(async stamp => {
    let next: Vault
    try { next = await createDeviceVault(location.origin) }
    catch {
      if (stamp === generation && !document.hidden) {
        createScreen()
        status('Device encryption wasn’t available or was cancelled. You can keep this pair with a passphrase instead.')
      }
      return
    }
    await keepWith(next, stamp)
  })
})
get('add-recovery').addEventListener('click', () => createScreen(true))
async function acceptUnlocked(next: Vault, stamp: number, fromBackup: boolean) {
  if (stamp !== generation || document.hidden) { closeVault(next); return }
  if (fromBackup) {
    if (diskVersion && !confirm('Restore this backup in place of the vault currently saved in this browser? Keep a backup of the current vault first.')) { closeVault(next); status('Restore cancelled. Your saved vault is unchanged.'); return }
    try { persist(next.record) } catch (e) { closeVault(next); throw e }
  }
  if (vault && vault !== next) closeVault(vault)
  vault = next; restoring = null; lastActivity = Date.now()
  if (pendingKeep && selected && !fromBackup) await keepWith(next, stamp)
  else people()
}
get('unlock-form').addEventListener('submit', event => {
  event.preventDefault()
  const password = get<HTMLInputElement>('unlock-password').value
  get<HTMLInputElement>('unlock-password').value = ''
  const candidate = restoring ?? record
  const fromBackup = !!restoring
  if (!candidate) { error('This saved vault could not be read. Restore a valid encrypted backup.'); return }
  void action(async stamp => { await acceptUnlocked(await unlockVault(candidate, password), stamp, fromBackup) })
})
get('unlock-device').addEventListener('click', () => {
  if (!record) return
  const candidate = record
  void action(async stamp => { await acceptUnlocked(await unlockWithDevice(candidate, location.origin), stamp, false) })
})
get('enable-device').addEventListener('click', () => {
  if (!vault) return
  const active = vault
  void action(async stamp => {
    const next = await enableDeviceUnlock(active, location.origin)
    if (stamp !== generation || vault !== active || document.hidden) return
    persist(next); active.record = next; people(); status('Device unlock added.')
  })
})
get('backup').addEventListener('click', () => {
  if (!vault) return
  const blob = new Blob([exportVault(vault.record)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = url; link.download = 'canary-encrypted-backup.json'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  status('Encrypted backup prepared. Keep it safely with access to your vault passphrase.')
})
for (const id of ['restore-welcome', 'restore-locked']) get(id).addEventListener('click', () => get<HTMLInputElement>('restore-file').click())
get('restore-file').addEventListener('change', () => {
  const input = get<HTMLInputElement>('restore-file')
  const file = input.files?.[0]; input.value = ''
  if (!file) return
  void action(async stamp => {
    if (file.size > 262_144) throw new Error('This is too large to be a Canary backup.')
    const imported = parseVault(await file.text())
    if (stamp !== generation) return
    restoring = imported; show('locked'); updateUnlock(); get('unlock-password').focus()
  })
})
get('add-person').addEventListener('click', () => { selected = draft = null; wipeUi(); show('welcome') })
get('create').addEventListener('click', () => { try { setupPair(createPair(), true) } catch { error('Could not create secure setup words. Try a current browser. No pair was saved.') } })
function startScan() {
  get('scanner').hidden = false; get('scan-start').hidden = true
  get('scan-status').textContent = 'Point the camera at their private QR.'
  void scanner.start().catch(() => { stopScan(); status('Camera access was not available. You can type the first four letters of each setup word instead.'); get<HTMLDetailsElement>('manual-join').open = true })
}
get('show-join').addEventListener('click', () => {
  show('join')
  get<HTMLTextAreaElement>('setup-input').value = ''
  get<HTMLInputElement>('original-creator').checked = false
  startScan()
})
get('join-back').addEventListener('click', () => { get<HTMLTextAreaElement>('setup-input').value = ''; show('welcome') })
document.querySelectorAll('.home').forEach(button => button.addEventListener('click', home))
get('scan-start').addEventListener('click', startScan)
get('finish-exchange').addEventListener('click', finishExchange)
get('scan-stop').addEventListener('click', stopScan)
get('join-form').addEventListener('submit', event => {
  event.preventDefault()
  try { setupPair(joinPair(get<HTMLTextAreaElement>('setup-input').value, get<HTMLInputElement>('original-creator').checked ? 'first' : 'second'), false) }
  catch (e) { error(e instanceof Error ? e.message : 'Check the setup words.') }
})
get('setup-details').addEventListener('toggle', () => {
  get('setup-words').textContent = draft && get<HTMLDetailsElement>('setup-details').open ? draft.mnemonic : ''
})
get('rename-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!selected) return
  const entry = { ...selected, label: get<HTMLInputElement>('person-name').value.trim() }
  if (!isSaved()) { openPerson(entry); return }
  const active = vault!
  if (!entry.label) entry.label = `Person ${active.entries.findIndex(item => item.id === entry.id) + 1}`
  void action(async stamp => {
    const entries = active.entries.map(item => item.id === entry.id ? entry : item)
    const next = await sealEntries(active, entries)
    if (stamp !== generation || vault !== active || document.hidden) return
    persist(next); active.record = next; active.entries = entries; openPerson(entry)
  })
})
get('duress').addEventListener('toggle', () => { renderedCounter = -1; tick() })
get('check-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!selected) return
  try {
    const now = Math.floor(Date.now() / 1000)
    const result = checkWords(selected.pair, get<HTMLInputElement>('heard-input').value, now)
    get('check-result').textContent = result === 'signal' ? 'Their private signal matches. Follow your agreed plan when safe. Nothing has been sent.'
      : result === 'match' ? 'Their normal words match. This confirms knowledge of your shared secret, not identity or safety.'
        : 'These words do not match. Wait for fresh words and check the device clocks. Treat the person as unverified.'
    resultCounter = Math.floor(now / INTERVAL)
    get<HTMLInputElement>('heard-input').value = ''
  } catch { error('Could not check these words. Check this device’s date and time.') }
})
get('remove-person').addEventListener('click', () => {
  if (!vault || !selected || !confirm('Remove this pair from this device? This cannot revoke the other person’s copy.')) return
  const active = vault, id = selected.id
  void action(async stamp => {
    const entries = active.entries.filter(entry => entry.id !== id)
    const next = await sealEntries(active, entries)
    if (stamp !== generation || vault !== active) return
    persist(next); active.record = next; active.entries = entries; people()
  })
})
document.querySelector('.brand')!.addEventListener('click', event => { event.preventDefault(); home() })
document.addEventListener('visibilitychange', () => {
  if (document.hidden) lock('Locked when you left the tab. Unsaved pairing was cleared.')
})
document.addEventListener('keydown', event => { lastActivity = Date.now(); if (event.key === 'Escape' && (vault || selected || draft)) lock('Your vault is locked.') })
document.addEventListener('pointerdown', () => { lastActivity = Date.now() }, { passive: true })
window.addEventListener('pagehide', () => { stopScan(); if (vault || selected || draft) lock() })
window.addEventListener('storage', event => {
  if (event.key === STORE && event.newValue !== diskVersion) {
    diskVersion = event.newValue
    try { record = diskVersion ? parseVault(diskVersion) : null } catch { record = null }
    lock('The vault changed in another tab. Unlock the latest copy before continuing.')
  }
})
try {
  diskVersion = localStorage.getItem(STORE)
  if (diskVersion) { record = parseVault(diskVersion); show('welcome'); updateUnlock() }
} catch { show('welcome'); error('Saved storage is unavailable or damaged. Keep an encrypted backup and restore a valid copy if needed.') }
setInterval(tick, 250)
