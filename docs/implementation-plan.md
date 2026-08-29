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

## 0. Already done

| Item | Evidence |
|---|---|
| `@next/bundle-analyzer` wired into `next.config.ts` (`withBundleAnalyzer`, gated on `ANALYZE=true`) + `package.json`'s `analyze` script | `bundle-analysis.md` §1, §10 |
| Phase 4 — all of SEO (canonical, title/description/keywords, twitter card, viewport, `sitemap.ts`/`robots.ts`, heading hierarchy). JSON-LD skipped by decision. | See Phase 4 below |

Everything else below is **documented, not applied**.

---

## Phase 0 — Verify before touching prod (blocking, do first, cheap)

Both items are read-only checks that determine *which* variant of a later fix to apply — skipping
them risks picking the wrong option in Phase 1 or shipping a fix for a non-bug.

- [ ] **DNS check for the image-optimizer bug.** Run `dig s3.ap-south-1.amazonaws.com` and
      `dig s3.ap-south-1.amazonaws.com @8.8.8.8` from inside every deploy environment (local, CI,
      staging, prod). If one environment's result lands in a private range (`10.0.0.0/8`,
      `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`), that's the affected one — confirms
      Phase 1's Option B is safe to scope narrowly and tells you exactly which target needs it.
      *(`performance-audit.md` §2.3)*
- [ ] **Live DevTools check for the possibly-orphaned React DOM chunk.** Load a static content
      page, `/campus-logo-generator`, `/contact`, and `/team` with DevTools Network open, filter
      for `framework-`, and confirm whether `framework-*.js` (189KB, a second, separate React DOM
      + React + Scheduler build) is ever actually requested. Static analysis found it referenced
      by zero generated route HTML and zero other chunk — but that's not proof it never loads
      (could be a route generated after the build, or an edge-case dynamic import). If it never
      loads: dead build output, harmless, skip. If it does load: a genuine ~189KB duplicate-React
      bug, likely caused by `html-to-image` or `react-google-recaptcha-v3` importing `react-dom`
      directly instead of through Next's client runtime — chase down which one.
      *(`bundle-analysis.md` §3)*

---

## Phase 1 — Critical: image optimization (highest impact, lowest risk — do this first)

**Why first:** live-confirmed by Lighthouse to be worth **4.58MB** ("Improve image delivery") +
**4.70MB** ("efficient cache lifetimes") on just 5 CDN images, out of a **5.4MB total page
payload** — over 85% of one page's weight from one bug. Fails 3 separate weighted Performance
audits simultaneously (`uses-optimized-images`, `modern-image-formats`, `prioritize-lcp-image`)
plus 1 Best Practices audit (`image-aspect-ratio`), site-wide, in one root cause.
*(`performance-audit.md` §2, §9 priority 1, §10 9a, §11a)*

**Root cause:** `src/components/layouts/mu-image.tsx:112-135` force-sets `unoptimized: true` for
every image whose hostname is `s3.ap-south-1.amazonaws.com` — which is every CDN image on the
site, since `NEXT_PUBLIC_CDN_URL` resolves to exactly that host. This was a workaround for Next's
SSRF guard (refuses to fetch a URL resolving to a private IP) triggering in one environment at
some point; the fix chosen disables optimization **everywhere, permanently**, instead of scoping
to the one affected environment. `next.config.ts`'s `images.remotePatterns` already allow-lists
this host correctly — `mu-image.tsx` overrides it before that config gets a chance to apply.

