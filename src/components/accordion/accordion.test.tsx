import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

describe("Accordion", () => {
  describe("rendering", () => {
    it("renders accordion items", () => {
      const { getByRole } = renderWithProviders(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Section one</AccordionTrigger>
            <AccordionContent>Content one</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(getByRole("button", { name: "Section one" })).toBeInTheDocument();
    });

    it("merges custom className on item and content", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger className="custom-trigger">Trigger</AccordionTrigger>
            <AccordionContent className="custom-content">Body</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(getByRole("button", { name: "Trigger" })).toHaveClass("custom-trigger");
      expect(getByText("Body")).toHaveClass("custom-content");
    });

    it("hides chevron when showIcon is false", () => {
      const { getByRole, container } = renderWithProviders(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger showIcon={false}>No icon</AccordionTrigger>
            <AccordionContent>Body</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(getByRole("button", { name: "No icon" })).toBeInTheDocument();
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on item, trigger, and content", () => {
      const itemRef = createRef<HTMLDivElement>();
      const triggerRef = createRef<HTMLButtonElement>();
      const contentRef = createRef<HTMLDivElement>();

      renderWithProviders(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem ref={itemRef} value="item-1">
            <AccordionTrigger ref={triggerRef}>Trigger</AccordionTrigger>
            <AccordionContent ref={contentRef}>Body</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("interactions", () => {
    it("expands content on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Toggle</AccordionTrigger>
            <AccordionContent>Hidden panel</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      await user.click(getByRole("button", { name: "Toggle" }));
      expect(getByText("Hidden panel")).toBeVisible();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>FAQ</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders items without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>A</AccordionTrigger>
            <AccordionContent>A content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      rerender(
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>A</AccordionTrigger>
            <AccordionContent>A content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>B</AccordionTrigger>
            <AccordionContent>B content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(getByRole("button", { name: "B" })).toBeInTheDocument();
    });
  });
});
