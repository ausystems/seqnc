/* =========================================================================
   Pricing.  No price list, so no table: the title, the reason, and the
   three terms as a tonal bento.  Paper, lavender, night.  Each tile sets
   one word of its own copy large and moves it once: the two fees slide in
   as two pills, the cancel switch flips itself off, the guarantee's ninety
   days fill in one by one.  Tiles rise in on scroll, lift on hover, and their
   pictures replay on hover (or on tap, where there is no hover).
   ========================================================================= */
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { useTile } from '../engine/tile.js';
import { reduced } from '../engine/device.js';
import Button from '../ui/Button.jsx';
import { Lines, Fade } from '../ui/Reveal.jsx';

const Check = () => (<i className="bchk" aria-hidden="true"><svg viewBox="0 0 10 8"><path d="M1 4.2 3.8 7 9 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></i>);

/* the lower half of a tile: the term and its description */
function Text({ it }) {
  return (
    <div className="pt__text">
      <h3 className="pt__t">{it.title}</h3>
      <p className="pt__d">{it.desc}</p>
    </div>
  );
}

/* the setup fee, then the retainer: two pills that slide into place, one after the other */
function Fee({ it, v }) {
  const ref = useTile((el) => {
    const [setup, retainer] = el.querySelectorAll('.pfee__pill');
    return gsap.timeline()
      .from(setup, { x: -40, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .from(setup.querySelector('.pfee__tag'), { x: -6, opacity: 0, duration: .5 }, .45)
      .from(retainer, { x: -40, y: 8, opacity: 0, duration: .9, ease: 'expo.out' }, .4)
      .from(retainer.querySelector('.pfee__tag'), { x: -6, opacity: 0, duration: .5 }, .85);
  });
  return (
    <li className="pt pt--fee" ref={ref}>
      <div className="pt__vis" aria-hidden="true">
        <div className="pfee">
          <span className="pfee__pill pfee__pill--setup">{v.setup}<span className="mono--l pfee__tag">{v.once}</span></span>
          <span className="pfee__pill pfee__pill--retainer">{v.retainer}<span className="mono--l pfee__tag">{v.monthly}</span></span>
        </div>
      </div>
      <Text it={it} />
    </li>
  );
}

/* cancel any time: the word, and a switch that flips itself off after a beat */
function Cancel({ it, v }) {
  const ref = useTile((el) => {
    const tog = el.querySelector('.ptog');
    return gsap.timeline()
      .from(el.querySelector('.pcan__w'), { y: 20, opacity: 0, duration: .8, ease: 'expo.out' }, 0)
      .from(tog, { scale: .9, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'expo.out' }, .15)
      .fromTo(el.querySelector('.ptog__knob'), { x: 42 }, { x: 0, duration: .55, ease: 'power3.inOut' }, 1)
      /* GSAP cannot tween the tokens themselves, so the two literals are the violet and paper-3 tokens */
      .fromTo(tog, { backgroundColor: '#7C4DCC', borderColor: 'rgba(124,77,204,.35)' }, { backgroundColor: '#ECE8F3', borderColor: 'rgba(14,8,32,.11)', duration: .55, ease: 'power2.inOut' }, 1);
  });
  return (
    <li className="pt pt--cancel" ref={ref}>
      <div className="pt__vis" aria-hidden="true">
        <div className="pcan">
          <span className="pcan__w">{v.cancel}</span>
          <span className="ptog"><i className="ptog__knob" /></span>
        </div>
      </div>
      <Text it={it} />
    </li>
  );
}

/* the guarantee: the ninety from the copy over ninety small days that fill in, one by one */
function Back({ it, v }) {
  /* the figure is read from the term itself, so the picture can never say a number the copy does not */
  const n = Number((it.title.match(/\d+/) || [0])[0]);
  const ref = useTile((el) => gsap.timeline()
    .from(el.querySelector('.pback__n'), { y: 26, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
    .from(el.querySelector('.pback__u'), { x: -8, opacity: 0, duration: .6, ease: 'expo.out' }, .45)
    .from(el.querySelectorAll('.pback__cell'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .4, ease: 'expo.out', stagger: .011 }, .25)
    .from(el.querySelector('.pback__chip'), { y: 14, opacity: 0, duration: .7, ease: 'expo.out' }, 1.35)
    .from(el.querySelector('.pback__chip .bchk'), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2.2)' }, 1.5));
  return (
    <li className="pt pt--back" data-theme="dark" ref={ref}>
      <div className="pt__vis" aria-hidden="true">
        <div className="pback">
          <div className="pback__fig">
            {n > 0 && <span className="num pback__n">{n}</span>}
            <span className="mono--l pback__u">{v.days}</span>
          </div>
          {n > 0 && <div className="pback__cells">{Array.from({ length: n }, (_, k) => <i className="pback__cell" key={k} />)}</div>}
        </div>
        <div className="pback__chip"><Check /><span>{v.full}</span></div>
      </div>
      <Text it={it} />
    </li>
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
        <div className="pricing__head">
          <Lines as="h2" id="pricing-title" className="dsp dsp--1 pricing__title" stagger={.1}>{p.titleStart}<br /><span className="hi">{p.titleAccent}</span></Lines>
          <div>
            <Fade><p className="lead pricing__body">{p.body}</p></Fade>
            <Fade className="pricing__cta" delay={.1}><Button href={t.calendly} calendly>{p.cta}</Button></Fade>
          </div>
        </div>
        <ul className="pgrid">
          <Fee it={fee} v={v} />
          <Cancel it={cancel} v={v} />
          <Back it={back} v={v} />
        </ul>
      </div>
    </section>
  );
}
