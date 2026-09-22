/* =========================================================================
   A scene is the small stage a picture is played on.  On fine pointers
   it answers the hand: the light in the panel follows the pointer, the
   stage tilts a few degrees, and every layer moves by its depth, so the
   picture reads as an object with room inside it.  Nothing here touches
   the objects' own tweens: parallax moves the layer, timelines move what
   is inside it.
   ========================================================================= */
import { gsap } from 'gsap';
import { finePointer, reduced } from './device.js';

/* A composition is drawn at a fixed size and zoomed to fit its stage. */
export function fitComp(scene) {
  const comp = scene && scene.querySelector('.comp');
  if (!comp || typeof ResizeObserver === 'undefined') return () => {};
  const cw = parseFloat(getComputedStyle(comp).getPropertyValue('--cw')) || 320;
  const ch = parseFloat(getComputedStyle(comp).getPropertyValue('--ch')) || 240;
  const fit = () => {
    const r = scene.getBoundingClientRect();
    const pad = 36;
    const k = Math.min(1, (r.width - pad) / cw, (r.height - pad) / ch);
    comp.style.setProperty('--k', String(Math.max(.4, k)));
  };
  const ro = new ResizeObserver(fit);
  ro.observe(scene);
  fit();
  return () => ro.disconnect();
}

export function bindScene(scene) {
  if (!scene) return () => {};
  const unfit = fitComp(scene);
  if (!finePointer || reduced) return unfit;
  const stage = scene.querySelector('.scene__stage');
  const q = (el, p) => gsap.quickTo(el, p, { duration: .7, ease: 'power3' });
  const layers = [...scene.querySelectorAll('[data-depth]')].map((el) => ({ d: Number(el.dataset.depth) || 1, x: q(el, 'x'), y: q(el, 'y') }));
  const rx = stage ? q(stage, 'rotateX') : null, ry = stage ? q(stage, 'rotateY') : null;
  let raf = 0, last = null;
  const apply = () => {
    raf = 0;
    if (!last) return;
    const r = scene.getBoundingClientRect();
    const nx = (last.x - r.left) / r.width - .5, ny = (last.y - r.top) / r.height - .5;
    scene.style.setProperty('--mx', `${(nx + .5) * 100}%`);
    scene.style.setProperty('--my', `${(ny + .5) * 100}%`);
    if (rx) { rx(-ny * 4); ry(nx * 5); }
    layers.forEach((l) => { l.x(nx * l.d * 6); l.y(ny * l.d * 6); });
  };
  const move = (e) => { last = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(apply); };
  const leave = () => {
    last = null;
    scene.style.setProperty('--mx', '50%'); scene.style.setProperty('--my', '40%');
    if (rx) { rx(0); ry(0); }
    layers.forEach((l) => { l.x(0); l.y(0); });
  };
  scene.addEventListener('pointermove', move);
  scene.addEventListener('pointerleave', leave);
  return () => { unfit(); scene.removeEventListener('pointermove', move); scene.removeEventListener('pointerleave', leave); if (raf) cancelAnimationFrame(raf); };
}
