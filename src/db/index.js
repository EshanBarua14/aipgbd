/* ─────────────────────────────────────────────
   AIPGBD — Central Database
   Single source of truth. Everything on the site
   reads from here. Admin panel writes here.
   Persisted in localStorage. Deep-merge on load.
───────────────────────────────────────────── */

export const DB_KEY = 'aipgbd_db_v1';
export const INQUIRIES_KEY = 'aipgbd_inquiries_v1';
export const ADMIN_PIN_KEY = 'aipgbd_admin_pin';

/* ── DEFAULT SITE DATA ── */
export const DEFAULT_DB = {
  site: {
    name: 'AI Playground BD',
    tagline: 'Cinematic AI Production',
    email: 'hello@aipgbd.com',
    whatsapp: 'https://wa.me/8801XXXXXXXXX',
    facebook: 'https://facebook.com/aipgbd',
    youtube: 'https://youtube.com/@aipgbd',
    instagram: '',
    logoUrl: '/logo.png',
    heroVideoId: 'y5N8uoFZLd0',
    heroTitle: 'We create Cinema. AI-engineered.',
    heroSubtitle: '30-second unbroken cinematic shots from a single image — using Gemini, Grok, Suno, ElevenLabs & Claude. The production gap between ৳1,80,000 and ৳25,000 is our business.',
    heroWords: ['Cinema.', 'Brands.', 'Stories.', 'Vision.', 'Impact.'],
    ctaPrimary: 'See Our Work',
    ctaSecondary: 'Start a Project',
  },

  stats: [
    { num: '30', unit: 's', label: 'Unbroken cinematic take' },
    { num: '72', unit: 'h', label: 'Brief to delivery' },
    { num: '80', unit: '%', label: 'Less than traditional' },
    { num: '5', unit: 'x', label: 'Production stack depth' },
  ],

  tools: [
    { id: 'gemini', name: 'Gemini', step: '01', color: '#4285F4', title: 'Visual Anchor', desc: 'Hyper-realistic base image. 8K resolution. Arri Alexa colour grade.', detail: 'We craft precise visual anchors using cinematic lighting language — Rembrandt ratios, anamorphic bokeh, atmospheric haze.' },
    { id: 'grok', name: 'Grok', step: '02', color: '#00C2FF', title: 'Motion Extension', desc: 'The anchor animates into 30 unbroken seconds. 24fps. No cuts.', detail: 'Using the anchor-and-extend method, we keyframe-bridge scenes to maintain absolute visual consistency across the full duration.' },
    { id: 'suno', name: 'Suno', step: '03', color: '#FF6B35', title: 'Original Score', desc: 'A custom brand audio track composed to match your visuals.', detail: 'Every score is mastered to broadcast standards. We specify BPM, instrumentation, and emotional arc to match your brand voice.' },
    { id: 'elevenlabs', name: 'ElevenLabs', step: '04', color: '#A855F7', title: 'Brand Voiceover', desc: 'Professional AI voiceover in any language. Clone your own voice.', detail: 'We engineer the perfect voice profile — warm, authoritative, or aspirational. Full Bangla, English, and multilingual support.' },
    { id: 'claude', name: 'Claude', step: '05', color: '#D4A853', title: 'Direction & Code', desc: 'Creative direction, prompt engineering, and website development.', detail: 'Every project begins with a Claude-generated creative brief before a single tool is activated.' },
  ],

  packages: [
    {
      id: 'spark', num: '01', title: 'The Spark', popular: false,
      price: '8,000', currency: 'BDT', unit: 'per video',
      desc: 'One 30-second cinematic product or brand video with a custom AI-composed background score and professional voiceover.',
      features: ['1 × 30s cinematic video', 'Custom Suno audio score', 'ElevenLabs voiceover (30s)', '48-hour delivery', 'Commercial rights included', '1 revision round'],
    },
    {
      id: 'engine', num: '02', title: 'The Brand Engine', popular: true,
      price: '25,000', currency: 'BDT', unit: 'full kit',
      desc: 'Three cinematic videos, a portfolio website with video hero, full brand audio identity, and voiceover narration across all assets.',
      features: ['3 × 30s cinematic videos', '3-page website with video hero', 'Full brand audio identity', 'ElevenLabs brand voice (cloned)', '72-hour delivery', 'Commercial rights included', '2 revision rounds'],
    },
    {
      id: 'retainer', num: '03', title: 'Agency Retainer', popular: false,
      price: '40,000', currency: 'BDT', unit: '/ month',
      desc: '8 cinematic videos per month, website maintenance, weekly content calendar, and dedicated voiceover in your brand voice.',
      features: ['8 × cinematic videos monthly', 'Website maintenance', 'Weekly content calendar', 'ElevenLabs voice — unlimited', 'Priority 24h delivery', 'Unlimited revisions', 'Dedicated WhatsApp line'],
    },
    {
      id: 'web', num: '04', title: 'Web Presence', popular: false,
      price: '15,000', currency: 'BDT', unit: 'per site',
      desc: 'Custom website with video hero, mobile-first responsive design, SEO optimized structure, and contact form integration.',
      features: ['3–5 page custom website', 'Mobile-first responsive design', 'SEO optimized structure', 'Contact form + WhatsApp integration', 'Google Analytics setup', '1 month free support'],
    },
  ],

  industries: [
    { id: 'realestate', icon: '🏢', title: 'Real Estate', pain: 'Spending 1.5L BDT on a single shoot to sell apartments that do not exist yet.', roi: 'Cinematic pre-sale tours from renders. 25K vs 1.5L BDT.' },
    { id: 'fintech', icon: '⚡', title: 'Fintech & Startups', pain: 'Founders needing investor-grade brand identity in days, not months.', roi: 'Full brand kit in 72 hours. Investor-ready by Friday.' },
    { id: 'ecommerce', icon: '✦', title: 'Luxury E-commerce', pain: 'Fashion brands losing sales because their video content looks like a phone recording.', roi: 'International-grade product cinema at local prices.' },
    { id: 'fnb', icon: '🍽', title: 'F&B Restaurants', pain: 'Premium restaurants needing 8 content pieces monthly but one shoot costs the entire ad budget.', roi: '8 cinematic videos monthly at 15K BDT retainer.' },
    { id: 'sme', icon: '◈', title: 'SME Brand Launch', pain: 'Newly formalized businesses needing to look legitimate fast.', roi: 'Website, video, and audio identity in one 72-hour package.' },
    { id: 'webdev', icon: '💻', title: 'Web Development', pain: 'Businesses needing a premium digital presence but stuck with slow agencies and high prices.', roi: 'Custom website live in 72 hours. 15K BDT all-in.' },
  ],

  portfolio: [
    { id: 'p1', title: 'NEXARA Fintech', client: 'NEXARA', category: 'Fintech', youtubeId: '', desc: 'Brand film for a fictional luxury fintech brand. 30-second unbroken cinematic take.', color: '#00E5FF' },
    { id: 'p2', title: 'Luxury Interior', client: 'Private Developer', category: 'Real Estate', youtubeId: '', desc: 'Pre-sale property tour generated from architectural renders.', color: '#9B59FF' },
    { id: 'p3', title: 'Crystal Collection', client: 'Fashion Brand', category: 'E-commerce', youtubeId: '', desc: 'Product launch cinematic sequence.', color: '#E040FB' },
    { id: 'p4', title: 'Ember Kitchen', client: 'Restaurant', category: 'F&B', youtubeId: '', desc: 'Monthly content reel. 8 cinematic food videos.', color: '#FF6B35' },
  ],

  faqs: [
    { id: 'f1', q: 'Can I legally use the content you produce?', a: 'Yes. All work is delivered with full commercial rights. Our Suno, Grok, Gemini, and ElevenLabs accounts run on paid commercial tiers so your brand owns everything we create.' },
    { id: 'f2', q: 'Is this actually AI or did a real designer make it?', a: 'Both. AI-engineered production, human-directed vision. The tools generate — we direct, compose, and refine. Your taste and our direction are the product.' },
    { id: 'f3', q: 'What if I do not like the result?', a: 'Every package includes at least one free revision round. The revision guarantee means you take zero risk on the first engagement.' },
    { id: 'f4', q: 'How do I pay?', a: 'bKash, Nagad, or bank transfer. 50% deposit to begin, 50% on delivery. We will never ask for full payment before you have approved the work.' },
    { id: 'f5', q: 'How long does it actually take?', a: 'The Spark: 48 hours. The Brand Engine: 72 hours. The Retainer: weekly content calendar agreed at the start of each month.' },
    { id: 'f6', q: 'Can you produce voiceover in Bangla?', a: 'Yes. ElevenLabs supports full Bangla voiceover with natural intonation. Multilingual Bangla + English versions available.' },
    { id: 'f7', q: 'What does the Web Presence package include?', a: 'A 3–5 page custom website with video hero, mobile-first responsive design, SEO optimization, contact form, WhatsApp integration, Google Analytics, and 1 month of free support.' },
    { id: 'f8', q: 'Do you work with brands outside Dhaka?', a: 'Yes. We work remotely across Bangladesh. For real estate, all we need are your architectural renders. No physical access required.' },
  ],

  testimonials: [
    { id: 't1', name: 'Rahman Ahmed', role: 'Marketing Director', company: 'Bashundhara Properties', quote: 'We replaced a ৳1,80,000 shoot with a ৳25,000 AI cinema package. The quality was indistinguishable and our lead conversions went up 40%.', stars: 5, result: '+40% leads' },
    { id: 't2', name: 'Nadia Islam', role: 'Founder', company: 'Finethread Fashion', quote: 'Delivered our full brand video and website in 68 hours. Our competitors have been using the same shoot footage for 2 years — we refresh monthly.', stars: 5, result: '68h delivery' },
    { id: 't3', name: 'Karim Hossain', role: 'CEO', company: 'PayNow Fintech', quote: 'The ElevenLabs voice clone for our brand is uncanny. It sounds exactly like our founder and we use it across every video, ad, and IVR system.', stars: 5, result: 'Voice cloned' },
  ],

  social: {
    showFacebookFeed: false,
    showYoutubeFeed: false,
  },
};

