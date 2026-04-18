// ═══════════════════════════════════════════════════════════════════
//  AIPG Admin — Division Content Tabs
//  Drop-in additions for AdminPanel.js
//  Exports: TabVideos, TabStudiosContent, TabSystemsContent, TabNexus
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';

// ── Shared field helpers ──────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, textarea, hint, type='text' }) {
  return (
    <div style={{ marginBottom:'0.85rem' }}>
      <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'0.35rem' }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value||''}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width:'100%', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:8, padding:'0.6rem 0.9rem', color:'var(--text-0)', fontFamily:'var(--font-body)', fontSize:'0.88rem', resize:'vertical', boxSizing:'border-box' }}
        />
      ) : (
        <input
          type={type}
          value={value||''}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width:'100%', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:8, padding:'0.6rem 0.9rem', color:'var(--text-0)', fontFamily:'var(--font-body)', fontSize:'0.88rem', boxSizing:'border-box' }}
        />
      )}
      {hint && <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--text-3)', marginTop:'0.25rem' }}>{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--cyan)', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'1.2rem', marginTop:'1.5rem' }}>
      {children}
    </div>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button
      onClick={onClick}
      style={{ padding:'0.6rem 1.8rem', background:'var(--cyan)', border:'none', borderRadius:8, color:'#000', fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.15em', fontWeight:700, cursor:'pointer', opacity:saving?0.7:1, marginTop:'1rem' }}
    >
      {saving ? 'Saving…' : '💾 Save Changes'}
    </button>
  );
}

// ── Tab: Videos ───────────────────────────────────────────────────────────────

export function TabVideos({ cfg, onSave }) {
  const [v, setV] = useState(() => ({ ...{ nexusBgYoutubeId:'', studiosBgYoutubeId:'', systemsBgYoutubeId:'', nexusBgOpacity:0.35, studiosBgOpacity:0.3, systemsBgOpacity:0.25 }, ...(cfg.videos||{}) }));

  const save = () => onSave({ ...cfg, videos: v });

  const YTPreview = ({ id }) => id ? (
    <div style={{ marginTop:'0.5rem', borderRadius:8, overflow:'hidden', border:'1px solid var(--border)', aspectRatio:'16/9', maxWidth:320 }}>
      <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
    </div>
  ) : null;

  return (
    <div>
      <div className="admin-section-title">Background Videos</div>
      <p style={{ color:'var(--text-2)', fontSize:'0.82rem', marginBottom:'1.5rem', fontFamily:'var(--font-mono)' }}>
        Paste the YouTube video ID (the part after <code>?v=</code> or in Shorts URLs after <code>/shorts/</code>).
        Videos autoplay muted and looped as backgrounds.
      </p>

      <SectionTitle>Nexus Landing Page</SectionTitle>
      <Field label="YouTube Video ID" value={v.nexusBgYoutubeId} onChange={val=>setV({...v,nexusBgYoutubeId:val})} placeholder="_quzojxLBJw" hint="e.g. from youtube.com/shorts/_quzojxLBJw" />
      <Field label="Opacity (0.1 – 0.6)" value={v.nexusBgOpacity} onChange={val=>setV({...v,nexusBgOpacity:parseFloat(val)||0.35})} type="number" placeholder="0.35" />
      <YTPreview id={v.nexusBgYoutubeId} />

      <SectionTitle>Studios Page</SectionTitle>
      <Field label="YouTube Video ID" value={v.studiosBgYoutubeId} onChange={val=>setV({...v,studiosBgYoutubeId:val})} placeholder="sEg2qr-TyY0" />
      <Field label="Opacity (0.1 – 0.6)" value={v.studiosBgOpacity} onChange={val=>setV({...v,studiosBgOpacity:parseFloat(val)||0.3})} type="number" placeholder="0.3" />
      <YTPreview id={v.studiosBgYoutubeId} />

      <SectionTitle>Systems Page</SectionTitle>
      <Field label="YouTube Video ID" value={v.systemsBgYoutubeId} onChange={val=>setV({...v,systemsBgYoutubeId:val})} placeholder="RUorlCF5zH4" />
      <Field label="Opacity (0.1 – 0.6)" value={v.systemsBgOpacity} onChange={val=>setV({...v,systemsBgOpacity:parseFloat(val)||0.25})} type="number" placeholder="0.25" />
      <YTPreview id={v.systemsBgYoutubeId} />

      <SaveBtn onClick={save} />
    </div>
  );
}

