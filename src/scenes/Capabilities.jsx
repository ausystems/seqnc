/* Eight cells, one glyph each, hairlines between.  Nothing moves but the
   arrival. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { capabilities as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

const G = {
  inbox:    <><path d="M4 13l2.5-7h11L20 13v6H4z" /><path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  crm:      <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5" /><path d="M16 8h4M16 12h4" /></>,
  onboard:  <><path d="M5 4h10l4 4v12H5z" /><path d="M15 4v4h4M8.5 12h7M8.5 16h5" /></>,
  reply:    <><path d="M10 7 4 12l6 5" /><path d="M4 12h9a6 6 0 0 1 6 6v1" /></>,
  star:     <><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z" /></>,
  invoice:  <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  return:   <><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 4v5h5" /></>,
};

export default function Capabilities() {
  const ref = useRef(null);
  useScene(ref, 'capabilities', 'Capabilities');
  useGsap(ref, (ctx, el) => {
    if (reduced) return;
    const cells = el.querySelectorAll('.cap__cell');
    gsap.set(cells, { opacity: 0, y: 18 });
    ScrollTrigger.create({ trigger: el.querySelector('.cap__grid'), start: 'top 82%', once: true, onEnter: () => gsap.to(cells, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.06 }) });
  });
  return (
    <section ref={ref} id="capabilities" className="scene cap" aria-labelledby="cap-h">
      <div className="wrap"><SceneHead label={c.label} heading={c.heading} headingId="cap-h" /></div>
      <div className="wrap">
        <ul className="cap__grid">
          {c.items.map((it) => (
            <li key={it.name} className="cap__cell">
              <svg className="cap__glyph" viewBox="0 0 24 24" aria-hidden="true">{G[it.glyph]}</svg>
              <h3 className="dsp dsp--3">{it.name}</h3>
              <p className="small">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