/* ── DEEP MERGE ── */
function deepMerge(defaults, saved) {
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
    if (
      saved[key] !== null &&
      typeof saved[key] === 'object' &&
      !Array.isArray(saved[key]) &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = deepMerge(defaults[key] || {}, saved[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

/* ── PUBLIC API ── */
export function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DB));
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DB)), JSON.parse(raw));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

export function saveDB(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function resetDB() {
  localStorage.removeItem(DB_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

/* ── INQUIRIES ── */
export function getInquiries() {
  try {
    return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]');
  } catch { return []; }
}

export function saveInquiry(entry) {
  try {
    const list = getInquiries();
    list.unshift({ ...entry, id: Date.now(), createdAt: new Date().toISOString(), status: 'new', notes: '' });
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
    return true;
  } catch { return false; }
}

export function updateInquiry(id, changes) {
  try {
    const list = getInquiries().map(i => i.id === id ? { ...i, ...changes } : i);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
    return true;
  } catch { return false; }
}

export function deleteInquiry(id) {
  try {
    const list = getInquiries().filter(i => i.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
    return true;
  } catch { return false; }
}

/* ── ADMIN PIN ── */
export function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
}

export function setAdminPin(pin) {
  localStorage.setItem(ADMIN_PIN_KEY, pin);
}
