/* The illustrations: small interfaces floating in shallow 3D, drawn in
   white on light, moving slowly.  Each one is the mechanic it describes. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { finePointer, reduced } from '../engine/device.js';
import { onFrame } from '../engine/input.js';

/* a stage that leans a few degrees toward the pointer */
function Stage({ className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!finePointer || reduced) return undefined;
    const el = ref.current;
    const rx = gsap.quickTo(el, 'rotateX', { duration: 1.2, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 1.2, ease: 'power3' });
    let rect = el.getBoundingClientRect(), n = 0, hot = false;
    const enter = () => { hot = true; }, leave = () => { hot = false; rx(0); ry(0); };
    el.addEventListener('pointerenter', enter); el.addEventListener('pointerleave', leave);
    const off = onFrame((s) => {
      if (!hot) return;
      if (++n % 6 === 0) rect = el.getBoundingClientRect();
      ry(((s.x - rect.left) / rect.width - 0.5) * 6);
      rx(-((s.y - rect.top) / rect.height - 0.5) * 5);
    });
    return () => { off(); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); };
  }, []);
  return <div ref={ref} className={`vis ${className}`} aria-hidden="true"><div className="vis__in">{children}</div></div>;
}

const Card = ({ className = '', style, children }) => <div className={`vc ${className}`} style={style}>{children}</div>;

/* 1 — a lead arrives, the reply goes out, the estimate follows, the slot is booked */
export function Leads() {
  return (
    <Stage className="vis--leads">
      <Card className="vc--msg vl-1">
        <span className="vc__ava" />
        <span className="vc__lines"><i style={{ width: '62%' }} /><i style={{ width: '44%' }} /></span>
        <span className="vc__time">now</span>
      </Card>
      <Card className="vc--reply vl-2">
        <span className="vc__k">Auto-reply</span>
        <span className="vc__lines"><i style={{ width: '78%' }} /><i style={{ width: '52%' }} /></span>
      </Card>
      <Card className="vc--chip vl-3"><span className="vc__dot" />Estimate sent</Card>
      <Card className="vc--chip vl-4"><span className="vc__dot vc__dot--ink" />Booked · Tue 10:30</Card>
      <span className="vis__thread" />
    </Stage>
  );
}

/* 2 — a job travels down the rail; each stop lights as it passes */
export function Flow() {
  const stops = ['Customer says yes', 'Details collected', 'Team notified', 'Job scheduled'];
  return (
    <Stage className="vis--flow">
      <span className="vis__rail" />
      <span className="vis__token" />
      {stops.map((s, i) => (
        <Card key={s} className={`vc--stop vf-${i + 1}`}>
          <span className="vc__n">{i + 1}</span>{s}
        </Card>
      ))}
    </Stage>
  );
}

/* 3 — a month; three moments where the right message goes out on its own */
export function Follow() {
  const cells = Array.from({ length: 35 }, (_, i) => i);
  const marks = { 9: 'vfo-1', 19: 'vfo-2', 30: 'vfo-3' };
  return (
    <Stage className="vis--follow">
      <Card className="vc--cal">
        <span className="vc__k">This month</span>
        <div className="vc__grid">
          {cells.map((i) => <i key={i} className={marks[i] ? `is-mark ${marks[i]}` : ''} />)}
        </div>
      </Card>
      <Card className="vc--note vfo-1"><span className="vc__dot" />Review request sent</Card>
      <Card className="vc--note vfo-2"><span className="vc__dot" />Seasonal reminder</Card>
      <Card className="vc--note vfo-3"><span className="vc__dot vc__dot--ink" />Win-back offer</Card>
    </Stage>
  );
}

export const VISUALS = { leads: Leads, flow: Flow, follow: Follow };

/* the manifesto's object: five tasks, scattered by hand, that fall into
   one neat stack as the player scrolls */
export function Stack({ labels }) {
  return (
    <div className="stack" aria-hidden="true">
      <div className="stack__in">
        {labels.map((l, i) => <div key={l} className="stack__card" style={{ '--i': i }}><span>{l}</span></div>)}
      </div>
    </div>
  );
}
