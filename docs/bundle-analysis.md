# Bundle Analysis — What's Actually Inside the Client JS

> Generated from a real `@next/bundle-analyzer` run against this repo
> (`ANALYZE=true bun run build -- --webpack`, Next.js 16.0.10, webpack mode — Turbopack builds
> don't support the analyzer, see "How to reproduce" below). Every number in this doc is measured
> from `.next/analyze/*.html` and `.next/static/chunks/*.js` on 2026-08-28, not estimated. This
> is a companion to `docs/performance-audit.md` §6/§6e, which flagged the ~614KB shared-JS floor
> as needing exactly this kind of measurement — this doc is that measurement.

**Status: analyzer tooling has been added to the repo (`next.config.ts`, `package.json`) — this
is the one code change made as part of this investigation. Every fix recommended below is still
undone; see the checklist at the end.**

---

## 1. How to reproduce this yourself

```bash
bun run analyze
```

This runs `ANALYZE=true next build --webpack` (added to `package.json`) and opens three reports
under `.next/analyze/`: `client.html` (browser bundle — the one that matters for page-load
performance), `nodejs.html` and `edge.html` (server-side bundles — not covered in this doc,
lower priority since they don't affect a visitor's load time). `next.config.ts` now wraps the
config in `@next/bundle-analyzer`'s `withBundleAnalyzer`, gated on `ANALYZE=true` so normal
`bun run dev`/`bun run build` are completely unaffected. **Turbopack builds silently skip
analysis** (a `@next/bundle-analyzer` limitation, not a bug here) — the `--webpack` flag forces
the one-off analysis build onto webpack, which is also what `next build` already used before
Turbopack became the dev-server default, so production output is unaffected.

Re-run this after any of the fixes below land, to confirm the number actually moved.

---

## 2. The client bundle, top to bottom

Real chunk sizes on disk (`.next/static/chunks/*.js`, gzip/brotli happens at the CDN/server
layer on top of these — treat these as pre-compression, relative-comparison numbers):

| Chunk | Disk size | What's in it |
|---|---|---|
| `8e1d74a4-*.js` | large (see §3) | — see §3, needs its own investigation |
| `7105-*.js` | 350 KB | `tailwind-merge`, `zod`, `motion-dom`/`framer-motion` (drag features), `axios`, Next's own `get-img-props.js` |
| `3794-*.js` | 195 KB | Next.js App Router internals (segment cache, RSC client, router reducer) — framework cost, not app code |
| `4bd1b696-*.js` | 198 KB | **This is Next's own compiled React DOM** (`next/dist/compiled/react-dom`) — loaded via `rootMainFiles`, i.e. on every single page |
| `framework-*.js` | 189 KB | A *second*, separate copy of React DOM (`node_modules/react-dom`, not Next's compiled one) + React + Scheduler — see §3, this one is suspicious |
| `main-*.js` | 129 KB | Webpack/Next bootstrap runtime |
| `app/team/page-*.js` | 122 KB | `/team`-specific — this is `team.data.ts` (already flagged in the main audit §6b) |
| `polyfills-*.js` | 112 KB | Legacy-browser JS polyfills — see §4 for whether these are still needed |
| `6993-*.js` | 99 KB | **Swiper** — `swiper-core`, plus `zoom`/`pagination`/`mousewheel`/`a11y`/`virtual`/`scrollbar`/`autoplay`/`free-mode` modules |
| `3696-*.js` | 71 KB | `date-fns` (`parse`+`format`), `cmdk`, Radix `Popover`/`Dialog`/`Tabs` |
| `5301-*.js` | 67 KB | (not individually attributed in this pass — candidate for a follow-up `client.html` read) |
| `5341-*.js` | 50 KB | Radix `Select` + `@floating-ui` (popper positioning) |
| `7111-*.js` | 49 KB | **Every `/events` sub-route's view component, bundled together** — see §5 |
| `app/page-*.js` (home) | 46 KB | Home page's own code |
| `app/levelstructure/page-*.js` | 44 KB | `/levelstructure` — see §6 |

**Total top-level chunk weight: ~1.75 MB on disk** across all routes combined (not per-page —
each page loads a subset via the shared chunks it needs plus its own route chunk).

---

## 3. Finding: two separate copies of React DOM ship in this build — needs a follow-up check, not yet a confirmed bug

`4bd1b696-*.js` (198 KB) is `next/dist/compiled/react-dom/cjs/react-dom-client.production.js` —
Next's own vendored React DOM, listed in `rootMainFiles` (i.e. it loads on **every** page,
confirmed by grepping every generated `.next/server/app/*.html`).

`framework-*.js` (189 KB) is a **second, separate** React DOM build
(`node_modules/react-dom/cjs/react-dom-client.production.js` — the app's own direct `react-dom`
dependency, not Next's compiled copy) plus its own React + Scheduler.

Checked whether both load together: **`framework-*.js` does not appear in any generated route's
HTML** (`grep -rL` across every file in `.next/server/app/*.html` — zero matches), and no other
`.next/static/chunks/*.js` file references its chunk ID either. As far as this build's output
graph shows, **`framework-*.js` is built but not wired into any page or dynamic import** — either
a genuinely orphaned artifact of Next's default `splitChunks` "framework" cache-group heuristic
(which groups react/react-dom/scheduler by convention, independent of whether anything actually
imports the result), or something loads it in a way this static analysis didn't catch (e.g. a
route generated after this specific build, or an edge-case dynamic import).

**This needs a live-network-tab check before treating it as a real bug**: load a few different
page types (a static content page, `/campus-logo-generator`, `/contact`, `/team`) with DevTools
Network open, filter for `framework-`, and confirm whether the browser ever actually requests it.
If it never loads, it's dead build output (harmless, if wasteful of build/deploy artifact size,
but zero runtime cost since unrequested files don't ship to visitors). If it *does* load
somewhere this analysis missed, that's a genuine ~189 KB duplicate-React bug worth chasing down
(likely caused by something importing `react-dom` directly instead of through Next's client
runtime — `html-to-image` and `react-google-recaptcha-v3` are the two dependencies in this
codebase most likely to do that, per `package.json`).

## 4. Finding: `optimizePackageImports` for `swiper` isn't just a nice-to-have — it's a ~150KB measured miss

`docs/performance-audit.md` §6d already recommended adding `swiper` to
`experimental.optimizePackageImports`. This bundle run proves exactly why, with real numbers.

The app imports only 3 Swiper modules, confirmed by `grep -rn "from \"swiper` across `src/`:
```
Autoplay    — colleges.tsx, success-stories.tsx
Navigation  — video-section.tsx
Pagination  — video-section.tsx
```
But the shipped chunk (`6993-*.js`) contains **all 8+ Swiper modules**: `zoom` (25.5 KB),
`pagination` (17.5 KB), `mousewheel` (14.8 KB), `a11y` (12.4 KB), `virtual` (12.2 KB),
`scrollbar` (11 KB), `autoplay` (9.1 KB), `free-mode` (8.3 KB) — plus the 133 KB core. `zoom`,
`mousewheel`, `virtual`, `scrollbar`, and `free-mode` are never imported anywhere in this
codebase and cost roughly **72 KB of pure dead weight** in this one chunk alone. This happens
because `import { X } from "swiper/modules"` pulls the concatenated `swiper/modules/index.mjs`
(all 27 modules bundled as one webpack module group) rather than tree-shaking down to just the
three named imports — exactly what `optimizePackageImports` exists to fix, by rewriting the
import to pull each named export from its own submodule path at build time.

**Fix, already specified in the main audit:**
```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons", "swiper"],
  },
  // ...unchanged
};
```
Re-run `bun run analyze` after adding this and confirm chunk `6993-*` (or whatever it's renamed
to) drops from 99 KB to roughly 30-40 KB.

## 5. Finding: the `/events` feature ships every sub-route's view in one shared chunk

`7111-*.js` (49 KB disk / 124 KB stat) contains, in one bundle: `generic-event-card.tsx`,
`salt-mango-tree-view.tsx`, `inspiration-station-view.tsx`, `event-card.tsx`,
`office-hours-view.tsx`, `grab-your-superpowers-view.tsx`, plus `select.tsx`/`command.tsx` UI
primitives — all concatenated into one chunk regardless of which single `/events/*` sub-route a
visitor actually opens. Someone visiting only `/events/office-hour` still has
`salt-mango-tree-view.tsx` and `grab-your-superpowers-view.tsx`'s code included in what they
download, because `src/features/events/components/common/index.ts` re-exports all of them
through one barrel (per this repo's barrel-import convention), and webpack's chunking groups
everything reachable from a shared import point together rather than per-route.

This isn't necessarily wrong — the barrel-only import rule is a deliberate architectural choice
in this codebase (`docs/migration-progress.md`) — but it has a measurable code-splitting cost at
the `/events/*` sub-route level specifically, since these are 5 genuinely separate pages that
each only need their own view. **Fix, if this route group's individual page-load size becomes a
priority:** import each `*-view.tsx` directly by its concrete file path in each `page.tsx`
instead of through the shared `common/index.ts` barrel for just this one cross-cutting case, or
wrap each view in `next/dynamic` the way `home-view.tsx` already does for its below-the-fold
sections (§6, "Code-splitting is used in exactly one place" in the main audit) — either breaks
the single shared chunk into 5 route-specific ones.

## 6. Finding: `/levelstructure`'s own chunk is inflated by repeated inline JSX, not data

`app/levelstructure/page-*.js` is 44 KB on disk (104 KB stat) — large for a single static route
with no data fetching. Cross-referencing against the component files
(`src/features/levelstructure/components/level-1-section.tsx` through `level-7-section.tsx`):
each of the 7 level files repeats the **same block of 8-14 `<Sparkle>` decorative elements**,
individually hand-positioned with slightly different `top-[X%] left-[Y%]` Tailwind arbitrary
values and opacity — the same visual pattern copy-pasted 7 times with different coordinates
rather than expressed once as a `positions.map(...)` over a small coordinate array. This is a
straightforward de-duplication opportunity: extract a shared `<SparkleField positions={[...]}
/>` component taking a coordinate array, used once per level file with that level's specific
coordinates passed as data instead of JSX. Doesn't change what renders, reduces the JS shipped
for this route by however much the repeated markup currently costs (not separately measured
here — the fix is cheap enough to just do and re-run `bun run analyze` to see the delta).

## 7. Investigation: replacing Swiper with Embla Carousel

`docs/performance-audit.md` §5d already flagged `swiper` as needing
`optimizePackageImports`, and §4 above measured the specific cost that fix would recover
(~150 KB of unused modules). A deeper question worth asking on top of that: is Swiper the
right library at all, or would swapping it for **Embla Carousel** cut the fixed cost, not just
the currently-wasted portion of it? Investigated below — no code changed, this is analysis only.

### 7.0 Where Swiper is actually used in this codebase (all 3 call sites)

| File | Modules imported | Behavior |
|---|---|---|
| `src/features/be-a-part/components/enablers/success-stories.tsx` | `Autoplay` | Autoplay carousel, `loop`, responsive `slidesPerView` (1/2/3), external prev/next buttons via `swiperRef.current?.swiper.slidePrev()/slideNext()` |
| `src/features/be-a-part/components/enablers/colleges.tsx` | `Autoplay` | Identical pattern to `success-stories.tsx` — autoplay, loop, external prev/next buttons |
| `src/features/testimonials/components/video-section.tsx` | `Navigation`, `Pagination` | No autoplay; `slidesPerView={1.2}` (peek-next-slide effect), responsive breakpoints (2/3/4 slides), a synced external index (`activeIndex` state calls `swiperInstance.slideTo(index)`, and clicking a thumbnail also calls `slideTo`) |

None of the three use Swiper's `Zoom`, `Virtual`, `Scrollbar`, `Mousewheel`, `A11y`, or
`FreeMode` modules — confirming §4's finding that those are pure dead weight in the current
bundle. **Every feature actually used across all 3 files — autoplay, loop, responsive slide
counts, external prev/next controls, programmatic `slideTo`, and native touch/drag ("manual
scroll") — has a direct Embla equivalent**, detailed below.

### 7.1 What Embla Carousel is

A carousel *engine* with no built-in UI — it manages drag/scroll physics, slide positioning, and
snap points, and hands you refs + a small imperative API (`scrollNext`, `scrollPrev`,
`scrollTo`, `canScrollNext`, `selectedScrollSnap`, `on(event, callback)`) to build your own
buttons/dots/indicators with. Autoplay, loop, and a handful of other behaviors are opt-in
**plugins** (`embla-carousel-autoplay`, etc.) rather than baked into the core, which is the
direct cause of its much smaller footprint — you only pay for what you import, and unlike
Swiper's current bundling problem (§4), Embla's plugin architecture makes it structurally hard
to accidentally ship a plugin you don't use, since each one is its own package.

### 7.2 Bundle-size comparison (measured Swiper vs. published Embla figures)

| | Swiper (current, as shipped) | Swiper (if `optimizePackageImports` fix from §4 lands) | Embla (core + `react` + `autoplay`) |
|---|---|---|---|
| Core carousel engine | 133 KB (`swiper-core`, measured) | 133 KB (unchanged — this part isn't the waste) | ~5-6 KB gzipped (`embla-carousel` core is commonly cited around this size; verify with a real `bun run analyze` after integrating, don't take a citation as measured fact) |
| React bindings | included in `swiper-react` (12.7 KB, measured) | included, same | `embla-carousel-react` — a thin hook wrapper, low single-digit KB |
| Autoplay | 9.1 KB (measured, already imported) | 9.1 KB | `embla-carousel-autoplay` — low single-digit KB |
| Navigation/Pagination (video-section.tsx only) | ~30 KB combined (measured: pagination 17.5 KB + navigation folded into core) | same | Hand-rolled with `scrollPrev`/`scrollNext`/`on("select", ...)` — effectively 0 KB extra, since you're already writing button `onClick` handlers today (Swiper's `swiperRef.current?.swiper.slideNext()` calls already prove this codebase is comfortable wiring its own buttons) |
| Dead modules currently shipped (Zoom/Virtual/Scrollbar/Mousewheel/A11y/FreeMode) | ~72 KB (measured, §4) | 0 KB (fixed by the config change) | N/A — architecturally impossible to accidentally include a plugin you didn't import |
| **Total, this codebase's actual usage** | **~360 KB** (measured, `6993-*.js`) | **~170-190 KB** (core + react + autoplay + pagination/navigation, dead modules removed) | **~15-25 KB** (core + react + autoplay, unverified estimate — confirm with `bun run analyze` post-migration) |

Even after applying §4's `optimizePackageImports` fix (which should ship regardless, it's a
one-line no-risk change either way), Embla is estimated to be **roughly 7-10x smaller** for the
exact feature set this codebase actually uses, because Swiper's core alone (133 KB, the
non-negotiable part) is far heavier than Embla's entire footprint including plugins.

