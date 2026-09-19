/* The last word, on night, with the ring fully resolved beside it. */
import { useT } from '../i18n.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import Ribbon from '../webgl/Ribbon.jsx';

export default function Closing() {
  const { t } = useT();
  const c = t.closing;
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="wrap">
        <div className="closing__panel" data-theme="dark">
          <i className="grain" aria-hidden="true" />
          <p className="closing__ghost" aria-hidden="true">Seqnc</p>
          <div className="closing__obj"><Ribbon variant="ring" /></div>
          <div className="closing__copy">
            <Lines as="h2" id="closing-title" className="dsp dsp--1 closing__title">{c.titleStart}<br /><span className="grad grad--night">{c.titleAccent}</span></Lines>
            <Fade><p className="lead closing__body">{c.body}</p></Fade>
            <Fade className="closing__cta"><Button href={t.calendly} calendly>{c.cta}</Button></Fade>
            <Fade><p className="mono closing__note">{c.note}</p></Fade>
            <Fade className="closing__contact"><span className="mono closing__clbl">{t.ui.contact}</span><a className="lnk closing__mail" href={`mailto:${t.email}`}>{t.email}</a></Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
