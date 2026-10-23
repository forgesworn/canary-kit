import { readPair, type Pair } from './model.js'
import { text } from './trust.js'

export interface Entry {
  id: string; label: string; pair: Pair
  evidence?: { method: 'in-person' | 'trusted-call'; at: number }
  accounts?: { service: string; account: string; observedAt: number }[]
  lastCheck?: number
  setup?: { method: 'in-person' | 'trusted-call'; reply?: string; invite?: string }
}
export function readEntries(raw: unknown): Entry[] {
  if (!Array.isArray(raw) || raw.length > 200) throw new Error('Invalid vault contents.')
  const ids = new Set<string>()
  return raw.map(value => {
    if (!value || typeof value.id !== 'string' || !/^[a-zA-Z0-9-]{1,64}$/.test(value.id) || ids.has(value.id)
      || typeof value.label !== 'string' || !value.label.trim() || value.label.length > 60) throw new Error('Invalid saved pair.')
    ids.add(value.id)
    const result: Entry = { id: value.id, label: value.label, pair: readPair(value.pair) }
    const checkedTime = (time: unknown) => {
      if (!Number.isSafeInteger(time) || (time as number) < 0 || (time as number) > 4_102_444_800) throw new Error('Invalid contact evidence date.')
      return time as number
    }
    if (value.evidence) {
      if (!['in-person', 'trusted-call'].includes(value.evidence.method)) throw new Error('Invalid contact evidence method.')
      result.evidence = { method: value.evidence.method, at: checkedTime(value.evidence.at) }
    }
    if (value.accounts !== undefined) {
      if (!Array.isArray(value.accounts) || value.accounts.length > 8) throw new Error('Too many observed accounts.')
      result.accounts = value.accounts.map((account: Entry['accounts'] extends (infer T)[] | undefined ? T : never) => ({ service: text(account.service, 32), account: text(account.account, 100), observedAt: checkedTime(account.observedAt) }))
    }
    if (value.lastCheck !== undefined) result.lastCheck = checkedTime(value.lastCheck)
    if (value.setup !== undefined) {
      if (!['in-person', 'trusted-call'].includes(value.setup.method) || (value.setup.reply !== undefined && (typeof value.setup.reply !== 'string' || value.setup.reply.length > 3000))) throw new Error('Invalid saved setup.')
      if(value.setup.invite!==undefined&&(typeof value.setup.invite!=='string'||value.setup.invite.length>3000))throw new Error('Invalid saved invitation.')
      result.setup = { method: value.setup.method, ...(value.setup.reply ? { reply: value.setup.reply } : {}), ...(value.setup.invite ? { invite: value.setup.invite } : {}) }
    }
    return result
  })
}
