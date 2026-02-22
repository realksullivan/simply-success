import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Today from './pages/Today'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still loading
  if (session === undefined) return (
    <div style={{ background: '#08101E', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: '#C8922A', fontSize: 18 }}>
      Loading...
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          session ? <Navigate to="/" /> : <Login />
        } />
        <Route path="/" element={
          session ? <Today /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}