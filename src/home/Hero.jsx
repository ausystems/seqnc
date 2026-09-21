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
import Button, { MonoLink } from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import Ribbon from '../webgl/Ribbon.jsx';

export default function Hero() {
  const { t } = useT();
  const ref = useGsap((_, el) => {
    if (reduced) return;
    const d = introDelay();
    gsap.from(el.querySelector('.hero__obj'), { opacity: 0, scale: .94, duration: 1.8, ease: 'expo.out', delay: d + .25 });
    gsap.from(el.querySelector('.hero__strip'), { opacity: 0, duration: 1.2, delay: d + 1.1 });
    gsap.from(el.querySelectorAll('.hero__who, .hero__stmt, .hero__chips li'), { y: 10, opacity: 0, duration: .9, ease: 'expo.out', stagger: .06, delay: d + 1.2, clearProps: 'transform' });
    gsap.to(el.querySelector('.hero__top'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
  }, []);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__obj"><i className="hero__shadow" aria-hidden="true" /><Ribbon variant="hero" /></div>
      <div className="wrap hero__body">
        <div className="hero__top">
          <Fade now delay={.2}><p className="hero__lede">{t.hero.lede}</p></Fade>
          <Fade now delay={.3} className="hero__actions">
            <Button href={t.calendly} calendly>{t.hero.cta}</Button>
            <MonoLink href="#systems" dim>{t.hero.secondary}</MonoLink>
          </Fade>
          <Fade now delay={.4}><p className="hero__note">{t.hero.note}</p></Fade>
        </div>
        <Lines as="h1" id="hero-title" className="dsp dsp--hero hero__title" now delay={.5} stagger={.1}>
          {t.hero.titleStart}<br /><span className="hi">{t.hero.titleMuted}</span>
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
