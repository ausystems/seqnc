/* =========================================================================
   React host for the ribbon.  A still poster is on the page immediately and
   for anyone without WebGL or with reduced motion; the live scene loads in
   its own chunk, resolves the loop into a ring over the first seconds, then
   idles.  It only renders while on screen.
   ========================================================================= */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { dpr, lowPower, reduced, touch } from '../engine/device.js';
import { input } from '../engine/input.js';

export default function Ribbon({ variant = 'hero', className = '' }) {
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);
  const poster = variant === 'hero' ? '/hero-ribbon.webp' : '/ring.webp';

  useEffect(() => {
    const canvas = canvasRef.current;
    /* the closing ring stays a still on touch devices: one WebGL context per page there */
    if (!canvas || reduced || (variant === 'ring' && touch)) return undefined;
    let dead = false, app, tick, onResize, io;
    let visible = true;
    (async () => {
      let mod;
      try { mod = await import('./ribbon-scene.js'); } catch { return; }
      if (dead) return;
      try { app = mod.createRibbon(canvas, { variant, dpr, lowPower, poster: new URLSearchParams(window.location.search).has('poster') }); }
      catch { return; }
      if (dead) { app.dispose(); return; }
      onResize = () => app.resize();
      window.addEventListener('resize', onResize);
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      io.observe(canvas);

      /* the ring arrives already resolved; it only turns */
      let last = performance.now();
      tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!visible || document.hidden) return;
        if (variant === 'hero') app.state.scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
        app.render(dt, input.present ? input : null);
      };
      gsap.ticker.add(tick);
      app.render(0, null);
      setLive(true);
      if (new URLSearchParams(window.location.search).has('poster')) {
        /* dev only: render a still at a fixed size for the poster files */
        window.__seqncPoster = window.__seqncPoster || {};
        window.__seqncPoster[variant] = (size = 1000, q = 0.86, type = 'image/webp') => {
          const w = canvas.clientWidth, h = canvas.clientHeight;
          app.renderer.setSize(size, size, false);
          app.renderer.setPixelRatio(1);
          app.state.scroll = 0;
          app.render(0, null);
          const url = canvas.toDataURL(type, q);
          app.renderer.setPixelRatio(dpr);
          app.renderer.setSize(w, h, false);
          return url;
        };
      }
    })();
    return () => {
      dead = true;
      if (tick) gsap.ticker.remove(tick);
      if (onResize) window.removeEventListener('resize', onResize);
      if (io) io.disconnect();
      if (app) app.dispose();
    };
  }, [variant]);

  return (
    <div className={`ribbon ribbon--${variant} ${live ? 'is-live' : ''} ${className}`} aria-hidden="true">
      <img className="ribbon__poster" src={poster} alt="" width="1200" height="1200" decoding="async" fetchPriority={variant === 'hero' ? 'high' : 'low'} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
      {!reduced && <canvas className="ribbon__canvas" ref={canvasRef} />}
    </div>
  );
}
