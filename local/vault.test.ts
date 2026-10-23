import { describe, expect, it } from 'vitest'
import { createVault, createDeviceVault, addRecoveryPassphrase, unlockVault, sealEntries, parseVault, closeVault, enableDeviceUnlock, unlockWithDevice, exportVault } from './vault.js'
import { createPair } from './model.js'
import { newGroup, groupCard, joinGroup, publicKey, beginCheck, pendingChecks, saveHandoff, answerCheck, issueVouch } from './trust.js'
import { sealTransfer } from './trust-wire.js'
import { beginConnect, acceptConnect, finishConnect } from './connect.js'
import { newDeviceRequest, makeDeviceCopy } from './device-transfer.js'
import { newMeeting, matchMeeting, meetingCard, meetingMessage, pairFromMeeting } from './meet.js'

const password = 'a sufficiently long test passphrase'

describe('encrypted local vault', () => {
  it('protects and recovers an unfinished optical connection and removes only its session key on completion', async () => {
    const vault=await createVault(password),a=newMeeting(),b=newMeeting(),other=newMeeting()
    const first=matchMeeting(a,meetingCard(b)),otherPinned=matchMeeting(b,meetingMessage(first)),meeting=matchMeeting(first,meetingMessage(otherPinned)),pair=pairFromMeeting(meeting)
    const entry={id:meeting.id,label:'Still connecting',pair,setup:{method:'in-person' as const,meeting:meeting.id}}
    vault.meetings=[meeting,other]
    const record=await sealEntries(vault,[entry])
    expect(JSON.stringify(record)).not.toContain(meeting.secret);expect(JSON.stringify(record)).not.toContain(pair.mnemonic)
    const restored=await unlockVault(parseVault(exportVault(record)),password)
    expect(restored.meetings).toEqual([meeting,other]);expect(restored.entries).toEqual([entry])
    const completed={id:entry.id,label:'Saved friend',pair}
    const finished=await unlockVault(await sealEntries({...restored,meetings:[other]},[completed]),password)
    expect(finished.meetings).toEqual([other]);expect(finished.entries[0].pair).toEqual(pair)
    await expect(sealEntries({...restored,meetings:[]},[entry])).rejects.toThrow()
    closeVault(vault);closeVault(restored);closeVault(finished);expect(vault.meetings).toEqual([])
  })
  it('recovers independent named requests and exact outgoing handoffs without losing the other person on completion', async () => {
    const now=1_800_000_000,vault=await createVault(password),keeper=newGroup('Private circle',now)
    const alice=joinGroup(groupCard(keeper,now),now),bob=joinGroup(groupCard(keeper,now),now)
    const first=beginCheck(keeper,publicKey(alice),'vouch','',now,'Alice')
    const second=beginCheck(first.group,publicKey(bob),'vouch','',now,'Bob')
    const a=await sealTransfer(second.group,publicKey(alice),{kind:'challenge',event:first.event})
    const b=await sealTransfer(second.group,publicKey(bob),{kind:'challenge',event:second.event})
    const group=saveHandoff(saveHandoff(second.group,a,'Waiting for Alice',first.event.id,publicKey(alice)),b,'Waiting for Bob',second.event.id,publicKey(bob))
    vault.trust={v:1,groups:[group]};const record=await sealEntries(vault,[])
    for(const privateText of ['Private circle','Alice','Bob',group.secret,JSON.stringify(a)])expect(JSON.stringify(record)).not.toContain(privateText)
    const restored=await unlockVault(parseVault(exportVault(record)),password),saved=restored.trust.groups[0]
    expect(pendingChecks(saved)).toHaveLength(2);expect(saved.handoffs).toEqual(group.handoffs)
    const finished=issueVouch(saved,answerCheck(alice,first.event,now),{method:'in-person',days:30},now)
    const reloaded=await unlockVault(await sealEntries(restored,[],{v:1,groups:[finished.group]}),password)
    expect(pendingChecks(reloaded.trust.groups[0]).map(e=>e.id)).toEqual([second.event.id])
    expect(reloaded.trust.groups[0].handoffs?.map(h=>h.transfer)).toEqual([b])
    closeVault(vault);closeVault(restored);closeVault(reloaded)
  })
  it('keeps device-copy progress encrypted and portable while preserving it on unrelated saves', async () => {
    const vault = await createVault(password), entries = [{id:'friend',label:'Private name',pair:createPair()}]
    const receive = newDeviceRequest(), sent = makeDeviceCopy(receive.request,entries)
    vault.devices = {receive,send:{file:sent.file,count:1}}
    vault.record = await sealEntries(vault,entries)
    const stored = exportVault(vault.record)
    for (const value of [receive.secret,'Private name',sent.file]) expect(stored).not.toContain(value)
    const reopened = await unlockVault(parseVault(stored),password)
    expect(reopened.devices).toEqual(vault.devices)
    const again = await unlockVault(await sealEntries(reopened,reopened.entries),password)
    expect(again.devices).toEqual(vault.devices)
    closeVault(vault);closeVault(reopened);closeVault(again)
    expect(vault.devices).toEqual({})
  })
  it('reads original array and version-two vaults and upgrades saves to a version old builds reject', async () => {
    const vault = await createVault(password)
    const entries = [{ id: 'old-pair', label: 'Existing friend', pair: createPair() }]
    const key = await crypto.subtle.importKey('raw', new Uint8Array(vault.master).buffer, 'AES-GCM', false, ['encrypt', 'decrypt'])
    for (const payload of [entries, { v: 2, entries, trust: { v: 1, groups: [] } }, { v: 3, entries, trust: { v: 1, groups: [] }, exchanges: [] }, { v: 4, entries, trust: { v: 1, groups: [] }, exchanges: [], devices: {} }, {v:5,entries,trust:{v:1,groups:[]},exchanges:[],devices:{}}]) {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(`canary:vault:1:${vault.record.id}:data`) }, key, new TextEncoder().encode(JSON.stringify(payload)))
      const old = { ...vault.record, data: { iv: btoa(String.fromCharCode(...iv)), ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))) } }
      const reopened = await unlockVault(old, password)
      expect(reopened.entries).toEqual(entries)
      const upgraded = await sealEntries(reopened, entries)
      const decode = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0))
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(upgraded.data.iv), additionalData: new TextEncoder().encode(`canary:vault:1:${vault.record.id}:data`) }, key, decode(upgraded.data.ciphertext))
      expect(JSON.parse(new TextDecoder().decode(plaintext)).v).toBe(6)
      closeVault(reopened)
    }
    closeVault(vault)
  })
  it('recovers pending remote invitations and encrypted replies without exposing them in storage', async () => {
    const vault = await createVault(password)
    const exchange = beginConnect('Pending friend')
    vault.exchanges = [exchange]
    vault.record = await sealEntries(vault, [])
    const stored = exportVault(vault.record)
    for (const secret of [exchange.secret, exchange.label, exchange.invite]) expect(stored).not.toContain(secret)
    const reopened = await unlockVault(parseVault(stored), password)
    expect(reopened.exchanges).toEqual([exchange])
    const response = acceptConnect(exchange.invite)
    const pair = finishConnect(reopened.exchanges![0], response.reply)
    const entries = [{ id: 'pending-pair', label: 'Pending friend', pair, setup: { method: 'trusted-call' as const, reply: response.reply } }]
    reopened.exchanges = []
    const recovered = await unlockVault(await sealEntries(reopened, entries), password)
    expect(recovered.exchanges).toEqual([])
    expect(recovered.entries).toEqual(entries)
    closeVault(vault); closeVault(reopened); closeVault(recovered)
  })
  it('preserves private group keys, pending exchanges and contact evidence across saving and portable recovery', async () => {
    const vault = await createVault(password)
    const keeper = newGroup('Private friends')
    const group = joinGroup(groupCard(keeper))
    vault.trust = { v: 1, groups: [group] }
    const entries = [{ id: 'pair-1', label: 'Friend', pair: createPair(), evidence: { method: 'in-person' as const, at: 1_790_000_000 }, accounts: [{ service: 'WhatsApp', account: '+44 test only', observedAt: 1_790_000_000 }], lastCheck: 1_790_000_000 }]
    vault.record = await sealEntries(vault, entries)
    const stored = exportVault(vault.record)
    expect(stored).not.toContain(group.secret)
    expect(stored).not.toContain('Private friends')
    expect(stored).not.toContain('+44 test only')
    const restored = await unlockVault(parseVault(stored), password)
    expect(restored.entries).toEqual(entries)
    expect(publicKey(restored.trust.groups[0])).toBe(publicKey(group))
    const savedAgain = await sealEntries(restored, restored.entries)
    expect((await unlockVault(savedAgain, password)).trust.groups[0].secret).toBe(group.secret)
    closeVault(vault); closeVault(restored)
    expect(restored.trust.groups).toHaveLength(0)
  })
  it('can keep a pair with device encryption first and add portable recovery later', async () => {
    const credential = () => ({ rawId: new Uint8Array([7, 8]).buffer, getClientExtensionResults: () => ({ prf: { results: { first: new Uint8Array(32).fill(42).buffer } } }) })
    const provider = { create: async () => credential(), get: async () => credential() } as unknown as CredentialsContainer
    const vault = await createDeviceVault('https://example.test', provider)
    expect(vault.record.password).toBeUndefined()
    const entries = [{ id: 'pair-1', label: 'Person 1', pair: createPair() }]
    vault.record = await sealEntries(vault, entries)
    const stored = parseVault(JSON.stringify(vault.record))
    const reopened = await unlockWithDevice(stored, 'https://example.test', provider)
    expect(reopened.entries).toEqual(entries)
    expect(() => exportVault(stored)).toThrow(/recovery passphrase/i)
    await expect(unlockVault(stored, password)).rejects.toThrow()
    expect(() => parseVault(JSON.stringify({ ...stored, device: undefined }))).toThrow()
    vault.record = await addRecoveryPassphrase(vault, password)
    const recovered = await unlockVault(parseVault(exportVault(vault.record)), password)
    expect(recovered.entries).toEqual(entries)
    expect(vault.record.device).toEqual(stored.device)
    closeVault(vault); closeVault(reopened); closeVault(recovered)
  })

  it('refuses device-only vaults when the provider cannot supply encryption material', async () => {
    const provider = { create: async () => ({ rawId: new Uint8Array([4]).buffer, getClientExtensionResults: () => ({}) }) } as unknown as CredentialsContainer
    await expect(createDeviceVault('https://example.test', provider)).rejects.toThrow(/not supported/)
  })
  it('requires PRF encryption material for device unlock and keeps backups portable', async () => {
    const vault = await createVault(password)
    const credential = () => ({ rawId: new Uint8Array([1, 2, 3]).buffer, getClientExtensionResults: () => ({ prf: { enabled: true, results: { first: new Uint8Array(32).fill(77).buffer } } }) })
    const provider = { create: async () => credential(), get: async () => credential() } as unknown as CredentialsContainer
    const record = await enableDeviceUnlock(vault, 'https://example.test', provider)
    const byDevice = await unlockWithDevice(record, 'https://example.test', provider)
    expect([...byDevice.master]).toEqual([...vault.master])
    await expect(unlockWithDevice(record, 'https://different.test', provider)).rejects.toThrow()
    const noPrf = { create: async () => ({ rawId: new Uint8Array([4]).buffer, getClientExtensionResults: () => ({}) }) } as unknown as CredentialsContainer
    await expect(enableDeviceUnlock(vault, 'https://example.test', noPrf)).rejects.toThrow(/not supported/)
    const backup = parseVault(exportVault(record))
    expect(backup.device).toBeUndefined()
    const recovered = await unlockVault(backup, password)
    expect([...recovered.master]).toEqual([...vault.master])
    closeVault(vault); closeVault(byDevice); closeVault(recovered)
  })

  it('encrypts secrets and nicknames, restores with the passphrase, and changes nonces on save', async () => {
    const vault = await createVault(password)
    const pair = createPair()
    const entries = [{ id: 'pair-1', label: 'My friend', pair }]
    const record = await sealEntries(vault, entries)
    const text = JSON.stringify(record)
    expect(text).not.toContain(pair.mnemonic)
    expect(text).not.toContain('My friend')
    expect(record.data.iv).not.toBe(vault.record.data.iv)
    const restored = await unlockVault(parseVault(text), password)
    expect(restored.entries).toEqual(entries)
    closeVault(restored)
    expect([...restored.master]).toEqual(new Array(32).fill(0))
    expect(restored.entries).toEqual([])
    closeVault(vault)
  })

  it('rejects wrong passphrases, modified ciphertext and unbounded inputs', async () => {
    const vault = await createVault(password)
    await expect(unlockVault(vault.record, password + 'wrong')).rejects.toThrow()
    const changed = structuredClone(vault.record)
    changed.data.ciphertext = (changed.data.ciphertext[0] === 'A' ? 'B' : 'A') + changed.data.ciphertext.slice(1)
    await expect(unlockVault(changed, password)).rejects.toThrow()
    expect(() => parseVault('x'.repeat(1_100_000))).toThrow()
    expect(() => parseVault(JSON.stringify({ ...vault.record, v: 99 }))).toThrow()
    await expect(createVault('too short')).rejects.toThrow()
    closeVault(vault)
  })
})
