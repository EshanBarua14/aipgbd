import SocialCommandCenter from './SocialCommandCenter';
import { useState, useEffect } from 'react';
import {
  getInquiries, updateInquiryStatus, deleteInquiry, addInquiryNote, getStats,
} from '../hooks/db';
import {
  dbGetInquiries, dbUpdateInquiry, dbDeleteInquiry, isSupabaseReady,
  dbGetPosts, dbSavePost, dbDeletePost,
} from '../hooks/supabase';

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, textarea, hint, type='text' }) {
  return (
    <div className="form-group" style={{marginBottom:'0.75rem'}}>
      {label && <label className="form-label">{label}{hint&&<span style={{color:'var(--text-3)',fontWeight:400,marginLeft:'0.4em'}}>({hint})</span>}</label>}
      {textarea
        ? <textarea className="input" value={value??''} onChange={e=>onChange(e.target.value)} rows={3}/>
        : <input type={type} className="input" value={value??''} onChange={e=>onChange(e.target.value)}/>}
    </div>
  );
}

// ─── BilField — side-by-side EN + BN ─────────────────────────────────────────
function BilField({ labelEN, labelBN, valueEN, valueBN, onChangeEN, onChangeBN, textarea }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
      <Field label={labelEN} value={valueEN} onChange={onChangeEN} textarea={textarea}/>
      <Field label={labelBN} value={valueBN} onChange={onChangeBN} textarea={textarea}/>
    </div>
  );
}

// ─── PIN Gate ─────────────────────────────────────────────────────────────────
function PinGate({ cfg, onUnlock }) {
  const [pin,setPin]=useState(''); const [err,setErr]=useState(false);
  const check = () => {
    if (pin===(cfg.adminPin||'1234')) { onUnlock(); }
    else { setErr(true); setPin(''); setTimeout(()=>setErr(false),1500); }
  };
  return (
    <div className="admin-pin-box">
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'2.5rem',fontWeight:300,color:'var(--text-0)',marginBottom:'0.5rem'}}>Admin Panel</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-3)',letterSpacing:'0.15em',textTransform:'uppercase'}}>Enter PIN to continue</div>
      </div>
      <input type="password" maxLength={8} className="admin-pin-input"
        value={pin} onChange={e=>setPin(e.target.value)}
        onKeyDown={e=>e.key==='Enter'&&check()}
        style={{borderColor:err?'var(--magenta)':'var(--border-active)'}}
        autoFocus placeholder="••••"/>
      {err && <div style={{color:'var(--magenta)',fontFamily:'var(--font-mono)',fontSize:'0.72rem'}}>Incorrect PIN</div>}
      <button className="btn btn-primary" onClick={check}>Unlock →</button>
    </div>
  );
}

