/* Level 0 — the opening.  Ink.  A rule draws the grid, a bracketed label
   types, the statement assembles from depth in condensed capitals, the
   controls arrive last.  The isometric grid beneath is the original
   background animation, loaded untouched. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { typeIn } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { onFrame } from '../engine/input.js';
import { finePointer, reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { hero } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef(null);
  useScene(ref, 'hero', 'Opening');

  useEffect(() => {
    if (window.__seqncGrid) return;
    window.__seqncGrid = true;
    const s = document.createElement('script');
    s.src = '/grid.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const hl = q('.hero__hl')[0];
    const lines = q('.hero__hl .hl__in');
    const tags = q('.hero__tag');
    const rule = q('.hero__rule');
    const label = q('.hero__labelt')[0];
    const brackets = q('.hero__label i');
    const lede = q('.hero__lede');
    const ctas = q('.hero__cta .mag');
    const note = q('.hero__note');

    if (reduced) return undefined;

    gsap.to(q('.hero__bottom'), {
      yPercent: -12, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.set(hl, { perspective: 1000 });
    gsap.set(lines, { yPercent: 112, rotateX: -30, z: -180, transformOrigin: '50% 100%' });
    gsap.set(tags, { x: -22, opacity: 0 });
    gsap.set(rule, { scaleX: 0 });
    gsap.set(brackets, { opacity: 0 });
    gsap.set([lede, note], { opacity: 0, y: 16 });
    gsap.set(ctas, { opacity: 0, y: 14, scale: 0.96 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
    tl.to(rule, { scaleX: 1, duration: 1.2 }, 0.1)
      .to(brackets, { opacity: 1, duration: 0.4 }, 0.25)
      .add(() => typeIn(label), 0.3)
      .to(lines, { yPercent: 0, rotateX: 0, z: 0, duration: 1.5, stagger: 0.1 }, 0.45)
      .to(tags, { x: 0, opacity: 1, duration: 0.7, stagger: 0.05 }, 1.2)
      .to(lede, { opacity: 1, y: 0, duration: 0.9 }, 1.2)
      .to(ctas, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.09, ease: EASE.snap }, 1.35)
      .to(note, { opacity: 1, y: 0, duration: 0.8 }, 1.6);

    let dead = false;
    document.fonts.ready.then(() => { if (!dead) tl.play(); });

    if (finePointer) {
      const xTo = gsap.quickTo(hl, 'x', { duration: 1.1, ease: 'power3' });
      const yTo = gsap.quickTo(hl, 'y', { duration: 1.1, ease: 'power3' });
      const sk = gsap.quickTo(hl, 'skewX', { duration: 0.8, ease: 'power3' });
      const off = onFrame((s) => {
        if (!s.present) { xTo(0); yTo(0); sk(0); return; }
        xTo((s.nx - 0.5) * -18);
        yTo((s.ny - 0.5) * -10);
        sk(gsap.utils.clamp(-2.2, 2.2, s.vx / 1200));
      });
      return () => { dead = true; off(); };
    }
    return () => { dead = true; };
  });

  return (
    <section ref={ref} id="top" className="hero scene" aria-label="Introduction">
      <canvas id="grid" aria-hidden="true" />

      <div className="hero__bottom wrap">
        <div className="hero__rule rule rule--2" aria-hidden="true" />
        <span className="hero__label u tag"><i aria-hidden="true">[</i><span className="hero__labelt">{hero.label}</span><i aria-hidden="true">]</i></span>
        <div className="dsp-v hero__hlw">
          <h1 className="dsp hero__hl">
            {hero.headline.map((l) => (
              <span key={l} className="hl"><span className="hl__in">{l}</span></span>
            ))}
          </h1>
        </div>
        <ul className="hero__tags u" aria-label="What we automate">
          {hero.tags.map((t) => <li key={t} className="hero__tag">{t}</li>)}
        </ul>

        <div className="hero__right">
          <p className="hero__lede deck">{hero.lede}</p>
          <div className="hero__cta">
            <Magnetic as="a" href={hero.secondary.href} className="btn">
              <span className="btn__lab"><span>{hero.secondary.label}</span><span aria-hidden="true">{hero.secondary.label}</span></span>
            </Magnetic>
            <Magnetic as="a" href={hero.primary.href} className="btn btn--fill">
              <span className="btn__lab"><span>{hero.primary.label}</span><span aria-hidden="true">{hero.primary.label}</span></span>
              <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 6l6 6-6 6" /></svg>
            </Magnetic>
          </div>
          <p className="hero__note small">{hero.note}</p>
        </div>
      </div>
    </section>
  );
}
