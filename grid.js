/* =========================================================================
   Isometric cube-grid background.

   Reverse engineered frame by frame from the reference recording, whose page
   grid is 2260 reference pixels wide.  Every constant below is a measurement
   taken off that footage rather than a design choice:

     lattice   rhombic cells, half-diagonals 128 x 74 rpx — 128/74 = sqrt(3),
               so it is a true isometric projection.
     cube      base rhombus 0.644 of the cell, body 76 rpx tall, standing on
               its own ground tile (0.90 of the cell).  The cube hangs from a
               fixed top face and extends downward as it grows, which is why
               a dormant cell leaves exactly four specks behind.
     reveal    a circle of radius 1.955 cells measured on the ground plane,
               centred on the pointer.  The edge is hard: a settled cell is
               either fully up or fully down, never half-way, and it stays up
               once the pointer stops.
     easing    the pointer itself is chased with a ~140 ms lag, and each cell
               then travels to its target over 220 ms.  Those two together
               produce the trail of fragments that follows a fast cursor.
     fragments every edge is drawn as brackets growing out of its vertices, so
               part-grown cells read as arrows, chevrons and Y shapes rather
               than as small cubes.
     colour    hue = 247.5 + 87.5 * sin(k * projection) — a cyan-to-magenta
               ramp whose projection axis makes a full turn every 5 s.  The
               ramp itself was sampled from the footage, not generated.
   ========================================================================= */

