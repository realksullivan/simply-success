import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useChecklist() {
  const [checklist, setChecklist] = useState(null)
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [habitLogs, setHabitLogs] = useState([])
  const [projects, setProjects] = useState([])
  const [projectBacklog, setProjectBacklog] = useState([])
  const [rolloverTasks, setRolloverTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = yesterdayDate.toISOString().split('T')[0]

  useEffect(() => {
    initChecklist()
  }, [])

  const initChecklist = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    // Get or create today's checklist
    let { data: existing } = await supabase
      .from('checklists')
      .select('*')
      .eq('date', today)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      const { data: created } = await supabase
        .from('checklists')
        .insert({ user_id: user.id, date: today })
        .select()
        .single()
      existing = created
    }

    setChecklist(existing)

    // Load today's tasks
    const { data: taskData } = await supabase
      .from('tasks')
      .select('*, projects(title)')
      .eq('checklist_id', existing.id)
      .order('sort_order')

    setTasks(taskData || [])

    // Load habits
    const { data: habitData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order')

    setHabits(habitData || [])

    // Load habit logs for today
    const { data: logData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('checklist_id', existing.id)

    setHabitLogs(logData || [])

    // Load active projects
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .is('completed_at', null)
      .order('created_at')

    setProjects(projectData || [])

    // Load project backlog
    const projectIds = (projectData || []).map(p => p.id)
    if (projectIds.length > 0) {
      const { data: backlog } = await supabase
        .from('project_tasks')
        .select('*, projects(title)')
        .in('project_id', projectIds)
        .eq('is_done', false)
        .order('sort_order')
      setProjectBacklog(backlog || [])
    } else {
      setProjectBacklog([])
    }

    // Check yesterday for incomplete tasks
    const { data: yesterdayChecklist } = await supabase
      .from('checklists')
      .select('*')
      .eq('date', yesterday)
      .eq('user_id', user.id)
      .single()

    if (yesterdayChecklist) {
      const { data: yesterdayTasks } = await supabase
        .from('tasks')
        .select('*, projects(title)')
        .eq('checklist_id', yesterdayChecklist.id)
        .eq('is_done', false)

      // Only suggest other + project tasks, not focus
      const incomplete = (yesterdayTasks || []).filter(t => t.type !== 'focus')

      // Filter out tasks already rolled over to today
      const todayTitles = (taskData || []).map(t => t.title)
      const notYetRolled = incomplete.filter(t => !todayTitles.includes(t.title))

      setRolloverTasks(notYetRolled)
    }

    setLoading(false)
  }

  const toggleTask = async (taskId, currentDone) => {
    await supabase
      .from('tasks')
      .update({ is_done: !currentDone, completed_at: !currentDone ? new Date() : null })
      .eq('id', taskId)

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, is_done: !currentDone } : t
    ))
  }
  const removeTask = async (taskId) => {
  await supabase.from('tasks').delete().eq('id', taskId)
  setTasks(prev => prev.filter(t => t.id !== taskId))
}

  const addTask = async (title, type = 'other', projectId = null) => {
    const { data } = await supabase
      .from('tasks')
      .insert({
        checklist_id: checklist.id,
        title,
        type,
        project_id: projectId,
        sort_order: tasks.length
      })
      .select('*, projects(title)')
      .single()

    setTasks(prev => [...prev, data])
    return data
  }

  const rolloverSingle = async (task) => {
    await addTask(task.title, task.type, task.project_id)
    setRolloverTasks(prev => prev.filter(t => t.id !== task.id))
  }

  const rolloverAll = async () => {
    for (const task of rolloverTasks) {
      await addTask(task.title, task.type, task.project_id)
    }
    setRolloverTasks([])
  }

  const dismissRollover = () => {
    setRolloverTasks([])
  }

  const toggleHabit = async (habitId, currentDone) => {
    const existing = habitLogs.find(l => l.habit_id === habitId)

    if (existing) {
      await supabase
        .from('habit_logs')
        .update({ is_done: !currentDone })
        .eq('id', existing.id)

      setHabitLogs(prev => prev.map(l =>
        l.habit_id === habitId ? { ...l, is_done: !currentDone } : l
      ))
    } else {
      const { data } = await supabase
        .from('habit_logs')
        .insert({ checklist_id: checklist.id, habit_id: habitId, is_done: true })
        .select()
        .single()

      setHabitLogs(prev => [...prev, data])
    }
  }

  const winTheDay = async () => {
    await supabase
      .from('checklists')
      .update({ won_the_day: true, won_at: new Date() })
      .eq('id', checklist.id)

    setChecklist(prev => ({ ...prev, won_the_day: true }))
  }

  return {
  checklist, tasks, habits, habitLogs, projects, projectBacklog,
  rolloverTasks, loading,
  toggleTask, removeTask, addTask, toggleHabit, winTheDay,
  rolloverSingle, rolloverAll, dismissRollover
}
}