# Feature-Folder Migration — Progress & Handoff

Companion to `docs/feature-folder-structure.md` (the original proposal). That doc describes
the *target* shape; this doc tracks *actual progress* and the real conventions settled on
during implementation — several of which deviate from the original doc's literal examples.
Read this before continuing the migration.

## Status: Phase 0, 1, 2 complete. Phase 3 ~60% complete (by route count).

---

## Conventions actually in force (read this before writing any new feature)

These were settled through explicit back-and-forth during implementation. Where they
conflict with `feature-folder-structure.md`'s literal text, **these win** — the other doc
was a proposal; this is what got built.

### 1. Barrel imports only — no deep paths, ever
Only import from a module's **top-level** `index.ts` barrel (`@/features/<name>` or
`@/shared`) from outside that module. Never `@/features/events/api/events.api`, never even
an intermediate sub-barrel like `@/shared/schemas`. Internal files *inside* a module may
still import siblings by relative path (`../types/events.types`, `./common`).

Exception: if a top-level barrel would pull client-only code (hooks using
`useState`/`useEffect`) into a Server Component or Route Handler's bundle, see item 6 below
— the fix is `"use client"` on the hook file, not a deep import.

### 2. No default exports, anywhere, in any new/touched file
Every relocated component was converted from `export default function X` to
`export function X`. This applies to every file this migration touches, including old
`export default Component;` at the bottom of a file — delete that line and prefix the
declaration with `export` instead.

### 3. Component layout inside a feature
Two different rules apply depending on *why* the file exists:

- **Reusable pieces used by the feature's own main page** (i.e. the page matching the
  feature's own route, like `/donate`, `/careers`, `/artofteaching`): flat files directly
  in `components/`, e.g. `features/donate/components/donate-hero.tsx`. No per-component
  subfolder, no per-component `index.ts`.
- **A distinct sub-page under the feature** (a real, separate URL segment like
  `/donate/success`, `/gallery/[eventSlug]`): gets its own folder inside `components/`
  named after that URL segment, containing that page's view file(s) flat inside it, e.g.
  `features/donate/components/success/donate-success-view.tsx`. That folder gets its own
  `index.ts` too.
- **`events` is the one deliberate exception** — already built before this rule was
  finalized, and explicitly left as-is ("events is correct, don't touch"). There,
  `features/events/components/common/` holds the shared pieces (`event-card.tsx`,
  `grid.tsx`, etc., all flat, no subfolders each) and each sub-route
  (`office-hour`, `inspiration-station`, `salt-mango-tree`, `grab-your-superpowers`) has its
  own folder directly under `components/` (not nested one level deeper under a route
  folder) containing that route's `<name>-view.tsx`. Match this shape for events-adjacent
  work only; use the two-bullet rule above for every other feature.

Kind-folders other than `components/` (`api/`, `hooks/`, `schemas/`, `types/`, `utils/`,
`data/`) **never nest by sub-route** — they always stay flat at the feature root, even for
a feature with sub-pages. E.g. `features/be-a-part/types/learners.types.ts`, not
`features/be-a-part/learners/types/...`. Only the filename is prefixed with the sub-page's
name (`learners.types.ts`), matching the `<name>.<kind>.ts` convention.

### 4. Every page gets a `<name>-view.tsx`
Every route's composed page content lives in `features/<name>/components/<name>-view.tsx`
(or the sub-page-folder equivalent per rule 3), exported as `<Name>View`. The
`app/<route>/page.tsx` file becomes a thin wrapper: import the view from the feature
barrel, render it, nothing else (except `metadata`/`dynamic` exports, which must stay in
the `app/` file — Next.js routing requirement).

Sub-route view components that do their own thing (not shared with the feature's main
page) are named `<subroute>-view.tsx` too, e.g. `office-hours-view.tsx`,
`impact-gallery-view.tsx` (the interactive filter+grid part of `/impact-gallery`, separate
from the static hero which stays inline in the page-level Server Component).

### 5. Max SSR — plain fetch, no TanStack Query
TanStack Query was added in Phase 1, used briefly in Phase 3 for events, then **fully
removed** per explicit instruction. Do not reintroduce it. Current pattern:

