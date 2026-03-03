// pages/ReflectionPage.js

class ReflectionPage {
  constructor(page) {
    this.page = page
    this.heading = page.getByText(/evening reflection/i).or(page.getByText(/reflection/i)).first()
    this.textareas = page.locator('textarea')
    this.firstTextarea = page.locator('textarea').first()
    this.savedIndicator = page.getByText(/saved|auto-saved/i)
    this.saveButton = page.getByRole('button', { name: /save/i })
    this.historySection = page.getByText(/past reflections|history/i)
  }

  async goto() {
    await this.page.goto('/reflection')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.page.waitForURL('**/reflection')
    await this.firstTextarea.waitFor({ state: 'visible' })
    return true
  }

  async fillFirstPrompt(text) {
    await this.firstTextarea.fill(text)
  }

  async fillAllPrompts(text) {
    const count = await this.textareas.count()
    for (let i = 0; i < count; i++) {
      await this.textareas.nth(i).fill(text)
    }
  }

  async waitForAutosave() {
    await this.savedIndicator.waitFor({ state: 'visible', timeout: 8_000 })
  }
}


class AnalyticsPage {
  constructor(page) {
    this.page = page
    this.heading = page.getByText(/analytics|insights/i).first()
    this.winRateCard = page.getByText(/win rate/i).first()
    this.streakCard = page.getByText(/streak/i).first()
    this.habitsCard = page.getByText(/habits/i).first()
    this.winRateChart = page.locator('[class*="recharts"], canvas, svg').first()
    this.heatmap = page.getByText(/heatmap/i).or(page.locator('[class*="heatmap"]')).first()
  }

  async goto() {
    await this.page.goto('/analytics')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.page.waitForURL('**/analytics')
    await this.heading.waitFor({ state: 'visible' })
    return true
  }
}

module.exports = { ReflectionPage, AnalyticsPage }
