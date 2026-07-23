import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

function OpenAlertDialog() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  describe("rendering", () => {
    it("renders open alert dialog in portal", () => {
      const { getByRole } = renderWithProviders(<OpenAlertDialog />);
      expect(getByRole("alertdialog", { name: "Are you sure?" })).toBeInTheDocument();
    });

    it("merges custom className on content and actions", () => {
      const { getByRole } = renderWithProviders(
        <AlertDialog defaultOpen>
          <AlertDialogContent className="custom-alert">
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel className="custom-cancel">Cancel</AlertDialogCancel>
              <AlertDialogAction className="custom-action">OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(getByRole("alertdialog")).toHaveClass("custom-alert");
      expect(getByRole("button", { name: "Cancel" })).toHaveClass("custom-cancel");
      expect(getByRole("button", { name: "OK" })).toHaveClass("custom-action");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on title, description, and actions", () => {
      const titleRef = createRef<HTMLHeadingElement>();
      const descRef = createRef<HTMLParagraphElement>();
      const actionRef = createRef<HTMLButtonElement>();
      const cancelRef = createRef<HTMLButtonElement>();

      renderWithProviders(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle ref={titleRef}>Title</AlertDialogTitle>
            <AlertDialogDescription ref={descRef}>Desc</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
              <AlertDialogAction ref={actionRef}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );

      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
      expect(actionRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(cancelRef.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("interactions", () => {
    it("renders trigger when closed", () => {
      const { getByRole } = renderWithProviders(
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("closes when cancel is clicked", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(<OpenAlertDialog />);
      await user.click(getByRole("button", { name: "Cancel" }));
      expect(queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { baseElement } = renderWithProviders(<OpenAlertDialog />);
      await expectNoA11yViolations(baseElement);
    });
  });

  describe("reliability", () => {
    it("re-renders description without throwing", () => {
      const { rerender, getByText } = renderWithProviders(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>First</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>,
      );
      rerender(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Second</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});
