"use client";

import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { MotionDiv, MotionH1, MotionSection } from "@/components/MuFramer";
import type { Counts } from "@/lib/types";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function Stats() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = new WebSocket("wss://mulearn.org/ws/v1/public/landing-stats/");
      socketRef.current = socket;
      const handleMessage = (event: MessageEvent) => {
        setCounts(JSON.parse(event.data) as Counts);
      };
      const handleError = (event: Event) => {
        void event;
      };
      socket.addEventListener("message", handleMessage);
      socket.addEventListener("error", handleError);
      return () => {
        socket.removeEventListener("message", handleMessage);
        socket.removeEventListener("error", handleError);
        socket.close();
        socketRef.current = null;
      };
    }
  }, []);

  if (!counts) {
    return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 w-full py-24">
        <div className="text-center">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 w-full">
      <MotionSection
        className="flex flex-col justify-center py-24 items-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <MotionH1
          className="flex flex-1 flex-col sm:flex-row justify-center items-center gap-8 w-full text-4xl sm:text-5xl lg:text-[3.2rem] text-center font-extrabold leading-normal min-w-0 sm:min-w-[400px]"
          variants={fadeInUp}
        >
          The Impact of <span className="text-mulearn">μLearn</span>
        </MotionH1>

        <MotionDiv variants={fadeInUp} className="w-full">
          <div className="flex flex-wrap justify-center gap-4 mt-6 px-4 sm:px-8">
            <StatCard value={counts.members} label="Members" />
            {counts.org_type_counts.map((org) => (
              <StatCard
                key={org.org_type}
                value={org.org_count}
                label={
                  org.org_type.endsWith("y")
                    ? `${org.org_type.slice(0, -1)}ies`
                    : `${org.org_type}s`
                }
              />
            ))}
            <StatCard value={378} label="Events Hosted" />
            <StatCard value="100" label="Success Stories" isString />
          </div>
        </MotionDiv>
      </MotionSection>
    </div>
  );
}

function StatCard({
  value,
  label,
  isString = false,
}: {
  value: number | string;
  label: string;
  isString?: boolean;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <p className="font-semibold text-mulearn text-2xl sm:text-3xl lg:text-[2rem]">
        {isString ? (
          `${value}+`
        ) : (
          <CountUp end={value as number} duration={5} separator="," suffix="+" />
        )}
      </p>
      <p className="text-sm sm:text-base font-medium mt-1 text-mulearn-blackish">{label}</p>
    </div>
  );
}
