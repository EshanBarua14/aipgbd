export default function Industries({ db }) {
  const niches = db.industries || [];
  return (
    <section id="industries" className="section industries">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Industries</span></div>
          <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)'}}>Who we solve<br /><span className="grad-text">problems for.</span></h2>
        </div>
        <div className="industries__grid">
          {niches.map((n,i)=>(
            <div key={n.id||i} className={`industry-card glow-card reveal reveal-delay-${(i%3)+1}`} data-hover>
              <div style={{fontSize:'2rem'}}>{n.icon}</div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:'1.1rem',color:'var(--text-primary)'}}>{n.title}</h3>
              <div>
                <span className="t-label" style={{color:'var(--text-tertiary)',display:'block',marginBottom:'0.3rem'}}>The Pain</span>
                <p style={{fontSize:'0.82rem',lineHeight:1.6,color:'var(--text-secondary)'}}>{n.pain}</p>
              </div>
              <div>
                <span className="t-label" style={{color:'var(--cyan)',display:'block',marginBottom:'0.3rem'}}>Our Fix</span>
                <p style={{fontSize:'0.82rem',lineHeight:1.6,color:'var(--text-primary)'}}>{n.roi}</p>
              </div>
              <a href="#contact" className="t-label" style={{color:'var(--cyan)',marginTop:'auto',transition:'letter-spacing 0.2s'}} data-hover>Get a Demo →</a>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .industries__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        .industry-card{padding:2rem;display:flex;flex-direction:column;gap:1rem}
        @media(max-width:900px){.industries__grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.industries__grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
