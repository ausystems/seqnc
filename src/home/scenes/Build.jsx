/* =========================================================================
   Build: live in two to four weeks, as a seal that never stops turning.
   The disc stands complete: the legend around its edge, the rim full past
   its four ticks, the figure at the centre.  The legend turns, a bright
   segment travels the rim without end and each tick flares as it passes,
   the figure breathes, and the check beside it pulses each lap.
   ========================================================================= */
import { useId } from 'react';
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/build.css';

const CW = 340, CH = 200;
const DISC = { x: 30, y: 22, s: 156 };
const R_RIM = 66, R_TXT = 54;
const C_RIM = 2 * Math.PI * R_RIM, C_TXT = 2 * Math.PI * R_TXT;
const LAP = 4.2;

export default function Build({ d, className = '' }) {
  const id = useId().replace(/:/g, '');
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const sweep = el.querySelector('.build__sweep');
    const ticks = el.querySelectorAll('.build__tick');
    const fig = el.querySelector('.build__fig');
    const pill = el.querySelector('.build__pill');
    /* the bright segment runs the rim, the ticks flare as it reaches them */
    const lap = gsap.timeline({ repeat: -1 })
      /* from twelve o'clock, where the stylesheet rests it */
      .fromTo(sweep, { rotation: -90 }, { rotation: 270, duration: LAP, ease: 'none', transformOrigin: '50% 50%' }, 0);
    ticks.forEach((t, k) => lap.fromTo(t, { scale: 1 }, { scale: 1.7, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, ((k + 1) / 4) * LAP - .1));
    /* the check pulses as the segment comes round, and settles before the lap ends so the rim never pauses */
    lap.fromTo(pill, { scale: 1 }, { scale: 1.12, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, LAP - 1.3)
      .to(pill.querySelector('.halo'), ring({ from: .8 }), LAP - 1.25);
    tl.add(lap, 0)
      .to(fig, { scale: 1.03, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' }, 0);
    return tl;
  });
  /* the legend repeats as many times as fit the ring at a readable size (once in French, twice in English) */
  const legend = d.stamp.repeat(Math.max(1, Math.round(C_TXT / (d.stamp.length * 7.4))));
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp build" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: DISC.x, top: DISC.y }}>
            <div className="ob ob--night build__disc" style={{ width: DISC.s, height: DISC.s }}>
              <svg viewBox="0 0 156 156" aria-hidden="true">
                <defs><path id={`bl${id}`} d={`M78 78 m-${R_TXT} 0 a${R_TXT} ${R_TXT} 0 1 1 ${R_TXT * 2} 0 a${R_TXT} ${R_TXT} 0 1 1 -${R_TXT * 2} 0`} /></defs>
                <circle cx="78" cy="78" r={R_RIM} className="build__rim" />
                <circle cx="78" cy="78" r={R_RIM} className="build__sweep" style={{ strokeDasharray: `${C_RIM * .16} ${C_RIM}` }} />
                {[0, 1, 2, 3].map((k) => { const a = -Math.PI / 2 + (k + 1) * Math.PI / 2; return <circle key={k} cx={78 + Math.cos(a) * R_RIM} cy={78 + Math.sin(a) * R_RIM} r="3" className="build__tick" />; })}
                <g className="build__legend"><text className="build__text"><textPath href={`#bl${id}`} textLength={Math.round(C_TXT)} lengthAdjust="spacing">{legend}</textPath></text></g>
              </svg>
              <div className="build__fig"><span className="ob__big build__n">{d.stampCentre}</span><span className="ob__k build__u">{d.stampUnit}</span></div>
            </div>
          </div>
          <div className="lyr" style={{ left: 214, top: 82 }}>
            <div className="ob ob--pill build__pill"><i className="halo" /><span className="chk"><Check /></span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
