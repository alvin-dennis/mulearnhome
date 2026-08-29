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

## 2. Image optimization — done (2026-08-29)

`mu-image.tsx`'s private-IP hostname-sniffing block and both dead `cdn.mulearn` branches are
deleted; `unoptimized` is now the only control. `MuImage`'s dead fill-dimension code, duplicate
`isFill`, silent `alt` fallback, and narrow `hasH`/`hasW` regex are all fixed; a dev-only warn
was added for `fill` without `sizes`. `onError` fallback and a dedicated test file were
considered and deliberately skipped (see `implementation-plan.md`'s "0. Already done" table for
why). Full history superseded — nothing here is still open.

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
this floor).

**Update — this has now been measured, not just suspected.** `@next/bundle-analyzer` has been
added to the repo (`next.config.ts`, `package.json`'s `analyze` script — `bun run analyze`) and
run once against a real production build. Full module-level breakdown, real dependency
attribution, and every fix this data points to is in the dedicated companion doc
**`docs/bundle-analysis.md`** — including confirmation that `framer-motion` and Radix UI are part
of the floor as suspected (alongside `tailwind-merge`, `zod`, `date-fns`, `axios`, and Next's own
React DOM/router internals), a measured ~150KB of dead Swiper-module weight fixable by the
`optimizePackageImports` change already proposed in §6d, and one unresolved anomaly (a possibly
orphaned duplicate React DOM chunk) that needs a live DevTools check before it can be called a
confirmed bug. Treat that doc as the authoritative answer to this section's open question — this
paragraph is kept for context on how the question arose.

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

Image optimization (§2, §9a.1-9a.3) and SEO (canonical, metadata, sitemap/robots, heading
hierarchy) are done — see `implementation-plan.md` §0. Ranked by impact-to-effort ratio for
what's left, not strictly by section order:

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
   it immediately alongside any other `next.config.ts` edit. If a **Swiper → Embla
   Carousel** replacement is pursued afterward (measured ~7-10x bundle-size case, pros/cons,
   and a 3-file migration plan fully documented in `docs/bundle-analysis.md` §7), this
   config line becomes moot for the migrated files but is still worth landing first since
   it's zero-risk and the migration itself is a larger, scheduled effort, not a quick win.
5. **Wrap `EventsView` in a `<Suspense>` boundary with a real `loading.tsx`/skeleton**
   (§6b) — `/events` is the one route that does a genuine server-side backend fetch and
   currently blocks fully on it with no streaming and no per-route loading state anywhere
   in the app. Requires splitting the static hero out of the fetch-dependent list first.
6. ~~Run `@next/bundle-analyzer` once to attribute the ~614KB shared-JS floor (§5e)~~ —
   **done.** See `docs/bundle-analysis.md` for the full breakdown. The fixes it surfaced
   (Swiper's `optimizePackageImports`, the `/events` barrel-chunking, the `levelstructure`
   duplication, the possibly-orphaned framework chunk) are still open — treat that doc's own
   checklist as the next set of priority items, roughly at this same rank.
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
11. The `events.api.ts` axios→fetch conversion (would've unlocked Next's Data Cache/ISR for
    `/events`) was investigated and **dropped** — not needed, see `implementation-plan.md`
    Phase 7.

---

## 9a. Deep Re-Audit (Pass 2) — new findings not in the first pass

A second, more intensive pass — actually walking the filesystem (`du`, `find -size`, `git
ls-files`) and reading the build-time tooling itself, not just grepping `src/` — surfaced four
issues the first pass missed entirely. Three are now done (9a.1-9a.3); 9a.4 remains open.

### 9a.1-9a.3 — image asset pipeline: done (2026-08-29)

`public/` was 284MB (mostly unoptimized gallery masters up to 13MB, full-DSLR resolution) with
a broken, never-recursing `optimize-images.ts` and zero `sizes` props on any `fill`-mode image.
All three fixed together: script made recursive (dead `src/modules/Public/Home/assets` entry
removed, `.webp` re-compress case added), every oversized master resized to a 2400px max
dimension, `sizes` added to all 15 `fill` sites. 17 files with zero references anywhere in
`src/` (confirmed via repo-wide exact-filename search, not just a `src/`-scoped grep) deleted —
`public/assets` now 23MB, down from 284MB. CI/pre-commit wiring for the script remains a real
open follow-up (see `implementation-plan.md`) so this doesn't reaccumulate.

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
| `uses-optimized-images` / `modern-image-formats` / `uses-responsive-images` | ✅ done — `mu-image.tsx`'s host-match bug fixed | — | §2 |
| `prioritize-lcp-image` (LCP element preload) | ✅ done — real `priority` prop on every above-the-fold hero | — | §2 |
| `image-size-responsive` (`fill` without `sizes`) | ✅ done — `sizes` on all 15 `fill`-mode images | — | §2 |
| `total-byte-weight` / `unused-javascript` | `team.data.ts` (177KB) + `enablers.data.ts` (46KB) ship as client JS; ~614KB shared-JS floor on every route | Server/client boundary refactor (§5b-c); run `@next/bundle-analyzer` to attribute the 614KB floor (§5e) | §5 |
| `render-blocking-resources` | No `middleware.ts`, no route-level `loading.tsx`, `/events` blocks fully on backend fetch | Add `<Suspense>` + `loading.tsx` for `/events` (§6b) | §6b |
| `dom-size` | `team-view.tsx` renders every member of every team unbounded | Paginate `/team` like `mission-and-growth.tsx` already does (§6c) | §6c |
| `cumulative-layout-shift` | Already clean — GPU-composited `transform`/`opacity` only, no raw `<img>`, `viewport={{once:true}}` everywhere | No action needed | §6a |
| `legacy-javascript` / tree-shaking | `react-icons`, `swiper` not in Next's auto-optimize default list | Add `experimental.optimizePackageImports: ["react-icons", "swiper"]` (§5d) | §5d |
| `font-display` | Already `swap` on all 3 `next/font/google` families, self-hosted | No action needed | §3 |
| `bootup-time` / `mainthread-work-breakdown` | `campus-logo-generator-view.tsx`'s `htmlToImage.toPng()` is click-gated, not on mount | No action needed | §6a |
| `uses-text-compression` | `compress: true` already set in `next.config.ts` | No action needed | — |

**Remaining ceiling:** with the image bug (§2) fixed, the client-bundle/data-boundary findings
above (`team.data.ts`/`enablers.data.ts` as client JS, no `<Suspense>` on `/events`, unbounded
`/team` DOM, missing `optimizePackageImports`) are what's left keeping Performance under 100.

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
| `document-title` / `meta-description` | ✅ done — all routes now call `constructMetadata()` with unique title/description | — | implementation-plan.md §0 |
| `canonical` | ✅ done — every route passes its own `canonical` | — | implementation-plan.md §0 |
| `link-text` | Not audited in this pass — spot-check for "click here"/"read more" style anchor text across CTAs before calling this done | Manual pass over CTA copy | — |
| `is-crawlable` / `robots-txt` | ✅ done — `src/app/robots.ts` + `src/app/sitemap.ts` added | — | implementation-plan.md §0 |
| `hreflang` | N/A — single-locale site, no i18n routing exists; this audit passes vacuously | No action needed | — |
| `font-size` (legible, no tiny text) | Not statically auditable from Tailwind classes alone without rendering | Verify with a real mobile Lighthouse run | — |
| `tap-targets` | Same as Accessibility's `target-size` — shared audit surface between the two categories | See §9b | — |
| `structured-data` (not scored directly, but feeds rich-result eligibility) | Still only 1 of 39 routes emits JSON-LD — **deliberately left as-is**, not a gap | Considered (`Organization`/`WebSite`, `Event`, `JobPosting`) and skipped as a judgment call; narrow upside for this site | implementation-plan.md §0 |
| `viewport` meta tag | ✅ done — `src/app/layout.tsx` now exports `viewport` | — | implementation-plan.md §0 |

### 9e. Execution order to hit 100/100 across all four categories with minimum wasted motion

Image optimization (§2) and all of SEO (canonical, metadata, `sitemap.ts`/`robots.ts`,
heading hierarchy — JSON-LD skipped by decision) are done; see `implementation-plan.md` §0.
What's left, in the order that avoids re-touching the same file twice:

1. **Security headers, non-CSP first, then CSP in report-only (§7)** — closes
   `csp-xss` (Best Practices) without risking breakage, since report-only mode enforces
   nothing while surfacing violations.
2. **Accessibility mechanical fixes (§4's 9 warnings + heading-order)** — all
   `git grep`-able, zero design review needed since none change visual styling.
3. **`/events` Suspense + `/team` pagination (§6b-c)** — closes `dom-size` and
   `render-blocking-resources`.
4. **Manual-only verification pass** — `color-contrast`, `target-size`, `font-size`,
   `link-text`, `no-vulnerable-libraries`, `deprecations`: run actual Lighthouse (mobile +
   desktop) against representative page templates (home, a static content page, `/events`,
   `/team`, `/contact` with its form) after steps 1-3 land. These audits cannot be
   confirmed by source review alone.

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
A fresh live Lighthouse run is the verification step for §2's now-shipped fix.

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

**Phases 1, 1a, and 4 are shipped (2026-08-29); everything else below is still
documented-not-applied.** This table exists so a future reader (or session) doesn't have to
re-read either doc end-to-end to find out what's real versus proposed.

| Finding | Section | Status |
|---|---|---|
| `@next/bundle-analyzer` wired into `next.config.ts` + `bun run analyze` script | §6e, `docs/bundle-analysis.md` | **Applied** |
| `mu-image.tsx` private-IP/`unoptimized` bug | §2 | **Applied** |
| `MuImage` dead code, `alt` default, missing `sizes` | §2 | **Applied**. `onError`/tests deliberately skipped — see implementation-plan.md Phase 1 |
| `team.data.ts`/`enablers.data.ts` shipped as client JS | §6b-c | Documented — not applied |
| `next.config.ts` `optimizePackageImports` (now with measured ~150KB Swiper savings, see `docs/bundle-analysis.md` §4) | §6d | Documented — not applied |
| `/events` sub-routes bundled into one shared chunk (barrel-import cost) | `docs/bundle-analysis.md` §5 | Documented — not applied |
| Possibly-orphaned duplicate React DOM chunk | `docs/bundle-analysis.md` §3 | Needs a live DevTools check before it's even confirmed as a bug |
| Repeated `<Sparkle>` JSX blocks inflating `/levelstructure`'s chunk | `docs/bundle-analysis.md` §6 | Documented — not applied |
| Swiper → Embla Carousel replacement (bundle-size case, pros/cons, migration plan) | `docs/bundle-analysis.md` §7 | Documented — investigation only, no packages changed |
| `/events` Suspense + `loading.tsx` | §7b | Documented — not applied |
| `/team` pagination | §7c | Documented — not applied |
| Security headers (`headers()` block, CSP report-only rollout) | §8 | Documented — not applied; live-confirmed missing (§11b) |
| `public/assets/gallery/` oversized masters + non-recursive `optimize-images.ts` + unused files | §9a.1-9a.3 | **Applied** — 284MB → 23MB (resize + WebP conversion + 17 unused files deleted). CI/pre-commit wiring not done |
| `sizes` on 15 `fill`-mode images | §9a.3 | **Applied** |
| `poweredByHeader: false` | §9a.4 | Documented — not applied |
| SEO canonical-URL fix (all routes) | implementation-plan.md §0 | **Applied** |
| `constructMetadata()` per-route title/description/keywords, twitter card, viewport | implementation-plan.md §0 | **Applied** |
| `sitemap.ts` / `robots.ts` | implementation-plan.md §0 | **Applied** |
| JSON-LD structured data | implementation-plan.md §0 | Considered, deliberately not applied — narrow upside for this site |
| Heading hierarchy fixes | implementation-plan.md §0 | **Applied** |
| Accessibility mechanical fixes (9 lint warnings) | §5 | Documented — not applied |
| `console.log` cleanup, unused `localFont` import | §5 | Documented — not applied |
| Donation form double-submit guard | `feature-folder-structure.md` "Bonus finding" | Documented — not applied |

**To-do, not yet even fully diagnosed:**
- Localize the exact elements behind Lighthouse's live "Buttons do not have an accessible name"
  and "Elements use prohibited ARIA attributes" findings (§11b) — needs a live inspector pass.
- Confirm production source-map configuration (§11b).
- ~~Run `@next/bundle-analyzer` to attribute the ~614KB shared-JS floor~~ — done, see
  `docs/bundle-analysis.md`. Still open from that doc: confirm live whether the orphaned-looking
  `framework-*.js` chunk (§3 of that doc) actually loads anywhere in a browser, which would
  explain some of the 149KB of unused first-party JS Lighthouse flagged live (§11b) — the two
  findings may be the same root cause, not yet confirmed.
- `color-contrast`, `target-size`, `font-size`, `link-text` — manual-only Lighthouse audits per
  §10's Accessibility/SEO tables, not verifiable by source review.
