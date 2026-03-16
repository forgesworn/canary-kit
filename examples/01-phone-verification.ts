/**
 * Phone verification — two-party directional session.
 *
 * Scenario: A customer calls their insurance company. Both sides need to
 * prove identity to each other. The agent speaks one word, the customer
 * speaks another. Neither can impersonate the other.
 *
 * Run: npx tsx examples/01-phone-verification.ts
 */

import { createSession, generateSeed } from 'canary-kit/session'

// Both parties share this seed (exchanged once during onboarding)
const sharedSeed = generateSeed()

// --- Agent side ---
const agentSession = createSession({
  secret: sharedSeed,
  namespace: 'aviva',
  roles: ['caller', 'agent'],
  myRole: 'agent',
  preset: 'call',           // 30-second rotation, 1 word
})

// --- Caller side ---
const callerSession = createSession({
  secret: sharedSeed,
  namespace: 'aviva',
  roles: ['caller', 'agent'],
  myRole: 'caller',
  preset: 'call',
})

// Each side has a different word to speak
console.log('Agent speaks:', agentSession.myToken())
console.log('Caller speaks:', callerSession.myToken())

// Each side verifies the other's word
const agentHearsFromCaller = callerSession.myToken()
const callerHearsFromAgent = agentSession.myToken()

console.log('Agent verifies caller:', agentSession.verify(agentHearsFromCaller))
// → { status: 'valid' }

console.log('Caller verifies agent:', callerSession.verify(callerHearsFromAgent))
// → { status: 'valid' }

// Wrong word → invalid
console.log('Wrong word:', agentSession.verify('banana'))
// → { status: 'invalid' }
