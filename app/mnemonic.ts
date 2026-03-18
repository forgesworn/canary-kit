// app/mnemonic.ts — Identity recovery via nsec-tree mnemonic derivation
import { fromMnemonic } from 'nsec-tree/mnemonic'
import { derivePersona, recoverPersonas } from 'nsec-tree/persona'
import type { TreeRoot } from 'nsec-tree/core'
import type { Persona } from 'nsec-tree/persona'
import { validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

export { validateMnemonic } from '@scure/bip39'

/**
 * Restore identity tree from a BIP-39 mnemonic.
 *
 * Uses nsec-tree's derivation path (m/44'/1237'/727'/0'/0') — NOT the
 * NIP-06 path. This is a clean break from the previous mnemonicToKeypair.
 */
export function restoreFromMnemonic(mnemonic: string): { root: TreeRoot; defaultPersona: Persona } {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic')
  }
  const root = fromMnemonic(mnemonic)
  const defaultPersona = derivePersona(root, 'personal', 0)
  return { root, defaultPersona }
}

/**
 * Recover all personas from a mnemonic using default + custom names.
 */
export function recoverFromMnemonic(
  mnemonic: string,
  customNames?: string[],
  scanRange?: number,
): { root: TreeRoot; personas: Map<string, Persona[]> } {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic')
  }
  const root = fromMnemonic(mnemonic)
  const personas = recoverPersonas(root, customNames, scanRange)
  return { root, personas }
}
