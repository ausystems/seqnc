/* =========================================================================
   Billing: the invoice leaves with the work, a reminder follows, it gets
   paid.  The invoice card is the hero (mid layer); the reminder slides in
   as a night bubble below it (near layer); then the stamp drops onto the
   invoice from above, scale and impact ring together, and rests there.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Receipt, Bell, Check } from './icons.jsx';
import '../../styles/scenes/billing.css';

const CW = 320, CH = 300;
const INV = { x: 30, y: 28, w: 210, h: 158 };
const REM = { x: 0, y: 214, w: 186, h: 52 };
const STAMP = { x: 150, y: 116, w: 150, h: 66, r: -8 };

export default function Billing({ d, className = '' }) {
  const [inv, rem, paid] = d.stages;
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const invoice = el.querySelector('.bill__inv');
    const bars = el.querySelectorAll('.bill__bar');
    const remind = el.querySelector('.bill__rem');
    const stamp = el.querySelector('.bill__stamp');
    tl.from(invoice, { y: 22, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .from(bars, { scaleX: 0, transformOrigin: '0% 50%', duration: .6, ease: 'expo.out', stagger: .08 }, .35)
      .from(invoice.querySelector('.bill__sent'), { opacity: 0, x: 8, duration: .5 }, .6)
      .from(remind, { x: -26, opacity: 0, duration: .8, ease: 'expo.out' }, 1.0)
      .from(remind.querySelector('.ico'), { rotation: -18, transformOrigin: '50% 0%', duration: .8, ease: 'elastic.out(1, .4)' }, 1.15)
      .fromTo(stamp, { scale: 1.7, opacity: 0, rotation: STAMP.r - 6 }, { scale: 1, opacity: 1, rotation: STAMP.r, duration: .45, ease: 'power4.in' }, 1.8)
      .to(invoice, { y: 3, duration: .12, ease: 'power2.out' }, 2.22)
      .to(invoice, { y: 0, duration: .6, ease: 'expo.out' }, 2.34)
      .fromTo(stamp.querySelector('.halo'), { scale: .5, opacity: .9 }, { scale: 1.7, opacity: 0, duration: 1, ease: 'power2.out' }, 2.24)
      .from(stamp.querySelector('.chk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.6)' }, 2.35);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp bill" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="2" style={{ left: INV.x, top: INV.y }}>
            <div className="ob bill__inv" style={{ width: INV.w, height: INV.h }}>
              <div className="bill__head"><Receipt /><span className="ob__t">{inv.label}</span><span className="ob__k bill__sent">{inv.when}</span></div>
              <i className="bill__bar" style={{ width: 120 }} /><i className="bill__bar" style={{ width: 88 }} /><i className="bill__bar" style={{ width: 104 }} />
              <i className="bill__bar bill__bar--total" style={{ width: 60 }} />
            </div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: REM.x, top: REM.y }}>
            <div className="ob ob--night ob--pill bill__rem" style={{ width: REM.w, height: REM.h }}><Bell /><span className="bill__remtext"><span className="ob__v">{rem.label}</span><span className="ob__k">{rem.when}</span></span></div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: STAMP.x, top: STAMP.y }}>
            <div className="ob ob--violet bill__stamp" style={{ width: STAMP.w, height: STAMP.h, transform: `rotate(${STAMP.r}deg)` }}>
              <i className="halo" />
              <span className="chk chk--white"><Check /></span>
              <span className="bill__stamptext"><span className="ob__big bill__paid">{paid.label}</span><span className="ob__k">{paid.when}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
