import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivision } from '../i18n/DivisionContext';
import './SystemsPage.css';

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: '⚛️',
    badge: 'Frontend',
    title: 'React Application Development',
    desc: 'Production-grade SPAs, dashboards, and portals built with React 18, TypeScript, and modern state management. Pixel-perfect, accessible, and blazing fast.',
    tags: ['React 18', 'TypeScript', 'Redux', 'Tailwind', 'Vite'],
  },
  {
    icon: '🔧',
    badge: 'Backend',
    title: 'ASP.NET Core APIs',
    desc: 'Robust REST and GraphQL APIs built on ASP.NET Core. Clean architecture, Entity Framework, SQL Server — engineered to scale from day one.',
    tags: ['ASP.NET Core', 'C#', 'EF Core', 'SQL Server', 'JWT'],
  },
  {
    icon: '🗄️',
    badge: 'Database',
    title: 'Database Architecture',
    desc: 'Schema design, query optimization, migrations, and data warehousing. We architect databases that perform at scale and survive the long term.',
    tags: ['SQL Server', 'PostgreSQL', 'Redis', 'Supabase', 'Azure SQL'],
  },
  {
    icon: '☁️',
    badge: 'Cloud',
    title: 'Azure & Cloud Deployment',
    desc: 'Full CI/CD pipelines, containerization with Docker, and cloud infrastructure on Azure. Your app deployed, monitored, and auto-scaled.',
    tags: ['Azure', 'Docker', 'GitHub Actions', 'NGINX', 'Let\'s Encrypt'],
  },
  {
    icon: '🔐',
    badge: 'Security',
    title: 'Auth & Identity Systems',
    desc: 'Multi-tenant auth, OAuth2, OIDC, role-based access control, and audit trails. Built for enterprise compliance from the ground up.',
    tags: ['OAuth2', 'OIDC', 'RBAC', 'Azure AD', 'Identity Server'],
  },
  {
    icon: '📊',
    badge: 'Analytics',
    title: 'BI Dashboards & Reporting',
    desc: 'Real-time analytics dashboards, custom reporting engines, and data visualization tools — turning raw data into decisions.',
    tags: ['Power BI', 'Recharts', 'D3.js', 'SSRS', 'SignalR'],
  },
];

const CASE_STUDIES = [
  {
    client: 'MediTrack BD',
    industry: 'Healthcare',
    title: 'Hospital Management System',
    desc: 'End-to-end HMS covering patient records, appointment scheduling, pharmacy, billing, and lab management for a 400-bed hospital network.',
    tags: ['ASP.NET Core', 'React', 'SQL Server', 'Azure'],
    metric: { val: '400+', label: 'Beds Managed' },
    metric2: { val: '12s', label: 'Avg Page Load' },
  },
  {
    client: 'FinEdge Capital',
    industry: 'FinTech',
    title: 'Loan Origination & CRM Platform',
    desc: 'Multi-tenant SaaS platform for micro-finance with credit scoring, disbursement automation, repayment tracking, and regulator reporting.',
    tags: ['React 18', 'C#', 'PostgreSQL', 'Docker'],
    metric: { val: '৳2.4Cr', label: 'Monthly Volume' },
    metric2: { val: '99.9%', label: 'Uptime' },
  },
  {
    client: 'RapidShip BD',
    industry: 'Logistics',
    title: 'Last-Mile Delivery Tracker',
    desc: 'Real-time parcel tracking, rider dispatch system, route optimization, and merchant API with live webhook notifications.',
    tags: ['SignalR', 'React', 'Maps API', 'Redis'],
    metric: { val: '8,000+', label: 'Parcels / Day' },
    metric2: { val: '3ms', label: 'Realtime Latency' },
  },
  {
    client: 'EduNest',
    industry: 'EdTech',
    title: 'LMS & Live Class Platform',
    desc: 'Full learning management system with video streaming, quiz engine, certificate generation, batch management, and parent portal.',
    tags: ['ASP.NET', 'React', 'Azure Media', 'Stripe'],
    metric: { val: '25,000', label: 'Active Students' },
    metric2: { val: '4.9★', label: 'App Rating' },
  },
];

