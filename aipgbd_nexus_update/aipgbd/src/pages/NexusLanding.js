import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import './NexusLanding.css';

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
const CODE_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|=+-*&^%$#@!';
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
              opacity: 0.3 + Math.random() * 0.5,
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
  const [hover, setHover] = useState(null); // 'studios' | 'systems' | null
  const navigate = useNavigate();
  const { setDivision } = useDivision();
  const flashRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Reset division on nexus page
  useEffect(() => {
    setDivision(null);
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, [setDivision]);

  // Custom cursor animation
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top = ringPos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleClick = (dest) => {
    if (flashRef.current) {
      flashRef.current.classList.add('active');
    }
    setDivision(dest);
    setTimeout(() => navigate('/' + dest), 340);
  };

  return (
    <>
      <div
        className="nexus-root"
        data-hover={hover || undefined}
      >
        {/* Topbar */}
        <nav className="nexus-topbar">
          <span className="nexus-topbar-logo">AI Playground BD</span>
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
            <span className="nexus-eyebrow">Division I</span>
            <h2 className="nexus-title">Cinematic AI<br />Production</h2>
            <p className="nexus-sub">
              High-fidelity AI video production. From concept to final render — cinematic, precise, and unforgettable.
            </p>
            <button className="nexus-cta">
              Enter Studios →
            </button>
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
            <span className="nexus-eyebrow">Division II</span>
            <h2 className="nexus-title">Enterprise<br />Software</h2>
            <p className="nexus-sub">
              Production-grade React &amp; ASP.NET solutions. Architected for scale, built to last.
            </p>
            <button className="nexus-cta">
              Enter Systems →
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="nexus-divider" />

        {/* Floating Center Logo */}
        <div className="nexus-center">
          <div className="nexus-logo-ring">
            <span className="nexus-logo-text">AIPG</span>
          </div>
          <span className="nexus-logo-sub">AI Playground BD</span>
        </div>

        {/* Bottom hint */}
        <div className="nexus-hint">Hover to explore · Click to enter</div>
      </div>

      {/* Flash overlay */}
      <div className="nexus-flash" ref={flashRef} />

      {/* Custom cursor */}
      <div className="nexus-cursor" ref={cursorRef} />
      <div className="nexus-cursor-ring" ref={ringRef} />
    </>
  );
}
