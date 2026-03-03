// pages/LoginPage.js

class LoginPage {
  constructor(page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: /sign in/i })
    this.emailField = page.getByPlaceholder(/you@example\.com/i)
    this.passwordField = page.getByPlaceholder(/••••••••/)
    this.submitButton = page.getByRole('button', { name: /sign in/i })
    this.googleButton = page.getByRole('button', { name: /google/i })
    this.forgotPasswordLink = page.getByText(/forgot password/i)

    this.errorMessage = page.locator('[class*="red"], [style*="f87171"]').first()
    this.successMessage = page.locator('[class*="green"], [style*="4ade80"]').first()

    this.logo = page.getByText('WinForge').first()
  }

  async goto() {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.emailField.waitFor({ state: 'visible' })
    return true
  }

  async login({ email, password }) {
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
    await this.submitButton.click()
  }

  async loginAndWait({ email, password }) {
    await this.login({ email, password })
    // Wait for redirect away from login
    await this.page.waitForURL(url => !url.includes('/login'), { timeout: 10_000 })
  }

  async requestPasswordReset(email) {
    await this.emailField.fill(email)
    await this.forgotPasswordLink.click()
    await this.successMessage.waitFor({ state: 'visible', timeout: 8_000 })
  }

  async getErrorText() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5_000 })
    return this.errorMessage.textContent()
  }
}

module.exports = { LoginPage }
