import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
export default function Process({ cfg }) {
  const [active, setActive] = useState(0);
  const { lang, t } = useLang();
  const step = cfg.process[active];
  return (
    <section id="process" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="section-label animate-in"><span className="label-mono">{t('process_label')}</span></div>
        <h2 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '0.75rem' }}>
          {t('process_title')}<br />{t('process_title2')}
        </h2>
        <p className="animate-in" style={{ color: 'var(--text-1)', maxWidth: 500, marginBottom: '3rem', lineHeight: 1.75 }}>{t('process_sub')}</p>
        <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cfg.process.map((p, i) => {
              const title = lang === 'bn' && p.title_bn ? p.title_bn : p.title;
              return (
                <button key={i} onClick={() => setActive(i)} style={{ background: active === i ? 'var(--surface)' : 'transparent', border: `1px solid ${active === i ? 'var(--border-active)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', transition: 'all 0.3s', boxShadow: active === i ? 'var(--glow-cyan)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: p.color, minWidth: '1.8rem', textAlign: 'center' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Step {p.step} · {p.tool}</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-0)' }}>{title}</div>
                  </div>
                  {active === i && <span style={{ color: 'var(--cyan)', fontSize: '0.85rem', flexShrink: 0 }}>→</span>}
                </button>
              );
            })}
          </div>
          <div key={active} style={{ background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--r-xl)', padding: '2rem', position: 'sticky', top: '88px', animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', flexShrink: 0, background: 'rgba(0,0,0,0.15)', border: `1px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: step.color, boxShadow: `0 0 20px ${step.color}22` }}>{step.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Step {step.step}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-0)' }}>{lang === 'bn' && step.title_bn ? step.title_bn : step.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: step.color, letterSpacing: '0.1em' }}>{step.tool}</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-1)', lineHeight: 1.75, fontSize: '0.95rem' }}>{lang === 'bn' && step.desc_bn ? step.desc_bn : step.desc}</p>
            <div style={{ marginTop: '1.5rem', height: 1, background: `linear-gradient(90deg,${step.color}55,transparent)` }} />
            <div style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.1em' }}>{active + 1} / {cfg.process.length} · {t('process_hint')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
