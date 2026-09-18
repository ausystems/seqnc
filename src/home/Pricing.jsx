/* Pricing as a term sheet: three numbered terms on hairlines, no boxes, the
   one action that gets you the actual number. */
import { useT } from '../i18n.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function Pricing() {
  const { t } = useT();
  const p = t.pricing;
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap pricing__grid">
        <div className="pricing__head">
          <Fade><Eyebrow n="06">{p.label}</Eyebrow></Fade>
          <Lines as="h2" id="pricing-title" className="dsp dsp--1">{p.title}</Lines>
          <Fade><p className="lead pricing__body">{p.body}</p></Fade>
          <Fade className="pricing__cta"><Button href={t.calendly} calendly>{p.cta}</Button></Fade>
        </div>
        <Fade as="ol" className="terms" stagger={.1}>
          {p.items.map((it, i) => (
            <li className="term" key={it.title}>
              <p className="mono term__i">0{i + 1}</p>
              <h3 className="dsp dsp--3 term__t">{it.title}</h3>
              <p className="body term__d">{it.desc}</p>
            </li>
          ))}
        </Fade>
      </div>
    </section>
  );
}
