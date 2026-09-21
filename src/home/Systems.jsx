/* =========================================================================
   The four systems as a bento.  Each tile carries a small working picture
   of its system that plays as the tile arrives and replays on hover: the
   channels landing in one inbox, the handoffs ticking themselves, the
   follow-ups leaving on their days, the invoice getting itself paid.
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { useTile } from '../engine/tile.js';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';
import Button, { MonoLink } from '../ui/Button.jsx';
import { Glyph } from '../ui/Mark.jsx';

const Check = ({ className = '' }) => (<i className={`bchk ${className}`} aria-hidden="true"><svg viewBox="0 0 10 8"><path d="M1 4.2 3.8 7 9 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></i>);

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

/* 01  inbound: three channels arrive, each sends its dot into the one inbox, one reply leaves */
function Inbound({ sys, demo, t }) {
  const ref = useTile((el) => {
    const tl = gsap.timeline();
    const chans = el.querySelectorAll('.inb__chan');
    tl.from(chans, { x: -26, opacity: 0, duration: .8, ease: 'expo.out', stagger: .14 })
      .from(el.querySelector('.inb__box'), { scale: .92, opacity: 0, transformOrigin: '50% 50%', duration: .9, ease: 'expo.out' }, .25);
    chans.forEach((c, i) => {
      const dot = c.querySelector('.inb__fly');
      const box = el.querySelector('.inb__box');
      tl.add(() => {
        if (reduced) return;
        const a = c.getBoundingClientRect(), b = box.getBoundingClientRect();
        gsap.set(dot, { x: 0, y: 0, opacity: 1, scale: 1 });
        gsap.to(dot, { x: b.left + 18 - (a.left + 12), y: (b.top + b.height / 2) - (a.top + a.height / 2), duration: .7, ease: 'power2.inOut' });
        gsap.to(dot, { opacity: 0, scale: .4, duration: .2, delay: .6 });
      }, .7 + i * .22);
    });
    tl.from(el.querySelector('.inb__count'), { opacity: 0, y: 6, duration: .5 }, 1.5)
      .from(el.querySelector('.breply'), { x: 22, opacity: 0, duration: .8, ease: 'expo.out' }, 1.7)
      .from(el.querySelector('.breply .bchk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.2)' }, 1.95)
      .from(el.querySelector('.breply__inst'), { opacity: 0, duration: .5 }, 2.1);
    return tl;
  });
  return (
    <article className="sys sys--inbound" id="inbound" ref={ref}>
      <div className="sys__vis" aria-hidden="true">
        <div className="inb">
          <div className="inb__chans">
            {sys.channels.map((c) => (
              <div className="inb__chan" key={c}><span className="inb__dot"><i className="inb__fly" /></span><span className="mono">{c}</span></div>
            ))}
          </div>
          <div className="inb__box">
            <p className="inb__title">{sys.inbox}</p>
            <p className="mono inb__when">{sys.when}</p>
            <p className="mono inb__count">{sys.channels.length} / {sys.channels.length}</p>
          </div>
        </div>
        <div className="breply"><Check /><span className="breply__text">{sys.reply}</span><span className="breply__inst mono">{sys.instantly}</span></div>
      </div>
      <Text i={0} sys={sys} demo={demo} t={t} />
    </article>
  );
}

/* 02  operations: four handoffs, each one triggering the next */
function Operations({ sys, demo, t }) {
  const ref = useTile((el) => {
    const tl = gsap.timeline();
    el.querySelectorAll('.ops__step').forEach((st, i) => {
      tl.from(st, { y: 14, opacity: 0, duration: .7, ease: 'expo.out' }, .1 + i * .34)
        .from(st.querySelector('.bchk'), { scale: 0, transformOrigin: '50% 50%', duration: .45, ease: 'back.out(2.2)' }, .3 + i * .34)
        .from(st.querySelector('.ops__badge'), { opacity: 0, x: 6, duration: .4 }, .38 + i * .34);
    });
    return tl;
  });
  return (
    <article className="sys sys--ops" id="operations" ref={ref}>
      <div className="sys__vis" aria-hidden="true">
        <ol className="ops">
          {sys.steps.map((s, i) => (
            <li className="ops__step" key={s.label}><Check /><span className="ops__lbl">{s.label}</span><span className={`mono ops__badge${i === sys.steps.length - 1 ? ' ops__badge--done' : ''}`}>{s.badge}</span></li>
          ))}
        </ol>
      </div>
      <Text i={1} sys={sys} demo={demo} t={t} />
    </article>
  );
}

