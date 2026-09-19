/* =========================================================================
   The problem, as one night band: the statement, the three sentences, and
   the benchmark sentence with its numbers counted up and coloured.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function Statement() {
  const { t } = useT();
  const p = t.problem, b = t.benchmarks;
  const ref = useGsap((_, el) => {
    /* the bar turns dark while it is over the band */
    const theme = ScrollTrigger.create({ trigger: el, start: 'top 60px', end: 'bottom 60px', onToggle: (self) => window.dispatchEvent(new CustomEvent('seqnc:navtheme', { detail: self.isActive ? 'dark' : 'light' })) });
    el.querySelectorAll('[data-count]').forEach((n) => {
      const end = Number(n.dataset.count);
      if (reduced) { n.textContent = end; return; }
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', snap: { v: 1 }, onUpdate: () => { n.textContent = Math.round(o.v); }, scrollTrigger: { trigger: n, start: 'top 85%', once: true } });
    });
    return () => { theme.kill(); window.dispatchEvent(new CustomEvent('seqnc:navtheme', { detail: 'light' })); };
  }, []);
  return (
    <section className="stmt" id="problem" data-theme="dark" ref={ref} aria-labelledby="stmt-title">
      <i className="grain" aria-hidden="true" />
      <div className="wrap stmt__in">
        <Lines as="h2" id="stmt-title" className="dsp dsp--1 stmt__title" stagger={.1}>
          {p.titleLines[0]}<br /><span className="hi">{p.titleLines[1]}</span>
        </Lines>
        <Fade as="ul" className="stmt__items" stagger={.12}>
          {p.items.map((it, i) => <li key={it}><span className="mono stmt__i" aria-hidden="true">0{i + 1}</span><p>{it}</p></li>)}
        </Fade>
        <Fade className="stmt__bench">
          <p className="stmt__sentence">
            {b.stats.map((s, i) => (
              <span key={s.label} className="stmt__stat"><strong className="hi"><span data-count={s.value}>0</span>{s.suffix}</strong> {s.label}.{i < b.stats.length - 1 ? ' ' : ''}</span>
            ))}
          </p>
          <p className="mono--s stmt__note">{b.disclaimer}</p>
        </Fade>
      </div>
    </section>
  );
}
