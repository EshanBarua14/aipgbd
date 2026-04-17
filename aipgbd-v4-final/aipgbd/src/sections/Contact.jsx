import { useState } from 'react';
import { saveInquiry } from '../db';
export default function Contact({ db }) {
  const s = db.site || {};
  const pkgs = db.packages || [];
  const [form, setForm] = useState({ name:'', email:'', brand:'', service:'', budget:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.brand.trim()) e.brand = 'Required';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleChange = e => { setForm(f=>({...f,[e.target.name]:e.target.value})); if(errors[e.target.name]) setErrors(er=>({...er,[e.target.name]:''})); };
  const handleSubmit = () => {
    if (!validate()) return;
    setStatus('sending');
    setTimeout(() => {
      const ok = saveInquiry(form);
      if (ok) {
        setStatus('success');
        const subj = encodeURIComponent(`Project Inquiry — ${form.brand}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nBrand: ${form.brand}\nService: ${form.service}\nBudget: ${form.budget}\n\n${form.message}`);
        window.location.href = `mailto:${s.email}?subject=${subj}&body=${body}`;
      } else { setStatus('error'); }
    }, 1200);
  };
  const handleWA = () => {
    const msg = form.brand ? `Hi! I'm ${form.name} from ${form.brand}. ${form.message||'I want to start a project.'}` : `Hi! I want to learn more about your services.`;
    window.open(`${s.whatsapp||'https://wa.me/8801XXXXXXXXX'}?text=${encodeURIComponent(msg)}`, '_blank');
  };
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__left reveal">
            <div className="section-badge"><span className="t-label">Contact</span></div>
            <h2 className="t-heading contact__title">Let's build<br /><span className="grad-text">something</span><br />cinematic.</h2>
            <p className="t-body contact__sub">Tell us what you need. We respond within 24 hours with a full production brief and exact pricing.</p>
            <div className="contact__channels">
              <a href={`mailto:${s.email}`} className="contact__channel" data-hover>
                <div className="contact__channel-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div><div className="t-label contact__channel-label">Email</div><div className="contact__channel-val">{s.email}</div></div>
              </a>
              <button className="contact__channel" onClick={handleWA} data-hover>
                <div className="contact__channel-icon contact__channel-icon--wa"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
                <div><div className="t-label contact__channel-label">WhatsApp</div><div className="contact__channel-val">Direct Line →</div></div>
              </button>
            </div>
            <div>
              <span className="t-label" style={{color:'var(--text-tertiary)',display:'block',marginBottom:'0.75rem'}}>Payment Methods</span>
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.5rem'}}>
                {['bKash','Nagad','Bank Transfer'].map(m=>(
                  <div key={m} style={{border:'1px solid var(--border-strong)',borderRadius:6,padding:'0.35rem 0.75rem'}}>
                    <span className="t-label" style={{color:'var(--text-primary)',fontSize:'0.62rem'}}>{m}</span>
                  </div>
                ))}
              </div>
              <p className="t-label" style={{color:'var(--text-tertiary)'}}>50% deposit · 50% on delivery</p>
            </div>
          </div>
          <div className="contact__form-wrap glow-card reveal reveal-delay-2">
            {status==='success' ? (
              <div className="contact__success">
                <div style={{width:72,height:72,borderRadius:'50%',border:'1px solid var(--cyan-border)',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cyan-dim)',boxShadow:'0 0 30px var(--cyan-dim)',animation:'successPop 0.5s cubic-bezier(0.16,1,0.3,1)'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="t-heading" style={{fontSize:'1.4rem'}}>Inquiry Sent!</h3>
                <p className="t-body" style={{fontSize:'0.88rem',textAlign:'center'}}>Your details are saved. Check your email client. We'll respond within 24 hours.</p>
                <button className="btn-ghost" onClick={()=>{setStatus('idle');setForm({name:'',email:'',brand:'',service:'',budget:'',message:''});}} data-hover>Send Another</button>
              </div>
            ) : (
              <div className="contact__form">
                <div className="contact__form-grid">
                  <div className="contact__field">
                    <label className="t-label">Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={`contact__input ${errors.name?'error':''}`}/>
                    {errors.name && <span className="contact__err">{errors.name}</span>}
                  </div>
                  <div className="contact__field">
                    <label className="t-label">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="contact__input" type="email"/>
                  </div>
                </div>
                <div className="contact__form-grid">
                  <div className="contact__field">
                    <label className="t-label">Brand / Company *</label>
                    <input name="brand" value={form.brand} onChange={handleChange} placeholder="Your brand" className={`contact__input ${errors.brand?'error':''}`}/>
                    {errors.brand && <span className="contact__err">{errors.brand}</span>}
                  </div>
                  <div className="contact__field">
                    <label className="t-label">Service</label>
                    <select name="service" value={form.service} onChange={handleChange} className="contact__input contact__select">
                      <option value="">Select package</option>
                      {pkgs.map(p=><option key={p.id} value={p.id}>{p.title} — ৳{p.price} {p.currency}</option>)}
                      <option value="custom">Custom — Let's talk</option>
                    </select>
                  </div>
                </div>
                <div className="contact__field">
                  <label className="t-label">Monthly Budget (BDT)</label>
                  <select name="budget" value={form.budget} onChange={handleChange} className="contact__input contact__select">
                    <option value="">Select range</option>
                    <option value="under-10k">Under ৳10,000</option>
                    <option value="10k-30k">৳10,000 – ৳30,000</option>
                    <option value="30k-60k">৳30,000 – ৳60,000</option>
                    <option value="60k+">৳60,000+</option>
                  </select>
                </div>
                <div className="contact__field">
                  <label className="t-label">Tell Us About Your Project *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="What do you need? Deadline? Problem you're solving?" className={`contact__input contact__textarea ${errors.message?'error':''}`} rows={4}/>
                  {errors.message && <span className="contact__err">{errors.message}</span>}
                </div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  <button className="btn-primary contact__submit" onClick={handleSubmit} disabled={status==='sending'} data-hover>
                    {status==='sending'
                      ? <><span className="contact__spinner"/><span>Sending...</span></>
                      : <><span>Send Inquiry</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                    }
                  </button>
                  <button className="btn-ghost" onClick={handleWA} data-hover>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
                {status==='error' && <p style={{fontSize:'0.8rem',color:'var(--magenta)',textAlign:'center',marginTop:'0.5rem'}}>Something went wrong. Please WhatsApp or email directly.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .contact__layout{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start}
        .contact__title{font-family:'Outfit',sans-serif;font-weight:800;font-size:clamp(2.5rem,5vw,4.5rem);line-height:1.05;margin:1.25rem 0}
        .contact__sub{font-size:0.9rem;max-width:360px;margin-bottom:2.5rem}
        .contact__channels{display:flex;flex-direction:column;gap:1rem;margin-bottom:2.5rem}
        .contact__channel{display:flex;align-items:center;gap:1rem;padding:1rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);transition:all 0.3s;text-align:left;cursor:none}
        .contact__channel:hover{border-color:var(--cyan-border);background:var(--cyan-dim)}
        .contact__channel-icon{width:40px;height:40px;border-radius:8px;background:var(--cyan-dim);border:1px solid var(--cyan-border);display:flex;align-items:center;justify-content:center;color:var(--cyan);flex-shrink:0}
        .contact__channel-icon--wa{background:rgba(37,211,102,0.1);border-color:rgba(37,211,102,0.3);color:#25D366}
        .contact__channel-label{margin-bottom:0.15rem;color:var(--text-tertiary)}
        .contact__channel-val{font-size:0.88rem;color:var(--text-primary);font-weight:500}
        .contact__form-wrap{padding:2.5rem}
        .contact__form{display:flex;flex-direction:column;gap:1.25rem}
        .contact__form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
        .contact__field{display:flex;flex-direction:column;gap:0.4rem}
        .contact__input{background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:0.8rem 1rem;font-family:'Space Grotesk',sans-serif;font-size:0.88rem;color:var(--text-primary);outline:none;transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;width:100%}
        .contact__input::placeholder{color:var(--text-tertiary)}
        .contact__input:focus{border-color:var(--cyan-border);box-shadow:0 0 0 3px var(--cyan-dim)}
        .contact__input.error{border-color:var(--magenta)}
        .contact__err{font-size:0.72rem;color:var(--magenta);font-family:'JetBrains Mono',monospace}
        .contact__select{cursor:none}
        .contact__select option{background:var(--bg)}
        .contact__textarea{resize:vertical;min-height:110px}
        .contact__submit{flex:1;justify-content:center}
        .contact__spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .contact__success{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;min-height:300px;text-align:center}
        @keyframes successPop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
        @media(max-width:900px){.contact__layout{grid-template-columns:1fr;gap:3rem}.contact__form-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
