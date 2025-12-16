/**
 * Analytics Event Tracking
 *
 * Functions for tracking various events in Google Analytics 4.
 */

import { CONSENT_CONFIG, EVENT_NAMES, INTERNAL_DOMAINS, TRACKED_FILE_EXTENSIONS } from "./config";
import { getStoredConsent, getVisitorId, isBrowser } from "./consent";
import type {
  AddToCartEvent,
  BeginCheckoutEvent,
  ButtonClickEvent,
  EcommerceItem,
  ErrorPageEvent,
  FileDownloadEvent,
  FormSubmissionEvent,
  NavigationEvent,
  PurchaseEvent,
  QueuedEvent,
  ScrollEvent,
  ViewItemEvent,
} from "./types";

// =============================================================================
// GA4 Window Interface
// =============================================================================

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "js",
      targetOrEvent: string | Date,
      params?: Record<string, unknown>,
    ) => void;
    // biome-ignore lint/suspicious/noExplicitAny: GA4 dataLayer requires any[]
    dataLayer?: Object[] | undefined;
  }
}

// =============================================================================
// Core Tracking Function
// =============================================================================

/**
 * Check if analytics consent is granted
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.hasInteracted === true && consent?.categories?.analytics === true;
}

/**
 * Send event to GA4
 */
export function sendEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!isBrowser() || !window.gtag) {
    // Queue event if gtag not ready
    queueEvent(eventName, params);
    return;
  }

  if (!hasAnalyticsConsent()) {
    // Queue event if no consent
    queueEvent(eventName, params);
    return;
  }

  const visitorId = getVisitorId();
  const enrichedParams = {
    ...params,
    timestamp: new Date().toISOString(),
    ...(visitorId && { user_id: visitorId }),
  };

  window.gtag("event", eventName, enrichedParams);

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Event: ${eventName}`, enrichedParams);
  }
}

// =============================================================================
// Event Queue (Pre-Consent)
// =============================================================================

/**
 * Queue an event for later sending (before consent)
 */
export function queueEvent(eventName: string, params: Record<string, unknown>): void {
  if (!isBrowser()) return;

  try {
    const queue = getEventQueue();
    const event: QueuedEvent = {
      eventName,
      params,
      timestamp: new Date().toISOString(),
    };

    // Limit queue size to 50 events
    if (queue.length >= 50) {
      queue.shift();
    }

    queue.push(event);
    localStorage.setItem(CONSENT_CONFIG.EVENT_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Ignore queue errors
  }
}

/**
 * Get queued events
 */
export function getEventQueue(): QueuedEvent[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(CONSENT_CONFIG.EVENT_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Process queued events after consent is granted
 */
export function processEventQueue(): void {
  if (!hasAnalyticsConsent()) return;

  const queue = getEventQueue();

  for (const event of queue) {
    sendEvent(event.eventName, event.params);
  }

  // Clear queue
  if (isBrowser()) {
    try {
      localStorage.removeItem(CONSENT_CONFIG.EVENT_QUEUE_KEY);
    } catch {
      // Ignore
    }
  }
}

// =============================================================================
// Page View Tracking
// =============================================================================

/**
 * Track page view
 */
export function trackPageView(path?: string, title?: string): void {
  sendEvent(EVENT_NAMES.PAGE_VIEW, {
    page_path: path || (isBrowser() ? window.location.pathname : undefined),
    page_title: title || (isBrowser() ? document.title : undefined),
    page_referrer: isBrowser() ? document.referrer : undefined,
  });
}

// =============================================================================
// User Interaction Tracking
// =============================================================================

/**
 * Track button click
 */
export function trackButtonClick(params: ButtonClickEvent): void {
  sendEvent(EVENT_NAMES.BUTTON_CLICK, { ...params });
}

/**
 * Track CTA click (higher priority than regular button)
 */
export function trackCTAClick(params: ButtonClickEvent): void {
  sendEvent(EVENT_NAMES.CTA_CLICK, { ...params });
}

/**
 * Track form submission
 */
export function trackFormSubmission(params: FormSubmissionEvent): void {
  sendEvent(EVENT_NAMES.FORM_SUBMIT, { ...params });
}

/**
 * Track navigation click
 */
export function trackNavigationClick(params: NavigationEvent): void {
  sendEvent(EVENT_NAMES.NAVIGATION_CLICK, { ...params });
}

/**
 * Track external link click
 */
export function trackExternalLinkClick(url: string, text: string): void {
  sendEvent(EVENT_NAMES.EXTERNAL_LINK, {
    link_url: url,
    link_text: text,
    outbound: true,
  });
}

/**
 * Check if a URL is external
 */
export function isExternalLink(url: string): boolean {
  if (!url || url.startsWith("/") || url.startsWith("#")) return false;

  try {
    const urlObj = new URL(url, isBrowser() ? window.location.origin : undefined);
    return !INTERNAL_DOMAINS.some(
      (domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

// =============================================================================
// File Download Tracking
// =============================================================================

/**
 * Track file download
 */
export function trackFileDownload(params: FileDownloadEvent): void {
  sendEvent(EVENT_NAMES.FILE_DOWNLOAD, { ...params });
}

/**
 * Check if URL is a downloadable file
 */
export function isDownloadableFile(url: string): boolean {
  try {
    const pathname = new URL(url, isBrowser() ? window.location.origin : undefined).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase();
    return extension
      ? TRACKED_FILE_EXTENSIONS.includes(extension as (typeof TRACKED_FILE_EXTENSIONS)[number])
      : false;
  } catch {
    return false;
  }
}

// =============================================================================
// Scroll Depth Tracking
// =============================================================================

/**
 * Track scroll depth
 */
export function trackScrollDepth(params: ScrollEvent): void {
  sendEvent(EVENT_NAMES.SCROLL_DEPTH, { ...params });
}

// =============================================================================
// Error Page Tracking
// =============================================================================

/**
 * Track error page view
 */
export function trackErrorPage(params: ErrorPageEvent): void {
  sendEvent(EVENT_NAMES.ERROR_PAGE, { ...params });
}

// =============================================================================
// Newsletter Tracking
// =============================================================================

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email?: string): void {
  sendEvent(EVENT_NAMES.NEWSLETTER_SIGNUP, {
    method: "email",
    // Don't send actual email for privacy
    has_email: !!email,
  });
}

// =============================================================================
// Time on Page Tracking
// =============================================================================

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number, engagedSeconds?: number): void {
  sendEvent(EVENT_NAMES.TIME_ON_PAGE, {
    time_seconds: seconds,
    engaged_time_seconds: engagedSeconds,
  });
}

// =============================================================================
// E-commerce Tracking (Donation Flow)
// =============================================================================

/**
 * Create donation item for e-commerce tracking
 */
export function createDonationItem(
  amount: number,
  variant: "one-time" | "monthly" | "yearly" = "one-time",
): EcommerceItem {
  return {
    item_id: `donation_${variant}`,
    item_name: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Donation`,
    item_category: "donation",
    item_variant: variant,
    price: amount,
    currency: "INR",
    quantity: 1,
  };
}

