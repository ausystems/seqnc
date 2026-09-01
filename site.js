/* =========================================================================
   Page behaviour: scroll reveals, the demo deck, animated FAQ, bar stagger.
   ========================================================================= */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ reveals -- */
  const targets = [...document.querySelectorAll('.r, .media')];

  if ('IntersectionObserver' in window && !reduced) {
    const pending = new Set(targets);
    let io;

    const reveal = (el) => {
      el.classList.add('in');
      pending.delete(el);
      io.unobserve(el);
    };

    io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) reveal(e.target); });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    targets.forEach(t => io.observe(t));

    /* Safety net.  A jump straight down the page (a hash link, a restored
       scroll position, a browser that batches observer callbacks) can leave
       something on screen still waiting to be revealed, so anything already
       in view is shown directly rather than staying invisible. */
    const sweep = () => {
      if (!pending.size) { removeEventListener('scroll', sweep); return; }
      const h = innerHeight;
      [...pending].forEach(t => {
        const b = t.getBoundingClientRect();
        if (b.top < h * .88 && b.bottom > 0) reveal(t);
      });
    };
    addEventListener('scroll', sweep, { passive: true });
    addEventListener('load', sweep);
    setTimeout(sweep, 800);
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  /* bars rise one after another rather than all at once */
  document.querySelectorAll('.bars').forEach(row => {
    [...row.children].forEach((b, i) => b.style.setProperty('--i', i));
  });

  /* ---------------------------------------------------------- demo deck -- */
  const deck = document.getElementById('deck');
  const dots = document.getElementById('dots');

  if (deck && dots) {
    const cards = [...deck.children];
    const bullets = [...dots.children];
    let idx = 0, timer = null;

    const show = (n) => {
      idx = (n + cards.length) % cards.length;
      cards.forEach((c, i) => {
        c.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === idx) c.classList.add('is-active');
        else if (i === (idx + 1) % cards.length) c.classList.add('is-prev');
        else c.classList.add('is-next');
      });
      bullets.forEach((b, i) => b.classList.toggle('is-on', i === idx));
    };

    const play = () => { if (!reduced) timer = setInterval(() => show(idx + 1), 6000); };
    const pause = () => { clearInterval(timer); timer = null; };

    bullets.forEach((b, i) => b.addEventListener('click', () => { pause(); show(i); play(); }));
    deck.addEventListener('pointerenter', pause);
    deck.addEventListener('pointerleave', play);

    /* swipe on touch */
    let x0 = null;
    deck.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; pause(); }, { passive: true });
    deck.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      x0 = null; play();
    }, { passive: true });

    show(0);
    play();
  }

  /* -------------------------------------------------------- orbit story -- */
  /* Scroll position drives one continuous rotation of the ring, so each tool
     swings up to the focus mark in turn while its own note fades in below.
     The angle is written straight from the scroll offset and the easing lives
     in a short CSS transition, so nothing can drift out of sync no matter how
     fast the page is flicked. */
  const story = document.getElementById('story');

  if (story) {
    const stage  = story.querySelector('.story__stage');
    const tools  = [...story.querySelectorAll('.tool')];
    const panels = [...story.querySelectorAll('.story__panel')];
    const ticks  = [...story.querySelectorAll('.story__bar i')];
    const prog   = story.querySelector('.orbit2__prog');
    const N = tools.length;

    if (N > 1 && stage) {
      const STEP = 360 / N;
      const SPAN = (N - 1) * STEP;        // total sweep across the section
      const RING = 2 * Math.PI * 46;      // circumference of the progress ring
      const tint = tools.map(t => getComputedStyle(t).getPropertyValue('--tc').trim() || '#22e6d4');

      story.style.setProperty('--steps', N);

      let shown = -1, last = -1;
      const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

      function draw() {
        const box = story.getBoundingClientRect();
        const range = story.offsetHeight - stage.offsetHeight;
        const p = range > 4 ? clamp(-box.top / range, 0, 1) : 0;
        if (p === last) return;
        last = p;

        const spin = -p * SPAN;
        for (let i = 0; i < N; i++) {
          tools[i].style.setProperty('--a', (i * STEP + spin).toFixed(2) + 'deg');
        }
        if (prog) prog.style.strokeDashoffset = (RING * (1 - p)).toFixed(2);

        const idx = clamp(Math.round(p * (N - 1)), 0, N - 1);
        if (idx === shown) return;
        shown = idx;
        story.style.setProperty('--acc', tint[idx]);
        for (let i = 0; i < N; i++) {
          tools[i].classList.toggle('is-active', i === idx);
          if (panels[i]) panels[i].classList.toggle('is-active', i === idx);
          if (ticks[i])  ticks[i].classList.toggle('is-on', i <= idx);
        }
      }

      if (reduced) {
        draw();
      } else {
        addEventListener('scroll', draw, { passive: true });
        addEventListener('resize', () => { last = -1; draw(); }, { passive: true });
        draw();
      }
    }
  }

  /* ---------------------------------------------------------------- faq -- */
  /* The panel animation is pure CSS (a grid row going 0fr -> 1fr), so this
     only has to track which item is open. */
  const faq = document.querySelector('.faq');
  if (faq) {
    faq.addEventListener('click', ev => {
      const btn = ev.target.closest('.faq__q');
      if (!btn) return;
      const item = btn.parentElement;
      const open = !item.classList.contains('is-open');
      faq.querySelectorAll('.faq__item.is-open').forEach(o => {
        o.classList.remove('is-open');
        o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* --------------------------------------------------------------- year -- */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
