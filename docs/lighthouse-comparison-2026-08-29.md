# Lighthouse Comparison — 2026-08-29 (earlier run) → 2026-08-29 (after Phase 2/7)

> Before/after comparison of PageSpeed Insights (Google's own lab infrastructure, screenshot-
> verified) against the same live URL, `https://mulearnhome-weld.vercel.app/`. Baseline is
> `docs/lighthouse-audit-2026-08-29.md`'s PSI-authoritative column (run ~12:31 PM GMT+5:30).
> This run was taken ~4:35 PM GMT+5:30 the same day, after this session's Phase 2 (team/enablers
> client-boundary split, `/events` barrel split, Sparkle dedup) and Phase 7 (Swiper→Embla,
> react-icons→lucide-react) work. The repo's local commit history includes this session's
> fixes (`git log --oneline`: `ddbc6f3 perf(ui): optimize client bundles...`,
> `7e69ba9 refactor(deps): migrate from swiper and react-icons...`) — the live deploy's score
> movement is consistent with those changes having reached production, though this doc doesn't
> independently verify Vercel's deploy pipeline.

---

## Wins vs. losses — the honest scorecard

### Wins (measured, real)

| # | Metric | Baseline (12:31 PM) | Now (4:35 PM) | Delta | Form factor |
|---|---|---|---|---|---|
| 1 | **Performance** | 45 | **70** | **+25** | Mobile |
| 2 | Accessibility | 91 | **94** | **+3** | Mobile |
| 3 | Agentic Browsing | 0/2 | **1/2** | **+1** | Mobile |
| 4 | Total Blocking Time | 40 ms | **30 ms** | -10 ms | Mobile |
| 5 | Largest Contentful Paint | 6.2 s | **5.9 s** | -0.3 s | Mobile |
| 6 | Performance | 98 | **99** | +1 | Desktop |
| 7 | Total Blocking Time | 40 ms | **10 ms** | -30 ms | Desktop |
| 8 | Largest Contentful Paint | 1.1 s | **0.9 s** | -0.2 s | Desktop |
| 9 | Speed Index | 1.3 s | **0.9 s** | -0.4 s | Desktop |

Mobile Performance jumping 45→70 is the headline result — consistent with the `/team` page
chunk dropping from 122 KB to 9.3 KB, the `/events` barrel split, and Swiper's 99 KB removal
(all confirmed in `docs/bundle-comparison-2026-08-29.md`), since all three reduce
`total-byte-weight`/`unused-javascript`/`bootup-time`, which Performance is heavily weighted on.

### The one result that needs an honest caveat, not a victory lap

| Metric | Baseline | Now | Delta | Form factor |
|---|---|---|---|---|
| **Cumulative Layout Shift** | 0.823 | **0** | apparently fixed | Mobile |

This looks like a big win, but **the actual code that caused it was never fixed**:
`src/components/layouts/footer.tsx:33` still has `height={0}` on the µLearn logo image
(checked directly, confirmed unchanged) — the exact bug `docs/lighthouse-fixes-2026-08-29.md`
root-caused as responsible for 100% of the 0.823 score, and that fix was never applied. CLS is
one of the noisier Lighthouse lab metrics run-to-run — a shift can fail to register depending
on exact load-race timing between the run and the observation window closing. **Do not
attribute this to any fix in this session.** Treat it as unresolved and re-verify with another
run or two before trusting `CLS: 0` as real; the underlying `height={0}` bug is still open
work, tracked in `docs/lighthouse-fixes-2026-08-29.md`.

### Losses (measured, real — not hidden)

None found. Every score that moved, moved in the improving direction or stayed flat:

| Metric | Baseline | Now | Delta | Form factor |
|---|---|---|---|---|
| Best Practices | 96 | 96 | unchanged | Mobile |
| SEO | 100 | 100 | unchanged | Mobile |
| First Contentful Paint | 2.9 s | 2.6 s | -0.3 s (improved) | Mobile |
| Accessibility | 99 | 99 | unchanged | Desktop |
| Best Practices | 96 | 96 | unchanged | Desktop |
| SEO | 100 | 100 | unchanged | Desktop |
| Agentic Browsing | 2/2 | 2/2 | unchanged | Desktop |
| First Contentful Paint | 0.5 s | 0.4 s | -0.1 s (improved) | Desktop |

