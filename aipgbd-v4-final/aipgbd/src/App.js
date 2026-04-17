import { useState, useCallback } from 'react';
import './styles/globals.css';
import { getDB } from './db';
import { useCursor, useReveal, useTheme } from './hooks';
import AdminPanel from './admin/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Work from './sections/Work';
import Process from './sections/Process';
import Services from './sections/Services';
import Industries from './sections/Industries';
import PortalEcosystem from './sections/PortalEcosystem';
import RevenueRoadmap from './sections/RevenueRoadmap';
import TechStack from './sections/TechStack';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';

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

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      <Navbar theme={theme} onToggleTheme={toggle} db={db} />
      <main key={siteKey}>
        <Hero db={db} />
        <Work db={db} />
        <Process db={db} />
        <Services db={db} />
        <Industries db={db} />
        <PortalEcosystem />
        <RevenueRoadmap />
        <TechStack />
        <Testimonials db={db} />
        <FAQ db={db} />
        <Contact db={db} />
      </main>
      <Footer db={db} />
    </>
  );
}
