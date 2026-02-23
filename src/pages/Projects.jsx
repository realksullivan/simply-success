import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', quarter: 'Q1 2026', goal_id: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: projectData }, { data: goalData }] = await Promise.all([
      supabase.from('projects').select('*, goals(title)').eq('user_id', user.id).is('completed_at', null).order('created_at'),
      supabase.from('goals').select('*').eq('user_id', user.id).eq('is_archived', false)
    ])

    setProjects(projectData || [])
    setGoals(goalData || [])
    setLoading(false)
  }

  const addProject = async () => {
    if (!form.title.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('projects')
      .insert({
        title: form.title.trim(),
        quarter: form.quarter,
        goal_id: form.goal_id || null,
        user_id: user.id
      })
      .select('*, goals(title)')
      .single()
    setProjects(prev => [...prev, data])
    setForm({ title: '', quarter: 'Q1 2026', goal_id: '' })
    setAdding(false)
  }

  const completeProject = async (id) => {
    await supabase.from('projects').update({ completed_at: new Date() }).eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const rollOver = async (project) => {
    const { data: { user } } = await supabase.auth.getUser()
    const currentIndex = QUARTERS.indexOf(project.quarter)
    const nextQuarter = QUARTERS[currentIndex + 1] || QUARTERS[0]
    const { data } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        quarter: nextQuarter,
        goal_id: project.goal_id,
        user_id: user.id
      })
      .select('*, goals(title)')
      .single()
    await completeProject(project.id)
    setProjects(prev => [...prev.filter(p => p.id !== project.id), data])
  }

  const quarterColor = (q) => {
    const colors = {
      'Q1 2026': '#C8922A',
      'Q2 2026': '#5080D0',
      'Q3 2026': '#1A8A5A',
      'Q4 2026': '#A060C0',
    }
    return colors[q] || '#C8922A'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center">
      <div className="text-[#C8922A]">Loading projects...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08101E] px-4 py-8 md:px-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#7A91B0] text-sm mb-1">Quarterly Projects</div>
          <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">My Projects</div>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="self-start border border-[#C8922A] text-[#C8922A] text-sm px-4 py-2 rounded-lg bg-transparent cursor-pointer hover:bg-[#C8922A]/10 transition-colors">
          + New Project
        </button>
      </div>

      {/* Add Form */}
      {adding && (
        <div className="bg-[#0D1929] border border-[#C8922A]/50 rounded-xl p-5 mb-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">New Project</div>
          <div className="flex flex-col gap-3">
            <input
              autoFocus
              className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A] transition-colors"
              placeholder="Project title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A]"
                value={form.quarter}
                onChange={e => setForm(f => ({ ...f, quarter: e.target.value }))}>
                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              <select
                className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A]"
                value={form.goal_id}
                onChange={e => setForm(f => ({ ...f, goal_id: e.target.value }))}>
                <option value="">Link to a goal (optional)</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={addProject}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
                Save Project
              </button>
              <button onClick={() => { setAdding(false); setForm({ title: '', quarter: 'Q1 2026', goal_id: '' }) }}
                className="px-4 py-2 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] bg-transparent cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && !adding ? (
        <div className="bg-[#0D1929] border border-dashed border-[#1E3550] rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">◈</div>
          <div className="text-[#F4F0E8] text-lg font-semibold mb-2">No active projects</div>
          <div className="text-[#7A91B0] text-sm mb-5">Break your goals down into quarterly projects</div>
          <button onClick={() => setAdding(true)}
            className="border border-[#C8922A] text-[#C8922A] text-sm px-5 py-2 rounded-lg bg-transparent cursor-pointer">
            + Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => {
            const color = quarterColor(project.quarter)
            return (
              <div key={project.id} className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5 hover:border-[#2A4A72] transition-colors">

                {/* Quarter Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded"
                    style={{ color, background: `${color}22`, border: `1px solid ${color}44` }}>
                    {project.quarter}
                  </span>
                  <div className="text-2xl font-bold" style={{ color }}>
                    {project.progress}%
                  </div>
                </div>

                {/* Title */}
                <div className="text-[#F4F0E8] text-base font-semibold mb-1">{project.title}</div>

                {/* Linked Goal */}
                {project.goals && (
                  <div className="text-[#3A5070] text-xs mb-4">↳ {project.goals.title}</div>
                )}

                {/* Progress Bar */}
                <div className="h-1.5 bg-[#132035] rounded-full mb-4">
                  <div className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => completeProject(project.id)}
                    className="text-xs px-3 py-1.5 rounded-md border border-green-700/40 text-green-400 bg-green-900/10 cursor-pointer hover:bg-green-900/20 transition-colors">
                    ✓ Complete
                  </button>
                  <button onClick={() => rollOver(project)}
                    className="text-xs px-3 py-1.5 rounded-md border border-[#1E3550] text-[#7A91B0] bg-transparent cursor-pointer hover:border-[#2A4A72] transition-colors">
                    Roll Over →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}