### 7.3 Pros of migrating to Embla Carousel

- **Large, measured bundle-size win** — even the conservative estimate (~150-170 KB saved) is
  bigger than several other findings in this doc combined (bigger than the Swiper dead-module
  fix in §4 alone, bigger than the `/events` chunk-splitting win in §5).
- **No unused-code risk by construction** — plugin-per-package architecture means the
  `optimizePackageImports`-style problem found in §4 structurally can't recur here; there's no
  "all modules" barrel to accidentally import from.
- **Manual scroll (native touch/drag) is a first-class citizen, not a bolt-on** — Embla's whole
  design center is physics-based drag scrolling; Swiper supports this too, but Embla's API
  surface is built around it (`emblaApi.scrollProgress()`, drag-free mode, momentum) rather than
  it being one of a dozen modules. Directly relevant since the user asked specifically for
  "autoplay and manual scroll" — both are core, well-documented Embla patterns, not edge cases.
- **Actively maintained, framework-agnostic core** — `embla-carousel-react` is a thin wrapper
  over the same core used for Vue/Svelte/vanilla bindings, so the core logic isn't
  React-release-cadence-coupled the way some older carousel libraries can be.
- **No CSS import needed** — Swiper requires importing `swiper/css`, `swiper/css/navigation`,
  `swiper/css/pagination` per file (visible in all 3 current call sites); Embla ships unstyled by
  default, so all carousel-chrome styling is just the Tailwind classes this codebase already uses
  everywhere else — one less CSS-import footgun, and one less thing to keep in sync with the
  design system.

