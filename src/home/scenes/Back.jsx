/* =========================================================================
   Back: ninety days, refunded in full.  The figure, the field of ninety
   cells and the chip stand from the start; a wave of light keeps
   crossing the field from the top left, the last cell flares as it
   arrives, and the chip's check pulses with it.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/back.css';

const CW = 340, CH = 220;
const COLS = 15;

export default function Back({ d, className = '' }) {
  const n = Number(d.n) || 0;
  const ref = useScene((el) => {
    /* the lit last cell keeps its own light; the wave runs over the others */
    const cells = el.querySelectorAll('.back__cell:not(.back__cell--last)');
    const last = el.querySelector('.back__cell--last');
    const chip = el.querySelector('.back__chip');
    const rows = Math.ceil(n / COLS);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .9 })
      .fromTo(cells, { scale: 1, opacity: .85 }, { scale: 1.45, opacity: 1, duration: .32, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%', stagger: { each: .02, grid: [rows, COLS], from: 'start' } }, 0)
      .fromTo(el.querySelector('.back__chip .chk'), { scale: 1 }, { scale: 1.3, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '>-.2')
      .to(el.querySelector('.back__chip .halo'), ring({ from: .8 }), '<')
      .fromTo(last, { scale: 1 }, { scale: 1.5, duration: .32, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '<');
    /* the chip floats and the last cell breathes, so the field is never still */
    return gsap.timeline()
      .add(tl, 0)
      .to(chip, { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(last, { opacity: .55, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
  });
  return (
    <div className={`scene scene--night ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp back" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: 22, top: 14 }}>
            <div className="back__fig">{n > 0 && <span className="ob__big back__n">{n}</span>}<span className="ob__k back__u">{d.days}</span></div>
          </div>
          {n > 0 && (
            <div className="lyr" style={{ left: 22, top: 128 }}>
              <div className="back__cells" style={{ gridTemplateColumns: `repeat(${COLS}, 8px)` }}>{Array.from({ length: n }, (_, k) => <i className={`back__cell${k === n - 1 ? ' back__cell--last' : ''}`} key={k} />)}</div>
            </div>
          )}
          <div className="lyr" style={{ left: 222, top: 160 }}>
            <div className="ob ob--violet ob--pill back__chip"><i className="halo" /><span className="chk chk--white"><Check /></span><span className="ob__v">{d.full}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
