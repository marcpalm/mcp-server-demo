import { Octokit } from "octokit";
import type { RepoParams } from "./issues.js";

export async function getPullRequest(
  octokit: Octokit,
  repo: RepoParams,
  pullNumber: number
) {
  try {
    const { data } = await octokit.rest.pulls.get({
      ...repo,
      pull_number: pullNumber,
    });
    return data;
  } catch (error) {
    console.error("Error getting pull request:", { repo, pullNumber, error });
    throw error;
  }
}

export async function createPullRequestComment(
  octokit: Octokit,
  repo: RepoParams,
  pullNumber: number,
  body: string
) {
  try {
    const { data } = await octokit.rest.issues.createComment({
      ...repo,
      issue_number: pullNumber,
      body,
    });
    return data;
  } catch (error) {
    console.error("Error creating pull request comment:", {
      repo,
      pullNumber,
      error,
    });
    throw error;
  }
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
  try {
    const { data } = await octokit.rest.pulls.update({
      ...repo,
      pull_number: pullNumber,
      ...update,
    });
    return data;
  } catch (error) {
    console.error("Error updating pull request:", {
      repo,
      pullNumber,
      update,
      error,
    });
    throw error;
  }
}

export async function listPullRequests(octokit: Octokit, repo: RepoParams) {
  try {
    console.log("Listing pull requests for:", repo);
    const { data } = await octokit.rest.pulls.list({
      ...repo,
      state: "all",
    });
    return data;
  } catch (error) {
    console.error("Error listing pull requests:", { repo, error });
    throw error;
  }
}
