/* =========================================================================
   Operations: four handoffs that keep triggering themselves.  The whole
   pipeline stands complete from the start, the last card lit; a pulse of
   light runs down the track without end, and each card it passes gives a
   small nod and its check flares.  The last card's live dot beats.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Pen, Doc, Team, Flag, Check } from './icons.jsx';
import '../../styles/scenes/operations.css';

const CW = 340, CH = 260;
const ICONS = [Pen, Doc, Team, Flag];
const CARD = { x: 58, w: 244, h: 46, gap: 12, y0: 18 };
const TRACK = { x: 30, y: CARD.y0 + 8 };
const RUN = 2.6; /* seconds for the pulse to run the track */

export default function Operations({ d, className = '' }) {
  const rows = d.steps.slice(0, 4);
  const yOf = (i) => CARD.y0 + i * (CARD.h + CARD.gap);
  const ref = useScene((el) => {
    const cards = el.querySelectorAll('.ops__card');
    const pulse = el.querySelector('.ops__pulse');
    const last = yOf(rows.length - 1) - CARD.y0;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .7 })
      .set(pulse, { y: 0, opacity: 0, scale: .6 })
      .to(pulse, { opacity: 1, scale: 1, duration: .3 })
      .to(pulse, { y: last, duration: RUN, ease: 'none' }, .2)
      .to(pulse, { opacity: 0, scale: .4, duration: .35 }, .2 + RUN - .1);
    rows.forEach((_, i) => {
      const at = .2 + (i / (rows.length - 1)) * RUN;
      tl.to(cards[i], { x: 4, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1 }, at - .1)
        .fromTo(cards[i].querySelector('.ops__chk'), { scale: 1 }, { scale: 1.35, duration: .2, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, at - .05);
    });
    tl.fromTo(cards[rows.length - 1].querySelector('.halo'), { scale: .7, opacity: .8 }, { scale: 1.5, opacity: 0, duration: 1, ease: 'power2.out' }, .2 + RUN - .05);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp ops" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: TRACK.x, top: TRACK.y }}>
            <i className="ops__track" style={{ height: yOf(3) - CARD.y0 + CARD.h - 16 }} />
          </div>
          {rows.map((s, i) => {
            const Icon = ICONS[i];
            const isLast = i === rows.length - 1;
            return (
              <div className="lyr" key={s.label} style={{ left: CARD.x, top: yOf(i) }}>
                <div className={`ob ops__card${isLast ? ' ops__card--last' : ''}`} style={{ width: CARD.w, height: CARD.h }}>
                  {isLast && <i className="halo" />}
                  <span className="chk ops__chk"><Check /></span>
                  <Icon />
                  <span className="ob__v">{s.label}</span>
                  <span className="ob__k ops__badge">{s.badge}</span>
                  {isLast && <i className="mk mk--live ops__live" />}
                </div>
              </div>
            );
          })}
          <div className="lyr" style={{ left: TRACK.x - 6, top: TRACK.y + 6 }}>
            <i className="pkt ops__pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