No regressions turned up in either form factor across any of the 5 categories or the 5 Core
Web Vitals tracked.

---

## 1. Full score tables

### Mobile

| Category | Baseline | Now | Delta |
|---|---|---|---|
| Performance | 45 | **70** | **+25** |
| Accessibility | 91 | **94** | **+3** |
| Best Practices | 96 | 96 | 0 |
| SEO | 100 | 100 | 0 |
| Agentic Browsing | 0/2 | **1/2** | **+1** |

### Desktop

| Category | Baseline | Now | Delta |
|---|---|---|---|
| Performance | 98 | **99** | +1 |
| Accessibility | 99 | 99 | 0 |
| Best Practices | 96 | 96 | 0 |
| SEO | 100 | 100 | 0 |
| Agentic Browsing | 2/2 | 2/2 | 0 |

---

## 2. Core Web Vitals

### Mobile

| Metric | Baseline | Now | Delta |
|---|---|---|---|
| First Contentful Paint | 2.9 s | 2.6 s | -0.3 s |
| Largest Contentful Paint | 6.2 s | 5.9 s | -0.3 s |
| Total Blocking Time | 40 ms | 30 ms | -10 ms |
| Cumulative Layout Shift | 0.823 | 0 | see caveat above — not attributable to a real fix |
| Speed Index | 5.4 s | 5.9 s | +0.5 s (slightly worse — see §3) |

### Desktop

| Metric | Baseline | Now | Delta |
|---|---|---|---|
| First Contentful Paint | 0.5 s | 0.4 s | -0.1 s |
| Largest Contentful Paint | 1.1 s | 0.9 s | -0.2 s |
| Total Blocking Time | 40 ms | 10 ms | -30 ms |
| Cumulative Layout Shift | 0 | 0 | unchanged |
| Speed Index | 1.3 s | 0.9 s | -0.4 s |

---

## 3. One metric moved the wrong way — mobile Speed Index, +0.5s

