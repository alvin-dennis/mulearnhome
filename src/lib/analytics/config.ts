/**
 * Analytics Configuration
 *
 * Central configuration for Google Analytics 4 and consent management.
 */

// =============================================================================
// Consent Configuration
// =============================================================================

export const CONSENT_CONFIG = {
  /** localStorage key for consent state */
  STORAGE_KEY: "mulearn_consent",

  /** localStorage key for visitor ID */
  VISITOR_ID_KEY: "mulearn_visitor_id",

  /** localStorage key for event queue */
  EVENT_QUEUE_KEY: "mulearn_event_queue",

  /** Current consent version - increment when policy changes */
  VERSION: "1.0.0",

  /** Consent expiration in days */
  EXPIRATION_DAYS: 365,

  /** Maximum cookie retention (13 months per GDPR) */
  MAX_RETENTION_DAYS: 395,
} as const;

// =============================================================================
// GA4 Configuration
// =============================================================================

export const GA4_CONFIG = {
  /** Get measurement ID from environment */
  getMeasurementId: () => process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",

  /** Debug mode enabled in development */
  isDebugMode: () => process.env.NODE_ENV === "development",

  /** Data stream settings */
  dataStream: {
    enhanced_measurement: true,
    page_views: true,
    scrolls: true,
    outbound_clicks: true,
    site_search: false,
    video_engagement: true,
    file_downloads: true,
  },
} as const;

// =============================================================================
// Event Names
// =============================================================================

export const EVENT_NAMES = {
  // Standard events
  PAGE_VIEW: "page_view",
  SCROLL: "scroll",
  CLICK: "click",
  FIRST_VISIT: "first_visit",
  SESSION_START: "session_start",

  // Custom events
  BUTTON_CLICK: "button_click",
  FORM_SUBMIT: "form_submit",
  NAVIGATION_CLICK: "navigation_click",
  EXTERNAL_LINK: "external_link_click",
  FILE_DOWNLOAD: "file_download",
  SCROLL_DEPTH: "scroll_depth",
  VIDEO_PLAY: "video_play",
  VIDEO_PROGRESS: "video_progress",
  VIDEO_COMPLETE: "video_complete",
  CTA_CLICK: "cta_click",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  ERROR_PAGE: "error_page_view",
  TIME_ON_PAGE: "time_on_page",

  // E-commerce (donation flow)
  VIEW_ITEM: "view_item",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  REFUND: "refund",

  // Consent events
  CONSENT_UPDATE: "consent_update",
  CONSENT_DEFAULT: "consent_default",
} as const;

// =============================================================================
// Custom Dimension Keys
// =============================================================================

export const CUSTOM_DIMENSIONS = {
  USER_TYPE: "user_type",
  CONSENT_STATUS: "consent_status",
  REFERRAL_SOURCE: "referral_source",
  DEVICE_CATEGORY: "device_category",
  PAGE_TEMPLATE: "page_template",
  VISITOR_ID: "visitor_id",
} as const;

// =============================================================================
// Scroll Depth Thresholds
// =============================================================================

export const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

// =============================================================================
// Time on Page Intervals (seconds)
// =============================================================================

export const TIME_INTERVALS = [30, 60, 120, 300, 600] as const;

// =============================================================================
// File Extensions to Track
// =============================================================================

export const TRACKED_FILE_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
  "rar",
  "tar",
  "gz",
  "mp3",
  "mp4",
  "avi",
  "mov",
  "wmv",
  "csv",
  "txt",
] as const;

// =============================================================================
// External Link Patterns
// =============================================================================

export const INTERNAL_DOMAINS = ["mulearn.org", "localhost", "127.0.0.1"] as const;

// =============================================================================
// DNT (Do Not Track) Configuration
// =============================================================================

export const DNT_CONFIG = {
  /** Respect DNT header */
  RESPECT_DNT: true,

  /** Allow essential tracking even with DNT */
  ALLOW_ESSENTIAL_WITH_DNT: true,
} as const;
