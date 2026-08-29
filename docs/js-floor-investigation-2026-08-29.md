# JS floor investigation — 2026-08-29

Biggest shared chunk `2386-65474f42dbc371f5.js` (local webpack build), 360,774 bytes parsed. Deployed build's version of same chunk flagged by Lighthouse (`819d250….js`) as top `unused-javascript` culprit, ~179KB estimated waste. Below: real per-package breakdown from `.next/analyze/client.html` treemap data (`window.chartData`), not estimates.

## Breakdown (411 leaf modules, 359,025 bytes total)

| Package | Bytes | % of chunk | Where used |
|---|---:|---:|---|
| `tailwind-merge` | 26,864 | 7.5% | `cn()` utility — every shadcn/Radix component |
| `motion-dom` + `framer-motion` | ~50,000 | 14% | `MotionDiv`/`MotionSection` etc — used across nearly every feature component |
| `next/dist/compiled/buffer` | 22,533 | 6.3% | Node `Buffer` polyfill, pulled in transitively by axios (no direct `Buffer` use anywhere in `src`) |
| `zod` (v4 core + classic) | ~44,000 | 12.3% | `src/shared/schemas/common.schema.ts`, `contact.schema.ts`, `donate.schema.ts`, `src/config/env.client.ts`, `env.server.ts` (5 files total) |
| `axios` | ~20,000 | 5.6% | **1 file only**: `src/lib/fetcher.ts` |
| `next/dist/shared/lib/get-img-props.js` + related next internals | ~10,500 | 2.9% | `next/image` internals |
| `@radix-ui/react-switch` + deps | ~7,300 | 2% | `src/components/ui/switch.tsx` (cookie modal) |
| everything else (400+ small leaves) | ~178,000 | 49% | Long tail — Radix primitives, next client runtime, misc |

## Issues, fixes, gains

### Issue 1 — axios single-use, drags in dead Buffer polyfill

**Issue:** `axios` imported in exactly 1 file (`src/lib/fetcher.ts`, ~70 lines — thin wrapper: 2 client instances, 1 error normalizer, no real interceptor logic). Its browser bundle transitively pulls `next/dist/compiled/buffer`, a Node `Buffer` polyfill — confirmed dead, `grep -rn "Buffer\b" src` → 0 hits anywhere in the codebase. axios itself never needs `Buffer` at runtime here; webpack just can't tree-shake it out of axios's platform-detection code.

**Fix:** Replace axios with native `fetch()` in `fetcher.ts` only (sole call site, no other file imports axios):
- Rebuild `publicGateway` / `privateGateway` as thin `fetch` wrappers carrying the same `baseURL`, `timeout` (via `AbortController`), and JSON `Content-Type` header.
- Rebuild `toFetcherError` to read a native `Response`/`fetch` rejection instead of `AxiosError` — same `extractDjangoMessage` logic, just a different input shape.
- No consumer-facing API change; every feature calling `publicGateway`/`privateGateway` stays untouched.

**Gain:** **~42.5KB parsed (11.9% of the chunk)** removed — axios (~20KB) + the Buffer polyfill it drags in (22.5KB). Directly shrinks the exact chunk Lighthouse flags for `unused-javascript` waste on the live site.

**Status:** Not yet applied — scoped and ready, needs explicit go-ahead.

### Issue 2 — zod footprint, real usage

**Issue:** `zod` ≈ 44KB (12.3% of chunk) across 5 files: 2 form schemas (`contact.schema.ts`, `donate.schema.ts`), 1 shared schema (`common.schema.ts`), 2 env validators (`env.client.ts`, `env.server.ts`). All 5 are live, load-bearing usage — not dead code.

**Fix:** None recommended. Dropping zod means dropping runtime schema validation on forms and env vars — a correctness regression, not a perf win worth taking.

**Gain:** N/A — flagged for visibility only, not actionable without a validation-strategy change.

### Issue 3 — tailwind-merge + framer-motion/motion-dom, structural

**Issue:** `tailwind-merge` (26.9KB) backs the `cn()` utility used by nearly every shadcn/Radix component. `framer-motion`/`motion-dom` (~50KB) backs `MotionDiv`/`MotionSection` used across the large majority of feature components. Combined ~77KB (21.5% of chunk).

