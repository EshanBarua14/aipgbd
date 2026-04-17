import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import './StudiosPage.css';

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: '🎬',
    title: 'Cinematic AI Video',
    desc: 'Feature-quality AI video production — from brand films and product showcases to full narrative shorts. Every frame crafted with precision.',
    price: 'Starting from 15,000 BDT',
    tags: ['Sora', 'Runway', 'Kling', 'Pika'],
  },
  {
    icon: '🎵',
    title: 'AI Audio & Scoring',
    desc: 'Original soundscapes, voiceovers, and full film scores generated and refined with AI tools — synchronized perfectly to your visuals.',
    price: 'Starting from 8,000 BDT',
    tags: ['Suno', 'ElevenLabs', 'Udio', 'Adobe'],
  },
  {
    icon: '🖼️',
    title: 'Visual Development',
    desc: 'Concept art, storyboarding, style frames, and key visual creation using the latest diffusion models — your vision rendered before production.',
    price: 'Starting from 6,000 BDT',
    tags: ['Midjourney', 'Flux', 'Stable Diffusion', 'Firefly'],
  },
  {
    icon: '✨',
    title: 'VFX & Compositing',
    desc: 'AI-enhanced VFX, motion compositing, and post-production finishing. Professional-grade output at a fraction of traditional cost.',
    price: 'Starting from 12,000 BDT',
    tags: ['After Effects', 'Topaz', 'Gemini', 'DaVinci'],
  },
  {
    icon: '📣',
    title: 'Social Content Engine',
    desc: 'Rapid-fire short-form content: Reels, TikToks, YouTube Shorts — scripted, generated, and scheduled across all platforms automatically.',
    price: 'Starting from 5,000 BDT / month',
    tags: ['Meta', 'YouTube', 'LinkedIn', 'Batch'],
  },
  {
    icon: '🎭',
    title: 'Brand Identity Films',
    desc: 'Full-scale brand documentary and identity films. We craft the narrative arc, visual language, and emotional tone that defines your brand.',
    price: 'Custom quote',
    tags: ['Script', 'Direction', 'Grade', 'Delivery'],
  },
];

const PORTFOLIO = [
  { id: 1, title: 'Dhaka Neon — Brand Film', cat: 'Brand Film',   emoji: '🌆', col: 'wide',  color: 'rgba(201,168,76,0.08)' },
  { id: 2, title: 'Synthwave Product Reel',  cat: 'Product',      emoji: '🎛️', col: 'tall',  color: 'rgba(155,89,255,0.06)' },
  { id: 3, title: 'FinTech Identity Film',   cat: 'Corporate',    emoji: '💳', col: 'half',  color: 'rgba(0,229,255,0.05)'  },
  { id: 4, title: 'AI Fashion Editorial',    cat: 'Editorial',    emoji: '👗', col: 'half',  color: 'rgba(224,64,251,0.05)' },
  { id: 5, title: 'Pharma Documentary',      cat: 'Documentary',  emoji: '🧬', col: 'third', color: 'rgba(0,255,163,0.04)'  },
  { id: 6, title: 'Restaurant Atmosphere',   cat: 'Lifestyle',    emoji: '🍜', col: 'third', color: 'rgba(201,168,76,0.06)' },
  { id: 7, title: 'Urban Architecture',      cat: 'Architectural',emoji: '🏛️', col: 'third', color: 'rgba(0,229,255,0.04)'  },
];

const PROCESS = [
  { num: '01', title: 'Brief & Vision',   desc: 'We start with a deep-dive session to understand your brand, objectives, and creative vision. No templates — just listening.' },
  { num: '02', title: 'Concept & Script', desc: 'Our team crafts the narrative arc, visual style, and storyboard. You see the film before we generate a single frame.' },
  { num: '03', title: 'AI Production',    desc: 'Using a curated stack of cinematic AI tools, we generate, iterate, and refine until every frame meets the brief.' },
  { num: '04', title: 'Post & Grade',     desc: 'VFX, colour grading, audio mixing, and final compositing — every output is polished to broadcast standard.' },
  { num: '05', title: 'Delivery',         desc: 'All formats, all platforms. We handle export specs for social, broadcast, OOH, and web simultaneously.' },
];

