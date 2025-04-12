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
  try {
    const { data } = await octokit.rest.issues.get({
      ...repo,
      issue_number: issueNumber,
    });
    return data;
  } catch (error) {
    console.error("Error getting issue:", { repo, issueNumber, error });
    throw error;
  }
}

export async function createIssueComment(
  octokit: Octokit,
  repo: RepoParams,
  issueNumber: number,
  body: string
) {
  try {
    const { data } = await octokit.rest.issues.createComment({
      ...repo,
      issue_number: issueNumber,
      body,
    });
    return data;
  } catch (error) {
    console.error("Error creating issue comment:", {
      repo,
      issueNumber,
      error,
    });
    throw error;
  }
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
  try {
    const { data } = await octokit.rest.issues.update({
      ...repo,
      issue_number: issueNumber,
      ...update,
    });
    return data;
  } catch (error) {
    console.error("Error updating issue:", {
      repo,
      issueNumber,
      update,
      error,
    });
    throw error;
  }
}

export async function listIssues(octokit: Octokit, repo: RepoParams) {
  try {
    const { data } = await octokit.rest.issues.listForRepo({
      ...repo,
      state: "all",
    });
    return data;
  } catch (error) {
    console.error("Error listing issues:", { repo, error });
    throw error;
  }
}
