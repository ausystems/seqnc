/* =========================================================================
   Pricing.  No price list, so no table: the title, the reason, and the
   three terms as a tonal bento.  Paper, lavender, night.  Each tile
   carries a scene of its own copy: the two fees as two pills, the cancel
   switch that lets go, the ninety days that fill in.  Each picture is
   complete from the first paint and keeps moving on its own; the tile
   itself never moves.
   ========================================================================= */
import { useT } from '../i18n.jsx';
import Button from '../ui/Button.jsx';
import Head from '../ui/Head.jsx';
import Fee from './scenes/Fee.jsx';
import Cancel from './scenes/Cancel.jsx';
import Back from './scenes/Back.jsx';

/* the lower half of a tile: the term and its description */
function Text({ it }) {
  return (
    <div className="pt__text">
      <h3 className="pt__t">{it.title}</h3>
      <p className="pt__d">{it.desc}</p>
    </div>
  );
}

export default function Pricing() {
  const { t } = useT();
  const p = t.pricing, v = p.vis;
  const [fee, cancel, back] = p.items;
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <Head id="pricing-title" title={p.titleStart} accent={p.titleAccent} lead={p.body} action={<Button href={t.calendly} calendly>{p.cta}</Button>} />
        <ul className="pgrid">
          <li className="pt pt--fee"><Fee d={{ setup: v.setup, once: v.once, retainer: v.retainer, monthly: v.monthly }} className="pt__scene" /><Text it={fee} /></li>
          <li className="pt pt--cancel"><Cancel d={{ cancel: v.cancel }} className="pt__scene" /><Text it={cancel} /></li>
          {/* the figure is read from the term itself, so the picture can never say a number the copy does not */}
          <li className="pt pt--back" data-theme="dark"><Back d={{ n: Number((back.title.match(/\d+/) || [0])[0]), days: v.days, full: v.full }} className="pt__scene" /><Text it={back} /></li>
        </ul>
      </div>
    </section>
  );
}
