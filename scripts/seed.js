import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://riaobxtygvmklfcnjhqc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYW9ieHR5Z3Zta2xmY25qaHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTM4ODgsImV4cCI6MjA4NzI4OTg4OH0.3BSd96__RiKeEyGZiAhXZCenI6jyK60G6OpIcM4Cje4'
)

const EMAIL    = 'ksull10@hotmail.com'
const PASSWORD = '10Goirishgo!'

const GOALS = [
  'Launch Simply Success to 100 paying customers',
  'Achieve peak physical health — lose 20lbs',
  'Read 24 books this year',
  'Build 6 months financial runway',
  'Be fully present with family every evening',
]

const PROJECTS = [
  { title: 'MVP Product Launch',      quarter: 'Q1 2026', goalIndex: 0 },
  { title: 'Marketing & Growth',      quarter: 'Q1 2026', goalIndex: 0 },
  { title: 'Health & Fitness Plan',   quarter: 'Q1 2026', goalIndex: 1 },
  { title: 'Reading System',          quarter: 'Q1 2026', goalIndex: 2 },
  { title: 'Revenue & Savings Plan',  quarter: 'Q1 2026', goalIndex: 3 },
]

const PROJECT_TASKS = {
  'MVP Product Launch': [
    'Build authentication flow',
    'Set up Supabase database schema',
    'Build Today dashboard',
    'Build Goals page',
    'Build Projects page',
    'Build Reflection journal',
    'Build Analytics dashboard',
    'Build Settings page',
    'Add Stripe payments',
    'Deploy to Vercel',
    'Write privacy policy',
    'Set up error monitoring',
  ],
  'Marketing & Growth': [
    'Build landing page',
    'Set up email list',
    'Write 3 blog posts',
    'Create Twitter presence',
    'Launch on Product Hunt',
    'Reach out to 20 beta users',
    'Set up analytics tracking',
  ],
  'Health & Fitness Plan': [
    'Set up gym membership',
    'Create workout schedule',
    'Meal prep Sunday routine',
    'Track calories for 30 days',
    'Run 5k without stopping',
    'Do 30 consecutive pushups',
  ],
  'Reading System': [
    'Build reading list of 24 books',
    'Set daily reading time block',
    'Create book notes template',
    'Read Atomic Habits',
    'Read Deep Work',
    'Read The Lean Startup',
    'Read Zero to One',
  ],
  'Revenue & Savings Plan': [
    'Review and cut subscriptions',
    'Set up automatic savings',
    'Build revenue projection model',
    'Research passive income streams',
    'Meet with financial advisor',
  ],
}

const HABITS = [
  'Morning meditation (10 min)',
  'Deep reading (30 min)',
  'Exercise / workout',
  'No social media before 10am',
  'Review annual goals',
  'Drink 8 glasses of water',
]

const FOCUS_TASKS = [
  'Finish authentication module',
  'Write technical spec for payments',
  'Review and merge outstanding PRs',
  'Prepare investor update',
  'Complete user interview synthesis',
  'Draft partnership proposal',
  'Fix critical bug in onboarding',
  'Write landing page copy',
  'Design new dashboard wireframes',
  'Audit analytics setup',
  'Review monthly expenses',
  'Write weekly team update',
]

const OTHER_TASKS = [
  'Reply to investor emails',
  'Schedule team standup',
  'Update CRM with new leads',
  'Book flights for conference',
  'Clear email inbox',
  'Update LinkedIn profile',
  'Send follow-up to prospects',
  'Review contract from legal',
  'Order office supplies',
  'Update product roadmap doc',
]

