"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import type { Counts } from "@/lib/types";

export default function CareersStats() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = new WebSocket("wss://mulearn.org/ws/v1/public/landing-stats/");
      socketRef.current = socket;
      const handleMessage = (event: MessageEvent) => {
        setCounts(JSON.parse(event.data) as Counts);
      };
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
        socket.close();
        socketRef.current = null;
      };
    }
  }, []);

  const companyCount =
    counts?.org_type_counts?.find((o) => o.org_type === "Company")?.org_count ?? 100;
  const hiredCandidates = 1222; // Hardcoded count of hired candidates
  const hiringCalls = 233; // Hardcoded count of hiring calls

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap justify-center lg:justify-start gap-6">
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={hiredCandidates} duration={2.5} separator="," />+
        </span>
        <span className="text-base">Hired Candidates</span>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={companyCount} duration={2.5} separator="," />+
        </span>
        <span className="text-base">Companies</span>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <span className="text-[1.6rem] md:text-[2rem] font-semibold text-mulearn">
          <CountUp end={hiringCalls} duration={2.5} separator="," />+
        </span>
        <span className="text-base">Hiring Calls</span>
      </div>
    </div>
  );
}
