import React from 'react';
import { REVENUE_PHASES } from '../data/content';
import { useInView } from '../hooks';
import './RevenuePlan.css';

export default function RevenuePlan() {
  const [ref, v] = useInView();
  return (
    <section id="revenue" className="rev section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Early Break Revenue Plan</div>
          <h2 className="section-title">
            The Roadmap<br />
            <span style={{ color: 'var(--gold)' }}>to Global Scale.</span>
          </h2>
          <p className="rev__sub">Three phases. Six months. From Dhaka real estate to Dubai and London at 3x rate.</p>
        </div>

        <div className="rev__grid">
          {REVENUE_PHASES.map((phase, i) => {
            const [r, iv] = useInView();
            return (
              <div key={phase.phase} ref={r}
                className={`rev__card ${iv ? 'rev__card--in' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s`, '--c': phase.color }}>
                <div className="rev__card-line" style={{ background: phase.color }} />
                <div className="rev__phase" style={{ color: phase.color }}>{phase.phase}</div>
                <div className="rev__timeline">{phase.timeline}</div>
                <h3 className="rev__market">{phase.market}</h3>
                <p className="rev__action">{phase.action}</p>
                <div className="rev__metrics">
                  <div className="rev__metric">
                    <div className="rev__metric-label">Target</div>
                    <div className="rev__metric-val">{phase.target}</div>
                  </div>
                  <div className="rev__metric">
                    <div className="rev__metric-label">Revenue</div>
                    <div className="rev__metric-val" style={{ color: phase.color }}>{phase.revenue}</div>
                  </div>
                </div>
                {/* Progress connector */}
                {i < REVENUE_PHASES.length - 1 && (
                  <div className="rev__connector">
                    <div className="rev__connector-line" style={{ background: `linear-gradient(to right, ${phase.color}, ${REVENUE_PHASES[i+1].color})` }} />
                    <div className="rev__connector-arrow" style={{ color: REVENUE_PHASES[i+1].color }}>→</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div className="rev__summary">
          <div className="rev__summary-item">
            <div className="rev__summary-label">Month 1 target</div>
            <div className="rev__summary-val" style={{ color: '#C9A84C' }}>225,000 BDT</div>
          </div>
          <div className="rev__summary-sep" />
          <div className="rev__summary-item">
            <div className="rev__summary-label">Month 3 target</div>
            <div className="rev__summary-val" style={{ color: '#5DCAA5' }}>$4,500 USD</div>
          </div>
          <div className="rev__summary-sep" />
          <div className="rev__summary-item">
            <div className="rev__summary-label">Month 6 target</div>
            <div className="rev__summary-val" style={{ color: '#378ADD' }}>Global scale</div>
          </div>
          <div className="rev__summary-sep" />
          <div className="rev__summary-item">
            <div className="rev__summary-label">Investment</div>
            <div className="rev__summary-val">30,000 BDT</div>
          </div>
        </div>
      </div>
    </section>
  );
}
