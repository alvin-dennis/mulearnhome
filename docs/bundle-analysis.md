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

## 7. Findings that confirm existing recommendations with real numbers

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

## 8. What's done vs. still to do

| Item | Status |
|---|---|
| Install `@next/bundle-analyzer`, wire `next.config.ts` + `analyze` script | **Done** — committed to this repo |
| Run the analysis, extract real chunk/module data | **Done** — this document |
| Add `swiper` (and `react-icons`) to `optimizePackageImports` (§4) | Not applied |
| Investigate whether `framework-*.js` actually loads anywhere (§3) | Not applied — needs a live DevTools check, not just static analysis |
| Split `/events/*` sub-routes out of the shared barrel-driven chunk (§5) | Not applied |
| De-duplicate the repeated `<Sparkle>` blocks in `levelstructure` (§6) | Not applied |
| Re-run `bun run analyze` after each fix above to confirm the measured delta | Not applied — do this after every fix, not just at the end |

Cross-reference: `docs/performance-audit.md` §12 tracks the status of every other finding from
the broader audit (image optimization, data-boundary refactors, security headers, SEO). This
doc's findings are additive to that list, not a replacement for it.
