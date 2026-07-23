# OpenUI backend spec

How a backend / LLM produces UI that `@nxgp/component-lib/openui` can render, and how to
store it so history replays identically. Pair this with [`OPENUI.md`](OPENUI.md)
(host/client side).

The unit of exchange is a single **OpenUI Lang program** — a short text document
the model streams. Unlike envelope-based protocols, there is no message log: the
program text _is_ the source of truth.

---

## 1. Generation pipeline

```
kit library ──► system prompt ──► LLM (stream) ──► OpenUI Lang text ──► client Renderer
```

1. **System prompt.** Put the component contract in the system message. Either:
   - ship the committed file `@nxgp/component-lib/openui/system-prompt.txt`, or
   - call `buildOpenUISystemPrompt(options?)` from `@nxgp/component-lib/openui` in a Node host, or
   - call `generatePrompt(componentSpec, options)` from `@openuidev/lang-core` with
     `@nxgp/component-lib/openui/component-spec.json` (the library JSON schema) plus your own
     per-request preamble/rules.
2. **Stream** the model response straight through to the client. The client
   re-parses on every chunk, so the UI reveals top-down as text arrives.
3. **Render** with `KitOpenUIRenderer` (`isStreaming` true until the stream ends).

---

## 2. Output contract

The model must emit **OpenUI Lang only** — no prose, HTML, CSS, or Markdown
(unless you enable `inlineMode`, below).

- The **first statement is the root**: `root = Stack(...)`. Exactly one root.
- **One statement per node**, referenced by name — enables progressive streaming:
  ```
  root = Stack([title, chart], "column", "lg")
  title = Text("Revenue", "h2")
  chart = Chart("area", "month", [s1], rows, "Trend")
  s1 = { key: "revenue", label: "Revenue" }
  rows = [{ month: "Jan", revenue: 32 }, { month: "Feb", revenue: 41 }]
  ```
- **Arguments are positional** in the documented property order. Colon/named
  syntax (`gap: "lg"`) is **not** supported and silently breaks.
- **Forward references are fine** — the parser resolves after the full text loads.
- **Only library component names** may be used (see `system-prompt.txt`).

Validate before and after streaming with the parser:

```ts
import { createParser } from "@openuidev/react-lang";
import { kitOpenUILibrary } from "@nxgp/component-lib/openui";

const parser = createParser(kitOpenUILibrary.toJSONSchema());
const { root, meta } = parser.parse(text);
// meta.errors / meta.unresolved / meta.orphaned are LLM-fixable — feed back for a retry
```

`KitOpenUIRenderer`'s `onError` surfaces the same structured errors on the client
for an automated correction loop.

---

## 3. Rich-response recipes

Match the component groups so responses are genuinely useful, not just text:

| Intent | Recipe |
| --- | --- |
| **Analytics / dashboards** | `Stack` → row of `Metric` + `Chart` + `DataTable` |
| **Listings / results** | `Stack` of `Card`s, each `Avatar` + `Badge` + `Text` + `Button` |
| **Approvals / workflows** | `Stepper` (current step) + `Chart` + `DataTable` + `Buttons` (approve/reject) |
| **Comparisons** | `Tabs` or `Stack(direction: row, wrap)` of `Card`s with `Metric` |
| **Data capture** | `Form` with `FormControl` fields + a submit `Button` |

Working examples live in
[`src/openui/openui.fixtures.ts`](../src/openui/openui.fixtures.ts) and the
`OpenUI/Renderer` Storybook stories.

---

## 4. Persistence & history

Store the **final OpenUI Lang string** on the assistant message. That single field
is enough to re-render the exact UI later.

Suggested columns on your assistant-message row:

| Column | Purpose |
| --- | --- |
| `openui_lang` (text) | The final program. Required for replay. |
| `openui_form_state` (jsonb, nullable) | Last form state from `onStateUpdate` / `action.formState`, if you want inputs pre-filled on replay. |
| `openui_library_version` (text) | Version of `@nxgp/component-lib` (and/or a hash of `component-spec.json`) used to generate it. |

**Replay** = feed the stored string back into the renderer:

```tsx
<KitOpenUIRenderer
  response={row.openui_lang}
  isStreaming={false}
  initialState={row.openui_form_state ?? undefined}
/>
```

Because the program text is self-contained, there is no envelope/event log to
persist — store the string (and optionally form state) and you can reconstruct
the message pixel-for-pixel.

---

## 5. Versioning

The library is a contract. When it changes:

- **Additive** (new component / optional prop): old programs keep rendering.
- **Breaking** (renamed component, removed/renamed prop, changed arg order):
  old stored programs may fail to parse.

Guard against drift:

- Pin `openui_library_version` (or a `component-spec.json` hash) on every stored
  message.
- Regenerate and commit artifacts whenever the library changes
  (`pnpm openui:generate`), and bump the kit version via a changeset.
- On replay, if the stored version is behind a breaking change, either render with
  a pinned older library or re-generate the message.

---

## 6. Later phases (not in v1)

v1 ships **static UI** — `toolCalls: false`, `bindings: false`. OpenUI Lang also
supports interactivity you can enable later via `buildOpenUISystemPrompt(options)`:

- **`$variables` + `@Set`/`@Reset`** (`bindings: true`) — client-side reactive
  filters (e.g. a `Select` that filters a `Chart`) with no round-trip.
- **`Query()` / `Mutation()` + tools** (`toolCalls: true`, `tools: [...]`) — the
  model calls your backend tools for live data. Provide a `toolProvider` to
  `KitOpenUIRenderer`.

When enabling these, persist any `$variable` state alongside `openui_form_state`
so reactive UI replays with the right selections.
