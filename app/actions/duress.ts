import type { AppGroup } from '../types.js'
import type { DuressScope } from 'canary-kit/beacon'

/**
 * Get target groups for a duress alert based on scope.
 * Pure function — testable independently.
 */
export function getTargetGroups(
  groups: Record<string, AppGroup>,
  originGroupId: string,
  scope: DuressScope,
): AppGroup[] {
  const origin = groups[originGroupId]
  if (!origin) return []

  switch (scope) {
    case 'group':
      return [origin]
    case 'persona':
      return Object.values(groups).filter(g => g.personaName === origin.personaName)
    case 'master':
      return Object.values(groups)
  }
}
