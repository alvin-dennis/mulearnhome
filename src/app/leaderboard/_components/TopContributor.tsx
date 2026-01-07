import type { Variants } from "framer-motion";
import { Crown, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";
import { Separator } from "@/components/ui/separator";
import type { TopContributorProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const RankIcon = ({ rank }: { rank: 1 | 2 | 3 }) => {
  if (rank === 1) {
    return <Crown className="w-7 h-7 text-mulearn-whitish" strokeWidth={2} />;
  }

  return (
    <Medal
      className={cn("w-5 h-5", (rank === 2 || rank === 3) && "text-mulearn-whitish")}
      strokeWidth={2}
    />
  );
};

export function TopContributor({ score, rank }: TopContributorProps) {
  return (
    <MotionDiv
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative flex flex-col items-center w-full p-6 rounded-2xl border transition-all duration-300",
        "bg-mulearn",
        "hover:scale-[1.02] hover:shadow-md",
        rank === 1 && "md:scale-105 md:hover:scale-[1.07]",
      )}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-7 h-7 rounded-full border border-mulearn-blackish bg-mulearn-whitish text-mulearn-trusty-blue text-xs font-bold">
        {rank}
      </div>

      <div className="mb-4 mt-2">
        <RankIcon rank={rank} />
      </div>

      <Link
        href={`https://github.com/${score.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 font-semibold transition-colors mb-5"
      >
        <span
          className={cn(
            rank === 1 ? "text-lg text-mulearn-whitish" : "text-base text-mulearn-whitish",
          )}
        >
          {score.displayname || score.username}
        </span>

        <ExternalLink className="w-3.5 h-3.5 text-mulearn-trusty-blue opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <Separator orientation="horizontal" className="text-mulearn-whitish" />

      <div className="flex items-center gap-6 pt-4 w-full justify-center">
        <div className="text-center">
          <div className="font-bold text-mulearn-whitish text-lg">
            {score.commits.toLocaleString()}
          </div>
          <div className="text-[11px] uppercase tracking-wide text-mulearn-whitish font-medium">
            Commits
          </div>
        </div>

        <Separator orientation="vertical" className="h-15 text-mulearn-whitish" />

        <div className="text-center">
          <div className="font-bold text-mulearn-whitish text-lg">{score.prs_merged}</div>
          <div className="text-[11px] uppercase tracking-wide text-mulearn-whitish font-medium">
            PRs Merged
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}
