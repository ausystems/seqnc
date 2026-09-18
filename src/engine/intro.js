/* How long until the opening curtain is out of the way, in seconds.  Things
   that arrive "now" on the first page add this so they land as the sheet
   lifts rather than behind it. */
export const INTRO_HOLD = 1.75;
export function armIntro() {
  if (typeof window === 'undefined') return;
  window.__seqncIntroUntil = performance.now() + INTRO_HOLD * 1000;
}
export function introDelay() {
  if (typeof window === 'undefined') return 0;
  const until = window.__seqncIntroUntil || 0;
  return Math.max(0, (until - performance.now()) / 1000);
}
