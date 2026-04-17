import { useLang } from '../i18n/LangContext';
export default function Services({ cfg }) {
  const wa = cfg.site.whatsapp;
  const { lang, t } = useLang();
  return (
    <section id="services" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 'var(--section-py)' }}>
        <div className="section-label animate-in"><span className="label-mono">{t('services_label')}</span></div>
        <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, margin: 0 }}>{t('services_title')}</h2>
          <div style={{ padding: '0.65rem 1.1rem', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-mid)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', gap: '0.15rem', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('services_trad')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-2)', textDecoration: 'line-through' }}>৳1,50,000+</span>
              <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>→</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--cyan)' }}>৳8,000 {lang === 'bn' ? 'AIPGBD-তে' : 'with AIPGBD'}</span>
            </div>
          </div>
        </div>
        <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap-card)' }}>
          {cfg.packages.map((pkg, i) => {
            const title = lang === 'bn' && pkg.title_bn ? pkg.title_bn : pkg.title;
            const desc  = lang === 'bn' && pkg.desc_bn  ? pkg.desc_bn  : pkg.desc;
            const features = lang === 'bn' && pkg.features_bn?.length ? pkg.features_bn : pkg.features;
            return (
              <div key={pkg.id} className="card animate-in" style={{ padding: '1.75rem', position: 'relative', animationDelay: `${i * 0.08}s`, borderColor: pkg.popular ? 'rgba(155,89,255,0.35)' : 'var(--border)', boxShadow: pkg.popular ? '0 0 40px rgba(155,89,255,0.1)' : 'none', display: 'flex', flexDirection: 'column' }}>
                {pkg.popular && <div className="badge-popular">{lang === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}</div>}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Package {pkg.num}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 300, color: `var(${pkg.accentVar})`, marginBottom: '0.75rem', lineHeight: 1.1 }}>{title}</h3>
                <p style={{ color: 'var(--text-1)', lineHeight: 1.65, fontSize: '0.85rem', marginBottom: '1.25rem' }}>{desc}</p>
                <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                  {features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: `var(${pkg.accentVar})`, fontSize: '0.65rem', marginTop: '0.2rem', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-1)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 300, color: 'var(--text-0)', lineHeight: 1 }}>৳{pkg.price}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-2)', letterSpacing: '0.1em', marginTop: '0.2rem' }}>{pkg.unit}</div>
                </div>
                <a href={`${wa}?text=${encodeURIComponent(`Hi! I'm interested in the ${pkg.title} package (${pkg.price} BDT). Let's talk.`)}`}
                  target="_blank" rel="noreferrer"
                  className={`btn ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                  {t('services_cta')} {title} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
