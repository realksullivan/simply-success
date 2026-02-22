import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setError(error.message)
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setMessage('Password reset email sent!')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>S</div>
          <div>
            <div style={styles.logoTitle}>Simply Success</div>
            <div style={styles.logoSub}>Your daily success system</div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={styles.toggle}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null) }}
              style={{ ...styles.toggleBtn, ...(mode === m ? styles.toggleActive : {}) }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        {/* Fields */}
        <div style={styles.fields}>
          {mode === 'register' && (
            <div>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} placeholder="James Davis"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={styles.label}>Password</label>
              {mode === 'login' && (
                <span style={styles.link} onClick={handleForgotPassword}>Forgot password?</span>
              )}
            </div>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        </div>

        {/* Submit */}
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        {/* SSO */}
        <button style={styles.googleBtn} onClick={handleGoogle}>
          G &nbsp; Continue with Google
        </button>

      </div>
      <div style={styles.footer}>Encrypted · Private · Ad-free</div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh',width: '100vw',background: '#08101E', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif",
    padding: 20 },
  card: { width: '100%', maxWidth: 400, background: '#0D1929', border: '1px solid #1E3550',
    borderRadius: 16, padding: 32 },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 },
  logoIcon: { width: 44, height: 44, background: 'linear-gradient(135deg, #C8922A, #7A5010)',
    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 800, color: '#0A0A0A' },
  logoTitle: { color: '#F4F0E8', fontSize: 18, fontWeight: 700 },
  logoSub: { color: '#7A91B0', fontSize: 12 },
  toggle: { display: 'flex', gap: 4, background: '#132035', borderRadius: 8,
    padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, padding: '8px', border: 'none', borderRadius: 6, cursor: 'pointer',
    background: 'transparent', color: '#7A91B0', fontFamily: 'inherit', fontSize: 13,
    fontWeight: 400, transition: 'all 0.2s' },
  toggleActive: { background: '#0D1929', color: '#F4F0E8', fontWeight: 600,
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
  fields: { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 },
  label: { color: '#7A91B0', fontSize: 12, display: 'block', marginBottom: 5 },
  input: { width: '100%', background: '#08101E', border: '1px solid #1E3550', borderRadius: 8,
    padding: '10px 14px', color: '#F4F0E8', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #C8922A, #A87020)',
    border: 'none', borderRadius: 8, color: '#0A0A0A', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 },
  divider: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, background: '#1E3550' },
  dividerText: { color: '#3A5070', fontSize: 12 },
  googleBtn: { width: '100%', padding: '10px', background: 'transparent',
    border: '1px solid #1E3550', borderRadius: 8, color: '#7A91B0', fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit' },
  error: { background: 'rgba(196,48,48,0.1)', border: '1px solid #C4303044', borderRadius: 8,
    padding: '10px 14px', color: '#EF6060', fontSize: 13, marginBottom: 16 },
  success: { background: 'rgba(26,138,90,0.12)', border: '1px solid #1A8A5A44', borderRadius: 8,
    padding: '10px 14px', color: '#34D399', fontSize: 13, marginBottom: 16 },
  link: { color: '#C8922A', fontSize: 12, cursor: 'pointer' },
  footer: { color: '#3A5070', fontSize: 12, marginTop: 20 }
}
