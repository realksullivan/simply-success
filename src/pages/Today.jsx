import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useChecklist } from '../hooks/useChecklist'

export default function Today() {
  const { checklist, tasks, habits, habitLogs, loading, toggleTask, addTask, toggleHabit, winTheDay } = useChecklist()
  const [newTask, setNewTask] = useState('')
  const [newFocus, setNewFocus] = useState('')
  const handleAddFocus = async () => {
   if (!newFocus.trim()) return
   await addTask(newFocus.trim(), 'focus')
   setNewFocus('')
   }
  const focusTask = tasks.find(t => t.type === 'focus')
  const projectTasks = tasks.filter(t => t.type === 'project')
  const otherTasks = tasks.filter(t => t.type === 'other')
  const focusDone = focusTask?.is_done

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    await addTask(newTask.trim(), 'other')
    setNewTask('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return (
    <div style={{ ...s.page, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#C8922A', fontSize: 16 }}>Loading your day...</div>
    </div>
  )

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.headerSub}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={s.headerTitle}>Today's Checklist</div>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>

      <div style={s.grid}>

        {/* Left Column */}
        <div style={s.col}>

          {/* Focus Hour */}
          <div style={s.card}>
            <div style={s.sectionLabel}>⬡ Focus Hour</div>
           {focusTask ? (
  <div style={s.focusRow}>
    <div onClick={() => toggleTask(focusTask.id, focusTask.is_done)} style={{ ...s.checkbox, ...(focusTask.is_done ? s.checkboxDone : {}) }}>
      {focusTask.is_done && '✓'}
    </div>
    <span style={{ ...s.focusText, ...(focusTask.is_done ? s.strikethrough : {}) }}>
      {focusTask.title}
    </span>
  </div>
) : (
  <div style={s.addRow}>
    <input
      style={s.addInput}
      placeholder="What is your most important task today?"
      value={newFocus}
      onChange={e => setNewFocus(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleAddFocus()}
    />
    {newFocus && <button style={s.addBtn} onClick={handleAddFocus}>Set</button>}
  </div>
)}
          </div>

          {/* Project Tasks */}
          <div style={s.card}>
            <div style={s.sectionLabel}>◆ Project Tasks</div>
            {projectTasks.length === 0 && <div style={s.empty}>No project tasks yet</div>}
            {projectTasks.map(t => (
              <div key={t.id} style={s.taskRow}>
                <div onClick={() => toggleTask(t.id, t.is_done)} style={{ ...s.checkbox, ...(t.is_done ? s.checkboxDone : {}) }}>
                  {t.is_done && '✓'}
                </div>
                <div>
                  <div style={{ ...s.taskText, ...(t.is_done ? s.strikethrough : {}) }}>{t.title}</div>
                  {t.projects && <div style={s.taskTag}>↳ {t.projects.title}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Other Tasks */}
          <div style={s.card}>
            <div style={s.sectionLabel}>◎ Other Tasks</div>
            {otherTasks.map(t => (
              <div key={t.id} style={s.taskRow}>
                <div onClick={() => toggleTask(t.id, t.is_done)} style={{ ...s.checkbox, ...(t.is_done ? s.checkboxDone : {}) }}>
                  {t.is_done && '✓'}
                </div>
                <span style={{ ...s.taskText, ...(t.is_done ? s.strikethrough : {}) }}>{t.title}</span>
              </div>
            ))}
            {/* Add task */}
            <div style={s.addRow}>
              <input
                style={s.addInput}
                placeholder="+ Add a task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              />
              {newTask && (
                <button style={s.addBtn} onClick={handleAddTask}>Add</button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={s.col}>

          {/* Habits */}
          <div style={s.card}>
            <div style={s.sectionLabel}>◐ Daily Habits</div>
            {habits.length === 0 && (
              <div style={s.empty}>No habits set up yet — add them in Settings</div>
            )}
            {habits.map(h => {
              const log = habitLogs.find(l => l.habit_id === h.id)
              const done = log?.is_done || false
              return (
                <div key={h.id} style={s.taskRow}>
                  <div onClick={() => toggleHabit(h.id, done)}
                    style={{ ...s.checkbox, ...(done ? s.checkboxGreen : {}) }}>
                    {done && '✓'}
                  </div>
                  <span style={{ ...s.taskText, ...(done ? s.strikethrough : {}) }}>{h.title}</span>
                </div>
              )
            })}
          </div>

          {/* Won The Day */}
          <div
            onClick={() => !checklist?.won_the_day && focusDone && winTheDay()}
            style={{
              ...s.card, ...s.winCard,
              ...(checklist?.won_the_day ? s.winCardDone : {}),
              cursor: focusDone ? 'pointer' : 'not-allowed',
              opacity: !focusDone && !checklist?.won_the_day ? 0.5 : 1,
            }}>
            <div style={s.winIcon}>{checklist?.won_the_day ? '🏆' : '◻'}</div>
            <div style={{ ...s.winTitle, ...(checklist?.won_the_day ? { color: '#34D399' } : {}) }}>
              {checklist?.won_the_day ? 'You Won The Day!' : 'I Won The Day'}
            </div>
            <div style={s.winSub}>
              {checklist?.won_the_day
                ? 'Day logged — great work.'
                : focusDone ? 'Click to close out your day' : 'Complete your focus task first'}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh',width: '100vw', background: '#08101E', fontFamily: "'DM Sans', sans-serif", padding: '32px 36px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  headerSub: { color: '#7A91B0', fontSize: 13, marginBottom: 4 },
  headerTitle: { color: '#F4F0E8', fontSize: 26, fontWeight: 700 },
  logoutBtn: { background: 'transparent', border: '1px solid #1E3550', borderRadius: 8,
    color: '#7A91B0', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' },
  grid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 },
  col: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#0D1929', border: '1px solid #1E3550', borderRadius: 12, padding: 20 },
  sectionLabel: { color: '#C8922A', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: 14 },
  focusRow: { display: 'flex', alignItems: 'center', gap: 12, background: '#0F2A50',
    borderRadius: 8, padding: '12px 16px', borderLeft: '3px solid #C8922A' },
  focusText: { color: '#F4F0E8', fontSize: 15, fontWeight: 500 },
  taskRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0',
    borderBottom: '1px solid #1E3550' },
  taskText: { color: '#F4F0E8', fontSize: 13 },
  taskTag: { color: '#3A5070', fontSize: 11, marginTop: 2 },
  checkbox: { width: 18, height: 18, minWidth: 18, border: '2px solid #1E3550', borderRadius: 4,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, color: '#0A0A0A', marginTop: 1, transition: 'all 0.2s' },
  checkboxDone: { background: '#C8922A', borderColor: '#C8922A' },
  checkboxGreen: { background: '#1A8A5A', borderColor: '#1A8A5A' },
  strikethrough: { textDecoration: 'line-through', color: '#3A5070' },
  addRow: { display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' },
  addInput: { flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #1E3550',
    padding: '6px 4px', color: '#7A91B0', fontSize: 13, fontFamily: 'inherit', outline: 'none' },
  addBtn: { background: 'transparent', border: '1px solid #C8922A', borderRadius: 6,
    color: '#C8922A', fontSize: 12, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' },
  empty: { color: '#3A5070', fontSize: 13, fontStyle: 'italic', padding: '8px 0' },
  winCard: { textAlign: 'center', padding: 24, transition: 'all 0.3s' },
  winCardDone: { background: '#0A2A1A', borderColor: '#1A8A5A' },
  winIcon: { fontSize: 28, marginBottom: 8 },
  winTitle: { color: '#7A91B0', fontSize: 18, fontWeight: 700, marginBottom: 4 },
  winSub: { color: '#3A5070', fontSize: 12 },
}