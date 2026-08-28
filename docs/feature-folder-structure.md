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

## SEO: not done for all pages

> For the Lighthouse-scoring view of these same gaps (which exact SEO/Accessibility/Best
> Practices audit each one fails, and the execution order to close all four Lighthouse
> categories to 100), see `docs/performance-audit.md` §9.

The proposal's `constructMetadata()` pattern (§2 in the original spec, still
`src/lib/metadata.ts` in the real codebase) exists and works, but it's only actually
**called on 7 of the 39 routes**:

- `src/app/donate/layout.tsx`
- `src/app/donate/success/layout.tsx`
- `src/app/gallery/page.tsx`
- `src/app/refund-policy/page.tsx`
- `src/app/report/layout.tsx`
- `src/app/self-determination-theory/page.tsx`
- `src/app/yip/page.tsx`

**The other 32 routes have no page-level `metadata` export at all** — they silently
inherit the root layout's default (`src/app/layout.tsx:12`,
`export const metadata = constructMetadata();`, i.e. the generic site name/description).
That means 32 distinct pages — `/team`, `/careers`, `/events`, `/testimonials`,
`/be-a-part/*`, `/kkem`, `/impact-gallery`, `/privacy-policy`, `/terms-and-conditions`,
`/interest-groups`, `/learning-circle`, `/levelstructure`, `/socials`, `/manifesto`,
`/founders-message`, `/in50hours`, `/artofteaching`, `/campus-logo-generator`,
`/trivial-ideas`, `/contact`, `/partners/*`, the home page, and more — all currently
share **the exact same `<title>` and meta description** in search results and social
shares. This is a real SEO gap: search engines and social previews can't distinguish
these pages from one another, and none of them get a page-specific canonical URL either.

**Also worth noting:** none of the 7 pages that *do* set metadata actually call
`constructMetadata()` — every one hand-rolls its own plain `Metadata`/object literal
instead (e.g. `src/app/gallery/page.tsx:5-8`, `src/app/yip/page.tsx:3-5`). This means they
bypass the shared helper's `openGraph`/`twitter`/`metadataBase`/keyword defaults —
`gallery`, `refund-policy`, `yip`, and `donate/success` set only `title`+`description`
with no `openGraph`/`twitter` fields at all, so social-share previews for those pages fall
back to whatever the browser/platform does with a bare title, not the site's OG image.
Only `donate/layout.tsx`, `report/layout.tsx`, and `self-determination-theory/page.tsx`
hand-wrote their own full `openGraph` block to compensate.

### The canonical-URL bug (the most damaging finding here)

Next.js App Router `metadata` **inherits down the layout tree** — a segment that doesn't
export its own `metadata` doesn't get "no metadata," it gets **the nearest ancestor's
metadata object verbatim**. Since the root layout calls `constructMetadata()` with no
arguments (`src/app/layout.tsx:12`), and `constructMetadata()`'s default `canonical` is
`undefined` → falls back to `siteConfig.url` (`src/lib/metadata.ts:41`,
`alternates: { canonical: canonical || siteConfig.url }`; same fallback also feeds
`openGraph.url` at line 34), **every one of the 32
uncovered routes renders `<link rel="canonical" href="https://mulearn.org/">`** — pointing
at the homepage, not at its own URL. `/team`, `/careers`, `/testimonials`,
`/be-a-part/campus`, all 32 of them, literally tell Google "the canonical version of this
page is the homepage." This is not a cosmetic gap — it's the single highest-impact SEO
defect found, because a search engine that respects `rel=canonical` (they do) can
deprioritize or drop these pages from its own index in favor of the homepage, treating
them as duplicate/non-canonical content. `openGraph.url` inherits the same way, so social
shares of any of these 32 pages also link back to the homepage in their OG metadata.

**Fix:** every route needs at minimum `canonical: "https://mulearn.org/<path>"` passed to
`constructMetadata()` — this alone (even without a custom title/description) fixes the
canonical bug for that route.

### Other gaps in `constructMetadata()` itself (`src/lib/metadata.ts`)

- **No `twitter` card object** — the returned `Metadata` has `openGraph` but no `twitter`
  key at all (compare against the original proposal's code sample, which included
  `twitter: { card: "summary_large_image", ... }`). This means Twitter/X (and any
  platform reading the `twitter:*` meta tags specifically rather than falling back to
  OG tags) gets no card at all for **every** route, including the 7 already-customized
  ones — this is a helper-level gap, not a per-page one.
