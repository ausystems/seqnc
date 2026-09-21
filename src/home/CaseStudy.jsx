/* =========================================================================
   The case study.  One client, told as the system taking over: each line
   of the old way turns, in place, into the new one, and what was built
   follows.  The turn plays as the panel arrives and replays on hover.
   ========================================================================= */
import { useCallback, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useTile } from '../engine/tile.js';
import { reduced } from '../engine/device.js';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';

export default function CaseStudy() {
  const { t } = useT();
  const w = t.work;
  const tlRef = useRef(null);
  const [state, setState] = useState('before');
  /* the turn is built once; the controls only scrub it */
  const build = useCallback((el) => {
    const tl = gsap.timeline({ onStart: () => setState('after'), onReverseComplete: () => setState('before') });
    tlRef.current = tl;
    el.querySelectorAll('.swap__row').forEach((row, i) => {
      const at = .7 + i * .42;
      tl.to(row.querySelector('.swap__b'), { yPercent: -100, opacity: 0, duration: .9, ease: 'expo.inOut' }, at)
        .fromTo(row.querySelector('.swap__a'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'expo.inOut' }, at)
        .to(row.querySelector('.swap__lb'), { yPercent: -100, opacity: 0, duration: .7, ease: 'expo.inOut' }, at + .05)
        .fromTo(row.querySelector('.swap__la'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'expo.inOut' }, at + .05);
    });
    tl.from(el.querySelectorAll('.work__chip'), { y: 10, opacity: 0, duration: .7, ease: 'expo.out', stagger: .1 }, 1.8)
      .from(el.querySelectorAll('.work__chip .glyph'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: .1 }, 1.95);
    return tl;
  }, []);
  const panel = useTile(build, .35);
  /* the pair of controls scrubs the same turn: back to the old way, forward to the new */
  const go = (to) => {
    const tl = tlRef.current;
    if (!tl) return;
    setState(to);
    if (reduced) { tl.progress(to === 'after' ? 1 : 0); return; }
    if (to === 'after') tl.play(); else tl.reverse();
  };
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap work__grid">
        <div className="work__side">
          <Fade className="work__client">
            <img src="/divos-logo.jpg" alt="" width="64" height="64" loading="lazy" />
            <p className="mono work__meta">{w.meta}</p>
          </Fade>
          <Lines as="h2" id="work-title" className="dsp dsp--1 work__name" stagger={.1}>{w.client}</Lines>
          <Fade className="work__act" delay={.15}>
            <Button href={w.liveUrl}>{w.link}</Button>
            <span className="mono work__url"><i className="work__live" aria-hidden="true" /><span className="vh">{w.live}: </span>{w.url}</span>
          </Fade>
        </div>
        <div className="work__panel" ref={panel}>
          <div className="work__toggle" role="group" aria-label={`${w.beforeLabel} / ${w.afterLabel}`}>
            <button type="button" className="mono work__tbtn" aria-pressed={state === 'before'} onClick={() => go('before')}>{w.beforeLabel}</button>
            <button type="button" className="mono work__tbtn" aria-pressed={state === 'after'} onClick={() => go('after')}>{w.afterLabel}</button>
            <i className="work__tpill" aria-hidden="true" data-at={state} />
          </div>
          <ol className="swap">
            {w.pairs.map((p, i) => (
              <li className="swap__row" key={i}>
                <span className="mono swap__lbl" aria-hidden="true"><span className="swap__lb">{w.beforeLabel}</span><span className="swap__la">{w.afterLabel}</span></span>
                <div className="swap__txt">
                  <p className="dsp dsp--2 swap__b"><span className="vh">{w.beforeLabel}: </span>{p.before}</p>
                  <p className="dsp dsp--2 swap__a"><span className="vh">{w.afterLabel}: </span>{p.after} <span className="hi">{p.afterAccent}</span></p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="work__chips">
            {w.chips.map((c) => <li key={c} className="mono work__chip"><Glyph />{c}</li>)}
          </ul>
        </div>
        <Fade className="work__foot"><p className="work__soon">{w.comingSoon}</p></Fade>
      </div>
    </section>
  );
}
