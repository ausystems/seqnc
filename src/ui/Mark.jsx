import { useId } from 'react';

/* The SEQNC mark, exactly as published: six nodes on a hexagon around a
   seventh, ring in #A861E6, spokes in #7C42B4, nodes in the violet gradient. */
const RING = [[60, 16], [98, 38], [98, 82], [60, 104], [22, 82], [22, 38]];

export default function Mark({ className = '', size }) {
  const id = useId().replace(/:/g, '');
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg className={className} style={style} viewBox="8 4 104 112" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`g${id}`} cx="0.34" cy="0.28" r="0.82">
          <stop offset="0" stopColor="#CFA6F5" /><stop offset="0.5" stopColor="#C594F2" /><stop offset="1" stopColor="#7C42B4" />
        </radialGradient>
      </defs>
      {RING.map(([x, y], i) => { const [x2, y2] = RING[(i + 1) % 6]; return (
        <g key={`r${i}`}>
          <line x1={x} y1={y} x2={x2} y2={y2} stroke="#A861E6" strokeWidth="5" strokeLinecap="round" />
          <line x1={x} y1={y} x2={x2} y2={y2} stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" strokeLinecap="round" />
        </g>); })}
      {RING.map(([x, y], i) => (
        <g key={`s${i}`}>
          <line x1="60" y1="60" x2={x} y2={y} stroke="#7C42B4" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="60" y1="60" x2={x} y2={y} stroke="#fff" strokeOpacity=".3" strokeWidth="1.35" strokeLinecap="round" />
        </g>))}
      {RING.map(([x, y], i) => (
        <g key={`n${i}`}>
          <circle cx={x} cy={y} r="9" fill={`url(#g${id})`} />
          <ellipse cx={x - 2.7} cy={y - 3.24} rx="3.24" ry="2.16" fill="#fff" opacity=".5" />
        </g>))}
      <circle cx="60" cy="60" r="13" fill={`url(#g${id})`} />
      <ellipse cx="56.1" cy="55.32" rx="4.68" ry="3.12" fill="#fff" opacity=".5" />
      <circle cx="60" cy="60" r="3.6" fill="#fff" opacity=".92" />
    </svg>
  );
}

/* Monochrome node glyph in currentColor: the mark reduced to a bullet. */
export function Glyph({ className = 'glyph', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}
