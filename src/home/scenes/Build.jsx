/* =========================================================================
   Build: live in two to four weeks, as a seal.  A night disc carries the
   legend around its edge (turning slowly, always), a violet rim that
   fills from the first week to the fourth past four ticks, and the
   figure at its centre.  When the rim closes, a small pill with a bolt
   pops in beside it: live.
   ========================================================================= */
import { useId } from 'react';
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Bolt } from './icons.jsx';
import '../../styles/scenes/build.css';

const CW = 340, CH = 200;
const DISC = { x: 30, y: 22, s: 156 };
const R_RIM = 66, R_TXT = 54;
const C_RIM = 2 * Math.PI * R_RIM;

export default function Build({ d, className = '' }) {
  const id = useId().replace(/:/g, '');
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const disc = el.querySelector('.build__disc');
    const rim = el.querySelector('.build__rim');
    const ticks = el.querySelectorAll('.build__tick');
    const fig = el.querySelector('.build__fig');
    const pill = el.querySelector('.build__pill');
    tl.from(disc, { scale: .86, opacity: 0, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' }, 0)
      .from(fig, { y: 10, opacity: 0, duration: .8, ease: 'expo.out' }, .3)
      .fromTo(rim, { strokeDashoffset: C_RIM }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, .5);
    ticks.forEach((t, i) => tl.to(t, { fill: '#C9AEF5', scale: 1.5, transformOrigin: '50% 50%', duration: .3, ease: 'back.out(2)' }, .5 + (i + 1) * .4 - .05));
    tl.from(pill, { scale: .6, opacity: 0, transformOrigin: '0% 50%', duration: .7, ease: 'back.out(2)' }, 2.05)
      .fromTo(pill.querySelector('.halo'), { scale: .6, opacity: .8 }, { scale: 1.5, opacity: 0, duration: .9 }, 2.1);
    return tl;
  });
  const legend = `${d.stamp}${d.stamp}`;
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp build" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="2" style={{ left: DISC.x, top: DISC.y }}>
            <div className="ob ob--night build__disc" style={{ width: DISC.s, height: DISC.s }}>
              <svg viewBox="0 0 156 156" aria-hidden="true">
                <defs><path id={`bl${id}`} d={`M78 78 m-${R_TXT} 0 a${R_TXT} ${R_TXT} 0 1 1 ${R_TXT * 2} 0 a${R_TXT} ${R_TXT} 0 1 1 -${R_TXT * 2} 0`} /></defs>
                <circle cx="78" cy="78" r={R_RIM} className="build__track" />
                <circle cx="78" cy="78" r={R_RIM} className="build__rim" style={{ strokeDasharray: C_RIM, strokeDashoffset: C_RIM }} />
                {[0, 1, 2, 3].map((k) => { const a = -Math.PI / 2 + (k + 1) * Math.PI / 2; return <circle key={k} cx={78 + Math.cos(a) * R_RIM} cy={78 + Math.sin(a) * R_RIM} r="3" className="build__tick" />; })}
                <g className="build__legend"><text className="build__text"><textPath href={`#bl${id}`} textLength={Math.round(2 * Math.PI * R_TXT)} lengthAdjust="spacing">{legend}</textPath></text></g>
              </svg>
              <div className="build__fig"><span className="ob__big build__n">{d.stampCentre}</span><span className="ob__k build__u">{d.stampUnit}</span></div>
            </div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: 214, top: 82 }}>
            <div className="ob ob--pill build__pill"><i className="halo" /><Bolt /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
