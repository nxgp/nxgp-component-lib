import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../tests/utils";
import { restaurantsFixture } from "../openui/openui.fixtures";

vi.mock("@assistant-ui/react", () => ({
  useThreadRuntime: () => ({ append: vi.fn() }),
}));

vi.mock("./tool-fallback", () => ({
  ToolFallback: () => <div data-testid="default-fallback" />,
}));

import { OpenUIToolFallback } from "./openui-tool-fallback";

function renderPart(props: Partial<ToolCallMessagePartProps>) {
  return renderWithProviders(<OpenUIToolFallback {...(props as ToolCallMessagePartProps)} />);
}

describe("OpenUIToolFallback", () => {
  it("renders OpenUI Lang from an `openui` tool result with kit components", () => {
    const { getByText } = renderPart({
      toolName: "openui",
      result: { openui: restaurantsFixture },
      status: { type: "complete" },
    });
    expect(getByText("Bella Trattoria")).toBeInTheDocument();
  });

  it("accepts a raw OpenUI Lang string result", () => {
    const { getByText } = renderPart({
      toolName: "openui",
      result: restaurantsFixture,
      status: { type: "complete" },
    });
    expect(getByText("Dinner near you")).toBeInTheDocument();
  });

  it("falls through to the default tool fallback for other tools", () => {
    const { getByTestId } = renderPart({
      toolName: "search",
      result: { hits: 3 },
      status: { type: "complete" },
    });
    expect(getByTestId("default-fallback")).toBeInTheDocument();
  });

  it("falls through when the `openui` result is not OpenUI Lang", () => {
    const { getByTestId } = renderPart({
      toolName: "openui",
      result: { note: "no ui here" },
      status: { type: "complete" },
    });
    expect(getByTestId("default-fallback")).toBeInTheDocument();
  });
});
