import type { Variants } from "framer-motion";
import { Award, Crown, ExternalLink, Medal } from "lucide-react";
import Link from "next/link";
import { MotionDiv } from "@/components/MuFramer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TopContributorProps } from "@/lib/types";
import { cn } from "@/lib/utils";

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

const rankConfig = {
  1: {
    icon: Crown,
    label: "1st",
    gradient: "from-amber-400 via-yellow-300 to-orange-400",
    cardGradient: "from-amber-50 via-yellow-50/50 to-orange-50/30",
    borderGradient: "from-amber-300 via-yellow-200 to-orange-300",
    avatarRing: "ring-amber-400/50",
    separator: "bg-amber-300/60",
  },
  2: {
    icon: Medal,
    label: "2nd",
    gradient: "from-slate-400 via-gray-300 to-slate-400",
    cardGradient: "from-slate-50 via-gray-50/50 to-slate-50/30",
    borderGradient: "from-slate-300 via-gray-200 to-slate-300",
    avatarRing: "ring-slate-400/50",
    separator: "bg-slate-300/60",
  },
  3: {
    icon: Award,
    label: "3rd",
    gradient: "from-orange-700 via-amber-600 to-orange-600",
    cardGradient: "from-orange-50/60 via-amber-50/40 to-orange-100/40",
    borderGradient: "from-orange-600 via-amber-500 to-orange-500",
    avatarRing: "ring-orange-600/50",
    separator: "bg-orange-400/60",
  },
};

export function TopContributor({ score, rank }: TopContributorProps) {
  const config = rankConfig[rank];
  return (
    <MotionDiv variants={fadeInUp} initial="hidden" animate="visible" className="relative">
      <MotionDiv
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="absolute z-10 top-3 right-4 sm:-top-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto"
      >
        <span
          className={cn(
            "text-4xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
            config.gradient,
          )}
        >
          {config.label}
        </span>
      </MotionDiv>

      <div
        className={cn(
          "relative rounded-2xl p-6 pt-8 backdrop-blur-sm",
          "bg-gradient-to-br",
          config.cardGradient,
          "border border-mulearn-whitish/50",
          "shadow-md shadow-mulearn-blackish/5",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl p-px -z-10",
            "bg-gradient-to-br",
            config.borderGradient,
            "opacity-50",
          )}
        />

        <div className="relative flex justify-center mb-4">
          <Avatar
            className={cn(
              "ring-4 ring-offset-2 ring-offset-background",
              config.avatarRing,
              rank === 1 ? "w-24 h-24" : "w-20 h-20",
            )}
          >
            <AvatarImage
              src={`https://github.com/${score.username}.png`}
              alt={score.displayname}
              className="object-cover"
            />
            <AvatarFallback className="bg-mulearn text-mulearn-whitish font-bold text-xl">
              {score.displayname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-bold text-mulearn-blackish text-3xl">
            {score.displayname || score.username}
          </h3>
        </div>

        <Separator orientation="horizontal" className={cn("my-4 h-0.5", config.separator)} />

        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center mb-4">
          <div className="text-center">
            <div className="font-bold text-foreground tabular-nums">{score.points}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Points</div>
          </div>

          <Separator orientation="vertical" className={cn("h-10 w-0.5", config.separator)} />

          <div className="text-center">
            <div className="font-bold text-mulearn-blackish tabular-nums">{score.commits}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Commits
            </div>
          </div>

          <Separator orientation="vertical" className={cn("h-10 w-0.5", config.separator)} />

          <div className="text-center">
            <div className="font-bold text-foreground tabular-nums">{score.prs_merged}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">PRs</div>
          </div>
        </div>

        <Separator orientation="horizontal" className={cn("my-4 h-0.5", config.separator)} />

        <Link
          href={`https://github.com/${score.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="inverted" className="w-full gap-2">
            Github Profile
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </MotionDiv>
  );
}
