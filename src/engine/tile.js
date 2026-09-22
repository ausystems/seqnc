/* =========================================================================
   A tile owns one timeline, built by `build(el)`.  It plays once when the
   tile comes into view and then stays: nothing that has appeared leaves
   again.  Under reduced motion the end state is shown at once.  If the
   tile is already past the viewport when it mounts (a language switch
   mid-page), it plays straight away.
   ========================================================================= */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { reduced } from './device.js';
import { bindScene } from './scene.js';

export function useTile(build, threshold = .3) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const tl = build(el);
    if (!tl) return undefined;
    if (reduced) { tl.progress(1); return () => tl.kill(); }
    tl.pause(0);
    let played = false;
    const play = () => { if (!played) { played = true; tl.play(0); } };
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top < window.innerHeight * .5) play();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => { io.disconnect(); tl.kill(); };
  }, [build, threshold]);
  return ref;
}

/* A tile whose picture is a scene: the same play-once, and the scene
   inside is fitted before paint and answers the pointer. */
export function useScene(build, threshold = .3) {
  const ref = useTile(build, threshold);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return bindScene(el.classList.contains('scene') ? el : el.querySelector('.scene'));
  }, [ref, build]);
  return ref;
}
