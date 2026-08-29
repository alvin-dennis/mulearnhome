# Lighthouse Fixes — 2026-08-29

> Fix plan for issues found in `docs/lighthouse-audit-2026-08-29.md`. Not applied yet — planning
> doc, execute per item below.

---

## 1. Mobile CLS 0.823 — footer logo unsized image (root cause found)

PSI's "Layout shift culprits" audit attributes **all 0.823 of the mobile CLS score to a single
element**: the `<footer>`, flagged "Unsized image element" for the µLearn logo `<img>` inside it.

**Root cause:** `src/components/layouts/footer.tsx:29-35`

```tsx
<MuImage
  src="/assets/logo.webp"
  alt="µLearn Logo"
  width={180}
  height={0}
  className="object-contain"
/>
```

`height={0}` is a hardcoded literal, not a runtime/data bug. Next's `<Image>` (via `MuImage`)
reserves layout space from `width`/`height` before the image loads — with `height={0}` it reserves
zero vertical space, so the footer renders collapsed then jumps open once `/assets/logo.webp`
finishes loading. Footer is present on every route, so this inflates CLS site-wide, not just home.

`public/assets/logo.webp` is **1578×424px** (confirmed via PIL). At rendered `width={180}`, correct
proportional height is `180 × 424/1578 ≈ 48.4` → **`height={48}`**.

- [ ] **Fix:** `footer.tsx:33` — change `height={0}` → `height={48}`. One-line, zero visual change
      (image already renders at correct aspect ratio once loaded — this only fixes reserved space
      pre-load). Expected result: mobile CLS collapses from 0.823 toward 0.
- [ ] **Verify:** re-run PageSpeed Insights mobile against the deployed fix; confirm CLS ~0 and
      Performance score recovers from 45 toward the 91 baseline (CLS scored at 0.04 weight-wise is
      large; TBT/LCP also flagged separately — see audit doc §4, may need follow-up beyond this fix).

**Acceptance criteria:** mobile CLS audit passes (score 1.00); footer renders at final size on
first paint, no layout jump.

**Confirmed single culprit:** PSI's layout-shift-elements audit attributes 100% of the 0.823 score
to this one element — no other element is listed as contributing. The separate "Avoid
non-composited animations" audit (8 elements with `transition-all` on `font-size`/`letter-spacing`)
is unscored/informative, not counted toward the CLS score — not a contributor here.

**Related but out of scope for this fix (different route, not part of the measured 0.823):**
`src/features/community-partners/components/community-partners-view.tsx:66-67` — same
`width={0} height={0}` pattern on a GIF (`Coding Workshop Animation`), on `/partners/community-partners`,
a route not covered by this audit. Flagging since it's the identical bug shape; not fixing here —
would need its own before/after CLS check on that route since `width=0 height=0` combined with
CSS-driven sizing (`w-full h-auto`) may or may not need the same numeric-height fix depending on
how that layout reserves space. Separate follow-up, not blocking the footer fix above.

---

## 2. Accessibility — `button-name`, `link-name` (mobile Accessibility 91, Agentic Browsing 0/2)

Both root causes found and element-localized from the PSI failing-elements list (not guesswork).

### 2a. `button-name` — role="combobox" Select trigger has no accessible name

**Root cause:** `src/features/home/components/roles.tsx:49-52` — the mobile-only role picker:

```tsx
<Select value={activeRole} onValueChange={(v) => setActiveRole(v)}>
  <SelectTrigger className="w-[200px] border-mulearn shadow-[0_4px_16px_rgba(60,130,246,0.18)] text-mulearn">
    <SelectValue placeholder="Select Role" />
  </SelectTrigger>
  ...
```

PSI's failing-element snippet is `<button type="button" role="combobox" ...>` with visible text
"Partner" (the selected role) — this is this exact Radix/shadcn `SelectTrigger`. The visible text
comes from `SelectValue`'s rendered content, but axe/Lighthouse still reports it as nameless (a
known Radix `Select` quirk: the trigger's accessible name isn't reliably computed from the nested
`SelectValue` span in all render states). The robust fix is an explicit `aria-label`, which always
wins regardless of that internal quirk.

- [ ] **Fix:** add `aria-label="Select a role"` to the `SelectTrigger` at `roles.tsx:50`.

### 2b. `link-name` — icon-only "back to top" link has no accessible name

**Root cause:** `src/components/layouts/backto-top.tsx:27-34` — icon-only floating link, no text,
no `aria-label`:

```tsx
<Link
  className="p-2.5 flex justify-center bg-mulearn rounded-[140px] fixed bottom-3 right-6 md:bottom-20 md:right-10  cursor-pointer"
  href="#home"
>
  <MoveUp className="w-6 h-6 md:w-8 md:h-8 text-mulearn-whitish" />
</Link>
```

PSI's failing element is exactly this: `<a class="p-2.5 flex justify-center bg-mulearn rounded-[140px] fixed bottom-3 right-…" href="#home">` with no text content, only the `MoveUp` icon.

