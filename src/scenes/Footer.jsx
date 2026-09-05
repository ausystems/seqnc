/* Everything visible, nothing cropped. */
import { useRef } from 'react';
import { useScene } from '../engine/hooks.js';
import { useScroll } from '../engine/scroll.jsx';
import { brand, footer as c } from '../content/copy.js';

export default function Footer() {
  const ref = useRef(null);
  const { scrollTo } = useScroll();
  useScene(ref, 'end', 'End');
  return (
    <footer ref={ref} className="foot" aria-label="Footer">
      <div className="wrap foot__in">
        <div className="foot__top g12">
          <div className="foot__brand">
            <span className="foot__logo dsp">{brand.name}</span>
            <p className="small">{c.line}</p>
            <p className="foot__status small"><i aria-hidden="true" />{brand.status}</p>
          </div>
          <nav className="foot__col" aria-label="Services"><span className="u">Services</span><ul>{c.services.map((s) => <li key={s.label}><a className="lnk" href={s.href}>{s.label}</a></li>)}</ul></nav>
          <nav className="foot__col" aria-label="Company"><span className="u">Company</span><ul>{c.company.map((s) => <li key={s.label}><a className="lnk" href={s.href}>{s.label}</a></li>)}</ul></nav>
          <div className="foot__col foot__col--end">
            <button type="button" className="lnk foot__up" onClick={() => scrollTo(document.documentElement)}>Back to top <span aria-hidden="true">↑</span></button>
          </div>
        </div>
        <div className="foot__bar small">
          <span>© {new Date().getFullYear()} {brand.domain}</span>
          <span className="foot__legal">{c.legal.map((l) => <a key={l.label} className="lnk" href={l.href}>{l.label}</a>)}</span>
        </div>
      </div>
    </footer>
  );
}