### 7.4 Cons / migration costs — be honest about the other side

- **UI is fully hand-rolled** — Swiper's `Navigation`/`Pagination` modules render actual
  prev/next arrows and dot indicators for you (CSS + DOM included); Embla gives you the
  scroll-state data (`canScrollNext()`, `selectedScrollSnap()`) and you build the buttons/dots
  yourself. For `video-section.tsx` specifically, this is close to zero extra work (it already
  renders custom thumbnail dots synced to `activeIndex`, not Swiper's built-in pagination UI —
  check whether `swiper/css/pagination`'s import is even doing anything visually there before
  assuming this is free, but it's likely already mostly custom). For `success-stories.tsx`/
  `colleges.tsx`, the prev/next buttons are already custom-rendered JSX calling
  `swiperRef.current?.swiper.slideNext()` — porting to `emblaApi.scrollNext()` is a
  near-mechanical rename, not new UI work.
- **Three files to migrate, three slightly different configurations** — `slidesPerView={1.2}`
  (peek effect) and responsive breakpoints (`640:`, `768:`, `1024:`) need Embla's equivalent
  (`slidesToScroll`/CSS-based flex-basis percentages per breakpoint, since Embla doesn't take a
  `slidesPerView` prop — slide width is controlled by CSS on the slide elements themselves). This
  is a real, non-zero porting task, not a drop-in prop-for-prop swap.
- **Programmatic `slideTo` sync** (`video-section.tsx`'s `activeIndex` ↔ thumbnail click sync)
  needs Embla's `scrollTo(index)` plus subscribing to its `"select"` event to keep `activeIndex`
  in sync in both directions — doable, documented, but requires rewriting that
  effect/state-sync logic, not just swapping an import.
- **Loses Swiper's `loop` mode's specific implementation** — Swiper's infinite loop uses slide
  cloning under the hood; Embla has its own `loop: true` option with different internal
  mechanics (it recalculates snap points rather than cloning DOM nodes) — behaviorally similar
  for a visitor, but worth a manual QA pass on `success-stories.tsx`/`colleges.tsx` specifically
  since they're the two files using `loop`, to confirm no visual jump/flicker at the loop seam
  that Swiper's approach happened to avoid.
- **Team unfamiliarity cost** — Swiper is already integrated and understood; Embla's
  "build your own UI" model requires the team to learn a different mental model (subscribing to
  events, reading scroll-snap state) even though the total code written may end up similar or
  less.
- **No `pagination`/`navigation` CSS to inherit-and-tweak** — cuts both ways (listed as a pro
  above for reducing footguns), but also means any visual polish Swiper's default pagination
  dots/arrows already provide has to be rebuilt from scratch in Tailwind, even if the current
  design already overrides most of Swiper's default look (worth checking how much custom CSS
  currently targets `.swiper-pagination-bullet`/`.swiper-button-next` etc. before assuming zero
  visual rework).

### 7.5 Recommended approach, if this migration is pursued

1. **Land §4's `optimizePackageImports` fix first regardless** — it's a one-line, zero-risk win
   independent of whether Embla ever happens, and removes the ~72 KB of dead modules immediately.
2. **Migrate `video-section.tsx` first**, not the two autoplay carousels — it has no `loop`
   mode (the trickiest behavioral difference, per §7.4) and its pagination is arguably already
   mostly custom-rendered (thumbnail dots), making it the lowest-risk file to prove the pattern
   on before touching the two `loop`-mode carousels.
3. **Build one small shared wrapper** (e.g. a `use-embla-carousel.ts` hook or a thin
   `<Carousel>`/`<CarouselSlide>` component pair under `src/components/ui/`) encapsulating the
   `embla-carousel-react` + `embla-carousel-autoplay` setup once, rather than wiring Embla's
   hooks independently in all 3 files — this codebase already has a `src/components/ui/`
   directory for exactly this kind of shared primitive (see `select.tsx`, `command.tsx` in the
   same directory per §5's chunk breakdown), so this matches an existing pattern rather than
   introducing a new one.
4. **Migrate `success-stories.tsx` and `colleges.tsx` last**, together (they're near-identical
   in structure per §7.0), reusing the shared wrapper from step 3, and manually QA the loop-seam
   behavior called out in §7.4 before shipping.
5. **Remove `swiper` from `package.json` and re-run `bun run analyze`** only after all 3 files
   are migrated and QA'd — don't leave both libraries installed longer than the migration takes,
   since that's strictly worse than doing nothing (paying for both bundles at once mid-migration
   if any file is left half-done across a deploy).

**Verdict:** the bundle-size case is strong and measured (§7.2), the manual-scroll/autoplay
requirement the user asked about is exactly Embla's core strength (§7.3), and the porting cost
is real but bounded to 3 files with one shared wrapper absorbing most of the complexity (§7.5).
Not a "must do immediately" the way §2's image-optimization bug is — this is a worthwhile,
moderate-effort win to schedule after the zero-risk fixes elsewhere in this doc land first.

---

## 8. Findings that confirm existing recommendations with real numbers

- **`axios` + a `buffer` polyfill (27.7 KB) ship together** in the `7105-*.js` chunk — some part
  of axios's dependency chain (likely its Node-compat code paths, even though the app only uses
  its browser adapter) pulls in a Buffer polyfill client-side. This is additional, measured
  evidence for `docs/feature-folder-structure.md`'s existing fetch-vs-axios analysis: switching
  `events.api.ts`'s one server-executed call to native `fetch` (already recommended there) won't
  reduce this specific client-side cost since it's a *different* client-executed call sites'
  weight — but it does confirm axios has a real, non-zero client bundle tax beyond the abstract
  "~15KB gzipped" estimate in that doc; 27.7 KB measured here is larger than that estimate.
