import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const [profile, setProfile] = useState({ full_name: '', email: '' })
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [reflectTime, setReflectTime] = useState('21:00')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setProfile({
      full_name: user.user_metadata?.full_name || '',
      email: user.email || ''
    })

    const { data: habitData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order')

    setHabits(habitData || [])
    setLoading(false)
  }

  const saveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.full_name }
    })
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  const addHabit = async () => {
    if (!newHabit.trim() || habits.length >= 10) return
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('habits')
      .insert({ title: newHabit.trim(), user_id: user.id, sort_order: habits.length })
      .select()
      .single()
    setHabits(prev => [...prev, data])
    setNewHabit('')
  }

  const deleteHabit = async (id) => {
    await supabase.from('habits').delete().eq('id', id)
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete all your data and cannot be undone.')) return
    alert('Please contact support to delete your account.')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center">
      <div className="text-[#C8922A]">Loading settings...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08101E] px-4 py-8 md:px-9">

      {/* Header */}
      <div className="mb-8">
        <div className="text-[#7A91B0] text-sm mb-1">Account</div>
        <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">Settings</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">Profile</div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}>
              {profile.full_name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-[#F4F0E8] text-sm font-semibold">{profile.full_name || 'Your Name'}</div>
              <div className="text-[#7A91B0] text-xs">{profile.email}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[#7A91B0] text-xs block mb-1.5">Display Name</label>
              <input
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                value={profile.full_name}
                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-[#7A91B0] text-xs block mb-1.5">Email</label>
              <input
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#7A91B0] text-sm outline-none cursor-not-allowed"
                value={profile.email}
                disabled
              />
            </div>
            <button onClick={saveProfile}
              className="self-start px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer mt-1"
              style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
              {saved ? '✓ Saved!' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Daily Habits */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase">
              Daily Habits ({habits.length}/10)
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            {habits.length === 0 && (
              <div className="text-[#3A5070] text-sm italic py-2">No habits yet — add your first one below</div>
            )}
            {habits.map((h, i) => (
              <div key={h.id} className="flex items-center justify-between py-2 border-b border-[#1E3550]">
                <div className="flex items-center gap-2">
                  <span className="text-[#3A5070] text-xs w-4">{i + 1}.</span>
                  <span className="text-[#F4F0E8] text-sm">{h.title}</span>
                </div>
                <button onClick={() => deleteHabit(h.id)}
                  className="text-[#3A5070] hover:text-red-400 text-xs px-2 py-1 cursor-pointer bg-transparent border-none transition-colors">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {habits.length < 10 && (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                placeholder="Add a daily habit..."
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addHabit()}
              />
              <button onClick={addHabit}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
                Add
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Notifications
          </div>
          <div>
            <label className="text-[#7A91B0] text-xs block mb-1.5">
              Evening Reflection Reminder
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="time"
                value={reflectTime}
                onChange={e => setReflectTime(e.target.value)}
                className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A]"
              />
              <span className="text-[#3A5070] text-xs">Coming soon — email reminders</span>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Privacy & Data
          </div>
          <div className="text-[#7A91B0] text-xs leading-relaxed mb-5">
            All your reflections, goals and tasks are encrypted at rest and never shared with third parties. 
            Row-level security ensures only you can access your data.
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg text-sm border border-[#1E3550] text-[#7A91B0] bg-transparent cursor-pointer hover:border-[#2A4A72] transition-colors">
              Sign Out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2.5 rounded-lg text-sm border border-red-900/40 text-red-400 bg-red-900/10 cursor-pointer hover:bg-red-900/20 transition-colors">
              Delete All My Data
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}