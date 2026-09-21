/* =========================================================================
   Included with every build: three tiles, one idea each, every line from
   published copy.  Each tile carries a small illustration with its own
   choreography; it plays once as the tile enters and replays on hover (or
   on tap, where there is no hover), while the tile itself lifts.
   ========================================================================= */
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { useTile } from '../engine/tile.js';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';

gsap.registerPlugin(DrawSVGPlugin);

/* 01  tools (night): four categories connect into the mark */
function Tools({ d }) {
  const ref = useTile((el) => gsap.timeline()
    .from(el.querySelectorAll('.btool'), { opacity: 0, scale: .9, transformOrigin: '50% 50%', duration: .6, ease: 'expo.out', stagger: .1 })
    .from(el.querySelectorAll('.bwire'), { drawSVG: '0%', duration: .9, ease: 'power2.inOut', stagger: .12 }, .3)
    .from(el.querySelector('.bhub'), { scale: .6, transformOrigin: '50% 50%', opacity: 0, duration: .7, ease: 'back.out(1.8)' }, .9)
    .fromTo(el.querySelector('.bhub__pulse'), { scale: .6, opacity: .8, transformOrigin: '50% 50%' }, { scale: 2.2, opacity: 0, duration: 1.2, ease: 'power2.out' }, 1.3));
  const pos = [[52, 46], [268, 46], [52, 154], [268, 154]];
  return (
    <article className="btile btile--tools" data-theme="dark" ref={ref}>
      <div className="btile__vis" aria-hidden="true">
        <svg viewBox="0 0 320 200" className="btools">
          {pos.map(([x, y], i) => <path key={i} className="bwire" d={`M${x < 160 ? x + 40 : x - 40} ${y} C ${160} ${y}, ${160} 100, 160 100`} />)}
          <circle className="bhub__pulse" cx="160" cy="100" r="16" />
          <g className="bhub" transform="translate(160 100)">
            <path d="M0 -15 13 -7.5v15L0 15l-13-7.5v-15L0 -15Z" className="bhub__hex" />
            <path d="M0 -15V15M-13 -7.5 13 7.5M13 -7.5 -13 7.5" className="bhub__spokes" />
            <circle r="3.2" className="bhub__core" />
          </g>
          {pos.map(([x, y], i) => (
            <g key={i} className="btool" transform={`translate(${x} ${y})`}>
              <rect x="-40" y="-14" width="80" height="28" rx="14" className="btool__pill" />
              <text textAnchor="middle" y="4.5" className="btool__lbl">{d.nodes[i]}</text>
            </g>
          ))}
        </svg>
      </div>
      <h3 className="btile__t">{d.title}</h3>
      <p className="btile__d">{d.body}</p>
    </article>
  );
}

/* 02  build: a stamp that turns, and lands */
function Build({ d }) {
  /* the legend turns about the circle's own centre (svgOrigin, in viewBox units), so it never drifts */
  const ref = useTile((el) => gsap.timeline()
    .from(el.querySelector('.bstamp'), { scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'expo.out' })
    .to(el.querySelector('.bstamp__ring'), { rotation: '+=360', svgOrigin: '100 100', duration: 18, ease: 'none', repeat: -1 }, 0));
  const id = 'bstamp-path';
  return (
    <article className="btile btile--build" ref={ref}>
      <div className="btile__vis" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="bstamp">
          <defs><path id={id} d="M100 100 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0" /></defs>
          <circle cx="100" cy="100" r="86" className="bstamp__outer" />
          <g className="bstamp__ring"><text className="bstamp__text"><textPath href={`#${id}`} textLength="452" lengthAdjust="spacing">{d.stamp}{d.stamp}</textPath></text></g>
          <text x="100" y="104" textAnchor="middle" className="bstamp__centre">{d.stampCentre}</text>
          <text x="100" y="126" textAnchor="middle" className="bstamp__unit">{d.stampUnit}</text>
        </svg>
      </div>
      <h3 className="btile__t">{d.title}</h3>
      <p className="btile__d">{d.body}</p>
    </article>
  );
}

/* 03  guarantee: the ring fills to ninety days */
const R = 62, CIRC = 2 * Math.PI * R;
function Guarantee({ d }) {
  const ref = useTile((el) => {
    const n = el.querySelector('.bring__n');
    const o = { v: 0 };
    return gsap.timeline()
      .fromTo(el.querySelector('.bring__arc'), { strokeDashoffset: CIRC }, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut' })
      .to(o, { v: Number(d.ringValue), duration: 1.6, ease: 'power3.inOut', snap: { v: 1 }, onUpdate: () => { n.textContent = Math.round(o.v); } }, 0);
  });
  return (
    <article className="btile btile--ring" ref={ref}>
      <div className="btile__vis" aria-hidden="true">
        <svg viewBox="0 0 160 160" className="bring">
          <circle cx="80" cy="80" r={R} className="bring__track" />
          <circle cx="80" cy="80" r={R} className="bring__arc" style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }} />
          <text x="80" y="82" textAnchor="middle" className="bring__n">0</text>
          <text x="80" y="102" textAnchor="middle" className="bring__u">{d.ringUnit}</text>
        </svg>
        <p className="mono bring__lbl">{d.ringLabel}</p>
      </div>
      <h3 className="btile__t">{d.title}</h3>
      <p className="btile__d">{d.body}</p>
    </article>
  );
}

export default function Included() {
  const { t } = useT();
  const b = t.bento, tiles = b.tiles;
  const ref = useGsap((_, el) => {
    if (reduced) return;
    gsap.from(el.querySelectorAll('.btile'), { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, clearProps: 'transform', scrollTrigger: { trigger: el.querySelector('.bgrid'), start: 'top 84%', once: true } });
  }, []);
  return (
    <section className="section bento" id="included" ref={ref} aria-labelledby="bento-title">
      <div className="wrap">
        <div className="bento__head">
          <Lines as="h2" id="bento-title" className="dsp dsp--1 bento__title" stagger={.1}>{b.titleStart}<br /><span className="hi">{b.titleAccent}</span></Lines>
          <Fade><p className="lead bento__body">{b.body}</p></Fade>
        </div>
        <div className="bgrid">
          <Tools d={tiles.tools} />
          <Build d={tiles.build} />
          <Guarantee d={tiles.guarantee} />
        </div>
      </div>
    </section>
  );
}
