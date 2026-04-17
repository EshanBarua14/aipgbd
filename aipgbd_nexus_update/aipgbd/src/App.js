import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import { getConfig, saveConfig, trackPageView } from './hooks/db';
import { dbGetConfig, dbSaveConfig, isSupabaseReady } from './hooks/supabase';
import { initGA, trackPage } from './hooks/useAnalytics';
import { LangProvider } from './i18n/LangContext';
import { DivisionProvider, useDivision } from './i18n/DivisionContext';
import NexusLanding from './pages/NexusLanding';
import StudiosPage  from './pages/StudiosPage';
import SystemsPage  from './pages/SystemsPage';

import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import Process      from './components/Process';
import Services     from './components/Services';
import Portfolio    from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Industries   from './components/Industries';
import FAQ          from './components/FAQ';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import AdminPanel   from './components/AdminPanel';
import CookieBar    from './components/CookieBar';
import BlogPage     from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogSection  from './components/BlogSection';
import CaseStudyPage from './pages/CaseStudyPage';

function Toast({ msg, type }) {
  const colors = { success: 'var(--green)', error: 'var(--magenta)', warning: 'var(--purple)' };
  return (
    <div className="toast show" style={{ borderColor: colors[type] || colors.success }}>
      <span style={{ color: colors[type] || colors.success, fontSize: '1rem', flexShrink: 0 }}>
        {type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}
      </span>
      <span>{msg}</span>
    </div>
  );
}

function Cursor() {
  const dotRef = useRef(null), ringRef = useRef(null);
  const ring = useRef({ x: 0, y: 0 }), mouse = useRef({ x: 0, y: 0 }), raf = useRef(null);
  useEffect(() => {
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; if (dotRef.current) { dotRef.current.style.left = e.clientX + 'px'; dotRef.current.style.top = e.clientY + 'px'; } };
    const animate = () => { ring.current.x += (mouse.current.x - ring.current.x) * 0.12; ring.current.y += (mouse.current.y - ring.current.y) * 0.12; if (ringRef.current) { ringRef.current.style.left = ring.current.x + 'px'; ringRef.current.style.top = ring.current.y + 'px'; } raf.current = requestAnimationFrame(animate); };
    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return (<><div id="cursor-dot" ref={dotRef} /><div id="cursor-ring" ref={ringRef} /></>);
}

function useScrollReveal(key) {
  useEffect(() => {
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
      document.querySelectorAll('.animate-in').forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 80);
    return () => clearTimeout(t);
  }, [key]);
}

// Page view tracking with React Router
function GATracker({ gaId }) {
  const location = useLocation();
  useEffect(() => { if (gaId) trackPage(location.pathname, document.title); }, [location, gaId]);
  return null;
}

function HomePage({ cfg, cfgKey, showToast }) {
  useScrollReveal(cfgKey);
  return (
    <main key={cfgKey}>
      <Hero        cfg={cfg} />
      <Process     cfg={cfg} />
      <Services    cfg={cfg} />
      <Portfolio   cfg={cfg} />
      <Testimonials cfg={cfg} />
      <Industries  cfg={cfg} />
      <FAQ         cfg={cfg} />
      <BlogSection />
      <Contact     cfg={cfg} showToast={showToast} />
    </main>
  );
}

function AppInner() {
  const [theme,     setTheme]     = useState(() => localStorage.getItem('aipgbd_theme') || 'dark');
  const [cfg,       setCfg]       = useState(() => getConfig());
  const [cfgKey,    setCfgKey]    = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [loaded,    setLoaded]    = useState(false);
  const toastTimer = useRef(null);

  // Init GA from config
  useEffect(() => { if (cfg.site?.gaId) initGA(cfg.site.gaId); }, [cfg.site?.gaId]);

  // Apply theme + Bangla font
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aipgbd_theme', theme);
  }, [theme]);

  // Dynamic title
  useEffect(() => { document.title = `${cfg.site?.name || 'AIPGBD'} – ${cfg.site?.tagline || 'Cinematic AI Production'}`; }, [cfg.site]);

  // Load config from Supabase on first mount, sync to local
  useEffect(() => {
    trackPageView();
    // We do NOT load config from Supabase on startup
    // localStorage is the source of truth for config
    // Supabase is used only as a backup when saving
    setLoaded(true);
  }, []);

  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);

  const handleSave = useCallback(async (newCfg) => {
    const ok = saveConfig(newCfg);
    if (isSupabaseReady) await dbSaveConfig(newCfg);
    if (ok) { setCfg(getConfig()); setCfgKey(k => k + 1); showToast('✓ Saved & synced!', 'success'); }
    else showToast('Save failed.', 'error');
  }, [showToast]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Reset ALL content to defaults?')) return;
    localStorage.removeItem('aipgbd_v5_cfg');
    setCfg(getConfig()); setCfgKey(k => k + 1);
    showToast('Reset to defaults.', 'warning');
  }, [showToast]);

  const gaId = cfg.site?.gaId;

  const location = useLocation();
  const isNexusRoute = ['/', '/studios', '/systems'].includes(location.pathname);

  if (!loaded) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)' }}>Loading…</div>;

  return (
    <>
      <Cursor />
      {gaId && <GATracker gaId={gaId} />}
      {!isNexusRoute && <Navbar cfg={cfg} theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} openAdmin={() => setAdminOpen(true)} />}

      <Routes>
        <Route path="/"              element={<NexusLanding />} />
        <Route path="/studios"       element={<StudiosPage />} />
        <Route path="/systems"       element={<SystemsPage />} />
        <Route path="/home"          element={<HomePage cfg={cfg} cfgKey={cfgKey} showToast={showToast} />} />
        <Route path="/blog"          element={<BlogPage />} />
        <Route path="/blog/:slug"    element={<BlogPostPage cfg={cfg} />} />
        <Route path="/work/:slug"    element={<CaseStudyPage cfg={cfg} />} />
        <Route path="*"              element={<NexusLanding />} />
      </Routes>

      {!isNexusRoute && <Footer cfg={cfg} />}
      {!isNexusRoute && <CookieBar />}
      {!isNexusRoute && cfg.chatbot?.enabled !== false && <Chatbot cfg={cfg} />}

      {adminOpen && <AdminPanel cfg={cfg} onClose={() => setAdminOpen(false)} onSave={handleSave} onReset={handleReset} showToast={showToast} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DivisionProvider>
        <LangProvider>
          <AppInner />
        </LangProvider>
      </DivisionProvider>
    </BrowserRouter>
  );
}
