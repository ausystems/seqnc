# Seqnc Automations

The marketing site for **Seqnc Automations** (seqnc.ca): custom Inbound,
Operations and Outbound systems for service businesses, built around
The TimeBack Method™.

React + Vite, GSAP (ScrollTrigger, SplitText, DrawSVG, MotionPath) for the
motion, Lenis for the scroll on fine-pointer devices, and one Three.js scene:
a band of violet chrome that resolves from a loose loop into a ring.

## Design system

The brand's own violet (`#7C4DCC`, `#A861E6`, `#C9AEF5`) and night
(`#0E0820`) on paper. Manrope for display and body, Azeret Mono for labels,
numbers and controls, Instrument Serif italic for one accent line per
composition. Tokens live in `src/styles/tokens.css`.

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/en.js`, `src/content/fr.js` | Every word on the site, both languages |
| `src/i18n.jsx` | Language state, remembered under `seqnc-lang` |
| `src/engine/` | Device flags, motion tokens, input sampling, scroll dolly, route transition, hooks |
| `src/ui/` | Nav and menu, footer, button, reveal primitives, mark, icons |
| `src/home/` | The homepage chapters, in page order |
| `src/pages/` | The free review, privacy, terms, 404 |
| `src/webgl/` | The ribbon scene and its React host |
| `public/demo/` | The three live demos (self-contained static apps) with the Seqnc frame |
| `public/fonts/` | Self-hosted woff2 subsets |

## Routes

`/`, `/free-review`, `/privacy`, `/terms`, plus the static demos at
`/demo/inbound/`, `/demo/operations/`, `/demo/outbound/`. Anything else is
the 404 page. Booking goes to Calendly; contact is by email.

## Running it locally

```bash
npm install
npm run dev
```

`npm run build` writes the production bundle to `dist/`; `npm run preview`
serves it. In dev, `?native` disables the smooth scroll and `?poster`
exposes `window.__seqncPoster` for re-rendering the ribbon stills in
`public/` (they post to the dev-only `/__poster` endpoint).

## Deployment

Vercel, as a Vite project (`vercel.json`). The SPA rewrite excludes
`/demo/`, `/assets/` and `/fonts/` so the static demos are served as files.

## Accessibility and motion

Semantic landmarks, a skip link, visible focus everywhere, a keyboard
accordion and menu. `prefers-reduced-motion` keeps every composition static:
the ribbon shows its poster, the method reads as a column, and text arrives
without motion.