const TECH = [
  'Sora', 'Runway Gen-4', 'Kling', 'Pika 2.0', 'Midjourney v7',
  'Flux Pro', 'Stable Diffusion XL', 'Adobe Firefly',
  'ElevenLabs', 'Suno v4', 'Udio', 'Gemini',
  'After Effects', 'DaVinci Resolve', 'Topaz AI', 'CapCut Pro',
];

const STATS = [
  { value: '120+', label: 'Videos Produced'  },
  { value: '48h',  label: 'Avg Turnaround'   },
  { value: '98%',  label: 'Client Retention' },
  { value: '4K',   label: 'Max Resolution'   },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function StatItem({ value, label }) {
  const [display, setDisplay] = useState('0');
  const [started, setStarted]  = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
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
  const [reelOpen,      setReelOpen]      = useState(false);
  const [activeFilter,  setActiveFilter]  = useState('All');

  useEffect(() => {
    setDivision('studios');
    document.title = 'AIPG Studios – Cinematic AI Production';
    window.scrollTo(0, 0);
  }, [setDivision]);

  // scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const categories = ['All', 'Brand Film', 'Product', 'Corporate', 'Editorial', 'Documentary'];
  const filtered   = activeFilter === 'All' ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === activeFilter);

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
        <div className="studios-hero-bg" />
        <div className="studios-hero-grid" />
        <div className="studios-hero-content">
          <div className="studios-hero-eyebrow">Division I — AIPG Studios</div>
          <h1 className="studios-hero-title">
            Where <em>Vision</em><br />Becomes Cinema
          </h1>
          <p className="studios-hero-sub">
            High-fidelity AI video production for brands that refuse to be ordinary.
            Cinematic quality. Infinite scale. Delivered in days, not months.
          </p>
          <div className="studios-hero-actions">
            <button
              className="studios-btn-primary"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Our Work
            </button>
            <button
              className="studios-btn-secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a Project →
            </button>
          </div>
        </div>
        <div className="studios-hero-scroll">
          <div className="studios-hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="studios-stats">
        {STATS.map(s => <StatItem key={s.label} {...s} />)}
      </div>

      {/* ── Video Reel ── */}
      <section className="studios-reel">
        <div className="studios-reel-inner">
          <div className="studios-reel-header">
            <div>
              <div className="studios-section-label">Showreel</div>
              <h2 className="studios-section-title">Watch What We <span>Create</span></h2>
            </div>
            <button className="studios-btn-secondary" onClick={() => setReelOpen(true)}>
              Watch Full Reel ↗
            </button>
          </div>
          <div className="studios-reel-frame" onClick={() => setReelOpen(true)}>
            <div className="studios-reel-bg" />
            <span className="studios-reel-corner studios-reel-corner--tl">AIPG Studios 2025</span>
            <span className="studios-reel-corner studios-reel-corner--tr">4K · HDR</span>
            <span className="studios-reel-corner studios-reel-corner--bl">Showreel v2.0</span>
            <span className="studios-reel-corner studios-reel-corner--br">3:42</span>
            <div className="studios-reel-play">
              <div className="studios-reel-play-btn">▶</div>
              <span className="studios-reel-play-label">Play Showreel</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="studios-section" id="services">
        <div className="studios-section-label">What We Do</div>
        <h2 className="studios-section-title">Our <span>Services</span></h2>
        <p className="studios-section-sub">
          Every service is designed for one outcome — output that stops the scroll, builds the brand, and moves the audience.
        </p>
        <div className="studios-services-grid">
          {SERVICES.map(s => (
            <div className="studios-service-card" key={s.title}>
              <div className="studios-service-icon">{s.icon}</div>
              <div className="studios-service-title">{s.title}</div>
              <p className="studios-service-desc">{s.desc}</p>
              <div className="studios-service-tags">
                {s.tags.map(t => <span key={t} className="studios-service-tag">{t}</span>)}
              </div>
              <div className="studios-service-price">{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section style={{ padding: 'clamp(5rem,8vw,8rem) clamp(1.5rem,5vw,5rem)', maxWidth: 1280, margin: '0 auto' }} id="portfolio">
        <div className="studios-section-label">Our Work</div>
        <h2 className="studios-section-title">Selected <span>Portfolio</span></h2>
        <p className="studios-section-sub">
          A curated selection of brand films, product reels, documentaries, and editorial work.
        </p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '0.35rem 1rem',
                borderRadius: 100,
                border: `1px solid ${activeFilter === cat ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.1)'}`,
                background: activeFilter === cat ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: activeFilter === cat ? '#C9A84C' : 'rgba(240,244,255,0.3)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="studios-portfolio-grid">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`studios-portfolio-item studios-portfolio-item--${item.col}`}
              style={{ background: `linear-gradient(135deg, #110D08, ${item.color})` }}
            >
              <div className="studios-portfolio-bg">{item.emoji}</div>
              <div
                className="studios-portfolio-glow"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${item.color} 0%, transparent 70%)` }}
              />
              <div className="studios-portfolio-overlay">
                <span className="studios-portfolio-cat">{item.cat}</span>
                <span className="studios-portfolio-name">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button className="studios-btn-secondary">View Full Portfolio ↗</button>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="studios-process" id="process">
        <div className="studios-process-inner">
          <div className="studios-section-label">How We Work</div>
          <h2 className="studios-section-title">The <span>Production</span> Process</h2>
          <p className="studios-section-sub">
            From first brief to final delivery — a structured creative process that keeps you in control at every stage.
          </p>
          <div className="studios-process-steps">
            {PROCESS.map(step => (
              <div className="studios-process-step" key={step.num}>
                <div className="studios-process-num">{step.num}</div>
                <div className="studios-process-title">{step.title}</div>
                <p className="studios-process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="studios-tech">
        <div className="studios-tech-inner">
          <div className="studios-tech-label">Powered by the best AI tools in the world</div>
          <div className="studios-tech-chips">
            {TECH.map(t => <span key={t} className="studios-tech-chip">{t}</span>)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="studios-cta" id="contact">
        <div className="studios-cta-bg" />
        <div className="studios-cta-inner">
          <div className="studios-section-label" style={{ justifyContent: 'center' }}>Start a Project</div>
          <h2 className="studios-cta-title">
            Ready to Create Something <span>Extraordinary?</span>
          </h2>
          <p className="studios-cta-sub">
            Tell us about your project. We'll come back with a creative treatment, timeline, and quote within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="studios-btn-primary" onClick={() => window.location.href = 'mailto:studios@aipgdbd.com'}>
              studios@aipgdbd.com
            </button>
            <button className="studios-btn-secondary" onClick={() => navigate('/home#contact')}>
              Use Contact Form →
            </button>
          </div>
          <a className="studios-cta-email" href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noreferrer">
            Or message us on WhatsApp ↗
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="studios-footer">
        <span className="studios-footer-copy">
          © {new Date().getFullYear()} AIPG Studios · AI Playground BD · Dhaka, Bangladesh
        </span>
        <button className="studios-footer-back" onClick={() => navigate('/')}>
          ← Back to Nexus
        </button>
      </footer>

      {/* ── Reel Modal ── */}
      {reelOpen && (
        <div
          onClick={() => setReelOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 900,
              background: '#110D08',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 20, overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(201,168,76,0.08)',
            }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
                AIPG Studios — Showreel 2025
              </span>
              <button onClick={() => setReelOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(240,244,255,0.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {/* 
              TO ADD YOUR REEL: Replace the div below with:
              <iframe
                width="100%" style={{aspectRatio:'16/9',display:'block'}}
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                allow="autoplay; fullscreen" title="AIPG Studios Showreel"
              />
            */}
            <div style={{ aspectRatio: '16/9', background: '#0A0806', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '3rem', opacity: 0.2 }}>🎬</div>
              <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase' }}>
                Add your YouTube / Vimeo embed URL
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
