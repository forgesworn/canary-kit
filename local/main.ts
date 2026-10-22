import './style.css'
import { createPair, joinPair, readPair, pairReference, wordsAt, checkWords, INTERVAL, type Pair } from './model.js'

// Capture the clean built file, before filling any UI. Exports change only the
// inert JSON data; executable code and its CSP hash stay byte-for-byte intact.
const template = '<!doctype html>\n' + document.documentElement.outerHTML
const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
let pair: Pair | null = null
let paused = false
let renderedCounter = -1
let resultCounter = -1

function error(message = '') {
  get('error').textContent = message
  get('error').hidden = !message
}
function status(message = '') { get('status').textContent = message }
function screen(name: 'start' | 'join' | 'paired') {
  for (const id of ['start', 'join', 'paired']) get(id).hidden = id !== name
  error(); status()
}
function hidePrivateDetails() {
  for (const id of ['duress', 'check', 'setup-details']) get<HTMLDetailsElement>(id).open = false
  get('signal').textContent = '—'
  get('setup-words').textContent = ''
  get<HTMLInputElement>('heard-input').value = ''
  get('check-result').textContent = ''
  resultCounter = -1
}
function pause() {
  if (!pair) return
  paused = true
  hidePrivateDetails()
  get('say').textContent = get('hear').textContent = '—'
  get('word-area').hidden = true
  get('share').hidden = true
  get('paused').hidden = false
  get('pause').hidden = true
  get('resume').focus()
}
function resume() {
  paused = false
  renderedCounter = -1
  get('word-area').hidden = false
  get('share').hidden = false
  get('paused').hidden = true
  get('pause').hidden = false
  tick()
}

function openPair(next: Pair, created = false) {
  pair = next
  hidePrivateDetails()
  get<HTMLTextAreaElement>('setup-input').value = ''
  get<HTMLInputElement>('original-creator').checked = false
  get('reference').textContent = pairReference(next)
  get('side').textContent = next.role === 'first' ? 'You created this pair.' : 'You joined this pair.'
  get<HTMLDetailsElement>('share').open = created
  screen('paired')
  resume()
  get('pause').focus()
}

function tick() {
  if (!pair || paused || document.hidden) return
  const now = Math.floor(Date.now() / 1000)
  const counter = Math.floor(now / INTERVAL)
  const remaining = INTERVAL - now % INTERVAL
  get('countdown').textContent = `${remaining}s`
  get<HTMLProgressElement>('progress').value = remaining
  get('timer-text').textContent = remaining <= 5 ? 'Changing soon — wait before reading' : 'Fresh words every 30 seconds'
  if (resultCounter !== -1 && counter !== resultCounter) {
    get('check-result').textContent = 'Words have changed. Check again if needed.'
    resultCounter = -1
  }
  if (counter === renderedCounter) return
  try {
    const words = wordsAt(pair, now)
    get('say').textContent = words.say
    get('hear').textContent = words.hear
    get('signal').textContent = get<HTMLDetailsElement>('duress').open ? words.duress : '—'
    renderedCounter = counter
    error()
  } catch (e) {
    get('say').textContent = get('hear').textContent = get('signal').textContent = '—'
    error(e instanceof Error ? e.message : 'Could not make the words. Close this pair and try again.')
  }
}

function saveCopy(theirs: boolean) {
  if (!pair) return
  const exported: Pair = { ...pair, role: theirs ? (pair.role === 'first' ? 'second' : 'first') : pair.role }
  const doc = new DOMParser().parseFromString(template, 'text/html')
  doc.getElementById('private-pair')!.textContent = JSON.stringify(exported)
  const blob = new Blob(['<!doctype html>\n' + doc.documentElement.outerHTML], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `canary-private-${theirs ? 'their' : 'my'}-copy.html`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  status('Private copy prepared for download. Keep it as carefully as a password.')
}

get('create').addEventListener('click', () => {
  try { openPair(createPair(), true) }
  catch { error('Secure random generation is unavailable. Open this file in a current browser; no pair was created.') }
})
get('show-join').addEventListener('click', () => { screen('join'); get('setup-input').focus() })
get('join-back').addEventListener('click', () => {
  get<HTMLTextAreaElement>('setup-input').value = ''
  screen('start')
})
get('join-form').addEventListener('submit', event => {
  event.preventDefault()
  try {
    const role = get<HTMLInputElement>('original-creator').checked ? 'first' : 'second'
    openPair(joinPair(get<HTMLTextAreaElement>('setup-input').value, role))
  } catch (e) { error(e instanceof Error ? e.message : 'Check the setup words.') }
})
get('pause').addEventListener('click', pause)
get('resume').addEventListener('click', resume)
get('save-mine').addEventListener('click', () => saveCopy(false))
get('save-theirs').addEventListener('click', () => saveCopy(true))
get('setup-details').addEventListener('toggle', () => {
  get('setup-words').textContent = pair && get<HTMLDetailsElement>('setup-details').open ? pair.mnemonic : ''
})
get('duress').addEventListener('toggle', () => { renderedCounter = -1; tick() })
get('copy-setup').addEventListener('click', async () => {
  if (!pair) return
  try {
    await navigator.clipboard.writeText(pair.mnemonic)
    status('Setup words copied. Keep them out of group chats and clear clipboard history afterwards.')
  } catch { status('Clipboard access is unavailable. Select and copy the setup words above, or read them privately.') }
})
get('check-form').addEventListener('submit', event => {
  event.preventDefault()
  if (!pair || paused) return
  try {
    const now = Math.floor(Date.now() / 1000)
    const result = checkWords(pair, get<HTMLInputElement>('heard-input').value, now)
    get('check-result').textContent = result === 'signal'
      ? 'Their private signal matches. Follow the plan you agreed, when safe. Nothing has been sent.'
      : result === 'match'
        ? 'Their normal words match. This confirms knowledge of your shared secret, not identity or safety.'
        : 'These words do not match. Wait for fresh words and check the device clocks. Treat the person as unverified.'
    resultCounter = Math.floor(now / INTERVAL)
    get<HTMLInputElement>('heard-input').value = ''
  } catch { error('Could not check those words. Check this device’s date and time.') }
})
get('leave').addEventListener('click', () => {
  pair = null
  hidePrivateDetails()
  get('say').textContent = get('hear').textContent = '—'
  get('reference').textContent = get('side').textContent = ''
  screen('start')
  status('Pair closed in this session. Saved files and clipboard history are not deleted. A saved private file restores its pair when reopened.')
  get('create').focus()
})
document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })
document.addEventListener('keydown', event => { if (event.key === 'Escape') pause() })
document.querySelector('.brand')!.addEventListener('click', event => {
  event.preventDefault()
  if (pair) { resume(); get('pair-title').scrollIntoView() }
  else screen('start')
})

try {
  const saved = JSON.parse(get('private-pair').textContent ?? 'null') as unknown
  if (saved !== null) openPair(readPair(saved))
} catch { error('This saved pair could not be opened. Use a trusted copy or enter your setup words.') }
setInterval(tick, 250)
