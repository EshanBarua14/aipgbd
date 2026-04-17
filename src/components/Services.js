import { useState } from 'react';

const PKGS = [
  { id:'spark',       num:'01', tab:'video', title:'The Spark',        title_bn:'দ্য স্পার্ক',        price:'8,000',  unit:'BDT / video',    accent:'#00e5ff', popular:false, badge:'48h',      badge_bn:'৪৮ঘণ্টা',    desc:'One 30-second cinematic brand or product video with AI-composed score. Commercial rights included. Delivered in 48 hours.',                                                                       desc_bn:'৩০ সেকেন্ডের সিনেমাটিক ভিডিও। কাস্টম অডিও স্কোর সহ। ৪৮ ঘণ্টায় ডেলিভারি।',                                                      features:['1 × 30s cinematic video','Custom Suno audio score','Commercial rights included','48-hour delivery','1 revision round'],                                                                       features_bn:['১ × ৩০ সেকেন্ড সিনেমাটিক ভিডিও','কাস্টম Suno অডিও স্কোর','বাণিজ্যিক স্বত্ব অন্তর্ভুক্ত','৪৮ ঘণ্টায় ডেলিভারি','১ রিভিশন রাউন্ড'] },
  { id:'content',     num:'02', tab:'video', title:'Content Pack',     title_bn:'কন্টেন্ট প্যাক',     price:'22,000', unit:'BDT / pack',     accent:'#9b59ff', popular:false, badge:'72h',      badge_bn:'৭২ঘণ্টা',    desc:'4 short-form cinematic videos (20s each) with ElevenLabs Bangla and English voiceover. Optimised for Facebook Reels and Instagram.',                                                              desc_bn:'ElevenLabs বাংলা ও ইংরেজি ভয়েসওভার সহ ৪টি শর্ট-ফর্ম ভিডিও (২০ সেকেন্ড)।',                                                       features:['4 × 20s cinematic videos','ElevenLabs Bangla + EN voiceover','Custom Suno scores','72-hour delivery','2 revision rounds','Facebook & Instagram optimised'],                                     features_bn:['৪ × ২০ সেকেন্ড সিনেমাটিক ভিডিও','ElevenLabs বাংলা + ইংরেজি ভয়েসওভার','কাস্টম Suno স্কোর','৭২ ঘণ্টায় ডেলিভারি','২ রিভিশন রাউন্ড','Facebook ও Instagram অপটিমাইজড'] },
  { id:'brandstory',  num:'03', tab:'video', title:'The Brand Story',  title_bn:'ব্র্যান্ড স্টোরি',   price:'35,000', unit:'BDT / campaign', accent:'#e040fb', popular:false, badge:'5 days',   badge_bn:'৫ দিন',      desc:'3 cinematic 30-second videos with full Bangla and English voiceover and a custom brand audio identity. For product launches.',                                                                     desc_bn:'সম্পূর্ণ বাংলা ও ইংরেজি ভয়েসওভার এবং কাস্টম ব্র্যান্ড অডিও আইডেন্টিটি সহ ৩টি ভিডিও।',                                          features:['3 × 30s cinematic videos','Full Bangla + EN ElevenLabs voiceover','Brand audio identity','3 revision rounds','5-day delivery','All source files included'],                                    features_bn:['৩ × ৩০ সেকেন্ড সিনেমাটিক ভিডিও','সম্পূর্ণ বাংলা + ইংরেজি ভয়েসওভার','ব্র্যান্ড অডিও আইডেন্টিটি','৩ রিভিশন রাউন্ড','৫ দিনে ডেলিভারি','সমস্ত সোর্স ফাইল'] },
  { id:'landing',     num:'04', tab:'web',   title:'Landing Page',     title_bn:'ল্যান্ডিং পেজ',      price:'12,000', unit:'BDT / page',     accent:'#00e5ff', popular:false, badge:'7 days',   badge_bn:'৭ দিন',      desc:'A single high-converting page built for one goal — leads, sales, or sign-ups. Mobile-first, fast, WhatsApp CTA and contact form.',                                                                desc_bn:'একটি লক্ষ্যের জন্য হাই-কনভার্টিং পেজ। মোবাইল-ফার্স্ট, WhatsApp CTA সহ।',                                                           features:['1-page conversion website','Mobile-first responsive design','WhatsApp CTA button','Contact form + lead capture','Google Analytics setup','7-day delivery','1 month free support'],              features_bn:['১-পেজ কনভার্সন ওয়েবসাইট','মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন','WhatsApp CTA বাটন','কন্টাক্ট ফর্ম + লিড ক্যাপচার','Google Analytics সেটআপ','৭ দিনে ডেলিভারি','১ মাস বিনামূল্যে সাপোর্ট'] },
  { id:'brandweb',    num:'05', tab:'web',   title:'Brand Website',    title_bn:'ব্র্যান্ড ওয়েবসাইট', price:'28,000', unit:'BDT / website',  accent:'#9b59ff', popular:false, badge:'14 days',  badge_bn:'১৪ দিন',     desc:'A 5-page professional website with cinematic video hero, full SEO, WhatsApp and bKash integration, and custom domain setup.',                                                                      desc_bn:'সিনেমাটিক ভিডিও হিরো, SEO, WhatsApp ও bKash ইন্টিগ্রেশন সহ ৫-পেজ ওয়েবসাইট।',                                                      features:['5-page custom website','Cinematic video hero section','Full SEO optimisation','WhatsApp + bKash integration','Custom domain setup','14-day delivery','3 months free support'],                  features_bn:['৫-পেজ কাস্টম ওয়েবসাইট','সিনেমাটিক ভিডিও হিরো','সম্পূর্ণ SEO অপটিমাইজেশন','WhatsApp + bKash ইন্টিগ্রেশন','কাস্টম ডোমেইন','১৪ দিনে ডেলিভারি','৩ মাস বিনামূল্যে সাপোর্ট'] },
  { id:'ecommerce',   num:'06', tab:'web',   title:'E-commerce Store', title_bn:'ই-কমার্স স্টোর',     price:'55,000', unit:'BDT / store',    accent:'#00ffa3', popular:false, badge:'21 days',  badge_bn:'২১ দিন',     desc:'A full online store with product catalogue, bKash, Nagad and card payments, order management dashboard, and mobile-first design.',                                                                desc_bn:'প্রোডাক্ট ক্যাটালগ, bKash, Nagad ও কার্ড পেমেন্ট, অর্ডার ড্যাশবোর্ড সহ সম্পূর্ণ অনলাইন স্টোর।',                                   features:['Full e-commerce store','Product catalogue + inventory','bKash, Nagad + card payments','Order management dashboard','Mobile-first design','21-day delivery','3 months free support'],          features_bn:['সম্পূর্ণ ই-কমার্স স্টোর','প্রোডাক্ট ক্যাটালগ + ইনভেন্টরি','bKash, Nagad + কার্ড পেমেন্ট','অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড','মোবাইল-ফার্স্ট ডিজাইন','২১ দিনে ডেলিভারি','৩ মাস সাপোর্ট'] },
  { id:'custom',      num:'07', tab:'web',   title:'Custom Software',  title_bn:'কাস্টম সফটওয়্যার',  price:'Custom', unit:'quote on request',accent:'#00ffa3', popular:false, badge:'Custom',   badge_bn:'কাস্টম',     desc:'HRM, Stock Market Trading OMS, inventory, billing — any bespoke business software. Built on ASP.NET + SQL + React. Ask us for a quote.',                                                           desc_bn:'HRM, স্টক মার্কেট ট্রেডিং OMS, ইনভেন্টরি, বিলিং — যেকোনো কাস্টম বিজনেস সফটওয়্যার। ASP.NET + SQL + React দিয়ে।',                   features:['HRM, Payroll & Attendance','Stock Market / Trading OMS','Inventory & billing systems','Any custom business workflow','ASP.NET + React + SQL','Scalable architecture','Ongoing maintenance'],   features_bn:['HRM, পেরোল ও অ্যাটেন্ডেন্স','স্টক মার্কেট / ট্রেডিং OMS','ইনভেন্টরি ও বিলিং সিস্টেম','যেকোনো কাস্টম ওয়ার্কফ্লো','ASP.NET + React + SQL','স্কেলেবল আর্কিটেকচার','চলমান রক্ষণাবেক্ষণ'] },
  { id:'launch',      num:'08', tab:'combo', title:'The Launch Kit',   title_bn:'লঞ্চ কিট',           price:'45,000', unit:'BDT / full kit', accent:'#00e5ff', popular:true,  badge:'7 days',   badge_bn:'৭ দিন',      desc:'Everything to launch a new brand — 3 cinematic videos, landing page, Bangla voiceover, and WhatsApp integration. Ready in 7 days.',                                                               desc_bn:'নতুন ব্র্যান্ড লঞ্চের সব কিছু — ৩টি ভিডিও, ল্যান্ডিং পেজ, বাংলা ভয়েসওভার। ৭ দিনে রেডি।',                                          features:['3 × 30s cinematic videos','High-converting landing page','ElevenLabs Bangla + EN voiceover','WhatsApp lead integration','Brand audio identity','7-day delivery','2 revision rounds'],           features_bn:['৩ × ৩০ সেকেন্ড সিনেমাটিক ভিডিও','হাই-কনভার্টিং ল্যান্ডিং পেজ','ElevenLabs বাংলা + ইংরেজি ভয়েসওভার','WhatsApp লিড ইন্টিগ্রেশন','ব্র্যান্ড অডিও আইডেন্টিটি','৭ দিনে ডেলিভারি','২ রিভিশন'] },
  { id:'creator',     num:'09', tab:'combo', title:'Monthly Creator',  title_bn:'মান্থলি ক্রিয়েটর',  price:'18,000', unit:'BDT / month',    accent:'#9b59ff', popular:false, badge:'Weekly',   badge_bn:'সাপ্তাহিক',  desc:'8 short-form cinematic videos per month delivered weekly, optimised for Facebook Reels and Instagram. Consistent content, zero hassle.',                                                           desc_bn:'প্রতি মাসে ৮টি শর্ট-ফর্ম ভিডিও সাপ্তাহিক ডেলিভারি। Facebook Reels ও Instagram-এর জন্য।',                                           features:['8 × short-form videos monthly','Weekly delivery (2 per week)','Facebook + Instagram optimised','Custom Suno score per video','Monthly content calendar','Unlimited minor revisions'],          features_bn:['মাসে ৮ × শর্ট-ফর্ম ভিডিও','সাপ্তাহিক ডেলিভারি (সপ্তাহে ২টি)','Facebook + Instagram অপটিমাইজড','প্রতিটি ভিডিওতে কাস্টম Suno স্কোর','মাসিক কন্টেন্ট ক্যালেন্ডার','সীমাহীন ছোট রিভিশন'] },
  { id:'retainer',    num:'10', tab:'combo', title:'Full Retainer',    title_bn:'ফুল রিটেইনার',       price:'65,000', unit:'BDT / month',    accent:'#e040fb', popular:true,  badge:'Priority', badge_bn:'প্রায়রিটি',  desc:'12 cinematic videos per month, website maintenance, weekly content calendar, dedicated ElevenLabs voice clone, and priority support.',                                                             desc_bn:'প্রতি মাসে ১২টি ভিডিও, ওয়েবসাইট রক্ষণাবেক্ষণ, কন্টেন্ট ক্যালেন্ডার, ডেডিকেটেড ভয়েস ক্লোন।',                                     features:['12 × cinematic videos monthly','Website maintenance included','Weekly content calendar','Dedicated ElevenLabs voice clone','Priority 24h delivery','Unlimited revisions','Dedicated WhatsApp line'], features_bn:['মাসে ১২ × সিনেমাটিক ভিডিও','ওয়েবসাইট রক্ষণাবেক্ষণ অন্তর্ভুক্ত','সাপ্তাহিক কন্টেন্ট ক্যালেন্ডার','ডেডিকেটেড ElevenLabs ভয়েস ক্লোন','প্রায়রিটি ২৪ ঘণ্টা ডেলিভারি','সীমাহীন রিভিশন','ডেডিকেটেড WhatsApp লাইন'] },
];

