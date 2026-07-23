import {
  AssistantRuntimeProvider,
  type ChatModelRunOptions,
  generateId,
  InMemoryThreadListAdapter,
  type ThreadMessage,
  useLocalRuntime,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { defineComponentStories } from "../../.storybook/utils/arg-types";
import { playgroundStory } from "../../.storybook/utils/playground";
import { type OpenUIFixtureId, openUIFixtures } from "../openui/openui.fixtures";
import { AssistantShell } from "./assistant-shell";
import { OpenUIToolFallback } from "./openui-tool-fallback";
import { Thread } from "./thread";
import { useDemoAssistantRuntime } from "./use-demo-assistant-runtime";

function AssistantDemo({ layout = "shell" }: { layout?: "shell" | "thread" }) {
  const runtime = useDemoAssistantRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {layout === "shell" ? (
        <AssistantShell className="h-[40rem] border border-border" sidebarTitle="Kit Assistant" />
      ) : (
        <div className="h-[40rem] border border-border">
          <Thread />
        </div>
      )}
    </AssistantRuntimeProvider>
  );
}

const componentStories = defineComponentStories(
  "Production AI chat powered by assistant-ui — thread list, streaming, markdown, and tool UI.",
  {},
);

const meta = {
  title: "Messaging/Assistant",
  component: AssistantShell,
  tags: ["autodocs"],
  subcomponents: { Thread },
  ...componentStories,
  parameters: {
    ...componentStories.parameters,
    layout: "fullscreen",
  },
} satisfies Meta<typeof AssistantShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  render: () => <AssistantDemo layout="shell" />,
});

export const ThreadOnly: Story = {
  render: () => <AssistantDemo layout="thread" />,
};

function lastUserText(messages: readonly ThreadMessage[]): string {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUser) {
    return "";
  }
  if (typeof lastUser.content === "string") {
    return lastUser.content;
  }
  return lastUser.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function pickFixture(prompt: string): { id: OpenUIFixtureId; intro: string } {
  const text = prompt.toLowerCase();
  if (/restaurant|dinner|eat|food|reserv/.test(text)) {
    return { id: "restaurants", intro: "Here are a few spots near you:" };
  }
  if (/approv|expense|reimburse/.test(text)) {
    return { id: "approval", intro: "Here's the expense report awaiting review:" };
  }
  if (/plan|pricing|price|subscription|upgrade/.test(text)) {
    return { id: "plans", intro: "Here's a comparison of the plans:" };
  }
  if (/book|demo|sign ?up|form|schedule/.test(text)) {
    return { id: "booking", intro: "Sure — fill this out and I'll set it up:" };
  }
  return { id: "analytics", intro: "Here's your performance summary:" };
}

const demoOpenUIModel = {
  async *run({ messages, abortSignal }: ChatModelRunOptions) {
    const { id, intro } = pickFixture(lastUserText(messages));
    const source = openUIFixtures[id].source;
    const toolCallId = generateId();

    let text = "";
    for (const token of intro.split(/(\s+)/)) {
      if (abortSignal.aborted) {
        return;
      }
      text += token;
      yield { content: [{ type: "text" as const, text }] };
      await new Promise((resolve) => window.setTimeout(resolve, 16));
    }

    yield {
      content: [
        { type: "text" as const, text },
        {
          type: "tool-call" as const,
          toolCallId,
          toolName: "openui",
          args: { intent: id },
          argsText: JSON.stringify({ intent: id }, null, 2),
          result: { openui: source },
        },
      ],
    };
  },
};

function useDemoOpenUIRuntime() {
  return useRemoteThreadListRuntime({
    adapter: new InMemoryThreadListAdapter(),
    // biome-ignore lint/correctness/useHookAtTopLevel: assistant-ui `runtimeHook` contract
    runtimeHook: () => useLocalRuntime(demoOpenUIModel),
  });
}

function OpenUIAssistantDemo() {
  const runtime = useDemoOpenUIRuntime();
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-[44rem] border border-border">
        <Thread components={{ ToolFallback: OpenUIToolFallback }} />
      </div>
    </AssistantRuntimeProvider>
  );
}

/**
 * Chat + OpenUI: the model streams intro text then an `openui` tool call whose
 * OpenUI Lang result is rendered with kit components. Try prompts like
 * "show me analytics", "find dinner nearby", "review this expense", "compare plans",
 * or "book a demo". Buttons in the generated UI post back as your next message.
 */
export const WithOpenUI: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <OpenUIAssistantDemo />,
};
