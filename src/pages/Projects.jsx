import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [expandedProject, setExpandedProject] = useState(null)
  const [newTaskInputs, setNewTaskInputs] = useState({})
  const [form, setForm] = useState({ title: '', quarter: 'Q1 2026', goal_id: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const [{ data: projectData }, { data: goalData }] = await Promise.all([
      supabase
        .from('projects')
        .select('*, goals(title), project_tasks(*)')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('created_at'),
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
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
      .select('*, goals(title), project_tasks(*)')
      .single()
    setProjects(prev => [...prev, data])
    setForm({ title: '', quarter: 'Q1 2026', goal_id: '' })
    setAdding(false)
    setExpandedProject(data.id)
  }

  const addProjectTask = async (projectId) => {
    const title = newTaskInputs[projectId]?.trim()
    if (!title) return
    const order = projects.find(p => p.id === projectId)?.project_tasks?.length || 0
    const { data } = await supabase
      .from('project_tasks')
      .insert({ project_id: projectId, title, sort_order: order })
      .select()
      .single()
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, project_tasks: [...(p.project_tasks || []), data] }
        : p
    ))
    setNewTaskInputs(prev => ({ ...prev, [projectId]: '' }))
  }

  const toggleProjectTask = async (projectId, taskId, currentDone) => {
  await supabase
    .from('project_tasks')
    .update({ is_done: !currentDone, completed_at: !currentDone ? new Date() : null })
    .eq('id', taskId)

  // Update local state
  const updatedProjects = projects.map(p => {
    if (p.id !== projectId) return p
    const updatedTasks = p.project_tasks.map(t =>
      t.id === taskId ? { ...t, is_done: !currentDone } : t
    )
    // Recalculate progress
    const done = updatedTasks.filter(t => t.is_done).length
    const total = updatedTasks.length
    const newProgress = total > 0 ? Math.round((done / total) * 100) : 0

    // Persist progress to database
    supabase
      .from('projects')
      .update({ progress: newProgress })
      .eq('id', projectId)

    return { ...p, project_tasks: updatedTasks, progress: newProgress }
  })

  setProjects(updatedProjects)
}

  const deleteProjectTask = async (projectId, taskId) => {
    await supabase.from('project_tasks').delete().eq('id', taskId)
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, project_tasks: p.project_tasks.filter(t => t.id !== taskId) }
        : p
    ))
  }

  const completeProject = async (id) => {
    await supabase.from('projects').update({ completed_at: new Date() }).eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const quarterColor = (q) => ({
    'Q1 2026': '#C8922A',
    'Q2 2026': '#5080D0',
    'Q3 2026': '#1A8A5A',
    'Q4 2026': '#A060C0',
  }[q] || '#C8922A')

  if (loading) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center">
      <div className="text-[#C8922A]">Loading projects...</div>
    </div>
  )

  return (
    <div className="px-4 py-8 md:px-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#7A91B0] text-sm mb-1">Quarterly Projects</div>
          <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">My Projects</div>
        </div>
        <button onClick={() => setAdding(true)}
          className="self-start border border-[#C8922A] text-[#C8922A] text-sm px-4 py-2 rounded-lg bg-transparent cursor-pointer hover:bg-[#C8922A]/10 transition-colors">
          + New Project
        </button>
      </div>

      {/* Add Form */}
      {adding && (
        <div className="bg-[#0D1929] border border-[#C8922A]/50 rounded-xl p-5 mb-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">New Project</div>
          <div className="flex flex-col gap-3">
            <input autoFocus
              className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none focus:border-[#C8922A]"
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
                className="bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8922A]"
                style={{ color: form.goal_id ? '#F4F0E8' : '#3A5070' }}
                value={form.goal_id}
                onChange={e => setForm(f => ({ ...f, goal_id: e.target.value }))}>
                <option value="">Link to a goal (optional)</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={addProject}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
                Save Project
              </button>
              <button onClick={() => setAdding(false)}
                className="px-4 py-2 rounded-lg text-sm text-[#7A91B0] border border-[#1E3550] bg-transparent cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
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
        <div className="flex flex-col gap-4">
          {projects.map(project => {
            const color = quarterColor(project.quarter)
            const tasks = project.project_tasks || []
            const doneTasks = tasks.filter(t => t.is_done).length
            const pct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0
            const isExpanded = expandedProject === project.id

            return (
              <div key={project.id} className="bg-[#0D1929] border border-[#1E3550] rounded-xl overflow-hidden">

                {/* Project Header */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 rounded"
                        style={{ color, background: `${color}22`, border: `1px solid ${color}44` }}>
                        {project.quarter}
                      </span>
                      {project.goals && (
                        <span className="text-[#3A5070] text-xs">↳ {project.goals.title}</span>
                      )}
                    </div>
                    <span className="text-xl font-bold" style={{ color }}>{pct}%</span>
                  </div>

                  <div className="text-[#F4F0E8] text-base font-semibold mb-3">{project.title}</div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-[#132035] rounded-full mb-4">
                    <div className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      className="text-xs px-3 py-1.5 rounded-md border cursor-pointer transition-colors"
                      style={{
                        borderColor: isExpanded ? color : '#1E3550',
                        color: isExpanded ? color : '#7A91B0',
                        background: 'transparent'
                      }}>
                      {isExpanded ? '▲ Hide Tasks' : `▼ Tasks (${tasks.length})`}
                    </button>
                    <span className="text-[#3A5070] text-xs">{doneTasks}/{tasks.length} complete</span>
                    <button onClick={() => completeProject(project.id)}
                      className="text-xs px-3 py-1.5 rounded-md border border-green-700/40 text-green-400 bg-green-900/10 cursor-pointer hover:bg-green-900/20 transition-colors ml-auto">
                      ✓ Complete Project
                    </button>
                  </div>
                </div>

                {/* Task List — expandable */}
                {isExpanded && (
                  <div className="border-t border-[#1E3550] px-5 py-4">
                    <div className="text-[#3A5070] text-xs uppercase tracking-widest mb-3">
                      Project Tasks
                    </div>

                    {tasks.length === 0 && (
                      <div className="text-[#3A5070] text-sm italic mb-3">
                        No tasks yet — add your first one below
                      </div>
                    )}

                    {tasks
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((task, i) => (
                        <div key={task.id}
                          className={`flex items-center gap-3 py-2 ${i < tasks.length - 1 ? 'border-b border-[#1E3550]' : ''}`}>
                          <div
                            onClick={() => toggleProjectTask(project.id, task.id, task.is_done)}
                            className="w-4 h-4 min-w-[16px] rounded cursor-pointer flex items-center justify-center text-[10px] text-black font-bold transition-all"
                            style={{
                              border: `2px solid ${task.is_done ? color : '#1E3550'}`,
                              background: task.is_done ? color : 'transparent'
                            }}>
                            {task.is_done && '✓'}
                          </div>
                          <span className={`text-sm flex-1 ${task.is_done ? 'line-through text-[#3A5070]' : 'text-[#F4F0E8]'}`}>
                            {task.title}
                          </span>
                          <button
                            onClick={() => deleteProjectTask(project.id, task.id)}
                            className="text-[#3A5070] hover:text-red-400 text-xs cursor-pointer bg-transparent border-none transition-colors">
                            ✕
                          </button>
                        </div>
                      ))}

                    {/* Add task input */}
                    <div className="flex gap-2 mt-3">
                      <input
                        className="flex-1 bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-[#F4F0E8] text-sm outline-none transition-colors"
                        style={{ focusBorderColor: color }}
                        placeholder="Add a task to this project..."
                        value={newTaskInputs[project.id] || ''}
                        onChange={e => setNewTaskInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addProjectTask(project.id)}
                      />
                      {newTaskInputs[project.id] && (
                        <button
                          onClick={() => addProjectTask(project.id)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}