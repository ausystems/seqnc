/* Level 15 — the final interaction.  One statement the size of the room,
   one control, and a line that comes down from above to meet it.  The
   environment brightens as the player arrives. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { Label, Display, Lines } from '../ui/Reveal.jsx';
import { Tear } from '../ui/Deco.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { input } from '../engine/input.js';
import { EASE } from '../engine/tokens.js';
import { book as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Book() {
  const ref = useRef(null);
  useScene(ref, 'book', 'Final Step');

  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const q = gsap.utils.selector(el);
    const line = q('.book__line')[0];
    const ctl = q('.book__ctl')[0];
    const note = q('.book__note')[0];
    gsap.set(line, { scaleY: 0 });
    gsap.set(ctl, { opacity: 0, y: 24, scale: 0.94 });
    gsap.set(note, { opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', once: true,
      onEnter: () => gsap.timeline()
        .to(line, { scaleY: 1, duration: 1.4, ease: EASE.out }, 0.5)
        .to(ctl, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: EASE.snap }, 1.25)
        .to(note, { opacity: 1, duration: 0.8 }, 1.6),
    });
    ScrollTrigger.create({
      trigger: el, start: 'top 60%', end: 'bottom 40%',
      onToggle: (s) => gsap.to(input, { atmosphere: s.isActive ? 0.7 : 0, duration: 1.2, overwrite: 'auto' }),
    });
  });

  return (
    <section ref={ref} id="book" className="scene book" aria-labelledby="book-h">
      <div className="wrap book__in">
        <div className="scene__meta"><Label>{c.label}</Label><span className="u idx">13</span></div>
        <Display
          lines={[<>{c.heading[0]} <svg className="book__arrow" viewBox="0 0 100 40" aria-hidden="true"><path d="M2 20h88M74 6l16 14-16 14" fill="none" stroke="currentColor" strokeWidth="3" /></svg></>, c.heading[1], c.heading[2]]}
          headingId="book-h" className="book__hl" lineClass={(i) => (i === 2 ? 'book__r' : i === 1 ? 'book__m' : 'book__a')} />
        <Lines className="body book__sub" delay={0.3}>{c.sub}</Lines>
        <div className="book__line rule--v" aria-hidden="true" />
        <div className="book__ctl">
          <Magnetic as="a" href="mailto:hello@seqnc.ai" className="btn btn--fill btn--lg" strength={0.34} radius={70}>
            <span className="btn__lab"><span>{c.cta.label}</span><span aria-hidden="true">{c.cta.label}</span></span>
            <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 6l6 6-6 6" /></svg>
          </Magnetic>
        </div>
        <p className="book__note small">{c.note}</p>
      </div>
    </section>
  );
}
