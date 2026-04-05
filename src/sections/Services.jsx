import React, { useState } from 'react';
import { PACKAGES } from '../data/content';
import { useInView } from '../hooks';
import './Services.css';

const COLORS = { flagship: '#C9A84C', subscription: '#5DCAA5', spark: '#378ADD' };

function PkgCard({ pkg, index }) {
  const [ref, v] = useInView();
  const [open, setOpen] = useState(false);
  const c = COLORS[pkg.id] || '#C9A84C';
  return (
    <div ref={ref}
      className={`pkg ${pkg.popular ? 'pkg--pop' : ''} ${v ? 'pkg--in' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s`, '--c': c }}>
      <div className="pkg__line" style={{ background: c }} />
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
    <section id="packages" className="services section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Growth OS</div>
          <h2 className="section-title">We Sell<br /><span style={{ color: 'var(--gold)' }}>Operating Systems.</span></h2>
          <p className="services__sub">Not deliverables. A machine that runs while you focus on your business.</p>
        </div>
        <div className="services__grid">
          {PACKAGES.map((p, i) => <PkgCard key={p.id} pkg={p} index={i} />)}
        </div>
        <div className="services__roi">
          <div className="roi__dot" />
          <span className="roi__label">Revenue model</span>
          <span className="roi__calc">
            1 Flagship <strong>85K</strong> + 2 Monthly <strong>70K</strong> =
            <span className="roi__total"> 1.55 Lakh BDT</span> against a 30K investment
          </span>
        </div>
      </div>
    </section>
  );
}
