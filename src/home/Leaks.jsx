/* Where the week goes: three illustrative rows, one bar each, the footnote
   that keeps them honest. */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function Leaks() {
  const { t } = useT();
  const max = Math.max(...t.leakChart.rows.map((r) => r.value));
  const ref = useGsap((_, el) => {
    if (reduced) return;
    gsap.from(el.querySelectorAll('.leaks__bar'), { scaleX: 0, duration: 1.6, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: el, start: 'top 72%', once: true } });
    gsap.from(el.querySelectorAll('.leaks__row'), { opacity: 0, y: 14, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el, start: 'top 78%', once: true } });
  }, []);
  return (
    <section className="leaks" id="week" ref={ref} aria-labelledby="leaks-title">
      <div className="wrap leaks__grid">
        <div className="leaks__head">
          <Lines as="h2" id="leaks-title" className="dsp dsp--2">{t.leakChart.title}</Lines>
          <p className="mono leaks__tag"><span className="leaks__dot" aria-hidden="true" />{t.leakChart.tag}</p>
          <Fade><p className="mono--s leaks__note">{t.leakChart.footnote}</p></Fade>
        </div>
        <ol className="leaks__rows">
          {t.leakChart.rows.map((r) => (
            <li className="leaks__row" key={r.label}>
              <span className="leaks__label">{r.label}</span>
              <span className="leaks__h">{r.hours}</span>
              <span className="leaks__track" aria-hidden="true"><i className="leaks__bar" style={{ '--v': r.value / max }} /></span>
            </li>
          ))}
          <li className="leaks__unit mono">{t.leakChart.unit}</li>
        </ol>
      </div>
    </section>
  );
}
