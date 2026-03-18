"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { MotionDiv } from "@/components/MuFramer";
import type { Counts } from "@/lib/types";

const LearnersStatus = () => {
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
        console.error("WebSocket error:", event);
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

  // Format number to display with K+ suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const decimal = Math.floor((num % 1000) / 100);
      return decimal > 0 ? `${thousands}.${decimal}K+` : `${thousands}K+`;
    }
    return `${num}+`;
  };

  const stats = counts
    ? [
        {
          number: counts.members,
          displayNumber: formatNumber(counts.members),
          label: "Active Learners",
        },
        {
          number: counts.ig_count,
          displayNumber: `${counts.ig_count}+`,
          label: "Skill Tracks",
        },
        {
          number: 2500,
          displayNumber: "2.5K+",
          label: "Verified Projects",
        },
      ]
    : null;

  if (!stats) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-300 mb-16"></div>
          <div className="text-center text-gray-500">Loading statistics...</div>
          <div className="border-t border-gray-300 mt-16"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Top Border Line */}
        <div className="border-t border-gray-300 mb-16"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <MotionDiv
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-mulearn mb-4">
                <CountUp end={stat.number} duration={2.5} separator="," />
              </h3>

              <p className="text-lg md:text-xl font-medium text-black">{stat.label}</p>
            </MotionDiv>
          ))}
        </div>

        {/* Bottom Border Line */}
        <div className="border-t border-gray-300 mt-16"></div>
      </div>
    </section>
  );
};

export default LearnersStatus;
