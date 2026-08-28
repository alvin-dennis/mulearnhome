# Feature-Based Folder Structure

Proposal to reorganize `src/` from layer-based (`services/`, `hooks/`, `lib/types.ts`, `lib/schemas/`, `data/` all separate) into feature-based: one folder per page/feature, with a sub-folder per concern (`api/`, `hooks/`, `schemas/`, `types/`, `utils/`, `components/`), and the file inside each sub-folder named after the feature (`<feature>.api.ts`, `<feature>.hooks.ts`, `<feature>.schema.ts`, `<feature>.types.ts`, `<feature>.utils.ts`) — never a generic `index.ts` doing double duty as the only file.

## 1. Why

Current repo mixes layer-based and route-based org. Pain points found in codebase:

- **`lib/types.ts` monolith** — 493 lines, every domain's types in one file (`Event`, `Learner`, `GalleryItem`, `Testimonial`, ...).
- **Services grouped by layer, not feature** — `src/services/*.ts` one file per backend domain, disconnected from the route that uses it. Finding "everything about Events" means jumping across `app/events/`, `services/publicEvents.ts`, `services/weeklyTwitches.ts`, `lib/types.ts`, `data/events.ts`.
- **Misplaced hook** — `useLandingStats.ts` (a WebSocket hook) lives in `src/services/`, not `src/hooks/`.
- **Inconsistent type placement** — `gallery` and `impact-gallery` are two legitimately separate features (different routes, different pages, different purpose) but their types are placed inconsistently: `data/gallery.ts` has ad hoc types (`GalleryMediaItem`, `GalleryEvent`) while `impact-gallery`'s types (`GalleryItem`, `ImpactStat`) sit in the `lib/types.ts` monolith. Whatever the two features share (media-card shape, grid layout component) belongs in `shared/`, not duplicated in both or used as a reason to merge two different pages into one feature.
- **Scattered shared consumers** — profile/stats fetchers (`fetchTopLearners`, `useLandingStats`) consumed from 8+ unrelated route folders with no clear ownership.
- **Partial colocation already exists** — route `_components/` folders colocate UI, but api/types/schemas for that same route live elsewhere. Feature-based structure finishes this pattern instead of introducing a new one.
- **No data-fetching/caching layer** — confirmed no `@tanstack/react-query` (or SWR) in `package.json`; every fetch is a raw `axios` call in a Server Component or `useEffect`, so there's no request dedup, cache, background refetch, or mutation/invalidation story anywhere in the app. This migration introduces TanStack Query at the same time as the folder restructure (§2), rather than doing two separate rewrites later.
- **No error-message convention** — a failed `axios` call is caught ad hoc per component today, with no shared way to turn a backend error into a display string. This migration adds one (`getApiResponseError`, §2) alongside the fetcher.
- **No shared metadata/SEO convention** — no per-route `generateMetadata`/`metadata` pattern observed; this migration adds one default builder, used sparingly (§2), not a file per route.

## 2. Target Convention

One folder per feature (roughly: one folder per top-level route/page). **Every feature owns its full vertical slice — api, hooks, components, schemas, types, utils all live INSIDE the feature folder**, each in its own sub-folder, and the file that does the actual work inside that sub-folder is named after the feature, not `index.ts`. `index.ts` is reserved purely as a re-export barrel, at every level.

```
features/<feature-name>/
  api/
    <feature>.api.ts       # raw fetch/mutate functions — call lib/fetcher.ts + shared/api/endpoints.ts, no query-lib code
    index.ts                # named re-exports from '<feature>.api'
  hooks/
    <feature>.query-keys.ts  # query-key factory for this feature
    <feature>.hooks.ts        # TanStack Query hooks (useQuery/useMutation) wrapping api/<feature>.api.ts, keyed via <feature>.query-keys.ts
    index.ts
  schemas/
    <feature>.schema.ts       # zod schemas for this feature's forms/API payloads
    index.ts
  types/
    <feature>.types.ts         # this feature's slice of the old lib/types.ts monolith
    index.ts
  utils/
    <feature>.utils.ts          # feature-local pure helpers
    index.ts
  data/                          # optional — static content specific to this feature
    <feature>.data.ts
    index.ts
  components/
    <component-name>.tsx           # was app/<route>/_components/*
    index.ts
  __tests__/
    <feature>.test.ts               # optional — colocated unit tests
  index.ts                           # top-level barrel — the ONLY import path other code is allowed to use
```

Note there is **no `metadata/` kind-folder** in this template. Metadata is handled by one shared function (below), called inline where a page actually needs custom title/description — it does not get a dedicated sub-folder, file, and barrel multiplied across every feature.

