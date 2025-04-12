import { Octokit } from "octokit";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required");
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

interface RepoParams {
  owner: string;
  repo: string;
}

export async function getIssue(repo: RepoParams, issueNumber: number) {
  const { data } = await octokit.rest.issues.get({
    ...repo,
    issue_number: issueNumber,
  });
  return data;
}

export async function getPullRequest(repo: RepoParams, pullNumber: number) {
  const { data } = await octokit.rest.pulls.get({
    ...repo,
    pull_number: pullNumber,
  });
  return data;
}

export async function createIssueComment(
  repo: RepoParams,
  issueNumber: number,
  body: string
) {
  const { data } = await octokit.rest.issues.createComment({
    ...repo,
    issue_number: issueNumber,
    body,
  });
  return data;
}

export async function createPullRequestComment(
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

export async function updateIssue(
  repo: RepoParams,
  issueNumber: number,
  update: {
    title?: string;
    body?: string;
    state?: "open" | "closed";
    labels?: string[];
  }
) {
  const { data } = await octokit.rest.issues.update({
    ...repo,
    issue_number: issueNumber,
    ...update,
  });
  return data;
}

export async function updatePullRequest(
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

export async function listIssues(repo: RepoParams) {
  const { data } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "all",
  });
  return data;
}

export async function listPullRequests(repo: RepoParams) {
  const { data } = await octokit.rest.pulls.list({
    ...repo,
    state: "all",
  });
  return data;
}
