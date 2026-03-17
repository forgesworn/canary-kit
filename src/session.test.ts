import { describe, it, expect } from 'vitest'
import { generateSeed, deriveSeed, SESSION_PRESETS, createSession, type SessionPresetName } from './session.js'
import { bytesToHex, hexToBytes } from './crypto.js'
import { deriveDuressToken, deriveDirectionalPair } from './token.js'

const MASTER_KEY = '0000000000000000000000000000000000000000000000000000000000000001'

describe('generateSeed', () => {
  it('returns a 32-byte Uint8Array', () => {
    const seed = generateSeed()
    expect(seed).toBeInstanceOf(Uint8Array)
    expect(seed.length).toBe(32)
  })

  it('produces different seeds on successive calls', () => {
    const a = generateSeed()
    const b = generateSeed()
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })
})

describe('deriveSeed', () => {
  it('returns a 32-byte Uint8Array', () => {
    const seed = deriveSeed(MASTER_KEY, 'customer-123')
    expect(seed).toBeInstanceOf(Uint8Array)
    expect(seed.length).toBe(32)
  })

  it('is deterministic', () => {
    const a = deriveSeed(MASTER_KEY, 'customer-123')
    const b = deriveSeed(MASTER_KEY, 'customer-123')
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('different components produce different seeds', () => {
    const a = deriveSeed(MASTER_KEY, 'customer-123')
    const b = deriveSeed(MASTER_KEY, 'customer-456')
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('different master keys produce different seeds', () => {
    const other = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    const a = deriveSeed(MASTER_KEY, 'customer-123')
    const b = deriveSeed(other, 'customer-123')
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('multi-component derivation is order-sensitive', () => {
    const a = deriveSeed(MASTER_KEY, 'customer-123', 'v1')
    const b = deriveSeed(MASTER_KEY, 'v1', 'customer-123')
    expect(bytesToHex(a)).not.toBe(bytesToHex(b))
  })

  it('accepts Uint8Array master key', () => {
    const keyBytes = hexToBytes(MASTER_KEY)
    const a = deriveSeed(MASTER_KEY, 'test')
    const b = deriveSeed(keyBytes, 'test')
    expect(bytesToHex(a)).toBe(bytesToHex(b))
  })

  it('multi-component uses null-byte separators', () => {
    const twoComponents = deriveSeed(MASTER_KEY, 'a', 'b')
    const oneComponent = deriveSeed(MASTER_KEY, 'ab')
    expect(bytesToHex(twoComponents)).not.toBe(bytesToHex(oneComponent))
  })

  it('rejects master key shorter than 16 bytes (security audit)', () => {
    const shortKey = '00'.repeat(15)
    expect(() => deriveSeed(shortKey, 'test')).toThrow(RangeError)
    expect(() => deriveSeed(new Uint8Array(15), 'test')).toThrow(RangeError)
  })

  it('accepts 16-byte master key (security audit)', () => {
    const minKey = '00'.repeat(16)
    expect(() => deriveSeed(minKey, 'test')).not.toThrow()
  })
})

describe('SESSION_PRESETS', () => {
  it('exports call and handoff presets', () => {
    expect(SESSION_PRESETS).toHaveProperty('call')
    expect(SESSION_PRESETS).toHaveProperty('handoff')
  })

  it('call preset has 30-second rotation', () => {
    expect(SESSION_PRESETS.call.rotationSeconds).toBe(30)
  })

  it('call preset has tolerance of 1', () => {
    expect(SESSION_PRESETS.call.tolerance).toBe(1)
  })

  it('call preset is directional', () => {
    expect(SESSION_PRESETS.call.directional).toBe(true)
  })

  it('handoff preset has zero rotation (fixed counter)', () => {
    expect(SESSION_PRESETS.handoff.rotationSeconds).toBe(0)
  })

  it('handoff preset has zero tolerance', () => {
    expect(SESSION_PRESETS.handoff.tolerance).toBe(0)
  })

  it('handoff preset is directional', () => {
    expect(SESSION_PRESETS.handoff.directional).toBe(true)
  })

  it('presets are frozen', () => {
    expect(Object.isFrozen(SESSION_PRESETS)).toBe(true)
    expect(Object.isFrozen(SESSION_PRESETS.call)).toBe(true)
    expect(Object.isFrozen(SESSION_PRESETS.handoff)).toBe(true)
  })

  it('all preset names match the type', () => {
    const names: SessionPresetName[] = ['call', 'handoff']
    for (const name of names) {
      expect(SESSION_PRESETS[name]).toBeDefined()
      expect(SESSION_PRESETS[name].description.length).toBeGreaterThan(0)
    }
  })
})

const SECRET = '0000000000000000000000000000000000000000000000000000000000000001'

describe('createSession — call preset', () => {
  const FIXED_NOW = 1_000_000_050

  function makeSession(myRole: 'caller' | 'agent') {
    return createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole,
      preset: 'call',
    })
  }

  it('myToken returns a non-empty string', () => {
    const session = makeSession('agent')
    expect(typeof session.myToken(FIXED_NOW)).toBe('string')
    expect(session.myToken(FIXED_NOW).length).toBeGreaterThan(0)
  })

  it('theirToken returns a non-empty string', () => {
    const session = makeSession('agent')
    expect(typeof session.theirToken(FIXED_NOW)).toBe('string')
    expect(session.theirToken(FIXED_NOW).length).toBeGreaterThan(0)
  })

  it('myToken and theirToken are different', () => {
    const session = makeSession('agent')
    expect(session.myToken(FIXED_NOW)).not.toBe(session.theirToken(FIXED_NOW))
  })

  it('agent myToken equals caller theirToken', () => {
    const agent = makeSession('agent')
    const caller = makeSession('caller')
    expect(agent.myToken(FIXED_NOW)).toBe(caller.theirToken(FIXED_NOW))
  })

  it('caller myToken equals agent theirToken', () => {
    const agent = makeSession('agent')
    const caller = makeSession('caller')
    expect(caller.myToken(FIXED_NOW)).toBe(agent.theirToken(FIXED_NOW))
  })

  it('counter is time-based with 30-second rotation', () => {
    const session = makeSession('agent')
    expect(session.counter(0)).toBe(0)
    expect(session.counter(29)).toBe(0)
    expect(session.counter(30)).toBe(1)
    expect(session.counter(59)).toBe(1)
    expect(session.counter(60)).toBe(2)
  })

  it('tokens match deriveDirectionalPair with correct role', () => {
    const session = makeSession('agent')
    const counter = session.counter(FIXED_NOW)
    const pair = deriveDirectionalPair(SECRET, 'aviva', ['caller', 'agent'], counter)
    expect(session.myToken(FIXED_NOW)).toBe(pair.agent)
    expect(session.theirToken(FIXED_NOW)).toBe(pair.caller)
  })

  it('pair returns both tokens keyed by role', () => {
    const session = makeSession('agent')
    const pair = session.pair(FIXED_NOW)
    expect(pair.caller).toBe(session.theirToken(FIXED_NOW))
    expect(pair.agent).toBe(session.myToken(FIXED_NOW))
  })

  it('verify accepts correct theirToken', () => {
    const agent = makeSession('agent')
    const caller = makeSession('caller')
    const callerWord = caller.myToken(FIXED_NOW)
    const result = agent.verify(callerWord, FIXED_NOW)
    expect(result.status).toBe('valid')
  })

  it('verify rejects wrong word', () => {
    const agent = makeSession('agent')
    const result = agent.verify('nonsenseword', FIXED_NOW)
    expect(result.status).toBe('invalid')
  })

  it('verify respects preset tolerance (±1 counter)', () => {
    const agent = makeSession('agent')
    const counter = agent.counter(FIXED_NOW)
    const pair = deriveDirectionalPair(SECRET, 'aviva', ['caller', 'agent'], counter)
    const laterNow = FIXED_NOW + 30
    const result = agent.verify(pair.caller, laterNow)
    expect(result.status).toBe('valid')
  })
})

describe('createSession — duress detection', () => {
  const FIXED_NOW = 1_000_000_050

  it('detects duress when theirIdentity is provided', () => {
    const agent = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
      theirIdentity: 'customer-123',
    })
    const counter = agent.counter(FIXED_NOW)
    const duressWord = deriveDuressToken(SECRET, 'pair:aviva:caller', 'customer-123', counter, undefined, 1)
    const result = agent.verify(duressWord, FIXED_NOW)
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual(['customer-123'])
  })

  it('returns invalid (not duress) when no theirIdentity configured', () => {
    const agent = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
    })
    const counter = agent.counter(FIXED_NOW)
    const duressWord = deriveDuressToken(SECRET, 'pair:aviva:caller', 'customer-123', counter, undefined, 1)
    const result = agent.verify(duressWord, FIXED_NOW)
    expect(result.status).toBe('invalid')
  })
})

