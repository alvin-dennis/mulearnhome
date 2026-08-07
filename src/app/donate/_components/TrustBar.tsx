"use client";

import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import type { Counts } from "@/lib/types";

export default function TrustBar() {
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
  const campusCount =
    counts?.org_type_counts?.find((o) => o.org_type === "College")?.org_count ?? 500;

  return (
    <section className="w-full border-t border-mulearn-gray-600/10 bg-mulearn-whitish px-4 py-12 sm:px-6 md:px-12 lg:px-24 xl:px-40">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-md items-start gap-3 text-center lg:text-left">
          <Heart className="mt-1 hidden size-6 shrink-0 text-mulearn lg:block" />
          <div>
            <h4 className="font-bold text-mulearn-blackish">
              Transparent. Accountable. Community first.
            </h4>
            <p className="mt-1 text-sm text-mulearn-gray-600">
              We share our updates, finances, and impact reports openly with our community. Because
              trust builds everything we do.
            </p>
            <Link
              href="/report"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-mulearn hover:underline"
            >
              View our transparency reports
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-mulearn sm:text-3xl">
              <CountUp end={learnersCount} duration={2.5} separator="," />+
            </p>
            <p className="text-sm text-mulearn-gray-600">Learners empowered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-mulearn sm:text-3xl">
              <CountUp end={campusCount} duration={2.5} separator="," />+
            </p>
            <p className="text-sm text-mulearn-gray-600">Campus communities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-mulearn sm:text-3xl">All</p>
            <p className="text-sm text-mulearn-gray-600">For everyone, always</p>
          </div>
        </div>
      </div>
    </section>
  );
}
