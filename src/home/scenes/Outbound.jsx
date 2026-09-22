/* =========================================================================
   Outbound: follow-ups that leave on their days.  A time track runs low
   across the comp with four markers whose spacing grows with the day; a
   violet playhead (near layer) sweeps across it, and each message it
   passes rises above its marker as a bubble: the two that went out in
   night, the two still to come as ghosts, each with its state.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Star, Team, Gift, Sun } from './icons.jsx';
import '../../styles/scenes/outbound.css';

const CW = 340, CH = 260;
const ICONS = [Star, Team, Gift, Sun];
const TRACK = { x: 22, y: 214, w: 296 };
/* markers spaced by the log of the day, so 1, 7, 30, 90 read as time */
const posOf = (n, max) => TRACK.x + (Math.log(n + 1) / Math.log(max + 1)) * (TRACK.w - 8) + 4;
const BUB = { w: 158, h: 58 };

export default function Outbound({ d, className = '' }) {
  const seq = d.sequence.slice(0, 4);
  const max = Math.max(...seq.map((m) => m.n || 1));
  const xs = seq.map((m) => posOf(m.n || 1, max));
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const head = el.querySelector('.out__head');
    const bubs = el.querySelectorAll('.out__bub');
    const marks = el.querySelectorAll('.out__mark');
    const days = el.querySelectorAll('.out__day');
    tl.from(el.querySelector('.out__track'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'expo.out' }, 0)
      .from(marks, { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)', stagger: .08 }, .3)
      .from(days, { opacity: 0, y: 4, duration: .5, stagger: .08 }, .4)
      .set(head, { x: xs[0] - TRACK.x, opacity: 1 }, .5);
    seq.forEach((m, i) => {
      const at = .6 + i * .55;
      tl.to(head, { x: xs[i] - TRACK.x, duration: i ? .5 : .01, ease: 'power2.inOut' }, at)
        .to(marks[i], { backgroundColor: '#7C4DCC', duration: .3 }, at + (i ? .4 : 0))
        .from(bubs[i], { y: 16, opacity: 0, scale: .94, transformOrigin: '50% 100%', duration: .8, ease: 'expo.out' }, at + (i ? .35 : .05))
        .from(bubs[i].querySelector('.out__badge'), { opacity: 0, duration: .4 }, at + (i ? .7 : .4));
    });
    tl.fromTo(head.querySelector('.halo'), { scale: .6, opacity: .8 }, { scale: 1.5, opacity: 0, duration: .9 }, '>-.4');
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp out" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="1" style={{ left: TRACK.x, top: TRACK.y }}>
            <i className="out__track" style={{ width: TRACK.w }} />
          </div>
          {seq.map((m, i) => (
            <div className="lyr" data-depth="1" key={m.day} style={{ left: xs[i] - 5, top: TRACK.y - 3 }}>
              <i className="out__mark" />
              <span className="ob__k out__day">{m.day}</span>
            </div>
          ))}
          {seq.map((m, i) => {
            const Icon = ICONS[i];
            const sent = i < 2;
            /* four bubbles in two rows: the early two on the left, the later two on the right,
               the odd days above and the even ones below, so they rise in order and read as time */
            const top = i % 2 ? 22 : 106;
            const left = i < 2 ? 8 : CW - BUB.w - 8;
            return (
              <div className="lyr" data-depth="2" key={`b${m.day}`} style={{ left, top }}>
                <div className={`ob out__bub ${sent ? 'ob--night' : 'ob--ghost out__bub--later'}`} style={{ width: BUB.w }}>
                  <Icon />
                  <span className="out__text">
                    <span className="ob__v">{m.msg}</span>
                    <span className="ob__k out__badge">{m.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
          <div className="lyr" data-depth="3" style={{ left: TRACK.x - 9, top: TRACK.y - 9 }}>
            <i className="out__head"><i className="halo" /></i>
          </div>
        </div>
      </div>
    </div>
  );
}
