import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    icon: '⬡',
    title: 'Focus Hour',
    description: 'One task. Full attention. The single most important thing you can do today — locked in before anything else.',
    color: '#C8922A',
  },
  {
    icon: '◆',
    title: 'Project Tasks',
    description: 'Pull from your project backlog and work on what actually moves the needle — not just what feels urgent.',
    color: '#5080D0',
  },
  {
    icon: '◐',
    title: 'Daily Habits',
    description: 'Track the non-negotiables that compound over time. Meditate, read, exercise — every single day.',
    color: '#1A8A5A',
  },
  {
    icon: '◎',
    title: 'Evening Reflection',
    description: 'Five guided prompts each evening. What you learned, what you\'re proud of, what you\'ll do differently.',
    color: '#A060C0',
  },
  {
    icon: '◈',
    title: 'Goal Tracking',
    description: 'Set up to 5 annual goals. Break them into quarterly projects. Watch progress calculate automatically.',
    color: '#D4840A',
  },
  {
    icon: '⬡',
    title: 'Win Insights',
    description: 'See your win rate, habit heatmap, and streak data. Know exactly where your days are being won or lost.',
    color: '#C8922A',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set Your Vision',
    description: 'Define up to 5 annual goals. Break each one into quarterly projects with specific tasks.',
  },
  {
    step: '02',
    title: 'Forge Each Day',
    description: 'Every morning, set your focus task, pick 3 project tasks, and check off your daily habits.',
  },
  {
    step: '03',
    title: 'Reflect & Compound',
    description: 'Each evening, answer 5 reflection prompts. Watch your win rate climb week over week.',
  },
]

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
        .feature-card:hover { border-color: #2A4A72; transform: translateY(-2px); }
        .feature-card { transition: border-color 0.2s, transform 0.2s; }
        .nav-link:hover { color: #C8922A; }
        .nav-link { transition: color 0.2s; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(200,146,42,0.3); } 50% { box-shadow: 0 0 0 12px rgba(200,146,42,0); } }
        .float { animation: float 4s ease-in-out infinite; }
        .pulse-gold { animation: pulse-gold 2s ease-in-out infinite; }
        .grain { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); z-index: 999; }
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
          {['Features', 'How It Works', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
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
          WinForge is the daily operating system for high performers.
          Set goals, execute projects, track habits, reflect each evening —
          and measure your win rate over time.
        </p>

        <div className="fade-in delay-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 64, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} className="gold-btn"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A87020)', border: 'none', color: 'black', fontWeight: 700, padding: '14px 32px', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
            Start Forging Free →
          </button>
          <button className="ghost-btn"
            style={{ background: 'transparent', border: '1px solid #1E3550', color: '#7A91B0', padding: '14px 32px', borderRadius: 10, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
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
                <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 700, fontFamily: 'Georgia, serif' }}>Feb 23</div>
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

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '100px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>The System</div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: 0 }}>How It Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className={`fade-in delay-${i + 1}`} style={{ position: 'relative', padding: '32px 28px', background: '#0D1929', border: '1px solid #1E3550', borderRadius: 16 }}>
              <div style={{ fontSize: 64, fontWeight: 700, color: 'rgba(200,146,42,0.08)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16 }}>{step.step}</div>
              <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Step {step.step}</div>
              <div style={{ color: '#F4F0E8', fontSize: 18, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>{step.title}</div>
              <div style={{ color: '#7A91B0', fontSize: 14, lineHeight: 1.7 }}>{step.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ color: '#C8922A', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Everything You Need</div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, margin: 0 }}>Built for Daily Execution</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`fade-in feature-card delay-${(i % 3) + 1}`} style={{ padding: '28px 24px', background: '#0D1929', border: '1px solid #1E3550', borderRadius: 14, borderTop: `3px solid ${f.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 12, color: f.color }}>{f.icon}</div>
              <div style={{ color: '#F4F0E8', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#7A91B0', fontSize: 13, lineHeight: 1.7 }}>{f.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 40px', background: '#0D1929', borderTop: '1px solid #1E3550', borderBottom: '1px solid #1E3550' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: 0 }}>What People Are Saying</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`fade-in delay-${i + 1}`} style={{ background: '#08101E', border: '1px solid #1E3550', borderRadius: 14, padding: '28px 24px' }}>
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
            {['1 annual goal', 'Up to 3 daily habits', 'Daily checklist', 'Evening reflection', '30 days history'].map(f => (
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
        <p style={{ color: '#7A91B0', fontSize: 16, marginBottom: 40, maxWidth: 420, margin: '0 auto 40px' }}>
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