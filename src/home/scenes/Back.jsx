/* =========================================================================
   Back: ninety days, refunded in full.  The figure,
   the field of ninety cells and the chip stand from the start; a wave of
   light keeps crossing the field from the top left, the last cell flares
   as it arrives and sends a packet across to the chip, whose check
   pulses as it lands.  A bloom breathes behind the figure and the chip
   floats, so nothing in the picture ever stands still.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/back.css';

const CW = 340, CH = 220;
const COLS = 15;
const FIELD = { x: 22, y: 128 };
const CHIP = { x: 222, y: 160 };

export default function Back({ d, className = '' }) {
  const n = Number(d.n) || 0;
  const ref = useScene((el) => {
    /* the lit last cell keeps its own light; the wave runs over the others */
    const cells = el.querySelectorAll('.back__cell:not(.back__cell--last)');
    const last = el.querySelector('.back__cell--last');
    const chip = el.querySelector('.back__chip');
    const chk = chip.querySelector('.chk');
    const pkt = el.querySelector('.back__pkt');
    const glow = el.querySelector('.back__glow');
    const rows = Math.ceil(n / COLS);
    /* the packet's trip, from the last day to the chip's check, in comp units */
    const from = last ? { x: FIELD.x + last.offsetLeft + last.offsetWidth / 2, y: FIELD.y + last.offsetTop + last.offsetHeight / 2 } : { x: 0, y: 0 };
    const to = { x: CHIP.x + chk.offsetLeft + chk.offsetWidth / 2, y: CHIP.y + chk.offsetTop + chk.offsetHeight / 2 };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .9 })
      .fromTo(cells, { scale: 1, opacity: .85 }, { scale: 1.45, opacity: 1, backgroundColor: '#F4F1F8', duration: .32, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%', stagger: { each: .02, grid: [rows, COLS], from: 'start' } }, 0)
      .fromTo(last, { scale: 1 }, { scale: 1.6, duration: .32, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '>-.25')
      .set(pkt, { x: from.x, y: from.y, opacity: 0, scale: .5 }, '<')
      .to(pkt, { opacity: 1, scale: 1, duration: .15 }, '<.1')
      .to(pkt, { x: to.x, duration: .55, ease: 'power1.inOut' }, '<')
      .to(pkt, { y: to.y, duration: .55, ease: 'power2.inOut' }, '<')
      .to(pkt, { opacity: 0, scale: .4, duration: .18 }, '>-.12')
      .fromTo(chk, { scale: 1 }, { scale: 1.3, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '<-.05')
      .to(chip.querySelector('.halo'), ring({ from: .8 }), '<');
    return gsap.timeline()
      .add(tl, 0)
      .to(chip, { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(last, { opacity: .55, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(glow, { scale: 1.18, opacity: 1, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' }, 0);
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp back" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: 22, top: 14 }}>
            <i className="back__glow" aria-hidden="true" />
            <div className="back__fig">{n > 0 && <span className="ob__big back__n">{n}</span>}<span className="ob__k back__u">{d.days}</span></div>
          </div>
          {n > 0 && (
            <div className="lyr" style={{ left: FIELD.x, top: FIELD.y }}>
              <div className="back__cells" style={{ gridTemplateColumns: `repeat(${COLS}, 8px)` }}>{Array.from({ length: n }, (_, k) => <i className={`back__cell${k === n - 1 ? ' back__cell--last' : ''}`} key={k} />)}</div>
            </div>
          )}
          <div className="lyr" style={{ left: CHIP.x, top: CHIP.y }}>
            <div className="ob ob--lit ob--pill back__chip"><i className="halo" /><span className="chk"><Check /></span><span className="ob__v">{d.full}</span></div>
          </div>
          <i className="pkt back__pkt" />
        </div>
      </div>
    </div>
  );
}
