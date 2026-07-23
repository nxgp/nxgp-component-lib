# OpenUI integration (`@nxgp/component-lib/openui`)

Render **LLM-generated UI** with `@nxgp/component-lib` components. The model streams a compact
program written in [OpenUI Lang](https://openui.com); `KitOpenUIRenderer` parses it
and maps every node onto kit primitives — no `@openuidev/react-ui` visuals are used,
so generated UI matches the rest of your app.

- **Source:** [`src/openui/`](../src/openui/)
- **Export:** `@nxgp/component-lib/openui`
- **Generated LLM artifacts:** `@nxgp/component-lib/openui/system-prompt.txt`, `@nxgp/component-lib/openui/component-spec.json`
- **Backend contract + persistence:** [`OPENUI_BACKEND_SPEC.md`](OPENUI_BACKEND_SPEC.md)
- **Storybook:** `OpenUI/Renderer` (playground + rich demos) and `Messaging/Assistant/With OpenUI`

## Concepts

| Term | What it is |
| --- | --- |
| **OpenUI Lang** | A compact, streaming-first language the model emits: `id = Component(args…)`, one statement per node, positional arguments, references resolved after the full text parses. |
| **Library** | `kitOpenUILibrary` — the set of components the model may emit, each defined with a Zod schema (wire contract) + a kit renderer. |
| **Renderer** | `KitOpenUIRenderer` — parses the program and renders it, wiring form state and button actions. |
| **Prompt** | `buildOpenUISystemPrompt()` (or the committed `system-prompt.txt`) tells the model exactly which components + signatures exist. |

## Component set (v1)

`Stack` (root), `Card`, `Divider`, `Tabs`, `Text`, `Badge`, `Alert`, `Avatar`,
`Metric`, `Chart`, `DataTable`, `Stepper`, `Form`, `FormControl`, `Input`,
`TextArea`, `Select`, `CheckBox`, `Slider`, `DateInput`, `Button`, `Buttons`.

Every response is rooted in a `Stack`. See the full signatures in the generated
[`system-prompt.txt`](../src/openui/generated/system-prompt.txt).

## Install

```bash
pnpm add @nxgp/component-lib @openuidev/react-lang zod recharts react react-dom
```

`@openuidev/react-lang` and `zod` are runtime dependencies of `@nxgp/component-lib/openui`;
`recharts` is a peer used by the `Chart` component.

## Render on the client

```tsx
import "@nxgp/component-lib/styles.css";
import { KitOpenUIRenderer } from "@nxgp/component-lib/openui";

export function AssistantMessage({ openuiLang }: { openuiLang: string }) {
  return (
    <KitOpenUIRenderer
      response={openuiLang}
      isStreaming={false}
      onAction={(action) => {
        // action.humanFriendlyMessage — send back to the assistant as the next turn
      }}
      onStateUpdate={(state) => {
        // form field values — persist alongside the message if you need replay
      }}
      onError={(errors) => {
        // structured, LLM-fixable parser errors (unknown component, missing prop…)
      }}
    />
  );
}
```

While `isStreaming` is `true`, form inputs are disabled and undefined references
render as they stream in (progressive reveal). Set it to `false` once the model
finishes.

## Use inside the assistant

`@nxgp/component-lib/assistant` ships `OpenUIToolFallback`. Wire it as the thread's
`ToolFallback` so an `openui` tool call renders inline; button actions post back
to the thread automatically.

```tsx
import { Thread, OpenUIToolFallback } from "@nxgp/component-lib/assistant";

<Thread components={{ ToolFallback: OpenUIToolFallback }} />;
```

It activates when `toolName === "openui"` and the result is OpenUI Lang (a string,
or `{ openui }` / `{ openuiLang }`); any other tool falls through to the default UI.

## Generate the LLM prompt

Backends can either drop the committed prompt file into the system message or
build it in-process:

```ts
import { buildOpenUISystemPrompt } from "@nxgp/component-lib/openui";

const systemPrompt = buildOpenUISystemPrompt(); // static UI, no tools/bindings
```

Regenerate the committed artifacts after changing the library:

```bash
pnpm openui:generate   # writes src/openui/generated/{system-prompt.txt,component-spec.json}
pnpm openui:check      # asserts every fixture parses against the library
```

## Do / don't

- **Do** keep all visuals in the kit library — the model emits kit component names only.
- **Do** send `action.humanFriendlyMessage` back to the model to continue the loop.
- **Don't** let the model emit raw HTML/CSS/Markdown or component names outside the library.
- **Don't** add `@openuidev/react-ui` or its CSS; chat chrome stays `@nxgp/component-lib/assistant`.

See [`OPENUI_BACKEND_SPEC.md`](OPENUI_BACKEND_SPEC.md) for the full output contract,
rich-response recipes, persistence/history, and versioning.
