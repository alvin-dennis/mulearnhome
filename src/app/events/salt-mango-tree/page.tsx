import { Suspense } from "react";

import { getSaltMangoTree } from "@/lib/tina";
import SaltMangoTreeClient from "./_components/SaltMangoTreeClient";

export const dynamic = "force-dynamic";

export default async function SaltMangoTreePage() {
  // Fetch Salt Mango Tree data from TinaCMS
  const saltMangoTreeData = await getSaltMangoTree();

  // Extract episodes from the first (and only) document
  const episodes = saltMangoTreeData[0]?.episodes || [];

  // Filter out null episodes and pass to client
  const validEpisodes = episodes.filter((e): e is NonNullable<typeof e> => e !== null);

  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <SaltMangoTreeClient episodes={validEpisodes} />
    </Suspense>
  );
}
