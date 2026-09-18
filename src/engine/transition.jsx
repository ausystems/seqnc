/* =========================================================================
   Route changes: one composition closing and the next opening.

   An ink shutter rises over the page carrying the destination's name, the
   route swaps underneath it, the shutter lifts.  Back and forward skip the
   shutter; reduced motion skips it too.  Scroll position is restored on
   history navigation and reset on new navigation.
   ========================================================================= */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from './device.js';

const Ctx = createContext({ go: () => {} });
const positions = new Map();

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();
  const shutter = useRef(null);
  const label = useRef(null);
  const pending = useRef(null);
  const busy = useRef(false);

  useEffect(() => { if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; }, []);

  /* remember where we were on every location, for POP */
  useEffect(() => {
    const key = location.key;
    const save = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => { save(); window.removeEventListener('scroll', save); };
  }, [location.key]);

  /* after the route swaps: scroll, then lift the shutter */
  useLayoutEffect(() => {
    const hash = location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (navType === 'POP' && !hash) {
      window.scrollTo(0, positions.get(location.key) || 0);
    } else if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo(0, Math.max(0, top));
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
    const el = shutter.current;
    if (pending.current && el) {
      pending.current = null;
      gsap.timeline({ onComplete: () => { busy.current = false; } })
        .to(label.current, { opacity: 0, duration: .18 }, 0)
        .to(el, { yPercent: -101, duration: .62, ease: 'power4.inOut' }, .05)
        .set(el, { yPercent: 101 });
    } else {
      busy.current = false;
    }
  }, [location, navType]);

  const go = useCallback((to, name) => {
    if (busy.current) return;
    const el = shutter.current;
    if (reduced || !el) { navigate(to); return; }
    busy.current = true;
    pending.current = to;
    if (label.current) label.current.textContent = name || '';
    gsap.timeline()
      .set(el, { yPercent: 101 })
      .to(el, { yPercent: 0, duration: .5, ease: 'power4.inOut' })
      .fromTo(label.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3 }, .3)
      .add(() => navigate(to), .55);
  }, [navigate]);

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div className="shutter" ref={shutter} aria-hidden="true">
        <span className="shutter__label mono" ref={label} />
      </div>
    </Ctx.Provider>
  );
}

export const useGo = () => useContext(Ctx).go;

/* An internal link that plays the shutter.  Plain anchors (hash links on the
   current page, external hrefs, modified clicks) fall through untouched. */
export function A({ to, name, children, onClick, ...rest }) {
  const go = useGo();
  const location = useLocation();
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const [path, hash] = to.split('#');
    const samePath = (path || '/') === location.pathname;
    if (samePath && hash !== undefined) return; /* the scroll dolly handles it */
    e.preventDefault();
    if (samePath) { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); return; }
    go(to, name);
  };
  return <a href={to} onClick={handle} {...rest}>{children}</a>;
}
