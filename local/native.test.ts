import { afterEach, describe, expect, it, vi } from 'vitest'
import { nativeAvailable, nativeOrigin, nativeKey, nativeCreateKey, openNativeRadio, onNativeBackground, cancelNativeRadios, nativeShareText } from './native.js'
import { meetingCard, meetingToken, newMeeting } from './meet.js'
import { beginConnect, connectLink } from './connect.js'

afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers()})
function host(){
 const calls:any[]=[],w:any={};w.top=w
 vi.stubGlobal('document',{querySelector:()=>({getAttribute:()=> 'native'})})
 w.VouchNative={postMessage:(raw:string)=>calls.push(JSON.parse(raw))};vi.stubGlobal('window',w)
 const answer=(index:number,value:unknown)=>w.__vouchNativeReceive({v:1,id:calls[index].id,result:value})
 return{w,calls,answer}
}
describe('native boundary',()=>{
 it('shares public request links while refusing secret recovery and off-site links',async()=>{
  const h=host(),address='https://canary-words.cocoacod256.chatgpt.site/',offer=beginConnect('Share fixture'),link=connectLink(offer.invite,address)
  const sent=nativeShareText(link);expect(h.calls[0].op).toBe('shareText');h.answer(0,{});await sent
  for(const bad of ['https://canary-words.cocoacod256.chatgpt.site/#pair=secret','https://other.test/#connect=public'])await expect(nativeShareText(bad)).rejects.toThrow()
  expect(h.calls).toHaveLength(1)
  const extra=address+'#connect='+encodeURIComponent(JSON.stringify({...JSON.parse(offer.invite),secret:'must-not-travel'})),clean=nativeShareText(extra)
  expect(h.calls[1].args.text).toBe(link);h.answer(1,{});await clean
 })
 it('does not enable a native provider on the ordinary website',()=>{
  vi.stubGlobal('window',{top:null});expect(nativeAvailable()).toBe(false)
 })
 it('uses a device-only provider and validates its result before exposing key bytes',async()=>{
  const h=host();expect(nativeOrigin()).toBe('vouch-native:android:dev.forgesworn.vouch.prototype')
  const pending=nativeCreateKey();h.answer(0,{credential:btoa('fixture credential'),secret:btoa(String.fromCharCode(...new Uint8Array(32).fill(29)))})
  const first=await pending;expect(first.secret).toHaveLength(32)
  const second=nativeKey(first.credential);h.answer(1,{secret:'broken'});await expect(second).rejects.toThrow(/unlock key/)
  first.secret.fill(0)
 })
 it('rejects late unlock results after backgrounding and tells the app to lock',async()=>{
  const h=host(),locked=vi.fn(),off=onNativeBackground(locked),pending=nativeCreateKey()
  h.w.__vouchNativeReceive({v:1,event:'background'})
  await expect(pending).rejects.toThrow(/background/);expect(locked).toHaveBeenCalledOnce()
  h.answer(0,{credential:btoa('late'),secret:btoa('x'.repeat(32))});off()
 })
 it('routes only public tokens for the current foreground radio session',async()=>{
  const h=host(),seen:string[]=[],code=meetingToken(meetingCard(newMeeting()))
  const opening=openNativeRadio(code,value=>seen.push(value),()=>{});h.answer(0,{nfc:true,ble:true});const radio=await opening
  h.w.__vouchNativeReceive({v:1,event:'peer',session:'other',code});expect(seen).toEqual([])
  h.w.__vouchNativeReceive({v:1,event:'peer',session:radio.session,code});expect(seen).toEqual([code])
  h.w.__vouchNativeReceive({v:1,event:'peer',session:radio.session,code:'private words'});expect(seen).toEqual([code])
  expect(()=>radio.update('private words',false)).toThrow()
  radio.stop();h.answer(1,{})
  h.w.__vouchNativeReceive({v:1,event:'peer',session:radio.session,code});expect(seen).toEqual([code])
 })
 it('bounds unanswered native requests and times them out without fallback plaintext storage',async()=>{
  vi.useFakeTimers();host();const result=nativeCreateKey();const check=expect(result).rejects.toThrow(/timed out/)
  await vi.advanceTimersByTimeAsync(120_001);await check
 })
 it('cancels a radio start immediately even while native permission is still pending',async()=>{
  const h=host(),code=meetingToken(meetingCard(newMeeting())),opening=openNativeRadio(code,()=>{},()=>{})
  cancelNativeRadios();expect(h.calls[1].op).toBe('radioStop');expect(h.calls[1].args.session).toBe(h.calls[0].args.session)
  h.answer(1,{});h.answer(0,{nfc:true,ble:true});const radio=await opening
  await expect(radio.update(code,false)).rejects.toThrow(/paused/)
 })
})
