import React from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import './sections/Hero.css';
import BentoPortfolio from './sections/BentoPortfolio';
import './sections/BentoPortfolio.css';
import Portal from './sections/Portal';
import './sections/Portal.css';
import TechStack from './sections/TechStack';
import './sections/TechStack.css';
import Services from './sections/Services';
import './sections/Services.css';
import RevenuePlan from './sections/RevenuePlan';
import './sections/RevenuePlan.css';
import Contact from './sections/Contact';
import './sections/Contact.css';
import FAQ from './sections/FAQ';
import './sections/FAQ.css';
import { Ticker, Process, Niches, Footer } from './sections/Misc';
import { useCursor } from './hooks';

function Capability() {
  return (
    <section id="capability" style={{ background:'var(--bg-1)', borderTop:'1px solid var(--border-dim)', padding:'7rem 0' }}>
      <div className="container">
        <div className="section-label">Our Edge</div>
        <h2 className="section-title" style={{ maxWidth:560 }}>The 30-Second<br /><span style={{ color:'var(--gold)' }}>Long Take.</span></h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', marginTop:'4rem' }}>
          <div style={{ border:'1px solid var(--border-dim)', background:'var(--bg)', position:'relative', overflow:'hidden', aspectRatio:'19/6' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 55%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'6rem', fontWeight:800, color:'rgba(201,168,76,0.055)', lineHeight:1 }}>30</span>
            </div>
            <div style={{ position:'absolute', top:'1rem', left:'1rem', display:'flex', alignItems:'center', gap:'0.45rem', fontFamily:'var(--font-mono)', fontSize:'0.56rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)' }}>
              <span style={{ width:5, height:5, background:'var(--gold)', borderRadius:'50%', animation:'pulse 1.5s ease-in-out infinite' }} />Rendering Scene 01 · Grok Veo
            </div>
            <div style={{ position:'absolute', bottom:'1rem', left:'1rem', right:'1rem' }}>
              <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:'0.5rem', overflow:'hidden' }}>
                <div style={{ height:'100%', background:'linear-gradient(to right, var(--gold-dim), var(--gold))', animation:'fill30 3s ease-in-out infinite alternate' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:'0.55rem', color:'var(--text-muted)' }}>
                <span style={{ color:'var(--gold)' }}>0s</span><span>10s</span><span>20s</span><span style={{ color:'var(--gold)' }}>30s</span>
              </div>
            </div>
          </div>
          <div>
            <p style={{ color:'var(--text-mid)', fontSize:'1.02rem', lineHeight:1.88, fontWeight:300, marginBottom:'1rem' }}>
              Every other AI studio cuts every 3 seconds. We generate sustained 30-second cinematic shots using the Anchor-and-Extend method with Grok Veo and Flux.1 Pro. No glitches, no morphing, no cuts.
            </p>
            {[
              { icon:'✦', title:'Single image to 30 seconds', desc:'One Flux.1 keyframe becomes a fluid, unbroken Grok Veo cinematic sequence at 24fps.' },
              { icon:'◈', title:'Temporal consistency', desc:'Characters maintain structural integrity across all 30 seconds. The most stable engine in South Asia.' },
              { icon:'♪', title:'Suno v4 original score', desc:'Every video ships with a custom Suno v4 brand score — copyright-free, sync-licensed to your brand.' },
            ].map(f => (
              <div key={f.title} style={{ display:'flex', gap:'1rem', marginTop:'1.6rem', paddingTop:'1.6rem', borderTop:'1px solid var(--border-dim)' }}>
                <div style={{ width:34, height:34, border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--gold)', fontSize:'0.85rem' }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'0.92rem', fontWeight:600, marginBottom:'0.22rem' }}>{f.title}</div>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-mid)', lineHeight:1.78 }}>{f.desc}</p>
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
        <Portal />
        <Process />
        <RevenuePlan />
        <Niches />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
