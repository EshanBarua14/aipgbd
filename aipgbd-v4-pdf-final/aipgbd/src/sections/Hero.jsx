import React, { useEffect, useState } from 'react';
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
  const [phase, setPhase] = useState(0); // 0=blank, 1=tagline appears

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    // 3-second blank hero then text appears — per PDF spec
    const t = setTimeout(() => setPhase(1), 3000);
    return () => { window.removeEventListener('scroll', h); clearTimeout(t); };
  }, []);

  const blur = Math.min(scrollY / 10, 16);

  return (
    <section className="hero">
      <div className="hero__grid" />
      <div className="hero__glow" />
      <div className="hero__scan" />
      <div className="hero__line hero__line--l" />
      <div className="hero__line hero__line--r" />

      <div className="container hero__inner">

        {/* 3-second visual dominance pause then text reveals */}
        <div className={`hero__content ${phase === 1 ? 'hero__content--show' : ''}`}>
          <div className="hero__tag">
            <span className="hero__dot" />
            Digital Foundry · Dhaka, Bangladesh · Est. 2024
          </div>

          <h1 className="hero__headline">
            <span className="hero__h-plain">Engineering</span>
            <span className="hero__h-gold">the Inevitable.</span>
          </h1>

          <p className="hero__sub">
            We bridge heavy software engineering with Hollywood-standard AI cinematics.<br />
            <span style={{ color: 'var(--text-muted)' }}>Most agencies are creative or technical. We are both.</span>
          </p>

          <div className="hero__actions">
            <button className="btn-primary" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
              View Service Tiers
            </button>
            <button className="btn-ghost" onClick={() => document.getElementById('bento').scrollIntoView({ behavior: 'smooth' })}>
              See Our Work
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 19:6 ultra-wide video frame */}
        <div className={`hero__frame ${phase === 1 ? 'hero__frame--show' : ''}`}>
          <div className="hero__frame-inner" style={{ filter: `blur(${blur * 0.25}px)` }}>
            {/* Replace inner div with: <video src="/showreel.mp4" autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
            <div className="hero__frame-placeholder">
              <div className="hero__frame-label">
                <span className="hero__dot" style={{ width: 5, height: 5 }} />
                19:6 · 4K Ultra-Wide · Drop showreel.mp4 here
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
          <div className="hero__frame-caption">
            4K · 19:6 Ultra-Wide · Grok Veo Long-Take · Suno v4 Original Score
          </div>
        </div>

        <div className={`hero__stats ${phase === 1 ? 'hero__stats--show' : ''}`}>
          {STATS.map(s => <StatCounter key={s.label} {...s} />)}
        </div>
      </div>

      <div className="hero__fade" />
    </section>
  );
}
