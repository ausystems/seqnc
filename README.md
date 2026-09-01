# Seqnc.ai

Marketing site for **Seqnc.ai** — business automation for service businesses.

A static site with no build step, no framework and no runtime dependencies: four
files served straight from the repository root.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The whole page — hero, fifteen sections and the footer |
| `styles.css` | Neo-Swiss type scale, layout system, and every transition |
| `grid.js` | The hero's isometric cube grid: a canvas background that lights up around the cursor |
| `site.js` | Scroll reveals, the demo carousel, the FAQ accordion and the orbiting tools story |

## Running it locally

Any static file server works:

```bash
python3 -m http.server 5199
```

Then open <http://localhost:5199>.

## Deployment

Deployed on [Vercel](https://vercel.com) as a static site — no build command, output
served from the repository root. Every push to `main` deploys automatically.

## Accessibility and motion

The page honours `prefers-reduced-motion`: the cursor-reactive hero grid, the scroll
reveals, the carousel and the scroll-driven orbit all fall back to static layouts.
