/**
 * ToolFallback override that renders OpenUI Lang (from an `openui` tool result)
 * with kit components inside the chat thread. Button actions are appended back
 * to the thread as the user's next message, closing the generative-UI loop.
 */

import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useThreadRuntime } from "@assistant-ui/react";
import { cn } from "../lib/cn";
import { KitOpenUIRenderer } from "../openui";
import { ToolFallback } from "./tool-fallback";

/** Shape of an `openui` tool result: a raw string or `{ openui }` / `{ openuiLang }`. */
export type OpenUIToolResult = string | { openui?: string; openuiLang?: string };

function looksLikeOpenUILang(value: string): boolean {
  return /(^|\n)\s*root\s*=/.test(value) || value.includes("= Stack(");
}

function extractOpenUILang(result: unknown): string | null {
  if (typeof result === "string") {
    return looksLikeOpenUILang(result) ? result : null;
  }
  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    const candidate = record.openui ?? record.openuiLang;
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }
  }
  return null;
}

/**
 * Renders {@link KitOpenUIRenderer} for toolName `openui`; otherwise the default
 * kit {@link ToolFallback}.
 */
export const OpenUIToolFallback: ToolCallMessagePartComponent = (props) => {
  const threadRuntime = useThreadRuntime();
  const source = props.toolName === "openui" ? extractOpenUILang(props.result) : null;

  if (source === null) {
    return <ToolFallback {...props} />;
  }

  const isStreaming = props.status?.type === "running";

  return (
    <div
      data-slot="openui-tool-fallback"
      className={cn("my-2 w-full max-w-2xl rounded-lg border border-border bg-card p-3 shadow-sm")}
    >
      <KitOpenUIRenderer
        response={source}
        isStreaming={isStreaming}
        onAction={(action) => {
          if (action.humanFriendlyMessage) {
            threadRuntime.append({
              role: "user",
              content: [{ type: "text", text: action.humanFriendlyMessage }],
            });
          }
        }}
      />
    </div>
  );
};
