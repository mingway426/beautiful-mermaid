import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { renderMermaidSVG, THEMES } from "beautiful-mermaid";
import { z } from "zod";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";

const themeNames = Object.keys(THEMES);

const RenderSvgInputSchema = z.object({
  code: z.string()
    .min(1, "Mermaid code cannot be empty")
    .describe("Mermaid diagram source code (e.g., 'graph TD; A --> B')"),
  theme: z.string()
    .optional()
    .describe(`Built-in theme name. Available: ${themeNames.join(", ")}`),
  output_path: z.string()
    .optional()
    .describe("Absolute file path to save SVG. If omitted, saves to a temp file"),
  bg: z.string()
    .optional()
    .describe("Background color hex (e.g., '#FFFFFF'). Overrides theme"),
  fg: z.string()
    .optional()
    .describe("Foreground/text color hex (e.g., '#27272A'). Overrides theme"),
  accent: z.string()
    .optional()
    .describe("Accent color hex for arrows and highlights"),
  transparent: z.boolean()
    .optional()
    .describe("Render with transparent background (default: false)"),
  font: z.string()
    .optional()
    .describe("Font family (default: 'Inter')"),
}).strict();

type RenderSvgInput = z.infer<typeof RenderSvgInputSchema>;

export function registerRenderSvg(server: McpServer): void {
  server.registerTool(
    "mermaid_render_svg",
    {
      title: "Render Mermaid to SVG",
      description: `Render Mermaid diagram code into a beautiful SVG file.

Supports 6 diagram types: flowchart, state, sequence, class, ER, and XY chart.
Supports 15 built-in themes and custom color overrides.

Args:
  - code (string, required): Mermaid diagram source code
  - theme (string, optional): Built-in theme name (e.g., 'tokyo-night', 'dracula', 'nord')
  - output_path (string, optional): File path to save SVG. Defaults to temp file
  - bg (string, optional): Background color hex, overrides theme
  - fg (string, optional): Foreground color hex, overrides theme
  - accent (string, optional): Accent color for arrows/highlights
  - transparent (boolean, optional): Transparent background
  - font (string, optional): Font family

Returns:
  File path of the saved SVG and a summary of the rendered diagram.

Examples:
  - Flowchart: code="graph TD; A[Start] --> B{Decision} --> C[End]"
  - Sequence: code="sequenceDiagram; Alice->>Bob: Hello"
  - With theme: code="graph LR; A --> B", theme="dracula"`,
      inputSchema: RenderSvgInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: RenderSvgInput) => {
      try {
        // Build render options from theme + overrides
        const themeColors = params.theme ? THEMES[params.theme] : undefined;
        if (params.theme && !themeColors) {
          return {
            isError: true,
            content: [{
              type: "text" as const,
              text: `Error: Unknown theme '${params.theme}'. Available themes: ${themeNames.join(", ")}`,
            }],
          };
        }

        const options = {
          ...(themeColors || {}),
          ...(params.bg ? { bg: params.bg } : {}),
          ...(params.fg ? { fg: params.fg } : {}),
          ...(params.accent ? { accent: params.accent } : {}),
          ...(params.transparent ? { transparent: params.transparent } : {}),
          ...(params.font ? { font: params.font } : {}),
        };

        const svg = renderMermaidSVG(params.code, options);

        // Determine output path
        const outputPath = params.output_path
          ? resolve(params.output_path)
          : resolve(tmpdir(), `mermaid-${Date.now()}.svg`);

        // Ensure directory exists
        await mkdir(dirname(outputPath), { recursive: true });
        await writeFile(outputPath, svg, "utf-8");

        const lines = [
          `SVG rendered successfully.`,
          `File: ${outputPath}`,
          `Theme: ${params.theme || "default"}`,
          `Size: ${svg.length} bytes`,
        ];

        return {
          content: [{ type: "text" as const, text: lines.join("\n") }],
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: "text" as const,
            text: `Error rendering SVG: ${error instanceof Error ? error.message : String(error)}`,
          }],
        };
      }
    }
  );
}
