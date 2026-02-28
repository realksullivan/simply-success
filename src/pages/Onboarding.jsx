import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

const SUGGESTED_HABITS = [
  'Morning meditation',
  'Exercise / workout',
  'Deep reading 30 min',
  'No social media before 10am',
  'Review daily goals',
  'Journaling',
  'Cold shower',
  'Drink 2L water',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Step 2 — Goal
  const [goalTitle, setGoalTitle] = useState('')

  // Step 3 — Project
  const [projectTitle, setProjectTitle] = useState('')
  const [projectQuarter, setProjectQuarter] = useState('Q1 2026')

  // Step 4 — Habits
  const [selectedHabits, setSelectedHabits] = useState([])
  const [customHabit, setCustomHabit] = useState('')

  const totalSteps = 5

  const toggleHabit = (habit) => {
    setSelectedHabits(prev =>
      prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
    )
  }

  const addCustomHabit = () => {
    const trimmed = customHabit.trim()
    if (!trimmed || selectedHabits.includes(trimmed)) return
    setSelectedHabits(prev => [...prev, trimmed])
    setCustomHabit('')
  }

  const removeHabit = (habit) => {
    setSelectedHabits(prev => prev.filter(h => h !== habit))
  }

  const handleFinish = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Save goal
      let goalId = null
      if (goalTitle.trim()) {
        const { data: goal, error: goalError } = await supabase
          .from('goals')
          .insert({ title: goalTitle.trim(), user_id: user.id, progress: 0 })
          .select()
          .single()
        if (goalError) throw goalError
        goalId = goal.id
      }

      // Save project
      if (projectTitle.trim()) {
        const { error: projectError } = await supabase
          .from('projects')
          .insert({
            title: projectTitle.trim(),
            quarter: projectQuarter,
            goal_id: goalId,
            user_id: user.id,
            progress: 0,
          })
        if (projectError) throw projectError
      }

      // Save habits
      if (selectedHabits.length > 0) {
        const { error: habitError } = await supabase
          .from('habits')
          .insert(
            selectedHabits.map((title, i) => ({
              title,
              user_id: user.id,
              sort_order: i,
            }))
          )
        if (habitError) throw habitError
      }

      // Mark onboarding complete in user metadata
      await supabase.auth.updateUser({
        data: { onboarding_complete: true }
      })

      navigate('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const canAdvance = () => {
    if (step === 2) return goalTitle.trim().length > 0
    if (step === 3) return projectTitle.trim().length > 0
    if (step === 4) return selectedHabits.length > 0
    return true
  }

  const skipToEnd = async () => {
    setLoading(true)
    await supabase.auth.updateUser({ data: { onboarding_complete: true } })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#08101E] flex flex-col items-center justify-center px-4 py-12">

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i + 1 === step ? 24 : 8,
                  background: i + 1 <= step ? '#C8922A' : '#1E3550',
                }}
              />
            ))}
          </div>
          <span className="text-[#3A5070] text-xs">Step {step} of {totalSteps}</span>
        </div>
      </div>

      <div className="w-full max-w-lg">

        {/* ─── Step 1: Welcome ─── */}
        {step === 1 && (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-black mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}
            >
              W
            </div>
            <h1 className="text-[#F4F0E8] text-3xl font-bold mb-3">
              Welcome to WinForge
            </h1>
            <p className="text-[#7A91B0] text-base mb-2">
              Let's set up your system in 2 minutes.
            </p>
            <p className="text-[#3A5070] text-sm mb-10">
              You'll set a goal, create your first project, and pick your daily habits.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: '◎', label: 'Annual Goals', desc: "What you're building toward" },
                { icon: '◈', label: 'Projects', desc: 'Quarterly sprints to get there' },
                { icon: '◐', label: 'Daily Habits', desc: 'The reps that compound' },
              ].map(item => (
                <div key={item.label} className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4 text-center">
                  <div className="text-[#C8922A] text-xl mb-2">{item.icon}</div>
                  <div className="text-[#F4F0E8] text-xs font-semibold mb-1">{item.label}</div>
                  <div className="text-[#3A5070] text-xs">{item.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-lg text-sm font-bold text-black cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
            >
              Let's go →
            </button>
          </div>
        )}

        {/* ─── Step 2: Goal ─── */}
        {step === 2 && (
          <div>
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-2">
              ◎ Annual Goal
            </div>
            <h2 className="text-[#F4F0E8] text-2xl font-bold mb-2">
              What's your most important goal this year?
            </h2>
            <p className="text-[#7A91B0] text-sm mb-8">
              Think big. This is the outcome you're building everything around.
            </p>

            <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-6 mb-6">
              <label className="text-[#7A91B0] text-xs block mb-2">Goal</label>
              <input
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-4 py-3 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                placeholder="e.g. Launch my SaaS and reach $5k MRR"
                value={goalTitle}
                onChange={e => setGoalTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canAdvance() && setStep(3)}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] cursor-pointer bg-transparent"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canAdvance()}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Project ─── */}
        {step === 3 && (
          <div>
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-2">
              ◈ First Project
            </div>
            <h2 className="text-[#F4F0E8] text-2xl font-bold mb-2">
              What are you working on this quarter?
            </h2>
            <p className="text-[#7A91B0] text-sm mb-8">
              Projects are 90-day sprints. They break your goal into actionable chunks.
            </p>

            <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-6 mb-6 flex flex-col gap-4">
              <div>
                <label className="text-[#7A91B0] text-xs block mb-2">Project name</label>
                <input
                  className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-4 py-3 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                  placeholder="e.g. Build MVP and launch beta"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[#7A91B0] text-xs block mb-2">Quarter</label>
                <div className="flex gap-2">
                  {QUARTERS.map(q => (
                    <button
                      key={q}
                      onClick={() => setProjectQuarter(q)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer border transition-all"
                      style={{
                        background: projectQuarter === q ? '#C8922A18' : 'transparent',
                        borderColor: projectQuarter === q ? '#C8922A' : '#1E3550',
                        color: projectQuarter === q ? '#C8922A' : '#7A91B0',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {goalTitle && (
                <div className="flex items-center gap-2 text-xs text-[#3A5070]">
                  <span>↳ Linked to:</span>
                  <span className="text-[#7A91B0] truncate">{goalTitle}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] cursor-pointer bg-transparent"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canAdvance()}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 4: Habits ─── */}
        {step === 4 && (
          <div>
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-2">
              ◐ Daily Habits
            </div>
            <h2 className="text-[#F4F0E8] text-2xl font-bold mb-2">
              Pick your daily habits
            </h2>
            <p className="text-[#7A91B0] text-sm mb-6">
              These show up every day on your checklist. Start with 2–4.
            </p>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-5">
              {SUGGESTED_HABITS.map(habit => {
                const selected = selectedHabits.includes(habit)
                return (
                  <button
                    key={habit}
                    onClick={() => toggleHabit(habit)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all"
                    style={{
                      background: selected ? '#C8922A18' : 'transparent',
                      borderColor: selected ? '#C8922A' : '#1E3550',
                      color: selected ? '#C8922A' : '#7A91B0',
                    }}
                  >
                    {selected ? '✓ ' : '+ '}{habit}
                  </button>
                )
              })}
            </div>

            {/* Custom habit input */}
            <div className="flex gap-2 mb-5">
              <input
                className="flex-1 bg-[#0D1929] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
                placeholder="Add your own habit..."
                value={customHabit}
                onChange={e => setCustomHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomHabit()}
              />
              {customHabit.trim() && (
                <button
                  onClick={addCustomHabit}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-black cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
                >
                  Add
                </button>
              )}
            </div>

            {/* Selected list */}
            {selectedHabits.length > 0 && (
              <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4 mb-6">
                <div className="text-[#3A5070] text-xs uppercase tracking-widest mb-3">
                  Selected ({selectedHabits.length})
                </div>
                <div className="flex flex-col gap-2">
                  {selectedHabits.map(h => (
                    <div key={h} className="flex items-center justify-between">
                      <span className="text-[#F4F0E8] text-sm">◐ {h}</span>
                      <button
                        onClick={() => removeHabit(h)}
                        className="text-[#3A5070] text-xs hover:text-red-400 cursor-pointer bg-transparent border-none"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-3 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] cursor-pointer bg-transparent"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canAdvance()}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 5: Summary ─── */}
        {step === 5 && (
          <div>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-[#F4F0E8] text-2xl font-bold mb-2">You're all set.</h2>
              <p className="text-[#7A91B0] text-sm">Here's what we've set up for you:</p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {goalTitle && (
                <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4">
                  <div className="text-[#C8922A] text-xs uppercase tracking-widest mb-1">◎ Goal</div>
                  <div className="text-[#F4F0E8] text-sm">{goalTitle}</div>
                </div>
              )}

              {projectTitle && (
                <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4">
                  <div className="text-[#C8922A] text-xs uppercase tracking-widest mb-1">◈ Project · {projectQuarter}</div>
                  <div className="text-[#F4F0E8] text-sm">{projectTitle}</div>
                </div>
              )}

              {selectedHabits.length > 0 && (
                <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4">
                  <div className="text-[#C8922A] text-xs uppercase tracking-widest mb-2">
                    ◐ Daily Habits ({selectedHabits.length})
                  </div>
                  <div className="flex flex-col gap-1">
                    {selectedHabits.map(h => (
                      <div key={h} className="text-[#F4F0E8] text-sm">· {h}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-black cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}
            >
              {loading ? 'Saving...' : 'Start forging wins →'}
            </button>
          </div>
        )}

        {/* Skip link */}
        {step < 5 && (
          <button
            onClick={skipToEnd}
            className="w-full text-center text-[#3A5070] text-xs mt-6 cursor-pointer bg-transparent border-none hover:text-[#7A91B0]"
          >
            Skip setup — I'll do this later
          </button>
        )}
      </div>
    </div>
  )
}