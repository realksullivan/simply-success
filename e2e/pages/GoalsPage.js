// pages/GoalsPage.js

class GoalsPage {
  constructor(page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: /annual goals/i })
      .or(page.getByText(/annual goals/i).first())

    this.addGoalButton = page.getByRole('button', { name: /add goal|\+ goal|new goal/i })
    this.goalInput = page.getByPlaceholder(/what do you want to achieve/i)
    this.saveGoalButton = page.getByRole('button', { name: /save|add/i }).last()
    this.cancelButton = page.getByRole('button', { name: /cancel/i })

    this.goalCards = page.locator('[style*="0D1929"]').filter({ hasText: /goal/i })
    this.emptyState = page.getByText(/no goals yet|add your first/i)
  }

  async goto() {
    await this.page.goto('/goals')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.page.waitForURL('**/goals')
    return true
  }

  async addGoal(title) {
    await this.addGoalButton.click()
    await this.goalInput.waitFor({ state: 'visible' })
    await this.goalInput.fill(title)
    await this.saveGoalButton.click()
    await this.page.waitForResponse(res => res.url().includes('supabase') && res.status() === 201, { timeout: 8_000 })
      .catch(() => {}) // may already be saved
    await this.page.waitForTimeout(500) // allow re-render
  }

  async getGoalCount() {
    return this.goalCards.count()
  }

  async achieveGoal(title) {
    const card = this.page.getByText(title).locator('..').locator('..')
    await card.getByRole('button', { name: /achieve/i }).click()
  }

  async archiveGoal(title) {
    const card = this.page.getByText(title).locator('..').locator('..')
    await card.getByRole('button', { name: /archive/i }).click()
  }
}

module.exports = { GoalsPage }
