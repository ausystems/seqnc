/* =========================================================================
   Fee: a one-time setup, then a monthly retainer.  The two pills and the
   calendar stand from the start; the pills float against each other, the
   months light up one after another around the calendar without end, and
   the retainer sends out a ring of light each round.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Calendar } from './icons.jsx';
import '../../styles/scenes/fee.css';

const CW = 340, CH = 220;
const CAL = { x: 158, y: 16, w: 170, h: 128 };
const SETUP = { x: 12, y: 56 };
const RET = { x: 54, y: 126 };

export default function Fee({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const cells = el.querySelectorAll('.fee__cell');
    const setup = el.querySelector('.fee__setup');
    const ret = el.querySelector('.fee__ret');
    const round = gsap.timeline({ repeat: -1, repeatDelay: .8 });
    cells.forEach((c, k) => round.fromTo(c, { scale: 1 }, { scale: 1.3, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, k * .16));
    round.fromTo(ret.querySelector('.halo'), { scale: .6, opacity: .7 }, { scale: 1.5, opacity: 0, duration: 1.1, ease: 'power2.out' }, cells.length * .16);
    tl.add(round, 0)
      .to(setup, { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(ret, { y: 3, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp fee" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: CAL.x, top: CAL.y }}>
            <div className="ob fee__cal" style={{ width: CAL.w, height: CAL.h }}>
              <div className="fee__calhead"><Calendar /><span className="ob__k">{d.monthly}</span></div>
              <div className="fee__cells">{Array.from({ length: 12 }, (_, k) => <i className={`fee__cell${k === 11 ? ' fee__cell--last' : ''}`} key={k} />)}</div>
            </div>
          </div>
          <div className="lyr" style={{ left: SETUP.x, top: SETUP.y }}>
            <div className="ob ob--night ob--pill fee__pill fee__setup"><span className="ob__t">{d.setup}</span><span className="ob__k">{d.once}</span></div>
          </div>
          <div className="lyr" style={{ left: RET.x, top: RET.y }}>
            <div className="ob ob--violet ob--pill fee__pill fee__ret"><i className="halo" /><span className="ob__t">{d.retainer}</span><span className="ob__k">{d.monthly}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
