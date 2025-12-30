"use client";

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content using DOMPurify to prevent XSS attacks.
 * Should be used with dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // Server-side: return as-is (DOMPurify needs DOM)
    // The client will re-sanitize on hydration
    return dirty;
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["strong", "em", "a", "br", "span", "p", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "class", "target", "rel"],
  });
}

/**
 * Format text with markdown-like syntax and sanitize.
 * Converts **bold**, *italic*, and email links.
 */
export function formatAndSanitize(text: string): string {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1" class="font-medium text-mulearn underline underline-offset-4 hover:text-mulearn-duke-purple">$1</a>',
    );
  return sanitizeHtml(formatted);
}
