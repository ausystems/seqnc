/* =========================================================================
   A tile owns one picture that is complete from its first paint (the DOM
   and CSS are the finished state) and alive for as long as it is on
   screen: `build(el)` returns a timeline of loops that move things inside
   the picture, never the picture itself.  Loops rest while the tile is
   far off screen and under reduced motion; the finished state remains.
   ========================================================================= */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { reduced } from './device.js';
import { bindScene } from './scene.js';

export function useTile(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const tl = build(el);
    if (!tl) return undefined;
    tl.play();
    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) tl.play(); else tl.pause(); }, { rootMargin: '240px 0px' });
      io.observe(el);
    }
    return () => { if (io) io.disconnect(); tl.revert(); };
  }, [build]);
  return ref;
}

/* A tile whose picture is a scene: fitted to its stage before paint, and
   lit by the pointer. */
export function useScene(build) {
  const ref = useTile(build);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return bindScene(el.classList.contains('scene') ? el : el.querySelector('.scene'));
  }, [ref, build]);
  return ref;
}
