/* =========================================================================
   Three systems, three compositions.

   Inbound: three channels converge into one node and one reply.
   Operations: four handoffs down a line that fills as you read.
   Outbound: four messages along ninety days, spaced by time.
   Each is drawn from the published copy and links to its live demo.
   ========================================================================= */
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useT } from '../i18n.jsx';
import { useGsap, useMedia } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import Eyebrow from '../ui/Eyebrow.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';
import { MonoLink } from '../ui/Button.jsx';
import { Glyph } from '../ui/Mark.jsx';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

function Ticks({ items }) {
  return <ul className="tick sys__ticks">{items.map((b) => <li key={b}><Glyph />{b}</li>)}</ul>;
}

function SysHead({ n, s, demo, tryLabel }) {
  return (
    <div className="sys__text">
      <Fade><Eyebrow n={n}>{s.tag}</Eyebrow></Fade>
      <Lines as="h3" className="dsp dsp--2 sys__title">{s.title}</Lines>
      <Fade><p className="lead sys__body">{s.body}</p></Fade>
      <Fade><Ticks items={s.bullets} /></Fade>
      <Fade className="sys__try"><MonoLink href={demo}>{tryLabel}</MonoLink></Fade>
    </div>
  );
}

/* ----- inbound: convergence ----- */
function InboundWide({ s }) {
  return (
    <svg viewBox="0 0 720 330" className="inb__svg">
      {[64, 165, 266].map((y, i) => (
        <g key={y}>
          <text className="inb__lbl mono-svg" x="0" y={y + 4}>{s.channels[i]}</text>
          <path className="inb__in" d={`M118 ${y} C 230 ${y}, 250 165, 356 165`} />
          <circle className="inb__dot" r="3.2" />
        </g>
      ))}
      <path className="inb__out" d="M372 165 H 470" />
      <circle className="inb__dot" r="3.2" />
      <g className="inb__node" transform="translate(364 165)">
        <path d="M0 -12 10.4 -6v12L0 12l-10.4-6v-12L0 -12Z" className="inb__hex" />
        <circle r="2.6" className="inb__core" />
      </g>
      <text className="inb__reply mono-svg" x="484" y="160">{s.reply}</text>
      <text className="inb__inst mono-svg mono-svg--accent" x="484" y="180">{s.instantly}</text>
    </svg>
  );
}
/* portrait: the channels sit across the top and converge downward */
function InboundTall({ s }) {
  return (
    <svg viewBox="0 0 360 300" className="inb__svg inb__svg--tall">
      {[40, 180, 320].map((x, i) => (
        <g key={x}>
          <text className="inb__lbl mono-svg" x={x} y="24" textAnchor="middle">{s.channels[i]}</text>
          <path className="inb__in" d={`M${x} 40 C ${x} 100, 180 90, 180 150`} />
          <circle className="inb__dot" r="3" />
        </g>
      ))}
      <path className="inb__out" d="M180 166 V 214" />
      <circle className="inb__dot" r="3" />
      <g className="inb__node" transform="translate(180 158)">
        <path d="M0 -12 10.4 -6v12L0 12l-10.4-6v-12L0 -12Z" className="inb__hex" />
        <circle r="2.6" className="inb__core" />
      </g>
      <text className="inb__reply mono-svg" x="180" y="248" textAnchor="middle">{s.reply}</text>
      <text className="inb__inst mono-svg mono-svg--accent" x="180" y="270" textAnchor="middle">{s.instantly}</text>
    </svg>
  );
}
function Inbound({ s, demo, tryLabel }) {
  const tall = useMedia('(max-width: 640px)');
  const ref = useGsap((_, el) => {
    if (reduced) return;
    const ins = el.querySelectorAll('.inb__in');
    const out = el.querySelector('.inb__out');
    const node = el.querySelector('.inb__node');
    const labels = el.querySelectorAll('.inb__lbl');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 72%', once: true } });
    tl.from(labels, { opacity: 0, duration: .8, ease: 'expo.out', stagger: .08 }, 0)
      .from(ins, { drawSVG: '0%', duration: 1.4, ease: 'power2.inOut', stagger: .16 }, .1)
      .from(node, { scale: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, 1.1)
      .from(out, { drawSVG: '0%', duration: 1, ease: 'power2.inOut' }, 1.4)
      .from(el.querySelectorAll('.inb__reply, .inb__inst'), { opacity: 0, duration: .8, ease: 'expo.out', stagger: .1 }, 2.0);
    /* a signal travels each channel into the node, then out */
    const dots = el.querySelectorAll('.inb__dot');
    const paths = [...ins, out];
    dots.forEach((d, i) => {
      gsap.to(d, { motionPath: { path: paths[i], align: paths[i], alignOrigin: [.5, .5] }, duration: 1.7, ease: 'power1.inOut', repeat: -1, repeatDelay: 2.4, delay: 2.6 + (i < 3 ? i * .22 : 1.55), scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 10%', toggleActions: 'play pause resume pause' } });
    });
  }, [tall]);
  return (
    <article className="sys sys--inbound" ref={ref} id="inbound">
      <div className="wrap sys__grid">
        <figure className="sys__vis inb" aria-hidden="true">
          {tall ? <InboundTall s={s} /> : <InboundWide s={s} />}
        </figure>
        <SysHead n="01" s={s} demo={demo} tryLabel={tryLabel} />
      </div>
    </article>
  );
}

/* ----- operations: handoffs ----- */
function Operations({ s, demo, tryLabel }) {
  const ref = useGsap((_, el) => {
    if (reduced) { el.querySelectorAll('.ops__step').forEach((n) => n.classList.add('is-on')); return; }
    const list = el.querySelector('.ops');
    gsap.fromTo(el.querySelector('.ops__prog'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: .6 } });
    el.querySelectorAll('.ops__step').forEach((step) => {
      gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 62%', toggleActions: 'play none none reverse' } })
        .add(() => step.classList.toggle('is-on'));
    });
  }, []);
  return (
    <article className="sys sys--operations" ref={ref} id="operations">
      <div className="wrap sys__grid sys__grid--flip">
        <SysHead n="02" s={s} demo={demo} tryLabel={tryLabel} />
        <figure className="sys__vis">
          <ol className="ops">
            <i className="ops__line" aria-hidden="true" /><i className="ops__prog" aria-hidden="true" />
            {s.steps.map((st, i) => (
              <li className="ops__step" key={st.label}>
                <i className="ops__dot" aria-hidden="true" />
                <span className="mono ops__i">0{i + 1}</span>
                <span className="ops__label">{st.label}</span>
                <span className="state ops__state">{st.badge}</span>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </article>
  );
}

/* ----- outbound: the sequence in time ----- */
function Outbound({ s, demo, tryLabel }) {
  const maxN = Math.max(...s.sequence.map((x) => x.n));
  const pos = (n) => Math.log(n) / Math.log(maxN);
  const ref = useGsap((_, el) => {
    if (reduced) { el.querySelectorAll('.seq__item').forEach((n) => n.classList.add('is-on')); return; }
    gsap.fromTo(el.querySelector('.seq__prog'), { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('.seq'), start: 'top 75%', end: 'bottom 45%', scrub: .6 } });
    el.querySelectorAll('.seq__item').forEach((it, i) => {
      gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.seq'), start: `top+=${i * 12}% 70%`, toggleActions: 'play none none reverse' } })
        .add(() => it.classList.toggle('is-on'));
    });
  }, []);
  return (
    <article className="sys sys--outbound" ref={ref} id="outbound">
      <div className="wrap">
        <div className="sys__grid sys__grid--top">
          <SysHead n="03" s={s} demo={demo} tryLabel={tryLabel} />
        </div>
        <figure className="sys__vis seq" role="list">
          <i className="seq__line" aria-hidden="true" /><i className="seq__prog" aria-hidden="true" />
          {s.sequence.map((m) => (
            <div className="seq__item" key={m.day} role="listitem" style={{ '--x': pos(m.n) }}>
              <i className="seq__tick" aria-hidden="true" />
              <p className="mono seq__day">{m.day}</p>
              <p className="seq__msg">{m.msg}</p>
              <p className="state seq__state">{m.badge}</p>
            </div>
          ))}
        </figure>
      </div>
    </article>
  );
}

export default function Systems() {
  const { t } = useT();
  const s = t.systems, d = t.demos, tryLabel = t.ui.tryDemo;
  return (
    <section className="section systems" id="systems" aria-labelledby="systems-title">
      <div className="wrap systems__head">
        <Fade><Eyebrow n="02">{s.label}</Eyebrow></Fade>
        <Lines as="h2" id="systems-title" className="dsp dsp--1 systems__title">
          {s.titleLines[0]}<br />{s.titleLines[1]}<br /><span className="dim">{s.titleLines[2]}</span>
        </Lines>
        <Fade><p className="lead systems__body">{s.body}</p></Fade>
      </div>
      <Inbound s={s.inbound} demo={d.inbound.href} tryLabel={tryLabel} />
      <Operations s={s.operations} demo={d.operations.href} tryLabel={tryLabel} />
      <Outbound s={s.outbound} demo={d.outbound.href} tryLabel={tryLabel} />
    </section>
  );
}
