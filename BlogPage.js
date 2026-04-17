import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const POSTS = [
  { id:'b1',  slug:'why-bangladeshi-brands-need-ai-video-now', category:'AI Production', title:'Why Bangladeshi Brands Need AI Video in 2025', title_bn:'২০২৫ সালে বাংলাদেশি ব্র্যান্ডগুলোর কেন এআই ভিডিও দরকার', excerpt:'Traditional video production costs 50,000–1,50,000 BDT per shoot. AI changes everything — same cinematic quality at 1/10th the price.', excerpt_bn:'প্রচলিত ভিডিও প্রোডাকশনে প্রতি শুটে ৫০,০০০–১,৫০,০০০ টাকা খরচ হয়।', published:true, views:142, created_at:new Date(Date.now()-86400000*1).toISOString() },
  { id:'b2',  slug:'real-estate-ai-video-presale-bangladesh', category:'Real Estate', title:'How Real Estate Developers Sell Apartments Before They Are Built', title_bn:'কীভাবে ডেভেলপাররা নির্মাণের আগেই অ্যাপার্টমেন্ট বিক্রি করছেন', excerpt:'Pre-sale apartment tours from architectural renders — no physical shoot required. 25,000 BDT vs 1,50,000 BDT agency quote.', excerpt_bn:'আর্কিটেকচারাল রেন্ডার থেকে প্রি-সেল অ্যাপার্টমেন্ট ট্যুর।', published:true, views:203, created_at:new Date(Date.now()-86400000*3).toISOString() },
  { id:'b3',  slug:'restaurant-content-strategy-bangladesh', category:'Restaurant', title:"The Restaurant Owner's Guide to Viral Food Content", title_bn:'ভাইরাল ফুড কন্টেন্টের জন্য রেস্তোরাঁ মালিকের গাইড', excerpt:'Restaurants that post 8+ videos per month get 3x more table bookings — how to do it without a film crew.', excerpt_bn:'মাসে ৮+ ভিডিও পোস্ট করা রেস্তোরাঁ ৩× বেশি টেবিল বুকিং পায়।', published:true, views:89, created_at:new Date(Date.now()-86400000*5).toISOString() },
  { id:'b4',  slug:'elevenlabs-bangla-voiceover-guide', category:'Voiceover', title:'How ElevenLabs AI Is Changing Bangla Brand Communication', title_bn:'ElevenLabs এআই কীভাবে বাংলা ব্র্যান্ড কমিউনিকেশন বদলে দিচ্ছে', excerpt:'Studio-grade Bangla narration without hiring a voice actor. Here is how AI voiceover works.', excerpt_bn:'ভয়েস অ্যাক্টর ছাড়াই স্টুডিও-মানের বাংলা ন্যারেশন।', published:true, views:67, created_at:new Date(Date.now()-86400000*7).toISOString() },
  { id:'b5',  slug:'startup-brand-identity-72-hours', category:'Startup', title:'How Dhaka Startups Get Investor-Ready Brand Kits in 72 Hours', title_bn:'কীভাবে ঢাকার স্টার্টআপগুলো ৭২ ঘণ্টায় বিনিয়োগকারী-প্রস্তুত ব্র্যান্ড কিট পাচ্ছে', excerpt:'A funding round is 3 days away. Your brand looks like Canva 2019. This is how founders fix it fast.', excerpt_bn:'ফান্ডিং রাউন্ড ৩ দিন দূরে। ফাউন্ডাররা কীভাবে দ্রুত ঠিক করেন।', published:true, views:156, created_at:new Date(Date.now()-86400000*9).toISOString() },
  { id:'b6',  slug:'ecommerce-product-video-bangladesh', category:'E-commerce', title:'Why Your E-commerce Store Loses Sales Without Product Video', title_bn:'কেন প্রোডাক্ট ভিডিও ছাড়া আপনার ই-কমার্স স্টোর বিক্রি হারাচ্ছে', excerpt:'Products with video convert at 3x the rate of products with photos only.', excerpt_bn:'ভিডিও সহ প্রোডাক্ট শুধু ছবির তুলনায় ৩× বেশি কনভার্ট করে।', published:true, views:94, created_at:new Date(Date.now()-86400000*11).toISOString() },
  { id:'b7',  slug:'facebook-video-algorithm-bangladesh', category:'Social Media', title:'How the Facebook Algorithm Rewards Video Content in Bangladesh', title_bn:'Facebook অ্যালগরিদম কীভাবে বাংলাদেশে ভিডিও কন্টেন্টকে পুরস্কৃত করে', excerpt:'Facebook Reels get 3x the organic reach of image posts. Here is how to make the algorithm work for your brand.', excerpt_bn:'Facebook Reels ইমেজ পোস্টের তুলনায় ৩× বেশি অর্গানিক রিচ পায়।', published:true, views:178, created_at:new Date(Date.now()-86400000*13).toISOString() },
  { id:'b8',  slug:'ai-tools-stack-explained', category:'AI Production', title:'Inside the AIPGBD Stack: How 7 AI Tools Create One Cinematic Video', title_bn:'AIPGBD স্ট্যাকের ভেতরে: কীভাবে ৭টি এআই টুল একটি সিনেমাটিক ভিডিও তৈরি করে', excerpt:'Gemini generates the image. Grok animates it. Canva brands it. Suno scores it. ElevenLabs voices it.', excerpt_bn:'Gemini ছবি তৈরি করে। Grok অ্যানিমেট করে। Canva ব্র্যান্ড করে।', published:true, views:231, created_at:new Date(Date.now()-86400000*15).toISOString() },
  { id:'b9',  slug:'website-vs-facebook-page-bangladesh', category:'Web Development', title:'Facebook Page vs Website: What Every Bangladeshi Business Needs', title_bn:'Facebook পেজ বনাম ওয়েবসাইট: প্রতিটি বাংলাদেশি ব্যবসার কী দরকার', excerpt:'Most businesses rely on Facebook and WhatsApp. Here is why that strategy has a ceiling.', excerpt_bn:'বেশিরভাগ ব্যবসা Facebook ও WhatsApp-এর উপর নির্ভর করে।', published:true, views:112, created_at:new Date(Date.now()-86400000*17).toISOString() },
  { id:'b10', slug:'bkash-integration-website-guide', category:'Web Development', title:'How to Accept bKash Payments on Your Website', title_bn:'আপনার ওয়েবসাইটে bKash পেমেন্ট কীভাবে গ্রহণ করবেন', excerpt:'bKash has 60 million users in Bangladesh. If your website cannot accept bKash, you are losing sales.', excerpt_bn:'বাংলাদেশে bKash-এর ৬ কোটিরও বেশি ব্যবহারকারী আছে।', published:true, views:88, created_at:new Date(Date.now()-86400000*19).toISOString() },
  { id:'b11', slug:'fashion-brand-video-bangladesh', category:'E-commerce', title:'How Fashion Brands in Bangladesh Are Using AI to Look International', title_bn:'বাংলাদেশের ফ্যাশন ব্র্যান্ডগুলো কীভাবে এআই দিয়ে আন্তর্জাতিক দেখাচ্ছে', excerpt:'The gap between a Dhaka fashion brand and an international label used to be production budget. AI closes that gap.', excerpt_bn:'ঢাকার ফ্যাশন ব্র্যান্ড ও আন্তর্জাতিক লেবেলের পার্থক্য ছিল প্রোডাকশন বাজেট।', published:true, views:76, created_at:new Date(Date.now()-86400000*21).toISOString() },
  { id:'b12', slug:'custom-hrm-software-bangladesh', category:'Custom Software', title:'Why Bangladeshi Companies Are Moving from Excel to Custom HRM Software', title_bn:'কেন বাংলাদেশি কোম্পানিগুলো Excel থেকে কাস্টম HRM সফটওয়্যারে যাচ্ছে', excerpt:'Managing 50+ employees on Excel costs more in errors and time than custom HRM software.', excerpt_bn:'৫০+ কর্মীকে Excel-এ পরিচালনা কাস্টম HRM সফটওয়্যারের চেয়ে বেশি খরচ হয়।', published:true, views:134, created_at:new Date(Date.now()-86400000*23).toISOString() },
  { id:'b13', slug:'stock-market-oms-bangladesh', category:'Custom Software', title:'How AI-Powered Trading OMS Is Transforming Bangladesh Stock Market', title_bn:'এআই-পাওয়ার্ড ট্রেডিং OMS কীভাবে বাংলাদেশের শেয়ার বাজার পরিবর্তন করছে', excerpt:'Order Management Systems for DSE and CSE markets built on ASP.NET and SQL for brokerages.', excerpt_bn:'বাংলাদেশের DSE ও CSE বাজারের জন্য অর্ডার ম্যানেজমেন্ট সিস্টেম।', published:true, views:167, created_at:new Date(Date.now()-86400000*25).toISOString() },
  { id:'b14', slug:'seo-for-bangladeshi-businesses', category:'Web Development', title:'Why Your Bangladeshi Business Is Invisible on Google', title_bn:'কেন আপনার বাংলাদেশি ব্যবসা Google-এ অদৃশ্য', excerpt:'Most Bangladeshi businesses have no Google presence. Here is how a properly built website fixes it.', excerpt_bn:'বেশিরভাগ বাংলাদেশি ব্যবসার Google উপস্থিতি নেই।', published:true, views:98, created_at:new Date(Date.now()-86400000*27).toISOString() },
  { id:'b15', slug:'whatsapp-business-integration-website', category:'Web Development', title:'How WhatsApp Integration Turns Your Website Into a 24/7 Sales Machine', title_bn:'WhatsApp ইন্টিগ্রেশন কীভাবে আপনার ওয়েবসাইটকে ২৪/৭ সেলস মেশিনে পরিণত করে', excerpt:'Bangladeshi customers prefer WhatsApp over contact forms. Route every visitor to your sales conversation.', excerpt_bn:'বাংলাদেশি গ্রাহকরা কন্টাক্ট ফর্মের চেয়ে WhatsApp পছন্দ করেন।', published:true, views:145, created_at:new Date(Date.now()-86400000*29).toISOString() },
  { id:'b16', slug:'virtual-influencer-bangladesh-brands', category:'AI Production', title:'The Rise of Virtual Influencers in Bangladesh', title_bn:'বাংলাদেশে ভার্চুয়াল ইনফ্লুয়েন্সারের উদয়', excerpt:'A virtual influencer never has a scandal, never asks for more money, and works 24/7.', excerpt_bn:'একজন ভার্চুয়াল ইনফ্লুয়েন্সার কখনো কেলেঙ্কারি করে না।', published:true, views:189, created_at:new Date(Date.now()-86400000*31).toISOString() },
  { id:'b17', slug:'ai-vs-traditional-agency-cost', category:'AI Production', title:'AI Production vs Traditional Agency: A Brutally Honest Cost Comparison', title_bn:'এআই প্রোডাকশন বনাম প্রচলিত এজেন্সি: একটি নির্মম সৎ মূল্য তুলনা', excerpt:'30s video: agency 80,000-1,50,000 BDT vs AIPGBD 8,000 BDT. The numbers are not close.', excerpt_bn:'প্রচলিত এজেন্সি বনাম AIPGBD: প্রতিটি লাইন আইটেম পাশাপাশি।', published:true, views:312, created_at:new Date(Date.now()-86400000*33).toISOString() },
  { id:'b18', slug:'mobile-first-website-bangladesh', category:'Web Development', title:'Why Mobile-First Website Design Is Non-Negotiable in Bangladesh', title_bn:'কেন বাংলাদেশে মোবাইল-ফার্স্ট ওয়েবসাইট ডিজাইন অপরিহার্য', excerpt:'92% of internet users in Bangladesh access the web via mobile. Design for them first.', excerpt_bn:'বাংলাদেশের ৯২% ইন্টারনেট ব্যবহারকারী মোবাইলে ওয়েব অ্যাক্সেস করেন।', published:true, views:78, created_at:new Date(Date.now()-86400000*35).toISOString() },
  { id:'b19', slug:'content-marketing-roi-bangladesh', category:'Social Media', title:'The ROI of Content Marketing for Bangladeshi SMEs: Real Numbers', title_bn:'বাংলাদেশি SME-র জন্য কন্টেন্ট মার্কেটিংয়ের ROI', excerpt:'A restaurant investing 18,000 BDT/month in video content sees 177% ROI in 90 days.', excerpt_bn:'মাসে ১৮,০০০ টাকা বিনিয়োগে ১৭৭% ROI — বাস্তব সংখ্যা।', published:true, views:223, created_at:new Date(Date.now()-86400000*37).toISOString() },
  { id:'b20', slug:'how-to-brief-ai-production-studio', category:'AI Production', title:'How to Brief an AI Production Studio: Getting the Best Results from AIPGBD', title_bn:'কীভাবে একটি এআই প্রোডাকশন স্টুডিও ব্রিফ করবেন', excerpt:'The quality of your brief determines the quality of your output. Five elements every good brief needs.', excerpt_bn:'আপনার ব্রিফের মান আউটপুটের মান নির্ধারণ করে।', published:true, views:56, created_at:new Date(Date.now()-86400000*39).toISOString() },
];

