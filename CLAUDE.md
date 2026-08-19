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

A single-page Portuguese-language (pt-BR) marketing site for ALVF Consultoria, built as a Next.js App Router app that is **statically exported** (`output: 'export'`, `images.unoptimized`, React Compiler on). No server components, no API routes, no dynamic routes — every file under `src` is `"use client"`.

### One route, one state machine

`src/app/page.tsx` is the whole site. It holds a single `activeSection` union-typed string and renders every screen as a conditional block inside one `<AnimatePresence>`. There is no router; navigation is state transitions plus framer-motion enter/exit.

The flow is always:

```
Hero --onTransitionComplete--> Dashboard --onNavigateToX--> XTransition --onComplete--> XSolution --onBack--> Dashboard
```

Adding a screen means three edits in `page.tsx`: extend the `activeSection` union, add the `<motion.div>` block, wire the callback from the section that reaches it. `LoadingCurtain` gates everything until `isAppLoading` flips; `BackgroundMusic` sits outside the switch and persists.

`Dashboard` (`src/sections/Dashboard.tsx`) is the hub: it waits for its brain video to reach its final frame (`isVideoPaused`), then springs 8 `DashboardNode` clouds out from center to hardcoded mobile/tablet/desktop percentage positions. Clicking one plays `enter-effect.mp3`, zooms the node, and fires `onNavigate` after a 1300ms delay that must stay in sync with the zoom animation. `DashboardToNaia` is a second, nested hub reached from the NAIA node.

### Sections are step machines

Each `*Solution` section and each `*Transition` component is driven by a numeric `step` counter advanced by `useStepNavigation` (`src/hooks/useStepNavigation.ts`) — global wheel + touch-swipe listeners with a cooldown (usually 1200ms). Scrolling past the last step calls `onBack()` / `onComplete()`, scrolling back below step 1 is clamped.

Step ranges map to content two ways:
- **Extracted sub-components** — `BlockchainSolution` (15 steps) delegates to `src/components/blockchain/*Step.tsx`.
- **Inline blocks** — `AISolution` (21 steps), `HeritageSolution`, etc. keep the JSX in the section file behind `{step === n && ...}` guards inside `<AnimatePresence mode="wait">`.

`useStepNavigation` deliberately walks up the DOM (`isAtScrollBoundary`) and refuses to advance while the event target sits inside a scrollable element that hasn't hit its top/bottom. This is what makes mobile work: content too tall for a phone gets wrapped in `MobileScrollWrapper`, which becomes an internal scroller below 768px and a passthrough above it. It lives in `src/components/blockchain/` for historical reasons but is used by most sections — don't assume that directory is blockchain-only.

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

`three` is used imperatively (no react-three-fiber): `NeuralConnectionSystem` renders an orthographic overlay of bezier "bubble filaments" from the dashboard center to each node's percentage position, and `ParticlesBackground` is the ambient layer nearly every screen mounts. Both build the scene in a `useEffect` and must dispose/remove the canvas in the cleanup.

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
- Unused scaffolding that nothing imports: `src/components/ui/{Button,Card}.tsx`, `src/components/common/{Container,Footer}.tsx`, `src/components/NeuralLink3D.tsx`, `src/components/blockchain/BinaryRain.tsx`, and `src/lib/gsap.ts` (GSAP + ScrollTrigger are installed and registered but no component uses them). Prefer the framer-motion patterns already in the sections over reviving these.
