/* =========================================================================
   Fee: a one-time setup, then a monthly retainer, on the night stage.
   The two pills and the calendar stand from the start: the setup in
   paper (paid once), the retainer in violet (paid monthly).  The months
   light up one after another around the calendar while a bar beneath
   its head fills, and each time the year closes a packet leaves the
   calendar for the retainer, which answers with a ring of light.  The
   pills float against each other without end.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Calendar } from './icons.jsx';
import '../../styles/scenes/fee.css';

const CW = 340, CH = 220;
const CAL = { x: 178, y: 12, w: 150, h: 140 };
const SETUP = { x: 12, y: 40 };
const RET = { x: 30, y: 122 };
const STEP = .16; /* seconds per month */
const REST = 'rgba(201,174,245,.16)', HELD = 'rgba(168,97,230,.6)', LIT = '#A861E6';

export default function Fee({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const cells = [...el.querySelectorAll('.fee__cell')];
    const last = cells[cells.length - 1];
    const bar = el.querySelector('.fee__barfill');
    const setup = el.querySelector('.fee__setup');
    const ret = el.querySelector('.fee__ret');
    const pkt = el.querySelector('.fee__pkt');
    const year = cells.length * STEP; /* how long the calendar takes to fill */
    /* where the packet sets off (the last month) and lands (the retainer's edge), in comp units */
    const from = { x: CAL.x + last.offsetLeft + last.offsetWidth / 2, y: CAL.y + last.offsetTop + last.offsetHeight / 2 };
    const to = { x: RET.x + ret.offsetWidth - 10, y: RET.y + ret.offsetHeight / 2 };
    const round = gsap.timeline({ repeat: -1, repeatDelay: .9 })
      .fromTo(bar, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: year, ease: 'none' }, 0)
      .to(bar, { opacity: 0, duration: .4, ease: 'power2.out' }, year + .9);
    /* each month flares as it arrives and stays lit, so the year fills; the field goes dark again once the packet has left */
    cells.forEach((c, k) => {
      const lit = c === last;
      round.to(c, { keyframes: [
        { scale: 1.35, backgroundColor: LIT, boxShadow: '0 0 12px rgba(168,97,230,.9)', duration: .14, ease: 'power2.out' },
        lit ? { scale: 1, duration: .3, ease: 'power2.inOut' }
            : { scale: 1, backgroundColor: HELD, boxShadow: '0 0 0 rgba(168,97,230,0)', duration: .4, ease: 'power2.inOut' },
      ], transformOrigin: '50% 50%' }, k * STEP);
    });
    round.to(cells.filter((c) => c !== last), { backgroundColor: REST, duration: .6, ease: 'power2.inOut', stagger: .02 }, year + .9);
    round
      .set(pkt, { x: from.x, y: from.y, opacity: 0, scale: .5 }, year - .05)
      .to(pkt, { opacity: 1, scale: 1, duration: .18 }, year)
      .to(pkt, { x: to.x, duration: .75, ease: 'power1.inOut' }, year + .05)
      .to(pkt, { y: to.y, duration: .75, ease: 'power2.in' }, year + .05)
      .to(pkt, { opacity: 0, scale: .4, duration: .2 }, year + .65)
      .to(ret, { scale: 1.05, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, year + .72)
      .to(ret.querySelector('.halo'), ring({ from: .8, to: 1.6, duration: 1.1 }), year + .74);
    tl.add(round, 0)
      .to(setup, { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(ret, { y: 3, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
    return tl;
  });
  return (
    <div className={`scene scene--night ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp fee" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: CAL.x, top: CAL.y }}>
            <div className="ob fee__cal" style={{ width: CAL.w, height: CAL.h }}>
              <div className="fee__calhead"><Calendar /><span className="ob__k">{d.monthly}</span><i className="mk mk--live fee__live" /></div>
              <i className="fee__bar"><i className="fee__barfill" /></i>
              <div className="fee__cells">{Array.from({ length: 12 }, (_, k) => <i className={`fee__cell${k === 11 ? ' fee__cell--last' : ''}`} key={k} />)}</div>
            </div>
          </div>
          <div className="lyr" style={{ left: SETUP.x, top: SETUP.y }}>
            <div className="ob ob--light ob--pill fee__pill fee__setup"><span className="ob__t">{d.setup}</span><span className="ob__k">{d.once}</span></div>
          </div>
          <div className="lyr" style={{ left: RET.x, top: RET.y }}>
            <div className="ob ob--violet ob--pill fee__pill fee__ret"><i className="halo" /><span className="ob__t">{d.retainer}</span><span className="ob__k">{d.monthly}</span></div>
          </div>
          <i className="pkt fee__pkt" />
        </div>
      </div>
    </div>
  );
}
