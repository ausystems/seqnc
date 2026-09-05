/* The diagnosis: one statement, and the leaks laid out in a quiet grid. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Display } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { problems as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Problems() {
  const ref = useRef(null);
  useScene(ref, 'problems', 'Diagnosis');
  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const items = el.querySelectorAll('.prob__item');
    gsap.set(items, { opacity: 0, y: 14 });
    ScrollTrigger.create({ trigger: el.querySelector('.prob__grid'), start: 'top 82%', once: true, onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.04 }) });
  });
  return (
    <section ref={ref} id="problems" className="scene prob" aria-labelledby="prob-h">
      <div className="wrap g12">
        <div className="prob__head"><SceneHead label={c.label} heading={c.heading} headingId="prob-h" /></div>
        <div className="prob__stw">
          <Display as="p" lines={c.statement} size={2} className="prob__statement" lineClass={(i) => (i === 0 ? 'dim' : '')} dimLast={false} />
        </div>
      </div>
      <div className="wrap">
        <ul className="prob__grid" aria-label="Common problems">
          {c.items.map((t, i) => <li key={t} className="prob__item"><span className="u">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
        </ul>
      </div>
    </section>
  );
}
