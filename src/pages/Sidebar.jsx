import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'

const NAV = [
  { path: '/',           icon: '◆', label: 'Today' },
  { path: '/goals',      icon: '◎', label: 'Goals' },
  { path: '/projects',   icon: '◈', label: 'Projects' },
  { path: '/reflection', icon: '◐', label: 'Reflect' },
  { path: '/analytics',  icon: '⬡', label: 'Insights' },
  { path: '/pricing',    icon: '★', label: 'Upgrade' },
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
    <div style={{ width: 208, height: '100%', background: '#0D1929', borderRight: '1px solid #1E3550', display: 'flex', flexDirection: 'column' }}>

      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E3550' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: 'black', flexShrink: 0,
            background: 'linear-gradient(135deg, #C8922A, #7A5010)',
          }}>W</div>
          <div>
            <div style={{ color: '#F4F0E8', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>WinForge</div>
            <div style={{ color: '#C8922A', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>Forge your wins</div>
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E3550' }}>
        <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 500 }}>
          {today.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div style={{ color: '#F4F0E8', fontSize: 20, fontWeight: 700, lineHeight: 1.2, fontFamily: 'Georgia, serif' }}>
          {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
        <div style={{ color: '#3A5070', fontSize: 11 }}>{today.getFullYear()}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {NAV.map(n => {
          const active = location.pathname === n.path
          return (
            <button key={n.path} onClick={() => navigate(n.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                background: active ? 'rgba(200,146,42,0.1)' : 'transparent',
                borderLeft: active ? '2px solid #C8922A' : '2px solid transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                cursor: 'pointer', outline: 'none',
              }}>
              <span style={{ color: active ? '#C8922A' : '#3A5070', fontSize: 13, width: 16, textAlign: 'center' }}>
                {n.icon}
              </span>
              <span style={{ color: active ? '#F4F0E8' : '#7A91B0', fontSize: 13, fontWeight: active ? 600 : 400 }}>
                {n.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Streak */}
      <div style={{ margin: '0 12px 12px', background: '#132035', borderRadius: 8, padding: 12, border: '1px solid #1E3550' }}>
        <div style={{ color: '#3A5070', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Win Streak</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ color: '#C8922A', fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
            {streak}
          </span>
          <span style={{ color: '#C8922A', fontSize: 13 }}>days {streak > 0 ? '🔥' : ''}</span>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1E3550', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'black', flexShrink: 0,
          background: 'linear-gradient(135deg, #C8922A, #7A5010)',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#F4F0E8', fontSize: 11, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </div>
          <button onClick={handleLogout}
            style={{ color: '#3A5070', fontSize: 11, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {!isMobile && (
        <div style={{ width: 208, minHeight: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
          {sidebarContent}
        </div>
      )}

      {isMobile && open && (
        <>
          <div
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
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