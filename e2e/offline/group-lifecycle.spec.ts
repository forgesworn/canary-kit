// e2e/offline/group-lifecycle.spec.ts — Group create, rename, delete
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, switchGroup, getGroupNames, openSettings } from '../helpers.js'

test.describe('Group lifecycle', () => {
  test.beforeEach(async ({ cleanPage: page }) => {
    await loginOffline(page, 'Tester')
  })

  test('create group with family preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Family Chat', { preset: 'family' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Family Chat')
  })

  test('create group with field-ops preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Field Team', { preset: 'field-ops' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Field Team')
  })

  test('create group with enterprise preset', async ({ cleanPage: page }) => {
    await createGroup(page, 'Security Ops', { preset: 'enterprise' })
    const groups = await getGroupNames(page)
    expect(groups).toContain('Security Ops')
  })

  test('group appears in sidebar after creation', async ({ cleanPage: page }) => {
    await createGroup(page, 'Test Group')
    await expect(page.locator('.group-list__item')).toBeVisible()
    await expect(page.locator('.group-list__name')).toHaveText('Test Group')
  })

  test('rename group via settings', async ({ cleanPage: page }) => {
    await createGroup(page, 'Old Name')
    await openSettings(page)
    await page.fill('#settings-name', 'New Name')
    await page.locator('#settings-name').dispatchEvent('change')
    await expect(page.locator('.group-list__name')).toHaveText('New Name')
  })

  test('delete group removes from sidebar', async ({ cleanPage: page }) => {
    await createGroup(page, 'Doomed Group')
    await openSettings(page)

    // Click dissolve — there should be a confirm dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept()
    })
    await page.click('#dissolve-btn')

    await expect(page.locator('.group-list__item')).not.toBeVisible()
  })

  test('decline dissolve keeps group in sidebar', async ({ cleanPage: page }) => {
    await createGroup(page, 'KeepMe')
    await openSettings(page)
    page.once('dialog', async dialog => await dialog.dismiss())
    await page.click('#dissolve-btn')
    await page.waitForTimeout(300)
    const groups = await getGroupNames(page)
    expect(groups).toContain('KeepMe')
  })

  test('multiple groups: switching updates display', async ({ cleanPage: page }) => {
    await createGroup(page, 'Group Alpha')
    await createGroup(page, 'Group Beta')

    await switchGroup(page, 'Group Alpha')
    await expect(page.locator('.group-list__item--active')).toContainText('Group Alpha')

    await switchGroup(page, 'Group Beta')
    await expect(page.locator('.group-list__item--active')).toContainText('Group Beta')
  })
})
