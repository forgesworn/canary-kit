import { describe, it, expect } from 'vitest'
import { getTargetGroups } from './duress.js'
import type { AppGroup } from '../types.js'

function makeGroup(id: string, personaName: string): AppGroup {
  return { id, personaName, name: id, seed: 'a'.repeat(64) } as any
}

describe('duress fan-out', () => {
  describe('getTargetGroups', () => {
    const groups: Record<string, AppGroup> = {
      'g1': makeGroup('g1', 'personal'),
      'g2': makeGroup('g2', 'personal'),
      'g3': makeGroup('g3', 'bitcoiner'),
      'g4': makeGroup('g4', 'bitcoiner'),
    }

    it('group scope returns only the origin group', () => {
      const targets = getTargetGroups(groups, 'g1', 'group')
      expect(targets.map(g => g.id)).toEqual(['g1'])
    })

    it('persona scope returns all groups with same personaName', () => {
      const targets = getTargetGroups(groups, 'g1', 'persona')
      expect(targets.map(g => g.id).sort()).toEqual(['g1', 'g2'])
    })

    it('master scope returns all groups', () => {
      const targets = getTargetGroups(groups, 'g1', 'master')
      expect(targets.map(g => g.id).sort()).toEqual(['g1', 'g2', 'g3', 'g4'])
    })

    it('returns empty for unknown origin group', () => {
      const targets = getTargetGroups(groups, 'unknown', 'group')
      expect(targets).toEqual([])
    })
  })
})
