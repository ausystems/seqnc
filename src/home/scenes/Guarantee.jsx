/* =========================================================================
   Guarantee: ninety days, money back, as a gauge.  A white dial (the
   hero) with a thick violet arc sweeping three quarters of the way round
   and a lit head riding its end; inside, the figure counts up to ninety
   with its unit; beside it the label lands as a pill with a shield.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Shield } from './icons.jsx';
import '../../styles/scenes/guarantee.css';

const CW = 340, CH = 200;
const DIAL = { x: 26, y: 18, s: 164 };
const R = 66, SWEEP = 270;
const C = 2 * Math.PI * R, ARC = C * SWEEP / 360;
const A0 = 135; /* the arc starts at the lower left */
const pt = (deg) => { const a = (deg * Math.PI) / 180; return { x: 82 + Math.cos(a) * R, y: 82 + Math.sin(a) * R }; };

export default function Guarantee({ d, className = '' }) {
  const target = Number(d.ringValue) || 0;
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const dial = el.querySelector('.gua__dial');
    const arc = el.querySelector('.gua__arc');
    const head = el.querySelector('.gua__head');
    const n = el.querySelector('.gua__n');
    const pill = el.querySelector('.gua__pill');
    const o = { v: 0 };
    const place = () => { const p = pt(A0 + (o.v / target) * SWEEP); head.setAttribute('cx', p.x); head.setAttribute('cy', p.y); };
    place();
    tl.from(dial, { scale: .88, opacity: 0, transformOrigin: '50% 50%', duration: 1, ease: 'expo.out' }, 0)
      .fromTo(arc, { strokeDashoffset: ARC }, { strokeDashoffset: 0, duration: 1.7, ease: 'power3.inOut' }, .4)
      .to(o, { v: target, duration: 1.7, ease: 'power3.inOut', snap: { v: 1 }, onUpdate: () => { n.textContent = Math.round(o.v); place(); } }, .4)
      .from(head, { attr: { r: 0 }, duration: .4, ease: 'back.out(2)' }, .4)
      .from(pill, { x: -14, opacity: 0, duration: .8, ease: 'expo.out' }, 1.9)
      .from(pill.querySelector('.ico'), { scale: 0, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2.4)' }, 2.05);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp gua" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="2" style={{ left: DIAL.x, top: DIAL.y }}>
            <div className="ob gua__dial" style={{ width: DIAL.s, height: DIAL.s }}>
              <svg viewBox="0 0 164 164" aria-hidden="true">
                <circle cx="82" cy="82" r={R} className="gua__track" style={{ strokeDasharray: `${ARC} ${C}` }} />
                <circle cx="82" cy="82" r={R} className="gua__arc" style={{ strokeDasharray: `${ARC} ${C}`, strokeDashoffset: ARC }} />
                <circle r="7" className="gua__head" />
              </svg>
              <div className="gua__fig"><span className="ob__big gua__n">0</span><span className="ob__k gua__u">{d.ringUnit}</span></div>
            </div>
          </div>
          <div className="lyr" data-depth="3" style={{ left: 196, top: 84 }}>
            <div className="ob ob--pill gua__pill"><Shield /><span className="ob__k">{d.ringLabel}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
