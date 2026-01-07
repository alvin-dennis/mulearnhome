"use client";

import type { Variants } from "framer-motion";
import { ArrowRight, Calendar, Info, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LeaderboardTable } from "@/app/leaderboard/_components/LeaderboardTable";
import { TopContributor } from "@/app/leaderboard/_components/TopContributor";
import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import leaderboardData from "@/data/leaderboard.json";
import type { LeaderboardData, Score } from "@/lib/types";

const data = leaderboardData as LeaderboardData;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const mapScores = (scores: Score[]) =>
  scores.map((c) => ({
    ...c,
    displayname: c.displayname || c.username,
  }));

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"monthly" | "overall">("monthly");
  const currentScores = mapScores(activeTab === "monthly" ? data.monthly : data.overall);
  const topThree = currentScores.slice(0, 3);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mx-auto pt-12 sm:pt-20 pb-10 sm:pb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-mulearn-blackish mb-4">
            <span className="text-mulearn">μLearn</span> Contribution Leaderboard
          </h1>

          <p className="text-mulearn-blackish text-base sm:text-lg leading-relaxed">
            Recognizing developers who make our open-source community thrive.
          </p>
        </MotionDiv>

        <MotionDiv
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8"
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "monthly" | "overall")}>
            <TabsList className="bg-muted/60 p-1 h-11">
              <TabsTrigger
                value="monthly"
                className="h-9 px-4 gap-2 text-sm font-medium data-[state=active]:text-mulearn-trusty-blue data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                Monthly
              </TabsTrigger>

              <TabsTrigger
                value="overall"
                className="h-9 px-4 gap-2 text-sm font-medium data-[state=active]:text-mulearn-trusty-blue data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Trophy className="w-4 h-4" />
                All-Time
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 text-sm text-mulearn-blackish cursor-help">
            <Info className="w-4 h-4" />
            <span className="font-medium">
              {activeTab === "monthly" ? data.date : "All-time stats"}
            </span>
          </div>
        </MotionDiv>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-end pb-10"
        >
          <MotionDiv variants={fadeInUp} className="order-2 md:order-1">
            {topThree[1] && <TopContributor score={topThree[1]} rank={2} />}
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="order-1 md:order-2">
            {topThree[0] && <TopContributor score={topThree[0]} rank={1} />}
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="order-3">
            {topThree[2] && <TopContributor score={topThree[2]} rank={3} />}
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={fadeInUp} initial="hidden" animate="visible" className="pb-12">
          <LeaderboardTable scores={currentScores} showTopThree />
        </MotionDiv>

        <MotionDiv
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center pb-20"
        >
          <Link href="https://contributors.mulearn.org" target="_blank" rel="noopener noreferrer">
            <Button variant={"custom"} className="h-12 px-6 text-sm font-semibold group shadow-sm">
              View Full Leaderboard
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </MotionDiv>
      </main>
    </div>
  );
}
