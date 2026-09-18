/* =========================================================================
   React host for the ribbon.  A still poster is on the page immediately and
   for anyone without WebGL or with reduced motion; the live scene loads in
   its own chunk, resolves the loop into a ring over the first seconds, then
   idles.  It only renders while on screen.
   ========================================================================= */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { dpr, lowPower, reduced } from '../engine/device.js';
import { input } from '../engine/input.js';

export default function Ribbon({ variant = 'hero', className = '' }) {
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);
  const poster = variant === 'hero' ? '/hero-ribbon.webp' : '/ring.webp';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;
    let dead = false, app, tick, onResize, io, intro;
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

      /* the resolution: loose loop to ring, then a slow breath around it */
      if (variant === 'hero') {
        intro = gsap.timeline()
          .to(app.state, { t: 0.86, duration: 3.2, ease: 'power3.inOut', delay: 0.4 })
          .to(app.state, { t: 0.78, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
      let last = performance.now();
      tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!visible || document.hidden) return;
        if (variant === 'hero') {
          const sc = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
          app.state.scroll = sc;
          if (sc > 0.02 && intro) { intro.kill(); intro = null; }
          if (!intro) app.state.t += (1 - app.state.t) * Math.min(1, dt * 1.2);
        }
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
          app.state.t = variant === 'hero' ? 0.86 : 1;
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
      if (intro) intro.kill();
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
