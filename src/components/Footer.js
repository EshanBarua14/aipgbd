import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
export default function Footer({ cfg }) {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const navLinks = [
    { key: 'nav_process', href: '#process' }, { key: 'nav_services', href: '#services' },
    { key: 'nav_work', href: '#portfolio' }, { key: 'nav_blog', href: '/blog', isRoute: true },
    { key: 'nav_faq', href: '#faq' }, { key: 'nav_contact', href: '#contact' },
  ];
  const socialLinks = [
    { label: 'WhatsApp', href: cfg.site.whatsapp },
    { label: 'Email',    href: `mailto:${cfg.site.email}` },
    { label: 'YouTube',  href: cfg.site.youtube },
    { label: 'Facebook', href: cfg.site.facebook },
  ];
  const handleNav = (link) => {
    if (link.isRoute) { navigate(link.href); return; }
    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'clamp(1.5rem,4vw,3rem)', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', background: 'var(--bg-2)', overflow: 'hidden', flexShrink: 0 }}>
                {cfg.site.logoUrl ? <img src={cfg.site.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span>🤖</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, color: 'var(--text-0)', fontSize: '1rem' }}>{cfg.site.name}</div>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 280 }}>
              {lang === 'bn' && cfg.site.tagline_bn ? cfg.site.tagline_bn : cfg.site.tagline}
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.9rem' }}>{t('footer_nav')}</div>
            {navLinks.map(l => (
              <button key={l.key} onClick={() => handleNav(l)}
                style={{ display: 'block', background: 'none', border: 'none', color: 'var(--text-1)', fontSize: '0.85rem', marginBottom: '0.55rem', padding: 0, textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-1)'}>
                {t(l.key)}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.9rem' }}>{t('footer_connect')}</div>
            {socialLinks.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ display: 'block', color: 'var(--text-1)', fontSize: '0.85rem', marginBottom: '0.55rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-1)'}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.1em' }}>© {year} {cfg.site.name}. Dhaka, Bangladesh.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.1em' }}>{t('footer_powered')}</span>
        </div>
      </div>
    </footer>
  );
}
