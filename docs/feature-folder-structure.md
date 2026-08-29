# Feature-Based Folder Structure

This was the original proposal for migrating `src/` from a layer-based structure
(`services/`, `hooks/`, `lib/types.ts`, `lib/schemas/`, `data/` all separate) into a
feature-based one. **The migration is complete.** See
[`docs/migration-progress.md`](./migration-progress.md) for the authoritative record of
what was actually built — conventions in force, what changed along the way, and why.

This doc now only tracks where the actual implementation **diverged from or never
completed** this original proposal, so nothing here is mistaken for still-current
guidance.

## What didn't happen

- **TanStack Query** — the original proposal (`hooks/<feature>.query-keys.ts` +
  `hooks/<feature>.hooks.ts` wrapping `useQuery`/`useMutation`, plus a global
  `lib/query-client.ts` + `components/providers/query-provider.tsx`) was tried and then
  explicitly rejected during implementation. The site is a public marketing site with no
  auth and mostly-static content, so the actual pattern is: fetch-once pages are plain
  async Server Components calling a feature's `api/*.ts` functions directly (no client
  cache needed), and genuinely interactive pages use a plain `"use client"` custom hook
  (`useState`/`useEffect`), formatting errors via `getApiResponseError` from `@/shared`.
  No query-key factories, no query client, no devtools anywhere in the codebase.
- **`app/sitemap.ts` / `app/robots.ts`** — proposed as Phase 4 cleanup items, never added.
  Still a legitimate, small, independent task if wanted.
