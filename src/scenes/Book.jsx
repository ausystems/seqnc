/* The last thing on the page: one sentence, one control. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { SceneHead } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { book as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Book() {
  const ref = useRef(null);
  useScene(ref, 'book', 'Final step');
  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const ctl = el.querySelector('.book__ctl'), note = el.querySelector('.book__note'), panel = el.querySelector('.book__panel');
    gsap.set([ctl, note], { opacity: 0, y: 14 });
    gsap.set(panel, { opacity: 0, y: 40 });
    ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => gsap.timeline().to(panel, { opacity: 1, y: 0, duration: 1.3, ease: EASE.out }, 0).to(ctl, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out }, 0.9).to(note, { opacity: 1, y: 0, duration: 0.8 }, 1.1) });
  });
  return (
    <section ref={ref} id="book" className="scene book" aria-labelledby="book-h">
      <div className="wrap">
        <div className="book__panel panel">
          <SceneHead label={c.label} heading={c.heading} sub={c.sub} headingId="book-h" center />
          <div className="book__ctl">
            <Magnetic as="a" href={c.cta.href} className="btn btn--fill btn--lg" strength={0.12}>
              <span className="btn__lab"><span>{c.cta.label}</span><span aria-hidden="true">{c.cta.label}</span></span>
              <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 6l6 6-6 6" /></svg>
            </Magnetic>
          </div>
          <p className="book__note small">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
