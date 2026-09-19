/* =========================================================================
   Proof and terms.  The one case study as a before-and-after, then the
   three pricing terms as a short numbered list, side by side.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { Glyph } from '../ui/Mark.jsx';
import { Arrow } from '../ui/Icons.jsx';

export default function Proof() {
  const { t } = useT();
  const w = t.work, p = t.pricing;
  return (
    <section className="section proof" id="pricing" aria-labelledby="proof-title">
      <div className="wrap proof__grid">
        <div className="proof__work">
          <Fade><Eyebrow n="03">{w.label}</Eyebrow></Fade>
          <div className="proof__client">
            <img src="/divos-logo.jpg" alt="" width="48" height="48" loading="lazy" />
            <div>
              <Lines as="h2" id="proof-title" className="dsp dsp--2">{w.client}</Lines>
              <p className="mono proof__meta">{w.meta}</p>
            </div>
          </div>
          <div className="proof__ba">
            <Fade><p className="mono proof__lbl">{w.beforeLabel}</p><p className="proof__before">{w.before}</p></Fade>
            <span className="proof__arrow" aria-hidden="true"><Arrow className="" /></span>
            <Fade delay={.1}><p className="mono proof__lbl proof__lbl--after">{w.afterLabel}</p><p className="proof__after">{w.after}</p></Fade>
          </div>
          <Fade as="ul" className="proof__chips" stagger={.06}>
            {w.chips.map((c) => <li key={c} className="mono"><Glyph />{c}</li>)}
          </Fade>
          <Fade className="proof__link"><MonoLink href={w.liveUrl}>{w.link}</MonoLink></Fade>
          <Fade><p className="mono--s proof__soon">{w.comingSoon}</p></Fade>
        </div>
        <div className="proof__terms">
          <Fade><Eyebrow n="04">{p.label}</Eyebrow></Fade>
          <Lines as="h2" className="dsp dsp--2 proof__ptitle">{p.title}</Lines>
          <Fade><p className="body proof__pbody">{p.body}</p></Fade>
          <Fade as="ol" className="terms" stagger={.1}>
            {p.items.map((it, i) => (
              <li className="term" key={it.title}>
                <p className="mono term__i" aria-hidden="true">0{i + 1}</p>
                <h3 className="term__t">{it.title}</h3>
                <p className="term__d">{it.desc}</p>
              </li>
            ))}
          </Fade>
          <Fade className="proof__cta"><Button href={t.calendly} calendly>{p.cta}</Button></Fade>
        </div>
      </div>
    </section>
  );
}