- **Strictly named barrel re-exports everywhere** — the proposal said "named exports only,
  never `export *`." In practice, feature-root `index.ts` files (e.g.
  `features/kkem/index.ts`) do use `export * from "./components"` /
  `export * from "./data"` to re-export their own kind-folders. This was a deliberate,
  reviewed deviation (see `migration-progress.md`'s Phase 4 notes) — it doesn't violate
  the barrel-only import rule from outside a feature, it just aggregates internally
  without naming every single component.

## What ended up slightly different

- **`config/` location** — proposed at the repo root (`config/env.client.ts`, outside
  `src/`). It was built there first, then later moved into `src/config/` (still aliased
  as `@/config/*`, which already resolves via the `@/*` → `./src/*` mapping — no separate
  path-alias entry was needed once it moved).
- **The fetcher is axios-based, not native-`fetch`-based** — `src/lib/fetcher.ts` wraps
  `axios.create()` rather than the raw `fetch()` shown in this doc's original code
  sample. Functionally equivalent (same Django-error-envelope parsing via
  `extractDjangoMessage`, same public/private client split), just a different HTTP client
  under the hood.

### fetch vs. axios in a Next.js App Router codebase

The two clients aren't equivalent once you factor in *where* the code actually executes.
Next.js's App Router patches the global `fetch` (server-side only) to add a Data Cache,
automatic request de-duplication within a single render pass, and per-call
`revalidate`/`tags` control. **This patching is done by monkey-patching `fetch` itself** —
it is not a generic "server-side HTTP client cache." Any HTTP client that doesn't route
through the patched `fetch` (axios included, since it uses `XMLHttpRequest`/Node's `http`
module under the hood depending on environment, never `fetch`) is invisible to this system
entirely, on the server or the client.

That single fact is the whole tradeoff:

| Capability | `fetch` (server-executed) | `axios` (current, any environment) |
|---|---|---|
| Next.js Data Cache (`cache: "force-cache"`, the default) | ✅ automatic — repeated identical requests across a render tree, and across requests, are deduped/cached | ❌ never — invisible to Next's patch |
| Time-based revalidation (`next: { revalidate: N }`) | ✅ built-in ISR-style staleness | ❌ must hand-roll (in-memory cache, `unstable_cache`, or external cache) |
| On-demand revalidation (`revalidateTag`/`revalidatePath`) | ✅ works when the fetch was tagged | ❌ unavailable |
| Per-request de-dup within one render (React `cache()` semantics) | ✅ automatic for `fetch`, `React.cache()` wraps anything else | ⚠️ only if you manually wrap the call in `React.cache()` |
| Client-side calls (browser, inside `"use client"` components) | Data Cache **does not apply here either** — it's a server-only mechanism | Same — no advantage/disadvantage for client calls |
| Bundle size | 0 KB, built into the runtime | ~15 KB gzipped, shipped to the client for every client-side caller |
| Interceptors / auto-JSON / `timeout` option | Hand-rolled (the original proposal's `request()` sample already did this) | Built-in, already wired in `src/lib/fetcher.ts`'s `createClient` |
| Non-2xx handling | Resolves successfully — must check `response.ok` manually | Rejects automatically on non-2xx |
| Edge runtime compatibility | ✅ native | ⚠️ works, but adds weight to an Edge bundle unnecessarily |

**Where this actually matters in *this* codebase**, not in the abstract: I checked every
feature's data-fetching call site. Out of every route in the app, **exactly one** does a
genuine server-side backend fetch from an async Server Component today:

- `src/features/events/components/common/events-view.tsx` — `export async function
  EventsView()` calls `fetchPublicEvents()` (→ `src/features/events/api/events.api.ts`,
  axios) directly, with no `"use client"` in the file. This is the *only* place in the
  entire app where switching to `fetch` would unlock the Data Cache/ISR machinery
  described above — and today it gets zero caching benefit, because it's on axios. Every
  render of `/events` re-hits the backend from scratch.

Every other backend-calling code path in the app is **client-executed**, where the
Data Cache distinction is moot — `fetch` and `axios` are equally uncached there, because
Next's Data Cache is a server-only feature to begin with:
- `src/features/careers/hooks/careers.hooks.ts` (`"use client"`) — pagination fetched from
  a `useEffect`-driven hook in `careers-view.tsx` (itself `"use client"`).
- `src/features/donate/api/donate.api.ts` — called from `donation-form.tsx`
  (`"use client"`), and it's payment-order/verify/subscribe traffic anyway — inherently
  non-cacheable, mutation-shaped requests. `fetch` vs `axios` makes zero performance
  difference here.
- `src/shared/hooks/stats.hooks.ts` (`useLandingStats`) — a client-side `WebSocket`
  connection, not HTTP at all; irrelevant to this comparison entirely.

Every other server-rendered `*-view.tsx` in the app (`home`, `donate` static sections,
`gallery`, `manifesto`, `privacy-policy`, etc.) reads from local `data/*.data.ts` files,
not the backend — there's no network call to cache in the first place.

**Pros of switching to `fetch`:** unlocks Data Cache/ISR for the one route that actually
does server-side backend fetching today (`/events` — meaningful, since events data
changes but doesn't need to be live-live, a classic `revalidate: 60`-style candidate);
removes a ~15KB dependency from the client bundle for the client-executed call sites
(`donate`, `careers`); matches the platform primitive Next's own tooling/docs assume, so
future server-fetching code gets caching "for free" by default instead of needing a
reminder to avoid axios.
**Cons:** loses axios's built-in interceptor/timeout/auto-JSON ergonomics (would need
re-implementing in `lib/fetcher.ts`'s `request()`, same as the original proposal's code
sample already showed how to do); touches every `api/*.ts` file across every feature for
a benefit that's concentrated in exactly one route today.

**Pros of keeping `axios`:** zero migration cost, already battle-tested here, nicer
request/response ergonomics without hand-rolling them, and — importantly — **most of the
codebase wouldn't benefit anyway**, since most backend calls are client-executed
(Data Cache doesn't apply there regardless of client library) or don't exist (most pages
are static-data-only).
**Cons:** the `/events` route specifically forfeits ISR-style caching it could otherwise
have essentially for free, and any *future* server-fetching feature (a plausible next
addition — e.g. a live `/team` roster pulled from the backend instead of the 177KB static
file) would inherit the same blind spot unless someone remembers to reach for `fetch`
directly instead of the shared `publicGateway`.

**Verdict, engineering call:** switching *only* `src/features/events/api/events.api.ts`
to `fetch` (leaving `donate`/`careers`/everything else on axios, since they're
client-executed and gain nothing) is a small, surgical, low-risk change with a real,
measurable win — fewer redundant backend hits on the highest-traffic content page in the
app. A full site-wide axios→fetch migration is not justified by the data above; it would
touch every feature for a benefit that materializes in exactly one of them. If this
matters, scope it to `events.api.ts` alone rather than rewriting `lib/fetcher.ts`
wholesale.

### Migration code: the one function worth converting

Only `fetchPublicEvents` (`src/features/events/api/events.api.ts:35-40`) is called from
the server (`EventsView`, `src/features/events/components/common/events-view.tsx`). The
other four functions in the same file (`fetchOfficeHours`, `fetchSaltMangoTree`,
`fetchInspirationStation`, `fetchGrabYourSuperpowers`) back client-rendered sub-routes —
leave those on `publicGateway` (axios) exactly as-is, since converting them buys nothing
(§ above). Current implementation:

```ts
// src/features/events/api/events.api.ts (current)
import { publicGateway } from "@/lib/fetcher";
import { endpoints } from "@/shared";

export async function fetchPublicEvents(params?: PublicEventsParams): Promise<PublicEvent[]> {
  const res = await publicGateway.get(endpoints.publicEvents.getEvents, {
    params: params ? buildPublicEventsParams(params) : undefined,
  });
  return res.data.response;
}
```

Proposed `fetch`-based replacement, alongside the existing function (not a rewrite of
`lib/fetcher.ts` — this is a one-off, scoped to the one call site that benefits):

```ts
// src/features/events/api/events.api.ts (proposed)
import { apiConfig } from "@/config/api";
import { endpoints } from "@/shared";
import { extractDjangoMessage } from "@/lib/errors";

export async function fetchPublicEvents(params?: PublicEventsParams): Promise<PublicEvent[]> {
  const query = params ? `?${buildPublicEventsParams(params)}` : "";
  const res = await fetch(`${apiConfig.baseUrl}${endpoints.publicEvents.getEvents}${query}`, {
    // Events change, but not every second — cache for 60s, then revalidate in the
    // background on the next request (classic ISR-style staleness, not "no-store").
    next: { revalidate: 60, tags: ["public-events"] },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(extractDjangoMessage(errorData) ?? res.statusText);
  }

  const data = await res.json();
  return data.response;
}
```

Notes on this specific migration:
- `revalidate: 60` is a starting guess, not a measured value — tune it against how often
  the events backend actually publishes changes. `tags: ["public-events"]` is there so a
  future admin action (e.g. publishing a new event) could call `revalidateTag`
  on-demand instead of waiting out the 60s window, if that becomes relevant.
- This drops the automatic retry-on-failure behavior `publicGateway`'s axios instance
  doesn't actually have either (per the comparison table above, axios doesn't retry by
  default without extra config) — so no regression there.
- `EventsView` itself doesn't need to change at all — it already does
  `await fetchPublicEvents(...)` and doesn't care which HTTP client produced the promise.

### A-to-Z: the full "why," not just the recommendation

The comparison table and verdict above already give the *what*. Here's the complete
reasoning chain, for anyone who needs to defend or revisit this decision later:

**Why does this matter at all, architecturally?** Next.js's App Router made a deliberate
bet: instead of a separate data-fetching library (Redux/SWR/TanStack Query) owning
caching, it extended the platform's own `fetch()` to do it, tied to the render lifecycle
itself. This is why the original proposal's TanStack Query plan was dropped (see "What
didn't happen" above) — the framework already has an answer to "how do I cache a fetch,"
and it's `fetch()` + `revalidate`. Choosing axios for `lib/fetcher.ts` opted the entire
app out of that answer before a second one was ever built to replace it. Nothing replaced
it — there's no cache layer of any kind in this codebase for server-fetched data (§ above:
zero routes declare `revalidate`, and TanStack Query — the other candidate — was rejected
too). That's not a choice, it's a gap that happened as a side effect of the axios pick.

**Why is the impact concentrated in one file, not spread across the app?** Because of
*where* code executes, which is the single most important fact in a Server-Components
architecture and easy to lose track of once a shared `publicGateway` object is imported
from a dozen places. `fetch()`'s Data Cache is a **server-runtime** feature — it lives in
the Node.js/Edge process handling the request, keyed by URL + options, shared across
however many components in that render tree ask for the same thing. A `"use client"`
component's `fetch()` call runs in the *browser*, which has never had access to this
cache, with either HTTP client. This is why `donate`/`careers` (both client-executed) get
zero benefit from switching — the fix doesn't apply to where they run, full stop, not a
matter of degree.

**Why not just switch everything anyway, for consistency?** Consistency is a real value,
but it has to be weighed against: (a) `lib/fetcher.ts`'s axios `createClient()` already
has working interceptors, a consistent `FetcherError` shape, and `toFetcherError`'s
Django-envelope normalization — all of which would need to be re-implemented per-callsite
if every `api/*.ts` file rolled its own `fetch()` wrapper, or centralized into a second,
parallel `lib/fetcher.ts`-style abstraction just for the `fetch()` path (real, non-trivial
work); (b) the risk surface of a site-wide HTTP-client swap (every request/response shape,
every error path, every timeout behavior) is much larger than a one-function change, for
a site where 3 of the app's 4 real backend integrations (`donate`, `careers`,
`useLandingStats`) get no upside from it; (c) "consistency" isn't actually free here
either way — `donate.api.ts` calling `fetch()` for a payment-order POST would need to
hand-roll the same non-2xx-rejects-automatically handling axios already gives it, purely
for stylistic uniformity with a different route's GET call.

