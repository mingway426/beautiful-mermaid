import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { THEMES } from "beautiful-mermaid";
import { z } from "zod";

const ListThemesInputSchema = z.object({}).strict();

interface ThemeInfo {
  name: string;
  bg: string;
  fg: string;
  accent?: string;
  muted?: string;
  surface?: string;
  border?: string;
  line?: string;
}

export function registerListThemes(server: McpServer): void {
  server.registerTool(
    "mermaid_list_themes",
    {
      title: "List Mermaid Themes",
      description: `List all available built-in themes for Mermaid diagram rendering.

Returns theme names with their color palettes (bg, fg, accent, etc.).
Use theme names with the mermaid_render_svg tool's 'theme' parameter.

Returns:
  A list of all 15 built-in themes with their color configurations.`,
      inputSchema: ListThemesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const themes: ThemeInfo[] = Object.entries(THEMES).map(([name, colors]) => ({
        name,
        bg: colors.bg,
        fg: colors.fg,
        ...(colors.accent ? { accent: colors.accent } : {}),
        ...(colors.muted ? { muted: colors.muted } : {}),
        ...(colors.surface ? { surface: colors.surface } : {}),
        ...(colors.border ? { border: colors.border } : {}),
        ...(colors.line ? { line: colors.line } : {}),
      }));

      const lines = ["# Available Mermaid Themes", ""];
      for (const theme of themes) {
        lines.push(`## ${theme.name}`);
        lines.push(`- **bg**: ${theme.bg}`);
        lines.push(`- **fg**: ${theme.fg}`);
        if (theme.accent) lines.push(`- **accent**: ${theme.accent}`);
        if (theme.muted) lines.push(`- **muted**: ${theme.muted}`);
        if (theme.surface) lines.push(`- **surface**: ${theme.surface}`);
        if (theme.border) lines.push(`- **border**: ${theme.border}`);
        if (theme.line) lines.push(`- **line**: ${theme.line}`);
        lines.push("");
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