describe('createSession — handoff preset (fixed counter)', () => {
  it('uses fixed counter from config', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
      counter: 42,
    })
    expect(session.counter()).toBe(42)
    expect(session.counter(999_999)).toBe(42)
  })

  it('throws at construction when handoff preset used without counter', () => {
    expect(() => createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
    })).toThrow('Fixed counter mode (rotationSeconds=0) requires config.counter')
  })

  it('myToken and theirToken are different', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
      counter: 42,
    })
    expect(session.myToken()).not.toBe(session.theirToken())
  })

  it('verify works with fixed counter', () => {
    const provider = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
      counter: 42,
    })
    const requester = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'requester',
      preset: 'handoff',
      counter: 42,
    })
    const result = provider.verify(requester.myToken())
    expect(result.status).toBe('valid')
  })
})

describe('createSession — role validation', () => {
  const secret = generateSeed()

  it('throws when namespace contains null bytes', () => {
    expect(() => createSession({
      secret,
      namespace: 'aviva\0caller',
      roles: ['caller', 'agent'],
      myRole: 'caller',
    })).toThrow('namespace must not contain null bytes')
  })

  it('throws when roles contain null bytes', () => {
    expect(() => createSession({
      secret,
      namespace: 'test',
      roles: ['caller\0x', 'agent'],
      myRole: 'caller\0x',
    })).toThrow('Roles must not contain null bytes')
  })

  it('throws when roles are identical', () => {
    expect(() => createSession({
      secret,
      namespace: 'test',
      roles: ['caller', 'caller'],
      myRole: 'caller',
    })).toThrow('Roles must be distinct')
  })

  it('throws when myRole is not one of the roles', () => {
    expect(() => createSession({
      secret,
      namespace: 'test',
      roles: ['caller', 'agent'],
      myRole: 'calller',  // typo
    })).toThrow('myRole "calller" is not one of the configured roles')
  })

  it('accepts valid role configuration', () => {
    expect(() => createSession({
      secret,
      namespace: 'test',
      roles: ['caller', 'agent'],
      myRole: 'caller',
    })).not.toThrow()
  })
})

