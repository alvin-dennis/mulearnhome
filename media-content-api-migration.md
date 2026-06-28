# Media Content API Migration Plan

Replace TinaCMS data fetching with REST API for Office Hours, Salt Mango Tree, and Inspiration Station Radio. Move filtering/pagination/search from client-side to server-side.

---

## Current Architecture

```
TinaCMS JSON file
  → src/lib/tina.ts (GraphQL query, returns full array)
  → page.tsx (server component, extracts array[0].sessions/episodes)
  → *Client.tsx (client component, filters/paginates/searches all data in-memory)
```

**Problems:**
- All records fetched every request (no pagination at data layer)
- Search/filter runs in browser on full dataset
- SMT + Inspiration Station client components have no search or pagination at all

---

## Target Architecture

```
REST API (media-content endpoints)
  → src/services/urls.ts (route constants)
  → src/services/weeklyTwitches.ts (axios fetch functions)
  → src/lib/types.ts (shared types)
  → page.tsx (server component, reads searchParams, calls service, passes paginated slice)
  → *Client.tsx (client component, handles URL state, triggers navigation on search/page/tab change)
```

---

## API Endpoints Summary

| Content Type | Endpoint |
|---|---|
| Office Hours | `GET /api/v1/dashboard/media-content/office-hours/` |
| Salt Mango Tree | `GET /api/v1/dashboard/media-content/salt-mango-tree/` |
| Inspiration Station | `GET /api/v1/dashboard/media-content/inspiration-station/` |

### Query Params Used

| URL param (`searchParams`) | API param | Notes |
|---|---|---|
| `view=upcoming` | `status=upcoming` | default |
| `view=previous` | `status=completed` | |
| `search=foo` | `search=foo` | server-side, indexed |
| `page=2` | `pageIndex=2` | default 1 |
| (fixed) | `perPage=6` | matches current `itemsPerPage` |

**Note:** API returns `date` as `YYYY-MM-DD`. Office Hours currently parses `DD/MM/YYYY` — remove that legacy logic.

---

## Files Changed

### 1. `src/services/urls.ts` — ADD routes

```ts
export const weeklyTwitchRoutes = {
  officeHours: "/dashboard/media-content/office-hours/",
  saltMangoTree: "/dashboard/media-content/salt-mango-tree/",
  inspirationStation: "/dashboard/media-content/inspiration-station/",
};
```

---

### 2. `src/lib/types.ts` — ADD types

Add below existing types. Do not remove existing `OfficeHours` or `WeeklyTwitchEvent` — check usages before deleting.

```ts
// Weekly Twitch / Media Content API types

export interface WeeklyTwitchPagination {
  count: number;
  totalPages: number;
  isNext: boolean;
  isPrev: boolean;
  nextPage: number | null;
}

export interface WeeklyTwitchParams {
  status?: "upcoming" | "completed";
  search?: string;
  pageIndex?: number;
  perPage?: number;
}

export interface OfficeHoursSession {
  id: string;
  title: string;
  performer?: string | null;
  designation?: string | null;
  description?: string | null;
  date: string; // YYYY-MM-DD
  link?: string | null;
  interest_groups: string[];
  poster_thumbnail?: string | null;
  status: "upcoming" | "ongoing" | "completed";
}

export interface WeeklyTwitchEpisode {
  id: string;
  topic: string;
  campus: string;
  zone?: "north" | "central" | "south" | null;
  date: string; // YYYY-MM-DD
  description?: string | null;
  link?: string | null;
  status: "upcoming" | "ongoing" | "completed";
}
```

**Note:** Local `OfficeHourSession` interface in `OfficeHoursClient.tsx` conflicts — remove it, import `OfficeHoursSession` from `@/lib/types` instead.

---

### 3. `src/services/weeklyTwitches.ts` — NEW FILE

Follows same pattern as `src/services/profile.ts` (axios + `clientEnv.NEXT_PUBLIC_API_BASE_URL` + routes from `urls.ts`).

```ts
import axios from "axios";
import { clientEnv } from "@/lib/env/env.client";
import type {
  WeeklyTwitchParams,
  WeeklyTwitchPagination,
  OfficeHoursSession,
  WeeklyTwitchEpisode,
} from "@/lib/types";
import { weeklyTwitchRoutes } from "./urls";

interface WeeklyTwitchResponse<T> {
  data: T[];
  pagination: WeeklyTwitchPagination;
}

function buildParams(params: WeeklyTwitchParams): Record<string, string> {
  const out: Record<string, string> = {};
  if (params.status) out.status = params.status;
  if (params.search) out.search = params.search;
  if (params.pageIndex) out.pageIndex = String(params.pageIndex);
  if (params.perPage) out.perPage = String(params.perPage);
  return out;
}

export async function fetchOfficeHours(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<OfficeHoursSession>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchRoutes.officeHours}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}

export async function fetchSaltMangoTree(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchRoutes.saltMangoTree}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}

export async function fetchInspirationStation(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchRoutes.inspirationStation}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}
```

---

### 4. `src/app/events/office-hour/page.tsx` — MODIFY

```ts
import { Suspense } from "react";
import { fetchOfficeHours } from "@/services/weeklyTwitches";
import OfficeHoursClient from "./_components/OfficeHoursClient";

export default async function OfficeHoursPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string; page?: string }>;
}) {
  const { view, search, page } = await searchParams;

  const { data, pagination } = await fetchOfficeHours({
    status: view === "previous" ? "completed" : "upcoming",
    search: search || undefined,
    pageIndex: page ? parseInt(page) : 1,
    perPage: 6,
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OfficeHoursClient sessions={data} pagination={pagination} />
    </Suspense>
  );
}
```

