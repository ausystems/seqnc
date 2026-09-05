/* =========================================================================
   Input state — the player's hands.

   Pointer position, velocity and acceleration; scroll velocity and
   direction; how hard the player is interacting.  Sampled once per frame
   and read by anything that wants to react: the cursor, the depth field,
   display type, the problem field.  Nothing listens to raw events on its own.
   ========================================================================= */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from './device.js';

gsap.registerPlugin(ScrollTrigger);

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp  = (a, b, t) => a + (b - a) * t;

export const input = {
  /* pointer, in px and normalised 0..1 */
  x: -1e4, y: -1e4, nx: 0.5, ny: 0.5,
  /* smoothed pointer (lags the real one, like the cursor ring) */
  sx: -1e4, sy: -1e4,
  /* pointer velocity px/s and 0..1 speed */
  vx: 0, vy: 0, speed: 0,
  /* how long the pointer has been still, seconds */
  still: 0,
  /* is the pointer inside the window at all */
  present: false,
  down: false,
  /* scroll: px/s, signed -1..1 normalised, direction ±1 */
  scrollV: 0, sv: 0, dir: 1, scrollY: 0,
  /* overall interaction intensity 0..1 */
  intensity: 0,
  /* the scene index currently in focus (set by scenes.js) */
  scene: 0,
  /* atmosphere requested by scenes for the depth field, 0..1 */
  atmosphere: 0,
};

let rawX = -1e4, rawY = -1e4, prevX = -1e4, prevY = -1e4, prevT = 0;
let sv = 0, pv = 0, prevScroll = 0, scrollVel = 0;
const subs = new Set();

function onMove(e) {
  rawX = e.clientX; rawY = e.clientY;
  if (!input.present) { input.present = true; prevX = rawX; prevY = rawY; input.sx = rawX; input.sy = rawY; }
}
function onLeave() { input.present = false; }
function onDown() { input.down = true; }
function onUp() { input.down = false; }

let bound = false;
export function bindInput() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('blur', onLeave);
  prevT = performance.now();
  prevScroll = window.scrollY;
  gsap.ticker.add(tick);
}

function tick(_t, dtMs) {
  const dt = Math.max(1e-3, Math.min(dtMs / 1000, 0.05));
  const w = window.innerWidth, h = window.innerHeight;

  /* pointer */
  if (input.present) {
    const vx = (rawX - prevX) / dt, vy = (rawY - prevY) / dt;
    input.vx = lerp(input.vx, vx, 0.35);
    input.vy = lerp(input.vy, vy, 0.35);
    const speed = clamp(Math.hypot(input.vx, input.vy) / 2600, 0, 1);
    input.speed = lerp(input.speed, speed, speed > input.speed ? 0.5 : 0.08);
    input.still = speed < 0.02 ? input.still + dt : 0;
    input.x = rawX; input.y = rawY;
    input.nx = rawX / w; input.ny = rawY / h;
    input.sx = lerp(input.sx, rawX, 0.12);
    input.sy = lerp(input.sy, rawY, 0.12);
    prevX = rawX; prevY = rawY;
  } else {
    input.speed = lerp(input.speed, 0, 0.08);
    input.still += dt;
  }

  /* scroll: velocity from the page's own movement, smoothed */
  const y = window.scrollY;
  const inst = (y - prevScroll) / dt;
  prevScroll = y;
  scrollVel = lerp(scrollVel, inst, 0.4);
  const v = reduced ? 0 : scrollVel;
  input.scrollV = v;
  const target = clamp(v / 3200, -1, 1);
  sv = lerp(sv, target, Math.abs(target) > Math.abs(sv) ? 0.3 : 0.07);
  input.sv = Math.abs(sv) < 0.002 ? 0 : sv;
  if (Math.abs(v) > 40) input.dir = v > 0 ? 1 : -1;
  input.scrollY = window.scrollY;

  input.intensity = lerp(input.intensity, clamp(Math.abs(input.sv) * 0.8 + input.speed * 0.6, 0, 1), 0.1);

  /* expose the two values CSS can use — written only when they move */
  const npv = Math.round(input.speed * 100) / 100;
  if (npv !== pv) { pv = npv; document.documentElement.style.setProperty('--pv', pv); }
  document.documentElement.style.setProperty('--sv', input.sv.toFixed(3));

  subs.forEach((fn) => fn(input, dt));
}

/* subscribe to the per-frame state; returns an unsubscribe */
export function onFrame(fn) { subs.add(fn); return () => subs.delete(fn); }
