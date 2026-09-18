/* =========================================================================
   Text arrival.  Display type is split into lines behind masks and rises
   into place; blocks fade up.  Everything is static under reduced motion.
   ========================================================================= */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { reduced } from '../engine/device.js';
import { useFontsReady } from '../engine/hooks.js';
import { useT } from '../i18n.jsx';

gsap.registerPlugin(SplitText);

export function Lines({ as: Tag = 'div', className = '', children, now = false, delay = 0, stagger = .085, start = 'top 86%', ...rest }) {
  const ref = useRef(null);
  const fonts = useFontsReady();
  const { lang } = useT();
  useEffect(() => {
    const el = ref.current;
    if (!el || !fonts || reduced) return undefined;
    let tween;
    const split = SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
      onSplit(self) {
        tween = gsap.from(self.lines, {
          yPercent: 112, duration: 1.25, ease: 'expo.out', stagger, delay,
          scrollTrigger: now ? undefined : { trigger: el, start, once: true },
        });
        return tween;
      },
    });
    return () => { split.revert(); };
  }, [fonts, now, delay, stagger, start, lang]);
  /* the split target is keyed by language so a switch remounts fresh text */
  return (
    <Tag className={className} style={!fonts && !reduced ? { visibility: 'hidden' } : undefined} {...rest}>
      <span className="lines" key={lang} ref={ref}>{children}</span>
    </Tag>
  );
}

export function Fade({ as: Tag = 'div', className = '', children, now = false, delay = 0, y = 22, start = 'top 88%', stagger = 0, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const targets = stagger ? Array.from(el.children) : el;
    const tw = gsap.from(targets, {
      opacity: 0, y, duration: 1.05, ease: 'expo.out', delay, stagger,
      scrollTrigger: now ? undefined : { trigger: el, start, once: true },
      clearProps: 'transform',
    });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, [now, delay, y, start, stagger]);
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
