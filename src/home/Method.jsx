/* =========================================================================
   The TimeBack Method as four cards that stack.  Each card holds to the
   top of the screen while the next slides over it, and the four surfaces
   deepen as the work does: paper, lavender, violet, night.  A card's
   numeral rolls into place as it arrives, like a counter.

   Sticky cards move on their own, so nothing here trusts their measured
   position: arrivals are observed on screen, and the sink of a covered
   card is driven by the next card's natural place in the stack.
   ========================================================================= */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { Digit, rollTo } from '../ui/Roll.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Method() {
  const { t } = useT();
  const p = t.process;
  const ref = useGsap((_, el) => {
    const stack = el.querySelector('.stack');
    const cards = [...el.querySelectorAll('.mcard')];
    if (reduced) {
      el.querySelectorAll('.roll').forEach((r) => gsap.set(r.querySelector('.roll__col'), { yPercent: rollTo(r) }));
      return undefined;
    }
    /* where each card sits before any of them sticks */
    const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
    const naturalTop = (i) => {
      let y = stack.getBoundingClientRect().top + window.scrollY;
      for (let k = 0; k < i; k++) y += cards[k].offsetHeight + gap;
      return y;
    };
    const stickyTop = (card) => parseFloat(getComputedStyle(card).top) || 0;

    const words = cards.map((card) => [card.querySelector('.mcard__t'), card.querySelector('.mcard__d'), card.querySelector('.mcard__foot')]);
    gsap.set(words.flat(), { y: 26, opacity: 0 });
    const arrive = (card, i) => {
      card.querySelectorAll('.roll').forEach((r, k) => {
        const n = Number(r.dataset.n);
        if (n) gsap.to(r.querySelector('.roll__col'), { yPercent: rollTo(r), duration: .9 + n * .18, ease: 'expo.inOut', delay: .1 + k * .08 });
      });
      gsap.to(words[i], { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .1, delay: .15, clearProps: 'transform' });
    };
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = cards.indexOf(en.target);
        if (seen.has(i)) return;
        seen.add(i); arrive(en.target, i); io.unobserve(en.target);
      });
    }, { threshold: .3 });
    cards.forEach((c) => io.observe(c));

    const tweens = cards.slice(0, -1).map((card, i) => {
      const next = cards[i + 1];
      const st = { start: () => naturalTop(i + 1) - window.innerHeight, end: () => naturalTop(i + 1) - stickyTop(next), scrub: true, invalidateOnRefresh: true };
      return [
        gsap.to(card.querySelector('.mcard__in'), { scale: .94, ease: 'none', transformOrigin: '50% 0%', scrollTrigger: st }),
        /* only the words fade, so nothing shows through the card above */
        gsap.to(card.querySelector('.mcard__grid'), { opacity: .35, ease: 'none', scrollTrigger: { ...st } }),
      ];
    }).flat();
    return () => { io.disconnect(); tweens.forEach((tw) => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); }); };
  }, [t.code]);
  return (
    <section className="section method" id="method" ref={ref} aria-labelledby="method-title">
      <div className="wrap">
        <div className="method__head">
          <Lines as="h2" id="method-title" className="dsp dsp--1 method__title" stagger={.1}>
            {p.titleStart}<br /><span className="hi">{p.titleAccent}</span>
          </Lines>
          <Fade><p className="lead method__body">{p.body}</p></Fade>
        </div>
        <ol className="stack">
          {p.steps.map((s, i) => (
            <li className={`mcard mcard--${i + 1}`} key={s.title} style={{ '--i': i }}>
              <div className="mcard__in"><div className="mcard__grid">
                <p className="num mcard__n" aria-hidden="true"><Digit n={0} /><Digit n={i + 1} /></p>
                <div className="mcard__body">
                  <h3 className="dsp dsp--2 mcard__t">{s.title}</h3>
                  <p className="mcard__d">{s.desc}</p>
                </div>
                <div className="mcard__foot">
                  <span className="mono mcard__detail">{s.detail}</span>
                  <span className="mono mcard__of">{i + 1} / {p.steps.length}</span>
                </div>
              </div></div>
            </li>
          ))}
        </ol>
        <Fade className="cta-row method__cta">
          <p className="cta-row__lead">{t.offer.method}</p>
          <Button href={t.calendly} calendly>{t.hero.cta}</Button>
        </Fade>
      </div>
    </section>
  );
}
