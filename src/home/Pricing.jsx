/* =========================================================================
   Pricing.  No price list, so no table: the title, the reason, and three
   terms set as three columns under large light numerals.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

export default function Pricing() {
  const { t } = useT();
  const p = t.pricing;
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="pricing__head">
          <Lines as="h2" id="pricing-title" className="dsp dsp--1 pricing__title" stagger={.1}>{p.titleStart}<br /><span className="hi">{p.titleAccent}</span></Lines>
          <div>
            <Fade><p className="lead pricing__body">{p.body}</p></Fade>
            <Fade className="pricing__cta" delay={.1}><Button href={t.calendly} calendly>{p.cta}</Button></Fade>
          </div>
        </div>
        <Fade as="ol" className="terms" stagger={.12}>
          {p.items.map((it, i) => (
            <li className="term" key={it.title}>
              <p className="num term__n" aria-hidden="true">0{i + 1}</p>
              <h3 className="term__t">{it.title}</h3>
              <p className="term__d">{it.desc}</p>
            </li>
          ))}
        </Fade>
      </div>
    </section>
  );
}
