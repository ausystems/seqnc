/* =========================================================================
   The three systems as numbered editorial rows: the name set large on the
   left, what it does and what it covers on the right, and the way into its
   live demo.  Each row draws its hairline as it arrives.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { MonoLink } from '../ui/Button.jsx';
import { Glyph } from '../ui/Mark.jsx';

export default function Systems() {
  const { t } = useT();
  const s = t.systems, d = t.demos;
  const rows = [
    { key: 'inbound', sys: s.inbound, demo: d.inbound },
    { key: 'operations', sys: s.operations, demo: d.operations },
    { key: 'outbound', sys: s.outbound, demo: d.outbound },
  ];
  const ref = useGsap((_, el) => {
    if (reduced) return;
    el.querySelectorAll('.srow').forEach((row) => {
      gsap.from(row.querySelector('.srow__rule'), { scaleX: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 82%', once: true } });
    });
  }, []);
  return (
    <section className="section systems" id="systems" ref={ref} aria-labelledby="systems-title">
      <div className="wrap">
        <Fade><Eyebrow n="02">{s.label}</Eyebrow></Fade>
        <Lines as="h2" id="systems-title" className="dsp dsp--1 systems__title" stagger={.1}>
          {s.titleLines[0]}<br /><span className="dim">{s.titleLines[1]} {s.titleLines[2]}</span>
        </Lines>
        <Fade><p className="lead systems__body">{s.body}</p></Fade>
        <ol className="srows">
          {rows.map(({ key, sys, demo }, i) => (
            <li className={`srow srow--${key}`} key={key} id={key}>
              <i className="srow__rule" aria-hidden="true" />
              <p className="mono srow__n">0{i + 1}</p>
              <div className="srow__name">
                <p className="mono srow__tag">{sys.tag}</p>
                <Lines as="h3" className="dsp dsp--2 srow__title" stagger={.08}>{sys.title}</Lines>
              </div>
              <div className="srow__text">
                <Fade><p className="srow__body">{sys.body}</p></Fade>
                <Fade as="ul" className="tick srow__ticks" stagger={.06}>
                  {sys.bullets.map((b) => <li key={b}><Glyph />{b}</li>)}
                </Fade>
                <Fade className="srow__demo">
                  <MonoLink href={demo.href}>{t.ui.tryDemo}</MonoLink>
                  <span className="srow__demotitle">{demo.title}</span>
                </Fade>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
