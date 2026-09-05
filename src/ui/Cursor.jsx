/* The cursor is an instrument, not a decoration: a point, a ring that lags
   behind it, and a word when the object under it can be played. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { finePointer, reduced } from '../engine/device.js';
import { onFrame } from '../engine/input.js';

const WORDS = { play: 'Play', open: 'Open', drag: 'Drag', scan: 'Scan', link: '', text: '' };

export default function Cursor() {
  const dot = useRef(null), ring = useRef(null), word = useRef(null);

  useEffect(() => {
    if (!finePointer || reduced) return undefined;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const d = dot.current, r = ring.current, w = word.current;
    const dx = gsap.quickTo(d, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.46, ease: 'expo' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.46, ease: 'expo' });
    const rs = gsap.quickTo(r, 'scale', { duration: 0.4, ease: 'power3' });

    let state = '', shown = false, down = false;
    const setState = (s) => {
      if (s === state) return;
      state = s;
      r.dataset.state = s;
      w.textContent = WORDS[s] || '';
    };
    const over = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) return setState(t.dataset.cursor);
      if (e.target.closest('a, button, [role="button"]')) return setState('link');
      setState('');
    };
    const onDown = () => { down = true; gsap.to(d, { scale: 0.6, duration: 0.14 }); };
    const onUp = () => { down = false; gsap.to(d, { scale: 1, duration: 0.5, ease: 'back.out(2)' }); };
    document.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    const off = onFrame((s) => {
      if (!s.present) { if (shown) { shown = false; gsap.to([d, r], { opacity: 0, duration: 0.3 }); } return; }
      if (!shown) { shown = true; gsap.to([d, r], { opacity: 1, duration: 0.4 }); }
      dx(s.x); dy(s.y); rx(s.x); ry(s.y);
      /* the ring breathes with pointer speed and tightens when pressed */
      const base = state && state !== 'link' ? 1 : 1;
      rs(base * (down ? 0.85 : 1 + s.speed * 0.4));
    });

    return () => {
      html.classList.remove('has-cursor');
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      off();
    };
  }, []);

  if (!finePointer || reduced) return null;
  return (
    <div className="cur" aria-hidden="true">
      <div ref={ring} className="cur__ring"><span ref={word} className="cur__word" /></div>
      <div ref={dot} className="cur__dot" />
    </div>
  );
}
