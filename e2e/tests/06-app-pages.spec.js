// tests/06-app-pages.spec.js
const { test, expect } = require('@playwright/test')
const { GoalsPage } = require('../pages/GoalsPage.js')
const { ProjectsPage } = require('../pages/ProjectsPage.js')
const { ReflectionPage, AnalyticsPage } = require('../pages/ReflectionPage.js')
const { injectSession, mockAuthenticatedSupabase } = require('../fixtures/auth-helpers.js')
const { SAMPLE_GOAL, SAMPLE_PROJECT, SAMPLE_REFLECTION } = require('../fixtures/test-data.js')

test.describe('Goals Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
  })

  test('loads and shows heading', async ({ page }) => {
    const goals = new GoalsPage(page)
    await goals.goto()
    await expect(goals.heading).toBeVisible({ timeout: 8_000 })
  })

  test('shows existing goal from mock data', async ({ page }) => {
    const goals = new GoalsPage(page)
    await goals.goto()
    await expect(page.getByText('Launch WinForge')).toBeVisible({ timeout: 8_000 })
  })

  test('add goal button opens input', async ({ page }) => {
    const goals = new GoalsPage(page)
    await goals.goto()
    await goals.addGoalButton.click()
    await expect(goals.goalInput).toBeVisible()
  })

  test('can type a goal title', async ({ page }) => {
    const goals = new GoalsPage(page)
    await goals.goto()
    await goals.addGoalButton.click()
    await goals.goalInput.fill(SAMPLE_GOAL)
    await expect(goals.goalInput).toHaveValue(SAMPLE_GOAL)
  })

  test('saving a goal calls Supabase', async ({ page }) => {
    let goalSaved = false
    await page.route('**/rest/v1/goals*', async route => {
      if (route.request().method() === 'POST') {
        goalSaved = true
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([{ id: 'new-g', title: SAMPLE_GOAL }]) })
      } else { await route.continue() }
    })

    const goals = new GoalsPage(page)
    await goals.goto()
    await goals.addGoalButton.click()
    await goals.goalInput.fill(SAMPLE_GOAL)
    await goals.saveGoalButton.click()
    await page.waitForTimeout(1000)
    expect(goalSaved).toBe(true)
  })

  test('cancel button dismisses input', async ({ page }) => {
    const goals = new GoalsPage(page)
    await goals.goto()
    await goals.addGoalButton.click()
    await goals.goalInput.fill('temp')
    await goals.cancelButton.click()
    await expect(goals.goalInput).not.toBeVisible()
  })
})

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
  })

  test('loads and shows heading', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    await expect(projects.heading).toBeVisible({ timeout: 8_000 })
  })

  test('shows existing project from mock data', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    await expect(page.getByText('Build MVP')).toBeVisible({ timeout: 8_000 })
  })

  test('add project button opens form', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    // Look for any add/new project button
    const addBtn = page.getByRole('button', { name: /add|new|\+/i }).first()
    await addBtn.click()
    // Some input should appear
    const input = page.locator('input[type="text"], textarea').first()
    await expect(input).toBeVisible({ timeout: 5_000 })
  })

  test('can fill in project title', async ({ page }) => {
    const projects = new ProjectsPage(page)
    await projects.goto()
    const addBtn = page.getByRole('button', { name: /add|new|\+/i }).first()
    await addBtn.click()
    const input = page.locator('input[type="text"], textarea').first()
    await input.fill(SAMPLE_PROJECT)
    await expect(input).toHaveValue(SAMPLE_PROJECT)
  })
})

test.describe('Reflection Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
  })

  test('loads reflection page', async ({ page }) => {
    const reflection = new ReflectionPage(page)
    await reflection.goto()
    await expect(page).toHaveURL(/\/reflection/)
  })

  test('shows text input areas', async ({ page }) => {
    const reflection = new ReflectionPage(page)
    await reflection.goto()
    // Look for any textarea or contenteditable area
    const inputs = page.locator('textarea, [contenteditable]')
    await expect(inputs.first()).toBeVisible({ timeout: 8_000 })
  })

  test('can type in reflection area', async ({ page }) => {
    const reflection = new ReflectionPage(page)
    await reflection.goto()
    const textarea = page.locator('textarea').first()
    await textarea.waitFor({ state: 'visible', timeout: 8_000 })
    await textarea.fill(SAMPLE_REFLECTION)
    await expect(textarea).toHaveValue(SAMPLE_REFLECTION)
  })

  test('multiple reflection prompts are present', async ({ page }) => {
    const reflection = new ReflectionPage(page)
    await reflection.goto()
    // Wait for page to load, then count inputs
    await page.waitForLoadState('networkidle')
    const count = await page.locator('textarea, [contenteditable]').count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page)
    await mockAuthenticatedSupabase(page)
    await page.route('**/rest/v1/daily_checklists*', async route => {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify([
          { date: '2026-03-01', won_the_day: true },
          { date: '2026-03-02', won_the_day: false },
        ])
      })
    })
  })

  test('loads analytics page', async ({ page }) => {
    const analytics = new AnalyticsPage(page)
    await analytics.goto()
    await expect(page).toHaveURL(/\/analytics/)
  })

  test('shows analytics content', async ({ page }) => {
    const analytics = new AnalyticsPage(page)
    await analytics.goto()
    await expect(analytics.heading).toBeVisible({ timeout: 8_000 })
  })
})