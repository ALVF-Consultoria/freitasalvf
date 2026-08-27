# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (Turbopack) on :3000
npm run build    # static export -> out/
npm start        # serve the production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test setup in this repo.

`npm run lint` currently reports ~30 pre-existing errors (React Compiler purity violations from `Math.random()` called during render, and `any` in `YoutubeBackground.tsx`). `next build` does **not** run eslint, so the build passes anyway. Don't treat a red lint run as something your change broke — compare against the baseline.

## Architecture

A single-page Portuguese-language (pt-BR) marketing site for ALVF Consultoria, built as a Next.js App Router app that is **statically exported** (`output: 'export'`, `images.unoptimized`, React Compiler on). No API routes and no dynamic routes. Route `page.tsx` files are server components that exist only to export `metadata` and render a `"use client"` view; everything else under `src` is `"use client"`.

### One state machine, plus a route per migrated area

`src/app/page.tsx` holds the hero, the dashboard and the areas that have not been given a
URL yet. It keeps a single `activeSection` union-typed string and renders each of those
screens as a conditional block inside one `<AnimatePresence>`.

For screens still living in `page.tsx` the flow is:

```
Hero --onTransitionComplete--> Dashboard --onNavigateToX--> XTransition --onComplete--> XSolution --onBack--> Dashboard
```

Adding one means three edits in `page.tsx`: extend the `activeSection` union, add the
`<motion.div>` block, wire the callback from the section that reaches it.

**Two areas are real routes** — `/solucoes-ia` and `/blockchain` — and that is the
direction the rest is heading (`docs/seo-e-crawlers.md`, Camada 2). Each is a folder under
`src/app/` with a server `page.tsx` exporting `metadata` and a `"use client"` `view.tsx`
holding the stage machine. The dashboard reaches them with `router.push`, not `setNavigatedSection`.

Returning is not symmetric, and that is deliberate: the App Router unmounts a page the
instant `router.push` is called, so a route animates its own exit first and navigates in
`onExitComplete`. `/blockchain` also swallowed its video transition, so opening the URL
directly gives the same opening as arriving from the dashboard.

Coming back to `/` lands on the dashboard rather than the hero because of the flag in
`src/lib/entry.ts` — a module variable and not `sessionStorage`, so it survives a
`router.push` and resets on F5. `sessionStorage` was tried and rejected: it survives F5 too,
so the hero never came back until the tab closed.

**The route marks the flag on its way out, not `/` on its way in.** It used to live inside
`page.tsx`, written by an effect that only ran while `/` was mounted — so opening
`/blockchain` or `/solucoes-ia` straight from the URL, or pressing F5 while on one, left the
flag false and scrolling back up landed on the hero instead of the dashboard. Both views now
call `markEntered()` immediately before `router.push("/")`, which is the moment they actually
know where the user is headed. A new route must do the same. `LoadingCurtain` gates everything until `isAppLoading` flips. `BackgroundMusic` is mounted in `src/app/layout.tsx`, not here: the root layout is the only node the App Router keeps across a `router.push`, so inside `page.tsx` the `<audio>` was torn down on the way to `/solucoes-ia` and the track restarted on the way back.

`Dashboard` (`src/sections/Dashboard.tsx`) is the hub: it waits for its brain video to reach its final frame (`isVideoPaused`), then springs 8 `DashboardNode` clouds out from center to hardcoded mobile/tablet/desktop percentage positions. Clicking one plays `enter-effect.mp3`, zooms the node, and fires `onNavigate` after a 1300ms delay that must stay in sync with the zoom animation. `DashboardToNaia` is a second, nested hub reached from the NAIA node.

### Sections are step machines

Each `*Solution` section and each `*Transition` component is driven by a numeric `step` counter advanced by `useStepNavigation` (`src/hooks/useStepNavigation.ts`) — global wheel + touch-swipe listeners with a cooldown (usually 1200ms). Scrolling past the last step calls `onBack()` / `onComplete()`. Scrolling back below step 1 also calls `onBack()` in the two folder sections; the inline-block sections still clamp there.

Step ranges map to content two ways, in descending order of how much you should
prefer them:

- **Folder per section** — `src/sections/AISolution/` (24 steps) and
  `src/sections/BlockchainSolution/` (15 steps) are the target shape and the model for
  migrating the rest. `index.tsx` is the orchestrator and owns everything stateful:
  `step`, `direction`, `useStepNavigation`, the step-range constants, the
  `AnimatePresence`, the chrome (HUD, scanline, back button, ambient light,
  `ScrollIndicator`, the persistent backdrop). The siblings take `step`/`contentStep` and
  `direction` as props, return one `motion.div` each, and hold no navigation hooks.
  Nothing outside the folder imports the children, so they can be reshuffled freely —
  callers only ever import `@/sections/XSolution`, which resolves to `index.tsx`. Because
  the folder and the old flat file share that specifier, migrating a section needs no edit
  at the call site.

  A backdrop that must survive several consecutive steps (AISolution's `Antigravity`,
  BlockchainSolution's Solana grid) belongs in the orchestrator behind its own
  `AnimatePresence`, not inside each step — mounted per step it remounts on every
  transition and the continuity is lost.
- **Inline blocks** — `HeritageSolution`, `MetaverseSolution`, etc. keep the JSX in the section file behind `{step === n && ...}` guards inside `<AnimatePresence mode="wait">`.

**The `key` belongs on the direct child of `<AnimatePresence>`, not on the `motion.div`
inside the extracted component.** `AnimatePresence` identifies children by
`child.key || ""`, so `{step === 1 && <IntroStep />}` and `{step === 2 && <FeatureStep />}`
both read as key `""` — it sees no change and skips the exit animation entirely.
Both folder sections avoid it by writing the key at the call site —
`{step === 1 && <IntroQuote key="intro-quote" />}`. Copy that form when migrating; the
inline-block sections have not been audited for it.

`src/lib/travel.ts` is the Z-travel grammar shared by the step-driven sections (it lived
in `AISolution/` until BlockchainSolution needed it too): every block enters and exits
along the camera axis instead of sliding, so forward always reads as flying *through*
the content. `makeTravel({ near, far, blur })` returns `enter`/`center`/`exit` variants that
read framer-motion's `custom` to invert on backward scroll — so the orchestrator must pass
`custom={direction}` on both the `AnimatePresence` and each child. `travelNormal`,
`travelSoft`, `travelFlat` and `travelPunch` are the four presets in use. Passing `blur: 0`
omits the `filter` property entirely rather than setting `blur(0px)`, which would still
force the subtree to rasterize at rest.

`useStepNavigation` deliberately walks up the DOM (`isAtScrollBoundary`) and refuses to advance while the event target sits inside a scrollable element that hasn't hit its top/bottom. This is what makes mobile work: content too tall for a phone gets wrapped in `MobileScrollWrapper`, which becomes an internal scroller below 768px and a passthrough above it. It lives in `src/components/common/` alongside the other cross-section utilities. It used to sit in a `src/components/blockchain/` folder — blockchain was the first section split into sub-components, so everything landed there and later sections borrowed from it. That folder is gone: its three files were never blockchain-specific.

`useMobile()` (768px breakpoint) is the standard branch for layout, animation intensity, and disabling desktop-only effects (Hero's spotlight mask, `ScrollIndicator`).

### Content vs. presentation

Section copy lives in `src/constants/*.ts` as plain exported objects (`heritageContent`, `b2bContent`, `metaverseChapters`, `storytellingLogs`, `educationContent`, `blockchainFeatures`). Text edits belong there, not in the JSX. `blockchainData.ts` is a `.ts` file that ships lucide icons, so it uses `React.createElement` rather than JSX.

Each area has an accent color used consistently across its transition, section, HUD, and scrollbar:

| Area | Accent |
|---|---|
| Hero / Dashboard / Metaverse / Storytelling | `blue-500` |
| AI / NAIA | `cyan-400` |
| Blockchain / Heritage | `amber-500` |
| B2B | `emerald-500` |
| Education | `indigo-500` |

### 3D and media

`three` is used two ways. Imperatively, without react-three-fiber: `NeuralConnectionSystem`
renders an orthographic overlay of bezier "bubble filaments" from the dashboard center to
each node's percentage position, building the scene in a `useEffect` and disposing/removing
the canvas in the cleanup. Declaratively, via `@react-three/fiber`: `Antigravity`
(`src/components/Antigravity.tsx`, mounted on step 1 of the AI section) is an `<Canvas>`
with an instanced particle field.

Installing `@react-three/fiber` has a project-wide side effect worth knowing: it augments
`JSX.IntrinsicElements` globally with ~200 three.js elements, none of which accept
`className`. Any `React.ElementType` in the codebase then resolves its props to `never`.
`Container.tsx` and `EducationSolution.tsx` were narrowed (`React.ElementType<{ className?:
string }>` and `Record<string, LucideIcon>`) to fix this — narrow the same way rather than
widening back.

`ParticlesBackground` is **not** three.js despite the name — it is 100 (30 on mobile)
absolutely-positioned `<div>`s animated with framer-motion, in three parallax layers driven
by a spring on the mouse. Its own container carries `z-20`, but every section wraps it in
an element that opens a stacking context (`opacity-40`, `opacity-30`, `z-0`), so that
`z-20` only orders inside the wrapper and the layer always sits behind content.

Its visibility is the product of two opacities: the wrapper's, and the `opacity: 0.2` each
particle animates to. The AI section used `opacity-20`, giving 0.2 × 0.2 = 0.04 — a
cyan-400 dot at 4% over `#050505` renders as `rgb(6, 13, 14)` against `rgb(5, 5, 5)`, which
is invisible, so it was dropped there. Anything below roughly `opacity-30` on the wrapper is
not worth mounting.

`ParticleText` and `ParticleImage` (`src/components/`) are the canvas particle pair: same
physics — gather from a scatter, repel the pointer, idle drift — over different sampling.
`ParticleText` rasterizes `fillText` and waits on the `FontFaceSet`; `ParticleImage` waits on
an image decode and fits an aspect ratio. They are two files on purpose; merging them would
mean one component carrying both preambles. `ParticleImage` adds drag (`pointerdown` picks one
handful, fixed at the grab point so the same particles stay held for the whole gesture, and
releasing lets the existing spring carry them home) and `dissolve`, a per-particle wander that
keeps the drawing coming apart while idle. `dissolveSpread` is the knob that matters there: at
1 every particle sits at a different point of the cycle, which shimmers permanently but never
resolves; near 0 the form visibly loosens and re-tightens. Drag ignores `pointerType ===
"touch"` — on a phone that gesture is already `useStepNavigation`'s swipe.

`zoom` flies the camera into the art — BlockchainSolution drives it from step 2, where the two
intro columns part toward the edges. It spreads the particle positions away from the drawing's
centre **inside** the canvas rather than putting a CSS `scale` on it: scaling the bitmap turns
2px dots into blurred blocks, while moving the positions keeps every particle drawn sharp. It
reaches the loop through a ref and is deliberately absent from the effect's dependency array —
as a dependency it would tear down the particles and re-sample the whole image mid-flight. Same
goes for `coreFade`.

The hologram deliberately outlives the intro: it stays mounted through the feature steps and
only exits at step 7, where `TopologyStep` brings its own scenery. Flying into the cube and
then losing it on the next screen threw the whole trip away. What changes across those steps
is the vantage — the zoom keeps creeping forward, and `coreFade` opens a hole at the drawing's
centre so the art stops being the subject and becomes the place the content happens in. That
hole is also what makes the scene read as being *inside* the piece rather than looking at it:
the structure sits around the frame instead of across it. Its falloff is squared, not linear —
linear leaves a wide grey halo where a short edge is wanted. Because the component never
remounts between steps, the camera keeps moving from one block into the next instead of the
particles re-gathering on every screen.

BlockchainSolution keeps **one background field on screen at a time**: the hologram over steps
1-6, `ParticlesBackground` over 7-11 and 15, the Solana grid over 12-14. `ParticlesBackground`
is gated on `!isSolana && !showHologram` for that reason — a hundred animated divs behind
thousands of canvas dots is two particle systems competing, and neither reads. It is also not
just a matter of painting less: every frame those particles animate forces any `backdrop-filter`
above them to re-sample and re-blur the backdrop, so a still background is what lets the browser
cache that blur at all.

Both read pixels back with `getImageData`, so the source must be same-origin — an image from
another host without CORS taints the canvas and the read throws. `/public` is fine, and
`ParticleImage` deliberately sets no `crossOrigin`, since requesting CORS from a host that
does not answer with the header breaks the load outright.

Sampling glow-on-black art by alpha alone gives a blur, not a drawing. The alpha channel
covers the whole silhouette, dark interior included, so most samples land in the fill rather
than the glowing lines — measured on `blockchian/into.png`, 47% of opaque pixels are below
0.1. That is what `lightThreshold` is for: dropping the dark half lets the same particle
budget buy a finer grid over what is left, and the shape comes back.

`lightThreshold` measures the **strongest channel, not Rec.709 luma**, and that is deliberate.
Luma weights red at 21%, so a lit red reads as 0.21 and gets thrown away as shadow — and this
kind of art puts its accents in exactly those saturated highlights. Measured on the same file,
a 0.30 luma cut killed 58% of the lit red pixels. Particle colour is normalized rather than
multiplied — the three channels scale together until the strongest hits a floor — so nothing
sampled disappears against `#050505` and the hue never drifts.

Both thresholds are worth re-measuring when the source image is swapped; the two artworks that
have been through this component wanted 0.45 and 0.22.

`ParticleImage` mounts in `BlockchainSolution/index.tsx` for the intro steps, not inside
`IntroStep`. Two reasons, both general: `IntroStep` enters on `travelSoft`, which applies a
`filter`, and a canvas animating per frame under a filtered ancestor re-rasterizes the whole
subtree at every value of the transition; and in the orchestrator it survives step 1 → 2, so
the particles do not re-gather when the paragraph appears. It listens for the pointer on
`window` rather than on its own canvas — as a backdrop it runs `pointer-events-none`, and a
canvas in that state never receives a `pointermove` of its own.

Video, audio, and images are static files in `public/`, referenced by absolute path. `VideoBackground` forwards a ref so `Dashboard` can drive `onTimeUpdate`. `YoutubeBackground` injects the YouTube IFrame API at runtime for looped background clips.

### Conventions and gotchas

- **React Compiler is enabled.** Calling `Math.random()` (or anything impure) during render is a lint error; generate randomness in `useEffect`/refs or accept a new baseline error.
- Path alias `@/*` → `src/*`. Both alias and relative imports are in use; match the file you're editing.
- Tailwind v4 via PostCSS only — `@import "tailwindcss"` in `src/app/globals.css`, no `tailwind.config`. Fonts (Inter, Outfit) come from `next/font` as CSS variables in `layout.tsx`.
- Static export means external destinations use `window.open` / `<a target="_blank">` (e.g. `storytellingnaia.alvf.net.br`, `alvf.net.br`, LinkedIn). Screens that aren't ready show the inline "Disponível em Breve" overlay in `DashboardToNaia` rather than a route.
- `docs/seo-e-crawlers.md` records why the prerendered HTML contains only 37 characters of
  text (the loading curtain gates everything, and `activeSection` renders one section at a
  time), what that costs with JS-executing vs. non-executing crawlers, and the staged plan.
  Read it before touching metadata, routing, or anything SEO-adjacent.
- `src/components/Galaxy.tsx` (ogl/WebGL starfield) is written and typechecked but **not
  mounted anywhere** — it was tried as the AI section's opening background and pulled back
  out while a different treatment is chosen. It is the only thing importing `ogl`, and
  tree-shaking keeps both out of the bundle while it stays unmounted. Delete both together
  if the idea is dropped for good.
- `src/components/DepthField.tsx` + `.css` are parked the same way — tiled parallax dot
  layers built as the continuous background for the AI section's 21 content steps, then
  unmounted. Those steps currently have only the radial ambient light behind them.
- Unused scaffolding that nothing imports: `src/components/ui/{Button,Card}.tsx`, `src/components/common/{Container,Footer}.tsx`, `src/components/NeuralLink3D.tsx`, `src/components/BinaryRain.tsx`, and `src/lib/gsap.ts` (GSAP + ScrollTrigger are installed and registered but no component uses them). Prefer the framer-motion patterns already in the sections over reviving these.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
