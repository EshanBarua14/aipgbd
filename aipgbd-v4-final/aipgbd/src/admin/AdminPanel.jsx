import { useState, useEffect, useCallback } from 'react';
import {
  getDB, saveDB, resetDB, getAdminPin, setAdminPin,
  getInquiries, updateInquiry, deleteInquiry
} from '../db';

/* ── TINY UI HELPERS ── */
const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="af">
    {label && <label className="af-label">{label}</label>}
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} className="af-input" />
  </div>
);

const Textarea = ({ label, value, onChange, rows = 3, placeholder = '' }) => (
  <div className="af">
    {label && <label className="af-label">{label}</label>}
    <textarea value={value || ''} onChange={e => onChange(e.target.value)}
      rows={rows} placeholder={placeholder} className="af-input af-textarea" />
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div className="af-toggle-row">
    <span className="af-label">{label}</span>
    <button className={`af-toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}>
      <div className="af-toggle-thumb" />
    </button>
  </div>
);

const Chip = ({ label, onRemove }) => (
  <div className="af-chip">
    <span>{label}</span>
    <button onClick={onRemove}>×</button>
  </div>
);

const SectionTitle = ({ children }) => <div className="admin-section-title">{children}</div>;
const Row = ({ children }) => <div className="admin-row">{children}</div>;
const Card = ({ children, style }) => <div className="admin-card" style={style}>{children}</div>;

/* ── STAR RATING ── */
const Stars = ({ value, onChange }) => (
  <div className="af-stars">
    {[1,2,3,4,5].map(s => (
      <button key={s} onClick={() => onChange(s)}
        style={{ color: s <= value ? '#F59E0B' : 'var(--text-tertiary)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        ★
      </button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════
   TAB: DASHBOARD
═══════════════════════════════════════════════ */
function TabDashboard({ db }) {
  const inquiries = getInquiries();
  const newCount = inquiries.filter(i => i.status === 'new').length;
  const inProgress = inquiries.filter(i => i.status === 'in-progress').length;
  const closed = inquiries.filter(i => i.status === 'closed').length;

  return (
    <div>
      <SectionTitle>Dashboard Overview</SectionTitle>
      <div className="dash-grid">
        <div className="dash-stat"><div className="dash-stat-num" style={{ color: 'var(--cyan)' }}>{inquiries.length}</div><div className="dash-stat-label">Total Inquiries</div></div>
        <div className="dash-stat"><div className="dash-stat-num" style={{ color: '#E040FB' }}>{newCount}</div><div className="dash-stat-label">New</div></div>
        <div className="dash-stat"><div className="dash-stat-num" style={{ color: '#F59E0B' }}>{inProgress}</div><div className="dash-stat-label">In Progress</div></div>
        <div className="dash-stat"><div className="dash-stat-num" style={{ color: '#22C55E' }}>{closed}</div><div className="dash-stat-label">Closed</div></div>
      </div>
      <SectionTitle style={{ marginTop: '2rem' }}>Recent Inquiries</SectionTitle>
      {inquiries.slice(0, 5).map(inq => (
        <div key={inq.id} className="dash-inq">
          <div>
            <strong>{inq.name}</strong> — {inq.brand}
            <span className={`status-badge status-${inq.status}`}>{inq.status}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(inq.createdAt).toLocaleString()}</div>
          {inq.message && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{inq.message.slice(0, 100)}{inq.message.length > 100 ? '...' : ''}</div>}
        </div>
      ))}
      {inquiries.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>No inquiries yet. They'll appear here when clients submit the contact form.</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: INQUIRIES
═══════════════════════════════════════════════ */
function TabInquiries() {
  const [inquiries, setInquiries] = useState(getInquiries());
  const [expanded, setExpanded] = useState(null);
  const [note, setNote] = useState('');

  const refresh = () => setInquiries(getInquiries());

  const changeStatus = (id, status) => { updateInquiry(id, { status }); refresh(); };
  const saveNote = (id) => { updateInquiry(id, { notes: note }); refresh(); setNote(''); };
  const remove = (id) => { if (window.confirm('Delete inquiry?')) { deleteInquiry(id); refresh(); } };

  return (
    <div>
      <SectionTitle>All Inquiries ({inquiries.length})</SectionTitle>
      {inquiries.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>No inquiries yet.</p>}
      {inquiries.map(inq => (
        <div key={inq.id} className="inq-card">
          <div className="inq-header" onClick={() => { setExpanded(expanded === inq.id ? null : inq.id); setNote(inq.notes || ''); }}>
            <div>
              <strong>{inq.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>· {inq.brand}</span>
              <span className={`status-badge status-${inq.status}`}>{inq.status}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{new Date(inq.createdAt).toLocaleDateString()}</span>
              <span>{expanded === inq.id ? '▲' : '▼'}</span>
            </div>
          </div>
          {expanded === inq.id && (
            <div className="inq-body">
              <Row>
                <div><span className="af-label">Service</span><p>{inq.service || '—'}</p></div>
                <div><span className="af-label">Budget</span><p>{inq.budget || '—'}</p></div>
              </Row>
              <div className="af"><span className="af-label">Message</span><p style={{ lineHeight: 1.6 }}>{inq.message}</p></div>
              <div className="af">
                <span className="af-label">Status</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {['new', 'in-progress', 'quoted', 'closed', 'spam'].map(s => (
                    <button key={s} className={`status-btn ${inq.status === s ? 'active' : ''}`} onClick={() => changeStatus(inq.id, s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="af">
                <span className="af-label">Internal Notes</span>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="af-input af-textarea" placeholder="Add internal notes..." />
                <button className="btn-sm" onClick={() => saveNote(inq.id)}>Save Note</button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <a href={`mailto:${inq.email || ''}?subject=Re: Your Inquiry — ${inq.brand}&body=Hi ${inq.name},%0A%0A`} className="btn-sm btn-cyan">✉ Email</a>
                <a href={`https://wa.me/?text=Hi ${inq.name}, thanks for your inquiry about ${inq.brand}!`} target="_blank" rel="noreferrer" className="btn-sm btn-green">💬 WhatsApp</a>
                <button className="btn-sm btn-red" onClick={() => remove(inq.id)}>🗑 Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: SITE SETTINGS
═══════════════════════════════════════════════ */
function TabSiteSettings({ db, onChange }) {
  const [s, setS] = useState(db.site);
  const [wordInput, setWordInput] = useState('');
  useEffect(() => setS(db.site), [db.site]);
  const upd = (key, val) => { const n = { ...s, [key]: val }; setS(n); onChange('site', n); };
  const addWord = () => { if (!wordInput.trim()) return; upd('heroWords', [...(s.heroWords || []), wordInput.trim()]); setWordInput(''); };
  const removeWord = (i) => upd('heroWords', s.heroWords.filter((_, idx) => idx !== i));

  return (
    <div>
      <SectionTitle>Brand Identity</SectionTitle>
      <Card>
        <Row>
          <Input label="Brand Name" value={s.name} onChange={v => upd('name', v)} />
          <Input label="Tagline" value={s.tagline} onChange={v => upd('tagline', v)} />
        </Row>
        <Row>
          <Input label="Email" value={s.email} onChange={v => upd('email', v)} type="email" />
          <Input label="WhatsApp URL" value={s.whatsapp} onChange={v => upd('whatsapp', v)} placeholder="https://wa.me/880..." />
        </Row>
        <Row>
          <Input label="Facebook URL" value={s.facebook} onChange={v => upd('facebook', v)} />
          <Input label="YouTube URL" value={s.youtube} onChange={v => upd('youtube', v)} />
          <Input label="Instagram URL" value={s.instagram} onChange={v => upd('instagram', v)} />
        </Row>
        <Row>
          <div className="af">
            <span className="af-label">Logo URL (or /logo.png for uploaded file)</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {s.logoUrl && <img src={s.logoUrl} alt="logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--cyan-border)' }} />}
              <input value={s.logoUrl || ''} onChange={e => upd('logoUrl', e.target.value)} className="af-input" style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button className="btn-sm" onClick={() => upd('logoUrl', '/logo.png')}>Use /logo.png</button>
            </div>
          </div>
        </Row>
      </Card>

      <SectionTitle>Hero Section</SectionTitle>
      <Card>
        <Input label="Hero Video YouTube ID (e.g. y5N8uoFZLd0)" value={s.heroVideoId} onChange={v => upd('heroVideoId', v)} />
        <Input label="Hero Title" value={s.heroTitle} onChange={v => upd('heroTitle', v)} />
        <Textarea label="Hero Subtitle" value={s.heroSubtitle} onChange={v => upd('heroSubtitle', v)} />
        <Row>
          <Input label="CTA Primary Button" value={s.ctaPrimary} onChange={v => upd('ctaPrimary', v)} />
          <Input label="CTA Secondary Button" value={s.ctaSecondary} onChange={v => upd('ctaSecondary', v)} />
        </Row>
        <div className="af">
          <span className="af-label">Animated Words (cycling in hero title)</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {(s.heroWords || []).map((w, i) => <Chip key={i} label={w} onRemove={() => removeWord(i)} />)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={wordInput} onChange={e => setWordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord()} className="af-input" style={{ flex: 1 }} placeholder="Add word..." />
            <button className="btn-sm btn-cyan" onClick={addWord}>+ Add</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: STATS
═══════════════════════════════════════════════ */
function TabStats({ db, onChange }) {
  const [stats, setStats] = useState(db.stats);
  useEffect(() => setStats(db.stats), [db.stats]);
  const upd = (i, key, val) => { const n = stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s); setStats(n); onChange('stats', n); };

  return (
    <div>
      <SectionTitle>Hero Stats (the 4 numbers shown in hero)</SectionTitle>
      {stats.map((s, i) => (
        <Card key={i}>
          <Row>
            <Input label="Number" value={s.num} onChange={v => upd(i, 'num', v)} placeholder="30" />
            <Input label="Unit" value={s.unit} onChange={v => upd(i, 'unit', v)} placeholder="s" />
            <Input label="Label" value={s.label} onChange={v => upd(i, 'label', v)} placeholder="Unbroken take" />
          </Row>
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: PACKAGES
═══════════════════════════════════════════════ */
function TabPackages({ db, onChange }) {
  const [pkgs, setPkgs] = useState(db.packages);
  const [featureInput, setFeatureInput] = useState({});
  useEffect(() => setPkgs(db.packages), [db.packages]);

  const upd = (i, key, val) => { const n = pkgs.map((p, idx) => idx === i ? { ...p, [key]: val } : p); setPkgs(n); onChange('packages', n); };
  const addFeature = (i) => {
    const v = featureInput[i] || '';
    if (!v.trim()) return;
    upd(i, 'features', [...(pkgs[i].features || []), v.trim()]);
    setFeatureInput(f => ({ ...f, [i]: '' }));
  };
  const removeFeature = (i, fi) => upd(i, 'features', pkgs[i].features.filter((_, idx) => idx !== fi));
  const addPackage = () => {
    const n = [...pkgs, { id: Date.now().toString(), num: `0${pkgs.length + 1}`, title: 'New Package', popular: false, price: '0', currency: 'BDT', unit: 'per project', desc: '', features: [] }];
    setPkgs(n); onChange('packages', n);
  };
  const removePackage = (i) => { if (!window.confirm('Remove this package?')) return; const n = pkgs.filter((_, idx) => idx !== i); setPkgs(n); onChange('packages', n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>Service Packages</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={addPackage}>+ Add Package</button>
      </div>
      {pkgs.map((pkg, i) => (
        <Card key={pkg.id || i} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--cyan)' }}>{pkg.title}</strong>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Toggle label="Popular" value={pkg.popular} onChange={v => upd(i, 'popular', v)} />
              <button className="btn-sm btn-red" onClick={() => removePackage(i)}>Remove</button>
            </div>
          </div>
          <Row>
            <Input label="Package #" value={pkg.num} onChange={v => upd(i, 'num', v)} />
            <Input label="Title" value={pkg.title} onChange={v => upd(i, 'title', v)} />
          </Row>
          <Row>
            <Input label="Price" value={pkg.price} onChange={v => upd(i, 'price', v)} placeholder="8,000" />
            <Input label="Currency" value={pkg.currency} onChange={v => upd(i, 'currency', v)} placeholder="BDT" />
            <Input label="Unit" value={pkg.unit} onChange={v => upd(i, 'unit', v)} placeholder="per video" />
          </Row>
          <Textarea label="Description" value={pkg.desc} onChange={v => upd(i, 'desc', v)} />
          <div className="af">
            <span className="af-label">Features</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {(pkg.features || []).map((f, fi) => <Chip key={fi} label={f} onRemove={() => removeFeature(i, fi)} />)}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={featureInput[i] || ''} onChange={e => setFeatureInput(f => ({ ...f, [i]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addFeature(i)} className="af-input" style={{ flex: 1 }} placeholder="Add feature..." />
              <button className="btn-sm btn-cyan" onClick={() => addFeature(i)}>+ Add</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: AI TOOLS (Process)
═══════════════════════════════════════════════ */
function TabTools({ db, onChange }) {
  const [tools, setTools] = useState(db.tools);
  useEffect(() => setTools(db.tools), [db.tools]);
  const upd = (i, key, val) => { const n = tools.map((t, idx) => idx === i ? { ...t, [key]: val } : t); setTools(n); onChange('tools', n); };
  const addTool = () => { const n = [...tools, { id: Date.now().toString(), name: 'New Tool', step: `0${tools.length + 1}`, color: '#00E5FF', title: 'Tool Title', desc: 'Short description.', detail: 'Detailed explanation.' }]; setTools(n); onChange('tools', n); };
  const removeTool = (i) => { if (!window.confirm('Remove this tool?')) return; const n = tools.filter((_, idx) => idx !== i); setTools(n); onChange('tools', n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>AI Tools / Process Steps</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={addTool}>+ Add Tool</button>
      </div>
      {tools.map((t, i) => (
        <Card key={t.id || i} style={{ marginBottom: '1.5rem', borderLeft: `3px solid ${t.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <strong style={{ color: t.color }}>{t.name}</strong>
            <button className="btn-sm btn-red" onClick={() => removeTool(i)}>Remove</button>
          </div>
          <Row>
            <Input label="Tool Name" value={t.name} onChange={v => upd(i, 'name', v)} />
            <Input label="Step #" value={t.step} onChange={v => upd(i, 'step', v)} />
            <div className="af">
              <span className="af-label">Accent Color</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={t.color} onChange={e => upd(i, 'color', e.target.value)} style={{ width: 40, height: 36, border: 'none', borderRadius: 4, cursor: 'pointer' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.color}</span>
              </div>
            </div>
          </Row>
          <Input label="Step Title" value={t.title} onChange={v => upd(i, 'title', v)} />
          <Textarea label="Short Description" value={t.desc} onChange={v => upd(i, 'desc', v)} rows={2} />
          <Textarea label="Detailed Explanation (shown in panel)" value={t.detail} onChange={v => upd(i, 'detail', v)} rows={3} />
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: INDUSTRIES
═══════════════════════════════════════════════ */
function TabIndustries({ db, onChange }) {
  const [items, setItems] = useState(db.industries);
  useEffect(() => setItems(db.industries), [db.industries]);
  const upd = (i, key, val) => { const n = items.map((it, idx) => idx === i ? { ...it, [key]: val } : it); setItems(n); onChange('industries', n); };
  const add = () => { const n = [...items, { id: Date.now().toString(), icon: '◈', title: 'New Industry', pain: '', roi: '' }]; setItems(n); onChange('industries', n); };
  const remove = (i) => { if (!window.confirm('Remove?')) return; const n = items.filter((_, idx) => idx !== i); setItems(n); onChange('industries', n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>Industries / Niches</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={add}>+ Add Industry</button>
      </div>
      {items.map((it, i) => (
        <Card key={it.id || i} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <strong>{it.icon} {it.title}</strong>
            <button className="btn-sm btn-red" onClick={() => remove(i)}>Remove</button>
          </div>
          <Row>
            <Input label="Icon (emoji)" value={it.icon} onChange={v => upd(i, 'icon', v)} />
            <Input label="Title" value={it.title} onChange={v => upd(i, 'title', v)} />
          </Row>
          <Textarea label="The Pain (problem)" value={it.pain} onChange={v => upd(i, 'pain', v)} rows={2} />
          <Textarea label="Our Fix (ROI statement)" value={it.roi} onChange={v => upd(i, 'roi', v)} rows={2} />
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: PORTFOLIO
═══════════════════════════════════════════════ */
function TabPortfolio({ db, onChange }) {
  const [items, setItems] = useState(db.portfolio);
  useEffect(() => setItems(db.portfolio), [db.portfolio]);
  const upd = (i, key, val) => { const n = items.map((it, idx) => idx === i ? { ...it, [key]: val } : it); setItems(n); onChange('portfolio', n); };
  const add = () => { const n = [...items, { id: Date.now().toString(), title: 'New Work', client: '', category: 'General', youtubeId: '', desc: '', color: '#00E5FF' }]; setItems(n); onChange('portfolio', n); };
  const remove = (i) => { if (!window.confirm('Remove?')) return; const n = items.filter((_, idx) => idx !== i); setItems(n); onChange('portfolio', n); };
  const move = (i, dir) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; setItems(n); onChange('portfolio', n);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>Portfolio / Our Work</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={add}>+ Add Work</button>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Paste a YouTube video ID (e.g. <code>y5N8uoFZLd0</code> from youtube.com/watch?v=<strong>y5N8uoFZLd0</strong>). Leave empty to show placeholder.
      </p>
      {items.map((it, i) => (
        <Card key={it.id || i} style={{ marginBottom: '1rem', borderLeft: `3px solid ${it.color || 'var(--cyan)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <strong>{it.title}</strong>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn-sm" onClick={() => move(i, -1)}>↑</button>
              <button className="btn-sm" onClick={() => move(i, 1)}>↓</button>
              <button className="btn-sm btn-red" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
          <Row>
            <Input label="Title" value={it.title} onChange={v => upd(i, 'title', v)} />
            <Input label="Client Name" value={it.client} onChange={v => upd(i, 'client', v)} />
            <Input label="Category" value={it.category} onChange={v => upd(i, 'category', v)} />
          </Row>
          <Row>
            <Input label="YouTube Video ID" value={it.youtubeId} onChange={v => upd(i, 'youtubeId', v)} placeholder="y5N8uoFZLd0" />
            <div className="af">
              <span className="af-label">Card Color</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={it.color || '#00E5FF'} onChange={e => upd(i, 'color', e.target.value)} style={{ width: 40, height: 36, border: 'none', borderRadius: 4, cursor: 'pointer' }} />
              </div>
            </div>
          </Row>
          <Textarea label="Description" value={it.desc} onChange={v => upd(i, 'desc', v)} rows={2} />
          {it.youtubeId && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={`https://img.youtube.com/vi/${it.youtubeId}/mqdefault.jpg`} alt="thumb" style={{ width: 160, borderRadius: 6, border: '1px solid var(--border)' }} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: FAQ
═══════════════════════════════════════════════ */
function TabFAQ({ db, onChange }) {
  const [items, setItems] = useState(db.faqs);
  useEffect(() => setItems(db.faqs), [db.faqs]);
  const upd = (i, key, val) => { const n = items.map((it, idx) => idx === i ? { ...it, [key]: val } : it); setItems(n); onChange('faqs', n); };
  const add = () => { const n = [...items, { id: Date.now().toString(), q: 'New Question?', a: 'Answer here.' }]; setItems(n); onChange('faqs', n); };
  const remove = (i) => { if (!window.confirm('Remove?')) return; const n = items.filter((_, idx) => idx !== i); setItems(n); onChange('faqs', n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>FAQ</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={add}>+ Add FAQ</button>
      </div>
      {items.map((it, i) => (
        <Card key={it.id || i} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button className="btn-sm btn-red" onClick={() => remove(i)}>Remove</button>
          </div>
          <Input label="Question" value={it.q} onChange={v => upd(i, 'q', v)} />
          <Textarea label="Answer" value={it.a} onChange={v => upd(i, 'a', v)} rows={3} />
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: TESTIMONIALS
═══════════════════════════════════════════════ */
function TabTestimonials({ db, onChange }) {
  const [items, setItems] = useState(db.testimonials);
  useEffect(() => setItems(db.testimonials), [db.testimonials]);
  const upd = (i, key, val) => { const n = items.map((it, idx) => idx === i ? { ...it, [key]: val } : it); setItems(n); onChange('testimonials', n); };
  const add = () => { const n = [...items, { id: Date.now().toString(), name: 'Client Name', role: 'Role', company: 'Company', quote: 'Quote here.', stars: 5, result: '' }]; setItems(n); onChange('testimonials', n); };
  const remove = (i) => { if (!window.confirm('Remove?')) return; const n = items.filter((_, idx) => idx !== i); setItems(n); onChange('testimonials', n); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle style={{ margin: 0 }}>Testimonials</SectionTitle>
        <button className="btn-sm btn-cyan" onClick={add}>+ Add Testimonial</button>
      </div>
      {items.map((it, i) => (
        <Card key={it.id || i} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <Stars value={it.stars} onChange={v => upd(i, 'stars', v)} />
            <button className="btn-sm btn-red" onClick={() => remove(i)}>Remove</button>
          </div>
          <Row>
            <Input label="Name" value={it.name} onChange={v => upd(i, 'name', v)} />
            <Input label="Role" value={it.role} onChange={v => upd(i, 'role', v)} />
            <Input label="Company" value={it.company} onChange={v => upd(i, 'company', v)} />
          </Row>
          <Textarea label="Quote" value={it.quote} onChange={v => upd(i, 'quote', v)} rows={3} />
          <Input label="Result Badge (e.g. +40% leads)" value={it.result} onChange={v => upd(i, 'result', v)} />
        </Card>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: SECURITY
═══════════════════════════════════════════════ */
function TabSecurity() {
  const [current, setCurrent] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const changePin = () => {
    if (current !== getAdminPin()) { setMsg('❌ Current PIN incorrect'); return; }
    if (newPin.length < 4) { setMsg('❌ PIN must be at least 4 characters'); return; }
    if (newPin !== confirm) { setMsg('❌ PINs do not match'); return; }
    setAdminPin(newPin);
    setMsg('✅ PIN changed successfully');
    setCurrent(''); setNewPin(''); setConfirm('');
  };

  return (
    <div>
      <SectionTitle>Change Admin PIN</SectionTitle>
      <Card style={{ maxWidth: 400 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          The admin panel is accessible via the secret URL <code>/admin</code>. Change your PIN from the default immediately.
        </p>
        <Input label="Current PIN" value={current} onChange={setCurrent} type="password" placeholder="Current PIN" />
        <Input label="New PIN" value={newPin} onChange={setNewPin} type="password" placeholder="New PIN (min 4 chars)" />
        <Input label="Confirm New PIN" value={confirm} onChange={setConfirm} type="password" placeholder="Confirm new PIN" />
        <button className="btn-sm btn-cyan" onClick={changePin} style={{ marginTop: '0.5rem' }}>Change PIN</button>
        {msg && <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: msg.startsWith('✅') ? '#22C55E' : '#E040FB' }}>{msg}</p>}
      </Card>
      <SectionTitle style={{ marginTop: '2rem' }}>Danger Zone</SectionTitle>
      <Card style={{ maxWidth: 400, borderColor: 'rgba(224,64,251,0.3)' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Reset all site content to factory defaults. This cannot be undone.
        </p>
        <button className="btn-sm btn-red" onClick={() => { if (window.confirm('RESET ALL DATA? This cannot be undone.')) { resetDB(); window.location.reload(); } }}>
          🗑 Reset All Data to Defaults
        </button>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ADMIN PANEL
═══════════════════════════════════════════════ */
const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'inquiries', label: '📥 Inquiries' },
  { id: 'site', label: '🔧 Site Settings' },
  { id: 'stats', label: '📈 Stats' },
  { id: 'packages', label: '📦 Packages' },
  { id: 'tools', label: '🤖 AI Tools' },
  { id: 'industries', label: '🏢 Industries' },
  { id: 'portfolio', label: '🎬 Portfolio' },
  { id: 'faqs', label: '❓ FAQ' },
  { id: 'testimonials', label: '⭐ Testimonials' },
  { id: 'security', label: '🔐 Security' },
];

export default function AdminPanel({ onSave, onClose }) {
  const [pinInput, setPinInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [db, setDb] = useState(getDB());
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  const handleLogin = () => {
    if (pinInput === getAdminPin()) { setAuthed(true); setPinError(false); }
    else { setPinError(true); setPinInput(''); }
  };

  const handleChange = useCallback((key, value) => {
    setDb(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const handleSave = () => {
    const ok = saveDB(db);
    if (ok) {
      setToast('✅ Saved successfully!');
      setDirty(false);
      onSave(db);
    } else {
      setToast('❌ Save failed — localStorage may be full');
    }
    setTimeout(() => setToast(''), 3000);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  if (!authed) {
    return (
      <div className="admin-overlay">
        <div className="admin-login">
          <img src="/logo.png" alt="logo" className="admin-login-logo" onError={e => { e.target.style.display = 'none'; }} />
          <h2 className="admin-login-title">Admin Access</h2>
          <p className="admin-login-sub">Enter your PIN to continue</p>
          <input
            type="password" value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`af-input admin-login-input ${pinError ? 'error' : ''}`}
            placeholder="••••"
            autoFocus
          />
          {pinError && <p className="admin-login-error">Incorrect PIN</p>}
          <button className="btn-primary admin-login-btn" onClick={handleLogin}>
            <span>Enter Admin Panel</span>
          </button>
          <button className="admin-login-close" onClick={onClose}>← Back to Site</button>
        </div>
        <AdminStyles />
      </div>
    );
  }

  const newInquiries = getInquiries().filter(i => i.status === 'new').length;

  return (
    <div className="admin-overlay">
      <div className="admin-shell">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <img src="/logo.png" alt="logo" style={{ width: 32, height: 32, borderRadius: '50%' }} onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Admin Panel</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>AIPGBD</div>
            </div>
          </div>
          <nav className="admin-nav">
            {TABS.map(t => (
              <button key={t.id} className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
                {t.id === 'inquiries' && newInquiries > 0 && (
                  <span className="admin-badge">{newInquiries}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <button className="btn-sm btn-cyan" onClick={handleSave} style={{ width: '100%' }}>
              {dirty ? '💾 Save Changes*' : '💾 Saved'}
            </button>
            <button className="btn-sm" onClick={onClose} style={{ width: '100%', marginTop: '0.5rem' }}>← Back to Site</button>
          </div>
        </aside>

        {/* Content */}
        <main className="admin-content">
          <div className="admin-content-header">
            <h2 className="admin-content-title">{TABS.find(t => t.id === tab)?.label}</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {dirty && <span style={{ fontSize: '0.72rem', color: 'var(--magenta)', fontFamily: 'JetBrains Mono, monospace' }}>Unsaved changes</span>}
              <button className="btn-primary" onClick={handleSave} style={{ padding: '0.6rem 1.5rem', fontSize: '0.78rem' }}>
                <span>💾 Save</span>
              </button>
            </div>
          </div>
          <div className="admin-content-body">
            {tab === 'dashboard' && <TabDashboard db={db} />}
            {tab === 'inquiries' && <TabInquiries />}
            {tab === 'site' && <TabSiteSettings db={db} onChange={handleChange} />}
            {tab === 'stats' && <TabStats db={db} onChange={handleChange} />}
            {tab === 'packages' && <TabPackages db={db} onChange={handleChange} />}
            {tab === 'tools' && <TabTools db={db} onChange={handleChange} />}
            {tab === 'industries' && <TabIndustries db={db} onChange={handleChange} />}
            {tab === 'portfolio' && <TabPortfolio db={db} onChange={handleChange} />}
            {tab === 'faqs' && <TabFAQ db={db} onChange={handleChange} />}
            {tab === 'testimonials' && <TabTestimonials db={db} onChange={handleChange} />}
            {tab === 'security' && <TabSecurity />}
          </div>
        </main>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
      <AdminStyles />
    </div>
  );
}

/* ── STYLES ── */
function AdminStyles() {
  return (
    <style>{`
      .admin-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: var(--bg);
        display: flex; overflow: hidden;
      }
      .admin-shell { display: flex; width: 100%; height: 100%; overflow: hidden; }

      /* Login */
      .admin-login {
        margin: auto; width: 100%; max-width: 380px;
        display: flex; flex-direction: column; align-items: center;
        gap: 1rem; padding: 2rem;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 12px;
      }
      .admin-login-logo { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--cyan-border); }
      .admin-login-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; background: var(--grad-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .admin-login-sub { color: var(--text-secondary); font-size: 0.85rem; }
      .admin-login-input { width: 100%; text-align: center; font-size: 1.5rem; letter-spacing: 0.5em; }
      .admin-login-input.error { border-color: var(--magenta); }
      .admin-login-error { color: var(--magenta); font-size: 0.78rem; }
      .admin-login-btn { width: 100%; justify-content: center; }
      .admin-login-close { background: none; border: none; color: var(--text-tertiary); font-size: 0.82rem; cursor: pointer; margin-top: 0.5rem; }
      .admin-login-close:hover { color: var(--cyan); }

      /* Sidebar */
      .admin-sidebar {
        width: 220px; flex-shrink: 0;
        background: var(--bg-2); border-right: 1px solid var(--border);
        display: flex; flex-direction: column; overflow-y: auto;
      }
      .admin-sidebar-brand {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 1.25rem; border-bottom: 1px solid var(--border);
      }
      .admin-nav { flex: 1; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; gap: 2px; }
      .admin-nav-btn {
        width: 100%; text-align: left; padding: 0.6rem 0.75rem;
        background: none; border: none; border-radius: 6px;
        font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem;
        color: var(--text-secondary); cursor: pointer;
        transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;
      }
      .admin-nav-btn:hover { background: var(--cyan-dim); color: var(--text-primary); }
      .admin-nav-btn.active { background: var(--cyan-dim); color: var(--cyan); font-weight: 600; }
      .admin-badge {
        background: var(--magenta); color: #fff;
        font-size: 0.6rem; font-weight: 700; border-radius: 100px;
        padding: 0.1rem 0.4rem; min-width: 18px; text-align: center;
      }
      .admin-sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid var(--border); }

      /* Content */
      .admin-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
      .admin-content-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 1.25rem 2rem; border-bottom: 1px solid var(--border);
        background: var(--bg-2); flex-shrink: 0;
      }
      .admin-content-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.1rem; }
      .admin-content-body { flex: 1; overflow-y: auto; padding: 2rem; }

      /* Form fields */
      .af { display: flex; flex-direction: column; gap: 0.35rem; }
      .af-label { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); }
      .af-input {
        background: var(--bg-3); border: 1px solid var(--border);
        border-radius: 6px; padding: 0.65rem 0.875rem;
        font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem;
        color: var(--text-primary); outline: none; width: 100%;
        transition: border-color 0.2s;
      }
      .af-input:focus { border-color: var(--cyan-border); }
      .af-textarea { resize: vertical; min-height: 60px; }
      .af-chip { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--cyan-dim); border: 1px solid var(--cyan-border); border-radius: 100px; padding: 0.25rem 0.6rem; font-size: 0.75rem; color: var(--cyan); }
      .af-chip button { background: none; border: none; color: var(--cyan); cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; }
      .af-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
      .af-toggle { width: 44px; height: 24px; background: var(--border-strong); border: none; border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s; }
      .af-toggle.on { background: var(--cyan); }
      .af-toggle-thumb { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: left 0.2s; }
      .af-toggle.on .af-toggle-thumb { left: 23px; }
      .af-stars { display: flex; gap: 0.1rem; }

      /* Layout helpers */
      .admin-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
      .admin-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
      .admin-section-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 1rem; margin-top: 0.5rem; }

      /* Buttons */
      .btn-sm { padding: 0.45rem 0.875rem; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600; border: 1px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
      .btn-sm:hover { border-color: var(--text-secondary); color: var(--text-primary); }
      .btn-sm.btn-cyan { border-color: var(--cyan-border); color: var(--cyan); background: var(--cyan-dim); }
      .btn-sm.btn-cyan:hover { background: var(--cyan); color: #000; }
      .btn-sm.btn-red { border-color: rgba(224,64,251,0.3); color: var(--magenta); background: rgba(224,64,251,0.06); }
      .btn-sm.btn-red:hover { background: var(--magenta); color: #fff; }
      .btn-sm.btn-green { border-color: rgba(34,197,94,0.3); color: #22C55E; background: rgba(34,197,94,0.06); }

      /* Inquiry cards */
      .inq-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; }
      .inq-header { padding: 1rem; display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; background: var(--surface); transition: background 0.2s; }
      .inq-header:hover { background: var(--bg-3); }
      .inq-body { padding: 1.25rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 1rem; background: var(--bg-2); }
      .status-badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 100px; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-left: 0.5rem; }
      .status-new { background: rgba(0,229,255,0.15); color: var(--cyan); }
      .status-in-progress { background: rgba(245,158,11,0.15); color: #F59E0B; }
      .status-quoted { background: rgba(155,89,255,0.15); color: var(--purple); }
      .status-closed { background: rgba(34,197,94,0.15); color: #22C55E; }
      .status-spam { background: rgba(100,100,100,0.15); color: var(--text-tertiary); }
      .status-btn { padding: 0.3rem 0.7rem; font-size: 0.72rem; border: 1px solid var(--border); border-radius: 100px; background: none; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
      .status-btn.active { background: var(--cyan-dim); border-color: var(--cyan-border); color: var(--cyan); }

      /* Dashboard */
      .dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
      .dash-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; text-align: center; }
      .dash-stat-num { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 2rem; }
      .dash-stat-label { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem; }
      .dash-inq { padding: 0.875rem; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.5rem; background: var(--surface); }

      /* Toast */
      .admin-toast {
        position: fixed; bottom: 2rem; right: 2rem; z-index: 10001;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 8px; padding: 0.875rem 1.5rem;
        font-size: 0.85rem; color: var(--text-primary);
        box-shadow: 0 8px 32px var(--shadow);
        animation: toastIn 0.3s ease;
      }
      @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      @media (max-width: 768px) {
        .admin-sidebar { width: 180px; }
        .dash-grid { grid-template-columns: repeat(2, 1fr); }
        .admin-row { grid-template-columns: 1fr; }
      }
      @media (max-width: 600px) {
        .admin-sidebar { display: none; }
      }
    `}</style>
  );
}
