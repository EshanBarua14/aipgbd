import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetCase, isSupabaseReady } from '../hooks/supabase';

function getYTId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

const SAMPLE_CASES = {
  'real-estate-reveal': {
    slug: 'real-estate-reveal', title: 'Real Estate Reveal',
    client: 'Bashundhara Homes', category: 'Real Estate',
    cover_url: '', video_url: '',
    challenge: 'Bashundhara needed to sell pre-launch apartments in a new development before construction was complete. Traditional shoots were impossible — nothing existed yet. Their previous agency quoted 1,50,000 BDT for CGI renders and a video shoot.',
    solution: 'We used architectural renders provided by their architect as the visual foundation. Gemini generated hyper-realistic 8K base images from the renders. Grok animated them into a 30-second cinematic walkthrough. Suno composed an original ambient score. ElevenLabs delivered a professional Bangla + English voiceover narrating the key selling points.',
    results: 'The video was delivered in 68 hours at a cost of 25,000 BDT — 83% less than the agency quote. Pre-sale inquiries doubled in the first week of the campaign.',
    metrics: [
      { label: 'Cost Saving', value: '83%', color: 'var(--cyan)' },
      { label: 'Delivery Time', value: '68h', color: 'var(--purple)' },
      { label: 'Inquiry Increase', value: '2×', color: 'var(--green)' },
      { label: 'vs Agency Cost', value: '৳25K', color: 'var(--magenta)' },
    ],
    gallery: [], published: true,
    created_at: new Date().toISOString(),
  },
};

export default function CaseStudyPage({ cfg }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      let data = null;
      if (isSupabaseReady) {
        data = await dbGetCase(slug);
      } else {
        data = SAMPLE_CASES[slug] || null;
      }
      if (!data) { navigate('/'); return; }
      setItem(data);
      setLoading(false);
      document.title = `${data.title} Case Study — ${cfg?.site?.name || 'AIPGBD'}`;
    };
    load();
  }, [slug, navigate, cfg]);

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-3)' }}>Loading…</div>
    </div>
  );

  const ytId = getYTId(item.video_url);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(3rem,8vw,6rem) 0 0', background: `linear-gradient(to bottom,var(--bg-1),var(--bg-0))` }}>
        <div className="container">
          <Link to="/#portfolio" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
            {t('case_back')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {item.category && <span className="tag tag-cyan" style={{ fontSize: '0.6rem' }}>{item.category}</span>}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>{item.client}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--text-0)', lineHeight: 1.05, marginBottom: '3rem', maxWidth: 800 }}>
            {item.title}
          </h1>
        </div>
      </div>

      {/* Cover / Video */}
      {ytId && (
        <div className="container" style={{ paddingBottom: '2rem' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border-active)' }}>
            <iframe src={`https://www.youtube.com/embed/${ytId}`} title={item.title} frameBorder="0" allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
        </div>
      )}
      {!ytId && item.cover_url && (
        <div className="container" style={{ paddingBottom: '2rem' }}>
          <img src={item.cover_url} alt={item.title} style={{ width: '100%', borderRadius: 'var(--r-xl)', maxHeight: 480, objectFit: 'cover' }} />
        </div>
      )}

      {/* Metrics */}
      {item.metrics?.length > 0 && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 'var(--gap-card)' }}>
            {item.metrics.map((m, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: m.color || 'var(--cyan)', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      <div className="container" style={{ paddingBottom: 'var(--section-py)', maxWidth: 860 }}>
        <div className="case-grid">
          {item.challenge && (
            <section>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', marginBottom: '1rem' }}>{t('case_challenge')}</h2>
              <p style={{ color: 'var(--text-1)', lineHeight: 1.8, fontSize: '1rem' }}>{item.challenge}</p>
            </section>
          )}
          {item.solution && (
            <section>
              <h2 style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', color: 'var(--purple)', marginBottom: '1rem' }}>{t('case_solution')}</h2>
              <p style={{ color: 'var(--text-1)', lineHeight: 1.8, fontSize: '1rem' }}>{item.solution}</p>
            </section>
          )}
          {item.results && (
            <section>
              <h2 style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', color: 'var(--green)', marginBottom: '1rem' }}>{t('case_results')}</h2>
              <p style={{ color: 'var(--text-1)', lineHeight: 1.8, fontSize: '1rem' }}>{item.results}</p>
            </section>
          )}
        </div>

        {/* Gallery */}
        {item.gallery?.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 'var(--gap-card)' }}>
              {item.gallery.map((url, i) => (
                <img key={i} src={url} alt={`${item.title} ${i + 1}`} style={{ width: '100%', borderRadius: 'var(--r-lg)', objectFit: 'cover', height: 200 }} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '4rem', padding: '2.5rem', background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--text-0)' }}>
            Ready to get similar results?
          </h3>
          <a href={cfg?.site?.whatsapp || '#'} target="_blank" rel="noreferrer" className="btn btn-primary">
            {t('case_cta')}
          </a>
        </div>
      </div>

      <style>{`.case-grid{display:grid;gap:2.5rem}@media(min-width:768px){.case-grid{grid-template-columns:1fr 1fr}}`}</style>
    </div>
  );
}
