/**
 * Consent Management Utilities
 *
 * Handles cookie consent state, storage, and validation.
 * GDPR, CCPA, and LGPD compliant.
 */

import { CONSENT_CONFIG } from "./config";
import type { ConsentCategories, ConsentState } from "./types";

// =============================================================================
// UUID Generation
// =============================================================================

/**
 * Generate a UUID v4 for consent tracking and visitor identification.
 * Uses crypto.randomUUID when available, falls back to manual generation.
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// =============================================================================
// Storage Operations
// =============================================================================

/**
 * Check if we're in a browser environment (not SSR)
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * Get stored consent state from localStorage
 */
export function getStoredConsent(): ConsentState | null {
  if (!isBrowser()) return null;

  try {
    const stored = localStorage.getItem(CONSENT_CONFIG.STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentState;
    return parsed;
  } catch {
    console.warn("[Analytics] Failed to parse stored consent");
    return null;
  }
}

/**
 * Save consent state to localStorage
 */
export function saveConsent(state: ConsentState): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(CONSENT_CONFIG.STORAGE_KEY, JSON.stringify(state));
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: CONSENT_CONFIG.STORAGE_KEY,
        newValue: JSON.stringify(state),
      }),
    );
  } catch (error) {
    console.error("[Analytics] Failed to save consent:", error);
  }
}

/**
 * Clear stored consent
 */
export function clearConsent(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(CONSENT_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.error("[Analytics] Failed to clear consent:", error);
  }
}

// =============================================================================
// Consent Validation
// =============================================================================

/**
 * Check if consent has expired (365 days)
 */
export function isConsentExpired(consent: ConsentState): boolean {
  const consentDate = new Date(consent.timestamp);
  const expirationDate = new Date(consentDate);
  expirationDate.setDate(expirationDate.getDate() + CONSENT_CONFIG.EXPIRATION_DAYS);

  return new Date() > expirationDate;
}

/**
 * Check if consent version matches current version
 */
export function isConsentVersionValid(consent: ConsentState): boolean {
  return consent.version === CONSENT_CONFIG.VERSION;
}

/**
 * Check if stored consent is valid (not expired, correct version)
 */
export function hasValidConsent(): boolean {
  const consent = getStoredConsent();

  if (!consent) return false;
  if (!consent.hasInteracted) return false;
  if (isConsentExpired(consent)) return false;
  if (!isConsentVersionValid(consent)) return false;

  return true;
}

/**
 * Determine if consent banner should be shown
 */
export function shouldShowBanner(): boolean {
  if (!isBrowser()) return false;

  const consent = getStoredConsent();

  // No consent stored - show banner
  if (!consent) return true;

  // User hasn't interacted yet - show banner
  if (!consent.hasInteracted) return true;

  // Consent expired - show banner for renewal
  if (isConsentExpired(consent)) return true;

  // Consent version changed - show banner for re-consent
  if (!isConsentVersionValid(consent)) return true;

  return false;
}

// =============================================================================
// Consent State Factory
// =============================================================================

/**
 * Create default consent state (all non-essential off)
 */
export function createDefaultConsent(): ConsentState {
  return {
    consentId: generateUUID(),
    categories: {
      essential: true,
      analytics: false,
      performance: false,
      marketing: false,
    },
    timestamp: new Date().toISOString(),
    version: CONSENT_CONFIG.VERSION,
    hasInteracted: false,
  };
}

/**
 * Create consent state with all categories accepted
 */
export function createAcceptAllConsent(): ConsentState {
  return {
    consentId: generateUUID(),
    categories: {
      essential: true,
      analytics: true,
      performance: true,
      marketing: true,
    },
    timestamp: new Date().toISOString(),
    version: CONSENT_CONFIG.VERSION,
    hasInteracted: true,
  };
}

/**
 * Create consent state with only essential cookies
 */
export function createRejectAllConsent(): ConsentState {
  return {
    consentId: generateUUID(),
    categories: {
      essential: true,
      analytics: false,
      performance: false,
      marketing: false,
    },
    timestamp: new Date().toISOString(),
    version: CONSENT_CONFIG.VERSION,
    hasInteracted: true,
  };
}

/**
 * Update specific category in consent state
 */
export function updateConsentCategory(
  current: ConsentState,
  category: keyof Omit<ConsentCategories, "essential">,
  value: boolean,
): ConsentState {
  return {
    ...current,
    categories: {
      ...current.categories,
      [category]: value,
    },
    timestamp: new Date().toISOString(),
    hasInteracted: true,
  };
}

// =============================================================================
// Do Not Track (DNT) Detection
// =============================================================================

/**
 * Check if Do Not Track is enabled in browser
 */
export function isDNTEnabled(): boolean {
  if (!isBrowser()) return false;

  // Check various DNT implementations
  const dnt =
    navigator.doNotTrack || // Standard
    (window as { doNotTrack?: string }).doNotTrack || // IE/Edge
    (navigator as { msDoNotTrack?: string }).msDoNotTrack; // Old IE

  return dnt === "1" || dnt === "yes";
}

// =============================================================================
// Visitor ID Management
// =============================================================================

/**
 * Get or create anonymous visitor ID
 */
export function getVisitorId(): string | null {
  if (!isBrowser()) return null;

  try {
    let visitorId = localStorage.getItem(CONSENT_CONFIG.VISITOR_ID_KEY);

    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(CONSENT_CONFIG.VISITOR_ID_KEY, visitorId);
    }

    return visitorId;
  } catch {
    return null;
  }
}

/**
 * Clear visitor ID (for opt-out)
 */
export function clearVisitorId(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(CONSENT_CONFIG.VISITOR_ID_KEY);
  } catch {
    // Ignore errors
  }
}

// =============================================================================
// Consent Status for Analytics
// =============================================================================

/**
 * Get consent status string for custom dimension
 */
export function getConsentStatusString(consent: ConsentState | null): string {
  if (!consent || !consent.hasInteracted) return "unknown";

  const { analytics, performance, marketing } = consent.categories;

  if (analytics && performance && marketing) return "full";
  if (analytics || performance || marketing) return "partial";
  return "none";
}

// =============================================================================
// Cross-Tab Sync Handler
// =============================================================================

/**
 * Create a storage event listener for cross-tab consent sync
 */
export function createConsentSyncListener(
  onConsentChange: (consent: ConsentState | null) => void,
): () => void {
  if (!isBrowser()) return () => {};

  const handler = (event: StorageEvent) => {
    if (event.key === CONSENT_CONFIG.STORAGE_KEY) {
      try {
        const newConsent = event.newValue ? JSON.parse(event.newValue) : null;
        onConsentChange(newConsent);
      } catch {
        onConsentChange(null);
      }
    }
  };

  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}
