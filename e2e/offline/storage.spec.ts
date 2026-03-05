// e2e/offline/storage.spec.ts — State persistence and PIN lock
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, getGroupNames, waitForPersist } from '../helpers.js'

test.describe('Storage and persistence', () => {
  test('state persists across page reload', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
    await createGroup(page, 'Persistent Group')

    await waitForPersist(page)
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })

    const groups = await getGroupNames(page)
    expect(groups).toContain('Persistent Group')
  })

  test('identity persists across reload', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Memorised')

    await page.waitForFunction(
      () => localStorage.getItem('canary:identity') !== null,
      { timeout: 3000 },
    )
    await page.reload()
    await page.waitForSelector('#sidebar', { timeout: 5000 })

    await expect(page.locator('.identity-badge__name')).toHaveText('Memorised')
  })
})
