import { Octokit } from "octokit";

export interface RepoParams {
  owner: string;
  repo: string;
}

export async function getIssue(
  octokit: Octokit,
  repo: RepoParams,
  issueNumber: number
) {
  const { data } = await octokit.rest.issues.get({
    ...repo,
    issue_number: issueNumber,
  });
  return data;
}

export async function createIssueComment(
  octokit: Octokit,
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

export async function updateIssue(
  octokit: Octokit,
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

export async function listIssues(octokit: Octokit, repo: RepoParams) {
  const { data } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: "all",
  });
  return data;
}
