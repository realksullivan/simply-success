// pages/TodayPage.js

class TodayPage {
  constructor(page) {
    this.page = page

    // Header
    this.dateHeading = page.getByText(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i).first()
    this.winRateStat = page.getByText(/win rate/i)
    this.streakStat = page.getByText(/day streak/i)

    // Focus Hour
    this.focusHourSection = page.getByText(/focus hour/i).first()
    this.focusHourCheckbox = page.locator('[data-section="focus"] input[type="checkbox"]')
      .or(page.getByText(/focus hour/i).locator('..').locator('input[type="checkbox"]'))

    // Habits
    this.habitsSection = page.getByText(/habits/i).first()
    this.habitCheckboxes = page.locator('[data-section="habits"] input[type="checkbox"]')

    // Tasks
    this.addTaskButton = page.getByRole('button', { name: /add task/i })
      .or(page.getByText(/\+ add/i)).first()
    this.taskInput = page.getByPlaceholder(/add a task|new task/i)
    this.taskItems = page.locator('[data-testid="task-item"]')
      .or(page.locator('[style*="checklist"] li'))

    // Won The Day
    this.wonTheDayButton = page.getByRole('button', { name: /won the day/i })
    this.wonTheDayBadge = page.getByText(/you won today|won ✓/i)

    // Sidebar navigation
    this.sidebarTodayLink = page.getByRole('link', { name: /today/i })
    this.sidebarGoalsLink = page.getByRole('link', { name: /goals/i })
    this.sidebarProjectsLink = page.getByRole('link', { name: /projects/i })
    this.sidebarReflectionLink = page.getByRole('link', { name: /reflection/i })
    this.sidebarAnalyticsLink = page.getByRole('link', { name: /analytics/i })
    this.sidebarSettingsLink = page.getByRole('link', { name: /settings/i })
    this.logoutButton = page.getByRole('button', { name: /log out|sign out/i })
  }

  async goto() {
    await this.page.goto('/today')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.page.waitForURL(/today/)
    return true
  }

  async addTask(taskName) {
    await this.addTaskButton.click()
    await this.taskInput.waitFor({ state: 'visible' })
    await this.taskInput.fill(taskName)
    await this.page.keyboard.press('Enter')
  }

  async checkHabit(habitName) {
    const habitRow = this.page.getByText(habitName).locator('..')
    const checkbox = habitRow.locator('input[type="checkbox"]')
      .or(habitRow.locator('[role="checkbox"]'))
    await checkbox.click()
  }

  async checkFocusHour() {
    await this.focusHourCheckbox.click()
  }

  async clickWonTheDay() {
    await this.wonTheDayButton.click()
  }

  async logout() {
    await this.logoutButton.click()
    await this.page.waitForURL('**/')
  }

  async navigateTo(section) {
    const links = {
      goals: this.sidebarGoalsLink,
      projects: this.sidebarProjectsLink,
      reflection: this.sidebarReflectionLink,
      analytics: this.sidebarAnalyticsLink,
      settings: this.sidebarSettingsLink,
    }
    await links[section].click()
    await this.page.waitForURL(`**/${section}`)
  }
}

module.exports = { TodayPage }
