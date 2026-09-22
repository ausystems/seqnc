/* =========================================================================
   Fee: a one-time setup, then a monthly retainer.  The setup pill lands
   first (night, mid layer); behind it a calendar card (far layer) with
   twelve months; then the retainer pill (violet, the hero, near layer)
   lands offset below, and the months tick in one by one as it does.
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
    const cal = el.querySelector('.fee__cal');
    const cells = el.querySelectorAll('.fee__cell');
    const setup = el.querySelector('.fee__setup');
    const ret = el.querySelector('.fee__ret');
    tl.from(cal, { y: 14, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .from(setup, { x: -36, opacity: 0, duration: .9, ease: 'expo.out' }, .2)
      .from(setup.querySelector('.ob__k'), { opacity: 0, x: -6, duration: .5 }, .65)
      .from(ret, { x: -36, y: 8, opacity: 0, duration: .9, ease: 'expo.out' }, .7)
      .from(ret.querySelector('.ob__k'), { opacity: 0, x: -6, duration: .5 }, 1.15)
      .from(cells, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(2)', stagger: .07 }, 1.0)
      .fromTo(ret.querySelector('.halo'), { scale: .6, opacity: .7 }, { scale: 1.4, opacity: 0, duration: 1 }, 1.9);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp fee" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="1" style={{ left: CAL.x, top: CAL.y }}>
            <div className="ob fee__cal" style={{ width: CAL.w, height: CAL.h }}>
              <div className="fee__calhead"><Calendar /><span className="ob__k">{d.monthly}</span></div>
              <div className="fee__cells">{Array.from({ length: 12 }, (_, k) => <i className={`fee__cell${k === 11 ? ' fee__cell--last' : ''}`} key={k} />)}</div>
            </div>
          </div>
          <div className="lyr" data-depth="2" style={{ left: SETUP.x, top: SETUP.y }}>
            <div className="ob ob--night ob--pill fee__pill fee__setup"><span className="ob__t">{d.setup}</span><span className="ob__k">{d.once}</span></div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: RET.x, top: RET.y }}>
            <div className="ob ob--violet ob--pill fee__pill fee__ret"><i className="halo" /><span className="ob__t">{d.retainer}</span><span className="ob__k">{d.monthly}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
