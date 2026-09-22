/* =========================================================================
   Guarantee: ninety days, money back, as a dial that stays lit.  The
   arc is full from the start and reads ninety; a bright segment travels
   the arc without end with a lit head riding it, the figure breathes, and
   the label beside it floats.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/guarantee.css';

const CW = 340, CH = 200;
const DIAL = { x: 26, y: 18, s: 164 };
const R = 66, SWEEP = 270;
const C = 2 * Math.PI * R, ARC = C * SWEEP / 360;
const A0 = 135; /* the arc starts at the lower left */
const LAP = 3.6;
const pt = (deg) => { const a = (deg * Math.PI) / 180; return { x: 82 + Math.cos(a) * R, y: 82 + Math.sin(a) * R }; };

export default function Guarantee({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const glow = el.querySelector('.gua__glow');
    const head = el.querySelector('.gua__head');
    const fig = el.querySelector('.gua__fig');
    const pill = el.querySelector('.gua__pill');
    const o = { t: 0 };
    const place = () => { const p = pt(A0 + o.t * SWEEP); head.setAttribute('cx', p.x); head.setAttribute('cy', p.y); };
    place();
    const lap = gsap.timeline({ repeat: -1, repeatDelay: .4 })
      .fromTo(glow, { strokeDashoffset: ARC * .18 }, { strokeDashoffset: -ARC, duration: LAP, ease: 'none' }, 0)
      .fromTo(o, { t: 0 }, { t: 1, duration: LAP, ease: 'none', onUpdate: place }, 0)
      /* the head lights as it sets off and dims as it reaches the end, so the lap closes without a jump;
         eight half-beats of the radius fit the lap exactly */
      .fromTo(head, { opacity: 0 }, { opacity: 1, duration: .3, ease: 'power2.out' }, 0)
      .to(head, { opacity: 0, duration: .3, ease: 'power2.in' }, LAP - .3)
      .fromTo(head, { attr: { r: 6 } }, { attr: { r: 9 }, duration: LAP / 8, ease: 'sine.inOut', yoyo: true, repeat: 7 }, 0);
    tl.add(lap, 0)
      .to(fig, { scale: 1.03, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' }, 0)
      .to(pill, { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp gua" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: DIAL.x, top: DIAL.y }}>
            <div className="ob gua__dial" style={{ width: DIAL.s, height: DIAL.s }}>
              <svg viewBox="0 0 164 164" aria-hidden="true">
                <circle cx="82" cy="82" r={R} className="gua__arc" style={{ strokeDasharray: `${ARC} ${C}` }} />
                <circle cx="82" cy="82" r={R} className="gua__glow" style={{ strokeDasharray: `${ARC * .18} ${C}` }} />
                <circle cx={pt(A0).x} cy={pt(A0).y} r="7" className="gua__head" />
              </svg>
              <div className="gua__fig"><span className="ob__big gua__n">{d.ringValue}</span><span className="ob__k gua__u">{d.ringUnit}</span></div>
            </div>
          </div>
          <div className="lyr" style={{ left: 196, top: 84 }}>
            <div className="ob ob--pill gua__pill"><span className="chk"><Check /></span><span className="ob__k">{d.ringLabel}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
