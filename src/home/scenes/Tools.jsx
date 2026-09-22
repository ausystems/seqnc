/* =========================================================================
   Tools: four categories connect into one mark.  The hub at the centre is
   the hexagon, lit; the four pills stand in the corners, and from each a
   packet travels along an arc into the hub, which pulses as it lands.
   No wires: the packets are the connection.  The hub keeps breathing.
   ========================================================================= */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useScene } from '../../engine/tile.js';
import { Grid, Calendar, Mail, Form } from './icons.jsx';
import '../../styles/scenes/tools.css';

gsap.registerPlugin(MotionPathPlugin);

const CW = 340, CH = 200;
const HUB = { x: 170, y: 100, r: 30 };
const ICONS = [Grid, Calendar, Mail, Form];
const PILL = { w: 104, h: 36 };
const POS = [{ x: 10, y: 22 }, { x: CW - PILL.w - 10, y: 22 }, { x: 10, y: CH - PILL.h - 22 }, { x: CW - PILL.w - 10, y: CH - PILL.h - 22 }];

export default function Tools({ d, className = '' }) {
  const nodes = d.nodes.slice(0, 4);
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const hub = el.querySelector('.tools__hub');
    const pills = el.querySelectorAll('.tools__pill');
    tl.from(hub, { scale: .5, opacity: 0, transformOrigin: '50% 50%', duration: .9, ease: 'back.out(1.8)' }, 0)
      .from(pills, { scale: .85, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'expo.out', stagger: .09 }, .25);
    pills.forEach((p, i) => {
      const pkt = p.querySelector('.pkt');
      const from = { x: POS[i].x + (POS[i].x < CW / 2 ? PILL.w : 0), y: POS[i].y + PILL.h / 2 };
      const to = { x: HUB.x, y: HUB.y };
      const at = .9 + i * .28;
      const bend = (i % 2 ? -1 : 1) * 26;
      tl.set(pkt, { x: 0, y: 0, opacity: 1, scale: .7 }, at)
        .to(pkt, { motionPath: { path: [{ x: 0, y: 0 }, { x: (to.x - from.x) * .5, y: (to.y - from.y) * .5 + bend }, { x: to.x - from.x, y: to.y - from.y }], curviness: 1.4 }, scale: 1, duration: .7, ease: 'power2.inOut' }, at)
        .to(pkt, { opacity: 0, scale: .2, duration: .15 }, at + .62)
        .to(hub, { scale: 1.12, duration: .16, ease: 'power2.out' }, at + .62)
        .to(hub, { scale: 1, duration: .6, ease: 'expo.out' }, at + .78)
        .fromTo(hub.querySelector('.halo'), { scale: .7, opacity: .9 }, { scale: 1.5, opacity: 0, duration: .8 }, at + .64);
    });
    tl.fromTo(hub.querySelector('.mk'), { opacity: 0 }, { opacity: 1, duration: .4 }, '>-.3');
    return tl;
  });
  return (
    <div className={`scene scene--night ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp tools" style={{ '--cw': CW, '--ch': CH }}>
          {nodes.map((n, i) => {
            const Icon = ICONS[i];
            return (
              <div className="lyr" data-depth="2" key={n} style={{ left: POS[i].x, top: POS[i].y }}>
                <div className="ob ob--pill tools__pill" style={{ width: PILL.w, height: PILL.h }}><Icon /><span className="ob__k">{n}</span><i className="pkt" style={{ left: POS[i].x < CW / 2 ? PILL.w - 6 : -2, top: PILL.h / 2 - 4 }} /></div>
              </div>
            );
          })}
          <div className="lyr" data-depth="3" style={{ left: HUB.x - HUB.r, top: HUB.y - HUB.r }}>
            <div className="tools__hub" style={{ width: HUB.r * 2, height: HUB.r * 2 }}>
              <i className="halo" />
              <svg viewBox="0 0 60 60" aria-hidden="true">
                <path d="M30 6 50.8 18v24L30 54 9.2 42V18L30 6Z" className="tools__hex" />
                <path d="M30 6v48M9.2 18l41.6 24M50.8 18 9.2 42" className="tools__spokes" />
                <circle cx="30" cy="30" r="4" className="tools__core" />
              </svg>
              <i className="mk mk--live tools__live" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
