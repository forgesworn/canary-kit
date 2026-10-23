import {describe,expect,it} from 'vitest'
import {beginConnect,connectLink,connectInput} from './connect.js'
import {newDeviceRequest,deviceLink,deviceInput} from './device-transfer.js'
import {newMeeting,meetingCard,meetingLink,meetingInput} from './meet.js'
import {createPair,inviteLink,joinLink} from './model.js'
import {transferLink,transferToken} from './trust-wire.js'
import {createDeviceVault,sealEntries,addRecoveryPassphrase,exportVault,parseVault,unlockVault,enableDeviceUnlock,unlockWithDevice,closeVault} from './vault.js'

const addresses=['https://vouch.mysignet.app/','https://canary-words.cocoacod256.chatgpt.site/']
function routes(){
 const offer=beginConnect('Example person'),request=newDeviceRequest(1_800_000_000),meeting=newMeeting(),pair=createPair()
 return [
  {link:(a:string)=>connectLink(offer.invite,a),read:(u:string,a:string)=>connectInput(u,a),value:offer.invite},
  {link:(a:string)=>deviceLink(request.request,a),read:(u:string,a:string)=>deviceInput(u,a),value:request.request},
  {link:(a:string)=>meetingLink(meetingCard(meeting),a),read:(u:string,a:string)=>meetingInput(u,a).card,value:meetingCard(meeting)},
  {link:(a:string)=>inviteLink(pair,a),read:(u:string,a:string)=>joinLink(u,a).mnemonic,value:pair.mnemonic},
  {link:(a:string)=>transferLink('CANARY-TRUST:1:EXAMPLE',a),read:(u:string,a:string)=>transferToken(u,a),value:'CANARY-TRUST:1:EXAMPLE'},
 ]
}
describe('explicit branded and original Vouch address compatibility',()=>{
 it('keeps credentials origin-bound while an encrypted recovery backup moves the people',async()=>{
  const oldOrigin=new URL(addresses[1]).origin,newOrigin=new URL(addresses[0]).origin
  const credential=(seed:number)=>({rawId:new Uint8Array([seed,8,4]).buffer,getClientExtensionResults:()=>({prf:{results:{first:new Uint8Array(32).fill(seed).buffer}}})})
  let oldUnlockCalls=0
  const oldProvider={create:async()=>credential(71),get:async()=>{oldUnlockCalls++;return credential(71)}} as unknown as CredentialsContainer
  const newProvider={create:async()=>credential(83),get:async()=>credential(83)} as unknown as CredentialsContainer
  const source=await createDeviceVault(oldOrigin,oldProvider),entries=[{id:'example-person',label:'Example person',pair:createPair()}]
  source.record=await sealEntries(source,entries)
  source.record=await addRecoveryPassphrase(source,'example recovery passphrase for this test only 7zR8')
  const original=JSON.stringify(source.record)
  await expect(unlockWithDevice(source.record,newOrigin,oldProvider)).rejects.toThrow(/original website/)
  expect(oldUnlockCalls).toBe(0)
  const backup=parseVault(exportVault(source.record));expect(backup.device).toBeUndefined()
  const restored=await unlockVault(backup,'example recovery passphrase for this test only 7zR8')
  restored.record=await enableDeviceUnlock(restored,newOrigin,newProvider)
  const reopened=await unlockWithDevice(restored.record,newOrigin,newProvider),oldReopened=await unlockWithDevice(source.record,oldOrigin,oldProvider)
  expect(reopened.entries).toEqual(entries);expect(oldReopened.entries).toEqual(entries)
  expect(restored.record.device?.origin).toBe(newOrigin)
  expect(JSON.stringify(source.record)).toBe(original)
  for(const vault of [source,restored,reopened,oldReopened])closeVault(vault)
 })
 it('reads public setup, device and private-transfer links between both trusted roots',()=>{
  for(const route of routes())for(const from of addresses)for(const to of addresses){
   expect(route.read(route.link(from),to)).toEqual(route.value)
  }
 })
 it('keeps other self-hosted HTTPS addresses limited to their own origin and path',()=>{
  const own='https://vouch.example/private/'
  for(const route of routes()){
   expect(route.read(route.link(own),own)).toEqual(route.value)
   for(const address of addresses){
    expect(()=>route.read(route.link(address),own)).toThrow()
    expect(()=>route.read(route.link(own),address)).toThrow()
   }
  }
 })
 it('rejects lookalikes, other Signet subdomains, paths, credentials, ports and queries',()=>{
  const hostile=['https://mysignet.app/','https://other.mysignet.app/','https://vouch.mysignet.app.evil.invalid/','https://evil.invalid/','http://vouch.mysignet.app/','https://vouch.mysignet.app:444/','https://vouch.mysignet.app/elsewhere/','https://user:password@vouch.mysignet.app/','https://vouch.mysignet.app/?tracking=1','https://vouch.mysignet.app/?']
  for(const route of routes()){
   const fragment=new URL(route.link(addresses[0])).hash
   for(const address of addresses)for(const bad of hostile){
    const received=new URL(bad);received.hash=fragment
    expect(()=>route.read(received.href,address)).toThrow()
   }
  }
 })
})
