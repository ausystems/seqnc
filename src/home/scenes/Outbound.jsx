/* =========================================================================
   Outbound: follow-ups that keep leaving on their days.  The whole
   picture stands from the start: the time track with its four markers,
   the four bubbles above their days.  A playhead sweeps the track without
   end, each marker flares as it passes, and the bubbles breathe.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { useMedia } from '../../engine/hooks.js';
import { DESKTOP } from '../../engine/device.js';
import { Star, Team, Gift, Sun } from './icons.jsx';
import '../../styles/scenes/outbound.css';

const ICONS = [Star, Team, Gift, Sun];
const CH = 260;
/* the comp comes in two widths: the tile's own on phones and tablets, a wide one on desktop */
const layout = (wide) => {
  const CW = wide ? 560 : 340;
  const TRACK = { x: 22, y: 214, w: CW - 44 };
  const BUB = wide ? { w: 124, h: 58 } : { w: 158, h: 58 };
  return { CW, TRACK, BUB };
};
/* markers spaced by the log of the day, so 1, 7, 30, 90 read as time */
const posOf = (n, max, TRACK) => TRACK.x + (Math.log(n + 1) / Math.log(max + 1)) * (TRACK.w - 8) + 4;
const SWEEP = 3.4;

export default function Outbound({ d, className = '', wide = false }) {
  const isWide = useMedia(DESKTOP) && wide;
  const { CW, TRACK, BUB } = layout(isWide);
  const seq = d.sequence.slice(0, 4);
  const max = Math.max(...seq.map((m) => m.n || 1));
  const xs = seq.map((m) => posOf(m.n || 1, max, TRACK));
  const ref = useScene((el) => {
    const head = el.querySelector('.out__head');
    const marks = el.querySelectorAll('.out__mark');
    const bubs = el.querySelectorAll('.out__bub');
    const x0 = xs[0] - TRACK.x, x1 = xs[xs.length - 1] - TRACK.x;
    const tl = gsap.timeline();
    const sweep = gsap.timeline({ repeat: -1, repeatDelay: .6 })
      .set(head, { x: x0, opacity: 0, scale: .6 })
      .to(head, { opacity: 1, scale: 1, duration: .3 })
      .to(head, { x: x1, duration: SWEEP, ease: 'none' }, .2)
      .to(head, { opacity: 0, scale: .6, duration: .35 }, .2 + SWEEP + .3);
    seq.forEach((_, i) => {
      const at = .2 + ((xs[i] - xs[0]) / (x1 - x0 || 1)) * SWEEP;
      sweep.fromTo(marks[i], { scale: 1 }, { scale: 1.6, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, at - .1)
        .fromTo(bubs[i], { scale: 1 }, { scale: 1.04, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 100%' }, at - .05);
    });
    tl.add(sweep, 0);
    bubs.forEach((b, i) => tl.to(b, { y: i % 2 ? 2 : -2, duration: 2.6 + i * .3, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0));
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp out" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: TRACK.x, top: TRACK.y }}>
            <i className="out__track" style={{ width: TRACK.w }} />
          </div>
          {seq.map((m, i) => (
            <div className="lyr" key={m.day} style={{ left: xs[i] - 5, top: TRACK.y - 3 }}>
              <i className="out__mark" />
              <span className="ob__k out__day">{m.day}</span>
            </div>
          ))}
          {seq.map((m, i) => {
            const Icon = ICONS[i];
            const sent = i < 2;
            /* on desktop the four bubbles stand in one evenly spaced row above the track; on
               smaller stages they take two rows, the early two left and the later two right */
            const top = isWide ? 92 : (i % 2 ? 22 : 106);
            const left = isWide ? 8 + i * ((CW - 16 - BUB.w) / 3) : (i < 2 ? 8 : CW - BUB.w - 8);
            return (
              <div className="lyr" key={`b${m.day}`} style={{ left, top }}>
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
          <div className="lyr" style={{ left: TRACK.x - 9, top: TRACK.y - 9 }}>
            <i className="out__head"><i className="halo" /></i>
          </div>
        </div>
      </div>
    </div>
  );
}
