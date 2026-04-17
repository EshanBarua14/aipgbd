import { useState, useEffect, useRef } from 'react';
import { useLang } from '../i18n/LangContext';

// ─── Default knowledge base built from site content ────────────────────────
const DEFAULT_KB = `
You are the AI assistant for AIPGBD — a cinematic AI production studio based in Dhaka, Bangladesh.
You help potential clients understand our services, pricing, and process.
Always be friendly, professional, and concise. Keep responses under 3 sentences unless asked for detail.
If someone wants to get started or book a consultation, always end with offering to connect on WhatsApp.

SERVICES & PRICING:
- The Spark: 1 × 30s cinematic video + Suno audio score. 8,000 BDT. Delivered in 48 hours.
- The Brand Engine: 3 videos + website + audio identity + ElevenLabs voiceover. 25,000 BDT. 72 hours.
- Agency Retainer: 8 videos/month + website maintenance + content calendar + voice clone. 40,000 BDT/month.
- Web Presence: Custom 3-5 page website, SEO, mobile-first, WhatsApp integration. 15,000 BDT.

AI STACK:
- Gemini: hyper-realistic 8K base images
- Grok: 30-second cinematic motion animation
- Suno: original AI-composed audio scores
- ElevenLabs: studio-grade Bangla + English voiceover
- Claude: creative direction, scripting, website development

KEY FACTS:
- Based in Dhaka, Bangladesh
- Deliver in 72 hours or less
- 80% cheaper than traditional agencies
- Commercial rights included with all packages
- Payment via bKash, Nagad, or bank transfer (50% deposit, 50% on delivery)
- Work with brands across all of Bangladesh remotely
- Serve: Real Estate, Fintech, E-commerce, Restaurants, SMEs, Virtual Influencers, Web Development

CONTACT:
- WhatsApp: WHATSAPP_URL
- Email: EMAIL
`;

// ─── Message bubble ────────────────────────────────────────────────────────
function Message({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <div style={{
      display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end',
      marginBottom: '0.75rem', animation: 'fadeIn 0.2s',
    }}>
      {isBot && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0, marginRight: '0.5rem', marginTop: '0.1rem' }}>
          🤖
        </div>
      )}
      <div style={{
        maxWidth: '78%', padding: '0.65rem 0.9rem',
        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        background: isBot ? 'var(--surface)' : 'linear-gradient(135deg,var(--cyan),var(--purple))',
        color: isBot ? 'var(--text-0)' : '#fff',
        fontSize: '0.85rem', lineHeight: 1.6,
        border: isBot ? '1px solid var(--border)' : 'none',
        boxShadow: isBot ? 'none' : '0 2px 12px rgba(0,229,255,0.3)',
      }}>
        {msg.content}
        {msg.actions && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {msg.actions.map((a, i) => (
              <a key={i} href={a.href} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4em 0.8em', borderRadius: '100px', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)' }}>
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lead collection flow ──────────────────────────────────────────────────
function LeadForm({ onSubmit, lang }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', phone: '', brief: '' });
  const [val, setVal] = useState('');

  const steps = lang === 'bn'
    ? ['আপনার নাম কি?', 'আপনার হোয়াটসঅ্যাপ নম্বর?', 'আপনার প্রজেক্ট সম্পর্কে বলুন']
    : ["What's your name?", "Your WhatsApp number?", "Tell us about your project briefly"];

  const keys = ['name', 'phone', 'brief'];

  const handleSubmit = () => {
    if (!val.trim()) return;
    const updated = { ...data, [keys[step]]: val.trim() };
    setData(updated);
    setVal('');
    if (step < 2) { setStep(step + 1); }
    else { onSubmit(updated); }
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
        {step + 1}/3 — {steps[step]}
      </p>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <input
          className="input" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={lang === 'bn' ? 'এখানে লিখুন...' : 'Type here...'}
          style={{ flex: 1, fontSize: '0.82rem', padding: '0.5em 0.8em' }}
          autoFocus
        />
        <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '0.5em 0.9em', fontSize: '0.8rem', flexShrink: 0 }}>→</button>
      </div>
    </div>
  );
}

