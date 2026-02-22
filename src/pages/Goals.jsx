import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGoal, setNewGoal] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('is_archived', false)
      .order('created_at')
    setGoals(data || [])
    setLoading(false)
  }

  const addGoal = async () => {
    if (!newGoal.trim() || goals.length >= 5) return
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('goals')
      .insert({ title: newGoal.trim(), user_id: user.id })
      .select()
      .single()
    setGoals(prev => [...prev, data])
    setNewGoal('')
    setAdding(false)
  }

  const archiveGoal = async (id) => {
    await supabase.from('goals').update({ is_archived: true }).eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const achieveGoal = async (id) => {
    await supabase
      .from('goals')
      .update({ is_archived: true, achieved_at: new Date() })
      .eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center">
      <div className="text-[#C8922A]">Loading goals...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08101E] px-4 py-8 md:px-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#7A91B0] text-sm mb-1">Annual Goals</div>
          <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">My Goals</div>
        </div>
        {goals.length < 5 && (
          <button
            onClick={() => setAdding(true)}
            className="self-start md:self-auto border border-[#C8922A] text-[#C8922A] text-sm px-4 py-2 rounded-lg bg-transparent cursor-pointer hover:bg-[#C8922A]/10 transition-colors">
            + Add Goal
          </button>
        )}
      </div>

      {/* Add Goal Form */}
      {adding && (
        <div className="bg-[#0D1929] border border-[#C8922A]/50 rounded-xl p-5 mb-5">
          <div className="text-[#7A91B0] text-xs mb-3">New Annual Goal ({goals.length}/5)</div>
          <div className="flex gap-3">
            <input
              autoFocus
              className="flex-1 bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
              placeholder="What do you want to achieve this year?"
              value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGoal()}
            />
            <button onClick={addGoal}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
              Save
            </button>
            <button onClick={() => { setAdding(false); setNewGoal('') }}
              className="px-4 py-2 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] bg-transparent cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 && !adding ? (
        <div className="bg-[#0D1929] border border-dashed border-[#1E3550] rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <div className="text-[#F4F0E8] text-lg font-semibold mb-2">No goals yet</div>
          <div className="text-[#7A91B0] text-sm mb-5">Set up to 5 annual goals to keep your vision front and center</div>
          <button onClick={() => setAdding(true)}
            className="border border-[#C8922A] text-[#C8922A] text-sm px-5 py-2 rounded-lg bg-transparent cursor-pointer">
            + Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal, i) => (
            <div key={goal.id} className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5 hover:border-[#2A4A72] transition-colors">
              <div className="flex justify-between items-start gap-3 mb-4">
                <div>
                  <div className="text-[#3A5070] text-xs mb-1">GOAL {i + 1} OF 5</div>
                  <div className="text-[#F4F0E8] text-base font-medium">{goal.title}</div>
                </div>
                <div className="text-[#C8922A] text-2xl font-bold shrink-0">
                  {goal.progress}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-[#132035] rounded-full mb-4">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%`, background: 'linear-gradient(90deg, #C8922A, #C8922A88)' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => achieveGoal(goal.id)}
                  className="text-xs px-3 py-1.5 rounded-md border border-green-700/40 text-green-400 bg-green-900/10 cursor-pointer hover:bg-green-900/20 transition-colors">
                  🏆 Mark Achieved
                </button>
                <button
                  onClick={() => archiveGoal(goal.id)}
                  className="text-xs px-3 py-1.5 rounded-md border border-[#1E3550] text-[#7A91B0] bg-transparent cursor-pointer hover:border-[#2A4A72] transition-colors">
                  Archive
                </button>
              </div>
            </div>
          ))}

          {/* Empty Slot */}
          {goals.length < 5 && !adding && (
            <div
              onClick={() => setAdding(true)}
              className="border border-dashed border-[#1E3550] rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px] cursor-pointer hover:border-[#C8922A]/40 transition-colors">
              <div className="text-[#3A5070] text-2xl mb-2">+</div>
              <div className="text-[#3A5070] text-sm">Add another goal</div>
              <div className="text-[#1E3550] text-xs mt-1">{5 - goals.length} slots remaining</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}