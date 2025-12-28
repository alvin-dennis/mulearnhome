"use client";

import axios from "axios";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/lib/env/env.client";
import type { Learner, TopLearner } from "@/lib/types";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function RankingSection() {
  const [topLearners, setTopLearners] = useState<TopLearner[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}/leaderboard/students/`);
      const learners: Learner[] = Array.isArray(res.data.response) ? res.data.response : [];

      const formatted: TopLearner[] = learners.slice(0, 10).map((item) => ({
        name: item.full_name,
        kp: item.total_karma,
      }));

      setTopLearners(formatted);
    } catch (err) {
      console.error("Error fetching learners:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topThree = topLearners.slice(0, 3);

  const getAvatarColor = (index: number) => {
    const colors = ["bg-mulearn-duke-purple", "bg-green-500", "bg-pink-500"];
    return colors[index] || "bg-mulearn-trusty-blue";
  };

  return (
    <>
      <div className="text-center md:mb-30 mb-40">
        <h1 className="text-5xl font-bold text-mulearn-blackish">
          Top <span className="text-mulearn">Learners</span>
        </h1>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex items-end justify-center gap-8 mb-12 h-64">
            {topThree[1] && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-mulearn-whitish font-bold text-xl ${getAvatarColor(1)}`}
                >
                  {topThree[1].name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-mulearn text-center">{topThree[1].name}</p>
                <div className="bg-mulearn rounded-lg px-4 py-2 text-mulearn-whitish font-bold text-sm">
                  {topThree[1].kp.toLocaleString()}
                </div>
                <div className="bg-mulearn w-24 h-32 rounded-t-lg" />
              </div>
            )}

            {topThree[0] && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-mulearn-whitish font-bold text-2xl ${getAvatarColor(0)}`}
                >
                  {topThree[0].name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-mulearn text-center">{topThree[0].name}</p>
                <div className="bg-mulearn rounded-lg px-4 py-2 text-mulearn-whitish font-bold text-sm">
                  {topThree[0].kp.toLocaleString()}
                </div>
                <div className="bg-mulearn w-24 h-48 rounded-t-lg" />
              </div>
            )}

            {topThree[2] && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-mulearn-whitish font-bold text-xl ${getAvatarColor(2)}`}
                >
                  {topThree[2].name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-mulearn text-center">{topThree[2].name}</p>
                <div className="bg-mulearn rounded-lg px-4 py-2 text-mulearn-whitish font-bold text-sm">
                  {topThree[2].kp.toLocaleString()}
                </div>
                <div className="bg-mulearn w-24 h-24 rounded-t-lg" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {topLearners.slice(3, 10).map((learner, index) => (
            <div
              key={index + 3}
              className="flex items-center justify-between p-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-base text-mulearn-blackish">#{index + 4}</span>
                <span className="font-medium text-mulearn-blackish">{learner.name}</span>
              </div>
              <span className="font-bold text-mulearn-blackish">
                {learner.kp.toLocaleString()} Karma
              </span>
            </div>
          ))}
        </div>
        <MotionDiv
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mt-6"
        >
          <Link href="https://app.mulearn.org/dashboard/leaderboard">
            <Button
              variant={"custom"}
              className="inline-flex items-center px-8 py-4 font-semibold text-lg"
            >
              View Full Leaderboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </>
  );
}
