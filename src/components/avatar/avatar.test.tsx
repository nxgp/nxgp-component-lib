import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from "./avatar";

describe("Avatar", () => {
  describe("rendering", () => {
    it("renders fallback initials", () => {
      const { getByText } = renderWithProviders(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("JD")).toBeInTheDocument();
    });

    it.each(["sm", "default", "lg"] as const)("renders %s size", (size) => {
      const { getByText } = renderWithProviders(
        <Avatar size={size}>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("AB")).toBeInTheDocument();
    });

    it("merges custom className on root", () => {
      const { getByText } = renderWithProviders(
        <Avatar className="custom-avatar">
          <AvatarFallback>XY</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("XY").parentElement).toHaveClass("custom-avatar");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on Avatar", () => {
      const ref = createRef<HTMLSpanElement>();
      renderWithProviders(
        <Avatar ref={ref}>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("shows fallback while image is loading in jsdom", () => {
      const { getByText } = renderWithProviders(
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User avatar" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("FB")).toBeInTheDocument();
    });

    it.each(["online", "offline", "busy", "away"] as const)("renders %s status ring", (status) => {
      const { container } = renderWithProviders(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
          <AvatarStatus status={status} label={status} />
        </Avatar>,
      );
      expect(container.querySelector(`[data-status="${status}"]`)).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("renders fallback text for screen readers", () => {
      const { getByText } = renderWithProviders(
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("FB")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations with fallback", async () => {
      const { container } = renderWithProviders(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders size without throwing", () => {
      const { rerender, getByText } = renderWithProviders(
        <Avatar size="sm">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );
      rerender(
        <Avatar size="lg">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>,
      );
      expect(getByText("AB")).toBeInTheDocument();
    });
  });
});
