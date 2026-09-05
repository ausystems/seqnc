/* =========================================================================
   Motion tokens — the physics every object on the site obeys.

   One vocabulary for the whole engine: how quickly things react, how they
   settle, how far they travel.  Scenes compose these; they never invent
   their own numbers.
   ========================================================================= */

export const EASE = {
  out:    'expo.out',          // launch fast, settle long — the default arrival
  settle: 'power3.out',        // gentler arrival for small objects
  camera: 'power2.inOut',      // any movement that reads as the camera moving
  snap:   'back.out(1.35)',    // impact with a controlled overshoot
  soft:   'sine.inOut',        // idle breathing
  in:     'power2.in',         // anticipation / exit
};

export const DUR = {
  tap:    0.16,   // pressed / released
  quick:  0.38,   // hover response
  base:   0.72,   // a single object arriving
  slow:   1.15,   // a composition assembling
  camera: 1.5,    // a scene change
};

export const DIST = {
  rise:  28,      // small text arrival, px
  drop:  90,      // display type arrival, % of line height
  depth: 180,     // z travel for objects arriving from depth, px
  drift: 12,      // pointer-driven parallax, px
};

/* stagger between siblings, in seconds */
export const STAGGER = { tight: 0.03, base: 0.06, loose: 0.1 };

/* the CSS side of the same tokens (kept in sync with styles/tokens.css) */
export const CSS_EASE = {
  out: 'cubic-bezier(.16, 1, .3, 1)',
  camera: 'cubic-bezier(.65, 0, .35, 1)',
};
