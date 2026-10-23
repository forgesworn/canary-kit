import { drawQr } from './qr.js'
import { newDeviceRequest, makeDeviceCopy, openDeviceCopy, deviceCode, deviceLink, deviceToken, deviceInput, mergePeople, DEVICE_FILE_LIMIT, type DeviceRequest, type Devices } from './device-transfer.js'
import type { Vault, Entry } from './vault.js'
interface Host {
  vault(): Vault | null
  hasRecord(): boolean
  ensure(task: () => Promise<void>): void
  save(entries: Entry[], devices: Devices): Promise<void>
  show(): void
  scan(): void
  home(): void
  error(message: string): void
}
const now = () => Math.floor(Date.now()/1000)
export function mountDevices(root: HTMLElement, host: Host) {
  let epoch = 0, incoming: string | undefined
  const urls = new Set<string>()
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = '') {
    const element = document.createElement(tag); element.textContent = text; if (cls) element.className = cls; return element
  }
  function button(id: string, text: string, callback: () => void, cls = 'secondary wide') {
    const b = node('button',text,cls); b.id=id;b.type='button';b.addEventListener('click',callback);return b
  }
  function base(title: string, lead: string) {
    root.replaceChildren(button('device-back','← Your people',host.home,'text-button back'),node('p','Your people · another device','eyebrow'),node('h1',title),node('p',lead,'lead'))
    host.show()
  }
  function note(text: string) { root.append(node('p',text,'small')) }
  function code(file: string) { const card=node('div','','compare');card.append(node('p','Compare on both screens · stays the same','small')); const value=node('strong',deviceCode(file));value.id='device-code';card.append(value);root.append(card) }
  function clear() {
    epoch++;incoming=undefined
    // Pending download URLs contain recipient-encrypted bytes only and expire
    // after 60 seconds, so background locking cannot interrupt an OS handoff.
    root.replaceChildren()
  }
  function home() {
    base('Your people.\nOn your other device.','Copy the people you’ve already set up. Keep checking them from your phone or desktop.')
    const state=host.vault()?.devices
    if(state?.receive) root.append(button('device-resume-receive','Continue receiving on this device',()=>host.ensure(async()=>receiving())))
    if(state?.send) root.append(button('device-resume-send','Continue sending this copy',()=>host.ensure(async()=>sending())))
    root.append(button('device-start-receive','Bring my people here',()=>host.ensure(async()=>{
      const active=host.vault()!
      if(active.devices?.receive && now() <= active.devices.receive.request.expires) {receiving();return}
      const receive=newDeviceRequest()
      await host.save(active.entries,{...active.devices,receive});receiving()
    }),'primary wide'))
    root.append(button('device-start-send','Copy from this device',()=>host.ensure(async()=>{
      base('Open Canary\non your other device.','Choose “Bring my people here” there. Then scan its QR here, using your camera inside Canary.')
      root.append(button('device-scan','Scan the other device’s QR',host.scan,'primary wide'));paste()
      note('Your saved people stay here. This copies completed pairs and their contact notes; private groups and unfinished setup stay on this device.')
    })))
    note('This is a copy, with no automatic sync. Each device has its own unlock. Nothing is deleted from the original device.')
  }
  function paste() {
    const details=node('details'), summary=node('summary','Use a request link instead'), form=node('form'), label=node('label','The other device’s request link'), input=node('textarea')
    label.htmlFor='device-request-input';input.id='device-request-input';input.maxLength=3000;input.rows=3;input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.required=true
    const submit=node('button','Open request','secondary wide');submit.type='submit'
    form.append(label,input,submit);form.addEventListener('submit',event=>{event.preventDefault();receive(input.value.trim())});details.append(summary,form);root.append(details)
  }
  function receiving() {
    const receive=host.vault()?.devices?.receive
    if(!receive){home();return}
    if(now()>receive.request.expires){base('Show a fresh QR.','This request has expired. Your saved people are unchanged.');root.append(button('device-renew','Show a new QR',()=>host.ensure(async()=>{const active=host.vault()!;await host.save(active.entries,{...active.devices,receive:newDeviceRequest()});receiving()}),'primary wide'));return}
    base('Bring your people here.','On the device that already has your people, open Canary → Add another device → Copy from this device → Scan QR.')
    const address=location.origin+location.pathname
    const link=location.protocol==='https:'?deviceLink(receive.request,address):deviceToken(receive.request)
    const layout=node('div','','device-receive-grid'),left=node('div'),right=node('div');layout.append(left,right);root.append(layout)
    const frame=node('div','','qr-frame device-qr'), canvas=node('canvas');canvas.id='device-request-qr';canvas.setAttribute('aria-label','Public request for an encrypted copy to this device');frame.append(canvas);left.append(frame);drawQr(canvas,link,'L')
    left.append(node('p','This QR contains a public receiving key, not your people. It lasts 15 minutes; there is no race against the spoken words.','small'))
    const details=node('details'),summary=node('summary','Copy the request link'),input=node('textarea');input.id='device-request-link';input.value=link;input.readOnly=true;input.rows=3;details.append(summary,input,button('device-copy-request','Copy request',()=>{
      void navigator.clipboard.writeText(link).catch(()=>host.error('Select the request link above and copy it.'))
    }));left.append(details)
    const drop=node('div','','device-drop'), file=node('input');file.type='file';file.id='device-copy-file';file.accept='application/json,.json';file.hidden=true
    const load=async(selected?:File)=>{
      if(!selected)return
      const stamp=epoch
      try {
        if(selected.size>DEVICE_FILE_LIMIT)throw new Error('This file is too large to be a Canary people copy.')
        const text=await selected.text()
        if(stamp!==epoch||document.hidden)return
        host.ensure(async()=>preview(text))
      }catch(e){if(stamp===epoch)host.error(e instanceof Error?e.message:'The copy could not be opened.')}
    }
    file.addEventListener('change',()=>{const selected=file.files?.[0];file.value='';void load(selected)})
    drop.append(node('h2','Then open the copy they send.'),node('p','Use AirDrop, your usual chat or a file transfer. On a desktop you can also drop the encrypted file here.','small'),button('device-pick-copy','Open encrypted copy',()=>file.click(),'primary wide'),file)
    drop.addEventListener('dragover',event=>{event.preventDefault()});drop.addEventListener('drop',event=>{event.preventDefault();if(event.dataTransfer?.files.length===1)void load(event.dataTransfer.files[0]);else host.error('Drop one Canary encrypted copy at a time.')});right.append(drop)
    root.append(button('device-cancel-receive','Cancel this receiving request',()=>host.ensure(async()=>{const active=host.vault()!;const devices={...active.devices};delete devices.receive;await host.save(active.entries,devices);home()}),'text-button'))
    note('Your existing people and unlock protection are kept. You’ll compare a code and review the names before anything is imported.')
  }
  function receive(input: string) {
    try {
      const request=deviceInput(input,location.origin+location.pathname)
      if(now()<request.created-30||now()>request.expires)throw new Error('This device request has expired or the clocks differ. Show a new QR on the receiving device.')
      const active=host.vault()
      if(active){choose(request);return}
      base('Use your saved\npeople here.','Unlock the Canary app where your people are already saved. This request asks that app for an encrypted copy.')
      if(host.hasRecord())root.append(button('device-unlock-source','Unlock my people',()=>host.ensure(async()=>choose(request)),'primary wide'))
      else note('No saved people were found in this browser. Open your usual Canary home-screen app, choose Add another device → Copy from this device, and paste this request there.')
      const area=node('textarea');area.readOnly=true;area.id='device-source-link';area.value=location.protocol==='https:'?deviceLink(request,location.origin+location.pathname):deviceToken(request);area.rows=3;root.append(area)
      root.append(button('device-copy-source-link','Copy this request',()=>{void navigator.clipboard.writeText(area.value).catch(()=>host.error('Select the request above and copy it.'))}))
    }catch(e){host.error(e instanceof Error?e.message:'This device request could not be read.')}
  }
  function choices(entries:Entry[], container:HTMLElement) {
    const inputs:HTMLInputElement[]=[]
    entries.forEach((entry,index)=>{const label=node('label','','device-person'),input=node('input');input.type='checkbox';input.checked=true;input.value=String(index);const text=node('span',entry.label);label.append(input,text);container.append(label);inputs.push(input)})
    return ()=>inputs.flatMap((input,index)=>input.checked?[entries[index]]:[])
  }
  function choose(request:DeviceRequest) {
    const active=host.vault();if(!active)return
    const entries=active.entries.filter(e=>!e.setup)
    base('Choose your people.','Only send to a device you own and trust. Unlock the receiving device and check that this is its request.')
    if(!entries.length){note('No completed pairs on this device yet. Finish setup with someone before copying them.');return}
    const form=node('form'),list=node('div','','device-people'),selected=choices(entries,list),submit=node('button','Make encrypted copy','primary wide');submit.id='device-make-copy';submit.type='submit'
    form.append(list,submit);form.addEventListener('submit',event=>{event.preventDefault();const chosen=selected();host.ensure(async()=>{
      const current=host.vault()!
      if(chosen.some(e=>!current.entries.some(saved=>saved.id===e.id&&saved.pair.mnemonic===e.pair.mnemonic&&!saved.setup)))throw new Error('Your saved people changed. Choose them again.')
      const sent=makeDeviceCopy(request,chosen)
      await host.save(current.entries,{...current.devices,send:{file:sent.file,count:sent.count}});sending()
    })});root.append(form)
    note('Includes the selected pair secrets and contact notes. Your unlock PIN/passphrase, group keeper keys and unfinished exchanges are not copied.')
  }
  function sending() {
    const send=host.vault()?.devices?.send
    if(!send){home();return}
    const packet=JSON.parse(send.file)
    if(now()>packet.expires){base('This copy has expired.','Show a new QR on the receiving device, then make a fresh copy. Your original people are unchanged.');root.append(button('device-clear-expired','Remove expired copy',()=>host.ensure(async()=>{const active=host.vault()!;const devices={...active.devices};delete devices.send;await host.save(active.entries,devices);home()})));return}
    base('Send your\nencrypted copy.',`${send.count} ${send.count===1?'person is':'people are'} ready. Share this file to your other device. Open it there, then compare the code below on both screens.`)
    code(send.file)
    const file=new File([send.file],'canary-people-copy.canary.json',{type:'application/json'})
    let canShare=false;try{canShare=!!navigator.canShare?.({files:[file]})}catch{}
    if(canShare)root.append(button('device-share-file','Share encrypted copy',()=>{
      const stamp=epoch
      void navigator.share({files:[file],title:'Canary encrypted people copy'}).catch(e=>{if(stamp===epoch&&e?.name!=='AbortError')host.error('Sharing did not finish. Save the encrypted file instead.')})
    },'primary wide'))
    root.append(button('device-download-file',canShare?'Save encrypted file instead':'Save encrypted file',()=>{
      const url=URL.createObjectURL(file);urls.add(url);const a=node('a');a.href=url;a.download=file.name;a.click()
      // Keep the download alive if the OS opens another app; it contains only ciphertext.
      setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url)},60_000)
    },canShare?'secondary wide':'primary wide'))
    note('Choose AirDrop, your usual chat or a file transfer. The file is encrypted for the device that showed the QR. No recovery passphrase is needed for this copy.')
    root.append(button('device-finish-send','I’ve finished on the other device',()=>host.ensure(async()=>{const active=host.vault()!;const devices={...active.devices};delete devices.send;await host.save(active.entries,devices);base('Your original\npeople are kept.','The copy has been removed from this app. Your existing people are unchanged.');note('This does not delete a file already saved or shared. Each device works independently; changes do not sync automatically.');root.append(button('device-sender-done','Back to my people',host.home,'primary wide'))})))
    note('You can switch apps and unlock Canary to continue this same copy. Only finish here after checking that the receiving device saved your people.')
  }
  function preview(file:string) {
    const active=host.vault(),receive=active?.devices?.receive
    if(!active||!receive)throw new Error('This device has no receiving request. Show its QR first, then send a fresh copy.')
    const entries=openDeviceCopy(receive,file)
    incoming=file
    base('Check the code.\nKeep your people.','Compare this code with the sending device. Only import if all three groups match.')
    code(file)
    const form=node('form'),list=node('div','','device-people'),selected=choices(entries,list),label=node('label','','checkbox'),check=node('input');check.type='checkbox';check.id='device-codes-match';check.required=true;label.append(check,node('span','The code matches the sending device.'))
    const submit=node('button','Add selected people','primary wide');submit.id='device-import-people';submit.type='submit';form.append(label,list,submit)
    const hint=node('p','','small');const update=()=>{
      try{const result=mergePeople(host.vault()?.entries??[],selected());hint.textContent=`${result.added} to add · ${result.skipped} already here. Existing names, notes and unlock protection are kept.`}
      catch(e){hint.textContent=e instanceof Error?e.message:'Select people to import.'}
    };form.addEventListener('change',update);update();root.append(hint,form)
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!check.checked)return
      const chosen=selected(),stamp=epoch
      host.ensure(async()=>{
        const current=host.vault()!,pending=current.devices?.receive
        if(stamp!==epoch||incoming!==file||!pending||pending.request.id!==receive.request.id)throw new Error('The receiving request changed. Open the copy again.')
        const checked=openDeviceCopy(pending,file)
        if(!chosen.length)throw new Error('Choose at least one person to import.')
        const selectedChecked=checked.filter(e=>chosen.some(c=>c.id===e.id))
        const result=mergePeople(current.entries,selectedChecked),devices={...current.devices};delete devices.receive
        await host.save(result.entries,devices)
        incoming=undefined
        base('Ready on\nthis device.',`${result.added} ${result.added===1?'person added':'people added'}${result.skipped?` · ${result.skipped} already here`:''}. Your existing people and unlock protection are kept.`)
        root.append(button('device-receiver-done','Open my people',host.home,'primary wide'))
        note('Check someone’s words here before relying on the copy. The original device keeps its people too. Later changes do not sync automatically.')
        const help=node('details');help.append(node('summary','Replacing an old device?'),node('p','Confirm the new device opens your people, set up its recovery backup, then remove data from the old device yourself when you are ready. This copy does not erase or revoke any other copy.'));root.append(help)
      })
    })
    note('No groups, unlock credentials or unfinished exchanges will be imported. This is a copy, not a new identity verification.')
    root.append(button('device-preview-back','Choose a different file',()=>{incoming=undefined;receiving()},'text-button'))
  }
  for(const id of ['devices-welcome','devices-people'])document.getElementById(id)!.addEventListener('click',()=>{clear();home()})
  return {home,receive,clear}
}
