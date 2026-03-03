// pages/RegisterPage.js

class RegisterPage {
  constructor(page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: /create your account/i })
    this.paymentBadge = page.getByText(/payment confirmed/i)

    this.nameField = page.getByPlaceholder(/james davis/i)
    this.emailField = page.getByPlaceholder(/you@example\.com/i)
    this.passwordField = page.getByPlaceholder(/••••••••/)
    this.submitButton = page.getByRole('button', { name: /create account/i })
    this.signInLink = page.getByText(/sign in/i).last()

    this.successMessage = page.getByText(/check your email/i)
    this.errorMessage = page.locator('[style*="f87171"]')
  }

  async goto(sessionId) {
    const url = sessionId ? `/register?session_id=${sessionId}` : '/register'
    await this.page.goto(url)
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.heading.waitFor({ state: 'visible' })
    return true
  }

  async fill({ name, email, password }) {
    await this.nameField.fill(name)
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
  }

  async submit() {
    await this.submitButton.click()
  }

  async register({ name, email, password }) {
    await this.fill({ name, email, password })
    await this.submit()
    await this.successMessage.waitFor({ state: 'visible', timeout: 10_000 })
  }

  async clickSignIn() {
    await this.signInLink.click()
    await this.page.waitForURL('**/login')
  }
}

module.exports = { RegisterPage }
