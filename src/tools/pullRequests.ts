import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  octokit,
  getPullRequest,
  createPullRequestComment,
  updatePullRequest,
  listPullRequests,
} from "../github/index.js";

export function registerPullRequestTools(server: McpServer): void {
  // Get Pull Request
  server.tool(
    "getPullRequest",
    "Get a pull request by number",
    {
      owner: z.string(),
      repo: z.string(),
      pullNumber: z.number(),
    },
    async ({ owner, repo, pullNumber }) => {
      const pr = await getPullRequest(octokit, { owner, repo }, pullNumber);
      return {
        content: [{ type: "text", text: JSON.stringify(pr, null, 2) }],
      };
    }
  );

  // Create Pull Request Comment
  server.tool(
    "createPullRequestComment",
    "Create a comment on a pull request",
    {
      owner: z.string(),
      repo: z.string(),
      pullNumber: z.number(),
      body: z.string(),
    },
    async ({ owner, repo, pullNumber, body }) => {
      const comment = await createPullRequestComment(
        octokit,
        { owner, repo },
        pullNumber,
        body
      );
      return {
        content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
      };
    }
  );

  // Update Pull Request
  server.tool(
    "updatePullRequest",
    "Update a pull request",
    {
      owner: z.string(),
      repo: z.string(),
      pullNumber: z.number(),
      title: z.string().optional(),
      body: z.string().optional(),
      state: z.enum(["open", "closed"]).optional(),
    },
    async ({ owner, repo, pullNumber, ...update }) => {
      const pr = await updatePullRequest(
        octokit,
        { owner, repo },
        pullNumber,
        update
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pr, null, 2) }],
      };
    }
  );

  // List Pull Requests
  server.tool(
    "listPullRequests",
    "List pull requests for a repository",
    {
      owner: z.string(),
      repo: z.string(),
    },
    async ({ owner, repo }) => {
      const prs = await listPullRequests(octokit, { owner, repo });
      return {
        content: [{ type: "text", text: JSON.stringify(prs, null, 2) }],
      };
    }
  );
}
