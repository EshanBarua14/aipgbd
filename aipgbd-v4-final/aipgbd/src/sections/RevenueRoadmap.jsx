import { useEffect, useRef, useState } from 'react';

const PHASES = [
  {
    phase: 'Phase 1',
    timeline: 'Month 1',
    status: 'ACTIVE',
    color: '#00E5FF',
    title: 'Real Estate Entry',
    target: '৳2,25,000',
    targetUSD: '~$2,050',
    clients: '5 real estate clients',
    desc: 'Target Dhaka real estate developers. Pre-sale cinematic tours from architectural renders. Each deal at ৳45,000 — one shoot replaces a ৳1,80,000 traditional production.',
    metrics: [
      { label: 'Deals', value: '5' },
      { label: 'Per Deal', value: '৳45K' },
      { label: 'Delivery', value: '48h' },
      { label: 'Margin', value: '~82%' },
    ],
    milestones: [
      'Land 2 Bashundhara/Uttara developers',
      'Build real estate portfolio reel',
      'Establish referral pipeline from first 5',
    ],
  },
  {
    phase: 'Phase 2',
    timeline: 'Month 3',
    status: 'PLANNED',
    color: '#9B59FF',
    title: 'Fintech & Startups',
    target: '$4,500 USD',
    targetBDT: '~৳4,95,000',
    clients: '3 fintech clients',
    desc: 'Pivot to investor-grade brand identity packages for Bangladesh fintech. These clients pay in USD, reference international agencies, and need speed above everything.',
    metrics: [
      { label: 'Deals', value: '3' },
      { label: 'Per Deal', value: '$1.5K' },
      { label: 'Delivery', value: '72h' },
      { label: 'Margin', value: '~79%' },
    ],
    milestones: [
      'Fintech brand reel on portfolio',
      'USD payment infrastructure live',
      'First $1,500 international deal closed',
    ],
  },
  {
    phase: 'Phase 3',
    timeline: 'Month 6',
    status: 'EXPANSION',
    color: '#E040FB',
    title: 'Dubai & London Markets',
    target: '3× rate',
    targetNote: 'International pricing',
    clients: 'Remote international',
    desc: 'With a proven portfolio of 20+ cinematic pieces and active retainer clients, pitch Dubai real estate and London luxury brands at 3× the Bangladesh rate — same production stack.',
    metrics: [
      { label: 'Rate', value: '3×' },
      { label: 'Per Deal', value: '$4.5K' },
      { label: 'Market', value: 'Global' },
      { label: 'Overhead', value: '₹0' },
    ],
    milestones: [
      'Active retainer income covering all costs',
      '20+ portfolio pieces live',
      'First Dubai or London deal closed',
    ],
  },
];

function CountUp({ target, suffix = '', prefix = '', active }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (!num) return;
    const steps = 40;
    const step = num / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, num);
      setVal(Math.floor(cur));
      if (cur >= num) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [active, target]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

