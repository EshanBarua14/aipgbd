export default function Services({ db }) {
  const pkgs = db.packages || [];

  const handleGetStarted = (pkg) => {
    const msg = `Hi! I'm interested in ${pkg.title} (৳${pkg.price} ${pkg.currency}). Please share more details.`;
    window.open((db.site?.whatsapp || 'https://wa.me/8801XXXXXXXXX') + `?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const cols = Math.min(pkgs.length, 4);

  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Pricing</span></div>
          <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)',marginBottom:'1rem'}}>
            Fixed packages.<br /><span className="grad-text">No surprises.</span>
          </h2>
          <p className="t-body" style={{maxWidth:'480px',fontSize:'0.9rem'}}>
            Every package includes commercial rights. bKash · Nagad · Bank Transfer. 50% deposit, 50% on delivery.
          </p>
        </div>

        <div className="services__grid" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
          {pkgs.map((pkg, i) => (
            <div
              key={pkg.id||i}
              className={`service-card glow-card reveal reveal-delay-${Math.min(i+1,5)} ${pkg.popular?'service-card--featured':''}`}
              data-hover
            >
              {pkg.popular && (
                <div className="service-card__badge">
                  <span className="t-label">✦ Most Popular</span>
                </div>
              )}
              <div className="service-card__glow-orb"/>
              <div style={{position:'relative',zIndex:1}}>
                <div className="t-label" style={{color:'var(--text-tertiary)',marginBottom:'0.5rem'}}>{pkg.num}</div>
                <h3 className="service-card__title">{pkg.title}</h3>
                <p className="service-card__desc">{pkg.desc}</p>
              </div>
              <div className="service-card__price-row">
                <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:300,fontSize:'1.2rem',color:'var(--cyan)'}}>৳</span>
                  <span className="service-card__amount">{pkg.price}</span>
                </div>
                <span className="t-label" style={{color:'var(--text-tertiary)'}}>{pkg.unit}</span>
              </div>
              <div style={{height:1,background:'linear-gradient(to right,var(--cyan-border),transparent)'}}/>
              <ul className="service-card__features">
                {(pkg.features||[]).map((f,fi)=>(
                  <li key={fi} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.8rem',color:'var(--text-secondary)'}}>
                    <span style={{color:'var(--cyan)',fontSize:'0.7rem',flexShrink:0}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                className={pkg.popular?'btn-primary service-card__btn':'btn-ghost service-card__btn'}
                onClick={()=>handleGetStarted(pkg)}
                data-hover
              >
                <span>Get Started</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="services__note reveal" style={{marginTop:'2.5rem',display:'flex',justifyContent:'center'}}>
          <div className="section-badge">
            <span className="t-label">bKash · Nagad · Bank Transfer · 50% deposit · 50% on delivery</span>
          </div>
        </div>
      </div>

      <style>{`
        .services__grid{display:grid;gap:1.5rem;align-items:start}
        .service-card{padding:2rem;display:flex;flex-direction:column;gap:1.25rem;position:relative;overflow:hidden}
        .service-card--featured{border-color:var(--cyan-border);background:linear-gradient(135deg,rgba(0,229,255,0.05) 0%,rgba(155,89,255,0.05) 100%)}
        .service-card__glow-orb{position:absolute;width:200px;height:200px;background:radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%);top:-50px;right:-50px;border-radius:50%;pointer-events:none}
        .service-card--featured .service-card__glow-orb{background:radial-gradient(circle,rgba(155,89,255,0.15) 0%,transparent 70%)}
        .service-card__badge{display:inline-flex;align-items:center;background:var(--grad-cyan-purple);border-radius:100px;padding:0.25rem 0.75rem;align-self:flex-start}
        .service-card__badge .t-label{color:#fff;font-size:0.58rem}
        .service-card__title{font-family:'Outfit',sans-serif;font-weight:700;font-size:1.35rem;color:var(--text-primary);margin-bottom:0.6rem}
        .service-card__desc{font-size:0.82rem;line-height:1.7;color:var(--text-secondary)}
        .service-card__price-row{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
        .service-card__amount{font-family:'Outfit',sans-serif;font-weight:800;font-size:2.2rem;background:var(--grad-text);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
        .service-card__features{list-style:none;display:flex;flex-direction:column;gap:0.6rem;flex:1}
        .service-card__btn{width:100%;justify-content:center}
        @media(max-width:1100px){.services__grid{grid-template-columns:repeat(2,1fr) !important}}
        @media(max-width:600px){.services__grid{grid-template-columns:1fr !important}}
      `}</style>
    </section>
  );
}
