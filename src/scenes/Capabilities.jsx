/* Level 7 — stillness, then scale.  A dense utility table that begins
   almost static; the moment a row is touched its title projects itself as
   enormous ghost type behind the table and the other rows fall back. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { onFrame } from '../engine/input.js';
import { EASE } from '../engine/tokens.js';
import { capabilities as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Capabilities() {
  const ref = useRef(null);
  useScene(ref, 'capabilities', 'Capabilities');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const rows = q('.cap__row');
    const rules = q('.cap__rule');
    const names = q('.cap__name');
    const bodies = q('.cap__body');
    const ghost = q('.cap__ghost')[0];
    const ghostT = q('.cap__ghostt')[0];
    const list = q('.cap__list')[0];

    if (!reduced) {
      gsap.set(rules, { scaleX: 0 });
      gsap.set([names, bodies], { opacity: 0, y: 14 });
      ScrollTrigger.create({
        trigger: list, start: 'top 82%', once: true,
        onEnter: () => {
          gsap.to(rules, { scaleX: 1, duration: 1.2, ease: EASE.out, stagger: 0.07 });
          gsap.to(names, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.07, delay: 0.15 });
          gsap.to(bodies, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.07, delay: 0.25 });
        },
      });
    }

    /* the projection */
    let hot = null;
    const xTo = gsap.quickTo(ghost, 'x', { duration: 1, ease: 'power3' });
    const show = (row) => {
      if (hot && hot !== row) hot.classList.remove('is-on');
      hot = row;
      row.classList.add('is-on');
      ghostT.textContent = row.querySelector('.cap__name').textContent;
      const sr = el.getBoundingClientRect(), rr = row.getBoundingClientRect();
      const y = rr.top - sr.top + rr.height / 2 - ghost.offsetHeight / 2;
      list.classList.add('is-hot');
      gsap.killTweensOf(ghost);
      gsap.fromTo(ghost, { opacity: 0, scale: 0.92, y: y + 26 },
        { opacity: 1, scale: 1, y, duration: reduced ? 0 : 0.75, ease: EASE.out });
    };
    const hide = () => {
      if (hot) hot.classList.remove('is-on');
      hot = null;
      list.classList.remove('is-hot');
      gsap.to(ghost, { opacity: 0, scale: 0.97, duration: reduced ? 0 : 0.35, ease: 'power2.out', overwrite: true });
    };
    const enter = (e) => show(e.currentTarget);
    const tap = (e) => { const r = e.currentTarget; if (hot === r) hide(); else show(r); };
    rows.forEach((r) => {
      if (finePointer) { r.addEventListener('pointerenter', enter); r.addEventListener('pointerleave', hide); }
      else r.addEventListener('click', tap);
      r.addEventListener('focus', enter);
      r.addEventListener('blur', hide);
    });
    const off = finePointer && !reduced ? onFrame((s) => { if (hot) xTo((s.nx - 0.5) * -60); }) : null;

    return () => {
      if (off) off();
      rows.forEach((r) => { r.removeEventListener('pointerenter', enter); r.removeEventListener('pointerleave', hide); r.removeEventListener('click', tap); r.removeEventListener('focus', enter); r.removeEventListener('blur', hide); });
    };
  });

  return (
    <section ref={ref} id="capabilities" className="scene cap" aria-labelledby="cap-h">
      <div className="cap__ghost dsp" aria-hidden="true"><span className="cap__ghostt" /></div>
      <div className="wrap">
        <SceneHead label={c.label} index="05" heading={c.heading} sub={c.sub} headingId="cap-h" />
      </div>
      <ul className="cap__list wrap">
        {c.items.map((it, i) => (
          <li key={it.name} className="cap__row" tabIndex={0} data-cursor="scan">
            <i className="cap__rule" aria-hidden="true" />
            <span className="u u--dim cap__idx">{String(i + 1).padStart(2, '0')}</span>
            <span className="cap__name dsp dsp--3">{it.name}</span>
            <span className="cap__body small">{it.body}</span>
          </li>
        ))}
      </ul>
      <div className="wrap"><Lines className="note small">{c.note}</Lines></div>
    </section>
  );
}
