# Performance & Codebase Audit

> Read-only audit. No fixes have been applied as part of this document — it exists to
> record findings with exact `file:line` references so they can be prioritized and fixed
> later. Prompted by a user report: "UI is loading but images are slow."

---

## 1. Summary

Images are slow because of a single, high-impact bug: the shared `MuImage` component
force-disables Next.js's image optimizer for every image served from the project's CDN —
which is the overwhelming majority of images on the site. That bug is detailed in §2. A
secondary contributor is that hero/above-the-fold images are marked with a prop
(`preload`) that isn't real and is silently ignored, so they load lazily instead of eagerly.

Beyond images, a deeper bundle-level pass (§5) found two large static-data files —
`team.data.ts` (177KB) and `enablers.data.ts` (46KB) — being shipped as client-side
JavaScript on `/team` and `/be-a-part/enablers` instead of staying server-only, plus a
~614KB shared JS floor paid by *every* route (even a plain static text page) that hasn't
been attributed to a specific dependency yet. A rendering pass (§6) found `/events` has no
Suspense/streaming or `loading.tsx` anywhere in the app, and confirmed the animation/image
layer is CLS-safe throughout. §7 found the app ships **zero security response headers** —
no HSTS, no CSP, nothing — and proposes a set audited against this app's actual
third-party surface (Google Analytics, reCAPTCHA, YouTube embeds, a raw WebSocket), with
explicit warnings about what's risky to ship blind. §3 covers broader performance
findings (client/server boundary review, code-splitting, data-fetching caching
architecture), §4 covers general codebase health (lint, a11y, dead code, security), and —
audited in the same pass but written up in a companion doc since it's a distinct concern
— `docs/feature-folder-structure.md` covers a significant SEO gap (a canonical-URL bug
affecting 32 of 39 routes) and a complete `constructMetadata()` implementation plan for
every route. TypeScript strict mode is on, there are zero TODO/FIXME markers, and
third-party scripts are already scoped sensibly — the codebase's foundations are solid;
the issues found are specific and fixable, not systemic.

---

## 2. Critical: Image Optimization Is Bypassed Site-Wide — and what's actually blocking it

**This section was deepened in a second audit pass.** The first pass (still below) identified
*that* `mu-image.tsx` force-disables optimization. This pass answers *why the workaround
exists at all* and what unblocks it for real, rather than just deleting the check.

### 2.0 Root cause: what "resolved to private ip" actually means here

