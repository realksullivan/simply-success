// tests/07-e2e-happy-path.spec.js
const { test, expect } = require('@playwright/test')
const { LandingPage } = require('../pages/LandingPage.js')
const { PricingPage } = require('../pages/PricingPage.js')
const { RegisterPage } = require('../pages/RegisterPage.js')
const { LoginPage } = require('../pages/LoginPage.js')
const { injectSession } = require('../fixtures/auth-helpers.js')

const MOCK_SESSION_ID = 'cs_test_e2e_mock_12345'

test.describe('Happy Path: Landing → Pricing → Register → Login', () => {

  test('1. New user flow: landing → pricing page', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()

    await expect(landing.heroHeading).toBeVisible()
    await expect(landing.signInButton).toBeVisible()

    await landing.clickGetStarted()
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('2. Pricing → Stripe checkout API is triggered', async ({ page }) => {
    let checkoutCalled = false
    await page.route('**/api/create-checkout', async route => {
      checkoutCalled = true
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ url: `http://localhost:5173/register?session_id=${MOCK_SESSION_ID}` }),
      })
    })

    const pricing = new PricingPage(page)
    await pricing.goto()
    await pricing.clickLifetime()
    await page.waitForTimeout(1000)
    expect(checkoutCalled).toBe(true)
  })

  test('3. Register page requires session_id from Stripe', async ({ page }) => {
    // Without session_id → bounce to pricing
    await page.goto('/register')
    await expect(page).toHaveURL(/\/pricing/)

    // With session_id → register form shown
    await page.goto(`/register?session_id=${MOCK_SESSION_ID}`)
    const register = new RegisterPage(page)
    await expect(register.heading).toBeVisible()
    await expect(register.paymentBadge).toBeVisible()
  })

  test('4. Sign in button navigates to /login', async ({ page }) => {
    const landing = new LandingPage(page)
    await landing.goto()
    await landing.clickSignIn()
    await expect(page).toHaveURL(/\/login/)

    const loginPage = new LoginPage(page)
    await expect(loginPage.emailField).toBeVisible()
  })

  test('5. Wrong credentials shows error on login', async ({ page }) => {
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 400, contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
      })
    })
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login({ email: 'wrong@example.com', password: 'badpassword' })
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('Happy Path: Authenticated User Session', () => {

  test('authenticated user with complete onboarding is redirected away from /login', async ({ page }) => {
    await injectSession(page, { onboarding_complete: true })
    await page.route('**/rest/v1/**', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    })
    await page.goto('/login')
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 8_000 })
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('authenticated user with incomplete onboarding goes to /onboarding', async ({ page }) => {
    await injectSession(page, { onboarding_complete: false })
    await page.route('**/rest/v1/**', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    })
    await page.goto('/')
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 8_000 })
  })
})

test.describe('Critical: Paywall Enforcement', () => {
  test('cannot bypass register page without session_id', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('cannot register with empty session_id', async ({ page }) => {
    await page.goto('/register?session_id=')
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('pricing page is always reachable when logged out', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL(/\/pricing/)
    await expect(page.getByRole('heading', { name: /choose your plan/i })).toBeVisible()
  })

  test('login page is always reachable', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
  })

  test('all protected routes redirect to login when logged out', async ({ page }) => {
    const protectedRoutes = ['/today', '/goals', '/projects', '/reflection', '/analytics', '/settings']
    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
    }
  })
})