// ── Tab: Nexus ────────────────────────────────────────────────────────────────

export function TabNexus({ cfg, onSave }) {
  const [nx, setNx] = useState(() => ({ ...(cfg.nexus||{}) }));
  const f = (key) => (val) => setNx(p=>({...p,[key]:val}));
  const save = () => onSave({ ...cfg, nexus: nx });

  return (
    <div>
      <div className="admin-section-title">Nexus Landing Page</div>

      <SectionTitle>Center Logo</SectionTitle>
      <Field label="Logo Text" value={nx.centerLogoText} onChange={f('centerLogoText')} placeholder="AIPG" />
      <Field label="Logo Subtext" value={nx.centerLogoSub} onChange={f('centerLogoSub')} placeholder="AI Playground BD" />
      <Field label="Bottom Hint" value={nx.hint} onChange={f('hint')} placeholder="Hover to explore · Click to enter" />

      <SectionTitle>Studios Side</SectionTitle>
      <Field label="Eyebrow" value={nx.studiosEyebrow} onChange={f('studiosEyebrow')} placeholder="Division I" />
      <Field label="Title" value={nx.studiosLabel} onChange={f('studiosLabel')} placeholder="Cinematic AI Production" />
      <Field label="Subtitle" value={nx.studiosSub} onChange={f('studiosSub')} textarea placeholder="High-fidelity AI video production..." />
      <Field label="Button Text" value={nx.studiosBtn} onChange={f('studiosBtn')} placeholder="Enter Studios" />

      <SectionTitle>Systems Side</SectionTitle>
      <Field label="Eyebrow" value={nx.systemsEyebrow} onChange={f('systemsEyebrow')} placeholder="Division II" />
      <Field label="Title" value={nx.systemsLabel} onChange={f('systemsLabel')} placeholder="Enterprise Software" />
      <Field label="Subtitle" value={nx.systemsSub} onChange={f('systemsSub')} textarea placeholder="Production-grade React & ASP.NET..." />
      <Field label="Button Text" value={nx.systemsBtn} onChange={f('systemsBtn')} placeholder="Enter Systems" />

      <SaveBtn onClick={save} />
    </div>
  );
}

// ── Showreel editor (shared) ──────────────────────────────────────────────────

