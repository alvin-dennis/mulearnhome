import { Suspense } from "react";

import { getInspirationStation } from "@/lib/tina";
import InspirationStationClient from "./_components/InspirationStationClient";

export const dynamic = "force-dynamic";

export default async function InspirationStationPage() {
  // Fetch Inspiration Station data from TinaCMS
  const inspirationStationData = await getInspirationStation();

  // Extract episodes from the first (and only) document
  const episodes = inspirationStationData[0]?.episodes || [];

  // Filter out null episodes and pass to client
  const validEpisodes = episodes.filter((e): e is NonNullable<typeof e> => e !== null);

  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <InspirationStationClient episodes={validEpisodes} />
    </Suspense>
  );
}
