# API / route schema correctness audit — mulearnhome vs. mulearnbackend

Check-only audit (no code changed). Every REST endpoint and the one WebSocket connection mulearnhome calls, cross-verified field-by-field against the actual Django view/serializer code in `mulearnbackend`. Base URL confirmed: `NEXT_PUBLIC_API_BASE_URL=https://mulearn.org/api/v1` already includes the `/api/v1` prefix that every backend route in `api/urls.py` sits under — path concatenation is correct everywhere (`buildUrl()`'s plain string-concat approach, not `new URL()` resolution, is the right call, already covered in `docs/js-floor-investigation-2026-08-29.md`).

## Executive summary

| Severity | Count | What |
|---|---|---|
| 🔴 Critical, confirmed live bug | 1 | `/events` page — Ongoing/Upcoming sections always render empty, silently |
| 🔴 Critical, confirmed live bug | 1 | `/careers` ongoing-hiring listing always throws, likely always shows error/empty state |
| 🟡 Type drift (not runtime-breaking today) | 1 | `PaginationMeta` has 2 fields the backend never sends |
| 🟡 Incomplete feature (not a type bug) | 1 | Bank-transfer donation: endpoint + success-page UI both exist, no submission function calls it |
| 🟡 Pagination architecture gap | 1 | mulearnhome hand-rolls page-fetching per feature, duplicated across 2 hooks; needs a shared hand-rolled hook (server- and client-side) modeled on `mulearn-dashboard`, without adding TanStack Query |
| 🟢 Dead code, harmless | 8 | 5 unused legacy types, 1 unused/colliding interface, 1 unused endpoint, 2 unused config fields |
| ✅ Correct | 6 endpoint groups + 1 websocket | donate (all 4 payment endpoints), weekly-twitch (4 endpoints), career-lab previous, profile-pic, top-learners, landing-stats websocket |
| ✅ Production parity confirmed | donate, contact | Both features checked against `upstream/production` (`gtech-mulearn/mulearnhome`) — form fields, Zod schema logic, submission flow, rate-limiting, and sanitization are byte-identical; only import paths differ (feature-folder refactor). No divergence, no regression introduced by the restructuring. |

---

## 🔴 Bug 1 — `/events` page: Ongoing/Upcoming always empty (confirmed)

**File:** `src/features/events/api/events.api.ts:36-41`

```ts
// response is a plain array — no data/pagination wrapper
export async function fetchPublicEvents(params?: PublicEventsParams): Promise<PublicEvent[]> {
  const res = await publicGateway.get(endpoints.publicEvents.getEvents, { params: ... });
  return res.data.response;
}
```

**Backend truth** (`mulearnbackend/api/dashboard/events/public_views.py:281-319`, `PublicEventListAPI.get`):

```python
return CustomResponse().paginated_response(data=serializer.data, pagination=paginated['pagination'])
```

This produces `response: { data: [...], pagination: {count, totalPages, isNext, isPrev, nextPage} }` — an **object**, not a plain array. The comment on line 36 ("response is a plain array") is wrong and always was.

**Confirmed production impact** — `src/features/events/components/common/events-view.tsx:62,68`:

```ts
if (ongoingResult.status === "fulfilled" && Array.isArray(ongoingResult.value)) {
  ongoingEvents = safeMapEvents(ongoingResult.value, "ongoing");
}
```

`ongoingResult.value` is `res.data.response`, which is `{data: [...], pagination: {...}}` — `Array.isArray()` on an object is `false`. **This branch never runs.** `ongoingEvents`/`upcomingEvents` stay `null` unconditionally, every request succeeds (no error, no console warning — the `else if (rejected)` branch never fires either since the fetch itself succeeds), and the page always renders its empty state ("Nothing's live right now" / equivalent for upcoming). This is a silent failure — nothing in the current logs or error paths would surface it.

**What's actually missing / broken, spelled out:**
- The `/events` page has three sections: Ongoing, Upcoming, and a "recurring" weekly-twitch block (Office Hours etc.). Only the third works — it goes through `fetchWeeklyTwitch`, which is typed and shaped correctly (see the ✅ table). The first two, which are meant to show μLearn's own live/scheduled events, have been non-functional since this code was written.
- `PublicEventsParams`'s `status` filter (`"ongoing"` / `"upcoming"`) is passed to the backend correctly — the query string construction (`buildPublicEventsParams`) is fine. The bug is purely in how the response is unwrapped after the request succeeds, not in the request itself.
- `EventCategory.live` (`events-view.tsx`) is computed as `!!ongoingEvents && ongoingEvents.length > 0` — since `ongoingEvents` is always `null`, the "live now" badge/indicator this drives is also always off, compounding the visible impact beyond just an empty list.
- No test, type check, or lint catches this because `res.data.response` is typed as `unknown`/loosely inferred in the current axios-based fetcher (see `docs/fetcher-revamp-plan-2026-08-29.md` — this exact gap is why that plan calls for real per-endpoint response types instead of `unknown`; had `fetchPublicEvents`'s return been backed by a real `{data: EventListItemSerializer[]; pagination: ...}` interface from day one, this mismatch would have been a compile error instead of a silent runtime no-op).

**Fix:** `return res.data.response.data;` (drop the now-unused `pagination` or thread it through if the page ever wants to paginate events — currently no caller does).

---

## 🔴 Bug 2 — `/careers` ongoing-hiring listing always throws (confirmed)

**File:** `src/features/careers/api/careers.api.ts:10-31`

```ts
function parsePaginatedResponse<T>(raw: unknown): PaginatedCareersResponse<T> {
  if (
    !raw || typeof raw !== "object" ||
    !Array.isArray((raw as { data?: unknown }).data) ||
    !(raw as { pagination?: unknown }).pagination ||
    typeof (raw as { pagination?: unknown }).pagination !== "object"
  ) {
    throw new Error("Malformed career listing response");
  }
  ...
}

export async function fetchOngoingHiringPage(pageIndex = 1, perPage = 12) {
  const res = await publicGateway.get(endpoints.careerLab.ongoing, { params: { pageIndex, perPage } });
  return parsePaginatedResponse<OngoingHiring>(res.data?.response);
}
```

**Backend truth** (`mulearnbackend/api/dashboard/career_lab/career_lab_views.py:276-293`, `PublicOngoingHiringAPI.get`):

```python
return CustomResponse(response={"data": serializer.data}).get_success_response()
```

`response` is `{data: [...]}` — **no `pagination` key at all**, not even `null` or `{}`. `parsePaginatedResponse`'s guard requires `raw.pagination` to be truthy and `typeof === "object"` — for `ongoing`, `raw.pagination` is `undefined`, which is falsy, so the guard **always throws** `"Malformed career listing response"` for this endpoint specifically. (`previous` is fine — its backend response genuinely includes `pagination`, per `career_lab_views.py:296-319`.)

**Confirmed impact:** every call to `fetchOngoingHiringPage` throws. Whatever calls this (the `/careers` ongoing-hiring tab) either shows a caught error state or an unhandled rejection, but never real data — this endpoint has likely never worked against the real backend.

**What's actually missing / broken, spelled out:**
- `src/features/careers/hooks/careers.hooks.ts`'s `useOngoingHiring(perPage)` calls `useHiringPage(fetchOngoingHiringPage, perPage)`, whose `goToPage` handler catches the thrown error and sets `error: true` / `failedPage: nextPage` when `data` is still empty (initial load) — so in practice the `/careers` page's "Ongoing" tab shows whatever error/empty state the UI renders for `error === true`, on every single page load, for every visitor, unconditionally. It has no working code path against the real backend.
- `usePreviousHiring` (same hook, `fetchPreviousHiringPage`) is unaffected — `previous`'s backend response does include `pagination`, so that tab works. This makes the bug easy to miss in casual testing if only the "Previous" tab happens to get checked, since the two tabs look structurally identical in the UI but only one is broken.
- The root cause is a **shared parser assuming a shared shape** that the backend never actually guarantees — `parsePaginatedResponse<T>` was written once and reused for two endpoints whose response shape only sometimes matches (`previous` matches, `ongoing` doesn't). This is the same category of gap as Bug 1: a hand-typed assumption about the wire format that was never checked against the actual Django view.

**Fix:** make `pagination` optional in the guard/shape specifically for the ongoing endpoint — either give `parsePaginatedResponse` a `requirePagination` flag defaulting differently per caller, or (cleaner) stop sharing one parser for two structurally different response shapes: `OngoingHiringApiResponse = {data: OngoingHiring[]}` (no pagination field) vs. `PreviousHiringApiResponse = {data: PreviousHiring[]; pagination: PaginationMeta}`.

---

## 🟡 Type drift — `PaginationMeta` has 2 phantom fields

**File:** `src/features/careers/types/careers.types.ts:1-8`

```ts
export interface PaginationMeta {
  count: number;
  totalPages: number;
  isNext: boolean;
  isPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;      // ← not sent by backend
  current_page: number;          // ← not sent by backend
}
```

Backend's actual pagination shape (confirmed identically across `/public/events/`, weekly-twitch list endpoints, and `/public/career-lab/previous/`, all built via `CustomResponse.paginated_response()` / the manual equivalent in career-lab): `{count, totalPages, isNext, isPrev, nextPage}` — five fields, no `prevPage`, no `current_page`.

**Impact:** low today — nothing in the codebase reads `.prevPage` or `.current_page` off a `PaginationMeta` value (checked: no matches). Purely a type-accuracy issue, not a runtime bug. Worth trimming so the type doesn't lie about what's available if someone builds pagination UI later and reaches for a field that will always be `undefined` at runtime despite TypeScript saying it's a `number`.

**Fix:** drop `prevPage` and `current_page` from `PaginationMeta`, or if a future prev-page control is wanted, derive it client-side from `nextPage`/`count` instead of expecting the backend to send it.

---

## 🟡 Incomplete feature — bank-transfer donation has no submission path

**Backend:** `POST /api/v1/donate/bank-transfer/` exists and is public (`BankTransferAPI`, `mulearnbackend/api/donate/views.py:835-889`, no auth required, confirmed), returns `{reference_code, amount, status: "PENDING_VERIFICATION", message}` on success.

**Frontend:** `endpoints.donation.bankTransfer` is defined (`src/shared/api/endpoints.ts:20`). `src/features/donate/components/success/donate-success-view.tsx` has full UI for it — `isBankTransfer` flag, `referenceCode` display with copy-to-clipboard (lines 17-18, 109, 201-218). **But `src/features/donate/api/donate.api.ts` has no function that ever calls `endpoints.donation.bankTransfer`** — only `submitDonationForm` (Razorpay one-time) and `submitSubscription` (Razorpay recurring) exist, neither of which ever sets `isBankTransfer`/`referenceCode` in the `donationData` written to `localStorage`.

This isn't a type mismatch — it's a half-built feature. The success page is ready to display a bank-transfer confirmation state that no code path currently produces. Not in scope to fix here (no plan was requested for new features), flagging so it isn't mistaken for dead/removable code — it's clearly intentional groundwork, just missing its other half.

**Confirmed pre-existing, not a regression from any recent refactor:** checked `upstream/production` (`gtech-mulearn/mulearnhome`, fetched and diffed directly). Production's `src/app/donate/success/page.tsx` (the pre-refactor location, before this session's feature-folder restructuring) already has the identical `isBankTransfer`/`referenceCode` UI (same field names, same conditional rendering). Production's `DonationForm.tsx` has **zero** references to `axios`, `fetch`, or any `/donate/` endpoint path at all — it doesn't call the payment endpoints directly, and there's no separate `donate.api.ts` on that branch either (`upstream/dev` doesn't have that file at all — it was introduced by this fork's own refactor work). So this gap has existed since before the current API-layer restructuring; it isn't something this session's changes broke or introduced.

---

## ✅ Production parity check — donate and contact

Checked whether `donate` and `contact`, both fully rewritten into the current feature-folder structure this session, still match `upstream/production` (`gtech-mulearn/mulearnhome`, fetched and diffed directly, not assumed) functionally. Result: **yes, both are functionally identical** — only import paths changed.

**Donate** — compared production's `src/app/donate/_components/DonationForm.tsx` + `src/lib/schemas/donation.ts` against current `src/features/donate/components/donation-form.tsx` + `src/features/donate/schemas/donate.schema.ts`:
- Same form fields (`name`, `donationName`, `email`, `phone`, `panNumber`, `address`, `isOrganisation`, `organisationName`, `termsAccepted`, `donationAmount`, `donationType`), same `register()` calls, same tier-selection/custom-amount/URL-param-seeding logic, same `submitDonationForm`/`submitSubscription` call sites.
- `donationFormSchema` and `donationPayloadSchema` (both Zod schemas, including the two `.refine()` organisation-required-fields checks) are **line-for-line identical** between branches — the only diff is the import source (`./common` on production vs. `@/shared` barrel on dev).
- Same pre-existing bank-transfer gap exists on production too (already covered above) — not something introduced by the refactor.

**Contact** — compared production's `src/app/api/contact/route.ts` + `src/lib/schemas/contact.ts` against current `src/app/api/contact/route.ts` + `src/features/contact/schemas/contact.schema.ts`:
- Rate-limit config (`windowMs: 15min`, `maxRequests: 10`, `cleanupIntervalMs: 1hr`), `getClientIP()` header-checking order, `isRateLimited()` logic, `validateAndSanitize()`'s HTML-tag-strip + special-char-strip + 5000-char truncation, all response shapes/status codes (503 config error, 429 rate-limited, 400 validation failed, 200 success, 500 send failure) — **byte-identical** between branches.
- `contactFormSchema` diff is a single line: `import { ... } from "./common"` (production) vs. `import { ... } from "@/shared"` (dev) — no field or validation-rule changes.
- Only structural difference: production calls `discordService.sendContactNotification(...)` (a class-based service), dev calls a plain exported `sendContactNotification(...)` function from `@/features/contact` — a refactor-style simplification, not a behavior change (same Discord webhook call underneath).

**Conclusion:** the feature-folder restructuring this repo underwent did not introduce any functional drift in either feature. Safe to treat both as verified-equivalent to what's running in production today.

---

## 🟡 Pagination architecture — hand-rolled, no TanStack Query, port `mulearn-dashboard`'s UX without its dependency

mulearnhome has no `@tanstack/react-query` dependency and no shared pagination component. Every paginated list hand-rolls its own fetch-on-page-change logic with raw `useState`/`useEffect`. `mulearn-dashboard` (same backend, same `{data, pagination}` envelope shape) already solved this properly — worth porting the pattern, not just the fetcher.

**mulearnhome today** — `src/features/careers/hooks/careers.hooks.ts`, `useHiringPage<T>`:
```ts
function useHiringPage<T>(fetcher, perPage: number): HiringPageResult<T> {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestId = useRef(0); // manual race-condition guard

  const goToPage = useCallback((nextPage) => {
    const id = ++requestId.current;
    setIsLoading(true);
    fetcher(nextPage, perPage)
      .then(({ data: items, pagination }) => { if (id !== requestId.current) return; /* ...set state... */ })
      .catch((err) => { if (id !== requestId.current) return; /* ...set error state... */ })
      .finally(() => { if (id === requestId.current) setIsLoading(false); });
  }, [fetcher, perPage]);

  useEffect(() => { goToPage(1); }, []); // fires once, page state not synced to the URL
  return { data, count, page, isLoading, error, failedPage, goToPage };
}
```
`events.hooks.ts`'s `useWeeklyTwitchFetch<T>` is a near-identical second hand-rolled copy of the same pattern for a different feature — the race-guard-via-ref, loading/error state machine, and fetch-on-mount logic are duplicated rather than shared.

**Issues with the current approach:**
1. **No URL sync** — page number lives only in component state. Refreshing the page, sharing a link, or using browser back/forward always resets to page 1. No deep-linkable pagination anywhere in mulearnhome.
2. **No caching** — switching from page 2 back to page 1 re-fetches from scratch every time; no `staleTime`/`keepPreviousData` equivalent, so every pagination click shows a full loading flicker even for data already seen this session.
3. **Duplicated race-condition handling** — the manual `requestId` ref pattern in `useHiringPage` is reimplemented (slightly differently) in `useWeeklyTwitchFetch` via a plain `isCurrent` boolean closure flag. Two different hand-rolled solutions to the same "ignore stale response" problem, in the same codebase.
4. **No shared pagination UI** — no equivalent of a `<Pagination>` component; each feature that needs page controls builds its own buttons/counts inline (not verified exhaustively, but no shared component exists to reuse).

**`mulearn-dashboard`'s pattern** (`src/features/projects/hooks/use-projects.ts` + `src/features/projects/components/projects-listing-page.tsx` + `src/components/dashboard/table/pagination.tsx`), backed by `@tanstack/react-query`:

```ts
// hook: src/features/projects/hooks/use-projects.ts
export function usePublicProjects(search: string, page: number) {
  return useQuery({
    queryKey: projectsKeys.public(search, page),
    queryFn: () => listProjects({ search: search || undefined, page, perPage: 12 }),
    staleTime: 30_000,
    placeholderData: keepPreviousData, // old page's data stays visible while the new page loads — no flicker
  });
}
```
```ts
// page component: page state synced to the URL via useSearchParams/useRouter
const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
// ...
const pagination = data?.pagination;
// ...
{pagination && pagination.totalPages > 1 && (
  <Pagination currentPage={page} totalPages={pagination.totalPages} totalCount={pagination.count}
    handlePreviousClick={() => setPage((p) => p - 1)} handleNextClick={() => setPage((p) => p + 1)} />
)}
```
`useInfiniteQuery` is used instead for the search feature's infinite-scroll case (`useSearchUsers.ts`) — dashboard picks the right primitive per use case (`useQuery` + page state for classic Previous/Next pagination, `useInfiniteQuery` for infinite-scroll) rather than one hand-rolled hook trying to do both.

**What mulearnhome should actually port — the UX, not the dependency.** mulearnhome has no `@tanstack/react-query` today and this audit is not recommending adding it — everything dashboard's `useQuery`/`placeholderData: keepPreviousData` buys (URL-synced page state, no-flicker page transitions, a shared `<Pagination>` component, one source of truth for loading/error state) is achievable with plain React state + the existing `publicGateway`, mirroring dashboard's UX without its dependency. Two distinct pagination needs exist in mulearnhome today, and a proper design covers both:

**1. Server-side pagination** (careers ongoing/previous, and events/weekly-twitch if they ever paginate) — the backend does the slicing via `pageIndex`/`perPage` query params and returns `{data, pagination}`; the client just requests page N and displays what comes back. A single shared hook replaces both `useHiringPage` and `useWeeklyTwitchFetch`:

```ts
// src/shared/hooks/use-server-pagination.ts (proposed, not yet written)
function useServerPagination<T>(
  fetcher: (page: number, perPage: number) => Promise<{ data: T[]; pagination?: PaginationMeta }>,
  { perPage, syncToUrl }: { perPage: number; syncToUrl?: string /* e.g. "page" */ },
) {
  // page state seeded from useSearchParams when syncToUrl is set, else plain useState(1)
  // one shared requestId-ref race guard (replaces the two divergent copies)
  // keeps the PREVIOUS page's `data` visible while a new page loads (the keepPreviousData behavior,
  //   done by simply not clearing `data` in the `.then()` until the new page's data actually arrives —
  //   no library needed, just don't call setData([]) on page-change, only on request-start)
  // on syncToUrl, calls router.replace(`${pathname}?${param}=${page}`, { scroll: false }) after each goToPage
  // returns { data, pagination, page, isLoading, error, goToPage }
}
```
Then `useOngoingHiring`/`usePreviousHiring` and the weekly-twitch fetchers become one-line wrappers around this shared hook, same as `mulearn-dashboard`'s per-feature hooks are thin wrappers around its one `useQuery` pattern — just without the query-cache library underneath.

**2. Client-side pagination** — for any list mulearnhome already fetches in full (no backend pagination support, or the dataset is small enough to fetch once), paginate in the browser instead of re-requesting. No current mulearnhome list actually needs this today (every paginated surface has real backend pagination), but it's worth having as the second half of a proper pagination utility rather than bolting it on ad hoc later:

```ts
// src/shared/hooks/use-client-pagination.ts (proposed, not yet written)
function useClientPagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const pageItems = items.slice((page - 1) * perPage, page * perPage);
  return { pageItems, page, totalPages, setPage };
}
```
Trivial by design — no network, no race conditions, no caching concern — but sharing one implementation still avoids the "reinvented per feature" problem the server-side hooks currently have.

**Shared `<Pagination>` UI** — port `mulearn-dashboard/src/components/dashboard/table/pagination.tsx`'s props shape (`currentPage`, `totalPages`, `totalCount`, `handlePreviousClick`, `handleNextClick`) as a presentational-only component in `src/components/ui/`, restyled to mulearnhome's brand (shadcn `Button`s, `mulearn-*` color tokens) instead of the dashboard's own styling. Both `useServerPagination` and `useClientPagination` above expose the same `{page, totalPages, goToPage/setPage}` shape so one `<Pagination>` component drives either.

**Recommendation (not applied — doc only):**
- Write `useServerPagination` and `useClientPagination` as described above in `src/shared/hooks/`, no new dependency.
- Replace `useHiringPage` (careers) and `useWeeklyTwitchFetch` (events) with thin wrappers around `useServerPagination`, eliminating the duplicated race-guard logic (issue 3 above).
- Add `syncToUrl` support so `/careers?page=2`-style URLs become shareable and survive a refresh (issue 1 above) — implemented with plain `useSearchParams`/`router.replace`, the same primitives dashboard uses, just not wired through a query-cache library.
- Port a restyled `<Pagination>` component (issue 4 above).
- This is a bigger lift than the two confirmed bugs above (two new shared hooks, a new shared component, touches every paginated feature) — reasonable to treat as its own follow-up pass rather than folding into the fetcher-revamp work.

---

## 🟢 Dead code / unused — full inventory

Beyond the `userProfile` endpoint already called out, a systematic check turned up 8 unused-or-mostly-dead exports across the API/type layer:

| Item | Location | Status |
|---|---|---|
| `OMEvent`, `OfficeHours`, `OfficeHoursData`, `WeeklyTwitchEvent`, `WeeklyTwitchData` (5 types) | `src/features/events/types/events.types.ts`, re-exported through `types/index.ts` and the feature's top-level `index.ts` | Zero consumers outside the barrel re-export chain itself (verified via grep — every match is either the definition or a barrel `export {...}` line). Legacy types from before the current `PublicEvent`/`WeeklyTwitchResponse<T>` shapes were introduced; pure re-export noise now. |
| `interface ApiError` | `src/types/api.types.ts` (whole file) | Zero importers anywhere in `src/` besides the file itself. Also **name-collides** with the real `ApiError` class defined in `src/lib/fetcher.ts` — if both were ever imported into the same file, TypeScript would force a rename; actively confusing to have two same-named, unrelated things in the codebase. Already flagged for deletion in `docs/fetcher-revamp-plan-2026-08-29.md`. |
| `endpoints.profile.userProfile` | `src/shared/api/endpoints.ts:61-62` | Zero call sites. Backend's no-`muid` form requires a JWT the site has no way to obtain (mulearnhome has no login) — would always fail if ever called that way. The `<muid>` path-param form is public and would technically work, but nothing invokes it. |
| `apiConfig.retryAttempts`, `apiConfig.retryDelay` | `src/config/api.ts:6-7` | Declared with values (`3`, `1000`) but never read anywhere — no retry logic exists in `src/lib/fetcher.ts` or any consumer. Config for a feature that was never implemented. |

None of these are runtime bugs (nothing calls the dead code, so nothing can misbehave), but they add surface area a reader has to mentally filter out, and the `ApiError` name collision specifically risks real confusion during the fetcher-revamp work if not deleted first.

---

## ✅ Confirmed correct

| Surface | Frontend | Backend | Verdict |
|---|---|---|---|
| `POST /donate/order/` | reads `response.data.response.id/amount/currency` | Razorpay order object, lowercase `id`/`amount`/`currency` fields | Correct |
| `POST /donate/verify/` | reads `.message.general[0]` for toast (with fallback), spreads rest into `pdfData` | `transaction_details` object (`Amount`, `Currency`, `payment_id`, capitalized fields) — frontend never destructures these by name, only spreads/stores, so the capitalization mismatch never bites | Functionally correct (see note below) |
| `POST /donate/subscription/create/` | reads `response.data.response.subscription_id/amount` | `{subscription_id, plan_id, status, short_url, amount, currency, donation_type}` | Correct |
| `POST /donate/subscription/verify/` | same pattern as `/donate/verify/` | `transaction_details` with `subscription_id`, `Donation_Type`, `Status` | Correct (same spread-only usage) |
| 4× weekly-twitch list endpoints | `WeeklyTwitchResponse<T> = {data: T[]; pagination: WeeklyTwitchPagination}` | `CustomResponse.paginated_response()` → `{data, pagination: {count, totalPages, isNext, isPrev, nextPage}}` | Correct, matches exactly |
| `GET /public/career-lab/previous/` | `PreviousHiring` fields | `PublicPreviousHiringSerializer` fields | Correct (frontend type omits `created_by/created_at/updated_by/updated_at` that the backend also sends — harmless, just unused, not wrong) |
| `GET /leaderboard/students/` (topLearners) | expects `response` = plain array | `StudentsLeaderboard.get` → `response=serialized_students_leaderboard.data`, a plain array | Correct |
| `GET /public/profile-pic/<muid>/` | reads `response.image` | `{image: user.profile_pic}` | Correct |
| `wss://.../ws/v1/public/landing-stats/` (`Counts` type) | 6 fields: `members, learning_circle_count, org_type_counts[], ig_count, karma_pow_count{}, enablers_mentors_count[]` | `GlobalCount`/`LandingStats` consumer sends the identical 6 keys, identical nesting | Correct, exact match, zero drift |

**Note on the verify-endpoint field casing** (`Amount`/`Currency`/`payment_id` mixed-case backend fields vs. frontend never reading them by name): this works today only because `donate.api.ts`'s success handler spreads the whole response into `localStorage` and every field the success page actually *displays* (`amount`, `name`, `email`, `donationType`, `paymentId`) is independently supplied from the client-side form data or the Razorpay checkout callback, not from this spread. If a future change ever tries to read `pdfData.amount` or `pdfData.currency` expecting the backend's verify-response fields, it will silently get `undefined` (backend sends `Amount`/`Currency`, capitalized) instead of the correct value. Not a bug today, but a footgun worth knowing about — the type should ideally be named/cased to match what the backend actually sends (`Amount`, not `amount`) if it's ever consumed directly.

---

## Fix priority

1. **`events.api.ts` — `fetchPublicEvents`** (Bug 1): one-line fix, `res.data.response.data` instead of `res.data.response`. Highest priority — currently breaks a whole page section silently in production.
2. **`careers.api.ts` — `parsePaginatedResponse`** (Bug 2): split into two typed shapes (ongoing has no pagination, previous does) instead of one shared guard that assumes both always have `pagination`. Also high priority — currently always throws for the ongoing-hiring tab.
3. **`PaginationMeta`** phantom fields: low priority, type-only cleanup, no runtime impact today.
4. **Dead code cleanup** (5 legacy event types, `src/types/api.types.ts`, `endpoints.profile.userProfile`, `apiConfig.retryAttempts`/`retryDelay`): low priority, no runtime impact — but deleting `src/types/api.types.ts` specifically is worth doing *before* the fetcher revamp lands, since its `ApiError` interface name-collides with the new `ApiError` class.
5. **Pagination architecture** (`useServerPagination` + `useClientPagination` + shared `<Pagination>` + URL-synced page state, UX mirroring `mulearn-dashboard` but hand-rolled, no TanStack Query): medium priority, bigger lift — two new shared hooks and a new shared component, touches every paginated feature. Reasonable as its own follow-up pass, not a one-line fix.
6. Bank-transfer submission path: not a bug (confirmed pre-existing on `upstream/production` too, not a regression), just noted for awareness — no fix needed unless the product wants that feature completed.

The two confirmed bugs (1 and 2) are already covered by the fetcher-revamp work — `docs/fetcher-revamp-plan-2026-08-29.md` touches both `events.api.ts` and `careers.api.ts` for the axios→fetch swap, so folding these two fixes into that same pass (rather than a separate patch) avoids touching the same files twice.
