/* =========================================================================
   A scene is the small stage a picture is played on.  The composition is
   drawn at a fixed size and zoomed to fit its stage; on fine pointers the
   light in the panel follows the hand.  Nothing in the picture moves.
   ========================================================================= */
import { finePointer, reduced } from './device.js';

/* A composition is drawn at a fixed size and zoomed to fit its stage. */
export function fitComp(scene) {
  const comp = scene && scene.querySelector('.comp');
  if (!comp || typeof ResizeObserver === 'undefined') return () => {};
  const cw = parseFloat(getComputedStyle(comp).getPropertyValue('--cw')) || 320;
  const ch = parseFloat(getComputedStyle(comp).getPropertyValue('--ch')) || 240;
  const fit = () => {
    const r = scene.getBoundingClientRect();
    const pad = 22;
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
  let raf = 0, last = null;
  const apply = () => {
    raf = 0;
    if (!last) return;
    const r = scene.getBoundingClientRect();
    scene.style.setProperty('--mx', `${((last.x - r.left) / r.width) * 100}%`);
    scene.style.setProperty('--my', `${((last.y - r.top) / r.height) * 100}%`);
  };
  const move = (e) => { last = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(apply); };
  const leave = () => { last = null; scene.style.setProperty('--mx', '50%'); scene.style.setProperty('--my', '40%'); };
  scene.addEventListener('pointermove', move);
  scene.addEventListener('pointerleave', leave);
  return () => { unfit(); scene.removeEventListener('pointermove', move); scene.removeEventListener('pointerleave', leave); if (raf) cancelAnimationFrame(raf); };
}
