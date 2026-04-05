import { useLang } from '../i18n/LangContext';
export default function Industries({ cfg }) {
  const wa = cfg.site.whatsapp;
  const { lang, t } = useLang();
  return (
    <section id="industries" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 'var(--section-py)' }}>
        <div className="section-label animate-in"><span className="label-mono">{t('industries_label')}</span></div>
        <h2 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '0.75rem' }}>{t('industries_title')}</h2>
        <p className="animate-in" style={{ color: 'var(--text-1)', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.75 }}>{t('industries_sub')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--gap-card)' }}>
          {cfg.niches.map((n, i) => {
            const title = lang === 'bn' && n.title_bn ? n.title_bn : n.title;
            const pain  = lang === 'bn' && n.pain_bn  ? n.pain_bn  : n.pain;
            const roi   = lang === 'bn' && n.roi_bn   ? n.roi_bn   : n.roi;
            return (
              <a key={i} href={`${wa}?text=${encodeURIComponent(`Hi! I'm from the ${n.title} industry and want to learn more about your services.`)}`}
                target="_blank" rel="noreferrer" className="card animate-in"
                style={{ padding: '1.75rem', textDecoration: 'none', display: 'block', animationDelay: `${i * 0.06}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{n.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-0)' }}>{title}</div>
                    <span className={`tag tag-${n.tagColor}`} style={{ marginTop: '0.2rem', fontSize: '0.58rem' }}>{n.tag}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '0.9rem' }}>{pain}</p>
                <div style={{ padding: '0.65rem 0.9rem', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('industries_roi')}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-0)', fontWeight: 500 }}>{roi}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--cyan)', letterSpacing: '0.1em' }}>{t('industries_cta')}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
