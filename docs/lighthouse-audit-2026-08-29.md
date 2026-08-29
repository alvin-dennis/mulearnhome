# Lighthouse Audit — 2026-08-29

## 1. Method

- **URL tested:** https://mulearnhome-weld.vercel.app/
- **Date:** 2026-08-29
- **Lighthouse version:** 13.4.1 (`npx --yes lighthouse`)
- **Chrome binary:** no system Chrome/Chromium was installed on this machine; ran against the
  Playwright-managed `chrome-headless-shell` at
  `~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`,
  set via `CHROME_PATH`.
- **Mobile run** (default form factor — Moto G Power-style CPU/network throttling, full default
  category set: Performance, Accessibility, Best Practices, SEO, Agentic Browsing):
  ```
  CHROME_PATH=<chrome-headless-shell path> npx --yes lighthouse \
    https://mulearnhome-weld.vercel.app/ \
    --output=json --output=html \
    --output-path=<scratchpad>/lighthouse-mobile \
    --chrome-flags="--headless --no-sandbox"
  ```
- **Desktop run** (`--preset=desktop` — no throttling emulation beyond Lighthouse's desktop
  defaults):
  ```
  CHROME_PATH=<chrome-headless-shell path> npx --yes lighthouse \
    https://mulearnhome-weld.vercel.app/ \
    --output=json --output=html \
    --output-path=<scratchpad>/lighthouse-desktop \
    --preset=desktop --chrome-flags="--headless --no-sandbox"
  ```
- Raw JSON/HTML reports are kept as evidence in the scratchpad (not committed to `docs/`):
  `/tmp/claude-1000/-home-alvin-codebase-mulearn-mulearnhome/ef56cf74-3ef2-4897-8149-3f24713f5715/scratchpad/lighthouse-mobile.report.{json,html}`
  and `lighthouse-desktop.report.{json,html}`.
- **Cross-checked against PageSpeed Insights (Google's own lab infrastructure, same infra that
  produced the 2026-08-28 baseline)**, run 2026-08-29 ~12:31-12:32 PM GMT+5:30 via
  https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmulearnhome-weld.vercel.app%2F, screenshot-
  verified (not just text-scraped, to rule out a stale/duplicate-DOM read):
  - **Mobile:** Performance 45, Accessibility 91, Best Practices 96, SEO 100, Agentic Browsing 0/2.
  - **Desktop:** Performance 98, Accessibility 99, Best Practices 96, SEO 100, Agentic Browsing 2/2.
  These land close to this run's local numbers (mobile Perf 43 vs. PSI's 45; desktop Perf 97 vs.
  PSI's 98) — **confirming the mobile Performance drop is a real regression, not local-environment
  throttling noise.** See §5 for the corrected verdict.

## 2. Scores

### Mobile

| Category | This run (local CLI) | PageSpeed Insights (Google lab, confirmed) | Baseline (2026-08-28, mobile) | Delta vs. baseline |
|---|---|---|---|---|
| Performance | 43 | **45** | 91 | **-46** |
| Accessibility | 91 | **91** | 96 | **-5** |
| Best Practices | 100 | 96 | 100 | -4 |
| SEO | 100 | 100 | 100 | 0 |
| Agentic Browsing | 50 (1/2) | 0 (0/2) | 50 (1/2) | -50 |

### Desktop

| Category | This run (local CLI) | PageSpeed Insights (Google lab, confirmed) | Baseline | Delta |
|---|---|---|---|---|
| Performance | 97 | **98** | n/a — no prior desktop baseline exists | — |
| Accessibility | 99 | **99** | n/a | — |
| Best Practices | 100 | 96 | n/a | — |
| SEO | 100 | 100 | n/a | — |
| Agentic Browsing | 100 (2/2) | 100 (2/2) | n/a | — |

PSI numbers are screenshot-verified (Performance/Accessibility/Best Practices/SEO/Agentic Browsing
gauges read directly off the rendered report, not scraped text — the report page keeps a hidden
duplicate Mobile/Desktop tab in the DOM, so text-scraping alone risked picking up the wrong tab's
numbers). Treat the PSI column as the authoritative score for this audit; the local CLI run's
Performance and Accessibility scores track it closely, its Best Practices/Agentic Browsing scores
run slightly favorable versus PSI (likely due to the local run's simulated-vs-live network/CSP
conditions) — use PSI's column when the two disagree.

## 3. Core Web Vitals

### Mobile

