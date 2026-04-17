import React, { useState } from 'react';
import { PORTAL_FEATURES } from '../data/content';
import { useInView } from '../hooks';
import './Portal.css';

export default function Portal() {
  const [ref, v] = useInView();
  const [active, setActive] = useState(0);

  return (
    <section id="portal" className="portal section-pad">
      <div className="container">
        <div className={`reveal ${v ? 'visible' : ''}`} ref={ref}>
          <div className="section-label">Portal Ecosystem</div>
          <h2 className="section-title">
            Beyond Deliverables.<br />
            <span style={{ color: 'var(--gold)' }}>A Professional Environment.</span>
          </h2>
          <p className="portal__sub">
            AI prompting hobbyists deliver files over email. We deliver through a dedicated client portal and admin control room that no creative agency in Bangladesh can match.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="portal__tabs">
          {PORTAL_FEATURES.map((f, i) => (
            <button
              key={f.side}
              className={`portal__tab ${active === i ? 'portal__tab--active' : ''}`}
              style={active === i ? { borderColor: f.color, color: f.color } : {}}
              onClick={() => setActive(i)}
            >
              <span>{f.icon}</span> {f.side}
            </button>
          ))}
        </div>

        {PORTAL_FEATURES.map((side, si) => {
          const [r, iv] = useInView();
          return (
            <div key={side.side} ref={r}
              className={`portal__panel ${active === si ? 'portal__panel--active' : ''} ${iv ? 'portal__panel--in' : ''}`}>
              <div className="portal__panel-head" style={{ borderColor: `${side.color}30` }}>
                <div className="portal__panel-icon" style={{ color: side.color }}>{side.icon}</div>
                <div>
                  <div className="portal__panel-side" style={{ color: side.color }}>{side.side}</div>
                  <div className="portal__panel-title">{side.title}</div>
                </div>
                {/* Live indicator */}
                <div className="portal__live">
                  <span className="portal__live-dot" style={{ background: side.color, boxShadow: `0 0 6px ${side.color}60` }} />
                  <span style={{ color: side.color }}>Live System</span>
                </div>
              </div>

              <div className="portal__items">
                {side.items.map((item, ii) => {
                  return (
                    <div key={item.label} className="portal__item"
                      style={{ transitionDelay: `${ii * 0.08}s`, '--c': side.color }}>
                      <div className="portal__item-num" style={{ color: side.color }}>
                        {String(ii + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="portal__item-label" style={{ color: side.color }}>{item.label}</div>
                        <p className="portal__item-desc">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal mockup */}
              <div className="portal__terminal">
                <div className="portal__terminal-bar">
                  <span className="portal__t-dot" style={{ background: '#FF5F57' }} />
                  <span className="portal__t-dot" style={{ background: '#FEBC2E' }} />
                  <span className="portal__t-dot" style={{ background: '#28C840' }} />
                  <span className="portal__t-title">{side.side.toLowerCase().replace(' ', '-')}.aipgbd.com</span>
                </div>
                <div className="portal__terminal-body">
                  {si === 0 ? (
                    <>
                      <div className="portal__t-line"><span style={{ color: '#5DCAA5' }}>STATUS</span> <span style={{ color: 'var(--text-muted)' }}>→</span> Asset Rendering... <span className="portal__t-blink">▊</span></div>
                      <div className="portal__t-line"><span style={{ color: '#5DCAA5' }}>PROGRESS</span> <span style={{ color: 'var(--text-muted)' }}>→</span> Scene 02 / 03 · 67%</div>
                      <div className="portal__t-line"><span style={{ color: '#5DCAA5' }}>AUDIO</span> <span style={{ color: 'var(--text-muted)' }}>→</span> Suno v4 Syncing...</div>
                      <div className="portal__t-line"><span style={{ color: '#5DCAA5' }}>VAULT</span> <span style={{ color: 'var(--text-muted)' }}>→</span> 3 assets ready · AES-256</div>
                    </>
                  ) : (
                    <>
                      <div className="portal__t-line"><span style={{ color: '#C9A84C' }}>PIPELINE</span> <span style={{ color: 'var(--text-muted)' }}>→</span> 4 active deployments</div>
                      <div className="portal__t-line"><span style={{ color: '#C9A84C' }}>LEAD</span> <span style={{ color: 'var(--text-muted)' }}>→</span> New intake · Score: 94/100</div>
                      <div className="portal__t-line"><span style={{ color: '#C9A84C' }}>PROMPTS</span> <span style={{ color: 'var(--text-muted)' }}>→</span> 47 sequences stored</div>
                      <div className="portal__t-line"><span style={{ color: '#C9A84C' }}>LATENCY</span> <span style={{ color: 'var(--text-muted)' }}>→</span> 14ms · <span style={{ color: '#4CAF50' }}>NOMINAL</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
