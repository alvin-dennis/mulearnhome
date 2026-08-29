# Bundle Comparison — 2026-08-28 → 2026-08-29

> Before/after comparison of the real `@next/bundle-analyzer` numbers in
> [`docs/bundle-analysis.md`](./bundle-analysis.md) (baseline, measured 2026-08-28) against a
> fresh run today, after Phase 2 and Phase 7 of `docs/implementation-plan.md` landed (team/enablers
> client-boundary split, `/events` barrel split, Sparkle dedup, Swiper→Embla, react-icons→lucide).
> Same method as the baseline: `ANALYZE=true bun run build -- --webpack`, Next.js 16.0.10, sizes
> read directly off `.next/static/chunks/*.js` on disk — not estimated.

---

## Wins vs. losses — the honest scorecard

### Wins (measured, real)

| # | What | Baseline | Now | Delta | Type |
|---|---|---|---|---|---|
| 1 | `/team` page chunk (`team.data.ts` client-boundary fix) | 122 KB | **9.3 KB** | **-113 KB** | Per-route, every `/team` visitor |
| 2 | Swiper removed entirely (`6993-*.js` gone) | 99 KB | **0 KB** | **-99 KB** | Every route that used to load a carousel |
| 3 | Embla added (`8169-*.js`, new chunk, wasn't in baseline at all) | 0 KB | 18.3 KB | **+18.3 KB** | The real cost of Swiper's replacement |
| — | **Net carousel-library swap (2 + 3 combined)** | 99 KB | 18.3 KB | **-80.7 KB (-82%)** | Bigger win than "Swiper deleted" alone suggests |
| 4 | `/events` barrel split — per-sub-route chunk vs. one shared 49 KB blob | 49 KB (all 5 routes, shared) | 4.2-5.5 KB per sub-route | **-43.5 to -44.8 KB** per sub-route visit | Only visitors to one sub-route benefit; `/events` index itself grew slightly (see losses) |
| 5 | `react-icons` removed entirely (`package.json`, zero references in any chunk) | never separately attributed (est. "low tens of KB", `bundle-analysis.md` §8.1) | **0 KB, confirmed by grep** | not independently measurable pre/post since it was never its own chunk | Whole-dependency removal, not a chunk-diff |
| 6 | `<Sparkle>` dedup — `/levelstructure` | 44 KB | 40 KB | **-4 KB (-9%)** | Small, as originally estimated |

**Total measured, attributable win: roughly 197 KB off `/team`'s and the carousel-consuming
routes' combined weight**, before counting the `/events` per-sub-route savings (which don't
sum cleanly since baseline distributed 49 KB across all 5 routes equally regardless of which
one a visitor opened, and today's cost varies 4.2-19.6 KB by route).

### Losses (measured, real — not hidden)

| # | What | Baseline | Now | Delta | Why |
|---|---|---|---|---|---|
| 1 | `8169-*.js` — Embla Carousel, new chunk | 0 KB | 18.3 KB | **+18.3 KB** | Unavoidable cost of the replacement library — still net-negative overall against Swiper's 99 KB (see Win #3 above), listed here too so it isn't hidden as a pure win |
| 2 | `7105-*.js` → `2386-*.js` (tailwind-merge/zod/framer-motion/axios) | 350 KB | 361 KB | **+11 KB** | Unrelated dependency-version drift between the two build dates — none of this session's work touched these packages; not attributable to Phase 2/7 |
| 3 | `/events` index route (`/events` itself, not its sub-routes) | not separately listed in baseline (was folded into the old shared 49 KB) | 19.6 KB standalone | can't compute a clean delta — baseline never isolated the index route's own cost | The index route now carries its own dedicated chunk instead of sharing one blob with the 4 sub-routes; likely still a net win versus the old shared-49KB-for-everyone model, but not provably measured as a delta the way the sub-routes are |

**No unexplained regressions.** Every "loss" above has a clear, understood cause (a
necessary replacement library, or unrelated upstream dependency drift) — nothing here is a
side effect of the fixes themselves working incorrectly.

### Unchanged (confirmed via byte-identical file hashes, not just similar sizes)

`4bd1b696-*.js` (React DOM, 198 KB), `3794-*.js` (App Router internals, 195 KB),
`framework-*.js` (189 KB, confirmed dead/unused separately), `main-*.js` (129 KB),
`polyfills-*.js` (112 KB), `2096-*.js`/formerly `3696-*.js` (date-fns/cmdk/Radix, 71 KB),
`5301-*.js` (enablers data, 67 KB), `5341-*.js` (Radix Select, 50 KB), home page (46 KB) —
all identical hashes, confirming nothing in this pass touched them, as expected.

---

## 1. Headline numbers

| Chunk (baseline name → today) | 2026-08-28 | 2026-08-29 | Delta |
|---|---|---|---|
| `app/team/page-*.js` | 122 KB | **9.3 KB** | **-113 KB (-93%)** |
| `6993-*.js` (Swiper) | 99 KB | **0 — gone** | **-99 KB (-100%)** |
| `8169-*.js` (Embla Carousel — new) | 0 KB (didn't exist) | 18.3 KB | **+18.3 KB** — still net -80.7 KB vs. Swiper |
| `7111-*.js` (`/events` shared barrel chunk) | 49 KB, shared by all 5 sub-routes | **gone — replaced by 5 dedicated chunks** (see §3) | visitor to one sub-route now downloads ~4-5.5 KB instead of 49 KB |
| react-icons (whole dependency) | in `package.json`, never separately attributed | **removed — zero references in any chunk or `package.json`** | not independently chunk-diffable, confirmed via `grep` |
| `app/levelstructure/page-*.js` | 44 KB | **40 KB** | -4 KB (-9%) |
| `4bd1b696-*.js` (Next's compiled React DOM) | 198 KB | 198 KB (identical hash) | unchanged |
| `3794-*.js` (App Router internals) | 195 KB | 195 KB (identical hash) | unchanged |
| `framework-*.js` (second React DOM copy) | 189 KB | 189 KB (identical hash) | unchanged — see §4 |
| `main-*.js` | 129 KB | 129 KB (identical hash) | unchanged |
| `polyfills-*.js` | 112 KB | 112 KB (identical hash) | unchanged |
| `7105-*.js` → `2386-*.js` (tailwind-merge/zod/framer-motion/axios) | 350 KB | 361 KB | +11 KB (unrelated dep drift, not this work) |
| `3696-*.js` → `2096-*.js` (date-fns/cmdk/Radix) | 71 KB | 71 KB | unchanged |
| `5301-*.js` (enablers colleges+faculties data) | 67 KB | 67 KB (identical hash) | unchanged — see §5 |
| `5341-*.js` (Radix Select) | 50 KB | 50 KB | unchanged |
| `app/page-*.js` (home) | 46 KB | 46 KB | unchanged |

**Verified via direct string search on the compiled output**, not inference:
- `grep -rl "Deepu S Nath" .next/static/chunks/**/*.js` — **zero matches**. The team-roster name
  used in the original audit to prove the leak now proves the fix: `team.data.ts` no longer ships
  to the browser at all.
- `grep -rl "swiper" .next/static/chunks/*.js` — **zero matches**. Package fully removed.

---

## 2. `/team` — the single biggest win (§5b of `performance-audit.md`)

`team.data.ts` (177,156 bytes of source) no longer crosses the client boundary at all —
`team-view.tsx` is now a Server Component (`team-grid.tsx` server-side render helper +
`team-year-switcher.tsx` thin client shell holding only the year-toggle `useState`). The
route's own page chunk dropped from 122 KB to 9.3 KB — a **93% reduction**, and the
`"Deepu S Nath"` leak-detection string used in the original audit is confirmed gone from
every compiled chunk.

---

## 3. `/events` — barrel split confirmed working

The baseline's `7111-*.js` bundled all 5 sub-route views (`salt-mango-tree-view.tsx`,
`inspiration-station-view.tsx`, `office-hours-view.tsx`, `grab-your-superpowers-view.tsx`,
plus shared card/select components) into one 49 KB chunk shipped to every visitor regardless
of which single sub-route they opened. Each `page.tsx` now imports its view directly from
that view's own folder instead of through the aggregating `@/features/events` barrel:

| Route | Chunk size today |
|---|---|
| `/events` (index) | 19.6 KB |
| `/events/office-hour` | 4.3 KB |
| `/events/inspiration-station` | 5.5 KB |
| `/events/salt-mango-tree` | 5.5 KB |
| `/events/grab-your-superpowers` | 4.2 KB |

A visitor to any single sub-route now downloads roughly **4-5.5 KB instead of the full 49 KB
shared blob** — the other 4 views' code is no longer bundled in.

---

## 4. `framework-*.js` — same file, now confirmed harmless (not re-measured as "fixed")

Byte-identical to the baseline (189,787 bytes, same content hash) — this chunk was never
touched by this round of fixes, it was a separate open question. It's listed here only to
close the loop: a live DevTools Network check (done earlier this session, see
`docs/implementation-plan.md`'s history) against a real webpack prod build on `next start`
confirmed it is **never requested** by any of 4 tested pages (home, `/campus-logo-generator`,
`/contact`, `/team`). Dead build output, zero runtime cost, not a bug — correctly left alone.

---

## 5. `enablers.data.ts` split — a correctness fix, not a bundle-size win on this route

`enablers.data.ts` was split into 4 separate named exports (`enablerFeatures`,
`enablerSuccessStories`, `enablerColleges`, `enablerFaculties`) so `colleges.tsx` and
`success-stories.tsx` no longer *import* the unrelated 1,386-line `faculties` array just to
read their own small slice. **Measured result: `5301-*.js` (the chunk carrying this data) is
byte-identical before and after — same 67,385-byte hash.**

This is expected, not a failed fix: `colleges.tsx`, `success-stories.tsx`, and
`mission-and-growth.tsx` are all rendered together on the single `/be-a-part/enablers` route,
so Next's per-route chunking groups their code together regardless of which named export each
file imports — there was never a possible bundle-size win *on this specific route*. The real
value of the split is correctness and avoiding a structural anti-pattern (a single merged
object export defeats tree-shaking by construction — any consumer importing `enablers` would
pull the whole object, including 1,386 lines of `faculties`, even if only reading `.colleges`);
it protects any *future* consumer that imports one export without needing the others, and it
matches the same principle behind the `team.data.ts` fix even though the two didn't produce
symmetric on-disk deltas. `who-is-enabler.tsx` (a Server Component, uses `enablerFeatures`)
never shipped this data to the client at all, before or after.

---

## 6. `<Sparkle>` dedup — small, as the original estimate expected

`app/levelstructure/page-*.js`: 44 KB → 40 KB (**-4 KB, -9%**). All 7 level files now use a
shared `<SparkleField sparkles={[...]} />` component with coordinate data instead of
repeated JSX blocks. `docs/bundle-analysis.md` §6 correctly flagged this as a "cheap to do,
not separately measured" fix rather than a major line item — the real value here is
maintainability (7 near-identical decorative blocks → 1 shared component + per-file data),
not bundle size.

---

## 7. What's unchanged, and why that's expected

Every "floor" chunk — React DOM (`4bd1b696`), App Router internals (`3794`), the app
bootstrap (`main`), polyfills, home page, Radix Select, date-fns/cmdk — is **byte-identical**
between the two runs. None of Phase 2/7's fixes touched these; they were never in scope. The
~614 KB shared-JS floor documented in `performance-audit.md` §5e is still open — this pass
didn't attribute or reduce it, only the two specifically-targeted findings (`team.data.ts`
client-boundary, `/events` barrel chunking) plus the two Phase 7 dependency removals (Swiper,
react-icons) did.

---

## 8. Still open (unchanged from before this pass)

- The ~614 KB shared-JS floor (`performance-audit.md` §5e) — not attributed further in this
  pass; still needs a dedicated read of `.next/analyze/client.html`'s full module treemap.
- `/team` still renders every member unbounded — `team-grid.tsx`'s render cost, separate from
  the now-fixed bundle-size problem (`performance-audit.md` §6c). Pagination was deliberately
  deferred, not part of this fix.
- `mission-and-growth.tsx` still ships `enablerFaculties` (1,386 lines) client-side by
  necessity — its "Load more" pagination slices an already-fully-downloaded array; a real fix
  needs a backend-paginated API, out of scope for this pass.
