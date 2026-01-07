#!/usr/bin/env bun

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Octokit } from "octokit";

interface ContributorStats {
  username: string;
  displayname?: string;
  commits: number;
  prs_opened: number;
  prs_merged: number;
  issues_opened: number;
  issues_closed: number;
}

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) throw new Error("GH_TOKEN is required to run");

const octokit = new Octokit({ auth: TOKEN });

function getMonth(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}`;
}

function emptyStats(username: string): ContributorStats {
  return {
    username,
    commits: 0,
    prs_opened: 0,
    prs_merged: 0,
    issues_opened: 0,
    issues_closed: 0,
  };
}

export async function getLeaderboard() {
  const now = new Date();
  const currentMonthStr = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  const date = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org: "gtech-mulearn",
    type: "all",
    per_page: 100,
  });

  const contributorsMap: Record<string, { overall: ContributorStats; monthly: ContributorStats }> =
    {};

  for (const repo of repos) {
    const contributors = await octokit.paginate(octokit.rest.repos.listContributors, {
      owner: "gtech-mulearn",
      repo: repo.name,
      per_page: 100,
    });

    for (const c of contributors) {
      const login = c.login;
      if (!login) continue;
      if (!contributorsMap[login]) {
        contributorsMap[login] = {
          overall: emptyStats(login),
          monthly: emptyStats(login),
        };
      }
      contributorsMap[login].overall.commits += c.contributions;
    }

    const monthlyCommits = await octokit.paginate(octokit.rest.repos.listCommits, {
      owner: "gtech-mulearn",
      repo: repo.name,
      since: `${currentMonthStr}-01T00:00:00Z`,
      per_page: 100,
    });

    for (const commit of monthlyCommits) {
      const login = commit.author?.login;
      if (!login) continue;

      if (!contributorsMap[login]) {
        contributorsMap[login] = {
          overall: emptyStats(login),
          monthly: emptyStats(login),
        };
      }

      contributorsMap[login].monthly.commits += 1;
    }

    const prs = await octokit.paginate(octokit.rest.pulls.list, {
      owner: "gtech-mulearn",
      repo: repo.name,
      state: "all",
      per_page: 100,
    });

    for (const pr of prs) {
      const login = pr.user?.login;
      if (!login) continue;
      if (!contributorsMap[login]) {
        contributorsMap[login] = {
          overall: emptyStats(login),
          monthly: emptyStats(login),
        };
      }
      contributorsMap[login].overall.prs_opened += 1;
      if (pr.merged_at) contributorsMap[login].overall.prs_merged += 1;

      if (getMonth(pr.created_at) === currentMonthStr) {
        contributorsMap[login].monthly.prs_opened += 1;
        if (pr.merged_at) contributorsMap[login].monthly.prs_merged += 1;
      }
    }

    const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner: "gtech-mulearn",
      repo: repo.name,
      state: "all",
      per_page: 100,
    });

    for (const issue of issues) {
      if (issue.pull_request) continue;

      const login = issue.user?.login;
      if (!login) continue;

      if (!contributorsMap[login]) {
        contributorsMap[login] = {
          overall: emptyStats(login),
          monthly: emptyStats(login),
        };
      }

      contributorsMap[login].overall.issues_opened += 1;
      if (issue.state === "closed") {
        contributorsMap[login].overall.issues_closed += 1;
      }

      if (getMonth(issue.created_at) === currentMonthStr) {
        contributorsMap[login].monthly.issues_opened += 1;
        if (issue.state === "closed") {
          contributorsMap[login].monthly.issues_closed += 1;
        }
      }
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  const score = (s: ContributorStats) =>
    s.commits + s.prs_opened + s.prs_merged + s.issues_opened + s.issues_closed;

  const top10Overall = Object.values(contributorsMap)
    .sort((a, b) => score(b.overall) - score(a.overall))
    .slice(0, 10)
    .map((c) => c.overall);

  const top10Monthly = Object.values(contributorsMap)
    .sort((a, b) => score(b.monthly) - score(a.monthly))
    .slice(0, 10)
    .map((c) => c.monthly);

  async function addDisplayNames(list: ContributorStats[]) {
    return Promise.all(
      list.map(async (c) => {
        try {
          const { data } = await octokit.rest.users.getByUsername({
            username: c.username,
          });
          c.displayname = data.name || c.username;
        } catch {
          c.displayname = c.username;
        }
        return c;
      }),
    );
  }

  return {
    month: currentMonthStr,
    date,
    overall: await addDisplayNames(top10Overall),
    monthly: await addDisplayNames(top10Monthly),
  };
}

(async () => {
  try {
    const data = await getLeaderboard();
    const outputPath = path.join(process.cwd(), "src", "data", "leaderboard.json");

    console.log(existsSync(outputPath) ? `✏️ Updating ${outputPath}` : `📁 Creating ${outputPath}`);

    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log("✅ Leaderboard generated successfully");
  } catch (err) {
    console.error("❌ Failed to generate leaderboard:", err);
    process.exit(1);
  }
})();
