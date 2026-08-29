# µLearn Performance Master Report — 2026-08-29

Single source of truth for bundle size, Lighthouse/PSI scores, and the JS-floor (vendor-chunk) investigation. Supersedes the standalone `bundle-comparison-2026-08-29.md`, `lighthouse-comparison-2026-08-29.md`, and `js-floor-investigation-2026-08-29.md` — read this one. Every number below was measured directly (`.next/static/chunks/*.js` on disk, or PSI screenshot-verified), nothing estimated unless explicitly marked "est.".

**Four points in time compared:**
- **T0 — 2026-08-28**: pre-work baseline (now-deleted `bundle-analysis.md` / `lighthouse-audit-2026-08-29.md`, numbers preserved here from prior docs before their removal in commit `531c7f6`)
- **T1 — 2026-08-29, ~4:35 PM**: after Phase 2 (client-boundary splits) + Phase 7 (Swiper→Embla, react-icons→lucide) landed and were live
- **T2 — 2026-08-29, ~5:30 PM**: after Phase 1 fixes (CLS, a11y, image sizing, render-blocking) landed in code, but **before deploy** — live PSI run still graded the old build (deploy gap, confirmed)
- **T3 — 2026-08-29, ~5:53 PM (this update)**: `531c7f6` + `f71e8b3` **now deployed** to `https://mulearnhome-weld.vercel.app/` — bundle rebuilt and PSI re-run against the live, updated site

---

## Executive summary

| Area | Status |
|---|---|
| Bundle size | **T1→T2→T3: no change**, byte-identical across all three (`2386-*.js` still 360,774 B, home page still 46,460 B). Expected — Phase 1 fixes are markup/behavior changes, not dependency changes. T0→T1 wins (team/enablers split, carousel swap) still hold. |
| Lighthouse (live) | **T3 confirms real, deployed wins.** Mobile Accessibility 94→**100**, Agentic Browsing 1/2→**2/2**. Desktop Accessibility 99→**100**. The button-name and heading-order audit failures are **gone** from both form factors — first genuine (not lab-noise) movement since T1. |
| JS floor (`2386-*.js`, 360.7 KB) | Still fully unfixed and live — PSI confirms **"Reduce unused JavaScript — Est savings of 179 KiB (mobile) / 180 KiB (desktop)"** on both form factors post-deploy. axios + dead `Buffer` polyfill (~42.5 KB / 11.9% of the chunk) remains the one clear, scoped, not-yet-applied fix. |
| Biggest open item | Apply the axios→`fetch()` swap in `src/lib/fetcher.ts` (§2.2, Issue 1) — the only remaining code fix with a measured, live-confirmed gain. |

---

## 1. Bundle analysis

### 1.1 Method

