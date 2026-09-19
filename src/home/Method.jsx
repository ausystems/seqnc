/* =========================================================================
   The TimeBack Method.  The ring stays on the left and fills a quarter for
   each step that passes; the four steps read down the right under large,
   light numerals.  Small screens read it as a column with the ring above.
   ========================================================================= */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n.jsx';
import { useGsap } from '../engine/hooks.js';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';

gsap.registerPlugin(ScrollTrigger);
const R = 92, C = 2 * Math.PI * R;

export default function Method() {
  const { t } = useT();
  const p = t.process;
  const total = p.steps.length;
  const ref = useGsap((_, el) => {
    const arc = el.querySelector('.mring__arc');
    const n = el.querySelector('.mring__n');
    const steps = el.querySelectorAll('.mstep');
    const set = (i) => {
      const frac = (i + 1) / total;
      gsap.to(arc, { strokeDashoffset: C * (1 - frac), duration: reduced ? 0 : 1.1, ease: 'power3.inOut', overwrite: true });
      if (n) n.textContent = `0${i + 1}`;
      steps.forEach((s, k) => s.classList.toggle('is-on', k <= i));
    };
    if (reduced) { set(total - 1); return; }
    gsap.set(arc, { strokeDashoffset: C });
    const triggers = [...steps].map((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 62%',
      onEnter: () => set(i),
      onLeaveBack: () => { if (i > 0) set(i - 1); else { gsap.to(arc, { strokeDashoffset: C, duration: .8, ease: 'power3.inOut', overwrite: true }); steps.forEach((x) => x.classList.remove('is-on')); if (n) n.textContent = '00'; } },
    }));
    gsap.to(el.querySelector('.mring__hex'), { rotation: 360, transformOrigin: '50% 50%', duration: 48, ease: 'none', repeat: -1 });
    return () => triggers.forEach((tr) => tr.kill());
  }, [total]);
  return (
    <section className="section method" id="method" ref={ref} aria-labelledby="method-title">
      <div className="wrap">
        <div className="method__head">
          <Lines as="h2" id="method-title" className="dsp dsp--1 method__title" stagger={.1}>
            {p.titleStart}<br /><span className="hi">{p.titleAccent}</span>
          </Lines>
          <Fade><p className="lead method__body">{p.body}</p></Fade>
        </div>
        <div className="method__grid">
          <div className="method__side">
            <div className="mring" aria-hidden="true">
              <svg viewBox="0 0 220 220" className="mring__svg">
                <circle cx="110" cy="110" r={R} className="mring__track" />
                <circle cx="110" cy="110" r={R} className="mring__arc" style={{ strokeDasharray: C, strokeDashoffset: C }} />
                <path d="M110 92l15.6 9v18L110 128l-15.6-9v-18L110 92Z" className="mring__hex" />
              </svg>
              <p className="mring__count"><span className="mring__n">00</span><span className="mring__of">/ 0{total}</span></p>
            </div>
          </div>
          <ol className="method__steps">
            {p.steps.map((s, i) => (
              <li className="mstep" key={s.title}>
                <p className="num mstep__n" aria-hidden="true">0{i + 1}</p>
                <div className="mstep__body">
                  <h3 className="dsp dsp--2 mstep__t">{s.title}</h3>
                  <p className="mstep__d">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