- Fetch-once, no reactive params → plain `async function` Server Component, calls the
  feature's `api/<feature>.api.ts` function directly with `await`. No client hook at all.
  (Example: `Ranking.tsx` fetching top learners.)
- Genuinely interactive (search/filter/pagination changing what's fetched) → a plain
  `"use client"` hook in `hooks/<feature>.hooks.ts` using `useState`/`useEffect`/`useRef`,
  calling the api function, formatting errors through `getApiResponseError` from
  `@/shared`. See `features/events/hooks/events.hooks.ts` (`useWeeklyTwitchFetch` generic)
  and `features/careers/hooks/careers.hooks.ts` (`useHiringPage` generic) as the reference
  shape — both collapse what used to be ~10+ separate `useState` calls into one hook
  returning `{ data, error/pagination, isLoading, ... }`.
- Every route's default export is `async function` even when it doesn't currently
  `await` anything (e.g. `DonatePage`, `GalleryPage`) — keep pages async by default so
  adding a server fetch later doesn't require touching the signature.

### 6. `"use client"` fixes RSC/barrel conflicts — don't build a second barrel
If a Server Component or Route Handler import chain hits "You're importing a component
that needs useState... mark the file with 'use client'", the fix is `"use client"` at the
top of the *specific file* containing the hook call (e.g.
`src/shared/hooks/stats.hooks.ts`), keeping it in the single `@/shared` barrel. Do **not**
build a parallel `@/shared/client` barrel — that was tried, confirmed unnecessary, and
reverted. See `src/shared/hooks/stats.hooks.ts` for the reference fix.

### 7. Cross-feature data stays put until that feature's own migration turn
A file being migrated may import from a feature that hasn't been touched yet (e.g. `donate`
imports `galleryEvents` from what's now `@/features/gallery` — gallery was migrated in the
same session so that import got updated; but new work may hit imports still pointing at
`@/data/whatever` for an unmigrated feature). Leave those pointing at the old location
until you actually migrate the feature that owns the data — don't reach ahead. If a single
old `data/*.ts` file mixes content for multiple *unrelated* features (this happened
repeatedly — `data/events.ts` had events + in50hours + yip + artofteaching content;
`data/legal.ts` had all three legal pages; `data/lc-ig.ts` had learning-circle +
interest-groups), split it: each slice moves into the feature that actually owns that
page, not into a shared bucket.

### 8. Keep `src/lib/types/razorpay.d.ts` where it is
Explicitly told not to move/merge this into `features/donate/types/`. It's a pure ambient
`.d.ts` global-augmentation file; `features/donate/types/index.ts` re-exports
`RazorpayConstructor` from it via `export type { RazorpayConstructor } from "@/lib/types/razorpay";`
— leave that pattern as the one sanctioned exception to "everything lives in the feature."

### 9. Preserve dead code, don't clean it up silently
Several types/exports turned out unused after relocation (`OMEvent`, `WeeklyTwitchData`,
`Testimonial`, `contactApiRequestSchema`, etc.). These were **kept**, just relocated to
their logical new home, not deleted — this migration's job is to move code, not audit it.
Only delete a file/export when its *entire source file* becomes empty and provably has zero
importers (verified via repo-wide `grep`) — that's happened for whole old
`services/*.ts` / `lib/schemas/*.ts` files, not for individual unused exports within an
otherwise-live file.

