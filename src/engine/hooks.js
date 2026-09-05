/* =========================================================================
   Hooks that bind React components to the engine.
   ========================================================================= */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerScene } from './scenes.js';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* Run GSAP code scoped to a ref; everything created inside is reverted on
   unmount, so scenes never leak tweens or ScrollTriggers. */
/* Either `useGsap(fn)` — returns a ref to attach — or `useGsap(ref, fn)` to
   scope to a ref the component already owns. */
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

/* Register a section as a level the HUD can name. */
export function useScene(ref, id, name) {
  useEffect(() => {
    if (!ref.current) return undefined;
    return registerScene(ref.current, id, name);
  }, [ref, id, name]);
}

/* Which platform is the player on right now?  Re-renders on change so a
   scene can hand out a different tree for touch. */
import { useState } from 'react';
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
