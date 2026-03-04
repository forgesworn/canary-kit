import { DEFAULT_ROTATION_INTERVAL } from './counter.js'

/** Named threat-profile preset identifier. */
export type PresetName = 'family' | 'field-ops' | 'enterprise' | 'event'

/**
 * A threat-profile preset — pre-configured group settings optimised for
 * a specific risk level and use case.
 */
export interface GroupPreset {
  /** Words per verification challenge. */
  wordCount: 1 | 2 | 3
  /** Rotation interval in seconds. Must be a positive integer. */
  rotationInterval: number
  /** Human-readable description of the preset's trade-offs. */
  description: string
}

/**
 * Built-in threat-profile presets.
 *
 * | Preset       | Words | Rotation | Use case                           |
 * |--------------|-------|----------|------------------------------------|
 * | `family`     | 1     | 7 days   | Casual family/friend verification  |
 * | `field-ops`  | 2     | 24 hours | Journalism, activism, field work   |
 * | `enterprise` | 2     | 48 hours | Corporate incident response        |
 * | `event`      | 1     | 4 hours  | Conferences, festivals, meetups    |
 */
export const PRESETS: Readonly<Record<PresetName, Readonly<GroupPreset>>> = Object.freeze({
  family: Object.freeze({
    wordCount: 1,
    rotationInterval: DEFAULT_ROTATION_INTERVAL,
    description:
      'Casual verification for family and friends. Single word, weekly rotation. ' +
      'Adequate for live voice calls where the attacker gets one attempt.',
  }),
  'field-ops': Object.freeze({
    wordCount: 2,
    rotationInterval: 86_400,
    description:
      'High-security preset for journalism, activism, and field operations. ' +
      'Two-word phrases (~22 bits) with daily rotation. Use burn-after-use for maximum protection.',
  }),
  enterprise: Object.freeze({
    wordCount: 2,
    rotationInterval: 172_800,
    description:
      'Enterprise incident response. Two-word phrases with 48-hour rotation. ' +
      'Balances security with operational convenience for larger teams.',
  }),
  event: Object.freeze({
    wordCount: 1,
    rotationInterval: 14_400,
    description:
      'Temporary groups for conferences, festivals, and meetups. ' +
      'Single word with 4-hour rotation. Fast setup, easy to share at the door.',
  }),
})
