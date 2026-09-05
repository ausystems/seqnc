/* Level 13 — the balance.  Two cells and one seam.  The seam leans toward
   whichever side the pointer favours, so the player weighs the two halves
   of the price by moving through the room. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { onFrame } from '../engine/input.js';
import { EASE } from '../engine/tokens.js';
import { pricing as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const ref = useRef(null);
  useScene(ref, 'pricing', 'Pricing');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const block = q('.price')[0];
    const cells = q('.price__cell');
    if (!reduced) {
      gsap.set(cells, { opacity: 0, y: 30 });
      ScrollTrigger.create({ trigger: block, start: 'top 80%', once: true, onEnter: () => gsap.to(cells, { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.12 }) });
    }
    if (!finePointer || reduced) return undefined;

    let a = 1, target = 1, hot = false, rect = block.getBoundingClientRect(), n = 0;
    const enter = () => { hot = true; };
    const leave = () => { hot = false; target = 1; };
    block.addEventListener('pointerenter', enter);
    block.addEventListener('pointerleave', leave);
    const off = onFrame((s) => {
      if (++n % 6 === 0) rect = block.getBoundingClientRect();
      if (hot) {
        const nx = gsap.utils.clamp(0, 1, (s.x - rect.left) / rect.width);
        target = 0.72 + nx * 0.56;          /* left favours the first cell, right the second */
      }
      a += (target - a) * 0.08;
      block.style.setProperty('--a', a.toFixed(3));
      block.style.setProperty('--b', (2 - a).toFixed(3));
    });
    return () => { off(); block.removeEventListener('pointerenter', enter); block.removeEventListener('pointerleave', leave); };
  });

  return (
    <section ref={ref} id="pricing" className="scene price-s" aria-labelledby="price-h">
      <div className="wrap">
        <SceneHead label={c.label} index="11" heading={c.heading} sub={c.sub} headingId="price-h" />
      </div>
      <div className="wrap">
        <div className="price" style={{ '--a': 1, '--b': 1 }}>
          {c.items.map((it, i) => (
            <div key={it.name} className={`price__cell price__cell--${i} `}>
              <span className="u tag"><i aria-hidden="true">[</i>{it.kind}<i aria-hidden="true">]</i></span>
              <h3 className="dsp dsp--2">{it.name}</h3>
              <p className="small">{it.body}</p>
            </div>
          ))}
        </div>
        <Lines className="note small price__note">{c.note}</Lines>
      </div>
    </section>
  );
}
