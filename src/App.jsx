import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Today from './pages/Today'
import Goals from './pages/Goals'
import Projects from './pages/Projects'
import Reflection from './pages/Reflection'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Landing from './pages/Landing'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center text-[#C8922A] text-lg">
      Loading...
    </div>
  )

  const protect = (page) => session
    ? <AppShell>{page}</AppShell>
    : <Navigate to="/login" />

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={session ? <AppShell><Today /></AppShell> : <Landing />} />
      <Route path="/goals"      element={protect(<Goals />)} />
      <Route path="/projects"   element={protect(<Projects />)} />
      <Route path="/reflection" element={protect(<Reflection />)} />
      <Route path="/analytics"  element={protect(<Analytics />)} />
      <Route path="/settings"   element={protect(<Settings />)} />
    </Routes>
  </BrowserRouter>
)
}