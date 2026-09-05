/* The end.  The environment powers down: the utility columns settle and
   dim, and the wordmark is the last thing lit.  Move the pointer across it
   and the letters become windows onto the field beneath the page. */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import { useGsap, useScene } from '../engine/hooks.js';
import { useScroll } from '../engine/scroll.jsx';
import { reduced, finePointer } from '../engine/device.js';
import { input, onFrame } from '../engine/input.js';
import { EASE } from '../engine/tokens.js';
import { brand, footer as c } from '../content/copy.js';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef(null);
  const { scrollTo } = useScroll();
  useScene(ref, 'end', 'End');

  useGsap(ref, (ctx, el) => {
    const q = gsap.utils.selector(el);
    const mark = q('.foot__mark')[0];
    const cols = q('.foot__col');
    if (reduced) { mark.classList.add('is-static'); return undefined; }

    gsap.set(cols, { opacity: 0, y: 26 });
    gsap.set(mark, { yPercent: 18, opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(cols, { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.12 });
        gsap.to(mark, { yPercent: 0, opacity: 1, duration: 1.6, ease: EASE.out, delay: 0.3 });
      },
    });
    /* powering down: the closer the player gets to the end, the quieter the columns */
    gsap.to(cols, { opacity: 0.45, ease: 'none', scrollTrigger: { trigger: el, start: 'center 60%', end: 'bottom bottom', scrub: true } });
    ScrollTrigger.create({
      trigger: el, start: 'top 70%', end: 'bottom bottom',
      onToggle: (s) => gsap.to(input, { atmosphere: s.isActive ? 1 : 0, duration: 1.4, overwrite: 'auto' }),
    });

    if (finePointer) {
      let rect = mark.getBoundingClientRect(), n = 0;
      const off = onFrame((s) => {
        if (++n % 6 === 0) rect = mark.getBoundingClientRect();
        if (!s.present) return;
        mark.style.setProperty('--mx', `${(s.sx - rect.left).toFixed(1)}px`);
        mark.style.setProperty('--my', `${(s.sy - rect.top).toFixed(1)}px`);
        mark.style.setProperty('--mr', `${(160 + s.speed * 260).toFixed(0)}px`);
      });
      return () => off();
    }
    mark.classList.add('is-static');
    return undefined;
  });

  return (
    <footer ref={ref} className="foot band" aria-label="Footer">
      <div className="wrap g12 foot__grid">
        <div className="foot__col foot__col--a">
          <span className="u tag"><i aria-hidden="true">[</i>{brand.domain}<i aria-hidden="true">]</i></span>
          <p className="body foot__body">{c.body}</p>
          <p className="foot__status u"><i aria-hidden="true" />{brand.status}</p>
        </div>
        <nav className="foot__col foot__col--b" aria-label="Services">
          <span className="u tag"><i aria-hidden="true">[</i>Services<i aria-hidden="true">]</i></span>
          <ul className="foot__big">{c.services.map((s) => <li key={s.label}><a className="foot__link dsp" href={s.href}>{s.label}</a></li>)}</ul>
        </nav>
        <div className="foot__col foot__col--c">
          <Magnetic as="button" type="button" className="foot__top u" strength={0.25} onClick={() => scrollTo(document.documentElement)} aria-label="Back to top">
            Back to top <span aria-hidden="true">↑</span>
          </Magnetic>
        </div>
      </div>

      <div className="foot__markwrap" aria-hidden="true">
        <div className="foot__mark dsp">SEQNC</div>
      </div>

      <div className="wrap foot__bar u u--dim">
        <span>© {new Date().getFullYear()} {brand.domain}. All rights reserved.</span>
        <span className="foot__legal">{c.legal.map((l) => <a key={l.label} className="lnk" href={l.href}>{l.label}</a>)}</span>
      </div>
    </footer>
  );
}
