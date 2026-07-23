import { Renderer, type RendererProps } from "@openuidev/react-lang";
import { kitOpenUILibrary } from "./library";

/**
 * Props for {@link KitOpenUIRenderer}. Same as the OpenUI `Renderer` minus
 * `library`, which is fixed to {@link kitOpenUILibrary}.
 */
export type KitOpenUIRendererProps = Omit<RendererProps, "library">;

/**
 * Renders OpenUI Lang produced by an LLM using **only** `@nxgp/component-lib` components.
 *
 * @example
 * ```tsx
 * <KitOpenUIRenderer response={openuiLang} isStreaming={false} />
 * ```
 */
export function KitOpenUIRenderer(props: KitOpenUIRendererProps) {
  return <Renderer library={kitOpenUILibrary} {...props} />;
}
