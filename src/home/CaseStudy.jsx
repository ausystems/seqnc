/* =========================================================================
   The case study.  One client, told as before and after: the name set
   large, the two states side by side, what was built, the live link.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import { MonoLink } from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import { Arrow } from '../ui/Icons.jsx';

export default function CaseStudy() {
  const { t } = useT();
  const w = t.work;
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work__head">
          <Fade className="work__client">
            <img src="/divos-logo.jpg" alt="" width="72" height="72" loading="lazy" />
            <div>
              <Lines as="h2" id="work-title" className="dsp dsp--1" stagger={.1}>{w.client}</Lines>
              <p className="mono work__meta">{w.meta}</p>
            </div>
          </Fade>
          <Fade className="work__link" delay={.15}><MonoLink href={w.liveUrl}>{w.link}</MonoLink></Fade>
        </div>
        <div className="work__ba">
          <Fade className="work__col work__col--before">
            <p className="mono work__lbl">{w.beforeLabel}</p>
            <p className="work__state">{w.before}</p>
          </Fade>
          <div className="work__arrow" aria-hidden="true"><Arrow className="" /></div>
          <Fade className="work__col work__col--after" delay={.12}>
            <p className="mono work__lbl work__lbl--after">{w.afterLabel}</p>
            <p className="work__state">{w.after}</p>
            <ul className="work__chips">
              {w.chips.map((c) => <li key={c} className="mono"><Glyph />{c}</li>)}
            </ul>
          </Fade>
        </div>
        <Fade><p className="work__soon">{w.comingSoon}</p></Fade>
      </div>
    </section>
  );
}