/* 03  outbound: four messages, each on its day */
function Outbound({ sys, demo, t }) {
  const ref = useTile((el) => {
    const tl = gsap.timeline();
    el.querySelectorAll('.out__row').forEach((r, i) => {
      tl.from(r.querySelector('.out__day'), { opacity: 0, duration: .4 }, .1 + i * .36)
        .from(r.querySelector('.out__bub'), { y: 10, opacity: 0, scale: .96, transformOrigin: '100% 100%', duration: .7, ease: 'expo.out' }, .18 + i * .36)
        .from(r.querySelector('.out__badge'), { opacity: 0, duration: .4 }, .5 + i * .36);
    });
    return tl;
  });
  return (
    <article className="sys sys--out" id="outbound" ref={ref}>
      <div className="sys__vis" aria-hidden="true">
        <ol className="out">
          {sys.sequence.map((m, i) => (
            <li className="out__row" key={m.day}>
              <span className="mono out__day">{m.day}</span>
              <span className={`out__bub${i > 1 ? ' out__bub--later' : ''}`}>{m.msg}</span>
              <span className={`mono out__badge${i > 1 ? ' out__badge--dim' : ''}`}>{m.badge}</span>
            </li>
          ))}
        </ol>
      </div>
      <Text i={2} sys={sys} demo={demo} t={t} />
    </article>
  );
}

/* 04  billing: the invoice leaves with the work, a reminder follows, it gets paid */
function Billing({ sys, t }) {
  const ref = useTile((el) => {
    const tl = gsap.timeline();
    const stages = el.querySelectorAll('.bill__stage');
    tl.from(stages[0], { y: 16, opacity: 0, duration: .8, ease: 'expo.out' }, .1)
      .from(stages[1], { x: -18, opacity: 0, duration: .8, ease: 'expo.out' }, .7)
      .from(stages[2], { scale: .7, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'back.out(1.8)' }, 1.35)
      .from(stages[2].querySelector('.bchk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.4)' }, 1.5)
      .fromTo(el.querySelector('.bill__pulse'), { scale: .8, opacity: .5, transformOrigin: '50% 50%' }, { scale: 1.9, opacity: 0, duration: 1.1, ease: 'power2.out' }, 1.55);
    return tl;
  });
  return (
    <article className="sys sys--bill" id="billing" ref={ref}>
      <div className="sys__vis" aria-hidden="true">
        <ol className="bill">
          {sys.stages.map((s, i) => (
            <li className={`bill__stage bill__stage--${i + 1}`} key={s.label}>
              {i === 2 && <i className="bill__pulse" />}
              {i === 2 && <Check />}
              <span className="bill__lbl">{s.label}</span>
              <span className="mono bill__when">{s.when}</span>
            </li>
          ))}
        </ol>
      </div>
      <Text i={3} sys={sys} demo={null} t={t} />
    </article>
  );
}

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
        <div className="systems__head">
          <Lines as="h2" id="systems-title" className="dsp dsp--1 systems__title" stagger={.1}>
            {s.titleLines[0]} {s.titleLines[1]}<br /><span className="hi">{s.titleLines[2]}</span>
          </Lines>
          <Fade><p className="lead systems__body">{s.body}</p></Fade>
        </div>
        <div className="sgrid">
          <Inbound sys={s.inbound} demo={d.inbound} t={t} />
          <Operations sys={s.operations} demo={d.operations} t={t} />
          <Outbound sys={s.outbound} demo={d.outbound} t={t} />
          <Billing sys={s.billing} t={t} />
        </div>
        <Fade className="cta-row systems__cta">
          <p className="cta-row__lead">{t.offer.systems}</p>
          <Button href={t.calendly} calendly>{t.hero.cta}</Button>
        </Fade>
      </div>
    </section>
  );
}
