"use client";

import CountUp from "react-countup";
import { StatsLoader, useLandingStats } from "@/shared";

export function CareersStats() {
  const { counts, hasError } = useLandingStats();

  if (hasError) {
    return null;
  }

  if (!counts) {
    return <StatsLoader count={3} className="grid-cols-3 justify-start" />;
  }

  const companyCount =
    counts.org_type_counts?.find((o) => o.org_type === "Company")?.org_count ?? 0;
  const hiredCandidates = 1222; // Hardcoded count of hired candidates
  const hiringCalls = 233; // Hardcoded count of hiring calls

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap justify-center lg:justify-start gap-6">
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={hiredCandidates} duration={2.5} separator="," autoAnimate autoAnimateOnce />
          +
        </span>
        <span className="text-base">Hired Candidates</span>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={companyCount} duration={2.5} separator="," autoAnimate autoAnimateOnce />+
        </span>
        <span className="text-base">Companies</span>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={hiringCalls} duration={2.5} separator="," autoAnimate autoAnimateOnce />+
        </span>
        <span className="text-base">Hiring Calls</span>
      </div>
    </div>
  );
}
