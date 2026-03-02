import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Disable body parsing — Stripe needs raw body to verify signature
export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function markUserPro(userId, plan) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      is_pro: true,
      plan,
      upgraded_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Supabase error marking pro:', error)
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.client_reference_id || session.metadata?.userId
    const plan = session.metadata?.plan || 'monthly'

    if (!userId) {
      console.error('No userId in session:', session.id)
      return res.status(400).json({ error: 'No userId found' })
    }

    try {
      await markUserPro(userId, plan)
      console.log(`✓ User ${userId} marked as pro (${plan})`)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update user' })
    }
  }

  res.status(200).json({ received: true })
}