Only create the sub-folders a feature actually needs — a feature with no form skips `schemas/` entirely. But when a concern exists, it gets its own sub-folder, and the file inside is named `<feature>.<kind>.ts` — never a bare `api.ts`/`types.ts` (ambiguous once you're staring at an import list from ten features) and never the concern flattened into the feature root without its own folder.

Rules:
- **Every feature is fully self-contained.** `api/`, `hooks/`, `schemas/`, `types/`, `utils/` are sub-folders inside the feature, not top-level folders the feature reaches into. A feature should be deletable by deleting one directory.
- **Two-level naming, always.** Folder tells you the *kind* (`api/`, `types/`, ...), filename tells you the *feature* (`donate.api.ts`, `donate.types.ts`). Combined, `features/donate/api/donate.api.ts` is unambiguous from a bare file-tab title alone — this is the whole point of the `<feature>.<kind>.ts` naming, not a cosmetic choice.
- **One barrel in, one barrel out.** Code outside a feature imports only from `features/<name>/index.ts` (aliased as `@/features/<name>`). Never `import { fetchDonation } from '@/features/donate/api/donate.api'` from another feature — that's a direct violation of the boundary, not a style nit (enforced by lint, see below).
- **Endpoints are centralized in `shared/`, not partitioned per feature.** Unlike every other kind of file in this doc, endpoint URL strings do NOT move into each feature's `api/`. Following mulearn-dashboard's `src/api/endpoints.ts` convention, every endpoint path lives in ONE file, `shared/api/endpoints.ts`, as a single exported `endpoints` object with a section per domain (`donation`, `publicEvents`, `profile`, ...), each section header-commented and each key JSDoc'd with its HTTP method + purpose — today's `services/urls.ts` becomes this file. A feature's `api/<feature>.api.ts` imports the one object and reads `endpoints.donation.submit`. It lives in `shared/`, not `lib/`, because it's domain-aware and consumed by every feature — the same "cross-cutting, no page of its own" test that put `profile`/`stats` in `shared/` (below).
- **Public and private HTTP clients, both scaffolded from day one.** `lib/fetcher.ts` exports two clients built off the same `request()` internals: `publicGateway` (no `Authorization` header — everything this site calls today) and `privateGateway` (attaches a Bearer token when one exists, via a `getAuthToken()` hook that returns `undefined` today). mulearnhome has no login right now, so every feature calls `publicGateway` — but the private variant exists up front so adding an authenticated area later (e.g. a future member dashboard) doesn't require re-touching every `<feature>.api.ts` file, only swapping which client it imports.
- **All errors resolve through `extractDjangoMessage` + `getApiResponseError`.** `lib/fetcher.ts`'s `request()` calls `extractDjangoMessage(errorData)` (Django's `{ message: { general: [...] } }` / DRF `{ detail: "..." }` envelope — same backend family as mulearn-dashboard) before falling back to `response.statusText`, so `FetcherError.message` is already human-readable. `shared/hooks/use-get-error.ts` exports `getApiResponseError(error, options?)`, the one function every feature's `hooks/<feature>.hooks.ts` calls in `onError` to turn a caught error into a display string — no feature hand-rolls its own error parsing.
- **All data fetching goes through TanStack Query.** Each feature's `api/<feature>.api.ts` holds plain async functions calling `publicGateway` (or `privateGateway`) + `shared/api/endpoints.ts`; `hooks/<feature>.query-keys.ts` holds the query-key factory; `hooks/<feature>.hooks.ts` holds the `useQuery`/`useMutation` hooks built on both — components call the hook, never the client or the raw fetch function directly.
- **Hooks are consumed only in `components/` and `app/**/page.tsx`.** `<feature>.hooks.ts` (or `shared/hooks/*.hooks.ts`) is the *only* thing a component or page imports for data — never `api/<feature>.api.ts` directly, and never a hook imported from inside another `api/`, `schemas/`, `types/`, `utils/`, or `data/` file. `api/<feature>.api.ts` stays plain async functions with no hook, no `useQuery`/`useMutation`, no React import at all — that layer is framework-agnostic on purpose so it stays testable without a React tree.
- **Metadata: one default, called sparingly — not a file per route.** `config/site.ts` holds one `siteConfig` object (name, shortName, description, url, ogImage, creator, keywords) — everything `app/layout.tsx` currently hardcodes inline. `lib/metadata.ts` exports one function, `constructMetadata({ title?, description?, image?, canonical?, noIndex? })`, building the full `openGraph`/`twitter`/`metadataBase` shape from `siteConfig` plus whatever's passed in. `app/layout.tsx` calls it with **no arguments** for the site-wide default. A page only calls it again, inline in that page's own `page.tsx` (`export const metadata = constructMetadata({ title: "Gallery", description: "..." })`), when its SEO genuinely differs from the default — most of the ~30 routes just inherit the root metadata and add nothing. This is not a `metadata/<feature>.metadata.ts` file multiplied across every feature; it's one function, called zero or one extra times per route.
- **Global stays global** — only things with zero domain meaning: `components/ui/*` (design system), `components/layouts/*` (`navbar`/`footer`/app chrome), `lib/fetcher.ts`, `lib/errors.ts`, `lib/metadata.ts`, `config/*`, generic hooks with no business meaning (`useDebounce`), `lib/analytics/*` infra.
- **No dedicated page → not a feature.** `profile`/`stats` fetchers used across 8 routes have no route of their own — they don't get a `features/profile/` or `features/stats/` folder. They move into `shared/` (`shared/api/profile.api.ts`, `shared/types/profile.types.ts`, `shared/hooks/profile.hooks.ts`, `shared/hooks/stats.hooks.ts`, ...), same kind-folder + `<name>.<kind>.ts` naming as a feature, just rooted under `shared/` instead of `features/<name>/`, imported by whichever page needs them. `shared/hooks/profile.hooks.ts` wraps `shared/api/profile.api.ts` in `useQuery` the same way any feature's `<feature>.hooks.ts` wraps its `<feature>.api.ts` — a component still never imports `profile.api.ts` directly.
- **Next.js routing files stay put.** `app/<route>/page.tsx` and `layout.tsx` remain in `app/` (App Router requirement) but become thin — they import the page's composed view from the matching `features/<name>/` barrel and render it.
- **One page = one feature folder.** Sub-routes that are variants of one feature (e.g. `events/grab-your-superpowers`) become a nested folder under that feature (`features/events/superpowers/`) with their own `components/` (and `api/`, `types/` only if truly distinct), and pull shared logic from `features/events/api/events.api.ts` / `types/events.types.ts` — not a new top-level feature.
- **If a file grows past ~300 lines**, split by sub-domain inside the same kind-folder, not by abandoning the pattern: e.g. `schemas/donate.schema.ts` too big → `schemas/donate-form.schema.ts` + `schemas/donate-subscription.schema.ts`, both re-exported from `schemas/index.ts`.
- **Lowercase everything.** Every folder name and every file name in the feature-based structure is lowercase kebab-case — no PascalCase, no camelCase, anywhere in the filesystem. This includes component files (`donation-form.tsx`, not `DonationForm.tsx`). The only thing that stays PascalCase/camelCase is the *identifier* exported from inside a file — the React component name, a function name, a type name. That's a language-level convention, separate from the filesystem naming rule, and it doesn't change.

### Path aliases (tsconfig)

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/app/*": ["./src/app/*"],
      "@/config/*": ["./config/*"]
    }
  }
}
```

### API infra: public + private clients, Django error extraction, endpoints registry

```ts
// config/env.client.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: { NEXT_PUBLIC_API_URL: z.string().url() },
  runtimeEnv: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL },
  skipValidation: false,
});
```

```ts
// config/env.server.ts — server-only vars, minimal today (site has no backend secrets of its own)
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    // e.g. CAPTCHA_SECRET_KEY, CONTACT_FORM_WEBHOOK — whatever app/api/{captcha,contact}/route.ts already reads
  },
  runtimeEnv: process.env,
});
```

```ts
// config/api.ts
import { env } from "./env.client";

export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;
```

```ts
// types/api.types.ts
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  url: string;
  errors?: Record<string, string[]>;
}

export type FetcherOptions = RequestInit & {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
};
```

```ts
// lib/errors.ts — Django/DRF error-envelope parsing, same backend family as mulearn-dashboard
/** Extracts a human-readable message from Django's `{ message: { general: [...] } }` / DRF `{ detail: "..." }` envelope. */
export function extractDjangoMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const msg = d.message;
  if (msg && typeof msg === "object") {
    const msgObj = msg as Record<string, unknown>;
    if (Array.isArray(msgObj.general) && typeof msgObj.general[0] === "string") {
      return msgObj.general[0];
    }
    for (const key of Object.keys(msgObj)) {
      const val = msgObj[key];
      if (Array.isArray(val) && typeof val[0] === "string") return val[0];
      if (typeof val === "string") return val;
    }
  }
  if (typeof msg === "string") return msg;
  if (typeof d.detail === "string") return d.detail;
  return null;
}
```

```ts
// lib/fetcher.ts — public + private clients, both built on the same request() internals
import { apiConfig } from "@/config/api";
import { extractDjangoMessage } from "./errors";
import type { ApiError, ApiResponse, FetcherOptions } from "@/types/api.types";

