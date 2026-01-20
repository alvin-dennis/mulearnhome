import { MotionTBody } from "@/components/MuFramer";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeaderboardTableProps } from "@/lib/types";
import { LeaderboardRow } from "./LeaderboardRow";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export function LeaderboardTable({ scores, showTopThree = true }: LeaderboardTableProps) {
  const displayScores = showTopThree ? scores.slice(3) : scores;
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-mulearn text-center">
        <h3 className="text-3xl font-semibold text-mulearn-whitish">All Contributors</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead className="w-16 text-center text-[11px] font-semibold uppercase tracking-wider text-mulearn-blackish">
                Rank
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-mulearn-blackish">
                Contributor
              </TableHead>
              <TableHead className="text-center text-[11px] font-semibold uppercase tracking-wider text-mulearn-blackish">
                Commits
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-mulearn-blackish">
                    PRs
                  </span>
                  <span className="text-[9px] font-normal normal-case text-mulearn-blackish/60">
                    open / merged
                  </span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-mulearn-blackish">
                    Issues
                  </span>
                  <span className="text-[9px] font-normal normal-case text-mulearn-blackish/60">
                    open / closed
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <MotionTBody
            key={`scores-${scores.length}-${displayScores.length}-${scores[0]?.username ?? ""}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayScores.length === 0 ? (
              <TableRow>
                <TableCell className="py-6 text-center" colSpan={5}>
                  <div className="text-mulearn-blackish">No contributors to display</div>
                </TableCell>
              </TableRow>
            ) : (
              displayScores.map((score, index) => (
                <LeaderboardRow
                  key={score.username}
                  score={score}
                  rank={showTopThree ? index + 4 : index + 1}
                />
              ))
            )}
          </MotionTBody>
        </Table>
      </div>
    </div>
  );
}
