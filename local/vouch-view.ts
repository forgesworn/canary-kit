import { signed, publicKey, keyCode, type Group, type Signed } from './trust.js'
export const claimField=(event:Signed,name:string)=>event.tags.find(t=>t[0]===name)?.[1]??''
export function personName(group:Group,key:string) {return group.people?.find(p=>p.pubkey===key)?.label||group.trusted.find(p=>p.pubkey===key)?.label||`Key ${keyCode(key).split(' ').slice(0,2).join(' ')}`}
export interface VouchSummary {state:'active'|'expired'|'withdrawn'|'invalid';label:string;method:string;at:number;expires:number}
export function vouchSummary(group:Group,raw:Signed,now:number):VouchSummary {
 const invalid:VouchSummary={state:'invalid',label:'Unusable signed claim',method:'',at:0,expires:0}
 try{
  const event=signed(raw),field=(name:string)=>{const tags=event.tags.filter(t=>t[0]===name);if(tags.length!==1||tags[0].length!==2)throw new Error('Ambiguous claim');return tags[0][1]}
  const subject=field('p'),expires=Number(field('expiration')),method=field('method')
  if(field('type')!=='vouch'||field('context')!=='canary:group:v1:'+group.id||field('keeper')!==group.keeper||field('d')!=='vouch:'+subject||!/^[0-9a-f]{64}$/.test(subject)||subject===event.pubkey||!['in-person','online'].includes(method)||!Number.isSafeInteger(expires)||expires<=event.created_at||expires>event.created_at+90*86400||event.created_at>now+30)return invalid
  const withdrawn=group.withdrawals.some(w=>w.pubkey===event.pubkey&&claimField(w,'p')===subject&&w.created_at>=event.created_at)
  return{state:withdrawn?'withdrawn':expires<=now?'expired':'active',label:personName(group,event.pubkey),method:method==='in-person'?'Met in person':'Trusted live call',at:event.created_at,expires}
 }catch{return invalid}
}
export function knownPeople(group:Group,now:number) {
 const own=publicKey(group),keys=new Set<string>()
 for(const person of [...(group.people??[]),...group.trusted])keys.add(person.pubkey)
 for(const event of group.issued)keys.add(claimField(event,'p'))
 for(const event of group.received)keys.add(event.pubkey)
 if(group.lastCheck)keys.add(group.lastCheck.subject)
 keys.delete(own);keys.delete('')
 return [...keys].map(pubkey=>{
  const issued=group.issued.filter(e=>claimField(e,'p')===pubkey).sort((a,b)=>b.created_at-a.created_at)[0]
  const received=group.received.find(e=>e.pubkey===pubkey)
  return{pubkey,label:personName(group,pubkey),...(issued?{vouch:vouchSummary(group,issued,now)}:{}),...(received?{received:vouchSummary(group,received,now)}:{}),accepted:group.trusted.some(p=>p.pubkey===pubkey),lastCheck:group.lastCheck?.subject===pubkey?group.lastCheck:undefined}
 }).sort((a,b)=>a.label.localeCompare(b.label))
}
export function exchangeHint(group:Group,now:number):string {
 if(group.pending){if(Number(claimField(group.pending,'expiration'))<=now)return 'Request expired · start a fresh check';return claimField(group.pending,'purpose')==='vouch'?'Waiting for their reply before you can vouch':'Waiting for their reply to your check'}
 if(group.outgoing?.kind==='key'&&Number(claimField(group.outgoing.event,'expiration'))<=now)return 'Verification card expired · show a fresh one'
 return group.outgoing?'Your last saved handoff is ready to share again':''
}
