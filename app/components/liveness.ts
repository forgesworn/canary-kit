// app/components/liveness.ts — Automatic liveness heartbeat broadcaster

import { getState, updateGroup } from '../state.js'
import { broadcastAction } from '../sync.js'

let _interval: ReturnType<typeof setInterval> | null = null

/**
 * Start broadcasting liveness check-ins for all groups.
 * Broadcasts immediately, then at the configured interval.
 * The app auto-sends check-ins when open — no user action required.
 */
export function startLivenessHeartbeat(intervalMs: number = 60_000): void {
  if (_interval) return
  broadcastCheckins()
  _interval = setInterval(broadcastCheckins, intervalMs)
}

/** Stop broadcasting liveness check-ins. */
export function stopLivenessHeartbeat(): void {
  if (_interval) {
    clearInterval(_interval)
    _interval = null
  }
}

function broadcastCheckins(): void {
  const { groups, identity } = getState()
  if (!identity) return
  const now = Math.floor(Date.now() / 1000)

  for (const [groupId, group] of Object.entries(groups)) {
    broadcastAction(groupId, {
      type: 'liveness-checkin',
      pubkey: identity.pubkey,
      timestamp: now,
    })

    // Record own check-in locally
    const checkins = { ...group.livenessCheckins, [identity.pubkey]: now }
    updateGroup(groupId, { livenessCheckins: checkins })
  }
}

const MAX_FUTURE_SKEW_SEC = 300

/**
 * Record a liveness check-in from another member (received via sync).
 */
export function recordCheckin(groupId: string, pubkey: string, timestamp: number): void {
  const group = getState().groups[groupId]
  if (!group) return
  const now = Math.floor(Date.now() / 1000)
  if (timestamp > now + MAX_FUTURE_SKEW_SEC) return // reject far-future check-ins
  const existing = group.livenessCheckins[pubkey] ?? 0
  if (timestamp <= existing) return // don't go backwards
  const checkins = { ...group.livenessCheckins, [pubkey]: timestamp }
  updateGroup(groupId, { livenessCheckins: checkins })
}
