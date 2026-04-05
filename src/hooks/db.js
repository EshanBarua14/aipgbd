const DB_KEY  = 'aipgbd_v5_db';
const CFG_KEY = 'aipgbd_v5_cfg';

export const DEFAULT_CONFIG = {
  site: {
    name: 'AIPGBD',
    tagline: 'Cinematic AI Production',
    tagline_bn: 'সিনেমাটিক এআই প্রোডাকশন',
    logoUrl: '/logo.png',
    heroTitle1: 'We Make',
    heroTitle1_bn: 'আমরা তৈরি করি',
    heroWords: ['Cinema', 'Brands', 'Stories', 'Vision', 'Motion'],
    heroWords_bn: ['সিনেমা', 'ব্র্যান্ড', 'গল্প', 'দৃষ্টিভঙ্গি', 'গতি'],
    heroSub: 'Cinematic brand videos, AI voiceover, and brand-first websites — delivered in 72 hours. Built for Bangladeshi brands ready to look world-class.',
    heroSub_bn: 'সিনেমাটিক ব্র্যান্ড ভিডিও, এআই ভয়েসওভার এবং ব্র্যান্ড-ফার্স্ট ওয়েবসাইট — ৭২ ঘণ্টায় ডেলিভারি। বিশ্বমানের দেখাতে চাওয়া বাংলাদেশি ব্র্যান্ডের জন্য।',
    heroVideoUrl: 'https://www.youtube.com/watch?v=y5N8uoFZLd0',
    facebook: 'https://facebook.com/aipgbd',
    youtube: 'https://youtube.com/@aipgbd',
    whatsapp: 'https://wa.me/8801XXXXXXXXX',
    email: 'hello@aipgbd.com',
    gaId: '',
  },
  stats: [
    { num: '30', unit: 's', label: 'Unbroken take',       label_bn: 'একটানা শট'        },
    { num: '72', unit: 'h', label: 'Delivery time',       label_bn: 'ডেলিভারি সময়'    },
    { num: '80', unit: '%', label: 'Cost vs traditional', label_bn: 'প্রচলিত খরচের তুলনায়' },
    { num: '5',  unit: '+', label: 'AI tools stacked',    label_bn: 'এআই টুল স্ট্যাক' },
  ],
  packages: [
    {
      id: 'spark', num: '01',
      title: 'The Spark',           title_bn: 'দ্য স্পার্ক',
      desc: 'One 30-second cinematic product or brand video with a custom AI-composed background score. Delivered in 48 hours.',
      desc_bn: 'একটি ৩০ সেকেন্ডের সিনেমাটিক প্রোডাক্ট বা ব্র্যান্ড ভিডিও, কাস্টম এআই-কম্পোজড ব্যাকগ্রাউন্ড স্কোর সহ। ৪৮ ঘণ্টায় ডেলিভারি।',
      price: '8,000', unit: 'BDT / video', accentVar: '--cyan', popular: false,
      features:    ['1 × 30s cinematic video', 'Custom Suno audio score', '48-hour delivery', 'Commercial rights included', '1 revision round'],
      features_bn: ['১ × ৩০ সেকেন্ড সিনেমাটিক ভিডিও', 'কাস্টম Suno অডিও স্কোর', '৪৮ ঘণ্টায় ডেলিভারি', 'বাণিজ্যিক স্বত্ব অন্তর্ভুক্ত', '১ রিভিশন রাউন্ড'],
    },
    {
      id: 'engine', num: '02',
      title: 'The Brand Engine',    title_bn: 'দ্য ব্র্যান্ড ইঞ্জিন',
      desc: 'Three cinematic videos, a 3-page portfolio website with looping video hero, full brand audio identity, and ElevenLabs AI voiceover.',
      desc_bn: 'তিনটি সিনেমাটিক ভিডিও, লুপিং ভিডিও হিরো সহ একটি ৩-পেজ পোর্টফোলিও ওয়েবসাইট, সম্পূর্ণ ব্র্যান্ড অডিও আইডেন্টিটি এবং ElevenLabs এআই ভয়েসওভার।',
      price: '25,000', unit: 'BDT / full kit', accentVar: '--purple', popular: true,
      features:    ['3 × 30s cinematic videos', '3-page website with video hero', 'Full brand audio identity', 'ElevenLabs AI voiceover Bangla + EN', '72-hour delivery', '2 revision rounds'],
      features_bn: ['৩ × ৩০ সেকেন্ড সিনেমাটিক ভিডিও', 'ভিডিও হিরো সহ ৩-পেজ ওয়েবসাইট', 'সম্পূর্ণ ব্র্যান্ড অডিও আইডেন্টিটি', 'ElevenLabs এআই ভয়েসওভার বাংলা + ইংরেজি', '৭২ ঘণ্টায় ডেলিভারি', '২ রিভিশন রাউন্ড'],
    },
    {
      id: 'retainer', num: '03',
      title: 'Agency Retainer',     title_bn: 'এজেন্সি রিটেইনার',
      desc: '8 cinematic videos per month, website maintenance, weekly content calendar, and dedicated ElevenLabs voice clone.',
      desc_bn: 'মাসে ৮টি সিনেমাটিক ভিডিও, ওয়েবসাইট রক্ষণাবেক্ষণ, সাপ্তাহিক কন্টেন্ট ক্যালেন্ডার এবং ডেডিকেটেড ElevenLabs ভয়েস ক্লোন।',
      price: '40,000', unit: 'BDT / month', accentVar: '--magenta', popular: false,
      features:    ['8 × cinematic videos monthly', 'Website maintenance', 'Weekly content calendar', 'Dedicated ElevenLabs voice clone', 'Priority delivery', 'Unlimited revisions', 'Dedicated WhatsApp line'],
      features_bn: ['মাসে ৮ × সিনেমাটিক ভিডিও', 'ওয়েবসাইট রক্ষণাবেক্ষণ', 'সাপ্তাহিক কন্টেন্ট ক্যালেন্ডার', 'ডেডিকেটেড ElevenLabs ভয়েস ক্লোন', 'অগ্রাধিকার ডেলিভারি', 'সীমাহীন রিভিশন', 'ডেডিকেটেড হোয়াটসঅ্যাপ লাইন'],
    },
    {
      id: 'webdev', num: '04',
      title: 'Web Presence',        title_bn: 'ওয়েব প্রেজেন্স',
      desc: 'A conversion-focused website built with modern React or WordPress — fast, mobile-perfect, and designed to turn visitors into clients.',
      desc_bn: 'আধুনিক React বা WordPress দিয়ে তৈরি কনভার্সন-ফোকাসড ওয়েবসাইট — দ্রুত, মোবাইল-পারফেক্ট এবং ভিজিটরদের ক্লায়েন্টে পরিণত করার জন্য ডিজাইন করা।',
      price: '15,000', unit: 'BDT / site', accentVar: '--green', popular: false,
      features:    ['Custom 3–5 page website', 'Mobile-first responsive design', 'SEO optimised structure', 'Contact form + WhatsApp integration', 'Google Analytics setup', 'Fast hosting guidance', '1 month free support'],
      features_bn: ['কাস্টম ৩–৫ পেজ ওয়েবসাইট', 'মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন', 'SEO অপটিমাইজড স্ট্রাকচার', 'কন্টাক্ট ফর্ম + হোয়াটসঅ্যাপ ইন্টিগ্রেশন', 'Google Analytics সেটআপ', 'দ্রুত হোস্টিং গাইডেন্স', '১ মাস বিনামূল্যে সাপোর্ট'],
    },
  ],
  process: [
    { tool: 'Gemini',     step: '01', title: 'Visual Anchor',    title_bn: 'ভিজ্যুয়াল অ্যাঙ্কর',   desc: 'Hyper-realistic base image. 8K. Arri Alexa colour grade. The foundation every frame is built on.',                       desc_bn: 'হাইপার-রিয়েলিস্টিক বেস ইমেজ। ৮K। আর্রি অ্যালেক্সা কালার গ্রেড। প্রতিটি ফ্রেমের ভিত্তি।',          color: 'var(--cyan)',    icon: '◈'   },
    { tool: 'Grok',       step: '02', title: 'Motion Extension', title_bn: 'মোশন এক্সটেনশন',       desc: 'The anchor image animates into 30 seconds of sustained cinematic motion. 24fps. No cuts.',                                  desc_bn: 'অ্যাঙ্কর ইমেজটি ৩০ সেকেন্ডের ধারাবাহিক সিনেমাটিক মোশনে পরিণত হয়। ২৪fps। কোনো কাট নেই।',         color: 'var(--purple)',  icon: '⬡'   },
    { tool: 'Suno',       step: '03', title: 'Original Score',   title_bn: 'অরিজিনাল স্কোর',       desc: "A custom brand audio track composed to match your visual's exact tempo and emotional register.",                            desc_bn: 'আপনার ভিজ্যুয়ালের সঠিক টেম্পো এবং আবেগীয় রেজিস্টারের সাথে মিলিয়ে কম্পোজ করা কাস্টম ব্র্যান্ড অডিও ট্র্যাক।', color: 'var(--magenta)', icon: '♫'   },
    { tool: 'ElevenLabs', step: '04', title: 'AI Voiceover',     title_bn: 'এআই ভয়েসওভার',        desc: 'Studio-grade AI narration in Bangla and English. Your brand voice — multilingual, flawless, on-demand.',                   desc_bn: 'বাংলা ও ইংরেজিতে স্টুডিও-মানের এআই ন্যারেশন। আপনার ব্র্যান্ড ভয়েস — বহুভাষিক, নিখুঁত, অন-ডিমান্ড।',      color: 'var(--green)',   icon: '⟨⟩' },
    { tool: 'Claude',     step: '05', title: 'Direction + Code', title_bn: 'ডিরেকশন + কোড',       desc: 'Creative scripting, prompt engineering, and website development. The intelligence connecting every tool.',                   desc_bn: 'ক্রিয়েটিভ স্ক্রিপ্টিং, প্রম্পট ইঞ্জিনিয়ারিং এবং ওয়েবসাইট ডেভেলপমেন্ট। প্রতিটি টুলকে সংযুক্তকারী বুদ্ধিমত্তা।', color: 'var(--cyan)',    icon: '✦'   },
  ],
  niches: [
    { icon: '🏢', title: 'Real Estate',        title_bn: 'রিয়েল এস্টেট',         pain: "Developers paying 1.5L BDT on a single shoot to sell apartments that don't exist yet.", pain_bn: 'ডেভেলপাররা এখনো নির্মিত হয়নি এমন অ্যাপার্টমেন্ট বিক্রির জন্য একটি শুটে ১.৫ লাখ টাকা খরচ করছেন।', roi: 'Cinematic pre-sale tours from a render. 25K vs 1.5L BDT.', roi_bn: 'রেন্ডার থেকে সিনেমাটিক প্রি-সেল ট্যুর। ২৫K বনাম ১.৫L টাকা।', tag: 'High ROI', tagColor: 'cyan' },
    { icon: '⚡', title: 'Fintech + Startups', title_bn: 'ফিনটেক + স্টার্টআপ',   pain: 'Founders needing investor-grade brand identity in days, not months.',                     pain_bn: 'ফাউন্ডারদের মাসের নয়, দিনের মধ্যে বিনিয়োগকারী-মানের ব্র্যান্ড আইডেন্টিটি প্রয়োজন।',             roi: 'Full brand kit in 72 hours. Investor-ready by Friday.',    roi_bn: '৭২ ঘণ্টায় সম্পূর্ণ ব্র্যান্ড কিট। শুক্রবারের মধ্যে বিনিয়োগকারী-প্রস্তুত।', tag: 'Fast Track', tagColor: 'purple' },
    { icon: '✦', title: 'Luxury E-commerce',  title_bn: 'লাক্সারি ই-কমার্স',    pain: 'Fashion brands losing sales because their video content looks like a phone recording.',   pain_bn: 'ফ্যাশন ব্র্যান্ডগুলো বিক্রি হারাচ্ছে কারণ তাদের ভিডিও কন্টেন্ট ফোনে তোলা ভিডিওর মতো দেখায়।',       roi: 'International-grade product cinema at local prices.',      roi_bn: 'স্থানীয় মূল্যে আন্তর্জাতিক মানের প্রোডাক্ট সিনেমা।', tag: 'Premium', tagColor: 'magenta' },
    { icon: '🍽', title: 'F+B / Restaurants', title_bn: 'খাবার ও রেস্তোরাঁ',    pain: 'Premium restaurants needing 8 content pieces monthly but one crew shoot costs the entire ad budget.', pain_bn: 'প্রিমিয়াম রেস্তোরাঁগুলোর মাসে ৮টি কন্টেন্ট পিস দরকার কিন্তু একটি ক্রু শুটে পুরো বিজ্ঞাপন বাজেট শেষ হয়ে যায়।', roi: '8 cinematic videos monthly at 15K BDT retainer.', roi_bn: '১৫K রিটেইনারে মাসে ৮টি সিনেমাটিক ভিডিও।', tag: 'Volume', tagColor: 'cyan' },
    { icon: '◈', title: 'SME Brand Launch',   title_bn: 'এসএমই ব্র্যান্ড লঞ্চ', pain: 'Newly formalized businesses needing to look legitimate fast without the agency queue.',   pain_bn: 'নতুনভাবে আনুষ্ঠানিক হওয়া ব্যবসাগুলোর এজেন্সির লাইন ছাড়াই দ্রুত বৈধ দেখাতে হবে।',                  roi: 'Website + video + audio identity in one package.',         roi_bn: 'একটি প্যাকেজে ওয়েবসাইট + ভিডিও + অডিও আইডেন্টিটি।', tag: 'All-in-one', tagColor: 'purple' },
    { icon: '⬡', title: 'Virtual Influencers',title_bn: 'ভার্চুয়াল ইনফ্লুয়েন্সার', pain: "Brands needing a permanent AI face that never ages, never has scandals.", pain_bn: 'ব্র্যান্ডগুলোর একটি স্থায়ী এআই মুখ দরকার যা কখনো বয়স পায় না, কখনো কেলেঙ্কারি হয় না।', roi: 'Character bible: 50 images + 5 clips. 25K BDT.', roi_bn: 'ক্যারেক্টার বাইবেল: ৫০টি ছবি + ৫টি ক্লিপ। ২৫K টাকা।', tag: 'New Era', tagColor: 'magenta' },
    { icon: '🌐', title: 'Web Development',   title_bn: 'ওয়েব ডেভেলপমেন্ট',    pain: "Businesses losing clients every day because their website looks outdated.", pain_bn: 'ব্যবসাগুলো প্রতিদিন ক্লায়েন্ট হারাচ্ছে কারণ তাদের ওয়েবসাইট পুরানো দেখায়।', roi: 'Professional website live in 7 days. From 15K BDT.', roi_bn: '৭ দিনে পেশাদার ওয়েবসাইট লাইভ। ১৫K টাকা থেকে শুরু।', tag: 'Essential', tagColor: 'green' },
  ],
  faqs: [
    { q: 'Can I legally use the content you produce?',           q_bn: 'আপনারা যে কন্টেন্ট তৈরি করেন তা কি আমি আইনগতভাবে ব্যবহার করতে পারব?',          a: 'Yes. All work is delivered with full commercial rights. Our Suno, Grok, Gemini, and ElevenLabs accounts run on paid commercial tiers so your brand owns everything.',            a_bn: 'হ্যাঁ। সমস্ত কাজ সম্পূর্ণ বাণিজ্যিক অধিকার সহ ডেলিভার করা হয়। আমাদের Suno, Grok, Gemini এবং ElevenLabs অ্যাকাউন্ট পেইড কমার্শিয়াল টায়ারে চলে তাই আপনার ব্র্যান্ড সবকিছুর মালিক।' },
    { q: 'What is ElevenLabs voiceover and why does it matter?', q_bn: 'ElevenLabs ভয়েসওভার কী এবং এটি কেন গুরুত্বপূর্ণ?',                              a: 'ElevenLabs generates studio-grade AI narration in any voice, language, and tone including Bangla.',                                                                               a_bn: 'ElevenLabs বাংলা সহ যেকোনো ভয়েস, ভাষা এবং টোনে স্টুডিও-মানের এআই ন্যারেশন তৈরি করে। আমরা আপনার ব্র্যান্ডের জন্য একটি কাস্টম ভয়েস ক্লোন তৈরি করতে পারি।' },
    { q: 'Is this AI or did a real designer make it?',           q_bn: 'এটা কি এআই নাকি একজন রিয়েল ডিজাইনার তৈরি করেছেন?',                             a: 'Both. AI-engineered production, human-directed vision. The tools generate and we direct, compose, and refine.',                                                                    a_bn: 'দুটোই। এআই-ইঞ্জিনিয়ার্ড প্রোডাকশন, মানব-পরিচালিত দৃষ্টিভঙ্গি। টুলগুলো তৈরি করে এবং আমরা পরিচালনা, কম্পোজ এবং পরিমার্জন করি।' },
    { q: "What if I don't like the result?",                     q_bn: 'যদি আমি ফলাফল পছন্দ না করি?',                                                     a: "Every package includes at least one free revision round. We've never had a client not proceed to final delivery.",                                                              a_bn: 'প্রতিটি প্যাকেজে কমপক্ষে একটি বিনামূল্যে রিভিশন রাউন্ড অন্তর্ভুক্ত। আমাদের কখনো এমন ক্লায়েন্ট হয়নি যিনি চূড়ান্ত ডেলিভারিতে এগোননি।' },
    { q: 'How do I pay?',                                        q_bn: 'আমি কীভাবে পেমেন্ট করব?',                                                          a: 'bKash, Nagad, or bank transfer. 50% deposit to begin, 50% on delivery.',                                                                                                       a_bn: 'bKash, Nagad বা ব্যাংক ট্রান্সফার। শুরু করতে ৫০% ডিপোজিট, ডেলিভারিতে ৫০%।' },
    { q: 'Do you work with brands outside Dhaka?',               q_bn: 'আপনারা কি ঢাকার বাইরের ব্র্যান্ডের সাথে কাজ করেন?',                              a: 'Yes. We work remotely with brands across Bangladesh.',                                                                                                                         a_bn: 'হ্যাঁ। আমরা বাংলাদেশজুড়ে ব্র্যান্ডের সাথে রিমোটলি কাজ করি।' },
    { q: 'What does your web development service include?',      q_bn: 'আপনাদের ওয়েব ডেভেলপমেন্ট সেবায় কী অন্তর্ভুক্ত?',                              a: 'We build custom 3–5 page websites using React or WordPress — mobile-first, SEO-optimised, with contact form, WhatsApp button, Google Analytics, and 1 month free support.',    a_bn: 'আমরা React বা WordPress ব্যবহার করে কাস্টম ৩–৫ পেজ ওয়েবসাইট তৈরি করি — মোবাইল-ফার্স্ট, SEO-অপটিমাইজড, কন্টাক্ট ফর্ম, হোয়াটসঅ্যাপ বাটন, Google Analytics এবং ১ মাস বিনামূল্যে সাপোর্ট সহ।' },
    { q: 'Can I get a website AND video content together?',      q_bn: 'আমি কি একসাথে একটি ওয়েবসাইট এবং ভিডিও কন্টেন্ট পেতে পারি?',                q_bn: 'আমি কি একসাথে ওয়েবসাইট ও ভিডিও কন্টেন্ট পেতে পারি?', a: "Absolutely — that's our most popular combination. The Brand Engine package includes both.",                                                                                    a_bn: 'অবশ্যই — এটি আমাদের সবচেয়ে জনপ্রিয় কম্বিনেশন। Brand Engine প্যাকেজে দুটোই অন্তর্ভুক্ত।' },
  ],
  adminPin: 'aipgbd2025',
  portfolio: [
    { title: 'Real Estate Reveal',  client: 'Bashundhara Homes',   category: 'Real Estate',   desc: 'Cinematic pre-sale tour from architectural renders.',        videoUrl: '', thumbnail: '' },
    { title: 'Brand Launch Film',   client: 'Dhaka Fintech Co.',   category: 'Brand Video',   desc: 'Investor-grade brand identity video delivered in 72 hours.', videoUrl: '', thumbnail: '' },
    { title: 'Product Cinema',      client: 'Luxury Label BD',     category: 'Product Video', desc: 'International-grade product visuals at local prices.',        videoUrl: '', thumbnail: '' },
    { title: 'Restaurant Reel',     client: 'The Rooftop Kitchen', category: 'Restaurant',    desc: '8 cinematic content pieces for monthly social media.',        videoUrl: '', thumbnail: '' },
  ],

  chatbot: {
    enabled: true,
    botName: 'AIPGBD Assistant',
    greeting: "Hi! I'm the AIPGBD Assistant. I can help with services, pricing, and getting started. What would you like to know?",
    greeting_bn: 'হ্যালো! আমি AIPGBD অ্যাসিস্ট্যান্ট। সেবা, মূল্য এবং শুরু করার বিষয়ে সাহায্য করতে পারি। কী জানতে চান?',
    knowledgeBase: '',
    qaList: [
      { q: 'How much does a video cost?', a: 'Our Spark package starts at 8,000 BDT for a 30-second cinematic video delivered in 48 hours.' },
      { q: 'How long does delivery take?', a: 'We deliver in 48-72 hours depending on the package. The Spark takes 48h, Brand Engine takes 72h.' },
      { q: 'Do you work outside Dhaka?', a: 'Yes! We work remotely with brands across all of Bangladesh. No physical shoot required.' },
      { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, and bank transfer. 50% deposit to start, 50% on delivery.' },
      { q: 'কত টাকা লাগবে?', a: 'আমাদের স্পার্ক প্যাকেজ শুরু হয় ৮,০০০ টাকা থেকে — একটি ৩০ সেকেন্ডের সিনেমাটিক ভিডিও ৪৮ ঘণ্টায়।' },
    ],
  },
  testimonials: [
    { name: 'Rahim Chowdhury',  role: 'CEO',                company: 'Bashundhara Properties', quote: 'We used to spend 1.5 lakh BDT on a single property shoot. AIPGBD delivered a better result for 25,000 BDT in three days. Our pre-sale inquiries doubled.', quote_bn: 'আমরা একটি প্রপার্টি শুটে ১.৫ লাখ টাকা খরচ করতাম। AIPGBD তিন দিনে ২৫,০০০ টাকায় আরও ভালো ফলাফল ডেলিভার করেছে। আমাদের প্রি-সেল অনুসন্ধান দ্বিগুণ হয়েছে।', result: '2× pre-sale inquiries', result_bn: 'প্রি-সেল অনুসন্ধান ২গুণ', stars: 5 },
    { name: 'Nadia Islam',      role: 'Founder',             company: 'Dhaka Fintech Co.',     quote: 'We needed investor-grade brand materials before a funding round. AIPGBD delivered our full video kit, website, and voiceover in 72 hours.', quote_bn: 'ফান্ডিং রাউন্ডের আগে আমাদের বিনিয়োগকারী-মানের ব্র্যান্ড উপকরণ দরকার ছিল। AIPGBD ৭২ ঘণ্টায় আমাদের সম্পূর্ণ ভিডিও কিট, ওয়েবসাইট এবং ভয়েসওভার ডেলিভার করেছে।', result: 'Secured seed funding', result_bn: 'সিড ফান্ডিং পেয়েছি', stars: 5 },
    { name: 'Karim Hassan',     role: 'Marketing Director',  company: 'Luxury Label BD',       quote: 'Our product videos finally look like they belong on international platforms. The quality difference from our old content is night and day.', quote_bn: 'আমাদের প্রোডাক্ট ভিডিওগুলো অবশেষে আন্তর্জাতিক প্ল্যাটফর্মে মানানসই দেখাচ্ছে। আগের কন্টেন্ট থেকে মানের পার্থক্য আকাশ-পাতাল।', result: '40% more page time', result_bn: 'পেজ টাইম ৪০% বেশি', stars: 5 },
  ],
};

// ── Deep merge helper ────────────────────────────────────────────────────────
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// Deep merge: recursively merge objects, arrays are replaced (not concatenated)
function deepMerge(defaults, saved) {
  const result = deepClone(defaults);
  if (!saved || typeof saved !== 'object') return result;
  Object.keys(saved).forEach(key => {
    if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key]) && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
      // Both are plain objects — recurse
      result[key] = deepMerge(defaults[key] || {}, saved[key]);
    } else {
      // Primitive, array, or one side is not an object — saved wins
      result[key] = saved[key];
    }
  });
  return result;
}

