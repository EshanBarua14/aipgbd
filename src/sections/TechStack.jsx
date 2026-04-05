import React from 'react';
import { useInView } from '../hooks';
import { TECH_STACK } from '../data/content';
import './TechStack.css';

const ACCENTS = ['#C9A84C','#5DCAA5','#378ADD','#D85A30','#9F77DD'];

export default function TechStack() {
  const [ref, v] = useInView();
  return (
    <section id="specs" className="ts section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Proprietary Workflow</div>
          <h2 className="section-title">The Engine<br /><span style={{ color: 'var(--gold)' }}>Under the Hood.</span></h2>
          <p className="ts__sub">Every tool chosen for one reason: it outperforms everything else at its specific job.</p>
        </div>

        <div className="ts__grid">
          {TECH_STACK.map((item, i) => {
            const [r, iv] = useInView();
            return (
              <div key={item.layer} ref={r}
                className={`ts__card ${iv ? 'ts__card--in' : ''}`}
                style={{ transitionDelay: `${i * 0.09}s`, '--c': ACCENTS[i] }}>
                <div className="ts__accent" style={{ background: ACCENTS[i] }} />
                <div className="ts__layer">{item.layer}</div>
                <div className="ts__tech" style={{ color: ACCENTS[i] }}>{item.tech}</div>
                <p className="ts__why">{item.why}</p>
                <div className="ts__idx">{String(i + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="ts__status">
          <span className="ts__status-dot" />
          <span>AI SYSTEMS: OPERATIONAL</span>
          <span className="ts__sep">|</span>
          <span>DHAKA HQ: ACTIVE</span>
          <span className="ts__sep">|</span>
          <span>LATENCY: 14ms</span>
          <span className="ts__sep">|</span>
          <span style={{ color: 'var(--gold)' }}>UPTIME: 99.97%</span>
        </div>
      </div>
    </section>
  );
}
