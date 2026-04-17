import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
export default function FAQ({ cfg }) {
  const [open, setOpen] = useState(null);
  const { lang, t } = useLang();
  return (
    <section id="faq" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="section-label animate-in"><span className="label-mono">{t('faq_label')}</span></div>
        <h2 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '2.5rem' }}>
          {t('faq_title')}<br />{t('faq_title2')}
        </h2>
        <div style={{ maxWidth: 720 }}>
          {cfg.faqs.map((faq, i) => {
            const q = lang === 'bn' && faq.q_bn ? faq.q_bn : faq.q;
            const a = lang === 'bn' && faq.a_bn ? faq.a_bn : faq.a;
            return (
              <div key={i} className="animate-in" style={{ borderBottom: '1px solid var(--border)', animationDelay: `${i * 0.06}s` }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '1.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--text-0)' }}>{q}</span>
                  <span style={{ color: 'var(--cyan)', fontSize: '1.1rem', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? '400px' : 0, overflow: 'hidden', transition: 'max-height 0.4s var(--ease)' }}>
                  <p style={{ color: 'var(--text-1)', lineHeight: 1.75, paddingBottom: '1.25rem', fontSize: '0.92rem' }}>{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
