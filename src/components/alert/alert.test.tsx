import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders alert role", () => {
      const { getByRole } = renderWithProviders(
        <Alert>
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      expect(getByRole("alert")).toBeInTheDocument();
    });

    it.each([
      "default",
      "destructive",
      "success",
      "warning",
      "info",
    ] as const)("renders %s variant", (variant) => {
      const { getByRole } = renderWithProviders(
        <Alert variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
        </Alert>,
      );
      expect(getByRole("alert")).toBeInTheDocument();
    });

    it("renders dismiss control and action slot", async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Alert>
          <AlertTitle>Dismissible</AlertTitle>
          <AlertAction>
            <Button type="button" size="sm" variant="outline">
              Retry
            </Button>
          </AlertAction>
          <AlertClose onClick={onDismiss} />
        </Alert>,
      );
      expect(getByRole("button", { name: "Retry" })).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Dismiss alert" }));
      expect(onDismiss).toHaveBeenCalled();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <Alert className="custom-alert">
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      expect(getByRole("alert")).toHaveClass("custom-alert");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on Alert", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Alert ref={ref}>
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders title and description", () => {
      const { getByText } = renderWithProviders(
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Details here.</AlertDescription>
        </Alert>,
      );
      expect(getByText("Heads up")).toBeInTheDocument();
      expect(getByText("Details here.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("does not trap focus", () => {
      const { getByRole } = renderWithProviders(
        <Alert>
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      expect(getByRole("alert")).not.toHaveAttribute("tabindex", "-1");
    });

    it("supports controlled dismiss via state", async () => {
      function DismissibleAlert() {
        const [open, setOpen] = useState(true);
        if (!open) {
          return null;
        }
        return (
          <Alert>
            <AlertTitle>Notice</AlertTitle>
            <AlertClose onClick={() => setOpen(false)} />
          </Alert>
        );
      }
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(<DismissibleAlert />);
      expect(getByRole("alert")).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Dismiss alert" }));
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Alert>
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>Something happened.</AlertDescription>
        </Alert>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders variant without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Alert variant="default">
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      rerender(
        <Alert variant="destructive">
          <AlertTitle>Title</AlertTitle>
        </Alert>,
      );
      expect(getByRole("alert")).toBeInTheDocument();
    });
  });
});
