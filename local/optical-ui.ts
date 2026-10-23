import { drawQr, QrScanner } from './qr.js'
import { encodeOptical, opticalFrames, createOpticalFrameReader, OPTICAL_FRAME_MS, type OpticalPayload } from './optical.js'
import { deviceCode } from './device-transfer.js'

interface Host {
  show():void
  home():void
  receive(value:string):void
  openFile():void
  error(message:string):void
}
export function mountOptical(root:HTMLElement,host:Host) {
  let timer:ReturnType<typeof setInterval>|undefined,scanner:QrScanner|undefined,epoch=0
  function node<K extends keyof HTMLElementTagNameMap>(tag:K,value='',className='') {
    const el=document.createElement(tag);el.textContent=value;el.className=className;return el
  }
  function button(id:string,label:string,task:()=>void,primary=false) {
    const b=node('button',label,primary?'primary wide':'secondary wide');b.id=id;b.type='button';b.addEventListener('click',task);return b
  }
  function stop() {epoch++;clearInterval(timer);timer=undefined;scanner?.stop();scanner=undefined;root.classList.remove('optical-large')}
  function clear(){stop();root.replaceChildren()}
  function base(title:string,lead:string,back=host.home) {
    clear();host.show();root.append(button('optical-back','← Back',back),node('h1',title),node('p',lead,'lead'))
  }
  function alternatives() {
    const details=node('details');details.append(node('summary','Only one phone? Use the call’s chat.'),node('p','Use Share invitation/reply or the encrypted people file. Then return to Vouch and paste the link or open the file. QR over live video needs a second screen that your camera can see.','small'))
    const form=node('form'),input=node('textarea'),label=node('label','A public invitation, receiving request or encrypted reply')
    input.id='optical-paste';input.rows=3;input.maxLength=400_000;input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.required=true;label.htmlFor=input.id
    const submit=node('button','Open this link or reply','primary wide');submit.type='submit'
    form.append(label,input,submit);form.addEventListener('submit',event=>{event.preventDefault();const value=input.value.trim();stop();host.receive(value)})
    details.append(form,button('optical-open-file','Open a public or encrypted file',host.openFile));root.append(details)
  }
  function show(payload:OpticalPayload,back:()=>void,next?:{label:string;task:()=>void}) {
    // Validate/canonicalise before replacing the current protected screen.
    const frames=opticalFrames(encodeOptical(payload),true)
    base('Show this QR.','They choose “Read a QR” in Vouch. Keep this in view until their device finishes reading.',back)
    const frame=node('div','','qr-frame optical-frame'),canvas=node('canvas'),progress=node('p','','small centered');canvas.id='optical-qr';progress.id='optical-frame-count';canvas.setAttribute('aria-label','Public request or recipient-encrypted transfer');frame.append(canvas);root.append(frame,progress)
    let index=0,paused=false,easier=false,lastFrame=performance.now()
    const render=()=>{drawQr(canvas,frames[index]);progress.textContent=frames.length>1?`${index+1} of ${frames.length} · repeats automatically`:'Ready to read'}
    render();if(frames.length>1)timer=setInterval(()=>{const now=performance.now();if(!paused&&now-lastFrame>=(easier?1000:OPTICAL_FRAME_MS)){lastFrame=now;index=(index+1)%frames.length;render()}},50)
    const help=node('details');help.id='optical-help';help.append(node('summary','Trouble scanning?'),button('optical-easier','Make QR bigger and slower',()=>{easier=!easier;lastFrame=performance.now();root.classList.toggle('optical-large',easier);document.getElementById('optical-easier')!.textContent=easier?'Use normal size and speed':'Make QR bigger and slower'}))
    if(payload.kind==='device-copy'){const code=node('p',deviceCode(payload.value),'optical-comparison');code.id='optical-copy-code';root.append(code)}
    if(next)root.append(button('optical-next',next.label,next.task,true))
    root.append(button('optical-scan-reply','Read their QR',scan,!next))
    if(frames.length>1)help.append(button('optical-pause','Pause this frame',()=>{paused=!paused;document.getElementById('optical-pause')!.textContent=paused?'Continue moving QR':'Pause this frame'}))
    root.append(help);alternatives();root.append(node('p','Share only this transfer QR on the call. Keep your vault, call words and recovery screen private. Compare the fixed code together before keeping a new pair or copy.','small'))
  }
  function scan() {
    base('Read their QR.','Point at the other screen. If its QR moves, keep it in view until reading finishes.')
    const stamp=epoch,video=node('video'),state=node('p','Opening the camera…','notice');video.id='optical-video';video.muted=true;video.playsInline=true;root.append(video,state)
    const read=createOpticalFrameReader(),progress=node('progress');progress.id='optical-progress';progress.max=1;progress.value=0;progress.hidden=true;progress.setAttribute('aria-label','QR transfer progress');root.append(progress)
    let facing:'user'|'environment'='environment'
    const start=()=>{
      scanner?.stop();scanner=new QrScanner(video,value=>{
        if(stamp!==epoch||document.hidden)return
        const full=read(value,performance.now())
        if(full){stop();host.receive(full);return}
        const parts=read.progress();progress.hidden=!parts
        if(parts){progress.max=parts.total;progress.value=parts.received;state.textContent=`Reading ${parts.received} of ${parts.total}. Keep the QR in view.`}
      },()=>{state.textContent='Camera paused. Your saved exchange is kept. Tap Read again.'})
      void scanner.start(facing,180_000).then(()=>{if(stamp===epoch)state.textContent='Reading the other screen…'}).catch(()=>{if(stamp===epoch)state.textContent='Camera unavailable. Open a public or encrypted file, or paste the link below.'})
    }
    root.append(button('optical-read-again','Read again',scan),button('optical-flip','Use the front camera',()=>{facing=facing==='environment'?'user':'environment';document.getElementById('optical-flip')!.textContent=facing==='user'?'Use the back camera':'Use the front camera';start()}));alternatives();start()
  }
  return {show,scan,clear,stop}
}
