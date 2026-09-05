/* Levels 4–6 — scene changes.  Three automations share one stage.  On
   desktop the stage is pinned and scrolling switches the level: the copy
   leaves upward through its mask while the next arrives from below, the
   monitor's screen is wiped up by the next one, and the index rolls.  On
   touch the three are their own blocks, each arriving on its own beat. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { Label, Display, Lines } from '../ui/Reveal.jsx';
import { MOCKS } from '../ui/Mocks.jsx';
import { useGsap, useScene, useMedia } from '../engine/hooks.js';
import { reduced, DESKTOP } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';
import { automations as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

const Cta = () => (
  <Magnetic as="a" href={c.cta.href} className="btn btn--ghost auto__btn">
    <span className="btn__lab"><span>{c.cta.label}</span><span aria-hidden="true">{c.cta.label}</span></span>
  </Magnetic>
);

function Set({ item, i, live }) {
  return (
    <div className={`auto__set ${live ? 'is-live' : ''}`} aria-hidden={live ? undefined : 'true'}>
      <span className="u auto__eyebrow"><span className="u--dim">{String(i + 1).padStart(2, '0')} / {String(c.items.length).padStart(2, '0')}</span><span className="auto__eyebrowt">{item.eyebrow}</span></span>
      <h3 className="dsp dsp--2 auto__hl">
        {item.heading.map((l, k) => <span key={k} className={`hl ${k === 1 ? 'dim' : ''}`}><span className="hl__in">{l}</span></span>)}
      </h3>
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
    const sets = q('.auto__set');
    const screens = q('.auto__screen');
    const ghosts = q('.auto__ghostn');
    const prog = q('.auto__prog i')[0];
    const stage = q('.auto__stage')[0];
    const N = sets.length;

    const parts = (s) => ({
      lines: s.querySelectorAll('.hl__in'),
      rest: s.querySelectorAll('.auto__eyebrow, .auto__body, .ticks li, .auto__btn'),
    });

    /* resting state: the first level is up, the others are waiting below */
    sets.forEach((s, i) => {
      const { lines, rest } = parts(s);
      gsap.set(s.querySelector('.auto__hl'), { perspective: 900 });
      if (i === 0) return;
      gsap.set(lines, { yPercent: 110, rotateX: -18, transformOrigin: '50% 100%' });
      gsap.set(rest, { opacity: 0, y: 14 });
    });
    screens.forEach((s, i) => { if (i > 0) gsap.set(s, { clipPath: 'inset(100% 0 0 0)' }); });
    gsap.set(ghosts, { yPercent: (i) => (i === 0 ? 0 : 100) });
    screens[0].classList.add('is-on');

    if (reduced) {
      /* no scene changes: show everything as three stacked states */
      sets.forEach((s, i) => { if (i > 0) { const { lines, rest } = parts(s); gsap.set(lines, { clearProps: 'all' }); gsap.set(rest, { clearProps: 'all' }); } });
      screens.forEach((s) => { gsap.set(s, { clearProps: 'clipPath' }); s.classList.add('is-on'); });
      return;
    }

    /* arrival of the first level — on the set as a whole, never on the
       properties the scrubbed timeline owns */
    gsap.set(sets[0], { y: 46, opacity: 0 });
    gsap.set(q('.auto__monitor')[0], { clipPath: 'inset(100% 0 0 0)' });
    ScrollTrigger.create({
      trigger: stage, start: 'top 75%', once: true,
      onEnter: () => {
        gsap.to(sets[0], { y: 0, opacity: 1, duration: 1.1, ease: EASE.out });
        gsap.to(q('.auto__monitor')[0], { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: EASE.out, delay: 0.1 });
      },
    });

    /* the level changes, scrubbed */
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    for (let i = 1; i < N; i++) {
      const t = i * 1.5;                       /* each change lives at 1.5, 3.0 … */
      const out = parts(sets[i - 1]), inn = parts(sets[i]);
      tl.to(out.lines, { yPercent: -110, rotateX: 14, duration: 0.45, stagger: 0.04 }, t)
        .to(out.rest, { opacity: 0, y: -10, duration: 0.3, stagger: 0.02 }, t)
        .to(inn.lines, { yPercent: 0, rotateX: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, t + 0.18)
        .to(inn.rest, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power3.out' }, t + 0.3)
        .to(screens[i - 1], { scale: 0.96, opacity: 0.3, duration: 0.5 }, t)
        .to(screens[i], { clipPath: 'inset(0% 0 0 0)', duration: 0.55, ease: 'power3.inOut', onStart: () => screens[i].classList.add('is-on') }, t + 0.05)
        .to(ghosts[i - 1], { yPercent: -100, duration: 0.5 }, t)
        .to(ghosts[i], { yPercent: 0, duration: 0.5 }, t);
    }
    tl.to({}, { duration: 0.6 });              /* hold on the last level */
    gsap.to(prog, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: () => `+=${(N - 1) * 100 + 40}%`, scrub: true } });

    ScrollTrigger.create({
      trigger: stage, start: 'top top', end: () => `+=${(N - 1) * 100 + 40}%`,
      pin: true, scrub: 0.8, animation: tl, anticipatePin: 1, invalidateOnRefresh: true,
    });
  });

  return (
    <div ref={ref} className="auto__desk">
      <div className="auto__stage">
        <div className="wrap g12 auto__grid">
          <div className="auto__copy">
            {c.items.map((it, i) => <Set key={it.eyebrow} item={it} i={i} live={i === 0} />)}
          </div>
          <div className="auto__monitor band" data-cursor="scan">
            <span className="auto__ghost dsp" aria-hidden="true">
              {c.items.map((_, i) => <span key={i} className="auto__ghostn">{String(i + 1).padStart(2, '0')}</span>)}
            </span>
            <div className="auto__screens">
              {c.items.map((it) => { const M = MOCKS[it.mock]; return <div key={it.mock} className="auto__screen"><M /></div>; })}
            </div>
            <span className="auto__prog" aria-hidden="true"><i /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  const ref = useRef(null);
  useGsap(ref, (ctx, el) => {
    const screens = gsap.utils.selector(el)('.auto__screen');
    screens.forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 80%', once: true, onEnter: () => s.classList.add('is-on') }));
  });
  return (
    <div ref={ref} className="auto__mob">
      {c.items.map((it, i) => {
        const M = MOCKS[it.mock];
        return (
          <article key={it.eyebrow} className="auto__block wrap">
            <span className="u auto__eyebrow"><span className="u--dim">{String(i + 1).padStart(2, '0')} / {String(c.items.length).padStart(2, '0')}</span><span className="auto__eyebrowt">{it.eyebrow}</span></span>
            <Display lines={it.heading} as="h3" size={2} />
            <div className="auto__monitor band"><div className="auto__screens"><div className="auto__screen"><M /></div></div></div>
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
  useScene(ref, 'automations', 'Automations');
  const desktop = useMedia(DESKTOP) && !reduced;
  return (
    <section ref={ref} id="automations" className="scene auto" aria-label="What we build">
      <div className="wrap auto__head">
        <div className="scene__meta"><Label>{c.label}</Label><span className="u idx">04</span></div>
      </div>
      {desktop ? <Desktop /> : <Mobile />}
    </section>
  );
}
