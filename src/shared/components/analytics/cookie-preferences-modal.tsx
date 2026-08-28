"use client";

/**
 * Cookie Preferences Modal
 *
 * Granular control over cookie consent categories.
 * Premium minimal design with accessibility.
 */

import { AnimatePresence } from "framer-motion";
import { BarChart3, Cookie, Megaphone, Settings, Shield, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { MotionDiv } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import type { ConsentCategories } from "@/lib/analytics/types";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCategories: Omit<ConsentCategories, "essential"> | null;
  onUpdateCategory: (category: keyof Omit<ConsentCategories, "essential">, value: boolean) => void;
  onSave: () => void;
  onRejectAll: () => void;
  onAcceptAll: () => void;
}

interface CategoryConfig {
  key: keyof Omit<ConsentCategories, "essential">;
  title: string;
  description: string;
  icon: React.ElementType;
  isEssential?: boolean;
}

const categories: (
  | CategoryConfig
  | {
      key: "essential";
      title: string;
      description: string;
      icon: React.ElementType;
      isEssential: true;
    }
)[] = [
  {
    key: "essential" as const,
    title: "Essential",
    description: "Required for the website to function. Cannot be disabled.",
    icon: Shield,
    isEssential: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Help us understand how visitors use this website.",
    icon: BarChart3,
  },
  {
    key: "performance",
    title: "Performance",
    description: "Measure page load times to improve speed.",
    icon: Settings,
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Used to personalize content and ads.",
    icon: Megaphone,
  },
];

export function CookiePreferencesModal({
  isOpen,
  onClose,
  pendingCategories,
  onUpdateCategory,
  onSave,
  onRejectAll,
  onAcceptAll,
}: CookiePreferencesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
          {/* Backdrop */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <MotionDiv
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-title"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Cookie className="h-4 w-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                </div>
                <h2
                  id="preferences-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  Cookie Settings
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="max-h-[50vh] overflow-y-auto p-5">
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isEssential = category.key === "essential";
                  const isEnabled = isEssential
                    ? true
                    : (pendingCategories?.[
                        category.key as keyof Omit<ConsentCategories, "essential">
                      ] ?? false);

                  return (
                    <div
                      key={category.key}
                      className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-400 dark:text-gray-500">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* Toggle */}
                      <div className="shrink-0">
                        {isEssential ? (
                          <div className="flex h-6 w-10 items-center justify-end rounded-full bg-gray-900 px-1 dark:bg-white">
                            <div className="h-4 w-4 rounded-full bg-white dark:bg-gray-900" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isEnabled}
                            aria-label={`Toggle ${category.title}`}
                            onClick={() =>
                              onUpdateCategory(
                                category.key as keyof Omit<ConsentCategories, "essential">,
                                !isEnabled,
                              )
                            }
                            className={`relative flex h-6 w-10 items-center rounded-full px-1 transition-colors ${
                              isEnabled
                                ? "bg-gray-900 dark:bg-white"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform dark:bg-gray-900 ${
                                isEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRejectAll}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                  Reject all
                </button>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <button
                  type="button"
                  onClick={onAcceptAll}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                  Accept all
                </button>
              </div>
              <Button
                size="sm"
                onClick={onSave}
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Save
              </Button>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
}
