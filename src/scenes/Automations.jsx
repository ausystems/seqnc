/* Three systems on one pinned stage.  The copy leaves upward as the next
   arrives from below; the visual cross-fades and rises; the index rolls. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { SceneHead, Display, Lines } from '../ui/Reveal.jsx';
import { VISUALS } from '../ui/Visuals.jsx';
import { useGsap, useScene, useMedia } from '../engine/hooks.js';
import { reduced, DESKTOP } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { automations as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

const Cta = () => (
  <Magnetic as="a" href={c.cta.href} className="btn auto__btn" strength={0.1}>
    <span className="btn__lab"><span>{c.cta.label}</span><span aria-hidden="true">{c.cta.label}</span></span>
  </Magnetic>
);

function Set({ item, i }) {
  return (
    <div className="auto__set">
      <span className="u auto__eyebrow"><b>{String(i + 1).padStart(2, '0')}</b>{item.eyebrow}</span>
      <h3 className="dsp dsp--2 auto__hl">{item.heading.map((l, k) => <span key={k} className={`hl ${k === 1 ? 'dim' : ''}`}><span className="hl__in">{l}</span></span>)}</h3>
      <p className="body auto__body">{item.body}</p>
      <ul className="ticks">{item.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
      <Cta />
    </div>
  );
}

function Desktop() {
  const ref = useRef(null);
  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const sets = q('.auto__set'), visuals = q('.auto__visual'), stage = q('.auto__stage')[0];
    const N = sets.length;
    const parts = (s) => ({ lines: s.querySelectorAll('.hl__in'), rest: s.querySelectorAll('.auto__eyebrow, .auto__body, .ticks li, .auto__btn') });
    sets.forEach((s, i) => { if (i === 0) return; const { lines, rest } = parts(s); gsap.set(lines, { yPercent: 110 }); gsap.set(rest, { opacity: 0, y: 12 }); });
    visuals.forEach((v, i) => { if (i > 0) gsap.set(v, { opacity: 0, y: 60, scale: 0.96 }); });
    if (reduced) return;

    gsap.set(sets[0], { y: 40, opacity: 0 });
    gsap.set(visuals[0], { y: 50, opacity: 0 });
    ScrollTrigger.create({ trigger: stage, start: 'top 75%', once: true, onEnter: () => { gsap.to(sets[0], { y: 0, opacity: 1, duration: 1.1, ease: EASE.out }); gsap.to(visuals[0], { y: 0, opacity: 1, duration: 1.3, ease: EASE.out, delay: 0.15 }); } });

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    for (let i = 1; i < N; i++) {
      const t = i * 1.5, out = parts(sets[i - 1]), inn = parts(sets[i]);
      tl.to(out.lines, { yPercent: -110, duration: 0.45, stagger: 0.04 }, t)
        .to(out.rest, { opacity: 0, y: -8, duration: 0.3, stagger: 0.02 }, t)
        .to(inn.lines, { yPercent: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, t + 0.18)
        .to(inn.rest, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power3.out' }, t + 0.3)
        .to(visuals[i - 1], { opacity: 0, y: -50, scale: 0.97, duration: 0.5 }, t)
        .to(visuals[i], { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, t + 0.1);
    }
    tl.to({}, { duration: 0.6 });
    ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => `+=${(N - 1) * 100 + 40}%`, pin: true, scrub: 0.8, animation: tl, anticipatePin: 1, invalidateOnRefresh: true });
  });
  return (
    <div ref={ref} className="auto__desk">
      <div className="auto__stage">
        <div className="wrap g12 auto__grid">
          <div className="auto__copy">{c.items.map((it, i) => <Set key={it.eyebrow} item={it} i={i} />)}</div>
          <div className="auto__media">{c.items.map((it) => { const V = VISUALS[it.visual]; return <div key={it.visual} className="auto__visual"><V /></div>; })}</div>
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="auto__mob">
      {c.items.map((it, i) => {
        const V = VISUALS[it.visual];
        return (
          <article key={it.eyebrow} className="auto__block wrap">
            <span className="u auto__eyebrow"><b>{String(i + 1).padStart(2, '0')}</b>{it.eyebrow}</span>
            <Display lines={it.heading} as="h3" size={2} dimLast />
            <div className="auto__visual"><V /></div>
            <Lines className="body auto__body">{it.body}</Lines>
            <ul className="ticks">{it.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
            <Cta />
          </article>
        );
      })}
    </div>
  );
}

export default function Automations() {
  const ref = useRef(null);
  useScene(ref, 'automations', 'What we build');
  const desktop = useMedia(DESKTOP) && !reduced;
  return (
    <section ref={ref} id="automations" className="scene auto" aria-labelledby="auto-h">
      <div className="wrap auto__head"><SceneHead label={c.label} heading={c.heading} headingId="auto-h" center /></div>
      {desktop ? <Desktop /> : <Mobile />}
    </section>
  );
}
