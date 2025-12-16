/**
 * Analytics Types
 *
 * TypeScript types for Google Analytics 4 integration with legal compliance.
 */

// =============================================================================
// Consent Types
// =============================================================================

/**
 * Cookie consent categories
 */
export interface ConsentCategories {
  /** Essential cookies - always enabled, cannot be disabled */
  essential: true;
  /** Analytics cookies - Google Analytics tracking */
  analytics: boolean;
  /** Performance cookies - Core Web Vitals, timing */
  performance: boolean;
  /** Marketing cookies - for future advertising/remarketing */
  marketing: boolean;
}

/**
 * Stored consent state
 */
export interface ConsentState {
  /** Unique consent ID for audit trail (UUID v4) */
  consentId: string;
  /** User's consent decisions per category */
  categories: ConsentCategories;
  /** ISO timestamp when consent was given */
  timestamp: string;
  /** Consent version for tracking policy changes */
  version: string;
  /** Whether user has made an active choice */
  hasInteracted: boolean;
}

/**
 * Consent action types for state management
 */
export type ConsentAction =
  | { type: "ACCEPT_ALL" }
  | { type: "REJECT_ALL" }
  | {
      type: "UPDATE_CATEGORY";
      category: keyof Omit<ConsentCategories, "essential">;
      value: boolean;
    }
  | { type: "LOAD_STORED"; state: ConsentState }
  | { type: "RESET" };

// =============================================================================
// Analytics Event Types
// =============================================================================

/**
 * Standard GA4 event parameters
 */
export interface BaseEventParams {
  /** Event timestamp */
  timestamp?: string;
  /** Page path */
  page_path?: string;
  /** Page title */
  page_title?: string;
  /** Page referrer */
  page_referrer?: string;
}

/**
 * Button/CTA click event
 */
export interface ButtonClickEvent extends BaseEventParams {
  button_text: string;
  button_location: string;
  button_id?: string;
  button_variant?: string;
}

/**
 * Form submission event
 */
export interface FormSubmissionEvent extends BaseEventParams {
  form_name: string;
  form_id?: string;
  form_destination?: string;
  success: boolean;
}

/**
 * Navigation event
 */
export interface NavigationEvent extends BaseEventParams {
  link_text: string;
  link_url: string;
  link_location: "navbar" | "footer" | "sidebar" | "content";
  is_external: boolean;
}

/**
 * Scroll depth event
 */
export interface ScrollEvent extends BaseEventParams {
  scroll_depth: 25 | 50 | 75 | 100;
  scroll_direction: "down" | "up";
}

/**
 * File download event
 */
export interface FileDownloadEvent extends BaseEventParams {
  file_name: string;
  file_extension: string;
  file_url: string;
}

/**
 * Error page event
 */
export interface ErrorPageEvent extends BaseEventParams {
  error_type: "404" | "500" | "other";
  error_message?: string;
  attempted_url?: string;
}

/**
 * Time on page event
 */
export interface TimeOnPageEvent extends BaseEventParams {
  time_seconds: number;
  engaged_time_seconds?: number;
}

// =============================================================================
// E-commerce Types (Donation Flow)
// =============================================================================

/**
 * E-commerce item for donation tracking
 */
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category: "donation";
  item_variant?: "one-time" | "monthly" | "yearly";
  price: number;
  currency: "INR";
  quantity: 1;
}

/**
 * View item event (donation page view)
 */
export interface ViewItemEvent extends BaseEventParams {
  items: EcommerceItem[];
  value?: number;
  currency?: "INR";
}

/**
 * Add to cart event (donation amount selected)
 */
export interface AddToCartEvent extends BaseEventParams {
  items: EcommerceItem[];
  value: number;
  currency: "INR";
}

/**
 * Begin checkout event (payment initiated)
 */
export interface BeginCheckoutEvent extends BaseEventParams {
  items: EcommerceItem[];
  value: number;
  currency: "INR";
  coupon?: string;
}

/**
 * Purchase event (donation completed)
 */
export interface PurchaseEvent extends BaseEventParams {
  transaction_id: string;
  items: EcommerceItem[];
  value: number;
  currency: "INR";
  tax?: number;
  shipping?: number;
}

// =============================================================================
// Custom Dimensions
// =============================================================================

/**
 * Custom dimensions for GA4
 */
export interface CustomDimensions {
  /** User type classification */
  user_type: "visitor" | "member" | "partner" | "unknown";
  /** Current consent status */
  consent_status: "full" | "partial" | "none" | "unknown";
  /** Traffic referral source */
  referral_source?: string;
  /** Device category */
  device_category: "mobile" | "tablet" | "desktop";
  /** Page template type */
  page_template?: string;
}

// =============================================================================
// Analytics Context
// =============================================================================

/**
 * Analytics context value
 */
export interface AnalyticsContextValue {
  /** Whether GA4 is loaded and ready */
  isReady: boolean;
  /** Whether analytics consent has been granted */
  hasConsent: boolean;
  /** Anonymous visitor ID */
  visitorId: string | null;
  /** Track a custom event */
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  /** Track a page view */
  trackPageView: (path?: string, title?: string) => void;
  /** Get current consent state */
  getConsentState: () => ConsentState | null;
}

/**
 * Queued event for pre-consent tracking
 */
export interface QueuedEvent {
  eventName: string;
  params: Record<string, unknown>;
  timestamp: string;
}

// =============================================================================
// Debug Types
// =============================================================================

/**
 * Debug event log entry
 */
export interface DebugEventEntry {
  id: string;
  eventName: string;
  params: Record<string, unknown>;
  timestamp: string;
  sent: boolean;
}

/**
 * Debug panel state
 */
export interface DebugPanelState {
  isOpen: boolean;
  events: DebugEventEntry[];
  consentState: ConsentState | null;
  visitorId: string | null;
  sessionStart: string | null;
}
