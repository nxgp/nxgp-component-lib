---
"@nxgp/component-lib": minor
---

Add `@nxgp/component-lib/openui` — render LLM-generated UI (OpenUI Lang) with kit components only.

- New `kitOpenUILibrary` mapping OpenUI Lang components (Stack, Card, Text, Badge, Alert, Avatar, Metric, Chart, DataTable, Stepper, Tabs, Form + fields, Button/Buttons) onto existing `@nxgp/component-lib` primitives — no `@openuidev/react-ui` visuals.
- `KitOpenUIRenderer` client component, `buildOpenUISystemPrompt()` / `kitOpenUIPromptOptions`, and committed LLM artifacts exported at `@nxgp/component-lib/openui/system-prompt.txt` and `@nxgp/component-lib/openui/component-spec.json`.
- `OpenUIToolFallback` from `@nxgp/component-lib/assistant` renders `openui` tool results inline and posts button actions back to the thread.
- Storybook: `OpenUI/Renderer` (resizable Message-vs-Output playground + rich demos) and `Messaging/Assistant/With OpenUI`.
- Docs: `docs/OPENUI.md` (host) and `docs/OPENUI_BACKEND_SPEC.md` (LLM output contract + persistence/history).
