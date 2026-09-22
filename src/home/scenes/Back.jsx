/* =========================================================================
   Back: ninety days, refunded in full.  The figure stands large with its
   unit at the baseline (mid layer); under it a field of ninety cells
   fills in a wave from the top left (far layer); once the field is full
   the chip lands at the bottom right (near layer): in full.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/back.css';

const CW = 340, CH = 220;
const COLS = 15;

export default function Back({ d, className = '' }) {
  const n = Number(d.n) || 0;
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const cells = el.querySelectorAll('.back__cell');
    tl.from(el.querySelector('.back__n'), { y: 24, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .from(el.querySelector('.back__u'), { x: -8, opacity: 0, duration: .6, ease: 'expo.out' }, .4)
      .from(cells, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .4, ease: 'expo.out', stagger: { each: .012, grid: [Math.ceil(n / COLS), COLS], from: 'start' } }, .3)
      .from(el.querySelector('.back__chip'), { y: 14, opacity: 0, duration: .7, ease: 'expo.out' }, 1.55)
      .from(el.querySelector('.back__chip .chk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.4)' }, 1.7)
      .fromTo(el.querySelector('.back__chip .halo'), { scale: .6, opacity: .8 }, { scale: 1.5, opacity: 0, duration: .9 }, 1.7);
    return tl;
  });
  return (
    <div className={`scene scene--night ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp back" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="2" style={{ left: 22, top: 14 }}>
            <div className="back__fig">{n > 0 && <span className="ob__big back__n">{n}</span>}<span className="ob__k back__u">{d.days}</span></div>
          </div>
          {n > 0 && (
            <div className="lyr" data-depth="1" style={{ left: 22, top: 128 }}>
              <div className="back__cells" style={{ gridTemplateColumns: `repeat(${COLS}, 8px)` }}>{Array.from({ length: n }, (_, k) => <i className={`back__cell${k === n - 1 ? ' back__cell--last' : ''}`} key={k} />)}</div>
            </div>
          )}
          <div className="lyr" data-depth="3" style={{ left: 222, top: 160 }}>
            <div className="ob ob--violet ob--pill back__chip"><i className="halo" /><span className="chk chk--white"><Check /></span><span className="ob__v">{d.full}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
