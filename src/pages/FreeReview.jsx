/* =========================================================================
   The free review.  Everything a visitor wants to know before booking, set
   as a short editorial page, then the two real ways to reach SEQNC: the
   calendar, and email.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import Seo from '../ui/Seo.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { ArrowExt } from '../ui/Icons.jsx';

export default function FreeReview() {
  const { t } = useT();
  const r = t.review;
  return (
    <>
      <Seo title={t.seo.review.title} description={t.seo.review.description} />
      <section className="page review" aria-labelledby="review-title">
        <div className="review__obj" aria-hidden="true"><img src="/ring.webp" alt="" width="1200" height="1200" decoding="async" /></div>
        <div className="wrap">
          <Fade now delay={.1}><Eyebrow>{r.label}</Eyebrow></Fade>
          <Lines as="h1" id="review-title" className="dsp dsp--hero review__title" now delay={.2}>
            {r.titleStart} <em className="accent">{r.titleAccent}</em>
          </Lines>
          <Fade now delay={.7}><p className="lead review__lede">{r.lede}</p></Fade>
          <div className="review__grid">
            <ol className="review__sections">
              {r.sections.map((s, i) => (
                <Fade as="li" className="review__sec" key={s.label} delay={.05 * i}>
                  <p className="mono review__i">0{i + 1}</p>
                  <h2 className="dsp dsp--3 review__h">{s.label}</h2>
                  <p className="body review__p">{s.body}</p>
                </Fade>
              ))}
            </ol>
            <aside className="review__act" aria-label={t.ui.contact}>
              <Fade className="review__book" delay={.15}>
                <p className="mono review__lbl">{t.ui.stepOf(1, 4)}</p>
                <Button href={t.calendly} calendly>{r.cta}</Button>
                <p className="small review__ctanote">{r.ctaNote}</p>
              </Fade>
              <Fade className="review__mail" delay={.25}>
                <p className="mono review__lbl">{r.emailLabel}</p>
                <a className="review__email lnk" href={`mailto:${t.email}`}>{t.email}<ArrowExt className="review__ext" /></a>
                <p className="small">{r.emailNote}</p>
              </Fade>
              <Fade delay={.3}><p className="mono review__note">{r.note}</p></Fade>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
