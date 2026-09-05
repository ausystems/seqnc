/* Level 12 — the still room.  After the level select, nothing moves except
   the rules that draw the table and the text that fills it.  Contrast is
   the mechanic. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { why as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Why() {
  const ref = useRef(null);
  useScene(ref, 'why', 'Why Seqnc');

  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const q = gsap.utils.selector(el);
    const cells = q('.why__cell');
    const text = q('.why__cell > *');
    gsap.set(cells, { '--draw': 0 });
    gsap.set(text, { opacity: 0, y: 12 });
    ScrollTrigger.create({
      trigger: q('.why__table')[0], start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(cells, { '--draw': 1, duration: 1.4, ease: EASE.out, stagger: 0.08 });
        gsap.to(text, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.05, delay: 0.3 });
      },
    });
  });

  return (
    <section ref={ref} id="why" className="scene why" aria-labelledby="why-h">
      <div className="wrap">
        <SceneHead label={c.label} index="10" heading={c.heading} sub={c.sub} headingId="why-h" />
      </div>
      <ul className="why__table wrap">
        {c.items.map((it, i) => (
          <li key={it.name} className="why__cell">
            <span className="circ">{i + 1}</span>
            <h3 className="dsp dsp--2">{it.name}</h3>
            <p className="small">{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
