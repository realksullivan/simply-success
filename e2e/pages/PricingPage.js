// pages/PricingPage.js

class PricingPage {
  constructor(page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: /choose your plan/i })
    this.subtext = page.getByText(/pay once and start/i)

    // Plans
    this.monthlyCard = page.getByText('Monthly').first()
    this.lifetimeCard = page.getByText('Lifetime').first()
    this.monthlyPrice = page.getByText('$9.99')
    this.lifetimePrice = page.getByText('$59.99')
    this.bestValueBadge = page.getByText('BEST VALUE')

    // Buttons
    this.monthlyButton = page.getByRole('button', { name: /get monthly access/i })
    this.lifetimeButton = page.getByRole('button', { name: /get lifetime access/i })

    // Error
    this.errorMessage = page.locator('[style*="f87171"]')
  }

  async goto() {
    await this.page.goto('/pricing')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.heading.waitFor({ state: 'visible' })
    return true
  }

  async clickMonthly() {
    await this.monthlyButton.click()
  }

  async clickLifetime() {
    await this.lifetimeButton.click()
  }

  async waitForStripeRedirect() {
    // Stripe checkout is on stripe.com or checkout.stripe.com
    await this.page.waitForURL(/stripe\.com|checkout\.stripe/, { timeout: 15_000 })
  }
}

module.exports = { PricingPage }
