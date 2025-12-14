import { Suspense } from "react";

import { getOfficeHours } from "@/lib/tina";
import OfficeHoursClient from "./_components/OfficeHoursClient";

export const dynamic = "force-dynamic";

export default async function OfficeHoursPage() {
  // Fetch office hours data from TinaCMS
  const officeHoursData = await getOfficeHours();

  // Extract sessions from the first (and only) office hours document
  const sessions = officeHoursData[0]?.sessions || [];

  // Filter out null sessions and pass to client
  const validSessions = sessions.filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <OfficeHoursClient sessions={validSessions} />
    </Suspense>
  );
}
