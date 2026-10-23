import { afterEach, expect, it, vi } from 'vitest'
import { addRecoveryPassphrase, closeVault, createDeviceVault, deviceUnlockOrigin, exportVault, parseVault, sealEntries, unlockVault, unlockWithDevice } from './vault.js'
import { createPair } from './model.js'

afterEach(()=>vi.unstubAllGlobals())
it('keeps the existing encrypted envelope while native device-auth keys protect and recover the vault',async()=>{
 const credential=btoa('native fixture credential'),secret=btoa('k'.repeat(32)),w:any={};w.top=w
 w.VouchNative={postMessage:(raw:string)=>{const request=JSON.parse(raw);queueMicrotask(()=>w.__vouchNativeReceive({v:1,id:request.id,result:request.op==='vaultCreate'?{credential,secret}:{secret}}))}}
 vi.stubGlobal('window',w);vi.stubGlobal('document',{querySelector:()=>({getAttribute:()=> 'native'})})
 const origin=deviceUnlockOrigin(),vault=await createDeviceVault(origin),entry={id:'native-friend',label:'Test friend',pair:createPair()}
 vault.record=await sealEntries(vault,[entry]);expect(vault.record.device?.origin).toBe(origin)
 const saved=JSON.stringify(vault.record);expect(saved).not.toContain(secret);expect(saved).not.toContain(entry.pair.mnemonic)
 const reopened=await unlockWithDevice(parseVault(saved),origin);expect(reopened.entries).toEqual([entry])
 reopened.record=await addRecoveryPassphrase(reopened,'several random recovery words here')
 const backup=exportVault(reopened.record);expect(backup).not.toContain(credential)
 const restored=await unlockVault(parseVault(backup),'several random recovery words here');expect(restored.entries).toEqual([entry])
 await expect(unlockWithDevice(reopened.record,'https://unrelated.example')).rejects.toThrow(/original|installed/)
 for(const opened of [vault,reopened,restored])closeVault(opened)
})