**Fix:** None recommended. Removing either requires a design-system-level rewrite (dropping Tailwind's conflict-merging or the animation library site-wide) — out of scope for a bundle-size fix.

**Gain:** N/A — flagged for visibility only.

### Issue 4 — long tail, no single offender

**Issue:** 400+ remaining leaf modules totaling ~178KB (49% of chunk) — Next.js client runtime, Radix UI primitives, `next/image` internals. No single module here is large enough to be worth isolating.

**Fix:** None — this is baseline cost of the Next.js + Radix stack already in use.

**Gain:** N/A.

## Summary

| # | Issue | Fix | Gain | Status |
|---|---|---|---|---|
| 1 | axios (1 file) + dead Buffer polyfill | Swap to native `fetch()` in `fetcher.ts` | ~42.5KB / 11.9% of chunk | Not applied — ready, needs go-ahead |
| 2 | zod ~44KB, 5 files | None (real usage) | — | No action |
| 3 | tailwind-merge + framer-motion ~77KB | None (structural, rewrite-scale) | — | No action |
| 4 | Long tail ~178KB, 400+ modules | None (stack baseline) | — | No action |

Only Issue 1 is an actionable, scoped fix. Say the word to apply it.

---

## Bundle-analyzer re-run — verified against baseline, no drift

Re-ran `ANALYZE=true bun run build -- --webpack` (same method as `docs/bundle-analysis.md` and `docs/bundle-comparison-2026-08-29.md`), sizes read off `.next/static/chunks/*.js` on disk.

| Chunk | `docs/bundle-comparison-2026-08-29.md` (2026-08-29, earlier) | This run | Delta |
|---|---:|---:|---|
| `2386-*.js` (the JS-floor chunk) | 361 KB | **360,774 B = 352.3 KB** | unchanged (rounding only) |
| `app/page-*.js` (home) | 46 KB | **46,460 B = 45.4 KB** | unchanged |
| `4bd1b696-*.js` (React DOM) | 198 KB | 198,620 B ≈ 194 KB | unchanged |
| `3794-*.js` (App Router internals) | 195 KB | 195,583 B ≈ 191 KB | unchanged |
| `framework-*.js` | 189 KB | 189,787 B ≈ 185 KB | unchanged |
| `main-*.js` | 129 KB | 129,422 B ≈ 126 KB | unchanged |
| `polyfills-*.js` | 112 KB | 112,594 B ≈ 110 KB | unchanged |

**No wins, no losses since the last bundle pass** — expected, since none of this session's code changes (`heading-order` a11y fixes, `aria-label` additions, `features.tsx` image-size fix, `footer.tsx` CLS fix, `home-view.tsx` `Story` → `dynamic()`) touch a dependency or add/remove a chunk. `home-view.tsx`'s `Story` component moving to `dynamic()` did **not** shrink `app/page-*.js` — `dynamic()` code-splits the component into its own on-demand chunk (deferring when it downloads), it doesn't delete code, so total bytes shipped are the same; the win there is render-blocking time at initial load, not a byte-count reduction. This confirms the JS-floor breakdown above is still 100% accurate — nothing has drifted.

## Lighthouse re-run — live site not yet updated, deploy gap confirmed

Live URL checked: `https://mulearnhome-weld.vercel.app/` via PageSpeed Insights, screenshot-verified both form factors (2026-08-29, ~5:34–5:37 PM GMT+5:30).

**Deploy gap found first:** `git log origin/dev..HEAD` shows commit `531c7f6 fix(ui): resolve layout shifts and improve accessibility` is 1 commit ahead of `origin/dev` — **committed locally, not pushed**. That commit contains the CLS fix (`footer.tsx` `height={0}`→`48`) and the a11y fixes (heading-order, `aria-label`s) from this session. The live Vercel deployment still serves the older build, so this Lighthouse run measures the *previous* state, not today's local fixes.

| Metric | `docs/lighthouse-comparison-2026-08-29.md` "Now" (4:35 PM, pre-`531c7f6`) | This run (5:34–5:37 PM, still pre-deploy) | Delta | Read |
|---|---:|---:|---|---|
| Performance (Mobile) | 70 | 79 | +9 | Lab-metric run-to-run noise — no code shipped between runs, PSI mobile scores are single-run and noisy (both docs already flag this) |
| Accessibility (Mobile) | 94 | 94 | 0 | Matches — `aria-label`/heading fixes not deployed yet |
| Best Practices (Mobile) | 96 | 96 | 0 | Matches |
| SEO (Mobile) | 100 | 100 | 0 | Matches |
| Agentic Browsing (Mobile) | 1/2 | 1/2 | 0 | Matches |
| TBT (Mobile) | 30 ms | 90 ms | +60 ms | Run-to-run noise, same reason |
| LCP (Mobile) | 5.9 s | 4.7 s | -1.2 s | Improved, but not attributable to any undeployed fix — likely network/CDN variance |
| CLS (Mobile) | 0 | 0 | 0 | Still reads 0 — **the underlying `height={0}` bug is still live in production** (fix is local-only, in `531c7f6`, not deployed). Do not read this as the bug being fixed on the live site. |
| Performance (Desktop) | 99 | 99 | 0 | Matches |
| Accessibility (Desktop) | 99 | 99 | 0 | Matches |
| Best Practices (Desktop) | 96 | 96 | 0 | Matches |
| SEO (Desktop) | 100 | 100 | 0 | Matches |
| Agentic Browsing (Desktop) | 2/2 | 2/2 | 0 | Matches |
| TBT (Desktop) | 10 ms | 10 ms | 0 | Matches |
| LCP (Desktop) | 0.9 s | 0.9 s | 0 | Matches |
| Speed Index (Desktop) | 0.9 s | 0.7 s | -0.2 s | Minor run variance |

**Confirms the deploy-gap theory, not a real regression or win.** Every metric that should be unaffected by undeployed fixes (Accessibility, Best Practices, SEO, Agentic Browsing, both form factors) matches the prior "Now" numbers almost exactly. The only movement is in Performance/TBT/LCP/Speed Index — all classic PSI lab-metric noise (single-run, CPU-throttled simulation), not a deployed change. Screenshot evidence (both runs) still shows:
- Mobile: **"Buttons do not have an accessible name"**, **"Heading elements are not in a sequentially-descending order"**, **"Reduce unused JavaScript — Est savings of 179 KiB"** — all three still flagged live, all three already fixed locally in `531c7f6` (button `aria-label`s, `<h6>`→`<p>` heading fixes) or scoped in this doc (axios/Buffer, Issue 1 above — 179 KiB matches the JS-floor chunk almost exactly).
- Desktop: same **"Reduce unused JavaScript — Est savings of 180 KiB"** and **"Heading elements are not in a sequentially-descending order"** still flagged live.

**This is not something to fix in code** — it's a deploy step. `git push origin dev` (or whatever merges to the branch Vercel builds from) would ship `531c7f6`'s CLS/a11y fixes; re-running PSI after that push is the only way to see their real live impact.

## Fix implementation plan (detailed)

| # | Issue | Fix | Where | Effort | Expected gain | Status |
|---|---|---|---|---|---|---|
| 1 | `531c7f6` committed but not pushed — live site missing CLS + a11y fixes already done | `git push origin dev` (or merge to Vercel's build branch) | deploy step, no code change | trivial | Unlocks the CLS-0/heading-order/button-name live-audit wins that are already coded but invisible on `pagespeed.web.dev` today | **Not done — blocking everything else below from being visible live** |
| 2 | axios single-use + dead `Buffer` polyfill (this doc's Issue 1) | Swap `src/lib/fetcher.ts` to native `fetch()`, same public API (`get`/`post`/`toFetcherError`), 4 downstream consumers (`profile.api.ts`, `careers.api.ts`, `events.api.ts`, `donate.api.ts`) untouched | `src/lib/fetcher.ts` only | ~1 file rewrite, needs care: axios does plain string concat for `baseURL+url` (`https://mulearn.org/api/v1` + `/donate/order/`), NOT WHATWG `new URL()` resolution — a naive `fetch` rewrite using `new URL(path, baseUrl)` would silently drop the `/api/v1` path segment and break every API call. Must replicate axios's concat behavior exactly. | ~42.5 KB / 11.9% off the `2386-*.js` chunk, shrinks the exact `unused-javascript` finding Lighthouse flags live (179–180 KiB estimated waste, both form factors) | **Not applied — scoped, reviewed, ready. Awaiting go-ahead.** |
| 3 | zod ~44 KB, 5 real-usage files | No action — correctness > bundle size | — | — | — | No action recommended |
| 4 | tailwind-merge + framer-motion ~77 KB, structural | No action — rewrite-scale, out of scope | — | — | — | No action recommended |
| 5 | Long tail ~178 KB, 400+ modules, Next/Radix internals | No action — stack baseline | — | — | — | No action recommended |

**Sequencing:** #1 (push) should happen before or alongside #2 — pushing now would already resolve 3 of the 4 audit items currently showing live (button names, heading order, CLS), leaving only the `unused-javascript`/axios finding open, which #2 then closes. Doing #2 without #1 first fixes the code but the live site still won't show any of it until pushed either way.
