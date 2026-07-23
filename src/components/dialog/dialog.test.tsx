import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function OpenDialog() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  describe("rendering", () => {
    it("renders open dialog content in portal", () => {
      const { getByRole } = renderWithProviders(<OpenDialog />);
      expect(getByRole("dialog", { name: "Dialog title" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("omits close button when showCloseButton is false", () => {
      const { queryByRole, getByRole } = renderWithProviders(
        <Dialog defaultOpen>
          <DialogContent showCloseButton={false}>
            <DialogTitle>No close</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(getByRole("dialog", { name: "No close" })).toBeInTheDocument();
      expect(queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("renders without portal when portalled is false", () => {
      const { getByRole } = renderWithProviders(
        <Dialog defaultOpen>
          <DialogContent portalled={false}>
            <DialogTitle>Inline</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(getByRole("dialog", { name: "Inline" })).toBeInTheDocument();
    });

    it("merges custom className on DialogContent", () => {
      const { getByRole } = renderWithProviders(
        <Dialog defaultOpen>
          <DialogContent className="custom-dialog">
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(getByRole("dialog")).toHaveClass("custom-dialog");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on DialogTitle and DialogDescription", () => {
      const titleRef = createRef<HTMLHeadingElement>();
      const descRef = createRef<HTMLParagraphElement>();

      renderWithProviders(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle ref={titleRef}>Title</DialogTitle>
            <DialogDescription ref={descRef}>Description</DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe("interactions", () => {
    it("renders trigger when closed", () => {
      const { getByRole } = renderWithProviders(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(getByRole("button", { name: "Open" })).toBeInTheDocument();
    });

    it("closes when close button is clicked", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(<OpenDialog />);
      await user.click(getByRole("button", { name: "Close" }));
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes when Escape is pressed", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(<OpenDialog />);
      expect(getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { baseElement } = renderWithProviders(<OpenDialog />);
      await expectNoA11yViolations(baseElement);
    });
  });

  describe("reliability", () => {
    it("re-renders title without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>First</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      rerender(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Second</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(getByRole("dialog", { name: "Second" })).toBeInTheDocument();
    });
  });
});