- **No `viewport` export anywhere** — `src/app/layout.tsx` has no `export const viewport`.
  Next.js 14+ requires `viewport` (including `themeColor`) to be a separate export from
  `metadata`; omitting it isn't fatal (Next supplies a default), but it means there's no
  `theme-color` meta tag for mobile browser chrome theming, and no explicit control over
  `width=device-width, initial-scale=1`.
- **No `manifest.json` / PWA manifest** — no `app/manifest.ts` or `public/manifest.json`
  exists. Not required for basic SEO, but affects "Add to Home Screen" installability and
  is a quick, standard addition (`app/manifest.ts` returning a `MetadataRoute.Manifest`).
- **Only one favicon** (`public/favicon.ico`) — no `icon.svg`/`apple-icon.png` for
  higher-resolution displays or iOS home-screen icons. Low priority, but a one-file fix
  (`app/icon.png` / `app/apple-icon.png`, Next auto-wires these by filename convention).

### Structured data (JSON-LD) — essentially unused

Only **one** route in the entire app emits structured data:
`src/features/self-determination-theory/components/self-determination-theory-view.tsx:142`
(`dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}`). This is a missed
opportunity for a content site like this. Four concrete gaps, each with the actual
schema code to close it — not just "add structured data," but what to add and where:

**1. Homepage — `Organization` + `WebSite` schema (highest value, do this first)**

No brand-level schema exists anywhere. This is what powers Google's knowledge panel,
sitelinks search box, and logo-in-search-results eligibility — the single highest
return-on-effort piece of structured data for any brand site, and it's a static, one-time
block (no data-shape dependency on any feature).

```tsx
// src/app/layout.tsx — add inside <head>, alongside existing metadata
import { siteConfig } from "@/config/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.ogImage}`,
  sameAs: [
    "https://linkedin.com/company/gtechmulearn/",
    "https://instagram.com/mulearn.official/",
    "https://youtube.com/c/mulearn",
    "http://facebook.com/gtechmulearn",
  ], // matches shared/data/common.data.ts's `socials` array — keep these two in sync
};

// in the <head>, alongside other tags:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
/>;
```

**2. `/events` — `Event` schema per listed event**

`fetchPublicEvents()` (`src/features/events/api/events.api.ts:35`) already returns
`PublicEvent[]` with `title`, `description`, `start_datetime`, `end_datetime`, `venue`,
`organizer` — nearly a 1:1 mapping to `schema.org/Event`, no new data-fetching required:

```tsx
// src/features/events/components/common/events-view.tsx — add near the rendered event list
function buildEventJsonLd(events: PublicEvent[]) {
  return events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.start_datetime,
    endDate: event.end_datetime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.venue
      ? { "@type": "Place", name: event.venue.name, address: event.venue.address }
      : undefined,
    organizer: event.organizer
      ? { "@type": "Organization", name: event.organizer.name }
      : { "@type": "Organization", name: "µLearn" },
    image: event.cover_image ?? undefined,
  }));
}

// in the render, once ongoingEvents/upcomingEvents are resolved:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(buildEventJsonLd([...ongoingEvents, ...upcomingEvents])),
  }}
