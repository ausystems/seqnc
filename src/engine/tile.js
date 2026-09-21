/* =========================================================================
   A tile owns one timeline, built by `build(el)`.  It plays once as the
   tile comes into view and replays on hover (or on tap, where there is no
   hover).  Under reduced motion the end state is shown at once.
   ========================================================================= */
import { useEffect, useRef } from 'react';
import { reduced, finePointer } from './device.js';

export function useTile(build, threshold = .45) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const tl = build(el);
    if (!tl) return undefined;
    if (reduced) { tl.progress(1); return () => tl.kill(); }
    tl.pause(0);
    let played = false;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !played) { played = true; tl.play(0); } }, { threshold });
    io.observe(el);
    const replay = () => { if (!tl.isActive() || tl.progress() > .6) tl.play(0); };
    if (finePointer) el.addEventListener('pointerenter', replay);
    else el.addEventListener('click', replay);
    return () => { io.disconnect(); el.removeEventListener('pointerenter', replay); el.removeEventListener('click', replay); tl.kill(); };
  }, [build, threshold]);
  return ref;
}