- [ ] **Fix:** add `aria-label="Back to top"` to the `Link` at `backto-top.tsx:28`.

### 2c. Downstream: `agent-accessibility-tree` / Agentic Browsing 0/2

PSI's Agentic Browsing category names the *same* `button role="combobox"` element (2a) as its
sole failing audit ("Buttons must have discernible text"). No separate fix — 2a's `aria-label`
resolves this too. No action needed for `heading-order`'s effect here since Agentic Browsing didn't
name it as a failing audit in this run.

**Acceptance criteria:** `bunx biome check .` unaffected (these are runtime a11y attributes, not
lint-caught); re-run PSI mobile — `button-name`, `link-name` pass, Agentic Browsing recovers toward
2/2, Accessibility recovers toward 96+.

---

## 3. Accessibility — `heading-order` (mobile + desktop, both failing)

**Root cause:** page sections use `<h6>` as a *body-text/description* element directly under an
`<h2>` section title, skipping h3-h4-h5 — not a numbering typo, a structural pattern repeated
across the home page. Confirmed in `src/app/globals.css:229-231`: `h6` shares `h5`'s base style
(`text-base font-medium`) and is excluded from the `h1-h5` display-font rule at line 49-55 — i.e.
`<h6>` was already being used here as styled paragraph text, not a real heading level 6.

9 occurrences across 8 files, all in `src/features/home/components/`:
`community.tsx`, `stats.tsx`, `story.tsx`, `opportunities.tsx`, `gallery.tsx`,
`special-events.tsx`, `features.tsx`, `roles.tsx` (`roles.tsx:42`'s
`<h6 className="text-[1.2rem] text-mulearn-gray-600 mt-2.5">` is one of PSI's named failing
elements).

- [ ] **Fix:** change each of the 9 `<h6>` description elements to `<p>`. This is the semantically
      correct fix (they are body text, not headings) rather than renumbering to `<h3>`, which would
      be wrong too (they aren't sub-headings of anything).
- [ ] **Visual parity check required, not "zero visual change":** `<h6>`'s Tailwind base is
      `text-base font-medium text-mulearn-blackish`; `<p>`'s base is `text-base leading-relaxed`
      (no `font-medium`, different line-height, and relies on inherited color rather than
      `text-mulearn-blackish`). Each of the 9 call sites already overrides size/color via its own
      `className` (e.g. `text-mulearn-gray-600`, `text-[1.2rem]`), but none override
      `font-weight`/`leading` — **add `font-medium` explicitly to each converted element's
      className to preserve current weight**, and screenshot-diff each of the 8 files' rendered
      section before/after (dev server + browse skill) rather than assuming the swap is invisible.

**Acceptance criteria:** `heading-order` audit passes on both mobile and desktop; visual diff of
all 8 affected home sections shows no unintended change (font weight, line-height, color all match
pre-fix).

---

## 4. Best Practices — `valid-source-maps` — deliberately not fixed

Checked: no `sentry`/`@sentry` anywhere in this repo — no error-tracking tool exists that would
consume production source maps. The only benefit of `productionBrowserSourceMaps: true` today is
making one Lighthouse gauge green; the real use case (readable stack traces from prod errors) has
no consumer. It's also not free — publishes full unminified source (file paths, component/variable
names, comments) to anyone who requests `<chunk>.js.map`, plus deploy-size cost.

**Decision: skip.** Leave `productionBrowserSourceMaps` unset. Revisit only if/when this app adds
Sentry or similar — turn it on then, alongside that work, not before. `valid-source-maps` stays a
known, deliberately-unfixed Best Practices finding.

---

## 5. Performance — bundle/render/caching audits (cross-referenced, not duplicated)

Most of the 17 remaining Performance-category failing audits (mobile: `mainthread-work-breakdown`,
`bootup-time`, `unused-javascript`, `render-blocking-insight`, `lcp-discovery-insight`,
`lcp-breakdown-insight`, `network-dependency-tree-insight`, `unminified-javascript`,
`cache-insight`, `image-delivery-insight`, `legacy-javascript-insight`; desktop: the same set minus
the JS-execution-time ones) are **Lighthouse's current audit-id naming for problems already planned
in `docs/implementation-plan.md`** — fixing them here would duplicate that doc. Mapping, so nothing
gets fixed twice:

| PSI audit | Already planned as |
|---|---|
| `unused-javascript`, `mainthread-work-breakdown`, `bootup-time` | `implementation-plan.md` Phase 2 (client-bundle/data-boundary fixes) + Phase 7 (Swiper→Embla, react-icons→lucide-react) |
| `render-blocking-insight`, `lcp-discovery-insight`, `lcp-breakdown-insight`, `network-dependency-tree-insight` | `implementation-plan.md` Phase 3 (`EventsView` Suspense/streaming) — same render-blocking/critical-path root cause class |
| `legacy-javascript-insight`, `unminified-javascript` | Covered by Phase 2's `experimental.optimizePackageImports` + standard Next.js prod minification; `legacy-javascript-insight`'s 14 KiB flags polyfills for `Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `String.prototype.trimStart/End` — worth a `browserslist` check in `package.json` if not already scoped to modern browsers only |
| `cache-insight` | Not yet planned anywhere — **new finding**, see below |
| `image-delivery-insight` | Partially planned (`performance-audit.md` §9a covered asset-pipeline resizing); **new specific images found**, see below |

**New, not yet in any doc:**

- [ ] **`cache-insight` (est. 60-61 KiB savings, both mobile/desktop):** PSI names 4 specific
      under-cached resources: YouTube thumbnail `sddefault.webp`/`hqdefault.jpg` from `i.ytimg.com`
      (2h TTL — third-party, not fixable from this codebase) and JSDelivr's `lite-yt-embed.js`/
      `.css` (7d TTL — also third-party). **No first-party fix available** — both flagged resources
      are third-party CDN responses this app doesn't control the cache headers for. Not actionable;
      document as a known, accepted limitation rather than a to-do.
- [ ] **`image-delivery-insight` (est. 96-212 KiB savings):** PSI names specific oversized images on
      the home page beyond what `performance-audit.md` §9a's asset-pipeline pass already covered:
      "Community" (23.9 KiB, displayed 150×120 but natural 640×427 — not resized to display size),
      "Mentors" (21.6 KiB, displayed 120×120, natural 640×640), "Challenges" (24.0 KiB, displayed
      170×120, natural 640×427), "Interest Groups" (18.9 KiB, displayed 120×120, natural 640×640) —
      these are `src/features/home/data/home.data.ts`-sourced S3 images rendered via `MuImage`'s
      `srcset`, but the `sizes` attribute (`(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 40vw`)
      is generating a srcset step much larger than the ~120-170px display size on mobile — either
      the `sizes` value is wrong for this component's actual layout, or the source S3 images
      themselves need pre-resizing (same class of fix as §9a's asset-pipeline work, but a different
      set of images than what that pass covered). Also flagged: `muloader.gif` (143 KiB) —
      recommend converting to a video format or lighter-weight loader, per PSI's own suggestion.
      **Needs a decision, not just a mechanical fix** — find the exact `<img>` call sites in
      `src/features/home/components/` that render these 4 cards and correct their `sizes` prop to
      match actual rendered width, or pre-resize the S3 source images.

**Acceptance criteria for this section:** re-run `bun run analyze` (Phase 2/7 already have this as
their acceptance step) and a fresh PSI pass — mobile Performance score should climb once §1's CLS
fix, Phase 2/3/7's bundle work, and the `image-delivery-insight` fix above all land together;
`cache-insight`'s two flagged resources stay open as accepted third-party limitations.

---

## 6. Performance — `forced-reflow-insight` (mobile + desktop, unattributed)

PSI reports this audit failing on both form factors but with **no attributable source** — its
detail table shows `Source: [unattributed], Total reflow time: 55 ms`. Lighthouse's static/network
trace analysis can't point to a specific script or component for this one; a forced reflow (JS
reading `offsetWidth`/`getBoundingClientRect`/etc. right after a DOM mutation) needs a live Chrome
DevTools Performance-panel trace to localize to a `file:line`, which static PSI data can't provide.

- [ ] **Not fixable from this audit's data.** Needs a manual DevTools Performance recording
      (Record → interact with the page → look for "Forced reflow" warnings in the flame chart) to
      identify the actual call site before any fix can be proposed. Add to
      `implementation-plan.md`'s "Manual-verification-only items" list rather than treating as a
      known, source-locatable bug.

---

## Summary — execution order

1. **§1 CLS fix** (`footer.tsx` `height={0}`→`{48}`) — highest ROI, one line, directly explains most
   of the mobile Performance score collapse.
2. **§2 accessible names** (`roles.tsx` `aria-label`, `backto-top.tsx` `aria-label`) — two one-line
   fixes, resolves `button-name`, `link-name`, and Agentic Browsing in one pass.
3. **§3 heading order** (9-site `<h6>`→`<p>` swap + visual QA) — mechanical but needs a real
   before/after visual check per file, not a blind find-replace.
4. **§5 image-delivery `sizes` fix** — needs the exact home-section call sites identified before
   editing; do after 1-3 land and are verified, so the next PSI re-run isolates this fix's effect.
5. **§5 bundle/render items** — already owned by `implementation-plan.md` Phases 2/3/7, execute
   there, don't duplicate.
6. **§6 forced-reflow** — blocked on a manual DevTools trace; not actionable yet.

**§4 source maps — skipped, not scheduled** (no error-tracking consumer exists; revisit only if
Sentry/similar gets added).

After each item (or logical group), re-run PageSpeed Insights mobile+desktop
(`https://pagespeed.web.dev/analysis?url=...`) and update `docs/lighthouse-audit-2026-08-29.md`'s
scores, the way `docs/implementation-plan.md`'s Verification section already prescribes for its own
phases — don't assume, measure.