/>
```

**3. `/careers` — `JobPosting` schema per listing**

`fetchOngoingHiringPage()` (`src/features/careers/api/careers.api.ts:24`) returns
`OngoingHiring[]` with `role`, `organization`, `location`, `lastdate`,
`remuneration` — maps to `schema.org/JobPosting`, which Google Jobs specifically
indexes and surfaces in its dedicated jobs search UI (real traffic upside, not just a
generic SEO nicety):

```tsx
// src/features/careers/components/careers-view.tsx — add near the ongoing-hiring list
function buildJobPostingJsonLd(jobs: OngoingHiring[]) {
  return jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.role,
    hiringOrganization: { "@type": "Organization", name: job.organization },
    jobLocation: { "@type": "Place", address: job.location },
    validThrough: job.lastdate,
    employmentType: job.duration, // adjust if `duration` isn't in schema.org's enum shape (FULL_TIME/INTERN/etc.) — map it if not
    baseSalary: job.remuneration
      ? { "@type": "MonetaryAmount", currency: "INR", value: job.remuneration }
      : undefined,
  }));
}
```

**4. `/gallery/[eventSlug]` — `Event` schema per gallery page**

Combine this with the `generateMetadata` fix shown below (same data source,
`getGalleryEventBySlug`) — add the JSON-LD in the same file:

```tsx
// src/app/gallery/[eventSlug]/page.tsx — alongside generateMetadata below
function buildGalleryEventJsonLd(event: GalleryEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.date,
    location: { "@type": "Place", name: event.location },
    image: event.coverImage,
  };
}
```

### Dynamic route SEO gap: `/gallery/[eventSlug]`

`src/app/gallery/[eventSlug]/page.tsx` has **no `generateMetadata` function** at all —
confirmed via `grep -n "metadata\|generateMetadata"` returning zero matches. Every
individual gallery event page (e.g. `/gallery/dod`, `/gallery/<any-slug>`) renders the
exact same inherited root metadata (title, description, and — per the canonical bug above
— the homepage canonical URL), despite each event having a real, unique `name`,
`description`, and `coverImage` already available from `getGalleryEventBySlug(slug)`
(`src/features/gallery/data/gallery.data.ts:599`). This is a page-per-event SEO
opportunity with zero implementation cost — the data already exists, it's just never
passed to a metadata function. Fix shape:

```tsx
// src/app/gallery/[eventSlug]/page.tsx
import { constructMetadata } from "@/lib/metadata";
import { getGalleryEventBySlug } from "@/features/gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const event = getGalleryEventBySlug(eventSlug);
  if (!event) return constructMetadata({ noIndex: true });
  return constructMetadata({
    title: event.name,
    description: event.description,
    image: event.coverImage,
    canonical: `https://mulearn.org/gallery/${event.slug}`,
  });
}
```

### `sitemap.ts` / `robots.ts` — proposed as Phase 4 cleanup, never added, still open

Neither `src/app/sitemap.ts` nor `src/app/robots.ts` exists (confirmed earlier in this
doc). Both are one-file, low-risk additions using Next's built-in `MetadataRoute` types —
no new dependency, no data-fetching required for the static routes:

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { galleryEvents } from "@/features/gallery";

const staticRoutes = [
  "",
  "artofteaching",
  "be-a-part/campus",
  "be-a-part/company",
  "be-a-part/enablers",
  "be-a-part/learners",
  "campus-logo-generator",
  "careers",
  "contact",
  "donate",
  "events",
  "events/grab-your-superpowers",
  "events/inspiration-station",
  "events/office-hour",
  "events/salt-mango-tree",
  "founders-message",
  "gallery",
  "impact-gallery",
  "in50hours",
  "interest-groups",
  "kkem",
  "kkem/events/beyondus",
  "learning-circle",
  "levelstructure",
  "manifesto",
  "partners/community-partners",
  "partners/company-partners",
  "privacy-policy",
  "refund-policy",
  "report",
  "self-determination-theory",
  "socials",
  "team",
  "terms-and-conditions",
  "testimonials",
  "trivial-ideas",
  "yip",
]; // `donate/success` deliberately excluded — a post-transaction page, not meant to be indexed/crawled

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mulearn.org";
  const staticEntries = staticRoutes.map((path) => ({
    url: path ? `${base}/${path}` : base,
    lastModified: new Date(),
  }));
  const galleryEntries = galleryEvents.map((event) => ({
    url: `${base}/gallery/${event.slug}`,
    lastModified: new Date(),
  }));
  return [...staticEntries, ...galleryEntries];
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/donate/success"], // success page: real per-user data, no reason to be crawled
    },
    sitemap: "https://mulearn.org/sitemap.xml",
  };
}
```

Note the `staticRoutes` array above is manually maintained and will drift out of sync
with `src/app/` if a route is added/removed without updating it — worth a comment at the
top of the real file pointing back to this doc, or (better, if this becomes annoying)
generating it from a `fs.readdirSync` walk of `src/app/**/page.tsx` at build time instead
of hand-listing it, since the migration already produced a complete, accurate list of
every route (§ this doc references it multiple times above).

### Heading hierarchy — both failure modes present

Grepped every feature's rendered `<h1>`/`<MotionH1>` (the `framer-motion`-wrapped `h1`
from `src/components/layouts/mu-framer.tsx:49`) usage:

