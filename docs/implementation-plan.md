# Implementation Plan — Performance, SEO & Codebase Health

> Execution-ready synthesis of three prior audit docs. Not new investigation — every item below
> traces to an exact `file:line` finding already documented elsewhere. Read this doc to execute;
> read the source docs for the full reasoning/evidence behind each fix.
>
> **Sources:**
> - [`docs/performance-audit.md`](./performance-audit.md) — image bug, bundle/client-boundary
>   audit, rendering/CWV audit, security headers, Lighthouse checklist, live Lighthouse baseline.
> - [`docs/bundle-analysis.md`](./bundle-analysis.md) — real `@next/bundle-analyzer` run
>   (`ANALYZE=true bun run build -- --webpack`, Next.js 16.0.10, measured 2026-08-28), Swiper/
>   react-icons investigations.
> - [`docs/feature-folder-structure.md`](./feature-folder-structure.md) — SEO canonical-URL bug,
>   `constructMetadata()` rollout, sitemap/robots, JSON-LD, fetch-vs-axios analysis.
>
> **Measurement basis:** a real bundle-analyzer run (not estimated) plus a live Lighthouse run
> against `mulearnhome-weld.vercel.app` on 2026-08-28 (Moto G Power emulation, Slow 4G):
> **Performance 91, Accessibility 96, Best Practices 100, SEO 100, Agentic Browsing 1/2.**
> Every number cited below is measured unless explicitly marked "estimate."

---

Everything below is **documented, not applied**.

---

## Phase 2 — Client bundle / data-boundary fixes

- [ ] **Stop shipping `team.data.ts` (177KB) / `enablers.data.ts` (46KB) as client JS.**
      `team-view.tsx` has `"use client"` and imports `team.data.ts` directly, so the entire
      177,156-byte file is bundled into `/team`'s browser payload (confirmed: the string
      `"Deepu S Nath"` appears in the compiled client chunk on disk). `enablers.data.ts` is
      imported into 3 client files under `be-a-part/components/enablers/`. Fix: use the
      children-slot Server/Client pattern — render the data server-side, pass already-rendered
      React elements as `children`/props into a thin Client Component (a `TeamYearSwitcher` shell
      holding only `useState` for the year toggle; a `renderTeamGrid()` server-side helper does
      the actual mapping). Full worked example with both files' proposed shape already drafted.
      *(`performance-audit.md` §5b-c)*
- [ ] **Paginate `/team`** the way `mission-and-growth.tsx` already does — `useState(12)` initial
      `displayedCount`, `.slice(0, displayedCount)`, "Load more" increments by 18. `team-view.tsx`
      currently maps every member of every team/subteam unbounded (lines 65/80/91/109) — reuse
      the proven pattern instead of inventing a new one, independent of whether the Server/Client
      split above lands first. *(`performance-audit.md` §6c)*
- [ ] **`next.config.ts` — two zero-risk one-line additions**, batch together:
      - `experimental.optimizePackageImports: ["react-icons", "swiper"]` — measured ~150KB of
        dead Swiper modules (`Zoom`/`Virtual`/`Scrollbar`/`Mousewheel`/`A11y`/`FreeMode` — none
        imported anywhere in this codebase, confirmed via `grep -rn "from \"swiper"`) currently
        ship because `import { X } from "swiper/modules"` pulls the full concatenated barrel
        instead of tree-shaking to the 3 modules actually used (`Autoplay`, `Navigation`,
        `Pagination`). *(`bundle-analysis.md` §4, §9; `performance-audit.md` §5d)*
      - `poweredByHeader: false` — removes the `X-Powered-By: Next.js` info-disclosure header.
        *(`performance-audit.md` §9a.4)*
- [ ] **Split `/events/*` sub-routes out of the shared barrel chunk.** `7111-*.js` (49KB disk)
      bundles every sub-route's view together (`generic-event-card.tsx`,
      `salt-mango-tree-view.tsx`, `inspiration-station-view.tsx`, `event-card.tsx`,
      `office-hours-view.tsx`, `grab-your-superpowers-view.tsx`) because
      `src/features/events/components/common/index.ts` re-exports all of them through one barrel.
      A visitor to any single `/events/*` sub-route downloads all 5 views' code. Fix: for this one
      cross-cutting case, import each `*-view.tsx` directly by file path in each `page.tsx`
      instead of through the shared barrel, or wrap each in `next/dynamic` (the pattern
      `home-view.tsx` already uses for its below-the-fold sections). *(`bundle-analysis.md` §5)*
- [ ] **De-duplicate `<Sparkle>` blocks in `/levelstructure`.** Each of `level-1-section.tsx`
      through `level-7-section.tsx` repeats the same 8-14-element decorative block with
      hand-positioned coordinates 7 times. Extract a shared `<SparkleField positions={[...]} />`
      taking a coordinate array as data; call once per level file with that level's coordinates.
      No visual change. *(`bundle-analysis.md` §6)*

**Acceptance criteria:** re-run `bun run analyze` after each item; confirm `6993-*.js` (Swiper)
drops from 99KB toward 30-40KB; confirm `/team`'s client chunk shrinks substantially and no longer
contains team-member name strings; confirm `/events/*` sub-routes each ship only their own view.

---

## Manual-verification-only items

These **cannot** be closed by code review or a source-level fix — each requires a live
Lighthouse/DevTools/axe pass against rendered pages. Call this out explicitly so it isn't mistaken
for something skippable once the phases above ship:

- `color-contrast`, `target-size` (tap target ≥24×24px), `font-size` — computed against rendered
  pixels, not markup.
- `link-text` — spot-check CTA anchor copy for "click here"/"read more" patterns.
- `no-vulnerable-libraries` — run `bun audit` / `npm audit` / Snyk separately; not covered by
  source-level review.
- `deprecations` / runtime console errors — one full click-through per page template with
  DevTools console open.
- Production source-map configuration — check build config directly; flagged live by Lighthouse
  ("Missing source maps for large first-party JavaScript") but not previously documented.
- Localize the exact elements behind Lighthouse's live "Buttons do not have an accessible name"
  and "Elements use prohibited ARIA attributes" findings — broader than the 9 known lint warnings
  in Phase 6; needs a live inspector pass to get a `file:line` fix.

*(`performance-audit.md` §10 9b-9c, §11b)*

---

## Verification

- **After every bundle-affecting fix** (Phase 2's config/splitting changes, Phase 7's
  Swiper/react-icons work if pursued): re-run `bun run analyze` and confirm the measured
  delta against the baseline numbers in `bundle-analysis.md`. Don't assume — measure.
- **After Phases 2-5 land**: a fresh live Lighthouse run (mobile + desktop) against representative
  page templates (home, a static content page, `/events`, `/team`, `/contact`) is the final gate —
  this is the only way to confirm the manual-verification-only items above, and to confirm the
  cumulative score movement from the 91/96/100/100 baseline in §11.
- **Execution order reference:** `performance-audit.md` §9e sequences the remaining fixes
  (security headers → accessibility mechanical fixes → Suspense/pagination refactors → manual
  verification last) so no file needs to be opened twice. The phase numbering in this doc
  mirrors that order.