export default function RevenueRoadmap() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="roadmap" className="section roadmap" ref={ref}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge"><span className="t-label">Revenue Roadmap</span></div>
          <h2 className="t-heading" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '0.75rem' }}>
            The 6-month plan.<br /><span className="grad-text">Exact numbers.</span>
          </h2>
          <p className="t-body" style={{ maxWidth: '520px', fontSize: '0.9rem' }}>
            Three phases. Specific clients. Real pricing. No fluff — just the path from ৳20,000 seed capital to international rate billing.
          </p>
        </div>

        <div className="roadmap__grid">
          {PHASES.map((phase, i) => (
            <div key={i} className={`roadmap-card glow-card reveal reveal-delay-${i+1}`} style={{ '--phase-color': phase.color }} data-hover>
              <div className="roadmap-card__top">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="t-label" style={{ color: phase.color }}>{phase.phase} · {phase.timeline}</span>
                  <span className={`roadmap-card__status roadmap-status--${phase.status.toLowerCase()}`}>{phase.status}</span>
                </div>
                <h3 className="roadmap-card__title">{phase.title}</h3>
                <p className="roadmap-card__target" style={{ color: phase.color }}>{phase.target}</p>
                {phase.targetUSD && <p className="roadmap-card__sub">{phase.targetUSD}</p>}
                {phase.targetBDT && <p className="roadmap-card__sub">{phase.targetBDT}</p>}
                {phase.targetNote && <p className="roadmap-card__sub">{phase.targetNote}</p>}
              </div>

              <p className="roadmap-card__desc">{phase.desc}</p>

              <div className="roadmap-card__metrics">
                {phase.metrics.map((m, mi) => (
                  <div key={mi} className="roadmap-metric">
                    <div className="roadmap-metric__val" style={{ color: phase.color }}>{m.value}</div>
                    <div className="roadmap-metric__label t-label">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="roadmap-card__divider" style={{ background: phase.color }} />

              <ul className="roadmap-card__milestones">
                {phase.milestones.map((m, mi) => (
                  <li key={mi}>
                    <span style={{ color: phase.color, marginRight: '0.5rem' }}>→</span>
                    {m}
                  </li>
                ))}
              </ul>

              <div className="roadmap-card__glow" style={{ background: `radial-gradient(circle, ${phase.color}12 0%, transparent 70%)` }} />
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="roadmap__summary glow-card reveal">
          <div className="roadmap__summary-item">
            <div className="roadmap__summary-label t-label">Seed Capital</div>
            <div className="roadmap__summary-val" style={{ color: 'var(--cyan)' }}>৳20,000</div>
          </div>
          <div className="roadmap__summary-arrow">→</div>
          <div className="roadmap__summary-item">
            <div className="roadmap__summary-label t-label">Month 1 Target</div>
            <div className="roadmap__summary-val" style={{ color: '#9B59FF' }}>৳2,25,000</div>
          </div>
          <div className="roadmap__summary-arrow">→</div>
          <div className="roadmap__summary-item">
            <div className="roadmap__summary-label t-label">Month 3 Target</div>
            <div className="roadmap__summary-val" style={{ color: '#E040FB' }}>$4,500 USD</div>
          </div>
          <div className="roadmap__summary-arrow">→</div>
          <div className="roadmap__summary-item">
            <div className="roadmap__summary-label t-label">Month 6 Rate</div>
            <div className="roadmap__summary-val" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>3× Global</div>
          </div>
        </div>
      </div>

      <style>{`
        .roadmap__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .roadmap-card { padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; position: relative; overflow: hidden; border-top: 2px solid var(--phase-color); }
        .roadmap-card__top {}
        .roadmap-card__title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.4rem; }
        .roadmap-card__target { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.8rem; line-height: 1.1; }
        .roadmap-card__sub { font-size: 0.78rem; color: var(--text-tertiary); margin-top: 0.2rem; font-family: 'JetBrains Mono', monospace; }
        .roadmap-card__desc { font-size: 0.82rem; line-height: 1.7; color: var(--text-secondary); }
        .roadmap-card__metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
        .roadmap-metric { text-align: center; background: var(--bg-3); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.25rem; }
        .roadmap-metric__val { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1rem; line-height: 1.2; }
        .roadmap-metric__label { font-size: 0.55rem; color: var(--text-tertiary); margin-top: 0.2rem; }
        .roadmap-card__divider { height: 1px; opacity: 0.3; }
        .roadmap-card__milestones { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .roadmap-card__milestones li { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
        .roadmap-card__glow { position: absolute; width: 200px; height: 200px; bottom: -80px; right: -80px; border-radius: 50%; filter: blur(40px); pointer-events: none; }
        .roadmap-card__status { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 100px; }
        .roadmap-status--active { background: rgba(0,229,255,0.15); color: var(--cyan); border: 1px solid var(--cyan-border); }
        .roadmap-status--planned { background: rgba(155,89,255,0.15); color: var(--purple); border: 1px solid var(--purple-border); }
        .roadmap-status--expansion { background: rgba(224,64,251,0.15); color: var(--magenta); border: 1px solid rgba(224,64,251,0.3); }

        .roadmap__summary { display: flex; align-items: center; justify-content: center; gap: 1.5rem; padding: 1.5rem 2.5rem; flex-wrap: wrap; }
        .roadmap__summary-item { text-align: center; }
        .roadmap__summary-label { margin-bottom: 0.35rem; color: var(--text-tertiary); }
        .roadmap__summary-val { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.4rem; line-height: 1; }
        .roadmap__summary-arrow { font-size: 1.2rem; color: var(--border-strong); }

        @media (max-width: 900px) { .roadmap__grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .roadmap__summary { gap: 1rem; padding: 1.25rem; } .roadmap__summary-arrow { display: none; } }
      `}</style>
    </section>
  );
}
