import { useState } from 'react';
export default function Process({ db }) {
  const tools = db.tools || [];
  const [active, setActive] = useState(0);
  return (
    <section id="process" className="section process">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">The Stack</span></div>
          <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)',marginBottom:'0.75rem'}}>
            Five tools.<br /><span className="grad-text">One unbroken take.</span>
          </h2>
        </div>
        <div className="process__layout">
          <div className="process__steps">
            {tools.map((t, i) => (
              <button key={t.id||i} className={`process__step ${active===i?'active':''}`} onClick={()=>setActive(i)} data-hover>
                <div className="process__step-left">
                  <div className="process__step-dot" style={{'--c':t.color}}><div className="process__step-dot-inner"/></div>
                  {i<tools.length-1 && <div className="process__step-line"/>}
                </div>
                <div className="process__step-body">
                  <div className="process__step-meta">
                    <span className="t-label" style={{color:t.color}}>{t.name}</span>
                    <span className="t-label" style={{color:'var(--text-tertiary)'}}>{t.step}</span>
                  </div>
                  <h3 className="process__step-title">{t.title}</h3>
                  <p className="process__step-desc">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="process__panel glow-card reveal">
            {tools.map((t, i) => (
              <div key={t.id||i} className={`process__panel-slide ${active===i?'active':''}`}>
                <div className="process__panel-orb" style={{background:`radial-gradient(circle,${t.color}20 0%,transparent 70%)`}}/>
                <div className="t-label" style={{color:t.color,marginBottom:'1rem'}}>{t.name} — Step {t.step}</div>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:'2rem',color:t.color,marginBottom:'1rem'}}>{t.title}</h3>
                <p className="t-body" style={{fontSize:'0.88rem',lineHeight:1.8,marginBottom:'2rem'}}>{t.detail}</p>
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                    <span className="t-label" style={{color:'var(--text-tertiary)'}}>Pipeline Progress</span>
                    <span className="t-label" style={{color:t.color}}>{Math.round(((i+1)/tools.length)*100)}%</span>
                  </div>
                  <div style={{height:2,background:'var(--border)',borderRadius:1,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${((i+1)/tools.length)*100}%`,background:t.color,transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)'}}/>
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  {tools.map((_,si)=>(
                    <button key={si} onClick={()=>setActive(si)} data-hover
                      style={{width:si===i?24:8,height:8,borderRadius:4,border:'none',background:si===i?t.color:'var(--border-strong)',transition:'all 0.2s',cursor:'none'}}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .process__layout{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start}
        .process__steps{display:flex;flex-direction:column}
        .process__step{display:flex;gap:1.25rem;background:none;border:none;text-align:left;padding:0;cursor:none}
        .process__step-left{display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding-top:4px}
        .process__step-dot{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--c);display:flex;align-items:center;justify-content:center;transition:all 0.3s;flex-shrink:0}
        .process__step-dot-inner{width:5px;height:5px;border-radius:50%;background:var(--c);opacity:0;transition:opacity 0.3s}
        .process__step.active .process__step-dot{box-shadow:0 0 10px var(--c)}
        .process__step.active .process__step-dot-inner{opacity:1}
        .process__step-line{width:1px;flex:1;min-height:16px;background:var(--border);margin:5px 0}
        .process__step-body{padding:0 0 1.25rem;flex:1}
        .process__step-meta{display:flex;align-items:center;gap:1rem;margin-bottom:0.3rem}
        .process__step-title{font-family:'Outfit',sans-serif;font-weight:600;font-size:1rem;color:var(--text-tertiary);margin-bottom:0.3rem;transition:color 0.2s}
        .process__step.active .process__step-title{color:var(--text-primary)}
        .process__step-desc{font-size:0.8rem;line-height:1.6;color:var(--text-tertiary);max-height:0;overflow:hidden;transition:max-height 0.4s ease,color 0.2s}
        .process__step.active .process__step-desc{max-height:80px;color:var(--text-secondary)}
        .process__panel{position:sticky;top:8rem;padding:2.5rem;min-height:360px;overflow:hidden}
        .process__panel-slide{position:absolute;inset:2.5rem;opacity:0;transform:translateY(16px);transition:opacity 0.4s,transform 0.4s;pointer-events:none}
        .process__panel-slide.active{opacity:1;transform:translateY(0);pointer-events:all;position:relative;inset:auto}
        .process__panel-orb{position:absolute;width:250px;height:250px;top:-80px;right:-80px;border-radius:50%;filter:blur(40px);pointer-events:none}
        @media(max-width:900px){.process__layout{grid-template-columns:1fr}.process__panel{position:static}.process__panel-slide{position:relative;inset:auto}}
      `}</style>
    </section>
  );
}