describe('createSession — custom config (no preset)', () => {
  it('uses explicit rotationSeconds', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'custom',
      roles: ['a', 'b'],
      myRole: 'a',
      rotationSeconds: 60,
    })
    expect(session.counter(0)).toBe(0)
    expect(session.counter(59)).toBe(0)
    expect(session.counter(60)).toBe(1)
  })

  it('uses explicit encoding', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'custom',
      roles: ['a', 'b'],
      myRole: 'a',
      rotationSeconds: 60,
      encoding: { format: 'pin', digits: 6 },
    })
    const token = session.myToken(60)
    expect(token).toHaveLength(6)
    expect(Number(token)).not.toBeNaN()
  })

  it('preset values can be overridden', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'custom',
      roles: ['a', 'b'],
      myRole: 'a',
      preset: 'call',
      rotationSeconds: 120,
      tolerance: 0,
    })
    expect(session.counter(0)).toBe(0)
    expect(session.counter(119)).toBe(0)
    expect(session.counter(120)).toBe(1)
  })
})

describe('createSession — pair across time windows', () => {
  it('pair changes when counter rotates', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
    })
    const pair0 = session.pair(0)
    const pair1 = session.pair(30)
    expect(pair0.caller).not.toBe(pair1.caller)
    expect(pair0.agent).not.toBe(pair1.agent)
  })

  it('pair is stable within same rotation window', () => {
    const session = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
    })
    const pairA = session.pair(10)
    const pairB = session.pair(25)
    expect(pairA).toEqual(pairB)
  })
})