Next.js's built-in image optimizer (`/_next/image`) fetches the source image itself, server-side,
before resizing/re-encoding it. Since Next 13, it refuses to fetch a URL whose hostname resolves
(via the DNS the *optimizer's own runtime* sees) to a private/reserved IP range — a real SSRF
guard, not a bug in Next. The comment in `mu-image.tsx:113` names this exact error, which means
it was genuinely observed in some environment.

`NEXT_PUBLIC_CDN_URL=https://s3.ap-south-1.amazonaws.com/cdn.mulearn` (`.env`) — note this is
`s3.ap-south-1.amazonaws.com` **with `/cdn.mulearn` as a URL path segment**, not `cdn.mulearn` as
a subdomain. So every `cdnUrl()`-built image src has hostname exactly
`s3.ap-south-1.amazonaws.com`, and the most likely trigger is one of:

1. **An S3 Gateway VPC Endpoint in the deploy environment.** If the app (or a preview/staging
   environment) runs inside an AWS VPC that has an S3 gateway endpoint attached to its route
   table, requests to `s3.ap-south-1.amazonaws.com` get transparently routed through the
   endpoint — and depending on the resolver in that environment, the hostname can resolve to
   an internal/endpoint-scoped IP rather than S3's public anycast IP. This would reproduce the
   error deterministically in that one environment (e.g. a staging box inside the VPC) while
   looking fine from a developer's laptop — which fits a workaround that "solves it everywhere"
   because nobody could pin down *which* environment triggered it.
2. **A DNS resolver / hosts-file override** in one deploy target pointing the S3 hostname at an
   internal proxy/cache IP for cost or latency reasons.

Either way, the fix that was chosen — `shouldUnoptimized = true` for every environment,
permanently — solves the failure but destroys the feature everywhere, including the
environments (most of them: developer machines, most CI, and very likely production if it's not
the affected one) where the private-IP condition never applied. That's the core diagnosis: **one
environment's transient DNS-routing quirk became a permanent, global regression.**

### 2.1 Evidence the fix was headed toward a real CDN and got abandoned mid-way

`mu-image.tsx:120-124` checks three conditions to trigger `unoptimized`:
```ts
host === "s3.ap-south-1.amazonaws.com" ||
host.endsWith("cdn.mulearn") ||
host.includes("cdn.mulearn")
```
The 2nd and 3rd conditions are **dead code** — `host` (from `new URL(srcVal).hostname`) can never
equal or end with `"cdn.mulearn"` while every real image src is `s3.ap-south-1.amazonaws.com/...`.
A hostname literally named `cdn.mulearn` (or `cdn.mulearn.org`) only makes sense if the intent
was to eventually put a real CDN (CloudFront, or any reverse proxy) in front of the S3 bucket,
with a custom domain — at which point the private-IP problem disappears on its own, because a
CDN edge resolves to its own public anycast/edge IPs, never the origin's VPC-internal routing.
**This dead branch is a fossil of an unfinished migration**: someone anticipated `cdn.mulearn`
becoming the real hostname, wrote the check for it, but `NEXT_PUBLIC_CDN_URL` was never actually
cut over to that domain — so the branch has never once matched, and the site has been stuck on
raw S3 (and therefore stuck on the `unoptimized: true` blanket workaround) ever since.

### 2.2 The actual fix, in order of how much infrastructure change it requires

**Option A — put a real CDN in front of S3 (recommended, matches the code's own intent).**
Provision a CloudFront distribution (or any CDN) with the S3 bucket as origin, point a real
subdomain (`cdn.mulearn.org` or similar) at it, and change `NEXT_PUBLIC_CDN_URL` to that
hostname. Add the new hostname to `next.config.ts`'s `remotePatterns` (already has 8 entries,
one more is trivial), then delete `mu-image.tsx`'s entire `shouldUnoptimized` block — the
private-IP condition cannot occur against a CDN's public edge IPs. This is the only option that
fixes the problem instead of routing around it, and it also gets far better cache-hit rates and
lower latency than serving straight from a single S3 region.

**Option B — recommended if a real CDN migration isn't feasible right now: drop the automatic
hostname-sniffing entirely and let the existing `unoptimized` prop control it per call site,
explicitly, defaulting to optimized.** `ImageProps` (from `next/image`) already declares
`unoptimized?: boolean`, and `mu-image.tsx` already spreads it through via `...rest` — six call
sites already pass it explicitly today (`community-card.tsx:20`, `hero.tsx:125` in
`be-a-part/company`, `change.tsx:162`, `text-testimonial-card.tsx:161`,
`artofteaching/hero.tsx:60`, `mu-loader.tsx:11`), currently redundant since the automatic
detection silently overrides it anyway. Deleting the `shouldUnoptimized` detection block (and
the forced merge in `imageProps`) means:
- Every image defaults to **optimized** (the prop is `undefined`/falsy unless a caller sets it).
- A caller that knows its specific `src` will hit the private-IP guard in a given environment
  opts out explicitly, at that one call site: `<MuImage src={...} unoptimized />`.
- No new env var, no global flag, no implicit environment-dependent behavior — the bypass is a
  visible, per-image choice in the JSX itself, consistent with how the 6 existing call sites
  already use the prop.

This is a **deletion**, not an addition — no new prop needs to be invented; the mechanism already
exists in `ImageProps` and is already used in the codebase today, just neutralized by the
auto-detection sitting in front of it.

**Option C — switch to a custom Next.js image loader** (`images.loader: "custom"` in
`next.config.ts` + a `loader` function), which hands URL construction to your own code and
**never routes the fetch through Next's built-in optimizer at all** — the private-IP check is
part of that built-in optimizer specifically, so a custom loader sidesteps it entirely. Only
worth it if pairing with an external image CDN/transformation service (Cloudinary, imgix, or
even a thin self-hosted resize endpoint) rather than continuing to point at raw S3 — otherwise
you've just moved the unoptimized-S3 problem behind a different door.

**Do this regardless of which option is chosen:** delete the two dead `host.endsWith/includes("cdn.mulearn")`
branches — they've never matched and never will while `NEXT_PUBLIC_CDN_URL` points at the raw S3
host; keeping them signals a migration that isn't actually in progress.

### 2.3 Verifying which option applies before touching production

Don't guess — reproduce it. Run `dig s3.ap-south-1.amazonaws.com` (or `nslookup`) from inside
each deploy environment (local, CI, staging, prod) and compare against a public resolver
(`dig s3.ap-south-1.amazonaws.com @8.8.8.8`). If one environment's result differs and lands in a
private range (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, or link-local `169.254.0.0/16`),
that's the affected one — confirms Option B's env-flag approach is safe to scope narrowly, and
tells you exactly which deploy target needs the flag.

---

### 2.4 First-pass findings (context for the above)

The rest of this section is the original, first-pass description of the same bug — kept for
the exact `file:line` references and the compounding issues found alongside it.

**File:** `src/components/layouts/mu-image.tsx:112-135`

```ts
// Detect if the image src is a remote CDN/S3 host that may resolve to private IPs
// and disable Next.js image optimization for those URLs to avoid the "resolved to private ip" error.
let shouldUnoptimized = false;
try {
  const srcVal = (rest as any).src;
  if (typeof srcVal === "string" && /^https?:\/\//.test(srcVal)) {
    const parsed = new URL(srcVal);
    const host = parsed.hostname;
    if (
      host === "s3.ap-south-1.amazonaws.com" ||
      host.endsWith("cdn.mulearn") ||
      host.includes("cdn.mulearn")
    ) {
      shouldUnoptimized = true;
    }
  }
} catch (_e) {
  /* ignore parsing errors */
}

const imageProps = {
  ...(rest as object),
  unoptimized: shouldUnoptimized || (rest as any).unoptimized,
} as ImageProps;
```

**Why this is the direct cause of "images are slow":**

`NEXT_PUBLIC_CDN_URL` resolves to `https://s3.ap-south-1.amazonaws.com/cdn.mulearn`
(`src/config/env.client.ts`, `.env`). Every asset built with `cdnUrl()`
(`src/shared/api/cdn.ts`) therefore has a `src` hostname of exactly
`s3.ap-south-1.amazonaws.com` — which matches the **first** condition above
unconditionally. The result: **every CDN-hosted image on the entire site is served with
`unoptimized: true`** — the original, full-resolution file straight from S3, with no
resizing to the viewport, no AVIF/WebP conversion, and no compression tiering. This is true
regardless of what size the image is actually displayed at (a 48px avatar and a
2000px-wide hero both ship their full source file).

The irony: `next.config.ts`'s `images.remotePatterns` already explicitly allow-lists
`s3.ap-south-1.amazonaws.com` (and 8 other hosts) for optimization — the whole
`images` config block is correctly set up (`formats: ["image/avif", "image/webp"]`,
sensible `deviceSizes`/`imageSizes`, `minimumCacheTTL: 604800`), but `mu-image.tsx`
overrides it before any of that config gets a chance to apply.

The code comment explains the origin: at some point, `s3.ap-south-1.amazonaws.com`
resolved to a private IP address in some environment, and Next's image optimizer refuses
to proxy such URLs as an SSRF protection (this is a real, legitimate Next.js safeguard).
The workaround chosen was "disable optimization for this host entirely" rather than
something narrower (e.g. fixing the DNS/network issue in that specific environment, or
scoping the workaround to only the environment where it actually happens). As written, it
permanently and unconditionally punishes every image everywhere, in every environment,
including production.

### Compounding issues on top of the same bug

**Redundant per-call `unoptimized` props** — these already inherit `unoptimized: true`
from the hostname match above, so the explicit prop is a no-op, but signals the same
misunderstanding is spreading to individual call sites:
- `src/features/community-partners/components/community-card.tsx:20`
- `src/features/be-a-part/components/company/hero.tsx:125`
- `src/features/be-a-part/components/company/change.tsx:162`
- `src/features/testimonials/components/text-testimonial-card.tsx:161`
- `src/features/artofteaching/components/hero.tsx:60`
- `src/components/layouts/mu-loader.tsx:11` (loader graphic — likely intentional here,
  small asset, low impact either way)

**`preload` is not a real `next/image`/`MuImage` prop** — `mu-image.tsx` never reads or
acts on a `preload` prop; it's spread straight through to the underlying `<img>` as an
unrecognized DOM attribute and has zero effect on loading behavior. 15 files pass it,
including hero/above-the-fold sections that clearly intended eager loading:
`src/features/home/components/hero.tsx`, `src/features/be-a-part/components/campus/hero.tsx`,
`src/components/layouts/navbar.tsx` (x2), `src/app/impact-gallery/page.tsx`, and others
(`grep -rln "preload" src/` for the full list). The real prop for this is `priority` —
which is used only twice in the entire codebase, both as `priority={false}`
(`src/features/be-a-part/components/learners/cta.tsx:43`,
`src/components/ui/state-display.tsx:115`). Practical effect: **every hero image in the
app is lazy-loaded** (Next's default) rather than eagerly loaded, on top of also being
unoptimized.

**Missing `sizes` on `fill`-mode images** — e.g.
`src/features/team/components/team-card.tsx:45` uses `fill` with no `sizes` prop, which
makes Next.js assume a `100vw` sizing hint by default and can cause over-fetching of a
larger source than needed for a small card.

### 2.5 Production-level code audit of `MuImage` itself (beyond the private-IP bug)

The private-IP/`unoptimized` bug above (§2.0-2.4) is one defect in this component. Reading the
full 143-line file (`src/components/layouts/mu-image.tsx`) top to bottom surfaces several more,
independent of it — these matter for a production-grade fix, not just patching the one bug:

1. **~20 lines of dead code (lines 83-102).** The `className && isFill` block (89-92) and the
   `isFillOnly` block (98-102) both set `newStyle.width`/`newStyle.height` to `"auto"` when
   `fill` is true. But the very next block (108-111), which runs unconditionally whenever
   `isFill` is true, **deletes** `width`/`height` from `newStyle` outright:
   ```ts
   if (isFill) {
     if (Object.hasOwn(newStyle, "width")) delete (newStyle as any).width;
     if (Object.hasOwn(newStyle, "height")) delete (newStyle as any).height;
   }
   ```
   Whatever the two earlier blocks wrote is unconditionally erased immediately after. Both
   blocks are provably complete no-ops — safe to delete outright, along with the duplicate,
   shadowed `isFill` re-declaration at line 88 (already computed once at line 27).
2. **Tailwind class detection misses responsive/arbitrary variants (lines 44-55).** `hasH`/`hasW`
   only match tokens that literally start with `"h-"`/`"w-"`. A responsive class like `md:h-64`
   does **not** start with `"h-"` (it starts with `"md:"`), so the component can wrongly conclude
   no CSS modifies that dimension at that breakpoint and set a conflicting inline pixel style —
   a real layout-shift risk that only manifests at specific viewport widths, which is exactly the
   kind of bug that survives a desktop-only manual QA pass. Same gap applies to arbitrary values
   (`h-[200px]`). No test file exists for this component to catch it.
3. **`alt` is silently defaulted to `""` (line 104).** `next/image`'s `ImageProps.alt` is a
   required `string` at the type level — this wrapper catches a missing/`undefined` runtime value
   and defaults it to `""`, which is the screen-reader signal for "this image is purely
   decorative." A genuinely missing alt on a *content* image (e.g. someone forgets to pass one
   for a new team-member photo) silently becomes an accessibility bug instead of a visible one —
   the type system's guarantee is undermined by the very wrapper meant to make images easier to
   use correctly.
4. **No structural enforcement of `sizes` on `fill` images.** §9a.3 (below) found 15 `fill`-mode
   call sites, zero of which pass `sizes`. `MuImage` is the single choke point that could catch
   this at the source — e.g. a dev-only `console.warn` when `fill && !sizes` — rather than
   relying on every future call site remembering unprompted.
5. **No `onError` handling.** A failed image fetch (broken S3 path, revoked permission, or — once
   optimization is correctly restored per §2.2 — a private-IP failure specific to one
   environment) falls through to the browser's default broken-image icon with no graceful
   fallback anywhere in the component.
6. **8 `as any` casts** concentrated in this one file (already counted in §5's TypeScript
   strictness table) — the direct symptom of the prop-shape-guessing pattern that produced
   finding 1 above; tightening the types would have caught the dead code at compile-review time.
7. **Zero unit tests** for an 11-branch conditional component. Every finding above is only
   discoverable by reading the source line-by-line, not by running anything that exists today.

### 2.6 Implementation plan for `MuImage` (documented here, not yet applied)

Ordered so each step is independently shippable and reviewable on its own:

1. Remove the private-IP hostname-sniffing block entirely (§2.2 Option B) — the existing
   `unoptimized` prop (already part of `ImageProps`, already used explicitly at the 6 call sites
   listed under "Compounding issues" above) becomes the only control, defaulting to optimized.
2. Delete the dead fill-dimension blocks (lines 83-102) and the duplicate `isFill` declaration
   (line 88) — no behavior change, pure cleanup enabled by finding 2.5.1.
3. Fix the Tailwind detection gap (2.5.2): widen the matcher to catch a breakpoint-prefixed or
   arbitrary-value token (e.g. a pattern like `/(^|:)h-/`, `/(^|:)w-/`), or — more robustly —
   stop string-parsing Tailwind class names altogether and require an explicit prop from the
   caller when CSS controls sizing, trading a little call-site ergonomics for removing a whole
   class of string-matching bugs.
4. Stop silently defaulting `alt` to `""` (2.5.3): either let the TypeScript requirement stand
   with no runtime fallback, or add a dev-only `console.warn` when `alt` is falsy so a missing
   alt is visible during development instead of silently read as decorative.
5. Add a dev-only warning when `fill` is `true` and `sizes` is absent (2.5.4) — closes §9a.3 at
   the source instead of requiring a manual sweep of every call site.
6. Add an `onError` fallback — a shared placeholder swap — so a failed fetch never surfaces the
   browser's default broken-image icon (2.5.5).
7. Add a focused test file covering the width/height/style/fill prop matrix, written *after*
   steps 2-3 land — testing against today's dead-code-laden version would lock in bugs 1-2 as
   "expected" behavior.

---

## 4. Performance Findings

### Client/server boundary
72 files across `src/features`, `src/shared`, `src/components` contain `"use client"`.
Largest by line count:

| File | Lines |
|---|---|
| `src/features/contact/components/contact-form.tsx` | 809 |
| `src/features/campus-logo-generator/components/campus-logo-generator-view.tsx` | 650 |
| `src/features/donate/components/donation-form.tsx` | 486 |
| `src/components/ui/logo-loop.tsx` | 418 |
| `src/features/interest-groups/components/interest-groups-view.tsx` | 372 |
| `src/features/donate/components/success/donate-success-view.tsx` | 290 |
| `src/features/careers/components/careers-view.tsx` | 285 |
| `src/shared/components/analytics/debug-panel.tsx` | 281 |
| `src/shared/components/analytics/cookie-preferences-modal.tsx` | 273 |
| `src/features/events/components/common/generic-event-card.tsx` | 267 |
| `src/components/layouts/navbar.tsx` | 261 |

A spot-check of 7 of these (and others) confirmed every one has a concrete client-only
reason (`useState`, `useEffect`, event handlers, Radix primitives, `framer-motion`
consumption) — this is not a case of unnecessary `"use client"` sprinkled around.

### Code-splitting is used in exactly one place
Only `src/features/home/components/home-view.tsx` uses `next/dynamic` — 8 below-the-fold
home sections (`SpecialEvents`, `Gallery`, `Comparison`, `Opportunities`, `Roles`, `Stats`,
`Community`, `Newsletter`) are lazy-loaded. Every other large client view listed above
(contact form, campus logo generator, donation form, etc.) loads eagerly with no split —
worth considering for pages where initial load time matters most.

### Data fetching bypasses Next.js's cache entirely
`src/lib/fetcher.ts` builds its clients on **axios** (`axios.create`), not the native
`fetch` API. Next.js's Data Cache and `revalidate`/`cache: "no-store"` semantics only apply
to `fetch()` calls — since every feature's `api/*.ts` file goes through the axios-based
`publicGateway`/`privateGateway` (e.g. `src/features/careers/api/careers.api.ts:28`),
**none of them can opt into or out of Next's server-side data caching**, because the
mechanism never applies in the first place. This isn't a bug exactly (nothing declares
broken caching behavior), but it means "add caching to this API call" isn't currently
possible without either switching to `fetch` or hand-rolling a cache layer.