- **The home page renders 10 separate `<h1>` elements** — one each in `hero.tsx` (via
  `MotionH1`), `features.tsx:48`, `story.tsx:26`, `special-events.tsx:27`,
  `comparison.tsx:25`, `opportunities.tsx:26`, `roles.tsx:39`, `stats.tsx:45`,
  `community.tsx:32`, `gallery.tsx:124`. Every section component independently reached
  for `<h1>` as a "make this text big" shortcut instead of following a heading hierarchy.
  A page should have exactly **one** `<h1>` (the page's primary subject); every one of
  these section headings should be `<h2>` (they're already visually styled via Tailwind
  classes, not by tag — demoting the tag doesn't change how any of them look).
- **`/team`, `/careers`, `/contact`, `/kkem` have zero `<h1>` anywhere on the page** — the
  opposite failure. `team-view.tsx` and `careers-view.tsx` both open their top section
  with `<h2>` (`team-view.tsx:74,144`, `careers-view.tsx:59`) and never use `<h1>` at all.
  These pages have no clearly-signaled primary heading for either search engines or
  screen-reader users navigating by heading level.

Both are quick, purely mechanical fixes (swap the tag, not the styling) but were flagged
as a genuine gap since heading structure is a real on-page SEO and accessibility signal
that costs nothing to get right.

### Complete implementation: `constructMetadata()` for every route

Every title/description below was pulled from that page's actual rendered `<h1>`/hero
copy (not generic filler), so this table is ready to implement directly, not a
placeholder to fill in later. The pattern is identical for every route — only the
argument values change:

```tsx
// the pattern, shown once — apply to every route.tsx/layout.tsx in the table below
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "…",
  description: "…",
  canonical: "https://mulearn.org/<path>",
});
```

For a route whose `page.tsx` is currently a Server Component with no other exports, add
the `metadata` export alongside the existing `export default async function ...Page()` —
no other change needed. For the 7 routes that currently hand-roll their own `Metadata`
object in a `layout.tsx` or `page.tsx`, replace that object literal with a
`constructMetadata({...})` call using the same title/description they already have (shown
in the table too, marked *convert*), so they pick up the shared `openGraph`/`twitter`
defaults instead of the partial ones they wrote by hand.

| Route | File to edit | `title` | `description` |
|---|---|---|---|
| `/artofteaching` | `src/app/artofteaching/page.tsx` | Art of Teaching 4.0 | µLearn Art of Teaching 4.0 — a program for educators exploring student-centered, peer-driven teaching methods. |
| `/be-a-part/campus` | `src/app/be-a-part/campus/page.tsx` | Campus Chapter | Start a µLearn Campus Chapter — bring peer-led, proof-of-work learning to your college. |
| `/be-a-part/company` | `src/app/be-a-part/company/page.tsx` | Partner With µLearn | Partner with µLearn as a company — access talent, validate skills, and support proof-of-work learning. |
| `/be-a-part/enablers` | `src/app/be-a-part/enablers/page.tsx` | Empower Your Campus | Become a µLearn Enabler — guide chapters, mentor learners, and empower your campus community. |
| `/be-a-part/learners` | `src/app/be-a-part/learners/page.tsx` | Unlock Your Potential | Join µLearn as a learner — unlock your potential through peer-to-peer, proof-of-work learning. |
| `/campus-logo-generator` | `src/app/campus-logo-generator/page.tsx` | Campus Logo Generator | Generate a custom µLearn campus chapter logo in seconds using the official brand kit. |
| `/careers` | `src/app/careers/page.tsx` | Career Labs | µLearn Career Labs — connect with job and internship opportunities from industry partners. |
| `/contact` | `src/app/contact/page.tsx` | Contact Us | Get in touch with µLearn — questions, feedback, and partnership inquiries welcome. |
| `/donate` | `src/app/donate/layout.tsx` *(convert)* | Donate | Support µLearn's mission of peer-to-peer, proof-of-work learning with a one-time or recurring donation. |
| `/donate/success` | `src/app/donate/success/layout.tsx` *(convert)* | Donation Successful | Thank you for your generous donation to µLearn Foundation. **Also pass `noIndex: true`** — matches the `robots.ts`/`sitemap.ts` exclusion above; this is a post-transaction confirmation page, not content meant to rank. |
| `/events` | `src/app/events/page.tsx` | Events | µLearn Events — recurring sessions, stories, and learning experiences held every week. |
| `/events/grab-your-superpowers` | `src/app/events/grab-your-superpowers/page.tsx` | Grab Your Superpowers | Weekly µLearn sessions to help you unlock new skills, guided by mentors and peers. |
| `/events/inspiration-station` | `src/app/events/inspiration-station/page.tsx` | Inspiration Station Radio | µLearn Inspiration Station Radio — stories and conversations to spark your learning journey. |
| `/events/office-hour` | `src/app/events/office-hour/page.tsx` | Office Hour | µLearn Office Hour — a weekly space where members connect, learn, and grow together. |
| `/events/salt-mango-tree` | `src/app/events/salt-mango-tree/page.tsx` | Salt Mango Tree | µLearn Salt Mango Tree — a recurring session exploring ideas beyond the syllabus. |
| `/founders-message` | `src/app/founders-message/page.tsx` | A Message to the World | A message from µLearn's founder on the community's mission and journey. |
| `/gallery` | `src/app/gallery/page.tsx` *(convert)* | Gallery | Explore moments from µLearn events across campuses and communities. |
| `/gallery/[eventSlug]` | see the dynamic-route `generateMetadata` shown above — this one is per-event, not a static title/description. |
| `/impact-gallery` | `src/app/impact-gallery/page.tsx` | Impact Gallery | See µLearn's impact through numbers, stories, and moments captured across the community. |
| `/in50hours` | `src/app/in50hours/page.tsx` | IN50HOURS | IN50HOURS — a µLearn hackathon to build, collaborate, and innovate in just 50 hours. |
| `/interest-groups` | `src/app/interest-groups/page.tsx` | Interest Groups | Find your tribe — join a µLearn Interest Group and learn alongside peers who share your passion. |
| `/kkem` | `src/app/kkem/page.tsx` | KKEM Interest Groups | µLearn's interest groups curated with the Kerala Knowledge Economy Mission (KKEM). |
| `/kkem/events/beyondus` | `src/app/kkem/events/beyondus/page.tsx` | Beyond Us | Beyond Us — a hackathon by µLearn in association with the Kerala Knowledge Economy Mission. |
| `/learning-circle` | `src/app/learning-circle/page.tsx` | Learning Circle | Join a µLearn Learning Circle — an informal peer group for learning together on shared interests. |
| `/levelstructure` | `src/app/levelstructure/page.tsx` | The µLearn Odyssey | Understand µLearn's karma-based level structure and growth path. |
| `/manifesto` | `src/app/manifesto/page.tsx` | Manifesto | The µLearn Manifesto — our philosophy of peer-to-peer, proof-of-work learning. |
| `/partners/community-partners` | `src/app/partners/community-partners/page.tsx` | Community Partners | µLearn Community Partners — organizations we've teamed up with to expand peer learning. |
| `/partners/company-partners` | `src/app/partners/company-partners/page.tsx` | Company Partners | µLearn Company Partners — businesses partnering with us for opportunities and mentorship. |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | Privacy Policy | µLearn Foundation's privacy policy — how we collect, use, and protect your data. |
| `/refund-policy` | `src/app/refund-policy/page.tsx` *(convert)* | Refund Policy | µLearn Foundation refund policy and donation guidelines. |
| `/report` | `src/app/report/layout.tsx` *(convert)* | Annual Reports | Explore µLearn's journey of growth, impact, and community building through our annual reports. |
| `/self-determination-theory` | `src/app/self-determination-theory/page.tsx` *(convert)* | Self-Determination Theory (SDT) | The science behind µLearn — how self-determination theory shapes our approach to learning. |
| `/socials` | `src/app/socials/page.tsx` | Social Links | Follow µLearn on social media — stay updated with our community, events, and stories. |
| `/team` | `src/app/team/page.tsx` | Our Team | Meet the team behind µLearn — the people building the future of peer-to-peer learning. |
| `/terms-and-conditions` | `src/app/terms-and-conditions/page.tsx` | Terms of Service | µLearn Foundation's terms of service — the rules governing use of our platform. |
| `/testimonials` | `src/app/testimonials/page.tsx` | Voices of Impact | Hear from the µLearn community — testimonials from learners, mentors, and partners. |
| `/trivial-ideas` | `src/app/trivial-ideas/page.tsx` | Trivial Ideas | Trivial Ideas — a µLearn initiative for exploring small, playful ideas worth building. |
| `/yip` | `src/app/yip/page.tsx` *(convert)* | YIP | Young Innovators Programme (YIP 5.0) by the Kerala Government, K-DISC, and µLearn. |
| `/` (home) | `src/app/layout.tsx` | *no change* | Already correct as the root default — `constructMetadata()` with no args already uses `siteConfig.name`/`siteConfig.description`, and its implicit canonical (`siteConfig.url`) is correct for `/` specifically, unlike every other route that was inheriting it by accident. |

**Two things every row above still needs beyond the table** (kept out of the table itself
to keep it scannable):
1. `canonical: "https://mulearn.org<route>"` — construct this from the route path shown in
   the first column (e.g. `/be-a-part/campus` → `canonical: "https://mulearn.org/be-a-part/campus"`).
   This is the field that actually matters most (§ above) — a route with the wrong title
   but a correct canonical is a minor issue; a route with a perfect title but the
   homepage's canonical is still broken for indexing purposes.
2. For the *(convert)* rows, also delete the old hand-rolled `Metadata` object/import and
   the now-redundant `Metadata` type import from `"next"` if nothing else in that file
   uses it.

One worked example, applying both the table above and the general fix:

```tsx
// src/app/team/page.tsx (before)
import { TeamView } from "@/features/team";

export default async function TeamPage() {
  return <TeamView />;
}
```

```tsx
// src/app/team/page.tsx (after)
import { constructMetadata } from "@/lib/metadata";
import { TeamView } from "@/features/team";

export const metadata = constructMetadata({
  title: "Our Team",
  description: "Meet the team behind µLearn — the people building the future of peer-to-peer learning.",
  canonical: "https://mulearn.org/team",
});

export default async function TeamPage() {
  return <TeamView />;
}
```

And one *(convert)* worked example:

```tsx
// src/app/yip/page.tsx (before)
export const metadata = {
  title: "YIP | µLearn",
  description: "Young Innovators Programme (YIP 5.0) by Kerala Government, K-DISC and µLearn.",
};
```

```tsx
// src/app/yip/page.tsx (after)
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "YIP",
  description: "Young Innovators Programme (YIP 5.0) by the Kerala Government, K-DISC, and µLearn.",
  canonical: "https://mulearn.org/yip",
});
```

(Note `constructMetadata`'s title-templating: passing `"YIP"` renders as `"YIP | µLearn"`
in the browser tab automatically — see `src/lib/metadata.ts`'s `isBrandInTitle`/`titleObj`
logic — so the old hand-rolled `"YIP | µLearn"` string becomes redundant once converted;
just pass the bare page name.)

### Also worth doing while touching every route's metadata

Since implementing the table above means opening every `page.tsx`/`layout.tsx` in the app
anyway, this is the natural time to also fix the two `constructMetadata()`-level gaps
noted earlier (twitter card, `viewport` export) rather than as separate follow-up work —
they're one-time, app-wide additions, not per-route:

```ts
// src/lib/metadata.ts — add a twitter card alongside the existing openGraph block
return {
  // ...existing fields...
  openGraph: { /* ...unchanged... */ },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
  // ...rest unchanged...
};
```

```ts
// src/app/layout.tsx — add alongside the existing `export const metadata`
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0961F5", // --mulearn, the primary brand color
};
```

### SEO — complete roadmap, in the order to actually do it

Everything above is individually correct but scattered across several subsections. As a
single ordered plan:

**Phase 1 — fix the bug, not just add content (do this first, above all else)**
Add `canonical` to every route via the table above. This alone fixes the single worst
defect (32 routes pointing their canonical/OG URL at the homepage) even before a single
title/description is customized. If only one phase of this roadmap ever ships, make it
this one — everything else is optimization, this is a correctness fix.

**Phase 2 — the rest of `constructMetadata()` per route**
Fill in the title/description from the table for all 32 routes, convert the 7 hand-rolled
ones, and add the two app-wide helper-level fixes (`twitter` card in `lib/metadata.ts`,
`viewport` export in `layout.tsx`).

**Phase 3 — `sitemap.ts` + `robots.ts`**
Both are new, self-contained files with no dependency on Phase 1/2 being done first —
could ship in parallel, but listed after since a sitemap pointing at pages with duplicate
canonicals (pre-Phase-1) is less useful than one that comes after they're fixed.

**Phase 4 — structured data (JSON-LD)**
Homepage `Organization` schema first (highest value, zero data-dependency, ships
independently of everything else in this roadmap). `/events`, `/careers`,
`/gallery/[eventSlug]` next, roughly in that order of site traffic/business value — but
none of the four block on each other, so this phase can be done incrementally, one route
at a time, in any order that's convenient.

**Phase 5 — heading hierarchy**
Lowest urgency (no indexing/duplicate-content risk like Phase 1, purely an on-page
signal-quality improvement), but also the lowest-risk, purely-mechanical fix in this
entire roadmap — swapping `<h1>`→`<h2>` on 9 home-page section components and adding one
real `<h1>` each to `/team`, `/careers`, `/contact`, `/kkem` changes zero visual styling
(all of it is Tailwind classes, not tag-based), so there's no reason this needs a design
review before shipping.

**Verification, after any phase:** Google Search Console's URL Inspection tool (submit a
URL, check "Coverage" and the rendered canonical) is the ground-truth check for Phase 1 —
grep/code review confirms the code is correct, but only Search Console confirms Google
is actually reading the fixed canonical on a live URL. For Phase 4, Google's Rich Results
Test (search.google.com/test/rich-results) validates JSON-LD syntax and eligibility
before deploying.

---

## Implementation Plan

The roadmap above describes *what* and *why*. This section is the actionable checklist — every
file that needs to change, grouped by phase, in the order to do them, each with the exact
acceptance test. **Nothing below has been applied yet** — see
`docs/performance-audit.md` §12 for the live status tracker across both docs. Check items off in
this file directly as they land, so progress is visible without cross-referencing a tracker.

### Phase 1 — `canonical` on every route (do first, above all else)

Add `canonical: "https://mulearn.org<path>"` to `constructMetadata({...})` on each route below
(pattern shown in "Complete implementation" above). Grouped by directory for batching:

- [ ] `src/app/artofteaching/page.tsx`
- [ ] `src/app/be-a-part/campus/page.tsx`
- [ ] `src/app/be-a-part/company/page.tsx`
- [ ] `src/app/be-a-part/enablers/page.tsx`
- [ ] `src/app/be-a-part/learners/page.tsx`
- [ ] `src/app/campus-logo-generator/page.tsx`
- [ ] `src/app/careers/page.tsx`
- [ ] `src/app/contact/page.tsx`
- [ ] `src/app/donate/layout.tsx` *(convert — see Phase 2)*
- [ ] `src/app/donate/success/layout.tsx` *(convert — see Phase 2)*
- [ ] `src/app/events/page.tsx`
- [ ] `src/app/events/grab-your-superpowers/page.tsx`
- [ ] `src/app/events/inspiration-station/page.tsx`
- [ ] `src/app/events/office-hour/page.tsx`
- [ ] `src/app/events/salt-mango-tree/page.tsx`
- [ ] `src/app/founders-message/page.tsx`
- [ ] `src/app/gallery/page.tsx` *(convert — see Phase 2)*
- [ ] `src/app/gallery/[eventSlug]/page.tsx` *(add `generateMetadata`, not a static `metadata` export — see "Dynamic route SEO gap" above)*
- [ ] `src/app/impact-gallery/page.tsx`
- [ ] `src/app/in50hours/page.tsx`
- [ ] `src/app/interest-groups/page.tsx`
- [ ] `src/app/kkem/page.tsx`
- [ ] `src/app/kkem/events/beyondus/page.tsx`
- [ ] `src/app/learning-circle/page.tsx`
- [ ] `src/app/levelstructure/page.tsx`
- [ ] `src/app/manifesto/page.tsx`
- [ ] `src/app/partners/community-partners/page.tsx`
- [ ] `src/app/partners/company-partners/page.tsx`
- [ ] `src/app/privacy-policy/page.tsx`
- [ ] `src/app/refund-policy/page.tsx` *(convert — see Phase 2)*
- [ ] `src/app/report/layout.tsx` *(convert — see Phase 2)*
- [ ] `src/app/self-determination-theory/page.tsx` *(convert — see Phase 2)*
- [ ] `src/app/socials/page.tsx`
- [ ] `src/app/team/page.tsx`
- [ ] `src/app/terms-and-conditions/page.tsx`
- [ ] `src/app/testimonials/page.tsx`
- [ ] `src/app/trivial-ideas/page.tsx`
- [ ] `src/app/yip/page.tsx` *(convert — see Phase 2)*

**Acceptance criteria:** Google Search Console's URL Inspection tool, run against each route
post-deploy, shows that route's own URL as the inspected canonical — not `https://mulearn.org/`.
`view-source:` on each route should show `<link rel="canonical" href="https://mulearn.org/<path>">`
matching that exact route.

### Phase 2 — title/description via `constructMetadata()`, plus two app-wide fixes

Fill in `title`/`description` from the table in "Complete implementation" above for every route
in Phase 1's list (same files, same pass — do Phase 1 and 2 together per file rather than two
separate sweeps). For the 7 *(convert)* rows, replace the hand-rolled `Metadata` object literal
with `constructMetadata({...})` and drop the now-unused `Metadata` type import if nothing else in
that file needs it:

