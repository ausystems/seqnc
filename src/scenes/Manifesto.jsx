/* The position.  Five tasks lie scattered, as if handled by hand; as the
   player scrolls they settle into one neat stack.  The caption follows. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
import { Stack } from '../ui/Visuals.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, DESKTOP, MOBILE } from '../engine/device.js';
import { manifesto as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

const SCATTER = [
  [-150, -120, -18, 22], [130, -100, 14, -18], [-60, 60, -9, 12], [150, 110, 20, -8], [-140, 150, -14, 16],
];

export default function Manifesto() {
  const ref = useRef(null);
  useScene(ref, 'what', 'Position');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const cards = q('.stack__card'), caps = q('.mani__cap span'), stats = q('.mani__stat'), nums = q('[data-count]');
    const rest = (i) => ({ x: '-50%', y: '-50%', xPercent: 0, yPercent: 0, rotate: 0, rotateY: -14, rotateX: 8, z: i * 6, translateY: -i * 8 });
    cards.forEach((card, i) => gsap.set(card, { x: '-50%', y: '-50%', translateX: SCATTER[i][0], translateY: SCATTER[i][1], rotate: SCATTER[i][2], rotateY: SCATTER[i][3], rotateX: 0, z: 0 }));
    gsap.set(caps[1], { opacity: 0, y: 8 });
    if (reduced) { cards.forEach((card, i) => gsap.set(card, { translateX: 0, translateY: -i * 8, rotate: 0, rotateY: -14, rotateX: 8, z: i * 6 })); return undefined; }

    const build = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      cards.forEach((card, i) => tl.to(card, { translateX: 0, translateY: -i * 8, rotate: 0, rotateY: -14, rotateX: 8, z: i * 6, duration: 1 }, i * 0.08));
      tl.to(caps[0], { opacity: 0, y: -8, duration: 0.3 }, 0.75)
        .to(caps[1], { opacity: 1, y: 0, duration: 0.3 }, 0.85)
        .fromTo(stats, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.7);
      nums.forEach((n) => { const o = { v: 0 }; tl.to(o, { v: +n.dataset.count, duration: 0.6, ease: 'power2.out', onUpdate: () => { n.textContent = Math.round(o.v); } }, 0.7); });
      return tl;
    };
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => { ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=130%', pin: q('.mani__pin')[0], scrub: 0.8, animation: build(), anticipatePin: 1 }); });
    mm.add(MOBILE, () => { const tl = build().pause(); tl.timeScale(0.5); ScrollTrigger.create({ trigger: q('.stack')[0], start: 'top 65%', once: true, onEnter: () => tl.play() }); });
    return () => mm.revert();
  });

  return (
    <section ref={ref} id="what" className="scene mani" aria-labelledby="mani-h">
      <div className="mani__pin wrap g12">
        <div className="mani__copy">
          <SceneHead label={c.label} heading={c.heading} sub={c.sub} headingId="mani-h" />
          <ul className="mani__stats" aria-label="Key facts">
            {c.stats.map((s) => {
              const numeric = /^\d+$/.test(s.value);
              return (
                <li key={s.label} className="mani__stat">
                  <span className="mani__val dsp"><span data-count={numeric ? s.value : undefined}>{numeric ? '0' : s.value}</span>{s.unit && <em>{s.unit}</em>}</span>
                  <span className="small">{s.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mani__obj">
          <Stack labels={c.cards} />
          <p className="mani__cap u"><span>{c.captions[0]}</span><span>{c.captions[1]}</span></p>
        </div>
      </div>
    </section>
  );
}
