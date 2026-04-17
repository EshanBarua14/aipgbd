import { useState, useCallback } from 'react';
import './styles/globals.css';
import { getDB } from './db';
import { useCursor, useReveal, useTheme } from './hooks';
import AdminPanel from './admin/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import Services from './components/Services';
import Industries from './components/Industries';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

export default function App() {
  const { dotRef, ringRef } = useCursor();
  const { theme, toggle } = useTheme();
  const [db, setDb] = useState(getDB());
  const [siteKey, setSiteKey] = useState(0);

  const path = window.location.pathname;
  const hash = window.location.hash;
  const [showAdmin, setShowAdmin] = useState(path === '/admin' || hash === '#admin');

  useReveal();

  const handleAdminSave = useCallback((newDb) => {
    setDb(newDb);
    setSiteKey(k => k + 1);
  }, []);

  const handleAdminClose = () => {
    setShowAdmin(false);
    window.history.pushState({}, '', '/');
  };

  if (showAdmin) {
    return <AdminPanel onSave={handleAdminSave} onClose={handleAdminClose} />;
  }

  // Normalize db so components get what they expect
  const cfg = {
    ...db,
    process: db.process || db.tools || [],
    niches:  db.niches  || db.industries || [],
    packages: db.packages || [],
  };

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      <Navbar cfg={cfg} theme={theme} toggleTheme={toggle} openAdmin={() => setShowAdmin(true)} />
      <main key={siteKey}>
        <Hero cfg={cfg} />
        <Portfolio cfg={cfg} />
        <Process cfg={cfg} />
        <Services cfg={cfg} />
        <Industries cfg={cfg} />
        <Testimonials cfg={cfg} />
        <FAQ cfg={cfg} />
        <Contact cfg={cfg} showToast={(msg) => alert(msg)} />
      </main>
      <Footer cfg={cfg} />
    </>
  );
}
