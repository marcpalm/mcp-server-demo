import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { registerAllTools } from "./tools/index.js";

// Create an MCP server
const server = new McpServer({
  name: "GitHub MCP Server",
  version: "1.0.0",
});

// Register all tools
registerAllTools(server);

// Set up Express server for SSE
const app = express();

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