describe('createSession — echo protection', () => {
  it('verifying own token returns invalid (prevents echo attack)', () => {
    const agent = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
    })
    const FIXED_NOW = 1_000_000_050
    // Agent's own token should NOT verify — verify checks theirContext, not myContext
    const myWord = agent.myToken(FIXED_NOW)
    const result = agent.verify(myWord, FIXED_NOW)
    expect(result.status).toBe('invalid')
  })
})

describe('createSession — duress with tolerance drift', () => {
  const FIXED_NOW = 1_000_000_050

  it('detects duress at adjacent counter within tolerance', () => {
    const agent = createSession({
      secret: SECRET,
      namespace: 'aviva',
      roles: ['caller', 'agent'],
      myRole: 'agent',
      preset: 'call',
      theirIdentity: 'customer-123',
    })
    // Derive duress at slightly earlier counter
    const counter = agent.counter(FIXED_NOW)
    const prevCounter = counter - 1
    const duressWord = deriveDuressToken(SECRET, 'pair:aviva:caller', 'customer-123', prevCounter, undefined, 1)
    const result = agent.verify(duressWord, FIXED_NOW)
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual(['customer-123'])
  })
})

describe('createSession — handoff duress detection', () => {
  it('detects duress in fixed counter (handoff) mode', () => {
    const provider = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
      counter: 42,
      theirIdentity: 'rider-456',
    })
    const duressWord = deriveDuressToken(SECRET, 'pair:dispatch:requester', 'rider-456', 42, undefined, 0)
    const result = provider.verify(duressWord)
    expect(result.status).toBe('duress')
    expect(result.identities).toEqual(['rider-456'])
  })

  it('valid token still works in handoff mode with theirIdentity', () => {
    const provider = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'provider',
      preset: 'handoff',
      counter: 42,
      theirIdentity: 'rider-456',
    })
    const requester = createSession({
      secret: SECRET,
      namespace: 'dispatch',
      roles: ['requester', 'provider'],
      myRole: 'requester',
      preset: 'handoff',
      counter: 42,
    })
    const result = provider.verify(requester.myToken())
    expect(result.status).toBe('valid')
  })
})

describe('createSession — numeric validation', () => {
  const secret = generateSeed()
  const base = { secret, namespace: 'test', roles: ['a', 'b'] as [string, string], myRole: 'a' }

  it('throws on negative rotationSeconds', () => {
    expect(() => createSession({ ...base, rotationSeconds: -30 })).toThrow(RangeError)
  })

  it('throws on fractional rotationSeconds', () => {
    expect(() => createSession({ ...base, rotationSeconds: 1.5 })).toThrow(RangeError)
  })

  it('throws on negative tolerance', () => {
    expect(() => createSession({ ...base, tolerance: -1 })).toThrow(RangeError)
  })

  it('throws on tolerance > MAX_TOLERANCE', () => {
    expect(() => createSession({ ...base, tolerance: 11 })).toThrow(RangeError)
  })

  it('throws when counter set with rotationSeconds > 0', () => {
    expect(() => createSession({ ...base, rotationSeconds: 30, counter: 42 }))
      .toThrow('counter must not be set when rotationSeconds > 0')
  })

  it('throws on negative counter in fixed mode', () => {
    expect(() => createSession({ ...base, rotationSeconds: 0, counter: -1 })).toThrow(RangeError)
  })

  it('throws on counter > uint32 max in fixed mode', () => {
    expect(() => createSession({ ...base, rotationSeconds: 0, counter: 0xFFFFFFFF + 1 })).toThrow(RangeError)
  })

  it('accepts rotationSeconds=0 with valid counter', () => {
    expect(() => createSession({ ...base, rotationSeconds: 0, counter: 42 })).not.toThrow()
  })

  it('accepts tolerance at MAX_TOLERANCE boundary', () => {
    expect(() => createSession({ ...base, tolerance: 10 })).not.toThrow()
  })
})