**What's the actual risk of doing the scoped `events.api.ts` migration?** Low, but not
zero — three things to verify before merging:
1. **Response shape** — `res.data.response` (axios) vs `data.response` (fetch, after
   `.json()`) must resolve to the same object shape; the proposed code above already
   accounts for this, but write one assertion/log comparing both during a canary
   deploy if this ships to production traffic serving real users.
2. **Error shape parity** — `extractDjangoMessage` is currently only exercised via
   axios's `error.response?.data` shape (see `toFetcherError` in `lib/fetcher.ts`); the
   proposed `fetch()` code calls it against `await res.json()` directly on a non-ok
   response, which should be the same backend payload, but hasn't been verified against
   a live 4xx/5xx from the real API in this pass — confirm with one deliberate bad
   request (e.g. an invalid query param) before trusting error messages render
   identically for users.
3. **Revalidation value** (`revalidate: 60`) is a placeholder — set it based on how often
   the backend actually publishes new events (ask whoever owns that system, or start
   conservative at `revalidate: 30` and widen once confirmed nothing depends on
   sub-30-second freshness).

**Rollback plan, if something goes wrong post-deploy:** since only `fetchPublicEvents`'s
implementation changes and its call site/signature stays identical, reverting is a
single-file `git revert` with no downstream consumers to touch — this is exactly why the
migration was scoped to one function instead of the whole fetcher: the blast radius of
getting it wrong is one route, and the fix is one file.

