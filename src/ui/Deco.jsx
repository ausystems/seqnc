/* The print-shop pieces: bracketed tags, stacked rule bands, torn ink
   edges, halftone discs and the small image chips that sit inside display
   type.  All drawn, none loaded. */
import { useId, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE } from '../engine/tokens.js';

gsap.registerPlugin(ScrollTrigger);

export function Tag({ children, className = '' }) {
  return <span className={`u tag ${className}`}><i aria-hidden="true">[</i><span>{children}</span><i aria-hidden="true">]</i></span>;
}

/* five rules, thick to hair, drawn in when they enter */
export function Bands({ className = '' }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    const bars = el.querySelectorAll('i');
    gsap.set(bars, { scaleX: 0 });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(bars, { scaleX: 1, duration: 1.3, ease: EASE.out, stagger: 0.07 }) });
  });
  return <div ref={scope} className={`bands ${className}`} aria-hidden="true"><i /><i /><i /><i /><i /></div>;
}

/* a deterministic torn edge */
function tearPath(seed, w = 1440, h = 60, n = 96) {
  let s = seed * 7919 + 13;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let d = `M0 0 L0 ${(h * 0.4).toFixed(1)}`;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    const spike = rnd() < 0.18 ? rnd() * 0.5 : 0;
    const y = h * (0.28 + rnd() * 0.42 + spike);
    d += ` L${x.toFixed(1)} ${Math.min(h, y).toFixed(1)}`;
  }
  d += ` L${w} 0 Z`;
  return d;
}
/* pos: "bottom" hangs below a black element; "top" rises above it;
   "below" sits inside the top of a light element under a black one. */
export function Tear({ pos = 'bottom', seed = 3, className = '' }) {
  const d = useMemo(() => tearPath(seed), [seed]);
  return (
    <div className={`tear tear--${pos} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d={d} fill="currentColor" /></svg>
    </div>
  );
}

/* a grainy halftone sphere */
export function Halftone({ className = '', seed = 2 }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`disc ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <defs>
          <pattern id={`${id}p`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="2.4" fill="currentColor" /></pattern>
          <radialGradient id={`${id}g`} cx="36%" cy="32%" r="70%">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".35" />
            <stop offset=".72" stopColor="#fff" stopOpacity=".92" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <filter id={`${id}n`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2" seed={seed} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <mask id={`${id}m`}><circle cx="200" cy="200" r="200" fill={`url(#${id}g)`} /></mask>
        </defs>
        <circle cx="200" cy="200" r="200" className="disc__base" />
        <circle cx="200" cy="200" r="200" fill={`url(#${id}p)`} mask={`url(#${id}m)`} />
        <circle cx="200" cy="200" r="200" filter={`url(#${id}n)`} fill="#000" opacity=".3" />
      </svg>
    </div>
  );
}

/* a small "photograph" that lives inside a line of display type */
export function Chip({ kind = 'bars' }) {
  return (
    <span className={`chip chip--${kind}`} aria-hidden="true">
      {kind === 'bars' && <span className="chip__in"><i /><i /><i /><i /><i /><i /></span>}
      {kind === 'dots' && <span className="chip__in">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</span>}
      {kind === 'wave' && (
        <span className="chip__in">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="0,32 14,28 28,30 42,18 56,22 70,10 84,14 100,4" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </span>
      )}
      {kind === 'disc' && <span className="chip__in"><Halftone seed={9} /></span>}
    </span>
  );
}

export function Grain() { return <div className="grain" aria-hidden="true" />; }
