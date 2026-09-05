/* A control with a magnetic field: it leans toward the pointer inside its
   radius, its label leans a little less, it compresses on press and springs
   back on release.  On touch it is simply a button. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { finePointer, reduced } from '../engine/device.js';
import { onFrame } from '../engine/input.js';

export default function Magnetic({ as: Tag = 'a', className = '', strength = 0.14, radius = 30, cursor = 'link', children, ...rest }) {
  const ref = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    if (!finePointer || reduced) return undefined;
    const el = ref.current, lab = inner.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'expo' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'expo' });
    const lx = gsap.quickTo(lab, 'x', { duration: 0.55, ease: 'expo' });
    const ly = gsap.quickTo(lab, 'y', { duration: 0.55, ease: 'expo' });

    let hot = false, rect = el.getBoundingClientRect(), n = 0;
    const off = onFrame((s) => {
      if (++n % 4 === 0) rect = el.getBoundingClientRect();
      if (!s.present) { if (hot) { hot = false; xTo(0); yTo(0); lx(0); ly(0); } return; }
      const dx = s.x - (rect.left + rect.width / 2);
      const dy = s.y - (rect.top + rect.height / 2);
      const inside = Math.abs(dx) < rect.width / 2 + radius && Math.abs(dy) < rect.height / 2 + radius;
      if (inside) { hot = true; xTo(dx * strength); yTo(dy * strength); lx(dx * strength * 0.4); ly(dy * strength * 0.4); }
      else if (hot) { hot = false; xTo(0); yTo(0); lx(0); ly(0); }
    });

    const down = () => gsap.to(el, { scale: 0.955, duration: 0.14, ease: 'power2.out', overwrite: 'auto' });
    const up = () => gsap.to(el, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', overwrite: 'auto' });
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => { off(); el.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); };
  }, [strength, radius]);

  return (
    <Tag ref={ref} className={`mag ${className}`} data-cursor={cursor} {...rest}>
      <span ref={inner} className="mag__in">{children}</span>
    </Tag>
  );
}