### Third-party scripts — no issues found
- `GoogleAnalytics` (`@next/third-parties/google`) mounts once in the root layout
  (`src/app/layout.tsx`) via `AnalyticsProvider`, gated behind cookie consent — not an
  unconditional global load.
- `GoogleReCaptchaProvider` is scoped only to `src/features/contact/components/contact-view.tsx`.
- `YouTubeEmbed` (`@next/third-parties/google`) is scoped per-page
  (`home/components/story.tsx`, `testimonials/components/video-section.tsx`,
  `artofteaching/components/archives.tsx`, `artofteaching/components/first-edition.tsx`).
- No raw `<Script>`/`next/script` usage anywhere.

This is all sensibly scoped already — noted for completeness, not flagged as a problem.

### framer-motion
Mostly centralized through `src/components/layouts/mu-framer.tsx` (`MotionDiv`,
`MotionSection`, etc.), which most feature files import instead of touching
`framer-motion` directly. A handful of files still import runtime symbols
(`AnimatePresence`, `useScroll`, `useTransform`) straight from `framer-motion`, bypassing
the wrapper: `src/shared/components/analytics/cookie-consent.tsx`,
`cookie-preferences-modal.tsx`, `debug-panel.tsx`,
`src/features/events/components/salt-mango-tree/salt-mango-tree-view.tsx`,
`inspiration-station/inspiration-station-view.tsx`,
`grab-your-superpowers/grab-your-superpowers-view.tsx`,
`office-hours/office-hours-view.tsx`, `src/features/donate/components/donation-form.tsx`,
`src/features/interest-groups/components/interest-groups-view.tsx`. No file anywhere uses
`LazyMotion`/`m` (framer-motion's smaller-bundle API), so the full motion runtime ships
regardless of the wrapper.

### Fonts — no issues found
`src/app/layout.tsx` loads 3 families via `next/font/google` with `display: "swap"`: Plus
Jakarta Sans (4 weights), Bricolage Grotesque (5 weights), Black Ops One (1 weight).
Self-hosted by `next/font`, so no external Google Fonts preconnect is needed — this is
already the right pattern. One unrelated note: `localFont` is imported
(`src/app/layout.tsx:2`) but never actually used anywhere in the file — dead import (see
§4).

### Route-level caching config
As of this audit, **zero routes** anywhere in `src/app/` declare `export const dynamic`,
`export const revalidate`, `export const fetchCache`, or `generateStaticParams`
(`grep -rn` confirms zero matches repo-wide). All pages render via their default Next.js
behavior. Nothing wrong here on its own — just noted since it means nothing in the app
currently overrides Next's default rendering/caching decisions either way.

### No middleware, no bundle analyzer
No `middleware.ts` exists — zero added per-request latency from that layer. No
bundle-analyzer tooling (`@next/bundle-analyzer` or similar) is wired into
`next.config.ts`/`package.json` — worth adding if bundle size becomes a concern going
forward, since right now there's no way to measure it without manual `next build` output
inspection.

---

## 5. General Codebase Findings

### Biome lint (`bunx biome check .`) — 87 warnings, 4 infos
None of these are newly introduced by the recent feature-folder migration — all
pre-existing.

| Rule | Count |
|---|---|
| `lint/suspicious/noExplicitAny` | 26 |
| `lint/suspicious/noArrayIndexKey` | 19 |
| `lint/correctness/useExhaustiveDependencies` | 10 |
| `lint/style/noNonNullAssertion` | 4 |
| `lint/security/noDangerouslySetInnerHtml` | 4 |
| `lint/a11y/*` (see below) | 9 |
| `lint/suspicious/noGlobalIsNan` | 2 |
| `lint/style/useTemplate` | 2 |
| `lint/correctness/noUnusedVariables` | 2 |
| `lint/correctness/noUnusedImports` | 2 |
| `lint/suspicious/useIterableCallbackReturn` | 1 |
| `lint/performance/noImgElement` | 1 |
| `lint/complexity/useOptionalChain` | 1 |
| `lint/complexity/noBannedTypes` | 1 |
| `suppressions/unused` (a stale `biome-ignore` comment) | 1 |

The 4 "infos" are config-level, not code: `biome.json` uses the deprecated `recommended`
field (should be `preset`), and the schema version (2.3.15) trails the installed CLI
(2.5.1) — `biome migrate` would resolve both.

### Accessibility (the 9 `lint/a11y/*` warnings, full list)
- `src/components/layouts/navbar.tsx:200`, `:214`, `:228` — `useKeyWithClickEvents`
- `src/features/team/components/team-card.tsx:74` — `useKeyWithClickEvents`
- `src/shared/components/analytics/cookie-preferences-modal.tsx:162` — `useButtonType`
- `src/shared/components/analytics/debug-panel.tsx:137`, `:148`, `:217` — `useButtonType`
- `src/components/ui/logo-loop.tsx:376` — `useSemanticElements`
- `src/features/donate/components/success/donate-success-view.tsx:203`, `:223` — `useSemanticElements`
- `src/features/donate/components/tier-card.tsx:22` — `useSemanticElements`
- `src/features/interest-groups/components/interest-groups-view.tsx:114` — `noSvgWithoutTitle`
- `src/features/levelstructure/components/levelstructure-view.tsx:100`, `:116` — `noSvgWithoutTitle`

### Security-adjacent: the shared HTML sanitizer has zero consumers
`src/lib/sanitize.ts` wraps `dompurify` with an allow-list of tags/attributes
(`sanitizeHtml`, `formatAndSanitize`) — but **no file in `src/` imports it** except the
module itself. Meanwhile, two features use `dangerouslySetInnerHTML` with their own local
`formatText` implementation instead:
- `src/features/privacy-policy/components/privacy-policy-view.tsx:15`, `:25`
- `src/features/refund-policy/components/refund-policy-view.tsx:15`, `:56`

(A third `dangerouslySetInnerHTML` at
`src/features/self-determination-theory/components/self-determination-theory-view.tsx:142`
renders `JSON.stringify(jsonLd)` — structured data, not user-influenced content, not a
concern.)

Since the content rendered by `privacy-policy`/`refund-policy` is static/trusted (not
user input), this is low real-world risk today — but it's worth deciding whether
`formatText` should route through the shared sanitizer, or whether `lib/sanitize.ts`
should be removed if it's genuinely never needed.

### Dead code
- `localFont` imported in `src/app/layout.tsx:2` but never invoked/used anywhere in that
  file.
- Zero `TODO`/`FIXME`/`XXX`/`@deprecated` comments anywhere in `src/` — positive signal,
  no known-issues backlog silently rotting in comments.

### Leftover debug logging
37 `console.log`/`console.error`/`console.warn` calls outside `/scripts/`. Most are
legitimate `console.error` calls inside `catch` blocks (e.g.
`src/shared/api/profile.api.ts:19,35`, `src/features/donate/api/donate.api.ts` — 7
occurrences, `src/shared/hooks/stats.hooks.ts:21,27,41`). One file stands out as likely
leftover debug output rather than error handling:
`src/features/campus-logo-generator/components/campus-logo-generator-view.tsx:203, 206,
232, 235, 238, 245, 255` — 7 raw `console.log` calls in the download/image-generation flow.

### TypeScript strictness
`tsconfig.json` has `"strict": true`. Explicit `: any` annotations are rare (3 total: 2 in
`src/features/donate/types/razorpay.d.ts:52,63`, 1 in
`src/features/be-a-part/components/campus/best-practices.tsx:6`). `as any` **casts** are
more common — 21 total, concentrated almost entirely in two files:
- `src/components/layouts/mu-image.tsx` — 8 occurrences (lines 14, 27, 88, 98, 109, 110,
  116, 134) — notably, this is the same file identified as the root cause in §2. The
  heavy reliance on `as any` throughout this component is a symptom of the same
  underlying fragility (a lot of manual prop-shape guessing instead of typed branching).
- `src/components/ui/logo-loop.tsx` — 13 occurrences (lines 282-321), repeatedly casting
  a generic `item` union.

---

## 6. Deep-Dive: Bundle & Client-Boundary Audit

This section goes past static analysis into what the production build actually ships,
using `bun run build` output and `.next/` build artifacts directly.

### 5a. Next 16 + Turbopack production builds no longer report bundle sizes

`bun run build` (Next 16.0.10, Turbopack production build) prints only a route list with
static/dynamic markers (`○`/`ƒ`) — **no "First Load JS" column, no shared-chunk summary**,
unlike the classic webpack production build output every prior Next.js version produced.
This is itself an audit finding: **there is currently no way to see a per-route bundle-size
regression in CI logs or local build output.** A route silently growing by 400KB would
ship undetected unless someone manually diffs `.next/static/chunks/`. Recommendation:
either wait for Turbopack to add this back (tracked upstream in Next.js), or wire in
`@next/bundle-analyzer` (see 5d) as a manual/periodic check since it's not automatic here.

### 5b. Confirmed: two large static-data files are shipped as client JS, not stayed server-only

**`src/features/team/data/team.data.ts` — 177,156 bytes (4,807 lines) of raw source.**
`src/features/team/components/team-view.tsx:1` has `"use client";`, and
`team-view.tsx:14` does `import { team } from "../data/team.data";`. Because the import
crosses into a Client Component, the entire file is bundled into the browser payload for
`/team` — verified directly: the string `"Deepu S Nath"` (a name from the data file)
appears inside the route's compiled client chunk on disk. A **static team roster** — data
that never changes at runtime and needs zero client-side interactivity to *display* — is
being parsed and executed as JavaScript in every visitor's browser instead of being
rendered to HTML on the server.

**`src/features/be-a-part/data/enablers.data.ts` — 46,489 bytes (1,676 lines,
`faculties` array of 100+ people).** Imported into **three** separate `"use client"`
files under `src/features/be-a-part/components/enablers/`:
- `colleges.tsx:1,9`
- `success-stories.tsx:1,11`
- `mission-and-growth.tsx:1,12` — this one actually needs the array client-side, since it
  paginates via `enablers.faculties.slice(0, displayedCount)` behind a "Load more" button
  (`mission-and-growth.tsx:31,66,132` per the source read earlier in this project) — but
  it still means the *entire* 100+-person array ships up front just to reveal 12 at a
  time.
- `who-is-enabler.tsx:4` also imports it (no `"use client"` in this specific file, but it
  renders inside the same client-boundary tree as the others on `/be-a-part/enablers`).

**Why this only became visible now:** these are exactly the two data files flagged by
name in `docs/migration-progress.md` as "the largest data files in the repo" during the
migration (`team.data.ts` moved via `git mv` without reading it in full, `enablers.data.ts`
similarly) — the migration correctly *relocated* them into their feature folders, but
never asked *where the client/server boundary should sit relative to them*. That's a
different, harder question than "which folder does this file belong in," and it wasn't in
scope at the time.

### 5c. The real fix: keep the data on the server, only send the client what's interactive

The Next.js App Router pattern for "some part of this page needs `useState`, but the
data backing it doesn't" is to **render the data server-side and pass the rendered output
as `children`/props into a thin Client Component**, rather than importing the raw data
into the client file. React children passed from a Server Component into a Client
Component are already-rendered elements (serialized as opaque references, not as data) —
the underlying array never crosses the boundary.

**`team-view.tsx` — proposed shape (illustrative, not applied):**

```tsx
// src/features/team/components/team-view.tsx (Server Component — no "use client")
import { team } from "../data/team.data";
import { TeamYearSwitcher } from "./team-year-switcher"; // thin client shell
import { renderTeamGrid } from "./team-grid"; // pure server-side render helper

export function TeamView() {
  const muTeamData = team.find((item) => item.year === "Executive Committee");
  const yearSections = (["2025", "2024", "2023", "2022"] as const).map((year) => ({
    year,
    content: renderTeamGrid(team.find((item) => item.year === year)?.teams ?? []),
  }));

  return (
    <>
      {/* ...hero markup unchanged... */}
      {muTeamData && renderTeamGrid(muTeamData.teams)}
      <TeamYearSwitcher sections={yearSections} />
    </>
  );
}
```

```tsx
// src/features/team/components/team-year-switcher.tsx
"use client";
import { useState, type ReactNode } from "react";
// ...Select/SelectTrigger/etc imports...

export function TeamYearSwitcher({
  sections,
}: {
  sections: { year: string; content: ReactNode }[];
}) {
  const [activeYear, setActiveYear] = useState(sections[0]?.year ?? "");
  const active = sections.find((s) => s.year === activeYear);
  return (
    <div>
      <Select value={activeYear} onValueChange={setActiveYear}>
        {/* ...SelectContent with year options, unchanged... */}
      </Select>
      {active?.content}
    </div>
  );
}
```

`TeamYearSwitcher` only ever receives pre-rendered React elements as `sections[].content`
— `team.data.ts` (177KB) never leaves the server, and the client bundle for `/team` shrinks
to "a `Select` dropdown + a bit of state," not "the entire team roster plus the UI to
browse it." The same `children`-slot pattern applies to `mission-and-growth.tsx`'s
pagination: instead of holding all 100+ `faculties` client-side and slicing in the
browser, either (a) pre-render the first N as server HTML and fetch subsequent pages via
a Server Action / route handler on "Load more" (real pagination, not client-side
slicing of an already-fully-downloaded array), or (b) if 100 people is an acceptable
one-time payload, at minimum stop importing the full data into `colleges.tsx` and
`success-stories.tsx` if they only need a subset — check what each actually reads before
assuming the whole array is needed in all three files.

### 5d. `next.config.ts` — no package-import optimization configured

```ts
// next.config.ts (current — full file already shown in §2's context)
const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: { /* ... */ },
};
```

No `experimental.optimizePackageImports` entry exists. Next.js auto-optimizes a
built-in default list of packages (which already happens to include `lucide-react`, so
that one's fine regardless), but `react-icons` and `swiper` are **not** on that default
list and get no automatic per-icon/per-module tree-shaking assistance beyond what each
package's own `package.json` `exports` map provides. Proposed addition:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["react-icons", "swiper"],
  },
  images: { /* unchanged */ },
};
```

This is a low-risk, one-line-ish config addition — worth doing regardless of the bigger
data-boundary fixes above, since it costs nothing and only helps.

### 5e. The ~600KB shared JS floor

Cross-referencing `.next/static/chunks/` across three unrelated routes (`/team`,
`/be-a-part/enablers`, `/privacy-policy`), the same chunk —
`cfe386a9a5d35e90.js`, **614,773 bytes raw** — is present on every single one, including
`/privacy-policy`, a page that's pure static text with `dangerouslySetInnerHTML`-rendered
paragraphs and no visible interactivity. This is the "First Load JS shared by all" floor
every page on the site pays regardless of content — for context, that's larger than most
individual page-specific chunks measured (`/team`'s own unique chunk was ~118KB on top of
this floor). This number wasn't broken down further in this pass (Turbopack's opaque
build output makes attributing it to a specific dependency non-trivial without
`@next/bundle-analyzer` — see 5a), but it's the single largest lever on *every* page's
load time site-wide, larger than any individual finding above. **Recommended next step,
not done in this audit:** wire in `@next/bundle-analyzer` for one local build
(`ANALYZE=true bun run build`, temporarily switching off `--turbopack` for that one run
since the analyzer plugin hooks into webpack) to get a treemap of what's actually inside
that 614KB and confirm/deny suspicion that it's dominated by `framer-motion` +
Radix UI primitives + the analytics/cookie-consent stack (`AnalyticsProvider`,
`CookieConsent`, `DebugPanel` all mount globally in `src/app/layout.tsx` today, per §3's
"Third-party scripts" findings — global layout mounts are exactly what would land in a
shared-by-all chunk).

---

## 7. Rendering & Core Web Vitals Audit

A third pass specifically checking layout-shift risk, streaming/Suspense usage, and
hydration cost — areas not covered by §2-5.

### 6a. Good news first: animation and image hygiene are clean

- **CLS from animations:** `src/components/layouts/mu-framer.tsx` is a thin
  `React.forwardRef` wrapper around `motion.*` primitives with no logic of its own — every
  animated property found across ~140 `whileInView` call sites is `opacity`/`transform`
  (`y`, `x`, `scale`), which Framer Motion animates via GPU-composited `transform`, never
  `top`/`margin`/`width`/`height`. No component uses Framer Motion's `layout` prop
  (FLIP-based reflow animation) anywhere. **No animation in this codebase can cause
  layout shift.**
- **Repeated re-animation on scroll:** essentially every one of the ~140 `whileInView`
  usages is paired with `viewport={{ once: true }}` — scrolling up and back down does not
  re-trigger entrance animations. This is exactly right and costs nothing to keep doing.
- **No raw `<img>` tags anywhere** — `grep -rn "<img " src/` is empty. Every image goes
  through `MuImage`/`next/image`, so none of them can cause the classic "image loads,
  page jumps" CLS failure mode.
- **`campus-logo-generator-view.tsx`'s heavy work is click-gated** — `htmlToImage.toPng()`
  (line 236) only runs inside `handleDownload`, wired to a button `onClick` (line 631),
  not during mount/render. The 650-line client component is large (§3), but it doesn't
  do expensive synchronous work on load.
- **YouTube embeds use the lite facade correctly** — all 4 usages of `YouTubeEmbed`
  (`@next/third-parties/google`) pass `videoid`/`params`/`style`, consistent with the
  component's whole purpose (a lightweight thumbnail placeholder until the user
  interacts, not an eagerly-loaded real YouTube iframe).

### 6b. No streaming, no route-level loading UI — `/events` blocks fully on its backend fetch

`src/features/events/components/common/events-view.tsx:10` — `export async function
EventsView()` — does a real `Promise.allSettled([...])` backend fetch plus an additional
`await withNextSessionDate(...)` call. It's rendered directly and unwrapped:
`src/app/events/page.tsx:4`, `return <EventsView />;` — **no `<Suspense>` boundary around
it**. The only `<Suspense>` in the whole app that isn't scoped to a small client widget is
`src/app/layout.tsx:53`, which wraps the entire `{children}` tree with a `MuLoader`
fallback — that's an app-shell loading state, not a per-route streaming boundary.
Confirmed via `find src/app -iname "loading.tsx"`: **zero `loading.tsx` files exist
anywhere in `src/app`.**

Practical effect: navigating to `/events` shows nothing (or the generic app-shell
`MuLoader`) until the *entire* backend fetch resolves, then the whole page appears at
once. This is the one route in the app that would benefit most from Next's streaming SSR
— static parts of the page (hero, headings) could paint immediately while the fetched
event lists stream in behind their own `<Suspense>` boundary. Proposed shape:

```tsx
// src/app/events/page.tsx
import { Suspense } from "react";
import { EventsView } from "@/features/events";
import { EventsListSkeleton } from "@/features/events"; // new: a static skeleton, no fetch