## SEO — done (2026-08-29)

> Original investigation below is superseded. Full status lives in
> `docs/implementation-plan.md` Phase 4; this section is kept short as a pointer, not a
> re-derivation.

All gaps this section originally documented are closed:

- **Canonical-URL bug** — every route now passes `canonical` to `constructMetadata()`.
- **Title/description/keywords** — all 39 routes call `constructMetadata()` (converted the
  7 that hand-rolled their own `Metadata` object); `/gallery/[eventSlug]` uses
  `generateMetadata()` per event; `donate/success` and a missing-event gallery slug both
  set `noIndex: true`.
- **`constructMetadata()` gaps** — `twitter` card block and `src/app/layout.tsx`'s
  `viewport` export both added.
- **`sitemap.ts` / `robots.ts`** — both added (`src/app/sitemap.ts`, `src/app/robots.ts`).
- **Heading hierarchy** — home page's 10 `<h1>`s demoted to `<h2>` (hero.tsx's `MotionH1`
  kept as the page's one real `<h1>`, rather than also demoting it as originally
  suggested); `/team` and `/careers` each got a real `<h1>` promoted from their top
  heading. `/contact` and `/kkem` already had a real `<h1>` — this doc's claim they didn't
  was stale by the time of implementation.
- **Structured data (JSON-LD)** — deliberately **not done**. Considered
  (Organization/WebSite site-wide, `Event`/`JobPosting` per-route) and skipped as a
  judgment call: real upside is narrow (mainly Google Jobs indexing for `/careers`), and
  not worth the added page-touching for this site's traffic profile. Revisit only if
  `/careers` needs Google Jobs visibility specifically.

