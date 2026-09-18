/* =========================================================================
   The opening.  Left, the sentence; right, the ribbon resolving from a loose
   loop into a ring, cropped by the edge of the page.  Beneath, who this is
   for, set where a logo strip would go.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { A } from '../engine/transition.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import Ribbon from '../webgl/Ribbon.jsx';

const LINES = [0, 1, 2, 3, 4, 5];

export default function Hero() {
  const { t } = useT();
  const ref = useGsap((_, el) => {
    if (reduced) return;
    gsap_intro(el);
  }, []);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="gridlines" aria-hidden="true">{LINES.map((i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__obj"><Ribbon variant="hero" /></div>
      <div className="wrap hero__body">
        <div className="hero__copy">
          <Fade now delay={.1} className="hero__eyebrow"><Eyebrow>{t.hero.label}</Eyebrow></Fade>
          <Lines as="h1" id="hero-title" className="dsp dsp--hero hero__title" now delay={.22}>
            {t.hero.titleStart}<br /><em className="accent">{t.hero.titleMuted}</em>
          </Lines>
          <Fade now delay={.75}><p className="lead hero__lede">{t.hero.body}</p></Fade>
          <Fade now delay={.9} className="hero__cta"><Button href={t.calendly} calendly>{t.hero.cta}</Button></Fade>
          <Fade now delay={1.05}>
            <p className="hero__note small">{t.hero.note} <A className="lnk hero__notelink" to="/free-review" name={t.review.label}>{t.hero.noteLink}</A></p>
          </Fade>
        </div>
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

import { gsap } from 'gsap';
function gsap_intro(el) {
  const lines = el.querySelectorAll('.gridlines i');
  gsap.from(lines, { scaleY: 0, duration: 1.6, ease: 'expo.out', stagger: .06, delay: .15 });
  gsap.from(el.querySelector('.hero__obj'), { opacity: 0, scale: .94, duration: 1.8, ease: 'expo.out', delay: .25 });
  gsap.from(el.querySelector('.hero__strip'), { opacity: 0, duration: 1.2, delay: 1.1 });
  /* the sentence drifts up a little slower than the page, the object a little faster */
  gsap.to(el.querySelector('.hero__copy'), { yPercent: -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
}
