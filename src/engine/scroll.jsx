/* =========================================================================
   Scroll — the camera dolly.

   Lenis carries the momentum on fine-pointer devices so the page moves like
   a camera on a rail; touch devices keep their native feel; reduced motion
   keeps the browser's own scroll.  ScrollTrigger is fed from the same clock
   so every scrubbed scene is in lock-step with the dolly.
   ========================================================================= */
import { createContext, useContext, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { finePointer, reduced } from './device.js';

gsap.registerPlugin(ScrollTrigger);

const Ctx = createContext({ scrollTo: () => {} });

export function ScrollProvider({ children }) {
  const api = useMemo(() => ({ lenis: null, scrollTo: (target, opts) => nativeScrollTo(target, opts) }), []);

  useEffect(() => {
    if (reduced || !finePointer) {
      ScrollTrigger.refresh();
      return undefined;
    }
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });
    api.lenis = lenis;
    api.scrollTo = (target, opts = {}) =>
      lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* hash links go through the dolly too */
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      api.scrollTo(el);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      api.lenis = null;
      api.scrollTo = (t, o) => nativeScrollTo(t, o);
    };
  }, [api]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

function nativeScrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); return; }
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

export const useScroll = () => useContext(Ctx);
