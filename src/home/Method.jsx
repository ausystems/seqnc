/* =========================================================================
   The TimeBack Method.  Four steps in a row under one line, with the ring
   completing beside the heading as the chapter comes into view.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

const R = 92, C = 2 * Math.PI * R;

export default function Method() {
  const { t } = useT();
  const p = t.process;
  const ref = useGsap((_, el) => {
    const arc = el.querySelector('.ring__arc');
    if (reduced) { gsap.set(arc, { strokeDashoffset: 0 }); return; }
    gsap.fromTo(arc, { strokeDashoffset: C }, { strokeDashoffset: 0, duration: 2.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 70%', once: true } });
    gsap.to(el.querySelector('.ring__hex'), { rotation: 360, transformOrigin: '50% 50%', duration: 40, ease: 'none', repeat: -1 });
    gsap.from(el.querySelector('.method__line'), { scaleX: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el.querySelector('.method__steps'), start: 'top 80%', once: true } });
  }, []);
  return (
    <section className="section method" id="method" ref={ref} aria-labelledby="method-title">
      <div className="wrap">
        <div className="method__head">
          <div>
            <Fade><Eyebrow n="02">{p.label}</Eyebrow></Fade>
            <Lines as="h2" id="method-title" className="dsp dsp--1 method__title" stagger={.1}>
              {p.titleStart}<br /><span className="grad">{p.titleAccent}</span>
            </Lines>
            <Fade><p className="lead method__body">{p.body}</p></Fade>
          </div>
          <div className="ring" aria-hidden="true">
            <svg viewBox="0 0 220 220" className="ring__svg">
              <circle cx="110" cy="110" r={R} className="ring__track" />
              <circle cx="110" cy="110" r={R} className="ring__arc" style={{ strokeDasharray: C, strokeDashoffset: C }} />
              <path d="M110 92l15.6 9v18L110 128l-15.6-9v-18L110 92Z" className="ring__hex" />
            </svg>
          </div>
        </div>
        <div className="method__track">
          <i className="method__line" aria-hidden="true" />
          <Fade as="ol" className="method__steps" stagger={.1}>
            {p.steps.map((s, i) => (
              <li className="mstep" key={s.title}>
                <p className="mono mstep__n">0{i + 1}</p>
                <h3 className="dsp dsp--3 mstep__t">{s.title}</h3>
                <p className="mstep__d">{s.desc}</p>
              </li>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
