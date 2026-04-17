import { useState } from 'react';
export default function Work({ db }) {
  const items = db.portfolio || [];
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...new Set(items.map(i=>i.category))];
  const filtered = filter==='All' ? items : items.filter(i=>i.category===filter);
  return (
    <section id="work" className="section work">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Selected Work</span></div>
          <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)',marginBottom:'0.75rem'}}>
            30 seconds.<br /><span className="grad-text">No cuts. No compromises.</span>
          </h2>
        </div>
        {cats.length > 2 && (
          <div className="work__filters reveal">
            {cats.map(c=>(
              <button key={c} className={`work__filter ${filter===c?'active':''}`} onClick={()=>setFilter(c)} data-hover>{c}</button>
            ))}
          </div>
        )}
        <div className="work__grid">
          {filtered.map((item,i)=>(
            <div key={item.id||i} className={`work-card glow-card reveal reveal-delay-${i%2+1} ${i===0?'work-card--hero':''}`} data-hover
              onClick={()=>item.youtubeId && setModal(item)}>
              <div className="work-card__media">
                {item.youtubeId
                  ? <img src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`} alt={item.title} className="work-card__thumb" onError={e=>{e.target.src=`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}} />
                  : <div className="work-card__placeholder" style={{background:`radial-gradient(circle at 60% 40%,${item.color||'#00E5FF'}15 0%,transparent 70%)`}}>
                      <div className="work-card__grid-lines"/>
                      <span className="t-label" style={{color:item.color||'var(--cyan)',position:'relative',zIndex:1}}>Showreel in production</span>
                    </div>
                }
                {item.youtubeId && (
                  <div className="work-card__play-overlay">
                    <div className="work-card__play" style={{borderColor:item.color||'var(--cyan)',boxShadow:`0 0 20px ${item.color||'var(--cyan)'}40`}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={item.color||'var(--cyan)'}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="work-card__info">
                <div className="work-card__meta">
                  <span className="t-label" style={{color:item.color||'var(--cyan)'}}>{item.category}</span>
                  <span className="t-label" style={{color:'var(--text-tertiary)'}}>0:30</span>
                </div>
                <h3 className="work-card__title">{item.title}</h3>
                <p style={{fontSize:'0.78rem',color:'var(--text-secondary)',lineHeight:1.5}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="work__cta reveal">
          <div className="glow-card" style={{padding:'3rem',maxWidth:600,width:'100%',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',margin:'0 auto',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',width:300,height:300,background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)',top:-100,left:'50%',transform:'translateX(-50%)',borderRadius:'50%',pointerEvents:'none'}}/>
            <p className="t-label" style={{color:'var(--cyan)',marginBottom:'0.75rem'}}>✦ Limited Time Offer</p>
            <h3 className="t-heading" style={{fontSize:'1.5rem',marginBottom:'0.75rem'}}>First 3 brands get a complimentary demo render</h3>
            <p className="t-body" style={{fontSize:'0.88rem',marginBottom:'1.5rem',maxWidth:400}}>See your brand in full 30-second cinematic motion before committing. Zero risk.</p>
            <a href="#contact" className="btn-primary" data-hover><span>Request Your Demo</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
          </div>
        </div>
      </div>
      {modal && (
        <div className="video-modal" onClick={()=>setModal(null)}>
          <div className="video-modal__close" onClick={()=>setModal(null)}>×</div>
          <div className="video-modal__inner" onClick={e=>e.stopPropagation()}>
            <iframe src={`https://www.youtube.com/embed/${modal.youtubeId}?autoplay=1&rel=0`} title={modal.title} frameBorder="0" allow="autoplay;fullscreen" allowFullScreen className="video-modal__iframe"/>
          </div>
        </div>
      )}
      <style>{`
        .work__filters{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:2.5rem}
        .work__filter{padding:0.4rem 1rem;border:1px solid var(--border);border-radius:100px;background:none;font-family:'Space Grotesk',sans-serif;font-size:0.78rem;color:var(--text-secondary);cursor:none;transition:all 0.2s}
        .work__filter:hover{border-color:var(--cyan-border);color:var(--cyan)}
        .work__filter.active{background:var(--cyan-dim);border-color:var(--cyan-border);color:var(--cyan);font-weight:600}
        .work__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;margin-bottom:3rem}
        .work-card--hero{grid-column:1/-1}
        .work-card{overflow:hidden;cursor:none}
        .work-card__media{aspect-ratio:16/9;position:relative;overflow:hidden;background:var(--bg-3)}
        .work-card--hero .work-card__media{aspect-ratio:21/9}
        .work-card__thumb{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease}
        .work-card:hover .work-card__thumb{transform:scale(1.03)}
        .work-card__placeholder{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem}
        .work-card__grid-lines{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:40px 40px;opacity:0.4}
        .work-card__play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);transition:background 0.3s}
        .work-card:hover .work-card__play-overlay{background:rgba(0,0,0,0.3)}
        .work-card__play{width:56px;height:56px;border-radius:50%;border:1px solid;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);opacity:0;transform:scale(0.8);transition:all 0.3s}
        .work-card:hover .work-card__play{opacity:1;transform:scale(1)}
        .work-card__info{padding:1.25rem;display:flex;flex-direction:column;gap:0.35rem}
        .work-card__meta{display:flex;justify-content:space-between}
        .work-card__title{font-family:'Outfit',sans-serif;font-weight:700;font-size:1.05rem;color:var(--text-primary)}
        .video-modal{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:2rem}
        .video-modal__close{position:absolute;top:1.5rem;right:2rem;color:#fff;font-size:2rem;cursor:pointer;z-index:1;opacity:0.7;transition:opacity 0.2s}
        .video-modal__close:hover{opacity:1}
        .video-modal__inner{width:100%;max-width:900px;aspect-ratio:16/9;border-radius:8px;overflow:hidden}
        .video-modal__iframe{width:100%;height:100%}
        @media(max-width:700px){.work__grid{grid-template-columns:1fr}.work-card--hero{grid-column:1}}
      `}</style>
    </section>
  );
}
