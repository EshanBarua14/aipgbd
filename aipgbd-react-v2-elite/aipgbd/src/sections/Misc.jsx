import React from 'react';
import { PROCESS, NICHES, SITE } from '../data/content';
import { useInView } from '../hooks';

/* Ticker */
const TICKER_ITEMS = [
  'Architecture of Intent', '30-Second Long Takes', 'Enterprise React + ASP.NET',
  'Commercial Rights Included', '72-Hour Delivery', 'ElevenLabs Voice Identity',
  'Lighthouse 99/100', 'Dhaka Premium AI Studio', 'Suno Brand Anthems',
  'Military-Grade Security', 'AI-Engineered Human-Directed',
];

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.85rem 0', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.2rem', padding: '0 2rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', flexShrink: 0 }}>
            <span style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Process — 4-Phase Synthesis */
export function Process() {
  const [ref, inView] = useInView();
  return (
    <section id="process" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '7rem 0' }}>
      <div className="container">
        <div className={`reveal ${inView ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Methodology</div>
          <h2 className="section-title">
            The 4-Phase<br />
            <span style={{ color: 'var(--gold)' }}>Synthesis.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)', marginTop: '3.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
          {PROCESS.map((phase, i) => {
            const [r, v] = useInView();
            return (
              <div key={phase.phase} ref={r}
                style={{
                  padding: '2.5rem 2rem', background: 'var(--bg)',
                  position: 'relative', overflow: 'hidden',
                  opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)',
                  transition: `opacity 0.65s var(--ease-out) ${i * 0.12}s, transform 0.65s var(--ease-out) ${i * 0.12}s`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, var(--gold-dim), var(--gold))', transform: v ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: `transform 0.8s var(--ease-out) ${i * 0.12 + 0.3}s` }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Phase {phase.phase}</div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>{phase.tool}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.7rem', lineHeight: 1.2 }}>{phase.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.78 }}>{phase.desc}</p>
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: 'rgba(201,168,76,0.05)', lineHeight: 1, userSelect: 'none' }}>{phase.phase}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Niches */
export function Niches() {
  const [ref, inView] = useInView();
  return (
    <section id="niches" style={{ background: 'var(--bg-1)', padding: '7rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className={`reveal ${inView ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Sectors</div>
          <h2 className="section-title">
            We Solve<br />
            <span style={{ color: 'var(--gold)' }}>Specific Problems.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '3.5rem' }}>
          {NICHES.map((n, i) => {
            const [r, v] = useInView();
            return (
              <div key={n.title} ref={r}
                className="glass"
                style={{
                  padding: '2rem', borderRadius: '14px',
                  opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)',
                  transition: `opacity 0.6s var(--ease-out) ${i * 0.08}s, transform 0.6s var(--ease-out) ${i * 0.08}s`,
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{n.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{n.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1rem' }}>{n.pain}</p>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>→</span>{n.roi}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Footer */
export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em' }}>
            AI<span style={{ color: 'var(--gold)' }}>PG</span>BD
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'Facebook', href: SITE.facebook },
              { label: 'YouTube', href: SITE.youtube },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 0.25s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{l.label}</a>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>© 2026 AI Playground BD</span>
        </div>

        {/* Status bar in footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0.7rem 1.2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', background: 'var(--glass)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em' }}>
          <span style={{ width: 6, height: 6, background: '#4CAF50', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', boxShadow: '0 0 6px #4CAF5080' }} />
          <span style={{ color: 'var(--text-mid)' }}>AI SYSTEMS: OPERATIONAL</span>
          <span style={{ color: 'var(--border-dim)' }}>|</span>
          <span style={{ color: 'var(--text-mid)' }}>DHAKA HQ: ACTIVE</span>
          <span style={{ color: 'var(--border-dim)' }}>|</span>
          <span style={{ color: 'var(--text-mid)' }}>LATENCY: 14ms</span>
          <span style={{ color: 'var(--border-dim)' }}>|</span>
          <span style={{ color: 'var(--gold)' }}>UPTIME: 99.97%</span>
        </div>
      </div>
    </footer>
  );
}
