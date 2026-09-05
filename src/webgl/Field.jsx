/* The depth field: the dimensional layer beneath the page.

   A single full-screen shader — a fine graphite dot lattice that is close
   to invisible at rest, lights around the pointer, stretches into dashes
   under fast scroll, drifts beneath the page as it moves, and brightens
   when a scene asks for atmosphere.  Three.js is loaded only when this
   mounts, after the first paint, so the opening is never waiting on it. */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { dpr, lowPower, reduced } from '../engine/device.js';
import { input } from '../engine/input.js';

const VERT = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform vec2  uRes;
  uniform float uDpr;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uSpeed;
  uniform float uScrollV;
  uniform float uScroll;
  uniform float uAtmo;
  uniform vec3  uBase;
  uniform vec3  uLav;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main(){
    vec2 px = vUv * uRes;
    vec2 p  = vec2(px.x, uRes.y - px.y);
    float cell = 28.0 * uDpr;

    /* the lattice lies beneath the paper and moves at a fraction of the scroll */
    vec2 q  = p + vec2(0.0, uScroll * 0.14);
    vec2 id = floor(q / cell);
    vec2 g  = mod(q, cell) - cell * 0.5;
    float stretch = 1.0 + abs(uScrollV) * 0.8;
    float d = length(vec2(g.x, g.y / stretch));
    float dot_ = 1.0 - smoothstep(0.7 * uDpr, 1.5 * uDpr, d);

    /* graphite: a faint dot at rest, darker where the pointer lights it */
    float dist = distance(p, uPointer);
    float r    = (240.0 + 180.0 * uSpeed + 300.0 * uAtmo) * uDpr;
    float glow = 1.0 - smoothstep(0.0, r, dist);
    glow *= glow;

    float ink = dot_ * (0.035 + 0.02 * hash(id) + glow * 0.09 + abs(uScrollV) * 0.015);
    vec3 col = uBase - vec3(ink);

    /* the whisper of lavender under the pointer, and over the whole sheet as atmosphere rises */
    col = mix(col, uLav, glow * 0.07 + uAtmo * 0.03);

    /* paper grain */
    col += (hash(p * 0.41 + fract(uTime * 0.8)) - 0.5) * 0.006;

    /* the sheet is slightly darker toward its edges */
    float vg = smoothstep(1.6, 0.2, length(vUv - 0.5) * 1.5);
    col *= 0.985 + 0.015 * vg;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Field() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    let dead = false, renderer, scene, camera, mat, tickFn, ro;

    const boot = async () => {
      const THREE = await import('./three-lite.js');
      if (dead) return;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(lowPower ? Math.min(dpr, 1) : dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      mat = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false,
        uniforms: {
          uRes:     { value: new THREE.Vector2(canvas.width, canvas.height) },
          uDpr:     { value: renderer.getPixelRatio() },
          uTime:    { value: 0 },
          uPointer: { value: new THREE.Vector2(-1e4, -1e4) },
          uSpeed:   { value: 0 },
          uScrollV: { value: 0 },
          uScroll:  { value: 0 },
          uAtmo:    { value: 0 },
          uBase:    { value: [0.910, 0.894, 0.859] },   /* --cream */
          uLav:     { value: [0.812, 0.784, 0.894] },   /* --lav */
        },
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        mat.uniforms.uRes.value.set(canvas.width, canvas.height);
      };
      window.addEventListener('resize', resize);
      ro = () => window.removeEventListener('resize', resize);

      const pr = renderer.getPixelRatio();
      let atmo = 0;
      const draw = (t) => {
        const u = mat.uniforms;
        u.uTime.value = t;
        u.uPointer.value.set(input.sx * pr, input.sy * pr);
        u.uSpeed.value = input.speed;
        u.uScrollV.value = input.sv;
        u.uScroll.value = input.scrollY * pr;
        atmo += (input.atmosphere - atmo) * 0.06;
        u.uAtmo.value = atmo;
        renderer.render(scene, camera);
      };

      if (reduced) { draw(0); return; }
      tickFn = (t) => { if (!document.hidden) draw(t); };
      gsap.ticker.add(tickFn);
    };

    /* let the opening cinematic own the first frames */
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
    const h = idle(boot, { timeout: 1500 });

    return () => {
      dead = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(h);
      if (tickFn) gsap.ticker.remove(tickFn);
      if (ro) ro();
      if (mat) mat.dispose();
      if (scene) scene.traverse((o) => o.geometry && o.geometry.dispose());
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas id="field" ref={ref} aria-hidden="true" />;
}
