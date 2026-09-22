/* =========================================================================
   Pricing.  No price list, so no table: the title, the reason, and the
   three terms as a tonal bento.  Paper, lavender, night.  Each tile
   carries a scene of its own copy: the two fees as two pills, the cancel
   switch that lets go, the ninety days that fill in.  Tiles rise in on
   scroll, lift on hover, and their scenes replay on hover.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
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
  /* the three tiles rise in together, staggered, once; the lift transition is
     switched on only after they land so it never fights the rise */
  const ref = useGsap((_, el) => {
    const grid = el.querySelector('.pgrid');
    if (reduced) { grid.classList.add('is-in'); return; }
    gsap.from(el.querySelectorAll('.pt'), {
      y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .12, clearProps: 'transform',
      scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
      onComplete: () => grid.classList.add('is-in'),
    });
  }, []);
  return (
    <section className="section pricing" id="pricing" ref={ref} aria-labelledby="pricing-title">
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
