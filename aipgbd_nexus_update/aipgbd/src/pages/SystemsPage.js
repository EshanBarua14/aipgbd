import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import { getConfig } from '../hooks/db';
import './SystemsPage.css';

// ── YouTube helpers ───────────────────────────────────────────────────────────

function YTBackground({ videoId, opacity = 0.25 }) {
  if (!videoId) return null;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
      <iframe
        src={src}
        title="systems-bg"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        style={{
          position:'absolute', top:'50%', left:'50%',
          width:'177.78vh', minWidth:'100%',
          height:'56.25vw', minHeight:'100%',
          transform:'translate(-50%,-50%)',
          opacity, pointerEvents:'none',
        }}
      />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(2,11,18,0.7) 0%, rgba(2,11,18,0.3) 40%, rgba(2,11,18,0.8) 100%)' }} />
    </div>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.92)', backdropFilter:'blur(12px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', maxWidth:900,
        background:'#030E18', border:'1px solid rgba(0,229,255,0.2)',
        borderRadius:16, overflow:'hidden',
      }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'0.9rem 1.4rem', borderBottom:'1px solid rgba(0,229,255,0.08)',
        }}>
          <div>
            <span style={{ fontFamily:'monospace', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(0,229,255,0.4)' }}>
              {video.category || 'AIPG Systems'}
            </span>
            <p style={{ fontFamily:'sans-serif', fontSize:'1rem', fontWeight:600, color:'rgba(240,244,255,0.8)', marginTop:2 }}>{video.title}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(240,244,255,0.4)', fontSize:'1.3rem', cursor:'pointer' }}>✕</button>
        </div>
        {video.youtubeId ? (
          <iframe
            width="100%"
            style={{ aspectRatio:'16/9', display:'block', border:'none' }}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            allow="autoplay; fullscreen"
            title={video.title}
          />
        ) : (
          <div style={{ aspectRatio:'16/9', background:'#020B12', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(0,229,255,0.3)', textTransform:'uppercase' }}>No video URL set</p>
          </div>
        )}
        {video.description && (
          <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid rgba(0,229,255,0.07)' }}>
            <p style={{ fontFamily:'sans-serif', fontSize:'0.85rem', color:'rgba(240,244,255,0.38)', lineHeight:1.6 }}>{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Terminal ──────────────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { type:'prompt', cmd:'git clone aipgbd/enterprise-api' },
  { type:'out',    text:'Cloning into \'enterprise-api\'... done.' },
  { type:'prompt', cmd:'dotnet build --configuration Release' },
  { type:'out',    text:'Build succeeded. 0 Warning(s). 0 Error(s).' },
  { type:'prompt', cmd:'dotnet ef database update' },
  { type:'out',    text:'Applying migration \'InitialSchema\'...' },
  { type:'comment',text:'// All systems operational ✓' },
];

function Terminal() {
  const [lines, setLines] = useState(0);
  useEffect(() => {
    if (lines >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setLines(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [lines]);
  return (
    <div className="sys-hero-terminal">
      <div className="sys-terminal-bar">
        <div className="sys-terminal-dot" style={{ background:'#ff5f57' }} />
        <div className="sys-terminal-dot" style={{ background:'#febc2e' }} />
        <div className="sys-terminal-dot" style={{ background:'#28c840' }} />
        <span className="sys-terminal-title">aipgbd — zsh</span>
      </div>
      <div className="sys-terminal-body">
        {TERMINAL_LINES.slice(0, lines).map((line, i) => (
          <div key={i} className="sys-terminal-line">
            {line.type==='prompt'  && <><span className="sys-terminal-prompt">→</span><span className="sys-terminal-cmd">{line.cmd}</span></>}
            {line.type==='out'     && <span className="sys-terminal-out">{line.text}</span>}
            {line.type==='comment' && <span className="sys-terminal-comment">{line.text}</span>}
          </div>
        ))}
        {lines < TERMINAL_LINES.length && (
          <div className="sys-terminal-line">
            <span className="sys-terminal-prompt">→</span>
            <span className="sys-terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatItem({ value, label }) {
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold:0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const num = parseFloat(String(value).replace(/[^0-9.]/g,''));
    const suffix = String(value).replace(/[0-9.]/g,'');
    if (isNaN(num)) { setDisplay(value); return; }
    let cur = 0; const step = num / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setDisplay((num%1!==0?cur.toFixed(1):Math.floor(cur))+suffix);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, value]);
  return (
    <div className="sys-stat" ref={ref}>
      <span className="sys-stat-value">{display}</span>
      <span className="sys-stat-label">{label}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SystemsPage() {
  const navigate = useNavigate();
  const { setDivision } = useDivision();
  const [activeVideo, setActiveVideo] = useState(null);

  const cfg    = getConfig();
  const videos = cfg.videos  || {};
  const s      = cfg.systems || {};

  const services    = s.services    || [];
  const caseStudies = s.caseStudies || [];
  const showreel    = s.showreel    || [];
  const clients     = s.clients     || [];
  const process     = s.process     || [];
  const tech        = s.tech        || [];
  const stats       = s.stats       || [];

  useEffect(() => {
    setDivision('systems');
    document.title = 'AIPG Systems – Enterprise Software Engineering';
    window.scrollTo(0, 0);
  }, [setDivision]);

  return (
    <div className="sys-root">

      {/* ── Navbar ── */}
      <nav className="sys-nav">
        <div className="sys-nav-logo" onClick={() => navigate('/')}>
          <div className="sys-nav-logo-mark">{'</>'}</div>
          <div className="sys-nav-logo-text">
            <span className="sys-nav-logo-main">AIPG Systems</span>
            <span className="sys-nav-logo-sub">Enterprise Software Engineering</span>
          </div>
        </div>
        <div className="sys-nav-links">
          <a href="#services">Services</a>
          <a href="#cases">Case Studies</a>
          <a href="#tech">Tech Stack</a>
          <a href="#contact" className="sys-nav-cta">Start a Project</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="sys-hero">
        <YTBackground videoId={videos.systemsBgYoutubeId} opacity={videos.systemsBgOpacity || 0.25} />
        <div className="sys-hero-bg" />
        <div className="sys-hero-grid" />
        <div className="sys-hero-scanlines" />
        <div className="sys-hero-content" style={{ position:'relative', zIndex:10 }}>
          <div className="sys-hero-eyebrow">
            <span className="sys-hero-eyebrow-dot" />
            Division II — AIPG Systems
          </div>
          <h1 className="sys-hero-title" dangerouslySetInnerHTML={{
            __html: (s.heroTitle || 'Enterprise Software.<br/>Built to Last.').replace(/\n/g,'<br/>')
          }} />
          <p className="sys-hero-sub">{s.heroSub || 'Production-grade React and ASP.NET Core systems. Clean architecture, zero compromises.'}</p>
          <div className="sys-hero-actions">
            <button className="sys-btn-primary" onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior:'smooth' })}>
              {s.heroBtn1 || 'View Case Studies'}
            </button>
            <button className="sys-btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })}>
              {s.heroBtn2 || 'Start a Project'} →
            </button>
          </div>
        </div>
        <Terminal />
      </section>

      {/* ── Stats ── */}
      {stats.length > 0 && (
        <div className="sys-stats">
          {stats.map(st => <StatItem key={st.label} value={st.value} label={st.label} />)}
        </div>
      )}

      {/* ── Services ── */}
      {services.length > 0 && (
        <section className="sys-section" id="services">
          <div className="sys-section-label">What We Build</div>
          <h2 className="sys-section-title">Our <span>Services</span></h2>
          <p className="sys-section-sub">Full-stack enterprise development from architecture to deployment. Every system engineered for reliability, security, and scale.</p>
          <div className="sys-services-grid">
            {services.map(sv => (
              <div className="sys-service-card" key={sv.title}>
                <div className="sys-service-badge">{sv.badge}</div>
                <div className="sys-service-icon">{sv.icon}</div>
                <div className="sys-service-title">{sv.title}</div>
                <p className="sys-service-desc">{sv.desc}</p>
                <div className="sys-service-tags">
                  {(sv.tags||[]).map(t => <span key={t} className="sys-service-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Case Studies ── */}
      {caseStudies.length > 0 && (
        <section className="sys-section" id="cases" style={{ paddingTop:0 }}>
          <div className="sys-section-label">Proven Track Record</div>
          <h2 className="sys-section-title">Case <span>Studies</span></h2>
          <p className="sys-section-sub">Real systems, real clients, real scale. Every project shipped on time and still running in production.</p>
          <div className="sys-cases">
            {caseStudies.map(c => (
              <div className="sys-case-card" key={c.client}>
                <div className="sys-case-meta">
                  <span className="sys-case-client">{c.client}</span>
                  <span className="sys-case-industry">{c.industry}</span>
                </div>
                <div className="sys-case-body">
                  <div className="sys-case-title">{c.title}</div>
                  <p className="sys-case-desc">{c.desc}</p>
                  <div className="sys-case-tags">
                    {(c.tags||[]).map(t => <span key={t} className="sys-case-tag">{t}</span>)}
                  </div>
                </div>
                <div className="sys-case-metrics">
                  {c.metric  && <div className="sys-case-metric"><div className="sys-case-metric-val">{c.metric.val}</div><div className="sys-case-metric-label">{c.metric.label}</div></div>}
                  {c.metric2 && <div className="sys-case-metric"><div className="sys-case-metric-val">{c.metric2.val}</div><div className="sys-case-metric-label">{c.metric2.label}</div></div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Showreel ── */}
      {showreel.length > 0 && (
        <section style={{ padding:'clamp(5rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', maxWidth:1280, margin:'0 auto' }}>
          <div className="sys-section-label">Project Demos</div>
          <h2 className="sys-section-title">Watch Us <span>Build</span></h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem', marginTop:'2.5rem' }}>
            {showreel.map(video => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                style={{
                  position:'relative', borderRadius:12, overflow:'hidden',
                  border:'1px solid rgba(0,229,255,0.1)', background:'#030E18',
                  cursor:'pointer', transition:'all 0.3s', aspectRatio:'16/9',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor='rgba(0,229,255,0.3)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(0,229,255,0.1)'; e.currentTarget.style.transform=''; }}
              >
                {video.youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.6 }}
                  />
                ) : (
                  <div style={{ fontSize:'2rem', opacity:0.15 }}>{'</>'}</div>
                )}
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(2,11,18,0.92) 0%, transparent 60%)',
                  display:'flex', flexDirection:'column', justifyContent:'flex-end',
                  padding:'1rem', gap:'0.3rem',
                }}>
                  <span style={{ fontFamily:'monospace', fontSize:'0.55rem', letterSpacing:'0.2em', color:'rgba(0,229,255,0.5)', textTransform:'uppercase' }}>{video.category}</span>
                  <span style={{ fontFamily:'sans-serif', fontSize:'0.95rem', fontWeight:600, color:'rgba(240,244,255,0.85)' }}>{video.title}</span>
                </div>
                <div style={{
                  position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                  width:44, height:44, borderRadius:6,
                  background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.3)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#00e5ff', fontSize:'1rem',
                }}>▶</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Tech Stack ── */}
      {tech.length > 0 && (
        <section className="sys-tech-section" id="tech">
          <div className="sys-tech-inner">
            <div className="sys-section-label">Our Stack</div>
            <h2 className="sys-section-title">Technology <span>Stack</span></h2>
            <div className="sys-tech-grid">
              {tech.map(t => (
                <div className="sys-tech-card" key={t.name||t}>
                  <div className="sys-tech-icon">{t.icon||'⚙️'}</div>
                  <div className="sys-tech-name">{t.name||t}</div>
                  {t.cat && <div className="sys-tech-cat">{t.cat}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Clients ── */}
      {clients.length > 0 && (
        <section className="sys-clients">
          <div className="sys-clients-inner">
            <div className="sys-section-label">Trusted By</div>
            <h2 className="sys-section-title">Our <span>Clients</span></h2>
            <div className="sys-clients-grid">
              {clients.map(c => (
                <div className="sys-client-card" key={c.name}>
                  <div className="sys-client-logo">{c.logo}</div>
                  <div className="sys-client-name">{c.name}</div>
                  <div className="sys-client-sector">{c.sector}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      {process.length > 0 && (
        <section className="sys-process" id="process">
          <div className="sys-process-inner">
            <div className="sys-section-label">How We Deliver</div>
            <h2 className="sys-section-title">Engineering <span>Process</span></h2>
            <div className="sys-process-grid">
              {process.map(p => (
                <div className="sys-process-step" key={p.num}>
                  <div className="sys-process-num">// {p.num}</div>
                  <div className="sys-process-title">{p.title}</div>
                  <p className="sys-process-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="sys-cta" id="contact">
        <div className="sys-cta-bg" />
        <div className="sys-cta-inner">
          <div className="sys-section-label" style={{ justifyContent:'center' }}>Start a Project</div>
          <h2 className="sys-cta-title">
            {(s.ctaTitle||'Ready to Build Something That Lasts?').split(' ').slice(0,-1).join(' ')}{' '}
            <span>{(s.ctaTitle||'Ready to Build Something That Lasts?').split(' ').slice(-1)}</span>
          </h2>
          <p className="sys-cta-sub">{s.ctaSub||'Share your requirements. We\'ll respond with a technical proposal within 48 hours.'}</p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
            <button className="sys-btn-primary" onClick={() => window.location.href=`mailto:${s.ctaEmail||'systems@aipgdbd.com'}`}>
              {s.ctaEmail||'systems@aipgdbd.com'}
            </button>
            <button className="sys-btn-secondary" onClick={() => navigate('/home#contact')}>
              Use Contact Form →
            </button>
          </div>
          {s.ctaWhatsapp && (
            <a className="sys-cta-email" href={s.ctaWhatsapp} target="_blank" rel="noreferrer">
              Or message us on WhatsApp ↗
            </a>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="sys-footer">
        <span className="sys-footer-copy">© {new Date().getFullYear()} AIPG Systems · AI Playground BD · Dhaka, Bangladesh</span>
        <button className="sys-footer-back" onClick={() => navigate('/')}>← Back to Nexus</button>
      </footer>

      {/* ── Video Modal ── */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

    </div>
  );
}
