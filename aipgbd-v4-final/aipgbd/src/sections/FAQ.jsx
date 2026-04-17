import { useState } from 'react';
export default function FAQ({ db }) {
  const faqs = db.faqs || [];
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="section faq">
      <div className="container">
        <div className="faq__layout">
          <div className="faq__left reveal">
            <div className="section-badge"><span className="t-label">FAQ</span></div>
            <h2 className="t-heading" style={{fontSize:'clamp(2rem,4vw,3.5rem)',margin:'1rem 0 1.25rem'}}>Before you<br /><span className="grad-text">reach out.</span></h2>
            <p className="t-body" style={{fontSize:'0.88rem',maxWidth:'260px'}}>The questions every client asks. Answered without the agency spin.</p>
            <div style={{marginTop:'2.5rem'}}>
              <p className="t-label" style={{color:'var(--text-tertiary)',marginBottom:'0.75rem'}}>Still have questions?</p>
              <a href="#contact" className="btn-ghost" data-hover style={{padding:'0.7rem 1.5rem',fontSize:'0.75rem'}}><span>Contact Us</span></a>
            </div>
          </div>
          <div className="faq__items">
            {faqs.map((faq,i)=>(
              <div key={faq.id||i} className={`faq__item reveal reveal-delay-${Math.min(i+1,4)} ${open===i?'open':''}`}>
                <button className="faq__q" onClick={()=>setOpen(open===i?null:i)} data-hover>
                  <span>{faq.q}</span>
                  <div className="faq__icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                </button>
                <div className="faq__a"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .faq__layout{display:grid;grid-template-columns:300px 1fr;gap:6rem;align-items:start}
        .faq__left{position:sticky;top:8rem}
        .faq__items{display:flex;flex-direction:column}
        .faq__item{border-bottom:1px solid var(--border);overflow:hidden}
        .faq__item:first-child{border-top:1px solid var(--border)}
        .faq__q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:2rem;padding:1.5rem 0;background:none;border:none;text-align:left;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.92rem;color:var(--text-primary);cursor:none;transition:color 0.2s}
        .faq__q:hover{color:var(--cyan)}
        .faq__icon{width:30px;height:30px;border:1px solid var(--border-strong);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-secondary);transition:all 0.3s}
        .faq__item.open .faq__icon{border-color:var(--cyan-border);background:var(--cyan-dim);color:var(--cyan);transform:rotate(45deg)}
        .faq__a{max-height:0;overflow:hidden;transition:max-height 0.4s cubic-bezier(0.16,1,0.3,1)}
        .faq__item.open .faq__a{max-height:200px}
        .faq__a p{font-size:0.86rem;line-height:1.8;color:var(--text-secondary);padding-bottom:1.5rem}
        @media(max-width:800px){.faq__layout{grid-template-columns:1fr;gap:3rem}.faq__left{position:static}}
      `}</style>
    </section>
  );
}
