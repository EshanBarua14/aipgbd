import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbGetPost, dbIncrementPostViews, isSupabaseReady } from '../hooks/supabase';

const SAMPLE_POSTS = {
  'why-ai-video-is-the-future-for-bd-brands': {
    slug: 'why-ai-video-is-the-future-for-bd-brands',
    title: 'Why AI Video is the Future for Bangladeshi Brands',
    title_bn: 'কেন এআই ভিডিও বাংলাদেশি ব্র্যান্ডের ভবিষ্যৎ',
    category: 'AI Production', published: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), views: 143,
    content: '<h2>The Problem with Traditional Production</h2><p>In Bangladesh, a single professional video shoot costs between <strong>50,000 and 1,50,000 BDT</strong>. That includes crew, equipment rental, location, post-production, and the endless back-and-forth on revisions. For most SMEs, that\'s their entire monthly content budget — for one video.</p><h2>What AI Changes</h2><p>With tools like Gemini, Grok, Suno, and ElevenLabs, we can produce a 30-second cinematic brand video for <strong>8,000 BDT</strong>. Not a lower quality product — a genuinely better one. No scheduling conflicts. No equipment failures. No weather cancellations.</p><h2>The Stack That Makes It Possible</h2><p>The key insight is that each AI tool does one thing exceptionally well. Gemini creates the hyper-realistic visual anchor. Grok animates it into sustained cinematic motion. Suno composes an original score that matches the exact tempo. ElevenLabs delivers studio-grade Bangla narration.</p><p>The result is a production stack that would have cost 10× more three years ago — now available to any brand in Bangladesh.</p>',
    content_bn: '<h2>প্রচলিত প্রোডাকশনের সমস্যা</h2><p>বাংলাদেশে একটি পেশাদার ভিডিও শুটে <strong>৫০,০০০ থেকে ১,৫০,০০০ টাকা</strong> খরচ হয়। এর মধ্যে ক্রু, সরঞ্জাম ভাড়া, লোকেশন, পোস্ট-প্রোডাকশন সব কিছু অন্তর্ভুক্ত। বেশিরভাগ ছোট ব্যবসার জন্য এটি তাদের পুরো মাসের কন্টেন্ট বাজেট — মাত্র একটি ভিডিওর জন্য।</p><h2>এআই কী বদলে দেয়</h2><p>Gemini, Grok, Suno এবং ElevenLabs এর মতো টুল ব্যবহার করে আমরা মাত্র <strong>৮,০০০ টাকায়</strong> একটি ৩০ সেকেন্ডের সিনেমাটিক ব্র্যান্ড ভিডিও তৈরি করতে পারি।</p>',
  },
};

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
        data = SAMPLE_POSTS[slug] || null;
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
