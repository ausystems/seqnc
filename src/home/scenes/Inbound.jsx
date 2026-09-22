/* =========================================================================
   Inbound: three channels feed one inbox, and the reply is always out.
   The picture is complete from the start: three tokens, the inbox with
   its three slots and its count, the reply pill.  It never stops moving:
   the tokens breathe, a packet leaves each token in turn and arcs into
   the inbox, the slot it lands in glows, the inbox's live dot beats, and
   the reply pill sends out a ring of light.
   ========================================================================= */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useScene } from '../../engine/tile.js';
import { ring } from '../../engine/pulse.js';
import { Phone, Mail, Chat, Inbox, Check } from './icons.jsx';
import '../../styles/scenes/inbound.css';

gsap.registerPlugin(MotionPathPlugin);

const CW = 340, CH = 250;
const TOK = [{ x: 0, y: 26, r: -4, Icon: Phone }, { x: 14, y: 92, r: 0, Icon: Mail }, { x: 2, y: 158, r: 3, Icon: Chat }];
const BOX = { x: 160, y: 36, w: 180, h: 132 };
const SLOT = [{ x: 22, y: 92 }, { x: 46, y: 92 }, { x: 70, y: 92 }];
const CYCLE = 3.6; /* one packet per token per cycle */

export default function Inbound({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const toks = el.querySelectorAll('.inb__tok');
    const slots = el.querySelectorAll('.inb__slot');
    const reply = el.querySelector('.inb__reply');
    toks.forEach((t, i) => {
      tl.to(t, { y: i % 2 ? 3 : -3, duration: 2.4 + i * .35, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
      const pkt = t.querySelector('.pkt');
      const from = { x: TOK[i].x + 118, y: TOK[i].y + 20 };
      const to = { x: BOX.x + SLOT[i].x + 6, y: BOX.y + SLOT[i].y + 6 };
      const trip = gsap.timeline({ repeat: -1, repeatDelay: CYCLE - 1.6, delay: i * (CYCLE / 3) })
        .set(pkt, { x: 0, y: 0, opacity: 0, scale: .5 })
        .to(pkt, { opacity: 1, scale: 1, duration: .25 })
        .to(pkt, { motionPath: { path: [{ x: 0, y: 0 }, { x: (to.x - from.x) * .55, y: (to.y - from.y) - 34 }, { x: to.x - from.x, y: to.y - from.y }], curviness: 1.3 }, duration: 1.1, ease: 'power1.inOut' }, .1)
        .to(pkt, { opacity: 0, scale: .3, duration: .25 }, 1.05)
        .fromTo(slots[i], { scale: 1 }, { scale: 1.45, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 1.1);
      tl.add(trip, 0);
    });
    tl.to(reply, { y: 2, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
      .to(reply.querySelector('.halo'), { ...ring({ from: .75, duration: 1.4 }), repeat: -1, repeatDelay: CYCLE - 1.5 }, 1.2);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp inb" style={{ '--cw': CW, '--ch': CH }}>
          {d.channels.map((c, i) => {
            const { x, y, r, Icon } = TOK[i] || TOK[0];
            return (
              <div className="lyr" key={c} style={{ left: x, top: y }}>
                <div className="ob ob--pill inb__tok" style={{ transform: `rotate(${r}deg)` }}><Icon /><span className="ob__k">{c}</span><i className="pkt" /></div>
              </div>
            );
          })}
          <div className="lyr" style={{ left: BOX.x, top: BOX.y }}>
            <div className="ob inb__box" style={{ width: BOX.w, height: BOX.h }}>
              <div className="inb__head"><Inbox /><span className="ob__t">{d.inbox}</span><i className="mk mk--live" /></div>
              <p className="ob__k inb__when">{d.when}</p>
              <div className="inb__slots">{SLOT.map((s, i) => <i className="inb__slot" key={i} style={{ left: s.x, top: s.y }} />)}</div>
              <p className="ob__k inb__count">{d.channels.length} / {d.channels.length}</p>
            </div>
          </div>
          <div className="lyr inb__replylyr" style={{ left: 0, right: 0, top: 200 }}>
            <div className="ob ob--lit ob--pill inb__reply"><i className="halo" /><span className="chk"><Check /></span><span className="ob__v">{d.reply}</span><span className="ob__k inb__inst">{d.instantly}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
