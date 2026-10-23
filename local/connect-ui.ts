import { beginConnect, acceptConnect, finishConnect, connectInput, connectLink, readConnect, type Exchange } from './connect.js'
import { type Entry, type Vault } from './vault.js'

interface Host {
  vault(): Vault | null
  hasRecord(): boolean
  device?(input: string): void
  ensure(task: () => Promise<void>): void
  save(entries: Entry[], exchanges: Exchange[]): Promise<void>
  show(view: string): void
  open(entry: Entry): void
  home(): void
  error(message: string): void
}
export function mountConnect(host: Host) {
  const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
  let incoming: string | undefined, output: string | undefined, epoch = 0
  function clear() { epoch++; incoming = output = undefined; get<HTMLInputElement>('connect-name').value = ''; get<HTMLTextAreaElement>('connect-paste').value = ''; get<HTMLTextAreaElement>('connect-output').value = '' }
  function start(input?: string) {
    clear(); incoming = input
    get('connect-intro').textContent = input ? 'Someone sent you an invitation. Only continue with a person you know, face to face or on a separately trusted live call.' : 'Send an invitation in WhatsApp, Signal, Telegram or any private chat. They send one encrypted reply back.'
    get<HTMLInputElement>('connect-known').checked = false
    host.show('connect-start')
  }
  function present(packet: string, reply = false) {
    output = connectLink(packet, location.origin + location.pathname)
    get<HTMLTextAreaElement>('connect-output').value = output
    get('connect-share-title').textContent = reply ? 'Send your reply.' : 'Send your invitation.'
    get('connect-share-hint').textContent = reply ? 'Send this back in your private chat. Then both compare the fixed pair code on a trusted call.' : 'They open this link, protect their phone, then send you a reply. Open their reply here to finish.'
    get('connect-read-code').hidden = !reply
    get('connect-share-status').textContent = 'Progress is saved encrypted. You can safely switch apps and unlock to continue.'
    host.show('connect-share')
  }
  get('remote-start').addEventListener('click', () => start())
  get('connect-back').addEventListener('click', () => { clear(); host.home() })
  get('connect-share-back').addEventListener('click', () => { clear(); host.home() })
  get('connect-form').addEventListener('submit', event => {
    event.preventDefault()
    const label = get<HTMLInputElement>('connect-name').value.trim(), packet = incoming
    if (!label || !get<HTMLInputElement>('connect-known').checked) return
    host.ensure(async () => {
      const active = host.vault(), stamp = epoch
      if (!active) return
      if (packet) {
        const accepted = acceptConnect(packet)
        const entry: Entry = { id: crypto.randomUUID(), label, pair: accepted.pair, setup: { method: 'trusted-call', reply: accepted.reply } }
        await host.save([...active.entries, entry], active.exchanges ?? [])
        if (stamp === epoch) present(accepted.reply, true)
      } else {
        const draft = beginConnect(label)
        await host.save(active.entries, [...(active.exchanges ?? []), draft])
        if (stamp === epoch) present(draft.invite)
      }
    })
  })
  async function receive(input: string) {
    try {
      if (input.includes('#device=')) { host.device?.(input); return }
      const packet = connectInput(input, location.origin + location.pathname), parsed = readConnect(packet)
      if (parsed.type === 'offer') { start(packet); return }
      if (!host.vault() && !host.hasRecord()) {
        host.show('connect-paste-view')
        get<HTMLTextAreaElement>('connect-paste').value = connectLink(packet, location.origin + location.pathname)
        host.error('Open the Canary app or browser where you sent the invitation. Copy this reply and paste it there. This browser has no saved invitation.')
        return
      }
      host.ensure(async () => {
        const active = host.vault()
        const exchange = active?.exchanges?.find(item => item.id === parsed.id)
        if (!active || !exchange) throw new Error('No matching invitation on this browser. Open Canary where you made the invitation. If using the home-screen app, paste the reply there.')
        const pair = finishConnect(exchange, packet)
        const entry: Entry = { id: crypto.randomUUID(), label: exchange.label, pair, setup: { method: 'trusted-call' } }
        await host.save([...active.entries, entry], active.exchanges!.filter(item => item.id !== exchange.id))
        host.open(entry)
      })
    } catch (e) { host.error(e instanceof Error ? e.message : 'This connection could not be opened.') }
  }
  get('connect-paste-form').addEventListener('submit', event => {
    event.preventDefault()
    const input = get<HTMLTextAreaElement>('connect-paste').value.trim()
    get<HTMLTextAreaElement>('connect-paste').value = ''
    void receive(input)
  })
  for (const id of ['open-connection', 'open-connection-welcome']) get(id).addEventListener('click', () => { host.show('connect-paste-view'); get<HTMLTextAreaElement>('connect-paste').focus() })
  for (const id of ['connect-copy', 'connect-send']) get(id).addEventListener('click', async () => {
    const link = output
    if (!link) return
    try {
      if (id === 'connect-send' && navigator.share) await navigator.share({ title: 'Our Canary setup', text: 'Open this in Canary to continue our private setup.', url: link })
      else await navigator.clipboard.writeText(link)
      // Sharing can background and lock the app. Never redisplay data afterwards.
      if (output === link) get('connect-share-status').textContent = 'Ready. Continue in your private chat.'
    } catch (e) {
      if (output === link && !(e instanceof DOMException && e.name === 'AbortError')) get('connect-share-status').textContent = 'Tap and hold the link below to copy it.'
    }
  })
  get('connect-read-code').addEventListener('click', () => {
    const packet = output ? connectInput(output, location.origin + location.pathname) : undefined
    const entry = host.vault()?.entries.find(item => item.setup?.reply === packet)
    if (entry) host.open(entry)
  })
  function list(container: HTMLElement) {
    container.replaceChildren()
    for (const exchange of host.vault()?.exchanges ?? []) {
      const row = document.createElement('div'); row.className = 'pending-invite'
      const button = document.createElement('button'); button.className = 'person-card'; button.textContent = `${exchange.label} · waiting for reply ↗`
      button.addEventListener('click', () => present(exchange.invite)); row.append(button)
      const cancel = document.createElement('button'); cancel.className = 'text-button'; cancel.textContent = 'Remove invitation'
      cancel.addEventListener('click', () => host.ensure(async () => {
        const active = host.vault()
        if (!active || !confirm('Remove this invitation? Its reply will no longer open on this phone.')) return
        await host.save(active.entries, (active.exchanges ?? []).filter(e => e.id !== exchange.id)); host.home()
      }))
      row.append(cancel); container.append(row)
    }
  }
  function resend(entry: Entry) { if (entry.setup?.reply) present(entry.setup.reply, true) }
  return { receive, clear, list, resend }
}
