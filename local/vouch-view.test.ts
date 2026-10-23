import { describe,it,expect } from 'vitest'
import { newGroup, groupCard, joinGroup, publicKey, keyCard, beginCheck, answerCheck, issueVouch, receiveVouch, withdrawVouch, receiveWithdrawal } from './trust.js'
import { vouchSummary, knownPeople, exchangeHint } from './vouch-view.js'
const now=1_790_000_000
function fixture(){const keeper=newGroup('Friends',now),member=joinGroup(groupCard(keeper,now),now);const check=beginCheck(keeper,publicKey(member),'vouch','',now);const proof=answerCheck(member,check.event,now);const issued=issueVouch(check.group,proof,{method:'in-person',days:1,label:'Alex'},now);return{keeper:issued.group,member:receiveVouch(member,issued.event,now),event:issued.event}}
describe('human vouch presentation',()=>{
 it('distinguishes valid, expired, withdrawn and invalid evidence without upgrading issuer authority',()=>{
  const{keeper,member,event}=fixture()
  expect(vouchSummary(member,event,now).state).toBe('active')
  expect(vouchSummary(member,event,now+86400).state).toBe('expired')
  const withdrawal=withdrawVouch(keeper,event.id,now+1)
  expect(vouchSummary(receiveWithdrawal(member,withdrawal.event,now+1),event,now+2).state).toBe('withdrawn')
  expect(vouchSummary(member,{...event,content:'changed'},now).state).toBe('invalid')
  expect(vouchSummary(member,event,now).label).toBe('Keeper')
 })
 it('lists only group-scoped saved people with their evidence and does not equate same names across groups',()=>{
  const{keeper}=fixture();const rows=knownPeople(keeper,now)
  const row=rows.find(r=>r.label==='Alex')
  expect(row?.pubkey).not.toBe(publicKey(keeper));expect(row?.vouch?.state).toBe('active')
  expect(knownPeople(newGroup('Other',now),now)).toHaveLength(0)
 })
 it('labels unfinished and expired requests accurately and spots expired verification cards',()=>{
  const{keeper,member}=fixture();const pending=beginCheck(keeper,publicKey(member),'member','',now)
  expect(exchangeHint(pending.group,now)).toContain('Waiting')
  expect(exchangeHint(pending.group,now+601)).toContain('expired')
  expect(exchangeHint(keeper,now)).toBe('')
  expect(exchangeHint({...keeper,outgoing:{kind:'key',event:keyCard(keeper,now)}},now+901)).toContain('expired')
 })
})
