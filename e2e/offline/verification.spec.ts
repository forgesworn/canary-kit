// e2e/offline/verification.spec.ts — Hero panel: word display, reveal, countdown, burn
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getDisplayedWord } from '../helpers.js'

test.describe('Verification display (hero panel)', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test', { preset: 'family' })
  })

  test('hero panel shows masked word by default', async ({ cleanPage: page }) => {
    const wordEl = page.locator('#hero-word')
    await expect(wordEl).toBeVisible()
    // Should contain bullet dots (masked)
    const text = await wordEl.textContent()
    expect(text).toMatch(/^[•]+$/)
  })

  test('hold-to-reveal shows actual word', async ({ cleanPage: page }) => {
    const word = await getDisplayedWord(page)
    expect(word).toBeTruthy()
    expect(word).not.toMatch(/^[•]+$/) // not masked
  })

  test('release hides word again', async ({ cleanPage: page }) => {
    const revealBtn = page.locator('#hero-reveal-btn')
    await revealBtn.dispatchEvent('pointerdown')
    await page.waitForTimeout(100)

    // Word is revealed
    const wordEl = page.locator('#hero-word')
    await expect(wordEl).not.toHaveClass(/hero__word--masked/)

    // Release
    await revealBtn.dispatchEvent('pointerup')
    await page.waitForTimeout(100)

    // Word is masked again
    await expect(wordEl).toHaveClass(/hero__word--masked/)
  })

  test('countdown label is visible', async ({ cleanPage: page }) => {
    await expect(page.locator('#hero-countdown-label')).toBeVisible()
    const text = await page.locator('#hero-countdown-label').textContent()
    expect(text).toMatch(/rotates/)
  })

  test('"I used this word" advances counter and shows new word', async ({ cleanPage: page }) => {
    const wordBefore = await getDisplayedWord(page)

    await page.click('#burn-btn')
    await page.waitForTimeout(200)

    const wordAfter = await getDisplayedWord(page)
    expect(wordAfter).toBeTruthy()
    // After burn, the word should change (different counter)
    expect(wordAfter).not.toBe(wordBefore)
  })

  test('rapid burns advance counter correctly', async ({ cleanPage: page }) => {
    const word1 = await getDisplayedWord(page)

    // Burn twice rapidly
    await page.click('#burn-btn')
    await page.waitForTimeout(150)
    await page.click('#burn-btn')
    await page.waitForTimeout(300)

    const word3 = await getDisplayedWord(page)
    expect(word3).not.toBe(word1)
  })

  test('burn persists across reload', async ({ cleanPage: page }) => {
    await page.click('#burn-btn')
    await page.waitForTimeout(300)
    const wordAfterBurn = await getDisplayedWord(page)

    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    const wordAfterReload = await getDisplayedWord(page)

    expect(wordAfterReload).toBe(wordAfterBurn)
  })

  test('progress bar is visible', async ({ cleanPage: page }) => {
    await expect(page.locator('#hero-progress-bar')).toBeVisible()
  })
})
