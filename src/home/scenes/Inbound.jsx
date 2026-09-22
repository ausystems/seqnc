/* =========================================================================
   Inbound: three channels land in one inbox, and one reply leaves.
   Three tokens stand at the left (far layer); each sends a packet along
   an arc into the inbox (mid layer), whose three slots fill and whose
   count climbs; then the reply leaves as a violet pill (near layer) with
   a pulse of light.  The inbox's live dot keeps breathing afterwards.
   ========================================================================= */
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useScene } from '../../engine/tile.js';
import { Phone, Mail, Chat, Inbox, Check } from './icons.jsx';
import '../../styles/scenes/inbound.css';

gsap.registerPlugin(MotionPathPlugin);

const CW = 340, CH = 250;
const TOK = [{ x: 0, y: 26, r: -4, Icon: Phone }, { x: 14, y: 92, r: 0, Icon: Mail }, { x: 2, y: 158, r: 3, Icon: Chat }];
const BOX = { x: 160, y: 36, w: 180, h: 132 };
const SLOT = [{ x: 22, y: 92 }, { x: 46, y: 92 }, { x: 70, y: 92 }];

export default function Inbound({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const toks = el.querySelectorAll('.inb__tok');
    const box = el.querySelector('.inb__box');
    const slots = el.querySelectorAll('.inb__slot');
    const count = el.querySelector('.inb__count');
    tl.from(toks, { x: -34, opacity: 0, duration: .85, ease: 'expo.out', stagger: .14 }, 0)
      .from(box, { scale: .9, opacity: 0, transformOrigin: '50% 60%', duration: .9, ease: 'expo.out' }, .3)
      .set(count, { textContent: `0 / ${toks.length}` }, 0);
    toks.forEach((t, i) => {
      const pkt = t.querySelector('.pkt');
      const from = { x: TOK[i].x + 118, y: TOK[i].y + 20 };
      const to = { x: BOX.x + SLOT[i].x + 6, y: BOX.y + SLOT[i].y + 6 };
      const at = .95 + i * .34;
      tl.set(pkt, { x: 0, y: 0, opacity: 1, scale: .6 }, at)
        .to(pkt, { scale: 1, duration: .15 }, at)
        .to(pkt, { motionPath: { path: [{ x: 0, y: 0 }, { x: (to.x - from.x) * .55, y: (to.y - from.y) - 34 }, { x: to.x - from.x, y: to.y - from.y }], curviness: 1.3 }, duration: .75, ease: 'power2.inOut' }, at)
        .to(pkt, { opacity: 0, scale: .3, duration: .18 }, at + .68)
        .from(slots[i], { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.4)' }, at + .7)
        .set(count, { textContent: `${i + 1} / ${toks.length}` }, at + .72);
    });
    const reply = el.querySelector('.inb__reply');
    tl.from(reply, { y: 22, opacity: 0, duration: .9, ease: 'expo.out' }, 2.15)
      .fromTo(reply.querySelector('.halo'), { scale: .5, opacity: .9 }, { scale: 1.6, opacity: 0, duration: 1.2, ease: 'power2.out' }, 2.2)
      .from(reply.querySelector('.chk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.6)' }, 2.4)
      .from(reply.querySelector('.inb__inst'), { opacity: 0, x: -6, duration: .5 }, 2.55);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp inb" style={{ '--cw': CW, '--ch': CH }}>
          {d.channels.map((c, i) => {
            const { x, y, r, Icon } = TOK[i] || TOK[0];
            return (
              <div className="lyr" data-depth="1" key={c} style={{ left: x, top: y }}>
                <div className="ob ob--pill inb__tok" style={{ transform: `rotate(${r}deg)` }}><Icon /><span className="ob__k">{c}</span><i className="pkt" /></div>
              </div>
            );
          })}
          <div className="lyr" data-depth="2" style={{ left: BOX.x, top: BOX.y }}>
            <div className="ob ob--night inb__box" style={{ width: BOX.w, height: BOX.h }}>
              <div className="inb__head"><Inbox /><span className="ob__t">{d.inbox}</span><i className="mk mk--live" /></div>
              <p className="ob__k inb__when">{d.when}</p>
              <div className="inb__slots">{SLOT.map((s, i) => <i className="inb__slot" key={i} style={{ left: s.x, top: s.y }} />)}</div>
              <p className="ob__k inb__count">0 / {d.channels.length}</p>
            </div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: 104, top: 200 }}>
            <div className="ob ob--violet ob--pill inb__reply"><i className="halo" /><span className="chk chk--white"><Check /></span><span className="ob__v">{d.reply}</span><span className="ob__k inb__inst">{d.instantly}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
