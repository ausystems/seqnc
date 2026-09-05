/* Level 14 — the questions.  A ruled list.  Opening one pulls the others
   out of focus; the answer rises line by line under its own rule. */
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, riseLines } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { faq as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Faq() {
  const ref = useRef(null);
  useScene(ref, 'faq', 'Questions');
  const [open, setOpen] = useState(0);

  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const items = gsap.utils.selector(el)('.faq__item');
    gsap.set(items, { '--draw': 0, opacity: 0 });
    ScrollTrigger.create({
      trigger: el.querySelector('.faq'), start: 'top 82%', once: true,
      onEnter: () => gsap.to(items, { '--draw': 1, opacity: 1, duration: 1.2, ease: EASE.out, stagger: 0.06 }),
    });
  });

  const toggle = (i, e) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next >= 0 && !reduced) {
      const p = e.currentTarget.parentElement.querySelector('.faq__a p');
      requestAnimationFrame(() => riseLines(p, { duration: 0.7, stagger: 0.05, distance: 60 }));
    }
  };

  return (
    <section ref={ref} id="faq" className="scene faq-s" aria-labelledby="faq-h">
      <div className="wrap wrap--narrow">
        <SceneHead label={c.label} index="12" heading={c.heading} sub={c.sub} headingId="faq-h" />
        <ul className={`faq ${open >= 0 ? 'has-open' : ''}`}>
          {c.items.map((it, i) => (
            <li key={it.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <button type="button" className="faq__q" aria-expanded={open === i} aria-controls={`fa${i}`} onClick={(e) => toggle(i, e)} data-cursor="open">
                <span className="faq__qt">{it.q}</span>
                <i className="faq__ic" aria-hidden="true" />
              </button>
              <div className="faq__a" id={`fa${i}`} role="region"><div><p className="body">{it.a}</p></div></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
