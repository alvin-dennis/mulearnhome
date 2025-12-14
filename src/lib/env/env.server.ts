/**
 * Server-Side Environment Variables
 *
 * ⚠️ NEVER import or use these variables in client-side code!
 * ⚠️ These contain secrets and must only be accessed in:
 *    - API Routes
 *    - Server Components
 *    - Server Actions
 *    - Build-time scripts
 *
 * This file will crash the app at boot if any required variable is missing or invalid.
 */

import { z } from "zod";

// ============================================================================
// Schema Definition
// ============================================================================

const serverEnvSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Email Configuration (Required)
  GMAIL_USER: z.string().email("GMAIL_USER must be a valid email address"),
  GMAIL_APP_PASSWORD: z.string().min(1, "GMAIL_APP_PASSWORD is required"),
  EMAIL_PROVIDER: z.enum(["gmail", "outlook"]).default("gmail"),

  // Email Recipients (Optional - defaults to fallback list)
  CONTACT_EMAIL_RECIPIENTS: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return ["sachin@mulearn.org", "info@mulearn.org"];
      return val
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
    }),

  // Google Apps Script Integration (Required)
  GOOGLE_APPS_SCRIPT_URL: z.string().url("GOOGLE_APPS_SCRIPT_URL must be a valid URL"),
  GOOGLE_APPS_SCRIPT_SECRET: z.string().min(1, "GOOGLE_APPS_SCRIPT_SECRET is required"),

  // GitHub Token (Optional - for leaderboard generation)
  GH_TOKEN: z.string().optional(),

  // TinaCMS Token (Optional - for CMS authentication with TinaCloud)
  TINA_TOKEN: z.string().optional(),
});

// ============================================================================
// Type Inference
// ============================================================================

export type ServerEnv = z.infer<typeof serverEnvSchema>;

// ============================================================================
// Validation & Export
// ============================================================================

let _serverEnv: ServerEnv | null = null;

/**
 * Parse and validate server environment variables.
 *
 * @throws {Error} If validation fails, with detailed error messages
 */
function validateServerEnv(): ServerEnv {
  if (_serverEnv) return _serverEnv;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid server environment variables:\n\n${errorMessages}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.\n` +
        `See .env.example for reference.\n`,
    );
  }

  _serverEnv = parsed.data;
  return _serverEnv;
}

/**
 * Validated server environment variables.
 *
 * ⚠️ Usage:
 *   - serverEnv.GMAIL_USER
 *   - serverEnv.GOOGLE_APPS_SCRIPT_URL
 *   - etc.
 *
 * DO NOT use process.env directly!
 */
export const serverEnv = new Proxy({} as ServerEnv, {
  get(_target, prop) {
    const env = validateServerEnv();
    return env[prop as keyof ServerEnv];
  },
});

// ============================================================================
// Runtime Safety Check
// ============================================================================

// Ensure this module never gets bundled into client-side code
if (typeof window !== "undefined") {
  throw new Error(
    "❌ serverEnv was imported on the client side!\n\n" +
      "Server environment variables contain secrets and must NEVER be used in client code.\n" +
      "Use clientEnv from '@/lib/env' instead for NEXT_PUBLIC_* variables.\n",
  );
}
