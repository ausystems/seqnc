/* Wordmark, four links, one control.  Frosted once the page moves; steps
   out of the way on a fast scroll down. */
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic.jsx';
import { nav as links, brand } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Nav() {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let hidden = false, scrolled = false;
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll(), vh = window.innerHeight;
        const s = y > 40;
        const show = self.direction === -1 || y < vh * 0.5;
        const h = show ? false : (self.direction === 1 && Math.abs(self.getVelocity()) > 140) || (hidden && self.direction === 1);
        if (h !== hidden || s !== scrolled) { hidden = h; scrolled = s; setState({ scrolled, hidden }); }
      },
    });
    return () => st.kill();
  }, []);
  return (
    <header className={`nav ${state.scrolled ? 'is-scrolled' : ''} ${state.hidden ? 'is-hidden' : ''}`}>
      <a className="nav__brand" href="#top" aria-label="Seqnc, back to top">{brand.name}</a>
      <nav className="nav__links" aria-label="Primary">
        {links.map((l) => <a key={l.href} className="nav__link" href={l.href}>{l.label}</a>)}
      </nav>
      <Magnetic as="a" href="#book" className="btn btn--fill btn--sm nav__cta" strength={0.1}>
        <span className="btn__lab"><span>Free review</span><span aria-hidden="true">Free review</span></span>
      </Magnetic>
    </header>
  );
}
