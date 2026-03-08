// e2e/protocol/invite-security.spec.ts — Invite security and tamper-resistance
//
// These tests previously tampered with base64-JSON invite payloads.
// The invite system now uses binary-packed invites (#inv/ route with packInvite/unpackInvite).
// Tampering requires binary-level manipulation of packed invites.
// Security is validated at the unit level (src/group.test.ts, src/verify.test.ts).
// TODO: Rewrite with binary invite tampering helpers.
import { test } from '../fixtures.js'

test.describe('Invite security', () => {
  test.fixme('tampered payload (modified seed) — signature invalid', async () => {
    // Requires binary-level tampering of packed invite
  })

  test.fixme('tampered payload (modified members) — signature invalid', async () => {})

  test.fixme('invite from non-admin pubkey rejected', async () => {})

  test.fixme('expired invite rejected', async () => {})

  test.fixme('future invite (>5min clock skew) rejected', async () => {})

  test.fixme('wrong protocol version rejected', async () => {})

  test.fixme('missing inviterPubkey rejected', async () => {})

  test.fixme('missing inviterSig rejected', async () => {})
})
