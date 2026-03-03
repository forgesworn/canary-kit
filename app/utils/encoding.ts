// app/utils/encoding.ts — Shared encoding helpers for group panels

import type { TokenEncoding } from 'canary-kit/encoding'
import type { AppGroup } from '../types.js'

/** Context string for group-mode token derivation. Used by hero, verify, and duress panels. */
export const GROUP_CONTEXT = 'canary:group'

/** Map the app's simple encoding name to a TokenEncoding object. */
export function toTokenEncoding(group: AppGroup): TokenEncoding {
  switch (group.encodingFormat) {
    case 'pin': return { format: 'pin', digits: 6 }
    case 'hex': return { format: 'hex', length: 8 }
    case 'words':
    default: return { format: 'words', count: group.wordCount }
  }
}
