/* One story, told in the order it happened: the problem, what was
   automated, the result.  Outcomes stand on their own row. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead, Lines } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { work as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudy() {
  const ref = useRef(null);
  useScene(ref, 'work', 'Case study');
  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const rows = el.querySelectorAll('.case__row'), outs = el.querySelectorAll('.case__out'), card = el.querySelector('.case__card');
    gsap.set(rows, { opacity: 0, y: 18 }); gsap.set(outs, { opacity: 0, y: 14 }); gsap.set(card, { opacity: 0, y: 30 });
    ScrollTrigger.create({ trigger: el.querySelector('.case__body'), start: 'top 78%', once: true, onEnter: () => {
      gsap.to(card, { opacity: 1, y: 0, duration: 1.2, ease: EASE.out });
      gsap.to(rows, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.14, delay: 0.1 });
      gsap.to(outs, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.08, delay: 0.5 });
    } });
  });
  return (
    <section ref={ref} id="work" className="scene case" aria-labelledby="case-h">
      <div className="wrap"><SceneHead label={c.label} heading={c.heading} headingId="case-h" /></div>
      <div className="wrap g12 case__body">
        <aside className="case__card panel">
          <span className="u">Client</span>
          <h3 className="dsp dsp--2">{c.client}</h3>
          <p className="small">{c.where}</p>
          <ul className="case__outs">
            {c.outcomes.map((o) => <li key={o.k} className="case__out"><span className="u">{o.k}</span><b>{o.v}</b></li>)}
          </ul>
        </aside>
        <div className="case__story">
          <div className="case__row"><span className="u">The problem</span><p className="lead">{c.problem}</p></div>
          <div className="case__row"><span className="u">What we automated</span><ul className="case__list">{c.automated.map((a) => <li key={a}>{a}</li>)}</ul></div>
          <div className="case__row"><span className="u">The result</span><p className="lead case__result">{c.result}</p></div>
        </div>
      </div>
    </section>
  );
}
