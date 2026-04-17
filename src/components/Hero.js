import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext';

function getYTId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return m ? m[1] : null;
}

export default function Hero({ cfg }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const { lang, t } = useLang();

  // Pick language-aware content from config, fall back to EN
  const heroTitle1   = (lang === 'bn' && cfg.site.heroTitle1_bn)  ? cfg.site.heroTitle1_bn  : (cfg.site.heroTitle1  || 'We Make');
  const heroSub      = (lang === 'bn' && cfg.site.heroSub_bn)     ? cfg.site.heroSub_bn     : (cfg.site.heroSub     || '');
  const heroWords    = (lang === 'bn' && cfg.site.heroWords_bn?.length) ? cfg.site.heroWords_bn : (cfg.site.heroWords || ['Cinema','Brands','Stories']);
  const heroVideoUrl = cfg.site.heroVideoUrl || 'https://www.youtube.com/watch?v=y5N8uoFZLd0';
  const ytId = getYTId(heroVideoUrl);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setWordIdx(i => (i + 1) % heroWords.length); setFading(false); }, 380);
    }, 2200);
    return () => clearInterval(id);
  }, [heroWords.length]);

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '72px' }}>
      {ytId && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="hero-video-wrap">
            <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`}
              title="Hero background" frameBorder="0" allow="autoplay"
              style={{ position: 'absolute', top: '50%', left: '50%', width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,var(--hero-ot) 0%,var(--hero-om) 50%,var(--hero-ob) 100%)' }} />
        </div>
      )}

      <div style={{ position: 'absolute', top: '8%', left: '58%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(155,89,255,0.08) 0%,transparent 70%)', filter: 'blur(40px)', animation: 'float-orb 8s ease-in-out infinite', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '8%', left: '28%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,0.06) 0%,transparent 70%)', filter: 'blur(30px)', animation: 'float-orb 11s ease-in-out infinite reverse', zIndex: 1 }} />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 820 }}>
          <div className="animate-in" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.28em 0.75em', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(0,229,255,0.5)', background: 'rgba(0,229,255,0.12)', color: '#00e5ff', fontWeight: 600 }}>{t('hero_tag')}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>{t('hero_location')}</span>
          </div>

          <h1 className="display-xl animate-in" style={{ animationDelay: '0.1s', marginBottom: '0.3rem', textShadow: '0 2px 20px rgba(0,0,0,0.8)', color: '#fff' }}>{heroTitle1}</h1>

          <h1 className="display-xl animate-in" style={{
            animationDelay: '0.15s',
            background: 'linear-gradient(135deg,#00e5ff 0%,#9b59ff 50%,#e040fb 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            backgroundSize: '200%', animation: 'gradient-shift 4s ease infinite',
            minHeight: '1.1em', display: 'block',
            transition: 'opacity 0.38s', opacity: fading ? 0 : 1,
            filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.6))',
          }}>{heroWords[wordIdx]}</h1>

          <h1 className="display-xl animate-in" style={{ animationDelay: '0.2s', textShadow: '0 2px 20px rgba(0,0,0,0.8)', color: '#fff' }}>{t('hero_line3')}</h1>

          <p className="animate-in" style={{ animationDelay: '0.3s', marginTop: '1.75rem', fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.88)', maxWidth: 560, lineHeight: 1.75, textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}>
            {heroSub}
          </p>

          <div className="animate-in" style={{ animationDelay: '0.4s', display: 'flex', gap: '1rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
            <a href={cfg.site.whatsapp} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em', padding: '0.85em 2em', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.03em', textDecoration: 'none', background: 'linear-gradient(135deg,#00e5ff 0%,#9b59ff 100%)', color: '#fff', border: 'none', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,229,255,0.35)' }}>
              {t('hero_cta1')}
            </a>
            <button onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em', padding: '0.85em 2em', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.03em', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', transition: 'all 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}>
              {t('hero_cta2')}
            </button>
          </div>

          <div className="animate-in" style={{ animationDelay: '0.5s', display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {cfg.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 300, lineHeight: 1, background: 'linear-gradient(135deg,#00e5ff,#9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                  {s.num}<span style={{ fontSize: '0.5em' }}>{s.unit}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                  {lang === 'bn' && s.label_bn ? s.label_bn : s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 2 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{t('hero_scroll')}</span>
        <div style={{ width: 1, height: 38, background: 'linear-gradient(to bottom,rgba(0,229,255,0.8),transparent)' }} />
      </div>

      <style>{`.hero-video-wrap{position:absolute;inset:0;opacity:0.55}[data-theme="light"] .hero-video-wrap{opacity:0.82}`}</style>
    </section>
  );
}