class FetcherError extends Error {
  status: number;
  statusText: string;
  url: string;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "FetcherError";
    this.status = error.status;
    this.statusText = error.statusText;
    this.url = error.url;
    this.errors = error.errors;
  }
}

/** No auth today — returns undefined until the site has a login. Swap this to read a real token store later. */
function getAuthToken(): string | undefined {
  return undefined;
}

async function request<T = unknown>(
  endpoint: string,
  options: FetcherOptions = {},
  authenticated: boolean = false,
): Promise<T> {
  const { timeout = apiConfig.timeout, retry = apiConfig.retryAttempts, retryDelay = apiConfig.retryDelay, headers = {}, ...rest } = options;
  const url = endpoint.startsWith("http") ? endpoint : `${apiConfig.baseUrl}${endpoint}`;
  const token = authenticated ? getAuthToken() : undefined;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, {
        ...rest,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = extractDjangoMessage(errorData) ?? errorData.message ?? response.statusText ?? "Something went wrong. Please try again.";
        throw new FetcherError({ message, status: response.status, statusText: response.statusText, url: response.url, errors: errorData.errors });
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data: ApiResponse<T> = await response.json();
        return data.data as T;
      }
      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof FetcherError && error.status >= 400 && error.status < 500) throw error;
      if (attempt < retry) {
        await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unknown error occurred");
}

function createClient(authenticated: boolean) {
  return {
    get: <T>(endpoint: string, options?: FetcherOptions) => request<T>(endpoint, { ...options, method: "GET" }, authenticated),
    post: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) => request<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }, authenticated),
    put: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) => request<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }, authenticated),
    patch: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) => request<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }, authenticated),
    delete: <T>(endpoint: string, options?: FetcherOptions) => request<T>(endpoint, { ...options, method: "DELETE" }, authenticated),
  };
}

/** No Authorization header — every feature uses this today. */
export const publicGateway = createClient(false);

/** Attaches a Bearer token when getAuthToken() returns one. Scaffolded for a future authenticated area; unused until then. */
export const privateGateway = createClient(true);

export { FetcherError };
```

```ts
// shared/hooks/use-get-error.ts — the one error-formatting function every feature's hooks call
import { FetcherError } from "@/lib/fetcher";

export function getApiResponseError(error: unknown, options: { fallback?: string } = {}): string {
  const { fallback = "Something went wrong. Please try again." } = options;
  if (error instanceof FetcherError) return error.message || fallback;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) return String((error as { message: unknown }).message);
  return fallback;
}
```

```ts
// shared/api/endpoints.ts — one file, every domain's endpoint paths, grouped by section (mulearn-dashboard style)
export const endpoints = {
  // ============================================
  // Donation Endpoints
  // ============================================
  donation: {
    /** POST - Submit donation form */
    submit: "/api/v1/donations/",
    /** POST - Create recurring subscription */
    subscription: "/api/v1/donations/subscription/",
  },

  // ============================================
  // Public Events Endpoints
  // ============================================
  publicEvents: {
    /** GET - List public events (query: page, category) */
    list: "/api/v1/events/",
    /** GET - Weekly recurring event detail by slug */
    weeklyTwitch: (slug: string) => `/api/v1/events/weekly/${slug}/`,
  },

  // ============================================
  // Profile / Stats Endpoints (shared — no dedicated feature owns these)
  // ============================================
  profile: {
    /** GET - Top learners leaderboard */
    topLearners: "/api/v1/profile/leaderboard/",
    /** GET - Public profile image by id */
    profileImage: (id: string) => `/api/v1/profile/${id}/image/`,
  },
} as const;
```

```ts
// features/donate/api/donate.api.ts — raw fetch functions
import { publicGateway } from "@/lib/fetcher";
import { endpoints } from "@/shared/api/endpoints";
import type { DonationFormPayload } from "../types";

export const submitDonationForm = (payload: DonationFormPayload) =>
  publicGateway.post(endpoints.donation.submit, payload);
```

```ts
// features/donate/hooks/donate.query-keys.ts
export const donateKeys = {
  all: ["donate"] as const,
  submit: () => [...donateKeys.all, "submit"] as const,
};
```

```ts
// features/donate/hooks/donate.hooks.ts
import { useMutation } from "@tanstack/react-query";
import { getApiResponseError } from "@/shared/hooks/use-get-error";
import { submitDonationForm } from "../api";
import { donateKeys } from "./donate.query-keys";

export function useSubmitDonationMutation() {
  return useMutation({
    mutationKey: donateKeys.submit(),
    mutationFn: submitDonationForm,
    onError: (error) => getApiResponseError(error),
  });
}
```


A component calls `useSubmitDonationMutation()` from the feature barrel — never `publicGateway`/`privateGateway` directly. This gives every mutation/query the same cache, retry, and loading-state behavior for free, which the current plain-`axios`-in-`useEffect` calls don't have at all.

### Query client + provider

```ts
// lib/query-client.ts
import { type DefaultOptions, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  mutations: { retry: false },
};

