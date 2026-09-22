/* =========================================================================
   Operations: four handoffs that trigger themselves.  Four cards stand in
   a pipeline (mid layer); a pulse of light (near layer) runs down the
   soft track behind them, and each card it reaches lifts, takes its check
   and shows its state.  The last card ends lit in violet: the work is
   delivered, and its live dot keeps breathing.
   ========================================================================= */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useScene } from '../../engine/tile.js';
import { Pen, Doc, Team, Flag, Check } from './icons.jsx';
import '../../styles/scenes/operations.css';

gsap.registerPlugin(MotionPathPlugin);

const CW = 340, CH = 260;
const ICONS = [Pen, Doc, Team, Flag];
const CARD = { x: 58, w: 244, h: 46, gap: 12, y0: 18 };
const TRACK = { x: 30, y: CARD.y0 + 8 };

export default function Operations({ d, className = '' }) {
  const rows = d.steps.slice(0, 4);
  const yOf = (i) => CARD.y0 + i * (CARD.h + CARD.gap);
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const cards = el.querySelectorAll('.ops__card');
    const track = el.querySelector('.ops__track');
    const pulse = el.querySelector('.ops__pulse');
    const last = cards.length - 1;
    tl.from(track, { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, ease: 'expo.out' }, 0)
      .from(cards, { x: 24, opacity: 0, duration: .8, ease: 'expo.out', stagger: .1 }, .1)
      .set(pulse, { opacity: 1, y: 0 }, .5);
    rows.forEach((_, i) => {
      const at = .55 + i * .5;
      const c = cards[i];
      tl.to(pulse, { y: i * (CARD.h + CARD.gap), duration: .42, ease: 'power2.inOut' }, at)
        .to(c, { y: -3, duration: .25, ease: 'power2.out' }, at + .3)
        .to(c, { y: 0, duration: .6, ease: 'expo.out' }, at + .55)
        .from(c.querySelector('.chk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.4)' }, at + .32)
        .from(c.querySelector('.ops__badge'), { opacity: 0, x: 6, duration: .4 }, at + .4);
      if (i === last) {
        tl.to(c, { backgroundColor: '#7C4DCC', color: '#ffffff', duration: .6, ease: 'power2.out' }, at + .4)
          .fromTo(c.querySelector('.halo'), { scale: .6, opacity: .9 }, { scale: 1.4, opacity: 0, duration: 1, ease: 'power2.out' }, at + .45)
          .fromTo(c.querySelector('.mk'), { opacity: 0 }, { opacity: 1, duration: .4 }, at + .7)
          .to(pulse, { opacity: 0, scale: .4, duration: .4 }, at + .5);
      }
    });
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp ops" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="1" style={{ left: TRACK.x, top: TRACK.y }}>
            <i className="ops__track" style={{ height: yOf(3) - CARD.y0 + CARD.h - 16 }} />
          </div>
          {rows.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <div className="lyr" data-depth="2" key={s.label} style={{ left: CARD.x, top: yOf(i) }}>
                <div className={`ob ops__card${i === rows.length - 1 ? ' ops__card--last' : ''}`} style={{ width: CARD.w, height: CARD.h }}>
                  {i === rows.length - 1 && <i className="halo" />}
                  <span className="chk chk--white ops__chk"><Check /></span>
                  <Icon />
                  <span className="ob__v">{s.label}</span>
                  <span className="ob__k ops__badge">{s.badge}</span>
                  {i === rows.length - 1 && <i className="mk mk--live ops__live" />}
                </div>
              </div>
            );
          })}
          <div className="lyr" data-depth="3" style={{ left: TRACK.x - 6, top: TRACK.y + 6 }}>
            <i className="pkt ops__pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
