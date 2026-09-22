/* =========================================================================
   The three systems as a bento.  Each tile carries a scene, a small
   working picture of its system that plays once as the tile arrives and
   then stays: the channels landing in one inbox, the handoffs triggering
   each other, the follow-ups leaving on their days.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { Fade } from '../ui/Reveal.jsx';
import Head from '../ui/Head.jsx';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Glyph } from '../ui/Mark.jsx';
import Inbound from './scenes/Inbound.jsx';
import Operations from './scenes/Operations.jsx';
import Outbound from './scenes/Outbound.jsx';

/* the shared lower half of a tile: numeral, title, body, the three points, the demo */
function Text({ i, sys, demo, t }) {
  return (
    <div className="sys__text">
      <p className="num sys__n" aria-hidden="true">0{i + 1}</p>
      <h3 className="dsp dsp--2 sys__t">{sys.title}</h3>
      <p className="sys__d">{sys.body}</p>
      <ul className="tick sys__ticks">
        {sys.bullets.map((b) => <li key={b}><Glyph />{b}</li>)}
      </ul>
      {demo && (
        <div className="sys__demo">
          <MonoLink href={demo.href}>{t.ui.tryDemo}</MonoLink>
          <span className="sys__demotitle">{demo.title}</span>
        </div>
      )}
    </div>
  );
}

const TILES = [
  { key: 'inbound', Scene: Inbound, pick: (s) => s },
  { key: 'operations', Scene: Operations, pick: (s) => ({ steps: s.steps }) },
  { key: 'outbound', Scene: Outbound, pick: (s) => ({ sequence: s.sequence }), wide: true },
];

export default function Systems() {
  const { t } = useT();
  const s = t.systems, d = t.demos;
  const ref = useGsap((_, el) => {
    if (reduced) return;
    gsap.from(el.querySelectorAll('.sys'), { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, clearProps: 'transform', scrollTrigger: { trigger: el.querySelector('.sgrid'), start: 'top 82%', once: true } });
  }, []);
  return (
    <section className="section systems" id="systems" ref={ref} aria-labelledby="systems-title">
      <div className="wrap">
        <Head id="systems-title" title={`${s.titleLines[0]} ${s.titleLines[1]}`} accent={s.titleLines[2]} lead={s.body} />
        <div className="sgrid">
          {TILES.map(({ key, Scene, pick, wide }, i) => (
            <article className={`sys sys--${key}`} id={key} key={key}>
              <Scene d={pick(s[key])} className="sys__scene" wide={wide} />
              <Text i={i} sys={s[key]} demo={d[key]} t={t} />
            </article>
          ))}
        </div>
        <Fade className="cta-row systems__cta">
          <p className="cta-row__lead">{t.offer.systems}</p>
          <Button href={t.calendly} calendly>{t.hero.cta}</Button>
        </Fade>
      </div>
    </section>
  );
}
