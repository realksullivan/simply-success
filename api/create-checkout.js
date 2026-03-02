import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId, userId, email } = req.body

  if (!priceId || !userId || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const isLifetime = priceId === process.env.STRIPE_PRICE_LIFETIME

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId, plan: isLifetime ? 'lifetime' : 'monthly' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      ...(isLifetime ? {} : {
        subscription_data: {
          metadata: { userId }
        }
      })
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}