- [ ] **Remove the private-IP hostname-sniffing block** (`mu-image.tsx:112-135`). Recommended:
      **Option B** — delete the `shouldUnoptimized` detection entirely; let the existing
      `unoptimized` prop (already part of `ImageProps`, already spread through via `...rest`,
      already used explicitly at 6 call sites today — `community-card.tsx:20`,
      `be-a-part/company/hero.tsx:125`, `be-a-part/company/change.tsx:162`,
      `text-testimonial-card.tsx:161`, `artofteaching/hero.tsx:60`, `mu-loader.tsx:11`) be the
      only control, defaulting to optimized. Zero new prop, zero new env var, no
      environment-dependent implicit behavior — a caller that hits the private-IP guard in a
      specific environment opts out explicitly at that one call site.
      *(`performance-audit.md` §2.2 Option B)*
      - Only pursue **Option A** (real CDN in front of S3 — CloudFront + a real
        `cdn.mulearn.org` subdomain, matching the code's own dead `cdn.mulearn` branch's implied
        intent) if Phase 0's DNS check shows this is a recurring, environment-independent problem
        worth infra investment. This is the structurally correct long-term fix but requires infra
        provisioning — don't block Phase 1 on it.
- [ ] **Delete the 2 dead branches** regardless of which option chosen: `host.endsWith("cdn.mulearn")`
      and `host.includes("cdn.mulearn")` (`mu-image.tsx:112-135`) — can never match while
      `NEXT_PUBLIC_CDN_URL` points at raw S3; keeping them signals an unfinished migration that
      isn't in progress.
- [ ] **Replace the fake `preload` prop with real `priority`.** `mu-image.tsx` never reads a
      `preload` prop — it's spread straight to the DOM as an inert attribute. 15 files pass it,
      including hero/above-the-fold sections (`home/components/hero.tsx`,
      `be-a-part/components/campus/hero.tsx`, `layouts/navbar.tsx` ×2,
      `app/impact-gallery/page.tsx`, full list via `grep -rln "preload" src/`). Swap each to the
      real `priority` prop (currently used only twice, both `priority={false}` —
      `be-a-part/components/learners/cta.tsx:43`, `ui/state-display.tsx:115`) on genuinely
      above-the-fold images only. *(`performance-audit.md` §2.4)*
- [ ] **`MuImage` production hardening** — do in this order, tests last so cleanup doesn't lock
      in the current bugs as "expected":
      1. Delete dead fill-dimension code (`mu-image.tsx:83-102` — two blocks that set
         `width`/`height` to `"auto"`, both unconditionally erased by the block at 108-111 that
         runs right after) and the duplicate `isFill` re-declaration at line 88 (already computed
         at line 27). Pure no-op deletion, zero behavior change.
      2. Fix the Tailwind class-detection gap: `hasH`/`hasW` (lines 44-55) only match tokens
         starting literally with `"h-"`/`"w-"`, missing responsive (`md:h-64`) and arbitrary
         (`h-[200px]`) variants — a real layout-shift risk at specific viewport widths. Widen the
         matcher (e.g. `/(^|:)h-/`) or require an explicit prop from the caller instead of
         string-parsing class names.
      3. Stop silently defaulting `alt` to `""` (line 104) — currently converts a genuinely
         missing alt on a content image into a silent "decorative" accessibility bug. Either let
         the TS requirement stand with no runtime fallback, or add a dev-only `console.warn`.
      4. Add a dev-only `console.warn` when `fill && !sizes` — catches the gap at the source
         instead of relying on every future call site remembering.
      5. Add an `onError` fallback (shared placeholder swap) — currently a failed fetch falls
         through to the browser's default broken-image icon.
      6. Add a focused test file covering the width/height/style/fill prop matrix, written after
         steps 1-2 land.
      *(`performance-audit.md` §2.5-2.6)*
- [ ] **Add `sizes` to all 15 `fill`-mode call sites** — zero exist today across all 72 `MuImage`
      usages (`team-card.tsx:45`, `gallery-sneak-peek.tsx:31`, `company-card.tsx:34`,
      `company-partners-view.tsx:43`, `cta.tsx:41`, `success-stories.tsx:57`,
      `mission-and-growth.tsx:142`, `interest-groups-view.tsx:300`, `home/gallery.tsx:102`,
      `special-event-card.tsx:32`, `video-section.tsx:131`, `action.tsx:45`, `media-card.tsx:33`,
      `campus-logo-generator-view.tsx:15`, `impact-gallery/page.tsx:70`). Without it, Next assumes
      `100vw` for every one, generating an oversized `srcset` regardless of actual rendered size.
      One-line addition per site (e.g. a 3-column grid card:
      `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"`) — no restructuring.
      Best effort-to-impact ratio in this entire plan (~15 min total).
      *(`performance-audit.md` §9a.3)*

