import { describe, it, expect, beforeEach, vi } from 'vitest'
import { queueDuressAlert, drainDuressQueue, clearDuressQueue } from './duress-queue.js'

// Simple localStorage mock
const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
}

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key]
  vi.stubGlobal('localStorage', localStorageMock)
})

describe('duress-queue', () => {
  it('queues and drains alerts for a group', async () => {
    const msg1 = { type: 'duress-alert', opId: '1', timestamp: 100 } as any
    const msg2 = { type: 'duress-alert', opId: '2', timestamp: 200 } as any

    queueDuressAlert('group1', msg1)
    queueDuressAlert('group1', msg2)

    const drained = await drainDuressQueue('group1')
    expect(drained).toHaveLength(2)
    expect(drained[0].opId).toBe('1')
    expect(drained[1].opId).toBe('2')

    // Queue is empty after drain
    expect(await drainDuressQueue('group1')).toHaveLength(0)
  })

  it('only drains alerts for the specified group', async () => {
    queueDuressAlert('group1', { type: 'duress-alert', opId: 'a', timestamp: 100 } as any)
    queueDuressAlert('group2', { type: 'duress-alert', opId: 'b', timestamp: 200 } as any)

    const drained = await drainDuressQueue('group1')
    expect(drained).toHaveLength(1)
    expect(drained[0].opId).toBe('a')

    // group2 still has its alert
    const drained2 = await drainDuressQueue('group2')
    expect(drained2).toHaveLength(1)
    expect(drained2[0].opId).toBe('b')
  })

  it('clearDuressQueue removes everything', async () => {
    queueDuressAlert('group1', { type: 'duress-alert', opId: 'x', timestamp: 100 } as any)
    clearDuressQueue()
    expect(await drainDuressQueue('group1')).toHaveLength(0)
  })
})
