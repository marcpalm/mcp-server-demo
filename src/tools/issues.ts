import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  octokit,
  getIssue,
  createIssueComment,
  updateIssue,
  listIssues,
} from "../github/index.js";

export function registerIssueTools(server: McpServer): void {
  // Get Issue
  server.tool(
    "getIssue",
    "Get an issue by number",
    {
      owner: z.string(),
      repo: z.string(),
      issueNumber: z.number(),
    },
    async ({ owner, repo, issueNumber }) => {
      try {
        console.log("Getting issue:", { owner, repo, issueNumber });
        const issue = await getIssue(octokit, { owner, repo }, issueNumber);
        return {
          content: [{ type: "text", text: JSON.stringify(issue, null, 2) }],
        };
      } catch (error) {
        console.error("Error in getIssue tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );

  // Create Issue Comment
  server.tool(
    "createIssueComment",
    "Create a comment on an issue",
    {
      owner: z.string(),
      repo: z.string(),
      issueNumber: z.number(),
      body: z.string(),
    },
    async ({ owner, repo, issueNumber, body }) => {
      try {
        console.log("Creating issue comment:", { owner, repo, issueNumber });
        const comment = await createIssueComment(
          octokit,
          { owner, repo },
          issueNumber,
          body
        );
        return {
          content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
        };
      } catch (error) {
        console.error("Error in createIssueComment tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );

  // Update Issue
  server.tool(
    "updateIssue",
    "Update an issue",
    {
      owner: z.string(),
      repo: z.string(),
      issueNumber: z.number(),
      title: z.string().optional(),
      body: z.string().optional(),
      state: z.enum(["open", "closed"]).optional(),
      labels: z.array(z.string()).optional(),
    },
    async ({ owner, repo, issueNumber, ...update }) => {
      try {
        console.log("Updating issue:", { owner, repo, issueNumber, update });
        const issue = await updateIssue(
          octokit,
          { owner, repo },
          issueNumber,
          update
        );
        return {
          content: [{ type: "text", text: JSON.stringify(issue, null, 2) }],
        };
      } catch (error) {
        console.error("Error in updateIssue tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );

  // List Issues
  server.tool(
    "listIssues",
    "List issues for a repository",
    {
      owner: z.string(),
      repo: z.string(),
    },
    async ({ owner, repo }) => {
      try {
        console.log("Listing issues:", { owner, repo });
        const issues = await listIssues(octokit, { owner, repo });
        return {
          content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
        };
      } catch (error) {
        console.error("Error in listIssues tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
        };
      }
    }
  );
}
