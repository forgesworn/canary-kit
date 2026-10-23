import { meetingInput } from './meet.js'

type Endpoint={postMessage(value:string):void}
type NativeWindow=Window&{VouchNative?:Endpoint;webkit?:{messageHandlers?:{Vouch?:Endpoint}};__vouchNativeReceive?:(value:unknown)=>void}
type Event={v:1;event?:string;id?:number;result?:unknown;error?:string;session?:string;code?:string;message?:string}
const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void;timer:ReturnType<typeof setTimeout>}>()
const events=new Set<(event:Event)=>void>(),background=new Set<()=>void>()
const radioStops=new Set<()=>void>()
let nextId=0
function endpoint():Endpoint|undefined {
 if(typeof window==='undefined'||window.top!==window||typeof document==='undefined'||document.querySelector('meta[name="vouch-runtime"]')?.getAttribute('content')!=='native')return
 const w=window as NativeWindow
 return w.VouchNative??w.webkit?.messageHandlers?.Vouch
}
function receive(raw:unknown){
 const value=raw as Event
 if(!value||value.v!==1)return
 if(value.event==='background'){
  for(const item of pending.values()){clearTimeout(item.timer);item.reject(new Error('The app went into the background. Unlock and resume.'))}
  pending.clear();cancelNativeRadios();for(const task of background)task();return
 }
 if(value.event){for(const task of events)task(value);return}
 if(typeof value.id!=='number')return
 const item=pending.get(value.id);if(!item)return
 pending.delete(value.id);clearTimeout(item.timer)
 if(value.error)item.reject(new Error(typeof value.error==='string'?value.error.slice(0,300):'The native operation did not finish.'))
 else item.resolve(value.result)
}
function attach(){if(endpoint())(window as NativeWindow).__vouchNativeReceive=receive}
function request(op:string,args:Record<string,unknown>={},timeout=120_000):Promise<any>{
 const target=endpoint();if(!target)return Promise.reject(new Error('Open the installed Vouch app for this feature.'))
 if(pending.size>=8)return Promise.reject(new Error('Finish the current device operation first.'))
 attach();const id=++nextId
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{pending.delete(id);reject(new Error('The device operation timed out. Unlock and try again.'))},timeout)
  pending.set(id,{resolve,reject,timer})
  try{target.postMessage(JSON.stringify({v:1,id,op,args}))}catch{clearTimeout(timer);pending.delete(id);reject(new Error('The native device operation could not start.'))}
 })
}
export function nativeAvailable(){return!!endpoint()}
export function nativePlatform():'ios'|'android' {return(window as NativeWindow).VouchNative?'android':'ios'}
export function nativeOrigin(){return`vouch-native:${nativePlatform()}:dev.forgesworn.vouch.prototype`}
export function vouchAddress(){return nativeAvailable()?'https://canary-words.cocoacod256.chatgpt.site/':location.origin+location.pathname}
export function onNativeBackground(task:()=>void){attach();background.add(task);return()=>{background.delete(task)}}
export function cancelNativeRadios(){for(const stop of [...radioStops])stop()}
export function reportNativeReady(){if(nativeAvailable())void request('ready',{cryptoAvailable:!!crypto.subtle},5000).catch(()=>{})}
function binary(value:unknown,size?:number):Uint8Array{
 if(typeof value!=='string'||value.length>1400||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))throw new Error('The device did not return a valid unlock key.')
 let result:Uint8Array
 try{result=Uint8Array.from(atob(value),c=>c.charCodeAt(0))}catch{throw new Error('The device did not return a valid unlock key.')}
 if(!result.length||(size!==undefined&&result.length!==size))throw new Error('The device did not return a valid unlock key.')
 return result
}
export async function nativeCreateKey():Promise<{credential:string;secret:Uint8Array}>{
 const value=await request('vaultCreate');binary(value?.credential)
 return{credential:value.credential,secret:binary(value.secret,32)}
}
export async function nativeKey(credential:string):Promise<Uint8Array>{
 binary(credential);const value=await request('vaultRead',{credential});return binary(value?.secret,32)
}
export function publicNativeCode(value:unknown):string {
 if(typeof value!=='string'||!value.startsWith('CANARY-MEET:1:')||value.length>186)throw new Error('Only a public Vouch connection code may enter the radio transport.')
 meetingInput(value,'https://vouch.invalid/');return value
}
export interface NativeRadio {
 session:string
 nfc:boolean
 ble:boolean
 update(code:string,complete:boolean):Promise<void>
 readNfc():Promise<void>
 stop():void
}
export async function openNativeRadio(code:string,onCode:(code:string)=>void,onState:(message:string)=>void):Promise<NativeRadio>{
 publicNativeCode(code)
 const session=[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join('')
 let stopped=false
 const hear=(value:Event)=>{
  if(stopped||value.session!==session)return
  if(value.event==='peer'){try{onCode(publicNativeCode(value.code))}catch{/* Untrusted radio input is discarded. */}}
  if((value.event==='status'||value.event==='paused')&&typeof value.message==='string')onState(value.message.slice(0,240))
 }
 events.add(hear)
 const stop=()=>{if(stopped)return;stopped=true;events.delete(hear);radioStops.delete(stop);void request('radioStop',{session},5000).catch(()=>{})}
 radioStops.add(stop)
 try{
  const available=await request('radioStart',{session,code})
  return{session,nfc:available?.nfc===true,ble:available?.ble===true,update:(next,complete)=>{publicNativeCode(next);return stopped?Promise.reject(new Error('This connection was paused.')):request('radioUpdate',{session,code:next,complete},5000)},readNfc:()=>request('nfcRead',{session},5000),stop}
 }catch(error){stop();throw error}
}
export async function nativeSaveFile(name:string,contents:string,mime:string){
 if(!/^[a-zA-Z0-9_.-]{1,80}$/.test(name)||new TextEncoder().encode(contents).length>1_048_576)throw new Error('This export is too large or has an invalid filename.')
 await request('shareFile',{name,contents,mime})
}
