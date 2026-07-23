# @nxgp/component-lib

Themeable, accessible React component library — Radix UI + Tailwind CSS v4.

**Version 1.0.0** — production-ready component kit for internal apps.

## Features

- 40+ accessible components with CVA variants and semantic design tokens
- 6 built-in themes + `ThemeProvider` with system preference support
- Subpath modules: `@nxgp/component-lib/table`, `@nxgp/component-lib/charts`, `@nxgp/component-lib/icons`, `@nxgp/component-lib/forms`, `@nxgp/component-lib/overlays`, `@nxgp/component-lib/client`
- Storybook docs with Theme Playground (live token editor + CSS export)
- Optional `@nxgp/component-lib/editor` subpath — TipTap-based WYSIWYG rich text field
- Storybook MCP — agents in other repos can query real component docs before generating UI
- Heavy test coverage, Biome lint, Lefthook pre-push gates

## Quick start (consumers)

```bash
pnpm add @nxgp/component-lib react react-dom
```

```tsx
// app/layout.tsx or main entry
import "@nxgp/component-lib/styles.css";
import { ThemeProvider, Button, Input } from "@nxgp/component-lib";

export function App() {
  return (
    <ThemeProvider defaultTheme="light-default" enableSystem>
      <div className="max-w-sm space-y-4 rounded-lg border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Hello</h1>
        <Button type="button">Get started</Button>
      </div>
    </ThemeProvider>
  );
}
```

### Tailwind v4 apps

```css
@import "tailwindcss";
@import "@nxgp/component-lib/tailwind";
```

### Subpath exports

Prefer subpaths over the main barrel for smaller bundles and faster dev cold starts:

```tsx
import { DataTable, type ColumnDef } from "@nxgp/component-lib/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@nxgp/component-lib/charts";
import { Icon, Search } from "@nxgp/component-lib/icons";
import { Input, Select, SelectSearch, Field } from "@nxgp/component-lib/forms";
import { Dialog, Drawer, Popover, Tooltip } from "@nxgp/component-lib/overlays";
import { Dialog, CommandDialog } from "@nxgp/component-lib/client"; // App Router client boundary
```

**Optional peer dependencies** — install when using heavy subpaths:

```bash
pnpm add @tiptap/react          # required for @nxgp/component-lib/editor
pnpm add recharts               # required for @nxgp/component-lib/charts
```

Peers are optional in `package.json`; the main package installs them as devDependencies for Storybook/tests only.

## Documentation

Run Storybook locally for interactive docs:

```bash
pnpm storybook   # http://localhost:6006
```

Docs pages: **Getting Started**, **Theming**, **Theme Playground**, **Accessibility**, **Contributing**, plus autodocs on every component.

## Storybook MCP (AI agents in other repos)

This library ships [`@storybook/addon-mcp`](https://storybook.js.org/docs/ai/mcp/overview) so agents (Cursor, Claude Code, Copilot, etc.) can read **real** component docs — props, stories, usage — instead of inventing APIs.

| Toolset | What agents get | Needs this Storybook running? |
|---------|-----------------|-------------------------------|
| **Docs** | List components, props, examples | No if published (Chromatic / hosted) |
| **Dev** | Story instructions, story previews | Yes (local Storybook) |
| **Test** | Run story / a11y tests | Yes (local Storybook + test runner) |

**For consumer apps, use the Docs toolset.** That is the path that scales across repos.

### Local MCP (this repo / quick try)

```bash
pnpm storybook
# MCP endpoint → http://localhost:6006/mcp
```

Open that URL in a browser to see available tools and the manifest debugger.

### Recommended: publish MCP for other repos (Chromatic)

1. Publish Storybook with Chromatic (workflow: `.github/workflows/chromatic.yml`, secret `CHROMATIC_PROJECT_TOKEN`).
2. Chromatic can publish the MCP server alongside Storybook — see [Sharing your MCP server](https://storybook.js.org/docs/ai/mcp/sharing).
3. Copy the published MCP URL (ends with `/mcp`) and add it to each consumer agent.

Until Chromatic is wired, teams can temporarily point agents at a teammate’s local `http://localhost:6006/mcp` or self-host manifests with [`@storybook/mcp`](https://www.npmjs.com/package/@storybook/mcp).

### Wire MCP in a consumer repo (Cursor)

Add an HTTP MCP server in the **app** project (not this library):

**Cursor** — project `.cursor/mcp.json` (or Cursor Settings → MCP):

```json
{
  "mcpServers": {
    "nxgp-component-lib": {
      "url": "https://<your-published-mcp-host>/mcp"
    }
  }
}
```

Local fallback while developing the design system:

```json
{
  "mcpServers": {
    "nxgp-component-lib": {
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

CLI helper (any MCP-capable agent):

```bash
npx mcp-add --type http --url "https://<your-published-mcp-host>/mcp" --scope project
# name suggestion: nxgp-component-lib
```

### Consumer agent instructions

Add something like this to the app’s `AGENTS.md`, `CLAUDE.md`, or Cursor rules so the agent actually uses the MCP:

```md
When building UI in this app, prefer `@nxgp/component-lib` over one-off components.

Always use the `nxgp-component-lib` Storybook MCP tools before inventing props or patterns:

1. `list-all-documentation` — discover available components
2. `get-documentation` — read props, variants, and example stories for the chosen component
3. `get-documentation-for-story` — dig into a specific story when needed

Rules:
- Never hallucinate props (including common-sounding ones). Only use documented props.
- Import from the documented package paths (`@nxgp/component-lib`, `/forms`, `/overlays`, etc.).
- Match Storybook examples for composition (Field + Input, Dialog structure, ThemeProvider).
- If a prop or component is missing from the docs, ask the user — do not invent an API.
```

### How agents should use it (typical flow)

1. User asks: “Build a settings form with save + cancel.”
2. Agent calls `list-all-documentation` → finds `Field`, `Input`, `Button`, `Switch`, …
3. Agent calls `get-documentation` for each → learns variants, a11y, composition.
4. Agent writes app code importing from `@nxgp/component-lib` (and subpaths).
5. (Optional) If the **app** also runs Storybook with MCP, agent can generate stories and run tests there.

### Optional: compose this Storybook into an app Storybook

If the consumer app has its own Storybook, [compose](https://storybook.js.org/docs/sharing/storybook-composition) this library’s Storybook. MCP on the app instance can then include composed manifests (docs from both).

### What MCP does *not* replace

- Still install `@nxgp/component-lib` as a normal npm dependency.
- Still import `@nxgp/component-lib/styles.css` (or Tailwind source).
- MCP feeds **agents**; it is not a runtime dependency of your app.

## Development

Requires **Node.js 22.18+** (see `.nvmrc` / `.node-version`) and **pnpm 9+**.

```bash
pnpm install
pnpm storybook
pnpm test:coverage
pnpm build
```

| Resource | Purpose |
|----------|---------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide |
| [docs/VERSIONING.md](docs/VERSIONING.md) | Semver & release policy |
| [docs/TESTING.md](docs/TESTING.md) | Component test standards |
| [docs/OPENUI.md](docs/OPENUI.md) | OpenUI / LLM-generated UI |
| [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview) | Upstream MCP docs |
| [Sharing MCP](https://storybook.js.org/docs/ai/mcp/sharing) | Chromatic / self-host publish |

## License

MIT
