import React, { useState } from 'react';
import { PACKAGES } from '../data/content';
import { useInView } from '../hooks';
import './Services.css';

const TIER_COLORS = { flagship: '#C9A84C', subscription: '#5DCAA5', spark: '#378ADD' };

function PackageCard({ pkg, index }) {
  const [ref, inView] = useInView();
  const [expanded, setExpanded] = useState(false);
  const color = TIER_COLORS[pkg.id] || '#C9A84C';

  return (
    <div
      ref={ref}
      className={`pkg-card glass ${pkg.popular ? 'pkg-card--popular' : ''} ${inView ? 'pkg-card--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s`, '--c': color }}
    >
      <div className="pkg-card__top-line" style={{ background: color }} />
      {pkg.popular && (
        <div className="pkg-card__badge" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
          Recommended
        </div>
      )}

      <div className="pkg-card__header">
        <div className="pkg-card__tier" style={{ color }}>Tier {pkg.tier}</div>
        <div className="pkg-card__target">{pkg.target}</div>
      </div>

      <h3 className="pkg-card__title">{pkg.title}</h3>
      <div className="pkg-card__subtitle">{pkg.subtitle}</div>
      <p className="pkg-card__desc">{pkg.desc}</p>

      <button className="pkg-card__toggle" style={{ color }} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse ↑' : 'What\'s included ↓'}
      </button>

      {expanded && (
        <ul className="pkg-card__features">
          {pkg.features.map(f => (
            <li key={f} className="pkg-card__feature">
              <span style={{ color }}>✓</span> {f}
            </li>
          ))}
        </ul>
      )}

      <div className="pkg-card__footer">
        <div>
          <div className="pkg-card__price" style={{ color }}>{pkg.price}</div>
          <div className="pkg-card__unit">{pkg.unit}</div>
        </div>
        <button
          className="pkg-card__cta"
          style={{ background: color }}
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
        >
          Start Now
        </button>
      </div>

      {/* Hover corner */}
      <div className="pkg-card__corner" style={{ borderColor: `${color}40` }} />
    </div>
  );
}

export default function Services() {
  const [ref, inView] = useInView();
  return (
    <section id="packages" className="services section-pad">
      <div className="container">
        <div className={`reveal ${inView ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Growth OS</div>
          <h2 className="section-title">
            We Do Not Sell Sites.<br />
            <span style={{ color: 'var(--gold)' }}>We Sell Operating Systems.</span>
          </h2>
          <p style={{ color: 'var(--text-mid)', fontSize: '1rem', fontWeight: 300, maxWidth: 500, marginTop: '0.8rem' }}>
            Every package is a complete brand infrastructure — not a deliverable, but a machine that runs while you focus on your business.
          </p>
        </div>

        <div className="services__grid">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        <div className="services__roi">
          <div className="roi__label">Revenue model</div>
          <div className="roi__calc">
            1 Flagship client <span>85K</span> + 2 Monthly subscribers <span>70K</span> =
            <strong> 1.55 Lakh BDT</strong> against a 30K BDT investment
          </div>
        </div>
      </div>
    </section>
  );
}
