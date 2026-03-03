// pages/OnboardingPage.js

class OnboardingPage {
  constructor(page) {
    this.page = page

    // Step indicators
    this.progressBar = page.locator('[style*="background"][style*="C8922A"]').first()

    // Step 1 — Welcome
    this.welcomeHeading = page.getByText(/welcome to winforge/i)
    this.startButton = page.getByRole('button', { name: /let's go|get started|start/i })

    // Step 2 — Goal
    this.goalHeading = page.getByText(/annual goal|big goal/i)
    this.goalInput = page.getByPlaceholder(/what do you want to achieve/i)
    this.goalContinue = page.getByRole('button', { name: /continue/i })

    // Step 3 — Project
    this.projectHeading = page.getByText(/quarterly project/i)
    this.projectInput = page.getByPlaceholder(/90-day|project title|what.*accomplish/i)
    this.projectQuarterSelect = page.locator('select')
    this.projectContinue = page.getByRole('button', { name: /continue/i })

    // Step 4 — Habits
    this.habitHeading = page.getByText(/daily habits/i)
    this.habitChips = page.locator('button').filter({ hasText: /meditation|exercise|reading|journal/i })
    this.customHabitInput = page.getByPlaceholder(/add your own/i)
    this.addHabitButton = page.getByRole('button', { name: /add/i })
    this.habitContinue = page.getByRole('button', { name: /continue/i })

    // Step 5 — Done
    this.finishButton = page.getByRole('button', { name: /start forging|finish|go to today/i })
    this.doneHeading = page.getByText(/you're all set|ready to forge/i)
  }

  async isLoaded() {
    await this.page.waitForURL('**/onboarding')
    return true
  }

  async completeStep1() {
    await this.startButton.waitFor({ state: 'visible' })
    await this.startButton.click()
  }

  async completeGoalStep(goalTitle) {
    await this.goalInput.waitFor({ state: 'visible' })
    await this.goalInput.fill(goalTitle)
    await this.goalContinue.click()
  }

  async completeProjectStep(projectTitle) {
    await this.projectInput.waitFor({ state: 'visible' })
    await this.projectInput.fill(projectTitle)
    await this.projectContinue.click()
  }

  async selectHabit(habitName) {
    const chip = this.page.getByRole('button', { name: new RegExp(habitName, 'i') })
    await chip.click()
  }

  async addCustomHabit(habitName) {
    await this.customHabitInput.fill(habitName)
    await this.addHabitButton.click()
  }

  async completeHabitsStep(habits = ['Morning meditation']) {
    await this.habitHeading.waitFor({ state: 'visible' })
    for (const habit of habits) {
      await this.selectHabit(habit)
    }
    await this.habitContinue.click()
  }

  async completeAll({ goalTitle, projectTitle, habits }) {
    await this.completeStep1()
    await this.completeGoalStep(goalTitle)
    await this.completeProjectStep(projectTitle)
    await this.completeHabitsStep(habits)
    await this.finishButton.waitFor({ state: 'visible' })
    await this.finishButton.click()
    await this.page.waitForURL('**/today', { timeout: 10_000 })
  }
}

module.exports = { OnboardingPage }
