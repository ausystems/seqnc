/* =========================================================================
   Privacy and terms.  The approved text, unchanged, set for reading: a
   sticky index, one measure, generous leading, hex bullets, live email
   links, bold where the source marks it.
   ========================================================================= */
import { Fragment, useEffect, useState } from 'react';
import { useT } from '../i18n.jsx';
import Seo from '../ui/Seo.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import { MonoLink } from '../ui/Button.jsx';

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/g;
const BOLD = /\*\*(.+?)\*\*/g;

/* email addresses become links; **text** becomes strong */
function rich(text) {
  const parts = text.split(BOLD);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{linkify(p)}</Fragment>));
}
function linkify(text) {
  const out = [];
  let last = 0, m;
  while ((m = EMAIL.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<a key={m.index} className="lnk" href={`mailto:${m[1]}`}>{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Legal({ kind }) {
  const { t } = useT();
  const doc = t.legal[kind];
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(slug(s.heading))).filter(Boolean);
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: '-20% 0px -70% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc]);
  return (
    <>
      <Seo title={t.seo[kind].title} description={t.seo[kind].description} />
      <article className="page legal" aria-labelledby="legal-title">
        <div className="wrap">
          <header className="legal__head">
            <Fade now><MonoLink to="/" name="Seqnc" dim>{t.legal.backToHome}</MonoLink></Fade>
            <Lines as="h1" id="legal-title" className="dsp dsp--1 legal__title" now delay={.15}>{doc.title}</Lines>
            <Fade now delay={.5}><p className="mono legal__date">{t.legal.lastUpdated}</p></Fade>
          </header>
          <div className="legal__grid">
            <nav className="legal__index" aria-label={t.ui.onThisPage}>
              <p className="mono legal__ixh">{t.ui.onThisPage}</p>
              <ol>
                {doc.sections.map((s, i) => (
                  <li key={s.heading}><a href={`#${slug(s.heading)}`} className={active === slug(s.heading) ? 'is-on' : ''}><span className="mono">{String(i + 1).padStart(2, '0')}</span><span>{s.heading}</span></a></li>
                ))}
              </ol>
            </nav>
            <div className="legal__body">
              {doc.sections.map((s, i) => (
                <section className="legal__sec" key={s.heading} id={slug(s.heading)}>
                  <p className="mono legal__n">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="dsp dsp--2 legal__h">{s.heading}</h2>
                  {(s.paragraphs || []).map((p) => <p className="legal__p" key={p}>{rich(p)}</p>)}
                  {s.list && <ul className="tick legal__list">{s.list.map((li) => <li key={li}><Glyph /><span>{rich(li)}</span></li>)}</ul>}
                  {(s.after || []).map((p) => <p className="legal__p" key={p}>{rich(p)}</p>)}
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
