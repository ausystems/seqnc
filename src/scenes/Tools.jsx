/* Level 6 — the orbit, on the one tinted sheet of the site.  Seven tools
   stand on a ring around the Seqnc core; scrolling turns the ring so each
   swings up to the focus mark while its note fades in beneath. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHead } from '../ui/Reveal.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { reduced, finePointer } from '../engine/device.js';
import { onFrame } from '../engine/input.js';
import { tools as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

/* fine line icons, one stroke weight */
const ICONS = [
  <><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.4-3.4 2.8-5.4 5.5-5.4S14 15.6 14.5 19" /><path d="M16.5 8h4M16.5 11.5h4M16.5 15h2.5" /></>,
  <><rect x="3.5" y="5" width="17" height="15.5" /><path d="M3.5 9.8h17M8 3v4M16 3v4" /><path d="M7.5 13.5h2.5M13.5 13.5H16M7.5 17h2.5" /></>,
  <><rect x="3" y="5.5" width="18" height="13" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
  <><rect x="5" y="3.5" width="14" height="17" /><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" /></>,
  <><rect x="3" y="4.5" width="18" height="15" /><path d="M3 9h18" /><path d="M6 6.8h.01M8.5 6.8h.01" /></>,
  <><path d="M4 5h16v10.5H10L5.5 19v-3.5H4z" /><path d="M8.5 9h7M8.5 12h4.5" /></>,
  <><rect x="3.5" y="4" width="17" height="6" /><rect x="3.5" y="14" width="17" height="6" /><path d="M7 7h.01M7 17h.01M11 7h5M11 17h5" /></>,
];

export default function Tools() {
  const ref = useRef(null);
  useScene(ref, 'tools', 'Your Stack');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const story = q('.tools__story')[0], stage = q('.tools__stage')[0], orbit = q('.orbit')[0];
    const tools = q('.tool'), panels = q('.tools__panel'), ticks = q('.tools__bar i'), prog = q('.orbit__prog')[0];
    const N = tools.length, STEP = 360 / N, SPAN = (N - 1) * STEP, RING = 2 * Math.PI * 46;
    let shown = -1;
    const draw = (p) => {
      const spin = -p * SPAN;
      tools.forEach((t, i) => t.style.setProperty('--a', `${(i * STEP + spin).toFixed(2)}deg`));
      prog.style.strokeDashoffset = (RING * (1 - p)).toFixed(2);
      const idx = gsap.utils.clamp(0, N - 1, Math.round(p * (N - 1)));
      if (idx === shown) return;
      shown = idx;
      tools.forEach((t, i) => t.classList.toggle('is-active', i === idx));
      panels.forEach((t, i) => t.classList.toggle('is-active', i === idx));
      ticks.forEach((t, i) => t.classList.toggle('is-on', i <= idx));
    };
    draw(0);
    if (reduced) return undefined;
    ScrollTrigger.create({ trigger: story, start: 'top top', end: 'bottom bottom', onUpdate: (self) => draw(self.progress) });
    if (finePointer) {
      const rx = gsap.quickTo(orbit, 'rotateX', { duration: 1.2, ease: 'power3' });
      const ry = gsap.quickTo(orbit, 'rotateY', { duration: 1.2, ease: 'power3' });
      gsap.set(orbit, { transformPerspective: 1400 });
      let active = false;
      const st = ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: (s) => { active = s.isActive; if (!active) { rx(0); ry(0); } } });
      const off = onFrame((s) => { if (!active || !s.present) return; ry((s.nx - 0.5) * 5); rx((s.ny - 0.5) * -4); });
      return () => { off(); st.kill(); };
    }
    return undefined;
  });

  return (
    <section ref={ref} id="tools" className="scene tools" aria-labelledby="tools-h">
      <div className="wrap">
        <SceneHead label={c.label} index="06" heading={c.heading} sub={c.sub} headingId="tools-h" dimLast />
      </div>

      <div className="tools__story">
        <div className="tools__stage">
          <div className="orbit" data-cursor="scan">
            <svg className="orbit__track" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="orbit__base" cx="50" cy="50" r="46" />
              <circle className="orbit__prog" cx="50" cy="50" r="46" />
            </svg>
            <span className="orbit__inner" aria-hidden="true" />
            <span className="orbit__dash" aria-hidden="true" />
            <span className="orbit__beam" aria-hidden="true" />
            <span className="orbit__focus" aria-hidden="true" />
            <span className="orbit__core" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <span className="orbit__brand u" aria-hidden="true">Seqnc</span>
            {c.items.map((it, i) => (
              <div key={it.short} className="tool">
                <span className="tool__dot"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[i]}</svg></span>
                <span className="tool__lbl u">{it.short}</span>
              </div>
            ))}
          </div>

          <div className="tools__panels">
            {c.items.map((it, i) => (
              <article key={it.title} className={`tools__panel ${i === 0 ? 'is-active' : ''}`}>
                <span className="u tools__no">{String(i + 1).padStart(2, '0')} <i>/</i> {String(c.items.length).padStart(2, '0')}</span>
                <h3 className="dsp dsp--2 tools__title">{it.title}</h3>
                <p className="small">{it.body}</p>
              </article>
            ))}
          </div>
          <div className="tools__bar" aria-hidden="true">{c.items.map((_, i) => <i key={i} className={i === 0 ? 'is-on' : ''} />)}</div>
        </div>
      </div>

    </section>
  );
}
