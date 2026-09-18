/* What kind of machine is the visitor on?  Decided once, read everywhere. */
const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : { matches: false });

export const reduced = mq('(prefers-reduced-motion: reduce)').matches;
export const touch = mq('(pointer: coarse)').matches || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 && !mq('(pointer: fine)').matches);
export const finePointer = mq('(pointer: fine)').matches && !touch;

const nav = typeof navigator !== 'undefined' ? navigator : {};
export const lowPower =
  (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
  (nav.deviceMemory && nav.deviceMemory <= 4) ||
  (nav.connection && nav.connection.saveData) ||
  false;

/* pixel ratio budget for the WebGL layer */
export const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, touch || lowPower ? 1.25 : 1.75);

export const DESKTOP = '(min-width: 1025px)';
export const MOBILE = '(max-width: 1024px)';
export const isDesktop = () => mq(DESKTOP).matches;
