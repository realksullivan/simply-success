import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import Goals from './pages/Goals'
import Projects from './pages/Projects'
import Reflection from './pages/Reflection'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [onboardingComplete, setOnboardingComplete] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      const complete = session?.user?.user_metadata?.onboarding_complete ?? false
      setOnboardingComplete(complete)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      const complete = session?.user?.user_metadata?.onboarding_complete ?? false
      setOnboardingComplete(complete)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined || onboardingComplete === undefined) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center text-[#C8922A] text-lg">
      Loading...
    </div>
  )

  const protect = (page) => {
    if (!session) return <Navigate to="/login" />
    if (!onboardingComplete) return <Navigate to="/onboarding" />
    return <AppShell>{page}</AppShell>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={session ? (onboardingComplete ? <AppShell><Today /></AppShell> : <Navigate to="/onboarding" />) : <Landing />} />
        <Route path="/login"      element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/onboarding" element={!session ? <Navigate to="/login" /> : onboardingComplete ? <Navigate to="/" /> : <Onboarding />} />
        <Route path="/today"      element={protect(<Today />)} />
        <Route path="/goals"      element={protect(<Goals />)} />
        <Route path="/projects"   element={protect(<Projects />)} />
        <Route path="/reflection" element={protect(<Reflection />)} />
        <Route path="/analytics"  element={protect(<Analytics />)} />
        <Route path="/settings"   element={protect(<Settings />)} />
      </Routes>
    </BrowserRouter>
  )
}