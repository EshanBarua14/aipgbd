export default function Footer({ db }) {
  const s = db?.site || {};
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__top-inner">
          <div className="footer__brand">
            <img src={s.logoUrl || '/logo.png'} alt={s.name} className="footer__logo"
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div className="footer__name">{s.name || 'AI Playground BD'}</div>
              <div className="footer__tagline t-label" style={{ color: 'var(--text-tertiary)' }}>
                {s.tagline || 'AI-Engineered · Human-Directed'}
              </div>
            </div>
          </div>

          <div className="footer__links-grid">
            <div className="footer__col">
              <div className="footer__col-title t-label">Services</div>
              {(db.packages || []).map(p => (
                <a key={p.id} href="#services" className="footer__link">{p.title}</a>
              ))}
            </div>
            <div className="footer__col">
              <div className="footer__col-title t-label">Platform</div>
              <a href="#portal" className="footer__link">Client Portal</a>
              <a href="#roadmap" className="footer__link">Revenue Roadmap</a>
              <a href="#tech" className="footer__link">Tech Stack</a>
              <a href="#industries" className="footer__link">Industries</a>
            </div>
            <div className="footer__col">
              <div className="footer__col-title t-label">Connect</div>
              {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" className="footer__link">Facebook</a>}
              {s.youtube && <a href={s.youtube} target="_blank" rel="noreferrer" className="footer__link">YouTube</a>}
              {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" className="footer__link">Instagram</a>}
              {s.email && <a href={`mailto:${s.email}`} className="footer__link">Email</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="footer__status-bar">
        <div className="container footer__status-inner">
          <div className="footer__phase">
            <div className="footer__phase-dot" />
            <span className="t-label footer__phase-label">PHASE 1: ACTIVE</span>
          </div>
          <div className="footer__status-divider" />
          <span className="t-label" style={{ color: 'var(--text-tertiary)', fontSize: '0.6rem' }}>
            Gemini · Grok · Suno · ElevenLabs · Claude
          </span>
          <div className="footer__status-divider" />
          <span className="t-label" style={{ color: 'var(--text-tertiary)', fontSize: '0.6rem' }}>
            Real Estate Entry · Month 1 Target: ৳2,25,000
          </span>
        </div>
      </div>

      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <span className="t-label" style={{ color: 'var(--text-tertiary)', fontSize: '0.58rem' }}>
            © 2026 {s.name || 'AI Playground BD'} · Dhaka, Bangladesh
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,var(--cyan-border),var(--purple-border),transparent)' }} />
          <span className="t-label" style={{ color: 'var(--text-tertiary)', fontSize: '0.58rem' }}>
            Built with AI. Delivered by humans.
          </span>
        </div>
      </div>

      <style>{`
        .footer { border-top: 1px solid var(--border); }
        .footer__top { padding: 4rem 0; }
        .footer__top-inner { display: flex; gap: 4rem; align-items: flex-start; flex-wrap: wrap; }
        .footer__brand { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
        .footer__logo { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--cyan-border); }
        .footer__name { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .footer__links-grid { display: flex; gap: 3rem; flex-wrap: wrap; margin-left: auto; }
        .footer__col { display: flex; flex-direction: column; gap: 0.6rem; }
        .footer__col-title { color: var(--text-tertiary); margin-bottom: 0.25rem; }
        .footer__link { font-size: 0.82rem; color: var(--text-secondary); transition: color 0.2s; }
        .footer__link:hover { color: var(--cyan); }

        .footer__status-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--bg-2);
          padding: 0.75rem 0;
        }
        .footer__status-inner {
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
        }
        .footer__phase { display: flex; align-items: center; gap: 0.5rem; }
        .footer__phase-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
          animation: phasePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes phasePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .footer__phase-label { color: var(--cyan); font-size: 0.62rem; }
        .footer__status-divider { width: 1px; height: 14px; background: var(--border-strong); }

        .footer__bar { padding: 1.25rem 0; }
        .footer__bar-inner { display: flex; align-items: center; gap: 1.5rem; }

        @media (max-width: 600px) {
          .footer__status-divider { display: none; }
          .footer__status-inner { gap: 0.75rem; }
        }
      `}</style>
    </footer>
  );
}