function PostCard({ post, lang }) {
  const title   = lang==='bn' && post.title_bn   ? post.title_bn   : post.title;
  const excerpt = lang==='bn' && post.excerpt_bn ? post.excerpt_bn : post.excerpt;
  const date    = new Date(post.created_at).toLocaleDateString(lang==='bn'?'bn-BD':'en-BD',{day:'numeric',month:'short',year:'numeric'});
  return (
    <Link to={`/blog/${post.slug}`} style={{textDecoration:'none',display:'flex',flexDirection:'column',height:'100%'}}>
      <article className="card animate-in" style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'0.75rem',height:'100%',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem',flexWrap:'wrap'}}>
          <span className="tag tag-cyan" style={{fontSize:'0.58rem'}}>{post.category}</span>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--text-3)'}}>{date}</span>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--text-3)'}}>{post.views} views</span>
        </div>
        <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'1rem',color:'var(--text-0)',lineHeight:1.35,flex:1}}>{title}</h3>
        <p style={{fontSize:'0.82rem',color:'var(--text-2)',lineHeight:1.65}}>{excerpt}</p>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--cyan)',letterSpacing:'0.1em',paddingTop:'0.5rem'}}>
          {lang==='bn' ? 'নিবন্ধ পড়ুন →' : 'Read article →'}
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState('All');
  const categories = ['All','AI Production','Real Estate','Restaurant','Voiceover','Startup','E-commerce','Social Media','Web Development','Custom Software'];
  const filtered = filter==='All' ? POSTS : POSTS.filter(p=>p.category===filter);

  useEffect(()=>{ window.scrollTo(0,0); },[]);

  return (
    <div style={{minHeight:'100vh',paddingTop:'68px'}}>
      <section className="section">
        <div className="container">
          <div className="section-label animate-in"><span className="label-mono">{lang==='bn'?'ব্লগ':'Blog'}</span></div>
          <h1 className="animate-in" style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,6vw,5rem)',fontWeight:300,marginBottom:'0.75rem'}}>
            {lang==='bn'?'অন্তর্দৃষ্টি ও ধারণা।':'Insights & Ideas.'}
          </h1>
          <p className="animate-in" style={{color:'var(--text-1)',maxWidth:560,marginBottom:'2rem',lineHeight:1.75}}>
            {lang==='bn'?'এআই, ব্র্যান্ড প্রোডাকশন এবং বাংলাদেশে বিশ্বমানের কন্টেন্ট নিয়ে ভাবনা।':'Thoughts on AI production, brand strategy, and building world-class content in Bangladesh.'}
          </p>
          <div className="animate-in" style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'2rem'}}>
            {categories.map(c=>(
              <button key={c} onClick={()=>setFilter(c)}
                style={{padding:'0.3em 0.9em',borderRadius:'100px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.08em',border:`1px solid ${filter===c?'var(--cyan-mid)':'var(--border)'}`,background:filter===c?'var(--cyan-dim)':'transparent',color:filter===c?'var(--cyan)':'var(--text-2)',transition:'all 0.2s',cursor:'pointer'}}>
                {c}
              </button>
            ))}
          </div>
          <div className="blog-grid">
            {filtered.map(post=><PostCard key={post.id} post={post} lang={lang}/>)}
          </div>
        </div>
      </section>
    </div>
  );
}
