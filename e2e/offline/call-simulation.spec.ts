// e2e/offline/call-simulation.spec.ts — Call verification demo tests
import { test, expect } from '../fixtures.js'
import { loginOffline, createGroup, addSimulatedMember } from '../helpers.js'

test.describe('Call simulation', () => {
  test('verify call button shown for 2+ member groups', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Pair')
    // Add a second member
    await addSimulatedMember(page)
    await expect(page.locator('#hero-call-btn')).toBeVisible()
  })

  test('verify call button NOT shown for single member group', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Solo')
    await expect(page.locator('#hero-call-btn')).not.toBeVisible()
  })

  test('call demo view: scenario tabs visible', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Test')
    // Switch to call demo via header tab
    await page.click('.header__nav-tab[data-view="call-demo"]')
    await page.waitForTimeout(300)
    // The call demo should show scenario buttons
    await expect(page.locator('.call-sim__scenario-btn')).toHaveCount(3, { timeout: 5000 })
    await expect(page.locator('.call-sim__scenario-btn[data-scenario="insurance"]')).toBeVisible()
    await expect(page.locator('.call-sim__scenario-btn[data-scenario="pickup"]')).toBeVisible()
    await expect(page.locator('.call-sim__scenario-btn[data-scenario="rideshare"]')).toBeVisible()
  })

  test('call demo shows directional words (caller ≠ receiver)', async ({ cleanPage: page }) => {
    await loginOffline(page, 'Alice')
    await createGroup(page, 'Test')
    // Switch to call demo via header tab
    await page.click('.header__nav-tab[data-view="call-demo"]')
    await page.waitForTimeout(300)

    // Both caller and agent token elements should be visible
    const callerToken = page.locator('#caller-reveal')
    const agentToken = page.locator('#agent-reveal')

    await expect(callerToken).toBeVisible({ timeout: 5000 })
    await expect(agentToken).toBeVisible()

    // Read the real token value from data attribute (display is masked)
    const callerReal = await callerToken.getAttribute('data-real')
    const agentReal = await agentToken.getAttribute('data-real')
    expect(callerReal).toBeTruthy()
    expect(agentReal).toBeTruthy()
    // Directional: caller and receiver should see DIFFERENT words
    expect(callerReal).not.toBe(agentReal)
  })
})
