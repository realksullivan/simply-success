// fixtures/test-data.js
// Central place for all test data — change emails here and it propagates everywhere

const TEST_USER = {
  // Use your Gmail + addressing so all emails land in one inbox
  email: 'ksull10+playwright@gmail.com',
  password: 'TestPassword123!',
  name: 'Playwright Test',
}

// A second user to test isolation
const TEST_USER_2 = {
  email: 'ksull10+playwright2@gmail.com',
  password: 'TestPassword123!',
  name: 'Playwright Test 2',
}

const STRIPE_TEST_CARD = {
  number: '4242 4242 4242 4242',
  expiry: '12/29',
  cvc: '123',
  zip: '12345',
}

// Stripe test card that always fails payment
const STRIPE_DECLINE_CARD = {
  number: '4000 0000 0000 0002',
  expiry: '12/29',
  cvc: '123',
  zip: '12345',
}

const SAMPLE_GOAL = 'Launch WinForge to 100 paying customers'
const SAMPLE_PROJECT = 'Build and ship MVP'
const SAMPLE_HABIT = 'Morning meditation'
const SAMPLE_CUSTOM_HABIT = 'Read for 30 minutes before bed'
const SAMPLE_TASK = 'Write landing page copy'
const SAMPLE_REFLECTION = 'Today was productive. I shipped the paywall feature.'

module.exports = { TEST_USER, TEST_USER_2, STRIPE_TEST_CARD, STRIPE_DECLINE_CARD, SAMPLE_GOAL, SAMPLE_PROJECT, SAMPLE_HABIT, SAMPLE_CUSTOM_HABIT, SAMPLE_TASK, SAMPLE_REFLECTION }
