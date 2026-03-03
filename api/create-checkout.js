const Stripe = require('stripe')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not set' })
  }

  const { priceId } = req.body

  if (!priceId) {
    return res.status(400).json({ error: 'Missing priceId' })
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' })
    const isLifetime = priceId === 'price_1T6ONhEaVdXhj1grGuUEK8OX'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { plan: isLifetime ? 'lifetime' : 'monthly' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/register?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}