- [ ] `src/app/donate/layout.tsx` — convert
- [ ] `src/app/donate/success/layout.tsx` — convert, plus `noIndex: true`
- [ ] `src/app/gallery/page.tsx` — convert
- [ ] `src/app/refund-policy/page.tsx` — convert
- [ ] `src/app/report/layout.tsx` — convert
- [ ] `src/app/self-determination-theory/page.tsx` — convert
- [ ] `src/app/yip/page.tsx` — convert

Plus two one-time, app-wide helper-level additions (independent of the per-route work, do
whenever convenient within this phase):

- [ ] `src/lib/metadata.ts` — add the `twitter: { card: "summary_large_image", ... }` block
      shown in "Other gaps in `constructMetadata()`" above.
- [ ] `src/app/layout.tsx` — add `export const viewport: Viewport` shown in the same section.

**Acceptance criteria:** every route in Phase 1's list renders a unique `<title>`/meta
description in view-source (spot-check 5 routes across different features, not all 32). Sharing
any route's URL in a Twitter/X card preview tool shows a populated card, not a bare link.

### Phase 3 — `sitemap.ts` + `robots.ts`

Two new, self-contained files (code already drafted in "sitemap.ts / robots.ts" above) — no
dependency on Phase 1/2 landing first, but sequenced after since a sitemap pointing at
pre-Phase-1 duplicate canonicals is less useful:

