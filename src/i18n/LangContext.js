import { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('aipgbd_lang') || 'en';
    document.body.setAttribute('data-lang', saved);
    return saved;
  });

  const toggleLang = () => {
    setLang(current => {
      const next = current === 'en' ? 'bn' : 'en';
      localStorage.setItem('aipgbd_lang', next);
      document.body.setAttribute('data-lang', next);
      return next;
    });
  };

  // t() is defined inline — NOT wrapped in useCallback
  // This means every consumer re-renders fresh when lang changes
  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key;

  return (
    <LangCtx.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}
