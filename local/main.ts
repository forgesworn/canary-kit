import './style.css'
import { createPair, joinPair, joinInvite, makeInvite, pairReference, wordsAt, checkWords, INTERVAL, type Pair } from './model.js'
import { createVault, unlockVault, parseVault, sealEntries, closeVault, enableDeviceUnlock, unlockWithDevice, deviceUnlockPossible, exportVault, type Vault, type VaultRecord, type Entry } from './vault.js'
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
  get('lock').hidden = !vault
  get('local-note').hidden = !!vault
  error(); status()
  window.scrollTo(0, 0)
}
function updateUnlock() {
  get('unlock-device').hidden = !!restoring || !record?.device || !deviceUnlockPossible() || record.device.origin !== location.origin
  get('unlock-message').textContent = restoring ? 'Unlock your encrypted backup. Your current saved vault is not changed yet.' : 'Unlock the vault saved on this device.'
}
function wipeUi() {
  for (const id of ['say', 'hear', 'signal']) get(id).textContent = '—'
  for (const id of ['setup-words', 'setup-reference', 'reference', 'side', 'check-result']) get(id).textContent = ''
  for (const id of ['setup-input', 'person-name', 'heard-input', 'new-password', 'confirm-password', 'unlock-password']) {
    get<HTMLInputElement | HTMLTextAreaElement>(id).value = ''
  }
  get('people-list').replaceChildren()
  get('pair-title').textContent = 'Our words.'
  const qr = get<HTMLCanvasElement>('pair-qr')
  qr.width = qr.height = 1
  for (const id of ['setup-details', 'duress', 'check', 'manual-join', 'vault-settings']) get<HTMLDetailsElement>(id).open = false
  renderedCounter = resultCounter = -1
}
function lock(message = '') {
  generation++
  stopScan()
  if (vault) closeVault(vault)
  vault = null; draft = null; selected = null; restoring = null
  wipeUi()
  show(diskVersion ? 'locked' : 'welcome')
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
  get('device-status').textContent = vault.record.device
    ? 'Device unlock is enabled for this saved vault. Keep your recovery passphrase safe.'
    : deviceUnlockPossible() ? 'You can add device unlock on a supported browser and passkey provider.' : 'Use your vault passphrase here. Device unlock needs HTTPS and a compatible browser and provider.'
  show('people')
}
function setupPair(next: Pair, created: boolean) {
  if (!vault) return
  stopScan()
  draft = next
  get('qr-area').hidden = !created
  get('setup-title').textContent = created ? 'A small thing\nonly you know.' : 'You’re in sync.'
  get('setup-step').textContent = created ? '01 · Exchange' : '02 · Compare'
  get('setup-reference').textContent = pairReference(next)
  get<HTMLInputElement>('person-name').value = ''
  get<HTMLInputElement>('reference-confirmed').checked = false
  get<HTMLDetailsElement>('setup-details').open = false
  get('setup-words').textContent = ''
  if (created) drawQr(get<HTMLCanvasElement>('pair-qr'), makeInvite(next))
  get<HTMLTextAreaElement>('setup-input').value = ''
  show('pair-setup')
}
function openPerson(entry: Entry) {
  selected = entry
  get('pair-title').textContent = entry.label
  get('reference').textContent = pairReference(entry.pair)
  get('side').textContent = entry.pair.role === 'first' ? 'you made this pair' : 'you joined this pair'
  get<HTMLDetailsElement>('duress').open = get<HTMLDetailsElement>('check').open = false
  get('check-result').textContent = ''
  get<HTMLInputElement>('heard-input').value = ''
  renderedCounter = resultCounter = -1
  show('paired')
  tick()
}
function tick() {
  if (vault && Date.now() - lastActivity > 300_000) { lock('Vault locked after five minutes without interaction.'); return }
  if (!vault || !selected || document.hidden || get('paired').hidden) return
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

get('setup-device').addEventListener('click', () => { show('vault-create'); get('new-password').focus() })
get('create-back').addEventListener('click', () => { wipeUi(); show('welcome') })
get('lock').addEventListener('click', () => lock('Your vault is locked.'))
get('vault-create-form').addEventListener('submit', event => {
  event.preventDefault()
  const password = get<HTMLInputElement>('new-password').value
  if (password !== get<HTMLInputElement>('confirm-password').value) { error('The two passphrases do not match.'); return }
  get<HTMLInputElement>('new-password').value = get<HTMLInputElement>('confirm-password').value = ''
  void action(async stamp => {
    const next = await createVault(password)
    if (stamp !== generation || document.hidden) { closeVault(next); return }
    try { persist(next.record) } catch (e) { closeVault(next); throw e }
    vault = next; lastActivity = Date.now(); people()
    status('Vault created. Pair with someone, then save an encrypted backup.')
  })
})
async function acceptUnlocked(next: Vault, stamp: number, fromBackup: boolean) {
  if (stamp !== generation || document.hidden) { closeVault(next); return }
  if (fromBackup) {
    if (diskVersion && !confirm('Restore this backup in place of the vault currently saved in this browser? Keep a backup of the current vault first.')) { closeVault(next); status('Restore cancelled. Your saved vault is unchanged.'); return }
    try { persist(next.record) } catch (e) { closeVault(next); throw e }
  }
  vault = next; restoring = null; lastActivity = Date.now(); people()
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
    persist(next); active.record = next; people(); status('Device unlock added. Your passphrase still unlocks encrypted backups.')
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
get('add-person').addEventListener('click', () => show('pair-choice'))
get('create').addEventListener('click', () => { try { setupPair(createPair(), true) } catch { error('Could not create secure setup words. Try a current browser. No pair was saved.') } })
get('show-join').addEventListener('click', () => { show('join'); get<HTMLTextAreaElement>('setup-input').value = ''; get<HTMLInputElement>('original-creator').checked = false })
get('join-back').addEventListener('click', () => { get<HTMLTextAreaElement>('setup-input').value = ''; show('pair-choice') })
document.querySelectorAll('.home').forEach(button => button.addEventListener('click', people))
get('scan-start').addEventListener('click', () => {
  get('scanner').hidden = false; get('scan-start').hidden = true
  get('scan-status').textContent = 'Point the camera at their private QR.'
  void scanner.start().catch(() => { stopScan(); status('Camera access was not available. You can type the first four letters of each setup word instead.'); get<HTMLDetailsElement>('manual-join').open = true })
})
get('scan-stop').addEventListener('click', stopScan)
get('join-form').addEventListener('submit', event => {
  event.preventDefault()
  try { setupPair(joinPair(get<HTMLTextAreaElement>('setup-input').value, get<HTMLInputElement>('original-creator').checked ? 'first' : 'second'), false) }
  catch (e) { error(e instanceof Error ? e.message : 'Check the setup words.') }
})
get('setup-details').addEventListener('toggle', () => {
  get('setup-words').textContent = draft && get<HTMLDetailsElement>('setup-details').open ? draft.mnemonic : ''
})
get('save-person-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!vault || !draft) return
  const active = vault
  const entry: Entry = { id: crypto.randomUUID(), label: get<HTMLInputElement>('person-name').value.trim(), pair: draft }
  void action(async stamp => {
    const entries = [...active.entries, entry]
    const next = await sealEntries(active, entries)
    if (stamp !== generation || vault !== active || document.hidden) return
    persist(next); active.record = next; active.entries = entries; draft = null
    get('setup-words').textContent = ''
    get<HTMLCanvasElement>('pair-qr').width = get<HTMLCanvasElement>('pair-qr').height = 1
    openPerson(entry)
    status('Saved encrypted on this device. Agree together what the private signal should mean.')
  })
})
get('duress').addEventListener('toggle', () => { renderedCounter = -1; tick() })
get('check-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!selected || !vault) return
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
document.querySelector('.brand')!.addEventListener('click', event => { event.preventDefault(); if (vault) people(); else show(diskVersion ? 'locked' : 'welcome') })
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopScan(); if (vault || busy) lock('Vault locked when you left the tab. Unfinished pairing is not saved.') }
})
document.addEventListener('keydown', event => { lastActivity = Date.now(); if (event.key === 'Escape' && vault) lock('Your vault is locked.') })
document.addEventListener('pointerdown', () => { lastActivity = Date.now() }, { passive: true })
window.addEventListener('pagehide', () => { stopScan(); if (vault) lock() })
window.addEventListener('storage', event => {
  if (event.key === STORE && event.newValue !== diskVersion) {
    diskVersion = event.newValue
    try { record = diskVersion ? parseVault(diskVersion) : null } catch { record = null }
    lock('The vault changed in another tab. Unlock the latest copy before continuing.')
  }
})
try {
  diskVersion = localStorage.getItem(STORE)
  if (diskVersion) { record = parseVault(diskVersion); show('locked'); updateUnlock() }
} catch { show(diskVersion ? 'locked' : 'welcome'); error('Saved storage is unavailable or damaged. Keep an encrypted backup and restore a valid copy if needed.') }
setInterval(tick, 250)
