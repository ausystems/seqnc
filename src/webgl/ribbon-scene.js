/* =========================================================================
   The ring: one continuous band of violet chrome.

   A rounded-rectangle cross-section swept along a perfect circle.  It
   turns slowly, leans with the pointer and answers a fast scroll, and it
   is always a ring.  Reflections come from a small procedural studio (a
   gradient sphere and a few softboxes) baked through PMREM, so no texture
   is downloaded.
   ========================================================================= */
import {
  ACESFilmicToneMapping, BackSide, DoubleSide, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color,
  DirectionalLight, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, ShaderMaterial, SphereGeometry,
  SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';

const TAU = Math.PI * 2;
const N = 12;

/* control points of the circle the band is swept along */
function controlPoints() {
  const pts = [];
  for (let i = 0; i < N; i++) { const a = (i / N) * TAU; pts.push(new Vector3(Math.cos(a), Math.sin(a), 0)); }
  return pts;
}

/* a rounded-rectangle band swept along the curve */
function sweep(curve, segs, radial, w, h) {
  const frames = curve.computeFrenetFrames(segs, true);
  const pts = curve.getSpacedPoints(segs);
  const pos = new Float32Array((segs + 1) * (radial + 1) * 3);
  const nor = new Float32Array((segs + 1) * (radial + 1) * 3);
  const uv = new Float32Array((segs + 1) * (radial + 1) * 2);
  const n = 2.9, e = 2 / n;
  const P = new Vector3(), Nn = new Vector3();
  let k = 0, u = 0;
  for (let i = 0; i <= segs; i++) {
    const fi = i === segs ? 0 : i;
    const T = frames.normals[fi], B = frames.binormals[fi];
    const C = pts[i];
    for (let j = 0; j <= radial; j++) {
      const v = (j / radial) * TAU;
      const c = Math.cos(v), s = Math.sin(v);
      const cx = w * Math.sign(c) * Math.pow(Math.abs(c), e);
      const cy = h * Math.sign(s) * Math.pow(Math.abs(s), e);
      P.copy(C).addScaledVector(T, cx).addScaledVector(B, cy);
      const nx = Math.sign(c) * Math.pow(Math.abs(c), 2 - e) / w;
      const ny = Math.sign(s) * Math.pow(Math.abs(s), 2 - e) / h;
      Nn.set(0, 0, 0).addScaledVector(T, nx).addScaledVector(B, ny).normalize();
      pos[k] = P.x; pos[k + 1] = P.y; pos[k + 2] = P.z;
      nor[k] = Nn.x; nor[k + 1] = Nn.y; nor[k + 2] = Nn.z;
      k += 3;
      uv[u] = i / segs; uv[u + 1] = j / radial; u += 2;
    }
  }
  /* close the seam exactly: the last ring is the first ring */
  const ring = (radial + 1) * 3;
  for (let j = 0; j < ring; j++) { pos[segs * ring + j] = pos[j]; nor[segs * ring + j] = nor[j]; }
  const idx = [];
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { pos, nor, uv, idx };
}

function ribbonGeometry(segs, radial, w, h) {
  const ring = new CatmullRomCurve3(controlPoints(), true, 'centripetal', 0.5);
  const A = sweep(ring, segs, radial, w, h);
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(A.pos, 3));
  g.setAttribute('normal', new BufferAttribute(A.nor, 3));
  g.setAttribute('uv', new BufferAttribute(A.uv, 2));
  g.setIndex(A.idx);
  return g;
}

/* the studio the chrome reflects: white above, lavender at the horizon,
   deep violet below, and three bright softboxes */
