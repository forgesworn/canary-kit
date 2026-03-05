// e2e/offline/duress.spec.ts — Duress panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord, addSimulatedMember } from '../helpers.js'

test.describe('Duress panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    // Need at least 2 members for duress to be meaningful
    await createGroup(page, 'Test', { preset: 'family' })
    // Add a simulated member so duress words can be derived
    await addSimulatedMember(page)
  })

  test('duress panel shows masked word', async ({ cleanPage: page }) => {
    const duressWord = page.locator('#duress-word')
    await expect(duressWord).toBeVisible()
    const text = await duressWord.textContent()
    expect(text).toMatch(/^[•]+$/)
  })

  test('hold-to-reveal shows duress word', async ({ cleanPage: page }) => {
    const holdBtn = page.locator('#duress-hold-btn')
    await holdBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(600) // duress reveal has a delay

    const duressWord = page.locator('#duress-word')
    await expect(duressWord).not.toHaveClass(/duress-word--masked/)
    const text = await duressWord.textContent()
    expect(text).toBeTruthy()
    expect(text).not.toMatch(/^[•]+$/)

    await holdBtn.dispatchEvent('pointerup')
  })

  test('duress word differs from verification word', async ({ cleanPage: page }) => {
    const verificationWord = await getDisplayedWord(page)

    // Reveal duress word
    const holdBtn = page.locator('#duress-hold-btn')
    await holdBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(600)
    const duressWord = await page.locator('#duress-word').textContent()
    await holdBtn.dispatchEvent('pointerup')

    expect(duressWord).toBeTruthy()
    expect(duressWord!.trim()).not.toBe(verificationWord)
  })
})
