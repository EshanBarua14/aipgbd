import React from 'react';
import { useInView } from '../hooks';
import { TECH_STACK } from '../data/content';
import './TechStack.css';

const COLORS = ['#C9A84C','#5DCAA5','#378ADD','#D85A30','#9F77DD'];

export default function TechStack() {
  const [ref, inView] = useInView();
  return (
    <section id="specs" className="techstack section-pad">
      <div className="container">
        <div className={`reveal ${inView ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Proprietary Workflow</div>
          <h2 className="section-title">
            The Engine<br />
            <span style={{ color: 'var(--gold)' }}>Under the Hood.</span>
          </h2>
          <p className="techstack__sub">
            Every tool is chosen for one reason: it outperforms everything else at its specific job.
            Together they form a production system no traditional agency can replicate.
          </p>
        </div>

        <div className="techstack__grid">
          {TECH_STACK.map((item, i) => {
            const [r, v] = useInView();
            return (
              <div
                key={item.layer} ref={r}
                className={`techstack__card glass ${v ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s`, '--c': COLORS[i] }}
              >
                <div className="techstack__card-accent" style={{ background: COLORS[i] }} />
                <div className="techstack__layer">{item.layer}</div>
                <div className="techstack__tech" style={{ color: COLORS[i] }}>{item.tech}</div>
                <p className="techstack__why">{item.why}</p>
                <div className="techstack__index">{String(i + 1).padStart(2, '0')}</div>
              </div>
            );
          })}
        </div>

        {/* System status bar */}
        <div className="techstack__status">
          <div className="status__dot" />
          <span className="status__text">AI SYSTEMS: OPERATIONAL</span>
          <span className="status__sep">|</span>
          <span className="status__text">DHAKA HQ: ACTIVE</span>
          <span className="status__sep">|</span>
          <span className="status__text">LATENCY: 14ms</span>
          <span className="status__sep">|</span>
          <span className="status__text" style={{ color: 'var(--gold)' }}>UPTIME: 99.97%</span>
        </div>
      </div>
    </section>
  );
}
