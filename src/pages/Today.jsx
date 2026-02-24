import { useState } from 'react'
import { useChecklist } from '../hooks/useChecklist'

export default function Today() {
  const {
    checklist, tasks, habits, habitLogs, projectBacklog,
    loading, toggleTask, addTask, toggleHabit, winTheDay
  } = useChecklist()

  const [newTask, setNewTask] = useState('')
  const [newFocus, setNewFocus] = useState('')
  const [selectedBacklogTask, setSelectedBacklogTask] = useState('')

  const focusTask = tasks.find(t => t.type === 'focus')
  const projectTasks = tasks.filter(t => t.type === 'project')
  const otherTasks = tasks.filter(t => t.type === 'other')
  const focusDone = focusTask?.is_done

  const handleAddFocus = async () => {
    if (!newFocus.trim()) return
    await addTask(newFocus.trim(), 'focus')
    setNewFocus('')
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    await addTask(newTask.trim(), 'other')
    setNewTask('')
  }

  const handleAddProjectTask = async () => {
    if (!selectedBacklogTask) return
    const task = projectBacklog.find(t => t.id === selectedBacklogTask)
    if (!task) return
    await addTask(task.title, 'project', task.project_id)
    setSelectedBacklogTask('')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#C8922A] text-base">Loading your day...</div>
    </div>
  )

  return (
    <div className="px-4 py-8 md:px-9">

      {/* Header */}
      <div className="mb-6">
        <div className="text-[#7A91B0] text-sm mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">Today's Checklist</div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">

        {/* Left Column */}
        <div className="flex flex-col gap-4">

          {/* Focus Hour */}
          <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-3">
              ⬡ Focus Hour
            </div>
            {focusTask ? (
              <div className="flex items-center gap-3 bg-[#0F2A50] rounded-lg px-4 py-3 border-l-4 border-[#C8922A]">
                <Checkbox
                  checked={focusTask.is_done}
                  onChange={() => toggleTask(focusTask.id, focusTask.is_done)}
                />
                <span className={`text-sm font-medium ${focusTask.is_done ? 'line-through text-[#3A5070]' : 'text-[#F4F0E8]'}`}>
                  {focusTask.title}
                </span>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  className="flex-1 bg-transparent border-b border-[#1E3550] px-1 py-1.5 text-[#7A91B0] text-sm outline-none placeholder:text-[#3A5070]"
                  placeholder="What is your most important task today?"
                  value={newFocus}
                  onChange={e => setNewFocus(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddFocus()}
                />
                {newFocus && (
                  <button onClick={handleAddFocus}
                    className="border border-[#C8922A] text-[#C8922A] text-xs px-3 py-1 rounded-md cursor-pointer bg-transparent">
                    Set
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Project Tasks */}
          <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase">
                ◆ Project Tasks
              </div>
              <span className="text-[#3A5070] text-xs">{projectTasks.length}/3</span>
            </div>

            {projectTasks.length === 0 && projectBacklog.length === 0 && (
              <div className="text-[#3A5070] text-sm italic py-2">
                No project tasks yet — add tasks to your projects first
              </div>
            )}

            {/* Today's selected project tasks */}
            {projectTasks.map((t, i) => (
              <div key={t.id}
                className={`flex items-start gap-3 py-2 ${i < projectTasks.length - 1 ? 'border-b border-[#1E3550]' : ''}`}>
                <Checkbox
                  checked={t.is_done}
                  onChange={() => toggleTask(t.id, t.is_done)}
                />
                <div>
                  <div className={`text-sm ${t.is_done ? 'line-through text-[#3A5070]' : 'text-[#F4F0E8]'}`}>
                    {t.title}
                  </div>
                  {t.projects && (
                    <div className="text-[#3A5070] text-xs mt-0.5">↳ {t.projects.title}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Backlog picker — only show if under 3 and backlog exists */}
            {projectTasks.length < 3 && projectBacklog.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1E3550]">
                <div className="text-[#3A5070] text-xs mb-2">
                  Pick from your project backlog:
                </div>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8922A] transition-colors"
                    style={{ color: selectedBacklogTask ? '#F4F0E8' : '#3A5070' }}
                    value={selectedBacklogTask}
                    onChange={e => setSelectedBacklogTask(e.target.value)}>
                    <option value="">Select a task...</option>
                    {projectBacklog.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.projects?.title} → {t.title}
                      </option>
                    ))}
                  </select>
                  {selectedBacklogTask && (
                    <button
                      onClick={handleAddProjectTask}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-black cursor-pointer flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Other Tasks */}
          <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-3">
              ◎ Other Tasks
            </div>
            {otherTasks.length === 0 && (
              <div className="text-[#3A5070] text-sm italic py-2">No other tasks yet</div>
            )}
            {otherTasks.map((t, i) => (
              <div key={t.id}
                className={`flex items-center gap-3 py-2 ${i < otherTasks.length - 1 ? 'border-b border-[#1E3550]' : ''}`}>
                <Checkbox
                  checked={t.is_done}
                  onChange={() => toggleTask(t.id, t.is_done)}
                />
                <span className={`text-sm ${t.is_done ? 'line-through text-[#3A5070]' : 'text-[#F4F0E8]'}`}>
                  {t.title}
                </span>
              </div>
            ))}
            <div className="flex gap-2 items-center mt-3">
              <input
                className="flex-1 bg-transparent border-b border-[#1E3550] px-1 py-1.5 text-[#7A91B0] text-sm outline-none placeholder:text-[#3A5070]"
                placeholder="+ Add a task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              />
              {newTask && (
                <button onClick={handleAddTask}
                  className="border border-[#C8922A] text-[#C8922A] text-xs px-3 py-1 rounded-md cursor-pointer bg-transparent">
                  Add
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">

          {/* Habits */}
          <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
            <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-3">
              ◐ Daily Habits
            </div>
            {habits.length === 0 && (
              <div className="text-[#3A5070] text-sm italic py-2">
                No habits set up yet — add them in Settings
              </div>
            )}
            {habits.map((h, i) => {
              const log = habitLogs.find(l => l.habit_id === h.id)
              const done = log?.is_done || false
              return (
                <div key={h.id}
                  className={`flex items-center gap-3 py-2 ${i < habits.length - 1 ? 'border-b border-[#1E3550]' : ''}`}>
                  <Checkbox
                    checked={done}
                    onChange={() => toggleHabit(h.id, done)}
                    color="green"
                  />
                  <span className={`text-sm ${done ? 'line-through text-[#3A5070]' : 'text-[#F4F0E8]'}`}>
                    {h.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Won The Day */}
          <div
            onClick={() => !checklist?.won_the_day && focusDone && winTheDay()}
            className={`bg-[#0D1929] border rounded-xl p-6 text-center transition-all duration-300
              ${checklist?.won_the_day ? 'border-green-700 bg-green-950/30' : 'border-[#1E3550]'}
              ${focusDone && !checklist?.won_the_day ? 'cursor-pointer hover:border-[#C8922A]' : 'cursor-not-allowed opacity-50'}
            `}>
            <div className="text-3xl mb-2">{checklist?.won_the_day ? '🏆' : '◻'}</div>
            <div className={`text-lg font-bold mb-1 ${checklist?.won_the_day ? 'text-green-400' : 'text-[#7A91B0]'}`}>
              {checklist?.won_the_day ? 'You Won The Day!' : 'I Won The Day'}
            </div>
            <div className="text-[#3A5070] text-xs">
              {checklist?.won_the_day
                ? 'Day logged — great work.'
                : focusDone
                  ? 'Click to close out your day'
                  : 'Complete your focus task first'}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Checkbox({ checked, onChange, color = 'gold' }) {
  const colors = {
    gold:  { border: '#1E3550', checked: '#C8922A' },
    green: { border: '#1E3550', checked: '#1A8A5A' },
  }
  const c = colors[color]
  return (
    <div
      onClick={onChange}
      className="w-4 h-4 min-w-[16px] rounded cursor-pointer flex items-center justify-center text-[10px] text-black font-bold transition-all duration-200"
      style={{
        border: `2px solid ${checked ? c.checked : c.border}`,
        background: checked ? c.checked : 'transparent'
      }}>
      {checked && '✓'}
    </div>
  )
}