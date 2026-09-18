/* Two arrows, drawn once, used everywhere: forward and outward. */
export function Arrow({ className = 'btn__arr' }) {
  return (
    <svg className={className} viewBox="0 0 15 10" aria-hidden="true" focusable="false">
      <path d="M0 5h13.4M9.2 .8 13.6 5 9.2 9.2" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowExt({ className = 'btn__arr btn__arr--ext' }) {
  return (
    <svg className={className} viewBox="0 0 11 11" aria-hidden="true" focusable="false">
      <path d="M1 10 10 1M3 1h7v7" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 10 15" aria-hidden="true" focusable="false">
      <path d="M5 0v13.4M.8 9.2 5 13.6l4.2-4.4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
