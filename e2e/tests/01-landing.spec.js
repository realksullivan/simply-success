// tests/01-landing.spec.js
const { test, expect } = require('@playwright/test')
const { LandingPage } = require('../pages/LandingPage.js')

test.describe('Landing Page', () => {
  let landing

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page)
    await landing.goto()
  })

  test('renders hero section correctly', async () => {
    await expect(landing.heroHeading).toBeVisible()
    await expect(landing.heroSubheading).toBeVisible()
    await expect(landing.heroCtaButton).toBeVisible()
  })

  test('shows Sign In and Get Started in nav', async () => {
    await expect(landing.signInButton).toBeVisible()
    await expect(landing.getStartedNavButton).toBeVisible()
  })

  test('Sign In button navigates to /login', async ({ page }) => {
    await landing.clickSignIn()
    await expect(page).toHaveURL(/\/login/)
  })

  test('hero CTA navigates to /pricing', async ({ page }) => {
    await landing.clickGetStarted()
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('does NOT contain "free" messaging in buttons', async ({ page }) => {
    const ctaButtons = page.getByRole('button')
    const count = await ctaButtons.count()
    for (let i = 0; i < count; i++) {
      const text = await ctaButtons.nth(i).textContent()
      expect(text?.toLowerCase()).not.toContain('start forging free')
      expect(text?.toLowerCase()).not.toContain('no credit card')
    }
  })

  test('pricing section CTA navigates to /pricing', async ({ page }) => {
    await landing.scrollToPricing()
    const pricingCta = page.getByRole('button', { name: /get started|get lifetime/i }).first()
    await pricingCta.click()
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('hierarchy section is hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14
    await landing.goto()
    // The hierarchy diagram should not be visible
    const hierarchy = page.locator('[style*="alignItems.*stretch"]').first()
    await expect(hierarchy).not.toBeVisible()
  })
})