function studio(renderer) {
  const env = new Scene();
  const sky = new Mesh(new SphereGeometry(40, 32, 16), new ShaderMaterial({
    side: BackSide,
    uniforms: {},
    vertexShader: 'varying vec3 vW; void main(){ vW = normalize((modelMatrix * vec4(position,1.0)).xyz); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec3 vW;
      void main(){
        float y = vW.y;
        vec3 top = vec3(0.78, 0.70, 0.98);
        vec3 high = vec3(0.54, 0.40, 0.92);
        vec3 mid = vec3(0.30, 0.16, 0.66);
        vec3 low = vec3(0.05, 0.02, 0.15);
        vec3 c = mix(low, mid, smoothstep(-0.75, 0.0, y));
        c = mix(c, high, smoothstep(0.05, 0.5, y));
        c = mix(c, top, smoothstep(0.55, 0.95, y));
        gl_FragColor = vec4(c, 1.0);
      }`,
  }));
  env.add(sky);
  const box = (w, h, x, y, z, k, ry = 0, rx = 0, tint = [1, 1, 1]) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(k * tint[0], k * tint[1], k * tint[2]), side: DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.lookAt(0, 0, 0); env.add(m);
  };
  /* a broad top light, one long thin horizon strip for the sharp line
     chrome is known by, a periwinkle side, a warm-white kicker and a
     violet bounce from below */
  box(22, 6, 0, 14, 8, 8.0);
  box(34, 0.7, 0, 2.2, 12, 11.0);
  box(3.5, 18, -15, 2, 4, 3.4, 0, 0, [0.55, 0.68, 1.0]);
  box(14, 1.6, 10, -8, -6, 4.8);
  box(6, 2.4, 12, 8, 2, 3.4, 0, 0, [1.0, 0.96, 0.9]);
  box(16, 3, 0, -13, 4, 2.6, 0, 0, [0.82, 0.5, 1.0]);
  const pm = new PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.035).texture;
  pm.dispose();
  sky.geometry.dispose(); sky.material.dispose();
  env.traverse((o) => { if (o.isMesh && o !== sky) { o.geometry.dispose(); o.material.dispose(); } });
  return tex;
}

export function createRibbon(canvas, opts = {}) {
  const { variant = 'hero', dpr = 1.5, lowPower = false } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.poster });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0, 0, variant === 'hero' ? 6.3 : 6.9);

  const envMap = studio(renderer);
  scene.environment = envMap;

  const key = new DirectionalLight(0xffffff, 2.4); key.position.set(2, 8, 6); scene.add(key);
  const rim = new DirectionalLight(0x9db2f8, 2.2); rim.position.set(-6, -3, -5); scene.add(rim);
  const fill = new DirectionalLight(0xc9aef5, 0.9); fill.position.set(-4, 2, 7); scene.add(fill);

  const segs = lowPower ? 240 : 480, radial = lowPower ? 32 : 48;
  const geometry = ribbonGeometry(segs, radial, 0.24, 0.10);
  const material = new MeshPhysicalMaterial({
    color: new Color(0x8f63f2), metalness: 1, roughness: 0.07,
    clearcoat: 1, clearcoatRoughness: 0.03,
    iridescence: 0.2, iridescenceIOR: 1.3, iridescenceThicknessRange: [220, 520],
    anisotropy: 0.25, anisotropyRotation: Math.PI / 2,
    envMapIntensity: 1.6,
  });
  const mesh = new Mesh(geometry, material);
  const group = new Group();
  group.add(mesh);
  group.rotation.set(0.55, -0.35, 0.18);
  scene.add(group);

  const state = { rx: 0, ry: 0, scroll: 0, time: 0 };

  function resize() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  function render(dt, pointer) {
    state.time += dt;
    const base = variant === 'hero' ? 0.16 : 0.09;
    group.rotation.y += base * dt;
    /* a ring turning on its own axis reads as still, so it also breathes on two slow tilts and floats a little */
    group.rotation.x = 0.55 + Math.sin(state.time * 0.33) * 0.11 + state.rx;
    group.rotation.z = 0.18 + Math.cos(state.time * 0.24) * 0.09 + state.ry * 0.3;
    const float = Math.sin(state.time * 0.5) * 0.025;
    if (pointer) {
      const tx = (pointer.ny - 0.5) * 0.34, ty = (pointer.nx - 0.5) * 0.5;
      state.rx += (tx - state.rx) * Math.min(1, dt * 2.4);
      state.ry += (ty - state.ry) * Math.min(1, dt * 2.4);
      group.rotation.y += state.ry * 0.02;
      /* a fast scroll gives the band a little extra turn */
      group.rotation.y += (pointer.sv || 0) * dt * 0.9;
    }
    if (variant === 'hero') {
      const s = 1 - state.scroll * 0.12;
      group.scale.setScalar(s);
      group.position.y = state.scroll * 0.9 + float;
    } else {
      group.position.y = float;
    }
    renderer.render(scene, camera);
  }

  function dispose() {
    geometry.dispose(); material.dispose(); envMap.dispose();
    renderer.dispose();
    renderer.forceContextLoss && renderer.forceContextLoss();
  }

  return { renderer, camera, state, render, resize, dispose, canvas };
}
