/* =========================================================================
   Cancel: a switch you can turn off, any time, and nothing holds you.
   The word stands at the top (far layer).  The switch (near layer, the
   hero) arrives on and lit: violet track, white knob at the right, a glow
   beneath.  Beside it, a small white pill carries a lock (mid layer).  After
   a beat the switch is pressed: the knob stretches and glides left with an
   elastic settle, the violet drains to paper and the glow dies; the lock's
   shackle lifts, the pill floats away, and a check pops in its place.  Idle:
   one faint live dot breathes where the knob used to rest.
   ========================================================================= */
import { gsap } from 'gsap';
import { useScene } from '../../engine/tile.js';
import { Lock, Check } from './icons.jsx';
import '../../styles/scenes/cancel.css';

const CW = 260, CH = 220;
const WORD = { x: 36, y: 26 };
const SW = { x: 36, y: 108, w: 120, h: 64, knob: 56, pad: 4 };
const ON = SW.w - SW.knob - SW.pad * 2; /* how far the knob travels */
const LIVE = { x: SW.pad + ON + SW.knob / 2 - 4, y: SW.h / 2 - 4 }; /* the dot rests where the knob was */
const BADGE = { x: 182, y: SW.y + SW.h / 2 - 18, pill: 36, chk: 26 };
const FLIP = 1.5; /* the beat at which the switch is turned off */

export default function Cancel({ d, className = '' }) {
  const ref = useScene((el) => {
    const tl = gsap.timeline();
    const word = el.querySelector('.can__word');
    const track = el.querySelector('.can__track');
    const fill = el.querySelector('.can__fill');
    const knob = el.querySelector('.can__knob');
    const halo = track.querySelector('.halo');
    const live = el.querySelector('.can__live');
    const lock = el.querySelector('.can__lock');
    const shackle = lock.querySelector('svg path:last-child');
    const chk = el.querySelector('.can__chk');
    /* the word settles in, the switch arrives on and lights up, the lock takes its place */
    tl.from(word, { y: 18, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .fromTo(word, { letterSpacing: '-.01em' }, { letterSpacing: '-.06em', duration: 1.2, ease: 'expo.out' }, 0)
      .from(track, { y: 14, scale: .92, opacity: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, .15)
      .fromTo(halo, { scale: .6, opacity: 0 }, { scale: 1, opacity: .9, duration: .8, ease: 'power2.out' }, .35)
      .from(lock, { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'back.out(1.8)' }, .5)
      /* the press: the whole switch gives a little, then settles back */
      .to(track, { scale: .965, duration: .16, ease: 'power2.out' }, FLIP - .08)
      .to(track, { scale: 1, duration: .7, ease: 'back.out(2.5)' }, FLIP + .08)
      /* the knob stretches into its glide and lands with an elastic settle */
      .fromTo(knob, { x: ON }, { x: 0, duration: .55, ease: 'power3.inOut' }, FLIP)
      .fromTo(knob, { scaleX: 1 }, { scaleX: 1.16, duration: .26, ease: 'power2.out' }, FLIP)
      .to(knob, { scaleX: 1, duration: .55, ease: 'elastic.out(1, .6)' }, FLIP + .26)
      /* the violet drains to paper and the glow dies */
      .fromTo(fill, { opacity: 1 }, { opacity: 0, duration: .5, ease: 'power2.inOut' }, FLIP + .05)
      .to(halo, { opacity: 0, scale: 1.25, duration: .6, ease: 'power2.out' }, FLIP)
      /* the shackle lifts, the pill floats away, the check pops in its place */
      .to(shackle, { y: -2.4, rotation: 14, transformOrigin: '100% 100%', duration: .3, ease: 'back.out(2)' }, FLIP - .1)
      .to(lock, { y: -10, scale: .85, opacity: 0, duration: .38, ease: 'power2.in' }, FLIP + .18)
      .fromTo(chk, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2.6)' }, FLIP + .5)
      .fromTo(live, { opacity: 0 }, { opacity: .55, duration: .5 }, FLIP + .55);
    return tl;
  });
  return (
    <div className={`scene ${className}`} ref={ref}>
      <div className="scene__stage">
        <div className="comp can" style={{ '--cw': CW, '--ch': CH }}>
          <div className="lyr" data-depth="1" style={{ left: WORD.x, top: WORD.y }}>
            <span className="ob__big can__word">{d.cancel}</span>
          </div>
          <div className="lyr" data-depth="2" style={{ left: BADGE.x, top: BADGE.y }}>
            <div className="ob ob--pill can__lock" style={{ width: BADGE.pill, height: BADGE.pill }}><Lock /></div>
            <span className="chk can__chk" style={{ left: (BADGE.pill - BADGE.chk) / 2, top: (BADGE.pill - BADGE.chk) / 2, width: BADGE.chk, height: BADGE.chk }}><Check /></span>
          </div>
          <div className="lyr" data-depth="3" style={{ left: SW.x, top: SW.y }}>
            <div className="ob ob--pill ob--soft can__track" style={{ width: SW.w, height: SW.h }}>
              <i className="halo" />
              <i className="ob ob--pill ob--violet can__fill" />
              <i className="mk mk--live can__live" style={{ left: LIVE.x, top: LIVE.y }} />
              <i className="can__knob" style={{ top: SW.pad, left: SW.pad, width: SW.knob, height: SW.knob, transform: `translateX(${ON}px)` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
