/* Level 11 — level select.  Three cartridges share one row.  The one the
   player reaches for opens wide and pushes the others aside; its brief and
   its control appear inside; the cursor says Play. */
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { demos as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Demos() {
  const ref = useRef(null);
  useScene(ref, 'demos', 'Live Demos');
  const [active, setActive] = useState(finePointer ? -1 : 0);

  useGsap(ref, (ctx, el) => {
    const carts = gsap.utils.selector(el)('.demo__cart');
    if (reduced) return;
    gsap.set(carts, { y: 60, opacity: 0 });
    ScrollTrigger.create({
      trigger: el.querySelector('.demo__row'), start: 'top 80%', once: true,
      onEnter: () => gsap.to(carts, { y: 0, opacity: 1, duration: 1.1, ease: EASE.out, stagger: 0.1 }),
    });
  });

  const rowClass = `demo__row ${active >= 0 ? 'has-active' : ''}`;

  return (
    <section ref={ref} id="demos" className="scene demo" aria-labelledby="demo-h">
      <div className="wrap">
        <SceneHead label={c.label} index="09" heading={c.heading} sub={c.sub} headingId="demo-h" />
      </div>

      <div className="demo__film wrap">
        <div className={rowClass} onPointerLeave={finePointer ? () => setActive(-1) : undefined}>
          {c.items.map((it, i) => (
            <article
              key={it.name}
              className={`demo__cart ${active === i ? 'is-active' : ''}`}
              data-cursor="play"
              tabIndex={0}
              onPointerEnter={finePointer ? () => setActive(i) : undefined}
              onFocus={() => setActive(i)}
              onClick={!finePointer ? () => setActive(i) : undefined}
              aria-expanded={active === i}
            >
              <span className="u demo__idx"><span>Seqnc</span><span>Demo {String(i + 1).padStart(2, '0')}</span><span>{c.meta}</span></span>
              <h3 className="demo__name dsp dsp--2">{it.name}</h3>
              <div className="demo__more">
                <div className="demo__morein">
                  <p className="small demo__body">{it.body}</p>
                  <a className="demo__link u lnk" href={it.href} data-cursor="play">{it.link} <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
