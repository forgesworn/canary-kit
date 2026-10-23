import { newMeeting, meetingCard, meetingMessage, meetingToken, meetingLink, meetingInput, matchMeeting, pairFromMeeting, type Meeting, type MeetingMessage } from './meet.js'
import { pairComparison } from './model.js'
import { text } from './trust.js'
import { QrScanner, drawQr } from './qr.js'
import type { Entry, Vault } from './vault.js'
import { nativeAvailable, nativeSaveFile, openNativeRadio, cancelNativeRadios, type NativeRadio } from './native.js'

interface Host {
  vault():Vault|null
  ensure(task:()=>Promise<void>):void
  save(entries:Entry[],meetings:Meeting[]):Promise<void>
  show():void
  home():void
  open(entry:Entry):void
  error(message:string):void
}
export function mountMeet(root:HTMLElement,host:Host){
  let epoch=0,scanner:QrScanner|null=null,current:string|undefined,facing:'user'|'environment'='user'
  let radio:NativeRadio|null=null,radioId:string|undefined,radioRevision=0,starting=false,cameraMode=false,nativeState='Keep both phones open on Connect.',stateNode:HTMLElement|undefined
  const node=<K extends keyof HTMLElementTagNameMap>(tag:K,value='',className='')=>{const n=document.createElement(tag);n.textContent=value;n.className=className;return n}
  function button(label:string,task:()=>void,id='',primary=false){const b=node('button',label,primary?'primary wide':'secondary wide');b.type='button';b.id=id;b.addEventListener('click',task);return b}
  function stopCamera(){scanner?.stop();scanner=null}
  function stopRadio(){radioRevision++;cancelNativeRadios();radio?.stop();radio=null;radioId=undefined;starting=false;stateNode=undefined}
  function stopScan(){stopCamera();stopRadio()}
  function clear(){epoch++;stopScan();current=undefined;cameraMode=false;nativeState='Keep both phones open on Connect.';root.ondragover=root.ondrop=null;root.replaceChildren()}
  function shell(title:string,lead:string){
    stopCamera();host.show();root.replaceChildren()
    const back=button('← Your people',host.home);back.className='text-button back'
    root.append(back,node('p','Connect · fully offline','eyebrow'),node('h1',title),node('p',lead,'lead'))
  }
  const find=(id:string)=>{const m=host.vault()?.meetings?.find(m=>m.id===id);if(!m)throw new Error('Unlock and open your saved connection, or start again together.');return m}
  const address=()=>nativeAvailable()?'https://canary-words.cocoacod256.chatgpt.site/':location.origin+location.pathname
  function startRadio(id:string){
    const code=()=>meetingToken(meetingMessage(find(id)))
    if(radio&&radioId===id){void radio.update(code(),!!find(id).peerReveal).catch(e=>{nativeState=e.message;if(stateNode)stateNode.textContent=nativeState});return}
    if(starting)return
    stopRadio();starting=true;const revision=radioRevision;radioId=id
    void openNativeRadio(code(),candidate,message=>{nativeState=message;if(stateNode)stateNode.textContent=message}).then(async opened=>{
      if(revision!==radioRevision||root.hidden||document.hidden||!host.vault()||current!==id||cameraMode){opened.stop();return}
      radio=opened;starting=false
      await opened.update(code(),!!find(id).peerReveal)
      const tap=root.querySelector<HTMLButtonElement>('#meet-nfc');if(tap)tap.hidden=!opened.nfc
    }).catch(e=>{if(revision===radioRevision){starting=false;nativeState=e instanceof Error?e.message:'Nearby connection unavailable. Use a camera instead.';if(stateNode)stateNode.textContent=nativeState}})
  }
  async function prepare(peer?:MeetingMessage){
    const vault=host.vault();if(!vault)return
    const meetings=vault.meetings??[]
    if(peer?.to&&!meetings.some(m=>m.id===peer.to))throw new Error('That connection is already for another device. Both open a fresh Connect screen.')
    let meeting=peer?meetings.find(m=>m.id===peer.to)??meetings.find(m=>m.peer?.id===peer.card.id&&m.peer.pub===peer.card.pub)??meetings.find(m=>!m.peer):meetings.find(m=>!m.peer)
    if(!meeting){
      if(meetings.length>=8)throw new Error('Finish or remove a saved connection first. Your people have not changed.')
      meeting=newMeeting()
      await host.save(vault.entries,[...meetings,meeting])
    }
    current=meeting.id
    if(peer)await match(peer)
    else render(meeting.id)
  }
  function start(){host.ensure(()=>prepare())}
  function receive(input:string){
    try{
      const peer=meetingInput(input,address())
      const self=host.vault()?.meetings?.find(m=>meetingCard(m).pub===peer.card.pub)
      if(self){render(self.id);host.error('That is this device’s own code. Use the other device.');return}
      shell('Connect together.','Keep a private check with the person beside you. On later calls, check each other’s two words.')
      root.append(button('Connect on this device',()=>host.ensure(()=>prepare(peer)),'meet-accept',true),node('p','The two devices exchange public codes. The shared secret is made on each device; nothing is uploaded.','small'))
    }catch(e){host.error(e instanceof Error?e.message:'This connection code could not be opened.')}
  }
  async function match(peer:MeetingMessage){
    const stamp=epoch,vault=host.vault();if(!vault||!current)return
    const meeting=matchMeeting(find(current),peer)
    const previous=vault.entries.find(e=>e.id===meeting.id)
    if(previous&&!previous.setup?.meeting)throw new Error('This connection has already finished. Open the saved person.')
    let entries=vault.entries
    if(meeting.peerReveal){const entry:Entry={id:meeting.id,label:previous?.label??'New person',pair:pairFromMeeting(meeting),setup:{method:'in-person',meeting:meeting.id}};entries=[...entries.filter(e=>e.id!==entry.id),entry]}
    await host.save(entries,(vault.meetings??[]).map(m=>m.id===meeting.id?meeting:m))
    if(stamp===epoch&&!document.hidden){render(meeting.id);if(meeting.peerReveal)navigator.vibrate?.(80)}
  }
  function candidate(input:string){
    if(root.hidden||document.hidden||!host.vault()||!current)return
    let peer:MeetingMessage
    try{peer=meetingInput(input,address())}catch{return}
    const previous=find(current)
    if(previous.peer&&previous.peer.id===peer.card.id&&previous.peer.pub===peer.card.pub&&previous.peer.commitment===peer.card.commitment&&(!peer.reveal||previous.peerReveal===peer.reveal))return
    host.ensure(async()=>{stopCamera();try{await match(peer)}catch(e){if(current&&!document.hidden)render(current);host.error(e instanceof Error?e.message:'Point at the other screen.')}})
  }
  function render(id:string){
    const meeting=find(id),stamp=epoch,code=meetingMessage(meeting)
    current=id
    const nearby=nativeAvailable()&&!cameraMode
    shell(meeting.peerReveal?'Compare your words.':nearby?'Bring your phones together.':meeting.peer?'Keep facing each other.':'Face your screens together.',meeting.peerReveal?(nearby?'Keep Connect open until the other phone has its four words too.':'Keep this code visible until the other device has its four words too.'):nearby?'Both open Connect and stay nearby. You can also start an NFC tap when one phone is Android.':'Both open Connect. Hold your screens facing each other so the front cameras can finish reading the codes.')
    const layout=node('div','','meet-layout'),optical=node('div','','meet-optical'),actions=node('div','','meet-actions')
    const frame=node('div','','qr-frame meet-qr-frame'),canvas=node('canvas');canvas.id='meet-qr';canvas.setAttribute('aria-label','Public connection code, containing no shared secret');frame.append(canvas);optical.append(frame)
    const payload=nativeAvailable()||location.protocol==='https:'?meetingLink(code,address()):meetingToken(code)
    drawQr(canvas,payload)
    optical.append(node('p','Your code stays here while the other device catches up.','small centered'))
    let nativeHelp:HTMLElement|undefined
    if(nearby){
      optical.hidden=true;layout.classList.add('native-meet-layout')
      if(!meeting.peerReveal){const phones=node('div','','native-phones');phones.setAttribute('aria-hidden','true');phones.append(node('span',''),node('span',''));actions.append(phones)}
      const controls=node('div')
      stateNode=node('p',nativeState,'notice small');stateNode.id='meet-native-state';stateNode.setAttribute('role','status');controls.append(stateNode)
      const tap=button('Tap using NFC',()=>{void radio?.readNfc().catch(e=>host.error(e.message))},'meet-nfc');tap.hidden=!!radio&&!radio.nfc
      controls.append(tap,button('Try nearby again',()=>{stopRadio();render(id)},'meet-native-again'),node('p','One person starts NFC; the other keeps Connect open. For two iPhones, use the nearby Bluetooth connection.','small'))
      if(meeting.peerReveal){nativeHelp=node('details');nativeHelp.append(node('summary','Other phone still waiting?'),controls)}else actions.append(controls)
      startRadio(id)
    }
    if(meeting.peerReveal){
      const pair=pairFromMeeting(meeting),entry=host.vault()!.entries.find(e=>e.id===meeting.id)!
      actions.append(node('p','Same four words on both devices?','small'))
      const words=node('p',pairComparison(pair),'meet-words');words.id='meet-words';actions.append(words)
      const form=node('form'),label=node('label','Their name · so you can find them next time');label.htmlFor='meet-name'
      const name=node('input');name.id='meet-name';name.maxLength=60;name.required=true;name.autocomplete='off';name.placeholder='Who are you with?';name.value=entry.label==='New person'?'':entry.label
      const save=node('button','Same words · save our check','primary wide');save.id='meet-save';save.type='submit';form.append(label,name,save)
      form.addEventListener('submit',event=>{event.preventDefault();const value=name.value;host.ensure(async()=>{
        const active=host.vault();if(!active)return
        const latest=find(id),pending=active.entries.find(e=>e.id===id)
        if(!latest.peerReveal||!pending?.setup?.meeting)throw new Error('This connection is no longer waiting to be saved.')
        const completed:Entry={...pending,label:text(value,60),evidence:{method:'in-person',at:Math.floor(Date.now()/1000)}};delete completed.setup
        await host.save(active.entries.map(e=>e.id===id?completed:e),(active.meetings??[]).filter(m=>m.id!==id))
        if(stamp===epoch&&!document.hidden){clear();host.open(completed)}
      })})
      actions.append(form,node('p','Compare together before saving. These fixed words do not rotate. Your two call words appear afterwards.','small'))
    }else if(!nearby){
      const camera=node('div','','meet-camera'),video=node('video');video.id='meet-video';video.muted=true;video.playsInline=true;video.setAttribute('aria-label','Local front camera for reading the other screen')
      const state=node('p','Reading the other screen…','small');state.id='meet-camera-state';camera.append(video,state)
      const again=button('Read codes again',()=>render(id),'meet-read-again');again.hidden=true
      actions.append(camera,again,button('Switch camera',()=>{facing=facing==='user'?'environment':'user';render(id)},'meet-flip'))
      scanner=new QrScanner(video,candidate,()=>{if(stamp===epoch&&!document.hidden){state.textContent='Camera paused. Your connection is saved. Read again when both screens are ready.';again.hidden=false}})
      void scanner.start(facing).catch(()=>{
        if(stamp!==epoch||document.hidden||root.hidden)return
        state.textContent='Camera unavailable here. Let the other device scan this code, then open its public reply file below.'
        video.hidden=true;again.hidden=false
      })
    }
    if(nativeHelp)actions.append(nativeHelp)
    const help=node('details'),summary=node('summary','Use a file instead of a camera');help.append(summary,node('p','A desktop without a camera can show its code to your phone. Send the phone’s public reply file back using AirDrop, USB or another offline transfer you choose, then open it here. The file contains no private key or shared secret.','small'))
    const file=node('input');file.type='file';file.id='meet-file';file.accept='.txt,text/plain';file.hidden=true
    const readFile=async(blob:File)=>{
      if(blob.size>2048)throw new Error('This public code file is too large.')
      const value=await blob.text();if(stamp!==epoch||current!==id||document.hidden||root.hidden)return
      meetingInput(value.trim(),address())
      candidate(value.trim())
    }
    file.addEventListener('change',()=>{const value=file.files?.[0];file.value='';if(value)void readFile(value).catch(e=>host.error(e instanceof Error?e.message:'Could not read this code.'))})
    help.append(button('Save my public code file',()=>{
      if(nativeAvailable()){void nativeSaveFile('vouch-public-code.txt',meetingToken(code),'text/plain').catch(e=>host.error(e.message));return}
      const blob=new Blob([meetingToken(code)],{type:'text/plain'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='vouch-public-code.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),30_000)
    },'meet-export'),button('Open their public code file',()=>file.click(),'meet-import'),file)
    if(navigator.share&&navigator.canShare?.({files:[new File([meetingToken(code)],'vouch-public-code.txt',{type:'text/plain'})]}))help.append(button('Share my public code file',()=>{void navigator.share({files:[new File([meetingToken(code)],'vouch-public-code.txt',{type:'text/plain'})]}).catch(()=>{})},'meet-share-file'))
    root.ondragover=event=>{event.preventDefault()};root.ondrop=event=>{event.preventDefault();const value=event.dataTransfer?.files[0];if(value)void readFile(value).catch(e=>host.error(e instanceof Error?e.message:'Could not read this code.'))}
    if(nativeAvailable())actions.append(button(nearby?'Use a camera instead':'Use nearby connection',()=>{stopScan();cameraMode=!cameraMode;render(id)},'meet-mode'))
    actions.append(help,node('p',nearby?'Connection codes travel directly between devices. Compare the words before saving. No internet or account is used.':'Camera frames stay on this device. No internet, microphone, relay or account is used for this exchange.','small'))
    layout.append(optical,actions);root.append(layout)
    root.append(button('Start again together',()=>host.ensure(async()=>{
      if(!confirm('Start this connection again? Your completed saved people stay as they are.'))return
      const active=host.vault();if(!active)return
      await host.save(active.entries.filter(e=>!(e.id===id&&e.setup?.meeting===id)),(active.meetings??[]).filter(m=>m.id!==id));await prepare()
    }),'meet-restart'))
  }
  function list(container:HTMLElement){
    container.replaceChildren()
    for(const meeting of host.vault()?.meetings??[])if(!meeting.peerReveal){const row=node('div','','pending-invite');row.append(button('Saved connection · resume',()=>render(meeting.id)),button('Remove connection',()=>host.ensure(async()=>{
      if(!confirm('Remove this unfinished connection? Your saved people stay as they are.'))return
      const active=host.vault();if(!active)return;await host.save(active.entries,(active.meetings??[]).filter(m=>m.id!==meeting.id));host.home()
    })));container.append(row)}
  }
  return{start,receive,resume:render,list,stopScan,clear}
}
