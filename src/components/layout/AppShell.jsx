import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08101E' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* Mobile top bar — only renders on mobile */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', background: '#0D1929',
            borderBottom: '1px solid #1E3550', position: 'sticky', top: 0, zIndex: 30
          }}>
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ display: 'flex', flexDirection: 'column', gap: 5,
                cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}>
              <div style={{ width: 20, height: 2, background: '#C8922A', borderRadius: 2 }} />
              <div style={{ width: 20, height: 2, background: '#C8922A', borderRadius: 2 }} />
              <div style={{ width: 20, height: 2, background: '#C8922A', borderRadius: 2 }} />
            </button>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 900, color: 'black',
                background: 'linear-gradient(135deg, #C8922A, #7A5010)'
              }}>S</div>
              <span style={{ color: '#F4F0E8', fontSize: 14, fontWeight: 700 }}>
                Simply Success
              </span>
            </div>

            {/* Date */}
            <span style={{ color: '#C8922A', fontSize: 11, fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}

        {/* Page content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}