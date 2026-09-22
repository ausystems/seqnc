/* =========================================================================
   A tile owns one timeline, built by `build(el)`, and shows its end state
   from the first paint: every picture is complete before it is seen, and
   nothing in it appears, moves in or leaves afterwards.  What life a
   picture keeps comes from its own CSS loops (a breathing dot, a turning
   legend, a glow).
   ========================================================================= */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { bindScene } from './scene.js';

export function useTile(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const tl = build(el);
    if (!tl) return undefined;
    tl.progress(1).pause();
    return () => tl.kill();
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
