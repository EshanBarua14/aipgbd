import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import { getConfig } from '../hooks/db';
import './NexusLanding.css';

// YouTube iframe background
function YTBackground({ videoId, opacity = 0.35 }) {
  if (!videoId) return null;
  // Use nocookie + autoplay + mute + loop + controls=0
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <iframe
        src={src}
        title="bg"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '177.78vh', minWidth: '100%',
          height: '56.25vw', minHeight: '100%',
          transform: 'translate(-50%,-50%)',
          opacity,
          pointerEvents: 'none',
        }}
      />
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
    </div>
  );
}

// Film strip for Studios side
function FilmStrip({ side }) {
  const holes = Array.from({ length: 40 });
  return (
    <div className={`film-strip film-strip--${side}`}>
      {holes.map((_, i) => <div key={i} className="film-hole" />)}
    </div>
  );
}

// Code rain for Systems side
const CODE_CHARS = '01アイウエオカキクケコ{}[]<>/\\=+-*&^%$#@!';
function CodeRain() {
  const cols = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="code-rain">
      {cols.map(i => {
        const chars = Array.from({ length: 30 }, () =>
          CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
        ).join('\n');
        return (
          <div
            key={i}
            className="code-col"
            style={{
              left: `${(i / 18) * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${-Math.random() * 10}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          >
            {chars}
          </div>
        );
      })}
    </div>
  );
}

export default function NexusLanding() {
  const [hover, setHover]   = useState(null);
  const navigate            = useNavigate();
  const { setDivision }     = useDivision();
  const flashRef            = useRef(null);
  const cursorRef           = useRef(null);
  const ringRef             = useRef(null);
  const ringPos             = useRef({ x: 0, y: 0 });
  const mousePos            = useRef({ x: 0, y: 0 });
  const rafRef              = useRef(null);

  const cfg    = getConfig();
  const videos = cfg.videos || {};
  const nexus  = cfg.nexus  || {};

  useEffect(() => {
    setDivision(null);
    document.body.style.cursor = 'none';
    document.title = `${cfg.site?.name || 'AIPG'} — AI Playground BD`;
    return () => { document.body.style.cursor = ''; };
  }, [setDivision, cfg.site]);

  // Custom cursor
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top  = e.clientY + 'px';
      }
    };
    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top  = ringPos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleClick = (dest) => {
    if (flashRef.current) flashRef.current.classList.add('active');
    setDivision(dest);
    setTimeout(() => navigate('/' + dest), 320);
  };

  return (
    <>
      <div className="nexus-root" data-hover={hover || undefined}>

        {/* Global YouTube BG */}
        <YTBackground videoId={videos.nexusBgYoutubeId} opacity={videos.nexusBgOpacity || 0.35} />

        {/* Topbar */}
        <nav className="nexus-topbar">
          <span className="nexus-topbar-logo">{nexus.centerLogoSub || 'AI Playground BD'}</span>
          <div className="nexus-topbar-links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        {/* Studios Side */}
        <div
          className="nexus-side nexus-side--studios"
          onMouseEnter={() => setHover('studios')}
          onMouseLeave={() => setHover(null)}
          onClick={() => handleClick('studios')}
        >
          <FilmStrip side="left" />
          <FilmStrip side="right" />
          <div className="nexus-content">
            <span className="nexus-eyebrow">{nexus.studiosEyebrow || 'Division I'}</span>
            <h2 className="nexus-title">{nexus.studiosLabel || 'Cinematic AI Production'}</h2>
            <p className="nexus-sub">{nexus.studiosSub || 'High-fidelity AI video production. From concept to final render.'}</p>
            <button className="nexus-cta">{nexus.studiosBtn || 'Enter Studios'} →</button>
          </div>
        </div>

        {/* Systems Side */}
        <div
          className="nexus-side nexus-side--systems"
          onMouseEnter={() => setHover('systems')}
          onMouseLeave={() => setHover(null)}
          onClick={() => handleClick('systems')}
        >
          <CodeRain />
          <div className="nexus-content">
            <span className="nexus-eyebrow">{nexus.systemsEyebrow || 'Division II'}</span>
            <h2 className="nexus-title">{nexus.systemsLabel || 'Enterprise Software'}</h2>
            <p className="nexus-sub">{nexus.systemsSub || 'Production-grade React & ASP.NET solutions.'}</p>
            <button className="nexus-cta">{nexus.systemsBtn || 'Enter Systems'} →</button>
          </div>
        </div>

        {/* Divider */}
        <div className="nexus-divider" />

        {/* Center Logo */}
        <div className="nexus-center">
          <div className="nexus-logo-ring">
            <span className="nexus-logo-text">{nexus.centerLogoText || 'AIPG'}</span>
          </div>
          <span className="nexus-logo-sub">{nexus.centerLogoSub || 'AI Playground BD'}</span>
        </div>

        {/* Hint */}
        <div className="nexus-hint">{nexus.hint || 'Hover to explore · Click to enter'}</div>
      </div>

      {/* Flash overlay */}
      <div className="nexus-flash" ref={flashRef} />

      {/* Custom cursor */}
      <div className="nexus-cursor" ref={cursorRef} />
      <div className="nexus-cursor-ring" ref={ringRef} />
    </>
  );
}