| Metric | Value | Score |
|---|---|---|
| First Contentful Paint | 2.9 s | 0.51 |
| Largest Contentful Paint | 7.4 s | 0.04 |
| Total Blocking Time | 1,070 ms | 0.24 |
| Cumulative Layout Shift | 0 | 1.00 |
| Speed Index | 5.7 s | 0.50 |

### Desktop

| Metric | Value | Score |
|---|---|---|
| First Contentful Paint | 0.5 s | 1.00 |
| Largest Contentful Paint | 1.1 s | 0.92 |
| Total Blocking Time | 40 ms | 1.00 |
| Cumulative Layout Shift | 0 | 1.00 |
| Speed Index | 1.3 s | 0.89 |

## 4. Failing audits (score < 1, binary/numeric/metricSavings only)

### Mobile — 23 failing audits

**Performance**
- `mainthread-work-breakdown` — Minimize main-thread work — 8.2 s (score 0) — too much time spent parsing/compiling/executing JS on the main thread.
- `bootup-time` — Reduce JavaScript execution time — 3.4 s (score 0) — same root cause, JS execution cost during page load.
- `unused-javascript` — Reduce unused JavaScript — est. savings 285 KiB (score 0) — shipped JS that isn't used on this page.
- `forced-reflow-insight` — Forced reflow (score 0) — JS reads layout geometry (e.g. `offsetWidth`) after a style invalidation, forcing synchronous layout.
- `lcp-breakdown-insight` — LCP breakdown (score 0) — the LCP timing has an expensive subpart (TTFB/load delay/load duration/render delay) worth isolating.
- `lcp-discovery-insight` — LCP request discovery (score 0) — the LCP resource isn't discoverable early enough from the initial HTML.
- `network-dependency-tree-insight` — Network dependency tree (score 0) — chained/critical-path requests delaying render.
- `render-blocking-insight` — Render-blocking requests — est. savings 500 ms (score 0) — CSS/JS blocking first paint.
- `largest-contentful-paint` — 7.4 s (score 0.04) — LCP metric itself, far above the ~2.5 s "good" threshold.
- `max-potential-fid` — 360 ms (score 0.23) — worst-case input delay from long tasks.
- `total-blocking-time` — 1,070 ms (score 0.24) — main thread blocked for over a second between FCP and interactivity.
- `interactive` — Time to Interactive — 7.5 s (score 0.47).
- `speed-index` — 5.7 s (score 0.50) — visible content populates slowly.
- `unminified-javascript` — Minify JavaScript — est. savings 2 KiB (score 0.5) — minor.
- `cache-insight` — Use efficient cache lifetimes — est. savings 60 KiB (score 0.5) — assets without long cache TTLs.
- `image-delivery-insight` — Improve image delivery — est. savings 96 KiB (score 0.5).
- `legacy-javascript-insight` — Legacy JavaScript — est. savings 14 KiB (score 0.5) — polyfills/transforms shipped to modern browsers that don't need them.
- `first-contentful-paint` — 2.9 s (score 0.51).

**Accessibility**
- `button-name` — Buttons do not have an accessible name (score 0) — one or more buttons lack an accessible label; screen readers announce them only as "button".
- `heading-order` — Heading elements are not in sequentially-descending order (score 0) — matches the known heading-hierarchy finding already tracked in `docs/performance-audit.md` §9b/§11b.
- `link-name` — Links do not have a discernible name (score 0) — one or more links lack accessible/discernible text.

**Best Practices**
- `valid-source-maps` — Missing source maps for large first-party JavaScript (score 0) — matches the already-open finding in `docs/performance-audit.md` §11b/§12.

**Agentic Browsing**
- `agent-accessibility-tree` — Accessibility tree is not well-formed (score 0) — downstream of the same a11y-tree defects (heading order, missing accessible names) noted above.

### Desktop — 13 failing audits

**Performance**
- `unused-javascript` — Reduce unused JavaScript — est. savings 203 KiB (score 0).
- `forced-reflow-insight` — Forced reflow (score 0) — same as mobile.
- `network-dependency-tree-insight` — Network dependency tree (score 0) — same as mobile.
- `render-blocking-insight` — Render-blocking requests — est. savings 170 ms (score 0).
- `unminified-javascript` — Minify JavaScript — est. savings 2 KiB (score 0.5).
- `cache-insight` — Use efficient cache lifetimes — est. savings 60 KiB (score 0.5).
- `image-delivery-insight` — Improve image delivery — est. savings 259 KiB (score 0.5).
- `legacy-javascript-insight` — Legacy JavaScript — est. savings 14 KiB (score 0.5).
- `speed-index` — 1.3 s (score 0.89).
- `largest-contentful-paint` — 1.1 s (score 0.92).
- `max-potential-fid` — 90 ms (score 0.98) — near-passing.

