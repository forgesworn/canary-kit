// e2e/mock-relay.ts — Lightweight NIP-01 WebSocket relay for testing
import { WebSocketServer, type WebSocket } from 'ws'

interface StoredEvent {
  id: string
  kind: number
  pubkey: string
  created_at: number
  tags: string[][]
  content: string
  sig: string
}

interface Subscription {
  ws: WebSocket
  filters: Record<string, unknown>
}

interface MockRelayOptions {
  dropLimitZeroLiveEvents?: boolean
}

export class MockRelay {
  private wss: WebSocketServer | null = null
  private events: StoredEvent[] = []
  private subs = new Map<string, Subscription[]>()
  private waiters: Array<{
    predicate: (filter: Record<string, unknown>) => boolean
    resolve: () => void
    reject: (err: Error) => void
    timer: ReturnType<typeof setTimeout>
  }> = []
  debug = false
  private _connCount = 0

  constructor(private readonly options: MockRelayOptions = {}) {}

  get port(): number {
    const addr = this.wss?.address()
    if (!addr || typeof addr === 'string') throw new Error('Relay not started')
    return addr.port
  }

  get url(): string {
    return `ws://localhost:${this.port}`
  }

  /** Read-only access to stored events (for test assertions). */
  get storedEvents(): readonly StoredEvent[] {
    return this.events
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WebSocketServer({ port: 0, host: '127.0.0.1' }, () => resolve())
      this.wss.on('connection', (ws) => this.handleConnection(ws))
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.wss) return resolve()
      for (const waiter of [...this.waiters]) {
        clearTimeout(waiter.timer)
        waiter.reject(new Error('relay-stopped'))
      }
      for (const client of this.wss.clients) {
        client.close()
      }
      this.wss.close(() => {
        this.wss = null
        this.events = []
        this.subs.clear()
        resolve()
      })
    })
  }

  reset(): void {
    this.events = []
  }

  waitForSubscription(
    predicate: (filter: Record<string, unknown>) => boolean,
    timeoutMs = 2_000,
  ): Promise<void> {
    for (const subs of this.subs.values()) {
      for (const sub of subs) {
        if (predicate(sub.filters)) return Promise.resolve()
      }
    }

    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve: () => {
          clearTimeout(waiter.timer)
          this.removeWaiter(waiter)
          resolve()
        },
        reject: (err: Error) => {
          this.removeWaiter(waiter)
          reject(err)
        },
        timer: setTimeout(() => waiter.reject(new Error('subscription-timeout')), timeoutMs),
      }
      this.waiters.push(waiter)
    })
  }

  private handleConnection(ws: WebSocket): void {
    const connId = ++this._connCount
    if (this.debug) console.log(`[relay] conn #${connId} opened`)
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as unknown[]
        if (!Array.isArray(msg) || msg.length < 2) return

        const type = msg[0] as string
        if (this.debug && type === 'EVENT') {
          const ev = msg[1] as StoredEvent
          console.log(`[relay] ← EVENT kind:${ev.kind} id:${ev.id?.slice(0, 8)}… pubkey:${ev.pubkey?.slice(0, 8)}… tags:${JSON.stringify(ev.tags)}`)
        }
        if (type === 'EVENT') {
          this.handleEvent(ws, msg[1] as StoredEvent)
        } else if (type === 'REQ') {
          this.handleReq(ws, msg[1] as string, msg.slice(2) as Record<string, unknown>[])
        } else if (type === 'CLOSE') {
          this.handleClose(ws, msg[1] as string)
        }
      } catch {
        // Ignore malformed messages
      }
    })

    ws.on('close', () => {
      for (const [subId, subs] of this.subs) {
        const filtered = subs.filter((s) => s.ws !== ws)
        if (filtered.length === 0) {
          this.subs.delete(subId)
        } else {
          this.subs.set(subId, filtered)
        }
      }
    })
  }

  private handleEvent(sender: WebSocket, event: StoredEvent): void {
    this.events.push(event)
    sender.send(JSON.stringify(['OK', event.id, true, '']))

    let delivered = 0
    for (const [subId, subs] of this.subs) {
      for (const sub of subs) {
        if (sub.ws === sender) continue
        if (sub.ws.readyState !== 1) continue
        if (this.options.dropLimitZeroLiveEvents && sub.filters.limit === 0) continue
        if (this.matchesFilter(event, sub.filters)) {
          sub.ws.send(JSON.stringify(['EVENT', subId, event]))
          delivered++
        }
      }
    }
    if (this.debug) console.log(`[relay] EVENT kind:${event.kind} id:${event.id?.slice(0, 8)}… → delivered to ${delivered} sub(s), total subs: ${this.subs.size}`)
  }

  private handleReq(ws: WebSocket, subId: string, filters: Record<string, unknown>[]): void {
    const filter = filters[0] ?? {}
    if (this.debug) console.log(`[relay] REQ subId:${subId} filter:`, JSON.stringify(filter))
    const existing = this.subs.get(subId) ?? []
    existing.push({ ws, filters: filter })
    this.subs.set(subId, existing)
    this.notifyWaiters(filter)

    if (filter.limit !== 0) {
      for (const event of this.events) {
        if (this.matchesFilter(event, filter)) {
          ws.send(JSON.stringify(['EVENT', subId, event]))
        }
      }
    }

    ws.send(JSON.stringify(['EOSE', subId]))
  }

  private handleClose(ws: WebSocket, subId: string): void {
    const subs = this.subs.get(subId)
    if (!subs) return
    const filtered = subs.filter((s) => s.ws !== ws)
    if (filtered.length === 0) {
      this.subs.delete(subId)
    } else {
      this.subs.set(subId, filtered)
    }
  }

  private matchesFilter(event: StoredEvent, filter: Record<string, unknown>): boolean {
    if (Array.isArray(filter.ids)) {
      if (!filter.ids.includes(event.id)) return false
    }
    if (Array.isArray(filter.kinds)) {
      if (!filter.kinds.includes(event.kind)) return false
    }
    if (Array.isArray(filter.authors)) {
      if (!filter.authors.includes(event.pubkey)) return false
    }
    if (typeof filter.since === 'number') {
      if (event.created_at < filter.since) return false
    }
    if (typeof filter.until === 'number') {
      if (event.created_at > filter.until) return false
    }

    for (const [key, value] of Object.entries(filter)) {
      if (key.startsWith('#') && Array.isArray(value)) {
        const tagName = key.slice(1)
        const eventTagValues = event.tags
          .filter((t) => t[0] === tagName)
          .map((t) => t[1])
        if (!value.some((v) => eventTagValues.includes(v as string))) {
          return false
        }
      }
    }

    return true
  }

  private notifyWaiters(filter: Record<string, unknown>): void {
    for (const waiter of [...this.waiters]) {
      if (waiter.predicate(filter)) waiter.resolve()
    }
  }

  private removeWaiter(waiter: MockRelay['waiters'][number]): void {
    const index = this.waiters.indexOf(waiter)
    if (index >= 0) this.waiters.splice(index, 1)
  }
}
