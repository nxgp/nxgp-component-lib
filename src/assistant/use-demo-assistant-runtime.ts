import {
  type ChatModelRunOptions,
  InMemoryThreadListAdapter,
  type ThreadMessage,
  useLocalRuntime,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";

function getMessageText(message: ThreadMessage | undefined): string {
  if (!message) {
    return "";
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

const demoEchoModel = {
  async *run({ messages, abortSignal }: ChatModelRunOptions) {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    const prompt = getMessageText(lastUser);
    const reply = `Thanks for your message. Connect \`useChatRuntime\` from \`@nxgp/component-lib/assistant\` to your AI SDK route in production.\n\nYou asked: "${prompt}"`;
    let content = "";

    for (const token of reply.split(/(\s+)/)) {
      if (abortSignal.aborted) {
        return;
      }
      content += token;
      yield { content: [{ type: "text" as const, text: content }] };
      await new Promise((resolve) => window.setTimeout(resolve, 18));
    }
  },
};

/**
 * In-memory multi-thread runtime for Storybook and local demos — no API route required.
 *
 * @example
 * ```tsx
 * const runtime = useDemoAssistantRuntime();
 * <AssistantRuntimeProvider runtime={runtime}>
 *   <AssistantShell />
 * </AssistantRuntimeProvider>
 * ```
 */
export function useDemoAssistantRuntime() {
  return useRemoteThreadListRuntime({
    adapter: new InMemoryThreadListAdapter(),
    // biome-ignore lint/correctness/useHookAtTopLevel: assistant-ui `runtimeHook` contract
    runtimeHook: () => useLocalRuntime(demoEchoModel),
  });
}
