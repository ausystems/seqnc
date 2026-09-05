/* Light room, dark objects.  The statement is centred with air around it;
   the cubes turn slowly behind it. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import Cubes from '../webgl/Cubes.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { hero } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef(null);
  useScene(ref, 'hero', 'Opening');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    if (reduced) return undefined;
    const lines = q('.hero__hl .hl__in'), label = q('.hero__label'), lede = q('.hero__lede'), ctas = q('.hero__cta .mag'), note = q('.hero__note'), canvas = q('.hero__cubes');
    gsap.set(lines, { yPercent: 104 });
    gsap.set([label, lede, note], { opacity: 0, y: 14 });
    gsap.set(ctas, { opacity: 0, y: 12 });
    gsap.set(canvas, { opacity: 0 });
    const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
    tl.to(canvas, { opacity: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .to(label, { opacity: 1, y: 0, duration: 0.9 }, 0.2)
      .to(lines, { yPercent: 0, duration: 1.5, stagger: 0.1 }, 0.35)
      .to(lede, { opacity: 1, y: 0, duration: 1 }, 0.9)
      .to(ctas, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.1)
      .to(note, { opacity: 1, y: 0, duration: 0.9 }, 1.35);
    let dead = false;
    document.fonts.ready.then(() => { if (!dead) tl.play(); });
    gsap.to(q('.hero__copy'), { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
    return () => { dead = true; };
  });

  return (
    <section ref={ref} id="top" className="hero" aria-label="Introduction">
      <Cubes className="hero__cubes" />
      <div className="hero__copy wrap">
        <span className="hero__label u">{hero.label}</span>
        <h1 className="dsp hero__hl">
          {hero.headline.map((l, i) => <span key={l} className={`hl ${i === 1 ? 'dim' : ''}`}><span className="hl__in">{l}</span></span>)}
        </h1>
        <p className="hero__lede lead">{hero.lede}</p>
        <div className="hero__cta">
          <Magnetic as="a" href={hero.primary.href} className="btn btn--fill btn--lg">
            <span className="btn__lab"><span>{hero.primary.label}</span><span aria-hidden="true">{hero.primary.label}</span></span>
          </Magnetic>
          <Magnetic as="a" href={hero.secondary.href} className="btn btn--lg">
            <span className="btn__lab"><span>{hero.secondary.label}</span><span aria-hidden="true">{hero.secondary.label}</span></span>
            <svg className="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </Magnetic>
        </div>
        <p className="hero__note small">{hero.note}</p>
      </div>
    </section>
  );
}
