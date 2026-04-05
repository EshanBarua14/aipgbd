import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { LANGS } from '../i18n/translations';

export default function Navbar({ cfg, theme, toggleTheme, openAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { key: 'nav_process',    href: '#process'    },
    { key: 'nav_services',   href: '#services'   },
    { key: 'nav_work',       href: '#portfolio'  },
    { key: 'nav_blog',       href: '/blog', isRoute: true },
    { key: 'nav_industries', href: '#industries' },
    { key: 'nav_faq',        href: '#faq'        },
    { key: 'nav_contact',    href: '#contact'    },
  ];

  const handleLink = (link) => {
    setMobileOpen(false);
    if (link.isRoute) { navigate(link.href); return; }
    if (!isHome) { navigate('/'); setTimeout(() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }), 300); return; }
    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const iconBtn = (onClick, title, children, hoverColor = 'var(--cyan)') => (
    <button onClick={onClick} title={title} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', transition: 'all 0.2s', color: 'var(--text-2)', flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
      {children}
    </button>
  );

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--container-px)',
        background: scrolled ? 'var(--surface)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
      }}>
        {/* Logo */}
        <button onClick={() => { setMobileOpen(false); if (!isHome) navigate('/'); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'none', border: 'none', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-2)', boxShadow: '0 0 10px var(--cyan-mid)', overflow: 'hidden', flexShrink: 0 }}>
            {cfg.site.logoUrl ? <img src={cfg.site.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span style={{ fontSize: '1.1rem' }}>🤖</span>}
          </div>
          <div className="nav-brand">
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-0)', lineHeight: 1 }}>{cfg.site.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'var(--text-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.1rem' }}>{cfg.site.tagline}</div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {links.map(l => (
            <button key={l.key} onClick={() => handleLink(l)}
              style={{ background: 'none', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-1)', fontWeight: 500, padding: '0.4rem 0.7rem', borderRadius: '100px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--cyan)'; e.currentTarget.style.background = 'var(--cyan-dim)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'transparent'; }}>
              {t(l.key)}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Language toggle */}
          <button onClick={toggleLang}
            style={{ padding: '0.3em 0.75em', borderRadius: '100px', background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--cyan)', fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'var(--cyan-dim)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
            {lang === 'en' ? LANGS.bn : LANGS.en}
          </button>
          {iconBtn(toggleTheme, 'Toggle theme', theme === 'dark' ? '☀' : '◑')}
          {iconBtn(openAdmin, 'Admin Panel', '⚙', 'var(--purple)')}
          <a href={cfg.site.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary nav-cta"
            style={{ padding: '0.5em 1.1em', fontSize: '0.78rem' }}>
            {t('nav_cta')}
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger"
            style={{ display: 'none', width: 36, height: 36, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 15, height: 1.5, background: 'var(--text-1)', display: 'block' }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <button onClick={() => setMobileOpen(false)}
          style={{ position: 'absolute', top: '1.25rem', right: 'var(--container-px)', background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--text-1)' }}>✕</button>
        {links.map(l => (
          <button key={l.key} onClick={() => handleLink(l)}
            style={{ background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,7vw,2.5rem)', fontWeight: 300, color: 'var(--text-0)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-0)'}>
            {t(l.key)}
          </button>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center' }}>
          <button onClick={toggleLang} style={{ padding: '0.4em 1em', borderRadius: '100px', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-mid)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 700 }}>
            {lang === 'en' ? LANGS.bn : LANGS.en}
          </button>
          {iconBtn(toggleTheme, 'Theme', theme === 'dark' ? '☀' : '◑')}
          {iconBtn(() => { setMobileOpen(false); openAdmin(); }, 'Admin', '⚙', 'var(--purple)')}
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){.desktop-nav{display:none!important}}
        @media(max-width:1024px){.hamburger{display:flex!important}}
        @media(max-width:640px){.nav-brand{display:none}}
        @media(max-width:480px){.nav-cta{display:none!important}}
      `}</style>
    </>
  );
}
