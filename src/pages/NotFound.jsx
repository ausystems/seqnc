/* =========================================================================
   Not found.  The code is set as large as the frame allows, and the ring
   is its zero: the two fours slide in from either side and the ring turns
   into place between them.  Then the plain words, and two ways out.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { introDelay } from '../engine/intro.js';
import Seo from '../ui/Seo.jsx';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import Ribbon from '../webgl/Ribbon.jsx';

export default function NotFound() {
  const { t } = useT();
  const ref = useGsap((_, el) => {
    if (reduced) return;
    const d = introDelay();
    const [a, b] = el.querySelectorAll('.nf__d');
    gsap.from(a, { x: -60, opacity: 0, duration: 1.3, ease: 'expo.out', delay: d + .1 });
    gsap.from(b, { x: 60, opacity: 0, duration: 1.3, ease: 'expo.out', delay: d + .1 });
    gsap.from(el.querySelector('.nf__ring'), { scale: .5, rotation: -40, opacity: 0, transformOrigin: '50% 50%', duration: 1.6, ease: 'expo.out', delay: d + .2 });
    gsap.from(el.querySelector('.nf__halo'), { opacity: 0, duration: 2, delay: d + .6 });
  }, []);
  return (
    <>
      <Seo title={t.seo.notFound.title} description={t.seo.notFound.description} />
      <section className="page nf" ref={ref} aria-labelledby="nf-title">
        <div className="wrap nf__in">
          <div className="nf__code" aria-hidden="true">
            <span className="nf__d">4</span>
            <span className="nf__ring"><i className="nf__halo" /><Ribbon variant="ring" /></span>
            <span className="nf__d">4</span>
          </div>
          <p className="vh">404</p>
          <Lines as="h1" id="nf-title" className="dsp dsp--1 nf__t" now delay={.5}>{t.notFound.title}</Lines>
          <Fade now delay={.7}><p className="lead nf__body">{t.notFound.body}</p></Fade>
          <Fade now delay={.8} className="nf__acts">
            <Button to="/" name="Seqnc">{t.notFound.cta}</Button>
            <MonoLink href={t.calendly}>{t.hero.cta}</MonoLink>
          </Fade>
        </div>
      </section>
    </>
  );
}
