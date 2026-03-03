// tests/02-pricing.spec.js
const { test, expect } = require('@playwright/test')
const { PricingPage } = require('../pages/PricingPage.js')
const { LandingPage } = require('../pages/LandingPage.js')

test.describe('Pricing Page', () => {
  let pricing

  test.beforeEach(async ({ page }) => {
    pricing = new PricingPage(page)
    await pricing.goto()
  })

  test('renders both plans', async () => {
    await expect(pricing.heading).toBeVisible()
    await expect(pricing.monthlyPrice).toBeVisible()
    await expect(pricing.lifetimePrice).toBeVisible()
  })

  test('shows BEST VALUE badge on lifetime plan', async () => {
    await expect(pricing.bestValueBadge).toBeVisible()
  })

  test('shows correct prices', async () => {
    await expect(pricing.monthlyPrice).toContainText('9.99')
    await expect(pricing.lifetimePrice).toContainText('59.99')
  })

  test('both plan buttons are visible', async () => {
    await expect(pricing.monthlyButton).toBeVisible()
    await expect(pricing.lifetimeButton).toBeVisible()
  })

  test('monthly button calls API with monthly price ID', async ({ page }) => {
    let capturedBody = null
    await page.route('**/api/create-checkout', async route => {
      capturedBody = JSON.parse(route.request().postData() || '{}')
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/pay/test_mock' }),
      })
    })
    await pricing.clickMonthly()
    await page.waitForTimeout(500)
    expect(capturedBody?.priceId).toBe('price_1T6OOhEaVdXhj1grdflCCHSw')
  })

  test('lifetime button calls API with lifetime price ID', async ({ page }) => {
    let capturedBody = null
    await page.route('**/api/create-checkout', async route => {
      capturedBody = JSON.parse(route.request().postData() || '{}')
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/pay/test_mock' }),
      })
    })
    await pricing.clickLifetime()
    await page.waitForTimeout(500)
    expect(capturedBody?.priceId).toBe('price_1T6ONhEaVdXhj1grGuUEK8OX')
  })

  test('shows error message if API fails', async ({ page }) => {
    await page.route('**/api/create-checkout', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Server error' }) })
    })
    await pricing.clickLifetime()
    // Error could be in various elements — check for any error-like text
    const errorEl = page.locator('[style*="f87171"], [style*="red"], [class*="error"]').first()
    await expect(errorEl).toBeVisible({ timeout: 8_000 })
  })

  test('is accessible from landing page nav', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await landing.clickGetStarted()
    await expect(page).toHaveURL(/\/pricing/)
    await expect(pricing.heading).toBeVisible()
  })
})