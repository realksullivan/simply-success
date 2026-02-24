import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(30)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [range])

  const fetchStats = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const since = new Date()
    since.setDate(since.getDate() - range)
    const sinceStr = since.toISOString().split('T')[0]

    const { data: checklists } = await supabase
      .from('checklists')
      .select('*, tasks(*), habit_logs(*)')
      .eq('user_id', user.id)
      .gte('date', sinceStr)
      .order('date', { ascending: true })

    const { data: habits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)

    const { data: projects } = await supabase
      .from('projects')
      .select('*, tasks(*)')
      .eq('user_id', user.id)

    if (!checklists) { setLoading(false); return }

    // Win rate
    const totalDays = checklists.length
    const wonDays = checklists.filter(c => c.won_the_day).length
    const winRate = totalDays > 0 ? Math.round((wonDays / totalDays) * 100) : 0

    // Win streak
    let streak = 0
    const sorted = [...checklists].sort((a, b) => new Date(b.date) - new Date(a.date))
    for (const c of sorted) {
      if (c.won_the_day) streak++
      else break
    }

    // Habit stats
    const habitStats = (habits || []).map(h => {
      const logs = checklists.flatMap(c => c.habit_logs || []).filter(l => l.habit_id === h.id)
      const done = logs.filter(l => l.is_done).length
      const rate = logs.length > 0 ? Math.round((done / logs.length) * 100) : 0
      return { ...h, rate, done, total: logs.length }
    })

    // Task completion
    const allTasks = checklists.flatMap(c => c.tasks || [])
    const completedTasks = allTasks.filter(t => t.is_done).length

    // Daily wins for chart
    const dailyWins = checklists.map(c => ({
      date: c.date,
      won: c.won_the_day,
      tasks: (c.tasks || []).filter(t => t.is_done).length,
    }))

    // Build log map for heatmap: date -> habit_id -> is_done
    const logMap = {}
    checklists.forEach(c => {
      logMap[c.date] = {}
      ;(c.habit_logs || []).forEach(l => {
        logMap[c.date][l.habit_id] = l.is_done
      })
    })

    // Build full date array for heatmap
    const dates = []
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }

    setStats({
      winRate, wonDays, totalDays, streak,
      habitStats, completedTasks, totalTasks: allTasks.length,
      dailyWins, projects: projects || [],
      habits: habits || [],
      logMap, dates,
    })
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#C8922A]">Loading insights...</div>
    </div>
  )

  if (!stats) return null

  // Group dates into weeks for heatmap
  const weeks = []
  let week = []
  stats.dates.forEach((date, i) => {
    week.push(date)
    if (week.length === 7 || i === stats.dates.length - 1) {
      weeks.push(week)
      week = []
    }
  })

  const getHeatColor = (date, habitId) => {
    if (!stats.logMap[date]) return '#132035'
    if (stats.logMap[date][habitId] === true) return '#1A8A5A'
    if (stats.logMap[date][habitId] === false) return '#C43030'
    return '#132035'
  }

  return (
    <div className="px-4 py-8 md:px-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#7A91B0] text-sm mb-1">Analytics</div>
          <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">Insights</div>
        </div>
        <div className="flex gap-1 bg-[#0D1929] border border-[#1E3550] rounded-lg p-1">
          {[7, 30, 90].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer
                ${range === r ? 'bg-[#132035] text-[#F4F0E8]' : 'text-[#7A91B0] bg-transparent'}`}>
              {r}D
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Win Rate',        value: `${stats.winRate}%`,               color: '#C8922A' },
          { label: 'Days Won',        value: `${stats.wonDays}/${stats.totalDays}`, color: '#1A8A5A' },
          { label: 'Current Streak',  value: `${stats.streak}d`,                color: '#D4840A' },
          { label: 'Tasks Completed', value: stats.completedTasks,              color: '#5080D0' },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-4">
            <div className="text-[#3A5070] text-xs uppercase tracking-widest mb-2">{s.label}</div>
            <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Win Rate Chart */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Won The Day — Last {range} Days
          </div>
          {stats.dailyWins.length === 0 ? (
            <div className="text-[#3A5070] text-sm italic">No data yet</div>
          ) : (
            <>
              <div className="flex items-end gap-1 h-24 mb-2">
                {stats.dailyWins.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full rounded-sm transition-all duration-300"
                      style={{
                        height: d.won ? '100%' : `${Math.max(15, (d.tasks / 5) * 40)}%`,
                        background: d.won ? 'linear-gradient(180deg, #C8922A, #C8922A66)' : '#132035',
                        minHeight: 4,
                      }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="text-[#3A5070] text-xs">
                  {new Date(stats.dailyWins[0]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-[#3A5070] text-xs">Today</span>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#C8922A]" />
                  <span className="text-[#3A5070] text-xs">Won</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#132035]" />
                  <span className="text-[#3A5070] text-xs">Not won</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Habit Completion Rates */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Habit Completion Rates
          </div>
          {stats.habitStats.length === 0 ? (
            <div className="text-[#3A5070] text-sm italic">No habits set up yet</div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.habitStats.sort((a, b) => b.rate - a.rate).map(h => {
                const color = h.rate >= 75 ? '#1A8A5A' : h.rate >= 50 ? '#D4840A' : '#C43030'
                return (
                  <div key={h.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[#F4F0E8] text-sm">{h.title}</span>
                      <span className="text-sm font-semibold" style={{ color }}>{h.rate}%</span>
                    </div>
                    <div className="h-1.5 bg-[#132035] rounded-full">
                      <div className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${h.rate}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
              <div className="flex gap-4 mt-1">
                {[
                  { color: '#C43030', label: 'Under 50%' },
                  { color: '#D4840A', label: '50–75%' },
                  { color: '#1A8A5A', label: 'Over 75%' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-[#3A5070] text-xs">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Progress */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Project Progress
          </div>
          {stats.projects.length === 0 ? (
            <div className="text-[#3A5070] text-sm italic">No active projects</div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.projects.map((p, i) => {
                const colors = ['#C8922A', '#5080D0', '#1A8A5A', '#A060C0']
                const color = colors[i % colors.length]
                const tasks = p.tasks || []
                const done = tasks.filter(t => t.is_done).length
                const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
                return (
                  <div key={p.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[#F4F0E8] text-sm">{p.title}</span>
                      <span className="text-sm font-semibold" style={{ color }}>{done}/{tasks.length} tasks</span>
                    </div>
                    <div className="h-1.5 bg-[#132035] rounded-full">
                      <div className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Period Summary */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
            Period Summary
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Days tracked',    value: stats.totalDays },
              { label: 'Days won',        value: stats.wonDays },
              { label: 'Tasks completed', value: stats.completedTasks },
              { label: 'Tasks total',     value: stats.totalTasks },
              { label: 'Current streak',  value: `${stats.streak} days` },
              { label: 'Habits tracked',  value: stats.habitStats.length },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#1E3550]">
                <span className="text-[#7A91B0] text-sm">{item.label}</span>
                <span className="text-[#F4F0E8] text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Heatmap — full width */}
        <div className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5 lg:col-span-2">
          <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-6">
            Habit Heatmap — Last {range} Days
          </div>

          {stats.habits.length === 0 ? (
            <div className="text-[#3A5070] text-sm italic">No habits set up yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 600 }}>
                {stats.habits.map(habit => (
                  <div key={habit.id} className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#F4F0E8] text-xs font-medium">{habit.title}</span>
                      <span className="text-[#3A5070] text-xs">
                        {(() => {
                          const logs = Object.values(stats.logMap).map(d => d[habit.id])
                          const done = logs.filter(l => l === true).length
                          const total = logs.filter(l => l !== undefined).length
                          return total > 0 ? `${Math.round((done / total) * 100)}% completion` : '0% completion'
                        })()}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                          {week.map(date => {
                            const color = getHeatColor(date, habit.id)
                            const status = !stats.logMap[date] ? 'No data'
                              : stats.logMap[date][habit.id] === true ? '✓ Done'
                              : stats.logMap[date][habit.id] === false ? '✗ Missed'
                              : 'No log'
                            const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            return (
                              <div
                                key={date}
                                onMouseEnter={() => setTooltip({ date: formattedDate, status, color, habitId: habit.id })}
                                onMouseLeave={() => setTooltip(null)}
                                style={{
                                  width: 12, height: 12, borderRadius: 2,
                                  background: color, cursor: 'default',
                                  transition: 'transform 0.1s',
                                  transform: tooltip?.date === formattedDate && tooltip?.habitId === habit.id ? 'scale(1.4)' : 'scale(1)',
                                }}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Tooltip */}
                {tooltip && (
                  <div className="inline-block bg-[#0D1929] border border-[#1E3550] rounded px-2 py-1 text-xs text-[#F4F0E8] mt-2">
                    {tooltip.date} —{' '}
                    <span style={{ color: tooltip.color }}>{tooltip.status}</span>
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#1E3550]">
                  <span className="text-[#3A5070] text-xs">Legend:</span>
                  {[
                    { color: '#1A8A5A', label: 'Completed' },
                    { color: '#C43030', label: 'Missed' },
                    { color: '#132035', label: 'No data' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                      <span className="text-[#3A5070] text-xs">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Month labels */}
                <div className="flex gap-1 mt-2">
                  {weeks.map((week, wi) => (
                    <div key={wi} style={{ width: 12 }} className="text-center">
                      {wi % 4 === 0 && (
                        <span className="text-[#3A5070]" style={{ fontSize: 9 }}>
                          {new Date(week[0] + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}