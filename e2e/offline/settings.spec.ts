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

  // ── Export / Import ──────────────────────────────────────────

  test('export group triggers download with correct filename', async ({ cleanPage: page }) => {
    await openSettings(page)

    page.on('dialog', async dialog => await dialog.accept())

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-btn'),
    ])

    expect(download.suggestedFilename()).toBe('canary-test.json')

    // Verify the downloaded content is valid group JSON
    const path = await download.path()
    if (path) {
      const fs = await import('fs')
      const content = JSON.parse(fs.readFileSync(path, 'utf-8'))
      expect(content.name).toBe('Test')
      expect(content.seed).toMatch(/^[0-9a-f]{64}$/)
      expect(content.members).toBeInstanceOf(Array)
    }
  })

  test('import group creates new group from exported JSON', async ({ cleanPage: page }) => {
    await openSettings(page)

    // First export the current group to get valid JSON
    page.on('dialog', async dialog => await dialog.accept())

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export-btn'),
    ])
    const dlPath = await download.path()
    const fs = await import('fs')
    const exportedJson = dlPath ? fs.readFileSync(dlPath, 'utf-8') : ''
    expect(exportedJson).toBeTruthy()

    // Modify the name so we can distinguish the import
    const modified = JSON.parse(exportedJson)
    modified.name = 'Imported Group'

    const os = await import('os')
    const pathMod = await import('path')
    const tmpFile = pathMod.join(os.tmpdir(), 'canary-import-test.json')
    fs.writeFileSync(tmpFile, JSON.stringify(modified))

    try {
      // Click import — triggers confirm dialog (already accepted above) + file picker
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('#import-btn'),
      ])
      await fileChooser.setFiles(tmpFile)

      // Wait for the imported group to appear in sidebar
      await page.waitForSelector('.group-list__name:has-text("Imported Group")', { timeout: 5000 })
      const groups = await page.locator('.group-list__name').allTextContents()
      expect(groups).toContain('Imported Group')
    } finally {
      fs.unlinkSync(tmpFile)
    }
  })

  test('import rejects invalid JSON with alert', async ({ cleanPage: page }) => {
    await openSettings(page)

    let alertMessage = ''
    page.on('dialog', async dialog => {
      alertMessage = dialog.message()
      await dialog.accept()
    })

    const fs = await import('fs')
    const os = await import('os')
    const pathMod = await import('path')
    const tmpFile = pathMod.join(os.tmpdir(), 'canary-bad-import.json')
    fs.writeFileSync(tmpFile, '{"name": "bad", "seed": "tooshort"}')

    try {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('#import-btn'),
      ])
      await fileChooser.setFiles(tmpFile)
      await page.waitForTimeout(500)

      expect(alertMessage).toContain('import')
    } finally {
      fs.unlinkSync(tmpFile)
    }
  })

  // ── Reseed / Key rotation ────────────────────────────────────

  test('rotate key changes verification word', async ({ cleanPage: page }) => {
    const wordBefore = await getDisplayedWord(page)
    await openSettings(page)

    page.on('dialog', async dialog => await dialog.accept())
    await page.click('#reseed-btn')

    // Toast should confirm
    await expect(page.locator('.toast', { hasText: 'Key rotated' })).toBeVisible()

    // Word should change (new seed)
    const wordAfter = await getDisplayedWord(page)
    expect(wordAfter).not.toBe(wordBefore)
  })

  test('rotate key bumps epoch', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.waitForTimeout(300)
    const stateBefore = await getGroupState(page)

    page.on('dialog', async dialog => await dialog.accept())
    await page.click('#reseed-btn')
    await page.waitForTimeout(300)

    const stateAfter = await getGroupState(page)
    expect(stateAfter.seed).not.toBe(stateBefore.seed)
    expect(stateAfter.epoch).toBe(((stateBefore.epoch as number) ?? 0) + 1)
  })

  test('compromise reseed changes seed', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.waitForTimeout(300)
    const stateBefore = await getGroupState(page)

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Compromise reseed')
      await dialog.accept()
    })
    await page.click('#compromise-reseed-btn')

    await expect(page.locator('.toast', { hasText: 'Emergency reseed' })).toBeVisible()
    await page.waitForTimeout(300)

    const stateAfter = await getGroupState(page)
    expect(stateAfter.seed).not.toBe(stateBefore.seed)
    expect(stateAfter.epoch).toBe(((stateBefore.epoch as number) ?? 0) + 1)
  })

  test('decline reseed keeps same seed', async ({ cleanPage: page }) => {
    await openSettings(page)
    await page.waitForTimeout(300)
    const stateBefore = await getGroupState(page)

    page.on('dialog', async dialog => await dialog.dismiss())
    await page.click('#reseed-btn')
    await page.waitForTimeout(300)

    const stateAfter = await getGroupState(page)
    expect(stateAfter.seed).toBe(stateBefore.seed)
  })
})
