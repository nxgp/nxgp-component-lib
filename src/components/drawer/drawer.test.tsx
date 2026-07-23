import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

describe("Drawer", () => {
  describe("rendering", () => {
    it("renders trigger", () => {
      const { getByRole } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      expect(getByRole("button", { name: "Open" })).toBeInTheDocument();
    });

    it("applies size preset classes", async () => {
      const user = userEvent.setup();
      const { getByRole, getByTestId } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent size="lg" data-testid="drawer-content">
            <DrawerTitle>Sized drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      expect(getByTestId("drawer-content")).toHaveClass(
        "data-[vaul-drawer-direction=bottom]:max-h-sheet-lg",
      );
    });

    it("renders a resize handle when resizable", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent resizable>
            <DrawerTitle>Resizable drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      expect(getByRole("button", { name: "Resize drawer" })).toBeInTheDocument();
    });

    it("renders a close button when showCloseButton is true", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent showCloseButton>
            <DrawerTitle>Closable drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      expect(getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("opens drawer content on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole, findByText } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      expect(await findByText("Drawer title")).toBeInTheDocument();
      expect(await findByText("Drawer description")).toBeInTheDocument();
    });

    it("closes drawer via DrawerClose", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole, findByText } = renderWithProviders(
        <Drawer onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Closable</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="outline">Close drawer</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      expect(await findByText("Closable")).toBeInTheDocument();
      expect(onOpenChange).toHaveBeenCalledWith(true);
      await user.click(getByRole("button", { name: "Close drawer" }));
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onClose when the built-in close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onOpenChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Drawer onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent showCloseButton onClose={onClose}>
            <DrawerTitle>Closable</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      await user.click(getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("accessibility", () => {
    it("has no axe violations when open", async () => {
      const user = userEvent.setup();
      const { getByRole, container } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Accessible drawer</DrawerTitle>
            <DrawerDescription>Description for screen readers.</DrawerDescription>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(getByRole("button", { name: "Open drawer" }));
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>First</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      rerender(
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Second</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      expect(getByRole("button", { name: "Open" })).toBeInTheDocument();
    });
  });
});
