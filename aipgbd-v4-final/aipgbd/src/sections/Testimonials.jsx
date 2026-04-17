export default function Testimonials({ db }) {
  const items = db.testimonials || [];
  if (!items.length) return null;
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Testimonials</span></div>
          <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)'}}>What clients<br /><span className="grad-text">actually say.</span></h2>
        </div>
        <div className="test-grid">
          {items.map((t,i)=>(
            <div key={t.id||i} className={`test-card glow-card reveal reveal-delay-${i%3+1}`} data-hover>
              <div className="test-card__top">
                <div className="test-stars">{[...Array(5)].map((_,si)=><span key={si} style={{color:si<(t.stars||5)?'#F59E0B':'var(--border-strong)',fontSize:'0.9rem'}}>★</span>)}</div>
                {t.result && <div className="test-result">{t.result}</div>}
              </div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-author">
                <div className="test-author-avatar">{t.name?.[0]}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:'0.88rem',color:'var(--text-primary)'}}>{t.name}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-tertiary)'}}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
        .test-card{padding:2rem;display:flex;flex-direction:column;gap:1.25rem}
        .test-card__top{display:flex;justify-content:space-between;align-items:center}
        .test-stars{display:flex;gap:1px}
        .test-result{font-family:'JetBrains Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan);background:var(--cyan-dim);border:1px solid var(--cyan-border);border-radius:100px;padding:0.2rem 0.6rem}
        .test-quote{font-size:0.88rem;line-height:1.8;color:var(--text-secondary);font-style:italic;flex:1}
        .test-author{display:flex;align-items:center;gap:0.75rem}
        .test-author-avatar{width:36px;height:36px;border-radius:50%;background:var(--grad-cyan-purple);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.88rem;color:#fff;flex-shrink:0}
        @media(max-width:900px){.test-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.test-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
