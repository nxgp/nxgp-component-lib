---
"@nxgp/component-lib": minor
---

Replace custom `Chat` and `MessageBubble` components with a new `@nxgp/component-lib/assistant` subpath powered by [assistant-ui](https://github.com/assistant-ui/assistant-ui).

### Added

- `@nxgp/component-lib/assistant` — kit-styled `Thread`, `ThreadList`, `AssistantShell`, plus full star re-exports of `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`, and `@assistant-ui/react-markdown` (primitives, runtimes, tools, markdown)
- `@nxgp/component-lib/assistant.css` — markdown and assistant animation styles

### Removed

- `Chat`, `MessageBubble`, and related exports from the main barrel (breaking change)

### Migration

```tsx
import "@nxgp/component-lib/assistant.css";
import {
  AssistantRuntimeProvider,
  AssistantShell,
  useChatRuntime,
  AssistantChatTransport,
} from "@nxgp/component-lib/assistant";

const runtime = useChatRuntime({
  transport: new AssistantChatTransport({ api: "/api/chat" }),
});

<AssistantRuntimeProvider runtime={runtime}>
  <AssistantShell />
</AssistantRuntimeProvider>
```
