/* Four steps on one horizontal line; the camera tracks along it. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
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
    const stage = q('.proc__stage')[0], track = q('.proc__track')[0], steps = q('.proc__step'), line = q('.proc__line')[0], packet = q('.proc__packet')[0];
    const n = steps.length;
    if (reduced) { steps.forEach((s) => s.style.setProperty('--f', 1)); return undefined; }
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const focus = (p) => { const c0 = p * (n - 1); steps.forEach((s, i) => s.style.setProperty('--f', Math.max(0, 1 - Math.abs(i - c0) * 1.4).toFixed(3))); };
      const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: () => `+=${(n - 1) * 70}%`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (self) => focus(self.progress) } });
      tl.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none' }, 0)
        .fromTo(packet, { x: 0 }, { x: () => window.innerWidth, ease: 'none' }, 0);
      focus(0);
      gsap.set(line, { scaleX: 0 });
      ScrollTrigger.create({ trigger: stage, start: 'top 70%', once: true, onEnter: () => gsap.to(line, { scaleX: 1, duration: 1.6, ease: EASE.out }) });
      return () => tl.kill();
    });
    mm.add(MOBILE, () => {
      steps.forEach((s) => s.style.setProperty('--f', 1));
      steps.forEach((s) => { const parts = s.querySelectorAll('.proc__num, .proc__title, .proc__body'); gsap.set(parts, { opacity: 0, y: 16 }); ScrollTrigger.create({ trigger: s, start: 'top 82%', once: true, onEnter: () => gsap.to(parts, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.08 }) }); });
    });
    return () => mm.revert();
  });
  return (
    <section ref={ref} id="process" className="scene proc" aria-labelledby="proc-h">
      <div className="wrap"><SceneHead label={c.label} heading={c.heading} headingId="proc-h" /></div>
      <div className="proc__stage">
        <div className="proc__line" aria-hidden="true" />
        <div className="proc__packet" aria-hidden="true" />
        <div className="proc__track">
          {c.steps.map((s, i) => (
            <article key={s.title} className="proc__step" style={{ '--f': 0 }}>
              <span className="proc__num dsp" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="proc__txt">
                <h3 className="proc__title dsp dsp--2">{s.title}</h3>
                <p className="proc__body body">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
