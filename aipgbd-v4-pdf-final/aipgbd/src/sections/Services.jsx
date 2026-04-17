import React, { useState } from 'react';
import { SERVICE_TIERS } from '../data/content';
import { useInView } from '../hooks';
import './Services.css';

const COLORS = { cinematic: '#C9A84C', synthesis: '#5DCAA5', enterprise: '#378ADD' };

function PkgCard({ pkg, index }) {
  const [ref, v] = useInView();
  const [open, setOpen] = useState(false);
  const c = COLORS[pkg.id] || '#C9A84C';
  return (
    <div ref={ref}
      className={`pkg ${pkg.popular ? 'pkg--pop' : ''} ${v ? 'pkg--in' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s`, '--c': c }}>
      <div className="pkg__line" style={{ background: c }} />
      <div className="pkg__phase-tag" style={{ color: c }}>{pkg.tag}</div>
      {pkg.popular && <div className="pkg__badge" style={{ color: c, borderColor: `${c}40` }}>Recommended</div>}
      <div className="pkg__top">
        <div className="pkg__tier" style={{ color: c }}>Tier {pkg.tier}</div>
        <div className="pkg__target">{pkg.target}</div>
      </div>
      <h3 className="pkg__title">{pkg.title}</h3>
      <div className="pkg__sub">{pkg.subtitle}</div>
      <p className="pkg__desc">{pkg.desc}</p>
      <button className="pkg__toggle" style={{ color: c }} onClick={() => setOpen(!open)}>
        {open ? 'Collapse ↑' : "What's included ↓"}
      </button>
      {open && (
        <ul className="pkg__features">
          {pkg.features.map(f => (
            <li key={f} className="pkg__feature">
              <span style={{ color: c }}>✓</span>{f}
            </li>
          ))}
        </ul>
      )}
      <div className="pkg__footer">
        <div>
          <div className="pkg__price" style={{ color: c }}>{pkg.price}</div>
          <div className="pkg__unit">{pkg.unit}</div>
        </div>
        <button className="pkg__cta" style={{ background: c }}
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
          Start Now
        </button>
      </div>
      <div className="pkg__corner" style={{ borderColor: `${c}35` }} />
    </div>
  );
}

export default function Services() {
  const [ref, v] = useInView();
  return (
    <section id="services" className="services section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Service Deployment Tiers</div>
          <h2 className="section-title">Three Tiers.<br /><span style={{ color: 'var(--gold)' }}>One Foundry.</span></h2>
          <p className="services__sub">From a 24-hour cinematic teaser to a full enterprise OMS — each tier is a precision instrument, not a package.</p>
        </div>
        <div className="services__grid">
          {SERVICE_TIERS.map((p, i) => <PkgCard key={p.id} pkg={p} index={i} />)}
        </div>
        <div className="services__roi">
          <div className="roi__dot" />
          <span className="roi__label">Early break revenue</span>
          <span className="roi__calc">
            Phase 1: 5 real estate clients <strong>225K BDT</strong> · Phase 2: 3 fintech clients <strong>$4,500 USD</strong> · Phase 3: <span className="roi__total">Global at 3x rate</span>
          </span>
        </div>
      </div>
    </section>
  );
}
