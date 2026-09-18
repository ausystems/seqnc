/* =========================================================================
   The opening curtain.  Night, the mark, then the sheet lifts to reveal the
   page.  Plays once per session, waits for the fonts (briefly), and is
   skipped entirely under reduced motion.
   ========================================================================= */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { reduced } from '../engine/device.js';
import Mark from './Mark.jsx';
import { armIntro } from '../engine/intro.js';

const KEY = 'seqnc-intro';

function shouldPlay() {
  if (typeof window === 'undefined' || reduced) return false;
  try { if (window.sessionStorage.getItem(KEY)) return false; } catch { /* ignore */ }
  armIntro();
  return true;
}

export default function Intro() {
  const [on, setOn] = useState(shouldPlay);
  const ref = useRef(null);
  useEffect(() => {
    if (!on) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    try { window.sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    document.documentElement.style.overflow = 'hidden';
    const mark = el.querySelector('.intro__mark');
    const word = el.querySelector('.intro__word');
    const line = el.querySelector('.intro__line');
    const tl = gsap.timeline({ onComplete: () => { document.documentElement.style.overflow = ''; setOn(false); } });
    tl.fromTo(mark, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out' }, .05)
      .fromTo(word, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' }, .25)
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .9, ease: 'power3.inOut' }, .3)
      .to([mark, word], { opacity: 0, y: -10, duration: .35, ease: 'power2.in' }, 1.15)
      .to(el, { yPercent: -101, duration: .8, ease: 'power4.inOut' }, 1.3);
    /* if the fonts are slow, hold the curtain a touch longer, never past 2s */
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    tl.pause(1.14);
    let released = false;
    const release = () => { if (!released) { released = true; tl.play(); } };
    ready.then(release);
    const t = setTimeout(release, 900);
    return () => { clearTimeout(t); tl.kill(); document.documentElement.style.overflow = ''; };
  }, [on]);
  if (!on) return null;
  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro__in">
        <Mark className="intro__mark" size={44} />
        <p className="intro__word">Seqnc</p>
        <i className="intro__line" />
      </div>
    </div>
  );
}
