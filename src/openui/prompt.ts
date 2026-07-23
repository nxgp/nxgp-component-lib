import type { PromptOptions } from "@openuidev/react-lang";
import { kitOpenUILibrary } from "./library";

/**
 * Default prompt options for the kit OpenUI library.
 *
 * v1 ships **static UI only** — no `Query()`/`Mutation()`/`$variables`. Backends
 * that want data-binding or tool-calling can override these when calling
 * {@link buildOpenUISystemPrompt} (documented in `docs/OPENUI_BACKEND_SPEC.md`).
 */
export const kitOpenUIPromptOptions: PromptOptions = {
  toolCalls: false,
  bindings: false,
  preamble: [
    "You are a UI generator. Respond ONLY with OpenUI Lang using the components below.",
    "Every component maps to a @nxgp/component-lib React component — never emit raw HTML, CSS, Markdown, or component names not listed here.",
  ].join(" "),
  additionalRules: [
    "The FIRST statement must be `root = Stack(...)`. Exactly one root.",
    "Emit one statement per node and reference children by name so the UI streams progressively.",
    "Positional arguments follow each component's documented property order.",
    'Prefer rich, structured layouts: use Card to group content, Stack(direction: "row", wrap: true) for grids, and Metric/Chart/DataTable for data.',
    "Every form field needs a unique `name`. Never nest a Form inside a Form.",
    "Keep copy concise; put all text in Text/Alert/Badge/Metric — do not write prose outside components.",
  ],
  examples: [
    [
      "// Analytics summary — arguments are POSITIONAL (no name: value)",
      'root = Stack([kpis, trend], "column", "lg")',
      'kpis = Stack([m1, m2, m3], "row", "md", "stretch", "start", true)',
      'm1 = Metric("Revenue", "$48.2k", "+12%", "vs last month", "up")',
      'm2 = Metric("Active users", "3,140", "+4%", "", "up")',
      'm3 = Metric("Churn", "1.8%", "-0.3%", "", "down")',
      'trend = Chart("area", "month", [s1], rows, "Revenue trend")',
      's1 = { key: "revenue", label: "Revenue" }',
      'rows = [{ month: "Jan", revenue: 32 }, { month: "Feb", revenue: 41 }, { month: "Mar", revenue: 48 }]',
    ].join("\n"),
  ],
};

/**
 * Build the system prompt for the kit OpenUI library. Drop the result into your
 * LLM system message so it emits OpenUI Lang the client can render.
 *
 * @param options - Overrides merged over {@link kitOpenUIPromptOptions}.
 * @example
 * ```ts
 * const systemPrompt = buildOpenUISystemPrompt();
 * ```
 */
export function buildOpenUISystemPrompt(options: PromptOptions = {}): string {
  return kitOpenUILibrary.prompt({ ...kitOpenUIPromptOptions, ...options });
}
