import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetPosts, isSupabaseReady } from '../hooks/supabase';

// Sample posts shown when Supabase not connected or no posts yet
const SAMPLE_POSTS = [
  {
    id: 's1',
    slug: 'why-ai-video-is-the-future-for-bd-brands',
    title: 'Why AI Video is the Future for Bangladeshi Brands',
    title_bn: 'কেন এআই ভিডিও বাংলাদেশি ব্র্যান্ডের ভবিষ্যৎ',
    excerpt: 'Traditional video production costs 50,000–1,50,000 BDT per shoot. AI changes everything — same quality, 8,000 BDT.',
    excerpt_bn: 'প্রচলিত ভিডিও প্রোডাকশনে প্রতি শুটে ৫০,০০০–১,৫০,০০০ টাকা খরচ হয়। এআই সব বদলে দিচ্ছে।',
    category: 'AI Production',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    cover_url: '',
  },
  {
    id: 's2',
    slug: 'elevenlabs-bangla-voiceover-guide',
    title: 'Complete Guide to ElevenLabs Bangla Voiceover',
    title_bn: 'ElevenLabs বাংলা ভয়েসওভার সম্পূর্ণ গাইড',
    excerpt: 'How we create studio-grade Bangla narration for brands without hiring a single voice actor.',
    excerpt_bn: 'কীভাবে আমরা একজনও ভয়েস অ্যাক্টর ছাড়াই স্টুডিও-মানের বাংলা ন্যারেশন তৈরি করি।',
    category: 'Voiceover',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    cover_url: '',
  },
  {
    id: 's3',
    slug: 'real-estate-ai-video-bangladesh',
    title: 'How Real Estate Developers Cut Video Costs by 80%',
    title_bn: 'কীভাবে রিয়েল এস্টেট ডেভেলপাররা ভিডিও খরচ ৮০% কমালেন',
    excerpt: 'Pre-sale apartment tours from renders — no physical shoot required. Real numbers from a real project.',
    excerpt_bn: 'রেন্ডার থেকে প্রি-সেল অ্যাপার্টমেন্ট ট্যুর — কোনো ফিজিক্যাল শুট দরকার নেই।',
    category: 'Case Study',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    cover_url: '',
  },
];

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
    const load = async () => {
      if (isSupabaseReady) {
        const data = await dbGetPosts(true);
        // Use real posts if available, else fall back to samples
        setPosts(data && data.length > 0 ? data.slice(0, 3) : SAMPLE_POSTS);
      } else {
        setPosts(SAMPLE_POSTS);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="blog" className="section">
      <div className="gradient-line" />
      <div className="container" style={{ paddingTop: 'var(--section-py)' }}>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--gap-card)', alignItems: 'stretch' }}>
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