(() => {
  'use strict';

  const REF_W = 2260;                  // reference page width, in px

  /* ---- geometry (reference px) ---- */
  const CELL_W   = 128;      // tile half-width
  const CELL_H   = 74;       // tile half-height
  const CUBE     = 0.644;    // cube footprint, relative to the cell
  const CUBE_H   = 76;       // cube height, == the tile's drop below the top face
  const TILE     = 0.90;     // ground tile size, relative to the cell
  const LINE_W   = 5.2;      // edge beam width at full scale
  const VERT_W   = 1.55;     // vertical beams read wider than the flat ones
  const MIN_STUB = 2.6;      // shortest corner bracket — the dormant specks

  /* ---- behaviour ---- */
  const RADIUS   = 1.955;    // reveal radius, in cells
  const IDLE     = 0.32;     // rhombus scale of a dormant cell
  const DURATION = 0.22;     // seconds for a cell to grow or collapse
  const FOLLOW   = 0.14;     // pointer chase time constant, seconds
  const EZ       = 1.6;      // growth curve exponent
  const TEZ      = 2.5;      // the ground tile trails the cube
  const SEZ      = 2.1;      // corner brackets close late

  /* ---- colour ---- */
  const HUE_MID  = 247.5;
  const HUE_AMP  = 87.5;
  const WAVE_K   = 0.00235;  // radians per reference px
  const SPIN     = 5.0;      // seconds per full turn of the gradient axis
  const PHASE    = -0.19;
  const TILE_M0  = 0.82;     // tile shading at its back corner
  const TILE_M1  = 1.0;      // ...and at its front corner
  const DULL_0   = 0.54, DULL_1   = 0.66;   // dull flank of a beam, top / bottom
  const BRIGHT_0 = 0.70, BRIGHT_1 = 0.86;   // bright flank
  const IDLE_DIM = 0.55;     // dormant specks sit a little darker

  /* lattice anchor, relative to the canvas centre (reference px) */
  const ANCHOR_X = 46;
  const ANCHOR_Y = 99.5;

  /* The palette is not a plain HSL sweep: these stops were sampled straight
     off the footage, one every 8 degrees of the hue ramp. */
  const RAMP = [
    [160,  10, 255, 205], [168,  14, 254, 220], [176,  19, 246, 236],
    [184,  58, 230, 247], [192,  70, 211, 250], [200,  84, 192, 250],
    [208,  93, 173, 249], [216, 102, 158, 249], [224, 115, 147, 249],
    [232, 124, 141, 249], [240, 143, 141, 250], [248, 154, 136, 250],
    [256, 165, 132, 250], [264, 174, 122, 246], [272, 185, 117, 240],
    [280, 196, 110, 236], [288, 210, 109, 235], [296, 224, 105, 230],
    [304, 239, 115, 229], [312, 244, 110, 215], [320, 236,  88, 187],
    [328, 224,  76, 158], [336, 210,  64, 130]
  ];

  function ramp(h) {
    if (h <= RAMP[0][0]) return RAMP[0];
    const last = RAMP[RAMP.length - 1];
    if (h >= last[0]) return last;
    const i = Math.min(RAMP.length - 2, Math.floor((h - 160) / 8));
    const a = RAMP[i], b = RAMP[i + 1];
    const f = (h - a[0]) / (b[0] - a[0]);
    return [h,
      a[1] + (b[1] - a[1]) * f,
      a[2] + (b[2] - a[2]) * f,
      a[3] + (b[3] - a[3]) * f];
  }

  const rgb = (c, m) =>
    `rgb(${Math.round(c[1] * m)} ${Math.round(c[2] * m)} ${Math.round(c[3] * m)})`;

  /* ------------------------------------------------------------------ */

  const canvas = document.getElementById('grid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dpr = 1, cw = 0, ch = 0, k = 1;
  let ox = 0, oy = 0;                 // lattice origin, css px
  let sMin = 0, sMax = 0, dMin = 0, dMax = 0;

  const cells = new Map();            // "s,d" -> progress 0..1
  let pointer = null;                 // raw pointer, null until it first moves
  let chased = null;                  // pointer after the follow easing
  let last = 0;
  let t0 = performance.now();
  let running = false;
  let onScreen = true;

  /* ---------------------------------------------------------------- size */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    cw = Math.max(1, Math.round(r.width));
    ch = Math.max(1, Math.round(r.height));
    canvas.width  = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* below tablet the grid stops shrinking, otherwise the cells turn into
       dust and the whole effect reads as noise */
    k = Math.min(1, Math.max(cw / REF_W, 0.34));

    ox = cw / 2 + ANCHOR_X * k;
    oy = ch / 2 + ANCHOR_Y * k;

    const stepX = CELL_W * k, stepY = CELL_H * k;
    sMin = Math.floor((0 - ox) / stepX) - 2;
    sMax = Math.ceil((cw - ox) / stepX) + 2;
    dMin = Math.floor((0 - oy) / stepY) - 3;
    dMax = Math.ceil((ch - oy) / stepY) + 3;

    cells.clear();
    if (!running) paint(performance.now());
  }

  /* ------------------------------------------------------------- pointer */
  function setPointer(x, y) {
    const r = canvas.getBoundingClientRect();
    pointer = { x: x - r.left, y: y - r.top };
    start();
  }

  window.addEventListener('pointermove', e => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('pointerdown', e => setPointer(e.clientX, e.clientY), { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; }, { passive: true });
  window.addEventListener('blur', () => { pointer = null; });

  /* ------------------------------------------------------------- helpers */
  function rhombus(x, y, hw, hh) {
    ctx.moveTo(x, y - hh);
    ctx.lineTo(x + hw, y);
    ctx.lineTo(x, y + hh);
    ctx.lineTo(x - hw, y);
    ctx.closePath();
  }

  /* Every edge is a small three-dimensional beam: in the footage each line
     carries a brighter band on its upper (or left) flank and a duller one on
     the other.  Segments are collected first, then laid down in two passes —
     dull at full width, bright at half — which also hides the joints. */
  const flat = [];      // segments lying in the ground plane
  const upright = [];   // the vertical beams, which read wider

  const BUCKETS = 14;   // hue buckets used to batch the dormant cells
  const bucketFlat = Array.from({ length: BUCKETS }, () => []);
  const bucketUp   = Array.from({ length: BUCKETS }, () => []);

  function bracket(vx, vy, arms, stub) {
    for (let i = 0; i < arms.length; i += 2) {
      const dx = arms[i] - vx, dy = arms[i + 1] - vy;
      const len = Math.hypot(dx, dy);
      if (len < 0.35) continue;
      const t = Math.min(stub, len * 0.5) / len;
      (Math.abs(dx) < 0.01 ? upright : flat).push(vx, vy, vx + dx * t, vy + dy * t);
    }
  }

  function strokePass(list, dull, bright, w) {
    if (!list.length) return;

    ctx.lineWidth = w;
    ctx.strokeStyle = dull;
    ctx.beginPath();
    for (let i = 0; i < list.length; i += 4) {
      ctx.moveTo(list[i], list[i + 1]);
      ctx.lineTo(list[i + 2], list[i + 3]);
    }
    ctx.stroke();

    const off = w * 0.25;
    ctx.lineWidth = w * 0.5;
    ctx.strokeStyle = bright;
    ctx.beginPath();
    for (let i = 0; i < list.length; i += 4) {
      const x1 = list[i], y1 = list[i + 1], x2 = list[i + 2], y2 = list[i + 3];
      let nx = -(y2 - y1), ny = x2 - x1;
      const l = Math.hypot(nx, ny) || 1;
      nx /= l; ny /= l;
      if (ny > 0 || (Math.abs(ny) < 1e-6 && nx > 0)) { nx = -nx; ny = -ny; }
      ctx.moveTo(x1 + nx * off, y1 + ny * off);
      ctx.lineTo(x2 + nx * off, y2 + ny * off);
    }
    ctx.stroke();
    list.length = 0;
  }

  function flushBeams(dull, bright, w) {
    strokePass(flat, dull, bright, w);
    strokePass(upright, dull, bright, w * VERT_W);
  }

  /* ---------------------------------------------------------------- draw */
  function frame(now) {
    paint(now);
    if (running) requestAnimationFrame(frame);
  }

  function paint(now) {
    const time = (now - t0) / 1000;
    let dt = (now - last) / 1000;
    last = now;
    if (!(dt > 0) || dt > 0.1) dt = 1 / 60;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);

    const stepX = CELL_W * k, stepY = CELL_H * k;

    /* the pointer is chased rather than followed — that lag is what leaves a
       trail of collapsing cells behind a fast cursor */
    if (!pointer) chased = null;
    else if (!chased) chased = { x: pointer.x, y: pointer.y };
    else {
      const f = 1 - Math.exp(-dt / FOLLOW);
      chased = { x: chased.x + (pointer.x - chased.x) * f,
                 y: chased.y + (pointer.y - chased.y) * f };
    }

    let ac = 0, bc = 0, hasP = false;
    if (chased) {
      const sc = (chased.x - ox) / stepX;
      const dc = (chased.y - oy) / stepY;
      ac = (sc - dc) / 2;
      bc = (sc + dc) / 2;
      hasP = true;
    }

    /* rotating colour axis */
    const ang = -Math.PI * 2 * (time / SPIN);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const cx = cw / 2, cy = ch / 2;
    const hueAt = (px, py) =>
      HUE_MID + HUE_AMP * Math.sin((((px - cx) * ca + (py - cy) * sa) / k) * WAVE_K + PHASE);

    const step = dt / DURATION;
    const R2 = RADIUS * RADIUS;

    ctx.lineJoin = 'miter';
    ctx.miterLimit = 8;
    ctx.lineCap = 'butt';

    /* Dormant cells are by far the majority and they can never be overlapped
       by a raised cube — the geometry simply does not reach that far.  So
       they are collected into a handful of hue buckets and laid down in one
       pass, instead of two stroke calls each. */
    for (let i = 0; i < BUCKETS; i++) { bucketFlat[i].length = 0; bucketUp[i].length = 0; }
    const live = [];

    for (let d = dMin; d <= dMax; d++) {
      const y = oy + stepY * d;
      const s0 = sMin + (((sMin + d) % 2) + 2) % 2;   // keep (s + d) even

      for (let s = s0; s <= sMax; s += 2) {
        const x = ox + stepX * s;
        const a = (s - d) / 2, b = (s + d) / 2;

        const key = s + ',' + d;
        let p = cells.get(key) || 0;

        let target = 0;
        if (hasP) {
          const da = a - ac, db = b - bc;
          if (da * da + db * db <= R2) target = 1;
        }
        if (p !== target) {
          p = target > p ? Math.min(target, p + step) : Math.max(target, p - step);
          if (p <= 0) cells.delete(key); else cells.set(key, p);
        }

        if (p === 0) {
          const hw = CELL_W * CUBE * k * IDLE;
          const hh = CELL_H * CUBE * k * IDLE;
          const ty = y - CUBE_H * k;
          bracket(x, ty - hh, [x + hw, ty, x - hw, ty], MIN_STUB * k);
          bracket(x + hw, ty, [x, ty - hh, x, ty + hh], MIN_STUB * k);
          bracket(x, ty + hh, [x + hw, ty, x - hw, ty], MIN_STUB * k);
          bracket(x - hw, ty, [x, ty - hh, x, ty + hh], MIN_STUB * k);
          const bi = Math.max(0, Math.min(BUCKETS - 1,
                     Math.round((hueAt(x, y) - 160) / 176 * (BUCKETS - 1))));
          const bf = bucketFlat[bi], bu = bucketUp[bi];
          for (let i = 0; i < flat.length; i++) bf.push(flat[i]);
          for (let i = 0; i < upright.length; i++) bu.push(upright[i]);
          flat.length = 0; upright.length = 0;
        } else {
          live.push(x, y, p);
        }
      }
    }

    const iw = LINE_W * k * IDLE;
    for (let i = 0; i < BUCKETS; i++) {
      if (!bucketFlat[i].length && !bucketUp[i].length) continue;
      const c = ramp(160 + (i / (BUCKETS - 1)) * 176);
      const dull = rgb(c, DULL_0 * IDLE_DIM), bright = rgb(c, BRIGHT_0 * IDLE_DIM);
      strokePass(bucketFlat[i], dull, bright, iw);
      strokePass(bucketUp[i], dull, bright, iw * VERT_W);
    }

    /* the raised cells, still back to front */
    for (let n = 0; n < live.length; n += 3) {
      const x = live[n], y = live[n + 1], p = live[n + 2];
      const e = Math.pow(p, EZ);

        /* ---- ground tile ---- */
        const te = e === 0 ? 0 : Math.pow(e, TEZ);
        if (te > 0.004) {
          const pad = 0.7;                       // fuse neighbouring tiles
          const thh = CELL_H * TILE * k * te + pad;
          ctx.beginPath();
          rhombus(x, y, CELL_W * TILE * k * te + pad * 1.7, thh);
          /* the plane is not flat-lit: each tile darkens towards its back
             corner and lifts towards the front one */
          const tg = ctx.createLinearGradient(0, y - thh, 0, y + thh);
          tg.addColorStop(0, rgb(ramp(hueAt(x, y - thh)), TILE_M0));
          tg.addColorStop(1, rgb(ramp(hueAt(x, y + thh)), TILE_M1));
          ctx.fillStyle = tg;
          ctx.fill();
        }

        /* ---- cube ---- */
        const sc = IDLE + (1 - IDLE) * e;
        const hw = CELL_W * CUBE * k * sc;
        const hh = CELL_H * CUBE * k * sc;
        const cz = CUBE_H * k * e;

        /* it hangs from its top face and extends down onto the tile */
        const topY  = y - CUBE_H * k;
        const baseY = topY + cz;

        const R0x = x + hw, R0y = baseY;
        const B0x = x,      B0y = baseY + hh;
        const L0x = x - hw, L0y = baseY;
        const T1x = x,      T1y = topY - hh;
        const R1x = x + hw, R1y = topY;
        const B1x = x,      B1y = topY + hh;
        const L1x = x - hw, L1y = topY;

        if (cz > 0.5) {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.moveTo(T1x, T1y); ctx.lineTo(R1x, R1y);      /* top face   */
          ctx.lineTo(B1x, B1y); ctx.lineTo(L1x, L1y); ctx.closePath();
          ctx.moveTo(L1x, L1y); ctx.lineTo(B1x, B1y);      /* left face  */
          ctx.lineTo(B0x, B0y); ctx.lineTo(L0x, L0y); ctx.closePath();
          ctx.moveTo(B1x, B1y); ctx.lineTo(R1x, R1y);      /* right face */
          ctx.lineTo(R0x, R0y); ctx.lineTo(B0x, B0y); ctx.closePath();
          ctx.fill();
        }

        /* ---- edges ---- */
        const halfEdge = Math.hypot(hw, hh) * 0.5;
        const stub = Math.max(MIN_STUB * k, halfEdge * Math.pow(e, SEZ) * 2);

        bracket(T1x, T1y, [R1x, R1y, L1x, L1y], stub);
        bracket(R1x, R1y, [T1x, T1y, B1x, B1y, R0x, R0y], stub);
        bracket(B1x, B1y, [R1x, R1y, L1x, L1y, B0x, B0y], stub);
        bracket(L1x, L1y, [T1x, T1y, B1x, B1y, L0x, L0y], stub);
        if (cz > 0.5) {
          bracket(R0x, R0y, [R1x, R1y, B0x, B0y], stub);
          bracket(B0x, B0y, [B1x, B1y, R0x, R0y, L0x, L0y], stub);
          bracket(L0x, L0y, [L1x, L1y, B0x, B0y], stub);
        }

        const w = LINE_W * k * sc;
        const cT = ramp(hueAt(x, T1y)), cB = ramp(hueAt(x, B0y));
        const gd = ctx.createLinearGradient(0, T1y, 0, B0y);
        gd.addColorStop(0, rgb(cT, DULL_0));
        gd.addColorStop(1, rgb(cB, DULL_1));
        const gb = ctx.createLinearGradient(0, T1y, 0, B0y);
        gb.addColorStop(0, rgb(cT, BRIGHT_0));
        gb.addColorStop(1, rgb(cB, BRIGHT_1));
        flushBeams(gd, gb, w);
    }
  }

  /* ---------------------------------------------------------------- boot */
  function start() {
    if (running || reduced || !onScreen) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  /* the page is long — there is no reason to keep drawing once the hero has
     scrolled away */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start(); else stop();
    }, { threshold: 0 }).observe(canvas);
  }

  resize();
  start();
  if (reduced) paint(performance.now());
})();
