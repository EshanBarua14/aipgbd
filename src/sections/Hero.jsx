import React, { useEffect, useRef, useState } from 'react';
import { STATS } from '../data/content';
import { useInView, useCounter } from '../hooks';
import './Hero.css';

function StatCounter({ num, unit, label }) {
  const [ref, inView] = useInView();
  const isNum = !isNaN(parseInt(num));
  const count = useCounter(parseInt(num) || 0, 1400, inView && isNum);
  return (
    <div className="hero__stat" ref={ref}>
      <div className="hero__stat-num">{isNum ? count : num}<span>{unit}</span></div>
      <div className="hero__stat-label">{label}</div>
    </div>
  );
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const blur = Math.min(scrollY / 10, 16);

  return (
    <section className="hero">
      {/* Subtle grid */}
      <div className="hero__grid" />
      {/* Radial glow */}
      <div className="hero__glow" />
      {/* Scanline */}
      <div className="hero__scan" />
      {/* Vertical frame lines */}
      <div className="hero__line hero__line--l" />
      <div className="hero__line hero__line--r" />

      <div className="container hero__inner">
        <div className="hero__tag" style={{ animationDelay: '0.1s' }}>
          <span className="hero__dot" />
          Dhaka · Bangladesh · Est. 2024
        </div>

        <h1 className="hero__headline">
          <span className="hero__h-plain">Architecture</span>
          <span className="hero__h-gold">of Intent.</span>
        </h1>

        <p className="hero__sub">
          Where AI-driven cinematography meets enterprise-grade engineering.<br />
          <span style={{ color: 'var(--text-muted)' }}>Not a studio. A system.</span>
        </p>

        <div className="hero__actions">
          <button className="btn-primary" onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}>
            View Growth OS
          </button>
          <button className="btn-ghost" onClick={() => document.getElementById('bento').scrollIntoView({ behavior: 'smooth' })}>
            See Our Work
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Video frame — 19:6 ratio hint */}
        <div className="hero__frame">
          <div className="hero__frame-inner" style={{ filter: `blur(${blur * 0.3}px)` }}>
            {/* Drop your showreel here: replace the div below with <video src="/showreel.mp4" autoPlay muted loop playsInline /> */}
            <div className="hero__frame-placeholder">
              <div className="hero__frame-label">
                <span className="hero__dot" style={{ width: 6, height: 6 }} />
                19:6 · Ultra-Wide Cinematic · Place showreel.mp4 here
              </div>
              <div className="hero__timeline">
                <div className="hero__tl-bar"><div className="hero__tl-fill" /></div>
                <div className="hero__tl-labels">
                  <span style={{ color: 'var(--gold)' }}>0s</span>
                  <span>10s</span><span>20s</span>
                  <span style={{ color: 'var(--gold)' }}>30s</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero__frame-caption">One image. 30 unbroken seconds. Zero studio.</div>
        </div>

        <div className="hero__stats">
          {STATS.map(s => <StatCounter key={s.label} {...s} />)}
        </div>
      </div>

      <div className="hero__fade" />
    </section>
  );
}
