import React, { useState } from 'react';
import { useInView } from '../hooks';
import './BentoPortfolio.css';

const ITEMS = [
  { id: 'trading', size: 'large', label: 'Enterprise Dashboard', sub: 'React + ASP.NET Core 9.0', tag: 'Trading Terminal', color: '#C9A84C', detail: 'Banking-level SQL. Real-time order management for Dhaka stock brokers.', metric: '< 99ms' },
  { id: 'heritage', size: 'wide',  label: 'Cinematic Heritage',  sub: '1971 Historical Reconstruction', tag: '30s Long Take', color: '#5DCAA5', detail: 'Anchor-and-extend. Zero morphing across 30 unbroken seconds of history.', metric: '30s · 24fps' },
  { id: 'speed',    size: 'sq',    label: 'Lighthouse 99',        sub: 'Luxury e-commerce build', tag: 'Performance', color: '#378ADD', detail: 'Perfect Core Web Vitals. Edge-rendered Next.js storefront.', metric: '99/100' },
  { id: 'voice',    size: 'sq',    label: 'Voice Identity',       sub: 'ElevenLabs brand clone', tag: 'Audio AI', color: '#D85A30', detail: 'Custom AI voice for a Dhaka fintech brand. Used across all ads and IVR.', metric: '11 voices' },
  { id: 'estate',   size: 'tall',  label: 'Pre-Sale Cinema',      sub: 'Bashundhara pre-construction', tag: 'Real Estate', color: '#C9A84C', detail: 'Cinematic walkthrough from architectural renders. 60% sold before build.', metric: '60% sold' },
];

function BentoCard({ item, i }) {
  const [ref, v] = useInView();
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      className={`bc bc--${item.size} ${v ? 'bc--in' : ''}`}
      style={{ transitionDelay: `${i * 0.07}s`, '--c': item.color }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="bc__topline" style={{ background: item.color }} />
      <div className="bc__tag" style={{ color: item.color }}>
        <span className="bc__tag-dot" style={{ background: item.color }} />{item.tag}
      </div>
      <div className="bc__metric" style={{ color: item.color }}>{item.metric}</div>

      <div className={`bc__body ${hov ? 'bc__body--hov' : ''}`}>
        <h3 className="bc__label">{item.label}</h3>
        <p className="bc__sub">{item.sub}</p>
        <p className={`bc__detail ${hov ? 'bc__detail--show' : ''}`}>{item.detail}</p>
      </div>

      {/* Audio wave — voice card */}
      {item.id === 'voice' && (
        <div className="bc__wave">
          {Array.from({ length: 18 }).map((_, k) => (
            <span key={k} className="bc__bar" style={{ animationDelay: `${k * 0.07}s`, background: item.color, height: `${16 + Math.abs(Math.sin(k * 0.9)) * 18}px` }} />
          ))}
        </div>
      )}

      {/* Score arc — speed card */}
      {item.id === 'speed' && (
        <svg className="bc__arc" viewBox="0 0 72 72" width="72" height="72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(55,138,221,0.1)" strokeWidth="5" />
          <circle cx="36" cy="36" r="28" fill="none" stroke={item.color} strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 28 * 0.99} ${2 * Math.PI * 28}`}
            strokeLinecap="round" transform="rotate(-90 36 36)" />
          <text x="36" y="41" textAnchor="middle" fill={item.color} fontSize="13" fontWeight="700" fontFamily="Syne, sans-serif">99</text>
        </svg>
      )}

      <div className="bc__corner" style={{ borderColor: `${item.color}35` }} />
    </div>
  );
}

export default function BentoPortfolio() {
  const [ref, v] = useInView();
  return (
    <section id="bento" className="bento section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Portfolio</div>
          <h2 className="section-title">The Work Speaks.<br /><span style={{ color: 'var(--gold)' }}>The Numbers Confirm.</span></h2>
        </div>
        <div className="bento-grid">
          {ITEMS.map((item, i) => <BentoCard key={item.id} item={item} i={i} />)}
        </div>
      </div>
    </section>
  );
}
