import { use } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeaderboard } from "@/services/leaderboard";
import { Score} from "@/lib/types";
import Link from "next/link";

export default function LeaderBoard() {
  const leaderboard = use(getLeaderboard());
  const { date } = leaderboard;
  const monthlyLeaderboard: Score[] = leaderboard.monthly.map((c) => ({
    ...c,
    displayname: c.displayname || c.username,
  }));

  const overallLeaderboard: Score[] = leaderboard.overall.map((c) => ({
    ...c,
    displayname: c.displayname || c.username,
  }));


  const renderTable = (title: string, scores: Score[]) => (
    <div className="m-3 p-5 rounded-2xl shadow-md w-full max-w-5xl overflow-x-auto">
      <h1 className="text-center text-2xl md:text-2xl font-bold mb-5">
        {title}
        {title === "Monthly Leaderboard" && ` — ${date}`}
      </h1>

      <Table className="min-w-[900px] w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-sm md:text-base text-mulearn-blackish">
              Rank
            </TableHead>

            <TableHead className="text-left text-sm md:text-base text-mulearn-blackish">
              Name
            </TableHead>

            <TableHead className="text-center text-sm md:text-base text-mulearn-blackish">
              Commits
            </TableHead>

            <TableHead className="text-center text-sm md:text-base text-mulearn-blackish">
              PRs
              <div className="text-xs font-normal text-mulearn-gray-600">
                (Open / Merged)
              </div>
            </TableHead>

            <TableHead className="text-center text-sm md:text-base text-mulearn-blackish">
              Issues
              <div className="text-xs font-normal text-mulearn-gray-600">
                (Open / Closed)
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {scores.map((score, index) => (
            <TableRow
              key={score.username}
              className={
                index < 3
                  ? "bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple text-white font-bold"
                  : ""
              }
            >
              <TableCell className="text-center text-sm md:text-base">
                {index + 1}
              </TableCell>

              <TableCell className="text-left text-sm md:text-base">
                <Link
                  href={`https://github.com/${score.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {score.displayname}
                </Link>
              </TableCell>

              <TableCell className="text-center text-sm md:text-base">
                {score.commits}
              </TableCell>

              <TableCell className="text-center text-sm md:text-base">
                {score.prs_opened}/{score.prs_merged}
              </TableCell>

              <TableCell className="text-center text-sm md:text-base">
                {score.issues_opened}/{score.issues_closed}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col w-full px-3 md:px-5 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        μLearn Contribution Leaderboard
      </h2>

      <div className="flex flex-col lg:flex-row justify-center items-start w-full gap-5 lg:gap-10">
        <div className="w-full lg:w-1/2 flex justify-center">
          {renderTable("Monthly Leaderboard", monthlyLeaderboard)}
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          {renderTable("Overall Leaderboard", overallLeaderboard)}
        </div>
      </div>
    </div>
  );
}
