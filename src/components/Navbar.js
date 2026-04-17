import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { LANGS } from '../i18n/translations';

export default function Navbar({ cfg, theme, toggleTheme, openAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (!isHome) return;
    const sections = ['hero','process','services','portfolio','testimonials','industries','faq','contact'];
    const observers = [];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-60px 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [isHome, location]);

  const links = [
    { key: 'nav_process',    href: '#process',    id: 'process'    },
    { key: 'nav_services',   href: '#services',   id: 'services'   },
    { key: 'nav_work',       href: '#portfolio',  id: 'portfolio'  },
    { key: 'nav_blog',       href: '/blog',       id: 'blog', isRoute: true },
    { key: 'nav_industries', href: '#industries', id: 'industries' },
    { key: 'nav_faq',        href: '#faq',        id: 'faq'        },
    { key: 'nav_contact',    href: '#contact',    id: 'contact'    },
  ];

  const handleLink = (link) => {
    setMobileOpen(false);
    if (link.isRoute) { navigate(link.href); return; }
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(link.href);
        if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
      }, 300);
      return;
    }
    const el = document.querySelector(link.href);
    if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
  };

  const isActive = (link) => {
    if (link.isRoute) return location.pathname.startsWith('/blog');
    return isHome && activeSection === link.id;
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--container-px)',
        background: scrolled ? 'rgba(3,6,15,0.92)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'rgba(0,229,255,0.12)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <button onClick={() => { setMobileOpen(false); if (!isHome) navigate('/'); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'none', border: 'none', flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-2)', boxShadow: '0 0 12px var(--cyan-mid)', overflow: 'hidden', flexShrink: 0 }}>
            {cfg.site.logoUrl
              ? <img src={cfg.site.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={e => e.target.style.display='none'}/>
              : <span style={{ fontSize: '1.2rem' }}>🤖</span>}
          </div>
          <div className="nav-brand">
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-0)', lineHeight: 1 }}>{cfg.site.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.1rem' }}>{cfg.site.tagline}</div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="desktop-nav">
          {links.map(link => {
            const active = isActive(link);
            return (
              <button key={link.key} onClick={() => handleLink(link)}
                style={{
                  background: active ? 'rgba(0,229,255,0.1)' : 'none',
                  border: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: '0.85rem',
                  color: active ? 'var(--cyan)' : 'var(--text-1)',
                  fontWeight: active ? 700 : 500,
                  padding: '0.4rem 0.8rem', borderRadius: '100px',
                  transition: 'all 0.2s', position: 'relative',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color='var(--cyan)'; e.currentTarget.style.background='rgba(0,229,255,0.07)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color='var(--text-1)'; e.currentTarget.style.background='none'; }}}>
                {t(link.key)}
                {active && (
                  <span style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={toggleLang}
            style={{ padding: '0.3em 0.75em', borderRadius: '100px', background: 'rgba(0,229,255,0.08)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--cyan)', fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(0,229,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(0,229,255,0.08)'}>
            {lang === 'en' ? LANGS.bn : LANGS.en}
          </button>

          {/* Theme */}
          <button onClick={toggleTheme} title="Toggle theme"
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.2s', color: 'var(--text-2)' }}>
            {theme === 'dark' ? '☀' : '◑'}
          </button>

          {/* Admin */}
          <button onClick={openAdmin} title="Admin Panel"
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(155,89,255,0.1)', border: '1px solid rgba(155,89,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.2s', color: 'var(--purple)' }}>
            ⚙
          </button>

          <a href={cfg.site.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary nav-cta"
            style={{ padding: '0.5em 1.1em', fontSize: '0.78rem' }}>
            {t('nav_cta')}
          </a>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger"
            style={{ display: 'none', width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: '8px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 16, height: 1.5, background: 'var(--text-1)', display: 'block', transition: 'all 0.2s' }}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} style={{ paddingTop: '80px' }}>
        <button onClick={() => setMobileOpen(false)}
          style={{ position: 'absolute', top: '1.25rem', right: 'var(--container-px)', background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--text-1)' }}>✕</button>
        {links.map(link => (
          <button key={link.key} onClick={() => handleLink(link)}
            style={{ background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,7vw,2.5rem)', fontWeight: 300, color: isActive(link) ? 'var(--cyan)' : 'var(--text-0)', transition: 'color 0.2s' }}>
            {t(link.key)}
          </button>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center' }}>
          <button onClick={toggleLang} style={{ padding: '0.4em 1em', borderRadius: '100px', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-mid)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 700 }}>
            {lang === 'en' ? LANGS.bn : LANGS.en}
          </button>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-2)' }}>
            {theme === 'dark' ? '☀' : '◑'}
          </button>
          <button onClick={() => { setMobileOpen(false); openAdmin(); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(155,89,255,0.1)', border: '1px solid rgba(155,89,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--purple)' }}>
            ⚙
          </button>
        </div>
      </div>
    </>
  );
}
