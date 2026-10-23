import { newGroup, groupCard, describeGroup, joinGroup, keyCard, readKeyCard, issueVouch, receiveVouch, beginCheck, readChallenge, answerCheck, inspectProof, acceptProof, withdrawVouch, receiveWithdrawal, forgetVoucher, keyCode, publicKey, timeNow, pendingChecks, cancelCheck, saveHandoff, claimName, currentVouches, type Handoff, type Group, type Transfer, type TrustState, type Signed, type Method, type Proof, text } from './trust.js'
import { packTransfer, unpackTransfer, sealTransfer, openTransfer, transferLink, transferToken } from './trust-wire.js'
import { drawQr, QrScanner } from './qr.js'
import type { Vault } from './vault.js'
import { vouchSummary, knownPeople, exchangeHint, personName } from './vouch-view.js'

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
    root.append(b, node('p', 'Signet Vouch · private by choice', 'eyebrow'), node('h1', title), node('p', lead, 'lead'))
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
  function name(group: Group, pubkey: string) { return personName(group,pubkey) }
  function journey(content:HTMLElement,step:number) {
    const list=node('ol','','vouch-steps');list.setAttribute('aria-label','Vouch exchange progress')
    for(const [i,label]of ['Compare codes','Fresh reply','Sign what happened','Keep the vouch'].entries()){const item=node('li',label);if(i+1===step)item.setAttribute('aria-current','step');list.append(item)}
    content.append(list)
  }
  function receiptCard(group:Group,event:Signed) {
    const info=vouchSummary(group,event,timeNow()),card=node('article','','vouch-receipt')
    const label=info.state==='active'?'Current signed vouch':info.state==='expired'?'Expired vouch':info.state==='withdrawn'?'Withdrawn vouch':'Unusable signed claim'
    card.dataset.vouchState=info.state;if(info.state==='active')card.dataset.expires=String(info.expires);card.append(node('span',label,'vouch-badge'),node('h2',`Vouched by ${info.label}`))
    if(info.state!=='invalid')card.append(node('p',`${info.method} · recorded ${date(info.at)}`),node('p',`For ${group.name} · ${info.state==='expired'?'expired':'expires'} ${date(info.expires)}`,'small'))
    if(info.state!=='invalid')card.append(node('p',info.knownAs?`Signed name for this group: ${info.knownAs}`:'Meeting record only · no agreed name was signed.','notice small'))
    card.append(node('p','A signed observation. The group keeper chooses whose vouches to accept.','small'));return card
  }
  function myVouches(group:Group) {
    const content=screen('Your vouches.',`Private evidence for ${group.name}. Present a fresh key proof when the keeper asks.`,()=>groupView(getGroup(group.id)))
    content.append(button('Show my verification QR',()=>host.ensure(async()=>outgoing(getGroup(group.id),{kind:'key',event:keyCard(getGroup(group.id))},'Show your verification code.')),'trust-my-vouch-qr',true))
    if(!group.received.length)content.append(node('div','No vouches kept yet. Show your QR to someone who knows you. They check your key before signing a private vouch.','empty-card'))
    for(const event of group.received)content.append(receiptCard(group,event))
    content.append(node('p','This device knows only the withdrawals it has received. A current vouch is not a fresh identity or account check.','small'))
  }
  async function outgoing(group: Group, transfer: Transfer, title = 'Let them scan this.', exchange?: {id:string;peer?:string}) {
    const id=exchange?.id??(transfer.kind==='sealed'?'handoff:'+transfer.to:transfer.kind)
    const saved = saveHandoff(group,transfer,title,id,exchange?.peer??(transfer.kind==='sealed'?transfer.to:undefined))
    await save(saved)
    await showOutgoing(saved, transfer, title)
  }
  async function showOutgoing(group: Group, transfer: Transfer, title = 'Continue your exchange.') {
    const stamp = epoch, active = host.vault()
    const token = await packTransfer(transfer)
    if (stamp !== epoch || active !== host.vault() || document.hidden) return
    const payload = location.protocol === 'https:' ? transferLink(token, location.origin + location.pathname) : token
    const content = screen(title, transfer.kind === 'group' ? 'Send this group card first. Compare the keeper code together before keeping it.' : transfer.kind === 'key' ? 'Show or send this verification code to the person vouching for you. You both need the same group first.' : 'Send this private link in your chat, or let the other person scan. Then return here after their reply.', () => groupView(getGroup(group.id)))
    if(group.pending&&field(group.pending,'purpose')==='vouch')journey(content,2)
    else if(title.includes('vouch'))journey(content,4)
    const frame = node('div', '', 'qr-frame trust-qr'), canvas = node('canvas'); canvas.id = 'trust-qr'; canvas.setAttribute('aria-label', 'Private group exchange QR'); frame.append(canvas); content.append(frame)
    try { drawQr(canvas, payload, 'L') }
    catch { frame.hidden = true; content.append(node('p', 'This exchange is larger than a QR. Copy its encrypted link instead.', 'small notice')) }
    const ownCode = node('div', '', 'compare'); ownCode.append(node('span', 'Your verification code'), node('strong', keyCode(publicKey(group)))); content.append(ownCode)
    const l = node('label', 'Private exchange link'); l.htmlFor = 'trust-output'
    const output = node('textarea'); output.id = 'trust-output'; output.readOnly = true; output.value = payload; output.rows = 2; output.spellcheck = false
    content.append(l, output, button('Copy private link', () => { void navigator.clipboard?.writeText(payload).then(() => host.status('Copied. Share only with the intended person.')).catch(() => { output.select(); host.status('Select and copy the link above.') }) }))
    if (navigator.share && location.protocol === 'https:') content.append(button('Share in our chat', () => { void navigator.share({ title: 'Private Signet Vouch exchange', url: payload }).catch(() => {}) },'',true))
    content.append(node('p', 'Your exchange is saved encrypted on this phone. If you leave the page, unlock this group and tap Continue exchange. Other apps and recipients can retain links you deliberately share.', 'small'))
  }
  function home(intent:'groups'|'vouch'|'show'='groups') {
    const groups=host.vault()?.trust.groups??[]
    const content = screen(intent==='vouch'?'Vouch for someone.':intent==='show'?'Show your vouches.':'Your private groups.', groups.length?'Choose the group this vouch belongs to. People and trust choices stay private to each group.':'Start with a group you share: family, friends or a club. No account or public profile.', host.home)
    for (const group of groups) {
      content.append(button(group.name, () => intent==='show'?myVouches(group):groupView(group)))
      content.append(node('p',`${knownPeople(group,timeNow()).length} saved people · ${group.received.length} signed ${group.received.length===1?'vouch':'vouches'} kept`,'small group-meta'))
    }
    content.append(button('I have a group or verification code',scanView,'trust-open-code',!groups.length))
    const createDetails=node('details');createDetails.open=!groups.length;createDetails.append(node('summary','Start a private group'))
    const form = node('form'); form.id = 'trust-new-group-form'
    const groupName = input(form, 'A name for your group', 'trust-group-name', 40); groupName.required = true
    const create = node('button', 'Create a private group', 'primary wide'); create.id = 'trust-create-group'; create.type = 'submit'; form.append(create)
    form.addEventListener('submit', event => { event.preventDefault(); const value = groupName.value; host.ensure(async () => { const group = newGroup(value); await save(group); groupView(group) }) })
    createDetails.append(form);content.append(createDetails,node('p','A vouch records who checked a key, how and when. The keeper makes the group decision. Spoken words and messaging accounts need their own checks.','small'))
  }
  function groupView(group: Group) {
    const keeper = publicKey(group) === group.keeper
    const content = screen(group.name, keeper ? 'You keep this group. Choose whose vouches you accept.' : 'Your key and private vouches for this group stay in your encrypted vault.')
    const code = node('div', '', 'compare'); code.append(node('span', 'Keeper code'), node('strong', keyCode(group.keeper))); content.append(code)
    if (keeper) content.append(button('Share group card', () => host.ensure(async () => outgoing(group, { kind: 'group', event: groupCard(getGroup(group.id)) }, 'Share your group.')), 'trust-share-group'))
    content.append(button('Vouch for someone · scan their code',scanView,'trust-open-code',true),button('Show my verification QR', () => host.ensure(async () => outgoing(group, { kind: 'key', event: keyCard(getGroup(group.id)) }, 'Your group key.')), 'trust-my-key'),button('Show my vouches',()=>myVouches(getGroup(group.id)),'trust-show-vouches'))
    const handoffs: Handoff[]=[...(group.handoffs??[]),...(group.outgoing?[{id:'legacy',title:'Continue your saved exchange.',transfer:group.outgoing}]:[])]
    const requests=pendingChecks(group)
    for(const request of requests)if(!handoffs.some(h=>h.id===request.id))handoffs.push({id:request.id,title:'Ask for a fresh check.',peer:field(request,'p'),transfer:{kind:'key',event:keyCard(group)}})
    if(handoffs.length){
      const exchanges=node('section','','saved-exchanges');exchanges.append(node('h2','Saved exchanges'))
      for(const [index,handoff]of handoffs.entries()){
        const pending=requests.find(e=>e.id===handoff.id),expired=pending&&Number(field(pending,'expiration'))<=timeNow(),card=node('div','','trust-card')
        const state=node('p',pending?(expired?'Request expired · start a fresh check':'Waiting for their reply'):handoff.title,'small')
        if(pending&&!expired){state.dataset.expires=field(pending,'expiration');state.dataset.expiredText='Request expired · start a fresh check'}
        card.append(node('strong',handoff.peer?name(group,handoff.peer):'Your group card'),state)
        card.append(button(expired?'Start a fresh check':'Continue exchange',()=>host.ensure(async()=>{
          const current=getGroup(group.id),request=pendingChecks(current).find(e=>e.id===handoff.id)
          if(request&&Number(field(request,'expiration'))<=timeNow()){personView(current,field(request,'p'));host.status('Start a fresh check. Other saved exchanges stay ready.');return}
          if(request){const saved=current.handoffs?.find(h=>h.id===handoff.id);await showOutgoing(current,saved?.transfer??await sealTransfer(current,field(request,'p'),{kind:'challenge',event:request}),handoff.title);return}
          if(handoff.transfer.kind==='key'&&Number(field(handoff.transfer.event,'expiration'))<=timeNow()){await outgoing(current,{kind:'key',event:keyCard(current)},'Your fresh verification code.');return}
          await showOutgoing(current,handoff.transfer,handoff.title)
        }),index===0?'trust-resume':'',false))
        card.append(button('Remove this exchange',()=>host.ensure(async()=>{
          if(!confirm('Remove this saved handoff? A pending reply to this check will no longer be accepted. Other people’s exchanges stay ready.'))return
          let current=getGroup(group.id)
          if(pendingChecks(current).some(e=>e.id===handoff.id))current=cancelCheck(current,handoff.id)
          current={...current,handoffs:current.handoffs?.filter(h=>h.id!==handoff.id),...(handoff.id==='legacy'?{outgoing:undefined}:{})};await save(current);groupView(current)
        })))
        exchanges.append(card)
      }
      content.append(exchanges)
    }
    if (group.lastCheck) {
      const check = group.lastCheck
      const last = node('p', `Key proof checked ${date(check.at)}${check.issuer ? ` · vouch by ${name(group, check.issuer)}` : ' · voucher key'}.${check.knownAs?` Signed group name: ${check.knownAs}.`:''}${check.account ? ` Context supplied by you: ${check.account}.` : ''} Historical check using this phone’s latest known state. It does not automatically admit or verify an account in another app.`, 'small notice'); last.id = 'trust-last-check'; content.append(last)
    }
    const people=knownPeople(group,timeNow())
    if(people.length){const roster=node('section','','vouch-roster');roster.append(node('h2','People saved for this group'))
      for(const person of people){const card=button('',()=>personView(getGroup(group.id),person.pubkey));card.className='person-card vouch-person';card.dataset.personKey=person.pubkey
        const text=node('span','','person-text'),hint=node('small',person.vouch?`Your vouch · ${person.vouch.state==='active'?'current':person.vouch.state}`:person.received?'Vouched for you':person.accepted?'Chosen voucher for this group':'Saved group key');if(person.vouch?.state==='active'){hint.dataset.expires=String(person.vouch.expires);hint.dataset.expiredText='Your vouch · expired'}text.append(node('strong',person.label),hint);card.append(text,node('span','↗'));roster.append(card)}content.append(roster)}
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
    readKeyCard(group,request)
    personView(group,request.pubkey)
  }
  function personView(group:Group,subject:string) {
    const label=name(group,subject),content=screen(label.startsWith('Key ')?'Check this person.':label,`A separate verification key for ${group.name}. Compare their code in person or on an already trusted call.`,()=>groupView(getGroup(group.id)))
    journey(content,1)
    const code=node('div','','compare');code.append(node('span','Their verification code'),node('strong',keyCode(subject)));content.append(code)
    const context=input(content,'Account or call context (optional, your observation)','trust-account-context',100)
    const previousVouch=group.issued.find(e=>field(e,'p')===subject)
    const agreedName=input(content,'Name you both agree to share for this group','trust-known-as',40,previousVouch?claimName(previousVouch)??'':'')
    content.append(node('p','For a vouch, they approve this name before replying. It is shared with them and, when they present it, the keeper. Your private labels stay separate.','small'))
    const begin=(purpose:'vouch'|'member'|'voucher')=>{const account=context.value,knownAs=agreedName.value;host.ensure(async()=>{
      const current=getGroup(group.id)
      const previous=pendingChecks(current).find(e=>field(e,'p')===subject&&field(e,'purpose')===purpose)
      if(previous&&Number(field(previous,'expiration'))>timeNow()&&!confirm('Replace this person’s unfinished check? Their old reply will no longer be accepted. Other people’s checks stay ready.'))return
      const result=beginCheck(current,subject,purpose,account,timeNow(),purpose==='vouch'?text(knownAs,40):undefined)
      await outgoing(result.group,await sealTransfer(result.group,subject,{kind:'challenge',event:result.event}),purpose==='vouch'?'Ask for a fresh key check.':'Ask for a fresh group check.',{id:result.event.id,peer:subject})
    })}
    content.append(button('Check their key before vouching',()=>begin('vouch'),'trust-start-vouch',true))
    if(publicKey(group)===group.keeper)content.append(button('Check their vouch for this group',()=>begin('member'),'trust-check-member'),button('Check before accepting their vouches',()=>begin('voucher'),'trust-check-voucher'))
    const form=node('form'),alias=input(form,'Name on this device','trust-alias',40,group.people?.find(p=>p.pubkey===subject)?.label??'');alias.required=true
    const saveName=node('button','Save this name','secondary wide');saveName.type='submit';form.append(saveName)
    form.addEventListener('submit',event=>{event.preventDefault();const value=alias.value;host.ensure(async()=>{const current=getGroup(group.id),people=[...(current.people??[]).filter(p=>p.pubkey!==subject),{pubkey:subject,label:text(value,40)}];if(people.length>64)throw new Error('This group has reached its saved-name limit.');const next={...current,people};await save(next);personView(next,subject)})})
    const details=node('details');details.append(node('summary','Save a name for next time'),form);content.append(details,node('p','This name is your private label. Saving it does not grant voucher authority, link a spoken pair or prove ownership of a messaging account.','small'))
    const issued=group.issued.find(e=>field(e,'p')===subject);if(issued)content.append(receiptCard(group,issued))
  }
  function vouchPreview(group: Group, proof: Proof) {
    const checked=inspectProof(group, proof)
    const content = screen('What can you vouch for?', 'The fresh key proof matches. Only sign the meeting or trusted call that actually happened.')
    journey(content,3)
    content.append(node('p',checked.knownAs?`For ${group.name}, I know the person holding this key as ${checked.knownAs}. They approved this name in their signed reply.`:'This older request records a meeting only. Start a new check to agree a group name.','notice'))
    const form = node('form'), label = input(form, 'Name on this device (optional)', 'trust-person-label', 40,group.people?.find(p=>p.pubkey===proof.event.pubkey)?.label??'')
    const methodLabel = node('label', 'How did you check this person?'); methodLabel.htmlFor = 'trust-method'
    const method = node('select'); method.id = 'trust-method'; method.required = true
    for (const [value, caption] of [['', 'Choose what actually happened'], ['in-person', 'We met in person'], ['online', 'We checked through a trusted live call']]) { const option = node('option', caption); option.value = value; method.append(option) }
    const days = input(form, 'Vouch valid for days (1–90)', 'trust-vouch-days', 2, '30'); days.type = 'number'; days.min = '1'; days.max = '90'; days.required = true
    const issue = node('button', 'Sign a private vouch', 'primary wide'); issue.id = 'trust-issue-vouch'; issue.type = 'submit'; form.append(methodLabel, method, days.previousElementSibling!, days, issue)
    form.addEventListener('submit', event => { event.preventDefault(); const options = { method: method.value as Method, days: Number(days.value), label: label.value }; host.ensure(async () => { const result = issueVouch(getGroup(group.id), proof, options); await outgoing(result.group, await sealTransfer(result.group, proof.event.pubkey, { kind: 'vouch', event: result.event }), 'Give them your vouch.',{id:checked.requestId,peer:checked.subject}) }) })
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
      journey(content,4)
      content.append(receiptCard(group,data.event))
      const issuerName=input(content,'Who vouched for you? Name on this device (optional)','trust-issuer-name',40,group.people?.find(p=>p.pubkey===data.event.pubkey)?.label??'')
      content.append(button('Keep this private vouch', () => {const label=issuerName.value;host.ensure(async () => {
        let next=receiveVouch(getGroup(group.id),data.event)
        if(label.trim()){const people=[...(next.people??[]).filter(p=>p.pubkey!==data.event.pubkey),{pubkey:data.event.pubkey,label:text(label,40)}];if(people.length>64)throw new Error('This group has reached its saved-name limit.');next={...next,people}}
        await save(next);groupView(next)
      })}, 'trust-keep-vouch', true),node('p','A name helps you recognise this key. It does not make its vouches accepted by the keeper.','small'))
    } else if (data.kind === 'withdrawal') {
      receiveWithdrawal(group, data.event)
      const content = screen('A vouch was withdrawn.', 'Keep the signed withdrawal so future checks on this phone use that update. Other phones need to receive it separately.')
      content.append(button('Keep signed withdrawal', () => host.ensure(async () => { const next = receiveWithdrawal(getGroup(group.id), data.event); await save(next); groupView(next) }), 'trust-keep-withdrawal', true))
    } else if (data.kind === 'challenge') {
      const challenge = readChallenge(group, data.event)
      const content = screen(field(challenge, 'purpose') === 'member' ? 'Present your private vouch.' : 'Prove this is your group key.', `A fresh request for ${group.name}. Only respond if you expected this check. It expires after ten minutes.`)
      if (field(challenge, 'purpose') === 'vouch') content.append(node('p', 'Voucher code: ' + keyCode(challenge.pubkey) + '. Compare this with the person checking you, in person or on your trusted call.', 'notice'))
      if (challenge.content) content.append(node('p', 'Keeper-supplied account context: ' + challenge.content, 'notice'))
      const knownAs=claimName(challenge)
      if(knownAs)content.append(node('p',`They propose: “For ${group.name}, I know this person as ${knownAs}.” Continue only if you agreed this name with them. The signed name may be shown to the group keeper.`,'notice'))
      let chosen:HTMLSelectElement|undefined
      if(field(challenge,'purpose')==='member'){
        const label=node('label','Choose the vouch to present');label.htmlFor='trust-credential';chosen=node('select');chosen.id='trust-credential'
        for(const credential of currentVouches(group)){const option=node('option',`${name(group,credential.pubkey)} · ${claimName(credential)??'meeting record, no signed name'}`);option.value=credential.id;chosen.append(option)}
        content.append(label,chosen,node('p','Only the selected signed vouch is sent to your keeper.','small'))
      }
      content.append(button(knownAs?'Agree this name & reply':'Respond to this check', () => {const credential=chosen?.value;host.ensure(async () => {
        const current = getGroup(group.id), proof = answerCheck(current, challenge,timeNow(),credential)
        await outgoing(current, await sealTransfer(current, challenge.pubkey, proof), 'Return this to the person checking you.',{id:challenge.id,peer:challenge.pubkey})
      })}, 'trust-answer-check', true), node('p', 'This proves control of this group key. It does not independently prove control of a WhatsApp, Telegram or other messaging account.', 'small'))
    } else {
      const result = inspectProof(group, data)
      if (result.purpose === 'member') {
        const content=screen('Review this introduction.','The fresh key proof matches a vouch from a voucher you chose. You decide what to do in your group.')
        content.append(receiptCard(group,data.credential!),node('p',result.knownAs?`Their voucher knows this key’s holder as ${result.knownAs} in ${group.name}.`:'This is a meeting record without a signed name. Confirm who the holder claims to be separately.','notice'))
        if(result.account)content.append(node('p',`Your account observation: ${result.account}`,'small'))
        content.append(node('p','The reply can be forwarded in real time. This does not establish ownership of a messaging account or automatically admit anyone.','small'),button('Keep this check as evidence',()=>host.ensure(async()=>{const next=acceptProof(getGroup(group.id),data);await save(next);groupView(next)}),'trust-keep-check',true))
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
  return { home, receive, stopScan, tick() {
    if(root.hidden||document.hidden||!host.vault())return
    for(const element of root.querySelectorAll<HTMLElement>('[data-expires]'))if(Number(element.dataset.expires)<=timeNow()){
      delete element.dataset.expires
      if(element.classList.contains('vouch-receipt')){element.dataset.vouchState='expired';element.querySelector('.vouch-badge')!.textContent='Expired vouch'}
      else if(element.dataset.expiredText)element.textContent=element.dataset.expiredText
    }
  }, clear() { epoch++; stopScan(); root.replaceChildren() } }
}
