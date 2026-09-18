/* The case study: one client, before and after, the live link, and the
   honest note that the second one is still in progress. */
import { useT } from '../i18n.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { MonoLink } from '../ui/Button.jsx';
import { Glyph } from '../ui/Mark.jsx';
import { Arrow } from '../ui/Icons.jsx';

export default function Work() {
  const { t } = useT();
  const w = t.work;
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <Fade><Eyebrow n="03">{w.label}</Eyebrow></Fade>
        <div className="work__grid">
          <div className="work__client">
            <Fade className="work__logo"><img src="/divos-logo.jpg" alt="" width="64" height="64" loading="lazy" /></Fade>
            <Lines as="h2" id="work-title" className="dsp dsp--1">{w.client}</Lines>
            <Fade><p className="mono work__meta">{w.meta}</p></Fade>
            <Fade className="work__link"><MonoLink href={w.liveUrl}>{w.link}</MonoLink></Fade>
          </div>
          <div className="work__ba">
            <Fade className="work__col work__col--before">
              <p className="mono work__lbl">{w.beforeLabel}</p>
              <p className="dsp dsp--3">{w.before}</p>
            </Fade>
            <div className="work__arrow" aria-hidden="true"><Arrow className="" /></div>
            <Fade className="work__col work__col--after">
              <p className="mono work__lbl work__lbl--after">{w.afterLabel}</p>
              <p className="dsp dsp--3">{w.after}</p>
            </Fade>
            <Fade as="ul" className="work__chips" stagger={.06}>
              {w.chips.map((c) => <li key={c} className="mono"><Glyph />{c}</li>)}
            </Fade>
          </div>
        </div>
        <Fade><p className="work__soon mono--s">{w.comingSoon}</p></Fade>
      </div>
    </section>
  );
}
