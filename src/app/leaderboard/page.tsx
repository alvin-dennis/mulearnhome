import { use, Activity } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Score, LeaderboardData, LeaderboardProps } from "@/lib/types";
import Link from "next/link";

async function getLeaderboard(): Promise<LeaderboardProps> {
  "use cache";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { data } = await axios.get<LeaderboardData>(
    `${baseUrl}/api/leaderboard`,
  );

  return { props: data, revalidate: 86400 };
}

export default function LeaderBoard() {
  const leaderboardWrapper = use(getLeaderboard());
  const leaderboard = leaderboardWrapper.props;
  const { date } = leaderboard;

  const renderTable = (title: string, scores: Score[]) => (
    <div className="m-3 p-5 bg-white rounded-2xl shadow-md w-full max-w-lg lg:max-w-xl overflow-x-auto">
      <h1 className="text-center text-2xl md:text-2xl font-bold mb-5">
        {title}
        {title === "Monthly Leaderboard" && ` — ${date}`}{" "}
      </h1>

      <Table className="min-w-[500px] w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-sm md:text-base">
              Rank
            </TableHead>
            <TableHead className="text-left text-sm md:text-base">
              Name
            </TableHead>
            <TableHead className="text-center text-sm md:text-base">
              Commits
            </TableHead>
            <TableHead className="text-center text-sm md:text-base">
              PRs{" "}
              <span className="text-xs font-normal opacity-70">
                (Open / Merged)
              </span>
            </TableHead>
            <TableHead className="text-center text-sm md:text-base">
              Issues{" "}
              <span className="text-xs font-normal opacity-70">
                (Open / Closed)
              </span>
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

      <Activity mode="visible">
        <div className="flex flex-col lg:flex-row justify-center items-start w-full gap-5 lg:gap-10">
          <div className="w-full lg:w-1/2 flex justify-center">
            {renderTable("Monthly Leaderboard", leaderboard.monthly)}
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            {renderTable("Overall Leaderboard", leaderboard.overall)}
          </div>
        </div>
      </Activity>
    </div>
  );
}
