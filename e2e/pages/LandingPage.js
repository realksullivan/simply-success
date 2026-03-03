// pages/LandingPage.js

class LandingPage {
  constructor(page) {
    this.page = page

    // Nav
    this.signInButton = page.getByRole('button', { name: /sign in/i })
    this.getStartedNavButton = page.getByRole('button', { name: /get started/i }).first()

    // Hero
    this.heroHeading = page.getByText(/stop losing days/i)
    this.heroSubheading = page.getByText(/connects your annual goals/i)
    this.heroCtaButton = page.getByRole('button', { name: /start forging wins/i })
    this.heroSecondaryButton = page.getByRole('button', { name: /see how it works/i })

    // Sections
    this.hierarchySection = page.getByText(/the hierarchy/i).first()
    this.pricingSection = page.locator('#pricing')
    this.pricingHeading = page.getByText(/simple, honest pricing/i)

    // Pricing CTAs
    this.monthlyButton = page.getByRole('button', { name: /get started/i }).nth(1)
    this.lifetimeButton = page.getByRole('button', { name: /get lifetime/i })

    // Footer
    this.footerLinks = page.locator('footer a, [style*="3A5070"] a')
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async clickSignIn() {
    await this.signInButton.click()
    await this.page.waitForURL('**/login')
  }

  async clickGetStarted() {
    await this.heroCtaButton.click()
    await this.page.waitForURL('**/pricing')
  }

  async scrollToPricing() {
    await this.pricingSection.scrollIntoViewIfNeeded()
  }

  async isLoaded() {
    await this.heroHeading.waitFor({ state: 'visible' })
    return true
  }
}

module.exports = { LandingPage }
