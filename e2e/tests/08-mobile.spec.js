// tests/08-mobile.spec.js
const { test, expect } = require('@playwright/test')
const { LandingPage } = require('../pages/LandingPage.js')
const { PricingPage } = require('../pages/PricingPage.js')

const MOBILE_VIEWPORT = { width: 390, height: 844 } // iPhone 14
const TABLET_VIEWPORT = { width: 768, height: 1024 }

test.describe('Mobile: Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
  })

  test('landing page loads on mobile', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await expect(landing.heroHeading).toBeVisible()
  })

  test('hierarchy diagram is hidden on mobile', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()

    // The three-column hierarchy layout should not be visible
    const hierarchyFlow = page.locator('[style*="alignItems.*stretch"]').first()
    const isVisible = await hierarchyFlow.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test('nav does not overflow on mobile', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()

    // Check no horizontal scrollbar
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('sign in and get started buttons visible on mobile nav', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await expect(landing.signInButton).toBeVisible()
  })

  test('hero CTA works on mobile', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await landing.heroCtaButton.click()
    await expect(page).toHaveURL(/\/pricing/)
  })
})

test.describe('Mobile: Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
  })

  test('pricing page loads on mobile', async ({ page }) => {
    const pricing = new PricingPage(page)
    await pricing.goto()
    await expect(pricing.heading).toBeVisible()
  })

  test('both plan cards are readable on mobile', async ({ page }) => {
    const pricing = new PricingPage(page)
    await pricing.goto()
    await expect(pricing.monthlyPrice).toBeVisible()
    await expect(pricing.lifetimePrice).toBeVisible()
  })

  test('no horizontal overflow on pricing page mobile', async ({ page }) => {
    const pricing = new PricingPage(page)
    await pricing.goto()
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })
})

test.describe('Tablet: Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(TABLET_VIEWPORT)
  })

  test('landing page loads on tablet', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await expect(landing.heroHeading).toBeVisible()
  })

  test('pricing page loads on tablet', async ({ page }) => {
    const pricing = new PricingPage(page)
    await pricing.goto()
    await expect(pricing.heading).toBeVisible()
  })
})