Remove: `import { getOfficeHours } from "@/lib/tina"` and `export const dynamic = "force-dynamic"`.

---

### 5. `src/app/events/salt-mango-tree/page.tsx` — MODIFY

Same pattern — replace `getSaltMangoTree` with `fetchSaltMangoTree`. Pass `episodes={data}` and `pagination`.

---

### 6. `src/app/events/inspiration-station/page.tsx` — MODIFY

Same pattern — replace `getInspirationStation` with `fetchInspirationStation`.

---

### 7. `src/app/events/office-hour/_components/OfficeHoursClient.tsx` — MODIFY

**Remove:**
- Local `OfficeHourSession` interface — import `OfficeHoursSession` from `@/lib/types`
- `isDateUpcoming` function — status comes from API
- All `useMemo` filtering (`filteredEvents`, `upcomingEvents`, `pastEvents`)
- All `useMemo` pagination slicing (`paginatedUpcoming`, `paginatedPast`)
- `allTags` derivation + `selectedTags` state + `toggleTag` (no tag filter param in API)
- Local `upcomingPage` / `pastPage` state — page driven by URL now

**Add:**
- `pagination: WeeklyTwitchPagination` prop (imported from `@/lib/types`)
- Debounced search: local `inputValue` state, `useEffect` debounce 400ms → `router.push` with `?search=`
- Page change handler: `router.push` with `?page=N`, preserve existing `view` + `search` params
- Tab switch handler: already uses `router.push` — add `page=1` reset on tab change
- Pass `pagination.count` and `6` to `<Pagination total={pagination.count} perPage={6} />`

**Updated props interface:**
```ts
interface OfficeHoursClientProps {
  sessions: OfficeHoursSession[];
  pagination: WeeklyTwitchPagination;
}
```

**Tag filter note:** Remove `SearchAndFilter` tag popover or pass `allTags=[]` (hides popover naturally). Add back when API adds tag filter param.

**Date format:** API returns `YYYY-MM-DD`. Replace `DD/MM/YYYY` parsing with `new Date(date + "T00:00:00").toLocaleDateString()`.

---

### 8. `src/app/events/salt-mango-tree/_components/SaltMangoTreeClient.tsx` — MODIFY

**Remove:**
- Local `SaltMangoTreeEpisode` interface — import `WeeklyTwitchEpisode` from `@/lib/types`
- `isDateUpcoming` function
- Client-side `upcomingEvents` / `pastEvents` filter
- `events` transform (API data matches shape directly)
- Local `activeTab` state

**Add:**
- `pagination: WeeklyTwitchPagination` prop
- URL-driven tab + page + search state (same pattern as OfficeHoursClient)
- `useRouter` + `useSearchParams` imports
- Debounced search input (400ms) → `router.push`
- `<SearchAndFilter>` component (search only, `allTags=[]`)
- `<Pagination>` component using `pagination.count`
- Import `Pagination` and `SearchAndFilter` from `@/app/events/_components/`

---

### 9. `src/app/events/inspiration-station/_components/InspirationStationClient.tsx` — MODIFY

Identical changes to `SaltMangoTreeClient.tsx`. Replace `InspirationStationEpisode` with `WeeklyTwitchEpisode`.

---

## URL State Design (all three pages)

| Param | Values | Default | Resets on change |
|---|---|---|---|
| `view` | `upcoming` \| `previous` | `upcoming` | resets `page` to `1` |
| `search` | any string | `""` | resets `page` to `1` |
| `page` | integer ≥ 1 | `1` | — |

---

## Debounce Pattern (shared across all 3 clients)

```ts
const [inputValue, setInputValue] = useState(searchFromUrl);

useEffect(() => {
  const t = setTimeout(() => {
    if (inputValue === searchFromUrl) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", inputValue);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, 400);
  return () => clearTimeout(t);
}, [inputValue]);
```

---

## Migration Checklist

- [ ] `src/services/urls.ts` — add `weeklyTwitchRoutes`
- [ ] `src/lib/types.ts` — add `WeeklyTwitchPagination`, `WeeklyTwitchParams`, `OfficeHoursSession`, `WeeklyTwitchEpisode`
- [ ] `src/services/weeklyTwitches.ts` — create with `fetchOfficeHours`, `fetchSaltMangoTree`, `fetchInspirationStation`
- [ ] `src/app/events/office-hour/page.tsx` — replace tina call with `fetchOfficeHours`
- [ ] `src/app/events/salt-mango-tree/page.tsx` — replace tina call with `fetchSaltMangoTree`
- [ ] `src/app/events/inspiration-station/page.tsx` — replace tina call with `fetchInspirationStation`
- [ ] `OfficeHoursClient.tsx` — remove client-side filter/pagination, add URL-driven state, fix date format
- [ ] `SaltMangoTreeClient.tsx` — add search + pagination + URL state
- [ ] `InspirationStationClient.tsx` — add search + pagination + URL state
- [ ] Verify `NEXT_PUBLIC_API_BASE_URL` covers the media-content endpoint base
- [ ] Remove `getOfficeHours`, `getSaltMangoTree`, `getInspirationStation` from `src/lib/tina.ts`

---

## What Does NOT Change

- `GenericEventCard` — no changes
- `Pagination` — no changes (already accepts `total` + `perPage`)
- `TabButton` — no changes
- `EmptyState` — no changes
- Hero sections in all three client components — no changes
- TinaCMS config/schema for other content types
- `src/services/apiGateway.ts` — not used here (no auth needed for GET)
- API endpoint URLs — unchanged