### Bonus item — donation double-submit guard (unrelated to SEO, tracked here since it surfaced in the same audit pass)

- [ ] `src/features/donate/components/donation-form.tsx` — add an `isSubmitting`-style disable
      on the submit button, matching the pattern already used correctly in
      `src/features/contact/components/contact-form.tsx`.

**Acceptance criteria:** rapidly double-clicking "Donate" on a valid form fires exactly one
`submitDonationForm`/`submitSubscription` request, not two.

---

## Related investigation: Swiper → Embla Carousel (dependency-swap analysis, not folder structure)

Not a folder-structure or SEO topic, but the same "is this dependency choice still the right
one" lens this doc already applies to `fetch` vs. `axios` above was also applied to this
codebase's carousel library. Documented in full — all 3 current Swiper call sites
(`success-stories.tsx`, `colleges.tsx`, `video-section.tsx`), a measured bundle-size comparison,
pros/cons (manual-scroll/drag support, autoplay, loop-mode behavioral differences, hand-rolled
UI vs. Swiper's built-in navigation/pagination), and a 5-step migration plan — in
`docs/bundle-analysis.md` §7. Cross-referenced here only so a reader of this doc's
architecture-decision sections doesn't miss it; the full analysis lives in the bundle doc since
it's fundamentally a bundle-size investigation, not a structural one.

## Bonus finding: donation form allows double-submit (from a scoped usability check)

Not part of the fetch/axios or SEO work above, but surfaced while auditing this codebase
in the same session and worth recording here rather than losing it: `src/features/donate/
components/donation-form.tsx` has no `isSubmitting`-style disable on its submit button.
The button is only disabled via `!isValid || totalAmount === 0` (a static form-validity
check), not while the async `submitDonationForm`/`submitSubscription` request (which
kicks off a real Razorpay payment flow) is in flight. A `toast.loading(...)` is shown
during the request, but the button itself stays clickable — a user double-clicking
"Donate" (impatience, slow network, accidental double-tap on mobile) can fire the
payment-order request twice. Compare against `src/features/contact/components/
contact-form.tsx`, which does this correctly (`isSubmitting` state disables the button
and shows a spinner). Fix: add the same `isSubmitting` pattern to `donation-form.tsx`'s
submit button — small, isolated change, same pattern already proven in a sibling
component in this codebase.

Everything else described in the original proposal — the `<feature>.<kind>.ts` naming,
the kind-folder vocabulary, the barrel-only import rule (enforced by
`.dependency-cruiser.cjs`), kebab-case filenames (enforced by `biome.json`), the
`shared/` vs `features/` split, `lib/metadata.ts`'s `constructMetadata()`,
`shared/api/endpoints.ts` — was implemented as designed. Refer to
`docs/migration-progress.md` for the current, accurate description of those conventions.
