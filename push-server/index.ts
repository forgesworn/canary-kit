// push-server/index.ts — Relay watcher + Web Push dispatcher
//
// Subscribes to the Nostr relay for stored sync events (kind 39111).
// When a duress-alert arrives, sends Web Push to registered devices.
// Also sends liveness reminders when check-in is overdue.

import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import webpush from 'web-push'
import { SimplePool } from 'nostr-tools/pool'

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT,
  RELAY_URL = 'wss://relay.trotters.cc',
  PORT = '3456',
} = process.env

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
  console.error('Missing VAPID keys — run: npm run generate-vapid')
  process.exit(1)
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// ── Subscription store (in-memory, fine for demo) ─────────

interface GroupInfo {
  tagHash: string
  livenessInterval: number
}

interface DeviceSub {
  subscription: webpush.PushSubscription
  groups: GroupInfo[]
  lastCheckin: Record<string, number> // tagHash → unix seconds
}

const devices: DeviceSub[] = []

function removeDevice(device: DeviceSub): void {
  const idx = devices.indexOf(device)
  if (idx >= 0) devices.splice(idx, 1)
}

function sendPush(device: DeviceSub, payload: string): void {
  webpush.sendNotification(device.subscription, payload).catch((err: any) => {
    console.warn('[push] Send failed:', err.statusCode ?? err.message)
    if (err.statusCode === 410 || err.statusCode === 404) {
      removeDevice(device)
    }
  })
}

// ── HTTP API ──────────────────────────────────────────────

const app = new Hono()

app.post('/subscribe', async (c) => {
  const body = await c.req.json<{
    subscription: webpush.PushSubscription
    groups: GroupInfo[]
  }>()
  if (!body.subscription?.endpoint || !Array.isArray(body.groups)) {
    return c.json({ error: 'Invalid payload' }, 400)
  }

  const existing = devices.find((d) => d.subscription.endpoint === body.subscription.endpoint)
  if (existing) {
    existing.groups = body.groups
    existing.subscription = body.subscription
  } else {
    devices.push({ subscription: body.subscription, groups: body.groups, lastCheckin: {} })
  }

  console.info(`[push] Registered device (${devices.length} total), groups: ${body.groups.length}`)
  return c.json({ ok: true })
})

app.post('/checkin', async (c) => {
  const body = await c.req.json<{ endpoint: string; tagHash: string }>()
  const device = devices.find((d) => d.subscription.endpoint === body.endpoint)
  if (device) {
    device.lastCheckin[body.tagHash] = Math.floor(Date.now() / 1000)
    console.info(`[push] Check-in for ${body.tagHash.slice(0, 12)}`)
  }
  return c.json({ ok: true })
})

app.get('/health', (c) => c.json({ status: 'ok', devices: devices.length }))

serve({ fetch: app.fetch, port: Number(PORT) })
console.info(`[push] HTTP server on port ${PORT}`)

// ── Relay watcher — duress alerts ─────────────────────────

const STORED_KIND = 39_111
const pool = new SimplePool()

function startWatching(): void {
  console.info(`[push] Connecting to ${RELAY_URL}`)

  pool.subscribeMany(
    [RELAY_URL],
    { kinds: [STORED_KIND], since: Math.floor(Date.now() / 1000) } as any,
    {
      onevent(event: any) {
        const dTag = event.tags?.find((t: string[]) => t[0] === 'd')?.[1] ?? ''
        const groupHash = dTag.split(':')[0]
        const msgType = dTag.split(':')[1] ?? ''

        if (!groupHash) return
        if (msgType !== 'duress-alert') return

        console.info(`[push] Duress alert for group ${groupHash.slice(0, 12)}`)

        const targets = devices.filter((d) => d.groups.some((g) => g.tagHash === groupHash))
        if (targets.length === 0) return

        const payload = JSON.stringify({
          title: 'CANARY — Emergency Alert',
          body: 'A group member may need help.',
          tag: `duress-${groupHash.slice(0, 8)}`,
          url: './',
        })

        for (const device of targets) {
          sendPush(device, payload)
        }
      },
      oneose() {
        console.info('[push] EOSE — watching for new events')
      },
    },
  )
}

startWatching()

// ── Liveness reminder loop ────────────────────────────────
// Check every 30s. Nudge when 90% of the interval has passed.

setInterval(() => {
  const now = Math.floor(Date.now() / 1000)
  for (const device of devices) {
    for (const group of device.groups) {
      if (group.livenessInterval <= 0) continue
      const last = device.lastCheckin[group.tagHash] ?? 0
      if (last === 0) continue // never checked in — don't nag on first run

      const elapsed = now - last
      const nudgeAt = Math.floor(group.livenessInterval * 0.9)
      // Only nudge once per interval (within a 60s window)
      if (elapsed >= nudgeAt && elapsed < nudgeAt + 60) {
        const payload = JSON.stringify({
          title: 'CANARY — Check In',
          body: 'Your group is expecting a check-in. Tap to confirm you\'re OK.',
          tag: `liveness-${group.tagHash.slice(0, 8)}`,
          url: './',
        })
        sendPush(device, payload)
      }
    }
  }
}, 30_000)

console.info('[push] Liveness reminder loop started (30s interval)')
