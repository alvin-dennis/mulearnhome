"use client";

import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import MuImage from "@/components/MuImage";
import { clientEnv } from "@/lib/env/env.client";
import type { Learner, TopLearner } from "@/lib/types";

const Sparkles = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Sparkles icon</title>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

interface ExtendedTopLearner extends TopLearner {
  email?: string;
  avatar?: string;
}

interface LearnerResponse extends Learner {
  muid?: string;
  profile_pic?: string;
}

export default function RankingSection() {
  const [topLearners, setTopLearners] = useState<ExtendedTopLearner[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}/leaderboard/students/`);
      const learners: Learner[] = Array.isArray(res.data.response) ? res.data.response : [];

      const formatted: ExtendedTopLearner[] = learners.slice(0, 5).map((item) => ({
        name: item.full_name,
        kp: item.total_karma,
        email:
          (item as LearnerResponse).muid ||
          `${item.full_name.toLowerCase().replace(/\s+/g, "")}@mulearn`,
        avatar: (item as LearnerResponse).profile_pic || undefined,
      }));

      setTopLearners(formatted);
    } catch (err) {
      console.error("Error fetching learners:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="py-16 md:py-20 container mx-auto px-4 relative">
      {/* Decorative Sparkles */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* Left Side Sparkles */}
        <Sparkles className="absolute top-[15%] left-[18%] w-8 h-8 text-black fill-black" />
        <Sparkles className="absolute top-[35%] left-[8%] w-4 h-4 text-black fill-black" />

        {/* Right Side Sparkles */}
        <Sparkles className="absolute top-[28%] right-[15%] w-6 h-6 text-black fill-black" />
        <Sparkles className="absolute top-[32%] right-[13%] w-3 h-3 text-black fill-black" />

        {/* Bottom Sparkle */}
        <Sparkles className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-5 h-5 text-black fill-black" />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-black">
            Top Learners
          </h2>
          <p className="text-base md:text-lg text-gray-700">
            Recognizing consistent learners strengthens motivation for all.
          </p>
        </div>

        {/* Learners Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {topLearners.map((learner) => (
            <div
              key={learner.email}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-600 hover:shadow-lg transition-all duration-300"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-200">
                {learner.avatar ? (
                  <MuImage
                    src={learner.avatar}
                    alt={learner.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold">
                    {learner.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-base font-semibold text-gray-900 mb-1">{learner.name}</h3>

              {/* Email */}
              <p className="text-xs text-gray-500 mb-3">{learner.email}</p>

              {/* Karma Points Label */}
              <p className="text-xs text-gray-600 mb-1 font-medium">Karma Points</p>

              {/* Karma Points Value */}
              <p className="text-xl font-bold text-black">{learner.kp.toLocaleString()} KP</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
