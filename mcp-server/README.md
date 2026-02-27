# beautiful-mermaid-mcp-server

MCP server for rendering Mermaid diagrams as beautiful SVGs or ASCII art. Powered by [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid).

## Features

- **6 diagram types**: Flowchart, State, Sequence, Class, ER, XY Chart
- **SVG output**: Save diagrams as SVG files with 15 built-in themes
- **ASCII output**: Render diagrams as Unicode/ASCII art for terminals
- **Custom theming**: Override colors (bg, fg, accent) or use built-in themes

## Installation

### Use with Claude Code

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "mermaid": {
      "command": "npx",
      "args": ["beautiful-mermaid-mcp-server"]
    }
  }
}
```

### Use with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mermaid": {
      "command": "npx",
      "args": ["beautiful-mermaid-mcp-server"]
    }
  }
}
```

### Install locally

```bash
npm install -g beautiful-mermaid-mcp-server
```

## Tools

### `mermaid_render_svg`

Render Mermaid code to an SVG file.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `code` | string | Yes | Mermaid diagram source code |
| `theme` | string | No | Built-in theme name |
| `output_path` | string | No | File path to save SVG (defaults to temp file) |
| `bg` | string | No | Background color hex |
| `fg` | string | No | Foreground color hex |
| `accent` | string | No | Accent color hex |
| `transparent` | boolean | No | Transparent background |
| `font` | string | No | Font family |

### `mermaid_render_ascii`

Render Mermaid code to ASCII/Unicode text art.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `code` | string | Yes | Mermaid diagram source code |
| `use_ascii` | boolean | No | Use pure ASCII instead of Unicode (default: false) |
| `color_mode` | string | No | Color mode: `none`, `ansi16`, `ansi256`, `truecolor`, `html` |

### `mermaid_list_themes`

List all 15 available built-in themes with their color palettes.

## Available Themes

`zinc-light`, `zinc-dark`, `tokyo-night`, `tokyo-night-storm`, `tokyo-night-light`, `catppuccin-mocha`, `catppuccin-latte`, `nord`, `nord-light`, `dracula`, `github-light`, `github-dark`, `solarized-light`, `solarized-dark`, `one-dark`

## Development

```bash
npm install
npm run build
npm run dev    # watch mode
```

## License

MIT
