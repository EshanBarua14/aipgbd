import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetPosts, isSupabaseReady } from '../hooks/supabase';

// Local fallback posts when Supabase not set up
const SAMPLE_POSTS = [
  {
    id: '1', slug: 'why-ai-video-is-the-future-for-bd-brands',
    title: 'Why AI Video is the Future for Bangladeshi Brands',
    title_bn: 'কেন এআই ভিডিও বাংলাদেশি ব্র্যান্ডের ভবিষ্যৎ',
    excerpt: 'Traditional video production in Bangladesh costs 50,000–1,50,000 BDT per shoot. AI changes everything.',
    excerpt_bn: 'বাংলাদেশে প্রচলিত ভিডিও প্রোডাকশনে প্রতি শুটে ৫০,০০০–১,৫০,০০০ টাকা খরচ হয়। এআই সব বদলে দিচ্ছে।',
    category: 'AI Production', published: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), views: 142,
  },
  {
    id: '2', slug: 'elevenlabs-bangla-voiceover-guide',
    title: 'Complete Guide to ElevenLabs Bangla Voiceover',
    title_bn: 'ElevenLabs বাংলা ভয়েসওভার সম্পূর্ণ গাইড',
    excerpt: 'How we create studio-grade Bangla narration for brands without hiring a single voice actor.',
    excerpt_bn: 'কীভাবে আমরা একজনও ভয়েস অ্যাক্টর ছাড়াই ব্র্যান্ডের জন্য স্টুডিও-মানের বাংলা ন্যারেশন তৈরি করি।',
    category: 'Voiceover', published: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(), views: 89,
  },
  {
    id: '3', slug: 'real-estate-ai-video-bangladesh',
    title: 'How Real Estate Developers Cut Video Costs by 80%',
    title_bn: 'কীভাবে রিয়েল এস্টেট ডেভেলপাররা ভিডিও খরচ ৮০% কমালেন',
    excerpt: 'Pre-sale apartment tours from renders — no physical shoot required. The numbers tell the story.',
    excerpt_bn: 'রেন্ডার থেকে প্রি-সেল অ্যাপার্টমেন্ট ট্যুর — কোনো ফিজিক্যাল শুট দরকার নেই।',
    category: 'Case Study', published: true,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(), views: 203,
  },
];

function PostCard({ post, lang, t }) {
  const title = lang === 'bn' && post.title_bn ? post.title_bn : post.title;
  const excerpt = lang === 'bn' && post.excerpt_bn ? post.excerpt_bn : post.excerpt;
  const date = new Date(post.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-BD', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article className="card animate-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
        {post.cover_url && (
          <div style={{ height: 180, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={post.cover_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {post.category && <span className="tag tag-cyan" style={{ fontSize: '0.58rem' }}>{post.category}</span>}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-3)' }}>{date}</span>
          {post.views > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-3)' }}>{post.views} {t('blog_views')}</span>
          )}
        </div>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-0)', lineHeight: 1.3, flex: 1 }}>{title}</h3>
        {excerpt && <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{excerpt}</p>}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cyan)', letterSpacing: '0.1em', marginTop: 'auto' }}>
          {t('blog_read')}
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const { lang, t } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      if (isSupabaseReady) {
        const data = await dbGetPosts(true);
        setPosts(data || SAMPLE_POSTS);
      } else {
        setPosts(SAMPLE_POSTS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px' }}>
      <section className="section">
        <div className="container" style={{ paddingTop: 'var(--section-py)' }}>
          <div className="section-label animate-in"><span className="label-mono">{t('blog_label')}</span></div>
          <h1 className="animate-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, marginBottom: '0.75rem' }}>
            {t('blog_title')}
          </h1>
          <p className="animate-in" style={{ color: 'var(--text-1)', maxWidth: 560, marginBottom: '2.5rem', lineHeight: 1.75, fontSize: '1rem' }}>
            {t('blog_sub')}
          </p>

          {/* Category filter */}
          {categories.length > 2 && (
            <div className="animate-in" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  style={{ padding: '0.3em 0.9em', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${filter === c ? 'var(--cyan-mid)' : 'var(--border)'}`, background: filter === c ? 'var(--cyan-dim)' : 'transparent', color: filter === c ? 'var(--cyan)' : 'var(--text-2)', transition: 'all 0.2s' }}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 'var(--gap-card)' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 320, borderRadius: 'var(--r-lg)', background: 'var(--surface)', border: '1px solid var(--border)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)' }} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              {t('blog_empty')}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 'var(--gap-card)' }}>
              {filtered.map(post => <PostCard key={post.id} post={post} lang={lang} t={t} />)}
            </div>
          )}
        </div>
      </section>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
