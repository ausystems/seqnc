/* Motion tokens: one vocabulary for how things arrive, settle and leave. */
export const EASE = {
  out: 'expo.out',        /* launch fast, settle long: the default arrival */
  settle: 'power3.out',   /* gentler arrival for small objects */
  camera: 'power3.inOut', /* anything that reads as the camera moving */
  soft: 'sine.inOut',     /* idle breathing */
  in: 'power2.in',        /* anticipation and exit */
};
export const DUR = { tap: .16, quick: .42, base: .8, slow: 1.15, camera: 1.4 };
export const STAGGER = { tight: .035, base: .07, loose: .11 };
