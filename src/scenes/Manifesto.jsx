/* Level 1 — the position.  The ink of the opening tears into paper.  The
   statement fills the sheet; as the player scrolls, a rule strikes through
   the last word and its letters shift.  A halftone sphere hangs beside it
   and leans with the pointer. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Label, Lines, Deck } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, DESKTOP, MOBILE } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { manifesto as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const ref = useRef(null);
  useScene(ref, 'what', 'Position');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const pin = q('.mani__pin')[0];
    const lines = q('.mani__hl .hl__in');
    const chars = q('.mani__ch');
    const strike = q('.mani__line')[0];
    const stats = q('.mani__stat');
    const nums = q('.mani__num[data-count]');
    if (reduced) return undefined;

    gsap.set(q('.mani__hl'), { perspective: 900 });
    gsap.set(lines, { yPercent: 104 });
    ScrollTrigger.create({
      trigger: el, start: 'top 70%', once: true,
      onEnter: () => {
        gsap.to(lines, { yPercent: 0, duration: 1.4, ease: EASE.out, stagger: 0.08 });
      },
    });

    const build = () => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, 0)
        .to(chars, {
          opacity: 0.4, duration: 0.5, ease: 'power2.inOut', stagger: { each: 0.03, from: 'center' },
        }, 0.18)
        .fromTo(stats, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, 0.3);
      nums.forEach((n) => {
        const target = +n.dataset.count, o = { v: 0 };
        tl.to(o, { v: target, duration: 0.5, ease: 'power2.out', onUpdate: () => { n.textContent = Math.round(o.v); } }, 0.32);
      });
      return tl;
    };

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const tl = build();
      ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=120%', pin, scrub: 0.7, animation: tl, anticipatePin: 1 });
    });
    mm.add(MOBILE, () => {
      const tl = build().pause();
      tl.timeScale(0.55);
      ScrollTrigger.create({ trigger: q('.mani__strike')[0], start: 'top 62%', once: true, onEnter: () => tl.play() });
    });

    return () => mm.revert();
  });

  const plain = c.heading.slice(0, -1), word = c.heading[c.heading.length - 1];

  return (
    <section ref={ref} id="what" className="scene mani" aria-labelledby="mani-h">
      <div className="mani__pin wrap">
        <div className="scene__meta">
          <Label>{c.label}</Label>
          <span className="u idx">01</span>
        </div>
        <div className="mani__row">
          <div className="dsp-v">
            <h2 id="mani-h" className="dsp dsp--1 mani__hl">
              {plain.map((l) => <span key={l} className="hl"><span className="hl__in">{l}</span></span>)}
              <span className="hl mani__strike">
                <span className="hl__in">
                  <span className="mani__word" aria-label={word}>
                    {word.split('').map((ch, i) => <span key={i} className="mani__ch" aria-hidden="true">{ch}</span>)}
                  </span>
                  <i className="mani__line" aria-hidden="true" />
                </span>
              </span>
            </h2>
          </div>
        </div>
        <Deck className="mani__sub">{c.sub}</Deck>

        <ul className="mani__stats" aria-label="Key facts">
          {c.stats.map((s) => {
            const numeric = /^\d+$/.test(s.value);
            return (
              <li key={s.label} className="mani__stat">
                <span className="u u--dim">{s.label}</span>
                <span className="mani__val dsp">
                  <span className="mani__num" data-count={numeric ? s.value : undefined}>{numeric ? '0' : s.value}</span>
                  {s.unit && <span className="mani__unit">{s.unit}</span>}
                </span>
                <span className="small">{s.note}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mani__after wrap g12">
        <Lines className="mani__lead deck" delay={0}>{c.body[0]}</Lines>
        <Lines className="mani__p body" delay={0.15}>{c.body[1]}</Lines>
      </div>
    </section>
  );
}