// ─── Main Chatbot ──────────────────────────────────────────────────────────
export default function Chatbot({ cfg }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectingLead, setCollectingLead] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const chatConfig = cfg.chatbot || {};
  const knowledgeBase = chatConfig.knowledgeBase || DEFAULT_KB
    .replace('WHATSAPP_URL', cfg.site?.whatsapp || '')
    .replace('EMAIL', cfg.site?.email || '');
  const qaList = chatConfig.qaList || [];
  const botName = chatConfig.botName || 'AIPGBD Assistant';
  const greeting = lang === 'bn'
    ? (chatConfig.greeting_bn || `হ্যালো! আমি ${botName}। আমি AIPGBD-এর সেবা, মূল্য এবং প্রক্রিয়া সম্পর্কে সাহায্য করতে পারি। কী জানতে চান?`)
    : (chatConfig.greeting || `Hi! I'm ${botName}. I can help you with AIPGBD's services, pricing, and process. What would you like to know?`);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(), role: 'assistant', content: greeting,
        actions: [
          { label: lang === 'bn' ? '💬 হোয়াটসঅ্যাপে কথা বলুন' : '💬 Chat on WhatsApp', href: cfg.site?.whatsapp || '#' },
        ]
      }]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => { if (!open) setUnread(1); }, 8000);
    return () => clearTimeout(t);
  }, []);

  const buildSystemPrompt = () => {
    let system = knowledgeBase;
    if (qaList.length > 0) {
      system += '\n\nFREQUENTLY ASKED QUESTIONS:\n';
      qaList.forEach(qa => { system += `Q: ${qa.q}\nA: ${qa.a}\n\n`; });
    }
    if (lang === 'bn') {
      system += '\n\nIMPORTANT: The user is communicating in Bangla. Reply in Bangla. Use friendly Bangla tone.';
    }
    system += '\n\nIf the user wants to book, get started, or needs a consultation, suggest they share their details and offer to connect on WhatsApp.';
    return system;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const bookKeywords = ['book', 'start', 'get started', 'consultation', 'contact', 'শুরু', 'বুক', 'যোগাযোগ', 'প্রজেক্ট'];
    if (bookKeywords.some(k => text.toLowerCase().includes(k))) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(), role: 'assistant',
          content: lang === 'bn'
            ? 'দারুণ! আমি আপনার বিষয়ে কিছু তথ্য নিতে পারি যাতে আমরা হোয়াটসঅ্যাপে সংযোগ করতে পারি।'
            : "Great! Let me collect a few details so we can connect you with our team on WhatsApp.",
        }]);
        setLoading(false);
        setCollectingLead(true);
      }, 600);
      return;
    }

    try {
      // Build Gemini-format conversation history
      const history = newMessages.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: buildSystemPrompt() }] },
            contents: history,
          }),
        }
      );

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        || (lang === 'bn' ? 'দুঃখিত, উত্তর দিতে পারছি না।' : 'Sorry, I could not get a response.');

      const botMsg = { id: Date.now() + 1, role: 'assistant', content: reply };
      if (reply.toLowerCase().includes('whatsapp') || reply.toLowerCase().includes('contact')) {
        botMsg.actions = [{ label: '📱 Open WhatsApp', href: cfg.site?.whatsapp || '#' }];
      }
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: lang === 'bn' ? 'দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে হোয়াটসঅ্যাপে যোগাযোগ করুন।' : 'Sorry, something went wrong. Please contact us on WhatsApp.',
        actions: [{ label: '📱 WhatsApp', href: cfg.site?.whatsapp || '#' }],
      }]);
    }
    setLoading(false);
  };

  const handleLeadSubmit = (leadData) => {
    setCollectingLead(false);
    const msg = `Hi AIPGBD! I'm ${leadData.name}.\n\nProject: ${leadData.brief}\n\nMy WhatsApp: ${leadData.phone}`;
    setMessages(prev => [...prev, {
      id: Date.now(), role: 'assistant',
      content: lang === 'bn'
        ? `ধন্যবাদ ${leadData.name}! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। হোয়াটসঅ্যাপে সরাসরি কথা বলতে নিচের বাটনে ক্লিক করুন।`
        : `Thanks ${leadData.name}! We'll be in touch soon. Click below to chat directly on WhatsApp.`,
      actions: [{
        label: lang === 'bn' ? '📱 হোয়াটসঅ্যাপে খুলুন' : '📱 Open WhatsApp',
        href: `${cfg.site?.whatsapp}?text=${encodeURIComponent(msg)}`,
      }],
    }]);
  };

  const quickReplies = lang === 'bn'
    ? ['মূল্য কত?', 'কতটুকু সময় লাগে?', 'শুরু করতে চাই']
    : ['What are the prices?', 'How long does it take?', 'I want to get started'];

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 4000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--cyan),var(--purple))',
          border: 'none', boxShadow: '0 4px 20px rgba(0,229,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', transition: 'all 0.3s',
          transform: open ? 'rotate(0deg) scale(0.9)' : 'rotate(0deg) scale(1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = open ? 'scale(0.9)' : 'scale(1)'}
      >
        {open ? '✕' : '💬'}
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'var(--magenta)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-0)' }}>
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.75rem', zIndex: 4000,
          width: 'min(380px, calc(100vw - 2rem))',
          height: 'min(520px, calc(100vh - 8rem))',
          background: 'var(--bg-1)', border: '1px solid var(--border-active)',
          borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-float)', animation: 'slideUp 0.3s var(--ease)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-0)' }}>{botName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                  {lang === 'bn' ? 'অনলাইন' : 'Online'}
                </span>
              </div>
            </div>
            <a href={cfg.site?.whatsapp || '#'} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--green)', letterSpacing: '0.08em', textDecoration: 'none', padding: '0.25em 0.6em', border: '1px solid rgba(0,255,163,0.3)', borderRadius: '100px', background: 'var(--green-dim)', flexShrink: 0 }}>
              📱 WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            {messages.map(msg => <Message key={msg.id} msg={msg} />)}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>🤖</div>
                <div style={{ padding: '0.65rem 0.9rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && !collectingLead && (
            <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
              {quickReplies.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  style={{ padding: '0.3em 0.75em', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.05em', border: '1px solid var(--border-active)', background: 'var(--cyan-dim)', color: 'var(--cyan)', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cyan-mid)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--cyan-dim)'}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Lead form or input */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
            {collectingLead ? (
              <LeadForm onSubmit={handleLeadSubmit} lang={lang} />
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={inputRef}
                  className="input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder={lang === 'bn' ? 'প্রশ্ন করুন...' : 'Ask anything...'}
                  disabled={loading}
                  style={{ flex: 1, fontSize: '0.82rem', padding: '0.55em 0.9em', borderRadius: '100px' }}
                />
                <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                  className="btn btn-primary"
                  style={{ padding: '0.55em 1em', fontSize: '0.8rem', borderRadius: '100px', flexShrink: 0, opacity: loading || !input.trim() ? 0.5 : 1 }}>
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }
      `}</style>
    </>
  );
}
