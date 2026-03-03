// pages/ProjectsPage.js

class ProjectsPage {
  constructor(page) {
    this.page = page

    this.heading = page.getByText(/quarterly projects/i).first()
    this.addProjectButton = page.getByRole('button', { name: /add project|\+ project/i })
    this.projectInput = page.getByPlaceholder(/project title|what.*accomplish/i)
    this.quarterSelect = page.locator('select')
    this.saveButton = page.getByRole('button', { name: /save|add/i }).last()

    this.projectCards = page.locator('[data-testid="project-card"]')
      .or(page.locator('[style*="0D1929"]').filter({ hasText: /Q[1-4] 20/ }))
    this.emptyState = page.getByText(/no projects|add your first/i)

    // Tasks within a project
    this.addTaskButton = page.getByRole('button', { name: /add task/i }).first()
    this.taskInput = page.getByPlaceholder(/add a task|task title/i)
  }

  async goto() {
    await this.page.goto('/projects')
    await this.page.waitForLoadState('networkidle')
  }

  async isLoaded() {
    await this.page.waitForURL('**/projects')
    return true
  }

  async addProject({ title, quarter }) {
    await this.addProjectButton.click()
    await this.projectInput.waitFor({ state: 'visible' })
    await this.projectInput.fill(title)
    if (quarter) {
      await this.quarterSelect.selectOption(quarter)
    }
    await this.saveButton.click()
    await this.page.waitForTimeout(500)
  }

  async getProjectByTitle(title) {
    return this.page.getByText(title).first()
  }

  async addTaskToProject(projectTitle, taskTitle) {
    const projectCard = this.page.getByText(projectTitle).locator('..').locator('..')
    await projectCard.getByRole('button', { name: /add task/i }).click()
    const input = projectCard.getByPlaceholder(/task/i)
    await input.fill(taskTitle)
    await this.page.keyboard.press('Enter')
  }
}

module.exports = { ProjectsPage }
