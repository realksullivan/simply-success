import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TESTIMONIALS = [
  {
    quote: 'I\'ve tried every productivity app out there. WinForge is the first one that actually changed my behavior.',
    name: 'James R.',
    role: 'Founder, SaaS startup',
  },
  {
    quote: 'The evening reflection alone is worth it. I\'ve learned more about myself in 30 days than in the past year.',
    name: 'Sarah K.',
    role: 'Marketing Director',
  },
  {
    quote: 'My win rate went from 40% to 78% in 6 weeks. The data doesn\'t lie.',
    name: 'Marcus T.',
    role: 'Executive Coach',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'translateY(0)'
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: '#08101E', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#F4F0E8', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-in.delay-1 { transition-delay: 0.1s; }
        .fade-in.delay-2 { transition-delay: 0.2s; }
        .fade-in.delay-3 { transition-delay: 0.3s; }
        .fade-in.delay-4 { transition-delay: 0.4s; }
        .gold-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .gold-btn { transition: opacity 0.2s, transform 0.2s; }
        .ghost-btn:hover { border-color: #C8922A; color: #C8922A; }
        .ghost-btn { transition: border-color 0.2s, color 0.2s; }
        .nav-link:hover { color: #C8922A; }
        .nav-link { transition: color 0.2s; }
        .system-card:hover { border-color: #2A4A72; transform: translateY(-2px); }
        .system-card { transition: border-color 0.2s, transform 0.25s; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(200,146,42,0.3); } 50% { box-shadow: 0 0 0 12px rgba(200,146,42,0); } }
        .float { animation: float 4s ease-in-out infinite; }
        .pulse-gold { animation: pulse-gold 2s ease-in-out infinite; }
        .grain { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); z-index: 999; }
        .connector-line { position: absolute; top: 50%; left: 100%; width: 40px; height: 2px; background: linear-gradient(90deg, #C8922A44, transparent); }
      `}</style>

      <div className="grain" />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,16,30,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1E3550',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: 'black',
            background: 'linear-gradient(135deg, #C8922A, #7A5010)',
          }}>W</div>
          <div style={{ color: '#F4F0E8', fontSize: 16, fontWeight: 700 }}>WinForge</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[['The System', '#system'], ['How It Works', '#how-it-works'], ['Pricing', '#pricing']].map(([l, href]) => (
            <a key={l} href={href}
              className="nav-link"
              style={{ color: '#7A91B0', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
              {l}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} className="ghost-btn"
            style={{ background: 'transparent', border: '1px solid #1E3550', color: '#7A91B0', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/login')} className="gold-btn pulse-gold"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)', border: 'none', color: 'black', fontWeight: 700, padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Start Free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(200,146,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-in" style={{ marginBottom: 16 }}>
          <span style={{ display: 'inline-block', background: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.3)', color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 20 }}>
            Your Daily Execution System
          </span>
        </div>

        <h1 className="fade-in delay-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 400, lineHeight: 1.05, margin: '0 auto 24px', maxWidth: 800 }}>
          Stop Losing Days.
          <br />
          <span style={{ color: '#C8922A', fontStyle: 'italic' }}>Start Forging Wins.</span>
        </h1>

        <p className="fade-in delay-2" style={{ fontSize: 18, color: '#7A91B0', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px', fontWeight: 400 }}>
          WinForge connects your annual goals to your daily actions — so every task you complete is a step toward something that actually matters.
        </p>

        <div className="fade-in delay-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 64, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} className="gold-btn"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)', border: 'none', color: 'black', fontWeight: 700, padding: '14px 32px', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            Start Forging Free →
          </button>
          <button className="ghost-btn"
            style={{ background: 'transparent', border: '1px solid #1E3550', color: '#7A91B0', padding: '14px 32px', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => document.getElementById('system').scrollIntoView({ behavior: 'smooth' })}>
            See How It Works
          </button>
        </div>

        {/* App Preview */}
        <div className="fade-in delay-4 float" style={{ maxWidth: 760, margin: '0 auto', background: '#0D1929', border: '1px solid #1E3550', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,146,42,0.1)' }}>
          <div style={{ background: '#0A1525', borderBottom: '1px solid #1E3550', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C43030' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4840A' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1A8A5A' }} />
            <div style={{ flex: 1, marginLeft: 8, background: '#132035', borderRadius: 4, padding: '3px 12px', fontSize: 11, color: '#3A5070', textAlign: 'left' }}>
              winforge.app
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: 360 }}>
            <div style={{ borderRight: '1px solid #1E3550', padding: '20px 12px' }}>
              <div style={{ marginBottom: 20, padding: '0 8px' }}>
                <div style={{ color: '#C8922A', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>MONDAY</div>
                <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 700, fontFamily: 'Georgia, serif' }}>Feb 28</div>
              </div>
              {[
                { icon: '◆', label: 'Today', active: true },
                { icon: '◎', label: 'Goals', active: false },
                { icon: '◈', label: 'Projects', active: false },
                { icon: '◐', label: 'Reflect', active: false },
                { icon: '⬡', label: 'Insights', active: false },
              ].map(n => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, marginBottom: 2, background: n.active ? 'rgba(200,146,42,0.1)' : 'transparent', borderLeft: n.active ? '2px solid #C8922A' : '2px solid transparent' }}>
                  <span style={{ color: n.active ? '#C8922A' : '#3A5070', fontSize: 12 }}>{n.icon}</span>
                  <span style={{ color: n.active ? '#F4F0E8' : '#7A91B0', fontSize: 12, fontWeight: n.active ? 600 : 400 }}>{n.label}</span>
                </div>
              ))}
              <div style={{ margin: '16px 8px 0', background: '#132035', borderRadius: 8, padding: 10 }}>
                <div style={{ color: '#3A5070', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Win Streak</div>
                <div style={{ color: '#C8922A', fontSize: 22, fontWeight: 700, fontFamily: 'Georgia, serif' }}>12 🔥</div>
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ color: '#F4F0E8', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Today's Checklist</div>
              <div style={{ background: '#132035', borderRadius: 10, padding: 12, marginBottom: 10, borderLeft: '3px solid #C8922A' }}>
                <div style={{ color: '#C8922A', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>⬡ Focus Hour</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: '#C8922A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'black', fontWeight: 700 }}>✓</div>
                  <span style={{ color: '#7A91B0', fontSize: 12, textDecoration: 'line-through' }}>Ship the analytics dashboard</span>
                </div>
              </div>
              <div style={{ background: '#0A1525', border: '1px solid #1E3550', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ color: '#C8922A', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>◆ Project Tasks</div>
                {[
                  { done: true, title: 'Set up Stripe webhook', project: 'MVP Launch' },
                  { done: false, title: 'Write onboarding copy', project: 'Marketing' },
                  { done: false, title: 'Build landing page', project: 'MVP Launch' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingBottom: 6, marginBottom: 6, borderBottom: i < 2 ? '1px solid #1E3550' : 'none' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, marginTop: 1, flexShrink: 0, background: t.done ? '#C8922A' : 'transparent', border: `1.5px solid ${t.done ? '#C8922A' : '#1E3550'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'black', fontWeight: 700 }}>{t.done && '✓'}</div>
                    <div>
                      <div style={{ color: t.done ? '#3A5070' : '#F4F0E8', fontSize: 11, textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                      <div style={{ color: '#3A5070', fontSize: 10 }}>↳ {t.project}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(26,138,90,0.1)', border: '1px solid rgba(26,138,90,0.3)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🏆</span>
                <span style={{ color: '#1A8A5A', fontSize: 12, fontWeight: 600 }}>You Won The Day!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="fade-in" style={{ borderTop: '1px solid #1E3550', borderBottom: '1px solid #1E3550', padding: '32px 40px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
        {[
          { value: '78%', label: 'Average win rate' },
          { value: '12x', label: 'More consistent habits' },
          { value: '4.8★', label: 'User satisfaction' },
          { value: '90 days', label: 'To forge new habits' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ color: '#C8922A', fontSize: 32, fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
            <div style={{ color: '#3A5070', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ─── THE SYSTEM ─── */}
      <section id="system" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>

        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The WinForge System</div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: '0 auto 16px', maxWidth: 640 }}>
            Every action connects to a goal
          </h2>
          <p style={{ color: '#7A91B0', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Most productivity tools help you manage tasks. WinForge helps you win. Here's how the system works.
          </p>
        </div>

        {/* Goals → Projects → Tasks flow */}
        <div className="fade-in" style={{ marginBottom: 80 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>
            The Hierarchy
          </div>

          {/* Flow diagram */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, maxWidth: 900, margin: '0 auto', position: 'relative' }}>

            {/* Goals */}
            <div style={{ flex: 1, background: '#0D1929', border: '1px solid #1E3550', borderRadius: '16px 0 0 16px', padding: '32px 28px', borderRight: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'rgba(200,146,42,0.15)', marginBottom: 16 }}>
                <span style={{ color: '#C8922A', fontSize: 20 }}>◎</span>
              </div>
              <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Annual Goals</div>
              <div style={{ color: '#F4F0E8', fontSize: 17, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>Where you're headed</div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Set up to 5 big goals for the year. These are your north stars — the outcomes that actually matter. Everything else in WinForge exists to serve these.
              </div>
              <div style={{ background: '#08101E', border: '1px solid #1E3550', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ color: '#3A5070', fontSize: 10, marginBottom: 6 }}>Example goal</div>
                <div style={{ color: '#F4F0E8', fontSize: 12 }}>Launch SaaS and reach $5k MRR</div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#0D1929', borderTop: '1px solid #1E3550', borderBottom: '1px solid #1E3550', padding: '0 4px' }}>
              <div style={{ color: '#C8922A', fontSize: 20, opacity: 0.5 }}>→</div>
            </div>

            {/* Projects */}
            <div style={{ flex: 1, background: '#0D1929', border: '1px solid #1E3550', padding: '32px 28px', borderLeft: 'none', borderRight: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'rgba(80,128,208,0.15)', marginBottom: 16 }}>
                <span style={{ color: '#5080D0', fontSize: 20 }}>◈</span>
              </div>
              <div style={{ color: '#5080D0', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Quarterly Projects</div>
              <div style={{ color: '#F4F0E8', fontSize: 17, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>How you'll get there</div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Break each goal into 90-day projects. A project is a focused sprint with a clear deliverable. Each project has a backlog of tasks you want to complete.
              </div>
              <div style={{ background: '#08101E', border: '1px solid #1E3550', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ color: '#3A5070', fontSize: 10, marginBottom: 6 }}>Example project · Q1 2026</div>
                <div style={{ color: '#F4F0E8', fontSize: 12 }}>Build MVP and launch beta</div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#0D1929', borderTop: '1px solid #1E3550', borderBottom: '1px solid #1E3550', padding: '0 4px' }}>
              <div style={{ color: '#C8922A', fontSize: 20, opacity: 0.5 }}>→</div>
            </div>

            {/* Tasks */}
            <div style={{ flex: 1, background: '#0D1929', border: '1px solid #1E3550', borderRadius: '0 16px 16px 0', padding: '32px 28px', borderLeft: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'rgba(26,138,90,0.15)', marginBottom: 16 }}>
                <span style={{ color: '#1A8A5A', fontSize: 20 }}>✓</span>
              </div>
              <div style={{ color: '#1A8A5A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Daily Tasks</div>
              <div style={{ color: '#F4F0E8', fontSize: 17, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>What you do today</div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Each morning, pull up to 3 tasks from your project backlog into Today's checklist. Complete them to advance your projects — and your goals.
              </div>
              <div style={{ background: '#08101E', border: '1px solid #1E3550', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ color: '#3A5070', fontSize: 10, marginBottom: 6 }}>Example task · today</div>
                <div style={{ color: '#F4F0E8', fontSize: 12 }}>Set up Stripe payment flow</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: '#3A5070', fontSize: 13 }}>
              Goal progress updates automatically as you complete tasks.
            </span>
          </div>
        </div>

        {/* Daily Checklist: Focus Hour, Habits, Win The Day */}
        <div className="fade-in" style={{ marginBottom: 16 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>
            Today's Checklist
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

            {/* Focus Hour */}
            <div className="system-card" style={{ background: '#0D1929', border: '1px solid #1E3550', borderTop: '3px solid #C8922A', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,146,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#C8922A', flexShrink: 0 }}>⬡</div>
                <div>
                  <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Focus Hour</div>
                  <div style={{ color: '#F4F0E8', fontSize: 16, fontWeight: 600 }}>One task. Full attention.</div>
                </div>
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Every morning, you set <strong style={{ color: '#F4F0E8' }}>one most-important task</strong> for the day — your Focus Hour. It's highlighted at the top of your checklist, separate from everything else.
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Completing your Focus Hour task is what <strong style={{ color: '#F4F0E8' }}>unlocks "Won The Day"</strong>. This one choice forces you to identify and protect what actually matters.
              </div>
              <div style={{ background: '#132035', border: '1px solid #1E3550', borderLeft: '3px solid #C8922A', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: '#C8922A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'black', fontWeight: 700 }}>✓</div>
                <span style={{ color: '#7A91B0', fontSize: 12, textDecoration: 'line-through' }}>Ship the analytics dashboard</span>
              </div>
            </div>

            {/* Daily Habits */}
            <div className="system-card" style={{ background: '#0D1929', border: '1px solid #1E3550', borderTop: '3px solid #1A8A5A', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(26,138,90,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#1A8A5A', flexShrink: 0 }}>◐</div>
                <div>
                  <div style={{ color: '#1A8A5A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Daily Habits</div>
                  <div style={{ color: '#F4F0E8', fontSize: 16, fontWeight: 600 }}>The reps that compound.</div>
                </div>
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Set up to 5 daily habits — the non-negotiables that build long-term success. Meditation, exercise, reading, journaling. They live on your daily checklist every single day.
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Your Analytics page tracks <strong style={{ color: '#F4F0E8' }}>completion rate per habit</strong> over time. You can see exactly which habits are sticking and which ones aren't.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Morning meditation', 'Exercise / workout', 'Deep reading 30 min'].map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: i < 2 ? '#1A8A5A' : 'transparent', border: `1.5px solid ${i < 2 ? '#1A8A5A' : '#1E3550'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700, flexShrink: 0 }}>{i < 2 && '✓'}</div>
                    <span style={{ color: i < 2 ? '#3A5070' : '#F4F0E8', fontSize: 12, textDecoration: i < 2 ? 'line-through' : 'none' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Won The Day */}
            <div className="system-card" style={{ background: '#0D1929', border: '1px solid #1E3550', borderTop: '3px solid #D4840A', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,132,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏆</div>
                <div>
                  <div style={{ color: '#D4840A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Won The Day</div>
                  <div style={{ color: '#F4F0E8', fontSize: 16, fontWeight: 600 }}>Your daily verdict.</div>
                </div>
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Once you complete your Focus Hour task, you can declare <strong style={{ color: '#F4F0E8' }}>"I Won The Day"</strong>. It's your daily close-out — a conscious decision that today was a win.
              </div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                Each win is logged. Your <strong style={{ color: '#F4F0E8' }}>Win Rate</strong> and <strong style={{ color: '#F4F0E8' }}>Win Streak</strong> are tracked in Analytics — the scoreboard that keeps you honest over time.
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, background: '#132035', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#C8922A', fontSize: 22, fontWeight: 700, fontFamily: 'Georgia, serif' }}>78%</div>
                  <div style={{ color: '#3A5070', fontSize: 10, marginTop: 2 }}>Win Rate</div>
                </div>
                <div style={{ flex: 1, background: '#132035', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#C8922A', fontSize: 22, fontWeight: 700, fontFamily: 'Georgia, serif' }}>12🔥</div>
                  <div style={{ color: '#3A5070', fontSize: 10, marginTop: 2 }}>Day Streak</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works — 3 steps */}
      <section id="how-it-works" style={{ padding: '80px 40px', background: '#0D1929', borderTop: '1px solid #1E3550', borderBottom: '1px solid #1E3550' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Your Daily Rhythm</div>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: 0 }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {[
              {
                step: '01',
                time: 'Morning',
                title: 'Set Your Day',
                description: 'Open WinForge and set your Focus Hour task — the one thing that makes today a win. Then pull up to 3 project tasks from your backlog.',
                color: '#C8922A',
              },
              {
                step: '02',
                time: 'During the Day',
                title: 'Forge Your Wins',
                description: 'Work through your checklist. Complete your Focus Hour. Check off habits as you do them. Every completed task advances a project, which advances a goal.',
                color: '#5080D0',
              },
              {
                step: '03',
                time: 'Evening',
                title: 'Close It Out',
                description: 'Click "Won The Day" to log your win. Then spend 5 minutes on your evening reflection — what you learned, what you\'re proud of, what you\'ll do differently.',
                color: '#1A8A5A',
              },
            ].map((step, i) => (
              <div key={i} className={`fade-in delay-${i + 1}`} style={{ position: 'relative', padding: '32px 28px', background: '#08101E', border: '1px solid #1E3550', borderRadius: 16 }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: 'rgba(200,146,42,0.06)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16 }}>{step.step}</div>
                <div style={{ color: step.color, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{step.time}</div>
                <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>{step.title}</div>
                <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.8 }}>{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: 0 }}>What People Are Saying</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`fade-in delay-${i + 1}`} style={{ background: '#0D1929', border: '1px solid #1E3550', borderRadius: 14, padding: '28px 24px' }}>
                <div style={{ color: '#C8922A', fontSize: 36, lineHeight: 1, marginBottom: 12, fontFamily: 'Georgia, serif' }}>"</div>
                <div style={{ color: '#F4F0E8', fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>{t.quote}</div>
                <div style={{ borderTop: '1px solid #1E3550', paddingTop: 16 }}>
                  <div style={{ color: '#F4F0E8', fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: '#3A5070', fontSize: 12, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: '0 0 16px' }}>Simple, Honest Pricing</h2>
          <p style={{ color: '#7A91B0', fontSize: 15, margin: 0 }}>Start free. Upgrade when you're ready.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
          <div className="fade-in delay-1" style={{ background: '#0D1929', border: '1px solid #1E3550', borderRadius: 16, padding: '36px 32px' }}>
            <div style={{ color: '#7A91B0', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Free</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#F4F0E8', fontFamily: 'Georgia, serif', marginBottom: 4 }}>$0</div>
            <div style={{ color: '#3A5070', fontSize: 13, marginBottom: 32 }}>Forever free</div>
            {['1 annual goal', 'Up to 3 daily habits', 'Daily checklist', 'Focus Hour', 'Won The Day tracking', 'Evening reflection', '30 days history'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(200,146,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#C8922A', fontWeight: 700, flexShrink: 0 }}>✓</div>
                <span style={{ color: '#7A91B0', fontSize: 13 }}>{f}</span>
              </div>
            ))}
            <button onClick={() => navigate('/login')} className="ghost-btn"
              style={{ width: '100%', marginTop: 24, background: 'transparent', border: '1px solid #1E3550', color: '#7A91B0', padding: '12px', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              Get Started Free
            </button>
          </div>

          <div className="fade-in delay-2" style={{ background: '#0D1929', border: '2px solid #C8922A', borderRadius: 16, padding: '36px 32px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #C8922A, #A87020)', color: 'black', fontSize: 10, fontWeight: 700, padding: '4px 16px', borderRadius: 20, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most Popular</div>
            <div style={{ color: '#C8922A', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: '#F4F0E8', fontFamily: 'Georgia, serif' }}>$9</span>
              <span style={{ color: '#3A5070', fontSize: 14 }}>/month</span>
            </div>
            <div style={{ color: '#3A5070', fontSize: 13, marginBottom: 32 }}>or $79/year — save 26%</div>
            {['Unlimited annual goals', 'Unlimited daily habits', 'Full analytics dashboard', 'Habit heatmap calendar', 'Unlimited history', 'PDF data export', 'Weekly email summary', 'Priority support'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(200,146,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#C8922A', fontWeight: 700, flexShrink: 0 }}>✓</div>
                <span style={{ color: '#F4F0E8', fontSize: 13 }}>{f}</span>
              </div>
            ))}
            <button onClick={() => navigate('/login')} className="gold-btn"
              style={{ width: '100%', marginTop: 24, background: 'linear-gradient(135deg, #C8922A, #A87020)', border: 'none', color: 'black', fontWeight: 700, padding: '13px', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Start Pro Free Trial →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="fade-in" style={{ padding: '100px 40px', textAlign: 'center', borderTop: '1px solid #1E3550', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(200,146,42,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, margin: '0 auto 20px', maxWidth: 600 }}>
          Your best days are <span style={{ color: '#C8922A', fontStyle: 'italic' }}>ahead of you.</span>
        </h2>
        <p style={{ color: '#7A91B0', fontSize: 16, maxWidth: 420, margin: '0 auto 40px' }}>
          Join thousands of people who start each morning with intention and end each evening with pride.
        </p>
        <button onClick={() => navigate('/login')} className="gold-btn"
          style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)', border: 'none', color: 'black', fontWeight: 700, padding: '16px 40px', borderRadius: 12, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
          Start Forging Your Wins →
        </button>
        <div style={{ color: '#3A5070', fontSize: 12, marginTop: 16 }}>Free to start. No credit card required.</div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1E3550', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: 'black', background: 'linear-gradient(135deg, #C8922A, #7A5010)' }}>W</div>
          <span style={{ color: '#7A91B0', fontSize: 13 }}>© 2026 WinForge</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
            <a key={l} href="#" className="nav-link" style={{ color: '#3A5070', fontSize: 12, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}