**Acceptance criteria:** re-run the live Lighthouse test (or `next build` + local Lighthouse) —
"Improve image delivery" and "Use efficient cache lifetimes" line items should disappear or drop
to near-zero for the 5 images measured in §11a; `view-source:` on any CDN image shows a
`/_next/image?url=...` src, not the raw S3 URL.

---

## Phase 1a — Image asset pipeline (comparable impact to Phase 1, different mechanism)

Hits `/gallery` specifically, independent of the CDN-optimizer bug above (these are **local**
paths under `public/`, not CDN URLs, so they already go through Next's real optimizer — the
problem is the *source* files themselves).

**WebP compression covered both ways:** existing oversized `.webp` masters get re-exported
(below), and `optimize-images.ts` gets a `.webp` match case added so future oversized webp files
are caught by the script too, not just `.png`/`.jpg`.

- [ ] **Re-export oversized `public/assets/gallery/` masters.** 44 of 84 `.webp` files are over
      2MB, several over 10MB (`dod/4.webp` 13MB, `dod/5.webp` 11MB, `launchpad2024/5.webp` 9.6MB).
      Next has to decode/re-encode these on every first request for ~16 size/format variants —
      real, avoidable CPU/TTFB cost on top of the CDN bug. Re-export at realistic display
      dimensions, target ~300-500KB per master. Separately: `public/` is 284MB, `.git` is 493MB
      (largely these binaries in history) — consider moving `public/assets/gallery/` to the same
      S3/CDN origin (`cdnUrl()`) used everywhere else instead of bundling into the app repo.
      *(`performance-audit.md` §9a.1)*
- [ ] **Fix `scripts/optimize-images.ts`** (wired to `bun run optimize:images`, a working
      Sharp-based converter that has never touched the files above):
      1. `fs.readdir` (line 46) is non-recursive — change to
         `fs.readdir(fullPath, { recursive: true })` (Node 20+ native; `package.json`'s
         `engines.node` already requires `>=20.0.0`, no new dependency).
      2. Delete the dead `src/modules/Public/Home/assets` entry (line 37) — pre-migration path
         that never existed as a real directory, silently swallowed by a `try/catch`.
      3. Add a `.webp` match case so already-oversized `.webp` masters get re-compressed too, not
         just `.png`/`.jpg`.
      4. Wire into CI (`.github/workflows/pr-validation.yml` currently has no reference to it) or
         at minimum a pre-commit hook — "remember to run manually" is how the 44 files above
         accumulated in the first place.
      *(`performance-audit.md` §9a.2)*

**Acceptance criteria:** `du -sh public/assets/gallery` drops substantially; every file in that
directory has a `.webp` sibling under the new size ceiling; CI fails if a new oversized master is
committed (once wired in).

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

## Phase 3 — Rendering / streaming

- [ ] **Wrap `EventsView` in `<Suspense>` + a real `loading.tsx`/skeleton.** `/events`
      (`src/app/events/page.tsx` → `EventsView`) does a real `Promise.allSettled([...])` backend
      fetch with zero `<Suspense>` boundary anywhere in the app except the app-shell-level one in
      `layout.tsx` (a `MuLoader` fallback, not per-route streaming) — confirmed zero
      `loading.tsx` files exist anywhere in `src/app`. Requires splitting `EventsView` so static
      hero/heading markup renders outside the boundary and only the fetch-dependent list sits
      inside it — a real refactor, code shape already drafted. *(`performance-audit.md` §6b, §9
      priority 5)*

**Acceptance criteria:** navigating to `/events` paints the hero/heading immediately; the event
list streams in behind its own skeleton rather than blocking the whole page.

---

## Phase 4 — SEO ✅ done (2026-08-29)

Canonical bug, title/description/keywords, twitter card, viewport, `sitemap.ts`/`robots.ts`, and
heading hierarchy all shipped. Structured data (JSON-LD) was considered and deliberately **not**
done — narrow upside (mainly Google Jobs indexing for `/careers`), not worth it for this site;
revisit only if that specific need comes up. Full detail: `feature-folder-structure.md`'s SEO
section.

