// e2e/offline/settings.spec.ts — Settings panel tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, openSettings, setEncodingFormat, getDisplayedWord, getGroupState } from '../helpers.js'

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

  test('rotation interval change: 30s to 24h', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-interval="86400"]')
    await expect(page.locator('[data-interval="86400"]')).toHaveClass(/segmented__btn--active/)
    await page.waitForTimeout(300)
    const state = await getGroupState(page)
    expect(state.rotationInterval).toBe(86400)
  })

  test('rotation interval persists across reload', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-interval="604800"]')
    await page.waitForTimeout(200)
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })
    await openSettings(page)
    await expect(page.locator('[data-interval="604800"]')).toHaveClass(/segmented__btn--active/)
  })

  test('tolerance change: +/-1 to +/-3', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-tolerance="3"]')
    await expect(page.locator('[data-tolerance="3"]')).toHaveClass(/segmented__btn--active/)
    await page.waitForTimeout(300)
    const state = await getGroupState(page)
    expect(state.tolerance).toBe(3)
  })

  test('tolerance 0 (exact match only)', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-tolerance="0"]')
    await expect(page.locator('[data-tolerance="0"]')).toHaveClass(/segmented__btn--active/)
    await page.waitForTimeout(300)
    const state = await getGroupState(page)
    expect(state.tolerance).toBe(0)
  })

  test('duress mode change: immediate to dead-drop', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-duress-mode="dead-drop"]')
    await expect(page.locator('[data-duress-mode="dead-drop"]')).toHaveClass(/segmented__btn--active/)
    await page.waitForTimeout(300)
    const state = await getGroupState(page)
    expect(state.duressMode).toBe('dead-drop')
  })

  test('duress mode change: to both', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.click('[data-duress-mode="both"]')
    await expect(page.locator('[data-duress-mode="both"]')).toHaveClass(/segmented__btn--active/)
    await page.waitForTimeout(300)
    const state = await getGroupState(page)
    expect(state.duressMode).toBe('both')
  })

  test('disabling Nostr sync hides relay settings', async ({ cleanPage: page }) => {
    // Need an online group to see the Nostr toggle
    await createGroup(page, 'OnlineTest', { mode: 'online', myName: 'Tester' })
    await openSettings(page)

    const toggle = page.locator('#nostr-toggle')
    await expect(toggle).toBeChecked()

    await toggle.uncheck()
    await expect(page.locator('#nostr-settings')).toBeHidden()

    // Verification should still work offline
    const word = await getDisplayedWord(page)
    expect(word).toBeTruthy()
  })

  test('settings drawer stays open after state change', async ({ cleanPage: page }) => {
    await openSettings(page)
    await expect(page.locator('#settings-body')).toBeVisible()

    // Trigger a state change by changing encoding (causes re-render)
    await page.click('[data-enc="pin"]')
    await page.waitForTimeout(200)

    // Drawer should still be open after re-render
    await expect(page.locator('#settings-body')).toBeVisible()
  })
})
