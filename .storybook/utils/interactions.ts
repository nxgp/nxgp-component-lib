import { expect, fn, type fn as fnType, userEvent, waitFor, within } from "storybook/test";

export { expect, fn, userEvent, waitFor, within };

type FnSpy = ReturnType<typeof fnType>;

/** Query portaled Radix overlay content (renders under `document.body`). */
export function portal() {
  return within(document.body);
}

/** Read a playground `fn()` spy from story args with correct typing. */
export function storyAction(args: unknown, key: string): FnSpy {
  return (args as Record<string, FnSpy | undefined>)[key] as FnSpy;
}
