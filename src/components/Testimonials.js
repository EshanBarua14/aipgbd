import { useLang } from '../i18n/LangContext';
export default function Testimonials({ cfg }) {
  const { lang, t } = useLang();
  const testimonials = cfg.testimonials || [];
  if (testimonials.length === 0) return null;
  return (
    <section id="testimonials" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="section-label animate-in"><span className="label-mono">{t('testimonials_label')}</span></div>
        <h2 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '2.5rem' }}>
          {t('testimonials_title')}<br />{t('testimonials_title2')}
        </h2>
        <div className="testi-grid">
          {testimonials.map((te, i) => {
            const quote  = lang === 'bn' && te.quote_bn  ? te.quote_bn  : te.quote;
            const result = lang === 'bn' && te.result_bn ? te.result_bn : te.result;
            return (
              <div key={i} className="card animate-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {Array.from({ length: te.stars || 5 }).map((_, si) => <span key={si} style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★</span>)}
                </div>
                <p style={{ color: 'var(--text-1)', lineHeight: 1.75, fontSize: '0.95rem', flex: 1, fontStyle: 'italic' }}>"{quote}"</p>
                {result && (
                  <div style={{ padding: '0.6rem 0.9rem', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-mid)', borderRadius: 'var(--r-md)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{t('testimonials_result')}</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--cyan)' }}>{result}</div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>
                    {(te.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-0)' }}>{te.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.08em' }}>{te.role}{te.company ? ` · ${te.company}` : ''}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
