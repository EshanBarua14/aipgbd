import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

function Skeleton() {
  return <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />;
}

function VideoModal({ item, onClose }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
    return url;
  };
  const embedUrl = getEmbedUrl(item.videoUrl);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.2s', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(900px,100%)', background: 'var(--bg-1)', border: '1px solid var(--border-active)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-float)' }}>
        {embedUrl
          ? <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe src={embedUrl} title={item.title} frameBorder="0" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </div>
          : <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-2)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>No video URL — add in Admin → Portfolio</div>
        }
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-0)' }}>{item.title}</div>
            <div style={{ color: 'var(--text-2)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{item.client}{item.category ? ` · ${item.category}` : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '0.4em 1em', color: 'var(--text-1)', fontSize: '0.82rem', flexShrink: 0 }}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ThumbImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {!loaded && !error && <Skeleton />}
      {src && !error && <img src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }} />}
      {(!src || error) && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-2)', fontSize: '2rem', opacity: 0.2 }}>🎬</div>}
    </div>
  );
}

export default function Portfolio({ cfg }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('All');
  const { lang, t } = useLang();

  const works = cfg.portfolio || [];
  const allLabel = t('portfolio_all');
  const categories = [allLabel, ...new Set(works.map(w => w.category).filter(Boolean))];
  const filtered = filter === allLabel ? works : works.filter(w => w.category === filter);
  const getThumbnail = (item) => {
    if (item.thumbnail) return item.thumbnail;
    const yt = item.videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`;
    return null;
  };

  return (
    <section id="portfolio" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="section-label animate-in"><span className="label-mono">{t('portfolio_label')}</span></div>
        <h2 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '0.75rem' }}>{t('portfolio_title')}</h2>
        <p className="animate-in" style={{ color: 'var(--text-1)', maxWidth: 480, marginBottom: works.length === 0 ? '1.5rem' : '2rem', lineHeight: 1.75 }}>{t('portfolio_sub')}</p>

        {works.length === 0 && (
          <div className="animate-in" style={{ border: '1px dashed var(--border-active)', borderRadius: 'var(--r-xl)', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎬</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', color: 'var(--text-0)', marginBottom: '0.5rem' }}>{t('portfolio_empty')}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em' }}>{t('portfolio_hint')}</div>
          </div>
        )}

        {works.length > 0 && categories.length > 2 && (
          <div className="animate-in" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{ padding: '0.3em 0.9em', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${filter === c ? 'var(--cyan-mid)' : 'var(--border)'}`, background: filter === c ? 'var(--cyan-dim)' : 'transparent', color: filter === c ? 'var(--cyan)' : 'var(--text-2)', transition: 'all 0.2s' }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="portfolio-grid">
            {filtered.map((item, i) => {
              const thumb = getThumbnail(item);
              return (
                <div key={i} className="card animate-in" onClick={() => setActive(item)}
                  style={{ cursor: 'pointer', overflow: 'hidden', padding: 0, animationDelay: `${i * 0.07}s` }}>
                  <div style={{ height: 190, position: 'relative', overflow: 'hidden', background: 'var(--bg-2)' }}>
                    <ThumbImage src={thumb} alt={item.title} />
                    <div className="play-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,229,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 30px rgba(0,229,255,0.5)' }}>▶</div>
                    </div>
                    {item.category && <span className="tag tag-cyan" style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', fontSize: '0.56rem' }}>{item.category}</span>}
                  </div>
                  <div style={{ padding: '1.1rem 1.25rem' }}>
                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-0)', marginBottom: '0.25rem' }}>{item.title || 'Untitled'}</div>
                    {item.client && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.client}</div>}
                    {item.desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{item.desc}</div>}
                    {item.slug && (
                      <Link to={`/work/${item.slug}`} onClick={e => e.stopPropagation()}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--purple)', letterSpacing: '0.1em', textDecoration: 'none' }}>
                        {t('portfolio_read')}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {active && <VideoModal item={active} onClose={() => setActive(null)} />}
      <style>{`.card:hover .play-overlay{opacity:1!important} @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>
  );
}
