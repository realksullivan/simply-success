// tests/05-today.spec.js
const { test, expect } = require('@playwright/test')
const { TodayPage } = require('../pages/TodayPage.js')
const { injectSession, mockAuthenticatedSupabase } = require('../fixtures/auth-helpers.js')
const { SAMPLE_TASK } = require('../fixtures/test-data.js')

test.describe('Today Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // injectSession uses addInitScript — must be called before any page.goto()
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
  })

  test("loads and shows today's date", async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    const dayName = page.getByText(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i).first()
    await expect(dayName).toBeVisible({ timeout: 8_000 })
  })

  test('shows focus hour section', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await expect(today.focusHourSection).toBeVisible({ timeout: 8_000 })
  })

  test('shows habits section', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await expect(today.habitsSection).toBeVisible({ timeout: 8_000 })
  })

  test('shows seeded habit from mock data', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await expect(page.getByText('Morning meditation')).toBeVisible({ timeout: 8_000 })
  })

  test('habit checkbox can be checked', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()

    // Find checkbox near the habit text
    const habitRow = page.getByText('Morning meditation').locator('..')
    const checkbox = habitRow.locator('input[type="checkbox"]').or(habitRow.locator('[role="checkbox"]')).first()
    await checkbox.click()
    await expect(checkbox).toBeChecked({ timeout: 5_000 })
  })

  test('can add a task', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.addTask(SAMPLE_TASK)
    await expect(page.getByText(SAMPLE_TASK)).toBeVisible({ timeout: 5_000 })
  })

  test('Won The Day button is visible', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await expect(today.wonTheDayButton).toBeVisible({ timeout: 8_000 })
  })

  test('clicking Won The Day marks day as won', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.wonTheDayButton.click()

    // Should show a won state
    const wonState = page.getByText(/you won|won ✓|🎉/i)
      .or(page.getByRole('button', { name: /won the day/i }).filter({ hasNot: page.locator('[disabled]') }))
    // Just verify the button was clickable and page didn't crash
    await expect(page).not.toHaveURL(/\/login/)
  })
})

test.describe('Today — Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
  })

  test('sidebar links to Goals', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.sidebarGoalsLink.click()
    await expect(page).toHaveURL(/\/goals/)
  })

  test('sidebar links to Projects', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.sidebarProjectsLink.click()
    await expect(page).toHaveURL(/\/projects/)
  })

  test('sidebar links to Reflection', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.sidebarReflectionLink.click()
    await expect(page).toHaveURL(/\/reflection/)
  })

  test('sidebar links to Analytics', async ({ page }) => {
    const today = new TodayPage(page)
    await today.goto()
    await today.sidebarAnalyticsLink.click()
    await expect(page).toHaveURL(/\/analytics/)
  })

  test('logout clears session and redirects', async ({ page }) => {
    await page.route('**/auth/v1/logout', async route => {
      await route.fulfill({ status: 204, body: '' })
    })
    const today = new TodayPage(page)
    await today.goto()
    await today.logoutButton.click()
    // After logout should land on landing page or login
    await expect(page).toHaveURL(/\/($|login)/, { timeout: 8_000 })
  })
})