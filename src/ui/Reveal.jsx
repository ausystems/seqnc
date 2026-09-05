/* Text arrival.  Display lines are authored; running text is split as it
   enters and restored once it has landed. */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE, DUR, STAGGER } from '../engine/tokens.js';

gsap.registerPlugin(SplitText, ScrollTrigger);

export function riseLines(el, { delay = 0, stagger = STAGGER.base, duration = DUR.base, distance = 100 } = {}) {
  if (reduced) return null;
  const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'sl' });
  return gsap.fromTo(split.lines, { yPercent: distance, opacity: 0 },
    { yPercent: 0, opacity: 1, duration, ease: EASE.out, stagger, delay, onComplete: () => split.revert() });
}

export function Lines({ as: Tag = 'p', className = '', delay = 0, start = 'top 88%', children, ...rest }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => riseLines(el, { delay }) });
  });
  return <Tag ref={scope} className={`lines ${className}`} {...rest}>{children}</Tag>;
}

export function Label({ className = '', delay = 0, start = 'top 92%', children }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    gsap.set(el, { opacity: 0, y: 8 });
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, delay }) });
  });
  return <span ref={scope} className={`u scene__label ${className}`}>{children}</span>;
}

export function Display({ lines, as: Tag = 'h2', size = 1, className = '', dimLast = false, start = 'top 84%', delay = 0, id, lineClass = () => '' }) {
  const scope = useGsap((_, el) => {
    const inner = el.querySelectorAll('.hl__in');
    if (reduced) return;
    gsap.set(inner, { yPercent: 104 });
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => gsap.to(inner, { yPercent: 0, duration: 1.4, ease: EASE.out, stagger: 0.08, delay }) });
  });
  return (
    <Tag ref={scope} id={id} className={`dsp dsp--${size} ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className={`hl ${dimLast && i === lines.length - 1 && lines.length > 1 ? 'dim' : ''} ${lineClass(i)}`}>
          <span className="hl__in">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function SceneHead({ label, heading, sub, dimLast = true, className = '', headingId, size = 1, center = false }) {
  return (
    <div className={`scene__head ${center ? 'scene__head--c' : ''} ${className}`}>
      <Label>{label}</Label>
      <Display lines={heading} id={headingId} dimLast={dimLast} size={size} />
      {sub && <Lines className="lead scene__sub" delay={0.3}>{sub}</Lines>}
    </div>
  );
}
