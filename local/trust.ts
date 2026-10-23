import { createAttestation, createRevocation } from 'nostr-attestations'
import { finalizeEvent, getEventHash, type Event } from 'nostr-tools/pure'
import { schnorr } from '@noble/curves/secp256k1.js'
import { bytesToHex, hexToBytes, sha256 } from '../src/crypto.js'

export type Signed = Event
export type Method = 'in-person' | 'online'
export type Purpose = 'member' | 'voucher' | 'vouch'
export interface Proof { kind: 'proof'; event: Signed; credential?: Signed }
export type Transfer = { kind: 'group'; event: Signed } | { kind: 'key'; event: Signed } | { kind: 'sealed'; from: string; to: string; content: string }
export interface Handoff { id: string; title: string; peer?: string; transfer: Transfer }
export interface Group {
  id: string; name: string; keeper: string; secret: string
  trusted: { pubkey: string; label: string }[]
  people?: { pubkey: string; label: string }[]
  issued: Signed[]; received: Signed[]; withdrawals: Signed[]
  pending?: Signed; checks?: Signed[]; outgoing?: Transfer; handoffs?: Handoff[]
  lastCheck?: { subject: string; issuer?: string; at: number; account: string; purpose: Purpose; knownAs?: string }
}
export interface TrustState { v: 1; groups: Group[] }
const PREFIX = 'canary:group:v1:'
const encoder = new TextEncoder()
export const emptyTrust = (): TrustState => ({ v: 1, groups: [] })
export const timeNow = () => Math.floor(Date.now() / 1000)
function fail(message: string): never { throw new Error(message) }
function timestamp(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > 4_102_444_800) fail('Check the device date and time.')
  return value as number
}
export function text(value: unknown, max: number, empty = false): string {
  if (typeof value !== 'string' || value.length > max || (!empty && !value.trim()) || /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(value)) fail('Check the name or text. Keep it short and on one line.')
  return value.trim()
}
function hex(value: unknown, length: number): string {
  if (typeof value !== 'string' || value.length !== length || !/^[0-9a-f]+$/.test(value)) fail('This verification key or reference is invalid.')
  return value
}
export function publicKey(group: Pick<Group, 'secret'>): string {
  const secret = hexToBytes(hex(group.secret, 64))
  try { return bytesToHex(schnorr.getPublicKey(secret)) } finally { secret.fill(0) }
}
export function keyCode(pubkey: string): string {
  return bytesToHex(sha256(hexToBytes(hex(pubkey, 64)))).slice(0, 16).match(/.{4}/g)!.join(' ')
}
function groupId(keeper: string): string { return bytesToHex(sha256(encoder.encode(PREFIX + keeper))).slice(0, 32) }
function randomKey(): string { const key = schnorr.utils.randomSecretKey(); try { return bytesToHex(key) } finally { key.fill(0) } }
function tag(event: Signed, name: string): string {
  const values = event.tags.filter(t => t[0] === name)
  if (values.length !== 1 || values[0].length !== 2) fail(`Missing or ambiguous ${name} in the signed proof.`)
  return values[0][1]
}
export function claimName(event: Signed): string | undefined {
  const claims = event.tags.filter(t => t[0] === 'claim'), names = event.tags.filter(t => t[0] === 'known-as')
  if (!claims.length && !names.length) return undefined
  if (tag(event, 'claim') !== 'known-person:v1') fail('This identity statement is unsupported.')
  return text(tag(event, 'known-as'), 40)
}
export function pendingChecks(group: Group): Signed[] {
  const checks = [...(group.checks ?? [])]
  if (group.pending && !checks.some(e => e.id === group.pending!.id)) checks.push(group.pending)
  return checks
}
function withChecks(group: Group, checks: Signed[]): Group { return { ...group, checks, pending: checks.at(-1) } }
export function cancelCheck(group: Group, id: string): Group {
  const checks = pendingChecks(group), request = checks.find(e => e.id === id)
  if (!request) fail('This check has already finished or been removed.')
  if (request.pubkey !== publicKey(group)) fail('This request belongs to another key.')
  return { ...withChecks(group, checks.filter(e => e.id !== id)), handoffs: group.handoffs?.filter(h => h.id !== id) }
}
export function saveHandoff(group: Group, transfer: Transfer, title: string, id: string, peer?: string): Group {
  const legacy=group.outgoing&&!group.handoffs?.some(h=>h.id==='legacy')?[{id:'legacy',title:'Continue your saved exchange.',transfer:group.outgoing}]:[]
  const handoffs = [...(group.handoffs ?? []).filter(h => h.id !== id),...legacy, { id: text(id, 80), title: text(title, 100), ...(peer ? { peer: hex(peer, 64) } : {}), transfer: readTransfer(transfer) }]
  if (handoffs.length > 16) fail('Finish or remove a saved exchange before starting another. No saved exchange was removed.')
  return { ...group, handoffs, outgoing: undefined }
}
export function signed(raw: unknown): Signed {
  if (!raw || typeof raw !== 'object') fail('This signed proof is invalid.')
  const data = raw as Signed
  if (data.kind !== 31000 || typeof data.content !== 'string' || data.content.length > 800 || !Array.isArray(data.tags) || data.tags.length > 18) fail('This signed proof is invalid or too large.')
  for (const row of data.tags) if (!Array.isArray(row) || row.length > 4 || row.some(v => typeof v !== 'string' || v.length > 256)) fail('This signed proof has invalid fields.')
  const event: Signed = { kind: 31000, pubkey: hex(data.pubkey, 64), created_at: timestamp(data.created_at), tags: data.tags.map(row => [...row]), content: data.content, id: hex(data.id, 64), sig: hex(data.sig, 128) }
  // Do not rely on a parser, caller-supplied validity flag or SDK verification cache.
  try { if (getEventHash(event) !== event.id || !schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey))) fail('The proof signature does not match.') }
  catch { fail('The proof signature does not match.') }
  return event
}
function sign(group: Group, type: string, subject: string, tags: string[][], content: string, now: number): Signed {
  const template = createAttestation({ type, subject, identifier: type === 'canary-group' ? group.id : subject, tags: [['context', PREFIX + group.id], ['keeper', group.keeper], ...tags], content })
  const secret = hexToBytes(group.secret)
  try { return signed(finalizeEvent({ ...template, created_at: timestamp(now) }, secret)) } finally { secret.fill(0) }
}
function scoped(group: Group, raw: unknown, type: string): Signed {
  const event = signed(raw)
  if (tag(event, 'type') !== type || tag(event, 'context') !== PREFIX + group.id || tag(event, 'keeper') !== group.keeper) fail('This proof belongs to a different group or purpose.')
  return event
}
function fresh(event: Signed, now: number) {
  timestamp(now)
  const until = Number(tag(event, 'expiration'))
  if (!Number.isSafeInteger(until) || until <= now || event.created_at > now + 30 || until <= event.created_at) fail('This request or vouch has expired, or its date is invalid. Ask for a fresh one.')
}
function keeperOnly(group: Group) { if (publicKey(group) !== group.keeper) fail('Only this group’s keeper can choose vouchers and accept checks.') }
export function newGroup(name: string, now = timeNow()): Group {
  timestamp(now)
  const secret = randomKey(), keeper = publicKey({ secret })
  return { id: groupId(keeper), name: text(name, 40), keeper, secret, trusted: [{ pubkey: keeper, label: 'Keeper' }], issued: [], received: [], withdrawals: [] }
}
export function groupCard(group: Group, now = timeNow()): Signed {
  keeperOnly(group)
  return sign(group, 'canary-group', group.keeper, [], JSON.stringify({ name: group.name }), now)
}
export function describeGroup(raw: unknown, now = timeNow()): { id: string; name: string; keeper: string } {
  const event = signed(raw), keeper = event.pubkey, id = groupId(keeper)
  if (tag(event, 'type') !== 'canary-group' || tag(event, 'context') !== PREFIX + id || tag(event, 'keeper') !== keeper || tag(event, 'p') !== keeper || event.created_at > timestamp(now) + 30) fail('This group card is invalid.')
  const content = JSON.parse(event.content)
  return { id, keeper, name: text(content.name, 40) }
}
export function joinGroup(raw: unknown, now = timeNow()): Group {
  const description = describeGroup(raw, now)
  return { ...description, secret: randomKey(), trusted: [{ pubkey: description.keeper, label: 'Keeper' }], issued: [], received: [], withdrawals: [] }
}
export function keyCard(group: Group, now = timeNow()): Signed {
  return sign(group, 'canary-key', publicKey(group), [['expiration', String(timestamp(now) + 900)]], '', now)
}
export function readKeyCard(group: Group, raw: unknown, now = timeNow()): Signed {
  const event = scoped(group, raw, 'canary-key'); fresh(event, now)
  if (tag(event, 'p') !== event.pubkey || event.pubkey === publicKey(group)) fail('That is your own key, or an invalid holder card.')
  return event
}
export function issueVouch(group: Group, request: unknown, options: { method: Method; days: number; label?: string }, now = timeNow()) {
  const result = inspectProof(group, request as Proof, now)
  if (result.purpose !== 'vouch') fail('A fresh key check specifically for this vouch is required.')
  if (!['in-person', 'online'].includes(options.method) || !Number.isInteger(options.days) || options.days < 1 || options.days > 90) fail('Choose how you checked and an expiry from 1 to 90 days.')
  const event = sign(group, 'vouch', result.subject, [['method', options.method], ['occurred_at', String(now)], ['expiration', String(now + options.days * 86400)], ...(result.knownAs ? [['claim', 'known-person:v1'], ['known-as', result.knownAs]] : [])], '', now)
  const issued = group.issued.filter(old => tag(old, 'p') !== result.subject)
  if (issued.length >= 32) fail('This group has reached its local vouch limit.')
  let people = group.people ?? []
  if (options.label?.trim()) people = [...people.filter(p => p.pubkey !== result.subject), { pubkey: result.subject, label: text(options.label, 40) }]
  if (people.length > 64) fail('This group has reached its saved-name limit.')
  return { group: { ...cancelCheck(group, result.requestId), people, issued: [...issued, event] }, event }
}
function vouch(group: Group, raw: unknown, now: number): Signed {
  const event = scoped(group, raw, 'vouch'); fresh(event, now)
  claimName(event)
  hex(tag(event, 'p'), 64)
  if (event.pubkey === tag(event, 'p') || tag(event, 'd') !== 'vouch:' + tag(event, 'p')) fail('A vouch must be for another holder and use the expected claim address.')
  if (!['in-person', 'online'].includes(tag(event, 'method'))) fail('The vouch method is unsupported.')
  if (Number(tag(event, 'expiration')) > event.created_at + 90 * 86400) fail('The vouch lifetime exceeds this profile’s 90-day limit.')
  if (group.withdrawals.some(withdrawal => withdrawal.pubkey === event.pubkey && tag(withdrawal, 'p') === tag(event, 'p') && withdrawal.created_at >= event.created_at)) fail('This vouch has been withdrawn in the latest state known to this phone.')
  return event
}
export function receiveVouch(group: Group, raw: unknown, now = timeNow()): Group {
  const event = vouch(group, raw, now)
  if (tag(event, 'p') !== publicKey(group)) fail('This vouch belongs to another holder.')
  const previous = group.received.find(e => e.pubkey === event.pubkey)
  if (previous && (previous.created_at > event.created_at || (previous.created_at === event.created_at && previous.id !== event.id))) fail('An older or conflicting vouch cannot replace the saved one.')
  const received = group.received.filter(e => e.pubkey !== event.pubkey)
  if (received.length >= 16) fail('This group has reached its received-vouch limit.')
  return { ...group, received: [...received, event] }
}
export function beginCheck(group: Group, subject: string, purpose: Purpose, account = '', now = timeNow(), knownAs?: string) {
  if (purpose !== 'vouch') keeperOnly(group)
  hex(subject, 64)
  if (!['member', 'voucher', 'vouch'].includes(purpose) || subject === publicKey(group)) fail('Choose another holder to check.')
  if (knownAs !== undefined && purpose !== 'vouch') fail('Only a vouch request can propose an agreed group name.')
  const claim = knownAs === undefined ? [] : [['claim', 'known-person:v1'], ['known-as', text(knownAs, 40)]]
  const checks = pendingChecks(group).filter(e => !(tag(e, 'p') === subject && tag(e, 'purpose') === purpose))
  if (checks.length >= 8) fail('Finish or remove a pending check before starting another.')
  const nonce = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
  const event = sign(group, 'canary-check', subject, [['purpose', purpose], ['nonce', nonce], ['expiration', String(timestamp(now) + 600)], ...claim], text(account, 100, true), now)
  const replaced = pendingChecks(group).filter(e => tag(e, 'p') === subject && tag(e, 'purpose') === purpose).map(e => e.id)
  return { group: { ...withChecks(group, [...checks, event]), handoffs: group.handoffs?.filter(h => !replaced.includes(h.id)) }, event }
}
export function readChallenge(group: Group, raw: unknown, now = timeNow()): Signed {
  const challenge = scoped(group, raw, 'canary-check'); fresh(challenge, now)
  const purpose = tag(challenge, 'purpose')
  if ((purpose !== 'vouch' && challenge.pubkey !== group.keeper) || challenge.pubkey === publicKey(group) || tag(challenge, 'p') !== publicKey(group) || !['member', 'voucher', 'vouch'].includes(purpose) || !/^[0-9a-f]{32}$/.test(tag(challenge, 'nonce')) || Number(tag(challenge, 'expiration')) > challenge.created_at + 600) fail('This check is not from your saved keeper, or is addressed to another holder.')
  text(challenge.content, 100, true)
  const knownAs = claimName(challenge)
  if (knownAs && purpose !== 'vouch') fail('This check has an unexpected identity statement.')
  return challenge
}
export function currentVouches(group: Group, now = timeNow()): Signed[] {
  return [...group.received].sort((a, b) => Number(b.pubkey === group.keeper) - Number(a.pubkey === group.keeper) || b.created_at - a.created_at).filter(event => { try { vouch(group, event, now); return true } catch { return false } })
}
export function answerCheck(group: Group, raw: unknown, now = timeNow(), credentialId?: string): Proof {
  const challenge = readChallenge(group, raw, now)
  let credential: Signed | undefined
  if (tag(challenge, 'purpose') === 'member') {
    credential = currentVouches(group, now).find(event => !credentialId || event.id === credentialId)
    if (!credential) fail('There is no current, unwithdrawn vouch to present. Ask someone to vouch for you.')
  }
  const event = sign(group, 'canary-proof', challenge.pubkey, [['request', challenge.id], ['nonce', tag(challenge, 'nonce')], ['purpose', tag(challenge, 'purpose')], ...(credential ? [['credential', credential.id]] : [])], challenge.content, now)
  return { kind: 'proof', event, ...(credential ? { credential } : {}) }
}
export function inspectProof(group: Group, packet: Proof, now = timeNow()) {
  const event = scoped(group, packet.event, 'canary-proof')
  const request = pendingChecks(group).find(e => e.id === tag(event, 'request'))
  if (!request) fail('There is no matching pending check. Start a fresh check; old responses cannot be reused.')
  const pending = scoped(group, request, 'canary-check'); fresh(pending, now)
  const purpose = tag(pending, 'purpose') as Purpose
  if (!['member', 'voucher', 'vouch'].includes(purpose) || Number(tag(pending, 'expiration')) > pending.created_at + 600) fail('The saved challenge has an invalid purpose or lifetime.')
  if (purpose !== 'vouch') keeperOnly(group)
  if (pending.pubkey !== publicKey(group)) fail('The saved challenge was not signed by this phone.')
  if (tag(event, 'p') !== publicKey(group) || tag(event, 'request') !== pending.id || tag(event, 'nonce') !== tag(pending, 'nonce') || tag(event, 'purpose') !== tag(pending, 'purpose') || event.pubkey !== tag(pending, 'p') || event.content !== pending.content || event.created_at < pending.created_at - 30 || event.created_at > now + 30) fail('This response does not match the pending holder, account context or challenge.')
  let issuer: string | undefined
  let knownAs = claimName(pending)
  if (purpose === 'member') {
    const credential = vouch(group, packet.credential, now)
    if (tag(event, 'credential') !== credential.id || tag(credential, 'p') !== event.pubkey) fail('The holder response does not match its vouch.')
    if (!group.trusted.some(person => person.pubkey === credential.pubkey)) fail('This vouch is not from an accepted voucher. The keeper chooses whom to trust.')
    const latest = group.issued.find(old => old.pubkey === credential.pubkey && tag(old, 'p') === event.pubkey)
    if (latest && latest.id !== credential.id && latest.created_at >= credential.created_at) fail('A newer vouch is known to this keeper. Ask for the updated one.')
    issuer = credential.pubkey
    knownAs = claimName(credential)
  } else if (packet.credential) fail('A voucher-key check must not carry a membership credential.')
  return { subject: event.pubkey, issuer, purpose, at: timestamp(now), account: pending.content, requestId: pending.id, ...(knownAs ? { knownAs } : {}) }
}
export function trustVoucher(group: Group, pubkey: string, label: string): Group {
  keeperOnly(group); hex(pubkey, 64); label = text(label, 40)
  if (group.trusted.length >= 16 && !group.trusted.some(p => p.pubkey === pubkey)) fail('This group has reached its accepted-voucher limit.')
  return { ...group, trusted: [...group.trusted.filter(p => p.pubkey !== pubkey), { pubkey, label }] }
}
export function forgetVoucher(group: Group, pubkey: string): Group {
  keeperOnly(group)
  if (pubkey === group.keeper) fail('The keeper remains the group’s authority.')
  return { ...group, trusted: group.trusted.filter(p => p.pubkey !== pubkey) }
}
export function acceptProof(group: Group, packet: Proof, label = '', now = timeNow()): Group {
  const result = inspectProof(group, packet, now)
  if (result.purpose === 'vouch') fail('Choose how you checked the person, then explicitly sign the vouch.')
  const next = result.purpose === 'voucher' ? trustVoucher(group, result.subject, label) : group
  return { ...cancelCheck(next, result.requestId), lastCheck: result }
}
export function withdrawVouch(group: Group, id: string, now = timeNow()) {
  const original = group.issued.find(event => event.id === id && event.pubkey === publicKey(group))
  if (!original) fail('Only the original voucher can withdraw this saved vouch.')
  const subject = tag(original, 'p')
  const template = createRevocation({ type: 'vouch', identifier: subject, subject, effective: timestamp(now) })
  const key = hexToBytes(group.secret)
  let event: Signed
  try { event = signed(finalizeEvent({ ...template, created_at: now, tags: [...template.tags, ['context', PREFIX + group.id], ['keeper', group.keeper], ['e', id]] }, key)) } finally { key.fill(0) }
  return { group: receiveWithdrawal(group, event, now), event, subject }
}
export function receiveWithdrawal(group: Group, raw: unknown, now = timeNow()): Group {
  const event = scoped(group, raw, 'vouch')
  if (tag(event, 'status') !== 'revoked' || event.created_at > timestamp(now) + 30) fail('This withdrawal is invalid or dated in the future.')
  hex(tag(event, 'p'), 64)
  if (group.withdrawals.some(e => e.id === event.id)) return group
  if (group.withdrawals.length >= 64) fail('This group has reached its withdrawal-history limit. No history was discarded.')
  return { ...group, withdrawals: [...group.withdrawals, event] }
}
export function readTransfer(raw: unknown): Transfer {
  if (!raw || typeof raw !== 'object') fail('This private transfer is invalid.')
  const data = raw as Transfer
  if (data.kind === 'group' || data.kind === 'key') return { kind: data.kind, event: signed(data.event) }
  if (data.kind !== 'sealed' || typeof data.content !== 'string' || data.content.length > 12000) fail('This private transfer is invalid or too large.')
  return { kind: 'sealed', from: hex(data.from, 64), to: hex(data.to, 64), content: data.content }
}
export function readTrust(raw: unknown): TrustState {
  if (raw === undefined) return emptyTrust()
  const data = raw as TrustState
  if (!data || data.v !== 1 || !Array.isArray(data.groups) || data.groups.length > 8) fail('This private-group store is invalid or too large.')
  const seen = new Set<string>()
  const groups = data.groups.map(g => {
    const keeper = hex(g.keeper, 64), id = hex(g.id, 32), secret = hex(g.secret, 64)
    publicKey({ secret })
    if (id !== groupId(keeper) || seen.has(id)) fail('The group identity is invalid or duplicated.')
    seen.add(id)
    if (!Array.isArray(g.trusted) || g.trusted.length > 16 || !Array.isArray(g.issued) || g.issued.length > 32 || !Array.isArray(g.received) || g.received.length > 16 || !Array.isArray(g.withdrawals) || g.withdrawals.length > 64) fail('This group has invalid saved evidence.')
    const group: Group = { id, keeper, secret, name: text(g.name, 40), trusted: g.trusted.map(p => ({ pubkey: hex(p.pubkey, 64), label: text(p.label, 40) })), issued: [], received: [], withdrawals: [] }
    if (g.people !== undefined) {
      if (!Array.isArray(g.people) || g.people.length > 64) fail('Invalid saved group names.')
      group.people = g.people.map(p => ({ pubkey: hex(p.pubkey, 64), label: text(p.label, 40) }))
    }
    group.issued = g.issued.map(e => scoped(group, e, 'vouch'))
    group.received = g.received.map(e => { const event = scoped(group, e, 'vouch'); if (tag(event, 'p') !== publicKey(group)) fail('Saved receipt belongs to another key.'); return event })
    group.withdrawals = g.withdrawals.map(e => { const event = scoped(group, e, 'vouch'); if (tag(event, 'status') !== 'revoked') fail('Invalid saved withdrawal.'); return event })
    if (g.pending) { group.pending = scoped(group, g.pending, 'canary-check'); if (tag(group.pending, 'purpose') !== 'vouch') keeperOnly(group); if (group.pending.pubkey !== publicKey(group)) fail('Invalid saved challenge.') }
    if (g.checks !== undefined) {
      if (!Array.isArray(g.checks) || g.checks.length > 8) fail('Invalid saved checks.')
      group.checks = g.checks.map(raw => { const check = scoped(group, raw, 'canary-check'); if (check.pubkey !== publicKey(group) || !['member', 'voucher', 'vouch'].includes(tag(check, 'purpose'))) fail('Invalid saved challenge.'); if (tag(check, 'purpose') !== 'vouch') keeperOnly(group); claimName(check); return check })
      if (new Set(group.checks.map(e => e.id)).size !== group.checks.length || pendingChecks(group).length > 8) fail('Duplicated or excessive saved checks.')
    }
    if (g.outgoing) group.outgoing = readTransfer(g.outgoing)
    if (g.handoffs !== undefined) {
      if (!Array.isArray(g.handoffs) || g.handoffs.length > 16) fail('Invalid saved exchanges.')
      group.handoffs = g.handoffs.map(h => ({ id: text(h.id, 80), title: text(h.title, 100), ...(h.peer ? { peer: hex(h.peer, 64) } : {}), transfer: readTransfer(h.transfer) }))
      if (new Set(group.handoffs.map(h => h.id)).size !== group.handoffs.length) fail('Duplicated saved exchanges.')
    }
    if (g.lastCheck) group.lastCheck = { subject: hex(g.lastCheck.subject, 64), ...(g.lastCheck.issuer ? { issuer: hex(g.lastCheck.issuer, 64) } : {}), at: timestamp(g.lastCheck.at), purpose: g.lastCheck.purpose === 'voucher' ? 'voucher' : g.lastCheck.purpose === 'member' ? 'member' : fail('Invalid check purpose.'), account: text(g.lastCheck.account, 100, true), ...(g.lastCheck.knownAs ? { knownAs: text(g.lastCheck.knownAs, 40) } : {}) }
    return group
  })
  return { v: 1, groups }
}
