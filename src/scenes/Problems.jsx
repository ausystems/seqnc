/* Level 3 — the cursor as a light.  A serif statement with small pictures
   set into it; below, twelve problems in a ruled ledger, dormant, that the
   pointer makes legible where it passes.  Hold still and the whole ledger
   reveals itself; without a pointer, scrolling does it. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines, Display } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { onFrame } from '../engine/input.js';
import { EASE } from '../engine/tokens.js';
import { problems as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Problems() {
  const ref = useRef(null);
  useScene(ref, 'problems', 'Diagnosis');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const field = q('.prob__field')[0];
    if (reduced) { field.classList.add('is-open'); return undefined; }

    const dim = q('.prob__list--dim li');
    gsap.set(dim, { opacity: 0, y: 10 });
    ScrollTrigger.create({
      trigger: field, start: 'top 82%', once: true,
      onEnter: () => gsap.to(dim, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.05 }),
    });

    let active = false, r = 0, scrollR = 0, rect = field.getBoundingClientRect(), n = 0;
    ScrollTrigger.create({
      trigger: field, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { active = self.isActive; if (!active) field.style.setProperty('--r', '0px'); },
      onUpdate: (self) => {
        scrollR = gsap.utils.clamp(0, 1, (self.progress - 0.12) / 0.5) * 1700;
        if (!finePointer) { field.style.setProperty('--mx', '50%'); field.style.setProperty('--my', '50%'); field.style.setProperty('--r', `${Math.round(scrollR)}px`); }
      },
    });
    if (!finePointer) return undefined;

    const off = onFrame((s) => {
      if (!active) return;
      if (++n % 5 === 0) rect = field.getBoundingClientRect();
      const inside = s.present && s.y > rect.top - 160 && s.y < rect.bottom + 160;
      const stillness = Math.min(1, Math.max(0, (s.still - 0.6) / 2.6));
      let target = inside ? 180 + stillness * stillness * 1500 : 0;
      if (!s.present) target = scrollR;
      r += (target - r) * (target > r ? 0.05 : 0.12);
      if (s.present) { field.style.setProperty('--mx', `${(s.sx - rect.left).toFixed(1)}px`); field.style.setProperty('--my', `${(s.sy - rect.top).toFixed(1)}px`); }
      else { field.style.setProperty('--mx', '50%'); field.style.setProperty('--my', '50%'); }
      field.style.setProperty('--r', `${r.toFixed(1)}px`);
    });
    return () => off();
  });

  const statement = [
    c.statement[0],
    c.statement[1],
  ];

  return (
    <section ref={ref} id="problems" className="scene prob" aria-labelledby="prob-h">
      <div className="wrap">
        <SceneHead label={c.label} index="03" heading={c.heading} headingId="prob-h" dimLast />
      </div>

      <div className="wrap g12 prob__st">
        <div className="prob__stw">
          <Display as="p" lines={statement} serif size={2} className="prob__statement" lineClass={(i) => (i === 0 ? 'prob__l1' : 'prob__l2')} />
        </div>
        <Lines className="body prob__body" delay={0.25}>{c.body}</Lines>
      </div>

      <div className="wrap">
        <div className="prob__field" data-cursor="scan" role="list" aria-label="Common problems">
          <ol className="prob__list prob__list--dim" aria-hidden="true">
            {c.items.map((t, i) => <li key={t}><span className="u">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
          </ol>
          <ol className="prob__list prob__list--lit">
            {c.items.map((t, i) => <li key={t} role="listitem"><span className="u">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
          </ol>
        </div>
        <Lines className="note small">{c.note}</Lines>
      </div>
    </section>
  );
}
