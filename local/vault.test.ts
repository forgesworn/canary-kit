import { describe, expect, it } from 'vitest'
import { createVault, unlockVault, sealEntries, parseVault, closeVault, enableDeviceUnlock, unlockWithDevice, exportVault } from './vault.js'
import { createPair } from './model.js'

const password = 'a sufficiently long test passphrase'

describe('encrypted local vault', () => {
  it('requires PRF encryption material for device unlock and keeps backups portable', async () => {
    const vault = await createVault(password)
    const credential = () => ({ rawId: new Uint8Array([1, 2, 3]).buffer, getClientExtensionResults: () => ({ prf: { enabled: true, results: { first: new Uint8Array(32).fill(77).buffer } } }) })
    const provider = { create: async () => credential(), get: async () => credential() } as unknown as CredentialsContainer
    const record = await enableDeviceUnlock(vault, 'https://example.test', provider)
    const byDevice = await unlockWithDevice(record, 'https://example.test', provider)
    expect([...byDevice.master]).toEqual([...vault.master])
    await expect(unlockWithDevice(record, 'https://different.test', provider)).rejects.toThrow()
    const noPrf = { create: async () => ({ rawId: new Uint8Array([4]).buffer, getClientExtensionResults: () => ({}) }) } as unknown as CredentialsContainer
    await expect(enableDeviceUnlock(vault, 'https://example.test', noPrf)).rejects.toThrow(/not supported/)
    const backup = parseVault(exportVault(record))
    expect(backup.device).toBeUndefined()
    const recovered = await unlockVault(backup, password)
    expect([...recovered.master]).toEqual([...vault.master])
    closeVault(vault); closeVault(byDevice); closeVault(recovered)
  })

  it('encrypts secrets and nicknames, restores with the passphrase, and changes nonces on save', async () => {
    const vault = await createVault(password)
    const pair = createPair()
    const entries = [{ id: 'pair-1', label: 'My friend', pair }]
    const record = await sealEntries(vault, entries)
    const text = JSON.stringify(record)
    expect(text).not.toContain(pair.mnemonic)
    expect(text).not.toContain('My friend')
    expect(record.data.iv).not.toBe(vault.record.data.iv)
    const restored = await unlockVault(parseVault(text), password)
    expect(restored.entries).toEqual(entries)
    closeVault(restored)
    expect([...restored.master]).toEqual(new Array(32).fill(0))
    expect(restored.entries).toEqual([])
    closeVault(vault)
  })

  it('rejects wrong passphrases, modified ciphertext and unbounded inputs', async () => {
    const vault = await createVault(password)
    await expect(unlockVault(vault.record, password + 'wrong')).rejects.toThrow()
    const changed = structuredClone(vault.record)
    changed.data.ciphertext = (changed.data.ciphertext[0] === 'A' ? 'B' : 'A') + changed.data.ciphertext.slice(1)
    await expect(unlockVault(changed, password)).rejects.toThrow()
    expect(() => parseVault('x'.repeat(300_000))).toThrow()
    expect(() => parseVault(JSON.stringify({ ...vault.record, v: 99 }))).toThrow()
    await expect(createVault('too short')).rejects.toThrow()
    closeVault(vault)
  })
})
