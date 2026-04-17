import React, { useState } from 'react';
import { useInView } from '../hooks';
import './BentoPortfolio.css';

const ITEMS = [
  {
    id: 'trading',
    size: 'large',
    label: 'Enterprise Dashboard',
    sublabel: 'React + ASP.NET Core 9.0',
    tag: 'Trading Terminal',
    color: '#C9A84C',
    detail: 'Banking-level SQL integration. Real-time order management system built for Dhaka stock market brokers.',
    metric: '99ms response',
  },
  {
    id: 'heritage',
    size: 'wide',
    label: 'Cinematic Heritage',
    sublabel: '1971 Historical Reconstruction',
    tag: '30s Long Take',
    color: '#5DCAA5',
    detail: 'Anchor-and-extend method applied to historical recreation. Zero morphing across 30 unbroken seconds.',
    metric: '30s · 24fps',
  },
  {
    id: 'speed',
    size: 'square',
    label: 'Lighthouse 99',
    sublabel: 'Luxury e-commerce',
    tag: 'Performance',
    color: '#378ADD',
    detail: 'Zero-latency storefront with perfect Core Web Vitals. Built in Next.js with edge rendering.',
    metric: '99/100',
  },
  {
    id: 'voice',
    size: 'square',
    label: 'Voice Identity',
    sublabel: 'ElevenLabs brand clone',
    tag: 'Audio',
    color: '#D85A30',
    detail: 'Custom AI voice clone for a Dhaka fintech brand. Used across all video ads and IVR.',
    metric: '11 voices',
  },
  {
    id: 'realestate',
    size: 'tall',
    label: 'Pre-Sale Cinema',
    sublabel: 'Sold 60% pre-construction',
    tag: 'Real Estate',
    color: '#C9A84C',
    detail: 'Cinematic walkthrough of an apartment that did not exist yet — generated from architectural renders.',
    metric: '60% sold',
  },
];

function BentoCard({ item, index }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`bento-card bento-card--${item.size} ${inView ? 'bento-card--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s`, '--accent': item.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background shimmer */}
      <div className="bento-card__bg" style={{ background: `radial-gradient(ellipse 80% 80% at 20% 20%, ${item.color}10 0%, transparent 70%)` }} />

      {/* Tag */}
      <div className="bento-card__tag" style={{ color: item.color, borderColor: `${item.color}30` }}>
        {item.tag}
      </div>

      {/* Metric badge */}
      <div className="bento-card__metric" style={{ color: item.color }}>
        {item.metric}
      </div>

      {/* Content */}
      <div className={`bento-card__content ${hovered ? 'bento-card__content--hovered' : ''}`}>
        <h3 className="bento-card__label">{item.label}</h3>
        <p className="bento-card__sublabel">{item.sublabel}</p>
        <p className={`bento-card__detail ${hovered ? 'bento-card__detail--visible' : ''}`}>
          {item.detail}
        </p>
      </div>

      {/* Corner accent */}
      <div className="bento-card__corner" style={{ borderColor: `${item.color}40` }} />

      {/* Hover line */}
      <div className="bento-card__line" style={{ background: item.color }} />

      {/* Audio wave for voice card */}
      {item.id === 'voice' && (
        <div className="bento-card__wave">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                animationDelay: `${i * 0.08}s`,
                height: `${20 + Math.sin(i * 0.8) * 15}px`,
                background: item.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Speed score for performance card */}
      {item.id === 'speed' && (
        <div className="bento-card__score">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(55,138,221,0.1)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="32" fill="none"
              stroke={item.color} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 32 * 0.99} ${2 * Math.PI * 32}`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="45" textAnchor="middle" fill={item.color} fontSize="16" fontWeight="700" fontFamily="Syne">99</text>
          </svg>
        </div>
      )}
    </div>
  );
}

export default function BentoPortfolio() {
  const [ref, inView] = useInView();
  return (
    <section id="bento" className="bento section-pad">
      <div className="container">
        <div className={`reveal ${inView ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Portfolio</div>
          <h2 className="section-title">
            The Work Speaks.<br />
            <span style={{ color: 'var(--gold)' }}>The Numbers Confirm.</span>
          </h2>
        </div>
        <div className="bento-grid">
          {ITEMS.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
