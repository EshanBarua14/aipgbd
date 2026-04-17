import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'Portal', href: '#portal' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar({ theme, onToggleTheme, db }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const s = db?.site || {};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar__inner">
          <a href="#hero" className="navbar__logo" data-hover>
            <img src={s.logoUrl || '/logo.png'} alt={s.name || 'AIPGBD'} className="navbar__logo-img"
              onError={e => { e.target.style.display = 'none'; }} />
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">{s.name || 'AI Playground BD'}</span>
              <span className="navbar__logo-tag">{s.tagline || 'Cinematic AI Production'}</span>
            </div>
          </a>

          <ul className="navbar__links">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} className="navbar__link" data-hover>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <button className="theme-toggle" onClick={onToggleTheme} data-hover aria-label="Toggle theme">
              {theme === 'dark'
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <a href="#contact" className="btn-primary" data-hover><span>Start a Project</span></a>
            <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} data-hover>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} data-hover>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)} className="mobile-menu__link">{link.label}</a>
            </li>
          ))}
          <li><a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary mobile-menu__cta"><span>Start a Project</span></a></li>
        </ul>
      </div>

      <style>{`
        .navbar{position:fixed;top:0;left:0;right:0;z-index:1000;padding:1.25rem 0;transition:padding 0.4s,background 0.4s,border-color 0.4s;border-bottom:1px solid transparent}
        .navbar.scrolled{padding:0.75rem 0;background:var(--bg-glass);border-bottom-color:var(--border);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
        .navbar__inner{max-width:1240px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem}
        .navbar__logo{display:flex;align-items:center;gap:0.75rem;text-decoration:none;flex-shrink:0}
        .navbar__logo-img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid var(--cyan-border);box-shadow:0 0 12px var(--cyan-dim)}
        .navbar__logo-text{display:flex;flex-direction:column}
        .navbar__logo-name{font-family:'Outfit',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-primary);line-height:1.2}
        .navbar__logo-tag{font-family:'JetBrains Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;color:var(--cyan);text-transform:uppercase}
        .navbar__links{display:flex;align-items:center;gap:1.75rem;list-style:none}
        .navbar__link{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:500;color:var(--text-secondary);transition:color 0.2s;position:relative;white-space:nowrap}
        .navbar__link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--grad-brand);transition:width 0.3s}
        .navbar__link:hover{color:var(--text-primary)}
        .navbar__link:hover::after{width:100%}
        .navbar__actions{display:flex;align-items:center;gap:0.75rem;flex-shrink:0}
        .theme-toggle{width:36px;height:36px;border:1px solid var(--border-strong);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:all 0.2s;background:none}
        .theme-toggle:hover{border-color:var(--cyan);color:var(--cyan);background:var(--cyan-dim)}
        .hamburger{display:none;flex-direction:column;gap:5px;padding:4px;background:none;border:none}
        .hamburger span{display:block;width:22px;height:1.5px;background:var(--text-primary);transition:all 0.3s;border-radius:2px}
        .hamburger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg);background:var(--cyan)}
        .hamburger.open span:nth-child(2){opacity:0}
        .hamburger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);background:var(--cyan)}
        .mobile-menu{position:fixed;inset:0;background:var(--bg);z-index:999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.4s}
        .mobile-menu.open{opacity:1;pointer-events:all}
        .mobile-menu__close{position:absolute;top:1.5rem;right:2rem;color:var(--text-secondary);padding:8px;background:none;border:none}
        .mobile-menu ul{list-style:none;text-align:center;display:flex;flex-direction:column;gap:1.5rem}
        .mobile-menu__link{font-family:'Outfit',sans-serif;font-size:2.2rem;font-weight:700;color:var(--text-primary);transition:color 0.2s}
        .mobile-menu__link:hover{color:var(--cyan)}
        .mobile-menu__cta{font-size:1rem !important;margin-top:1rem;justify-content:center}
        @media(max-width:1050px){.navbar__links{gap:1.25rem}}
        @media(max-width:900px){.navbar__links{display:none}.navbar__actions .btn-primary{display:none}.hamburger{display:flex}}
      `}</style>
    </>
  );
}
