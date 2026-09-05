/* Navigation is the HUD: wordmark, level readout, four links, one control.
   It is drawn in difference so it reads on paper and on ink alike, and it
   steps out of the way when the player moves fast. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic.jsx';
import { nav as links, brand } from '../content/copy.js';
import { useActiveScene } from '../engine/scenes.js';
import { reduced } from '../engine/device.js';

gsap.registerPlugin(ScrollTrigger);

function Roll({ value }) {
  const ref = useRef(null);
  const prev = useRef(value);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prev.current === value) return;
    const from = prev.current; prev.current = value;
    if (reduced) { el.querySelector('.roll__cur').textContent = value; return; }
    const dir = value > from ? 1 : -1;
    const out = el.querySelector('.roll__cur'), inn = el.querySelector('.roll__next');
    inn.textContent = value;
    gsap.timeline()
      .set(inn, { yPercent: 110 * dir })
      .to(out, { yPercent: -110 * dir, duration: 0.5, ease: 'expo.inOut' }, 0)
      .to(inn, { yPercent: 0, duration: 0.5, ease: 'expo.inOut' }, 0)
      .add(() => { out.textContent = value; gsap.set(out, { yPercent: 0 }); gsap.set(inn, { yPercent: 110 }); });
  }, [value]);
  return (
    <span ref={ref} className="roll">
      <span className="roll__cur">{value}</span>
      <span className="roll__next" aria-hidden="true" />
    </span>
  );
}

export default function Nav() {
  const scene = useActiveScene();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let h = false;
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll(), vh = window.innerHeight;
        const show = self.direction === -1 || y < vh * 0.4;
        const next = show ? false : (self.direction === 1 && y > vh * 1.1 && Math.abs(self.getVelocity()) > 120) || (h && self.direction === 1);
        if (next !== h) { h = next; setHidden(h); }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <header className={`nav ${hidden ? 'is-hidden' : ''}`}>
      <a className="nav__brand" href="#top" aria-label="Seqnc — back to top">
        <svg className="nav__mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18 L11 6 L15 12 L21 6" /></svg>
        <span>{brand.name}</span>
      </a>

      <div className="nav__hud u" aria-live="polite">
        <span className="nav__hudk">Seq</span>
        <Roll value={String(scene.index).padStart(2, '0')} />
        <span className="nav__hudsep" aria-hidden="true" />
        <span className="nav__hudn">{scene.name}</span>
      </div>

      <nav className="nav__links" aria-label="Primary">
        {links.map((l) => (
          <a key={l.href} className="nav__link u" href={l.href} data-cursor="link"><span>{l.label}</span></a>
        ))}
      </nav>

      <Magnetic as="a" href="#book" className="btn nav__cta" strength={0.28}>
        <span className="btn__lab"><span>Book Free Review</span><span aria-hidden="true">Book Free Review</span></span>
      </Magnetic>
    </header>
  );
}