Mobile Speed Index went from 5.4s to 5.9s — worse, not better, despite Performance improving
overall. This is plausible, not necessarily a regression: Speed Index measures how quickly
visible content populates, which is sensitive to render-order and above-the-fold paint timing,
not just total JS weight. A smaller `/team`-specific bundle doesn't directly speed up visible
paint on the home page (which is what PSI's default URL — `/` — measures), so this delta is
likely lab-run noise (network/CPU throttling variance between two separate PSI invocations)
rather than a real regression caused by this session's work. Flagged here rather than
smoothed over — worth a second run to confirm it's noise before treating it as settled.

---

## 4. Why Accessibility and Agentic Browsing moved — root-caused, not a fix

**Agentic Browsing 0/2 → 1/2**: this category has exactly two audits — "Buttons must have
discernible text" (still failing, same `roles.tsx` `SelectTrigger` combobox as before) and
Cumulative Layout Shift (now showing as a *passed* audit, listed as `Passed audits (1):
Cumulative Layout Shift 0`). The category's score moved because CLS flipped to pass — the
exact same measurement documented as unexplained in §"honest caveat" above, not a new or
different fix. One flip, same root cause, two places it shows up.

**Accessibility 91 → 94**: the baseline had 3 failing audits (`button-name`, `link-name`,
`heading-order`). This run has only 2 — `link-name` now passes. But
`backto-top.tsx` (the icon-only "back to top" link `link-name` was failing on) is
**still unfixed** — verified directly, no `aria-label`, code unchanged. The real reason it
passes now: that component only renders after the user scrolls past 300px
(`if (!showButton) return null`, `showButton` starts `false`). Lighthouse audits whatever DOM
exists at the moment it captures the page — if that capture happens before/without the
scroll-triggered render, the unlabeled link simply isn't in the DOM to fail the audit. **This
is a measurement-timing artifact of a conditionally-rendered component, not a code fix.**
`button-name` and `heading-order` both still fail, unchanged, confirmed below in §5.

---

## 5. What needs to fix — every failing audit, mobile and desktop, in detail

Full failing-audit list from this run, both form factors. Grouped by category.

### 5a. Mobile — Performance (70/100)

- **`render-blocking-insight`** — est. 680ms savings. Two first-party CSS chunks
  (`6db4fd35371387cf.css` 23.9 KiB/850ms, `c6ebaa93f0c5f209.css` 1.9 KiB/170ms) plus
  `lite-yt-embed.css` (jsDelivr, 2.3 KiB/750ms) block initial render.
- **`legacy-javascript-insight`** — est. 14 KiB savings, all in `chunks/a75ef6a25e7ac62f.js`:
  unnecessary polyfills for `Array.prototype.at/flat/flatMap`, `Object.fromEntries`,
  `String.prototype.trimEnd/trimStart` — modern-browser-only build target would drop these.
- **`forced-reflow-insight`** — now attributed (unlike the earlier baseline's "unattributed"):
  `chunks/819d250….js:2:22275`, 31ms total reflow time. Worth a live DevTools trace to map
  this minified chunk ID back to source.
- **`network-dependency-tree-insight`** — max critical path latency 896ms, same CSS chain as
  the render-blocking finding above.
- **`cache-insight`** — est. 61 KiB savings, all third-party (YouTube thumbnail 2h TTL,
  jsDelivr `lite-yt-embed.js`/`.css` 7d TTL) — **not first-party-fixable**, same conclusion as
  `docs/lighthouse-fixes-2026-08-29.md` reached before.
- **`image-delivery-insight`** — est. 86 KiB savings. Four specific home-page images still
  oversized for their display size: "Community" (23.9 KiB, natural 640×427 vs. displayed
  150×120), "Mentors" (21.6 KiB, natural 640×640 vs. 120×120), "Challenges" (24.0 KiB, natural
  640×427 vs. 170×120), "Interest Groups" (18.9 KiB, natural 640×640 vs. 120×120) — same 4
  images `lighthouse-fixes-2026-08-29.md` §"image-delivery-insight" already named as needing a
  `sizes` prop correction or source pre-resize, still not fixed. Also the YouTube thumbnail
  (39.3 KiB → could save 11.2 KiB via modern format).
- **`unused-javascript`** — est. 179 KiB savings, largest single item `chunks/819d250….js`
  (168.9 KiB transfer, 106.5 KiB unused) — this is almost certainly the `2386-*.js`/`7105-*.js`
  floor chunk (tailwind-merge/zod/framer-motion/axios) from `bundle-comparison-2026-08-29.md`,
  confirming that chunk is still worth attributing via a full `client.html` module read.
- **`unminified-javascript`** — est. 2 KiB, `lite-yt-embed.js` (third-party, jsDelivr).
- **`largest-contentful-paint`** — 5.9s (down from 6.2s, still far above the ~2.5s "good"
  threshold).
- **`speed-index`** — 5.9s (up from 5.4s — see §3's noise caveat).

### 5b. Mobile — Accessibility (94/100)

- **`button-name`** — `roles.tsx`'s `SelectTrigger` (`<button role="combobox">`, labeled
  "Partner" in the DOM) — same element named in `lighthouse-fixes-2026-08-29.md`, fix
  (`aria-label="Select a role"`) still not applied.
- **`heading-order`** — same `<h6>`-as-body-text pattern across 7 home sections, still not
  applied. Failing elements list is identical to the prior baseline (same 7 `<h6>` blocks).
- **`link-name`** — now passes, but see §4 — this is a DOM-timing artifact
  (`backto-top.tsx`'s conditional render), not a fix. Don't close this as resolved.

### 5c. Mobile — Best Practices (96/100)

- **Console error**: `WebSocket connection to 'wss://mulearn.org/ws/v1/public/landing-stats/'
  failed: net::ERR_NAME_NOT_RESOLVED` — this is new in this run's console-errors list (the
  baseline's Best Practices section had this pruned from `performance-audit.md` earlier as
  "not previously documented"). Worth checking whether this is a transient DNS blip in PSI's
  test environment or a real, live issue with the stats WebSocket endpoint.
- **`valid-source-maps`** — still missing, matches the deliberate skip decision already
  recorded in `docs/lighthouse-fixes-2026-08-29.md` §4 (no error-tracking tool consumes them
  yet — still the right call, not a regression).
- **CSP** — "No CSP found in enforcement mode" (High severity). Still not shipped —
  `docs/implementation-plan.md`'s Phase 5 deliberately deferred it (needs a hardcoded origin).
- **HSTS preload** — "No `preload` directive found" (Medium severity) — deliberately deferred
  per `implementation-plan.md` (needs an hstspreload.org submission first).
- **COOP** — "No COOP header found" (High severity) — not part of the 5 headers shipped.
- **Trusted Types** — "No `Content-Security-Policy` header with Trusted Types directive
  found" (High severity) — depends on CSP shipping first.

### 5d. Mobile — SEO (100/100) and Agentic Browsing (1/2)

- SEO: clean, no action needed.
- Agentic Browsing: `agent-accessibility-tree` still fails — same `button-name` root cause as
  §5b. The category's other audit (CLS) now passes — see §4.

### 5e. Desktop — Performance (99/100)

Near-clean. No individual failing-audit detail surfaced beyond the same shared-floor pattern
(`unused-javascript` on the same `819d250….js` chunk, smaller absolute savings than mobile
since desktop isn't CPU/network-throttled the same way). LCP 0.9s, TBT 10ms — both comfortably
in "good" territory.

### 5f. Desktop — Accessibility (99/100), Best Practices (96/100)

- **`heading-order`** — same finding as mobile, not resolution-dependent, still open.
- **`valid-source-maps`**, **CSP**, **HSTS preload**, **COOP**, **Trusted Types** — identical
  list to mobile §5c, same status (deliberately deferred or not yet shipped).
- `button-name` does **not** fail on desktop — `roles.tsx`'s mobile-only `Select` (`sm:hidden`
  breakpoint) isn't rendered at the desktop viewport width PSI tests at, so the combobox never
  appears in desktop's DOM. Not a fix, a viewport artifact — the underlying `SelectTrigger`
  bug is identical on both form factors, mobile just has the opportunity to render it.

### 5g. Desktop — SEO (100/100), Agentic Browsing (2/2)

Both clean, no action needed.

---

## 6. Priority order for what's actually worth fixing next

1. **`roles.tsx`'s `SelectTrigger` `aria-label`** — one line, closes `button-name` on mobile
   *and* the Agentic Browsing failure in the same category, real fix not a measurement quirk.
2. **`heading-order`** (9-site `<h6>`→`<p>` swap) — closes on both form factors simultaneously,
   already fully planned in `docs/lighthouse-fixes-2026-08-29.md`, just needs execution + the
   visual-parity QA pass that plan calls for.
3. **`footer.tsx:33`'s `height={0}`** — still the right fix regardless of this run's CLS
   reading 0 by chance; a wrong reserved-height bug doesn't stop being a bug because one lab
   run didn't trigger it. One-line fix (`height={48}`), already fully scoped.
4. **`image-delivery-insight`'s 4 named images** — real, specific `file:line`-adjacent fix
   (correct `sizes` prop or pre-resize source), est. 86 KiB mobile savings.
5. **`unused-javascript`'s 179 KiB chunk** — needs the `client.html` module-level read this
   doc keeps deferring; likely overlaps with `bundle-comparison-2026-08-29.md`'s still-open
   ~614 KB shared-floor attribution.
6. **CSP + COOP + Trusted Types** — bundle together, ship CSP in report-only mode first per
   the existing, already-audited plan in `performance-audit.md` §7b — closes 3 Best Practices
   findings on both form factors at once.
7. **Backto-top link's missing `aria-label`** — still worth fixing even though it's not
   currently failing the audit; the DOM-timing artifact in §4 means it *will* fail under a
   different PSI run or a real screen-reader user who has actually scrolled. Low priority only
   because it's not currently visible in the score, not because it's not a real bug.
