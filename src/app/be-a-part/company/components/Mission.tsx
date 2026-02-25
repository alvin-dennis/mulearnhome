"use client";

import type { Variants } from "framer-motion";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MotionDiv, MotionSection } from "@/components/MuFramer";
import MuLoader from "@/components/MuLoader";
import { Card } from "@/components/ui/card";
import type { Counts } from "@/lib/types";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function Mission() {
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
    <div className="flex justify-center">
      <div className="px-4 sm:px-8 md:px-16 lg:px-32  max-w-7xl bg-mulearn-trusty-blue/10">
        <MotionSection
          className="flex flex-col justify-center py-24 items-center "
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <MotionDiv className="flex flex-col items-center text-center w-full" variants={fadeInUp}>
            <h1>
              Our <span className="text-mulearn">Mission</span> &
              <span className="text-mulearn">Growth</span>
            </h1>
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-9 mt-6 px-4 sm:px-8">
              <Card
                variant={"interactive"}
                className="h-full p-5 border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Total members</p>
                  <p className="font-bold text-mulearn-blackish">{counts.members}+</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Learning Circles</p>
                  <p className="font-bold text-mulearn-blackish">{counts.learning_circle_count}+</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Events</p>
                  <p className="font-bold text-mulearn-blackish">378+</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Total Karma Mined</p>
                  <p className="font-bold text-mulearn-blackish">
                    {counts.karma_pow_count.karma_count}
                  </p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Number of Proof of Works</p>
                  <p className="font-bold text-mulearn-blackish">
                    {counts.karma_pow_count.pow_count}
                  </p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Number of Internships</p>
                  <p className="font-bold text-mulearn-blackish">2770</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full p-5 border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Products</p>
                  <p className="font-bold text-mulearn-blackish">120</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-xs font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>

              <Card
                variant={"interactive"}
                className="h-full border-mulearn/10 transition-all duration-300  flex justify-center items-center flex-row gap-4 text-mulearn-blackish "
              >
                <div className="flex justify-center flex-col gap-3">
                  <p className="text-mulearn-gray-600">Learning Circles</p>
                  <p className="font-bold text-mulearn-blackish">{counts.learning_circle_count}</p>
                </div>

                <div className="bg-mulearn-trusty-blue text-mulearn-whitish rounded-full font-bold">
                  <User className="w-10 h-10" />
                </div>
              </Card>
            </div>
          </MotionDiv>
        </MotionSection>
      </div>
    </div>
  );
}
