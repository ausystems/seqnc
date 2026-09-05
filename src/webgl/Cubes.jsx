/* The hero's objects: matte dark cubes floating in a light room.  They turn
   slowly, drift a little, lean with the pointer and rise as the page
   scrolls away.  Nothing else. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { dpr, lowPower, reduced, touch } from '../engine/device.js';
import { input } from '../engine/input.js';

const LAYOUT = [
  /* x, y, z, size, spin — the middle of the room stays empty for the words */
  [-4.4,  1.3, -1.2, 1.05, 0.05],
  [ 4.4,  1.5, -2.2, 1.15, 0.04],
  [-3.6, -1.9,  0.3, 0.7,  0.07],
  [ 3.9, -1.9,  0.8, 0.85, 0.06],
  [-2.9,  2.7, -4.6, 0.55, 0.05],
  [-5.4, -0.2, -3.0, 0.9,  0.045],
  [ 5.6, -0.5, -0.4, 0.5,  0.08],
  [ 3.6,  3.0, -6.0, 0.6,  0.05],
];

/* portrait screens: the objects sit above and below the words instead */
const LAYOUT_PORTRAIT = [
  [-1.4,  3.0, -1.0, 0.8,  0.05],
  [ 1.5,  3.4, -2.4, 0.95, 0.04],
  [-1.5, -4.2,  0.2, 0.7,  0.06],
  [ 1.6, -4.9, -0.8, 0.9,  0.05],
];

export default function Cubes({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    let dead = false, renderer, scene, camera, group, tick, onResize, cubes = [];

    (async () => {
      let T;
      try { T = await import('./three-lite.js'); }
      catch (e) { canvas.dataset.state = 'import failed: ' + (e && e.message); return; }
      if (dead) return;
      try {
        renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch (e) { canvas.dataset.state = 'no webgl: ' + (e && e.message); return; }
      canvas.dataset.state = 'ok';
      renderer.setPixelRatio(Math.min(dpr, lowPower ? 1 : 1.5));
      renderer.setClearColor(0x000000, 0);
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(30, 1, 0.1, 60);
      camera.position.set(0, 0, 11);

      /* a soft, bright room */
      scene.add(new T.HemisphereLight(0xffffff, 0x8a8a8a, 1.4));
      const key = new T.DirectionalLight(0xffffff, 2.4); key.position.set(4, 7, 6); scene.add(key);
      const fill = new T.DirectionalLight(0xffffff, 0.7); fill.position.set(-6, -3, 4); scene.add(fill);
      const rim = new T.DirectionalLight(0xffffff, 0.9); rim.position.set(0, 2, -8); scene.add(rim);

      group = new T.Group();
      scene.add(group);
      const mat = new T.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.42, metalness: 0.08 });
      const portrait = window.innerWidth / Math.max(1, window.innerHeight) < 0.9;
      const set = portrait ? LAYOUT_PORTRAIT : LAYOUT;
      set.forEach(([x, y, z, s, spin], i) => {
        const geo = new T.RoundedBoxGeometry(s, s, s, 4, s * 0.09);
        const m = new T.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.rotation.set(i * 0.7, i * 1.1, i * 0.3);
        m.userData = { spin, phase: i * 1.3, y0: y, axis: [Math.sin(i), Math.cos(i * 0.7), Math.sin(i * 0.4)] };
        group.add(m);
        cubes.push(m);
      });

      onResize = () => {
        const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        /* keep the composition on narrow screens by pulling the camera back */
        camera.position.z = camera.aspect < 0.9 ? 16 : camera.aspect < 1.3 ? 13 : 11;
        camera.updateProjectionMatrix();
      };
      onResize();
      window.addEventListener('resize', onResize);

      let rx = 0, ry = 0;
      const draw = (t) => {
        const time = t;
        cubes.forEach((m) => {
          const u = m.userData;
          if (!reduced) {
            m.rotation.x += u.spin * 0.004 * u.axis[0];
            m.rotation.y += u.spin * 0.006 * u.axis[1];
            m.rotation.z += u.spin * 0.003 * u.axis[2];
            m.position.y = u.y0 + Math.sin(time * 0.35 + u.phase) * 0.12;
          }
        });
        /* the whole set leans toward the pointer and rises with the scroll */
        const tx = input.present ? (input.ny - 0.5) * 0.10 : 0;
        const ty = input.present ? (input.nx - 0.5) * 0.14 : 0;
        rx += (tx - rx) * 0.04; ry += (ty - ry) * 0.04;
        group.rotation.x = rx; group.rotation.y = ry;
        group.position.y = Math.min(window.scrollY, window.innerHeight) * 0.0016;
        renderer.render(scene, camera);
      };
      if (reduced) { draw(0); return; }
      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      io.observe(canvas);
      tick = (t) => { if (visible && !document.hidden) draw(t); };
      gsap.ticker.add(tick);
    })();

    return () => {
      dead = true;
      if (tick) gsap.ticker.remove(tick);
      if (onResize) window.removeEventListener('resize', onResize);
      cubes.forEach((m) => m.geometry.dispose());
      if (cubes[0]) cubes[0].material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
