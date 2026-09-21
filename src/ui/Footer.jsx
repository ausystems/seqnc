/* =========================================================================
   The footer, on violet.  The wordmark stands at the top as one deep,
   extruded object, rising out of the page and cropped by the right edge;
   under it the last word and its action, the four short columns, and the
   line with the year.  This is also the closing of every page.
   ========================================================================= */
import { useMemo } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import { useT } from '../i18n.jsx';
import { A } from '../engine/transition.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Button from './Button.jsx';
import { Lines, Fade } from './Reveal.jsx';
import { Brand, Lang, SECTIONS } from './Nav.jsx';

/* The extrusion: the word repeated behind itself, step by step, up and a
   little to the right, from a deep violet at the face to a lit edge at the
   far end.  Built once; the steps are in em so it scales with the word. */
const STEPS = 64;
const mix = (a, b, t) => Math.round(a + (b - a) * t);
function extrusion() {
  const near = [0x4b, 0x25, 0x9c], far = [0xa9, 0x86, 0xf0];
  const out = [];
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS, k = Math.pow(t, 1.6);
    const c = `rgb(${mix(near[0], far[0], k)},${mix(near[1], far[1], k)},${mix(near[2], far[2], k)})`;
    out.push(`${(i * 0.0021).toFixed(4)}em ${(-i * 0.0058).toFixed(4)}em 0 ${c}`);
  }
  return out.join(',');
}

export default function Footer() {
  const { t } = useT();
  const location = useLocation();
  const home = location.pathname === '/';
  const c = t.closing;
  const shadow = useMemo(extrusion, []);
  const hash = (id) => (home ? `#${id}` : `/#${id}`);
  const HashLink = ({ id, children }) => (
    <a href={hash(id)} className="lnk" onClick={(e) => { if (!home) { e.preventDefault(); window.location.assign(`/#${id}`); } }}>{children}</a>
  );
  const ref = useGsap((_, el) => {
    if (reduced) return;
    /* the word stands up as the footer comes into view */
    gsap.fromTo(el.querySelector('.foot__word'), { yPercent: 34, rotateX: 46 }, {
      yPercent: 0, rotateX: 24, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: .6 },
    });
  }, []);
  return (
    <footer className="foot" role="contentinfo" ref={ref}>
      <div className="foot__stage" aria-hidden="true">
        <p className="foot__word" style={{ textShadow: shadow }}>seqnc</p>
      </div>
      <div className="wrap foot__row">
        <Brand className="foot__brand" />
        <p className="mono foot__place">{t.ui.founded}</p>
      </div>
      <div className="wrap foot__body">
        <div className="foot__cta">
          <Lines as="h2" id="foot-title" className="dsp dsp--1 foot__title" stagger={.1}>{c.titleStart}<br /><span className="hi">{c.titleAccent}</span></Lines>
          <Fade><p className="lead foot__lead">{c.body}</p></Fade>
          <Fade className="foot__act" delay={.1}><Button href={t.calendly} calendly>{c.cta}</Button></Fade>
          <Fade delay={.15}><p className="mono foot__note">{c.note}</p></Fade>
        </div>
        <nav className="foot__cols" aria-label="Footer">
          <Fade className="foot__col" delay={.05}>
            <h2 className="mono foot__h">{t.ui.site}</h2>
            <ul>
              {SECTIONS.map((s) => <li key={s.id}><HashLink id={s.id}>{t.nav[s.key]}</HashLink></li>)}
              <li><HashLink id="faq">{t.ui.faq}</HashLink></li>
            </ul>
          </Fade>
          <Fade className="foot__col" delay={.12}>
            <h2 className="mono foot__h">{t.ui.demos}</h2>
            <ul>
              <li><a className="lnk" href={t.demos.inbound.href}>{t.demos.inbound.tag}</a></li>
              <li><a className="lnk" href={t.demos.operations.href}>{t.demos.operations.tag}</a></li>
              <li><a className="lnk" href={t.demos.outbound.href}>{t.demos.outbound.tag}</a></li>
            </ul>
          </Fade>
          <Fade className="foot__col" delay={.19}>
            <h2 className="mono foot__h">{t.ui.contact}</h2>
            <ul>
              <li><A className="lnk" to="/free-review" name={t.review.label}>{t.nav.cta}</A></li>
              <li><a className="lnk" href={`mailto:${t.email}`}>{t.email}</a></li>
            </ul>
          </Fade>
          <Fade className="foot__col" delay={.26}>
            <h2 className="mono foot__h">{t.ui.legal}</h2>
            <ul>
              <li><A className="lnk" to="/privacy" name={t.footer.privacy}>{t.footer.privacy}</A></li>
              <li><A className="lnk" to="/terms" name={t.footer.terms}>{t.footer.terms}</A></li>
            </ul>
          </Fade>
        </nav>
      </div>
      <div className="wrap foot__bottom">
        <p className="mono foot__copy">© {new Date().getFullYear()} {t.ui.rights}</p>
        <p className="mono--s foot__tag">{t.footer.tagline}</p>
        <Lang className="foot__lang" />
      </div>
    </footer>
  );
}
