import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PRICES = {
  monthly: 'price_1T6OOhEaVdXhj1grdflCCHSw',
  lifetime: 'price_1T6ONhEaVdXhj1grGuUEK8OX',
}

const FEATURES = [
  'Unlimited annual goals',
  'Unlimited daily habits',
  'Full analytics dashboard',
  'Habit heatmap calendar',
  'Unlimited history',
  'Weekly email summary',
  'Priority support',
]

export default function Pricing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const handleUpgrade = async (plan) => {
    setLoading(plan)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const priceId = PRICES[plan]

      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.id, email: user.email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#08101E] flex flex-col items-center justify-center px-4 py-16">

      <div className="text-center mb-12">
        <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-3">Upgrade</div>
        <h1 className="text-[#F4F0E8] text-3xl font-bold mb-3">Go Pro</h1>
        <p className="text-[#7A91B0] text-sm max-w-sm">
          Unlimited goals, habits, and full analytics. Cancel anytime.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 w-full max-w-2xl">

        {/* Monthly */}
        <div className="flex-1 bg-[#0D1929] border border-[#1E3550] rounded-2xl p-8">
          <div className="text-[#7A91B0] text-xs uppercase tracking-widest mb-3">Monthly</div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[#F4F0E8] text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>$9</span>
            <span className="text-[#3A5070] text-base">.99/mo</span>
          </div>
          <div className="text-[#3A5070] text-xs mb-8">Cancel anytime</div>

          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-[#C8922A]/20 flex items-center justify-center text-[#C8922A] text-[9px] font-bold flex-shrink-0">✓</div>
              <span className="text-[#7A91B0] text-sm">{f}</span>
            </div>
          ))}

          <button
            onClick={() => handleUpgrade('monthly')}
            disabled={!!loading}
            className="w-full mt-8 py-3 rounded-xl text-sm font-bold text-[#7A91B0] border border-[#1E3550] cursor-pointer disabled:opacity-50 bg-transparent hover:border-[#C8922A] hover:text-[#C8922A] transition-colors"
          >
            {loading === 'monthly' ? 'Redirecting...' : 'Start Monthly →'}
          </button>
        </div>

        {/* Lifetime */}
        <div className="flex-1 bg-[#0D1929] border-2 border-[#C8922A] rounded-2xl p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C8922A] to-[#A87020] text-black text-[10px] font-bold px-4 py-1 rounded-full tracking-widest uppercase">
            Best Value
          </div>

          <div className="text-[#C8922A] text-xs uppercase tracking-widest mb-3">Lifetime</div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[#F4F0E8] text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>$59</span>
            <span className="text-[#3A5070] text-base">.99</span>
          </div>
          <div className="text-[#3A5070] text-xs mb-8">One time · pay once, use forever</div>

          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-[#C8922A]/20 flex items-center justify-center text-[#C8922A] text-[9px] font-bold flex-shrink-0">✓</div>
              <span className="text-[#F4F0E8] text-sm">{f}</span>
            </div>
          ))}

          <button
            onClick={() => handleUpgrade('lifetime')}
            disabled={!!loading}
            className="w-full mt-8 py-3 rounded-xl text-sm font-bold text-black cursor-pointer disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
          >
            {loading === 'lifetime' ? 'Redirecting...' : 'Get Lifetime Access →'}
          </button>

          <div className="text-center text-[#3A5070] text-xs mt-3">
            Equivalent to ~6 months
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-900/20 border border-red-700/30 rounded-lg px-5 py-3 text-red-400 text-sm max-w-md text-center">
          {error}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-8 text-[#3A5070] text-xs hover:text-[#7A91B0] cursor-pointer bg-transparent border-none"
      >
        ← Back
      </button>
    </div>
  )
}