const REFLECTIONS = {
  proud: [
    'Stayed focused and finished the roadmap ahead of schedule.',
    'Kept my morning routine even though the day was hectic.',
    'Had a really productive deep work session.',
    'Helped a team member work through a tough problem.',
    'Shipped a feature I have been putting off for weeks.',
  ],
  progress: [
    'Made real headway on the onboarding flow redesign.',
    'Finally got the analytics dashboard working properly.',
    'Closed two new leads in the pipeline.',
    'Cleared a big chunk of tech debt.',
    'Made solid progress on the investor deck.',
  ],
  learned: [
    'Async communication saves so much meeting time.',
    'Breaking big tasks into smaller chunks reduces anxiety.',
    'User feedback is more valuable than assumptions.',
    'Rest is part of the work, not separate from it.',
    'Saying no to small things protects time for big ones.',
  ],
  different: [
    'Start the day with the hardest task, not email.',
    'Block focus time before anything else.',
    'Write down the three things I want done by noon.',
    'Take a proper lunch break instead of eating at the desk.',
    'Review my goals before planning tomorrow.',
  ],
  grateful: [
    'A team that cares about the mission.',
    'Good health and energy today.',
    'Family dinner without distractions.',
    'A quiet morning to think clearly.',
    'Progress that is visible and measurable.',
  ],
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const chance = (pct) => Math.random() < pct

async function clearOldData(user) {
  console.log('🧹 Clearing old data...')
  const { data: checklists } = await supabase
    .from('checklists')
    .select('id')
    .eq('user_id', user.id)

  if (checklists?.length) {
    const ids = checklists.map(c => c.id)
    await supabase.from('reflections').delete().in('checklist_id', ids)
    await supabase.from('habit_logs').delete().in('checklist_id', ids)
    await supabase.from('tasks').delete().in('checklist_id', ids)
    await supabase.from('checklists').delete().in('id', ids)
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id)

  if (projects?.length) {
    const ids = projects.map(p => p.id)
    await supabase.from('project_tasks').delete().in('project_id', ids)
    await supabase.from('projects').delete().in('id', ids)
  }

  await supabase.from('goals').delete().eq('user_id', user.id)
  await supabase.from('habits').delete().eq('user_id', user.id)
  console.log('✓ Old data cleared')
}

async function seed() {
  console.log('🔐 Signing in...')
  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  })

  if (authError) { console.error('Auth failed:', authError.message); return }
  const user = session.user
  console.log('✓ Signed in as', user.email)

  await clearOldData(user)

  // ── Goals ──────────────────────────────────────────────
  console.log('\n📌 Creating goals...')
  const { data: goalData } = await supabase
    .from('goals')
    .insert(GOALS.map(title => ({ title, user_id: user.id, progress: 0 })))
    .select()
  console.log(`✓ ${goalData.length} goals created`)

  // ── Projects + Project Tasks ───────────────────────────
  console.log('\n📁 Creating projects and tasks...')
  const projectData = []

  for (const p of PROJECTS) {
    const { data: project } = await supabase
      .from('projects')
      .insert({
        title: p.title,
        quarter: p.quarter,
        goal_id: goalData[p.goalIndex].id,
        user_id: user.id,
        progress: 0,
      })
      .select()
      .single()

    projectData.push(project)

    // Add project tasks
    const taskTitles = PROJECT_TASKS[p.title] || []
    const taskInserts = taskTitles.map((title, i) => {
      const done = chance(0.55)
      return {
        project_id: project.id,
        title,
        sort_order: i,
        is_done: done,
        completed_at: done ? new Date() : null,
      }
    })

    if (taskInserts.length > 0) {
      await supabase.from('project_tasks').insert(taskInserts)
    }

    // Update project progress
    const done = taskInserts.filter(t => t.is_done).length
    const pct = taskInserts.length > 0 ? Math.round((done / taskInserts.length) * 100) : 0
    await supabase.from('projects').update({ progress: pct }).eq('id', project.id)

    process.stdout.write(`  ✓ ${p.title} (${pct}% complete)\n`)
  }

  // ── Habits ─────────────────────────────────────────────
  console.log('\n💪 Creating habits...')
  const { data: habitData } = await supabase
    .from('habits')
    .insert(HABITS.map((title, i) => ({ title, user_id: user.id, sort_order: i })))
    .select()
  console.log(`✓ ${habitData.length} habits created`)

  // ── 90 Days of Checklists ──────────────────────────────
  console.log('\n📅 Creating 90 days of checklist data...')
  let totalTasks = 0
  let totalLogs = 0
  let totalReflections = 0
  let wonDays = 0

  // Get incomplete project tasks for use as today's project tasks
  const { data: allProjectTasks } = await supabase
    .from('project_tasks')
    .select('*, projects(title)')
    .in('project_id', projectData.map(p => p.id))

  for (let i = 89; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    // Skip ~15% of days
    if (chance(0.05)) continue

    const wonTheDay = chance(0.72)

    const { data: cl } = await supabase
      .from('checklists')
      .insert({
        user_id: user.id,
        date: dateStr,
        won_the_day: wonTheDay,
        won_at: wonTheDay ? date.toISOString() : null
      })
      .select()
      .single()

    if (!cl) continue
    if (wonTheDay) wonDays++

    // Focus task
    const focusDone = wonTheDay || chance(0.8)
    await supabase.from('tasks').insert({
      checklist_id: cl.id,
      title: pick(FOCUS_TASKS),
      type: 'focus',
      is_done: focusDone,
      completed_at: focusDone ? date.toISOString() : null,
      sort_order: 0,
    })
    totalTasks++

    // Project tasks — pick 1-3 from project backlog
    const numProjectTasks = rand(1, 3)
    const shuffled = [...(allProjectTasks || [])].sort(() => Math.random() - 0.5)
    for (let j = 0; j < Math.min(numProjectTasks, shuffled.length); j++) {
      const pt = shuffled[j]
      const done = chance(0.65)
      await supabase.from('tasks').insert({
        checklist_id: cl.id,
        project_id: pt.project_id,
        title: pt.title,
        type: 'project',
        is_done: done,
        completed_at: done ? date.toISOString() : null,
        sort_order: j + 1,
      })
      totalTasks++
    }

    // Other tasks
    const numOtherTasks = rand(2, 4)
    for (let j = 0; j < numOtherTasks; j++) {
      const done = chance(0.6)
      await supabase.from('tasks').insert({
        checklist_id: cl.id,
        title: pick(OTHER_TASKS),
        type: 'other',
        is_done: done,
        completed_at: done ? date.toISOString() : null,
        sort_order: j + 4,
      })
      totalTasks++
    }

    // Habit logs
    for (const habit of habitData) {
      const rate = habit.title.includes('meditation') ? 0.85
        : habit.title.includes('reading') ? 0.80
        : habit.title.includes('Exercise') ? 0.70
        : habit.title.includes('social') ? 0.60
        : habit.title.includes('water') ? 0.75
        : 0.72
      const done = chance(rate)
      await supabase.from('habit_logs').insert({
        checklist_id: cl.id,
        habit_id: habit.id,
        is_done: done,
      })
      totalLogs++
    }

    // Reflection (70% of days)
    if (chance(0.70)) {
      await supabase.from('reflections').insert({
        checklist_id: cl.id,
        proud:     pick(REFLECTIONS.proud),
        progress:  pick(REFLECTIONS.progress),
        learned:   pick(REFLECTIONS.learned),
        different: pick(REFLECTIONS.different),
        grateful:  pick(REFLECTIONS.grateful),
      })
      totalReflections++
    }

    process.stdout.write(`\r  Day ${90 - i}/90 complete...`)
  }

  console.log('\n')
  console.log('✅ Seed complete!')
  console.log(`   📌 Goals:          ${goalData.length}`)
  console.log(`   📁 Projects:       ${projectData.length}`)
  console.log(`   💪 Habits:         ${habitData.length}`)
  console.log(`   📅 Days created:   ~${wonDays + Math.round(wonDays * 0.3)}`)
  console.log(`   🏆 Days won:       ${wonDays}`)
  console.log(`   ✓  Tasks:          ${totalTasks}`)
  console.log(`   💪 Habit logs:     ${totalLogs}`)
  console.log(`   ◐  Reflections:    ${totalReflections}`)
}

seed()