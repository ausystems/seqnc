/* =========================================================================
   The case study, as one night panel.  The client on the left; on the
   right where things stood, held for three seconds when the panel
   arrives, then turned line by line into what runs now, and what was
   built follows.  The switch above the lines is the only place the two
   words appear, and the only way to turn it again.  The panel ends on
   the two ways forward.
   ========================================================================= */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { reduced } from '../engine/device.js';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Fade } from '../ui/Reveal.jsx';
import Head from '../ui/Head.jsx';
import { Glyph } from '../ui/Mark.jsx';

const HOLD = 3; /* seconds the old way is shown before it turns */

export default function CaseStudy() {
  const { t } = useT();
  const w = t.work;
  const panel = useRef(null);
  const tlRef = useRef(null);
  const [state, setState] = useState('before');
  useEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    const tl = gsap.timeline({ paused: true, onUpdate: () => setState(tl.time() >= HOLD ? 'after' : 'before'), onReverseComplete: () => setState('before') });
    tlRef.current = tl;
    el.querySelectorAll('.swap__row').forEach((row, i) => {
      const at = HOLD + i * .42;
      tl.to(row.querySelector('.swap__b'), { yPercent: -100, opacity: 0, duration: .9, ease: 'expo.inOut' }, at)
        .fromTo(row.querySelector('.swap__a'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'expo.inOut' }, at);
    });
    tl.from(el.querySelectorAll('.work__chip'), { y: 10, opacity: 0, duration: .7, ease: 'expo.out', stagger: .1 }, HOLD + 1.1)
      .from(el.querySelectorAll('.work__chip .glyph'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: .1 }, HOLD + 1.25);
    if (reduced) { tl.progress(1); setState('after'); return () => tl.kill(); }
    let played = false;
    const play = () => { if (!played) { played = true; tl.play(0); } };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect(); } }, { threshold: .35 });
    io.observe(el);
    return () => { io.disconnect(); tl.kill(); };
  }, [t.code]);
  /* the switch scrubs the same turn: back to the old way, forward to the new */
  const go = (to) => {
    const tl = tlRef.current;
    if (!tl) return;
    if (reduced) { tl.progress(to === 'after' ? 1 : 0); setState(to); return; }
    if (to === 'after') { if (tl.time() < HOLD) tl.seek(HOLD); tl.play(); }
    else { if (tl.time() > HOLD + 2.6) tl.seek(HOLD + 2.6); tl.reverse(); }
  };
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <Head id="work-title" title={w.titleStart} accent={w.titleAccent} />
        <div className="work__panel">
          <div ref={panel} className="work__in" data-theme="dark">
            <i className="grain" aria-hidden="true" />
            <i className="work__glow" aria-hidden="true" />
            <div className="work__grid">
              <div className="work__side">
                <div className="work__client">
                  <span className="work__mark" aria-hidden="true">{w.mark}</span>
                  <p className="mono work__meta">{w.meta}</p>
                </div>
                <h3 className="dsp dsp--2 work__name">{w.client}</h3>
                <p className="work__partner"><i className="work__live" aria-hidden="true" />{w.partner}</p>
              </div>
              <div className="work__main">
                <div className="work__toggle" role="group" aria-label={`${w.beforeLabel} / ${w.afterLabel}`}>
                  <button type="button" className="mono work__tbtn" aria-pressed={state === 'before'} onClick={() => go('before')}>{w.beforeLabel}</button>
                  <button type="button" className="mono work__tbtn" aria-pressed={state === 'after'} onClick={() => go('after')}>{w.afterLabel}</button>
                  <i className="work__tpill" aria-hidden="true" data-at={state} />
                </div>
                <ol className="swap">
                  {w.pairs.map((p, i) => (
                    <li className="swap__row" key={i}>
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
            </div>
            <div className="work__cta">
              <p className="work__lead">{t.offer.work}</p>
              <div className="work__acts">
                <Button href={t.calendly} calendly>{t.hero.cta}</Button>
                <MonoLink to="/free-review" name={t.review.label}>{t.hero.noteLink}</MonoLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
