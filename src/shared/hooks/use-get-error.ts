import { toFetcherError } from "@/lib/fetcher";

/** The one function every feature's `hooks/<feature>.hooks.ts` calls in `onError` to turn a caught error into a display string. */
export function getApiResponseError(error: unknown, options: { fallback?: string } = {}): string {
  const { fallback = "Something went wrong. Please try again." } = options;
  return toFetcherError(error, fallback).message || fallback;
}