### 10. New infra to use, old infra to stop using
When touching any file, swap these (even if not otherwise related to the file's move):
- `@/lib/env/env.client` → `@/config/env.client` (`clientEnv`)
- `@/lib/env/env.server` → `@/config/env.server` (`serverEnv`)
- `@/services/apiGateway` / raw axios → `@/lib/fetcher` (`publicGateway`/`privateGateway`)
- `@/services/urls` route constants → `@/shared`'s `endpoints` object
  (`shared/api/endpoints.ts`)
- Local hand-rolled error parsing → `getApiResponseError` from `@/shared`
- Old `useLandingStats` duplicated inline (raw `useState`+`WebSocket`) → the shared
  `useLandingStats()` hook from `@/shared` (found and fixed one real duplicate in
  `donate`'s `TrustBar.tsx`; check for more when touching any component using landing
  stats).

Do **not** proactively touch `src/lib/env/`, `src/services/*`, or other old infra in files
you aren't otherwise migrating — only swap it in files this migration is already touching.

---

## What's actually done (Phase 3 features fully migrated + building clean)

Each of these has been through: relocate → fix exports/imports → barrels at every level →
`bun run typecheck` → `bunx biome check` (0 errors) → `bun run lint:boundaries` (0
violations) → `bun run build` (all 41+ routes, exit 0). Re-verify all four after any further
change.

1. **events** — `features/events/` (api, hooks, types, utils, data, components/common +
   4 sub-route folders). The one feature with the flat-`common/` + flat-sub-route-folders
   shape (see rule 3 exception).
2. **donate** (+ `/donate/success`) — `features/donate/`. `TrustBar` deduplicated onto
   shared `useLandingStats`. `razorpay.d.ts` left in `lib/types/` per rule 8.
3. **gallery** (+ `/gallery/[eventSlug]`) — `features/gallery/`. Dynamic-route
   not-found case now renders `StateDisplay` with a "Go to Gallery" action instead of
   calling `notFound()`.
4. **impact-gallery** — `features/impact-gallery/`. Static hero stays in the page-level
   Server Component; only the filter+grid part is `ImpactGalleryView` (client).
5. **careers** — `features/careers/`. `useHiringPage` generic hook replaces the old
   ~24-`useState` two-tab pagination mess.
6. **contact** — `features/contact/`. Discord webhook notification service moved from
   `services/discord.ts` to `features/contact/api/contact.api.ts`
   (`sendContactNotification`). `lib/schemas/` folder is now fully empty/deleted.
7. **17 static/no-backend routes**: `privacy-policy`, `terms-and-conditions`,
   `refund-policy` (split from shared `data/legal.ts`), `manifesto`, `founders-message`,
   `self-determination-theory`, `learning-circle` + `interest-groups` (split from shared
   `data/lc-ig.ts`), `socials`, `in50hours`, `yip`, `artofteaching` (multi-component),
   `campus-logo-generator` (large self-contained client tool, moved wholesale),
   `levelstructure` (7 sub-components), `trivial-ideas` (7 sub-components, incl. renaming
   `Q&A.tsx` → `qna.tsx`).

Deleted as fully dead (zero remaining importers, confirmed by repo-wide grep before
deletion): `services/careers.ts`, `services/discord.ts`, `services/publicEvents.ts`,
`services/weeklyTwitches.ts`, `services/donation.ts`, `services/profile.ts`,
`services/useLandingStats.ts`, `lib/schemas/donation.ts`, `lib/schemas/contact.ts`,
`lib/schemas/index.ts` (whole folder gone), `lib/query-client.ts`,
`components/providers/query-provider.tsx` (TanStack removed), `data/donate.ts`,
`data/gallery.ts`, `data/impact-gallery.ts`, `data/legal.ts`, `data/lc-ig.ts`,
`data/socials.ts`.

**Type-only stubs already exist** (from Phase 2's monolith split, not yet built out with
components/data) for: `be-a-part` (just `learners.types.ts`), `community-partners`,
`home`, `kkem`, `report`, `team`, `testimonials`. These need the same full treatment as
everything above — types are the easy 10% already done, api/data/components are not.

---

## What's left

Per `feature-folder-structure.md`'s suggested order, next up, roughly in priority:

### `home` (route: `src/app/(home)/page.tsx`)
Components in `src/app/(home)/_components/`: `Hero`, `Stats` (already uses
`useLandingStats` — check it's using the shared one, not a local duplicate), `Community`,
`Comparison`, `Features`, `Gallery` (note: named `Gallery.tsx`, imports `galleryEvents`
from `@/features/gallery` already — just needs relocating), `Newsletter`, `Opportunities`,
`Roles`, `SpecialEventCard`, `SpecialEvents`, `Story`. All flat in
`features/home/components/` (main page, rule 3 bullet 1). Home page composition itself
becomes `HomeView`.

### `be-a-part/*` — 4 sub-routes, each a distinct page
- `be-a-part/campus` — `Activities`, `Apply`, `BestPractices`, `Hero`, `Journey`, `Quote`,
  `Structure`, `Why`. Nest per rule 3 bullet 2: `features/be-a-part/components/campus/`.
- `be-a-part/company` — `About`, `Benefits`, `Change`, `Contact`, `Hero`, `Mission`
  (already uses shared `useLandingStats`), `Partners`, `Success`. →
  `features/be-a-part/components/company/`.
- `be-a-part/enablers` — `Benefits`, `Colleges`, `GetInTouch`, `Hero`, `HowToBegin`,
  `MissionAndGrowth` (already uses `useLandingStats` + `fetchPublicProfileImage` from
  `@/shared` — just relocate), `SuccessStories`, `WhoIsEnabler`. →
  `features/be-a-part/components/enablers/`.
- `be-a-part/learners` — `CTA`, `Hero`, `Intro`, `Onboarding` (uses `OnboardingStep` type
  already in `features/be-a-part/types/learners.types.ts`), `Ranking` (**already fully
  migrated** — reads `fetchTopLearners` from `@/shared`, async Server Component, no client
  hook — this one's actually done, just needs its import path double-checked once the
  rest of the feature exists), `Status` (uses `useLandingStats`), `WhatYouGet`,
  `WhyKarmaPoints`, `WhyMuLearn`. → `features/be-a-part/components/learners/`.

Note: `be-a-part` has no single "main page" of its own (no `/be-a-part` route, only the
4 sub-routes) — so there's no rule-3-bullet-1 flat case here, every sub-route nests.

### `kkem` (+ `kkem/events/beyondus` sub-route)
- Main: `IGAbout`, `IGEvents`, `IGSection` (uses `interestGroups` from
  `@/features/interest-groups` already — cross-feature import, fine as-is) →
  `features/kkem/components/` flat.
- Sub-route `kkem/events/beyondus` — single page, uses `cardProps` type (already in
  `features/kkem/types/kkem.types.ts`) → nest per rule 3 bullet 2:
  `features/kkem/components/events-beyondus/` (or similar — pick a folder name matching
  the URL segment structure; this is a two-level nested route, use judgement, ask if
  unsure).

### `report`
`ReportCard`, `ReportHero` in `src/app/report/_components/`. Note `report/layout.tsx`
exists too — check what it does (likely just metadata, stays in `app/`). `AnnualReport`
type already in `features/report/types/report.types.ts`. The `annualReports` data array is
currently **commented out** in `data/impact-gallery.ts` (dead, never migrated — check if
report page actually renders real data or is stubbed/placeholder; handle accordingly,
don't invent data that doesn't exist).

### `team`
`TeamCard` in `src/app/team/_components/`. Data: `data/team.ts` is **177KB** — the
largest data file in the repo by far. Do not read it in full into context; move it with
`git mv` + a `sed` on the export line only, same mechanical approach used for
`campus-logo-generator`. Types already in `features/team/types/team.types.ts`.

### `testimonials`
`TestimonialStats`, `TextTestimonialCard`, `TextTestimonialsGrid`, `VideoSection` in
`src/app/testimonials/_components/`. Types already in
`features/testimonials/types/testimonials.types.ts`. `data/testimonials.ts` needs
relocating. Note: `TextTestimonialCard.tsx` and `MissionAndGrowth.tsx` (be-a-part/enablers)
both do their own per-item `fetchPublicProfileImage` batch-fetching via
`useEffect`/`Promise.all` — this was a deliberate earlier decision (documented in this
session) to leave as plain `fetchPublicProfileImage` calls rather than force into a
`useProfileImage` hook, since batch-per-item doesn't fit a single-item hook shape well.
Keep that pattern.

### `partners/community-partners` and `partners/company-partners`
`community-partners` has a type stub already
(`features/community-partners/types/community-partners.types.ts`,
`CommunityCardProps`/`Partner`). `company-partners` has **no stub at all** yet — plan its
types from scratch when you get there (check `src/app/partners/company-partners/_components/CompanyCard.tsx`
for shape). These are two separate single-page features (per "one route = one feature"),
not one `partners` feature with two sub-routes — confirm this reading matches the
`community-partners` stub's existing structure (it's flat at
`features/community-partners/`, not nested under a `partners/` parent) before starting
`company-partners`.

---

## How to do each remaining feature (the repeatable recipe)

1. **Survey**: `find src/app/<route> -type f`, read every file in `_components/` and the
   page itself. Check `grep -n "useLandingStats\|fetch(\|publicGateway\|axios"` to know if
   it's static or needs api/hooks work.
2. **Check existing stubs**: `ls src/features/<name>/` — Phase 2 may have already staged
   `types/`. Don't recreate what's there; extend it.
3. **Types**: if not already staged, `types/<name>.types.ts` + `types/index.ts`.
4. **Data**: if the page uses a `data/*.ts` file, check every consumer first
   (`grep -rln "@/data/whatever"`) — if it's single-feature, `git mv` it into
   `features/<name>/data/<name>.data.ts` wholesale, fix its own internal imports, add
   `data/index.ts`. If it's multi-feature, split (see rule 7).
5. **API/hooks**: only if the page actually calls the backend. Check `services/*.ts` for
   an existing raw-axios file to adapt into `api/<name>.api.ts` (swap in `lib/fetcher` +
   `shared`'s `endpoints`, per rule 10). Only add `hooks/<name>.hooks.ts` if genuinely
   interactive (rule 5) — otherwise the page/view stays a plain async Server Component
   calling the api function directly.
6. **Components**: `git mv` each `_components/*.tsx` into
   `features/<name>/components/` (flat or nested per rule 3), strip `export default` →
   named export (rule 2), fix every internal relative import, fix every
   `@/data/...`/`@/lib/...`/`@/services/...` import to the new locations.
7. **View**: build `<name>-view.tsx` from the old `page.tsx` body (rule 4). Keep
   `"use client"` iff the original had genuine interactivity requiring it — don't add or
   remove it speculatively, and don't strip it from something that needs it (search,
   filters, animation-triggered state, etc.) just to chase "max SSR" when the component
   truly is client-only.
8. **Barrels**: `components/index.ts` (+ nested sub-folder `index.ts`s), then the
   feature-root `index.ts` re-exporting everything from every kind-folder (rule 1).
9. **Thin app page**: `app/<route>/page.tsx` imports the view from
   `@/features/<name>` and renders it; keep any `metadata`/`dynamic` export in this file.
10. **Cross-feature fixups**: `grep -rln "@/data/<old-name>"` across the whole `src/`
    tree — other unmigrated pages may still import from the file you just moved (this
    happened repeatedly: `kkem` importing `interestGroups`, `donate` importing
    `galleryEvents`). Fix those import paths even though the consuming page itself isn't
    migrated yet.
11. **Delete dead source**: once a `git rm -q` won't break anything (verified via grep,
    not by build failure), remove the old `data/*.ts` / `services/*.ts` file.
