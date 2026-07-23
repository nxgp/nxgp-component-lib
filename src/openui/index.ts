/**
 * `@nxgp/component-lib/openui` — render LLM-generated UI (OpenUI Lang) with kit components.
 *
 * @see docs/OPENUI.md for host integration
 * @see docs/OPENUI_BACKEND_SPEC.md for the LLM output contract + persistence
 */

export type {
  ActionEvent,
  OpenUIError,
  ParseResult,
  PromptOptions,
} from "@openuidev/react-lang";
export { KitOpenUIRenderer, type KitOpenUIRendererProps } from "./kit-openui-renderer";
export { kitOpenUILibrary } from "./library";
export { buildOpenUISystemPrompt, kitOpenUIPromptOptions } from "./prompt";
