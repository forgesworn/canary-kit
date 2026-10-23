import './style.css'
import { joinPair, joinInvite, makeInvite, inviteLink, joinLink, joinFragment, pairReference, pairComparison, wordsAt, checkWords, INTERVAL, type Pair } from './model.js'
import { createVault, createDeviceVault, addRecoveryPassphrase, unlockVault, parseVault, sealEntries, closeVault, enableDeviceUnlock, unlockWithDevice, deviceUnlockPossible, exportVault, MAX_VAULT_BYTES, type Vault, type VaultRecord, type Entry } from './vault.js'
import { drawQr, QrScanner } from './qr.js'
import { mountTrust } from './trust-ui.js'
import type { TrustState } from './trust.js'
import { mountInstall } from './install.js'
import { mountConnect } from './connect-ui.js'
import { readConnect, type Exchange } from './connect.js'
import { mountDevices } from './device-ui.js'
import type { Devices } from './device-transfer.js'
import { mountMeet } from './meet-ui.js'
import type { Meeting } from './meet.js'

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
let pendingTrustTask: (() => Promise<void>) | null = null
let trustUi: ReturnType<typeof mountTrust> | undefined
let connectUi: ReturnType<typeof mountConnect> | undefined
let devicesUi: ReturnType<typeof mountDevices> | undefined
let meetUi: ReturnType<typeof mountMeet> | undefined

