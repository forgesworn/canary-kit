// e2e/offline/settings.spec.ts — Settings panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, openSettings, setEncodingFormat, getDisplayedWord } from '../helpers.js'

test.describe('Settings panel', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Test', { preset: 'family' })
  })

  test('theme toggle switches dark to light', async ({ cleanPage: page }) => {
    // App starts in dark mode (no data-theme attribute)
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light')

    // Find and click theme toggle (in header)
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('theme persists across reload', async ({ cleanPage: page }) => {
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    // Wait for debounced settings write to flush before reload
    await page.waitForFunction(
      () => {
        const raw = localStorage.getItem('canary:settings')
        return raw !== null && JSON.parse(raw).theme === 'light'
      },
      { timeout: 3000 },
    )
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('encoding format change: words to PIN', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'pin')
    // The hero word should now be a numeric PIN
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^[\d-]+$/) // digits with optional dash separator
  })

  test('encoding format change: words to hex', async ({ cleanPage: page }) => {
    await setEncodingFormat(page, 'hex')
    const word = await getDisplayedWord(page)
    expect(word).toMatch(/^[0-9a-f-]+$/i) // hex with optional dash separator
  })

  test('encoding format change updates hero display immediately', async ({ cleanPage: page }) => {
    const wordBefore = await getDisplayedWord(page)
    await setEncodingFormat(page, 'pin')
    const wordAfter = await getDisplayedWord(page)
    // Same counter but different encoding — should be different strings
    expect(wordAfter).not.toBe(wordBefore)
  })

  test('word count change (1 to 2)', async ({ cleanPage: page }) => {
    await openSettings(page)
    // Word count buttons only visible when encoding is 'words'
    const word1 = await getDisplayedWord(page)
    expect(word1.split(' ').length).toBe(1)

    await page.click('[data-words="2"]')
    await page.waitForTimeout(200)
    const word2 = await getDisplayedWord(page)
    expect(word2.split(' ').length).toBe(2)
  })
})
