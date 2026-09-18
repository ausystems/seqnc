/* =========================================================================
   The problem.  Three sentences stepping down the page like things slipping
   through the cracks, then three industry numbers counted up under a
   disclaimer that never leaves.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function Problem() {
  const { t } = useT();
  const ref = useGsap((_, el) => {
    el.querySelectorAll('[data-count]').forEach((n) => {
      const end = Number(n.dataset.count);
      if (reduced) { n.textContent = end; return; }
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.9, ease: 'power3.out', snap: { v: 1 }, onUpdate: () => { n.textContent = Math.round(o.v); }, scrollTrigger: { trigger: n, start: 'top 84%', once: true } });
    });
    if (reduced) return;
    gsap.from(el.querySelectorAll('.problem__item'), { opacity: 0, y: 26, duration: 1.2, ease: 'expo.out', stagger: .14, scrollTrigger: { trigger: el.querySelector('.problem__items'), start: 'top 80%', once: true } });
    gsap.from(el.querySelectorAll('.bench__rule'), { scaleX: 0, duration: 1.4, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el.querySelector('.bench'), start: 'top 82%', once: true } });
  }, []);
  return (
    <section className="section problem" id="leaks" ref={ref} aria-labelledby="problem-title">
      <div className="wrap">
        <Fade><Eyebrow n="01">{t.problem.label}</Eyebrow></Fade>
        <Lines as="h2" id="problem-title" className="dsp dsp--1 problem__title">
          {t.problem.titleLines[0]}<br /><span className="dim">{t.problem.titleLines[1]}</span>
        </Lines>
        <Fade><p className="lead problem__body">{t.problem.body}</p></Fade>
        <ol className="problem__items">
          {t.problem.items.map((it, i) => (
            <li className="problem__item" key={it} style={{ '--i': i }}>
              <span className="mono problem__i">0{i + 1}</span>
              <p className="dsp dsp--3">{it}</p>
            </li>
          ))}
        </ol>
        <div className="bench" role="group" aria-label="Benchmarks">
          {t.benchmarks.stats.map((s) => (
            <div className="bench__item" key={s.label}>
              <i className="bench__rule rule" aria-hidden="true" />
              <p className="bench__v num"><span data-count={s.value}>0</span><span className="bench__suf">{s.suffix}</span></p>
              <p className="bench__l">{s.label}</p>
            </div>
          ))}
          <p className="bench__note mono--s">{t.benchmarks.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
