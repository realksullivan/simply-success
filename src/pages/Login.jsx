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
        email, password,
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
    <div className="min-h-screen bg-[#08101E] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black text-black"
            style={{ background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}>
            W
          </div>
          <div>
            <div className="text-[#F4F0E8] text-lg font-bold">WinForge</div>
            <div className="text-[#7A91B0] text-xs">Forge your winning days</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-2xl p-6 md:p-8">

          {/* Toggle */}
          <div className="flex gap-1 bg-[#132035] rounded-lg p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null) }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
                  ${mode === m
                    ? 'bg-[#0D1929] text-[#F4F0E8] shadow font-semibold'
                    : 'text-[#7A91B0] bg-transparent'}`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg px-4 py-3 text-green-400 text-sm mb-4">
              {message}
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4 mb-5">
            {mode === 'register' && (
              <div>
                <label className="text-[#7A91B0] text-xs block mb-1.5">Full Name</label>
                <input
                  className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2.5 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                  placeholder="James Davis"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="text-[#7A91B0] text-xs block mb-1.5">Email</label>
              <input
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2.5 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[#7A91B0] text-xs">Password</label>
                {mode === 'login' && (
                  <span className="text-[#C8922A] text-xs cursor-pointer" onClick={handleForgotPassword}>
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2.5 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-bold text-black cursor-pointer transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#1E3550]" />
            <span className="text-[#3A5070] text-xs">or continue with</span>
            <div className="flex-1 h-px bg-[#1E3550]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full py-2.5 rounded-lg border border-[#1E3550] text-[#7A91B0] text-sm cursor-pointer hover:border-[#2A4A72] transition-colors bg-transparent">
            G &nbsp; Continue with Google
          </button>
        </div>

        <div className="text-center text-[#3A5070] text-xs mt-5">
          Encrypted · Private · Ad-free
        </div>
      </div>
    </div>
  )
}