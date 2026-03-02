import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UpgradeSuccess() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#08101E] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-6">🏆</div>
      <h1 className="text-[#F4F0E8] text-3xl font-bold mb-3">You're Pro!</h1>
      <p className="text-[#7A91B0] text-sm mb-8 max-w-sm">
        Your account has been upgraded. All features are now unlocked.
      </p>
      <button
        onClick={() => navigate('/')}
        className="py-3 px-8 rounded-xl text-sm font-bold text-black cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
      >
        Start Forging →
      </button>
      <div className="text-[#3A5070] text-xs mt-4">
        Redirecting in {countdown}s...
      </div>
    </div>
  )
}