const TECH_STACK = [
  { icon: '⚛️', name: 'React',        cat: 'Frontend'  },
  { icon: '🔷', name: 'TypeScript',   cat: 'Language'  },
  { icon: '🟣', name: 'ASP.NET Core', cat: 'Backend'   },
  { icon: '🔶', name: 'C#',           cat: 'Language'  },
  { icon: '🗄️', name: 'SQL Server',   cat: 'Database'  },
  { icon: '🐘', name: 'PostgreSQL',   cat: 'Database'  },
  { icon: '🔴', name: 'Redis',        cat: 'Cache'     },
  { icon: '☁️', name: 'Azure',        cat: 'Cloud'     },
  { icon: '🐳', name: 'Docker',       cat: 'DevOps'    },
  { icon: '⚡', name: 'Vite',         cat: 'Tooling'   },
  { icon: '🔄', name: 'GitHub Actions',cat:'CI/CD'     },
  { icon: '📡', name: 'SignalR',      cat: 'Realtime'  },
  { icon: '🔐', name: 'Identity Server',cat:'Auth'     },
  { icon: '📊', name: 'Power BI',     cat: 'Analytics' },
  { icon: '🌿', name: 'Supabase',     cat: 'BaaS'      },
  { icon: '🧩', name: 'EF Core',      cat: 'ORM'       },
];

const CLIENTS = [
  { logo: '🏥', name: 'MediTrack BD',    sector: 'Healthcare'  },
  { logo: '💳', name: 'FinEdge Capital', sector: 'FinTech'     },
  { logo: '🚚', name: 'RapidShip BD',    sector: 'Logistics'   },
  { logo: '📚', name: 'EduNest',         sector: 'EdTech'      },
  { logo: '🏗️', name: 'BuildCo BD',      sector: 'Construction'},
  { logo: '🛒', name: 'ShopEase',        sector: 'eCommerce'   },
  { logo: '🏦', name: 'NexBank',         sector: 'Banking'     },
  { logo: '🌾', name: 'AgroLink',        sector: 'AgriTech'    },
];

const PROCESS = [
  { num: '01', title: 'Discovery & Architecture', desc: 'We map your requirements, design the data model, and propose a technical architecture before writing a line of code.' },
  { num: '02', title: 'Sprint Planning',           desc: 'Features are broken into 2-week sprints with clear acceptance criteria, tracked in real-time on a shared board.' },
  { num: '03', title: 'Build & Review',            desc: 'Clean code, code review, unit tests, and automated CI — every PR goes through a quality gate before merge.' },
  { num: '04', title: 'QA & UAT',                  desc: 'Comprehensive testing including integration, regression, load testing, and a structured UAT cycle with your team.' },
  { num: '05', title: 'Deploy & Monitor',          desc: 'Zero-downtime deployments to Azure with full observability — logs, metrics, alerts, and SLA reporting from day one.' },
  { num: '06', title: 'Support & Scale',           desc: 'Ongoing maintenance, feature development, and performance optimization under a transparent retainer agreement.' },
];

const STATS = [
  { value: '40+',  label: 'Systems Delivered' },
  { value: '99.9%',label: 'Avg Uptime'        },
  { value: '6yr',  label: 'In Production'     },
  { value: '24h',  label: 'Support Response'  },
];

// Terminal lines
const TERMINAL_LINES = [
  { type: 'prompt', cmd: 'git clone aipgbd/enterprise-api' },
  { type: 'out',    text: 'Cloning into \'enterprise-api\'... done.' },
  { type: 'prompt', cmd: 'dotnet build --configuration Release' },
  { type: 'out',    text: 'Build succeeded. 0 Warning(s). 0 Error(s).' },
  { type: 'prompt', cmd: 'dotnet ef database update' },
  { type: 'out',    text: 'Applying migration \'InitialSchema\'...' },
  { type: 'comment',text: '// All systems operational ✓' },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function StatItem({ value, label }) {
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
    if (isNaN(num)) { setDisplay(value); return; }
    let cur = 0;
    const step = num / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setDisplay((num % 1 !== 0 ? cur.toFixed(1) : Math.floor(cur)) + suffix);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, value]);

  return (
    <div className="sys-stat" ref={ref}>
      <span className="sys-stat-value">{display}</span>
      <span className="sys-stat-label">{label}</span>
    </div>
  );
}

