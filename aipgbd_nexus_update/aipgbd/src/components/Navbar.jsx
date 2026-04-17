import React, { useState } from 'react';
import { useScrolled } from '../hooks';
import { SITE } from '../data/content';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Capability', href: '#capability' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Sectors', href: '#niches' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="/" className="nav__logo">
        AI<span>PG</span>BD
      </a>

      <ul className="nav__links">
        {NAV_LINKS.map(l => (
          <li key={l.label}>
            <button onClick={() => scrollTo(l.href)} className="nav__link">
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="nav__cta"
        onClick={() => scrollTo('#contact')}
      >
        Start a Project
      </button>

      <button
        className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>

      {open && (
        <div className="nav__mobile">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} className="nav__mobile-link">
              {l.label}
            </button>
          ))}
          <button className="nav__mobile-cta" onClick={() => scrollTo('#contact')}>
            Start a Project
          </button>
        </div>
      )}
    </nav>
  );
}
