# Seqnc.ai

Marketing site for **Seqnc.ai** — business automation for service businesses.

Built as a single-page interactive experience: React + Vite, GSAP (ScrollTrigger,
SplitText) for the motion engine, Lenis for the scroll dolly, and a small
Three.js shader for the depth field beneath the page.

## Design system

Light room, dark objects. A neutral off-white page, Archivo for display type
in sentence case, Inter for everything else, one ink and three greys. The
hero is a small Three.js scene of matte cubes; the section illustrations are
white interfaces floating in shallow CSS 3D. Motion is slow and quiet, and
`prefers-reduced-motion` keeps every composition static.

## Structure

| Path | Purpose |
| --- | --- |
| `src/engine/` | Motion tokens, input state (pointer + scroll velocity), scroll dolly, scene registry, hooks |
| `src/ui/` | Nav, magnetic controls, text reveal primitives, the section visuals |
| `src/scenes/` | The eleven sections, in page order |
| `src/webgl/` | The hero cube scene (Three.js, loaded after mount) |
| `src/styles/` | Tokens, base voices, UI, scenes |
| `src/content/copy.js` | Every word on the site |

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

Keyboard focus is visible everywhere and the accordion is operable from the keyboard. `prefers-reduced-motion` keeps
the composition and the palette but drops the pinned scenes, the opening
choreography and the scroll-driven camera for static layouts.
