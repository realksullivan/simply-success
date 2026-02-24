import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useChecklist() {
  const [checklist, setChecklist] = useState(null)
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [habitLogs, setHabitLogs] = useState([])
  const [projects, setProjects] = useState([])
  const [projectBacklog, setProjectBacklog] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

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

    // Load project task backlog (undone tasks from all active projects)
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
    loading, toggleTask, addTask, toggleHabit, winTheDay
  }
}