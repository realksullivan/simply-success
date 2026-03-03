// fixtures/auth-helpers.js
const { TEST_USER } = require('./test-data.js')

function createFakeJWT(payload) {
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const body = encode(payload)
  return `${header}.${body}.playwright_fake_sig`
}

async function injectSession(page, overrides = {}) {
  const userId = 'test-user-id-playwright'
  const email = TEST_USER.email
  const metadata = { full_name: TEST_USER.name, onboarding_complete: true, ...overrides }

  const fakeJWT = createFakeJWT({
    sub: userId, email,
    aud: 'authenticated', role: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    user_metadata: metadata, app_metadata: {},
  })

  const fakeSession = {
    access_token: fakeJWT,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token-playwright',
    user: {
      id: userId, aud: 'authenticated', role: 'authenticated', email,
      email_confirmed_at: new Date().toISOString(),
      user_metadata: metadata, app_metadata: {},
    },
  }

  // Runs BEFORE any page JS — intercepts Supabase localStorage reads for any project ref
  await page.addInitScript((session) => {
    const _get = window.Storage.prototype.getItem
    const _set = window.Storage.prototype.setItem
    window.Storage.prototype.getItem = function (key) {
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        return JSON.stringify(session)
      }
      return _get.call(this, key)
    }
    window.Storage.prototype.setItem = function (key, value) {
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) return
      return _set.call(this, key, value)
    }
  }, fakeSession)

  // Mock auth network calls Supabase may make
  await page.route('**/auth/v1/user', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeSession.user) })
    } else { await route.continue() }
  })
  await page.route('**/auth/v1/token*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeSession) })
  })
}

async function mockAuthenticatedSupabase(page) {
  await page.route('**/rest/v1/goals*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify([{ id: 'goal-1', title: 'Launch WinForge', progress: 25, user_id: 'test-user-id-playwright' }]) })
    } else { await route.continue() }
  })
  await page.route('**/rest/v1/habits*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify([{ id: 'habit-1', title: 'Morning meditation', user_id: 'test-user-id-playwright', sort_order: 0 }]) })
    } else { await route.continue() }
  })
  await page.route('**/rest/v1/habit_logs*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    } else { await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' }) }
  })
  await page.route('**/rest/v1/projects*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify([{ id: 'project-1', title: 'Build MVP', quarter: 'Q1 2026', progress: 10, goal_id: 'goal-1' }]) })
    } else { await route.continue() }
  })
  await page.route('**/rest/v1/tasks*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    } else { await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([{ id: 'task-new', title: 'test task' }]) }) }
  })
  await page.route('**/rest/v1/daily_checklists*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify([{ id: 'checklist-1', date: new Date().toISOString().split('T')[0], won_the_day: false }]) })
    } else { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ won_the_day: true }]) }) }
  })
  await page.route('**/rest/v1/reflections*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    } else { await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' }) }
  })
  await page.route('**/rest/v1/profiles*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'test-user-id-playwright', is_pro: true, plan: 'lifetime' }]) })
  })
}

async function clearSession(page) {
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token')).forEach(k => localStorage.removeItem(k))
  })
}

module.exports = { injectSession, clearSession, mockAuthenticatedSupabase }