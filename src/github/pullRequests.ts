import { Octokit } from "octokit";
import type { RepoParams } from "./issues.js";

export async function getPullRequest(
  octokit: Octokit,
  repo: RepoParams,
  pullNumber: number
) {
  const { data } = await octokit.rest.pulls.get({
    ...repo,
    pull_number: pullNumber,
  });
  return data;
}

export async function createPullRequestComment(
  octokit: Octokit,
  repo: RepoParams,
  pullNumber: number,
  body: string
) {
  const { data } = await octokit.rest.issues.createComment({
    ...repo,
    issue_number: pullNumber,
    body,
  });
  return data;
}

export async function updatePullRequest(
  octokit: Octokit,
  repo: RepoParams,
  pullNumber: number,
  update: {
    title?: string;
    body?: string;
    state?: "open" | "closed";
  }
) {
  const { data } = await octokit.rest.pulls.update({
    ...repo,
    pull_number: pullNumber,
    ...update,
  });
  return data;
}

export async function listPullRequests(octokit: Octokit, repo: RepoParams) {
  const { data } = await octokit.rest.pulls.list({
    ...repo,
    state: "all",
  });
  return data;
}
