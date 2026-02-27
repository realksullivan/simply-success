import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'

const NAV = [
  { path: '/',           icon: '◆', label: 'Today' },
  { path: '/goals',      icon: '◎', label: 'Goals' },
  { path: '/projects',   icon: '◈', label: 'Projects' },
  { path: '/reflection', icon: '◐', label: 'Reflect' },
  { path: '/analytics',  icon: '⬡', label: 'Insights' },
  { path: '/settings',   icon: '⊕', label: 'Settings' },
]

export default function Sidebar({ open, onClose, isMobile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetchUser()
    fetchStreak()
  }, [])

  // Close sidebar on route change on mobile
  useEffect(() => {
    onClose?.()
  }, [location.pathname])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

const fetchStreak = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('checklists')
    .select('date, won_the_day')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(90)

  if (!data || data.length === 0) return

  // Filter out today in JS using local date
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const pastDays = data.filter(c => c.date !== todayStr)

  let count = 0
  for (const c of pastDays) {
    if (c.won_the_day) count++
    else break
  }
  setStreak(count)
}
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const today = new Date()

  const sidebarContent = (
    <div className="w-52 h-full bg-[#0D1929] border-r border-[#1E3550] flex flex-col">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#1E3550]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}>
            S
          </div>
          <div>
            <div className="text-[#F4F0E8] text-sm font-bold leading-tight">Simply</div>
            <div className="text-[#C8922A] text-xs tracking-widest uppercase leading-tight">Success</div>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="px-5 py-4 border-b border-[#1E3550]">
        <div className="text-[#C8922A] text-xs font-medium">
          {today.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div className="text-[#F4F0E8] text-xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
        <div className="text-[#3A5070] text-xs">{today.getFullYear()}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3">
        {NAV.map(n => {
          const active = location.pathname === n.path
          return (
            <button key={n.path} onClick={() => navigate(n.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left cursor-pointer transition-all border-l-2
                ${active
                  ? 'bg-[#C8922A]/10 border-[#C8922A]'
                  : 'bg-transparent border-transparent hover:bg-[#132035]'}`}>
              <span className={`text-sm w-4 text-center ${active ? 'text-[#C8922A]' : 'text-[#3A5070]'}`}>
                {n.icon}
              </span>
              <span className={`text-sm ${active ? 'text-[#F4F0E8] font-semibold' : 'text-[#7A91B0]'}`}>
                {n.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Streak */}
      <div className="mx-3 mb-3 bg-[#132035] rounded-lg p-3 border border-[#1E3550]">
        <div className="text-[#3A5070] text-xs uppercase tracking-widest mb-1">Win Streak</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#C8922A] text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            {streak}
          </span>
          <span className="text-[#C8922A] text-sm">days {streak > 0 ? '🔥' : ''}</span>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-[#1E3550] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[#F4F0E8] text-xs font-medium truncate">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </div>
          <button onClick={handleLogout}
            className="text-[#3A5070] text-xs hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-0">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      {!isMobile && (
        <div style={{ width: 208, minHeight: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
          {sidebarContent}
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <>
          <div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)', zIndex: 40
            }}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0,
            height: '100%', zIndex: 50,
            animation: 'slideIn 0.25s ease'
          }}>
            {sidebarContent}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
