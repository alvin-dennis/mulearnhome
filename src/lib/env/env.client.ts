/**
 * Client-Side Environment Variables
 *
 * ✅ Safe to use in React components, hooks, and client-side code
 * ✅ All variables here are prefixed with NEXT_PUBLIC_*
 * ✅ These are embedded in the client bundle (NOT secret!)
 *
 * This file will crash the app at boot if any required variable is missing or invalid.
 */

import { z } from "zod";

// ============================================================================
// Schema Definition
// ============================================================================

const clientEnvSchema = z.object({
  // Application URL (Required)
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),

  // API Base URL (Required)
  NEXT_PUBLIC_API_BASE_URL: z.string().url("NEXT_PUBLIC_API_BASE_URL must be a valid URL"),

  // CDN URL (Required)
  NEXT_PUBLIC_CDN_URL: z
    .string()
    .url("NEXT_PUBLIC_CDN_URL must be a valid URL")
    .transform((url) => url.replace(/\/$/, "")), // Remove trailing slash

  // Razorpay Key (Required for payment processing)
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, "NEXT_PUBLIC_RAZORPAY_KEY_ID is required"),

  // Contact form google captcha
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),

  // TinaCMS Client ID (Optional - for CMS authentication)
  NEXT_PUBLIC_TINA_CLIENT_ID: z.string().optional(),

  // Google Analytics 4 Measurement ID (Optional - for analytics tracking)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
});

// ============================================================================
// Type Inference
// ============================================================================

export type ClientEnv = z.infer<typeof clientEnvSchema>;

// ============================================================================
// Validation & Export
// ============================================================================

let _clientEnv: ClientEnv | null = null;

/**
 * Parse and validate client environment variables.
 *
 * @throws {Error} If validation fails, with detailed error messages
 */
function validateClientEnv(): ClientEnv {
  if (_clientEnv) return _clientEnv;

  // In Next.js, NEXT_PUBLIC_* variables must be accessed directly from process.env
  // They are replaced at build time with their actual values
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_TINA_CLIENT_ID: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid client environment variables:\n\n${errorMessages}\n\n` +
        `Please check your .env.local file and ensure all NEXT_PUBLIC_* variables are set.\n` +
        `See .env.example for reference.\n`,
    );
  }

  _clientEnv = parsed.data;
  return _clientEnv;
}

/**
 * Validated client environment variables.
 *
 * ✅ Safe to use anywhere in the app (client or server)
 *
 * Usage:
 *   - clientEnv.NEXT_PUBLIC_APP_URL
 *   - clientEnv.NEXT_PUBLIC_CDN_URL
 *   - etc.
 *
 * DO NOT use process.env directly!
 */
export const clientEnv = new Proxy({} as ClientEnv, {
  get(_target, prop) {
    const env = validateClientEnv();
    return env[prop as keyof ClientEnv];
  },
});
