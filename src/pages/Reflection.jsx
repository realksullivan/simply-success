import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const PROMPTS = [
  { key: 'proud',     icon: '✦', label: 'What am I proud of today?',             color: '#C8922A' },
  { key: 'progress',  icon: '◈', label: 'Where did I make the most progress?',   color: '#5080D0' },
  { key: 'learned',   icon: '◎', label: 'What did I learn?',                     color: '#1A8A5A' },
  { key: 'different', icon: '◐', label: 'What will I do differently tomorrow?',  color: '#D4840A' },
  { key: 'grateful',  icon: '♡', label: 'What am I grateful for?',               color: '#A060C0' },
]

export default function Reflection() {
  const [answers, setAnswers] = useState({ proud: '', progress: '', learned: '', different: '', grateful: '' })
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState([])
  const [view, setView] = useState('today') // 'today' | 'history'
  const saveTimer = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchReflection()
    fetchHistory()
  }, [])

  const fetchReflection = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    // Get or create today's checklist
    let { data: cl } = await supabase
      .from('checklists')
      .select('*')
      .eq('date', today)
      .eq('user_id', user.id)
      .single()

    if (!cl) {
      const { data: created } = await supabase
        .from('checklists')
        .insert({ user_id: user.id, date: today })
        .select()
        .single()
      cl = created
    }

    setChecklist(cl)

    // Get existing reflection
    const { data: reflection } = await supabase
      .from('reflections')
      .select('*')
      .eq('checklist_id', cl.id)
      .single()

    if (reflection) {
      setAnswers({
        proud:     reflection.proud     || '',
        progress:  reflection.progress  || '',
        learned:   reflection.learned   || '',
        different: reflection.different || '',
        grateful:  reflection.grateful  || '',
      })
    }

    setLoading(false)
  }

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('checklists')
      .select('*, reflections(*)')
      .eq('user_id', user.id)
      .not('reflections', 'is', null)
      .order('date', { ascending: false })
      .limit(30)

    setHistory(data?.filter(d => d.reflections?.length > 0) || [])
  }

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
    setSaved(false)

    // Debounced auto-save
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveReflection({ ...answers, [key]: value }), 1000)
  }

  const saveReflection = async (data) => {
    if (!checklist) return

    const { data: existing } = await supabase
      .from('reflections')
      .select('id')
      .eq('checklist_id', checklist.id)
      .single()

    if (existing) {
      await supabase
        .from('reflections')
        .update({ ...data, updated_at: new Date() })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('reflections')
        .insert({ checklist_id: checklist.id, ...data })
    }

    setSaved(true)
  }

  const handleSave = () => {
    clearTimeout(saveTimer.current)
    saveReflection(answers)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#08101E] flex items-center justify-center">
      <div className="text-[#C8922A]">Loading reflection...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08101E] px-4 py-8 md:px-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#7A91B0] text-sm mb-1">Evening Reflection</div>
          <div className="text-[#F4F0E8] text-2xl md:text-3xl font-bold">End of Day Journal</div>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-xs">✓ Saved</span>
          )}
          <span className="text-[#3A5070] text-xs">
            🌙 {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 bg-[#0D1929] border border-[#1E3550] rounded-lg p-1 mb-6 w-fit">
        {['today', 'history'].map(t => (
          <button key={t} onClick={() => setView(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer capitalize
              ${view === t ? 'bg-[#132035] text-[#F4F0E8]' : 'text-[#7A91B0] bg-transparent'}`}>
            {t === 'today' ? "Today's Reflection" : 'Past Reflections'}
          </button>
        ))}
      </div>

      {view === 'today' ? (
        <div className="max-w-2xl flex flex-col gap-4">
          {PROMPTS.map((p, i) => (
            <div key={p.key}
              className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5"
              style={{ borderLeft: `3px solid ${p.color}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: p.color }} className="text-lg">{p.icon}</span>
                <div className="text-[#F4F0E8] text-sm font-medium">{p.label}</div>
              </div>
              <textarea
                className="w-full bg-[#08101E] border border-[#1E3550] rounded-lg px-3 py-2.5 text-[#F4F0E8] text-sm outline-none focus:border-[#2A4A72] transition-colors resize-none"
                rows={3}
                placeholder="Write your reflection here..."
                value={answers[p.key]}
                onChange={e => handleChange(p.key, e.target.value)}
              />
            </div>
          ))}

          <div className="flex items-center gap-4 mt-2">
            <button onClick={handleSave}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-black cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)' }}>
              Save Reflection
            </button>
            <span className="text-[#3A5070] text-xs">Auto-saves as you type</span>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="bg-[#0D1929] border border-dashed border-[#1E3550] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">◐</div>
              <div className="text-[#F4F0E8] text-lg font-semibold mb-2">No past reflections yet</div>
              <div className="text-[#7A91B0] text-sm">Complete today's reflection to start building your history</div>
            </div>
          ) : (
            history.map(entry => {
              const r = entry.reflections?.[0]
              if (!r) return null
              return (
                <div key={entry.id} className="bg-[#0D1929] border border-[#1E3550] rounded-xl p-5">
                  <div className="text-[#C8922A] text-xs font-bold tracking-widest uppercase mb-4">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {entry.won_the_day && <span className="ml-3 text-green-400">🏆 Won The Day</span>}
                  </div>
                  <div className="flex flex-col gap-3">
                    {PROMPTS.map(p => r[p.key] ? (
                      <div key={p.key}>
                        <div className="text-xs mb-1" style={{ color: p.color }}>{p.icon} {p.label}</div>
                        <div className="text-[#7A91B0] text-sm leading-relaxed">{r[p.key]}</div>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}