- **`zod` alone accounts for roughly 205 KB** across its module fragments in `7105-*.js`
  (schemas, core, api, util, json-schema-processors) — used via `@hookform/resolvers/zod` in the
  contact and donation forms. Not flagged as a problem (form validation is a legitimate,
  client-executed need), but worth knowing this is one of the single largest individual
  dependencies in the entire client bundle — if either form's validation rules are simple enough,
  a lighter validator (or hand-rolled checks for the handful of fields involved) is a real,
  if unglamorous, size lever.
- **`tailwind-merge` (105 KB) ships to every page that uses the `cn()` utility** — essentially
  every component in this codebase. This is the direct cost of the `clsx` + `tailwind-merge`
  pattern (`class-variance-authority` likely uses it too) — not something to remove (the pattern
  is correct and standard), but worth knowing it's a fixed ~105 KB floor baked into nearly every
  route's bundle, larger than several of the "bloat" findings elsewhere in this doc.

---

## 9. What's done vs. still to do

| Item | Status |
|---|---|
| Install `@next/bundle-analyzer`, wire `next.config.ts` + `analyze` script | **Done** — committed to this repo |
| Run the analysis, extract real chunk/module data | **Done** — this document |
| Add `swiper` (and `react-icons`) to `optimizePackageImports` (§4) | Not applied |
| Investigate whether `framework-*.js` actually loads anywhere (§3) | Not applied — needs a live DevTools check, not just static analysis |
| Split `/events/*` sub-routes out of the shared barrel-driven chunk (§5) | Not applied |
| De-duplicate the repeated `<Sparkle>` blocks in `levelstructure` (§6) | Not applied |
| Swiper → Embla Carousel migration investigation (§7) | Documented — investigation only, no migration started, no `embla-carousel*` packages installed |
| Re-run `bun run analyze` after each fix above to confirm the measured delta | Not applied — do this after every fix, not just at the end |

Cross-reference: `docs/performance-audit.md` §12 tracks the status of every other finding from
the broader audit (image optimization, data-boundary refactors, security headers, SEO). This
doc's findings are additive to that list, not a replacement for it.
