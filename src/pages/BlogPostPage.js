import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetPost, dbIncrementPostViews, isSupabaseReady } from '../hooks/supabase';

import { SAMPLE_BLOG_POSTS } from '../data/blogPosts';
const SAMPLE_POSTS_BY_SLUG = Object.fromEntries(SAMPLE_BLOG_POSTS.map(p => [p.slug, p]));

export default function BlogPostPage({ cfg }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      let data = null;
      if (isSupabaseReady) {
        data = await dbGetPost(slug);
        if (data) dbIncrementPostViews(slug);
      } else {
        data = SAMPLE_POSTS_BY_SLUG[slug] || null;
      }
      if (!data) { navigate('/blog'); return; }
      setPost(data);
      setLoading(false);
      document.title = `${data.title} — ${cfg?.site?.name || 'AIPGBD'}`;
    };
    load();
  }, [slug, navigate, cfg]);

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-3)' }}>Loading…</div>
    </div>
  );

  const title   = lang === 'bn' && post.title_bn   ? post.title_bn   : post.title;
  const content = lang === 'bn' && post.content_bn ? post.content_bn : post.content;
  const date    = new Date(post.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-BD', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px' }}>
      <article>
        {/* Hero */}
        <div style={{ padding: 'clamp(3rem,8vw,6rem) 0 0', background: `linear-gradient(to bottom,var(--bg-1),var(--bg-0))` }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <Link to="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
              {t('blog_back')}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {post.category && <span className="tag tag-cyan" style={{ fontSize: '0.6rem' }}>{post.category}</span>}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>{date}</span>
              {post.views > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>{post.views} {t('blog_views')}</span>}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--text-0)', lineHeight: 1.1, marginBottom: '2rem' }}>
              {title}
            </h1>
          </div>
        </div>

        {post.cover_url && (
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 var(--container-px) 2rem' }}>
            <img src={post.cover_url} alt={title} style={{ width: '100%', borderRadius: 'var(--r-xl)', objectFit: 'cover', maxHeight: 480 }} />
          </div>
        )}

        {/* Content */}
        <div className="container" style={{ maxWidth: 800, paddingBottom: 'var(--section-py)' }}>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />

          {/* CTA */}
          <div style={{ marginTop: '4rem', padding: '2.5rem', background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--text-0)' }}>
              Ready to try AI production?
            </h3>
            <a href={cfg?.site?.whatsapp || '#'} target="_blank" rel="noreferrer" className="btn btn-primary">
              {t('case_cta')}
            </a>
          </div>
        </div>
      </article>

      <style>{`
        .blog-content{font-size:1.05rem;line-height:1.85;color:var(--text-1)}
        .blog-content h2{font-family:var(--font-ui);font-size:1.5rem;font-weight:700;color:var(--text-0);margin:2.5rem 0 1rem}
        .blog-content h3{font-family:var(--font-ui);font-size:1.2rem;font-weight:600;color:var(--text-0);margin:2rem 0 0.75rem}
        .blog-content p{margin-bottom:1.25rem;color:var(--text-1)}
        .blog-content strong{color:var(--text-0);font-weight:600}
        .blog-content ul,.blog-content ol{padding-left:1.5rem;margin-bottom:1.25rem}
        .blog-content li{margin-bottom:0.5rem;color:var(--text-1)}
        .blog-content blockquote{border-left:3px solid var(--cyan);padding-left:1.5rem;margin:2rem 0;font-style:italic;color:var(--text-2)}
        .blog-content a{color:var(--cyan);text-decoration:underline}
        .blog-content img{width:100%;border-radius:var(--r-lg);margin:1.5rem 0}
      `}</style>
    </div>
  );
}