---

## Phase 5 — Security headers

Currently **zero security headers ship anywhere** — no `headers()` in `next.config.ts`, no
`middleware.ts`. Live-confirmed by Lighthouse Best Practices: CSP/COOP/clickjacking(XFO or
CSP)/Trusted Types all flagged missing. *(`performance-audit.md` §7-8, §9 priority 6a, §11b)*

- [ ] **Ship 5 non-CSP headers immediately** (zero risk, add to `next.config.ts`'s `headers()`):
      - `X-DNS-Prefetch-Control: on`
      - `Strict-Transport-Security: max-age=63072000; includeSubDomains` — **no `preload` yet**,
        see below.
      - `X-Frame-Options: SAMEORIGIN`
      - `X-Content-Type-Options: nosniff`
      - `Referrer-Policy: strict-origin-when-cross-origin` (upgraded from a weaker proposed
        default)
      - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` (app
        uses none of these — confirmed via grep, safe to disable all)
      - Do **not** add `X-XSS-Protection` — deprecated, removed from all modern browser engines,
        cargo-cult at best.
- [ ] **Ship CSP in `Content-Security-Policy-Report-Only` mode first.** Full directive set
      already audited against this app's actual third-party surface (GA, reCAPTCHA v3, YouTube
      embeds, the raw WebSocket stats connection, every `remotePatterns` host) — exact block
      drafted in `performance-audit.md` §7b. **Do not ship enforcing mode directly to
      production** — a wrong CSP fails silently (blocked script just doesn't run, no visible
      error): GA would stop recording, the WebSocket stats hook would show its error fallback
      forever, reCAPTCHA would block the contact form with no visible reason. Monitor report-only
      violations for a few days, then flip to enforcing.
- [ ] Add `preload` to the HSTS directive **only** after a deliberate submission at
      hstspreload.org — it's effectively permanent and covers every subdomain
      (`includeSubDomains`) forever, including any future HTTP-only internal/staging subdomain.
- [ ] Note: real nonce-based CSP (removing `'unsafe-inline'` from `script-src`) requires
      `middleware.ts`, which doesn't exist today — `contact-view.tsx:93` already has
      `nonce: undefined` hardcoded, suggesting this was considered and shelved. Treat as separate,
      deliberate follow-up work, not part of this phase.

**Acceptance criteria:** live Lighthouse Best Practices CSP/clickjacking/COOP audits pass; GA,
reCAPTCHA, WebSocket stats hook, and all 4 YouTube embeds confirmed still functional after CSP
enforcement (not just report-only).

---

## Phase 6 — Codebase health / cleanup

- [ ] **`lib/sanitize.ts` has zero consumers.** `privacy-policy-view.tsx` (lines 15, 25) and
      `refund-policy-view.tsx` (lines 15, 56) use `dangerouslySetInnerHTML` with their own local
      `formatText` instead of the shared sanitizer. Content is static/trusted today (low real
      risk), but decide: route `formatText` through `lib/sanitize.ts`, or remove the sanitizer if
      genuinely unneeded. *(`performance-audit.md` §5)*
- [ ] **Remove 7 debug `console.log`s** in `campus-logo-generator-view.tsx` (lines 203, 206, 232,
      235, 238, 245, 255 — download/image-generation flow, distinct from the legitimate
      `catch`-block `console.error` calls elsewhere in the codebase, which stay).
- [ ] **Remove unused `localFont` import** in `src/app/layout.tsx:2` — imported, never invoked.
- [ ] **Fix 9 accessibility lint warnings** (`bunx biome check .`):
      - `useButtonType` ×4 — add `type="button"`: `cookie-preferences-modal.tsx:162`,
        `debug-panel.tsx:137,148,217`.
      - `useKeyWithClickEvents` ×4 — add keyboard handler or swap for a real `<button>`:
        `navbar.tsx:200,214,228`, `team-card.tsx:74`.
      - `noSvgWithoutTitle` ×2 — add `<title>` inside the inline `<svg>`:
        `interest-groups-view.tsx:114`, `levelstructure-view.tsx:100,116`.
- [ ] **Donation form double-submit guard.** `donation-form.tsx`'s submit button is only disabled
      via `!isValid || totalAmount === 0` — not while the async `submitDonationForm`/
      `submitSubscription` request (a real Razorpay payment flow) is in flight. A double-click can
      fire the payment-order request twice. `contact-form.tsx` already has the correct
      `isSubmitting`-disable pattern — copy it. *(`feature-folder-structure.md` "Bonus finding")*

**Acceptance criteria:** `bunx biome check .` warning count drops by 9; rapidly double-clicking
"Donate" on a valid form fires exactly one payment request, not two.

---

## Phase 7 — Dependency swaps (decided: do these two)

Swiper→Embla and react-icons→lucide-react are approved — do both. The third investigated item
(scoped `events.api.ts` axios→fetch conversion) is dropped, not needed.

- [ ] **Swiper → Embla Carousel migration.** Measured case: current Swiper usage costs ~360KB
      (`6993-*.js`); even after Phase 2's `optimizePackageImports` fix, Swiper's non-negotiable
      core alone is ~170-190KB; Embla's entire footprint (core + react + autoplay) is an estimated
      ~15-25KB — roughly **7-10x smaller** for the exact feature set this codebase uses (all 3
      call sites confirmed to need only `Autoplay`/`Navigation`/`Pagination`, all of which have a
      direct Embla equivalent). Real porting cost: 3 files, one shared wrapper absorbs most
      complexity, manual QA needed on the 2 `loop`-mode carousels (Embla's loop mechanics differ
      from Swiper's slide-cloning). Full pros/cons, bundle comparison table, and 5-step migration
      plan already drafted in `bundle-analysis.md` §7. **Recommendation:** land Phase 2's
      `optimizePackageImports` regardless (zero-risk either way); treat Embla as a separate,
      scheduled effort, not a blocking dependency of anything above.
- [ ] **`react-icons` → `lucide-react` + inline brand SVGs.** `lucide-react` is already installed
      and already on Next's default `optimizePackageImports` list (automatic per-icon
      tree-shaking); `react-icons` is not. All 7 call sites use single icons; 4 non-brand icons
      (`FiCalendar`→`Clock`, `BiSolidRightArrow`→`ArrowRight`, `FaMapMarkerAlt`→`MapPin`, etc.)
      have direct Lucide equivalents; 6 brand logos (GitHub/LinkedIn/Twitter/Facebook/
      Instagram/YouTube) need small hand-written inline SVGs sourced from official brand marks.
      **This is an estimate, not a measurement** — `react-icons` never surfaced as its own
      attributed chunk in the analyzer run; likely low tens of KB, plus the win of dropping an
      entire dependency. Migration shape drafted in `bundle-analysis.md` §8.

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

- **After every bundle-affecting fix** (Phase 1's image work, Phase 2's config/splitting changes,
  Phase 7's Swiper/react-icons work if pursued): re-run `bun run analyze` and confirm the measured
  delta against the baseline numbers in `bundle-analysis.md`. Don't assume — measure.
- **Phase 4 (done):** Google Search Console URL Inspection, run per route, should confirm the
  rendered canonical matches that route's own URL — do this once live.
- **After Phases 1-5 land**: a fresh live Lighthouse run (mobile + desktop) against representative
  page templates (home, a static content page, `/events`, `/team`, `/contact`) is the final gate —
  this is the only way to confirm the manual-verification-only items above, and to confirm the
  cumulative score movement from the 91/96/100/100 baseline in §11.
- **Execution order reference:** `performance-audit.md` §9e already sequences every fix so no file
  needs to be opened twice (image fix → SEO metadata pass → security headers → sitemap/robots →
  accessibility mechanical fixes → Suspense/pagination refactors → structured data → manual
  verification last). The phase numbering in this doc mirrors that order; follow it rather than
  re-deriving a sequence.
