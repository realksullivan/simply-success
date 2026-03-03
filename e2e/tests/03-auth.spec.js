// tests/03-auth.spec.js
const { test, expect } = require('@playwright/test')
const { RegisterPage } = require('../pages/RegisterPage.js')
const { LoginPage } = require('../pages/LoginPage.js')
const { injectSession } = require('../fixtures/auth-helpers.js')
const { TEST_USER } = require('../fixtures/test-data.js')

const MOCK_SESSION_ID = 'cs_test_mock12345'

test.describe('Auth: Registration Gate', () => {
  test('visiting /register without session_id redirects to /pricing', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('visiting /register with session_id shows registration form', async ({ page }) => {
    await page.route('**/api/verify-payment', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true, plan: 'lifetime' }) })
    })
    const register = new RegisterPage(page)
    await register.goto(MOCK_SESSION_ID)
    await expect(register.heading).toBeVisible()
    await expect(register.paymentBadge).toBeVisible()
  })

  test('shows payment confirmed badge when session_id is present', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.goto(MOCK_SESSION_ID)
    await expect(register.paymentBadge).toBeVisible()
  })

  test('registration form validation prevents empty submit', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.goto(MOCK_SESSION_ID)

    // Try clicking submit without filling anything
    await register.submitButton.click()

    // Either HTML5 validation fires (email field invalid) OR app shows error
    const emailInvalid = await register.emailField.evaluate(el => !el.validity.valid).catch(() => false)
    const nameInvalid = await register.nameField.evaluate(el => !el.validity.valid).catch(() => false)
    const errorShown = await register.errorMessage.isVisible().catch(() => false)

    expect(emailInvalid || nameInvalid || errorShown).toBeTruthy()
  })

  test('registration creates account and shows confirm email message', async ({ page }) => {
    await page.route('**/auth/v1/signup', async route => {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ user: { id: 'test-user-id-123', email: TEST_USER.email } }),
      })
    })
    await page.route('**/api/verify-payment', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    })

    const register = new RegisterPage(page)
    await register.goto(MOCK_SESSION_ID)
    await register.fill({ name: TEST_USER.name, email: TEST_USER.email, password: TEST_USER.password })
    await register.submit()
    await expect(register.successMessage).toBeVisible({ timeout: 10_000 })
  })
})

test.describe('Auth: Login', () => {
  let loginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('renders login form', async () => {
    await expect(loginPage.emailField).toBeVisible()
    await expect(loginPage.passwordField).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('shows logo', async () => {
    await expect(loginPage.logo).toBeVisible()
  })

  test('shows error on wrong password', async ({ page }) => {
    // Mock Supabase to return auth error
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 400, contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
      })
    })
    await loginPage.login({ email: 'notreal@example.com', password: 'wrongpass' })
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 8_000 })
  })

  test('shows validation when email is empty', async ({ page }) => {
    await loginPage.passwordField.fill('somepassword')
    await loginPage.submitButton.click()
    // HTML5 native validation or app error
    const isInvalid = await loginPage.emailField.evaluate(el => !el.validity.valid).catch(() => false)
    const errorVisible = await loginPage.errorMessage.isVisible().catch(() => false)
    expect(isInvalid || errorVisible).toBeTruthy()
  })

  test('Google SSO button is present', async () => {
    await expect(loginPage.googleButton).toBeVisible()
  })

  test('does not have a Create Account tab (registration requires payment first)', async ({ page }) => {
    // Login page should only have sign in — no register mode
    const createAccountTab = page.getByRole('button', { name: /create account/i })
    await expect(createAccountTab).not.toBeVisible()
  })

  test('forgot password link is visible', async () => {
    await expect(loginPage.forgotPasswordLink).toBeVisible()
  })
})

test.describe('Auth: Route Guards', () => {
  test('unauthenticated user visiting /today is redirected to /login', async ({ page }) => {
    await page.goto('/today')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting /goals is redirected to /login', async ({ page }) => {
    await page.goto('/goals')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting /analytics is redirected to /login', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting /settings is redirected to /login', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting /projects is redirected to /login', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unauthenticated user visiting /reflection is redirected to /login', async ({ page }) => {
    await page.goto('/reflection')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/pricing is publicly accessible', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL(/\/pricing/)
    await expect(page.getByRole('heading', { name: /choose your plan/i })).toBeVisible()
  })

  test('/login is publicly accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
  })

  test('authenticated user visiting /login is redirected to /today or /onboarding', async ({ page }) => {
    // Inject a valid session first (addInitScript must come before any navigation)
    await injectSession(page)

    // Mock all data endpoints so the app can render
    await page.route('**/rest/v1/**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      } else { await route.continue() }
    })

    await page.goto('/login')
    // Should redirect away from /login since user is authenticated
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 8_000 })
    await expect(page).not.toHaveURL(/\/login/)
  })
})