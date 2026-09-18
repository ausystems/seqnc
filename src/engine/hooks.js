/* =========================================================================
   Hooks that bind React components to the motion engine.
   ========================================================================= */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* Run GSAP code scoped to an element; everything created inside is reverted
   on unmount so no tween or ScrollTrigger leaks between routes.
   `useGsap(fn)` returns a ref to attach; `useGsap(ref, fn)` scopes to a ref
   the component already owns.  The callback may return a cleanup. */
export function useGsap(a, b, c) {
  const own = useRef(null);
  const ext = typeof a === 'function' ? null : a;
  const fn = typeof a === 'function' ? a : b;
  const deps = (typeof a === 'function' ? b : c) || [];
  const scope = ext || own;
  useIso(() => {
    if (!scope.current) return undefined;
    let cleanup;
    const ctx = gsap.context((self) => { cleanup = fn(self, scope.current); }, scope.current);
    return () => { if (typeof cleanup === 'function') cleanup(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}

/* Media query as state. */
export function useMedia(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [m, setM] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

/* Resolves once the brand fonts are usable, so line splitting measures the
   real metrics. */
export function useFontsReady() {
  const [ready, setReady] = useState(() => typeof document !== 'undefined' && document.fonts && document.fonts.status === 'loaded');
  useEffect(() => {
    if (ready || !document.fonts) { if (!ready) setReady(true); return undefined; }
    let alive = true;
    const t = setTimeout(() => alive && setReady(true), 1800);
    document.fonts.ready.then(() => { if (alive) setReady(true); });
    return () => { alive = false; clearTimeout(t); };
  }, [ready]);
  return ready;
}
