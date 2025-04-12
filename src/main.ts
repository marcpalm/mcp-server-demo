import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import * as dotenv from "dotenv";
import express from "express";

// Load environment variables from .env file
dotenv.config();

import * as github from "./github.js";

// Create an MCP server
const server = new McpServer({
  name: "GitHub MCP Server",
  version: "1.0.0",
});

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
    const issue = await github.getIssue({ owner, repo }, issueNumber);
    return {
      content: [{ type: "text", text: JSON.stringify(issue, null, 2) }],
    };
  }
);

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
    const pr = await github.getPullRequest({ owner, repo }, pullNumber);
    return {
      content: [{ type: "text", text: JSON.stringify(pr, null, 2) }],
    };
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
    const comment = await github.createIssueComment(
      { owner, repo },
      issueNumber,
      body
    );
    return {
      content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
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
    const comment = await github.createPullRequestComment(
      { owner, repo },
      pullNumber,
      body
    );
    return {
      content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
    };
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
    const issue = await github.updateIssue(
      { owner, repo },
      issueNumber,
      update
    );
    return {
      content: [{ type: "text", text: JSON.stringify(issue, null, 2) }],
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
    const pr = await github.updatePullRequest(
      { owner, repo },
      pullNumber,
      update
    );
    return {
      content: [{ type: "text", text: JSON.stringify(pr, null, 2) }],
    };
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
    const issues = await github.listIssues({ owner, repo });
    return {
      content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
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
    const prs = await github.listPullRequests({ owner, repo });
    return {
      content: [{ type: "text", text: JSON.stringify(prs, null, 2) }],
    };
  }
);

// Set up Express server for SSE
const app = express();
app.use(express.json());

let transport: SSEServerTransport | undefined = undefined;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
  await transport.handlePostMessage(req, res);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
