/* Level 2 — depth and the lateral camera, on a black band.  The four
   industries stand in a row far wider than the viewport; scrolling tracks
   the camera across them.  Whichever name crosses the axis is in focus. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines } from '../ui/Reveal.jsx';
import { Tear } from '../ui/Deco.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer, DESKTOP, MOBILE } from '../engine/device.js';
import { onFrame } from '../engine/input.js';
import { industries as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Industries() {
  const ref = useRef(null);
  useScene(ref, 'industries', 'Industries');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const stage = q('.ind__stage')[0];
    const track = q('.ind__track')[0];
    const items = q('.ind__item');
    const n = items.length;
    if (reduced) return undefined;

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const focus = (p) => {
        const c0 = p * (n - 1);
        items.forEach((it, i) => {
          const d = Math.abs(i - c0);
          it.querySelector('.ind__name').style.opacity = (1 - Math.min(1, d) * 0.7).toFixed(3);
          it.querySelector('.ind__name').style.transform = `translateY(${(Math.min(1, d) * 6).toFixed(2)}%)`;
          it.querySelector('.ind__body').style.opacity = Math.max(0, 1 - d * 1.5).toFixed(3);
          it.querySelector('.ind__rule').style.transform = `scaleY(${Math.max(0, 1 - d * 1.3).toFixed(3)})`;
        });
      };
      const tl = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
        scrollTrigger: {
          trigger: stage, start: 'top top', end: () => `+=${(n - 1) * 70}%`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => focus(self.progress),
        },
      });
      focus(0);
      if (finePointer) {
        const tos = items.map((it) => ({
          rx: gsap.quickTo(it, 'rotateX', { duration: 0.8, ease: 'power3' }),
          ry: gsap.quickTo(it, 'rotateY', { duration: 0.8, ease: 'power3' }),
        }));
        gsap.set(items, { transformPerspective: 1200, transformOrigin: '50% 50%' });
        let hot = -1;
        const over = (e) => { hot = items.indexOf(e.currentTarget); };
        const out = (e) => { const i = items.indexOf(e.currentTarget); tos[i].rx(0); tos[i].ry(0); if (hot === i) hot = -1; };
        items.forEach((it) => { it.addEventListener('pointerenter', over); it.addEventListener('pointerleave', out); });
        const off = onFrame((s) => {
          if (hot < 0) return;
          const r = items[hot].getBoundingClientRect();
          tos[hot].ry(((s.x - r.left) / r.width - 0.5) * 9);
          tos[hot].rx(-((s.y - r.top) / r.height - 0.5) * 6);
        });
        return () => { off(); items.forEach((it) => { it.removeEventListener('pointerenter', over); it.removeEventListener('pointerleave', out); }); tl.kill(); };
      }
      return () => tl.kill();
    });
    mm.add(MOBILE, () => {
      items.forEach((it) => {
        gsap.set(it.querySelector('.ind__name'), { opacity: 1, clearProps: 'transform' });
        gsap.set(it.querySelector('.ind__body'), { opacity: 1 });
        gsap.set(it.querySelector('.ind__rule'), { scaleY: 1 });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} id="industries" className="scene ind" aria-labelledby="ind-h">
      <div className="wrap">
        <SceneHead label={c.label} index="02" heading={c.heading} sub={c.sub} headingId="ind-h" dimLast />
      </div>

      <div className="ind__stage band">
        <Tear pos="top" seed={5} />
        <div className="ind__clip">
        <div className="ind__axis" aria-hidden="true" />
        <div className="ind__track">
          {c.items.map((it, i) => (
            <article key={it.name} className="ind__item" data-cursor="scan">
              <i className="ind__rule" aria-hidden="true" />
              <span className="u ind__idx"><span className="circ">{i + 1}</span></span>
              <h3 className="ind__name dsp">{it.name}</h3>
              <p className="ind__body">{it.body}</p>
            </article>
          ))}
        </div>
        </div>
        <Tear pos="bottom" seed={6} />
      </div>

      <div className="wrap ind__foot">
        <Lines className="note small">{c.note}</Lines>
      </div>
    </section>
  );
}
