"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import type { Counts } from "@/lib/types";

export default function ContactStats() {
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

  const learnersCount = counts?.members ?? 60000;
  // Partners count is mapped to the number of companies from landing stats
  const partnersCount =
    counts?.org_type_counts?.find((o) => o.org_type === "Company")?.org_count ?? 400;

  return (
    <div className="grid grid-cols-3 gap-6 pt-6">
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-mulearn">
          <CountUp end={learnersCount} duration={2.5} separator="," />+
        </div>
        <div className="text-sm text-mulearn-gray-600">Learners</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-mulearn">
          <CountUp end={partnersCount} duration={2.5} separator="," />+
        </div>
        <div className="text-sm text-mulearn-gray-600">Partners</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-mulearn">48h</div>
        <div className="text-sm text-mulearn-gray-600">Response</div>
      </div>
    </div>
  );
}
