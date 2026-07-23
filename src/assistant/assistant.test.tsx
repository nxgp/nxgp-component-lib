import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../tests/utils";
import { AssistantShell } from "./assistant-shell";
import { useDemoAssistantRuntime } from "./use-demo-assistant-runtime";

function DemoAssistant() {
  const runtime = useDemoAssistantRuntime();
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantShell className="h-96" sidebarTitle="Test" />
    </AssistantRuntimeProvider>
  );
}

describe("Assistant", () => {
  describe("rendering", () => {
    it("renders thread list and composer", () => {
      const { getByLabelText, getByRole } = renderWithProviders(<DemoAssistant />);
      expect(getByRole("button", { name: /new thread/i })).toBeInTheDocument();
      expect(getByLabelText(/message input/i)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<DemoAssistant />);
      await expectNoA11yViolations(container);
    });
  });
});