/**
 * Track donation page view (view_item)
 */
export function trackDonationView(params?: Partial<ViewItemEvent>): void {
  sendEvent(EVENT_NAMES.VIEW_ITEM, {
    items: params?.items || [],
    currency: "INR",
    ...params,
  });
}

/**
 * Track donation amount selection (add_to_cart)
 */
export function trackDonationSelect(
  amount: number,
  variant: "one-time" | "monthly" | "yearly" = "one-time",
): void {
  const item = createDonationItem(amount, variant);
  const params: AddToCartEvent = {
    items: [item],
    value: amount,
    currency: "INR",
  };
  sendEvent(EVENT_NAMES.ADD_TO_CART, { ...params, items: params.items });
}

/**
 * Track donation checkout start (begin_checkout)
 */
export function trackDonationCheckout(
  amount: number,
  variant: "one-time" | "monthly" | "yearly" = "one-time",
): void {
  const item = createDonationItem(amount, variant);
  const params: BeginCheckoutEvent = {
    items: [item],
    value: amount,
    currency: "INR",
  };
  sendEvent(EVENT_NAMES.BEGIN_CHECKOUT, { ...params, items: params.items });
}

/**
 * Track donation completion (purchase)
 */
export function trackDonationComplete(
  transactionId: string,
  amount: number,
  variant: "one-time" | "monthly" | "yearly" = "one-time",
): void {
  const item = createDonationItem(amount, variant);
  const params: PurchaseEvent = {
    transaction_id: transactionId,
    items: [item],
    value: amount,
    currency: "INR",
  };
  sendEvent(EVENT_NAMES.PURCHASE, { ...params, items: params.items });
}

// =============================================================================
// Consent Event Tracking
// =============================================================================

/**
 * Track consent update
 */
export function trackConsentUpdate(
  action: "accept_all" | "reject_all" | "custom",
  categories: { analytics: boolean; performance: boolean; marketing: boolean },
): void {
  sendEvent(EVENT_NAMES.CONSENT_UPDATE, {
    consent_action: action,
    consent_analytics: categories.analytics,
    consent_performance: categories.performance,
    consent_marketing: categories.marketing,
  });
}
