#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerRenderSvg } from "./tools/render-svg.js";
import { registerRenderAscii } from "./tools/render-ascii.js";
import { registerListThemes } from "./tools/list-themes.js";

const server = new McpServer({
  name: "beautiful-mermaid-mcp-server",
  version: "1.0.0",
});

// Register all tools
registerRenderSvg(server);
registerRenderAscii(server);
registerListThemes(server);

// Start stdio transport
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("beautiful-mermaid MCP server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
