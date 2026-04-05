import React from 'react';
import './index.css';

import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import './sections/Hero.css';
import BentoPortfolio from './sections/BentoPortfolio';
import './sections/BentoPortfolio.css';
import TechStack from './sections/TechStack';
import './sections/TechStack.css';
import Services from './sections/Services';
import './sections/Services.css';
import Contact from './sections/Contact';
import './sections/Contact.css';
import FAQ from './sections/FAQ';
import './sections/FAQ.css';
import { Ticker, Process, Niches, Footer } from './sections/Misc';
import { useCursor } from './hooks';

function Capability() {
  return (
    <section id="capability" style={{ background: 'var(--bg-1)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '7rem 0' }}>
      <div className="container">
        <div className="section-label">Our Edge</div>
        <h2 className="section-title" style={{ maxWidth: 580 }}>
          The 30-Second<br />
          <span style={{ color: 'var(--gold)' }}>Long Take.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', marginTop: '4rem' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'var(--bg-2)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 800, color: 'rgba(201,168,76,0.06)', lineHeight: 1 }}>30</span>
            </div>
            <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              <span style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
              Rendering Scene 01
            </div>
            <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', right: '1.2rem' }}>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', marginBottom: '0.6rem', overflow: 'hidden', borderRadius: 1 }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, var(--gold-dim), var(--gold))', animation: 'fill30 3s ease-in-out infinite alternate' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--gold)' }}>0s</span><span>10s</span><span>20s</span><span style={{ color: 'var(--gold)' }}>30s</span>
              </div>
            </div>
          </div>
          <div>
            <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.85, fontWeight: 300, marginBottom: '1rem' }}>
              Every other AI studio cuts every 3 seconds. We generate sustained 30-second cinematic shots using the Anchor-and-Extend method. No glitches, no morphing, no cuts.
            </p>
            {[
              { icon: '✦', title: 'Single image to 30 seconds', desc: 'One hero photograph becomes a fluid, unbroken cinematic sequence at 24fps.' },
              { icon: '◈', title: 'Facial and scene consistency', desc: 'Characters maintain structural integrity across all 30 seconds. No melting faces.' },
              { icon: '♪', title: 'Original scored audio', desc: 'Every video ships with a custom AI-composed brand score via Suno Pro.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: '1rem', marginTop: '1.6rem', paddingTop: '1.6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 36, height: 36, border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--gold)', fontSize: '0.9rem', background: 'rgba(201,168,76,0.05)' }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{f.title}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useCursor();
  return (
    <>
      <div id="cursor" className="cursor" />
      <div id="cursor-ring" className="cursor-ring" />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <BentoPortfolio />
        <Capability />
        <TechStack />
        <Services />
        <Process />
        <Niches />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