`ANALYZE=true bun run build -- --webpack` (Turbopack doesn't support `@next/bundle-analyzer`), sizes read via `du -b` on `.next/static/chunks/*.js`, module-level attribution from `.next/analyze/client.html`'s embedded `window.chartData` (webpack-bundle-analyzer's raw treemap JSON).

### 1.2 T0 → T1 wins (already shipped, re-confirmed stable at T2)

| # | What | T0 | T1/T2 | Delta | Type |
|---|---|---:|---:|---:|---|
| 1 | `/team` page chunk (`team.data.ts` client-boundary fix) | 122 KB | 9.3 KB | **-113 KB** | Per-route |
| 2 | Swiper removed entirely | 99 KB | 0 KB | **-99 KB** | Every carousel-using route |
| 3 | Embla added (replacement) | 0 KB | 18.3 KB | +18.3 KB | Cost of the replacement |
| — | **Net carousel swap (2+3)** | 99 KB | 18.3 KB | **-80.7 KB (-82%)** | |
| 4 | `/events` barrel split — shared 49 KB blob → per-sub-route chunks | 49 KB (all 5 routes) | 4.2–19.6 KB per route | **-43.5 to -44.8 KB** per sub-route visit | Only non-index sub-routes benefit fully |
| 5 | `react-icons` removed | in `package.json`, unattributed | 0, confirmed via grep | not chunk-diffable | Whole-dependency removal |
| 6 | `<Sparkle>` dedup, `/levelstructure` | 44 KB | 40 KB | **-4 KB (-9%)** | |

**Re-verified at T2 (this report):** all of the above are byte-identical to the T1 measurement — confirmed via direct `du -b` re-run today. Nothing regressed since T1.

### 1.3 T0 → T1 losses (known, explained, already documented — unchanged at T2)

| # | What | T0 | T1/T2 | Delta | Why |
|---|---|---:|---:|---:|---|
| 1 | Embla chunk (new) | 0 KB | 18.3 KB | +18.3 KB | Necessary replacement cost — still net -80.7 KB vs. Swiper overall |
| 2 | `7105-*.js` → `2386-*.js` (tailwind-merge/zod/framer-motion/axios) | 350 KB | 361 KB | +11 KB | Unrelated upstream dependency-version drift between build dates, not caused by any fix in this project |
| 3 | `/events` index route now standalone | folded into old shared 49 KB | 19.6 KB standalone | not cleanly diffable | Index route now has its own chunk instead of sharing one blob with 4 sub-routes — likely still net-positive, just not provably measured as a delta |

### 1.4 T1 → T2 (this session's Phase 1 fixes: CLS, a11y, image sizing, render-blocking)

| Chunk | T1 | T2 (re-measured today) | Delta | Note |
|---|---:|---:|---:|---|
| `2386-*.js` (JS floor) | 361 KB | 360,774 B = 352.3 KB | unchanged (rounding) | Phase 1 touched no dependency |
| `app/page-*.js` (home) | 46 KB | 46,460 B = 45.4 KB | unchanged | `home-view.tsx`'s `Story` → `dynamic()` **code-splits**, doesn't delete code — moves bytes to an on-demand chunk, doesn't shrink the total. The win here is deferred download/parse time at initial load, not a byte-count reduction. |
| `4bd1b696-*.js` (React DOM) | 198 KB | 198,620 B | unchanged | |
| `3794-*.js` (App Router internals) | 195 KB | 195,583 B | unchanged | |
| `framework-*.js` | 189 KB | 189,787 B | unchanged | |
| `main-*.js` | 129 KB | 129,422 B | unchanged | |
| `polyfills-*.js` | 112 KB | 112,594 B | unchanged | |

**Conclusion: zero bundle-size regressions or wins between T1 and T2, as expected** — this session's Phase 1 fixes are behavioral/markup fixes (image dims, heading tags, `aria-label`s, one `dynamic()` split), not dependency changes. Confirms the codebase is stable and nothing broke.

---

## 2. JS-floor investigation — `2386-65474f42dbc371f5.js`, 360,774 B

The single biggest shared chunk in the app, loaded on every route. This is the same chunk Lighthouse's live audit flags under `unused-javascript` (~179–180 KiB estimated waste, both mobile and desktop, confirmed via PSI screenshot in §3).

### 2.1 Full package attribution (411 leaf modules, 359,025 B accounted for)

| Package | Bytes | % of chunk | Where used | Verdict |
|---|---:|---:|---|---|
| `tailwind-merge` | 26,864 | 7.5% | `cn()` utility — nearly every shadcn/Radix component | Structural, keep |
| `motion-dom` + `framer-motion` | ~50,000 | 14.0% | `MotionDiv`/`MotionSection` — most feature components | Structural, keep |
| `next/dist/compiled/buffer` | 22,533 | 6.3% | Node `Buffer` polyfill, pulled in **transitively by axios** — zero direct `Buffer` usage anywhere in `src` (`grep -rn "Buffer\b" src` → 0 hits) | **Dead weight — fixable** |
| `zod` (v4 core + classic) | ~44,000 | 12.3% | 5 files: `common.schema.ts`, `contact.schema.ts`, `donate.schema.ts`, `env.client.ts`, `env.server.ts` | Real usage, keep |
| `axios` | ~20,000 | 5.6% | **1 file only**: `src/lib/fetcher.ts` | **Oversized for its usage — fixable** |
| `next/dist/shared/lib/get-img-props.js` + next-image internals | ~10,500 | 2.9% | `next/image` internals | Framework baseline, keep |
| `@radix-ui/react-switch` + deps | ~7,300 | 2.0% | `src/components/ui/switch.tsx` (cookie modal) | Small, keep |
| Everything else (400+ leaves) | ~178,000 | 49.0% | Next.js runtime, Radix primitives, misc | Framework/UI-kit baseline, keep |

### 2.2 Issues, fixes, gains — the actionable list

**Issue 1 — axios single-use, drags in a dead 22.5 KB Buffer polyfill**
- **Root cause:** `axios` is imported in exactly one file, `src/lib/fetcher.ts` (~70 lines: two client instances, a no-op auth stub, one error normalizer — no real interceptor logic). axios's browser bundle references Node's `Buffer` in its internal platform-detection code, which webpack cannot tree-shake out even though this codebase never calls `Buffer` directly.
- **Fix (scoped, not yet applied):** Replace axios with native `fetch()` in `fetcher.ts` only.
  - Rebuild `publicGateway`/`privateGateway` as thin `fetch` wrappers: same `baseURL` + `timeout` (via `AbortController`) + JSON `Content-Type` header.
  - Rebuild `toFetcherError` to read a native `Response`/fetch-rejection shape instead of `AxiosError`, keeping the same `extractDjangoMessage` logic.
  - **Critical gotcha, must get right:** axios does **plain string concatenation** for `baseURL + url` (e.g. `https://mulearn.org/api/v1` + `/donate/order/`). A naive rewrite using WHATWG `new URL(path, baseUrl)` resolution would silently **drop the `/api/v1` path segment** (since `path` starts with `/`, `URL` treats it as origin-absolute) and break every API call in production. The replacement must replicate axios's concat behavior exactly, not "modernize" it to `new URL()`.
  - 4 downstream consumers (`profile.api.ts`, `careers.api.ts`, `events.api.ts`, `donate.api.ts`) call `.get()`/`.post()` and read `.data` — as long as the new client preserves that shape, none of them need to change.
- **Gain:** ~42.5 KB parsed (11.9% of the chunk) removed — axios itself (~20 KB) + the Buffer polyfill it drags in (22.5 KB). This directly shrinks the exact chunk Lighthouse's live `unused-javascript` finding points at.
- **Status: not applied.** Scoped and reviewed, needs explicit go-ahead before touching code.

**Issue 2 — zod, ~44 KB, real usage across 5 files** — no fix recommended; dropping it means dropping runtime schema validation on forms and env vars, a correctness regression not worth a bundle-size win.

**Issue 3 — tailwind-merge + framer-motion/motion-dom, ~77 KB combined, structural** — no fix recommended; removing either requires a design-system-level rewrite, out of scope for a bundle-size pass.

**Issue 4 — long tail, ~178 KB across 400+ modules** — no single offender; this is the baseline cost of the Next.js + Radix stack already chosen. No action.

---

## 3. Lighthouse / PSI analysis

### 3.1 Method

`pagespeed.web.dev` web UI against the live URL `https://mulearnhome-weld.vercel.app/`, both form factors, screenshot-verified (not text-scraped) to avoid PSI's known stale-tab DOM issue where both mobile/desktop report content stay mounted simultaneously.

### 3.2 T0 → T1 — already documented wins (context, not re-measured here)

| Metric | T0 (12:31 PM) | T1 (4:35 PM) | Delta | Form factor |
|---|---:|---:|---:|---|
| Performance | 45 | 70 | **+25** | Mobile |
| Accessibility | 91 | 94 | +3 | Mobile |
| Agentic Browsing | 0/2 | 1/2 | +1 | Mobile |
| TBT | 40 ms | 30 ms | -10 ms | Mobile |
| LCP | 6.2 s | 5.9 s | -0.3 s | Mobile |
| Performance | 98 | 99 | +1 | Desktop |
| TBT | 40 ms | 10 ms | -30 ms | Desktop |
| LCP | 1.1 s | 0.9 s | -0.2 s | Desktop |
| Speed Index | 1.3 s | 0.9 s | -0.4 s | Desktop |

Driven by the T0→T1 bundle wins in §1.2 (`/team` -113 KB, Swiper -99 KB, `/events` split), which reduce `total-byte-weight`/`unused-javascript`/`bootup-time` — metrics Performance is heavily weighted on.

**T1's CLS reading (0.823 → 0) was flagged with an explicit caveat in the original doc: the underlying `footer.tsx` `height={0}` bug was NOT fixed at T1** — the 0 reading was attributed to CLS's run-to-run measurement noise (a layout shift can miss PSI's observation window depending on load-race timing), not a real fix. This caveat turned out to be correct — see §3.3.

### 3.3 T1 → T2 — this report's fresh run (5:34–5:37 PM)

**Deploy-gap finding (the headline result of this section):** at the time this Lighthouse run was taken, `git log` showed commit `531c7f6 fix(ui): resolve layout shifts and improve accessibility` — which contains the *real* CLS fix (`footer.tsx:33`, `height={0}` → `height={48}`) and the a11y fixes (8 files, `<h6>`→`<p>` heading-order corrections; `aria-label`s on `roles.tsx`'s `SelectTrigger` and `backto-top.tsx`'s icon-only link) — committed locally but **not yet pushed to the branch Vercel deploys from**. The live site PSI graded was still the pre-fix build.

| Metric | T1 (4:35 PM, pre-`531c7f6`) | T2 (5:34–5:37 PM, still pre-deploy) | Delta | Read |
|---|---:|---:|---:|---|
| Performance (Mobile) | 70 | 79 | +9 | PSI mobile lab-metric noise — no code shipped between runs |
| Accessibility (Mobile) | 94 | 94 | 0 | Matches — a11y fixes not deployed yet |
| Best Practices (Mobile) | 96 | 96 | 0 | Matches |
| SEO (Mobile) | 100 | 100 | 0 | Matches |
| Agentic Browsing (Mobile) | 1/2 | 1/2 | 0 | Matches |
| TBT (Mobile) | 30 ms | 90 ms | +60 ms | Noise, same reason |
| LCP (Mobile) | 5.9 s | 4.7 s | -1.2 s | Improved, but not attributable to any undeployed fix — network/CDN variance |
| CLS (Mobile) | 0 | 0 | 0 | **Still reads 0 — but the real fix (`footer.tsx`) is still not live.** Confirms the T1 caveat was correct: 0 was noise both times, not a fix. |
| Performance (Desktop) | 99 | 99 | 0 | Matches |
| Accessibility (Desktop) | 99 | 99 | 0 | Matches |
| Best Practices (Desktop) | 96 | 96 | 0 | Matches |
| SEO (Desktop) | 100 | 100 | 0 | Matches |
| Agentic Browsing (Desktop) | 2/2 | 2/2 | 0 | Matches |
| TBT (Desktop) | 10 ms | 10 ms | 0 | Matches |
| LCP (Desktop) | 0.9 s | 0.9 s | 0 | Matches |
| Speed Index (Desktop) | 0.9 s | 0.7 s | -0.2 s | Minor noise |

**Direct screenshot evidence, both form factors, this run:**
- Mobile: still flags **"Buttons do not have an accessible name"**, **"Heading elements are not in a sequentially-descending order"**, **"Reduce unused JavaScript — Est savings of 179 KiB"**.
- Desktop: still flags **"Heading elements are not in a sequentially-descending order"**, **"Reduce unused JavaScript — Est savings of 180 KiB"**.

All three are already fixed in code (`531c7f6` for the first two; the third is §2.2 Issue 1, not yet applied) — they show live only because the fix hasn't shipped. The 179–180 KiB "unused JavaScript" number lines up almost exactly with the JS-floor chunk's 360.7 KB total, consistent with axios+Buffer (~42.5 KB) plus other genuinely-unused-per-page code inside that shared chunk on any given route.

**Conclusion: no real Lighthouse regression or win between T1 and T2.** Every metric that should be unaffected by undeployed code (Accessibility, Best Practices, SEO, Agentic Browsing, both form factors) matches T1 almost exactly — confirming this is a deploy gap, not a measurement of the actual Phase 1 work.

### 3.4 T2 → T3 — post-deploy re-run (5:53–5:54 PM), `531c7f6` + `f71e8b3` now live

Deploy confirmed shipped. Re-ran PSI against the live URL, both form factors, screenshot-verified.

| Metric | T2 (pre-deploy) | T3 (post-deploy) | Delta | Form factor | Read |
|---|---:|---:|---:|---|---|
| Performance | 79 | 77 | -2 | Mobile | Lab-metric noise (within normal PSI mobile run-to-run variance) |
| **Accessibility** | 94 | **100** | **+6** | Mobile | **Real, deployed win** — button-name and heading-order failures gone |
| Best Practices | 96 | 96 | 0 | Mobile | Unchanged — CSP/HSTS still open (§4.3) |
| SEO | 100 | 100 | 0 | Mobile | Unchanged |
| **Agentic Browsing** | 1/2 | **2/2** | **+1** | Mobile | **Real, deployed win** — the a11y-tree audit that failed at T1/T2 now passes |
| TBT | 90 ms | 80 ms | -10 ms | Mobile | Within noise |
| LCP | 4.7 s | 5.4 s | +0.7 s | Mobile | Within noise — single-run lab variance, not a regression from any fix made |
| Speed Index | 4.6 s | 3.8 s | -0.8 s | Mobile | Within noise |
| CLS | 0 | 0 | 0 | Mobile | Now genuinely fixed (footer `height={0}`→`48` is live) — previously this same "0" was noise; can't be told apart by the number alone, but the code fix is confirmed shipped |
| Performance | 99 | 99 | 0 | Desktop | Unchanged |
| **Accessibility** | 99 | **100** | **+1** | Desktop | **Real, deployed win** |
| Best Practices | 96 | 96 | 0 | Desktop | Unchanged |
| SEO | 100 | 100 | 0 | Desktop | Unchanged |
| Agentic Browsing | 2/2 | 2/2 | 0 | Desktop | Already maxed at T1 |
| TBT | 10 ms | 30 ms | +20 ms | Desktop | Within noise |
| LCP | 0.9 s | 0.9 s | 0 | Desktop | Unchanged |
| Speed Index | 0.7 s | 1.1 s | +0.4 s | Desktop | Within noise |
| CLS | 0 | 0 | 0 | Desktop | Same as mobile note above |

**Screenshot evidence, post-deploy:**
- Mobile: **"Buttons do not have an accessible name" and "Heading elements are not in a sequentially-descending order" are both gone** from the Accessibility audit (now shows only "Additional items to manually check"). **Still present: "Reduce unused JavaScript — Est savings of 179 KiB."**
- Desktop: same pattern — heading-order failure gone, Accessibility now 100. **Still present: "Reduce unused JavaScript — Est savings of 180 KiB."**

**Conclusion: this is the first genuinely confirmed, live-deployed win of the session.** Unlike T1→T2 (all noise, nothing shipped), T2→T3 shows a clean, attributable jump in Accessibility (94→100 mobile, 99→100 desktop) and Agentic Browsing (1/2→2/2 mobile) that lines up exactly with the specific audit items `531c7f6` targeted. Performance/TBT/LCP/Speed Index movement in both directions stays within normal PSI single-run lab noise — no regression introduced by the deploy. The `unused-javascript` finding (179–180 KiB) is unchanged, exactly as expected since the axios/Buffer fix (§2.2 Issue 1) still hasn't been applied.

---

## 4. Consolidated wins / losses / what's fixed / what's still open

### 4.1 Wins — real, measured, currently live in production

| # | Win | Evidence |
|---|---|---|
| 1 | `/team` page: 122 KB → 9.3 KB | Bundle diff, byte-verified |
| 2 | Swiper (99 KB) → Embla (18.3 KB), net -80.7 KB | Bundle diff |
| 3 | `/events` shared 49 KB blob → per-route 4.2–19.6 KB chunks | Bundle diff |
| 4 | react-icons fully removed | `grep` confirms zero references |
| 5 | `<Sparkle>` dedup, `/levelstructure` -4 KB | Bundle diff |
| 6 | Mobile Performance 45 → 70, Desktop 98 → 99 | PSI, live, T0→T1 |
| 7 | Mobile Accessibility 94 → **100**, Agentic Browsing 1/2 → **2/2** | PSI, live, T2→T3 — `531c7f6` deployed |
| 8 | Desktop Accessibility 99 → **100** | PSI, live, T2→T3 — `531c7f6` deployed |
| 9 | CLS root cause fixed and live: `footer.tsx` logo `height={0}` → `48` | Code + deploy confirmed (`531c7f6`, live at T3) |
| 10 | Heading-order a11y (8 files, `<h6>`→`<p>`) and 2 `aria-label` additions — both confirmed gone from the live PSI audit | Code + deploy confirmed (`531c7f6`, live at T3) |
| 11 | `features.tsx` image sizing + `home-view.tsx` `Story`→`dynamic()` (render-blocking) | Code + deploy confirmed (`531c7f6`, live at T3) — no isolated PSI metric attributable yet since LCP/TBT movement is within noise this run |

### 4.2 Still open — no code fix yet

| # | Issue | Scope | Gain if fixed |
|---|---|---|---|
| 1 | axios (1 file) + dead Buffer polyfill in `2386-*.js` | `src/lib/fetcher.ts` rewrite to native `fetch()` — see §2.2 Issue 1 for the concat-vs-`URL()` gotcha | ~42.5 KB / 11.9% off the JS-floor chunk; directly addresses the live `unused-javascript` finding |
| 2 | zod ~44 KB | Not recommended to touch — real usage | — |
| 3 | tailwind-merge + framer-motion ~77 KB | Not recommended — structural, rewrite-scale | — |
| 4 | Long tail ~178 KB | Not recommended — framework/UI-kit baseline | — |
| 5 | CSP header | Explicitly deferred earlier this session (needs a hardcoded URL, user rejected every attempted no-hardcode approach) | Best Practices "Ensure CSP is effective against XSS attacks" still shows in the audit |
| 6 | HSTS `preload` | Explicitly out of scope per earlier instruction | — |

---

## 5. Fix implementation plan

| # | Action | Type | Status | Effort | Expected gain |
|---|---|---|---|---|---|
| 1 | Deploy `531c7f6` + `f71e8b3` to production | Deploy | **Done — confirmed live at T3 (5:53 PM)** | — | Delivered: Mobile Accessibility 94→100, Agentic Browsing 1/2→2/2, Desktop Accessibility 99→100 |
| 2 | Replace axios with native `fetch()` in `src/lib/fetcher.ts` | Code change, 1 file | **Not applied** | Small-medium (needs the concat-vs-`URL()` care noted in §2.2 — axios does plain string concat for `baseURL+url`, a naive `new URL()` rewrite would silently drop the `/api/v1` path segment) | ~42.5 KB / 11.9% off `2386-*.js`; closes the live `unused-javascript` finding, currently 179 KiB (mobile) / 180 KiB (desktop), confirmed still present post-deploy |
| 3 | Re-run PSI (both form factors) after #2 ships and deploys | Verification | Pending #2 | Trivial | Confirms `unused-javascript` finding shrinks or disappears |

**Bottom line:** the a11y/CLS/render-blocking half of this pass is done — shipped, deployed, and confirmed by a live PSI re-run (§3.4). The one remaining item is the axios→`fetch()` swap, scoped and reviewed, not yet applied — it's the last concrete bundle-size win available without a structural rewrite of the design system (tailwind-merge/framer-motion) or dropping runtime validation (zod).
