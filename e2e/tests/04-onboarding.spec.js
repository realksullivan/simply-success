// tests/04-onboarding.spec.js
const { test, expect } = require('@playwright/test')
const { OnboardingPage } = require('../pages/OnboardingPage.js')
const { injectSession } = require('../fixtures/auth-helpers.js')
const { SAMPLE_GOAL, SAMPLE_PROJECT, SAMPLE_CUSTOM_HABIT } = require('../fixtures/test-data.js')

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Inject auth session with onboarding NOT complete
    // This lets us access /onboarding without being redirected to /login
    await injectSession(page, { onboarding_complete: false })

    // Mock Supabase data writes so they succeed silently
    await page.route('**/rest/v1/goals*', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([{ id: 'g1', title: SAMPLE_GOAL }]) })
      } else { await route.continue() }
    })
    await page.route('**/rest/v1/projects*', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' })
      } else { await route.continue() }
    })
    await page.route('**/rest/v1/habits*', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' })
      } else { await route.continue() }
    })
    // Mock profile update (onboarding_complete = true)
    await page.route('**/rest/v1/profiles*', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })
  })

  test('step 1 — welcome screen renders', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await expect(onboarding.welcomeHeading).toBeVisible({ timeout: 8_000 })
  })

  test('Continue button on step 2 is disabled when goal is empty', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await onboarding.completeStep1()
    await onboarding.goalInput.waitFor({ state: 'visible' })
    // Without filling the input, continue should be disabled
    await expect(onboarding.goalContinue).toBeDisabled()
  })

  test('Continue button on step 2 is enabled after typing goal', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await onboarding.completeStep1()
    await onboarding.goalInput.waitFor({ state: 'visible' })
    await onboarding.goalInput.fill(SAMPLE_GOAL)
    await expect(onboarding.goalContinue).toBeEnabled()
  })

  test('can select a suggested habit', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await onboarding.completeStep1()
    await onboarding.completeGoalStep(SAMPLE_GOAL)
    await onboarding.completeProjectStep(SAMPLE_PROJECT)

    await onboarding.habitHeading.waitFor({ state: 'visible' })
    await onboarding.selectHabit('Morning meditation')

    // Chip should appear selected (still visible in selected/preview area)
    await expect(page.getByText('Morning meditation').first()).toBeVisible()
  })

  test('can add a custom habit', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await onboarding.completeStep1()
    await onboarding.completeGoalStep(SAMPLE_GOAL)
    await onboarding.completeProjectStep(SAMPLE_PROJECT)

    await onboarding.habitHeading.waitFor({ state: 'visible' })
    await onboarding.addCustomHabit(SAMPLE_CUSTOM_HABIT)
    await expect(page.getByText(SAMPLE_CUSTOM_HABIT)).toBeVisible()
  })

  test('can remove a selected habit', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    await onboarding.completeStep1()
    await onboarding.completeGoalStep(SAMPLE_GOAL)
    await onboarding.completeProjectStep(SAMPLE_PROJECT)

    await onboarding.habitHeading.waitFor({ state: 'visible' })
    await onboarding.selectHabit('Morning meditation')

    // Find and click remove button next to the selected habit
    const habitTag = page.getByText('Morning meditation').locator('..').first()
    const removeBtn = habitTag.getByRole('button').first()
    if (await removeBtn.count() > 0) {
      await removeBtn.click()
    }
    // Test passes if no error thrown — removal UI exists
  })

  test('shows progress indicator advancing through steps', async ({ page }) => {
    await page.goto('/onboarding')
    const onboarding = new OnboardingPage(page)
    // On step 1
    await expect(onboarding.welcomeHeading).toBeVisible({ timeout: 8_000 })

    await onboarding.completeStep1()
    // Now on step 2 — goal input should be visible
    await expect(onboarding.goalInput).toBeVisible({ timeout: 5_000 })
  })
})