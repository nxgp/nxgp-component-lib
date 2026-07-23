import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";

type ProviderProps = {
  children: ReactNode;
};

/**
 * Default test wrapper with ThemeProvider.
 */
function TestProviders({ children }: ProviderProps) {
  return (
    <ThemeProvider defaultTheme="light-default" attributeTarget={document.documentElement}>
      {children}
    </ThemeProvider>
  );
}

export type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  wrapper?: React.ComponentType<ProviderProps>;
};

/**
 * Render a component with shared test providers.
 *
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Button>Click</Button>);
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  { wrapper: Wrapper, ...options }: RenderWithProvidersOptions = {},
): RenderResult {
  const CombinedWrapper = Wrapper
    ? ({ children }: ProviderProps) => (
        <TestProviders>
          <Wrapper>{children}</Wrapper>
        </TestProviders>
      )
    : TestProviders;

  return render(ui, { wrapper: CombinedWrapper, ...options });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