- [ ] `src/app/sitemap.ts` — new file
- [ ] `src/app/robots.ts` — new file

**Acceptance criteria:** `/sitemap.xml` and `/robots.txt` resolve on the live deploy;
`/sitemap.xml` lists all 39 static routes plus every `galleryEvents` slug, excluding
`/donate/success`; `/robots.txt` disallows `/api/` and `/donate/success` and points at the
sitemap URL.

### Phase 4 — structured data (JSON-LD)

Each of the four ships independently — no ordering dependency between them, but listed by
value/traffic:

- [ ] `src/app/layout.tsx` — `Organization`/`WebSite` JSON-LD (highest value, zero data
      dependency, do first)
- [ ] `src/features/events/components/common/events-view.tsx` — `Event` schema per listed event
- [ ] `src/features/careers/components/careers-view.tsx` — `JobPosting` schema per listing
- [ ] `src/app/gallery/[eventSlug]/page.tsx` — `Event` schema per gallery page (bundle with
      Phase 1's `generateMetadata` addition for this same file)

**Acceptance criteria:** Google's Rich Results Test (search.google.com/test/rich-results)
against each route's live URL shows valid, eligible structured data with no errors.

### Phase 5 — heading hierarchy

Purely mechanical, zero visual-styling change (all styling is Tailwind classes, not tag-based) —
lowest urgency, also lowest risk:

- [ ] `src/features/home/components/hero.tsx` — `MotionH1` → `MotionH2` (or equivalent `<h2>`)
- [ ] `src/features/home/components/features.tsx:48`
- [ ] `src/features/home/components/story.tsx:26`
- [ ] `src/features/home/components/special-events.tsx:27`
- [ ] `src/features/home/components/comparison.tsx:25`
- [ ] `src/features/home/components/opportunities.tsx:26`
- [ ] `src/features/home/components/roles.tsx:39`
- [ ] `src/features/home/components/stats.tsx:45`
- [ ] `src/features/home/components/community.tsx:32`
- [ ] `src/features/home/components/gallery.tsx:124`
- [ ] `src/features/team/components/team-view.tsx` — add one real `<h1>` (currently opens with
      `<h2>` at lines 74/144)
- [ ] `src/features/careers/components/careers-view.tsx:59` — add one real `<h1>`
- [ ] `src/features/contact/components/contact-view.tsx` — add one real `<h1>`
- [ ] `src/app/kkem/page.tsx` (or its feature view) — add one real `<h1>`

**Acceptance criteria:** each page has exactly one `<h1>`; heading levels descend without
skipping (no `<h1>` → `<h3>` jump). A live Lighthouse Accessibility run's "Heading elements are
not in a sequentially-descending order" audit passes (this exact audit was confirmed still
failing in a live run — see `docs/performance-audit.md` §11b).

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
