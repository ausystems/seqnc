/* =========================================================================
   The opening.  A short lede and two actions at the top left, the ribbon
   resolving from a loose loop into a ring at the right, and the headline
   set large across the bottom of the fold.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { introDelay } from '../engine/intro.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import Ribbon from '../webgl/Ribbon.jsx';

const LINES = [0, 1, 2, 3, 4, 5];

export default function Hero() {
  const { t } = useT();
  const ref = useGsap((_, el) => {
    if (reduced) return;
    const d = introDelay();
    gsap.from(el.querySelectorAll('.gridlines i'), { scaleY: 0, duration: 1.6, ease: 'expo.out', stagger: .06, delay: d + .15 });
    gsap.from(el.querySelector('.hero__obj'), { opacity: 0, scale: .94, duration: 1.8, ease: 'expo.out', delay: d + .25 });
    gsap.from(el.querySelector('.hero__strip'), { opacity: 0, duration: 1.2, delay: d + 1.1 });
    gsap.to(el.querySelector('.hero__top'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
  }, []);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="gridlines" aria-hidden="true">{LINES.map((i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="hero__obj"><i className="hero__shadow" aria-hidden="true" /><Ribbon variant="hero" /></div>
      <div className="wrap hero__body">
        <div className="hero__top">
          <Fade now delay={.1}><Eyebrow>{t.hero.label}</Eyebrow></Fade>
          <Fade now delay={.2}><p className="hero__lede">{t.hero.lede}</p></Fade>
          <Fade now delay={.3} className="hero__actions">
            <Button href={t.calendly} calendly>{t.hero.cta}</Button>
            <MonoLink href="#systems" dim>{t.hero.secondary}</MonoLink>
          </Fade>
        </div>
        <Lines as="h1" id="hero-title" className="dsp dsp--hero hero__title" now delay={.5} stagger={.1}>
          {t.hero.titleStart}<br /><span className="grad">{t.hero.titleMuted}</span>
        </Lines>
      </div>
      <div className="hero__strip">
        <div className="wrap hero__stripin">
          <p className="mono hero__who">{t.who.label}</p>
          <p className="hero__stmt">{t.who.statement}</p>
          <ul className="hero__chips" aria-label={t.who.label}>
            {t.who.chips.map((c) => <li key={c} className="mono"><Glyph />{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
