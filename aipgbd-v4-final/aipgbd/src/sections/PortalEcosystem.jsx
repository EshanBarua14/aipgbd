import { useState, useEffect, useRef } from 'react';

const CLIENT_TERMINAL = [
  { delay: 0,    text: '> Connecting to AIPGBD Signal Hub...', color: 'var(--cyan)' },
  { delay: 600,  text: '✓ WebSocket handshake complete', color: '#22C55E' },
  { delay: 1200, text: '> Loading project: Brand Engine — NexaFinance', color: 'var(--text-secondary)' },
  { delay: 1800, text: '> Phase 1/5: Gemini visual anchor — COMPLETE', color: '#22C55E' },
  { delay: 2400, text: '> Phase 2/5: Grok motion extension — RENDERING', color: '#F59E0B' },
  { delay: 3000, text: '  ████████████░░░░░░░░  62%  ETA: 4m 18s', color: 'var(--purple)' },
  { delay: 3600, text: '> Asset Vault: AES-256 encrypted · 3 files ready', color: 'var(--cyan)' },
  { delay: 4200, text: '> Awaiting client review on Frame #847', color: '#E040FB' },
];

const ADMIN_TERMINAL = [
  { delay: 0,    text: '> AIPGBD Pipeline Dashboard v2.1', color: 'var(--cyan)' },
  { delay: 500,  text: '> Active projects: 7  |  Queue: 3  |  Overdue: 0', color: '#22C55E' },
  { delay: 1000, text: '> Lead Score Engine: 12 prospects analysed', color: 'var(--text-secondary)' },
  { delay: 1500, text: '  ↑ NexaFinance: 94/100 — HOT LEAD', color: '#F59E0B' },
  { delay: 2000, text: '  ↑ Bashundhara Dev: 87/100 — WARM', color: '#F59E0B' },
  { delay: 2500, text: '> Prompt Repo: 47 templates  |  3 new today', color: 'var(--cyan)' },
  { delay: 3000, text: '> Revenue MTD: ৳1,85,000 / ৳2,40,000 target', color: '#22C55E' },
  { delay: 3500, text: '> Next delivery: NexaFinance Brand Film — 6h 22m', color: '#E040FB' },
];

