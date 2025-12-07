"use client";

import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, GraduationCap, Handshake, School, TrendingUp, Users } from "lucide-react";
import { MotionDiv, MotionH2 } from "@/components/MuFramer";
import { impactStatsFromCounts } from "@/data/impact-gallery";
import type { ImpactStat, Counts } from "@/lib/types";

const iconMap = {
  Users,
  School,
  Calendar,
  Handshake,
  GraduationCap,
  TrendingUp,
};

export default function ImpactStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counts, setCounts] = useState<Counts | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      try {
        const socket = new WebSocket("wss://mulearn.org/ws/v1/public/landing-stats/");
        socketRef.current = socket;
        const handleMessage = (event: MessageEvent) => {
          try {
            setCounts(JSON.parse(event.data) as Counts);
          } catch (e) {
            void e;
          }
        };
        const handleError = (event: Event) => void event;
        socket.addEventListener("message", handleMessage);
        socket.addEventListener("error", handleError);
        return () => {
          socket.removeEventListener("message", handleMessage);
          socket.removeEventListener("error", handleError);
          socket.close();
          socketRef.current = null;
        };
      } catch (e) {
        void e;
      }
    }
  }, []);

  return (
    <section ref={ref} className="py-16 bg-mulearn-whitish">
      <div className="container mx-auto px-4">
        <MotionH2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="text-4xl font-bold text-center text-mulearn mb-12 "
        >
          Our Impact in Numbers
        </MotionH2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {counts && impactStatsFromCounts(counts).map((stat: ImpactStat, index: number) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];

            return (
              <MotionDiv
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <MotionDiv
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-4xl mb-4 inline-block text-mulearn"
                >
                  <IconComponent size={40} />
                </MotionDiv>
                <MotionDiv
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="text-3xl font-bold mb-2 text-mulearn"
                >
                  {stat.number}
                </MotionDiv>
                <div className="text-mulearn-gray-600 font-semibold ">{stat.label}</div>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
}
