import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetPosts, isSupabaseReady } from '../hooks/supabase';

import { SAMPLE_BLOG_POSTS } from '../data/blogPosts';

function PostCard({ post, lang, t }) {
  const title   = lang === 'bn' && post.title_bn   ? post.title_bn   : post.title;
  const excerpt = lang === 'bn' && post.excerpt_bn ? post.excerpt_bn : post.excerpt;
  const date    = new Date(post.created_at).toLocaleDateString(
    lang === 'bn' ? 'bn-BD' : 'en-BD',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <article className="card animate-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>

        {/* Cover image or gradient placeholder */}
        {post.cover_url ? (
          <div style={{ height: 160, overflow: 'hidden', flexShrink: 0 }}>
            <img src={post.cover_url} alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
          </div>
        ) : (
          <div style={{ height: 10, background: `linear-gradient(90deg, var(--cyan), var(--purple))`, flexShrink: 0 }} />
        )}

        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.6rem' }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {post.category && (
              <span className="tag tag-cyan" style={{ fontSize: '0.58rem' }}>{post.category}</span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>{date}</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1rem',
            color: 'var(--text-0)', lineHeight: 1.35, flex: 1,
          }}>
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
              {excerpt}
            </p>
          )}

          {/* Read more */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--cyan)', letterSpacing: '0.1em', marginTop: 'auto', paddingTop: '0.5rem',
          }}>
            {t('blog_read')}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogSection() {
  const { lang, t } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed localStorage with sample posts if empty
    try {
      const existing = JSON.parse(localStorage.getItem('aipgbd_blog_posts') || '[]');
      if (existing.length === 0) {
        localStorage.setItem('aipgbd_blog_posts', JSON.stringify(SAMPLE_BLOG_POSTS));
      }
    } catch {}
    const load = async () => {
      try {
        // 1. Try Supabase
        if (isSupabaseReady) {
          const data = await dbGetPosts(true);
          if (data && data.length > 0) { setPosts(data.slice(0,3)); setLoading(false); return; }
        }
        // 2. Try localStorage (admin-created posts)
        const local = JSON.parse(localStorage.getItem('aipgbd_blog_posts') || '[]');
        const pub = local.filter(p => p.published !== false);
        if (pub.length > 0) { setPosts(pub.slice(0,3)); setLoading(false); return; }
      } catch {}
      // 3. Always show sample posts
      setPosts(SAMPLE_BLOG_POSTS.slice(0,3));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="blog" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 'clamp(1rem,3vw,2rem)' }}>

        {/* Header row with "View all" link */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="section-label animate-in" style={{ marginBottom: '0.75rem' }}>
              <span className="label-mono">{t('blog_label')}</span>
            </div>
            <h2 className="animate-in" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)',
              fontWeight: 300, margin: 0,
            }}>
              {t('blog_title')}
            </h2>
          </div>
          <Link to="/blog" className="btn btn-outline animate-in"
            style={{ fontSize: '0.82rem', padding: '0.6em 1.4em', flexShrink: 0 }}>
            {lang === 'bn' ? 'সব পোস্ট দেখুন →' : 'View all posts →'}
          </Link>
        </div>

        <p className="animate-in" style={{ color: 'var(--text-1)', maxWidth: 520, marginBottom: '2.5rem', lineHeight: 1.75 }}>
          {t('blog_sub')}
        </p>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--gap-card)' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height: 280, borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
                backgroundImage: 'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
              }} />
            ))}
          </div>
        )}

        {/* Post cards */}
        {!loading && (
          <div className="blog-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} lang={lang} t={t} />
            ))}
          </div>
        )}

      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </section>
  );
}
