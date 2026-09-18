/* =========================================================================
   Live demos.  Three real, sample-data systems, each previewed in its own
   small interface and linked to the page where it actually runs.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Arrow } from '../ui/Icons.jsx';
import { Glyph } from '../ui/Mark.jsx';

function Check({ on }) {
  return <i className={`chk${on ? ' chk--on' : ''}`} aria-hidden="true"><svg viewBox="0 0 10 8"><path d="M1 4.2 3.8 7 9 1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></i>;
}

function InboundVis({ d }) {
  return (
    <div className="dvis dvis--inbound" aria-hidden="true">
      <div className="dvis__bar"><span className="mono">{d.question}</span><span className="mono dim">{d.progress}</span></div>
      <ul className="dvis__opts">
        {d.options.map((o) => <li key={o.text} className={o.picked ? 'is-on' : ''}><Check on={o.picked} /><span>{o.text}</span></li>)}
      </ul>
      <div className="dvis__result"><span className="mono">{d.result}</span><span className="dvis__est">{d.estimate}</span></div>
    </div>
  );
}
function OperationsVis({ d }) {
  return (
    <div className="dvis dvis--ops" aria-hidden="true">
      <div className="dvis__bar"><span className="mono">{d.panelLabel}</span><span className="mono dim">{d.stepCount}</span></div>
      <ul className="dvis__steps">
        {d.steps.map((s, i) => <li key={s} style={{ '--i': i }}><Check on /><span>{s}</span></li>)}
      </ul>
      <div className="dvis__prog"><i /></div>
    </div>
  );
}
function OutboundVis({ d }) {
  return (
    <div className="dvis dvis--out" aria-hidden="true">
      <div className="dvis__bar"><span className="mono">{d.panelLabel}</span><span className="mono dim">{d.count}</span></div>
      <ul className="dvis__rows">
        {d.rows.map((r) => <li key={r.when}><Glyph /><span>{r.when}</span><span className="mono--l dvis__spend">{r.spend}</span></li>)}
      </ul>
    </div>
  );
}

/* each preview plays its small story once it is in view: checks tick on,
   the progress bar fills, rows arrive */
function useAlive() {
  return useGsap((_, el) => {
    if (reduced) return;
    el.querySelectorAll('.dvis').forEach((vis) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: vis, start: 'top 78%', once: true } });
      const rows = vis.querySelectorAll('li');
      tl.from(rows, { opacity: 0, x: -10, duration: .7, ease: 'expo.out', stagger: .12 }, 0);
      const checks = vis.querySelectorAll('.chk--on');
      if (checks.length) tl.from(checks, { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: .18 }, .35);
      const bar = vis.querySelector('.dvis__prog i');
      if (bar) tl.from(bar, { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power3.inOut' }, .4);
      const est = vis.querySelector('.dvis__est');
      if (est) tl.from(est, { opacity: 0, y: 8, duration: .8, ease: 'expo.out' }, .9);
      const spends = vis.querySelectorAll('.dvis__spend');
      if (spends.length) tl.from(spends, { opacity: 0, duration: .6, stagger: .12 }, .5);
    });
  }, []);
}

export default function Demos() {
  const { t } = useT();
  const d = t.demos;
  const ref = useAlive();
  const list = [
    { key: 'inbound', data: d.inbound, Vis: InboundVis },
    { key: 'operations', data: d.operations, Vis: OperationsVis },
    { key: 'outbound', data: d.outbound, Vis: OutboundVis },
  ];
  return (
    <section className="section demos" id="demos" ref={ref} aria-labelledby="demos-title">
      <div className="wrap">
        <Fade><Eyebrow n="04">{d.label}</Eyebrow></Fade>
        <Lines as="h2" id="demos-title" className="dsp dsp--1 demos__title">{d.titleLines[0]}<br /><span className="dim">{d.titleLines[1]}</span></Lines>
        <Fade><p className="lead demos__body">{d.body}</p></Fade>
        <ol className="demos__list">
          {list.map(({ key, data, Vis }, i) => (
            <li className={`demo demo--${key}`} key={key}>
              <a className="demo__link" href={data.href}>
                <div className="demo__text">
                  <p className="mono demo__n"><span className="demo__i">0{i + 1}</span><span className="demo__r" aria-hidden="true" />{data.tag}</p>
                  <h3 className="dsp dsp--2 demo__title">{data.title}</h3>
                  <p className="body demo__body">{data.body}</p>
                  <span className="mlnk demo__cta"><span>{d.cta}</span><Arrow className="" /></span>
                </div>
                <div className="demo__vis"><Vis d={data} /></div>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
