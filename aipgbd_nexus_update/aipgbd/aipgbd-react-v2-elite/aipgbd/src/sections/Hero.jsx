import React, { useEffect, useRef, useState } from 'react';
import { useInView, useCounter } from '../hooks';
import { STATS } from '../data/content';
import './Hero.css';

function StatCounter({ num, unit, label, delay }) {
  const [ref, inView] = useInView();
  const isNum = !isNaN(parseInt(num));
  const count = useCounter(parseInt(num) || 0, 1400, inView && isNum);
  return (
    <div className="hero__stat" ref={ref} style={{ animationDelay: delay }}>
      <div className="hero__stat-num">{isNum ? count : num}<span>{unit}</span></div>
      <div className="hero__stat-label">{label}</div>
    </div>
  );
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const blurAmount = Math.min(scrollY / 8, 18);
  const glassOpacity = Math.min(scrollY / 300, 0.85);

  return (
    <section className="hero" ref={heroRef}>
      {/* Background video layer */}
      <div className="hero__video-bg" style={{ filter: `blur(${blurAmount}px)` }}>
        <div className="hero__video-placeholder-bg">
          {/* Replace inner div with: <video src="/showreel.mp4" autoPlay muted loop playsInline /> */}
          <div className="hero__grid-lines" />
        </div>
        <div className="hero__radial" />
      </div>

      {/* Scrollytelling glass overlay */}
      <div className="hero__glass-overlay" style={{ opacity: glassOpacity }} />

      {/* Scan line effect */}
      <div className="hero__scanline" />

      <div className="container hero__inner">
        <div className="hero__tag">
          <span className="hero__rec" />
          Dhaka · Bangladesh · Est. 2024
        </div>

        <h1 className="hero__headline">
          <span className="hero__hl-1">Architecture</span>
          <span className="hero__hl-2">of Intent.</span>
        </h1>

        <p className="hero__sub">
          Where AI-driven cinematography meets enterprise-grade engineering.
          <br />
          <span style={{ color: 'var(--text-muted)' }}>Not a studio. A system.</span>
        </p>

        <div className="hero__actions">
          <button className="btn-primary" onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}>
            View Growth OS
          </button>
          <button className="btn-ghost" onClick={() => document.getElementById('bento').scrollIntoView({ behavior: 'smooth' })}>
            See Our Work
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="hero__stats">
          {STATS.map((s, i) => (
            <StatCounter key={s.label} {...s} delay={`${0.7 + i * 0.1}s`} />
          ))}
        </div>

        {/* 19:6 cinematic frame indicator */}
        <div className="hero__ratio-badge">19:6 · Ultra-Wide Cinematic</div>
      </div>

      {/* Bottom gradient fade */}
      <div className="hero__bottom-fade" />
    </section>
  );
}
