import { useState, useEffect } from 'react';
import { useLang } from '../i18n/LangContext';
export default function CookieBar() {
  const [visible, setVisible] = useState(false);
  const { t } = useLang();
  useEffect(() => { if (!localStorage.getItem('aipgbd_cookies')) setTimeout(() => setVisible(true), 2000); }, []);
  const accept = () => { localStorage.setItem('aipgbd_cookies', '1'); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 8000, background: 'var(--surface-2)', borderTop: '1px solid var(--border-active)', backdropFilter: 'blur(20px)', padding: '1rem var(--container-px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', animation: 'fadeIn 0.4s' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-1)', margin: 0, lineHeight: 1.6, flex: 1, minWidth: 200 }}>{t('cookie_text')}</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <button onClick={accept} className="btn btn-primary" style={{ padding: '0.5em 1.4em', fontSize: '0.8rem' }}>{t('cookie_accept')}</button>
        <button onClick={() => setVisible(false)} className="btn btn-ghost" style={{ padding: '0.5em 1.1em', fontSize: '0.8rem' }}>{t('cookie_dismiss')}</button>
      </div>
    </div>
  );
}
