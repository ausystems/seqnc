/* Text arrival primitives.  Display lines are authored; running text is
   split the moment it enters and restored once it has landed. */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { EASE, DUR, STAGGER } from '../engine/tokens.js';
import { Bands, Tag } from './Deco.jsx';

gsap.registerPlugin(SplitText, ScrollTrigger);

export function riseLines(el, { delay = 0, stagger = STAGGER.base, duration = DUR.base, distance = 100 } = {}) {
  if (reduced) return null;
  const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'sl' });
  return gsap.fromTo(split.lines, { yPercent: distance },
    { yPercent: 0, duration, ease: EASE.out, stagger, delay, onComplete: () => split.revert() });
}

export function typeIn(el, { delay = 0 } = {}) {
  if (reduced) return null;
  const split = new SplitText(el, { type: 'chars', charsClass: 'ch' });
  return gsap.fromTo(split.chars, { opacity: 0, y: 4 },
    { opacity: 1, y: 0, duration: 0.5, ease: EASE.settle, stagger: 0.014, delay, onComplete: () => split.revert() });
}

/* running text, line by line */
export function Lines({ as: Tag = 'p', className = '', delay = 0, start = 'top 88%', children, ...rest }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => riseLines(el, { delay }) });
  });
  return <Tag ref={scope} className={`lines ${className}`} {...rest}>{children}</Tag>;
}

/* the serif deck line under a title */
export function Deck({ className = '', delay = 0.3, children }) {
  return <Lines className={`deck scene__sub ${className}`} delay={delay}>{children}</Lines>;
}

/* [ a bracketed label ] that types itself in */
export function Label({ className = '', delay = 0, start = 'top 92%', children }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    const t = el.querySelector('span');
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => typeIn(t, { delay }) });
  });
  return <span ref={scope} className={className}><Tag>{children}</Tag></span>;
}

/* display heading with authored lines, arriving from below and from depth */
export function Display({ lines, as: Tag = 'h2', size = 1, className = '', dimLast = false, serif = false, start = 'top 84%', delay = 0, id, lineClass = () => '' }) {
  const scope = useGsap((_, el) => {
    const inner = el.querySelectorAll('.hl__in');
    if (reduced) return;
    gsap.set(el, { perspective: 900 });
    gsap.set(inner, { yPercent: 104 });
    ScrollTrigger.create({
      trigger: el, start, once: true,
      onEnter: () => gsap.to(inner, { yPercent: 0, duration: 1.4, ease: EASE.out, stagger: 0.08, delay }),
    });
  });
  return (
    <div className="dsp-v">
      <Tag ref={scope} id={id} className={`dsp dsp--${size} ${serif ? 'serif' : ''} ${className}`}>
        {lines.map((l, i) => (
          <span key={i} className={`hl ${dimLast && i === lines.length - 1 && lines.length > 1 ? 'dim' : ''} ${lineClass(i)}`}>
            <span className="hl__in">{l}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

export function Rule({ v = false, className = '', delay = 0, start = 'top 92%', ...rest }) {
  const scope = useGsap((_, el) => {
    if (reduced) return;
    gsap.set(el, v ? { scaleY: 0 } : { scaleX: 0 });
    ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => gsap.to(el, v ? { scaleY: 1 } : { scaleX: 1 }, { duration: 1.2, ease: EASE.out, delay }) });
  });
  return <div ref={scope} className={`rule ${v ? 'rule--v' : ''} ${className}`} {...rest} />;
}

/* label row, title, bands, deck — one composition */
export function SceneHead({ label, heading, sub, index, bands = false, dimLast = false, serif = false, className = '', headingId, size = 1 }) {
  return (
    <div className={`scene__head ${className}`}>
      <div className="scene__meta">
        <Label>{label}</Label>
        {index && <span className="u idx">{index}</span>}
      </div>
      <Display lines={heading} id={headingId} dimLast={dimLast} serif={serif} size={size} />
      {bands && <Bands className="scene__bands" />}
      {sub && <Deck>{sub}</Deck>}
    </div>
  );
}
