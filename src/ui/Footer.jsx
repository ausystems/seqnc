/* The footer: the lockup and its line, four short columns, the year. */
import { useT } from '../i18n.jsx';
import { A } from '../engine/transition.jsx';
import { Brand, Lang, SECTIONS } from './Nav.jsx';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const { t } = useT();
  const location = useLocation();
  const home = location.pathname === '/';
  const hash = (id) => (home ? `#${id}` : `/#${id}`);
  const HashLink = ({ id, children }) => (
    <a href={hash(id)} className="lnk" onClick={(e) => { if (!home) { e.preventDefault(); window.location.assign(`/#${id}`); } }}>{children}</a>
  );
  return (
    <footer className="foot" role="contentinfo">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <Brand />
            <p className="foot__tag mono--s">{t.footer.tagline}</p>
          </div>
          <nav className="foot__cols" aria-label="Footer">
            <div className="foot__col">
              <h2 className="mono foot__h">{t.ui.site}</h2>
              <ul>
                {SECTIONS.map((s) => <li key={s.id}><HashLink id={s.id}>{t.nav[s.key]}</HashLink></li>)}
                <li><HashLink id="faq">{t.ui.faq}</HashLink></li>
              </ul>
            </div>
            <div className="foot__col">
              <h2 className="mono foot__h">{t.ui.demos}</h2>
              <ul>
                <li><a className="lnk" href={t.demos.inbound.href}>{t.demos.inbound.tag}</a></li>
                <li><a className="lnk" href={t.demos.operations.href}>{t.demos.operations.tag}</a></li>
                <li><a className="lnk" href={t.demos.outbound.href}>{t.demos.outbound.tag}</a></li>
              </ul>
            </div>
            <div className="foot__col">
              <h2 className="mono foot__h">{t.ui.contact}</h2>
              <ul>
                <li><A className="lnk" to="/free-review" name={t.review.label}>{t.nav.cta}</A></li>
                <li><a className="lnk" href={`mailto:${t.email}`}>{t.email}</a></li>
              </ul>
            </div>
            <div className="foot__col">
              <h2 className="mono foot__h">{t.ui.legal}</h2>
              <ul>
                <li><A className="lnk" to="/privacy" name={t.footer.privacy}>{t.footer.privacy}</A></li>
                <li><A className="lnk" to="/terms" name={t.footer.terms}>{t.footer.terms}</A></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="foot__bottom">
          <p className="mono foot__copy">© {new Date().getFullYear()} {t.ui.rights}</p>
          <p className="mono foot__place">{t.ui.founded}</p>
          <Lang className="foot__lang" />
        </div>
      </div>
    </footer>
  );
}