export function makeQueryClient() {
  return new QueryClient({ defaultOptions: queryConfig });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
```

```tsx
// components/providers/query-provider.tsx — wraps app/layout.tsx
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { getQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### SEO: one `constructMetadata()`, not a file per route

```ts
// config/site.ts
export const siteConfig = {
  name: "µLearn — Break the Echo Chamber",
  shortName: "µLearn",
  description: "µLearn is a synergic philosophy of education, with a culture of mutual learning through micro groups of peers.",
  url: "https://mulearn.org",
  ogImage: "/assets/logo.png",
  creator: "µLearn",
  keywords: ["mulearn", "peer learning", "interest groups", "student community", "karma"],
} as const;

export type SiteConfig = typeof siteConfig;
```

```ts
// lib/metadata.ts — the ONE function every page that needs custom SEO calls; most pages call nothing at all
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataParams {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
}: MetadataParams = {}): Metadata {
  const isBrandInTitle = title === siteConfig.name || title.includes(siteConfig.shortName);
  const titleObj = isBrandInTitle ? { absolute: title } : { default: title, template: `%s | ${siteConfig.shortName}` };

  return {
    title: titleObj,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator, url: siteConfig.url }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      url: canonical || siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: canonical || siteConfig.url },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
```

```tsx
// app/layout.tsx — the site-wide default, called with NO arguments
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata();
```

```tsx
// app/gallery/page.tsx — one of the handful of routes whose SEO genuinely differs from the default
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Gallery",
  description: "Explore moments from µLearn events across campuses and communities.",
  canonical: "https://mulearn.org/gallery",
});
```

That's the entire pattern: one shared function, called zero or one extra times per route, inline in that route's own `page.tsx`. No `metadata/` sub-folder, no `<feature>.metadata.ts` file, no barrel entry — adding one for all ~30 routes would be 30 nearly-identical files for a concern that's a single function call. This repo currently has no `app/sitemap.ts` or `app/robots.ts` either — add both as part of this migration, generating their route list from the feature route names already enumerated in this doc's AFTER tree (§4).

### Biome — file naming + import hygiene

This repo already uses Biome (not ESLint/Prettier), so enforcement rides on `biome.json`, not an eslint config. Biome's `useFilenamingConvention` rule enforces the lowercase-kebab-case rule from §2 directly — a PascalCase component filename fails the lint step, not just code review:

```jsonc
// biome.json
{
  "linter": {
    "rules": {
      "style": {
        "useFilenamingConvention": {
          "level": "error",
          "options": { "filenameCases": ["kebab-case"] }
        }
      }
    }
  },
  "organizeImports": { "enabled": true }
}
```

Turn on `organizeImports` too — it keeps each barrel's re-export list and each file's import list sorted and deduped as files move during the migration, instead of that being a manual cleanup pass.

### Enforcing the barrel boundary (dependency-cruiser, not Biome)

Biome's linter does not yet support glob/path-pattern import restrictions (its `noRestrictedImports` rule only matches exact module specifiers, not `@/features/*/*/*`-style globs) — it can't express "nothing outside a feature imports past its `index.ts`" on its own. Use `dependency-cruiser` alongside Biome for this one architectural rule, run as its own CI step:

```js
// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    {
      name: "no-deep-feature-imports",
      severity: "error",
      comment: "Import from a feature's barrel (index.ts), not its internals.",
      from: { pathNot: "^src/features/[^/]+/index\\.ts$" },
      to: { path: "^src/features/[^/]+/(api|hooks|schemas|types|utils|components)/" }
    }
  ]
};
```

```jsonc
// package.json
{
  "scripts": {
    "lint:boundaries": "depcruise src --config .dependency-cruiser.cjs"
  }
}
```

Biome owns formatting, import sorting, and filename casing. Dependency-cruiser owns the one thing Biome can't do: catching a deep `@/features/donate/api/donate.api` import from outside the feature. Both run in CI; a deep import fails the build, same outcome the eslint-plugin-boundaries approach would give in an ESLint repo — just split across the two tools this repo actually has.

### Barrel example

```ts
// features/donate/api/index.ts
export { submitDonationForm, submitSubscription } from './donate.api';

// features/donate/schemas/index.ts
export { donationFormSchema, donationTypeSchema } from './donate.schema';

// features/donate/types/index.ts
export type { DonationFormPayload, RazorpayConstructor } from './donate.types';

// features/donate/components/index.ts
export { DonationForm } from './donation-form';
export { DonateHero } from './donate-hero';
export { TierCard } from './tier-card';

// features/donate/index.ts  (the feature's public API)
export { DonationForm, DonateHero, TierCard } from './components';
export { submitDonationForm, submitSubscription } from './api';
export type { DonationFormPayload, RazorpayConstructor } from './types';
export { donationFormSchema, donationTypeSchema } from './schemas';
```

Named, explicit exports — not `export *`. A wildcard re-export hides what a feature actually offers and silently changes its public surface whenever an internal file adds an export; naming each export at every barrel level makes the feature's public API a thing you can read, not something you have to trace.

## 3. BEFORE (current, real)

```
src/
├── app/
│   ├── api/
│   │   ├── captcha/route.ts
│   │   └── contact/route.ts
│   ├── (home)/
│   │   ├── page.tsx
│   │   └── _components/            (Hero.tsx, Stats.tsx, Story.tsx, SpecialEvents.tsx, ...)
│   ├── events/
│   │   ├── page.tsx
│   │   ├── _components/            (EventCard.tsx, Grid.tsx, SearchAndFilter.tsx, Pagination.tsx, index.ts, ...)
│   │   ├── grab-your-superpowers/{page.tsx, _components/}
│   │   ├── inspiration-station/{page.tsx, _components/}
│   │   ├── office-hour/{page.tsx, _components/}
│   │   └── salt-mango-tree/{page.tsx, _components/}
│   ├── donate/
│   │   ├── page.tsx, layout.tsx
│   │   ├── _components/            (DonateHero.tsx, DonationForm.tsx, TierCard.tsx, TrustBar.tsx, WhereItGoes.tsx, GallerySneakPeek.tsx, donationUrlParams.ts)
│   │   └── success/{page.tsx, layout.tsx}
│   ├── gallery/
│   │   ├── page.tsx
│   │   ├── [eventSlug]/page.tsx
│   │   └── _components/            (GalleryClient.tsx, GalleryGrid.tsx, GalleryListView.tsx, GallerySearch.tsx, MediaLightbox.tsx, VideoPlayer.tsx, index.ts, ...)
│   ├── impact-gallery/{page.tsx, _components/}
│   ├── be-a-part/{campus,company,enablers,learners}/{page.tsx, _components/}
│   ├── careers/, contact/, testimonials/, report/, team/, kkem/, levelstructure/, ...  (~30 more route folders, same pattern)
│   └── layout.tsx, globals.css, not-found.tsx
├── components/
│   ├── ui/                         (button, card, dialog, input, select, table, tabs, ...)
│   ├── analytics/                  (AnalyticsProvider, CookieConsent, CookiePreferencesModal, DebugPanel, index.ts)
│   └── Navbar.tsx, Footer.tsx, BacktoTop.tsx, MuFramer.tsx, MuImage.tsx, MuLoader.tsx, NotFound.tsx
├── hooks/
│   └── useAnalytics.ts, useConsentManager.ts, useDebounce.ts, useTrackEvent.ts, useTrackPageView.ts
├── services/
│   ├── apiGateway.ts
│   ├── urls.ts                     (ALL route path constants, every domain, one file)
│   ├── publicEvents.ts, profile.ts, donation.ts, careers.ts, cdn.ts, discord.ts, weeklyTwitches.ts
│   └── useLandingStats.ts          # <- a hook, misplaced here
├── lib/
│   ├── types.ts                    # 493 lines, every domain's types
│   ├── types/razorpay.d.ts
│   ├── schemas/                    (common.ts, contact.ts, donation.ts, index.ts)
│   ├── analytics/                  (config.ts, consent.ts, events.ts, types.ts, index.ts)
│   ├── env/                        (env.client.ts, env.server.ts, index.ts)
│   └── sanitize.ts, utils.ts
├── data/
│   └── campus.ts, common.ts, community.ts, company.ts, donate.ts, enablers.ts, events.ts,
│       gallery.ts, home.ts, impact-gallery.ts, kkem.ts, lc-ig.ts, learners.ts, legal.ts,
│       socials.ts, team.ts, testimonials.ts
└── globals.d.ts
```

## 4. AFTER (proposed)

```
config/                                # repo root, OUTSIDE src/ entirely
├── env.client.ts                      # NEXT_PUBLIC_* vars, zod-validated (was lib/env/env.client.ts)
├── env.server.ts                      # server-only vars (was lib/env/env.server.ts)
├── api.ts                             # apiConfig: baseUrl/timeout/retryAttempts/retryDelay
└── site.ts                            # siteConfig: name/shortName/description/url/ogImage/creator/keywords — extracted from app/layout.tsx's hardcoded values

src/
├── app/                             # thin routing shell only
│   ├── sitemap.ts                    # NEW — generates from feature route list, doesn't exist today
│   ├── robots.ts                     # NEW — doesn't exist today
│   ├── layout.tsx                    → metadata = constructMetadata() with no args
│   ├── api/{captcha,contact}/route.ts
│   ├── (home)/page.tsx              → imports from features/home
│   ├── events/
│   │   ├── page.tsx                 → imports from features/events
│   │   ├── grab-your-superpowers/page.tsx
│   │   ├── inspiration-station/page.tsx
│   │   ├── office-hour/page.tsx
│   │   └── salt-mango-tree/page.tsx
│   ├── donate/{page.tsx, layout.tsx, success/{page.tsx, layout.tsx}}
│   ├── gallery/{page.tsx, [eventSlug]/page.tsx}  → gallery/page.tsx has its own constructMetadata({...}) call, inline
│   ├── impact-gallery/page.tsx
│   ├── be-a-part/{campus,company,enablers,learners}/page.tsx
│   └── ... (all other routes, page.tsx only — logic lives in features/; most have NO metadata export, they inherit the layout default)
│
├── features/
│   ├── home/
│   │   ├── data/{home.data.ts, index.ts}
│   │   ├── components/              (hero.tsx, stats.tsx, story.tsx, special-events.tsx, ..., index.ts)
│   │   └── index.ts
│   │
│   ├── events/
│   │   ├── api/{events.api.ts (fetchPublicEvents, fetchGrabYourSuperpowers, fetchInspirationStation, fetchOfficeHours, fetchSaltMangoTree), index.ts}
│   │   ├── hooks/{events.query-keys.ts, events.hooks.ts (useEventsQuery, ...), index.ts}
│   │   ├── types/{events.types.ts (PublicEvent, PublicEventVenue, PublicEventOrganizer, PublicEventsParams, Event), index.ts}
│   │   ├── data/{events.data.ts, index.ts}
│   │   ├── components/              (event-card.tsx, event-category-tabs.tsx, generic-event-card.tsx, grid.tsx, pagination.tsx, search-and-filter.tsx, tab-button.tsx, index.ts)
│   │   ├── superpowers/{components/grab-your-superpowers-client.tsx, index.ts}
│   │   ├── inspiration-station/{components/..., index.ts}
│   │   ├── office-hour/{components/..., index.ts}
│   │   ├── salt-mango-tree/{components/..., index.ts}
│   │   └── index.ts
│   │
│   ├── donate/
│   │   ├── api/{donate.api.ts (submitDonationForm, submitSubscription, Razorpay handlers), index.ts}
│   │   ├── hooks/{donate.query-keys.ts, donate.hooks.ts (useSubmitDonationMutation), index.ts}
│   │   ├── schemas/{donate.schema.ts (donationFormSchema, donationTypeSchema, DonationFormPayload), index.ts}
│   │   ├── types/{donate.types.ts (RazorpayConstructor), index.ts}
│   │   ├── utils/{donate.utils.ts (donationUrlParams helpers), index.ts}
│   │   ├── data/{donate.data.ts (DonationTier), index.ts}
│   │   ├── components/              (donate-hero.tsx, donation-form.tsx, tier-card.tsx, trust-bar.tsx, where-it-goes.tsx, gallery-sneak-peek.tsx, index.ts)
│   │   ├── success/{components/..., index.ts}
│   │   └── index.ts
│   │
│   ├── gallery/                     # stays its own feature — separate route, separate purpose from impact-gallery
│   │   ├── types/{gallery.types.ts (GalleryMediaItem, GalleryEvent), index.ts}
│   │   ├── data/{gallery.data.ts (was data/gallery.ts), index.ts}
│   │   ├── components/              (gallery-client.tsx, gallery-list-view.tsx, gallery-search.tsx, gallery-view-toggle.tsx, media-lightbox.tsx, video-player.tsx, event-media-client.tsx, index.ts)
│   │   └── index.ts
│   │
│   ├── impact-gallery/              # stays its own feature — separate route, separate purpose from gallery
│   │   ├── types/{impact-gallery.types.ts (GalleryItem, ImpactStat), index.ts}
│   │   ├── data/{impact-gallery.data.ts (was data/impact-gallery.ts), index.ts}
│   │   ├── components/              (filter-buttons.tsx, impact-stats.tsx, media-card.tsx, index.ts)
│   │   └── index.ts
│   │
│   ├── be-a-part/
│   │   ├── campus/{components/..., index.ts}
│   │   ├── company/{components/..., index.ts}
│   │   ├── enablers/{components/..., index.ts}
│   │   └── learners/{components/..., index.ts}
│   ├── careers/
│   │   ├── api/{careers.api.ts, index.ts}
│   │   ├── hooks/{careers.query-keys.ts, careers.hooks.ts, index.ts}
│   │   ├── components/{careers-stats.tsx, ..., index.ts}
│   │   └── index.ts
│   ├── contact/
│   │   ├── schemas/{contact.schema.ts, index.ts}
│   │   ├── components/{contact-stats.tsx, ..., index.ts}
│   │   └── index.ts
│   ├── testimonials/{data/{testimonials.data.ts, index.ts}, components/..., index.ts}
│   ├── report/{components/..., index.ts}
│   ├── team/{data/{team.data.ts, index.ts}, components/..., index.ts}
│   ├── kkem/{data/{kkem.data.ts, index.ts}, components/..., index.ts}
│   ├── levelstructure/{components/..., index.ts}
│   └── ...  (every remaining route gets the same shape: only the sub-folders it actually needs)
│
├── components/                      # NOT under shared/ — reusable UI kept at the conventional Next.js top level
│   ├── ui/                          (button, card, dialog, input, select, table, tabs, ...)
│   ├── layouts/                     (navbar.tsx, footer.tsx, backto-top.tsx, mu-framer.tsx, mu-image.tsx, mu-loader.tsx, not-found.tsx, index.ts)
│   └── providers/query-provider.tsx  # QueryClientProvider + devtools, wraps app/layout.tsx
│
├── types/api.types.ts                # ApiResponse, ApiError, FetcherOptions
│
├── lib/                              # zero-domain-knowledge infra — reads config/, knows nothing about features
│   ├── fetcher.ts                    # publicGateway + privateGateway + FetcherError (was services/apiGateway.ts)
│   ├── errors.ts                     # extractDjangoMessage
│   ├── query-client.ts               # makeQueryClient/getQueryClient
│   ├── metadata.ts                   # constructMetadata({title?, description?, image?, canonical?, noIndex?}) — reads config/site.ts
│   ├── analytics/                    # config.ts, consent.ts, events.ts, types.ts
│   └── sanitize.ts, utils.ts
│
├── shared/                          # ONLY cross-cutting DOMAIN code with no page of its own — see §8
│   ├── api/{endpoints.ts (the ONE file: every backend endpoint, grouped by domain section — donation, publicEvents, profile, careers, ...; was services/urls.ts), profile.api.ts (fetchTopLearners, fetchPublicProfileImage), index.ts}
│   ├── components/
│   │   ├── analytics/               (analytics-provider.tsx, cookie-consent.tsx, cookie-preferences-modal.tsx, debug-panel.tsx)
│   │   └── gallery-grid.tsx         # reused by both gallery and impact-gallery — shared, not duplicated or a merge excuse
│   ├── hooks/                       (use-get-error.ts (getApiResponseError), useAnalytics.ts, useConsentManager.ts, useDebounce.ts, useTrackEvent.ts, useTrackPageView.ts, profile.hooks.ts (useTopLearners), stats.hooks.ts (useLandingStats))
│   ├── types/{profile.types.ts (Learner, TopLearner, LearnerRoleTag), stats.types.ts (Counts)}
│   └── schemas/common.schema.ts     (addressSchema, emailSchema, nameSchema, panSchema, phoneSchema)
└── globals.d.ts
```

Note what changed vs a "soft" migration: `services/urls.ts` doesn't get shredded per-feature — it becomes `shared/api/endpoints.ts`, one file, mulearn-dashboard-style. `services/apiGateway.ts` is replaced by `lib/fetcher.ts` (two clients, public and private, both wired through the same Django-error-aware `request()`), and metadata is one function (`lib/metadata.ts`) called sparingly, not a file generated per feature. Env/site/api config moves out of `src/` entirely into a repo-root `config/` folder.

## 5. Worked Examples (before → after)

### Events
| File | Before | After |
|---|---|---|
| Page | `app/events/page.tsx` | `app/events/page.tsx` (thin, imports feature) |
| Component | `app/events/_components/EventCard.tsx` | `features/events/components/event-card.tsx` |
| API | `services/publicEvents.ts` | `features/events/api/events.api.ts` (`fetchPublicEvents`) |
| API | `services/weeklyTwitches.ts` | `features/events/api/events.api.ts` (`fetchGrabYourSuperpowers`, ...) |
| Types | `lib/types.ts` (lines ~430-493) | `features/events/types/events.types.ts` |
| Static data | `data/events.ts` | `features/events/data/events.data.ts` |
| URL constants | `services/urls.ts` (`publicEventsRoutes`, `weeklyTwitchesRoutes`) | `shared/api/endpoints.ts` (`endpoints.publicEvents`) |
| Query hooks | *(none — no react-query today)* | `features/events/hooks/events.query-keys.ts` + `events.hooks.ts` |

### Donate
| File | Before | After |
|---|---|---|
| Page | `app/donate/page.tsx`, `layout.tsx` | unchanged location, thin |
| Component | `app/donate/_components/DonationForm.tsx` | `features/donate/components/donation-form.tsx` |
| API | `services/donation.ts` | `features/donate/api/donate.api.ts` |
| Schema | `lib/schemas/donation.ts` | `features/donate/schemas/donate.schema.ts` |
| Mutation hook | *(none — plain axios call in component today)* | `features/donate/hooks/donate.query-keys.ts` + `donate.hooks.ts` (`useSubmitDonationMutation`) |
| Types | `lib/types/razorpay.d.ts` | `features/donate/types/donate.types.ts` |
| Static data | `data/donate.ts` | `features/donate/data/donate.data.ts` |
| Util | `app/donate/_components/donationUrlParams.ts` | `features/donate/utils/donate.utils.ts` |

### Gallery / Impact Gallery (kept as two separate features)
| File | Before | After |
|---|---|---|
| Component | `app/gallery/_components/GalleryClient.tsx` | `features/gallery/components/gallery-client.tsx` |
| Component | `app/impact-gallery/_components/ImpactStats.tsx` | `features/impact-gallery/components/impact-stats.tsx` |
| Component (reused by both) | `app/gallery/_components/GalleryGrid.tsx` / `app/impact-gallery/_components/GalleryGrid.tsx` | `shared/components/gallery-grid.tsx` — one shared component, not two near-duplicates |
| Types (ad hoc) | `data/gallery.ts` (`GalleryMediaItem`, `GalleryEvent`) | `features/gallery/types/gallery.types.ts` |
| Types | `lib/types.ts` (`GalleryItem`, `ImpactStat`) | `features/impact-gallery/types/impact-gallery.types.ts` |
| Metadata | `gallery/page.tsx`'s inline `{ title, description }` | `gallery/page.tsx` calls `constructMetadata({ title: "Gallery", description: "..." })` — one call, no new file |

### Profile / Stats (shared, previously scattered — no dedicated route, so they go to `shared/`, not `features/`)
| File | Before | After |
|---|---|---|
| API | `services/profile.ts` | `shared/api/profile.api.ts` |
| Hook | *(none — component called `services/profile.ts` directly)* | `shared/hooks/profile.hooks.ts` (`useTopLearners`, wraps `profile.api.ts` in `useQuery`) |
| Hook | `services/useLandingStats.ts` (misplaced) | `shared/hooks/stats.hooks.ts` |
| Types | `lib/types.ts` (`Learner`, `TopLearner`, `LearnerRoleTag`) | `shared/types/profile.types.ts` |
| Types | `lib/types.ts` (`Counts`) | `shared/types/stats.types.ts` |
| Consumer | `app/be-a-part/learners/_components/Ranking.tsx` imports `services/profile` | imports `@/shared/hooks/profile.hooks` (`useTopLearners`) — never `@/shared/api/profile.api` directly |
| Consumer | `app/careers/_components/CareersStats.tsx` imports `services/useLandingStats` | imports `@/shared/hooks/stats.hooks` |

## 6. Naming Conventions

- **Every folder and every file name is lowercase kebab-case.** No exceptions, no PascalCase anywhere in the filesystem — this applies to feature folders, kind sub-folders, and every file inside them, components included.
- Feature folder name = kebab-case, matches the route it serves (`donate`, `gallery`, `impact-gallery` — kept as two separate features since they're two separate routes/pages; only what they actually share moves to `shared/`).
- Sub-folders are a fixed vocabulary: `api`, `hooks`, `schemas`, `types`, `utils`, `data`, `components`, `__tests__`. Don't invent synonyms (`services/`, `helpers/`, `lib/`) — one vocabulary repo-wide. There is deliberately no `metadata/` folder in this vocabulary (see §2).
- The one real file inside each sub-folder (except `components/` and `hooks/`, which hold more than one) is named `<feature>.<kind>.ts` — `donate.api.ts`, `donate.schema.ts`, `donate.types.ts`, `donate.utils.ts`, `donate.data.ts`. Never `api.ts`/`types.ts` bare, never logic pasted directly into `index.ts`.
- `hooks/` holds two files: `<feature>.query-keys.ts` (the query-key factory, no logic) and `<feature>.hooks.ts` (the actual `useQuery`/`useMutation` hooks, importing the keys, the feature's `api/<feature>.api.ts`, and `getApiResponseError`).
- Component files inside `components/` are kebab-case too (`donation-form.tsx`, `event-card.tsx`), never PascalCase, even though the exported component identifier inside stays PascalCase (`export function DonationForm()`) — filename and export name are governed by different conventions and are allowed to differ.
- Every sub-folder gets its own `index.ts` that only re-exports, by name (`export { fetchX, submitY } from './<feature>.<kind>'`) — no `export *`, and zero logic of its own.
- The feature root `index.ts` re-exports from each sub-folder's `index.ts`; nothing outside the feature imports past that root barrel.
- API functions: verb-first, `fetchX`, `submitX`, `updateX`, `deleteX` (camelCase identifiers — that's code, not a filename). Matches current `fetchPublicEvents`, `submitDonationForm` naming — keep it, just relocate into `api/<feature>.api.ts`.
- Hooks: `use<Feature><Thing>` (e.g. `useDonationForm`, `useEventFilters`), all exported from `hooks/<feature>.hooks.ts`.
- Types: PascalCase, no `I`/`T` prefixes (matches current `PublicEvent`, `Learner` style) — again, this is the exported identifier, not the filename; the file itself is `types/<feature>.types.ts`, lowercase.

## 7. Implementation Phases

Ordered so each phase leaves the app in a working, deployable state — no phase depends on a later one being finished, and the riskiest/most-shared code moves first so it only gets touched once.

### Phase 0 — Tooling (no code moves yet)

Goal: the safety net exists before anything relocates, so a mistake in Phase 1+ is caught immediately, not discovered later.

- Add path aliases to `tsconfig.json`: `@/features/*`, `@/shared/*`, `@/lib/*`, `@/app/*`, `@/config/*` (§2).
- Add `biome.json`'s `useFilenamingConvention` (kebab-case) and enable `organizeImports` (§2).
- Add `.dependency-cruiser.cjs` with the `no-deep-feature-imports` rule and a `lint:boundaries` script (§2) — it will simply pass vacuously until `features/` exists, that's fine.
- Install `@tanstack/react-query` (+ `@tanstack/react-query-devtools` for dev).
- Create `config/env.client.ts`, `config/env.server.ts`, `config/api.ts`, `config/site.ts` at the repo root — `env.client.ts`/`env.server.ts` re-validate the exact same env vars `lib/env/` already reads today (no new vars yet), `site.ts` holds `siteConfig` extracted from `app/layout.tsx`'s hardcoded `Metadata` object.
- Wire both lint tools into CI so they're active from commit one of the migration, not bolted on at the end.

Exit criteria: `pnpm biome check` and `pnpm lint:boundaries` both run clean on the untouched codebase; `config/` exists.

### Phase 1 — Extract shared/cross-cutting code + stand up the API/query infra

Goal: move the code with no dedicated route *first*, since it has the most scattered call sites (profile/stats: 8+ consumers) — moving it later means touching every one of those consumers again during each subsequent phase. Land the new fetcher/endpoints/query-client in the same phase, since every later feature migration (Phase 3) depends on them existing.

- `services/apiGateway.ts` → replaced by `lib/fetcher.ts` (`publicGateway` + `privateGateway` + `FetcherError`, §2 code block) and `lib/errors.ts` (`extractDjangoMessage`). `types/api.types.ts` and `config/api.ts` added alongside.
- `services/urls.ts` → `shared/api/endpoints.ts`, reformatted into the single `endpoints` object with domain sections + JSDoc — this is the point at which every route constant gets its final home.
- `shared/hooks/use-get-error.ts` added (`getApiResponseError`).
- `lib/query-client.ts` + `components/providers/query-provider.tsx` added, wired into `app/layout.tsx`.
- `lib/metadata.ts` added (`constructMetadata`); `app/layout.tsx` switches to `export const metadata = constructMetadata();` instead of its inline `Metadata` object.
- `services/profile.ts` → `shared/api/profile.api.ts` (now calling `publicGateway` + `endpoints.profile`); matching slice of `lib/types.ts` → `shared/types/profile.types.ts`; add `shared/hooks/profile.hooks.ts` (`useTopLearners`, wrapping `profile.api.ts` in `useQuery`) — components stop calling `profile.api.ts` directly, they call the hook.
- `services/useLandingStats.ts` → `shared/hooks/stats.hooks.ts`; matching slice of `lib/types.ts` (`Counts`) → `shared/types/stats.types.ts`.
- `lib/schemas/common.ts` → `shared/schemas/common.schema.ts`.
- `components/{Navbar,Footer,BacktoTop,MuFramer,MuImage,MuLoader,NotFound}.tsx` → `components/layouts/` (lowercase-renamed per §2, §8) — stays at `src/components/`, not `src/shared/`.
- `components/analytics/*` → `shared/components/analytics/` (lowercase-renamed); `lib/analytics/*` stays under `lib/analytics/` (infra, not cross-cutting domain code).
- Update every consumer (`Ranking.tsx`, `CareersStats.tsx`, and the other 6+) to import from `@/shared/...` instead of `@/services/...`.

Exit criteria: `services/` is empty or deleted; `lib/fetcher.ts` + `shared/api/endpoints.ts` + `components/providers/query-provider.tsx` + `lib/metadata.ts` exist and are used by at least the relocated `profile`/`stats` code and the root layout; app builds and boots identically, now with React Query devtools visible in dev.

### Phase 2 — Split the type monolith

Goal: `lib/types.ts` is the one file that blocks every later feature-by-feature move — split it fully before starting Phase 3, so each feature phase only ever touches its own new type file, never a shared monolith. (`services/urls.ts` is already gone — folded into `shared/api/endpoints.ts` in Phase 1.)

- Split `lib/types.ts` line-by-line into the `<feature>.types.ts` each slice belongs to (events, donate, gallery, impact-gallery, ..., plus the profile/stats slices already moved in Phase 1). Delete the file once empty.

Exit criteria: `lib/types.ts` no longer exists; every type has a named home, even if some are staged in a temporary location pending Phase 3.

### Phase 3 — Migrate features, highest-traffic first

Goal: convert one route at a time to the target shape (§2), in an order that retires the biggest remaining `services/`/`_components/` footprint fastest. Each feature is its own PR — this phase is many small, reviewable steps, not one big-bang rewrite.

Suggested order (by current file count / complexity, from the exploration): `events` (+ its 4 sub-routes) → `donate` (+ `success`) → `gallery` → `impact-gallery` → `careers` → `contact` → remaining ~25 routes (`home`, `be-a-part/*`, `testimonials`, `report`, `team`, `kkem`, `levelstructure`, ...).

Per feature:
1. Create `features/<name>/` with only the sub-folders it needs.
2. Move `_components/*` → `components/`, renaming to kebab-case.
3. Move its `services/<name>.ts` → `api/<name>.api.ts`, rewritten to call `publicGateway` (`lib/fetcher.ts`) + `shared/api/endpoints.ts` instead of raw `axios`; its schema/type slice → `schemas/`, `types/`.
4. Add `hooks/<name>.query-keys.ts` + `hooks/<name>.hooks.ts` (TanStack Query hooks wrapping the api functions, `onError` calling `getApiResponseError` — §2 code block); update consuming components to call the hook instead of the raw fetcher/`useEffect`.
5. **Only if this route's SEO actually differs from the site default**, add `export const metadata = constructMetadata({...})` inline in `page.tsx` — most routes need nothing here at all.
6. Add named-export `index.ts` barrels at every level (§2 barrel example).
7. Update `app/<route>/page.tsx` to import the view from the feature barrel; delete the old `_components/` folder.
8. Run `pnpm biome check` and `pnpm lint:boundaries` — both must pass before the PR merges.

Exit criteria: every route's `page.tsx` imports only from `@/features/<name>` or `@/shared/...`; `app/**/_components/` no longer exists anywhere.

### Phase 4 — Cleanup

Goal: remove the scaffolding that made the migration safe to do incrementally, now that it's finished.

- Delete `services/`, `lib/types.ts`, `lib/schemas/`, `lib/env/` (all superseded by `config/env.client.ts`/`env.server.ts` in Phase 0).
- Confirm `data/` is empty (everything moved into `features/<name>/data/`) and delete it.
- Add `app/sitemap.ts` and `app/robots.ts` (neither exists today), generating the sitemap's route list from the feature routes enumerated in this doc's §4 tree.
- Promote `lint:boundaries` from a manual script to a required CI check if it wasn't already blocking merges.
- Sweep for `export *` left over from before the named-export rule (§2) landed.

Exit criteria: `git status` shows no orphaned top-level layer folders; `pnpm biome check` and `pnpm lint:boundaries` are both required, green CI checks.

## 8. What Stays Shared (do not move into a feature)

Kept deliberately small — if in doubt, it belongs inside a feature, not here:

- `components/ui/*` — design-system primitives, used everywhere, carry no domain meaning.
- `components/layouts/navbar.tsx`, `footer.tsx`, `mu-image.tsx`, `mu-loader.tsx`, `mu-framer.tsx`, `not-found.tsx`, `backto-top.tsx` — global layout chrome, rendered on every page. Grouped under `src/components/layouts/`, not `shared/` — this is app shell, not cross-feature domain code.
- `components/providers/query-provider.tsx` — the one `QueryClientProvider`, wraps the whole app.
- `shared/components/analytics/*`, `lib/analytics/*` — cross-cutting instrumentation, not tied to one page.
- `shared/components/gallery-grid.tsx` — the one component actually reused between `gallery` and `impact-gallery`; lives in `shared/` precisely because it's used by 2+ features, not because those features got merged.
- `shared/api/profile.api.ts`, `shared/hooks/profile.hooks.ts`, `shared/types/profile.types.ts`, `shared/hooks/stats.hooks.ts`, `shared/types/stats.types.ts` — no dedicated page/route of their own, consumed by 8+ unrelated features. Cross-cutting code with no route stays in `shared/`; it never becomes its own `features/<name>/` folder just because it has real logic in it.
- `shared/api/endpoints.ts` — every backend endpoint, one file, consumed by every feature's `api/<feature>.api.ts`. Domain-aware, so `shared/`, not `lib/`.
- `shared/hooks/use-get-error.ts` (`getApiResponseError`) — the one error-formatting hook every feature's `hooks/<feature>.hooks.ts` calls on a mutation/query error.
- `lib/fetcher.ts` (`publicGateway`/`privateGateway`, zero domain knowledge), `lib/errors.ts` (`extractDjangoMessage`), `lib/query-client.ts`, `lib/metadata.ts`, `types/api.types.ts`, `config/env.client.ts`/`config/env.server.ts`/`config/api.ts`/`config/site.ts` — infra, not domain logic. `config/` sits at the repo root, outside `src/` entirely.
- `shared/hooks/useDebounce.ts` — generic, no domain meaning.
- `shared/schemas/common.schema.ts` — reused validators (email/phone/PAN/address) across multiple features.

Everything else — every endpoint URL, every fetcher, every domain type, every form schema — moves into the feature that owns it, in its own kind-folder, as one `<feature>.<kind>.ts` file. No exceptions carved out for "it's small" or "only one file."
