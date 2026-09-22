/* A ring of light that flares out of a resting halo and fades to nothing.
   It is a plain `to` tween from the halo's resting state (opacity 0 in the
   stylesheet), never a `fromTo`: GSAP paints a fromTo's start values the
   moment it is built and again every time a loop wraps, which would leave
   the halo lit while it waits its turn.  A `to` rests where the CSS rests. */
export const ring = ({ from = .8, to = 1.6, start = .6, duration = 1, ease = 'power2.out' } = {}) => ({
  keyframes: [
    { scale: start, opacity: from, duration: .1, ease: 'power1.out' },
    { scale: to, opacity: 0, duration, ease },
  ],
});