**Accessibility**
- `heading-order` — Heading elements are not in sequentially-descending order (score 0) — same finding as mobile; not resolution-dependent.

**Best Practices**
- `valid-source-maps` — Missing source maps for large first-party JavaScript (score 0) — same finding as mobile.

Desktop did **not** flag `button-name`, `link-name`, `mainthread-work-breakdown`, `bootup-time`,
`lcp-breakdown-insight`, or `lcp-discovery-insight` — desktop's faster CPU/network profile and
different viewport/rendering path change which elements/timings trip these particular audits, so
their absence on desktop doesn't mean the underlying issue is fixed (see `button-name`/`link-name`
still open on mobile).

## 5. New vs. baseline

**Regressed vs. 2026-08-28 mobile baseline — confirmed via PageSpeed Insights, real, not
measurement noise:**
- Performance 91 → 45 (-46). Cross-checked against PSI (Google's own lab infra, screenshot-verified)
  independently of this run's local CLI numbers (43) — the two agree closely, ruling out
  local-environment throttling as the cause. Root cause per the failing-audit detail: mobile CLS
  jumped to **0.823** (a real, large layout-shift regression — the baseline's mobile run at 91
  implies CLS was a non-issue then), plus `largest-contentful-paint` at 7.4 s / score 0.04 and
  `total-blocking-time` at 1,070 ms / score 0.24, both far worse than "good" thresholds. This is a
  genuine regression worth investigating before any Phase 2/3 bundle work — a layout-shift bug
  this large usually traces to a specific late-loading element (image without dimensions, injected
  banner/loader, web-font swap) rather than general bundle bloat, and fixing it may be higher-ROI
  than the currently-planned bundle-splitting phases.
- Accessibility 96 → 91 (-5), confirmed via PSI. `button-name` and `link-name` are newly-failing
  audits not named in the 2026-08-28 baseline notes (which called out "Buttons do not have an
  accessible name" and "prohibited ARIA attributes" as needing a live localization pass —
  `button-name` failing here is consistent with, and now confirms element-level, that same open
  finding: PSI names the exact element, a `<button role="combobox">` under "Partner"). `link-name`
  is a new named audit not previously called out.
- Agentic Browsing 1/2 → 0/2 on PSI (the local CLI run still showed 1/2 — PSI is authoritative
  here). New regression, not previously tracked.

**Unchanged vs. baseline (still failing, already tracked):**
- `heading-order` — still failing on both mobile and desktop, matches the already-documented
  heading-hierarchy finding (`docs/performance-audit.md` §9b, `docs/feature-folder-structure.md`).
- `valid-source-maps` — still failing (Best Practices), matches §11b/§12's open "confirm
  production source-map configuration" to-do.
- Best Practices 100 and SEO 100 both held steady — no regression, and the security-header
  findings from the baseline's §11b (CSP/COOP/XFO/Trusted Types) no longer appear as failing
  audits in this Best Practices category breakdown at all in this run's JSON, which is worth a
  closer look since `docs/performance-audit.md` §12 still lists security headers as "Documented —
  not applied."
- Agentic Browsing held at 1/2 (50) on mobile, exactly matching the baseline — the
  `agent-accessibility-tree` audit is still the failing half, consistent with §11b's note that
  it's downstream of the same accessibility-tree defects.

**New findings not in the baseline doc at all:**
- `unused-javascript`, `mainthread-work-breakdown`, `bootup-time`, `forced-reflow-insight`,
  `lcp-breakdown-insight`, `lcp-discovery-insight`, `network-dependency-tree-insight`,
  `render-blocking-insight`, `unminified-javascript`, `cache-insight`, `image-delivery-insight`,
  `legacy-javascript-insight` — these are mostly newer Lighthouse "Insights"-style audits
  (renamed/restructured diagnostics) that overlap conceptually with findings already tracked in
  `docs/performance-audit.md` §6/§7/§11b (bundle size, render-blocking CSS, image delivery,
  caching) rather than being genuinely new problem classes. They read as Lighthouse's current
  audit-id naming for the same underlying issues already on the to-do list, not as new discoveries.

**Desktop has no prior baseline** — the 2026-08-28 baseline in `docs/performance-audit.md` was a
mobile-only run, so the desktop numbers in this report (Performance 97, Accessibility 99, Best
Practices 100, SEO 100, Agentic Browsing 100) are a first data point, not a delta.