function Terminal({ lines, active }) {
  const [shown, setShown] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setShown([]);
    const timers = lines.map((line, i) =>
      setTimeout(() => {
        setShown(prev => [...prev, line]);
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active, lines]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shown]);

  return (
    <div className="portal-terminal">
      <div className="portal-terminal__bar">
        <div className="portal-terminal__dot" style={{ background: '#FF5F57' }} />
        <div className="portal-terminal__dot" style={{ background: '#FEBC2E' }} />
        <div className="portal-terminal__dot" style={{ background: '#28C840' }} />
        <span className="t-label" style={{ color: 'var(--text-tertiary)', marginLeft: '0.75rem', fontSize: '0.6rem' }}>
          aipgbd-terminal — zsh
        </span>
      </div>
      <div className="portal-terminal__body">
        {shown.map((line, i) => (
          <div key={i} className="portal-terminal__line" style={{ color: line.color }}>
            {line.text}
          </div>
        ))}
        {active && shown.length < lines.length && (
          <div className="portal-terminal__cursor" />
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

const CLIENT_FEATURES = [
  { icon: '⚡', title: 'Real-Time Tracking', desc: 'SignalR-powered live project status. Watch your video render frame by frame.' },
  { icon: '🔒', title: 'Asset Vault', desc: 'AES-256 encrypted file delivery. Commercial-ready assets in your secure vault.' },
  { icon: '🎯', title: 'Frame Feedback', desc: 'Frame-accurate video review tool. Mark exactly where you want changes.' },
  { icon: '💬', title: 'Direct Line', desc: 'Dedicated WhatsApp line. No tickets, no bots — your production manager directly.' },
];

const ADMIN_FEATURES = [
  { icon: '📊', title: 'Pipeline Manager', desc: 'Full project pipeline visibility. All active, queued, and delivered projects in one view.' },
  { icon: '🤖', title: 'Prompt Repository', desc: '47 production-tested prompts. Categorised by tool, niche, and output type.' },
  { icon: '📈', title: 'Lead Scoring', desc: 'AI-powered lead scoring engine. Prioritise outreach based on 12-factor analysis.' },
  { icon: '💰', title: 'Revenue Tracker', desc: 'MTD revenue vs targets. Package performance and conversion rate analytics.' },
];

export default function PortalEcosystem() {
  const [tab, setTab] = useState('client');

  return (
    <section id="portal" className="section portal">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Portal Ecosystem</span></div>
          <h2 className="t-heading" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '0.75rem' }}>
            Production infrastructure.<br /><span className="grad-text">Built for both sides.</span>
          </h2>
          <p className="t-body" style={{ maxWidth: '560px', fontSize: '0.9rem' }}>
            A real-time production ecosystem — clients track every frame of their project live,
            while we manage the pipeline, prompts, and leads from a unified dashboard.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="portal__tabs reveal">
          <button
            className={`portal__tab ${tab === 'client' ? 'active' : ''}`}
            onClick={() => setTab('client')} data-hover
          >
            <span className="portal__tab-icon">👤</span>
            <div>
              <div className="portal__tab-title">Client Portal</div>
              <div className="portal__tab-sub t-label">Your project, live</div>
            </div>
          </button>
          <button
            className={`portal__tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => setTab('admin')} data-hover
          >
            <span className="portal__tab-icon">⚡</span>
            <div>
              <div className="portal__tab-title">Admin Dashboard</div>
              <div className="portal__tab-sub t-label">Pipeline command centre</div>
            </div>
          </button>
        </div>

        {/* Panel */}
        <div className="portal__panel glow-card reveal reveal-delay-2">
          <div className="portal__panel-layout">
            {/* Features */}
            <div className="portal__features">
              <h3 className="portal__features-title">
                {tab === 'client' ? 'Client Portal' : 'Admin Dashboard'}
              </h3>
              <div className="portal__feature-list">
                {(tab === 'client' ? CLIENT_FEATURES : ADMIN_FEATURES).map((f, i) => (
                  <div key={i} className="portal__feature">
                    <div className="portal__feature-icon">{f.icon}</div>
                    <div>
                      <div className="portal__feature-name">{f.title}</div>
                      <div className="portal__feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem' }}>
                {tab === 'client' ? (
                  <a href="#contact" className="btn-primary" data-hover>
                    <span>Request Portal Access</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                ) : (
                  <div className="portal__admin-note">
                    <span className="t-label" style={{ color: 'var(--text-tertiary)' }}>🔐 Admin access via secret route</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal */}
            <Terminal
              lines={tab === 'client' ? CLIENT_TERMINAL : ADMIN_TERMINAL}
              active={true}
              key={tab}
            />
          </div>
        </div>
      </div>

      <style>{`
        .portal__tabs {
          display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;
        }
        .portal__tab {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.5rem; background: var(--surface);
          border: 1px solid var(--border); border-radius: 10px;
          cursor: none; transition: all 0.3s; flex: 1; min-width: 200px;
          text-align: left;
        }
        .portal__tab:hover { border-color: var(--cyan-border); }
        .portal__tab.active {
          border-color: var(--cyan-border);
          background: var(--cyan-dim);
          box-shadow: 0 0 20px var(--cyan-dim);
        }
        .portal__tab-icon { font-size: 1.5rem; }
        .portal__tab-title {
          font-family: 'Outfit', sans-serif; font-weight: 700;
          font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.15rem;
        }
        .portal__tab-sub { color: var(--text-tertiary); font-size: 0.6rem; }
        .portal__tab.active .portal__tab-title { color: var(--cyan); }

        .portal__panel { padding: 0; overflow: hidden; }
        .portal__panel-layout {
          display: grid; grid-template-columns: 1fr 1fr;
        }
        .portal__features { padding: 2.5rem; }
        .portal__features-title {
          font-family: 'Outfit', sans-serif; font-weight: 800;
          font-size: 1.25rem; color: var(--text-primary); margin-bottom: 1.5rem;
          background: var(--grad-text); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }
        .portal__feature-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .portal__feature { display: flex; gap: 0.875rem; align-items: flex-start; }
        .portal__feature-icon {
          font-size: 1.2rem; width: 36px; height: 36px;
          background: var(--cyan-dim); border: 1px solid var(--cyan-border);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .portal__feature-name {
          font-family: 'Outfit', sans-serif; font-weight: 600;
          font-size: 0.88rem; color: var(--text-primary); margin-bottom: 0.2rem;
        }
        .portal__feature-desc { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; }
        .portal__admin-note {
          padding: 0.75rem 1rem; background: var(--bg-3);
          border: 1px solid var(--border); border-radius: 6px;
          display: inline-block;
        }

        /* Terminal */
        .portal-terminal {
          background: #0A0F0A; border-left: 1px solid var(--border);
          display: flex; flex-direction: column; min-height: 400px;
        }
        .portal-terminal__bar {
          display: flex; align-items: center; gap: 6px;
          padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03); flex-shrink: 0;
        }
        .portal-terminal__dot { width: 12px; height: 12px; border-radius: 50%; }
        .portal-terminal__body {
          flex: 1; padding: 1.25rem; font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem; line-height: 1.8; overflow-y: auto;
          display: flex; flex-direction: column; gap: 0;
        }
        .portal-terminal__line { white-space: pre; }
        .portal-terminal__cursor {
          width: 8px; height: 16px; background: var(--cyan);
          animation: blink 1s step-end infinite; margin-top: 4px;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        @media (max-width: 900px) {
          .portal__panel-layout { grid-template-columns: 1fr; }
          .portal-terminal { border-left: none; border-top: 1px solid var(--border); min-height: 280px; }
        }
      `}</style>
    </section>
  );
}