// ── Config CRUD ──────────────────────────────────────────────────────────────
export function getConfig() {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return deepMerge(DEFAULT_CONFIG, saved);
    }
  } catch (e) { console.warn('Config load error', e); }
  return deepClone(DEFAULT_CONFIG);
}

export function saveConfig(config) {
  try { localStorage.setItem(CFG_KEY, JSON.stringify(config)); return true; }
  catch (e) { console.error('Config save error', e); return false; }
}

export function resetConfig() {
  try { localStorage.removeItem(CFG_KEY); } catch {}
  return deepClone(DEFAULT_CONFIG);
}

// ── Inquiries DB ─────────────────────────────────────────────────────────────
function getDB() {
  try { const raw = localStorage.getItem(DB_KEY); if (raw) return JSON.parse(raw); } catch {}
  return { inquiries: [], views: 0 };
}
function saveDB(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {} }

export function trackPageView() {
  const db = getDB(); db.views = (db.views || 0) + 1; saveDB(db); return db.views;
}

export function saveInquiry(data) {
  const db = getDB();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const id = 'INQ-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const record = { id, ...data, status: 'new', createdAt: new Date().toISOString() };
  db.inquiries = [record, ...(db.inquiries || [])]; saveDB(db); return record;
}

export function getInquiries() { return getDB().inquiries || []; }

export function updateInquiryStatus(id, status) {
  const db = getDB(); db.inquiries = db.inquiries.map(i => i.id === id ? { ...i, status } : i); saveDB(db);
}

export function addInquiryNote(id, note) {
  const db = getDB(); db.inquiries = db.inquiries.map(i => i.id === id ? { ...i, note } : i); saveDB(db);
}

export function deleteInquiry(id) {
  const db = getDB(); db.inquiries = db.inquiries.filter(i => i.id !== id); saveDB(db);
}

export function getStats() {
  const db = getDB(); const i = db.inquiries || [];
  return { total: i.length, new: i.filter(x => x.status === 'new').length, inProgress: i.filter(x => x.status === 'in-progress').length, closed: i.filter(x => x.status === 'closed').length, views: db.views || 0 };
}
