/* =========================================================================
   Cancel: a switch that lets go, any time, and keeps showing it.  The word, the switch and the check stand from the start.  The switch turns
   itself on, holds, and turns itself off again without end: the knob
   glides with a small stretch and settles, the violet drains to paper,
   and the check pulses each time it lets go.  While the switch is on,
   its light spills onto the stage; when it lets go, the stage goes dark
   again and the ring behind the switch sails out.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Check } from './icons.jsx';
import '../../styles/scenes/cancel.css';

const CW = 260, CH = 220;
const WORD = { x: 36, y: 26 };
const SW = { x: 36, y: 108, w: 120, h: 64, knob: 56, pad: 4 };
const ON = SW.w - SW.knob - SW.pad * 2; /* how far the knob travels */
const LIVE = { x: SW.pad + ON + SW.knob / 2 - 4, y: SW.h / 2 - 4 };
const BADGE = { x: 182, y: SW.y + SW.h / 2 - 13, chk: 26 };

export default function Cancel({ d, className = '' }) {
  const ref = useScene((el) => {
    const track = el.querySelector('.can__track');
    const fill = el.querySelector('.can__fill');
    const knob = el.querySelector('.can__knob');
    const halo = track.querySelector('.halo');
    const chk = el.querySelector('.can__chk');
    const spill = el.querySelector('.can__spill');
    const word = el.querySelector('.can__word');
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
      /* on */
      .to(knob, { x: ON, duration: .5, ease: 'power3.inOut' }, 0)
      .fromTo(knob, { scaleX: 1 }, { scaleX: 1.14, duration: .24, ease: 'power2.out' }, 0)
      .to(knob, { scaleX: 1, duration: .5, ease: 'elastic.out(1, .6)' }, .24)
      .to(fill, { opacity: 1, duration: .45, ease: 'power2.inOut' }, .05)
      .fromTo(halo, { scale: .6, opacity: 0 }, { scale: 1, opacity: .8, duration: .6, ease: 'power2.out' }, .1)
      .to(spill, { opacity: 1, duration: .6, ease: 'power2.out' }, .05)
      /* hold, then off */
      .to(track, { scale: .965, duration: .16, ease: 'power2.out' }, 1.9)
      .to(track, { scale: 1, duration: .7, ease: 'back.out(2.5)' }, 2.06)
      .to(knob, { x: 0, duration: .55, ease: 'power3.inOut' }, 2.0)
      .fromTo(knob, { scaleX: 1 }, { scaleX: 1.14, duration: .24, ease: 'power2.out' }, 2.0)
      .to(knob, { scaleX: 1, duration: .55, ease: 'elastic.out(1, .6)' }, 2.24)
      .to(fill, { opacity: 0, duration: .5, ease: 'power2.inOut' }, 2.05)
      .to(halo, { opacity: 0, scale: 1.6, duration: .8, ease: 'power2.out' }, 2.0)
      .to(spill, { opacity: 0, duration: .7, ease: 'power2.inOut' }, 2.05)
      .fromTo(chk, { scale: 1 }, { scale: 1.25, duration: .3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 2.4);
    /* the word breathes on its own, so the picture never stands still during the hold */
    return gsap.timeline()
      .add(tl, 0)
      .to(word, { y: -2, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp can" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" style={{ left: WORD.x, top: WORD.y }}>
            <span className="ob__big can__word">{d.cancel}</span>
          </div>
          <div className="lyr" style={{ left: BADGE.x, top: BADGE.y }}>
            <span className="chk can__chk" style={{ width: BADGE.chk, height: BADGE.chk }}><Check /></span>
          </div>
          <div className="lyr" style={{ left: SW.x, top: SW.y }}>
            <i className="can__spill" aria-hidden="true" />
            <div className="ob ob--pill can__track" style={{ width: SW.w, height: SW.h }}>
              <i className="halo" />
              <i className="can__fill" />
              <i className="mk mk--live can__live" style={{ left: LIVE.x, top: LIVE.y }} />
              <i className="can__knob" style={{ top: SW.pad, left: SW.pad, width: SW.knob, height: SW.knob }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
