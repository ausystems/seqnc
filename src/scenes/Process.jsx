/* Level 9 — the horizontal camera.  Four steps stand on one long line;
   scrolling dollies the camera along it while a signal travels the line
   ahead of the player.  The step under the axis fills in. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, DESKTOP, MOBILE } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { process as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const ref = useRef(null);
  useScene(ref, 'process', 'Process');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const stage = q('.proc__stage')[0];
    const track = q('.proc__track')[0];
    const steps = q('.proc__step');
    const packet = q('.proc__packet')[0];
    const line = q('.proc__line')[0];
    const n = steps.length;
    if (reduced) { steps.forEach((s) => s.style.setProperty('--f', 1)); return; }

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const focus = (p) => {
        const c0 = p * (n - 1);
        steps.forEach((s, i) => s.style.setProperty('--f', Math.max(0, 1 - Math.abs(i - c0) * 1.6).toFixed(3)));
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage, start: 'top top', end: () => `+=${(n - 1) * 80}%`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => focus(self.progress),
        },
      });
      tl.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none' }, 0)
        .fromTo(packet, { x: 0 }, { x: () => window.innerWidth, ease: 'none' }, 0);
      focus(0);
      gsap.set(line, { scaleX: 0 });
      ScrollTrigger.create({ trigger: stage, start: 'top 70%', once: true, onEnter: () => gsap.to(line, { scaleX: 1, duration: 1.6, ease: EASE.out }) });
      return () => tl.kill();
    });
    mm.add(MOBILE, () => {
      steps.forEach((s) => s.style.setProperty('--f', 1));
      gsap.set(line, { scaleY: 0 });
      ScrollTrigger.create({ trigger: stage, start: 'top 75%', once: true, onEnter: () => gsap.to(line, { scaleY: 1, duration: 1.8, ease: EASE.out }) });
      steps.forEach((s) => {
        const parts = s.querySelectorAll('.proc__num, .proc__title, .proc__body');
        gsap.set(parts, { opacity: 0, y: 18 });
        ScrollTrigger.create({ trigger: s, start: 'top 82%', once: true, onEnter: () => gsap.to(parts, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.08 }) });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} id="process" className="scene proc" aria-labelledby="proc-h">
      <div className="wrap">
        <SceneHead label={c.label} index="07" heading={c.heading} sub={c.sub} headingId="proc-h" />
      </div>

      <div className="proc__stage">
        <div className="proc__line" aria-hidden="true" />
        <div className="proc__packet" aria-hidden="true" />
        <div className="proc__track">
          {c.steps.map((s, i) => (
            <article key={s.title} className="proc__step" style={{ '--f': 0 }}>
              <span className="proc__num dsp" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="proc__txt">
                <span className="u proc__meta"><span className="circ">{i + 1}</span><span>Step {String(i + 1).padStart(2, '0')}</span></span>
                <h3 className="proc__title dsp dsp--3">{s.title}</h3>
                <p className="proc__body small">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wrap"><Lines className="note small">{c.note}</Lines></div>
    </section>
  );
}
