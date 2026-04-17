import { useEffect, useRef, useState } from 'react';

export default function Hero({ db }) {
  const s = db.site;
  const words = s.heroWords || ['Cinema.', 'Brands.', 'Stories.'];
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const particlesRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setVisible(true); }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      color: ['rgba(0,229,255,', 'rgba(155,89,255,', 'rgba(224,64,251,'][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')'; ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const videoId = s.heroVideoId;

  return (
    <section id="hero" className="hero">
      <canvas ref={particlesRef} className="hero__particles" />
      {/* Video background */}
      {videoId && (
        <div className="hero__video-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="hero bg" frameBorder="0" allow="autoplay"
            className="hero__video-iframe"
          />
        </div>
      )}
      <div className="hero__overlay" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />

      <div className="hero__content container">
        <div className="section-badge reveal" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
          <span className="hero__badge-dot" />
          <span className="t-label">Dhaka, Bangladesh · Est. 2026</span>
        </div>
        <h1 className="hero__title t-display reveal reveal-delay-1">
          We create<br />
          <span className={`hero__word grad-text ${visible ? 'in' : 'out'}`}>{words[wordIdx]}</span>
          <br /><span className="hero__subtitle">AI-engineered.</span>
        </h1>
        <p className="hero__sub t-body reveal reveal-delay-2">{s.heroSubtitle}</p>
        <div className="hero__actions reveal reveal-delay-3">
          <a href="#work" className="btn-primary" data-hover>
            <span>{s.ctaPrimary || 'See Our Work'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#contact" className="btn-ghost" data-hover>
            <span>{s.ctaSecondary || 'Start a Project'}</span>
          </a>
        </div>
        <div className="hero__stats reveal reveal-delay-4">
          {(db.stats || []).map((stat, i) => (
            <div className="hero__stat" key={i}>
              <div className="hero__stat-num">
                <span className="grad-text">{stat.num}</span>
                <span className="hero__stat-unit">{stat.unit}</span>
              </div>
              <div className="t-label hero__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="t-label">Scroll</span>
      </div>

      <style>{`
        .hero { min-height:100vh; display:flex; align-items:center; position:relative; overflow:hidden; padding:9rem 0 5rem; }
        .hero__particles { position:absolute; inset:0; pointer-events:none; z-index:0; }
        .hero__video-wrap { position:absolute; inset:0; z-index:1; pointer-events:none; overflow:hidden; }
        .hero__video-iframe { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:177.78vh; min-width:100%; height:56.25vw; min-height:100%; opacity:0.35; }
        .hero__overlay { position:absolute; inset:0; z-index:2; background:linear-gradient(to bottom, rgba(5,9,20,0.55) 0%, rgba(5,9,20,0.4) 50%, rgba(5,9,20,0.8) 100%); }
        [data-theme="light"] .hero__overlay { background:linear-gradient(to bottom, rgba(5,9,20,0.7) 0%, rgba(5,9,20,0.55) 50%, rgba(5,9,20,0.85) 100%); }
        .hero__orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:1; }
        .hero__orb--1 { width:500px; height:500px; background:radial-gradient(circle,rgba(0,229,255,0.1) 0%,transparent 70%); top:-100px; right:-100px; animation:orbFloat 8s ease-in-out infinite; }
        .hero__orb--2 { width:400px; height:400px; background:radial-gradient(circle,rgba(155,89,255,0.08) 0%,transparent 70%); bottom:0; left:-50px; animation:orbFloat 10s ease-in-out infinite reverse; }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.95)} }
        .hero__content { position:relative; z-index:3; max-width:820px; }
        .hero__badge-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 8px var(--cyan); animation:pulse 2s ease-in-out infinite; flex-shrink:0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .hero__title { font-size:clamp(3.2rem,8vw,8rem); margin-bottom:1.5rem; color:#fff; text-shadow:0 2px 20px rgba(0,0,0,0.5); }
        .hero__word { display:inline-block; transition:opacity 0.4s ease,transform 0.4s ease; }
        .hero__word.in { opacity:1; transform:translateY(0); }
        .hero__word.out { opacity:0; transform:translateY(-16px); }
        .hero__subtitle { color:rgba(255,255,255,0.5); font-weight:300; font-size:0.65em; }
        .hero__sub { font-size:clamp(0.88rem,1.3vw,1.05rem); max-width:560px; margin-bottom:2.5rem; color:rgba(255,255,255,0.7) !important; }
        .hero__actions { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:4rem; }
        .hero__stats { display:flex; gap:3rem; flex-wrap:wrap; padding-top:2.5rem; border-top:1px solid rgba(255,255,255,0.1); }
        .hero__stat-num { font-family:'Outfit',sans-serif; font-weight:800; font-size:2.8rem; line-height:1; margin-bottom:0.3rem; display:flex; align-items:baseline; gap:2px; }
        .hero__stat-unit { font-size:1.4rem; background:var(--grad-text); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero__stat-label { color:rgba(255,255,255,0.4) !important; font-size:0.62rem; }
        .hero__scroll { position:absolute; bottom:2.5rem; right:3rem; display:flex; flex-direction:column; align-items:center; gap:0.75rem; opacity:0.4; z-index:3; }
        .hero__scroll .t-label { color:rgba(255,255,255,0.6); }
        .hero__scroll-line { width:1px; height:50px; background:linear-gradient(to bottom,transparent,var(--cyan)); animation:scrollAnim 2s ease-in-out infinite; }
        @keyframes scrollAnim { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @media (max-width:600px) { .hero__scroll{display:none} .hero__stats{gap:1.5rem} }
      `}</style>
    </section>
  );
}
