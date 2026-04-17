import React from 'react';
import { PROCESS, NICHES, SITE } from '../data/content';
import { useInView } from '../hooks';

const TICKS = [
  'Engineering the Inevitable','30-Second Long Takes','React 19 + ASP.NET Core 9.0',
  'PostgreSQL + pgvector','Grok Veo Temporal Consistency','Commercial Rights Included',
  'ElevenLabs Voice Identity','Flux.1 Pro Hyper-Real Textures','Suno v4 Brand Anthems',
  'SignalR Real-Time Portal','Client Asset Vault AES-256','Dubai and London Phase 3',
];

export function Ticker() {
  const all = [...TICKS, ...TICKS];
  return (
    <div style={{ borderTop:'1px solid var(--border-dim)', borderBottom:'1px solid var(--border-dim)', padding:'0.8rem 0', overflow:'hidden', zIndex:2, position:'relative' }}>
      <div style={{ display:'flex', animation:'ticker 40s linear infinite', whiteSpace:'nowrap' }}>
        {all.map((t, i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'1rem', padding:'0 2rem', fontFamily:'var(--font-mono)', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', flexShrink:0 }}>
            <span style={{ width:3, height:3, background:'var(--gold)', borderRadius:'50%', display:'inline-block', flexShrink:0 }} />{t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Process() {
  const [ref, v] = useInView();
  return (
    <section id="process" style={{ background:'var(--bg)', borderTop:'1px solid var(--border-dim)', padding:'7rem 0' }}>
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Methodology</div>
          <h2 className="section-title">The 4-Phase<br /><span style={{ color:'var(--gold)' }}>Synthesis.</span></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1px', background:'var(--border-dim)', marginTop:'3.5rem', border:'1px solid var(--border-dim)' }}>
          {PROCESS.map((p, i) => {
            const [r, iv] = useInView();
            return (
              <div key={p.phase} ref={r}
                style={{ padding:'2.4rem 2rem', background:'var(--bg)', position:'relative', overflow:'hidden',
                  opacity: iv ? 1 : 0, transform: iv ? 'none' : 'translateY(18px)',
                  transition:`opacity 0.6s var(--ease-out) ${i*0.1}s, transform 0.6s var(--ease-out) ${i*0.1}s` }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(to right, var(--gold-dim), var(--gold))', transform: iv ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:`transform 0.7s var(--ease-out) ${i*0.1+0.3}s` }} />
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.56rem', letterSpacing:'0.2em', color:'var(--gold)', marginBottom:'0.3rem' }}>Phase {p.phase}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.56rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1.1rem' }}>{p.tool}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, marginBottom:'0.65rem', lineHeight:1.2 }}>{p.title}</h3>
                <p style={{ fontSize:'0.81rem', color:'var(--text-mid)', lineHeight:1.8 }}>{p.desc}</p>
                <div style={{ position:'absolute', bottom:'1.2rem', right:'1.2rem', fontFamily:'var(--font-display)', fontSize:'2.6rem', fontWeight:800, color:'rgba(201,168,76,0.04)', lineHeight:1, userSelect:'none' }}>{p.phase}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Niches() {
  const [ref, v] = useInView();
  return (
    <section id="niches" style={{ background:'var(--bg-1)', padding:'7rem 0', borderTop:'1px solid var(--border-dim)' }}>
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Target Markets</div>
          <h2 className="section-title">Six Markets.<br /><span style={{ color:'var(--gold)' }}>One Foundry.</span></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1px', background:'var(--border-dim)', marginTop:'3.5rem', border:'1px solid var(--border-dim)' }}>
          {NICHES.map((n, i) => {
            const [r, iv] = useInView();
            return (
              <div key={n.title} ref={r}
                style={{ padding:'2rem 1.8rem', background:'var(--bg-1)',
                  opacity: iv ? 1 : 0, transform: iv ? 'none' : 'translateY(18px)',
                  transition:`opacity 0.55s var(--ease-out) ${i*0.07}s, transform 0.55s var(--ease-out) ${i*0.07}s` }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-1)'}
              >
                <div style={{ fontSize:'1.3rem', marginBottom:'0.9rem' }}>{n.icon}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem' }}>{n.title}</h3>
                <p style={{ fontSize:'0.79rem', color:'var(--text-muted)', lineHeight:1.8, marginBottom:'0.9rem' }}>{n.pain}</p>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.62rem', letterSpacing:'0.05em', color:'var(--gold)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
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

export function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--border-dim)', padding:'2.5rem 0', background:'var(--bg)' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1.2rem', marginBottom:'1.2rem' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>
              AI<span style={{ color:'var(--gold)' }}>PG</span>BD
            </div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)' }}>
              Engineering the Inevitable · Digital Foundry · Dhaka
            </div>
          </div>
          <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
            {[
              { label:'Facebook', href:SITE.facebook },
              { label:'YouTube', href:SITE.youtube },
              { label:'API Docs', href:'https://docs.aipgbd.com' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', transition:'color 0.25s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l.label}</a>
            ))}
          </div>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.57rem', color:'var(--text-muted)' }}>© 2026 AI Playground BD · CONFIDENTIAL</span>
        </div>
        {/* System status bar */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', padding:'0.6rem 1rem', border:'1px solid var(--border-dim)', fontFamily:'var(--font-mono)', fontSize:'0.57rem', letterSpacing:'0.12em', color:'var(--text-muted)' }}>
          <span style={{ width:6, height:6, background:'#4CAF50', borderRadius:'50%', display:'inline-block', animation:'pulse 2.2s ease-in-out infinite', boxShadow:'0 0 5px #4CAF5055', flexShrink:0 }} />
          <span>AI SYSTEMS: OPERATIONAL</span>
          <span style={{ color:'var(--border-dim)' }}>|</span>
          <span>DHAKA HQ: ACTIVE</span>
          <span style={{ color:'var(--border-dim)' }}>|</span>
          <span>LATENCY: 14ms</span>
          <span style={{ color:'var(--border-dim)' }}>|</span>
          <span style={{ color:'var(--gold)' }}>UPTIME: 99.97%</span>
          <span style={{ color:'var(--border-dim)' }}>|</span>
          <span style={{ color:'#5DCAA5' }}>PHASE 1: ACTIVE</span>
        </div>
      </div>
    </footer>
  );
}