// ─── Inquiry Card ─────────────────────────────────────────────────────────────
function InquiryCard({ inq, expanded, onToggle, onUpdate }) {
  const [note,setNote]=useState(inq.note||'');
  const statusClass = {new:'status-new','in-progress':'status-in-progress',closed:'status-closed'}[inq.status]||'status-new';
  const date = new Date(inq.createdAt||inq.created_at).toLocaleDateString('en-BD',{day:'numeric',month:'short',year:'numeric'});

  const setStatus = async (s) => {
    updateInquiryStatus(inq.id,s);
    if (isSupabaseReady) await dbUpdateInquiry(inq.id,{status:s});
    onUpdate();
  };
  const remove = async () => {
    if (!window.confirm(`Delete ${inq.id}?`)) return;
    deleteInquiry(inq.id);
    if (isSupabaseReady) await dbDeleteInquiry(inq.id);
    onUpdate();
  };
  const saveNote = async () => {
    addInquiryNote(inq.id,note);
    if (isSupabaseReady) await dbUpdateInquiry(inq.id,{note});
    onUpdate();
  };

  return (
    <div className="admin-inq-card">
      <div className="admin-inq-head" onClick={onToggle} style={{cursor:'pointer'}}>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--cyan)',fontWeight:600}}>{inq.id}</span>
        <span style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text-0)',flex:1}}>{inq.name}{inq.company?` · ${inq.company}`:''}</span>
        <span className={`status-badge ${statusClass}`}>{inq.status}</span>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--text-3)'}}>{date}</span>
        <span style={{color:'var(--text-2)',transform:expanded?'rotate(180deg)':'none',transition:'transform 0.2s',fontSize:'0.8rem'}}>▾</span>
      </div>
      <div className={`admin-inq-body${expanded?' open':''}`}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem 1.5rem',marginBottom:'1rem',fontSize:'0.85rem',color:'var(--text-1)'}}>
          {inq.phone&&<div><span style={{color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.62rem'}}>PHONE · </span>{inq.phone}</div>}
          {inq.email&&<div><span style={{color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.62rem'}}>EMAIL · </span>{inq.email}</div>}
          {inq.package&&<div><span style={{color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.62rem'}}>PACKAGE · </span>{inq.package}</div>}
        </div>
        {inq.message&&<div style={{background:'var(--bg-2)',borderRadius:'var(--r-sm)',padding:'0.75rem 1rem',marginBottom:'1rem',fontSize:'0.85rem',color:'var(--text-1)',lineHeight:1.6}}>{inq.message}</div>}
        <textarea className="input" value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="Add internal note…" style={{fontSize:'0.82rem',marginBottom:'0.5rem'}}/>
        <div className="admin-action-row">
          <button className="admin-btn admin-btn-purple" onClick={saveNote}>Save Note</button>
          <a href={`https://wa.me/${(inq.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${inq.name}, thanks for reaching out to AIPGBD!`)}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn-green">📱 WhatsApp</a>
          {inq.email&&<a href={`mailto:${inq.email}?subject=Your inquiry ${inq.id}`} className="admin-btn admin-btn-cyan">✉ Email</a>}
          <button className="admin-btn admin-btn-cyan"   onClick={()=>setStatus('new')}>→ New</button>
          <button className="admin-btn admin-btn-purple" onClick={()=>setStatus('in-progress')}>→ In Progress</button>
          <button className="admin-btn" style={{color:'var(--text-2)',borderColor:'var(--border)'}} onClick={()=>setStatus('closed')}>→ Closed</button>
          <button className="admin-btn admin-btn-red" style={{marginLeft:'auto'}} onClick={remove}>🗑 Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Dashboard ───────────────────────────────────────────────────────────
function TabDashboard() {
  const [stats,setStats]=useState(getStats());
  const [inqs,setInqs]=useState(getInquiries().slice(0,5));
  const [expanded,setExpanded]=useState(null);
  const refresh = async () => {
    if (isSupabaseReady) {
      const data = await dbGetInquiries();
      if (data) { setInqs((data||[]).slice(0,5)); setStats({ total:data.length, new:data.filter(x=>x.status==='new').length, inProgress:data.filter(x=>x.status==='in-progress').length, closed:data.filter(x=>x.status==='closed').length, views:getStats().views }); return; }
    }
    setStats(getStats()); setInqs(getInquiries().slice(0,5));
  };
  useEffect(()=>{ refresh(); },[]);
  return (
    <div>
      {isSupabaseReady&&<div style={{marginBottom:'1rem',padding:'0.6rem 1rem',background:'var(--cyan-dim)',border:'1px solid var(--cyan-mid)',borderRadius:'var(--r-md)',fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--cyan)'}}>● Supabase connected — data synced to cloud</div>}
      <div className="admin-grid">
        {[{label:'Total Inquiries',num:stats.total,color:'var(--cyan)'},{label:'New',num:stats.new,color:'var(--green)'},{label:'In Progress',num:stats.inProgress,color:'var(--purple)'},{label:'Closed',num:stats.closed,color:'var(--text-2)'},{label:'Page Views',num:stats.views,color:'var(--magenta)'}].map((s,i)=>(
          <div key={i} className="admin-stat">
            <div className="admin-stat-num" style={{background:`linear-gradient(135deg,${s.color},var(--purple))`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{s.num}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="admin-section-title">Recent Inquiries</div>
      {inqs.length===0&&<p style={{color:'var(--text-2)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>No inquiries yet.</p>}
      {inqs.map(inq=><InquiryCard key={inq.id} inq={inq} expanded={expanded===inq.id} onToggle={()=>setExpanded(expanded===inq.id?null:inq.id)} onUpdate={refresh}/>)}
    </div>
  );
}

// ─── Tab: Inquiries ───────────────────────────────────────────────────────────
function TabInquiries() {
  const [filter,setFilter]=useState('all');
  const [expanded,setExpanded]=useState(null);
  const [all,setAll]=useState([]);
  const [loading,setLoading]=useState(true);
  const refresh = async () => {
    if (isSupabaseReady) { const data=await dbGetInquiries(); if(data){setAll(data);setLoading(false);return;} }
    setAll(getInquiries()); setLoading(false);
  };
  useEffect(()=>{ refresh(); },[]);
  const filtered = filter==='all'?all:all.filter(i=>i.status===filter);
  return (
    <div>
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        {['all','new','in-progress','closed'].map(f=>(
          <button key={f} className="admin-btn" style={{borderColor:filter===f?'var(--cyan)':'var(--border)',background:filter===f?'var(--cyan-dim)':'transparent',color:filter===f?'var(--cyan)':'var(--text-2)'}} onClick={()=>setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)} ({f==='all'?all.length:all.filter(i=>i.status===f).length})
          </button>
        ))}
        <button className="admin-btn admin-btn-cyan" style={{marginLeft:'auto'}} onClick={refresh}>↺ Refresh</button>
      </div>
      {loading&&<div style={{color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>Loading…</div>}
      {!loading&&filtered.length===0&&<p style={{color:'var(--text-2)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>No inquiries in this category.</p>}
      {filtered.map(inq=><InquiryCard key={inq.id} inq={inq} expanded={expanded===inq.id} onToggle={()=>setExpanded(expanded===inq.id?null:inq.id)} onUpdate={refresh}/>)}
    </div>
  );
}

// ─── Tab: Site Settings ───────────────────────────────────────────────────────
function TabSite({ cfg, onSave }) {
  const [s,setS]=useState(()=>({...cfg.site}));
  const [words,setWords]=useState(()=>[...(cfg.site.heroWords||[])]);
  const [wordsBN,setWordsBN]=useState(()=>[...(cfg.site.heroWords_bn||[])]);
  const [newWord,setNewWord]=useState(''); const [newWordBN,setNewWordBN]=useState('');
  useEffect(()=>{ setS({...cfg.site}); setWords([...(cfg.site.heroWords||[])]); setWordsBN([...(cfg.site.heroWords_bn||[])]); },[cfg]);
  const save = () => onSave({...cfg, site:{...s,heroWords:words,heroWords_bn:wordsBN,adminPin:s.adminPin||cfg.adminPin}, adminPin:s.adminPin||cfg.adminPin});
  return (
    <div>
      <div className="admin-section-title">Brand Identity</div>
      <div style={{display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'1.25rem',padding:'1rem',background:'var(--bg-2)',borderRadius:'var(--r-md)',border:'1px solid var(--border)'}}>
        <div style={{width:56,height:56,borderRadius:'50%',border:'1.5px solid var(--cyan)',overflow:'hidden',flexShrink:0,background:'var(--bg-3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>
          {s.logoUrl?<img src={s.logoUrl} alt="logo" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';}}/>:'🤖'}
        </div>
        <div style={{flex:1}}><div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>Logo URL</div>
          <Field label="" value={s.logoUrl||''} onChange={v=>setS({...s,logoUrl:v})} hint="/logo.png or image URL"/></div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
          <button className="admin-btn admin-btn-cyan" onClick={()=>setS({...s,logoUrl:'/logo.png'})}>Use /logo.png</button>
          <button className="admin-btn admin-btn-red"  onClick={()=>setS({...s,logoUrl:''})}>Use Emoji</button>
        </div>
      </div>

      <BilField labelEN="Brand Name" labelBN="ব্র্যান্ড নাম (বাংলা)" valueEN={s.name} valueBN={s.name} onChangeEN={v=>setS({...s,name:v})} onChangeBN={v=>setS({...s,name:v})}/>
      <BilField labelEN="Tagline (EN)" labelBN="ট্যাগলাইন (বাংলা)" valueEN={s.tagline} valueBN={s.tagline_bn||''} onChangeEN={v=>setS({...s,tagline:v})} onChangeBN={v=>setS({...s,tagline_bn:v})}/>
      <div className="admin-form-grid">
        <Field label="WhatsApp URL" value={s.whatsapp} onChange={v=>setS({...s,whatsapp:v})} hint="wa.me/8801…"/>
        <Field label="Email" value={s.email} onChange={v=>setS({...s,email:v})}/>
      </div>
      <div className="admin-form-grid">
        <Field label="Facebook URL" value={s.facebook} onChange={v=>setS({...s,facebook:v})}/>
        <Field label="YouTube URL"  value={s.youtube}  onChange={v=>setS({...s,youtube:v})}/>
      </div>

      <div className="admin-section-title" style={{marginTop:'1.5rem'}}>Hero Section</div>
      <BilField labelEN="Hero Line 1 (EN)" labelBN="হিরো লাইন ১ (বাংলা)" valueEN={s.heroTitle1} valueBN={s.heroTitle1_bn||''} onChangeEN={v=>setS({...s,heroTitle1:v})} onChangeBN={v=>setS({...s,heroTitle1_bn:v})}/>
      <BilField labelEN="Hero Sub Text (EN)" labelBN="হিরো সাব টেক্সট (বাংলা)" valueEN={s.heroSub} valueBN={s.heroSub_bn||''} onChangeEN={v=>setS({...s,heroSub:v})} onChangeBN={v=>setS({...s,heroSub_bn:v})} textarea/>
      <Field label="Hero / Showreel Video URL" value={s.heroVideoUrl||''} onChange={v=>setS({...s,heroVideoUrl:v})} hint="YouTube link"/>

      <div style={{marginBottom:'1rem'}}>
        <label className="form-label" style={{display:'block',marginBottom:'0.5rem'}}>Rotating Words (EN + বাংলা)</label>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--text-3)',marginBottom:'0.4rem'}}>English</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem',marginBottom:'0.5rem'}}>
              {words.map((w,i)=><span key={i} className="feature-tag">{w}<button className="feature-remove" onClick={()=>setWords(words.filter((_,j)=>j!==i))}>×</button></span>)}
            </div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input className="input" style={{flex:1,fontSize:'0.82rem'}} value={newWord} onChange={e=>setNewWord(e.target.value)} placeholder="Add word…" onKeyDown={e=>{if(e.key==='Enter'&&newWord.trim()){setWords([...words,newWord.trim()]);setNewWord('');}}}/>
              <button className="admin-btn admin-btn-cyan" onClick={()=>{if(newWord.trim()){setWords([...words,newWord.trim()]);setNewWord('')}}}>+</button>
            </div>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--text-3)',marginBottom:'0.4rem'}}>বাংলা</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem',marginBottom:'0.5rem'}}>
              {wordsBN.map((w,i)=><span key={i} className="feature-tag">{w}<button className="feature-remove" onClick={()=>setWordsBN(wordsBN.filter((_,j)=>j!==i))}>×</button></span>)}
            </div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input className="input" style={{flex:1,fontSize:'0.82rem'}} value={newWordBN} onChange={e=>setNewWordBN(e.target.value)} placeholder="শব্দ যোগ করুন…" onKeyDown={e=>{if(e.key==='Enter'&&newWordBN.trim()){setWordsBN([...wordsBN,newWordBN.trim()]);setNewWordBN('');}}}/>
              <button className="admin-btn admin-btn-cyan" onClick={()=>{if(newWordBN.trim()){setWordsBN([...wordsBN,newWordBN.trim()]);setNewWordBN('')}}}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section-title" style={{marginTop:'1.5rem'}}>Analytics & Security</div>
      <div className="admin-form-grid">
        <Field label="Google Analytics 4 ID" value={s.gaId||''} onChange={v=>setS({...s,gaId:v})} hint="G-XXXXXXXXXX"/>
        <Field label="Admin PIN" value={s.adminPin||cfg.adminPin||'aipgbd2025'} onChange={v=>setS({...s,adminPin:v})} hint="4–8 chars"/>
      </div>
      <button className="btn btn-primary" onClick={save} style={{marginTop:'1rem'}}>💾 Save Site Settings</button>
    </div>
  );
}

// ─── Tab: Stats ───────────────────────────────────────────────────────────────
function TabStats({ cfg, onSave }) {
  const [stats,setStats]=useState(()=>cfg.stats.map(s=>({...s})));
  useEffect(()=>{ setStats(cfg.stats.map(s=>({...s}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...stats];a[i]={...a[i],[key]:val};setStats(a);};
  return (
    <div>
      <div className="admin-section-title">Hero Statistics</div>
      {stats.map((s,i)=>(
        <div key={i} className="pkg-edit-card" style={{padding:'1.25rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 80px 1fr 1fr',gap:'0.75rem',alignItems:'end'}}>
            <Field label="Number" value={s.num}      onChange={v=>update(i,'num',v)}/>
            <Field label="Unit"   value={s.unit}     onChange={v=>update(i,'unit',v)} hint="%/h/s"/>
            <Field label="Label (EN)" value={s.label}    onChange={v=>update(i,'label',v)}/>
            <Field label="Label (বাংলা)" value={s.label_bn||''} onChange={v=>update(i,'label_bn',v)}/>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={()=>onSave({...cfg,stats})}>💾 Save Stats</button>
    </div>
  );
}

// ─── Tab: Packages ────────────────────────────────────────────────────────────
function TabPackages({ cfg, onSave }) {
  const [pkgs,setPkgs]=useState(()=>cfg.packages.map(p=>({...p,features:[...p.features],features_bn:[...(p.features_bn||[])]})));
  const [newF,setNewF]=useState(()=>cfg.packages.map(()=>''));
  const [newFBN,setNewFBN]=useState(()=>cfg.packages.map(()=>''));
  useEffect(()=>{ setPkgs(cfg.packages.map(p=>({...p,features:[...p.features],features_bn:[...(p.features_bn||[])]})));setNewF(cfg.packages.map(()=>''));setNewFBN(cfg.packages.map(()=>'')); },[cfg]);
  const update=(i,key,val)=>{const a=[...pkgs];a[i]={...a[i],[key]:val};setPkgs(a);};
  const addF=(i)=>{if(!newF[i].trim())return;const a=[...pkgs];a[i].features=[...a[i].features,newF[i].trim()];setPkgs(a);const n=[...newF];n[i]='';setNewF(n);};
  const addFBN=(i)=>{if(!newFBN[i].trim())return;const a=[...pkgs];a[i].features_bn=[...(a[i].features_bn||[]),newFBN[i].trim()];setPkgs(a);const n=[...newFBN];n[i]='';setNewFBN(n);};
  const removeF=(pi,fi)=>{const a=[...pkgs];a[pi].features=a[pi].features.filter((_,j)=>j!==fi);setPkgs(a);};
  const removeFBN=(pi,fi)=>{const a=[...pkgs];a[pi].features_bn=(a[pi].features_bn||[]).filter((_,j)=>j!==fi);setPkgs(a);};
  return (
    <div>
      <div className="admin-section-title">Service Packages</div>
      {pkgs.map((pkg,i)=>(
        <div key={i} className="pkg-edit-card">
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-3)',letterSpacing:'0.15em'}}>PACKAGE {pkg.num}</span>
            <label style={{display:'flex',alignItems:'center',gap:'0.4rem',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-2)',marginLeft:'auto',cursor:'pointer'}}>
              <input type="checkbox" checked={!!pkg.popular} onChange={e=>update(i,'popular',e.target.checked)}/> Most Popular badge
            </label>
          </div>
          <BilField labelEN="Package Name (EN)" labelBN="প্যাকেজ নাম (বাংলা)" valueEN={pkg.title} valueBN={pkg.title_bn||''} onChangeEN={v=>update(i,'title',v)} onChangeBN={v=>update(i,'title_bn',v)}/>
          <div className="admin-form-grid">
            <Field label="Price (no ৳)" value={pkg.price} onChange={v=>update(i,'price',v)}/>
            <Field label="Price Unit" value={pkg.unit} onChange={v=>update(i,'unit',v)} hint="BDT / video"/>
          </div>
          <BilField labelEN="Description (EN)" labelBN="বিবরণ (বাংলা)" valueEN={pkg.desc} valueBN={pkg.desc_bn||''} onChangeEN={v=>update(i,'desc',v)} onChangeBN={v=>update(i,'desc_bn',v)} textarea/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'0.5rem'}}>
            <div>
              <label className="form-label" style={{display:'block',marginBottom:'0.4rem'}}>Features (EN)</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.25rem',marginBottom:'0.4rem'}}>
                {pkg.features.map((f,fi)=><span key={fi} className="feature-tag">{f}<button className="feature-remove" onClick={()=>removeF(i,fi)}>×</button></span>)}
              </div>
              <div style={{display:'flex',gap:'0.4rem'}}>
                <input className="input" style={{flex:1,fontSize:'0.78rem'}} value={newF[i]||''} onChange={e=>{const n=[...newF];n[i]=e.target.value;setNewF(n);}} placeholder="Add feature…" onKeyDown={e=>{if(e.key==='Enter')addF(i);}}/>
                <button className="admin-btn admin-btn-cyan" onClick={()=>addF(i)}>+</button>
              </div>
            </div>
            <div>
              <label className="form-label" style={{display:'block',marginBottom:'0.4rem'}}>Features (বাংলা)</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.25rem',marginBottom:'0.4rem'}}>
                {(pkg.features_bn||[]).map((f,fi)=><span key={fi} className="feature-tag">{f}<button className="feature-remove" onClick={()=>removeFBN(i,fi)}>×</button></span>)}
              </div>
              <div style={{display:'flex',gap:'0.4rem'}}>
                <input className="input" style={{flex:1,fontSize:'0.78rem'}} value={newFBN[i]||''} onChange={e=>{const n=[...newFBN];n[i]=e.target.value;setNewFBN(n);}} placeholder="ফিচার যোগ করুন…" onKeyDown={e=>{if(e.key==='Enter')addFBN(i);}}/>
                <button className="admin-btn admin-btn-cyan" onClick={()=>addFBN(i)}>+</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={()=>onSave({...cfg,packages:pkgs})}>💾 Save Packages</button>
    </div>
  );
}

// ─── Tab: Portfolio ───────────────────────────────────────────────────────────
function TabPortfolio({ cfg, onSave }) {
  const [items,setItems]=useState(()=>(cfg.portfolio||[]).map(i=>({...i})));
  const [expanded,setExpanded]=useState(null);
  useEffect(()=>{ setItems((cfg.portfolio||[]).map(i=>({...i}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...items];a[i]={...a[i],[key]:val};setItems(a);};
  const remove=(i)=>{if(window.confirm('Remove?'))setItems(items.filter((_,j)=>j!==i));};
  const add=()=>{ setItems([...items,{title:'New Project',client:'',category:'Brand Video',desc:'',videoUrl:'',thumbnail:'',slug:'',challenge:'',solution:'',results:'',metrics:[]}]); setExpanded(items.length); };
  const move=(i,dir)=>{const a=[...items];const j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];setItems(a);};
  const CATS=['Brand Video','Product Video','Real Estate','Restaurant','E-commerce','Website','Other'];
  const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  return (
    <div>
      <div className="admin-section-title">Portfolio / Our Work</div>
      <p style={{color:'var(--text-2)',fontSize:'0.82rem',marginBottom:'1.5rem',fontFamily:'var(--font-mono)'}}>Add YouTube links — thumbnails auto-fetch. Fill slug + challenge/solution for case study pages.</p>
      {items.map((item,i)=>{
        const ytMatch=item.videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
        const thumb=item.thumbnail||(ytMatch?`https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`:null);
        return (
          <div key={i} className="faq-edit-card" style={{position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',cursor:'pointer'}} onClick={()=>setExpanded(expanded===i?null:i)}>
              {thumb?<img src={thumb} alt="" style={{width:60,height:40,objectFit:'cover',borderRadius:4,flexShrink:0}}/>:<div style={{width:60,height:40,background:'var(--bg-2)',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>🎬</div>}
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text-0)'}}>{item.title||'Untitled'}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--text-3)'}}>{item.client} · {item.category}{item.slug?` · /${item.slug}`:''}</div>
              </div>
              <div style={{display:'flex',gap:'0.3rem',alignItems:'center'}}>
                <button className="admin-btn" style={{color:'var(--text-3)',borderColor:'var(--border)',padding:'0.2em 0.5em'}} onClick={e=>{e.stopPropagation();move(i,-1);}}>↑</button>
                <button className="admin-btn" style={{color:'var(--text-3)',borderColor:'var(--border)',padding:'0.2em 0.5em'}} onClick={e=>{e.stopPropagation();move(i,1);}}>↓</button>
                <button className="admin-btn admin-btn-red" onClick={e=>{e.stopPropagation();remove(i);}}>✕</button>
                <span style={{color:'var(--text-2)',transform:expanded===i?'rotate(180deg)':'none',transition:'transform 0.2s',fontSize:'0.8rem'}}>▾</span>
              </div>
            </div>
            {expanded===i&&(
              <div style={{marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--border)',animation:'fadeIn 0.2s'}}>
                <div className="admin-form-grid">
                  <Field label="Project Title" value={item.title}   onChange={v=>update(i,'title',v)}/>
                  <Field label="Client / Brand" value={item.client}  onChange={v=>update(i,'client',v)}/>
                </div>
                <div className="admin-form-grid">
                  <div className="form-group" style={{marginBottom:'0.75rem'}}>
                    <label className="form-label">Category</label>
                    <select className="input" value={item.category} onChange={e=>update(i,'category',e.target.value)}>
                      {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Field label="URL Slug" value={item.slug||''} onChange={v=>update(i,'slug',v)} hint={`auto: ${slugify(item.title||'project')}`}/>
                </div>
                <div className="admin-form-grid">
                  <Field label="YouTube / Vimeo URL" value={item.videoUrl}   onChange={v=>update(i,'videoUrl',v)}   hint="youtube.com/watch?v=…"/>
                  <Field label="Custom Thumbnail URL" value={item.thumbnail} onChange={v=>update(i,'thumbnail',v)} hint="leave blank for auto"/>
                </div>
                <Field label="Short Description" value={item.desc} onChange={v=>update(i,'desc',v)} textarea/>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--cyan)',letterSpacing:'0.1em',margin:'0.75rem 0 0.5rem'}}>▸ Case Study Fields (for /work/{item.slug||'slug'} page)</div>
                <Field label="The Challenge" value={item.challenge||''} onChange={v=>update(i,'challenge',v)} textarea/>
                <Field label="Our Solution"  value={item.solution||''}  onChange={v=>update(i,'solution',v)}  textarea/>
                <Field label="Results"       value={item.results||''}   onChange={v=>update(i,'results',v)}   textarea/>
                {thumb&&<img src={thumb} alt="thumb" style={{height:70,borderRadius:4,border:'1px solid var(--border)',marginTop:'0.5rem'}}/>}
              </div>
            )}
          </div>
        );
      })}
      <div style={{display:'flex',gap:'1rem',marginTop:'1rem'}}>
        <button className="admin-btn admin-btn-cyan" onClick={add}>+ Add Work</button>
        <button className="btn btn-primary" onClick={()=>onSave({...cfg,portfolio:items})}>💾 Save Portfolio</button>
      </div>
    </div>
  );
}

// ─── Tab: Process ─────────────────────────────────────────────────────────────
function TabProcess({ cfg, onSave }) {
  const [steps,setSteps]=useState(()=>cfg.process.map(s=>({...s})));
  useEffect(()=>{ setSteps(cfg.process.map(s=>({...s}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...steps];a[i]={...a[i],[key]:val};setSteps(a);};
  return (
    <div>
      <div className="admin-section-title">Production Process Steps</div>
      {steps.map((s,i)=>(
        <div key={i} className="faq-edit-card">
          <div className="admin-form-grid">
            <Field label="Tool Name"  value={s.tool}  onChange={v=>update(i,'tool',v)}/>
            <Field label="Step Title (EN)" value={s.title} onChange={v=>update(i,'title',v)}/>
          </div>
          <div className="admin-form-grid">
            <Field label="Step Title (বাংলা)" value={s.title_bn||''} onChange={v=>update(i,'title_bn',v)}/>
            <div className="admin-form-grid" style={{gap:'0.5rem'}}>
              <Field label="Icon" value={s.icon}  onChange={v=>update(i,'icon',v)}  hint="emoji"/>
              <Field label="Color" value={s.color} onChange={v=>update(i,'color',v)} hint="var(--cyan)"/>
            </div>
          </div>
          <BilField labelEN="Description (EN)" labelBN="বিবরণ (বাংলা)" valueEN={s.desc} valueBN={s.desc_bn||''} onChangeEN={v=>update(i,'desc',v)} onChangeBN={v=>update(i,'desc_bn',v)} textarea/>
        </div>
      ))}
      <button className="btn btn-primary" onClick={()=>onSave({...cfg,process:steps})}>💾 Save Process</button>
    </div>
  );
}

// ─── Tab: Industries ──────────────────────────────────────────────────────────
function TabIndustries({ cfg, onSave }) {
  const [niches,setNiches]=useState(()=>cfg.niches.map(n=>({...n})));
  useEffect(()=>{ setNiches(cfg.niches.map(n=>({...n}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...niches];a[i]={...a[i],[key]:val};setNiches(a);};
  const remove=(i)=>{if(window.confirm('Remove?'))setNiches(niches.filter((_,j)=>j!==i));};
  const add=()=>setNiches([...niches,{icon:'⬡',title:'New Industry',title_bn:'',pain:'',pain_bn:'',roi:'',roi_bn:'',tag:'New',tagColor:'cyan'}]);
  return (
    <div>
      <div className="admin-section-title">Industries / Niches</div>
      {niches.map((n,i)=>(
        <div key={i} className="faq-edit-card" style={{position:'relative'}}>
          <button className="admin-btn admin-btn-red" style={{position:'absolute',top:'1rem',right:'1rem'}} onClick={()=>remove(i)}>✕</button>
          <div className="admin-form-grid">
            <Field label="Icon" value={n.icon} onChange={v=>update(i,'icon',v)}/>
            <div className="form-group" style={{marginBottom:'0.75rem'}}>
              <label className="form-label">Badge Color</label>
              <select className="input" value={n.tagColor} onChange={e=>update(i,'tagColor',e.target.value)}>
                {['cyan','purple','magenta','green'].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <BilField labelEN="Industry Title (EN)" labelBN="শিল্পের নাম (বাংলা)" valueEN={n.title} valueBN={n.title_bn||''} onChangeEN={v=>update(i,'title',v)} onChangeBN={v=>update(i,'title_bn',v)}/>
          <Field label="Badge Label" value={n.tag} onChange={v=>update(i,'tag',v)}/>
          <BilField labelEN="Pain Point (EN)" labelBN="সমস্যা (বাংলা)" valueEN={n.pain} valueBN={n.pain_bn||''} onChangeEN={v=>update(i,'pain',v)} onChangeBN={v=>update(i,'pain_bn',v)} textarea/>
          <BilField labelEN="ROI Statement (EN)" labelBN="ROI (বাংলা)" valueEN={n.roi} valueBN={n.roi_bn||''} onChangeEN={v=>update(i,'roi',v)} onChangeBN={v=>update(i,'roi_bn',v)}/>
        </div>
      ))}
      <div style={{display:'flex',gap:'1rem',marginTop:'0.5rem'}}>
        <button className="admin-btn admin-btn-cyan" onClick={add}>+ Add Industry</button>
        <button className="btn btn-primary" onClick={()=>onSave({...cfg,niches})}>💾 Save Industries</button>
      </div>
    </div>
  );
}

// ─── Tab: Testimonials ────────────────────────────────────────────────────────
function TabTestimonials({ cfg, onSave }) {
  const [items,setItems]=useState(()=>(cfg.testimonials||[]).map(t=>({...t})));
  useEffect(()=>{ setItems((cfg.testimonials||[]).map(t=>({...t}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...items];a[i]={...a[i],[key]:val};setItems(a);};
  const remove=(i)=>{if(window.confirm('Remove?'))setItems(items.filter((_,j)=>j!==i));};
  const add=()=>setItems([...items,{name:'Client Name',role:'CEO',company:'Brand Co.',quote:'',quote_bn:'',result:'',result_bn:'',stars:5}]);
  return (
    <div>
      <div className="admin-section-title">Testimonials</div>
      {items.map((te,i)=>(
        <div key={i} className="faq-edit-card" style={{position:'relative'}}>
          <button className="admin-btn admin-btn-red" style={{position:'absolute',top:'1rem',right:'1rem'}} onClick={()=>remove(i)}>✕</button>
          <div className="admin-form-grid">
            <Field label="Client Name" value={te.name}    onChange={v=>update(i,'name',v)}/>
            <Field label="Role"        value={te.role}    onChange={v=>update(i,'role',v)}/>
          </div>
          <div className="admin-form-grid">
            <Field label="Company"     value={te.company} onChange={v=>update(i,'company',v)}/>
            <div className="form-group" style={{marginBottom:'0.75rem'}}>
              <label className="form-label">Stars</label>
              <select className="input" value={te.stars||5} onChange={e=>update(i,'stars',parseInt(e.target.value))}>
                {[5,4,3].map(n=><option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
          </div>
          <BilField labelEN="Quote (EN)" labelBN="উদ্ধৃতি (বাংলা)" valueEN={te.quote} valueBN={te.quote_bn||''} onChangeEN={v=>update(i,'quote',v)} onChangeBN={v=>update(i,'quote_bn',v)} textarea/>
          <BilField labelEN="Result (EN)" labelBN="ফলাফল (বাংলা)" valueEN={te.result} valueBN={te.result_bn||''} onChangeEN={v=>update(i,'result',v)} onChangeBN={v=>update(i,'result_bn',v)}/>
        </div>
      ))}
      <div style={{display:'flex',gap:'1rem',marginTop:'0.5rem'}}>
        <button className="admin-btn admin-btn-cyan" onClick={add}>+ Add Testimonial</button>
        <button className="btn btn-primary" onClick={()=>onSave({...cfg,testimonials:items})}>💾 Save Testimonials</button>
      </div>
    </div>
  );
}

// ─── Tab: FAQ ─────────────────────────────────────────────────────────────────
function TabFAQ({ cfg, onSave }) {
  const [faqs,setFaqs]=useState(()=>cfg.faqs.map(f=>({...f})));
  useEffect(()=>{ setFaqs(cfg.faqs.map(f=>({...f}))); },[cfg]);
  const update=(i,key,val)=>{const a=[...faqs];a[i]={...a[i],[key]:val};setFaqs(a);};
  const remove=(i)=>setFaqs(faqs.filter((_,j)=>j!==i));
  const add=()=>setFaqs([...faqs,{q:'New question?',q_bn:'নতুন প্রশ্ন?',a:'Answer here.',a_bn:'উত্তর এখানে।'}]);
  return (
    <div>
      <div className="admin-section-title">Frequently Asked Questions</div>
      {faqs.map((faq,i)=>(
        <div key={i} className="faq-edit-card" style={{position:'relative'}}>
          <button className="admin-btn admin-btn-red" style={{position:'absolute',top:'1rem',right:'1rem'}} onClick={()=>remove(i)}>✕</button>
          <BilField labelEN={`Q${i+1} Question (EN)`} labelBN="প্রশ্ন (বাংলা)" valueEN={faq.q} valueBN={faq.q_bn||''} onChangeEN={v=>update(i,'q',v)} onChangeBN={v=>update(i,'q_bn',v)}/>
          <BilField labelEN="Answer (EN)" labelBN="উত্তর (বাংলা)" valueEN={faq.a} valueBN={faq.a_bn||''} onChangeEN={v=>update(i,'a',v)} onChangeBN={v=>update(i,'a_bn',v)} textarea/>
        </div>
      ))}
      <div style={{display:'flex',gap:'1rem',marginTop:'0.5rem'}}>
        <button className="admin-btn admin-btn-cyan" onClick={add}>+ Add FAQ</button>
        <button className="btn btn-primary" onClick={()=>onSave({...cfg,faqs})}>💾 Save FAQs</button>
      </div>
    </div>
  );
}

// ─── Tab: Blog ────────────────────────────────────────────────────────────────
function TabBlog({ cfg, showToast }) {
  const [posts,setPosts]=useState([]);
  const [editing,setEditing]=useState(null);
  const [loading,setLoading]=useState(true);
  const [QuillEditor,setQE]=useState(null);
  useEffect(()=>{ import('react-quill').then(m=>setQE(()=>m.default)).catch(()=>{}); },[]);
  useEffect(()=>{
    if(!isSupabaseReady){setLoading(false);return;}
    dbGetPosts(false).then(data=>{setPosts(data||[]);setLoading(false);});
  },[]);
  const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const save=async()=>{
    if(!editing.title){showToast('Title is required','error');return;}
    if(!editing.slug)editing.slug=slugify(editing.title);
    if(!isSupabaseReady){showToast('Supabase not connected','error');return;}
    const ok=await dbSavePost(editing);
    if(ok){showToast('✓ Post saved!','success');const data=await dbGetPosts(false);setPosts(data||[]);setEditing(null);}
    else showToast('Save failed','error');
  };
  const remove=async(id)=>{if(!window.confirm('Delete?'))return;await dbDeletePost(id);setPosts(posts.filter(p=>p.id!==id));};
  const qModules={toolbar:[[{header:[2,3,false]}],['bold','italic','underline','blockquote'],[{list:'ordered'},{list:'bullet'}],['link','image'],['clean']]};

  if(editing!==null) return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
        <button className="admin-btn admin-btn-cyan" onClick={()=>setEditing(null)}>← Back</button>
        <div className="admin-section-title" style={{margin:0,border:'none',padding:0}}>{editing.id?'Edit Post':'New Post'}</div>
      </div>
      <BilField labelEN="Title (EN)" labelBN="শিরোনাম (বাংলা)" valueEN={editing.title} valueBN={editing.title_bn||''} onChangeEN={v=>setEditing({...editing,title:v,slug:editing.id?editing.slug:slugify(v)})} onChangeBN={v=>setEditing({...editing,title_bn:v})}/>
      <div className="admin-form-grid">
        <Field label="Slug (URL)" value={editing.slug||''} onChange={v=>setEditing({...editing,slug:v})} hint="auto from title"/>
        <div className="form-group" style={{marginBottom:'0.75rem'}}>
          <label className="form-label">Category</label>
          <select className="input" value={editing.category||'General'} onChange={e=>setEditing({...editing,category:e.target.value})}>
            {['AI Production','Voiceover','Case Study','Industry Tips','Web Development','General'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <BilField labelEN="Excerpt (EN)" labelBN="সারসংক্ষেপ (বাংলা)" valueEN={editing.excerpt||''} valueBN={editing.excerpt_bn||''} onChangeEN={v=>setEditing({...editing,excerpt:v})} onChangeBN={v=>setEditing({...editing,excerpt_bn:v})} textarea/>
      <Field label="Cover Image URL" value={editing.cover_url||''} onChange={v=>setEditing({...editing,cover_url:v})}/>
      {['content','content_bn'].map(key=>(
        <div key={key} style={{marginBottom:'0.75rem'}}>
          <label className="form-label" style={{display:'block',marginBottom:'0.4rem'}}>{key==='content'?'Content (EN)':'Content (বাংলা)'}</label>
          {QuillEditor
            ?<div style={{background:'var(--bg-0)',borderRadius:'var(--r-md)',border:'1px solid var(--border)'}}>
               <QuillEditor value={editing[key]||''} onChange={v=>setEditing({...editing,[key]:v})} modules={qModules} theme="snow" style={{minHeight:180}}/>
             </div>
            :<textarea className="input" rows={7} value={editing[key]||''} onChange={e=>setEditing({...editing,[key]:e.target.value})} placeholder={key==='content'?'Write in HTML or plain text…':'বাংলায় লিখুন...'}/>}
        </div>
      ))}
      <div style={{display:'flex',gap:'1rem',alignItems:'center',marginTop:'1rem'}}>
        <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontFamily:'var(--font-mono)',fontSize:'0.72rem',color:'var(--text-1)',cursor:'pointer'}}>
          <input type="checkbox" checked={!!editing.published} onChange={e=>setEditing({...editing,published:e.target.checked})}/> Published
        </label>
        <button className="btn btn-primary" onClick={save}>💾 Save Post</button>
        <button className="admin-btn" style={{color:'var(--text-2)',borderColor:'var(--border)'}} onClick={()=>setEditing(null)}>Cancel</button>
      </div>
      <style>{`.ql-toolbar{background:var(--bg-2)!important;border-color:var(--border)!important;border-radius:var(--r-md) var(--r-md) 0 0!important}.ql-container{border-color:var(--border)!important;border-radius:0 0 var(--r-md) var(--r-md)!important}.ql-editor{min-height:180px;color:var(--text-0)!important;font-size:0.95rem!important}`}</style>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div className="admin-section-title" style={{margin:0,border:'none',padding:0}}>Blog Posts</div>
        <button className="btn btn-primary" onClick={()=>setEditing({title:'',title_bn:'',slug:'',excerpt:'',excerpt_bn:'',content:'',content_bn:'',category:'General',cover_url:'',published:false})} style={{padding:'0.5em 1.2em',fontSize:'0.82rem'}}>+ New Post</button>
      </div>
      {!isSupabaseReady&&<div style={{padding:'1rem',background:'var(--purple-dim)',border:'1px solid rgba(155,89,255,0.3)',borderRadius:'var(--r-md)',marginBottom:'1.5rem',fontFamily:'var(--font-mono)',fontSize:'0.72rem',color:'var(--purple)',lineHeight:1.7}}>⚠ Supabase not connected — add .env keys to save blog posts.</div>}
      {loading&&<div style={{color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>Loading posts…</div>}
      {!loading&&posts.length===0&&<div style={{border:'1px dashed var(--border)',borderRadius:'var(--r-md)',padding:'2rem',textAlign:'center',color:'var(--text-3)',fontFamily:'var(--font-mono)',fontSize:'0.75rem'}}>No posts yet. Click "+ New Post".</div>}
      {posts.map(post=>(
        <div key={post.id} className="admin-inq-card" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text-0)'}}>{post.title}</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--text-3)',marginTop:'0.15rem'}}>{post.category} · {new Date(post.created_at).toLocaleDateString()} · {post.views||0} views</div>
          </div>
          <span className={`status-badge ${post.published?'status-new':'status-closed'}`}>{post.published?'Live':'Draft'}</span>
          <button className="admin-btn admin-btn-cyan" onClick={()=>setEditing({...post})}>Edit</button>
          <button className="admin-btn admin-btn-red" onClick={()=>remove(post.id)}>🗑</button>
        </div>
      ))}
    </div>
  );
}



// ─── Tab: Chatbot ─────────────────────────────────────────────────────────────
function TabChatbot({ cfg, onSave }) {
  const [bot, setBot] = useState(() => ({ ...(cfg.chatbot || {}) }));
  const [qaList, setQaList] = useState(() => [...(cfg.chatbot?.qaList || [])]);
  const [newQ, setNewQ] = useState(''); const [newA, setNewA] = useState('');
  useEffect(() => { setBot({ ...(cfg.chatbot || {}) }); setQaList([...(cfg.chatbot?.qaList || [])]); }, [cfg]);

  const addQA = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setQaList([...qaList, { q: newQ.trim(), a: newA.trim() }]);
    setNewQ(''); setNewA('');
  };
  const removeQA = (i) => setQaList(qaList.filter((_, j) => j !== i));
  const save = () => onSave({ ...cfg, chatbot: { ...bot, qaList } });

  return (
    <div>
      <div className="admin-section-title">Chatbot Settings</div>
      <div className="admin-form-grid">
        <Field label="Bot Name" value={bot.botName||''} onChange={v=>setBot({...bot,botName:v})}/>
        <div className="form-group" style={{marginBottom:'0.75rem'}}>
          <label className="form-label">Chatbot Enabled</label>
          <select className="input" value={bot.enabled?'yes':'no'} onChange={e=>setBot({...bot,enabled:e.target.value==='yes'})}>
            <option value="yes">Enabled — show on site</option>
            <option value="no">Disabled — hide from site</option>
          </select>
        </div>
      </div>
      <BilField labelEN="Greeting Message (EN)" labelBN="অভিবাদন বার্তা (বাংলা)" valueEN={bot.greeting||''} valueBN={bot.greeting_bn||''} onChangeEN={v=>setBot({...bot,greeting:v})} onChangeBN={v=>setBot({...bot,greeting_bn:v})} textarea/>

      <div className="admin-section-title" style={{marginTop:'1.5rem'}}>Knowledge Base</div>
      <p style={{color:'var(--text-2)',fontSize:'0.78rem',marginBottom:'0.75rem',fontFamily:'var(--font-mono)'}}>
        Write anything about your business — services, pricing, process, FAQs. The AI reads this to answer questions. Leave blank to use the default built-in knowledge.
      </p>
      <Field label="Knowledge Base (free text)" value={bot.knowledgeBase||''} onChange={v=>setBot({...bot,knowledgeBase:v})} textarea hint="paste any info about your business"/>

      <div className="admin-section-title" style={{marginTop:'1.5rem'}}>Q&A Pairs</div>
      <p style={{color:'var(--text-2)',fontSize:'0.78rem',marginBottom:'1rem',fontFamily:'var(--font-mono)'}}>
        Add specific Q&A pairs for precise answers. Works in both EN and Bangla.
      </p>

      {qaList.map((qa, i) => (
        <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',padding:'0.9rem 1rem',marginBottom:'0.5rem',position:'relative'}}>
          <button className="admin-btn admin-btn-red" style={{position:'absolute',top:'0.6rem',right:'0.6rem',padding:'0.15em 0.5em',fontSize:'0.65rem'}} onClick={()=>removeQA(i)}>✕</button>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--cyan)',marginBottom:'0.25rem'}}>Q: {qa.q}</div>
          <div style={{fontSize:'0.82rem',color:'var(--text-1)',lineHeight:1.55}}>A: {qa.a}</div>
        </div>
      ))}

      <div style={{background:'var(--surface)',border:'1px dashed var(--border-active)',borderRadius:'var(--r-md)',padding:'1rem',marginTop:'0.5rem'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-3)',marginBottom:'0.5rem',textTransform:'uppercase',letterSpacing:'0.1em'}}>Add new Q&A</div>
        <Field label="Question (EN or বাংলা)" value={newQ} onChange={setNewQ}/>
        <Field label="Answer" value={newA} onChange={setNewA} textarea/>
        <button className="admin-btn admin-btn-cyan" onClick={addQA}>+ Add Q&A Pair</button>
      </div>

      <button className="btn btn-primary" onClick={save} style={{marginTop:'1.5rem'}}>💾 Save Chatbot Settings</button>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel({ cfg, onClose, onSave, onReset, showToast }) {
  const [unlocked,setUnlocked]=useState(false);
  const [tab,setTab]=useState('dashboard');

  const tabs=[
    {id:'dashboard',  label:'📊 Dashboard'},
    {id:'inquiries',  label:'📥 Inquiries'},
    {id:'site',       label:'🔧 Site'},
    {id:'stats',      label:'📈 Stats'},
    {id:'packages',   label:'📦 Packages'},
    {id:'portfolio',  label:'🎬 Portfolio'},
    {id:'testimonials',label:'⭐ Testimonials'},
    {id:'process',    label:'⚙ Process'},
    {id:'industries', label:'🏢 Industries'},
    {id:'faq',        label:'❓ FAQ'},
    {id:'chatbot',    label:'🤖 Chatbot'},
    {id:'blog',       label:'✍ Blog'},
    {id:'social',     label:'📡 Social Hub'},
  ];

  return (
    <div className="admin-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="admin-panel" onClick={e=>e.stopPropagation()}>
        <div className="admin-header">
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:300,color:'var(--text-0)'}}>Admin Panel</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'0.58rem',color:'var(--green)',letterSpacing:'0.15em',textTransform:'uppercase',background:'rgba(0,255,163,0.08)',border:'1px solid rgba(0,255,163,0.25)',padding:'0.2em 0.6em',borderRadius:100}}>● LIVE</span>
            {isSupabaseReady&&<span style={{fontFamily:'var(--font-mono)',fontSize:'0.58rem',color:'var(--cyan)',letterSpacing:'0.12em',textTransform:'uppercase',background:'var(--cyan-dim)',border:'1px solid var(--cyan-mid)',padding:'0.2em 0.6em',borderRadius:100}}>☁ Cloud</span>}
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
            {unlocked&&<button className="admin-btn admin-btn-red" onClick={onReset}>↺ Reset All</button>}
            <button onClick={onClose} style={{background:'none',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',padding:'0.4em 0.9em',color:'var(--text-1)',fontSize:'0.85rem',transition:'all 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--magenta)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>✕ Close</button>
          </div>
        </div>

        {!unlocked ? <PinGate cfg={cfg} onUnlock={()=>setUnlocked(true)}/> : (
          <>
            <div className="admin-tabs">
              {tabs.map(t=><button key={t.id} className={`admin-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
            </div>
            <div className="admin-body">
              {tab==='dashboard'   && <TabDashboard/>}
              {tab==='inquiries'   && <TabInquiries/>}
              {tab==='site'        && <TabSite        cfg={cfg} onSave={onSave}/>}
              {tab==='stats'       && <TabStats       cfg={cfg} onSave={onSave}/>}
              {tab==='packages'    && <TabPackages    cfg={cfg} onSave={onSave}/>}
              {tab==='portfolio'   && <TabPortfolio   cfg={cfg} onSave={onSave}/>}
              {tab==='testimonials'&& <TabTestimonials cfg={cfg} onSave={onSave}/>}
              {tab==='process'     && <TabProcess     cfg={cfg} onSave={onSave}/>}
              {tab==='industries'  && <TabIndustries  cfg={cfg} onSave={onSave}/>}
              {tab==='faq'         && <TabFAQ         cfg={cfg} onSave={onSave}/>}
              {tab==='chatbot'     && <TabChatbot     cfg={cfg} onSave={onSave}/>}
              {tab==='blog'        && <TabBlog        cfg={cfg} onSave={onSave} showToast={showToast}/>}
              {tab==='social'      && <SocialCommandCenter divisionId={1}/>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
