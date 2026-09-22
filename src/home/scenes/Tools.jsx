/* =========================================================================
   Tools: four categories feeding one mark, without end.  The hub and the
   four pills stand from the start; packets keep leaving the pills along
   their arcs into the hub, which swells and rings each time one lands,
   and its live dot beats.
   ========================================================================= */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Grid, Calendar, Mail, Form } from './icons.jsx';
import '../../styles/scenes/tools.css';

gsap.registerPlugin(MotionPathPlugin);

const CW = 340, CH = 200;
const HUB = { x: 170, y: 100, r: 30 };
const ICONS = [Grid, Calendar, Mail, Form];
const PILL = { w: 126, h: 36 }; /* wide enough for 'Formulaires' */
const POS = [{ x: 10, y: 22 }, { x: CW - PILL.w - 10, y: 22 }, { x: 10, y: CH - PILL.h - 22 }, { x: CW - PILL.w - 10, y: CH - PILL.h - 22 }];
const CYCLE = 4;

export default function Tools({ d, className = '' }) {
  const nodes = d.nodes.slice(0, 4);
  const ref = useScene((el) => {
    const hub = el.querySelector('.tools__hub');
    const pills = el.querySelectorAll('.tools__pill');
    const tl = gsap.timeline();
    tl.to(hub, { scale: 1.05, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' }, 0);
    pills.forEach((p, i) => {
      tl.to(p, { y: i < 2 ? -3 : 3, duration: 2.6 + i * .25, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
      const pkt = p.querySelector('.pkt');
      const from = { x: POS[i].x + (POS[i].x < CW / 2 ? PILL.w : 0), y: POS[i].y + PILL.h / 2 };
      const to = { x: HUB.x, y: HUB.y };
      const bend = (i % 2 ? -1 : 1) * 26;
      const trip = gsap.timeline({ repeat: -1, repeatDelay: CYCLE - 1.4, delay: i * (CYCLE / 4) })
        .set(pkt, { x: 0, y: 0, opacity: 0, scale: .6 })
        .to(pkt, { opacity: 1, scale: 1, duration: .2 })
        .to(pkt, { motionPath: { path: [{ x: 0, y: 0 }, { x: (to.x - from.x) * .5, y: (to.y - from.y) * .5 + bend }, { x: to.x - from.x, y: to.y - from.y }], curviness: 1.4 }, duration: 1, ease: 'power1.inOut' }, .1)
        .to(pkt, { opacity: 0, scale: .2, duration: .2 }, .95)
        .to(hub.querySelector('.halo'), ring({ from: .9, start: .7, to: 1.5, duration: .8 }), 1.0);
      tl.add(trip, 0);
    });
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp tools" style={{ '--cw': CW, '--ch': CH }}>
          {nodes.map((n, i) => {
            const Icon = ICONS[i];
            return (
              <div className="lyr" key={n} style={{ left: POS[i].x, top: POS[i].y }}>
                <div className="ob ob--pill tools__pill" style={{ width: PILL.w, height: PILL.h }}><Icon /><span className="ob__k">{n}</span><i className="pkt" style={{ left: POS[i].x < CW / 2 ? PILL.w - 6 : -2, top: PILL.h / 2 - 4 }} /></div>
              </div>
            );
          })}
          <div className="lyr" style={{ left: HUB.x - HUB.r, top: HUB.y - HUB.r }}>
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
