/* Questions people ask before booking.  One open at a time, keyboard first. */
import { useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useT } from '../i18n.jsx';
import { reduced } from '../engine/device.js';
import { Lines, Fade } from '../ui/Reveal.jsx';

function Item({ i, q, a, open, onToggle }) {
  const id = useId();
  const panel = useRef(null);
  const first = useRef(true);
  const toggle = () => {
    const el = panel.current;
    const next = !open;
    onToggle(next);
    if (!el) return;
    if (reduced) { el.style.height = next ? 'auto' : '0px'; return; }
    gsap.killTweensOf(el);
    if (next) gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: .75, ease: 'expo.out' });
    else gsap.to(el, { height: 0, duration: .55, ease: 'expo.out' });
  };
  if (first.current) { first.current = false; }
  return (
    <li className="acc__item" data-open={open ? '1' : '0'}>
      <h3>
        <button type="button" className="acc__btn" aria-expanded={open} aria-controls={`${id}-p`} id={`${id}-b`} onClick={toggle}>
          <span className="acc__i" aria-hidden="true">0{i + 1}</span>
          <span className="acc__q">{q}</span>
          <span className="acc__x" aria-hidden="true" />
        </button>
      </h3>
      <div className="acc__panel" ref={panel} id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} style={{ height: open ? 'auto' : 0 }}>
        <p className="acc__a body">{a}</p>
      </div>
    </li>
  );
}

export default function Faq() {
  const { t } = useT();
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="faq__head">
          <Lines as="h2" id="faq-title" className="dsp dsp--1">{t.faq.titleStart}<br /><span className="hi">{t.faq.titleAccent}</span></Lines>
        </div>
        <Fade as="ul" className="acc faq__list" y={16} stagger={.06}>
          {t.faq.items.map((it, i) => (
            <Item key={it.q} i={i} q={it.q} a={it.a} open={open === i} onToggle={(v) => setOpen(v ? i : -1)} />
          ))}
        </Fade>
      </div>
    </section>
  );
}
