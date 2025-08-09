import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../i18n/en.json';
import he from '../i18n/he.json';

type Language = 'en' | 'he';

type Translations = typeof en;

const dictionaries: Record<Language, Translations> = { en, he };

interface LanguageContextValue {
  language: Language;
  t: (key: keyof Translations, vars?: Record<string, string>) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key: keyof Translations, vars: Record<string, string> = {}) => {
    let text = dictionaries[language][key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, v);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export type { Language };
