import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { MotionTR } from "@/components/MuFramer";
import { TableCell } from "@/components/ui/table";
import type { LeaderboardRowProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-mulearn-blackish">
      {rank}
    </span>
  );
}

export function LeaderboardRow({ score, rank }: LeaderboardRowProps) {
  return (
    <MotionTR
      variants={rowVariants}
      className={cn(
        "group border-b border-border/30 transition-all duration-200",
        "hover:bg-muted/50",
      )}
    >
      <TableCell className="py-5 w-16">
        <div className="flex items-center justify-center">
          <RankBadge rank={rank} />
        </div>
      </TableCell>

      <TableCell className="py-5">
        <Link
          href={`https://github.com/${score.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 group/link"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-mulearn-blackish group-hover/link:text-primary hover:underline hover:decoration-mulearn-trusty-blue transition-colors">
                {score.displayname || score.username}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-mulearn-trusty-blue opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
            </div>
          </div>
        </Link>
      </TableCell>

      <TableCell className="py-5 text-center">
        <span className="font-medium text-mulearn-blackish">{score.commits.toLocaleString()}</span>
      </TableCell>

      <TableCell className="py-5 text-center">
        <div className="inline-flex items-center gap-1 tabular-nums text-sm">
          <span className="text-mulearn-blackish/70">{score.prs_opened}</span>
          <span className="text-mulearn-blackish/30">/</span>
          <span className="font-semibold text-mulearn-blackish">{score.prs_merged}</span>
        </div>
      </TableCell>

      <TableCell className="py-5 text-center">
        <div className="inline-flex items-center gap-1 tabular-nums text-sm">
          <span className="text-mulearn-blackish70">{score.issues_opened}</span>
          <span className="text-mulearn-blackish/30">/</span>
          <span className="font-semibold text-mulearn-blackish">{score.issues_closed}</span>
        </div>
      </TableCell>
    </MotionTR>
  );
}