export default async function EventsPage() {
  return (
    <Suspense fallback={<EventsListSkeleton />}>
      <EventsView />
    </Suspense>
  );
}
```

This requires splitting `EventsView` so the static hero/heading markup renders outside
the `Suspense` boundary and only the fetch-dependent list sits inside it (currently
they're one component) — a real refactor, not a one-line change, but it's the standard
Next.js App Router pattern for "some of this page is instant, some of it depends on a
slow fetch."

### 6c. `team.data.ts` is rendered unbounded — same file flagged in §5, different angle

§5 covered `team.data.ts` (177KB) as a **bundle-size** problem (it ships to the client at
all). Separately, it's also a **render-cost** problem: `team-view.tsx` maps every member
of every team/subteam with nested `.map()` calls (lines 65/80/91/109) with no pagination
or limit — the Executive Committee section plus whichever year is selected all render in
full on every load. Compare against `enablers.data.ts`'s consumer,
`mission-and-growth.tsx`, which **does** paginate correctly (`useState(12)` initial
`displayedCount`, sliced via `.slice(0, displayedCount)`, "Load more" increments by 18) —
proving the pattern already exists elsewhere in this codebase and just wasn't applied to
`/team`. This reinforces §5c's proposed fix rather than replacing it: whether the
Server/Client split refactor happens or not, `/team` should also adopt the same
slice-and-load-more pattern `mission-and-growth.tsx` already uses, instead of rendering
every member of every year at once.

### 6d. No virtualization anywhere — currently fine, worth knowing as a ceiling

`grep -rn "react-window\|react-virtual\|virtualiz"` across `src/` and `package.json`
returns zero matches — no virtualization library exists in this codebase. Not a problem
today (`enablers.data.ts` paginates client-side to 12-at-a-time; `team.data.ts`'s
per-year sections are large but bounded to roughly a few dozen members each, not
thousands), but if any future feature needs to render a genuinely large flat list (500+
items), reach for `enablers.data.ts`'s existing "paginate + load more" pattern first —
it's simpler and already proven in this codebase — before introducing a new
virtualization dependency.

### 6e. React 19's `use()` hook is unused — informational, not a defect

No file in `src/features`/`src/shared` uses React 19's `use()` hook for reading
promises/context (`grep -rn "= use(" src/features src/shared` — zero matches). All
async/client data loading still goes through the `useEffect`/`useState` pattern
(`useLandingStats`, `careers.hooks.ts`, etc.). This isn't wrong — `use()` is most
valuable when paired with Suspense-driven streaming (§6b), which this codebase doesn't
currently lean on either — but it's worth knowing that adopting `use()` and adopting
Suspense boundaries for data-fetching would naturally go together as a future direction,
rather than being two independent decisions.

---

## 8. Security Headers — currently zero, and a proposed set audited against this app's actual third-party surface

`next.config.ts` has no `headers()` function at all — confirmed via direct read of the
file (§5d already showed its full contents). No `middleware.ts` exists either (§3). This
means **every response from this app ships with only Next's own defaults** — no
`Strict-Transport-Security`, no `X-Content-Type-Options`, no `Content-Security-Policy`,
nothing. This is a real, currently-open gap, not a style preference.

### 7a. Evaluating the header set proposed for this doc

A `headers()` block was proposed with six headers. Auditing each against 2024+ browser
behavior and this specific app's needs, not just accepting it as-is:

| Header | Verdict | Why |
|---|---|---|
| `X-DNS-Prefetch-Control: on` | ✅ keep | Harmless, speeds up resolution of the CDN/analytics/YouTube hosts this app actually loads from. |
| `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`) | ✅ keep, but verify before `preload` | Correct value. **Caution:** the `preload` directive submits the domain to browsers' built-in HSTS preload list — this is effectively permanent and affects every subdomain (`includeSubDomains`) forever, including any future `http://`-only internal/staging subdomain under `mulearn.org`. Confirm every current and *planned* subdomain is HTTPS-only before adding `preload`; the safe rollout is `max-age=63072000; includeSubDomains` first, `preload` only after that's been live without issue and the domain is submitted at hstspreload.org deliberately, not as a side effect of this header. |
| `X-Frame-Options: SAMEORIGIN` | ✅ keep | No page in this app is designed to be iframed by another origin; blocking clickjacking here costs nothing. (Superseded by CSP's `frame-ancestors` where supported, but harmless to keep both — older browsers only respect this one.) |
| `X-Content-Type-Options: nosniff` | ✅ keep | Always safe, prevents MIME-sniffing attacks. No reason not to include. |
| `X-XSS-Protection: 1; mode=block` | ❌ drop | This header is **deprecated and removed from all modern browser engines** (Chromium removed it in 2019, Firefox never implemented it, Safari deprecated it). It does nothing in any current browser, and historically enabling it in old IE/Edge Legacy could itself be exploited as an XSS vector in some cases. Including it is cargo-cult, not protective — the real replacement is `Content-Security-Policy`'s `script-src` directive (see 7b). |
| `Referrer-Policy: origin-when-cross-origin` | ⚠️ upgrade | Not wrong, but `strict-origin-when-cross-origin` is the current recommended default (also what browsers ship as their own default now) — it sends the full URL on same-origin navigation, only the origin on cross-origin HTTPS→HTTPS, and nothing on HTTPS→HTTP downgrades. Slightly better privacy for zero functional cost. |

**Also missing from the proposed set**, worth adding alongside it:
- `Permissions-Policy` — this app never uses camera/microphone/geolocation/USB/etc
  anywhere in the codebase (confirmed no `navigator.mediaDevices`, `navigator.geolocation`
  usage in a grep of `src/`), so there's no reason not to explicitly disable all of them
  and close off a class of attacks via a compromised third-party script.
- `Content-Security-Policy` — the single most impactful header missing, and almost
  certainly *why* none of these headers exist yet: getting CSP right on this specific app
  requires knowing every third-party origin it actually loads from, which is non-trivial
  to enumerate correctly (get it wrong and things silently stop working with no error
  shown to the user — see 7b).

### 7b. The CSP this app actually needs, built from its real third-party surface (not a generic template)

Cross-referencing every external script/frame/connection this codebase actually makes
(`next.config.ts`'s `remotePatterns`, `analytics-provider.tsx`'s `GoogleAnalytics`,
`contact-view.tsx`'s `GoogleReCaptchaProvider`, `stats.hooks.ts`'s raw `WebSocket`, and
the 4 `YouTubeEmbed` usages), a CSP for this app needs at minimum:

```ts
// next.config.ts — proposed headers() function
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains", // add "; preload" only after a deliberate hstspreload.org submission
        },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            // Google Analytics (gtag.js) + reCAPTCHA v3 script — both require 'unsafe-inline'
            // for their own inline bootstrap snippets unless nonced (see caveat below).
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.youtube.com",
            "style-src 'self' 'unsafe-inline'", // Tailwind's runtime + component-library inline styles
            // Every host next.config.ts's images.remotePatterns already allow-lists, plus data: for inline SVG/blob previews (campus-logo-generator).
            "img-src 'self' data: blob: https://s3.ap-south-1.amazonaws.com https://cdn.mulearn https://mulearn.org https://www.propeers.in https://cdn.discordapp.com https://i.ytimg.com https://dev.mulearn.org",
            "font-src 'self' data:", // next/font self-hosts, so no fonts.gstatic.com needed
            // API backend + the raw WebSocket landing-stats connection + GA beacon + reCAPTCHA verify.
            "connect-src 'self' https://mulearn.org https://dev.mulearn.org wss://mulearn.org https://www.google-analytics.com https://www.google.com",
            "frame-src https://www.youtube.com https://www.google.com", // YouTube embeds + reCAPTCHA's invisible iframe
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'", // CSP's modern equivalent of X-Frame-Options
          ].join("; "),
        },
      ],
    },
  ];
},
```

**This is a starting point, not a drop-in-and-ship block — three real risks with CSP
specifically, more than any other header here:**

1. **`'unsafe-inline'` in `script-src` weakens the exact protection CSP exists to provide**
   (it's the modern replacement for the deprecated `X-XSS-Protection`, so keeping it
   permissive defeats the point). The correct long-term fix is a per-request **nonce**:
   Next.js supports this natively via `middleware.ts` generating a nonce and threading it
   through `<Script nonce={nonce}>` — but this app currently has **no `middleware.ts`**
   (§3), and `contact-view.tsx:93` already has `nonce: undefined` hardcoded into its
   `GoogleReCaptchaProvider` config, suggesting nonce support was considered and shelved
   at some point. Adding real nonce-based CSP is a bigger follow-up task than this
   headers block alone — ship the `'unsafe-inline'` version first if speed matters, treat
   tightening it as a separate, deliberate piece of work.
2. **A wrong CSP fails silently from the user's perspective** — a blocked script doesn't
   show an error to the visitor, it just doesn't run. Google Analytics would stop
   recording, the WebSocket landing-stats hook would silently show its `hasError` fallback
   forever, or reCAPTCHA would block the contact form with no visible reason why. **Do
   not ship this directly to production.** Next.js supports `Content-Security-Policy-Report-Only`
   as a header value/key — deploy in report-only mode first (browsers enforce nothing, but
   log violations to the console / a configured `report-uri`), watch real traffic for a
   few days, then flip to enforcing once confirmed clean.
3. **This list will drift** — every time a new third-party embed, CDN host, or API
   endpoint is added anywhere in the app (a new `remotePatterns` entry, a new analytics
   vendor, etc.), the CSP needs a matching update or that feature silently breaks in
   production while working fine in dev (CSP is often not enforced identically across
   environments unless deliberately configured to be). Whoever owns this should treat CSP
   maintenance as part of the checklist for "adding a new external integration," not a
   one-time setup task.

### 7c. Scope: `source: "/:path*"` applies these to every response, including `/api/*`

The proposed `source: "/:path*"` matches every route including `src/app/api/{captcha,contact}/route.ts`.
This is correct and desirable for the non-CSP headers (HSTS/nosniff/frame-options all
apply equally to API JSON responses), but worth confirming the CSP's `connect-src`/
`frame-src` directives don't need to differ for API routes specifically — they don't
here, since these two routes return JSON with no rendered HTML of their own, so CSP is
effectively a no-op on them either way (CSP governs what a rendered *page* may load, not
what a JSON API response contains).

---

## 9. Suggested Priority Order (informational — nothing here has been executed)

Ranked by impact-to-effort ratio, not strictly by section order:

1. **Fix `mu-image.tsx`'s unoptimized-forcing logic** (§2) — single highest-impact,
   lowest-risk fix available. §2.2's Option B (env-flag-gated, 10 minutes, zero infra) is the
   fastest path; Option A (real CDN in front of S3) is the correct long-term fix and is what
   the code's own dead `cdn.mulearn` branch already implies was intended.
1a. **Re-export the oversized `public/assets/gallery/` masters and fix `optimize-images.ts`'s
    non-recursive scan** (§9a.1-9a.2) — 44 gallery files over 2MB (up to 13MB) have never once
    been run through the repo's own compression script because it doesn't recurse into
    subdirectories; this is comparable in impact to item 1 above since it hits the same pages
    (`/gallery`) with the same symptom (slow images) via a completely different mechanism.
1b. **Add `sizes` to all 15 `fill`-mode images** (§9a.3) — zero `sizes` props exist anywhere in
    the codebase; ~15 minutes of work across 15 files, likely the best effort-to-impact ratio
    in this entire document.
2. **Stop shipping `team.data.ts` (177KB) and `enablers.data.ts` (46KB) as client JS**
   (§5b-5c) — the second-highest-impact fix in this whole audit, and it's concentrated in
   exactly two routes (`/team`, `/be-a-part/enablers`). The `children`-slot refactor
   pattern shown in §5c requires no new dependencies, just restructuring the
   client/server split within two existing features.
3. **Give `team-view.tsx` the same pagination `mission-and-growth.tsx` already has**
   (§6c) — smaller, standalone fix independent of the §5c client-boundary refactor;
   reduces render cost even before/regardless of whether the data-shipping fix lands.
4. **Add `experimental.optimizePackageImports: ["react-icons", "swiper"]`** to
   `next.config.ts` (§5d) — a one-line, zero-risk config change with no reason not to do
   it immediately alongside any other `next.config.ts` edit.
5. **Wrap `EventsView` in a `<Suspense>` boundary with a real `loading.tsx`/skeleton**
   (§6b) — `/events` is the one route that does a genuine server-side backend fetch and
   currently blocks fully on it with no streaming and no per-route loading state anywhere
   in the app. Requires splitting the static hero out of the fetch-dependent list first.
6. **Run `@next/bundle-analyzer` once** to attribute the ~614KB shared-JS floor (§5e) — a
   measurement task, not a code change, but a prerequisite for knowing whether the next
   round of bundle work should target `framer-motion`, Radix UI, or the analytics stack.
6a. **Add the security headers block** (§7) — start with the 5 non-CSP headers
    immediately (zero risk: DNS-prefetch, HSTS without `preload` yet, frame-options,
    nosniff, upgraded referrer-policy, permissions-policy). Ship the CSP separately in
    `Content-Security-Policy-Report-Only` mode first and monitor for a few days before
    enforcing — a wrong CSP silently breaks GA/reCAPTCHA/the WebSocket stats hook/YouTube
    embeds with no visible error to users or an obvious signal to developers.
7. Decide whether `privacy-policy-view.tsx`/`refund-policy-view.tsx` should route through
   `lib/sanitize.ts`, or remove the unused sanitizer if it's confirmed unnecessary.
8. Clean up the 7 debug `console.log`s in `campus-logo-generator-view.tsx` and the unused
   `localFont` import in `layout.tsx`.
9. Address the 9 accessibility warnings (mostly small, mechanical fixes — add
   `type="button"`, add keyboard handlers alongside click handlers, add `<title>` to SVGs).
10. If initial page-load time becomes a concern on specific routes, consider
    `next/dynamic`-splitting the largest client views (contact form, campus logo
    generator, donation form) the way `home-view.tsx` already does for its below-the-fold
    sections.
11. Longer-term: if server-side data caching becomes a priority, evaluate migrating
    `src/features/events/api/events.api.ts` specifically (the one route with genuine
    server-side backend fetching) off axios onto native `fetch` to unlock Next's
    Data Cache/ISR for that route — see the full fetch-vs-axios analysis in
    `docs/feature-folder-structure.md`. Not a repo-wide `fetcher.ts` rewrite — that doc
    explains why the benefit is concentrated in just this one file. Pairs naturally with
    item 5's Suspense work, since ISR + streaming solve related-but-distinct problems on
    the same route.
12. **SEO** (out of this doc's scope but audited in the same pass) — see
    `docs/feature-folder-structure.md`'s "SEO: not done for all pages" section for the
    canonical-URL bug (32 routes point their canonical/OG URL at the homepage), missing
    Twitter card metadata, and the heading-hierarchy issues (home page has 10 `<h1>`s;
    `/team`/`/careers`/`/contact`/`/kkem` have zero).

---

## 9a. Deep Re-Audit (Pass 2) — new findings not in the first pass

A second, more intensive pass — actually walking the filesystem (`du`, `find -size`, `git
ls-files`) and reading the build-time tooling itself, not just grepping `src/` — surfaced four
issues the first pass missed entirely, two of which (9a.1, 9a.2) are arguably bigger than
anything already found, since they compound every other image finding above.

### 9a.1 CRITICAL: `public/` is 284MB, individually tracked in git, and mostly never optimized

```
$ du -sh public
284M    public
$ git ls-files public | wc -l
223
```

`public/assets/gallery/` alone holds 84 `.webp` files, **44 of which are over 2MB**, several
over 10MB (`dod/4.webp` 13MB, `dod/5.webp` 11MB, `launchpad2024/5.webp` 9.6MB). These are
*master* files — full-resolution exports — served directly as local image sources through
`MuImage`/`next/image` (confirmed via `gallery.data.ts`: `coverImage: "/assets/gallery/dod/4.webp"`,
a local path, not a CDN URL). Because it's a local path (not `https://...`), it does **not**
match `mu-image.tsx`'s CDN host-check (§2), so these images *do* go through Next's real
optimizer — but that only makes it worse in one specific way: **Next has to decode and re-encode
a 13MB source file on every first request for every one of its ~16 size/format variant
combinations** (8 `deviceSizes` × 2 formats, roughly), which is real, avoidable CPU and TTFB cost
per cold cache entry, compounding poor LCP on `/gallery` regardless of the CDN bug.

Separately from runtime cost, this is a **repository health problem**: `.git` is **493MB**,
overwhelmingly attributable to these binary assets living in git history. Every clone, every CI
checkout, every deploy build pulls the full 284MB of `public/` — for context, that's larger than
this app's entire JS bundle output multiplied many times over. None of this is Lighthouse-scored
directly, but it's the single largest lever on **build/deploy time** and **cold-start image
optimization latency** found in either audit pass.

**Fix:** re-export every gallery master at realistic display dimensions (nothing on this site
displays a gallery thumbnail at native 4000px+ width) before committing it — target under
~300-500KB per master, letting Next's optimizer handle final per-device sizing from there, not
raw camera/export resolution. For the git-bloat half of this problem specifically, consider
moving `public/assets/gallery/` to the same S3/CDN origin already used for everything else
(`cdnUrl()`) instead of bundling it into the Next.js app/repo at all — this is exactly the kind
of large, rarely-changed binary asset object storage exists for.

### 9a.2 CRITICAL: the image-optimization script exists but never touches the images that need it most

`scripts/optimize-images.ts` (wired to `bun run optimize:images`) is a real, working Sharp-based
PNG/JPG→WebP converter — but it has two bugs that mean it has **never once processed the
gallery images from §9a.1, or `public/assets/home/permute.png` (4.8MB, still a raw PNG)**:

```ts
// scripts/optimize-images.ts:37
const imageDirs = ["assets", "src/modules/Public/Home/assets"];
// ...
const files = await fs.readdir(fullPath);  // line 46 — NOT recursive
```

1. **`fs.readdir` is non-recursive** — it lists only files directly inside `public/assets/`,
   never descending into `public/assets/gallery/*/`, `public/assets/home/`, or any other
   subdirectory. Confirmed directly: `public/assets/logo.png` has a `logo.webp` sibling (the
   script *did* process it, since it's a top-level file), but `public/assets/home/permute.png`
   (4.8MB) has no `.webp` sibling anywhere — it has never been touched by this script, because
   it's one directory too deep.
2. **`src/modules/Public/Home/assets` is dead pre-migration cruft** — that path refers to the
   layer-based structure this repo moved away from months ago (per `docs/migration-progress.md`),
   and even before the migration the path was wrong (it's joined onto `publicDir`, i.e.
   `public/src/modules/...`, which never existed as a real directory). The surrounding
   `try { await fs.access(fullPath) } catch { /* skip */ }` silently swallows this every run —
   the script has likely never logged an error for it, so nobody would notice it's dead.
3. **Not wired into `build`, `prepare`, or CI** (`.github/workflows/pr-validation.yml` has no
   reference to it) — even for the one top-level directory it does cover correctly, it only runs
   when a developer remembers to invoke it manually.

**Fix:** change line 37 to a recursive `fs.readdir(fullPath, { recursive: true })` (Node 20+
supports this natively — `engines.node` in `package.json` already requires `>=20.0.0`, so no new
dependency needed), delete the dead `src/modules/Public/Home/assets` entry, and add a `.webp`
match case too (so already-oversized `.webp` masters like the 13MB gallery files get
re-compressed, not just `.png`/`.jpg` ones). Then either wire it into CI as a checked step (fail
the build if an unoptimized master is committed) or at minimum into `prepare`/a pre-commit hook,
since "remember to run this manually" is exactly how §9a.1's 44 oversized files accumulated.

### 9a.3 Every `fill`-mode image ships with zero `sizes` prop — confirmed count

Grepping every `MuImage`/`Image` usage in `src/` for a `sizes=` prop returns **zero matches**
across all 72 `MuImage` call sites. Of those, at least 15 use `fill` mode (`team-card.tsx:45`,
`gallery-sneak-peek.tsx:31`, `company-card.tsx:34`, `company-partners-view.tsx:43`,
`cta.tsx:41`, `success-stories.tsx:57`, `mission-and-growth.tsx:142`,
`interest-groups-view.tsx:300`, `home/gallery.tsx:102`, `special-event-card.tsx:32`,
`video-section.tsx:131`, `action.tsx:45`, `media-card.tsx:33`,
`campus-logo-generator-view.tsx:15`, `impact-gallery/page.tsx:70`). Without `sizes`, Next.js
assumes each of these renders at `100vw` — full viewport width — when in reality every one of
them is a bounded card/thumbnail/avatar inside a grid or fixed container. This means the
`srcset` Next generates always includes (and the browser often picks) a far larger image
variant than the element ever actually displays at. **Fix:** add a `sizes` prop matching each
component's actual rendered width at each breakpoint (e.g. a 3-column grid card is roughly
`sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"`, not the `100vw` default) —
this is a one-line addition per call site, no component restructuring needed, and is the single
most under-priced fix in this entire audit relative to effort (15 files, ~15 minutes total).

### 9a.4 `next.config.ts` leaks the framework via `X-Powered-By`

`next.config.ts` has no `poweredByHeader: false` (confirmed by direct read — full file already
shown in §6d). Next.js ships `X-Powered-By: Next.js` on every response by default, a low-severity
but free-to-fix information-disclosure line item (Lighthouse's Best Practices doesn't score this
directly, but security scanners and `helmet`-style checklists always flag it). Fix is one line
alongside the other `next.config.ts` changes already proposed in this doc:
```ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // ...
};
```

---

## 10. Lighthouse 100/100 Checklist — every audit, mapped to the fix that closes it

Sections 1-8 above are organized by *codebase area*. Lighthouse scores by *category*
(Performance / Accessibility / Best Practices / SEO), and each category is a weighted set
of discrete pass/fail audits — a single unfixed audit can cap the whole category well
below 100 even if everything else is perfect. This section re-indexes every finding above
against the actual Lighthouse audit it fails, plus the handful of audits not covered
elsewhere in this doc, so "ship for 100/100" has one linear checklist instead of requiring
cross-referencing 8 sections. Verified against this repo's current state
(`next.config.ts`, `src/app/layout.tsx`) as of this pass — not assumed from memory.

### 9a. Performance — target 100

| Lighthouse audit | Current state | Fix | Ref |
|---|---|---|---|
| `uses-optimized-images` / `modern-image-formats` / `uses-responsive-images` | **Fails hard** — every CDN image ships `unoptimized: true`, full-res, no AVIF/WebP | Fix `mu-image.tsx`'s host-match bug (§2) | §2 |
| `prioritize-lcp-image` (LCP element preload) | Hero images use a fake `preload` prop, default to lazy | Replace with real `priority` prop on every above-the-fold hero `<Image>`/`MuImage` | §2 |
| `image-size-responsive` (`fill` without `sizes`) | `team-card.tsx:45` and others | Add `sizes` to every `fill`-mode image | §2 |
| `total-byte-weight` / `unused-javascript` | `team.data.ts` (177KB) + `enablers.data.ts` (46KB) ship as client JS; ~614KB shared-JS floor on every route | Server/client boundary refactor (§5b-c); run `@next/bundle-analyzer` to attribute the 614KB floor (§5e) | §5 |
| `render-blocking-resources` | No `middleware.ts`, no route-level `loading.tsx`, `/events` blocks fully on backend fetch | Add `<Suspense>` + `loading.tsx` for `/events` (§6b) | §6b |
| `dom-size` | `team-view.tsx` renders every member of every team unbounded | Paginate `/team` like `mission-and-growth.tsx` already does (§6c) | §6c |
| `cumulative-layout-shift` | Already clean — GPU-composited `transform`/`opacity` only, no raw `<img>`, `viewport={{once:true}}` everywhere | No action needed | §6a |
| `legacy-javascript` / tree-shaking | `react-icons`, `swiper` not in Next's auto-optimize default list | Add `experimental.optimizePackageImports: ["react-icons", "swiper"]` (§5d) | §5d |
| `font-display` | Already `swap` on all 3 `next/font/google` families, self-hosted | No action needed | §3 |
| `bootup-time` / `mainthread-work-breakdown` | `campus-logo-generator-view.tsx`'s `htmlToImage.toPng()` is click-gated, not on mount | No action needed | §6a |
| `uses-text-compression` | `compress: true` already set in `next.config.ts` | No action needed | — |

**Ceiling without any fixes:** the image bug (§2) alone is enough to keep Performance well
under 100 — it fails 3 separate weighted audits (`uses-optimized-images`,
`modern-image-formats`, `prioritize-lcp-image`) simultaneously, on every page, because it's
site-wide, not per-route.

### 9b. Accessibility — target 100

| Lighthouse audit | Current state | Fix | Ref |
|---|---|---|---|
| `button-name` (`useButtonType`) | 4 buttons missing `type="button"` (`cookie-preferences-modal.tsx:162`, `debug-panel.tsx:137,148,217`) | Add explicit `type="button"` | §4 |
| `interactive-element-affordance` / keyboard-operable custom controls (`useKeyWithClickEvents`) | `navbar.tsx:200,214,228`, `team-card.tsx:74` — click handlers with no keyboard equivalent | Add `onKeyDown`/`role`/`tabIndex`, or swap the element for a real `<button>` | §4 |
| `svg-img-alt` / accessible-name (`noSvgWithoutTitle`) | `interest-groups-view.tsx:114`, `levelstructure-view.tsx:100,116` | Add `<title>` inside each inline `<svg>` | §4 |
| `heading-order` | Home page has 10 `<h1>`s; `/team`, `/careers`, `/contact`, `/kkem` have **zero** `<h1>` | Demote home-page section headings to `<h2>` (styling untouched — it's Tailwind classes, not tag-driven); add one real `<h1>` to the 4 pages missing one | feature-folder-structure.md §"Heading hierarchy" |
| `html-has-lang` | ✅ already passes — `<html lang="en">` (`layout.tsx:41`) | No action needed | — |
| `color-contrast` | Not statically auditable from source — needs a real Lighthouse/axe run against rendered pages, especially `text-muted`/gray-on-white Tailwind utility combinations | Run Lighthouse/axe DevTools against each page template once other fixes land; this audit can't be verified by code review alone | — |
| `aria-*` roles/attributes (Radix primitives) | Radix UI (`@radix-ui/react-*`) ships correct ARIA out of the box for Dialog/Popover/Select/Tabs/RadioGroup — no custom ARIA overrides found in a repo-wide grep | No action needed, but re-verify after any custom `role`/`aria-*` prop is added to a Radix primitive | — |
| `target-size` (tap target ≥24×24px) | Not statically auditable — needs a real run, particularly on icon-only buttons in `navbar.tsx`/`debug-panel.tsx` | Verify with Lighthouse mobile run | — |

**Note:** Accessibility is the one category where "grep the code" genuinely cannot
guarantee 100 — `color-contrast` and `target-size` are computed against rendered pixels,
not markup. Treat the table above as "everything code review *can* fix"; still budget one
real Lighthouse mobile+desktop run per page template before calling this category done.

### 9c. Best Practices — target 100

| Lighthouse audit | Current state | Fix | Ref |
|---|---|---|---|
| `csp-xss` | **Fails** — zero CSP anywhere (`next.config.ts` has no `headers()`) | Add the CSP from §7b, starting in `Content-Security-Policy-Report-Only` mode | §7 |
| `is-on-https` / `uses-http2` | Assumed satisfied by hosting (Vercel/CDN) — not verifiable from source, confirm in prod | — | — |
| `no-vulnerable-libraries` | Not checked in this pass — run `bun audit` / `npm audit` / Snyk separately; out of scope for a source-level audit | Run a dependency vulnerability scan | — |
| `deprecations` / console warnings | Not statically greppable (runtime warnings only appear in devtools) | Run one full click-through per page template with devtools console open, note any deprecation warnings | — |
| `notification-on-start` / `geolocation-on-start` | ✅ passes — no `navigator.mediaDevices`/`navigator.geolocation`/`Notification` usage anywhere in `src/` (confirmed via grep in §7a) | No action needed | §7a |
| `image-aspect-ratio` / `image-size-responsive` | Same root cause as Performance's image findings — fixing `mu-image.tsx` (§2) fixes this too | See §2 | §2 |
| `errors-in-console` | 37 `console.log`/`.error`/`.warn` calls found; most are legitimate `catch`-block error logging, 7 in `campus-logo-generator-view.tsx` are leftover debug output | Remove the 7 debug `console.log`s (the `catch`-block `console.error`s are fine — Lighthouse only flags *runtime* console errors, not the presence of the function call itself) | §4 |
| `charset` | Next.js sets this automatically via its document shell — not overridden anywhere | No action needed | — |

### 9d. SEO — target 100

| Lighthouse audit | Current state | Fix | Ref |
|---|---|---|---|
| `document-title` / `meta-description` | 32 of 39 routes inherit the generic root title/description | `constructMetadata()` per route, Phase 2 | feature-folder-structure.md §"SEO" |
| `canonical` | **Fails on 32 routes** — all point at the homepage, the single worst SEO defect in the app | `canonical` per route, Phase 1 (do first — this is a correctness bug, not an enhancement) | feature-folder-structure.md §"canonical-URL bug" |
| `link-text` | Not audited in this pass — spot-check for "click here"/"read more" style anchor text across CTAs before calling this done | Manual pass over CTA copy | — |
| `is-crawlable` / `robots-txt` | **Fails** — no `robots.ts`, no `sitemap.ts` exist | Add both, Phase 3 | feature-folder-structure.md §"sitemap.ts / robots.ts" |
| `hreflang` | N/A — single-locale site, no i18n routing exists; this audit passes vacuously | No action needed | — |
| `font-size` (legible, no tiny text) | Not statically auditable from Tailwind classes alone without rendering | Verify with a real mobile Lighthouse run | — |
| `tap-targets` | Same as Accessibility's `target-size` — shared audit surface between the two categories | See §9b | — |
| `structured-data` (not scored directly, but feeds rich-result eligibility) | Only 1 of 39 routes emits JSON-LD | `Organization`/`WebSite` (home), `Event` (`/events`, `/gallery/[slug]`), `JobPosting` (`/careers`) — Phase 4 | feature-folder-structure.md §"Structured data" |
| `viewport` meta tag | **Fails** — confirmed via direct read of `layout.tsx`: no `export const viewport` anywhere in the file | Add the `Viewport` export shown in feature-folder-structure.md | feature-folder-structure.md |

### 9e. Execution order to hit 100/100 across all four categories with minimum wasted motion

Several fixes above close audits in more than one category simultaneously — doing them in
this order avoids re-touching the same file twice:

1. **`mu-image.tsx` fix (§2)** — closes 3 Performance audits + 1 Best Practices audit
   (`image-aspect-ratio`) in one change. Highest leverage in this entire checklist.
2. **`canonical` + `viewport` + metadata table (feature-folder-structure.md Phases 1-2)** —
   closes 4 SEO audits at once; touches every `page.tsx`, so batch it in one pass.
3. **Security headers, non-CSP first, then CSP in report-only (§7)** — closes
   `csp-xss` (Best Practices) without risking breakage, since report-only mode enforces
   nothing while surfacing violations.
4. **`sitemap.ts` + `robots.ts` (Phase 3)** — closes `is-crawlable`, two new self-contained
   files, no dependency on anything else in this list.
5. **Accessibility mechanical fixes (§4's 9 warnings + heading-order)** — all
   `git grep`-able, zero design review needed since none change visual styling.
6. **`/events` Suspense + `/team` pagination (§6b-c)** — closes `dom-size` and
   `render-blocking-resources`; larger refactors, do these once the cheaper wins above are
   banked.
7. **Structured data (Phase 4)** — doesn't move a Lighthouse *score* (JSON-LD isn't a
   scored audit) but is bundled here since it's part of the same SEO pass and cheap to add
   once every route's metadata is already being touched in step 2.
8. **Manual-only verification pass** — `color-contrast`, `target-size`, `font-size`,
   `link-text`, `no-vulnerable-libraries`, `deprecations`: run actual Lighthouse (mobile +
   desktop) against representative page templates (home, a static content page, `/events`,
   `/team`, `/contact` with its form) after steps 1-7 land. These audits cannot be
   confirmed by source review alone — treat this step as mandatory, not optional, before
   claiming 100/100 anywhere.

**Reality check:** every fix in steps 1-7 is traceable to a specific `file:line` finding
already documented in this pair of docs — nothing in this checklist is speculative. Step 8
is the only part of "100/100" that requires an actual browser/Lighthouse run rather than a
code change, because contrast ratios, tap-target pixel sizes, and console runtime warnings
don't exist as facts until the page is rendered.

---

## 11. Live Lighthouse Baseline — 2026-08-28, `mulearnhome-weld.vercel.app`

A real Lighthouse run (Moto G Power emulation, Slow 4G, single page load) against the live
deploy — not a source-level inference, actual measured evidence. Scores: **Performance 91,
Accessibility 96, Best Practices 100, SEO 100, Agentic Browsing 1/2.** This section maps every
finding in that report to the corresponding section above, confirming several with hard numbers
and adding a handful that weren't in either doc yet.

### 11a. Confirms §2 exactly, with real transfer sizes

"Improve image delivery" (Est. savings **4,582 KiB**) and "Use efficient cache lifetimes" (Est.
savings **4,697 KiB**) both point at the same five images:

| Image | Rendered at | Source size | Transfer | Cache TTL |
|---|---|---|---|---|
| `landing/College Project Concept Illustration.png` | 263×175 | 2000×1333 | 1,243 KiB | `None` |
| `landing/Content Team Concept Illustration.png` | 210×210 | 2000×2000 | 1,067 KiB | `None` |
| `landing/searching.png` | 210×210 | 2000×2000 | 785 KiB | `None` |
| `landing/collab.png` | 298×198 | 2000×1333 | 773 KiB | `None` |
| `landing/Roadmap.png` | 210×210 | 2000×2000 | 738 KiB | `None` |

All five are `s3.ap-south-1.amazonaws.com/cdn.mulearn/public/assets/landing/*.png` — CDN-hosted,
**not** the git-tracked `public/` gallery masters from §9a.1 (a different, distinct set of
oversized images) — but hitting the *exact same root cause* as §2: optimization is bypassed, so
Next ships the raw 2000px PNG source regardless of the 175-298px slot it's actually displayed
in, with zero cache TTL on top (Next's own `minimumCacheTTL: 604800` from `next.config.ts` never
applies, because `unoptimized: true` means the image never reaches Next's optimizer/cache layer
at all). **This is the clearest real-world confirmation available that §2's fix — restoring
optimization — directly closes both of these Lighthouse findings simultaneously**, worth ~4.6MB
of the page's ~5.4MB total payload ("Avoid enormous network payloads", Total size **5,408 KiB**).
Treat the post-fix version of this exact Lighthouse run as the verification step for §2.2's fix.

### 11b. New findings not previously documented in either doc

- **Accessibility — "Buttons do not have an accessible name"** and **"Elements use prohibited
  ARIA attributes"** — broader than the 4 specific `useButtonType` lint warnings already in §5/§9b.
  Lighthouse doesn't name the exact element; needs a live axe/Lighthouse element-inspector pass
  to localize before it can get a `file:line` fix.
- **Accessibility — "Heading elements are not in a sequentially-descending order"** — this is
  live confirmation of the heading-hierarchy finding already fully documented in
  `docs/feature-folder-structure.md` ("Heading hierarchy — both failure modes present").
- **Best Practices — CSP / COOP / clickjacking (XFO or CSP) / Trusted Types all flagged as
  missing** — direct, live confirmation of §8's "zero security headers" finding; the proposed
  `headers()` block in §8b is confirmed not yet applied to the live deploy.
- **Best Practices — "Missing source maps for large first-party JavaScript"** and **"Browser
  errors were logged to the console"** — not previously documented. Source maps: check
  `next.config.ts`/build config for production source-map settings. Console errors: needs a live
  DevTools run to identify which specific errors (same caveat already noted for §9c's
  `errors-in-console`).
- **Diagnostics — "Render-blocking requests" (Est. savings 690ms)**: two first-party CSS chunks
  (`c6ebaa93f0c5f209.css`, `8b00bebe8adee987.css`) plus `lite-yt-embed.css` from jsDelivr block
  initial render. **"Forced reflow"** (42ms, unattributed source). **"Reduce unused JavaScript"**
  (Est. savings 149 KiB across 3 first-party chunks). All three tie directly into §6/§7's
  bundle-size and code-splitting findings — concrete evidence that the `@next/bundle-analyzer`
  run already recommended in §6e would have immediate, measurable payoff.
- **New category: Agentic Browsing 1/2 — "Accessibility tree is not well-formed"** — a newer
  Lighthouse category not covered in either doc previously. Downstream of the same
  accessibility-tree defects already being tracked above (heading order, prohibited ARIA,
  missing button names) rather than a separate class of bug — fixing those should move this
  score too, but re-verify with a fresh run rather than assuming it.

### 11c. What this run does *not* change

Nothing above contradicts any existing finding — it's independent, live confirmation. No new
priority-order change is needed beyond what §9's list already recommends: §2's fix is already
ranked #1, and closing it is now verified (via 11a) to resolve two of this report's largest
Performance line items in one change.

---

## 12. Status: Done vs. To-Do

**Nothing described in this document or in `docs/feature-folder-structure.md` has been applied
to the codebase.** Every session that has touched these two files did so in documentation-only
mode, by explicit request — this table exists so a future reader (or session) doesn't have to
re-read either doc end-to-end to find out what's real versus proposed.

| Finding | Section | Status |
|---|---|---|
| `mu-image.tsx` private-IP/`unoptimized` bug | §2.0-2.4 | Documented — not applied |
| `MuImage` dead code, `alt` default, missing `sizes`/`onError`/tests | §2.5-2.6 | Documented — not applied |
| `team.data.ts`/`enablers.data.ts` shipped as client JS | §6b-c | Documented — not applied |
| `next.config.ts` `optimizePackageImports` | §6d | Documented — not applied |
| `/events` Suspense + `loading.tsx` | §7b | Documented — not applied |
| `/team` pagination | §7c | Documented — not applied |
| Security headers (`headers()` block, CSP report-only rollout) | §8 | Documented — not applied; live-confirmed missing (§11b) |
| `public/assets/gallery/` oversized masters + non-recursive `optimize-images.ts` | §9a.1-9a.2 | Documented — not applied |
| `sizes` on 15 `fill`-mode images | §9a.3 | Documented — not applied |
| `poweredByHeader: false` | §9a.4 | Documented — not applied |
| SEO canonical-URL fix (32 routes) | `feature-folder-structure.md` Phase 1 | Documented — not applied |
| `constructMetadata()` per-route title/description, twitter card, viewport | `feature-folder-structure.md` Phase 2 | Documented — not applied |
| `sitemap.ts` / `robots.ts` | `feature-folder-structure.md` Phase 3 | Documented — not applied |
| JSON-LD structured data | `feature-folder-structure.md` Phase 4 | Documented — not applied |
| Heading hierarchy fixes | `feature-folder-structure.md` Phase 5 | Documented — not applied; live-confirmed by Lighthouse (§11b) |
| Accessibility mechanical fixes (9 lint warnings) | §5 | Documented — not applied |
| `console.log` cleanup, unused `localFont` import | §5 | Documented — not applied |
| Donation form double-submit guard | `feature-folder-structure.md` "Bonus finding" | Documented — not applied |

**To-do, not yet even fully diagnosed:**
- Localize the exact elements behind Lighthouse's live "Buttons do not have an accessible name"
  and "Elements use prohibited ARIA attributes" findings (§11b) — needs a live inspector pass.
- Confirm production source-map configuration (§11b).
- Run `@next/bundle-analyzer` to attribute the ~614KB shared-JS floor (§6e) and the 149KB of
  unused first-party JS confirmed live (§11b).
- `color-contrast`, `target-size`, `font-size`, `link-text` — manual-only Lighthouse audits per
  §10's Accessibility/SEO tables, not verifiable by source review.
