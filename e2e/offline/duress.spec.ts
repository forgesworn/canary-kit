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
    // Dispatch pointerdown and immediately read text (before any re-render can mask it)
    const text = await page.evaluate(() => {
      const btn = document.getElementById('duress-hold-btn')
      btn?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true }))
      const wordText = document.getElementById('duress-word')?.textContent?.trim() ?? ''
      btn?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      return wordText
    })
    expect(text).toBeTruthy()
    expect(text).not.toMatch(/^[•]+$/)
  })

  test('duress word differs from verification word', async ({ cleanPage: page }) => {
    const verificationWord = await getDisplayedWord(page)

    // Reveal duress word via proper PointerEvent
    const duressWord = await page.evaluate(() => {
      const btn = document.getElementById('duress-hold-btn')
      btn?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true }))
      const text = document.getElementById('duress-word')?.textContent?.trim() ?? ''
      btn?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      return text
    })

    expect(duressWord).toBeTruthy()
    expect(duressWord).not.toBe(verificationWord)
  })
})
