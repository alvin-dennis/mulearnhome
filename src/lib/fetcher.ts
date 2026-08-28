import axios, { type AxiosInstance } from "axios";
import { apiConfig } from "@/config/api";
import type { ApiError } from "@/types/api.types";
import { extractDjangoMessage } from "./errors";

export class FetcherError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
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

function createClient(authenticated: boolean): AxiosInstance {
  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    if (authenticated) {
      const token = getAuthToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return client;
}

/** No Authorization header — every feature uses this today. */
export const publicGateway = createClient(false);

/** Attaches a Bearer token when getAuthToken() returns one. Scaffolded for a future authenticated area; unused until then. */
export const privateGateway = createClient(true);

/** Normalizes an axios (or FetcherError) rejection into a human-readable message via the Django error envelope. */
export function toFetcherError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): FetcherError {
  if (error instanceof FetcherError) return error;
  if (axios.isAxiosError(error)) {
    const message = extractDjangoMessage(error.response?.data) ?? error.message ?? fallback;
    return new FetcherError({
      message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });
  }
  if (error instanceof Error) return new FetcherError({ message: error.message });
  return new FetcherError({ message: fallback });
}
