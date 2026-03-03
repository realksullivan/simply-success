// pages/StripePage.js
// Handles Stripe's hosted checkout page

class StripePage {
  constructor(page) {
    this.page = page

    // Stripe uses iframes and shadow DOM — target by label or placeholder
    this.emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).first()
    this.cardNumberField = page.getByLabel(/card number/i).or(page.locator('[placeholder*="1234"]')).first()
    this.expiryField = page.getByLabel(/expiration|expiry|mm/i).first()
    this.cvcField = page.getByLabel(/cvc|security/i).first()
    this.zipField = page.getByLabel(/zip|postal/i).first()
    this.cardNameField = page.getByLabel(/name on card/i).first()

    this.submitButton = page.getByRole('button', { name: /pay|subscribe|submit/i })
    this.errorMessage = page.locator('.StripeElement--invalid, [class*="error"]').first()
  }

  async isLoaded() {
    await this.page.waitForURL(/stripe\.com|checkout\.stripe/, { timeout: 15_000 })
    // Wait for the form to be ready
    await this.page.waitForLoadState('networkidle')
    return true
  }

  async fillCard({ number, expiry, cvc, zip }) {
    // Stripe checkout form — fields may be in iframes
    // Try direct fill first, then iframe approach
    try {
      await this.cardNumberField.fill(number, { timeout: 5000 })
      await this.expiryField.fill(expiry)
      await this.cvcField.fill(cvc)
      if (zip) await this.zipField.fill(zip)
    } catch {
      // Fallback: type into focused element after clicking into the frame
      const frame = this.page.frameLocator('iframe[name*="card"]').first()
      await frame.locator('[placeholder*="1234"]').fill(number)
      await frame.locator('[placeholder*="MM"]').fill(expiry)
      await frame.locator('[placeholder*="CVC"]').fill(cvc)
    }
  }

  async fillEmail(email) {
    await this.emailField.fill(email)
  }

  async submit() {
    await this.submitButton.click()
  }

  async completePayment({ number, expiry, cvc, zip, email }) {
    await this.isLoaded()
    if (email) await this.fillEmail(email)
    await this.fillCard({ number, expiry, cvc, zip })
    await this.submit()
  }

  async waitForSuccess() {
    // After payment, redirected back to /register?session_id=...
    await this.page.waitForURL(/winforge\.app\/register|localhost.*\/register/, { timeout: 30_000 })
  }
}

module.exports = { StripePage }
