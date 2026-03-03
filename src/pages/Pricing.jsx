import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRICES = {
  monthly: 'price_1T6OOhEaVdXhj1grdflCCHSw',
  lifetime: 'price_1T6ONhEaVdXhj1grGuUEK8OX',
}

export default function Pricing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const handleUpgrade = async (plan) => {
    setLoading(plan)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICES[plan] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(null)
    }
  }

  const features = [
    'Unlimited goals & habits',
    'Daily focus hour system',
    'Win the day tracking',
    'Quarterly projects',
    'Analytics & heatmap',
    'Weekly email summary',
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#08101E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #C8922A, #7A5010)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#000' }}>W</div>
        <div>
          <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 700 }}>WinForge</div>
          <div style={{ color: '#7A91B0', fontSize: 12 }}>Forge your winning days</div>
        </div>
      </div>

      <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Get Access</div>
      <h1 style={{ color: '#F4F0E8', fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Choose your plan</h1>
      <p style={{ color: '#7A91B0', fontSize: 15, textAlign: 'center', marginBottom: 40 }}>Pay once and start forging winning days.</p>

      {error && (
        <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: 14, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Plans */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 700, marginBottom: 40 }}>

        {/* Monthly */}
        <div style={{ flex: 1, minWidth: 260, background: '#0D1929', border: '1px solid #1E3550', borderRadius: 16, padding: 28 }}>
          <div style={{ color: '#7A91B0', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Monthly</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#F4F0E8', fontSize: 36, fontWeight: 800 }}>$9.99</span>
            <span style={{ color: '#7A91B0', fontSize: 14 }}>/month</span>
          </div>
          <div style={{ color: '#3A5070', fontSize: 13, marginBottom: 24 }}>Cancel anytime</div>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: '#C8922A', fontSize: 14 }}>✓</span>
              <span style={{ color: '#B8C8D8', fontSize: 14 }}>{f}</span>
            </div>
          ))}
          <button
            onClick={() => handleUpgrade('monthly')}
            disabled={!!loading}
            style={{ marginTop: 24, width: '100%', padding: '12px 0', borderRadius: 8, border: '1px solid #1E3550', background: 'transparent', color: '#F4F0E8', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
            {loading === 'monthly' ? 'Redirecting...' : 'Get Monthly Access →'}
          </button>
        </div>

        {/* Lifetime */}
        <div style={{ flex: 1, minWidth: 260, background: '#0D1929', border: '2px solid #C8922A', borderRadius: 16, padding: 28, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#C8922A', color: '#000', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>BEST VALUE</div>
          <div style={{ color: '#C8922A', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Lifetime</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ color: '#F4F0E8', fontSize: 36, fontWeight: 800 }}>$59.99</span>
          </div>
          <div style={{ color: '#3A5070', fontSize: 13, marginBottom: 24 }}>One-time payment, forever</div>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: '#C8922A', fontSize: 14 }}>✓</span>
              <span style={{ color: '#B8C8D8', fontSize: 14 }}>{f}</span>
            </div>
          ))}
          <button
            onClick={() => handleUpgrade('lifetime')}
            disabled={!!loading}
            style={{ marginTop: 24, width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #C8922A, #A87020)', color: '#000', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
            {loading === 'lifetime' ? 'Redirecting...' : 'Get Lifetime Access →'}
          </button>
        </div>
      </div>

      <div style={{ color: '#3A5070', fontSize: 12, textAlign: 'center' }}>
        Encrypted · Private · Ad-free · Cancel anytime
      </div>
    </div>
  )
}