function ShowreelEditor({ showreel, onChange, division }) {
  const [editIdx, setEditIdx] = useState(null);
  const blank = { id: Date.now(), title:'', youtubeId:'', category:'', description:'' };

  const add    = () => { onChange([...showreel, { ...blank, id:Date.now() }]); };
  const remove = (i) => { onChange(showreel.filter((_,j)=>j!==i)); };
  const update = (i, key, val) => { const a=[...showreel]; a[i]={...a[i],[key]:val}; onChange(a); };
  const moveUp = (i) => { if(i===0) return; const a=[...showreel]; [a[i-1],a[i]]=[a[i],a[i-1]]; onChange(a); };
  const moveDown=(i) => { if(i===showreel.length-1) return; const a=[...showreel]; [a[i+1],a[i]]=[a[i],a[i+1]]; onChange(a); };

  return (
    <div>
      {showreel.length === 0 && (
        <div style={{ padding:'2rem', textAlign:'center', border:'1px dashed var(--border)', borderRadius:10, color:'var(--text-3)', fontFamily:'var(--font-mono)', fontSize:'0.7rem', marginBottom:'1rem' }}>
          No videos yet. Click "+ Add Video" to get started.
        </div>
      )}
      {showreel.map((v, i) => (
        <div key={v.id} style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:10, marginBottom:'0.75rem', overflow:'hidden' }}>
          <div
            style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem', cursor:'pointer' }}
            onClick={() => setEditIdx(editIdx===i ? null : i)}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              {v.youtubeId && <img src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`} alt="" style={{ width:48, height:34, objectFit:'cover', borderRadius:4 }} />}
              <div>
                <div style={{ fontFamily:'var(--font-ui)', fontSize:'0.88rem', color:'var(--text-0)' }}>{v.title||'Untitled video'}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--text-3)' }}>{v.category||'No category'}{v.youtubeId?' · '+v.youtubeId:''}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.4rem' }}>
              <button onClick={e=>{e.stopPropagation();moveUp(i);}} style={{ padding:'0.2rem 0.5rem', background:'transparent', border:'1px solid var(--border)', borderRadius:4, color:'var(--text-2)', cursor:'pointer', fontSize:'0.7rem' }}>↑</button>
              <button onClick={e=>{e.stopPropagation();moveDown(i);}} style={{ padding:'0.2rem 0.5rem', background:'transparent', border:'1px solid var(--border)', borderRadius:4, color:'var(--text-2)', cursor:'pointer', fontSize:'0.7rem' }}>↓</button>
              <button onClick={e=>{e.stopPropagation();remove(i);}} style={{ padding:'0.2rem 0.6rem', background:'transparent', border:'1px solid rgba(224,64,251,0.3)', borderRadius:4, color:'rgba(224,64,251,0.7)', cursor:'pointer', fontSize:'0.7rem' }}>✕</button>
            </div>
          </div>
          {editIdx===i && (
            <div style={{ padding:'1rem', borderTop:'1px solid var(--border)', background:'var(--bg-2)' }}>
              <Field label="Title" value={v.title} onChange={val=>update(i,'title',val)} placeholder="e.g. Dhaka Brand Film 2025" />
              <Field label="YouTube Video ID" value={v.youtubeId} onChange={val=>update(i,'youtubeId',val)} placeholder="e.g. dQw4w9WgXcQ" hint="Paste the ID from YouTube URL" />
              <Field label="Category" value={v.category} onChange={val=>update(i,'category',val)} placeholder={division==='studios'?'Brand Film / Product / Editorial':'Demo / Case Study / Tutorial'} />
              <Field label="Description (optional)" value={v.description} onChange={val=>update(i,'description',val)} textarea placeholder="Brief description shown below the video" />
              {v.youtubeId && (
                <div style={{ marginTop:'0.5rem', borderRadius:8, overflow:'hidden', border:'1px solid var(--border)', maxWidth:280 }}>
                  <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt="preview" style={{ width:'100%', display:'block' }} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button onClick={add} style={{ padding:'0.5rem 1.2rem', background:'transparent', border:'1px dashed var(--border-active)', borderRadius:8, color:'var(--cyan)', fontFamily:'var(--font-mono)', fontSize:'0.65rem', cursor:'pointer', width:'100%', marginTop:'0.5rem' }}>
        + Add Video
      </button>
    </div>
  );
}

// ── Studios Content Tab ───────────────────────────────────────────────────────

export function TabStudiosContent({ cfg, onSave }) {
  const [s, setS] = useState(() => JSON.parse(JSON.stringify(cfg.studios||{})));
  const f = (key) => (val) => setS(p=>({...p,[key]:val}));
  const save = () => onSave({ ...cfg, studios: s });

  return (
    <div>
      <div className="admin-section-title">Studios — Full Content Manager</div>

      {/* Hero */}
      <SectionTitle>Hero Section</SectionTitle>
      <Field label="Hero Title" value={s.heroTitle} onChange={f('heroTitle')} placeholder="Where Vision Becomes Cinema" />
      <Field label="Hero Subtitle" value={s.heroSub} onChange={f('heroSub')} textarea placeholder="High-fidelity AI video production..." />
      <Field label="Primary Button" value={s.heroBtn1} onChange={f('heroBtn1')} placeholder="View Our Work" />
      <Field label="Secondary Button" value={s.heroBtn2} onChange={f('heroBtn2')} placeholder="Start a Project" />

      {/* Stats */}
      <SectionTitle>Stats Bar</SectionTitle>
      {(s.stats||[]).map((st,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'0.75rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label={`Stat ${i+1} Value`} value={st.value} onChange={val=>{const a=[...s.stats];a[i]={...a[i],value:val};setS(p=>({...p,stats:a}));}} placeholder="120+" />
          <Field label="Label" value={st.label} onChange={val=>{const a=[...s.stats];a[i]={...a[i],label:val};setS(p=>({...p,stats:a}));}} placeholder="Videos Produced" />
        </div>
      ))}

      {/* Showreel */}
      <SectionTitle>Showreel / Portfolio Videos</SectionTitle>
      <p style={{ color:'var(--text-2)', fontSize:'0.8rem', marginBottom:'1rem', fontFamily:'var(--font-mono)' }}>Add your Studios portfolio videos. Each shows as a clickable card with YouTube thumbnail.</p>
      <ShowreelEditor showreel={s.showreel||[]} onChange={val=>setS(p=>({...p,showreel:val}))} division="studios" />

      {/* Services */}
      <SectionTitle>Services</SectionTitle>
      {(s.services||[]).map((sv,i) => (
        <div key={i} style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem', marginBottom:'0.75rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'0.75rem' }}>
            <Field label="Icon" value={sv.icon} onChange={val=>{const a=[...s.services];a[i]={...a[i],icon:val};setS(p=>({...p,services:a}));}} placeholder="🎬" />
            <Field label="Title" value={sv.title} onChange={val=>{const a=[...s.services];a[i]={...a[i],title:val};setS(p=>({...p,services:a}));}} placeholder="Cinematic AI Video" />
          </div>
          <Field label="Description" value={sv.desc} onChange={val=>{const a=[...s.services];a[i]={...a[i],desc:val};setS(p=>({...p,services:a}));}} textarea />
          <Field label="Price" value={sv.price} onChange={val=>{const a=[...s.services];a[i]={...a[i],price:val};setS(p=>({...p,services:a}));}} placeholder="Starting from 15,000 BDT" />
          <Field label="Tags (comma-separated)" value={(sv.tags||[]).join(', ')} onChange={val=>{const a=[...s.services];a[i]={...a[i],tags:val.split(',').map(t=>t.trim()).filter(Boolean)};setS(p=>({...p,services:a}));}} placeholder="Sora, Runway, Kling" />
        </div>
      ))}

      {/* Portfolio items */}
      <SectionTitle>Portfolio Grid Items</SectionTitle>
      {(s.portfolio||[]).map((p,i) => (
        <div key={p.id} style={{ display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label="Emoji" value={p.emoji} onChange={val=>{const a=[...s.portfolio];a[i]={...a[i],emoji:val};setS(prev=>({...prev,portfolio:a}));}} />
          <Field label="Title" value={p.title} onChange={val=>{const a=[...s.portfolio];a[i]={...a[i],title:val};setS(prev=>({...prev,portfolio:a}));}} />
          <Field label="Category" value={p.cat} onChange={val=>{const a=[...s.portfolio];a[i]={...a[i],cat:val};setS(prev=>({...prev,portfolio:a}));}} />
          <Field label="YouTube ID (optional)" value={p.youtubeId||''} onChange={val=>{const a=[...s.portfolio];a[i]={...a[i],youtubeId:val};setS(prev=>({...prev,portfolio:a}));}} />
        </div>
      ))}

      {/* Clients */}
      <SectionTitle>Clients</SectionTitle>
      {(s.clients||[]).map((c,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label="Logo" value={c.logo} onChange={val=>{const a=[...s.clients];a[i]={...a[i],logo:val};setS(p=>({...p,clients:a}));}} />
          <Field label="Name" value={c.name} onChange={val=>{const a=[...s.clients];a[i]={...a[i],name:val};setS(p=>({...p,clients:a}));}} />
          <Field label="Sector" value={c.sector} onChange={val=>{const a=[...s.clients];a[i]={...a[i],sector:val};setS(p=>({...p,clients:a}));}} />
        </div>
      ))}
      <button onClick={()=>setS(p=>({...p,clients:[...(p.clients||[]),{logo:'🏢',name:'',sector:''}]}))} style={{ padding:'0.4rem 1rem', background:'transparent', border:'1px dashed var(--border-active)', borderRadius:6, color:'var(--cyan)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', cursor:'pointer', marginBottom:'1rem' }}>
        + Add Client
      </button>

      {/* Process */}
      <SectionTitle>Production Process Steps</SectionTitle>
      {(s.process||[]).map((step,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr 2fr', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label="Num" value={step.num} onChange={val=>{const a=[...s.process];a[i]={...a[i],num:val};setS(p=>({...p,process:a}));}} />
          <Field label="Title" value={step.title} onChange={val=>{const a=[...s.process];a[i]={...a[i],title:val};setS(p=>({...p,process:a}));}} />
          <Field label="Description" value={step.desc} onChange={val=>{const a=[...s.process];a[i]={...a[i],desc:val};setS(p=>({...p,process:a}));}} />
        </div>
      ))}

      {/* Tech */}
      <SectionTitle>Tech Stack</SectionTitle>
      <Field label="Tools (comma-separated)" value={(s.tech||[]).join(', ')} onChange={val=>setS(p=>({...p,tech:val.split(',').map(t=>t.trim()).filter(Boolean)}))} textarea placeholder="Sora, Runway Gen-4, Kling, Pika 2.0..." />

      {/* CTA */}
      <SectionTitle>CTA Section</SectionTitle>
      <Field label="CTA Title" value={s.ctaTitle} onChange={f('ctaTitle')} placeholder="Ready to Create Something Extraordinary?" />
      <Field label="CTA Subtitle" value={s.ctaSub} onChange={f('ctaSub')} textarea />
      <Field label="Email" value={s.ctaEmail} onChange={f('ctaEmail')} placeholder="studios@aipgdbd.com" />
      <Field label="WhatsApp URL" value={s.ctaWhatsapp} onChange={f('ctaWhatsapp')} placeholder="https://wa.me/8801XXXXXXXXX" />

      <SaveBtn onClick={save} />
    </div>
  );
}

// ── Systems Content Tab ───────────────────────────────────────────────────────

export function TabSystemsContent({ cfg, onSave }) {
  const [s, setS] = useState(() => JSON.parse(JSON.stringify(cfg.systems||{})));
  const f = (key) => (val) => setS(p=>({...p,[key]:val}));
  const save = () => onSave({ ...cfg, systems: s });

  return (
    <div>
      <div className="admin-section-title">Systems — Full Content Manager</div>

      {/* Hero */}
      <SectionTitle>Hero Section</SectionTitle>
      <Field label="Hero Title" value={s.heroTitle} onChange={f('heroTitle')} placeholder="Enterprise Software. Built to Last." />
      <Field label="Hero Subtitle" value={s.heroSub} onChange={f('heroSub')} textarea />
      <Field label="Primary Button" value={s.heroBtn1} onChange={f('heroBtn1')} placeholder="View Case Studies" />
      <Field label="Secondary Button" value={s.heroBtn2} onChange={f('heroBtn2')} placeholder="Start a Project" />

      {/* Stats */}
      <SectionTitle>Stats Bar</SectionTitle>
      {(s.stats||[]).map((st,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'0.75rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label={`Stat ${i+1} Value`} value={st.value} onChange={val=>{const a=[...s.stats];a[i]={...a[i],value:val};setS(p=>({...p,stats:a}));}} placeholder="40+" />
          <Field label="Label" value={st.label} onChange={val=>{const a=[...s.stats];a[i]={...a[i],label:val};setS(p=>({...p,stats:a}));}} placeholder="Systems Delivered" />
        </div>
      ))}

      {/* Showreel */}
      <SectionTitle>Project Demo Videos</SectionTitle>
      <p style={{ color:'var(--text-2)', fontSize:'0.8rem', marginBottom:'1rem', fontFamily:'var(--font-mono)' }}>Add Systems project demos, case study walkthroughs, and product showcases.</p>
      <ShowreelEditor showreel={s.showreel||[]} onChange={val=>setS(p=>({...p,showreel:val}))} division="systems" />

      {/* Services */}
      <SectionTitle>Services</SectionTitle>
      {(s.services||[]).map((sv,i) => (
        <div key={i} style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem', marginBottom:'0.75rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'60px 80px 1fr', gap:'0.75rem' }}>
            <Field label="Icon" value={sv.icon} onChange={val=>{const a=[...s.services];a[i]={...a[i],icon:val};setS(p=>({...p,services:a}));}} placeholder="⚛️" />
            <Field label="Badge" value={sv.badge} onChange={val=>{const a=[...s.services];a[i]={...a[i],badge:val};setS(p=>({...p,services:a}));}} placeholder="Frontend" />
            <Field label="Title" value={sv.title} onChange={val=>{const a=[...s.services];a[i]={...a[i],title:val};setS(p=>({...p,services:a}));}} />
          </div>
          <Field label="Description" value={sv.desc} onChange={val=>{const a=[...s.services];a[i]={...a[i],desc:val};setS(p=>({...p,services:a}));}} textarea />
          <Field label="Tags (comma-separated)" value={(sv.tags||[]).join(', ')} onChange={val=>{const a=[...s.services];a[i]={...a[i],tags:val.split(',').map(t=>t.trim()).filter(Boolean)};setS(p=>({...p,services:a}));}} />
        </div>
      ))}

      {/* Case Studies */}
      <SectionTitle>Case Studies</SectionTitle>
      {(s.caseStudies||[]).map((c,i) => (
        <div key={i} style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem', marginBottom:'0.75rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <Field label="Client Name" value={c.client} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],client:val};setS(p=>({...p,caseStudies:a}));}} />
            <Field label="Industry" value={c.industry} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],industry:val};setS(p=>({...p,caseStudies:a}));}} />
          </div>
          <Field label="Project Title" value={c.title} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],title:val};setS(p=>({...p,caseStudies:a}));}} />
          <Field label="Description" value={c.desc} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],desc:val};setS(p=>({...p,caseStudies:a}));}} textarea />
          <Field label="Tags (comma-separated)" value={(c.tags||[]).join(', ')} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],tags:val.split(',').map(t=>t.trim()).filter(Boolean)};setS(p=>({...p,caseStudies:a}));}} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'0.5rem' }}>
            <Field label="Metric 1 Value" value={c.metric?.val} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],metric:{...a[i].metric,val}};setS(p=>({...p,caseStudies:a}));}} placeholder="400+" />
            <Field label="Metric 1 Label" value={c.metric?.label} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],metric:{...a[i].metric,label:val}};setS(p=>({...p,caseStudies:a}));}} placeholder="Beds Managed" />
            <Field label="Metric 2 Value" value={c.metric2?.val} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],metric2:{...a[i].metric2,val}};setS(p=>({...p,caseStudies:a}));}} placeholder="99.9%" />
            <Field label="Metric 2 Label" value={c.metric2?.label} onChange={val=>{const a=[...s.caseStudies];a[i]={...a[i],metric2:{...a[i].metric2,label:val}};setS(p=>({...p,caseStudies:a}));}} placeholder="Uptime" />
          </div>
        </div>
      ))}
      <button onClick={()=>setS(p=>({...p,caseStudies:[...(p.caseStudies||[]),{client:'',industry:'',title:'',desc:'',tags:[],metric:{val:'',label:''},metric2:{val:'',label:''}}]}))} style={{ padding:'0.4rem 1rem', background:'transparent', border:'1px dashed var(--border-active)', borderRadius:6, color:'var(--cyan)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', cursor:'pointer', marginBottom:'1rem' }}>
        + Add Case Study
      </button>

      {/* Clients */}
      <SectionTitle>Clients</SectionTitle>
      {(s.clients||[]).map((c,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label="Logo" value={c.logo} onChange={val=>{const a=[...s.clients];a[i]={...a[i],logo:val};setS(p=>({...p,clients:a}));}} />
          <Field label="Name" value={c.name} onChange={val=>{const a=[...s.clients];a[i]={...a[i],name:val};setS(p=>({...p,clients:a}));}} />
          <Field label="Sector" value={c.sector} onChange={val=>{const a=[...s.clients];a[i]={...a[i],sector:val};setS(p=>({...p,clients:a}));}} />
        </div>
      ))}
      <button onClick={()=>setS(p=>({...p,clients:[...(p.clients||[]),{logo:'🏢',name:'',sector:''}]}))} style={{ padding:'0.4rem 1rem', background:'transparent', border:'1px dashed var(--border-active)', borderRadius:6, color:'var(--cyan)', fontFamily:'var(--font-mono)', fontSize:'0.6rem', cursor:'pointer', marginBottom:'1rem' }}>
        + Add Client
      </button>

      {/* Process */}
      <SectionTitle>Engineering Process Steps</SectionTitle>
      {(s.process||[]).map((step,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr 2fr', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'end' }}>
          <Field label="Num" value={step.num} onChange={val=>{const a=[...s.process];a[i]={...a[i],num:val};setS(p=>({...p,process:a}));}} />
          <Field label="Title" value={step.title} onChange={val=>{const a=[...s.process];a[i]={...a[i],title:val};setS(p=>({...p,process:a}));}} />
          <Field label="Description" value={step.desc} onChange={val=>{const a=[...s.process];a[i]={...a[i],desc:val};setS(p=>({...p,process:a}));}} />
        </div>
      ))}

      {/* CTA */}
      <SectionTitle>CTA Section</SectionTitle>
      <Field label="CTA Title" value={s.ctaTitle} onChange={f('ctaTitle')} placeholder="Ready to Build Something That Lasts?" />
      <Field label="CTA Subtitle" value={s.ctaSub} onChange={f('ctaSub')} textarea />
      <Field label="Email" value={s.ctaEmail} onChange={f('ctaEmail')} placeholder="systems@aipgdbd.com" />
      <Field label="WhatsApp URL" value={s.ctaWhatsapp} onChange={f('ctaWhatsapp')} placeholder="https://wa.me/8801XXXXXXXXX" />

      <SaveBtn onClick={save} />
    </div>
  );
}
