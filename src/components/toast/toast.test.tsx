import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import { toast } from "./index";
import { Toaster } from "./toaster";

function getToasterRegion() {
  return document.body.querySelector('section[aria-label^="Notifications"]');
}

describe("Toast", () => {
  afterEach(() => {
    toast.dismiss();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders Toaster host", async () => {
      renderWithProviders(<Toaster />);
      await waitFor(() => {
        expect(getToasterRegion()).toBeInTheDocument();
      });
    });

    it("uses polite live region for notifications", async () => {
      renderWithProviders(<Toaster />);
      await waitFor(() => {
        const region = getToasterRegion();
        expect(region).toHaveAttribute("aria-live", "polite");
      });
    });

    it("renders default toast message", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <>
          <Toaster />
          <Button onClick={() => toast("Saved successfully")}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(getByText("Saved successfully")).toBeInTheDocument();
    });

    it.each([
      "success",
      "error",
      "warning",
      "info",
    ] as const)("renders %s variant toast", async (variant) => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <>
          <Toaster />
          <Button onClick={() => toast[variant](`${variant} message`)}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(getByText(`${variant} message`)).toBeInTheDocument();
      expect(document.querySelector(`[data-type="${variant}"]`)).toHaveAttribute(
        "data-rich-colors",
        "true",
      );
    });

    it("renders close button when enabled on Toaster", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <>
          <Toaster closeButton />
          <Button onClick={() => toast("Closable")}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(getByRole("button", { name: "Close toast" })).toBeInTheDocument();
    });

    it("hides close button when closeButton is false", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(
        <>
          <Toaster closeButton={false} />
          <Button onClick={() => toast("No close")}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(queryByRole("button", { name: "Close toast" })).not.toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("renders toast with description", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <>
          <Toaster />
          <Button onClick={() => toast("Title", { description: "Details here" })}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(getByText("Title")).toBeInTheDocument();
      expect(getByText("Details here")).toBeInTheDocument();
    });

    it("accepts Toaster position prop", async () => {
      renderWithProviders(<Toaster position="top-left" />);
      await waitFor(() => {
        expect(getToasterRegion()).toBeInTheDocument();
      });
    });

    it("renders without ThemeProvider", async () => {
      render(<Toaster />);
      await waitFor(() => {
        expect(getToasterRegion()).toBeInTheDocument();
      });
    });
  });

  describe("interactions", () => {
    it("dismisses toast via close control", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText, queryByText } = renderWithProviders(
        <>
          <Toaster closeButton />
          <Button onClick={() => toast("Dismiss me")}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      expect(getByText("Dismiss me")).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Close toast" }));
      await waitFor(() => {
        expect(queryByText("Dismiss me")).not.toBeInTheDocument();
      });
    });

    it("runs action handler when action is clicked", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const { getByRole } = renderWithProviders(
        <>
          <Toaster />
          <Button
            onClick={() =>
              toast("Updated", {
                action: { label: "Undo", onClick: onAction },
              })
            }
          >
            Show
          </Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      await user.click(getByRole("button", { name: "Undo" }));
      expect(onAction).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations when a toast is visible", async () => {
      const user = userEvent.setup();
      const { container, getByRole } = renderWithProviders(
        <>
          <Toaster />
          <Button onClick={() => toast("Accessible toast")}>Show</Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Show" }));
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders Toaster without throwing", async () => {
      const { rerender } = renderWithProviders(<Toaster />);
      rerender(<Toaster position="bottom-right" />);
      await waitFor(() => {
        expect(getToasterRegion()).toBeInTheDocument();
      });
    });

    it("resolves toast.promise success state", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { getByRole, findByText } = renderWithProviders(
        <>
          <Toaster />
          <Button
            onClick={() =>
              toast.promise(
                () => new Promise<string>((resolve) => setTimeout(() => resolve("Done"), 500)),
                {
                  loading: "Loading",
                  success: (value) => value,
                  error: "Failed",
                },
              )
            }
          >
            Run
          </Button>
        </>,
      );
      await user.click(getByRole("button", { name: "Run" }));
      expect(await findByText("Loading")).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(600);
      expect(await findByText("Done")).toBeInTheDocument();
    });
  });
});
