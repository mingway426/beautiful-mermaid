import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { renderMermaidASCII } from "beautiful-mermaid";
import { z } from "zod";

const ColorModeEnum = z.enum(["none", "ansi16", "ansi256", "truecolor", "html"]);

const RenderAsciiInputSchema = z.object({
  code: z.string()
    .min(1, "Mermaid code cannot be empty")
    .describe("Mermaid diagram source code (e.g., 'graph TD; A --> B')"),
  use_ascii: z.boolean()
    .optional()
    .default(false)
    .describe("Use pure ASCII characters instead of Unicode box-drawing (default: false)"),
  color_mode: ColorModeEnum
    .optional()
    .default("none")
    .describe("Color output mode: 'none', 'ansi16', 'ansi256', 'truecolor', or 'html'"),
}).strict();

type RenderAsciiInput = z.infer<typeof RenderAsciiInputSchema>;

export function registerRenderAscii(server: McpServer): void {
  server.registerTool(
    "mermaid_render_ascii",
    {
      title: "Render Mermaid to ASCII",
      description: `Render Mermaid diagram code into ASCII/Unicode text art for terminal display.

Supports flowchart, state, sequence, class, ER, and XY chart diagrams.
Uses Unicode box-drawing characters by default for beautiful terminal output.

Args:
  - code (string, required): Mermaid diagram source code
  - use_ascii (boolean, optional): Use pure ASCII chars instead of Unicode (default: false)
  - color_mode (string, optional): Color mode - 'none' (default), 'ansi16', 'ansi256', 'truecolor', 'html'

Returns:
  The rendered ASCII/Unicode text diagram.

Examples:
  - Simple flow: code="graph LR; A --> B --> C"
  - State diagram: code="stateDiagram-v2; [*] --> Active; Active --> [*]"
  - No colors: code="graph TD; A --> B", color_mode="none"`,
      inputSchema: RenderAsciiInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: RenderAsciiInput) => {
      try {
        const ascii = renderMermaidASCII(params.code, {
          useAscii: params.use_ascii,
          colorMode: params.color_mode,
        });

        return {
          content: [{ type: "text" as const, text: ascii }],
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: "text" as const,
            text: `Error rendering ASCII: ${error instanceof Error ? error.message : String(error)}`,
          }],
        };
      }
    }
  );
}
