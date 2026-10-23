import { newGroup, groupCard, describeGroup, joinGroup, keyCard, readKeyCard, issueVouch, receiveVouch, beginCheck, readChallenge, answerCheck, inspectProof, acceptProof, withdrawVouch, receiveWithdrawal, forgetVoucher, keyCode, publicKey, timeNow, type Group, type Transfer, type TrustState, type Signed, type Method, type Proof } from './trust.js'
import { packTransfer, unpackTransfer, sealTransfer, openTransfer, transferLink, transferToken } from './trust-wire.js'
import { drawQr, QrScanner } from './qr.js'
import type { Vault } from './vault.js'

interface Host {
  vault(): Vault | null
  ensure(task: () => Promise<void>): void
  save(state: TrustState): Promise<void>
  show(): void
  home(): void
  error(message: string): void
  status(message: string): void
}
export function mountTrust(root: HTMLElement, host: Host) {
  let scanner: QrScanner | null = null
  let epoch = 0
  const field = (event: Signed, name: string) => event.tags.find(t => t[0] === name)?.[1] ?? ''
  const date = (seconds: number) => new Date(seconds * 1000).toLocaleDateString('en-GB')
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, value = '', className = '') {
    const element = document.createElement(tag); element.textContent = value; element.className = className; return element
  }
  function button(label: string, task: () => void, id = '', primary = false) {
    const b = node('button', label, primary ? 'primary wide' : 'secondary wide'); b.type = 'button'; if (id) b.id = id; b.addEventListener('click', task); return b
  }
  function stopScan() { scanner?.stop(); scanner = null }
  function screen(title: string, lead: string, back: () => void = home) {
    stopScan(); host.show(); root.replaceChildren()
    const b = button('← Back', back); b.className = 'text-button back'; b.id = 'trust-back-group'
    root.append(b, node('p', 'Private groups. Your choice.', 'eyebrow'), node('h1', title), node('p', lead, 'lead'))
    return root
  }
  function input(parent: HTMLElement, label: string, id: string, max: number, value = '') {
    const l = node('label', label); l.htmlFor = id
    const i = node('input'); i.id = id; i.maxLength = max; i.value = value; i.autocomplete = 'off'
    parent.append(l, i); return i
  }
  function getGroup(id: string) {
    const group = host.vault()?.trust.groups.find(g => g.id === id)
    if (!group) throw new Error('This group is not kept on this phone. Open its group card first, or restore your encrypted backup.')
    return group
  }
  async function save(group: Group) {
    const state = host.vault()!.trust
    if (!state.groups.some(g => g.id === group.id) && state.groups.length >= 8) throw new Error('This phone already has eight private groups. Back up your data before removing records.')
    await host.save({ v: 1, groups: [...state.groups.filter(g => g.id !== group.id), group] })
  }
  function name(group: Group, pubkey: string) { return group.trusted.find(p => p.pubkey === pubkey)?.label || group.people?.find(p => p.pubkey === pubkey)?.label || `Key ${keyCode(pubkey).split(' ').slice(0, 2).join(' ')}` }
  async function outgoing(group: Group, transfer: Transfer, title = 'Let them scan this.') {
    const saved = { ...group, outgoing: transfer }
    await save(saved)
    await showOutgoing(saved, transfer, title)
  }
  async function showOutgoing(group: Group, transfer: Transfer, title = 'Continue your exchange.') {
    const stamp = epoch, active = host.vault()
    const token = await packTransfer(transfer)
    if (stamp !== epoch || active !== host.vault() || document.hidden) return
    const payload = location.protocol === 'https:' ? transferLink(token, location.origin + location.pathname) : token
    const content = screen(title, transfer.kind === 'group' ? 'This card shares the group name and keeper code. It does not admit anyone.' : transfer.kind === 'key' ? 'Show this to the person checking or vouching for you. It shares your group key, not your private key.' : 'This exchange is encrypted for the intended phone. They scan and open the link.', () => groupView(getGroup(group.id)))
    const frame = node('div', '', 'qr-frame trust-qr'), canvas = node('canvas'); canvas.id = 'trust-qr'; canvas.setAttribute('aria-label', 'Private group exchange QR'); frame.append(canvas); content.append(frame)
    try { drawQr(canvas, payload, 'L') }
    catch { frame.hidden = true; content.append(node('p', 'This exchange is larger than a QR. Copy its encrypted link instead.', 'small notice')) }
    const ownCode = node('div', '', 'compare'); ownCode.append(node('span', 'Your verification code'), node('strong', keyCode(publicKey(group)))); content.append(ownCode)
    const l = node('label', 'Private exchange link'); l.htmlFor = 'trust-output'
    const output = node('textarea'); output.id = 'trust-output'; output.readOnly = true; output.value = payload; output.rows = 2; output.spellcheck = false
    content.append(l, output, button('Copy private link', () => { void navigator.clipboard?.writeText(payload).then(() => host.status('Copied. Share only with the intended person.')).catch(() => { output.select(); host.status('Select and copy the link above.') }) }))
    if (navigator.share && location.protocol === 'https:') content.append(button('Share with the intended person', () => { void navigator.share({ title: 'Private Canary exchange', url: payload }).catch(() => {}) }))
    content.append(node('p', 'Your exchange is saved encrypted on this phone. If you leave the page, unlock this group and tap Continue exchange. Other apps and recipients can retain links you deliberately share.', 'small'))
  }
  function home() {
    const content = screen('Private groups.', 'Keep a small circle of trust. No account, public profile or relay.', host.home)
    for (const group of host.vault()?.trust.groups ?? []) content.append(button(group.name, () => groupView(group)))
    const form = node('form'); form.id = 'trust-new-group-form'
    const groupName = input(form, 'A name for your group', 'trust-group-name', 40); groupName.required = true
    const create = node('button', 'Create a private group', 'primary wide'); create.id = 'trust-create-group'; create.type = 'submit'; form.append(create)
    form.addEventListener('submit', event => { event.preventDefault(); const value = groupName.value; host.ensure(async () => { const group = newGroup(value); await save(group); groupView(group) }) })
    content.append(form, button('Open a group code or private exchange', scanView, 'trust-open-code'), node('p', 'A group keeper chooses whose vouches to accept. Vouches record someone’s judgement; they are not identity documents or safety guarantees. Each group uses separate keys.', 'small'))
  }
  function groupView(group: Group) {
    const keeper = publicKey(group) === group.keeper
    const content = screen(group.name, keeper ? 'You keep this group. Choose whose vouches you accept.' : 'Your key and private vouches for this group stay in your encrypted vault.')
    const code = node('div', '', 'compare'); code.append(node('span', 'Keeper code'), node('strong', keyCode(group.keeper))); content.append(code)
    if (keeper) content.append(button('Share group card', () => host.ensure(async () => outgoing(group, { kind: 'group', event: groupCard(getGroup(group.id)) }, 'Share your group.')), 'trust-share-group'))
    content.append(button('My verification QR', () => host.ensure(async () => outgoing(group, { kind: 'key', event: keyCard(getGroup(group.id)) }, 'Your group key.')), 'trust-my-key', true), button('Scan a person or private exchange', scanView, 'trust-open-code'))
    if (group.outgoing) content.append(button('Continue exchange', () => host.ensure(async () => showOutgoing(getGroup(group.id), getGroup(group.id).outgoing!)), 'trust-resume'))
    if (group.lastCheck) {
      const check = group.lastCheck
      const last = node('p', `Key proof checked ${date(check.at)}${check.issuer ? ` · vouch by ${name(group, check.issuer)}` : ' · voucher key'}.${check.account ? ` Context supplied by you: ${check.account}.` : ''} Historical check using this phone’s latest known state. It does not automatically admit or verify an account in another app.`, 'small notice'); last.id = 'trust-last-check'; content.append(last)
    }
    for (const receipt of group.received) {
      const card = node('div', '', 'trust-card')
      const withdrawn = group.withdrawals.some(w => w.pubkey === receipt.pubkey && field(w, 'p') === publicKey(group) && w.created_at >= receipt.created_at)
      card.append(node('strong', withdrawn ? 'Withdrawal received' : Number(field(receipt, 'expiration')) <= timeNow() ? 'Vouch expired' : 'Private vouch kept'), node('p', `${name(group, receipt.pubkey)} recorded ${field(receipt, 'method') === 'in-person' ? 'an in-person meeting' : 'an online check'} · until ${date(Number(field(receipt, 'expiration')))}. The keeper decides whether to accept it.`, 'small')); content.append(card)
    }
    if (keeper) {
      const accepted = node('details'), summary = node('summary', 'Whose vouches I accept'); accepted.append(summary)
      for (const person of group.trusted) {
        accepted.append(node('p', `${person.label} · ${keyCode(person.pubkey)}`, 'small'))
        if (person.pubkey !== group.keeper) accepted.append(button(`Stop accepting ${person.label}`, () => host.ensure(async () => { const next = forgetVoucher(getGroup(group.id), person.pubkey); await save(next); groupView(next) })))
      }
      accepted.append(node('p', 'To accept a new voucher, scan their verification QR, check their key, then explicitly trust them. An ordinary member check never grants this permission.', 'small')); content.append(accepted)
    }
    if (group.issued.length) {
      const issued = node('details'); issued.open = true; issued.append(node('summary', 'Vouches I issued'))
      for (const event of group.issued) {
        const revoked = group.withdrawals.some(w => w.pubkey === event.pubkey && field(w, 'p') === field(event, 'p') && w.created_at >= event.created_at)
        const card = node('div', '', 'trust-card'); card.append(node('strong', name(group, field(event, 'p'))), node('p', `${revoked ? 'Withdrawn' : 'Issued'} ${date(event.created_at)} · expires ${date(Number(field(event, 'expiration')))}`, 'small'))
        if (!revoked) {
          const remove = button('Withdraw this vouch', () => host.ensure(async () => {
            if (!confirm('Withdraw this vouch? Other phones learn this only when the signed withdrawal reaches them.')) return
            const result = withdrawVouch(getGroup(group.id), event.id)
            const recipient = keeper ? result.subject : group.keeper
            await outgoing(result.group, await sealTransfer(result.group, recipient, { kind: 'withdrawal', event: result.event }), keeper ? 'Send their withdrawal.' : 'Send to the keeper.')
          })); remove.dataset.withdraw = event.id; card.append(remove)
        } else {
          const withdrawal = [...group.withdrawals].reverse().find(w => w.pubkey === event.pubkey && field(w, 'p') === field(event, 'p'))!
          card.append(button('Send withdrawal to holder', () => host.ensure(async () => { const current = getGroup(group.id); await outgoing(current, await sealTransfer(current, field(event, 'p'), { kind: 'withdrawal', event: withdrawal }), 'Send their withdrawal.') })))
          if (!keeper) card.append(button('Send withdrawal to keeper', () => host.ensure(async () => { const current = getGroup(group.id); await outgoing(current, await sealTransfer(current, current.keeper, { kind: 'withdrawal', event: withdrawal }), 'Send to the keeper.') })))
        }
        issued.append(card)
      }
      content.append(issued)
    }
    content.append(node('p', 'Offline checks know only the updates received by this phone. Withdrawal cannot erase copied proofs. Back up your encrypted vault before relying on these keys long term.', 'small'))
    const manage = node('details'); manage.append(node('summary', 'This phone’s group key & recovery'), node('p', 'Your verification code: ' + keyCode(publicKey(group)), 'small'), node('p', 'Use Recovery & device unlock in Your people to add recovery and save an encrypted backup. It includes your group keys. Without the key or a backup, new trust decisions are required.', 'small'))
    const removeGroup = button('Remove this group from this phone', () => host.ensure(async () => {
      if (!confirm('Remove this local group key and evidence? Keep an encrypted recovery backup first. Other phones and copied proofs are not erased or revoked.')) return
      await host.save({ v: 1, groups: host.vault()!.trust.groups.filter(g => g.id !== group.id) }); home()
    })); removeGroup.classList.add('danger'); manage.append(removeGroup); content.append(manage)
  }
  function scanView() {
    const content = screen('Open a private code.', 'Use the camera inside Canary, or paste a link. Nothing is uploaded.')
    const video = node('video'); video.muted = true; video.playsInline = true; video.className = 'trust-video'; video.hidden = true
    const open = button('Open camera', () => {
      video.hidden = false
      scanner = new QrScanner(video, data => { stopScan(); receive(data) }, message => { stopScan(); host.status(message) })
      void scanner.start().catch(() => { stopScan(); host.error('Camera unavailable. Paste the private link below, or allow camera access in site settings.') })
    })
    const form = node('form'), l = node('label', 'Private link or code'), value = node('textarea'); l.htmlFor = 'trust-input'; value.id = 'trust-input'; value.rows = 3; value.maxLength = 14000; value.required = true; value.spellcheck = false
    const submit = node('button', 'Open privately', 'primary wide'); submit.type = 'submit'; form.append(l, value, submit); form.addEventListener('submit', event => { event.preventDefault(); receive(value.value.trim()) })
    content.append(open, video, button('Stop camera', () => { stopScan(); video.hidden = true }), form)
  }
  function groupPreview(event: Signed) {
    const description = describeGroup(event)
    const content = screen(description.name, 'Compare this keeper code in person or through a channel you already trust. A matching name alone is not enough.')
    const code = node('div', '', 'compare'); code.append(node('span', 'Keeper code'), node('strong', keyCode(description.keeper))); content.append(code)
    content.append(button('Codes match · keep group', () => host.ensure(async () => {
      const existing = host.vault()!.trust.groups.find(g => g.id === description.id)
      if (existing) { groupView(existing); return }
      const group = joinGroup(event); await save(group); groupView(group)
    }), 'trust-keep-group', true), node('p', 'This keeps a new, independent verification key on this phone. It does not create a Nostr account or join a messaging group.', 'small'))
  }
  function personPreview(group: Group, request: Signed) {
    readKeyCard(group, request)
    const content = screen('A person, not a profile.', `This phone is presenting a key for ${group.name}. Compare their verification code with them before vouching.`)
    const code = node('div', '', 'compare'); code.append(node('span', 'Their verification code'), node('strong', keyCode(request.pubkey))); content.append(code)
    content.append(button('Check their key before vouching', () => host.ensure(async () => {
      const current = getGroup(group.id), result = beginCheck(current, request.pubkey, 'vouch')
      await outgoing(result.group, await sealTransfer(result.group, request.pubkey, { kind: 'challenge', event: result.event }), 'Ask for a fresh key check.')
    }), 'trust-start-vouch', true))
    if (publicKey(group) === group.keeper) {
      const context = input(content, 'Account context for this check (optional, not platform verified)', 'trust-account-context', 100)
      const begin = (purpose: 'member' | 'voucher') => host.ensure(async () => {
        const result = beginCheck(getGroup(group.id), request.pubkey, purpose, context.value)
        await outgoing(result.group, await sealTransfer(result.group, request.pubkey, { kind: 'challenge', event: result.event }), 'Ask for a fresh check.')
      })
      content.append(button('Check a private vouch', () => begin('member'), 'trust-check-member'), button('Check key before trusting a voucher', () => begin('voucher'), 'trust-check-voucher'))
    }
  }
  function vouchPreview(group: Group, proof: Proof) {
    inspectProof(group, proof)
    const content = screen('What can you vouch for?', 'The fresh key proof matches. Only sign the meeting or trusted call that actually happened.')
    const form = node('form'), label = input(form, 'Name on this phone (optional)', 'trust-person-label', 40)
    const methodLabel = node('label', 'How did you check this person?'); methodLabel.htmlFor = 'trust-method'
    const method = node('select'); method.id = 'trust-method'; method.required = true
    for (const [value, caption] of [['', 'Choose what actually happened'], ['in-person', 'We met in person'], ['online', 'We checked through a trusted live call']]) { const option = node('option', caption); option.value = value; method.append(option) }
    const days = input(form, 'Vouch valid for days (1–90)', 'trust-vouch-days', 2, '30'); days.type = 'number'; days.min = '1'; days.max = '90'; days.required = true
    const issue = node('button', 'Sign a private vouch', 'primary wide'); issue.id = 'trust-issue-vouch'; issue.type = 'submit'; form.append(methodLabel, method, days.previousElementSibling!, days, issue)
    form.addEventListener('submit', event => { event.preventDefault(); const options = { method: method.value as Method, days: Number(days.value), label: label.value }; host.ensure(async () => { const result = issueVouch(getGroup(group.id), proof, options); await outgoing(result.group, await sealTransfer(result.group, proof.event.pubkey, { kind: 'vouch', event: result.event }), 'Give them your vouch.') }) })
    content.append(form, node('p', 'Signing records your judgement, not an identity-document or age check. Only the holder can decrypt this handoff; the holder can later share your signed vouch with the keeper.', 'small'))
  }
  async function process(transfer: Transfer) {
    if (transfer.kind === 'group') { groupPreview(transfer.event); return }
    const vault = host.vault()!, stamp = epoch
    screen('Opening privately.', 'Checking this exchange against your saved groups.')
    if (transfer.kind === 'key') {
      const context = field(transfer.event, 'context')
      const group = vault.trust.groups.find(g => context === 'canary:group:v1:' + g.id)
      if (!group) throw new Error('Keep the same group on this phone first. This key card is not a group invitation.')
      personPreview(group, transfer.event); return
    }
    const group = vault.trust.groups.find(g => publicKey(g) === transfer.to)
    if (!group) throw new Error('This encrypted exchange belongs to another key. Use its original phone or restore the encrypted backup.')
    const data = await openTransfer(group, transfer)
    if (stamp !== epoch || vault !== host.vault() || document.hidden) return
    if (data.kind === 'vouch') {
      receiveVouch(group, data.event)
      const content = screen('A private vouch.', `${name(group, data.event.pubkey)} recorded ${field(data.event, 'method') === 'in-person' ? 'an in-person meeting' : 'an online check'} for ${group.name}. Valid until ${date(Number(field(data.event, 'expiration')))}. Your keeper decides which vouchers to accept.`)
      content.append(button('Keep this private vouch', () => host.ensure(async () => { const next = receiveVouch(getGroup(group.id), data.event); await save(next); groupView(next) }), 'trust-keep-vouch', true))
    } else if (data.kind === 'withdrawal') {
      receiveWithdrawal(group, data.event)
      const content = screen('A vouch was withdrawn.', 'Keep the signed withdrawal so future checks on this phone use that update. Other phones need to receive it separately.')
      content.append(button('Keep signed withdrawal', () => host.ensure(async () => { const next = receiveWithdrawal(getGroup(group.id), data.event); await save(next); groupView(next) }), 'trust-keep-withdrawal', true))
    } else if (data.kind === 'challenge') {
      const challenge = readChallenge(group, data.event)
      const content = screen(field(challenge, 'purpose') === 'member' ? 'Present your private vouch.' : 'Prove this is your group key.', `A fresh request for ${group.name}. Only respond if you expected this check. It expires after ten minutes.`)
      if (field(challenge, 'purpose') === 'vouch') content.append(node('p', 'Voucher code: ' + keyCode(challenge.pubkey) + '. Compare this with the person checking you, in person or on your trusted call.', 'notice'))
      if (challenge.content) content.append(node('p', 'Keeper-supplied account context: ' + challenge.content, 'notice'))
      content.append(button('Respond to this check', () => host.ensure(async () => {
        const current = getGroup(group.id), proof = answerCheck(current, challenge)
        await outgoing(current, await sealTransfer(current, challenge.pubkey, proof), 'Return this to the keeper.')
      }), 'trust-answer-check', true), node('p', 'This proves control of this group key. It does not independently prove control of a WhatsApp, Telegram or other messaging account.', 'small'))
    } else {
      const result = inspectProof(group, data)
      if (result.purpose === 'member') {
        const next = acceptProof(group, data); await save(next); groupView(next)
      } else if (result.purpose === 'vouch') {
        vouchPreview(group, data)
      } else {
        const content = screen('Choose whether to trust.', 'The fresh key proof matches. Accepting this person’s vouches is your separate decision. Check the person and code through a trusted channel first.')
        const code = node('div', '', 'compare'); code.append(node('span', 'Voucher code'), node('strong', keyCode(result.subject))); content.append(code)
        const form = node('form'), label = input(form, 'A name for this accepted voucher', 'trust-voucher-label', 40); label.required = true
        const accept = node('button', 'Trust this voucher for this group', 'primary wide'); accept.id = 'trust-accept-voucher'; accept.type = 'submit'; form.append(accept)
        form.addEventListener('submit', event => { event.preventDefault(); const value = label.value; host.ensure(async () => { const next = acceptProof(getGroup(group.id), data, value); await save(next); groupView(next) }) }); content.append(form)
      }
    }
  }
  function receive(input: string) {
    const stamp = epoch
    void (async () => {
      const token = input.startsWith('#trust=') ? input.slice(7) : transferToken(input, location.origin + location.pathname)
      const transfer = await unpackTransfer(token)
      if (stamp !== epoch || document.hidden) return
      if (transfer.kind === 'group') groupPreview(transfer.event)
      else host.ensure(async () => process(transfer))
    })().catch(e => { if (stamp === epoch) host.error(e instanceof Error ? e.message : 'This private code could not be opened.') })
  }
  return { home, receive, stopScan, clear() { epoch++; stopScan(); root.replaceChildren() } }
}
