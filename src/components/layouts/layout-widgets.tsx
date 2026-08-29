"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), { ssr: false });
const CookieConsent = dynamic(() => import("@/shared").then((m) => m.CookieConsent), {
  ssr: false,
});
const BackToTop = dynamic(() => import("@/components/layouts").then((m) => m.BackToTop), {
  ssr: false,
});
const DebugPanel =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/shared").then((m) => m.DebugPanel), { ssr: false })
    : null;

export function LayoutWidgets() {
  return (
    <>
      <Toaster richColors theme="light" position="bottom-right" />
      <div className="fixed bottom-4 right-4 z-50">
        <BackToTop />
      </div>
      <CookieConsent />
      {DebugPanel && <DebugPanel />}
    </>
  );
}
