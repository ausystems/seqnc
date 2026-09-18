/* =========================================================================
   Language.  English and French, remembered under the same storage key the
   published site uses ("seqnc-lang"), with the browser language as the
   first guess.  `t` is the whole content tree for the active language.
   ========================================================================= */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './content/en.js';
import fr from './content/fr.js';

const KEY = 'seqnc-lang';
const DICT = { en, fr };
const Ctx = createContext({ lang: 'en', t: en, setLang: () => {}, toggle: () => {} });

function initial() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch { /* storage unavailable */ }
  const nav = (window.navigator.language || '').toLowerCase();
  return nav.startsWith('fr') ? 'fr' : 'en';
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initial);
  useEffect(() => {
    try { window.localStorage.setItem(KEY, lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l) => setLangState(l === 'fr' ? 'fr' : 'en'), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'en' ? 'fr' : 'en')), []);
  const value = useMemo(() => ({ lang, t: DICT[lang], setLang, toggle }), [lang, setLang, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);
