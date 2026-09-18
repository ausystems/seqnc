/* =========================================================================
   Navigation.  Brand left, four mono destinations centre, language and the
   one action right.  Under 900px the destinations move into a numbered
   full-page menu.  The bar turns solid once the page moves, and follows the
   theme of whatever chapter is under it.
   ========================================================================= */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { A } from '../engine/transition.jsx';
import { reduced } from '../engine/device.js';
import Mark from './Mark.jsx';
import Button from './Button.jsx';
import { Arrow } from './Icons.jsx';

export const SECTIONS = [
  { id: 'leaks', key: 'problem' },
  { id: 'systems', key: 'systems' },
  { id: 'process', key: 'process' },
  { id: 'pricing', key: 'pricing' },
];

export function Brand({ className = '' }) {
  return (
    <A to="/" name="Seqnc" className={`brand ${className}`} aria-label="Seqnc Automations, home">
      <Mark className="brand__mark" />
      <span className="brand__w"><span className="brand__name">Seqnc</span><span className="brand__sub">Automations</span></span>
    </A>
  );
}

export function Lang({ className = '' }) {
  const { lang, setLang, t } = useT();
  return (
    <div className={`lang ${className}`} role="group" aria-label={t.ui.language}>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en" aria-label={t.ui.langNames.en}>EN</button>
      <i aria-hidden="true" />
      <button type="button" aria-pressed={lang === 'fr'} onClick={() => setLang('fr')} lang="fr" aria-label={t.ui.langNames.fr}>FR</button>
    </div>
  );
}

export default function Nav() {
  const { t } = useT();
  const location = useLocation();
  const [solid, setSolid] = useState(false);
  const [theme, setTheme] = useState('light');
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtn = useRef(null);
  const home = location.pathname === '/';

  /* solid after the page moves; steps aside while reading down, returns on the way up */
  const [hide, setHide] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      const d = y - last;
      if (y < 160) setHide(false);
      else if (d > 6) setHide(true);
      else if (d < -6) setHide(false);
      last = y;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  /* chapters under the bar announce their theme */
  useEffect(() => {
    const on = (e) => setTheme(e.detail || 'light');
    window.addEventListener('seqnc:navtheme', on);
    return () => window.removeEventListener('seqnc:navtheme', on);
  }, []);
  useEffect(() => { if (!home) setTheme('light'); }, [home, location.key]);

  /* which chapter is in view */
  useEffect(() => {
    if (!home) { setActive(''); return undefined; }
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home, location.key]);

  /* the full-page menu */
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return undefined;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (reduced) { gsap.set(el, { clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }); return undefined; }
    const items = el.querySelectorAll('.menu__item, .menu__foot > *');
    if (open) {
      gsap.timeline()
        .to(el, { clipPath: 'inset(0 0 0% 0)', duration: .7, ease: 'power4.inOut' })
        .from(items, { y: 22, opacity: 0, duration: .8, ease: 'expo.out', stagger: .05 }, .25);
    } else {
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: .55, ease: 'power4.inOut' });
    }
    return undefined;
  }, [open]);
  useEffect(() => { close(); }, [location, close]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); menuBtn.current && menuBtn.current.focus(); return; }
      if (e.key !== 'Tab' || !menuRef.current) return;
      /* keep focus inside the open menu */
      const items = [menuBtn.current, ...menuRef.current.querySelectorAll('a, button')].filter(Boolean);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    const first = menuRef.current && menuRef.current.querySelector('a');
    first && setTimeout(() => first.focus(), 400);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <>
      <a className="skip" href="#main">{t.ui.skip}</a>
      <header className="nav" data-solid={solid || open ? '1' : '0'} data-hide={hide && !open ? '1' : '0'} data-theme={theme === 'dark' && !open ? 'dark' : undefined}>
        <Brand />
        <nav className="nav__links" aria-label="Site">
          {SECTIONS.map((s) => (
            <a key={s.id} className="nav__link" href={`/#${s.id}`} aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => { if (!home) { e.preventDefault(); window.location.assign(`/#${s.id}`); } }}>
              {t.nav[s.key]}
            </a>
          ))}
        </nav>
        <div className="nav__right">
          <Lang />
          <Button className="nav__cta" href={t.calendly} calendly small>{t.nav.cta}</Button>
          <button ref={menuBtn} type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? t.ui.close : t.ui.menu}
          </button>
        </div>
      </header>

      <div id="menu" className="menu" ref={menuRef} data-open={open ? '1' : '0'} aria-hidden={!open}>
        <ul className="menu__list">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="menu__item">
              <a href={`/#${s.id}`} onClick={(e) => { close(); if (!home) { e.preventDefault(); window.location.assign(`/#${s.id}`); } }}>
                <span className="i">0{i + 1}</span><span>{t.nav[s.key]}</span><Arrow className="" />
              </a>
            </li>
          ))}
          <li className="menu__item">
            <A to="/free-review" name={t.review.label} onClick={close}><span className="i">05</span><span>{t.nav.cta}</span><Arrow className="" /></A>
          </li>
        </ul>
        <div className="menu__foot">
          <Button href={t.calendly} calendly onClick={close}>{t.hero.cta}</Button>
          <div className="menu__legal">
            <A to="/privacy" name={t.footer.privacy} onClick={close}>{t.footer.privacy}</A>
            <A to="/terms" name={t.footer.terms} onClick={close}>{t.footer.terms}</A>
            <a className="menu__mail" href={`mailto:${t.email}`}>{t.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
