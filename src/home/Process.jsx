/* =========================================================================
   The TimeBack Method.  The one night chapter.  Four steps along a line
   that fills as the page is held in place; a ring completes beside them.
   Small screens and reduced motion read it as a plain column.
   ========================================================================= */
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n.jsx';
import { useGsap, useMedia } from '../engine/hooks.js';
import { DESKTOP, reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Fade } from '../ui/Reveal.jsx';

gsap.registerPlugin(ScrollTrigger);

const R = 92, C = 2 * Math.PI * R;

export default function Process() {
  const { t } = useT();
  const p = t.process;
  const desktop = useMedia(DESKTOP);
  const pinned = desktop && !reduced;

  const ref = useGsap((_, el) => {
    /* tell the bar it is over night */
    const theme = ScrollTrigger.create({
      trigger: el, start: 'top 60px', end: 'bottom 60px',
      onToggle: (self) => window.dispatchEvent(new CustomEvent('seqnc:navtheme', { detail: self.isActive ? 'dark' : 'light' })),
    });
    const steps = el.querySelectorAll('.pstep');
    const prog = el.querySelector('.process__prog');
    const arc = el.querySelector('.ring__arc');
    const counter = el.querySelector('.ring__n');
    const total = steps.length;
    if (!pinned) {
      steps.forEach((s) => s.classList.add('is-on'));
      gsap.set(prog, { scaleX: 1 });
      gsap.set(arc, { strokeDashoffset: 0 });
      if (counter) counter.textContent = t.ui.stepOf(total, total);
      return () => theme.kill();
    }
    gsap.to(el.querySelector('.ring__hex'), { rotation: 360, transformOrigin: '50% 50%', duration: 40, ease: 'none', repeat: -1 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el.querySelector('.process__pin'), start: 'top top', end: '+=140%', pin: true, scrub: .7, anticipatePin: 1 },
    });
    tl.fromTo(prog, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
      .fromTo(arc, { strokeDashoffset: C }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
    steps.forEach((s, i) => {
      const at = i / total;
      tl.add(() => s.classList.add('is-on'), at + .02);
      tl.add(() => { if (i > 0) s.classList.remove('is-on'); }, Math.max(0, at - .0001));
    });
    tl.eventCallback('onUpdate', () => {
      const i = Math.min(total, Math.floor(tl.progress() * total + 1e-6) + 1);
      if (counter) counter.textContent = t.ui.stepOf(i, total);
    });
    steps[0].classList.add('is-on');
    return () => theme.kill();
  }, [pinned, t]);

  useEffect(() => () => window.dispatchEvent(new CustomEvent('seqnc:navtheme', { detail: 'light' })), []);

  return (
    <section className="process" id="process" data-theme="dark" ref={ref} aria-labelledby="process-title" data-pinned={pinned ? '1' : '0'}>
      <i className="grain" aria-hidden="true" />
      <div className="process__pin">
        <div className="wrap process__inner">
          <div className="process__head">
            <Fade><Eyebrow n="05">{p.label}</Eyebrow></Fade>
            <Fade delay={.05}><h2 id="process-title" className="dsp dsp--1 process__title">{p.titleStart} <em className="accent">{p.titleAccent}</em></h2></Fade>
            <Fade delay={.1}><p className="lead process__body">{p.body}</p></Fade>
          </div>
          <div className="ring" aria-hidden="true">
            <svg viewBox="0 0 220 220" className="ring__svg">
              <circle cx="110" cy="110" r={R} className="ring__track" />
              <circle cx="110" cy="110" r={R} className="ring__arc" style={{ strokeDasharray: C, strokeDashoffset: C }} />
              <path d="M110 92l15.6 9v18L110 128l-15.6-9v-18L110 92Z" className="ring__hex" />
            </svg>
            <p className="mono ring__n">{t.ui.stepOf(1, p.steps.length)}</p>
          </div>
          <div className="process__track">
            <i className="process__line" aria-hidden="true" /><i className="process__prog" aria-hidden="true" />
            <ol className="process__steps">
              {p.steps.map((s, i) => (
                <li className="pstep" key={s.title}>
                  <p className="pstep__n num">0{i + 1}</p>
                  <h3 className="dsp dsp--3 pstep__t">{s.title}</h3>
                  <p className="pstep__d">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
