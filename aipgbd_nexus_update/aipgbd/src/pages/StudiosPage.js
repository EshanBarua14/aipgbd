import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import { getConfig } from '../hooks/db';
import './StudiosPage.css';

// ── YouTube helpers ───────────────────────────────────────────────────────────

function YTBackground({ videoId, opacity = 0.3 }) {
  if (!videoId) return null;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
      <iframe
        src={src}
        title="studios-bg"
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
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.3) 40%, rgba(10,8,6,0.7) 100%)' }} />
    </div>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,0,0.92)', backdropFilter:'blur(12px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width:'100%', maxWidth:900,
        background:'#110D08', border:'1px solid rgba(201,168,76,0.2)',
        borderRadius:20, overflow:'hidden',
      }}>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'0.9rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,0.08)',
        }}>
          <div>
            <span style={{ fontFamily:'monospace', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(201,168,76,0.5)' }}>
              {video.category || 'AIPG Studios'}
            </span>
            <p style={{ fontFamily:'serif', fontSize:'1rem', color:'rgba(240,244,255,0.8)', marginTop:2 }}>{video.title}</p>
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
          <div style={{ aspectRatio:'16/9', background:'#0A0806', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'0.75rem' }}>
            <div style={{ fontSize:'3rem', opacity:0.2 }}>🎬</div>
            <p style={{ fontFamily:'monospace', fontSize:'0.65rem', letterSpacing:'0.2em', color:'rgba(201,168,76,0.3)', textTransform:'uppercase' }}>No video URL set</p>
          </div>
        )}
        {video.description && (
          <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid rgba(201,168,76,0.08)' }}>
            <p style={{ fontFamily:'sans-serif', fontSize:'0.85rem', color:'rgba(240,244,255,0.4)', lineHeight:1.6 }}>{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function StatItem({ value, label }) {
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    const suffix = String(value).replace(/[0-9.]/g, '');
    if (isNaN(num)) { setDisplay(value); return; }
    let cur = 0;
    const step = num / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setDisplay(Math.floor(cur) + suffix);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, value]);

  return (
    <div className="studios-stat" ref={ref}>
      <span className="studios-stat-value">{display}</span>
      <span className="studios-stat-label">{label}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StudiosPage() {
  const navigate = useNavigate();
  const { setDivision } = useDivision();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeVideo,  setActiveVideo]  = useState(null);

  const cfg     = getConfig();
  const videos  = cfg.videos  || {};
  const s       = cfg.studios || {};

  const services    = s.services    || [];
  const portfolio   = s.portfolio   || [];
  const showreel    = s.showreel    || [];
  const clients     = s.clients     || [];
  const process     = s.process     || [];
  const tech        = s.tech        || [];
  const stats       = s.stats       || [];

  useEffect(() => {
    setDivision('studios');
    document.title = 'AIPG Studios – Cinematic AI Production';
    window.scrollTo(0, 0);
  }, [setDivision]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const categories = ['All', ...new Set(portfolio.map(p => p.cat))];
  const filtered   = activeFilter === 'All' ? portfolio : portfolio.filter(p => p.cat === activeFilter);

  // Portfolio colors
  const COLORS = ['rgba(201,168,76,0.08)','rgba(155,89,255,0.06)','rgba(0,229,255,0.05)','rgba(224,64,251,0.05)','rgba(0,255,163,0.04)','rgba(201,168,76,0.06)','rgba(0,229,255,0.04)'];
  const COLS   = ['wide','tall','half','half','third','third','third'];

  return (
    <div className="studios-root">

      {/* ── Navbar ── */}
      <nav className="studios-nav">
        <div className="studios-nav-logo" onClick={() => navigate('/')}>
          <div className="studios-nav-logo-mark">◈</div>
          <div className="studios-nav-logo-text">
            <span className="studios-nav-logo-main">AIPG Studios</span>
            <span className="studios-nav-logo-sub">Cinematic AI Production</span>
          </div>
        </div>
        <div className="studios-nav-links">
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#process">Process</a>
          <a href="#contact" className="studios-nav-cta">Start a Project</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="studios-hero">
        <YTBackground videoId={videos.studiosBgYoutubeId} opacity={videos.studiosBgOpacity || 0.3} />
        <div className="studios-hero-bg" />
        <div className="studios-hero-grid" />
        <div className="studios-hero-content" style={{ position:'relative', zIndex:10 }}>
          <div className="studios-hero-eyebrow">Division I — AIPG Studios</div>
          <h1 className="studios-hero-title" dangerouslySetInnerHTML={{
            __html: (s.heroTitle || 'Where Vision Becomes Cinema').replace(/\n/g,'<br/>')
          }} />
          <p className="studios-hero-sub">{s.heroSub || 'High-fidelity AI video production for brands that refuse to be ordinary.'}</p>
          <div className="studios-hero-actions">
            <button className="studios-btn-primary" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior:'smooth' })}>
              {s.heroBtn1 || 'View Our Work'}
            </button>
            <button className="studios-btn-secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })}>
              {s.heroBtn2 || 'Start a Project'} →
            </button>
          </div>
        </div>
        <div className="studios-hero-scroll">
          <div className="studios-hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* ── Stats ── */}
      {stats.length > 0 && (
        <div className="studios-stats">
          {stats.map(s => <StatItem key={s.label} value={s.value} label={s.label} />)}
        </div>
      )}

      {/* ── Showreel ── */}
      {showreel.length > 0 && (
        <section className="studios-reel">
          <div className="studios-reel-inner">
            <div className="studios-reel-header">
              <div>
                <div className="studios-section-label">Showreel</div>
                <h2 className="studios-section-title">Watch What We <span>Create</span></h2>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
              {showreel.map(video => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  style={{
                    position:'relative', borderRadius:14, overflow:'hidden',
                    border:'1px solid rgba(201,168,76,0.12)', background:'#110D08',
                    cursor:'pointer', transition:'all 0.3s', aspectRatio:'16/9',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.35)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.12)'; e.currentTarget.style.transform=''; }}
                >
                  {video.youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.7 }}
                    />
                  ) : (
                    <div style={{ fontSize:'2rem', opacity:0.2 }}>🎬</div>
                  )}
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to top, rgba(10,8,6,0.9) 0%, transparent 60%)',
                    display:'flex', flexDirection:'column', justifyContent:'flex-end',
                    padding:'1rem', gap:'0.3rem',
                  }}>
                    <span style={{ fontFamily:'monospace', fontSize:'0.55rem', letterSpacing:'0.2em', color:'rgba(201,168,76,0.6)', textTransform:'uppercase' }}>{video.category}</span>
                    <span style={{ fontFamily:'serif', fontSize:'1rem', color:'rgba(240,244,255,0.9)' }}>{video.title}</span>
                  </div>
                  <div style={{
                    position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                    width:48, height:48, borderRadius:'50%',
                    background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#C9A84C', fontSize:'1.1rem',
                  }}>▶</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {services.length > 0 && (
        <section className="studios-section" id="services">
          <div className="studios-section-label">What We Do</div>
          <h2 className="studios-section-title">Our <span>Services</span></h2>
          <p className="studios-section-sub">Every service designed for one outcome — output that stops the scroll, builds the brand, and moves the audience.</p>
          <div className="studios-services-grid">
            {services.map(sv => (
              <div className="studios-service-card" key={sv.title}>
                <div className="studios-service-icon">{sv.icon}</div>
                <div className="studios-service-title">{sv.title}</div>
                <p className="studios-service-desc">{sv.desc}</p>
                <div className="studios-service-tags">
                  {(sv.tags || []).map(t => <span key={t} className="studios-service-tag">{t}</span>)}
                </div>
                <div className="studios-service-price">{sv.price}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Portfolio ── */}
      {portfolio.length > 0 && (
        <section style={{ padding:'clamp(5rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', maxWidth:1280, margin:'0 auto' }} id="portfolio">
          <div className="studios-section-label">Our Work</div>
          <h2 className="studios-section-title">Selected <span>Portfolio</span></h2>
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginTop:'2rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                padding:'0.35rem 1rem', borderRadius:100,
                border:`1px solid ${activeFilter===cat?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.1)'}`,
                background: activeFilter===cat?'rgba(201,168,76,0.1)':'transparent',
                color: activeFilter===cat?'#C9A84C':'rgba(240,244,255,0.3)',
                fontFamily:'monospace', fontSize:'0.6rem', letterSpacing:'0.12em',
                textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>
          <div className="studios-portfolio-grid">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`studios-portfolio-item studios-portfolio-item--${COLS[i % COLS.length]}`}
                style={{ background:`linear-gradient(135deg, #110D08, ${COLORS[i % COLORS.length]})` }}
                onClick={() => item.youtubeId && setActiveVideo(item)}
              >
                <div className="studios-portfolio-bg">{item.emoji}</div>
                <div className="studios-portfolio-overlay">
                  <span className="studios-portfolio-cat">{item.cat}</span>
                  <span className="studios-portfolio-name">{item.title}</span>
                </div>
                {item.youtubeId && (
                  <div style={{
                    position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                    width:44, height:44, borderRadius:'50%',
                    background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.35)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#C9A84C', fontSize:'1rem', opacity:0, transition:'opacity 0.2s',
                  }} className="portfolio-play">▶</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Clients ── */}
      {clients.length > 0 && (
        <section style={{ padding:'3rem clamp(1.5rem,5vw,5rem)', borderTop:'1px solid rgba(201,168,76,0.06)' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <div className="studios-tech-label" style={{ textAlign:'center', fontFamily:'monospace', fontSize:'0.55rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(201,168,76,0.3)', marginBottom:'1.5rem' }}>
              Trusted by
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', justifyContent:'center' }}>
              {clients.map(c => (
                <div key={c.name} style={{
                  display:'flex', alignItems:'center', gap:'0.5rem',
                  padding:'0.5rem 1.2rem',
                  border:'1px solid rgba(201,168,76,0.1)', borderRadius:8,
                  background:'rgba(201,168,76,0.02)',
                  fontFamily:'sans-serif', fontSize:'0.8rem', color:'rgba(240,244,255,0.45)',
                }}>
                  <span>{c.logo}</span>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      {process.length > 0 && (
        <section className="studios-process" id="process">
          <div className="studios-process-inner">
            <div className="studios-section-label">How We Work</div>
            <h2 className="studios-section-title">The <span>Production</span> Process</h2>
            <div className="studios-process-steps">
              {process.map(step => (
                <div className="studios-process-step" key={step.num}>
                  <div className="studios-process-num">{step.num}</div>
                  <div className="studios-process-title">{step.title}</div>
                  <p className="studios-process-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tech Stack ── */}
      {tech.length > 0 && (
        <section className="studios-tech">
          <div className="studios-tech-inner">
            <div className="studios-tech-label">Powered by the best AI tools in the world</div>
            <div className="studios-tech-chips">
              {tech.map(t => <span key={t} className="studios-tech-chip">{t}</span>)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="studios-cta" id="contact">
        <div className="studios-cta-bg" />
        <div className="studios-cta-inner">
          <div className="studios-section-label" style={{ justifyContent:'center' }}>Start a Project</div>
          <h2 className="studios-cta-title">
            {(s.ctaTitle || 'Ready to Create Something Extraordinary?').split(' ').slice(0,-1).join(' ')}{' '}
            <span>{(s.ctaTitle || 'Ready to Create Something Extraordinary?').split(' ').slice(-1)}</span>
          </h2>
          <p className="studios-cta-sub">{s.ctaSub || 'Tell us about your project. We\'ll come back with a creative treatment within 24 hours.'}</p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
            <button className="studios-btn-primary" onClick={() => window.location.href=`mailto:${s.ctaEmail||'studios@aipgdbd.com'}`}>
              {s.ctaEmail || 'studios@aipgdbd.com'}
            </button>
            <button className="studios-btn-secondary" onClick={() => navigate('/home#contact')}>
              Use Contact Form →
            </button>
          </div>
          {s.ctaWhatsapp && (
            <a className="studios-cta-email" href={s.ctaWhatsapp} target="_blank" rel="noreferrer">
              Or message us on WhatsApp ↗
            </a>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="studios-footer">
        <span className="studios-footer-copy">© {new Date().getFullYear()} AIPG Studios · AI Playground BD · Dhaka, Bangladesh</span>
        <button className="studios-footer-back" onClick={() => navigate('/')}>← Back to Nexus</button>
      </footer>

      {/* ── Video Modal ── */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

    </div>
  );
}