const TABS = [
  { id:'video', icon:'🎬', en:'Video Production',  bn:'ভিডিও প্রোডাকশন', sub_en:'AI-cinematic content',          sub_bn:'এআই-সিনেমাটিক কন্টেন্ট' },
  { id:'web',   icon:'🌐', en:'Web & Software',     bn:'ওয়েব ও সফটওয়্যার', sub_en:'React · ASP.NET · SQL · Custom', sub_bn:'React · ASP.NET · SQL · কাস্টম' },
  { id:'combo', icon:'🚀', en:'Growth Packages',    bn:'গ্রোথ প্যাকেজ',    sub_en:'Video + web combined',          sub_bn:'ভিডিও + ওয়েব একসাথে' },
];

export default function Services({ cfg }) {
  const wa = cfg?.site?.whatsapp || '#';
  const [activeTab, setActiveTab] = useState('video');
  const [lang, setLang] = useState(() => localStorage.getItem('aipgbd_lang') || 'en');

  // sync with global lang changes
  useState(() => {
    const check = () => setLang(localStorage.getItem('aipgbd_lang') || 'en');
    window.addEventListener('storage', check);
    const t = setInterval(check, 500);
    return () => { window.removeEventListener('storage', check); clearInterval(t); };
  });

  const bn = lang === 'bn';
  const visible = PKGS.filter(p => p.tab === activeTab);

  const waMsg = (pkg) => pkg.price === 'Custom'
    ? `Hi AIPGBD! I'd like a custom quote for ${pkg.title}. Let me describe my requirements.`
    : `Hi AIPGBD! I'm interested in the ${pkg.title} package (৳${pkg.price}). Can we discuss?`;

  return (
    <section id="services" style={{ padding: 'var(--section-py) 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">

        {/* Label */}
        <div className="section-label animate-in" style={{ marginBottom: '1.5rem' }}>
          <span className="label-mono">{bn ? 'প্যাকেজ' : 'Packages'}</span>
        </div>

        {/* Heading row */}
        <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 300, margin: 0 }}>
              {bn ? 'আমাদের প্যাকেজ।' : 'Our packages.'}
            </h2>
            <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginTop: '0.5rem', letterSpacing: '0.1em' }}>
              {bn ? 'প্রচলিত এজেন্সির ১/১০ মূল্যে বিশ্বমানের আউটপুট' : 'World-class output at 1/10th traditional agency cost'}
            </p>
          </div>
          <div style={{ padding: '0.75rem 1.25rem', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-mid)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{bn ? 'প্রচলিত এজেন্সি' : 'Traditional agency'}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-2)', textDecoration: 'line-through' }}>৳1,50,000+</div>
            </div>
            <span style={{ color: 'var(--text-3)' }}>→</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AIPGBD</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--cyan)' }}>৳8,000</div>
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="animate-in svc-tabs">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`svc-tab${active ? ' svc-tab-active' : ''}`}>
                <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.35rem' }}>{tab.icon}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.88rem', display: 'block', color: active ? 'var(--cyan)' : 'var(--text-0)' }}>{bn ? tab.bn : tab.en}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.06em', display: 'block', marginTop: '0.15rem' }}>{bn ? tab.sub_bn : tab.sub_en}</span>
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        <div className="svc-grid animate-in">
          {visible.map((pkg, i) => {
            const title    = bn ? pkg.title_bn    : pkg.title;
            const desc     = bn ? pkg.desc_bn     : pkg.desc;
            const features = bn ? pkg.features_bn : pkg.features;
            return (
              <div key={pkg.id} className="svc-card" style={{ '--accent': pkg.accent, animationDelay: `${i * 0.08}s`, border: `1.5px solid ${pkg.popular ? 'rgba(155,89,255,0.4)' : 'var(--border)'}` }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${pkg.accent},transparent)`, flexShrink: 0 }} />
                {pkg.popular && (
                  <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', padding: '0.3em 0', flexShrink: 0 }}>
                    {bn ? '★ সবচেয়ে জনপ্রিয়' : '★ Most Popular'}
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      {bn ? 'প্যাকেজ' : 'Package'} {pkg.num}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, color: pkg.accent, background: `${pkg.accent}20`, border: `1px solid ${pkg.accent}50`, padding: '0.2em 0.7em', borderRadius: '100px' }}>
                      {bn ? pkg.badge_bn : pkg.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,2vw,1.8rem)', fontWeight: 300, color: pkg.accent, marginBottom: '0.6rem', lineHeight: 1.1 }}>{title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1.1rem' }}>{desc}</p>
                  <div style={{ flex: 1, marginBottom: '1.25rem' }}>
                    {features.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', gap: '0.5rem', padding: '0.35rem 0', borderBottom: fi < features.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                        <span style={{ color: pkg.accent, fontSize: '0.6rem', marginTop: '0.2rem', flexShrink: 0, fontWeight: 700 }}>✓</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-1)', lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '0.9rem 1rem', background: 'var(--bg-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 300, color: 'var(--text-0)', lineHeight: 1 }}>
                      {pkg.price === 'Custom' ? (bn ? 'কাস্টম' : 'Custom') : `৳${pkg.price}`}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{pkg.unit}</div>
                  </div>
                  <a href={`${wa}?text=${encodeURIComponent(waMsg(pkg))}`} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75em', borderRadius: 'var(--r-md)', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', background: pkg.popular ? 'linear-gradient(135deg,var(--cyan),var(--purple))' : 'transparent', color: pkg.popular ? '#fff' : 'var(--text-0)', border: pkg.popular ? 'none' : '1.5px solid var(--border)', transition: 'all 0.2s' }}>
                    {pkg.price === 'Custom' ? (bn ? 'কোট পান →' : 'Get a quote →') : (bn ? 'শুরু করুন →' : 'Get started →')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="animate-in" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
          <a href={`${wa}?text=${encodeURIComponent('Hi AIPGBD! I need a custom quote.')}`} target="_blank" rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '0.1em', textDecoration: 'none', border: '1px solid var(--cyan-mid)', padding: '0.6em 1.5em', borderRadius: '100px', background: 'var(--cyan-dim)' }}>
            {bn ? '→ কাস্টম কোট পান' : '→ Need something custom? Get a quote'}
          </a>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-3)', textAlign: 'center', letterSpacing: '0.06em' }}>
            {bn ? '৫০% অগ্রিম · ৫০% ডেলিভারিতে · bKash · Nagad · ব্যাংক ট্রান্সফার' : '50% deposit to begin · 50% on delivery · bKash · Nagad · Bank Transfer'}
          </p>
        </div>

      </div>

      <style>{`
        .svc-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .svc-tab {
          padding: 1rem;
          border-radius: var(--r-lg);
          text-align: left;
          border: 1.5px solid var(--border);
          background: var(--surface);
          transition: all 0.2s;
          cursor: pointer;
        }
        .svc-tab-active {
          border-color: var(--cyan-mid) !important;
          background: var(--cyan-dim) !important;
          box-shadow: var(--glow-cyan);
        }
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: stretch;
        }
        .svc-card {
          border-radius: var(--r-xl);
          background: var(--surface);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .svc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }
        @media (max-width: 1100px) {
          .svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .svc-tabs { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
          .svc-grid { grid-template-columns: 1fr !important; }
          .svc-tab { padding: 0.75rem 1rem !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .svc-tabs { grid-template-columns: repeat(3, 1fr) !important; }
          .svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
