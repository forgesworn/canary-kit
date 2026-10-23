import assert from 'node:assert/strict'

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))

/** Real, locally signalled WebRTC media; simulated screens/cameras, dummy people.
 * Nothing is sent to a call provider. Browser RTP stats are the evidence gate. */
export async function readVideoQr(reader,source,start,trial) {
 const profile={width:640,height:360,qrPixels:250,bitrate:250_000,codec:trial%2?'video/H264':'video/VP8',mirror:trial%2===1,rotation:0.018}
 const total=await source.locator('#optical-qr').evaluate(c=>Number(c.parentElement.nextElementSibling.textContent.match(/of (\d+)/)?.[1]||1))
 let steps=0,dropped=0,measure
 try{
  await source.evaluate(async profile=>{
   const canvas=document.createElement('canvas');canvas.width=profile.width;canvas.height=profile.height
   const stream=canvas.captureStream(0),track=stream.getVideoTracks()[0]
   const pc=new RTCPeerConnection({iceServers:[]}),sender=pc.addTrack(track,stream)
   const transceiver=pc.getTransceivers()[0],codecs=RTCRtpSender.getCapabilities('video').codecs.filter(c=>c.mimeType.toLowerCase()===profile.codec.toLowerCase())
   if(!codecs.length)throw new Error('Required video codec unavailable: '+profile.codec)
   transceiver.setCodecPreferences(codecs)
   const parameters=sender.getParameters();parameters.encodings[0].maxBitrate=profile.bitrate;parameters.encodings[0].maxFramerate=10;await sender.setParameters(parameters)
   window.vouchVideoTx={pc,track,stream,canvas,profile,paint(blank=false){
    const ctx=canvas.getContext('2d');ctx.fillStyle='#777f85';ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle='#e8e8e8';ctx.fillRect(0,canvas.height-24,canvas.width,24)
    ctx.save();ctx.translate(canvas.width/2,canvas.height/2-8);ctx.rotate(profile.rotation);ctx.scale(profile.mirror?-1:1,1)
    if(!blank)ctx.drawImage(document.querySelector('#optical-qr'),-profile.qrPixels/2,-profile.qrPixels/2,profile.qrPixels,profile.qrPixels)
    ctx.restore();track.requestFrame()
   }}
   await pc.setLocalDescription(await pc.createOffer())
  },profile)
  async function gathered(page,key){
   for(let n=0;n<80;n++){if(await page.evaluate(key=>window[key].pc.iceGatheringState==='complete',key))return;await sleep(100)}
   throw new Error('Local WebRTC ICE gathering timed out')
  }
  await gathered(source,'vouchVideoTx')
  const offer=await source.evaluate(()=>({type:window.vouchVideoTx.pc.localDescription.type,sdp:window.vouchVideoTx.pc.localDescription.sdp}))
  await reader.evaluate(async offer=>{
   const pc=new RTCPeerConnection({iceServers:[]});window.vouchVideoRx={pc,stream:null}
   pc.ontrack=event=>{window.vouchVideoRx.stream=event.streams[0]}
   await pc.setRemoteDescription(offer);await pc.setLocalDescription(await pc.createAnswer())
   Object.defineProperty(navigator.mediaDevices,'getUserMedia',{configurable:true,value:async()=>{
    if(!window.vouchVideoRx.stream)throw new Error('Video call has no received track')
    return window.vouchVideoRx.stream
   }})
  },offer)
  await gathered(reader,'vouchVideoRx')
  const answer=await reader.evaluate(()=>({type:window.vouchVideoRx.pc.localDescription.type,sdp:window.vouchVideoRx.pc.localDescription.sdp}))
  await source.evaluate(answer=>window.vouchVideoTx.pc.setRemoteDescription(answer),answer)
  await source.evaluate(()=>window.vouchVideoTx.paint())
  await start();await reader.locator('#optical-video').waitFor()
  const started=Date.now()
  for(let n=0;n<total*3+8;n++){
   // Lose selected entire QR parts on the first pass, so completion requires
   // the normal repeating transfer, not a pristine sequence of screenshots.
   const blank=n<total&&n%5===2;if(blank)dropped++
   for(let repeat=0;repeat<4;repeat++){
    await source.evaluate(blank=>window.vouchVideoTx.paint(blank),blank)
    await sleep(100);await reader.clock.runFor(100);steps++
    if(!await reader.locator('#optical').isVisible()){
     measure=await reader.evaluate(async()=>{
      const stats=await window.vouchVideoRx.pc.getStats()
      const inbound=[...stats.values()].find(s=>s.type==='inbound-rtp'&&s.kind==='video')
      const codec=stats.get(inbound?.codecId)
      return {framesDecoded:inbound?.framesDecoded,bytesReceived:inbound?.bytesReceived,packetsReceived:inbound?.packetsReceived,frameWidth:inbound?.frameWidth,frameHeight:inbound?.frameHeight,codec:codec?.mimeType,iceServerCount:window.vouchVideoRx.pc.getConfiguration().iceServers.length,candidateTypes:[...new Set([...stats.values()].filter(s=>s.type==='local-candidate'||s.type==='remote-candidate').map(s=>s.candidateType))],tracksStopped:window.vouchVideoRx.stream.getTracks().every(t=>t.readyState==='ended')}
     })
     const outbound=await source.evaluate(async()=>{
      const stats=await window.vouchVideoTx.pc.getStats()
      const video=[...stats.values()].find(s=>s.type==='outbound-rtp'&&s.kind==='video')
      return {framesEncoded:video?.framesEncoded,bytesSent:video?.bytesSent}
     })
     assert.ok(measure.framesDecoded>0&&measure.bytesReceived>0&&measure.packetsReceived>0,'Must decode real compressed RTP video')
     assert.ok(outbound.framesEncoded>0&&outbound.bytesSent>0,'Must encode real video')
     assert.equal(measure.codec.toLowerCase(),profile.codec.toLowerCase());assert.equal(measure.tracksStopped,true)
     assert.equal(measure.iceServerCount,0);assert.ok(measure.candidateTypes.length>0&&measure.candidateTypes.every(type=>type==='host'))
     assert.ok(dropped>0,'Exercise recovery of missing QR parts')
     return {profile,qrParts:total,withheldPartsOnFirstCycle:dropped,elapsedMs:Date.now()-started,steps,...measure,...outbound}
    }
   }
   await source.clock.runFor(500)
  }
  throw new Error('Compressed video QR did not complete within three bounded cycles')
 }finally{
  await Promise.allSettled([
   source.evaluate(()=>{const tx=window.vouchVideoTx;if(tx){tx.stream.getTracks().forEach(t=>t.stop());tx.pc.close();delete window.vouchVideoTx}}),
   reader.evaluate(()=>{const rx=window.vouchVideoRx;if(rx){rx.stream?.getTracks().forEach(t=>t.stop());rx.pc.close();delete window.vouchVideoRx}})
  ])
 }
}
