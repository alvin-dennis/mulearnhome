"use client";

import type { Variants } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { MotionDiv, MotionSection } from "@/components/MuFramer";
import MuLoader from "@/components/MuLoader";
import type { Counts } from "@/lib/types";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function MissionandGrowth() {
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
      <div className="px-14 sm:px-8 md:px-16 lg:px-32 xl:px-48 w-full py-24 ">
        <MuLoader />
      </div>
    );
  }

  return (
    <div className="flex justify-center relative">
      <div className="hidden md:block absolute top-6 right-10 z-10">
        <Sparkle className="w-6 h-6 text-mulearn" />
      </div>
      <div className="hidden md:block absolute bottom-6 left-8 z-10">
        <Sparkle className="w-6 h-6 text-mulearn" />
      </div>
      <div className="px-4 sm:px-8 md:px-16 lg:px-32  max-w-7xl">
        <MotionSection
          className="flex flex-col justify-center py-24 items-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <MotionDiv
            className="text-4xl md:text-5xl lg:text-6xl flex flex-col items-center text-center w-full"
            variants={fadeInUp}
          >
            <h1>
              Our <span className="text-mulearn">Mission</span> &
              <span className="text-mulearn">Growth</span>
            </h1>
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-9 mt-6 px-4 sm:px-8">
              <StatCard value={counts.members} label="Members" />
              <StatCard value={counts.learning_circle_count} label="Learning Circles" />
              {counts.org_type_counts
                .filter(
                  (org) =>
                    org.org_type.toLowerCase() === "college" ||
                    org.org_type.toLowerCase() === "community",
                )
                .map((org) => (
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
              {counts.enablers_mentors_count.map((role) => (
                <StatCard
                  key={role.role__title}
                  value={role.role_count}
                  label={`${role.role__title}s`}
                />
              ))}
            </div>
          </MotionDiv>
        </MotionSection>
      </div>
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
    <div className="bg-card rounded-2xl shadow-sm flex flex-col justify-center items-center p-4">
      <p className="font-semibold text-mulearn text-2xl sm:text-3xl lg:text-[2rem]">
        {isString ? value : <CountUp end={value as number} duration={5} separator="," />}
      </p>
      <p className="text-sm sm:text-base font-medium mt-1">{label}</p>
    </div>
  );
}
