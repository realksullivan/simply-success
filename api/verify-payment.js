const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sessionId, userId } = req.body
  if (!sessionId || !userId) {
    return res.status(400).json({ error: 'Missing sessionId or userId' })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.status(402).json({ error: 'Payment not completed' })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const plan = session.metadata?.plan || 'lifetime'

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      is_pro: true,
      plan,
      upgraded_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, plan })
  } catch (err) {
    console.error('Verify payment error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}