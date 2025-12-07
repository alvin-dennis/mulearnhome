/**
 * Environment Variables - Centralized Entry Point
 *
 * This module provides type-safe, validated environment variables for the entire app.
 *
 * Usage:
 *   - Import { serverEnv } from '@/lib/env' in server-side code (API routes, server components)
 *   - Import { clientEnv } from '@/lib/env' in client-side code (React components, hooks)
 *
 * Benefits:
 *   ✅ Type-safe access to environment variables
 *   ✅ Validated at app boot (fails fast if missing/invalid)
 *   ✅ Prevents accidental exposure of secrets to client
 *   ✅ Single source of truth for all env vars
 *
 * @see env.server.ts for server-only variables
 * @see env.client.ts for client-safe NEXT_PUBLIC_* variables
 */

// Re-export client environment (safe everywhere)
export { type ClientEnv, clientEnv } from "./env.client";

// Re-export server environment (server-only, throws on client access)
export { type ServerEnv, serverEnv } from "./env.server";