// ── Typing terminal ───────────────────────────────────────────────────────────
function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setVisibleLines(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="sys-hero-terminal">
      <div className="sys-terminal-bar">
        <div className="sys-terminal-dot" style={{ background: '#ff5f57' }} />
        <div className="sys-terminal-dot" style={{ background: '#febc2e' }} />
        <div className="sys-terminal-dot" style={{ background: '#28c840' }} />
        <span className="sys-terminal-title">aipgbd — zsh</span>
      </div>
      <div className="sys-terminal-body">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="sys-terminal-line">
            {line.type === 'prompt' && (
              <>
                <span className="sys-terminal-prompt">→</span>
                <span className="sys-terminal-cmd">{line.cmd}</span>
              </>
            )}
            {line.type === 'out'     && <span className="sys-terminal-out">{line.text}</span>}
            {line.type === 'comment' && <span className="sys-terminal-comment">{line.text}</span>}
          </div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <div className="sys-terminal-line">
            <span className="sys-terminal-prompt">→</span>
            <span className="sys-terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SystemsPage() {
  const navigate   = useNavigate();
  const { setDivision } = useDivision();

  useEffect(() => {
    setDivision('systems');
    document.title = 'AIPG Systems – Enterprise Software Engineering';
    window.scrollTo(0, 0);
  }, [setDivision]);

  return (
    <div className="sys-root">

      {/* ── Navbar ── */}
      <nav className="sys-nav">
        <div className="sys-nav-logo" onClick={() => navigate('/')}>
          <div className="sys-nav-logo-mark">{'</>'}</div>
          <div className="sys-nav-logo-text">
            <span className="sys-nav-logo-main">AIPG Systems</span>
            <span className="sys-nav-logo-sub">Enterprise Software Engineering</span>
          </div>
        </div>
        <div className="sys-nav-links">
          <a href="#services">Services</a>
          <a href="#cases">Case Studies</a>
          <a href="#tech">Tech Stack</a>
          <a href="#contact" className="sys-nav-cta">Start a Project</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="sys-hero">
        <div className="sys-hero-bg" />
        <div className="sys-hero-grid" />
        <div className="sys-hero-scanlines" />

        <div className="sys-hero-content">
          <div className="sys-hero-eyebrow">
            <span className="sys-hero-eyebrow-dot" />
            Division II — AIPG Systems
          </div>
          <h1 className="sys-hero-title">
            Enterprise Software.<br />
            <span>Built to Last.</span>
          </h1>
          <p className="sys-hero-sub">
            Production-grade React and ASP.NET Core systems for healthcare, fintech,
            logistics, and edtech. Clean architecture, zero compromises.
          </p>
          <div className="sys-hero-actions">
            <button
              className="sys-btn-primary"
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Case Studies
            </button>
            <button
              className="sys-btn-secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a Project →
            </button>
          </div>
        </div>

        <Terminal />
      </section>

      {/* ── Stats ── */}
      <div className="sys-stats">
        {STATS.map(s => <StatItem key={s.label} {...s} />)}
      </div>

      {/* ── Services ── */}
      <section className="sys-section" id="services">
        <div className="sys-section-label">What We Build</div>
        <h2 className="sys-section-title">Our <span>Services</span></h2>
        <p className="sys-section-sub">
          Full-stack enterprise development from architecture to deployment.
          Every system engineered for reliability, security, and scale.
        </p>
        <div className="sys-services-grid">
          {SERVICES.map(s => (
            <div className="sys-service-card" key={s.title}>
              <div className="sys-service-badge">{s.badge}</div>
              <div className="sys-service-icon">{s.icon}</div>
              <div className="sys-service-title">{s.title}</div>
              <p className="sys-service-desc">{s.desc}</p>
              <div className="sys-service-tags">
                {s.tags.map(t => <span key={t} className="sys-service-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section className="sys-section" id="cases" style={{ paddingTop: 0 }}>
        <div className="sys-section-label">Proven Track Record</div>
        <h2 className="sys-section-title">Case <span>Studies</span></h2>
        <p className="sys-section-sub">
          Real systems, real clients, real scale. Every project shipped on time and still running in production.
        </p>
        <div className="sys-cases">
          {CASE_STUDIES.map(c => (
            <div className="sys-case-card" key={c.client}>
              <div className="sys-case-meta">
                <span className="sys-case-client">{c.client}</span>
                <span className="sys-case-industry">{c.industry}</span>
              </div>
              <div className="sys-case-body">
                <div className="sys-case-title">{c.title}</div>
                <p className="sys-case-desc">{c.desc}</p>
                <div className="sys-case-tags">
                  {c.tags.map(t => <span key={t} className="sys-case-tag">{t}</span>)}
                </div>
              </div>
              <div className="sys-case-metrics">
                <div className="sys-case-metric">
                  <div className="sys-case-metric-val">{c.metric.val}</div>
                  <div className="sys-case-metric-label">{c.metric.label}</div>
                </div>
                <div className="sys-case-metric">
                  <div className="sys-case-metric-val">{c.metric2.val}</div>
                  <div className="sys-case-metric-label">{c.metric2.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button className="sys-btn-secondary">View All Case Studies ↗</button>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="sys-tech-section" id="tech">
        <div className="sys-tech-inner">
          <div className="sys-section-label">Our Stack</div>
          <h2 className="sys-section-title">Technology <span>Stack</span></h2>
          <p className="sys-section-sub">
            Battle-tested tools chosen for reliability, ecosystem maturity, and long-term maintainability.
          </p>
          <div className="sys-tech-grid">
            {TECH_STACK.map(t => (
              <div className="sys-tech-card" key={t.name}>
                <div className="sys-tech-icon">{t.icon}</div>
                <div className="sys-tech-name">{t.name}</div>
                <div className="sys-tech-cat">{t.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section className="sys-clients">
        <div className="sys-clients-inner">
          <div className="sys-section-label">Trusted By</div>
          <h2 className="sys-section-title">Our <span>Clients</span></h2>
          <p className="sys-section-sub">
            From startups to enterprise — teams across Bangladesh and beyond.
          </p>
          <div className="sys-clients-grid">
            {CLIENTS.map(c => (
              <div className="sys-client-card" key={c.name}>
                <div className="sys-client-logo">{c.logo}</div>
                <div className="sys-client-name">{c.name}</div>
                <div className="sys-client-sector">{c.sector}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="sys-process" id="process">
        <div className="sys-process-inner">
          <div className="sys-section-label">How We Deliver</div>
          <h2 className="sys-section-title">Engineering <span>Process</span></h2>
          <p className="sys-section-sub">
            A disciplined delivery framework that keeps projects on time, on budget, and on spec.
          </p>
          <div className="sys-process-grid">
            {PROCESS.map(p => (
              <div className="sys-process-step" key={p.num}>
                <div className="sys-process-num">// {p.num}</div>
                <div className="sys-process-title">{p.title}</div>
                <p className="sys-process-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sys-cta" id="contact">
        <div className="sys-cta-bg" />
        <div className="sys-cta-inner">
          <div className="sys-section-label" style={{ justifyContent: 'center' }}>Start a Project</div>
          <h2 className="sys-cta-title">
            Ready to Build Something <span>That Lasts?</span>
          </h2>
          <p className="sys-cta-sub">
            Share your requirements. We'll respond with a technical proposal, architecture outline, and fixed-price quote within 48 hours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="sys-btn-primary"
              onClick={() => window.location.href = 'mailto:systems@aipgdbd.com'}
            >
              systems@aipgdbd.com
            </button>
            <button
              className="sys-btn-secondary"
              onClick={() => navigate('/home#contact')}
            >
              Use Contact Form →
            </button>
          </div>
          <a className="sys-cta-email" href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noreferrer">
            Or message us on WhatsApp ↗
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="sys-footer">
        <span className="sys-footer-copy">
          © {new Date().getFullYear()} AIPG Systems · AI Playground BD · Dhaka, Bangladesh
        </span>
        <button className="sys-footer-back" onClick={() => navigate('/')}>
          ← Back to Nexus
        </button>
      </footer>

    </div>
  );
}
