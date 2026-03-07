// docs/record/scripts/short.js — Short cut (~75s)
//
// Punchy marketing video: hook → create group → reveal word → verify →
// call simulation → close.
// Single browser, full viewport.

import {
  actHook,
  actLogin,
  actCreateGroup,
  actRevealWord,
  actCallSimulationStandalone,
  actClose,
} from './acts.js'

export default async function short(page, ctx) {
  // Act 1: Hook
  await actHook(page, ctx)

  // Login (offline mode as Alice)
  await actLogin(page, ctx)

  // Act 2: Create Group
  await actCreateGroup(page, ctx)

  // Act 3: Reveal Word + burn after use
  await actRevealWord(page, ctx)

  // Act 4: Call Simulation (standalone — uses header tab, has own seed)
  await actCallSimulationStandalone(page, ctx)

  // Act 5: Close
  await actClose(page, ctx)
}
