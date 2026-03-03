import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Guard: no session_id → back to pricing
  useEffect(() => {
    if (!sessionId) navigate('/pricing')
  }, [sessionId, navigate])

  const handleSubmit = async () => {
    if (!email || !password || !name) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    setError(null)

    try {
      // 1. Create Supabase account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (signUpError) throw signUpError

      const userId = data.user?.id
      if (!userId) throw new Error('Account created — check your email to confirm.')

      // 2. Verify Stripe payment and mark pro
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId }),
      })
      // Non-fatal if verify fails — webhook will catch it
      if (!res.ok) console.warn('Payment verify failed, webhook will handle it')

      setMessage('Account created! Check your email to confirm, then sign in.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) return null

  return (
    <div style={{ minHeight: '100vh', background: '#08101E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #C8922A, #7A5010)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#000' }}>W</div>
          <div>
            <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 700 }}>WinForge</div>
            <div style={{ color: '#7A91B0', fontSize: 12 }}>Forge your winning days</div>
          </div>
        </div>

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 24 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ color: '#C8922A', fontSize: 14, fontWeight: 600 }}>Payment confirmed — create your account below</span>
        </div>

        <div style={{ background: '#0D1929', border: '1px solid #1E3550', borderRadius: 16, padding: '28px 28px' }}>
          <h2 style={{ color: '#F4F0E8', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Create your account</h2>
          <p style={{ color: '#7A91B0', fontSize: 14, marginBottom: 24 }}>One last step to start forging winning days.</p>

          {error && (
            <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ background: 'rgba(50,200,80,0.1)', border: '1px solid rgba(50,200,80,0.3)', borderRadius: 8, padding: '10px 14px', color: '#4ade80', fontSize: 14, marginBottom: 16 }}>
              {message}
              <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate('/login')} style={{ color: '#C8922A', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Sign in →
                </button>
              </div>
            </div>
          )}

          {!message && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#7A91B0', fontSize: 12, display: 'block', marginBottom: 6 }}>Full Name</label>
                <input
                  style={{ width: '100%', background: '#08101E', border: '1px solid #1E3550', borderRadius: 8, padding: '10px 12px', color: '#F4F0E8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="James Davis"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#7A91B0', fontSize: 12, display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  style={{ width: '100%', background: '#08101E', border: '1px solid #1E3550', borderRadius: 8, padding: '10px 12px', color: '#F4F0E8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#7A91B0', fontSize: 12, display: 'block', marginBottom: 6 }}>Password</label>
                <input
                  type="password"
                  style={{ width: '100%', background: '#08101E', border: '1px solid #1E3550', borderRadius: 8, padding: '10px 12px', color: '#F4F0E8', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #C8922A, #A87020)', color: '#000', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', color: '#3A5070', fontSize: 12, marginTop: 20 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#C8922A', cursor: 'pointer' }}>Sign in</span>
        </div>
      </div>
    </div>
  )
}