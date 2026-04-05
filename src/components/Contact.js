import { useState } from 'react';
import { saveInquiry } from '../hooks/db';
import { dbSaveInquiry, isSupabaseReady } from '../hooks/supabase';
import { useLang } from '../i18n/LangContext';

export default function Contact({ cfg, showToast }) {
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', message:'', package:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { lang, t } = useLang();

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = lang==='bn' ? 'আবশ্যক' : 'Required';
    if (!form.phone.trim())   e.phone   = lang==='bn' ? 'আবশ্যক' : 'Required';
    if (!form.message.trim()) e.message = lang==='bn' ? 'আপনার প্রজেক্ট সম্পর্কে বলুন' : 'Tell us about your project';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    // Save to localStorage always
    const record = saveInquiry(form);
    // Also save to Supabase if connected
    if (isSupabaseReady) await dbSaveInquiry(record);
    showToast(`✓ Inquiry ${record.id} saved! Opening WhatsApp…`, 'success');
    const msg = `Hi AIPGBD! I'm ${form.name}${form.company ? ` from ${form.company}` : ''}.\n\nProject: ${form.message}${form.package ? `\nPackage: ${form.package}` : ''}\n\nContact: ${form.phone}${form.email ? ` / ${form.email}` : ''}`;
    setTimeout(() => window.open(`${cfg.site.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank'), 800);
    setForm({ name:'', company:'', email:'', phone:'', message:'', package:'' });
    setLoading(false);
  };

  const F = (key, label, type='text', opts={}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {opts.textarea
        ? <textarea className={`input${errors[key]?' error':''}`} placeholder={opts.placeholder||''} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} rows={4}/>
        : opts.select
          ? <select className={`input${errors[key]?' error':''}`} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}>
              <option value="">{t('contact_pkg_def')}</option>
              {cfg.packages.map(p=><option key={p.id} value={p.title}>{lang==='bn'&&p.title_bn?p.title_bn:p.title} — ৳{p.price}</option>)}
            </select>
          : <input type={type} className={`input${errors[key]?' error':''}`} placeholder={opts.placeholder||''} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>}
      {errors[key] && <span className="form-error">{errors[key]}</span>}
    </div>
  );

  const contacts = [
    { icon:'📱', label:'WhatsApp', val:cfg.site.whatsapp, href:cfg.site.whatsapp },
    { icon:'✉',  label:'Email',    val:cfg.site.email,    href:`mailto:${cfg.site.email}` },
    { icon:'▶',  label:'YouTube',  val:cfg.site.youtube,  href:cfg.site.youtube },
    { icon:'f',  label:'Facebook', val:cfg.site.facebook, href:cfg.site.facebook },
  ];

  return (
    <section id="contact" className="section">
      <div className="gradient-line"/>
      <div className="container" style={{paddingTop:'var(--section-py)'}}>
        <div className="contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(2rem,5vw,5rem)',alignItems:'start'}}>
          <div>
            <div className="section-label animate-in"><span className="label-mono">{t('contact_label')}</span></div>
            <h2 className="animate-in" style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,5vw,4rem)',fontWeight:300,marginBottom:'1.25rem'}}>
              {t('contact_title')}<br/>{t('contact_title2')}<br/>{t('contact_title3')}
            </h2>
            <p className="animate-in" style={{color:'var(--text-1)',lineHeight:1.75,marginBottom:'1.75rem',fontSize:'0.95rem'}}>{t('contact_sub')}</p>
            <div className="animate-in" style={{display:'flex',flexDirection:'column',gap:'0.65rem'}}>
              {contacts.map(c=>(
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'0.75rem',textDecoration:'none',color:'var(--text-1)',padding:'0.65rem 0.9rem',borderRadius:'var(--r-md)',border:'1px solid var(--border)',transition:'all 0.2s',background:'var(--surface)'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-active)';e.currentTarget.style.color='var(--text-0)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-1)';}}>
                  <span style={{width:26,textAlign:'center',fontFamily:'var(--font-mono)',color:'var(--cyan)',fontSize:'0.9rem'}}>{c.icon}</span>
                  <div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'0.58rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{c.label}</div>
                    <div style={{fontSize:'0.82rem'}}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
            {isSupabaseReady && (
              <div style={{marginTop:'1.25rem',padding:'0.65rem 0.9rem',borderRadius:'var(--r-md)',background:'var(--cyan-dim)',border:'1px solid var(--cyan-mid)',fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--cyan)',letterSpacing:'0.08em'}}>
                ● {lang==='bn' ? 'ক্লাউড সংযুক্ত — তদন্তগুলি Supabase-এ সংরক্ষিত' : 'Cloud connected — inquiries saved to Supabase'}
              </div>
            )}
          </div>
          <div className="card animate-in" style={{padding:'clamp(1.5rem,3vw,2.25rem)'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                {F('name',t('contact_name'),'text',{placeholder:t('contact_ph_name')})}
                {F('company',t('contact_company'),'text',{placeholder:t('contact_ph_co')})}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                {F('phone',t('contact_phone'),'tel',{placeholder:t('contact_ph_ph')})}
                {F('email',t('contact_email'),'email',{placeholder:t('contact_ph_em')})}
              </div>
              {F('package',t('contact_package'),'',{select:true})}
              {F('message',t('contact_msg'),'',{textarea:true,placeholder:t('contact_ph_msg')})}
              <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1}}>
                {loading ? t('contact_sending') : t('contact_submit')}
              </button>
              <p style={{fontSize:'0.68rem',color:'var(--text-3)',textAlign:'center',fontFamily:'var(--font-mono)',letterSpacing:'0.05em'}}>{t('contact_note')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
