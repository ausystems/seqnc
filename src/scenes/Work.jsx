/* Level 10 — the case.  One screen, two states.  A wipe follows the
   pointer across the panel so the player can pull the "after" over the
   "before" themselves; when they let go it keeps drifting with the scroll.
   Holding the panel brightens the whole environment. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { SceneHead, Lines, Display, Label } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { input, onFrame } from '../engine/input.js';
import { work as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const ref = useRef(null);
  useScene(ref, 'work', 'Case Study');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const panel = q('.work__panel')[0];
    const set = (v) => panel.style.setProperty('--w', `${(v * 100).toFixed(2)}%`);
    if (reduced) { set(0.5); return undefined; }

    let w = 0.12, target = 0.12, hold = false, drag = false, rect = panel.getBoundingClientRect(), n = 0;
    set(w);

    /* drift: the wipe travels with the scroll when nobody is holding it */
    ScrollTrigger.create({
      trigger: panel, start: 'top 85%', end: 'bottom 15%',
      onUpdate: (self) => { if (!hold && !drag) target = 0.12 + self.progress * 0.76; },
    });

    const frame = () => {
      if (++n % 6 === 0) rect = panel.getBoundingClientRect();
      w += (target - w) * (hold || drag ? 0.18 : 0.06);
      set(w);
    };
    const off = onFrame(frame);

    if (finePointer) {
      const enter = () => { hold = true; gsap.to(input, { atmosphere: 0.85, duration: 0.8 }); };
      const leave = () => { hold = false; gsap.to(input, { atmosphere: 0, duration: 1.2 }); };
      const move = (e) => { if (hold) target = gsap.utils.clamp(0.04, 0.96, (e.clientX - rect.left) / rect.width); };
      panel.addEventListener('pointerenter', enter);
      panel.addEventListener('pointerleave', leave);
      panel.addEventListener('pointermove', move, { passive: true });
      return () => { off(); panel.removeEventListener('pointerenter', enter); panel.removeEventListener('pointerleave', leave); panel.removeEventListener('pointermove', move); };
    }

    /* touch: drag the seam */
    const down = (e) => { drag = true; panel.setPointerCapture(e.pointerId); rect = panel.getBoundingClientRect(); target = gsap.utils.clamp(0.04, 0.96, (e.clientX - rect.left) / rect.width); };
    const move = (e) => { if (drag) target = gsap.utils.clamp(0.04, 0.96, (e.clientX - rect.left) / rect.width); };
    const up = () => { drag = false; };
    panel.addEventListener('pointerdown', down);
    panel.addEventListener('pointermove', move);
    panel.addEventListener('pointerup', up);
    panel.addEventListener('pointercancel', up);
    return () => { off(); panel.removeEventListener('pointerdown', down); panel.removeEventListener('pointermove', move); panel.removeEventListener('pointerup', up); panel.removeEventListener('pointercancel', up); };
  });

  return (
    <section ref={ref} id="work" className="scene work" aria-labelledby="work-h">
      <div className="wrap">
        <SceneHead label={c.label} index="08" heading={c.heading} headingId="work-h" />
      </div>

      <div className="wrap g12 work__row">
        <div className="work__panel frame" data-cursor="drag" style={{ '--w': '12%' }} aria-label="Before and after comparison">
          <div className="work__screen work__screen--before band" aria-hidden="true">
            <span className="u tag"><i aria-hidden="true">[</i>Before<i aria-hidden="true">]</i></span>
            <p>{c.before}</p>
            <div className="work__bits"><i /><i /><i /></div>
            <div className="work__rows"><i /><i /><i /><i /></div>
          </div>
          <div className="work__screen work__screen--after">
            <span className="u tag"><i aria-hidden="true">[</i>After<i aria-hidden="true">]</i></span>
            <p>{c.after}</p>
            <div className="work__bits work__bits--on"><i /><i /><i /></div>
            <div className="work__rows work__rows--on"><i /><i /><i /><i /></div>
          </div>
          <div className="work__seam" aria-hidden="true"><i /></div>
        </div>

        <div className="work__copy">
          <div className="scene__meta"><Label>{c.label}</Label></div>
          <Display lines={[c.client]} as="h3" size={2} />
          <p className="deck work__where"><em>{c.where}</em></p>
          <Lines className="body work__body" delay={0.25}>{c.body}</Lines>
          <ul className="ticks">{c.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
          <Magnetic as="a" href={c.cta.href} className="btn btn--ghost">
            <span className="btn__lab"><span>{c.cta.label}</span><span aria-hidden="true">{c.cta.label}</span></span>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
