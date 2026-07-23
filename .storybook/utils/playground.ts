import type { Parameters, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

/** Default copy for the interactive Default story on docs pages. */
export const playgroundDescription =
  "Interactive preview — adjust each prop in Controls to preview look, layout, and behavior.";

/** Per-story docs blurb — spread onto any named export: `...storyDoc("…")`. */
export function storyDoc(text: string): { parameters: Parameters } {
  return {
    parameters: {
      docs: {
        description: {
          story: text,
        },
      },
    },
  };
}

/** Docs + canvas parameters for an interactive Default story. */
export function playgroundParameters(storyDescription?: string): Parameters {
  return {
    docs: {
      description: {
        story: storyDescription ?? playgroundDescription,
      },
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
  };
}

type PlaygroundOptions = {
  args?: StoryObj["args"];
  render?: StoryObj["render"];
  decorators?: StoryObj["decorators"];
  parameters?: Parameters;
  description?: string;
  /** Storybook play function — interaction test run on mount. */
  play?: StoryObj["play"];
  /** Event prop names wired with `fn()` spies (Actions panel + assertable in play). */
  actions?: string[];
};

/** Strip auto-inferred Radix/DOM props that break generic `{...args}` playground renders. */
export function sanitizePlaygroundArgs<T extends Record<string, unknown>>(args: T): T {
  const next = { ...args };

  if (typeof next.asChild !== "boolean") {
    delete next.asChild;
  }

  for (const [key, value] of Object.entries(next)) {
    if (value === undefined || value === null) {
      delete next[key as keyof T];
    }
  }

  return next;
}

/** Create a Controls-driven Default story used as the docs primary example. */
export function playgroundStory(options: PlaygroundOptions = {}): StoryObj {
  const actionArgs =
    options.actions?.reduce<Record<string, ReturnType<typeof fn>>>((acc, key) => {
      acc[key] = fn();
      return acc;
    }, {}) ?? {};

  const story: StoryObj = {
    args: { ...actionArgs, ...options.args },
    ...(options.decorators && { decorators: options.decorators }),
    ...(options.play && { play: options.play }),
    parameters: {
      ...playgroundParameters(options.description),
      ...options.parameters,
    },
  };

  if (options.render) {
    const userRender = options.render;
    story.render = (args, context) =>
      userRender(sanitizePlaygroundArgs(args as Record<string, unknown>), context);
  }

  return story;
}
