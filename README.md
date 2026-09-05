# Seqnc.ai

Marketing site for **Seqnc.ai** — business automation for service businesses.

Built as a single-page interactive experience: React + Vite, GSAP (ScrollTrigger,
SplitText) for the motion engine, Lenis for the scroll dolly, and a small
Three.js shader for the depth field beneath the page.

## Design system

Paper and ink. A medium-cream page, condensed heavy uppercase display type
(Archivo, width axis), a serif second voice (Instrument Serif) for deck lines
and interjections, Inter for utility text. Black bands with torn edges invert
the palette; bracketed `[ labels ]`, stacked rule bands, circled numbers and
hairline ledgers give the structure. One whisper of lavender — under the
pointer in the depth field, on the tools sheet, and around the cursor in the
footer wordmark.

The hero's isometric cube-grid background is `public/grid.js`, loaded untouched.

## Structure

| Path | Purpose |
| --- | --- |
| `src/engine/` | Motion tokens, input state (pointer + scroll velocity), scroll dolly, scene registry, hooks |
| `src/ui/` | Cursor, nav/HUD, magnetic controls, text reveal primitives, print-shop decorations |
| `src/scenes/` | The fifteen levels, in page order — each with one mechanic of its own |
| `src/webgl/` | The depth field (Three.js, lazy-loaded after first paint) |
| `src/styles/` | Tokens, base voices, UI, scenes |
| `src/content/copy.js` | Every word on the site |
| `public/grid.js` | The hero background animation (do not edit) |

## Running it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>. `npm run build` writes the production
bundle to `dist/`; `npm run preview` serves it.

## Deployment

Deployed on [Vercel](https://vercel.com) as a Vite project (`vercel.json`
declares the framework, build command and output directory). Every push to
`main` deploys automatically once the repository is imported.

## Accessibility and motion

Keyboard focus is visible everywhere; the accordion, level select and
capability rows are operable from the keyboard. `prefers-reduced-motion` keeps
the composition and the palette but drops the pinned scenes, the opening
choreography and the scroll-driven camera for static layouts.