12. **Verify** (in order, don't skip): `bun run typecheck`, then
    `bunx biome check --max-diagnostics 300 .` (fix only errors you introduced — leave
    pre-existing warnings alone), then `bun run lint:boundaries`, then
    `bun run build` (background it — takes ~30-60s; use the project's Monitor/background
    pattern rather than blocking). All four must be clean before moving to the next
    feature.

---

## After all of Phase 3

Per `feature-folder-structure.md`:

- **Phase 4 cleanup**: delete `src/data/` once fully empty, delete `src/lib/env/` (fully
  superseded by `config/env.client.ts`/`env.server.ts` — confirm zero remaining
  importers first), sweep for any `export *` (should already be zero — this
  implementation used named re-exports throughout), promote `lint:boundaries` to a
  required CI check if not already wired in.
- **`biome.json`'s `useFilenamingConvention`** is currently scoped to
  `src/features/**`, `src/shared/**`, `src/components/{layouts,providers}/**`, `config/**`
  only (not repo-wide) — once every route is migrated and `src/app/**/_components/` no
  longer exists anywhere, widen that override to the whole repo.
- Sweep `src/services/` and `src/components/` (non-`ui`) for anything left — by the end
  of Phase 3 both should be empty or contain only genuinely global infra
  (`services/cdn.ts`, `services/apiGateway.ts` if still referenced by anything not yet
  migrated — check before deleting).