const scanner = new QrScanner(get<HTMLVideoElement>('scan-video'), data => {
  if(data.includes('#meet=')||data.startsWith('CANARY-MEET:')){stopScan();meetUi!.receive(data);return}
  if(data.includes('#connect=')){stopScan();void connectUi!.receive(data);return}
  if(data.startsWith('{')){try{readConnect(data);stopScan();void connectUi!.receive(data);return}catch{ /* Try the existing device-request parser below. */ }}
  if (data.includes('#device=') || data.startsWith('CANARY-DEVICE:') || data.startsWith('{')) { stopScan(); devicesUi!.receive(data); return }
  if (data.startsWith('CANARY-TRUST:') || data.includes('#trust=')) { stopScan(); trustUi!.receive(data); return }
  try { setupPair(data.startsWith('CANARY-LOCAL:') ? joinInvite(data) : joinLink(data, location.origin + location.pathname), false) }
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
  trustUi?.stopScan()
  meetUi?.stopScan()
  document.querySelectorAll<HTMLElement>('.view').forEach(element => { element.hidden = element.id !== name })
  get('lock').hidden = !vault && !selected && !draft && !pendingTrustTask
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
  get('unlock-message').textContent = restoring ? 'Unlock your encrypted backup. Your current saved vault is not changed yet.' : pendingTrustTask ? 'Unlock to continue your saved setup on this phone.' : pendingKeep ? 'Unlock to keep this pair with your saved people.' : 'Your saved people are ready on this phone.'
}
function wipeUi() {
  trustUi?.clear()
  connectUi?.clear()
  devicesUi?.clear()
  meetUi?.clear()
  for (const id of ['say', 'hear', 'signal']) get(id).textContent = '—'
  for (const id of ['setup-words', 'setup-reference', 'exchange-reference', 'reference', 'side', 'check-result', 'save-state']) get(id).textContent = ''
  for (const id of ['setup-input', 'person-name', 'heard-input', 'new-password', 'confirm-password', 'unlock-password']) {
    get<HTMLInputElement | HTMLTextAreaElement>(id).value = ''
  }
  get('people-list').replaceChildren()
  get('pair-title').textContent = 'Our words.'
  const qr = get<HTMLCanvasElement>('pair-qr')
  qr.width = qr.height = 1
  for (const id of ['setup-details', 'duress', 'check', 'manual-join', 'vault-settings', 'person-details']) get<HTMLDetailsElement>(id).open = false
  for (const input of document.querySelectorAll<HTMLInputElement>('#person-evidence-form input')) input.value = ''
  get('person-evidence-summary').textContent = ''
  get<HTMLInputElement>('quick-name').value = ''
  get<HTMLInputElement>('people-search').value = ''
  get('pending-connections').replaceChildren()
  get('pending-meetings').replaceChildren()
  get('vouch-overview').replaceChildren()
  renderedCounter = resultCounter = -1
}
function lock(message = '') {
  generation++
  stopScan()
  if (vault) closeVault(vault)
  vault = null; draft = null; selected = null; restoring = null; pendingKeep = false; recoveryMode = false; pendingTrustTask = null
  wipeUi()
  show(record ? 'locked' : 'welcome')
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
    const hint = document.createElement('small'); hint.textContent = entry.setup ? 'Finish your saved setup' : entry.lastCheck ? 'Spoken match · ' + new Date(entry.lastCheck * 1000).toLocaleDateString('en-GB') : 'Spoken check ready'
    const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true')
    text.append(label, hint); button.append(avatar, text, arrow)
    button.addEventListener('click', () => openPerson(entry))
    get('people-list').append(button)
  }
  connectUi?.list(get('pending-connections'))
  meetUi?.list(get('pending-meetings'))
  if(vault.trust.groups.length){
    for(const [title,hint,intent]of [['Your vouches',`${vault.trust.groups.length} private ${vault.trust.groups.length===1?'group':'groups'} · signed evidence`,'show'],['Vouch for someone','Check a key. Record what happened.','vouch']] as const){
      const button=document.createElement('button'),label=document.createElement('strong'),caption=document.createElement('small');label.textContent=title;caption.textContent=hint;button.append(label,caption);button.addEventListener('click',()=>trustUi!.home(intent));get('vouch-overview').append(button)
    }
  }
  get('people-search').hidden = vault.entries.length < 4
  get('enable-device').hidden = !deviceUnlockPossible()
  get('enable-device').textContent = vault.record.device ? 'Change device unlock' : 'Add device unlock'
  get('device-status').textContent = vault.record.password
    ? 'Your recovery passphrase unlocks this vault and its encrypted backups.'
    : 'Device unlock keeps this vault encrypted. Add recovery before relying on it long term.'
  get('add-recovery').hidden = !!vault.record.password
  get('backup').hidden = !vault.record.password
  get('recovery-card').hidden = !!vault.record.password
  show('people')
}
function setupPair(next: Pair, created: boolean) {
  stopScan()
  draft = next
  selected = null
  get<HTMLTextAreaElement>('setup-input').value = ''
  if (created) showPairQr(next)
  else finishExchange()
}
function showPairQr(next: Pair) {
  get('setup-reference').textContent = pairReference(next)
  get<HTMLDetailsElement>('setup-details').open = false
  get('setup-words').textContent = ''
  get('setup-role-hint').textContent = next.role === 'second' ? 'On their phone, tick “I originally made this pair” to restore their side.' : 'On their phone, leave “I originally made this pair” unticked.'
  const linked = location.protocol === 'https:'
  get('qr-instruction').textContent = linked ? 'They scan with their normal phone camera and open the link.' : 'Local preview: they need Canary open and tap Scan their QR. A normal-camera link needs this page hosted over HTTPS.'
  get('qr-privacy').textContent = linked ? 'Same pair. No countdown. Keep this setup link private.' : 'Same pair. Use the camera inside Canary. Keep this QR private.'
  get('finish-exchange').textContent = selected ? 'Back to our words ↗' : 'They’ve scanned · show our words ↗'
  drawQr(get<HTMLCanvasElement>('pair-qr'), linked ? inviteLink(next, location.origin + location.pathname) : makeInvite(next))
  show('pair-setup')
}
function finishExchange() {
  const entry = selected ?? (draft ? { id: crypto.randomUUID(), label: '', pair: draft } : null)
  if (!entry) return
  draft = null
  get('setup-words').textContent = ''
  get<HTMLCanvasElement>('pair-qr').width = get<HTMLCanvasElement>('pair-qr').height = 1
  openPerson(entry)
}
function isSaved() { return !!selected && !!vault?.entries.some(entry => entry.id === selected!.id) }
function openPerson(entry: Entry) {
  if(entry.setup?.meeting){selected=null;meetUi!.resume(entry.setup.meeting);return}
  selected = entry
  const saved = isSaved()
  const settingUp = !saved || !!entry.setup
  get('pair-title').textContent = entry.label || (saved ? 'Our words.' : 'Keep this pair.')
  get('paired-intro').textContent = saved && !entry.setup ? 'Ask for their words. If they asked first, read only “You say”.' : 'Read this code to each other. Same code? Name each other and finish on both phones.'
  get('check-guidance').hidden = !saved || !!entry.setup
  get('keep-card').hidden = saved && !entry.setup
  if (saved && !entry.setup) get('words-end').after(get('keep-card'))
  else get('words-grid').before(get('keep-card'))
  get<HTMLInputElement>('quick-name').value = entry.setup && entry.label==='New person' ? '' : entry.label
  get('setup-name').hidden = saved && !entry.setup
  get('confirm-pair').hidden = !saved || !entry.setup
  get('resend-reply').hidden = !entry.setup?.reply
  for (const id of ['words-grid', 'word-timer', 'progress', 'words-end', 'open-check', 'check', 'duress']) get(id).hidden = settingUp
  get<HTMLInputElement>('person-name').value = entry.label
  get('reference').textContent = pairReference(entry.pair)
  get('exchange-reference').textContent = pairComparison(entry.pair)
  get('side').textContent = entry.pair.role === 'first' ? 'call side 1' : 'call side 2'
  renderContactEvidence(entry)
  get('save-state').textContent = saved ? (entry.setup ? 'Saved encrypted. Finish the code check together.' : 'Saved encrypted on this phone.') : 'Keep your copy before switching apps.'
  get('keep-person').hidden = saved
  get('keep-hint').textContent = saved ? (vault!.record.password ? 'Ready for your next call.' : 'Add recovery in Your people to protect against losing device unlock.') : 'Each of you keeps your own copy for future calls.'
  get('remove-person').hidden = !saved
  get<HTMLDetailsElement>('duress').open = get<HTMLDetailsElement>('check').open = get<HTMLDetailsElement>('person-details').open = false
  get<HTMLDetailsElement>('repair-pair').open = false
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
  draft = selected = null; pendingKeep = false; pendingTrustTask = null
  if (vault) people()
  else { wipeUi(); show('welcome') }
}
function createScreen(recovery = false) {
  recoveryMode = recovery
  show('vault-create')
  get('create-title').textContent = recovery ? 'A way back in.' : 'Keep your private words.'
  get('create-message').textContent = recovery ? 'Add a recovery passphrase so you can save a portable encrypted backup.' : 'Protect your people and saved setup on this phone. You never exchange this passphrase.'
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
    const existing = active.entries.find(item => item.pair.role === entry.pair.role && item.pair.mnemonic === entry.pair.mnemonic)
    if (existing) {
      vault = active; adopted = true; pendingKeep = false
      openPerson(existing)
      return
    }
    const kept = { ...entry, label: entry.label || `Person ${active.entries.length + 1}`, setup: entry.setup ?? { method: 'in-person' as const } }
    const entries = [...active.entries, kept]
    const next = await sealEntries(active, entries)
    if (stamp !== generation || selected !== entry || document.hidden) return
    persist(next)
    active.record = next; active.entries = entries; vault = active; adopted = true; pendingKeep = false
    openPerson(kept)
  } finally { if (fresh && !adopted) closeVault(active) }
}
async function adoptTrustVault(next: Vault, stamp: number) {
  let adopted = false
  try {
    if (stamp !== generation || document.hidden) return
    const sealed = await sealEntries(next, next.entries)
    if (stamp !== generation || document.hidden) return
    persist(sealed); next.record = sealed; vault = next; adopted = true
    const task = pendingTrustTask; pendingTrustTask = null
    if (task) await task()
  } finally { if (!adopted) closeVault(next) }
}
function ensureTrustVault(task: () => Promise<void>) {
  if (vault) { void action(async () => { await task() }); return }
  pendingTrustTask = task
  get('lock').hidden = false
  if (diskVersion) { show('locked'); updateUnlock(); return }
  if (!deviceUnlockPossible()) { createScreen(); return }
  void action(async stamp => {
    let next: Vault
    try { next = await createDeviceVault(location.origin) }
    catch { if (stamp === generation && !document.hidden) { createScreen(); status('Device encryption was unavailable or cancelled. Save with a passphrase instead.') }; return }
    await adoptTrustVault(next, stamp)
  })
}
trustUi = mountTrust(get('private-trust'), {
  vault: () => vault,
  ensure: ensureTrustVault,
  async save(state: TrustState) {
    const active = vault, stamp = generation
    if (!active || document.hidden) throw new Error('Unlock this phone’s vault before saving private groups.')
    const next = await sealEntries(active, active.entries, state)
    if (stamp !== generation || active !== vault || document.hidden) throw new Error('The vault was locked. Unlock and resume the saved exchange.')
    persist(next); active.record = next; active.trust = state
  },
  show: () => show('private-trust'), home, error, status,
})
async function savePairs(entries: Entry[], exchanges: Exchange[], meetings?:Meeting[]) {
  const active = vault, stamp = generation
  if (!active || document.hidden) throw new Error('Unlock your phone’s Canary vault first.')
  const next = await sealEntries({ ...active, exchanges,meetings:meetings??active.meetings }, entries)
  if (stamp !== generation || active !== vault || document.hidden) throw new Error('Canary was locked. Unlock to continue your saved setup.')
  persist(next); active.record = next; active.entries = entries; active.exchanges = exchanges
  if(meetings!==undefined)active.meetings=meetings
}
meetUi=mountMeet(get('meet'),{
  vault:()=>vault,ensure:ensureTrustVault,show:()=>show('meet'),home,open:openPerson,error,
  save:async(entries,meetings)=>{await savePairs(entries,vault?.exchanges??[],meetings)},
})
connectUi = mountConnect({ vault: () => vault, hasRecord: () => !!record, device: input => devicesUi!.receive(input), ensure: ensureTrustVault, save: savePairs, show, open: openPerson, home, error, scan:()=>{show('join');startScan()} })
devicesUi = mountDevices(get('devices'), {
  vault: () => vault, hasRecord: () => !!record, ensure: ensureTrustVault,
  async save(entries: Entry[], devices: Devices) {
    const active = vault, stamp = generation
    if (!active || document.hidden) throw new Error('Unlock Canary on this device before continuing the copy.')
    const next = await sealEntries({ ...active, devices }, entries)
    if (stamp !== generation || active !== vault || document.hidden) throw new Error('Canary was locked. Unlock to continue the saved device copy.')
    persist(next); active.record = next; active.entries = entries; active.devices = devices
  },
  show: () => show('devices'), scan: () => { show('join'); startScan() }, home, error,
})
mountInstall(show, home)
get('people-search').addEventListener('input', () => {
  const query = get<HTMLInputElement>('people-search').value.trim().toLocaleLowerCase()
  get('people-list').querySelectorAll<HTMLElement>('.person-card').forEach(card => { card.hidden = !card.textContent?.toLocaleLowerCase().includes(query) })
})
get('open-check').addEventListener('click', () => {
  get<HTMLDetailsElement>('check').open = true
  get('check').scrollIntoView({ behavior: 'instant', block: 'start' })
  get('heard-input').focus()
})
get('resend-reply').addEventListener('click', () => { if (selected) connectUi?.resend(selected) })
get('confirm-pair').addEventListener('click', () => {
  if (!selected?.setup || !vault) return
  const label=get<HTMLInputElement>('quick-name').value.trim()
  if(!label){error('Add their name so you can find this check on your next call.');get('quick-name').focus();return}
  const entry: Entry = { ...selected, label, evidence: { method: selected.setup.method, at: Math.floor(Date.now() / 1000) } }
  delete entry.setup
  void action(async () => {
    const active = vault!
    await savePairs(active.entries.map(e => e.id === entry.id ? entry : e), active.exchanges ?? [])
    openPerson(entry); status('Setup complete on your phone. Ask them to finish on theirs too.')
  })
})
function openVouches(intent:'groups'|'vouch'|'show'='groups') {
  if(record&&!vault)ensureTrustVault(async()=>{trustUi!.home(intent)})
  else trustUi!.home(intent)
}
for(const id of ['open-private-groups','people-private-groups'])get(id).addEventListener('click',()=>openVouches())
get('start-vouch').addEventListener('click',()=>openVouches('vouch'))
get('show-vouches-welcome').addEventListener('click',()=>openVouches('show'))
function tick() {
  if ((vault || selected || draft || pendingTrustTask) && Date.now() - lastActivity > 300_000) { lock('Locked after five minutes without interaction. Unlock to continue saved setup.'); return }
  trustUi?.tick()
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
  if (pendingTrustTask) { pendingTrustTask = null; home(); return }
  if (recoveryMode) people(); else if (selected) openPerson(selected); else home()
})
get('unlock-back').addEventListener('click', () => { restoring = null; pendingKeep = false; pendingTrustTask = null; if (selected) openPerson(selected); else show('welcome') })
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
    } else if (pendingTrustTask) await adoptTrustVault(await createVault(password), stamp)
    else await keepWith(await createVault(password), stamp)
  })
})
get('keep-person').addEventListener('click', () => {
  if (!selected) return
  selected = { ...selected, label: get<HTMLInputElement>('quick-name').value.trim() || selected.label }
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
get('recovery-start').addEventListener('click', () => createScreen(true))
get('persist-storage').addEventListener('click', async () => {
  try {
    const kept = await navigator.storage?.persist?.()
    get('persist-status').textContent = kept ? 'This browser granted persistent storage. Keep a recovery backup too; clearing site data still removes it.' : 'This browser did not grant persistent storage. A recovery backup is your way back if data is cleared.'
  } catch { get('persist-status').textContent = 'Storage persistence is unavailable here. Keep a recovery backup.' }
})
async function acceptUnlocked(next: Vault, stamp: number, fromBackup: boolean) {
  if (stamp !== generation || document.hidden) { closeVault(next); return }
  if (fromBackup) {
    if (diskVersion && !confirm('Restore this backup in place of the vault currently saved in this browser? Keep a backup of the current vault first.')) { closeVault(next); status('Restore cancelled. Your saved vault is unchanged.'); return }
    try { persist(next.record) } catch (e) { closeVault(next); throw e }
    pendingTrustTask = null; pendingKeep = false
  }
  if (vault && vault !== next) closeVault(vault)
  vault = next; restoring = null; lastActivity = Date.now()
  if (pendingTrustTask && !fromBackup) { const task = pendingTrustTask; pendingTrustTask = null; await task() }
  else if (pendingKeep && selected && !fromBackup) await keepWith(next, stamp)
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
    if (file.size > MAX_VAULT_BYTES) throw new Error('This is too large to be a Canary backup.')
    const imported = parseVault(await file.text())
    if (stamp !== generation) return
    restoring = imported; show('locked'); updateUnlock(); get('unlock-password').focus()
  })
})
get('add-person').addEventListener('click', () => { selected = draft = null; wipeUi(); get<HTMLDetailsElement>('setup-options').open=false; show('welcome') })
get('create').addEventListener('click', () => meetUi!.start())
get('legacy-nearby').addEventListener('click',()=>connectUi!.nearby())
function startScan() {
  const stamp = generation
  get('scanner').hidden = false; get('scan-start').hidden = true
  get('scan-status').textContent = 'Point the camera at their private QR.'
  void scanner.start().catch(e => {
    if (stamp !== generation || document.hidden || get('join').hidden) return
    stopScan()
    const name = e instanceof DOMException ? e.name : ''
    status(!window.isSecureContext ? 'Camera access needs a secure website address (HTTPS). You can use the setup words here instead.'
      : name === 'NotAllowedError' ? 'Allow camera access in this browser’s site settings, then tap Open camera. Or use the setup words below.'
        : name === 'NotReadableError' ? 'The camera is busy or unavailable. Close other apps using it, then tap Open camera.'
          : name === 'NotFoundError' ? 'No camera was found. You can use the setup words below.'
            : 'Camera access was not available. You can type the first four letters of each setup word instead.')
    get<HTMLDetailsElement>('manual-join').open = true
  })
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
get('qr-back').addEventListener('click', () => { if (selected) finishExchange(); else home() })
get('show-pair-qr').addEventListener('click', () => { if (selected) showPairQr(selected.pair) })
get('scan-stop').addEventListener('click', stopScan)
get('join-form').addEventListener('submit', event => {
  event.preventDefault()
  try { setupPair(joinPair(get<HTMLTextAreaElement>('setup-input').value, get<HTMLInputElement>('original-creator').checked ? 'first' : 'second'), false) }
  catch (e) { error(e instanceof Error ? e.message : 'Check the setup words.') }
})
get('setup-details').addEventListener('toggle', () => {
  const pair = draft ?? selected?.pair
  get('setup-words').textContent = pair && get<HTMLDetailsElement>('setup-details').open ? pair.mnemonic : ''
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
function renderContactEvidence(entry: Entry) {
  get<HTMLSelectElement>('person-met').value = entry.evidence?.method ?? ''
  get<HTMLInputElement>('person-account').value = ''
  const notes = [entry.evidence ? `${entry.evidence.method === 'in-person' ? 'You recorded an in-person meeting' : 'You recorded a trusted live call'} on ${new Date(entry.evidence.at * 1000).toLocaleDateString('en-GB')}.` : 'How you met has not been recorded.']
  if (entry.accounts?.length) notes.push('Accounts you observed: ' + entry.accounts.map(a => `${a.service}: ${a.account}`).join('; ') + '.')
  if (entry.lastCheck) notes.push('Last matching spoken check on this phone: ' + new Date(entry.lastCheck * 1000).toLocaleString('en-GB') + '.')
  get('person-evidence-summary').textContent = notes.join(' ')
}
get('person-evidence-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!selected) return
  const method = get<HTMLSelectElement>('person-met').value as 'in-person' | 'trusted-call' | ''
  const service = get<HTMLSelectElement>('person-service').value
  const account = get<HTMLInputElement>('person-account').value.trim()
  const now = Math.floor(Date.now() / 1000)
  const accounts = [...(selected.accounts ?? []).filter(a => a.service !== service), ...(account ? [{ service, account, observedAt: now }] : [])]
  const entry: Entry = { ...selected, evidence: method ? { method, at: now } : undefined, accounts }
  if (!isSaved()) { openPerson(entry); get<HTMLDetailsElement>('person-details').open = true; status('Keep this pair to save these notes encrypted.'); return }
  const active = vault!
  void action(async stamp => {
    const entries = active.entries.map(item => item.id === entry.id ? entry : item)
    const next = await sealEntries(active, entries)
    if (stamp !== generation || vault !== active || document.hidden) return
    persist(next); active.record = next; active.entries = entries; selected = entry
    renderContactEvidence(entry); status('Contact notes saved encrypted on this phone.')
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
        : 'Pause. These words do not match. Do not act on their request. Contact them using a number or account you already trust. Check fresh words and phone clocks if needed.'
    get('check-result').className = result === 'different' ? 'check-feedback check-stop' : 'check-feedback'
    resultCounter = Math.floor(now / INTERVAL)
    get<HTMLInputElement>('heard-input').value = ''
    if (result === 'match' && vault && isSaved()) {
      const active = vault, entry = { ...selected!, lastCheck: now }
      void action(async stamp => {
        const entries = active.entries.map(item => item.id === entry.id ? entry : item)
        const next = await sealEntries(active, entries)
        if (stamp !== generation || vault !== active || selected?.id !== entry.id || document.hidden) return
        persist(next); active.record = next; active.entries = entries; selected = entry; renderContactEvidence(entry); status()
      })
    }
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
document.addEventListener('keydown', event => { lastActivity = Date.now(); if (event.key === 'Escape' && (vault || selected || draft || pendingTrustTask)) lock('Your vault is locked.') })
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
  if (diskVersion) { record = parseVault(diskVersion); show('locked'); updateUnlock() }
} catch { show('welcome'); error('Saved storage is unavailable or damaged. Keep an encrypted backup and restore a valid copy if needed.') }
function consumeIncoming() {
  const incomingWindow = window as Window & { canaryIncoming?: string }
  let incoming = incomingWindow.canaryIncoming
  delete incomingWindow.canaryIncoming
  if (!incoming) return
  if(incoming.startsWith('#meet=')){
    generation++;pendingKeep=false;pendingTrustTask=null;restoring=null;draft=selected=null;wipeUi();show('welcome');meetUi!.receive(location.origin+location.pathname+incoming);return
  }
  if (incoming.startsWith('#device=')) {
    generation++; pendingKeep = false; pendingTrustTask = null; restoring = null
    draft = selected = null; wipeUi(); show(record && !vault ? 'locked' : 'welcome')
    updateUnlock(); devicesUi!.receive(location.origin + location.pathname + incoming)
    return
  }
  if (incoming.startsWith('#connect=')) {
    generation++; pendingKeep = false; pendingTrustTask = null; restoring = null
    draft = selected = null; wipeUi(); show(record && !vault ? 'locked' : 'welcome')
    updateUnlock(); void connectUi!.receive(location.origin + location.pathname + incoming)
    return
  }
  if (incoming.startsWith('#trust=')) {
    generation++; pendingKeep = false; pendingTrustTask = null; restoring = null
    draft = selected = null; wipeUi(); show('welcome'); trustUi!.receive(incoming)
    return
  }
  try {
    const pair = joinFragment(incoming)
    generation++; pendingKeep = false; restoring = null
    wipeUi()
    setupPair(pair, false)
  } catch { error('This pairing link is damaged or unsupported. Ask them to show a fresh QR.') }
  finally { incoming = undefined }
}
window.addEventListener('canary-incoming', consumeIncoming)
consumeIncoming()
get('hosting-note').hidden = location.protocol === 'https:'
setInterval(tick, 250)
