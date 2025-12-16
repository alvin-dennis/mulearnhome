"use client";

/**
 * Cookie Settings Link
 *
 * Client component for the footer that opens the cookie preferences modal.
 */

import { useConsentManager } from "@/hooks/useConsentManager";
import CookiePreferencesModal from "./CookiePreferencesModal";

interface CookieSettingsLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function CookieSettingsLink({ className, children }: CookieSettingsLinkProps) {
  const {
    openPreferences,
    closePreferences,
    isPreferencesOpen,
    pendingCategories,
    updatePendingCategory,
    savePreferences,
    rejectAll,
    acceptAll,
  } = useConsentManager();

  return (
    <>
      <button type="button" onClick={openPreferences} className={className}>
        {children}
      </button>

      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={closePreferences}
        pendingCategories={pendingCategories}
        onUpdateCategory={updatePendingCategory}
        onSave={savePreferences}
        onRejectAll={rejectAll}
        onAcceptAll={acceptAll}
      />
    </>
  );
}
